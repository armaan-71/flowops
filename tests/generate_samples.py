import fitz
import os

def create_sample_pdf(file_path, text):
    doc = fitz.open()
    page = doc.new_page()
    # Insert text with some basic formatting simulation
    page.insert_text((50, 50), text, fontsize=12)
    doc.save(file_path)
    doc.close()

samples = [
    {
        "name": "invoice_acme.pdf",
        "content": "INVOICE #INV-001\nDate: 2024-03-20\nVendor: Acme Corporation\nDescription: Cloud Services Subscription\nTotal Amount: €1,250.00\nTax (21%): €262.50\nNet Total: €1,512.50"
    },
    {
        "name": "invoice_globex.pdf",
        "content": "INVOICE #2024-99\nDate: 2024-03-22\nVendor: Globex Corp\nItems: Office Furniture\nTotal: €850.00\nTax: €178.50"
    }
]

os.makedirs("tests/samples", exist_ok=True)
for sample in samples:
    path = os.path.join("tests/samples", sample["name"])
    create_sample_pdf(path, sample["content"])
    print(f"Created {path}")
