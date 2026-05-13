from graph.state import ResearchState
from utils.llm import get_llm
from utils.memory import format_conversation_history

llm = get_llm(temperature=0.0)

CLARITY_PROMPT = """You are a Clarity Agent for a business research assistant.

Your job:
1. Decide if the query is clear enough for business/company research.
2. Extract the company name if directly mentioned.
3. If the query is a follow-up using words like "their", "its", "they", "the company", "CEO", "competitors", or "financials", use the existing company context.

Existing company context: {existing_company}

Conversation History:
{history}

Current User Query: {query}

Rules:
- If Current User Query mentions a company name, use that company.
- If Current User Query is a follow-up and Existing company context is available, mark it as clear.
- Do NOT ask for clarification for follow-up questions if Existing company context is available.
- Only ask for clarification if no company is mentioned and no existing company context is available.

Respond in this EXACT format:
CLARITY_STATUS: <clear|needs_clarification>
COMPANY_NAME: <company name or UNKNOWN>
CLARIFICATION_QUESTION: <question to ask user, or NONE>
REASONING: <brief explanation>
"""


def clarity_agent(state: ResearchState) -> ResearchState:
    history = format_conversation_history(state.get("messages", []))
    query = state["current_query"]
    existing_company = state.get("company_name")

    prompt = CLARITY_PROMPT.format(
        history=history,
        query=query,
        existing_company=existing_company or "NONE",
    )

    response = llm.invoke(prompt)
    content = response.content.strip()

    lines = {
        line.split(":", 1)[0].strip(): line.split(":", 1)[1].strip()
        for line in content.split("\n")
        if ":" in line
    }

    clarity_status = lines.get("CLARITY_STATUS", "needs_clarification").lower()
    extracted_company = lines.get("COMPANY_NAME", "UNKNOWN")
    clarification_question = lines.get(
        "CLARIFICATION_QUESTION",
        "Could you please specify the company name?"
    )

    #  use existing company for follow-up questions
    if extracted_company == "UNKNOWN" and existing_company:
        company_name = existing_company
        clarity_status = "clear"
        clarification_question = None
    elif extracted_company != "UNKNOWN":
        company_name = extracted_company
    else:
        company_name = None
        clarity_status = "needs_clarification"

    if clarification_question == "NONE":
        clarification_question = None

    return {
        **state,
        "clarity_status": clarity_status,
        "company_name": company_name,
        "clarification_question": clarification_question,
    }