# flowops

High-level product concept
A user uploads one or more invoice PDFs.
For each invoice, the system:
extracts raw text and document content
pulls out structured invoice fields
estimates confidence for each field
classifies the invoice into a category
checks whether it looks like a duplicate
applies simple approval or review rules
returns a final status:
ready
needs review
duplicate suspected
rejected / incomplete
Then the UI shows a queue of processed invoices with status, extracted fields, warnings, and reasoning.
That is the whole story.
