import fitz
import os
from app.services.pdf_service import extract_text

def create_sample_pdf(file_path: str, text: str):
    """Creates a simple PDF with the given text using PyMuPDF."""
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((50, 50), text)
    doc.save(file_path)
    doc.close()

def test_pdf_extraction():
    test_pdf = "/tmp/test_invoice.pdf"
    test_content = "Invoice #12345\nVendor: Acme Corp\nTotal: $1,250.00"
    
    print(f"--- Creating sample PDF at {test_pdf} ---")
    create_sample_pdf(test_pdf, test_content)
    
    with open(test_pdf, "rb") as f:
        pdf_bytes = f.read()
    
    print("--- Running extraction ---")
    extracted_text = extract_text(pdf_bytes)
    
    print("--- Results ---")
    print(f"Expected content: {test_content}")
    print(f"Extracted content:\n{extracted_text}")
    
    assert "Invoice #12345" in extracted_text
    assert "Acme Corp" in extracted_text
    assert "$1,250.00" in extracted_text
    
    print("\nSUCCESS: Text extraction verified!")
    
    # Cleanup
    if os.path.exists(test_pdf):
        os.remove(test_pdf)

if __name__ == "__main__":
    try:
        test_pdf_extraction()
    except Exception as e:
        print(f"FAILURE: {str(e)}")
        exit(1)
