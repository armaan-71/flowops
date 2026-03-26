import os
import re
import json
from typing import Optional
from dotenv import load_dotenv
from groq import Groq
from ..schemas import ExtractionResult

class ExtractionService:
    def __init__(self):
        load_dotenv()
        self.api_key = os.getenv("GROQ_API_KEY")
        self.model = "llama-3.3-70b-versatile"
        
        if self.api_key:
            self.client = Groq(api_key=self.api_key)
        else:
            self.client = None

    def extract(self, text: str) -> ExtractionResult:
        """
        Extract structured data from invoice text.
        Falls back to a deterministic mock if no API key is present.
        """
        if not self.client:
            return self._mock_extract(text)
        
        try:
            prompt = f"""
            Extract the following structured data from the invoice text provided below.
            Return ONLY a JSON object with these keys:
            - vendor_name (string)
            - total_amount (number)
            - tax_amount (number)
            - date (string, YYYY-MM-DD or original format)
            - confidence_score (number between 0.0 and 1.0)

            Invoice Text:
            {text}
            """
            
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert invoice data extractor. Always return valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            
            result_json = json.loads(completion.choices[0].message.content)
            return ExtractionResult(**result_json)
        except Exception as e:
            print(f"Extraction error: {e}")
            return self._mock_extract(text)

    def _mock_extract(self, text: str) -> ExtractionResult:
        """
        Deterministic mock fallback based on simple regex.
        """
        # Search for vendor (hardcoded logic for common samples or first line)
        vendor_name = "Unknown Vendor"
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        if lines:
            vendor_name = lines[0]

        # Simple regex for amount - using word boundaries and searching carefully
        total_matches = re.findall(r"\bTotal:?\s*\$?\s*(\d+[\.,]\d*)", text, re.IGNORECASE)
        tax_matches = re.findall(r"\bTax:?\s*\$?\s*(\d+[\.,]\d*)", text, re.IGNORECASE)
        date_match = re.search(r"(\d{4}-\d{2}-\d{2}|\d{2}/\d{2}/\d{4})", text)

        # Usually the last "Total" in the document is the grand total
        total_amount = float(total_matches[-1].replace(',', '.')) if total_matches else 0.0
        tax_amount = float(tax_matches[-1].replace(',', '.')) if tax_matches else 0.0
        date = date_match.group(1) if date_match else "unknown"
        
        # Confidence is 1.0 if we found at least one "Total" match AND "Vendor" is not unknown
        confidence = 1.0 if total_matches and vendor_name != "Unknown Vendor" else 0.5

        return ExtractionResult(
            vendor_name=vendor_name,
            total_amount=total_amount,
            tax_amount=tax_amount,
            date=date,
            confidence_score=confidence
        )
