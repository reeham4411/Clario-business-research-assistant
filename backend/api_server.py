import uuid
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_core.messages import HumanMessage

from graph.graph_builder import build_graph
from graph.state import ResearchState

app = FastAPI(title="Clario API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

graph = build_graph()

sessions = {}


class ResearchRequest(BaseModel):
    query: str
    session_id: str | None = None
    clarification: str | None = None


@app.post("/research")
def research(request: ResearchRequest):
    session_id = request.session_id or str(uuid.uuid4())

    session = sessions.get(session_id, {
        "messages": [],
        "company_name": None,
    })

    user_query = request.query.strip()
    session["messages"].append(HumanMessage(content=user_query))

    state: ResearchState = {
        "messages": session["messages"],
        "current_query": user_query,
        "clarity_status": None,
        "clarification_question": None,
        "company_name": session["company_name"],
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

    config = {"configurable": {"thread_id": session_id}}
    final_state = graph.invoke(state, config=config)

    if final_state.get("clarity_status") == "needs_clarification":
        sessions[session_id] = session

        return {
            "session_id": session_id,
            "needs_clarification": True,
            "clarification_question": final_state.get(
                "clarification_question",
                "Which company are you asking about?"
            ),
            "final_response": "",
            "confidence_score": None,
            "research_attempts": 0,
            "validation_result": None,
            "company_name": session["company_name"],
            "research_aspects": [],
            "suggested_questions": [],
        }

    session["company_name"] = final_state.get("company_name", session["company_name"])
    session["messages"] = final_state.get("messages", session["messages"])[-6:]
    sessions[session_id] = session

    return {
        "session_id": session_id,
        "needs_clarification": False,
        "clarification_question": None,
        "final_response": final_state.get("final_response", "No response generated."),
        "confidence_score": final_state.get("confidence_score"),
        "research_attempts": final_state.get("research_attempts", 1),
        "validation_result": final_state.get("validation_result"),
        "company_name": final_state.get("company_name"),
        "research_aspects": final_state.get("research_aspects", []),
        "suggested_questions": [],
    }