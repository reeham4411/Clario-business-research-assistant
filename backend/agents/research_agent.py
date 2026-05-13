from graph.state import ResearchState
from utils.llm import get_llm
from tools.search_tools import tavily_search

llm = get_llm(temperature=0.1)

RESEARCH_SYNTHESIS_PROMPT = """You are a Research Agent specializing in business intelligence.

You gathered concise search snippets about {company}.
Synthesize the findings into structured research output.

User Query: {query}
Research Goal: {goal}

Research Findings by Aspect:
{aspect_findings}

Produce a concise but useful research summary under 300 words. Then assign a confidence score (0-10) based on:
- Source quality and recency
- Completeness of information
- Relevance to the user's query

Respond in this EXACT format:
CONFIDENCE_SCORE: <number 0-10>
RESEARCH_SUMMARY:
<Research summary organized by aspect>

SOURCE_QUALITY_NOTES:
<Brief notes on source reliability and recency>
"""


def trim_text(text: str, max_chars: int = 450) -> str:
    """Limit long Tavily result content before sending to LLM."""
    if not text:
        return ""
    text = text.replace("\n", " ").strip()
    return text[:max_chars] + "..." if len(text) > max_chars else text


def format_compact_search_results(results: list, max_items: int = 2) -> str:
    """Keep only small snippets from search results to avoid Groq token limit."""
    compact = []

    for idx, result in enumerate(results[:max_items], start=1):
        title = result.get("title", "No title")
        url = result.get("url", "")
        content = trim_text(result.get("content", ""), 450)

        compact.append(
            f"{idx}. Title: {title}\n"
            f"URL: {url}\n"
            f"Snippet: {content}"
        )

    return "\n\n".join(compact)


def research_agent(state: ResearchState) -> ResearchState:
    """
    Perform aspect-based research using Tavily,
    then synthesize findings and assign a confidence score.
    """
    company = state.get("company_name", "the company")
    query = state["current_query"]
    plan = state.get("research_plan", {})
    aspects = state.get("research_aspects", [])

    # Safety: limit aspects to avoid huge prompts
    aspects = aspects[:4]

    search_queries = plan.get("search_queries", {})
    validation_feedback = state.get("validation_feedback", "")
    attempts = state.get("research_attempts", 0) + 1

    aspect_findings = {}
    all_sources = []

    for aspect in aspects:
        base_query = search_queries.get(aspect, f"{company} {aspect}")

        if validation_feedback and attempts > 1:
            search_query = f"{base_query} {validation_feedback[:120]}"
        else:
            search_query = base_query

        # Important: reduce max_results
        results = tavily_search(search_query, max_results=2)

        all_sources.extend(results[:2])
        aspect_findings[aspect] = format_compact_search_results(results, max_items=2)

    combined_findings = "\n\n".join([
        f"### {aspect}:\n{findings}"
        for aspect, findings in aspect_findings.items()
    ])

    # Extra hard limit
    combined_findings = trim_text(combined_findings, 6000)

    prompt = RESEARCH_SYNTHESIS_PROMPT.format(
        company=company,
        query=query,
        goal=plan.get("research_goal", f"Research {company}"),
        aspect_findings=combined_findings,
    )

    response = llm.invoke(prompt)
    content = response.content.strip()

    confidence_score = 5.0
    research_summary = content

    lines = content.split("\n")
    for i, line in enumerate(lines):
        if line.startswith("CONFIDENCE_SCORE:"):
            try:
                confidence_score = float(line.split(":", 1)[1].strip())
            except Exception:
                confidence_score = 5.0

        elif line.startswith("RESEARCH_SUMMARY:"):
            summary_lines = []
            for j in range(i + 1, len(lines)):
                if lines[j].startswith("SOURCE_QUALITY_NOTES:"):
                    break
                summary_lines.append(lines[j])
            research_summary = "\n".join(summary_lines).strip()

    return {
        **state,
        "research_findings": {
            "summary": research_summary,
            "aspects": aspect_findings,
        },
        "raw_sources": all_sources,
        "confidence_score": confidence_score,
        "research_attempts": attempts,
    }