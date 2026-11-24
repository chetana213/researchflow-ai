"""
Document schemas for request and response validation.
"""

from pydantic import BaseModel


class DocumentResponse(BaseModel):
    """
    Response model for document retrieval endpoints.
    """
    document_id: str
    message: str
