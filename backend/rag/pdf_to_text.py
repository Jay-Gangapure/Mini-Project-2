import fitz  # PyMuPDF

def extract_pdf_text(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""

    for page in doc:
        text += page.get_text()

    return text


# Test
if __name__ == "__main__":
    sample = extract_pdf_text("pdfs/motor_act.pdf")
    print(sample[:1000])