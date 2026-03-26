import sys
import os
from sqlmodel import Session, create_engine, SQLModel

# Add the project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.models import Invoice
from app.services.rules import ApprovalRuleEngine

def run_test():
    # In-memory SQLite for testing
    engine = create_engine("sqlite://")
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        # Test Case 1: Ready
        invoice_ready = Invoice(
            vendor_name="Normal Vendor",
            total_amount=500.0,
            tax_amount=50.0,
            date="2024-03-26",
            confidence_score=0.9
        )
        evaluated = ApprovalRuleEngine.evaluate(invoice_ready, session)
        print(f"Test 1 (Ready): Status={evaluated.status}, Msg={evaluated.message}")
        assert evaluated.status == "ready"

        # Test Case 2: Low Confidence
        invoice_low_conf = Invoice(
            vendor_name="Low Conf Vendor",
            total_amount=500.0,
            tax_amount=50.0,
            date="2024-03-26",
            confidence_score=0.7
        )
        evaluated = ApprovalRuleEngine.evaluate(invoice_low_conf, session)
        print(f"Test 2 (Low Confidence): Status={evaluated.status}, Msg={evaluated.message}")
        assert evaluated.status == "needs review"

        # Test Case 3: High Amount
        invoice_high_amt = Invoice(
            vendor_name="Rich Vendor",
            total_amount=1500.0,
            tax_amount=150.0,
            date="2024-03-26",
            confidence_score=0.9
        )
        evaluated = ApprovalRuleEngine.evaluate(invoice_high_amt, session)
        print(f"Test 3 (High Amount): Status={evaluated.status}, Msg={evaluated.message}")
        assert evaluated.status == "needs review"

        # Test Case 4: Duplicate
        # Persist a previous invoice
        invoice_prev = Invoice(
            vendor_name="Duplicate Vendor",
            total_amount=100.0,
            tax_amount=10.0,
            date="2024-03-26",
            confidence_score=1.0
        )
        session.add(invoice_prev)
        session.commit()

        invoice_dup = Invoice(
            vendor_name="Duplicate Vendor",
            total_amount=100.0,
            tax_amount=10.0,
            date="2024-03-26",
            confidence_score=1.0
        )
        evaluated = ApprovalRuleEngine.evaluate(invoice_dup, session)
        print(f"Test 4 (Duplicate): Status={evaluated.status}, Msg={evaluated.message}")
        assert evaluated.status == "duplicate suspected"

    print("\n--- All Rule Engine Tests Passed! ---")

if __name__ == "__main__":
    run_test()
