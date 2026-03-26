from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from typing import List
from sqlmodel import Session, select
from .database import create_db_and_tables, get_session
from .models import Invoice, InvoiceRead
from .services.extraction_service import ExtractionService
from .services.pdf_service import extract_text
from .services.rules import ApprovalRuleEngine

app = FastAPI(title="FlowOps API")

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.post("/api/invoices/upload", response_model=InvoiceRead)
async def upload_invoice(
    file: UploadFile = File(...), 
    session: Session = Depends(get_session)
) -> Invoice:
    """
    Upload an invoice, extract data, evaluate rules, and save to DB.
    """
    # 1. Read PDF
    try:
        content = await file.read()
        text = extract_text(content)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process PDF: {str(e)}")

    # 2. Extract Data
    extraction_service = ExtractionService()
    extraction = extraction_service.extract(text)

    # 3. Create Invoice Model
    new_invoice = Invoice(
        vendor_name=extraction.vendor_name,
        total_amount=extraction.total_amount,
        tax_amount=extraction.tax_amount,
        date=extraction.date,
        confidence_score=extraction.confidence_score
    )

    # 4. Evaluate Rules
    new_invoice = ApprovalRuleEngine.evaluate(new_invoice, session)

    # 5. Save to DB
    session.add(new_invoice)
    session.commit()
    session.refresh(new_invoice)

    return new_invoice

@app.get("/api/invoices", response_model=List[InvoiceRead])
async def get_invoices(session: Session = Depends(get_session)) -> List[Invoice]:
    """
    Retrieve a list of invoices from the database.
    """
    invoices = session.exec(select(Invoice)).all()
    return invoices
