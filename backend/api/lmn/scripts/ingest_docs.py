import os
import time
import glob
import json
from pathlib import Path
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv()

INDEX_NAME = os.environ.get("PINECONE_INDEX_NAME", "lmn-generator-py")
NAMESPACE = os.environ.get("PINECONE_NAMESPACE", "lmn-namespace")
PC_API_KEY = os.environ["PINECONE_API_KEY"]
EMBED_MODEL= os.environ.get("PINECONE_EMBED_MODEL", "llama-text-embed-v2")
CLOUD = os.environ.get("PINECONE_CLOUD", "aws")
REGION = os.environ.get("PINECONE_REGION", "us-east-1")

pc = Pinecone(api_key=PC_API_KEY)

existing = [i["name"] for i in pc.list_indexes()]
if INDEX_NAME not in existing:
    print(f"Creating index '{INDEX_NAME}' with server-side embeddings: {EMBED_MODEL}")
    pc.create_index_for_model(
        name=INDEX_NAME,
        cloud=CLOUD,
        region=REGION,
        embed={
            "model": EMBED_MODEL,
            # Tell Pinecone which field contains the raw text to embed
            "field_map": {"text": "chunk_text"}
        }
    )
    # wait until ready
    while not pc.has_index(INDEX_NAME):
        time.sleep(1)

index = pc.Index(INDEX_NAME)

# Process ICD10 codes JSON file
DOCS_DIR = Path(__file__).parent.parent / "support_docs"
icd10_json_path = DOCS_DIR / "icd10-codes.json"

records = []

# Process ICD10 codes from JSON
if icd10_json_path.exists():
    print(f"Processing ICD10 codes from {icd10_json_path}")
    with open(icd10_json_path, "r", encoding="utf-8") as f:
        icd10_data = json.load(f)
    
    # Process each category of codes in the JSON
    for category_name, codes_list in icd10_data.items():
        if isinstance(codes_list, list):
            for code_entry in codes_list:
                if isinstance(code_entry, dict) and "code" in code_entry and "description" in code_entry:
                    records.append({
                        "_id": code_entry["code"],  # Use ICD code as the key ID
                        "chunk_text": code_entry["description"],  # Use description as metadata text
                        "condition": code_entry["condition"],
                    })

# Process other text/markdown files
paths = sorted(list(glob.glob(str(DOCS_DIR / "**" / "*.txt"), recursive=True)) +
               list(glob.glob(str(DOCS_DIR / "**" / "*.md"),  recursive=True)))

splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,     # tweak: ~500-1200 chars is common
    chunk_overlap=120,  # small overlap preserves continuity
    separators=["\n\n", "\n", " ", ""]
)

for p in paths:
    with open(p, "r", encoding="utf-8") as f:
        raw = f.read().strip()
    if not raw:
        continue

    chunks = splitter.split_text(raw)

    for i, chunk in enumerate(chunks):
        records.append({
            "_id": f"{Path(source).stem}-{i:04d}",
            "chunk_text": chunk,
            "condition": chunks[i].condition,
        })

print("records", records[:5])
print(f"Prepared {len(records)} records total.")
icd10_count = 0
if icd10_json_path.exists():
    icd10_count = len([r for r in records if r.get("category") == "icd10"])
    print(f"  - {icd10_count} ICD10 codes")
print(f"  - {len(records) - icd10_count} text chunks from {len(paths)} files.")

BATCH = 200
for i in range(0, len(records), BATCH):
    batch = records[i:i+BATCH]
    index.upsert_records(NAMESPACE, batch)
    print(f"coded {i + len(batch)}/{len(records)}")

print(f"Done. Namespace: {NAMESPACE}")

try:
    query = "What's the ICD code for anxiety?"
    res = index.search(
        namespace=NAMESPACE,
        query={
            "top_k": 5,
            "inputs": {"text": query}
        },
        # Uncomment to enable reranking (requires server support)
        rerank={"model": "bge-reranker-v2-m3", "top_n": 5, "rank_fields": ["chunk_text"]}
    )
    hits = (res.get("result", {}) or {}).get("hits", []) or []
    print("\nTop matches:")
    for h in hits:
        fields = h.get("fields", {}) or {}
        print(f"- {fields.get('source','?')} | {fields.get('category','?')}: {fields.get('chunk_text','')[:120]}...")
except Exception as e:
    print("Sanity search skipped:", e)