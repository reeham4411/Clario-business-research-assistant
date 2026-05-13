from graph.state import ResearchState
from utils.llm import get_llm
from utils.memory import format_conversation_history
from tools.search_tools import tavily_search, format_search_results

llm = get_llm(temperature=0.1)

RESEARCH_SYNTHESIS_PROMPT = """You are a Research Agent specializing in business intelligence.

You have gathered search results for multiple research aspects about {company}.
Synthesize the findings into structured research output.

User Query: {query}
Research Goal: {goal}

Research Findings by Aspect:
{aspect_findings}

Conversation History:
{history}

Produce a comprehensive research summary. Then assign a confidence score (0-10) based on:
- Source quality and recency
- Completeness of information
- Relevance to the user's query

Respond in this EXACT format:
CONFIDENCE_SCORE: <number 0-10>
RESEARCH_SUMMARY:
<Your detailed research summary here, organized by aspect>

SOURCE_QUALITY_NOTES:
<Brief notes on source reliability and recency>
"""


def research_agent(state: ResearchState) -> ResearchState:
    """
    Perform parallelized research across multiple aspects using Tavily,
    then synthesize findings and assign a confidence score.
    """
    company = state.get("company_name", "the company")
    query = state["current_query"]
    history = format_conversation_history(state.get("messages", []))
    plan = state.get("research_plan", {})
    aspects = state.get("research_aspects", [])
    search_queries = plan.get("search_queries", {})
    validation_feedback = state.get("validation_feedback", "")
    attempts = state.get("research_attempts", 0) + 1
    
    # Build search queries for each aspect
    # If validator gave feedback, incorporate it
    aspect_findings = {}
    all_sources = []
    
    for aspect in aspects:
        # Get the planned query for this aspect, or build a default
        base_query = search_queries.get(aspect, f"{company} {aspect}")
        
        # If this is a retry, add more specificity
        if validation_feedback and attempts > 1:
            search_query = f"{base_query} {validation_feedback}"
        else:
            search_query = base_query
        
        results = tavily_search(search_query, max_results=4)
        all_sources.extend(results)
        aspect_findings[aspect] = format_search_results(results)
    
    # Format all aspect findings for the LLM
    combined_findings = "\n\n".join([
        f"### {aspect}:\n{findings}"
        for aspect, findings in aspect_findings.items()
    ])
    
    prompt = RESEARCH_SYNTHESIS_PROMPT.format(
        company=company,
        query=query,
        goal=plan.get("research_goal", f"Research {company}"),
        aspect_findings=combined_findings,
        history=history,
    )
    
    response = llm.invoke(prompt)
    content = response.content.strip()
    
    # Parse confidence score and summary
    confidence_score = 5.0  # default
    research_summary = content
    
    lines = content.split("\n")
    for i, line in enumerate(lines):
        if line.startswith("CONFIDENCE_SCORE:"):
            try:
                confidence_score = float(line.split(":", 1)[1].strip())
            except Exception:
                confidence_score = 5.0
        elif line.startswith("RESEARCH_SUMMARY:"):
            # Everything after this line until SOURCE_QUALITY_NOTES
            summary_lines = []
            for j in range(i + 1, len(lines)):
                if lines[j].startswith("SOURCE_QUALITY_NOTES:"):
                    break
                summary_lines.append(lines[j])
            research_summary = "\n".join(summary_lines).strip()
    
    return {
        **state,
        "research_findings": {"summary": research_summary, "aspects": aspect_findings},
        "raw_sources": all_sources,
        "confidence_score": confidence_score,
        "research_attempts": attempts,
    }