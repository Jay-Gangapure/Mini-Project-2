import os
import re
from pdf_to_text import extract_pdf_text

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

PDF_FOLDER = os.path.join(BASE_DIR, "pdfs")
OUTPUT_FOLDER = os.path.join(BASE_DIR, "data", "legal")


# ---------- CLEAN TEXT ----------
def clean_legal_text(text):
    text = re.sub(r"\n+", "\n", text)
    text = re.sub(r"\s+", " ", text)

    # Remove headers
    text = re.sub(r"THE GAZETTE OF INDIA.*?\n", "", text, flags=re.IGNORECASE)
    text = re.sub(r"MINISTRY OF .*?\n", "", text, flags=re.IGNORECASE)

    # Remove page numbers
    text = re.sub(r"\n?\s*\d+\s*\n", "\n", text)

    return text.strip()


# ---------- EXTRACT SECTIONS ----------
def extract_sections(text):
    sections = re.split(r"Section\s+\d+|CHAPTER\s+[IVX]+", text)
    return [s.strip() for s in sections if len(s.strip()) > 100]


# ---------- FILTER ----------
def is_useful(text):
    keywords = [
        "shall", "must", "fine", "penalty",
        "license", "helmet", "police", "vehicle"
    ]
    return any(k in text.lower() for k in keywords)


# ---------- PROCESS PDF ----------
def process_pdf(pdf_path, output_path):
    print(f"📄 Processing: {pdf_path}")

    raw = extract_pdf_text(pdf_path)
    clean = clean_legal_text(raw)

    sections = extract_sections(clean)
    sections = [s for s in sections if is_useful(s)]

    final_text = "\n\n## ".join(sections)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(final_text)

    print(f"✅ Saved: {output_path}")


# ---------- MAIN ----------
def main():
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)

    for file in os.listdir(PDF_FOLDER):
        if file.endswith(".pdf"):
            input_path = os.path.join(PDF_FOLDER, file)
            output_path = os.path.join(
                OUTPUT_FOLDER,
                file.replace(".pdf", ".md")
            )

            process_pdf(input_path, output_path)


if __name__ == "__main__":
    main()