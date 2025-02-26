import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from langchain_groq import ChatGroq

GROQ_API = "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"
groq_api_key = GROQ_API

# Initialize FastAPI and LLM
app = FastAPI()

# Update allowed origins to a different port (e.g., 4000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatGroq(model="llama3-8b-8192", groq_api_key=groq_api_key)

medical_knowledge = {
    "headache": "For headaches, you can try rest and over-the-counter pain relievers like ibuprofen.",
    "fever": "For fever, stay hydrated and consider acetaminophen. Consult a doctor if it persists.",
    "cough": "Honey and warm fluids can help with cough. See a doctor if it lasts more than a week.",
    "depression": "Please consult a mental health professional for proper evaluation and support."
}

def get_basic_response(query: str) -> str:
    """Check simple medical knowledge base first"""
    query_lower = query.lower()
    for key in medical_knowledge:
        if key in query_lower:
            return medical_knowledge[key]
    return None

def chatbot_response(query: str) -> str:
    """Generate response for user query"""
    basic_response = get_basic_response(query)
    if basic_response:
        return basic_response
    
    try:
        response = llm.invoke(
            f"""As a medical assistant, respond to this query:
            {query}
            Keep response brief (2-3 sentences). Be professional but compassionate.
            If uncertain, recommend consulting a healthcare professional."""
        )
        return response.content
    except Exception as e:
        return f"Error processing request: {str(e)}"

# FastAPI endpoint remains the same
@app.get("/chat/")
async def chat(query: str):
    response = chatbot_response(query)
    print(f"User query: {query}\nChatbot response: {response}")
    return {"response": response}

# Run the server on port 5000 instead of the default 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=5000, log_level="info")