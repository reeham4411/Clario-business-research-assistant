import json
from graph.state import ResearchState
from utils.llm import get_llm

llm = get_llm(temperature=0.2)

PLANNING_PROMPT = """You are a Research Planning Agent for a business intelligence assistant.

Generate a small research plan for the user's query.

Company: {company}
User Query: {query}

Rules:
- Use only 3 research aspects maximum.
- Keep aspect names short.
- Keep search queries short and specific.
- Do not include conversation history.
- Return valid JSON only.

JSON format:
{{
  "research_goal": "<one short sentence>",
  "aspects": [
    "<aspect 1>",
    "<aspect 2>",
    "<aspect 3>"
  ],
  "search_queries": {{
    "<aspect 1>": "<short search query>",
    "<aspect 2>": "<short search query>",
    "<aspect 3>": "<short search query>"
  }}
}}
"""


def planning_agent(state: ResearchState) -> ResearchState:
    """Generate a lightweight research plan."""

    company = state.get("company_name", "the company")
    query = state["current_query"]

    prompt = PLANNING_PROMPT.format(
        company=company,
        query=query,
    )

    response = llm.invoke(prompt)
    content = response.content.strip()

    # Strip markdown fences if present
    if content.startswith("```"):
        content = content.replace("```json", "").replace("```", "").strip()

    try:
        plan = json.loads(content)

        # Safety limits
        aspects = plan.get("aspects", [])[:3]
        search_queries = plan.get("search_queries", {})

        plan = {
            "research_goal": plan.get(
                "research_goal",
                f"Research {company} based on the user query."
            ),
            "aspects": aspects,
            "search_queries": {
                aspect: search_queries.get(aspect, f"{company} {aspect}")
                for aspect in aspects
            },
        }

    except Exception:
        # Fallback plan with only 3 aspects
        plan = {
            "research_goal": f"Research {company} based on: {query}",
            "aspects": [
                "Recent developments",
                "Financial performance",
                "Competitors",
            ],
            "search_queries": {
                "Recent developments": f"{company} latest business news",
                "Financial performance": f"{company} revenue earnings financial results",
                "Competitors": f"{company} competitors market position",
            },
        }

    return {
        **state,
        "research_plan": plan,
        "research_aspects": plan.get("aspects", [])[:3],
    }