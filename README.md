# Clario — Multi-Agent Business Research Assistant

Clario is a sophisticated multi-agent AI business research assistant built with LangGraph. It helps users research companies by clarifying ambiguous queries, planning research strategy, searching live sources, validating results, and generating polished business summaries with confidence scoring.

## ✨ Features

- **Multi-agent workflow** using LangGraph with 5 specialized agents
- **Clarity Agent** — Disambiguates and clarifies user queries
- **Planning Agent** — Creates structured research strategies
- **Research Agent** — Searches live business sources via Tavily
- **Validator Agent** — Quality checks and confidence scoring
- **Synthesis Agent** — Generates clear, polished final responses
- **Multi-turn conversation memory** — Maintains context across queries
- **Human-in-the-loop clarification** — Asks for details when needed
- **Follow-up question handling** — Smart context awareness
- **Modern Next.js frontend** — Premium UI with real-time agent tracking
- **FastAPI backend** — High-performance async architecture
- **Real-time agent pipeline visualization** — See agents working live

## 🏗️ Tech Stack

### Frontend

- **Next.js** — React framework with SSR
- **TypeScript** — Type-safe development
- **Tailwind CSS** — Utility-first styling
- **React Hooks** — State management

### Backend

- **Python** — Core language
- **FastAPI** — Modern async API framework
- **LangGraph** — Multi-agent orchestration
- **LangChain** — LLM abstraction layer
- **Groq LLM API** — Fast inference
- **Tavily Search API** — Live business intelligence

## 📁 Project Structure

```
Clario-business-research-assistant/
├── backend/
│   ├── agents/
│   │   ├── clarity_agent.py          # Query disambiguation
│   │   ├── planning_agent.py         # Research strategy
│   │   ├── research_agent.py         # Live search execution
│   │   ├── validator_agent.py        # Quality validation
│   │   └── synthesis_agent.py        # Final answer generation
│   │
│   ├── graph/
│   │   ├── graph_builder.py          # LangGraph workflow
│   │   ├── router.py                 # Agent routing logic
│   │   └── state.py                  # Shared state schema
│   │
│   ├── tools/
│   │   └── search_tools.py           # Tavily integration
│   │
│   ├── utils/
│   │   ├── llm.py                    # Groq LLM setup
│   │   └── memory.py                 # Conversation memory
│   │
│   ├── api_server.py                 # FastAPI app
│   ├── main.py                       # CLI testing
│   ├── requirements.txt              # Python dependencies
│   └── .env                          # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── layout.tsx            # Root layout
│   │   │   ├── globals.css           # Global styles
│   │   │   ├── chat/
│   │   │   │   └── page.tsx          # Chat interface
│   │   │   ├── api/
│   │   │   │   └── research/
│   │   │   │       └── route.ts      # API route
│   │   │   ├── components/
│   │   │   │   ├── ChatShell.tsx     # Main chat container
│   │   │   │   ├── MessageFeed.tsx   # Message display
│   │   │   │   ├── InputBar.tsx      # Query input
│   │   │   │   ├── AgentTracker.tsx  # Pipeline visualization
│   │   │   │   ├── MessageBubble.tsx # Message rendering
│   │   │   │   ├── StatusBar.tsx     # Run summary
│   │   │   │   └── landing/
│   │   │   │       ├── Hero.tsx
│   │   │   │       ├── FeatureGrid.tsx
│   │   │   │       ├── WorkflowSection.tsx
│   │   │   │       └── CTASection.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useChat.ts        # Chat logic
│   │   │   │   └── useAutoScroll.ts  # Auto-scroll
│   │   │   └── utils/
│   │   │       ├── api.ts            # API client
│   │   │       └── types.ts          # TypeScript types
│   │   └── public/
│   │       └── fonts/                # Custom fonts
│   │
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── .env.local
│
└── README.md
```

## 🔄 Agent Workflow

```
┌─────────────────┐
│   User Query    │
└────────┬────────┘
         ↓
┌─────────────────────┐
│  Clarity Agent      │ ← Checks if query is clear
└────────┬────────────┘   (if unclear → asks for clarification)
         ↓
┌─────────────────────┐
│  Planning Agent     │ ← Creates research strategy
└────────┬────────────┘
         ↓
┌─────────────────────┐
│  Research Agent     │ ← Searches live sources (Tavily)
└────────┬────────────┘
         ↓
┌─────────────────────┐
│  Validator Agent    │ ← Quality checks & confidence scoring
└────────┬────────────┘
         ↓
┌─────────────────────┐
│  Synthesis Agent    │ ← Generates final answer
└────────┬────────────┘
         ↓
┌─────────────────────┐
│   Final Answer      │ ← Polished business summary
└─────────────────────┘
```

### Example Flow

If a user enters an unclear query, the Clarity Agent interrupts:

```
User: "Tell me about the company."
Assistant: "Which company would you like me to research?"
User: "Tesla"
→ System continues through planning, research, validation, and synthesis
```

Multi-turn context is maintained:

