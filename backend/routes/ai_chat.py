from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ai_chat_service import ai_chat_service
import numpy as np
router = APIRouter()


class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
async def chat_with_legal_ai(request: ChatRequest):

    try:
        print("\n===== AI CHAT REQUEST =====")
        print("USER QUERY:", request.message)

        if not request.message.strip():
            raise HTTPException(
                status_code=400,
                detail="Message cannot be empty"
            )

        ai_response = await ai_chat_service.get_response(
            request.message
        )

        return {
            "success": True,
            "response": ai_response["response"],    
            "sources": ai_response["sources"]
        }

    except Exception as e:
        print("Chat error:", str(e))

        raise HTTPException(
            status_code=500,
            detail=f"AI response failed: {str(e)}"
        )