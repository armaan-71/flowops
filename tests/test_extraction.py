import sys
import os

# Add the project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.extraction_service import ExtractionService

def test_mock_extraction():
    service = ExtractionService()
    
    sample_text = """
    ACME Corporation
    123 Main St, Anytown, USA
    
    Invoice #12345
    Date: 2024-03-26
    
    Item Description          Qty    Price    Total
    --------------------------------------------------
    Cloud Services             1    $100.00   $100.00
    
    Subtotal: $100.00
    Tax: $21.00
    Total: $121.00
    """
    
    print("Testing Mock Extraction...")
    result = service.extract(sample_text)
    
    print(f"Vendor: {result.vendor_name}")
    print(f"Total Amount: {result.total_amount}")
    print(f"Tax Amount: {result.tax_amount}")
    print(f"Date: {result.date}")
    print(f"Confidence: {result.confidence_score}")
    
    assert "ACME" in result.vendor_name
    assert result.total_amount == 121.0
    assert result.tax_amount == 21.0
    assert result.date == "2024-03-26"
    assert result.confidence_score >= 0.9
    print("\nExtraction Test Passed (Real/Mock)!")

if __name__ == "__main__":
    test_mock_extraction()
