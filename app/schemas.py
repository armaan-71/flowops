from pydantic import BaseModel
from typing import Optional

class InvoiceResponse(BaseModel):
    id: str
    status: str
    message: Optional[str] = None

class UploadResponse(BaseModel):
    upload_id: str
    status: str
