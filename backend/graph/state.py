from typing import List, Optional, Annotated
from typing_extensions import TypedDict
from langchain_core.messages import BaseMessage
import operator


class ResearchState(TypedDict):
    # Core conversation
    messages: Annotated[List[BaseMessage], operator.add]   # Full conversation history
    current_query: str                                      # Current user query
    
    # Clarity Agent outputs
    clarity_status: Optional[str]                           # "clear" | "needs_clarification"
    clarification_question: Optional[str]                   # Question to ask user
    company_name: Optional[str]                             # Extracted company name
    
    # Planning Agent outputs
    research_plan: Optional[dict]                           # Structured research strategy
    research_aspects: Optional[List[str]]                   # Aspects to research in parallel
    
    # Research Agent outputs
    research_findings: Optional[dict]                       # { aspect: findings_text }
    raw_sources: Optional[List[dict]]                       # Raw search results
    confidence_score: Optional[float]                       # 0-10
    research_attempts: int                                  # Loop counter
    
    # Validator Agent outputs
    validation_result: Optional[str]                        # "sufficient" | "insufficient"
    validation_feedback: Optional[str]                      # Feedback for re-research
    
    # Synthesis Agent outputs
    final_response: Optional[str]                           # Final answer to user
    
    # Control flags
    max_research_attempts: int                              # Default 3