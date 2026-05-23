import os
import re
from google import genai
from langdetect import detect

GEMINI_API_CHAT_KEY = os.getenv(
    "GEMINI_API_CHAT_KEY"
)


class DocumentAIService:

    def __init__(self):

        self.client = None

        try:
            if GEMINI_API_CHAT_KEY:

                self.client = genai.Client(
                    api_key=GEMINI_API_CHAT_KEY
                )

                print(
                    "✅ Document AI initialized"
                )

            else:
                print(
                    "❌ Gemini API key missing"
                )

        except Exception as e:
            print(
                "Document AI init error:",
                e
            )

    # ==========================================
    # CLEAN DOCUMENT TEXT
    # ==========================================

    def clean_text(self, text: str):

        if not text:
            return ""

        # remove extra spaces
        text = re.sub(
            r"\s+",
            " ",
            text
        )

        # remove repeated lines
        text = re.sub(
            r"(\b\w+\b)( \1\b)+",
            r"\1",
            text
        )

        # remove weird symbols
        text = text.replace("*", "")
        text = text.replace("#", "")
        text = text.replace("•", "")

        return text.strip()

    # ==========================================
    # LIMIT HUGE DOCUMENT SIZE
    # ==========================================

    def shorten_text(
        self,
        text: str,
        limit: int = 12000
    ):

        if len(text) <= limit:
            return text

        return text[:limit]

    # ==========================================
    # REMOVE BAD FORMATTING
    # ==========================================

    def clean_response(
        self,
        response_text: str
    ):

        if not response_text:
            return "Summary unavailable."

        # remove stars
        response_text = response_text.replace(
            "*",
            ""
        )

        # remove markdown
        response_text = response_text.replace(
            "#",
            ""
        )

        # remove extra blank lines
        response_text = re.sub(
            r"\n{3,}",
            "\n\n",
            response_text
        )

        return response_text.strip()

    # ==========================================
    # MAIN ANALYSIS
    # ==========================================

    async def analyze_document(
        self,
        text: str
    ):

        try:

            if not self.client:
                return (
                    "AI unavailable",
                    "en"
                )

            # ======================================
            # CLEAN INPUT
            # ======================================

            text = self.clean_text(text)

            text = self.shorten_text(text)

            # ======================================
            # DETECT LANGUAGE
            # ======================================

            try:
                lang = detect(text)

            except:
                lang = "en"

            language_map = {
                "hi": "Hindi",
                "mr": "Marathi",
                "en": "English",
            }

            response_language = (
                language_map.get(
                    lang,
                    "English"
                )
            )

            # ======================================
            # IMPROVED PROMPT
            # ======================================

            prompt = f"""
You are NyaySathi AI legal assistant for Indian citizens.

Analyze the legal document carefully.

IMPORTANT RULES:

1. Respond ONLY in {response_language}

2. Use the SAME language as the document

3. Keep response SIMPLE and EASY

4. DO NOT use markdown symbols:
- no *
- no #
- no bullet symbols

5. DO NOT give long explanations

6. Keep every section short

7. Use clean formatting

8. Never mention:
- AI
- analysis
- technical details
- assumptions

9. If contact details are unavailable,
write:
"Not mentioned in document"

10. If legal information is unclear,
say:
"Information not clearly available"

=================================

Provide EXACTLY these sections:

Situation

Key Legal Points

What You Should Do

What You Should Not Do

Contact Details

=================================

Keep answers concise.

Document:
{text}
"""

            # ======================================
            # FAST MODEL RESPONSE
            # ======================================

            response = (
                self.client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
            )

            final_text = (
                self.clean_response(
                    response.text
                )
            )

            return final_text, lang

        except Exception as e:

            print(
                "Document AI error:",
                e
            )

            return (
                "Document summary failed",
                "en"
            )


document_ai_service = (
    DocumentAIService()
)