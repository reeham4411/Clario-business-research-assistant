import os
from dotenv import load_dotenv
from tavily import TavilyClient
from typing import List, Dict, Any

load_dotenv()

client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))


def trim_text(text: str, max_chars: int = 500) -> str:
    if not text:
        return ""
    text = text.replace("\n", " ").strip()
    return text[:max_chars] + "..." if len(text) > max_chars else text


def tavily_search(query: str, max_results: int = 1) -> List[Dict[str, Any]]:
    try:
        response = client.search(
            query=query,
            search_depth="basic",
            max_results=max_results,
            include_answer=False,
            include_raw_content=False,
        )

        results = []

        for r in response.get("results", [])[:max_results]:
            results.append({
                "title": trim_text(r.get("title", ""), 120),
                "url": r.get("url", ""),
                "content": trim_text(r.get("content", ""), 500),
                "score": r.get("score", 0.0),
            })

        return results

    except Exception as e:
        return [{
            "title": "Search Error",
            "url": "",
            "content": f"Search failed: {str(e)}",
            "score": 0.0,
        }]


def format_search_results(results: List[Dict[str, Any]]) -> str:
    if not results:
        return "No results found."

    formatted = []

    for i, r in enumerate(results[:2], 1):
        formatted.append(
            f"[Source {i}] {r.get('title', '')}\n"
            f"URL: {r.get('url', '')}\n"
            f"{trim_text(r.get('content', ''), 400)}"
        )

    return "\n---\n".join(formatted)