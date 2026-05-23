"""
Legal Directory route.

GET /directory                      → all helplines, NGOs, legal contacts
GET /directory/helplines            → only helplines
GET /directory/ngos                 → only NGOs
GET /directory/legal-contacts       → only legal contacts
GET /directory/search?q=keyword     → search across all entries
PROTECTED (JWT required).
"""

from fastapi import APIRouter, Depends, Query

from auth.jwt_handler import get_current_user_id
from services.directory_data import LEGAL_DIRECTORY
from utils.responses import success_response

router = APIRouter()


# ---------------------------------------------------------------------------
# GET /directory — full directory
# ---------------------------------------------------------------------------
@router.get("")
async def get_full_directory(_: str = Depends(get_current_user_id)):
    """Return complete legal directory: helplines, NGOs, and legal contacts."""
    return success_response(
        data={
            "total_helplines": len(LEGAL_DIRECTORY["helplines"]),
            "total_ngos": len(LEGAL_DIRECTORY["ngos"]),
            "total_legal_contacts": len(LEGAL_DIRECTORY["legal_contacts"]),
            **LEGAL_DIRECTORY,
        }
    )


# ---------------------------------------------------------------------------
# GET /directory/helplines
# ---------------------------------------------------------------------------
@router.get("/helplines")
async def get_helplines(_: str = Depends(get_current_user_id)):
    """Return only emergency and legal helpline numbers."""
    return success_response(
        data={
            "total": len(LEGAL_DIRECTORY["helplines"]),
            "helplines": LEGAL_DIRECTORY["helplines"],
        }
    )


# ---------------------------------------------------------------------------
# GET /directory/ngos
# ---------------------------------------------------------------------------
@router.get("/ngos")
async def get_ngos(_: str = Depends(get_current_user_id)):
    """Return NGOs that provide legal assistance."""
    return success_response(
        data={
            "total": len(LEGAL_DIRECTORY["ngos"]),
            "ngos": LEGAL_DIRECTORY["ngos"],
        }
    )


# ---------------------------------------------------------------------------
# GET /directory/legal-contacts
# ---------------------------------------------------------------------------
@router.get("/legal-contacts")
async def get_legal_contacts(_: str = Depends(get_current_user_id)):
    """Return courts, commissions, and formal legal bodies."""
    return success_response(
        data={
            "total": len(LEGAL_DIRECTORY["legal_contacts"]),
            "legal_contacts": LEGAL_DIRECTORY["legal_contacts"],
        }
    )


# ---------------------------------------------------------------------------
# GET /directory/search?q=...
# ---------------------------------------------------------------------------
@router.get("/search")
async def search_directory(
    q: str = Query(..., min_length=2, description="Search keyword"),
    _: str = Depends(get_current_user_id),
):
    """Search across all directory entries by keyword."""
    keyword = q.lower().strip()
    results: dict = {"helplines": [], "ngos": [], "legal_contacts": []}

    # Search helplines
    for entry in LEGAL_DIRECTORY["helplines"]:
        searchable = " ".join([
            entry.get("name", ""),
            entry.get("description", ""),
            entry.get("number", ""),
        ]).lower()
        if keyword in searchable:
            results["helplines"].append(entry)

    # Search NGOs
    for entry in LEGAL_DIRECTORY["ngos"]:
        focus_str = " ".join(entry.get("focus", []))
        searchable = " ".join([
            entry.get("name", ""),
            entry.get("description", ""),
            entry.get("city", ""),
            focus_str,
        ]).lower()
        if keyword in searchable:
            results["ngos"].append(entry)

    # Search legal contacts
    for entry in LEGAL_DIRECTORY["legal_contacts"]:
        searchable = " ".join([
            entry.get("name", ""),
            entry.get("description", ""),
            entry.get("how_to_reach", ""),
        ]).lower()
        if keyword in searchable:
            results["legal_contacts"].append(entry)

    total = sum(len(v) for v in results.values())

    return success_response(
        data={
            "query": q,
            "total_results": total,
            **results,
        },
        message=f"Found {total} result(s) for '{q}'.",
    )
