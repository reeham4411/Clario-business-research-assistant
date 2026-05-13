from langchain_core.messages import AIMessage
from graph.state import ResearchState
from utils.llm import get_llm
from utils.memory import format_conversation_history

llm = get_llm(temperature=0.3)

SYNTHESIS_PROMPT = """You are a Synthesis Agent for a business research assistant.

Your job is to produce a clear, structured, and insightful final response for the user.

User Query: {query}
Company: {company}
Research Attempts Made: {attempts}
Confidence Score: {confidence}/10
Validation Result: {validation}

Research Summary:
{summary}

Conversation History:
{history}

Instructions:
- Write a comprehensive, well-organized response directly addressing the user's query
- Use clear sections with headers where appropriate
- If data is limited, acknowledge it honestly
- Keep context from conversation history for follow-up questions
- End with 2-3 suggested follow-up questions the user might want to ask

Format your response in clean markdown.
"""


def synthesis_agent(state: ResearchState) -> ResearchState:
    """Generate final structured response for the user."""
    query = state["current_query"]
    company = state.get("company_name", "the company")
    findings = state.get("research_findings", {})
    summary = findings.get("summary", "No detailed research available.")
    confidence = state.get("confidence_score", 0)
    validation = state.get("validation_result", "unknown")
    attempts = state.get("research_attempts", 1)
    history = format_conversation_history(state.get("messages", []))
    
    prompt = SYNTHESIS_PROMPT.format(
        query=query,
        company=company,
        attempts=attempts,
        confidence=confidence,
        validation=validation,
        summary=summary,
        history=history,
    )
    
    response = llm.invoke(prompt)
    final_response = response.content.strip()
    
    # Append final response to message history
    updated_messages = state.get("messages", []) + [AIMessage(content=final_response)]
    
    return {
        **state,
        "final_response": final_response,
        "messages": updated_messages,
    }