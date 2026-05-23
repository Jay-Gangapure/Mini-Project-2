from langdetect import detect, DetectorFactory

# Set seed for consistent results
DetectorFactory.seed = 0

def detect_language(text: str) -> str:
    """
    Detects the language of the input text.
    Returns 'en', 'hi', or 'mr'. Default is 'en'.
    """
    try:
        lang = detect(text)
        if lang in ['hi', 'mr', 'en']:
            return lang
        return 'en'
    except Exception:
        return 'en'
