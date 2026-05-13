import uuid
from langchain_core.messages import HumanMessage
from graph.graph_builder import build_graph
from graph.state import ResearchState

def print_separator():
    print("\n" + "="*60 + "\n")


def run_conversation():
    """Main CLI runner for the multi-agent research assistant."""
    graph = build_graph()
    
    # Each session gets a unique thread ID for memory persistence
    thread_id = str(uuid.uuid4())
    config = {"configurable": {"thread_id": thread_id}}
    
    print("=" * 60)
    print("  🔍 Business Research Assistant (Multi-Agent)")
    print("  Powered by LangGraph + Groq + Tavily")
    print("=" * 60)
    print("Ask me anything about a company. Type 'quit' to exit.\n")
    
    # Maintain conversation state across turns
    conversation_messages = []
    company_name = None
    
    while True:
        try:
            user_input = input("You: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\n\nGoodbye!")
            break
        
        if not user_input:
            continue
        if user_input.lower() in ("quit", "exit", "bye"):
            print("Goodbye!")
            break
        
        # Add user message to history
        human_msg = HumanMessage(content=user_input)
        conversation_messages.append(human_msg)
        
        # Build initial state
        initial_state: ResearchState = {
            "messages": conversation_messages,
            "current_query": user_input,
            "clarity_status": None,
            "clarification_question": None,
            "company_name": company_name,   # Carry over from previous turns
            "research_plan": None,
            "research_aspects": None,
            "research_findings": None,
            "raw_sources": None,
            "confidence_score": None,
            "research_attempts": 0,
            "validation_result": None,
            "validation_feedback": None,
            "final_response": None,
            "max_research_attempts": 3,
        }
        
        print("\n🤖 Assistant: ", end="", flush=True)
        
        try:
            # Run the graph
            final_state = graph.invoke(initial_state, config=config)
            
            # ── Handle Human-in-the-Loop (clarification needed) ──────
            if final_state.get("clarity_status") == "needs_clarification":
                clarification_q = final_state.get(
                    "clarification_question",
                    "Could you please specify which company you are asking about?"
                )
                print(f"\n❓ {clarification_q}")
                print_separator()
                
                # Get clarification from user
                clarification = input("You (clarification): ").strip()
                if not clarification:
                    continue
                
                # Merge clarification into the query and re-run
                clarification_msg = HumanMessage(content=clarification)
                conversation_messages.append(clarification_msg)
                
                # Re-run with clarified query
                refined_state: ResearchState = {
                    **final_state,
                    "messages": conversation_messages,
                    "current_query": f"{user_input} {clarification}",
                    "clarity_status": None,
                    "clarification_question": None,
                    "research_attempts": 0,
                    "validation_result": None,
                    "validation_feedback": None,
                    "final_response": None,
                }
                
                print("\n🔄 Re-running with clarification...\n")
                final_state = graph.invoke(refined_state, config=config)
            
            # ── Display final response
            final_response = final_state.get("final_response")
            if final_response:
                print(final_response)
                
                # Update conversation context
                company_name = final_state.get("company_name", company_name)
                # Sync messages from final state (synthesis agent appended AI message)
                conversation_messages = final_state.get("messages", conversation_messages)
                
                # Show metadata
                print_separator()
                print(f"📊 Confidence: {final_state.get('confidence_score', 'N/A')}/10 | "
                      f"Research attempts: {final_state.get('research_attempts', 1)} | "
                      f"Validation: {final_state.get('validation_result', 'N/A')}")
            else:
                print("Something went wrong — no response generated.")
            
        except Exception as e:
            print(f"\n Error: {e}")
            import traceback
            traceback.print_exc()
        
        print_separator()


if __name__ == "__main__":
    run_conversation()