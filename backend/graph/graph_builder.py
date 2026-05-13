from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

from graph.state import ResearchState
from graph.router import route_after_clarity, route_after_research, route_after_validation
from agents.clarity_agent import clarity_agent
from agents.planning_agent import planning_agent
from agents.research_agent import research_agent
from agents.validator_agent import validator_agent
from agents.synthesis_agent import synthesis_agent


def build_graph():
    """Construct and compile the multi-agent LangGraph workflow."""

    builder = StateGraph(ResearchState)

    # Add nodes
    builder.add_node("clarity_agent", clarity_agent)
    builder.add_node("planning_agent", planning_agent)
    builder.add_node("research_agent", research_agent)
    builder.add_node("validator_agent", validator_agent)
    builder.add_node("synthesis_agent", synthesis_agent)

    # Entry point
    builder.set_entry_point("clarity_agent")

    # Conditional routing from Clarity Agent
    builder.add_conditional_edges(
        "clarity_agent",
        route_after_clarity,
        {
            "interrupt_for_clarification": END,
            "planning_agent": "planning_agent",
        },
    )

    # Planning → Research
    builder.add_edge("planning_agent", "research_agent")

    # Research → Validator
    builder.add_conditional_edges(
        "research_agent",
        route_after_research,
        {
            "validator_agent": "validator_agent",
            "synthesis_agent": "synthesis_agent",
        },
    )

    # Conditional routing from Validator Agent
    builder.add_conditional_edges(
        "validator_agent",
        route_after_validation,
        {
            "research_agent": "research_agent",
            "synthesis_agent": "synthesis_agent",
        },
    )

    # Synthesis → END
    builder.add_edge("synthesis_agent", END)

    memory = MemorySaver()
    graph = builder.compile(checkpointer=memory)

    return graph