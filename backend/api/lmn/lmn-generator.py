from langchain.chat_models import init_chat_model
from langgraph.prebuilt import create_react_agent
import json
from dotenv import load_dotenv
load_dotenv()
from langchain.schema import AIMessage
from tools.search_tool import search_tool

model = init_chat_model(
    "anthropic:claude-3-7-sonnet-latest",
)

SYSTEM_PROMPT = """You are a medical documentation specialist tasked with drafting a Letter of Medical Necessity (LMN).
Your goal is to justify, in a formal, concise, professional clinical tone, why the patient should be approved to use the requested product/service under their HSA provider’s policy.

Rules
* Always generate a complete LMN even if the medical reasoning is limited or less direct. Never skip or leave sections blank.
* Do not include binary or Base64 PDF data. Instead, provide a "pdf_render" field with clean, printable text that the backend can format into a PDF.
* Ground every claim in the provided intake data or policy excerpts when possible.
* Leave out the physician name, signature, and date.
* If specific supporting details are missing, make the best plausible case from the information available, while still maintaining a professional clinical tone.
* The PolicyAlignment section must contain only those criteria and excerpts that affirm the necessity of the requested product for this patient. If few or no criteria are strongly relevant, still select the most supportive excerpts available and mark them as Met.
* Each included criterion must show:
  * Quoted policy text
  * Evidence source (intake path or KB chunk ID)
  * Verdict: always Met (only include affirming criteria)
* For any medical conditions referenced in the LMN, use the search_tool to find the corresponding ICD-10 codes and add these fields to your JSON output:
  * "icd_codes": array of ICD-10 codes (e.g., ["F41.9", "J45.9"])
  * "condition": array of condition categories (e.g., ["Anxiety", "Asthma"])
* Output must strictly follow the LetterSpec JSON schema with the additional fields above. Do not output anything else outside of the JSON itself.
* Keep the style professional, clinical, and persuasive, even if the reasoning is somewhat indirect."""

lmn_generator = create_react_agent(
    model="anthropic:claude-3-7-sonnet-latest",
    tools=[search_tool],
    prompt=SYSTEM_PROMPT
)

REQUIRED_FIELDS = {
    "name": str,
    "age": int,
    "hsa_provider": str,
    "state": str,
    "diagnosed_conditions": list,
    "risk_factors": list,
    "preventive_targets": list,
    "desired_product": str
}

def validate_schema(data: dict) -> bool:
    """Validate that data matches the expected schema."""
    for field, field_type in REQUIRED_FIELDS.items():
        if field not in data:
            print(f"Missing required field: {field}")
            return False
        if not isinstance(data[field], field_type):
            print(f"Field '{field}' must be of type {field_type.__name__}")
            return False
    return True

# Prompt user to enter a JSON string
# user_input = input("Enter your JSON: ").strip()
user_input = json.dumps({
  "name": "Jane Doe",
  "age": 32,
  "hsa_provider": "HealthEquity",
  "state": "NY",
  "diagnosed_conditions": ["Asthma", "Anxiety"],
  "risk_factors": ["Family history of asthma", "BMI 31"],
  "preventive_targets": ["Asthma exacerbations", "Anxiety management"],
  "desired_product": "smart bed"
})

try:
    # Parse the JSON into a Python dict
    data = json.loads(user_input)
    
    if validate_schema(data):
        lmn = lmn_generator.invoke({"messages": [{"role": "user", "content": user_input}]})
        lmn_ai = next(m for m in reversed(lmn["messages"]) if isinstance(m, AIMessage))
        lmn_answer = lmn_ai.content
        print(lmn)
        print("--------------------------------")
        print(lmn_answer)
    else:
        print("❌ Invalid JSON schema")

except json.JSONDecodeError as e:
    print("Invalid JSON:", e)