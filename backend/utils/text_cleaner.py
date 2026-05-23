import re

def clean_extracted_text(text: str):

    # remove extra spaces
    text = re.sub(r"\s+", " ", text)

    # remove weird symbols
    text = re.sub(r"[^\w\s.,:;!?()/%-]", "", text)

    return text.strip()