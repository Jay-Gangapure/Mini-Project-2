from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from passlib.context import CryptContext

from database.connection import get_db
from models.user import UserSignupRequest, UserLoginRequest
from auth.jwt_handler import create_access_token
from utils.responses import success_response

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

VALID_LANGUAGES = {"en", "hi", "mr"}


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def _user_doc_to_public(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "name": doc["name"],
        "email": doc["email"],
        "preferred_language": doc.get("preferred_language", "en"),
        "created_at": doc["created_at"],
    }


# ***REMOVED******REMOVED***=== SIGNUP ***REMOVED******REMOVED***===
@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(payload: UserSignupRequest, db=Depends(get_db)):

    lang = payload.preferred_language.lower()
    if lang not in VALID_LANGUAGES:
        raise HTTPException(status_code=400, detail="Invalid language")

    existing = await db.users.find_one({"email": payload.email.lower()})
    if existing:
        raise HTTPException(status_code=409, detail="Email already exists")

    user_doc = {
        "name": payload.name.strip(),
        "email": payload.email.lower(),
        "password_hash": hash_password(payload.password),
        "preferred_language": lang,
        "created_at": datetime.utcnow(),
    }

    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    token = create_access_token({"sub": str(result.inserted_id)})

    return success_response(
        data={
            "access_token": token,
            "token_type": "bearer",
            "user": _user_doc_to_public(user_doc),
        },
        message="Signup successful",
    )


# ***REMOVED******REMOVED***=== LOGIN ***REMOVED******REMOVED***===
@router.post("/login")
async def login(payload: UserLoginRequest, db=Depends(get_db)):

    user = await db.users.find_one({"email": payload.email.lower()})

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    if not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Wrong password")

    token = create_access_token({"sub": str(user["_id"])})

    return success_response(
        data={
            "access_token": token,
            "token_type": "bearer",
            "user": _user_doc_to_public(user),
        },
        message="Login successful",
    )