"""
NyaySathi - Main Backend
"""

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import time
from routes import voice
from database.connection import connect_db, disconnect_db

from routes import (
    auth,
    situations,
    ai_interpret,
    documents,
    directory,
    users,
)

from routes.ai_chat import router as ai_chat_router


# =========================================================
# DATABASE LIFESPAN
# =========================================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    print("Starting NyaySathi Backend...")

    await connect_db()

    print("Database connected successfully.")

    yield

    await disconnect_db()

    print("Database disconnected.")


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="NyaySathi API",
    version="1.0.0",
    lifespan=lifespan
)

# =========================================================
# CORS CONFIGURATION
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# REQUEST LOGGER
# =========================================================

@app.middleware("http")
async def log_requests(request: Request, call_next):

    start_time = time.time()

    print("\n==============================")
    print(f"REQUEST: {request.method} {request.url}")
    print(f"CLIENT: {request.client.host}")
    print("==============================")

    response = await call_next(request)

    process_time = time.time() - start_time

    print(f"STATUS CODE: {response.status_code}")
    print(f"TIME TAKEN: {process_time:.2f}s")
    print("==============================\n")

    return response


# =========================================================
# ROUTES
# =========================================================

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])

app.include_router(users.router, prefix="/users", tags=["Users"])

app.include_router(
    situations.router,
    prefix="/situations",
    tags=["Situations"]
)

app.include_router(
    documents.router,
    prefix="/documents",
    tags=["Documents"]
)

app.include_router(
    directory.router,
    prefix="/directory",
    tags=["Legal Directory"]
)

app.include_router(
    ai_chat_router,
    prefix="/ai",
    tags=["AI Chat"]
)
app.include_router(
    voice.router, 
    prefix="/voice",
    tags=["Voice"]
)


# =========================================================
# HEALTH ROUTES
# =========================================================

@app.get("/")
async def root():
    return {
        "success": True,
        "message": "NyaySathi Backend Running Successfully"
    }


@app.get("/health")
async def health():
    return {
        "success": True,
        "status": "healthy"
    }