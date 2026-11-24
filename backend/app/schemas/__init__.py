"""Schemas package for request and response models."""

from app.schemas.document import (
    DocumentCreate,
    DocumentUpdate,
    DocumentResponse,
    DocumentDeleteResponse,
)
from app.schemas.question import QuestionRequest, QuestionResponse

__all__ = [
    "DocumentCreate",
    "DocumentUpdate",
    "DocumentResponse",
    "DocumentDeleteResponse",
    "QuestionRequest",
    "QuestionResponse",
]
