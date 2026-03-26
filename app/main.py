from fastapi import FastAPI, HTTPException
from typing import List
from .schemas import InvoiceResponse, UploadResponse

app = FastAPI(title="FlowOps API")

@app.post("/api/invoices/upload", response_model=UploadResponse)
async def upload_invoice() -> UploadResponse:
    """
    Upload an invoice for processing.
    Currently a shell endpoint establishing the contract.
    """
    raise HTTPException(status_code=501, detail="Not implemented")

@app.get("/api/invoices", response_model=List[InvoiceResponse])
async def get_invoices() -> List[InvoiceResponse]:
    """
    Retrieve a list of invoices.
    Currently a shell endpoint establishing the contract.
    """
    raise HTTPException(status_code=501, detail="Not implemented")
