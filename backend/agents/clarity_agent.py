from graph.state import ResearchState
from utils.llm import get_llm

llm = get_llm(temperature=0.0)

CLARITY_PROMPT = """You are a Clarity Agent for a business research assistant.

Existing company context: {existing_company}
Current User Query: {query}

Rules:
- If the query mentions a company, mark it clear and extract it.
- If the query is a follow-up using words like their, its, they, CEO, competitors, financials, and existing company context exists, mark it clear.
- Only ask for clarification if there is no company in the query and no existing company context.
- If the query is completely unrelated to business/company research, ask the user to provide a business-related company query.

Respond exactly:
CLARITY_STATUS: <clear|needs_clarification>
COMPANY_NAME: <company name or UNKNOWN>
CLARIFICATION_QUESTION: <question or NONE>
"""


def clarity_agent(state: ResearchState) -> ResearchState:
    query = state["current_query"]
    existing_company = state.get("company_name")

    prompt = CLARITY_PROMPT.format(
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
        "Which company are you asking about?"
    )

    if extracted_company != "UNKNOWN":
        company_name = extracted_company
        clarity_status = "clear"

    elif existing_company:
        company_name = existing_company
        clarity_status = "clear"
        clarification_question = None

    else:
        company_name = None
        clarity_status = "needs_clarification"

    if clarification_question == "NONE":
        clarification_question = None

    # Safety fix:
    # If the query is still unclear, never allow clarification_question to be None.
    if clarity_status == "needs_clarification" and not clarification_question:
        clarification_question = (
            "Please enter a valid business/company query, for example: "
            "Research Tesla or Tell me about Microsoft."
        )

    return {
        **state,
        "clarity_status": clarity_status,
        "company_name": company_name,
        "clarification_question": clarification_question,
    }