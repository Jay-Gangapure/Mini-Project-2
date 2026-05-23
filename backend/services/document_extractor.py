import fitz
import pytesseract
from PIL import Image
import io

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Users\jgang\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"
)

def extract_text_from_pdf(pdf_path: str):

    text = ""

    try:
        doc = fitz.open(pdf_path)

        for page in doc:

            page_text = page.get_text()

            # NORMAL TEXT PDF
            if page_text.strip():
                text += page_text + "\n"

            # SCANNED PDF
            else:
                pix = page.get_pixmap()

                img_bytes = pix.tobytes("png")

                image = Image.open(
                    io.BytesIO(img_bytes)
                )

                ocr_text = pytesseract.image_to_string(
                    image,
                    lang="eng+hin+mar"
                )

                text += ocr_text + "\n"

        return text.strip()

    except Exception as e:
        print("PDF EXTRACTION ERROR:", e)
        return ""