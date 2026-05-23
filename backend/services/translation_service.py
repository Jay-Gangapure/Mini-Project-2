from google import genai
from utils.config import settings

client = genai.Client(
    api_key=settings.GEMINI_API_DOC_KEY
)


class TranslationService:

    async def translate_text(self, text: str, lang: str):

        try:

            if lang == "en":
                return text

            lang_map = {
                "hi": "Hindi",
                "mr": "Marathi"
            }

            target_lang = lang_map.get(lang, "English")

            prompt = f"""
Translate this into {target_lang}.

Return ONLY translated text.

Text:
{text}
"""

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )

            return response.text

        except Exception as e:

            print("Translation Error:", e)

            return text


translation_service = TranslationService()