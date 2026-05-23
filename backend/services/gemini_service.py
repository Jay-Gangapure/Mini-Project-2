from google import genai
from utils.config import settings

genai.configure(api_key=settings.GEMINI_API_CHAT_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")

def ask_gemini(prompt: str):
    response = model.generate_content(prompt)
    return response.text