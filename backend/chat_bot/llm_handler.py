import json,os,threading,dotenv,faiss,numpy as np,requests 
from datetime import datetime
from sentence_transformers import SentenceTransformer
from sloka_explorer.routes import get_sloka
from utils.logging_utils import get_chat_bot_logger

dotenv.load_dotenv()

logger = get_chat_bot_logger()


class EmbeddingResources:
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
            
        with self._lock:
            if not self._initialized:
                # old model "BAAI/bge-base-en-v1.5"
                self.model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
                self.index = faiss.read_index("data/embeddings/FAISS_index/rigveda_all_slokas.index")
                with open("data/embeddings/FAISS_index/slokas_mapping.json", "r", encoding="utf-8") as f:
                    self.slokas_list = json.load(f)
                self._initialized = True
                # print("✅ Embedding resources loaded successfully!") 
API_KEY = os.getenv("gem_api_key")
MODEL_NAME = "gemini-2.5-flash"  # or "gemini-2.5-pro"
url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={API_KEY}"
headers = {
    "Content-Type": "application/json",
    "x-goog-api-key": API_KEY
}

_resources = EmbeddingResources()



def get_answer(user_query: str):
    start_time = datetime.now()
    slokas_with_meaning = []
    
    intents = extract_intents_gemini(user_query)
    
    if "error" in intents:
        processing_time = (datetime.now() - start_time).total_seconds() * 1000
        logger.log_chat_bot_interaction(user_query, "", [], None, success=False, processing_time=processing_time)
        return {"Message": "Error in intent extraction", "error": intents["error"]}

    intents_list = intents.get("intents", [])
    # print("Extracted intents:", intents_list)

    for intent_obj in intents_list:
        if intent_obj["intent"] == "other_question":
            processing_time = (datetime.now() - start_time).total_seconds() * 1000
            logger.log_chat_bot_interaction(user_query, f"Intent: {intents_list}", intents_list, None, success=False, processing_time=processing_time)
            return {"Message": "Sorry, I can only answer questions related to the Rig Veda.","error": "unrelated question"}


    for intent_obj in intents_list:
        if intent_obj["intent"] == "fetch_by_location":

            mandala = intent_obj.get("mandala")
            hymn = intent_obj.get("hymn")
            sloka = intent_obj.get("sloka")

            meaning  = sloka_search(mandala, hymn, sloka)
            if "error" in meaning:
                processing_time = (datetime.now() - start_time).total_seconds() * 1000
                # print(f"Error fetching sloka {mandala}.{hymn}.{sloka}: {meaning['error']}")
                return {"Message": "Error fetching sloka", "error": meaning["error"]}
            
            slokas_with_meaning.extend(meaning)
            # print("Slokas fetched by location")


    # Step 4: Semantic search
    for intent_obj in intents_list:
        if intent_obj["intent"] == "semantic_search":
            keywords = intent_obj.get("keywords")
            
            meaning= semantic_search_slokas(keywords)
            slokas_with_meaning.extend(meaning)
            # print("Slokas fetched by semantic search")

    # print("All fetched slokas with meaning:", slokas_with_meaning)

    # Step 5: Prepare final context for LLM
    final_context = f"Intent Information: {str(intents_list)} \n"
    final_context += "\n".join([f"{s['sanskrit']} - {s['meaning']}" 
                               for s in slokas_with_meaning])
    
    # print("Slokas with meaning:", slokas_with_meaning)
    # print("Final context for LLM:", final_context)

    # Optional: include user question at the end
    user_questions = [i.get("question") for i in intents_list if i["intent"] == "asking_question"]
    if user_questions:
        final_context += "\n\nUser question: " + " ".join(user_questions)

    # Step 6: Generate final answer from LLM
    final_answer = generate_llm_answer(final_context, user_query)

    processing_time = (datetime.now() - start_time).total_seconds() * 1000

    if "error" in final_answer:
        logger.log_chat_bot_interaction(user_query, final_context, intents_list, final_answer, success=False, processing_time=processing_time)
        return {"Message": "Error in generating answer", "error": final_answer["error"]}

    logger.log_chat_bot_interaction(user_query, final_context, intents_list, final_answer, success=True, processing_time=processing_time)

    return {
        "Message": "Success",
        "intents": intents_list,
        "slokas": slokas_with_meaning,
        "answer": final_answer,
    }


