# rag/convert_to_md.py

import pymupdf4llm
import os

def convert_pdf_to_md(pdf_path: str, output_path: str):
    print(f"Converting: {pdf_path}")
    
    # Extract text with structure preserved
    md_text = pymupdf4llm.to_markdown(pdf_path)
    
    # Save as .md file
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(md_text)
    
    print(f"✅ Saved to: {output_path}")

def convert_all_pdfs(input_dir: str):
    for filename in os.listdir(input_dir):
        if filename.endswith(".pdf"):
            pdf_path = os.path.join(input_dir, filename)
            md_filename = filename.replace(".pdf", ".md")
            output_path = os.path.join(input_dir, md_filename)
            convert_pdf_to_md(pdf_path, output_path)

# Run it
if __name__ == "__main__":
    convert_all_pdfs("data/legal")