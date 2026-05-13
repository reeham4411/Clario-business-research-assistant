from langchain_core.messages import AIMessage
from graph.state import ResearchState
from utils.llm import get_llm

llm = get_llm(temperature=0.3)


SYNTHESIS_PROMPT = """You are a Synthesis Agent for a business research assistant.

Generate a concise, structured, and insightful final response.

User Query: {query}
Company: {company}
Confidence Score: {confidence}/10

Research Summary:
{summary}

Instructions:
- Keep the response under 250 words
- Directly answer the user's query
- Use short markdown headers where useful
- Be concise and business-focused
- If information is limited, acknowledge it honestly
- End with 2 suggested follow-up questions

Return clean markdown only.
"""


def trim_text(text: str, max_chars: int = 2500) -> str:
    """Trim long text to avoid Groq token limit."""
    if not text:
        return ""
    
    text = text.strip()
    
    if len(text) > max_chars:
        return text[:max_chars] + "..."
    
    return text


def synthesis_agent(state: ResearchState) -> ResearchState:
    """Generate final structured response for the user."""

    query = state["current_query"]

    company = state.get("company_name", "the company")

    findings = state.get("research_findings", {})

    summary = findings.get(
        "summary",
        "No detailed research available."
    )

    # IMPORTANT:
    # Prevent huge prompts
    summary = trim_text(summary, 2500)

    confidence = state.get("confidence_score", 0)

    prompt = SYNTHESIS_PROMPT.format(
        query=query,
        company=company,
        confidence=confidence,
        summary=summary,
    )

    response = llm.invoke(prompt)

    final_response = response.content.strip()

    # IMPORTANT:
    # Store only SHORT assistant memory
    short_memory_response = trim_text(final_response, 600)

    updated_messages = state.get("messages", [])[-4:] + [
        AIMessage(content=short_memory_response)
    ]

    return {
        **state,
        "final_response": final_response,
        "messages": updated_messages,
    }