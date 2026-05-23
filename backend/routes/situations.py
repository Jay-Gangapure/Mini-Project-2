"""
AI-powered legal situation search (RAG-based).

GET /situations?query=...
GET /situations/{scenario_id} → treated as AI query
All routes are PROTECTED (JWT required).
"""

from fastapi import APIRouter, HTTPException, Query, Depends
from services.ai_chat_service import ai_chat_service
from auth.jwt_handler import get_current_user_id
from utils.responses import success_response

router = APIRouter()


# ---------------------------------------------------------------------------
# GET /situations → AI SEARCH
# ---------------------------------------------------------------------------
@router.get("")
async def search_situations(
    query: str = Query(..., description="Describe your legal issue"),
    _: str = Depends(get_current_user_id),
):
    """
    AI-powered legal search using RAG + Pinecone.
    """

    if not query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    try:
        result = await ai_chat_service.get_response(query)

        return success_response(
            data={
                "query": query,
                "response": result["response"],
                "mode": result["mode"],
                "sources": result["sources"],
            }
        )

    except Exception as e:
        print("Situations AI error:", e)
        raise HTTPException(status_code=500, detail="AI search failed")


# ---------------------------------------------------------------------------
# GET /situations/{scenario_id} → ALSO AI (no static IDs anymore)
# ---------------------------------------------------------------------------
@router.get("/{scenario_id}")
async def get_situation(
    scenario_id: str,
    _: str = Depends(get_current_user_id),
):
    """
    Backward-compatible route.
    Treats scenario_id as a query string for AI.
    """

    query = scenario_id.replace("_", " ")

    try:
        result = await ai_chat_service.get_response(query)

        return success_response(
            data={
                "query": query,
                "response": result["response"],
                "mode": result["mode"],
                "sources": result["sources"],
            }
        )

    except Exception as e:
        print("Scenario AI error:", e)
        raise HTTPException(status_code=500, detail="AI processing failed")