from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from auth.jwt_handler import get_current_user_id
from services.ai_chat_service import ai_chat_service
from utils.responses import success_response

router = APIRouter()

class InterpretRequest(BaseModel):
    text: str


@router.post("/interpret")
async def interpret_legal_situation(
    payload: InterpretRequest,
    _: str = Depends(get_current_user_id),
):

    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    try:
        result = await ai_chat_service.get_response(payload.text)

        return success_response(
            data={
                "analysis": result["response"],
                "sources": result["sources"],
                "mode": result["mode"]
            }
        )

    except Exception as e:
        print("Interpret error:", e)
        raise HTTPException(status_code=500, detail="AI interpretation failed")