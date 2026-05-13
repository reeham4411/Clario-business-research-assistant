import os
from dotenv import load_dotenv
from tavily import TavilyClient
from typing import List, Dict, Any

load_dotenv()

client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))


def tavily_search(query: str, max_results: int = 2) -> List[Dict[str, Any]]:
    """
    Run a Tavily search and return structured results.
    Each result contains: title, url, content, score.
    """
    try:
        response = client.search(
            query=query,
            search_depth="advanced",
            max_results=max_results,
            include_answer=True,
            include_raw_content=False,
        )
        results = []
        if response.get("answer"):
            results.append({
                "title": "Tavily Direct Answer",
                "url": "tavily_synthesis",
                "content": response["answer"],
                "score": 1.0,
            })
        for r in response.get("results", []):
            results.append({
                "title": r.get("title", ""),
                "url": r.get("url", ""),
                "content": r.get("content", ""),
                "score": r.get("score", 0.0),
            })
        return results
    except Exception as e:
        return [{"title": "Error", "url": "", "content": f"Search failed: {str(e)}", "score": 0.0}]


def format_search_results(results: List[Dict[str, Any]]) -> str:
    """Format search results into a readable string."""
    if not results:
        return "No results found."
    
    formatted = []
    for i, r in enumerate(results, 1):
        formatted.append(
            f"[Source {i}] {r['title']}\nURL: {r['url']}\nRelevance: {r['score']:.2f}\n{r['content']}\n"
        )
    return "\n---\n".join(formatted)