"""
Question schemas for request validation and response serialization.
"""

from pydantic import BaseModel, Field


class QuestionRequest(BaseModel):
    """
    Request model for submitting a research question about a document.
    Enforces validation on the question text length.
    """
    document_id: str
    question: str = Field(
        min_length=5,
        max_length=2000,
        description="The research question to ask about the specified document",
    )


class QuestionResponse(BaseModel):
    """
    Response model for question submission endpoints.
    """
    document_id: str
    question: str
    message: str
