import os
from dotenv import load_dotenv
from pinecone import Pinecone

load_dotenv()

PC_API_KEY = os.environ["PINECONE_API_KEY"]
PC_INDEX_NAME = os.environ.get("PINECONE_INDEX_NAME", "lmn-generator-py")
PC_NAMESPACE = os.environ.get("PINECONE_NAMESPACE", "lmn-namespace")

pc = Pinecone(api_key=PC_API_KEY)
index = pc.Index(PC_INDEX_NAME)

def search_tool(query: str, top_k: int = 5) -> dict:
    """
    Search for medical conditions and ICD-10 codes in the knowledge base.
    
    Args:
        query (str): The medical condition or symptom to search for
        top_k (int): Maximum number of results to return (default: 5)
    
    Returns:
        dict: JSON object containing search results with ICD codes, conditions, descriptions, and relevance scores
    """
    results = index.search(
        namespace=PC_NAMESPACE,
        query={
            "top_k": top_k,
            "inputs": {"text": query}
        },
        rerank={
            "model": "bge-reranker-v2-m3",
            "top_n": top_k,
            "rank_fields": ["chunk_text"]
        }
    )
    hits = results.get("result", {}).get("hits", []) or []
    results_list = []
    for hit in hits:
        print(hit)
        fields = hit.get("fields", {}) or {}
        code_id = hit.get("_id", "unknown")
        condition = fields.get("condition", "unknown")
        txt = fields.get("chunk_text", "")
        score = hit.get("_score", 0.0)
        
        results_list.append({
            "icd_code": code_id,
            "condition": condition,
            "description": condition + " - " + txt,
            "relevance_score": score
        })
    
    return {
        "search_results": results_list,
        "total_found": len(results_list)
    }

print(search_tool("anxiety"))