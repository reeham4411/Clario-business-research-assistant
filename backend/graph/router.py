from graph.state import ResearchState


def route_after_clarity(state: ResearchState) -> str:
    """Route based on clarity agent output."""
    if state.get("clarity_status") == "needs_clarification":
        return "interrupt_for_clarification"
    return "planning_agent"


def route_after_research(state: ResearchState) -> str:
    """Always route to validator agent regardless of confidence score."""
    return "validator_agent"


def route_after_validation(state: ResearchState) -> str:
    """Route based on validation result and attempt count."""
    attempts = state.get("research_attempts", 0)
    max_attempts = state.get("max_research_attempts", 3)
    validation_result = state.get("validation_result", "insufficient")

    if validation_result == "sufficient":
        return "synthesis_agent"

    if attempts < max_attempts:
        return "research_agent"  # Loop back

    # Max attempts reached — go to synthesis anyway
    return "synthesis_agent"