"""
User management routes — GET /users/me, PATCH /users/me
All routes are PROTECTED (JWT required).
"""

from bson import ObjectId
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel

from database.connection import get_db
from auth.jwt_handler import get_current_user_id
from utils.responses import success_response

router = APIRouter()

VALID_LANGUAGES = {"en", "hi", "mr"}


class UpdateProfileRequest(BaseModel):
    name: str | None = None
    preferred_language: str | None = None


def _user_to_dict(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "name": doc["name"],
        "email": doc["email"],
        "preferred_language": doc.get("preferred_language", "en"),
        "created_at": doc["created_at"],
    }


# ---------------------------------------------------------------------------
# GET /users/me
# ---------------------------------------------------------------------------
@router.get("/me")
async def get_my_profile(
    user_id: str = Depends(get_current_user_id),
    db=Depends(get_db),
):
    """Return the profile of the currently authenticated user."""
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    return success_response(data=_user_to_dict(user))


# ---------------------------------------------------------------------------
# PATCH /users/me
# ---------------------------------------------------------------------------
@router.patch("/me")
async def update_my_profile(
    payload: UpdateProfileRequest,
    user_id: str = Depends(get_current_user_id),
    db=Depends(get_db),
):
    """Update name or preferred language of the authenticated user."""
    updates: dict = {}

    if payload.name is not None:
        if len(payload.name.strip()) < 2:
            raise HTTPException(status_code=400, detail="Name must be at least 2 characters.")
        updates["name"] = payload.name.strip()

    if payload.preferred_language is not None:
        lang = payload.preferred_language.lower()
        if lang not in VALID_LANGUAGES:
            raise HTTPException(
                status_code=400,
                detail=f"preferred_language must be one of: {', '.join(VALID_LANGUAGES)}",
            )
        updates["preferred_language"] = lang

    if not updates:
        raise HTTPException(status_code=400, detail="No valid fields provided for update.")

    await db.users.update_one({"_id": ObjectId(user_id)}, {"$set": updates})
    user = await db.users.find_one({"_id": ObjectId(user_id)})

    return success_response(data=_user_to_dict(user), message="Profile updated successfully.")
