from sqlmodel import Field, SQLModel
from typing import Optional
from datetime import datetime

class InvoiceBase(SQLModel):
    vendor_name: str
    total_amount: float
    tax_amount: float
    date: str
    confidence_score: float

class Invoice(InvoiceBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    status: str = Field(default="pending")  # pending, ready, needs review, duplicate suspected
    message: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceRead(InvoiceBase):
    id: int
    status: str
    message: Optional[str]
    created_at: datetime