def extract_intents_gemini(user_query: str):
    # print("Intent extraction started")

    if not user_query:
        return {"error": "Empty query"}

    with open("chat_bot/extracting_intents.txt", "r", encoding="utf-8") as f:
        PROMPT = f.read()
        
    if not API_KEY or not PROMPT:
        # print("Gemini API key or prompt not set.")
        return {"error": "Gemini API key or prompt not set."}
    
    

    prompt_text =f"{PROMPT} {user_query}"


    payload = {
        "contents": [
            {
                "parts": [{"text": prompt_text}]
            }
        ]
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        generated_text = data["candidates"][0]["content"]["parts"][0]["text"]

        if generated_text.startswith("```"):
            generated_text = generated_text.strip("`")
        if generated_text.lower().startswith("json"):
            generated_text = generated_text[4:].strip()
            
        # print("Intent extraction completed")
        res=json.loads(generated_text)

        return res

    except Exception as e:
        # print("Gemini intent extraction failed:", e)
        return {"error": "Error in intent extraction", "error": str(e)}


def is_valid_number(mandala: int, hymn: int, sloka: int):
    # print("Validating mandala, hymn, sloka:", mandala, hymn, sloka)
    with open("data/rig_veda_index.json", "r", encoding="utf-8") as f:
        data = json.load(f)
 
    mandala_data = next((m for m in data['mandalas'] if m["mandala_number"] == mandala), None)
    if not mandala_data:
        return False  

    hymn_data = next((h for h in mandala_data['hymns'] if h["hymn_number"] == hymn), None)
    if not hymn_data:
        return False  

    if not (1 <= sloka <= hymn_data.get('total_slokas', 0)):
        return False
    return True
 

def sloka_search(mandala: int, hymn: int, sloka: int):
    slokas_with_meaning = []

    if not is_valid_number(mandala, hymn, sloka):
        return {"error": f"Invalid mandala, hymn, or sloka number: {mandala}, {hymn}, {sloka}"}

    sloka_entry = get_sloka(mandala, hymn, sloka)
    sloka_entry = sloka_entry.get_json() if sloka_entry else None

    if sloka_entry:
        slokas_with_meaning.append({
            "location": sloka_entry.get("location"),
            "sanskrit": sloka_entry.get("sanskrit"),
            "meaning": sloka_entry.get("translation")
        })

    return slokas_with_meaning

    
def semantic_search_slokas(search_string: str):
    all_meaning = []
    # print("Performing semantic search for:", search_string)
    
    # Get thread-safe resources
    resources = EmbeddingResources()

    def get_top_slokas(query_text, k):
        query_embedding = resources.model.encode([query_text])[0].astype("float32")
        
        distances, indices = resources.index.search(np.array([query_embedding]), k)
        
        results = []
        for idx in indices[0]:
            sloka = resources.slokas_list[idx]
            results.append({
                "mandala": sloka["mandala"],
                "hymn_number": sloka["hymn_number"],
                "sloka_number": sloka["sloka_number"],
                "text": sloka["text"],
            })
        return results

    query = search_string
    top_slokas = get_top_slokas(query, k=2)
    for sloka in top_slokas:
        mandala = sloka["mandala"]
        hymn = sloka["hymn_number"]
        sloka_num = sloka["sloka_number"]
        sloka_meaning = sloka_search(mandala, hymn, sloka_num)
        
        if "error" in sloka_meaning:
            # print(f"Error fetching meaning for Mandala {mandala}, Hymn {hymn}, Sloka {sloka_num}: {sloka_meaning['error']}")
            continue

        all_meaning.extend(sloka_meaning)
    # print("All slokas are fetched")

    return all_meaning

   
def generate_llm_answer(context: str, user_query: str):
    res=""

    if not API_KEY or not context:
        # print("Gemini API key or context not set.")
        return "Sorry, I cannot provide an answer at this time."
    
    with open("chat_bot/summarization_prompt.txt", "r", encoding="utf-8") as f:
        PROMPT = f.read()
        
    # print("method started for final answer generation")
    prompt_text =f"{PROMPT}  User question: {user_query} Context: {context} "
    # print("Prompt text for final answer:", prompt_text)
    payload = {
        "contents": [
            {
                "parts": [{"text": prompt_text}]
            }
        ]
    }
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        # print("Gemini response data:", data)
        generated_text = data["candidates"][0]["content"]["parts"][0]["text"]
        if generated_text.startswith("```"):
            generated_text = generated_text.strip("`")
        if generated_text.lower().startswith("json"):
            generated_text = generated_text[4:].strip()
        res=generated_text
        # print("Generated final answer")
        return json.loads(res)

    except Exception as e:
        # print("Gemini final answer generation failed:", e)
        return {"error": "Error in generating answer", "error": str(e)}
    
