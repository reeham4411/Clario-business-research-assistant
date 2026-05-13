from graph.state import ResearchState
from utils.llm import get_llm
from utils.memory import format_conversation_history

llm = get_llm(temperature=0.0)

VALIDATOR_PROMPT = """You are a Validator Agent for a business research assistant.

Your job is to assess the quality, completeness, and reliability of research findings.

User Query: {query}
Company: {company}
Confidence Score from Research Agent: {confidence}/10

Research Summary:
{summary}

Conversation History:
{history}

Evaluate the research on these criteria:
1. Does it directly address the user's query?
2. Is the information recent and relevant?
3. Are there major gaps or missing key facts?
4. Is the confidence score justified?

Respond in this EXACT format:
VALIDATION_RESULT: <sufficient|insufficient>
QUALITY_SCORE: <number 0-10>
FEEDBACK: <specific feedback on what's missing or needs improvement, or "None" if sufficient>
REASONING: <brief explanation of your assessment>
"""


def validator_agent(state: ResearchState) -> ResearchState:
    """Assess research quality and decide if it's sufficient."""
    query = state["current_query"]
    company = state.get("company_name", "the company")
    confidence = state.get("confidence_score", 0)
    findings = state.get("research_findings", {})
    summary = findings.get("summary", "No research findings available.")
    history = format_conversation_history(state.get("messages", []))
    
    prompt = VALIDATOR_PROMPT.format(
        query=query,
        company=company,
        confidence=confidence,
        summary=summary,
        history=history,
    )
    
    response = llm.invoke(prompt)
    content = response.content.strip()
    
    lines = {
        line.split(":", 1)[0].strip(): line.split(":", 1)[1].strip()
        for line in content.split("\n")
        if ":" in line
    }
    
    validation_result = lines.get("VALIDATION_RESULT", "insufficient").lower()
    feedback = lines.get("FEEDBACK", "")
    if feedback.lower() == "none":
        feedback = ""
    
    return {
        **state,
        "validation_result": validation_result,
        "validation_feedback": feedback,
    }