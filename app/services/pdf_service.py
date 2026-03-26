import fitz  # PyMuPDF
import logging

logger = logging.getLogger(__name__)

def extract_text(file_bytes: bytes) -> str:
    """
    Extracts clean text from raw PDF bytes using PyMuPDF.
    
    Args:
        file_bytes (bytes): Raw bytes of the PDF file.
        
    Returns:
        str: Extracted and cleaned text from the PDF.
    
    Raises:
        ValueError: If the PDF is corrupt or cannot be opened.
    """
    try:
        # Open the PDF from bytes
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        
        full_text = []
        for page in doc:
            # Extract text from the page
            page_text = page.get_text()
            if page_text:
                full_text.append(page_text.strip())
        
        doc.close()
        
        # Join pages with double newlines for clear separation
        extracted_text = "\n\n".join(full_text)
        
        if not extracted_text.strip():
            logger.warning("Extracted text is empty. PDF might be image-based or empty.")
            
        return extracted_text
        
    except Exception as e:
        logger.error(f"Failed to extract text from PDF: {str(e)}")
        raise ValueError(f"Could not parse PDF file: {str(e)}")
