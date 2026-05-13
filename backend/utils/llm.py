import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

def get_llm(temperature: float = 0.0, model: str = "llama-3.3-70b-versatile") -> ChatGroq:
    """Initialize and return a Groq LLM instance."""
    return ChatGroq(
        api_key=os.getenv("GROQ_API_KEY"),
        model=model,
        temperature=temperature,
    )