```
User: "Research Tesla."
Assistant: [Provides Tesla research]

User: "What about their competitors?"
Assistant: [Understands "their" refers to Tesla and researches competitors]
```

## 🚀 Setup Instructions

### 1. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv venv
```

On Windows:

```bash
venv\Scripts\activate
```

On macOS/Linux:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file in the backend directory:

```env
GROQ_API_KEY=your_groq_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

Run the FastAPI backend:

```bash
uvicorn api_server:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`

API documentation: `http://localhost:8000/docs`

### 2. Frontend Setup

Open a new terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
BACKEND_URL=http://localhost:8000
```

Run the development server:

```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## 📖 How to Use

1. Open `http://localhost:3000` in your browser
2. Click **"Ask Clario"** button
3. Enter a company research query
4. Watch the agent pipeline work in real-time
5. Get a polished business summary with confidence scoring

## 🧪 Example Queries

Try these queries to explore Clario's capabilities:

- **"Research Tesla's recent business developments."**
- **"Tell me about Microsoft's market position."**
- **"How is Nvidia performing in the AI chip market?"**
- **"What are Amazon's recent business challenges?"**
- **"Compare Tesla and BYD in the EV market."**
- **"Give me a financial overview of Apple Inc."**
- **"Who is Google's CEO and what is their current strategy?"**
- **"What about their competitors?"** (multi-turn example)

## 💬 Human-in-the-Loop Clarification

If Clario detects an ambiguous query, it will ask for clarification before proceeding:

```
User: "Tell me about the company."
Assistant: "Which company would you like me to research?"
User: "Apple"
→ Clario proceeds with Apple research
```

## 🧠 Multi-Turn Memory

Clario maintains context across multiple messages:

```
User: "Research Tesla."
Assistant: [Provides Tesla analysis]

User: "What about their competitors?"
Assistant: [Understands "their" = Tesla, researches competitors]

User: "Tell me more about their CEO."
Assistant: [Still knows we're discussing Tesla, provides CEO info]
```

## 🔌 Backend API Endpoint

The frontend communicates with the backend via:

```
POST /api/research
```

This Next.js API route forwards requests to the FastAPI backend:

```
POST http://localhost:8000/research
```

### Request Payload

```json
{
  "query": "Research Tesla",
  "conversation_id": "optional-uuid"
}
```

### Response Structure

```json
{
  "response": "Final business summary",
  "confidence": 8.5,
  "company": "Tesla",
  "attempts": 1,
  "validation": "sufficient"
}
```

## 🔐 Environment Variables

### Backend `.env`

```env
GROQ_API_KEY=your_groq_api_key
TAVILY_API_KEY=your_tavily_api_key
BACKEND_PORT=8000
```

### Frontend `.env.local`

```env
BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_ENABLE_DEBUG=false
```

## 📹 Demo Suggestions

For a compelling demo, follow this flow:

1. **Clear query** — "Research Microsoft's recent developments"
2. **Follow-up** — "What about their competitors?"
3. **Ambiguous query** — "Tell me about the company" (triggers clarification)
4. **Specific query** — "Who is Microsoft's CEO and what's their AI strategy?"
5. **Comparison** — "Compare Microsoft and Google in cloud computing"

Watch the agent pipeline visualization update in real-time as each agent completes its task.

## 📝 Implementation Notes

- `main.py` — Used for terminal-based testing and debugging
- `api_server.py` — Used for frontend-backend integration via FastAPI
- **Tavily API** — Provides live, real-time business search results
- **Groq LLM** — Fast inference for all agent reasoning
- **LangGraph** — Manages multi-agent workflow, routing, and state
- **TypeScript** — Ensures type safety throughout the frontend
- **Tailwind CSS** — Premium, responsive UI styling

## 🎨 UI Features

- **Real-time agent pipeline tracking** — See agents working live
- **Confidence scoring** — Visual confidence indicators (0-10)
- **Quality validation** — Shows validation status for each response
- **Multi-agent transparency** — View which agent is currently active
- **Responsive design** — Works seamlessly on desktop and mobile
- **Dark theme** — Professional dark UI with emerald/cyan accents
- **Markdown support** — Rich formatting in responses

## 🔗 Getting API Keys

### Groq API Key

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Create an API key
4. Add to `.env`

### Tavily API Key

1. Visit [tavily.com](https://tavily.com)
2. Sign up or log in
3. Generate an API key
4. Add to `.env`

## 🤝 Contributing

Contributions are welcome. Feel free to:

- Report bugs
- Suggest new agents
- Improve UI/UX
- Optimize backend performance

## 📄 License

This project is open-source. Modify and use as needed.

## 🎯 Project Vision

Clario aims to make business research fast, accurate, and accessible. By leveraging specialized AI agents working in concert, we provide researchers with:

- **Clarity** — Unambiguous query understanding
- **Speed** — Fast, parallel research execution
- **Confidence** — Quality validation and scoring
- **Clarity** — Polished, readable summaries

---

**Built with ❤️ using LangGraph, Groq, Tavily, and Next.js**
