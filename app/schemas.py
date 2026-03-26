from pydantic import BaseModel
from typing import Optional

class ExtractionResult(BaseModel):
    vendor_name: str
    total_amount: float
    tax_amount: float
    date: str
    confidence_score: float

class InvoiceResponse(BaseModel):
    id: str
    status: str
    message: Optional[str] = None
    extraction: Optional[ExtractionResult] = None

class UploadResponse(BaseModel):
    upload_id: str
    status: str
