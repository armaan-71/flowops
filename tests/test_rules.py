import pytest
from sqlmodel import Session, create_engine, SQLModel
from app.models import Invoice
from app.services.rules import ApprovalRuleEngine
from datetime import datetime

# In-memory SQLite for testing
engine = create_engine("sqlite://")

@pytest.fixture(name="session")
def session_fixture():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine)

def test_evaluate_ready(session: Session):
    invoice = Invoice(
        vendor_name="Test Vendor",
        total_amount=500.0,
        tax_amount=50.0,
        date="2024-01-01",
        confidence_score=0.9
    )
    evaluated = ApprovalRuleEngine.evaluate(invoice, session)
    assert evaluated.status == "ready"
    assert "successfully" in evaluated.message.lower()

def test_evaluate_low_confidence(session: Session):
    invoice = Invoice(
        vendor_name="Test Vendor",
        total_amount=500.0,
        tax_amount=50.0,
        date="2024-01-01",
        confidence_score=0.7
    )
    evaluated = ApprovalRuleEngine.evaluate(invoice, session)
    assert evaluated.status == "needs review"
    assert "confidence" in evaluated.message.lower()

def test_evaluate_high_amount(session: Session):
    invoice = Invoice(
        vendor_name="Test Vendor",
        total_amount=1500.0,
        tax_amount=150.0,
        date="2024-01-01",
        confidence_score=0.9
    )
    evaluated = ApprovalRuleEngine.evaluate(invoice, session)
    assert evaluated.status == "needs review"
    assert "exceeds" in evaluated.message.lower()

def test_evaluate_duplicate(session: Session):
    # First invoice
    invoice1 = Invoice(
        vendor_name="Test Vendor",
        total_amount=500.0,
        tax_amount=50.0,
        date="2024-01-01",
        confidence_score=0.9
    )
    session.add(invoice1)
    session.commit()

    # Second identical invoice
    invoice2 = Invoice(
        vendor_name="Test Vendor",
        total_amount=500.0,
        tax_amount=50.0,
        date="2024-01-01",
        confidence_score=0.9
    )
    evaluated = ApprovalRuleEngine.evaluate(invoice2, session)
    assert evaluated.status == "duplicate suspected"
    assert "duplicate" in evaluated.message.lower()
