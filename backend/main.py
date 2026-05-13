import uuid
from langchain_core.messages import HumanMessage
from graph.graph_builder import build_graph
from graph.state import ResearchState


def print_separator():
    print("\n" + "=" * 60 + "\n")


def is_valid_company_name(text: str) -> bool:
    """Basic validation to avoid treating random/gibberish input as a company name."""
    if not text:
        return False

    cleaned = text.strip().lower()

    invalid_inputs = {
        "what", "why", "how", "when", "where", "who",
        "huh", "idk", "i don't know", "i dont know",
        "nothing", "none", "no", "yes", "ok", "okay",
        "random", "anything", "something", "tell me something",
        "ask me something", "company", "what are you saying",
        "what do you mean", "i don't understand", "i dont understand"
    }

    if cleaned in invalid_inputs:
        return False

    question_words = {"what", "why", "how", "when", "where", "who"}

    # Reject clarification that starts like a normal question
    first_word = cleaned.split()[0]
    if first_word in question_words:
        return False

    # Reject long sentence-like clarification
    words = cleaned.split()
    if len(words) > 4:
        return False

    # Reject if it contains obvious non-company phrases
    bad_phrases = [
        "you saying",
        "you mean",
        "tell me",
        "ask me",
        "i want",
        "i don't",
        "i dont",
        "explain",
    ]

    if any(phrase in cleaned for phrase in bad_phrases):
        return False

    letters = sum(c.isalpha() for c in cleaned)

    if letters < 2:
        return False

    return True


def run_conversation():
    """Main CLI runner for the multi-agent research assistant."""

    graph = build_graph()

    # Unique session ID for LangGraph memory
    thread_id = str(uuid.uuid4())
    config = {"configurable": {"thread_id": thread_id}}

    print("=" * 60)
    print("  🔍 Clario - Multi-Agent Business Research Assistant")
    print("  Powered by LangGraph + Groq + Tavily")
    print("=" * 60)
    print("Ask me anything about a company. Type 'quit' to exit.\n")

    # Persistent conversation memory
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

        # Store user message
        human_msg = HumanMessage(content=user_input)
        conversation_messages.append(human_msg)

        # Initial graph state
        initial_state: ResearchState = {
            "messages": conversation_messages,
            "current_query": user_input,
            "clarity_status": None,
            "clarification_question": None,
            "company_name": company_name,
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
            # Run LangGraph workflow
            final_state = graph.invoke(initial_state, config=config)

            # ---------------------------------------------------
            # HUMAN-IN-THE-LOOP CLARIFICATION
            # ---------------------------------------------------
            if final_state.get("clarity_status") == "needs_clarification":

                clarification_q = final_state.get(
                    "clarification_question",
                    "Could you please specify which company you are asking about?"
                )

                # Safety fix:
                # Prevent printing "None" as a question.
                if not clarification_q or clarification_q == "None":
                    clarification_q = (
                        "Please enter a valid business/company query, for example: "
                        "Research Tesla or Tell me about Microsoft."
                    )

                print(f"\n❓ {clarification_q}")
                print_separator()

                clarification = input("You (clarification): ").strip()

                if not clarification:
                    continue

                # Validate clarification before treating it as a company name
                while not is_valid_company_name(clarification):
                    print(
                        "\n❗ Please type a valid company name, "
                        "for example: Tesla, Microsoft, Amazon, Nvidia."
                    )
                    clarification = input("You (company name): ").strip()

                    if not clarification:
                        break

                if not clarification:
                    continue

                # Add clarification to memory
                clarification_msg = HumanMessage(content=clarification)
                conversation_messages.append(clarification_msg)

                # IMPORTANT:
                # Create CLEAN refined state instead of using **final_state
                refined_state: ResearchState = {
                    "messages": conversation_messages,
                    "current_query": f"{user_input} {clarification}",
                    "clarity_status": None,
                    "clarification_question": None,
                    "company_name": clarification,
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

                print("\n🔄 Re-running with clarification...\n")

                final_state = graph.invoke(refined_state, config=config)

                # DEBUGGING OUTPUT
                print("\n--- DEBUG FINAL STATE ---")
                print("clarity_status:", final_state.get("clarity_status"))
                print("company_name:", final_state.get("company_name"))
                print("clarification_question:", final_state.get("clarification_question"))
                print("research_plan:", final_state.get("research_plan"))
                print("research_aspects:", final_state.get("research_aspects"))
                print("confidence_score:", final_state.get("confidence_score"))
                print("validation_result:", final_state.get("validation_result"))
                print("final_response exists:", bool(final_state.get("final_response")))
                print("--- END DEBUG ---\n")

            # ---------------------------------------------------
            # DISPLAY FINAL RESPONSE
            # ---------------------------------------------------
            final_response = final_state.get("final_response")

            if final_response:

                print(final_response)

                # Persist company context
                company_name = final_state.get("company_name", company_name)

                # Sync latest messages
                # conversation_messages = final_state.get(
                #     "messages",
                #     conversation_messages
                # )

                # Keep only user messages and short assistant memory, not full long responses
                conversation_messages = conversation_messages[-6:]

                print_separator()

                print(
                    f"📊 Confidence: {final_state.get('confidence_score', 'N/A')}/10 | "
                    f"Research attempts: {final_state.get('research_attempts', 1)} | "
                    f"Validation: {final_state.get('validation_result', 'N/A')}"
                )

            else:
                print("Something went wrong — no response generated.")

                # Extra debugging
                print("\n--- ERROR DEBUG INFO ---")
                print("clarity_status:", final_state.get("clarity_status"))
                print("company_name:", final_state.get("company_name"))
                print("research_attempts:", final_state.get("research_attempts"))
                print("confidence_score:", final_state.get("confidence_score"))
                print("validation_result:", final_state.get("validation_result"))
                print("research_plan:", final_state.get("research_plan"))
                print("research_aspects:", final_state.get("research_aspects"))
                print("--- END DEBUG ---")

        except Exception as e:

            print(f"\n Error: {e}")

            import traceback
            traceback.print_exc()

        print_separator()


if __name__ == "__main__":
    run_conversation()