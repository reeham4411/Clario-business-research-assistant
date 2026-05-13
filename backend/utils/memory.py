from typing import List
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage


def format_conversation_history(messages: List[BaseMessage]) -> str:
    """Format conversation history into a readable string for prompts."""
    if not messages:
        return "No prior conversation."
    
    formatted = []
    for msg in messages:
        if isinstance(msg, HumanMessage):
            formatted.append(f"User: {msg.content}")
        elif isinstance(msg, AIMessage):
            formatted.append(f"Assistant: {msg.content}")
        else:
            formatted.append(f"System: {msg.content}")
    
    return "\n".join(formatted)


def extract_company_from_history(messages: List[BaseMessage]) -> str:
    """Try to extract the last mentioned company name from history."""
    for msg in reversed(messages):
        if isinstance(msg, HumanMessage):
            return msg.content
    return ""