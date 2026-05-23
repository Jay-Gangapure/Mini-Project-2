from fastapi import APIRouter, HTTPException

from services.translation_service import translation_service
from services.voice_service import voice_service

router = APIRouter()


# =====================================================
# TRANSLATION
# =====================================================

@router.post("/translate")
async def translate(data: dict):

    text = data.get("text", "")
    lang = data.get("lang", "en")

    if not text.strip():

        raise HTTPException(
            status_code=400,
            detail="Text is empty"
        )

    translated = await translation_service.translate_text(
        text,
        lang
    )

    return {
        "translated": translated
    }


# =====================================================
# VOICE
# =====================================================

@router.post("/voice")
async def generate_voice(data: dict):

    text = data.get("text", "")
    lang = data.get("lang", "en")

    if not text.strip():

        raise HTTPException(
            status_code=400,
            detail="Text is empty"
        )

    filepath = await voice_service.generate_voice(
        text,
        lang
    )

    if not filepath:

        raise HTTPException(
            status_code=500,
            detail="Voice generation failed"
        )

    return {
        "audio_url": filepath
    }