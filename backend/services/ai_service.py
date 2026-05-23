import os
from google import genai
import numpy as np
GEMINI_API_CHAT_KEY = os.getenv("GEMINI_API_CHAT_KEY")


class GeminiService:

    def __init__(self):

        self.client = None

        try:
            if GEMINI_API_CHAT_KEY:
                self.client = genai.Client(
                    api_key=GEMINI_API_CHAT_KEY
                )

                print("✅ Gemini initialized")

            else:
                print("❌ Gemini API key missing")

        except Exception as e:
            print("Gemini init error:", e)

    async def generate_response(self, prompt: str):

        try:

            if not self.client:
                return None

            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )

            return response.text

        except Exception as e:
            print("Gemini API failure:", e)
            return None


ai_service = GeminiService()