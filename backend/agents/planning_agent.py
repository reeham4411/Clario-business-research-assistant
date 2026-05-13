import json
from graph.state import ResearchState
from utils.llm import get_llm
from utils.memory import format_conversation_history

llm = get_llm(temperature=0.2)

PLANNING_PROMPT = """You are a Research Planning Agent for a business intelligence assistant.

Given the user's query and company name, generate a structured research plan.
Identify 3-5 specific research aspects that should be investigated IN PARALLEL to answer the query comprehensively.

Company: {company}
User Query: {query}
Conversation History:
{history}

Respond in valid JSON only, no extra text:
{{
  "research_goal": "<one sentence describing the overall research goal>",
  "aspects": [
    "<aspect 1: e.g., Recent news and developments>",
    "<aspect 2: e.g., Financial performance and metrics>",
    "<aspect 3: e.g., Leadership and management team>",
    "<aspect 4: e.g., Competitor landscape>",
    "<aspect 5: e.g., Products and services overview>"
  ],
  "search_queries": {{
    "<aspect 1>": "<specific search query for this aspect>",
    "<aspect 2>": "<specific search query for this aspect>",
    "<aspect 3>": "<specific search query for this aspect>"
  }}
}}
"""


def planning_agent(state: ResearchState) -> ResearchState:
    """Generate a structured research plan with parallel research aspects."""
    company = state.get("company_name", "the company")
    query = state["current_query"]
    history = format_conversation_history(state.get("messages", []))
    
    prompt = PLANNING_PROMPT.format(company=company, query=query, history=history)
    response = llm.invoke(prompt)
    content = response.content.strip()
    
    # Strip markdown fences if present
    if content.startswith("```"):
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
    content = content.strip()
    
    try:
        plan = json.loads(content)
    except Exception:
        # Fallback plan
        plan = {
            "research_goal": f"Research {company} based on: {query}",
            "aspects": [
                "Recent news and developments",
                "Financial performance",
                "Leadership and strategy",
                "Products and services",
                "Competitor landscape",
            ],
            "search_queries": {
                "Recent news and developments": f"{company} latest news 2024 2025",
                "Financial performance": f"{company} financial results revenue earnings",
                "Leadership and strategy": f"{company} CEO leadership strategy",
                "Products and services": f"{company} products services offerings",
                "Competitor landscape": f"{company} competitors market position",
            }
        }
    
    return {
        **state,
        "research_plan": plan,
        "research_aspects": plan.get("aspects", []),
    }