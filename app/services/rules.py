from sqlmodel import Session, select
from ..models import Invoice
from typing import Optional

class ApprovalRuleEngine:
    @staticmethod
    def check_duplicate(invoice: Invoice, session: Session) -> bool:
        """
        IF duplicate (same vendor, amount, date) -> duplicate suspected.
        """
        statement = select(Invoice).where(
            Invoice.vendor_name == invoice.vendor_name,
            Invoice.total_amount == invoice.total_amount,
            Invoice.date == invoice.date
        )
        if invoice.id:
            statement = statement.where(Invoice.id != invoice.id)
            
        results = session.exec(statement).all()
        return len(results) > 0

    @classmethod
    def evaluate(cls, invoice: Invoice, session: Session) -> Invoice:
        """
        Evaluates the structured invoice data:
        - IF duplicate (same vendor, amount, date) -> duplicate suspected.
        - IF confidence < 0.8 OR amount > 1000 -> needs review.
        - ELSE -> ready.
        """
        # Rule 1: Duplicate Check
        if cls.check_duplicate(invoice, session):
            invoice.status = "duplicate suspected"
            invoice.message = "Duplicate invoice detected with same vendor, amount, and date."
            return invoice

        # Rule 2: Confidence level and amount threshold
        if invoice.confidence_score < 0.8:
            invoice.status = "needs review"
            invoice.message = f"Low extraction confidence score: {invoice.confidence_score}"
        elif invoice.total_amount > 1000:
            invoice.status = "needs review"
            invoice.message = f"Amount {invoice.total_amount} exceeds automatic approval threshold (1000)."
        else:
            invoice.status = "ready"
            invoice.message = "Invoice successfully validated."

        return invoice
