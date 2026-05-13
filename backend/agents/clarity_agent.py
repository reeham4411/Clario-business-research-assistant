from langchain_core.messages import AIMessage
from graph.state import ResearchState
from utils.llm import get_llm
from utils.memory import format_conversation_history

llm = get_llm(temperature=0.0)

CLARITY_PROMPT = """You are a Clarity Agent for a business research assistant.

Your job is to analyze the user's query and conversation history to determine:
1. Whether the query is specific enough to research (is a company name or clear subject present?)
2. Extract the company name if mentioned
3. If the query is a follow-up (e.g., "What about their CEO?" or "Tell me more"), resolve it using conversation history.

Conversation History:
{history}

Current User Query: {query}

Respond in this EXACT format (no extra text):
CLARITY_STATUS: <clear|needs_clarification>
COMPANY_NAME: <company name or UNKNOWN>
CLARIFICATION_QUESTION: <question to ask user, or NONE>
REASONING: <brief explanation>
"""


def clarity_agent(state: ResearchState) -> ResearchState:
    """Evaluate query clarity and extract company name."""
    history = format_conversation_history(state.get("messages", []))
    query = state["current_query"]
    
    prompt = CLARITY_PROMPT.format(history=history, query=query)
    response = llm.invoke(prompt)
    content = response.content.strip()
    
    # Parse structured response
    lines = {
        line.split(":", 1)[0].strip(): line.split(":", 1)[1].strip()
        for line in content.split("\n")
        if ":" in line
    }
    
    clarity_status = lines.get("CLARITY_STATUS", "needs_clarification").lower()
    company_name = lines.get("COMPANY_NAME", "UNKNOWN")
    clarification_question = lines.get("CLARIFICATION_QUESTION", "Could you please specify the company name?")
    
    if company_name == "UNKNOWN":
        clarity_status = "needs_clarification"
    
    if clarification_question == "NONE":
        clarification_question = None

    return {
        **state,
        "clarity_status": clarity_status,
        "company_name": company_name if company_name != "UNKNOWN" else state.get("company_name"),
        "clarification_question": clarification_question,
    }