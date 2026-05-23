import os
from gtts import gTTS
import uuid

class VoiceService:
    def __init__(self, upload_dir: str = "static/audio"):
        self.upload_dir = upload_dir
        if not os.path.exists(self.upload_dir):
            os.makedirs(self.upload_dir)

    def generate_voice(self, text: str, lang: str = 'en') -> str:
        """
        Generates an MP3 file from text.
        Returns the path to the generated file.
        """
        # Map common lang codes to gTTS supported codes
        lang_map = {
            'en': 'en',
            'hi': 'hi',
            'mr': 'mr'
        }
        gtts_lang = lang_map.get(lang[:2], 'en')
        
        filename = f"{uuid.uuid4()}.mp3"
        filepath = os.path.join(self.upload_dir, filename)
        
        tts = gTTS(text=text, lang=gtts_lang)
        tts.save(filepath)
        
        return f"/static/audio/{filename}"

voice_service = VoiceService()
