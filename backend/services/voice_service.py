from gtts import gTTS
import uuid
import os


class VoiceService:

    async def generate_voice(self, text: str, lang="en"):

        try:

            os.makedirs("audio", exist_ok=True)

            filename = f"{uuid.uuid4()}.mp3"

            filepath = f"audio/{filename}"

            tts = gTTS(
                text=text,
                lang=lang,
                slow=False
            )

            tts.save(filepath)

            return filepath

        except Exception as e:

            print("Voice generation failed:", e)

            return None


voice_service = VoiceService()