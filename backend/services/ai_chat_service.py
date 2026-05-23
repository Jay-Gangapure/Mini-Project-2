import os
import numpy as np
from typing import Dict, Any
from services.ai_service import ai_service
from services.rag_service import rag_service
from rag.pipeline import generate_response

class AIChatService:

   async def get_response(self, user_query: str) -> Dict[str, Any]:

    # Full RAG pipeline
    response = generate_response(user_query)

    print("FINAL RESPONSE GENERATED")
    print(response)

    if not response:
        raise Exception("AI response failed")

    return {
        "mode": "rag",
        "response": response,
        "sources": ["RAG + Gemini"],
    }
ai_chat_service = AIChatService()