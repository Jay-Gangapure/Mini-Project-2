import os
import uuid
import base64
import PyPDF2
from google.genai import types
from io import BytesIO
from datetime import datetime

from fastapi import (
    APIRouter,
    File,
    UploadFile,
    HTTPException,
    status,
    Depends
)

from auth.jwt_handler import get_current_user_id
from utils.responses import success_response

from services.document_ai_service import document_ai_service

from google import genai

router = APIRouter()

# -----------------------------------------
# Gemini Client
# -----------------------------------------

client = genai.Client(
    api_key=os.getenv("GEMINI_API_DOC_KEY")
)

# -----------------------------------------
# Constants
# -----------------------------------------

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

ALLOWED_MIME_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
}

# -----------------------------------------
# Extract Text
# -----------------------------------------

def extract_text(file_bytes, content_type):

    text = ""

    try:

        # ---------------- PDF ----------------

        if content_type == "application/pdf":

            reader = PyPDF2.PdfReader(BytesIO(file_bytes))

            for page in reader.pages:

                page_text = page.extract_text()

                if page_text:
                    text += page_text

            # OCR fallback if PDF has no selectable text

            if not text.strip():

                try:

                    response = client.models.generate_content(
                        model="gemini-2.5-flash",
                        contents=[
                            "Extract all text from this PDF exactly as written.",
                            types.Part.from_bytes(
                                data=file_bytes,
                                mime_type="application/pdf",
                            ),
                        ],
                    )

                    if hasattr(response, "text") and response.text:
                        text = response.text

                except Exception as e:
                    print("PDF OCR Error:", e)

        # ---------------- TXT ----------------

        elif content_type == "text/plain":

            text = file_bytes.decode(
                "utf-8",
                errors="ignore"
            )

        # ---------------- DOC/DOCX ----------------

        elif content_type in [
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ]:

            from docx import Document

            doc = Document(BytesIO(file_bytes))

            for para in doc.paragraphs:

                if para.text:
                    text += para.text + "\n"

        # ---------------- IMAGE OCR ----------------

        elif content_type.startswith("image/"):

            try:

                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=[
                        "Extract all visible text from this image exactly as written.",
                        types.Part.from_bytes(
                            data=file_bytes,
                            mime_type=content_type,
                        ),
                    ],
                )

                text = ""

                # METHOD 1
                if hasattr(response, "text") and response.text:
                    text = response.text.strip()

                # METHOD 2
                elif (
                    hasattr(response, "candidates")
                    and response.candidates
                    and response.candidates[0].content
                    and response.candidates[0].content.parts
                ):

                    extracted_parts = []

                    for part in response.candidates[0].content.parts:

                        if hasattr(part, "text") and part.text:
                            extracted_parts.append(part.text)

                    text = "\n".join(extracted_parts).strip()

                print("\n========== OCR TEXT ==========")
                print(text[:1000])

            except Exception as e:
                print("Image OCR Error:", e)
                text = ""

        return text or ""

    except Exception as e:
        print(f"Error extracting text: {e}")
        return ""

# -----------------------------------------
# Upload Route
# -----------------------------------------

@router.post(
    "/upload",
    status_code=status.HTTP_201_CREATED
)

async def upload_document(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user_id),
):

    content_type = file.content_type or ""

    # Validate type

    if content_type not in ALLOWED_MIME_TYPES:

        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Unsupported file type."
        )

    # Read file

    contents = await file.read()

    file_size = len(contents)

    if file_size == 0:

        raise HTTPException(
            status_code=400,
            detail="Empty file."
        )

    if file_size > MAX_FILE_SIZE_BYTES:

        raise HTTPException(
            status_code=413,
            detail="File too large."
        )

    # Metadata

    doc_id = str(uuid.uuid4())

    filename = file.filename or "unknown"

    ext = os.path.splitext(filename)[-1].lower()

    size_kb = round(file_size / 1024, 2)

    # -----------------------------------------
    # Extract Text
    # -----------------------------------------

    extracted_text = extract_text(
        contents,
        content_type
    )

    print("\n========== EXTRACTED TEXT ==========")
    print(extracted_text[:1000])

    if not extracted_text or len(extracted_text.strip()) < 20:

        raise HTTPException(
            status_code=400,
            detail="No meaningful text found in document."
        )

    # -----------------------------------------
    # AI Analysis
    # -----------------------------------------

    ai_analysis, lang = await document_ai_service.analyze_document(
        extracted_text
    )

    print("\n========== AI ANALYSIS ==========")
    print(ai_analysis[:1000])

    summary = (
        ai_analysis[:300] + "..."
        if ai_analysis
        else ""
    )

    # -----------------------------------------
    # Response
    # -----------------------------------------

    return success_response(
        data={
            "document_id": doc_id,
            "original_filename": filename,
            "file_extension": ext,
            "content_type": content_type,
            "size_kb": size_kb,
            "uploaded_by": user_id,
            "uploaded_at": datetime.utcnow().isoformat() + "Z",
            "status": "analysed",
            "analysis": ai_analysis,
            "summary": summary,
            "language": lang,
            "disclaimer": "This is AI-generated analysis and not legal advice.",
        },
        message="Document uploaded and analysed successfully.",
    )

# -----------------------------------------
# Supported Types
# -----------------------------------------

@router.get("/supported-types")

async def get_supported_file_types(
    user_id: str = Depends(get_current_user_id)
):

    return success_response(
        data={
            "supported_mime_types": list(ALLOWED_MIME_TYPES),
            "supported_extensions": [
                ".pdf",
                ".jpg",
                ".jpeg",
                ".png",
                ".webp",
                ".doc",
                ".docx",
                ".txt"
            ],
            "max_size_mb": 10,
        }
    )