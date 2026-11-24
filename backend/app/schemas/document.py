"""
Document schemas for request validation and response serialization.
"""

from datetime import datetime
from typing import Optional, Union
from pydantic import BaseModel, Field


class DocumentCreate(BaseModel):
    """
    Request model for creating a new research document.
    """
    title: str = Field(..., min_length=1, description="Title of the research document")
    author: Optional[str] = Field(None, description="Author(s) of the document")
    category: Optional[str] = Field("General", description="Category of the document")
    file_name: Optional[str] = Field(None, description="Uploaded file name if available")
    status: Optional[str] = Field("processed", description="Processing status of the document")
    description: Optional[str] = Field(None, description="Abstract or summary of the document")
    source: Optional[str] = Field("manual", description="Origin or source of the document")


class DocumentUpdate(BaseModel):
    """
    Request model for updating an existing research document.
    All fields are optional to support partial updates.
    """
    title: Optional[str] = Field(None, min_length=1, description="Title of the research document")
    author: Optional[str] = Field(None, description="Author(s) of the document")
    category: Optional[str] = Field(None, description="Category of the document")
    file_name: Optional[str] = Field(None, description="Uploaded file name if available")
    status: Optional[str] = Field(None, description="Processing status of the document")
    description: Optional[str] = Field(None, description="Abstract or summary of the document")
    source: Optional[str] = Field(None, description="Origin or source of the document")


class DocumentResponse(BaseModel):
    """
    Response model for document data.
    """
    document_id: str
    title: str
    author: Optional[str] = None
    category: Optional[str] = None
    file_name: Optional[str] = None
    original_file_name: Optional[str] = None
    file_path: Optional[str] = None
    file_size: Optional[int] = None
    content_type: Optional[str] = None
    status: Optional[str] = None
    description: Optional[str] = None
    source: Optional[str] = None
    uploaded_at: Optional[Union[datetime, str]] = None


class DocumentDeleteResponse(BaseModel):
    """
    Response model for document deletion confirmation.
    """
    message: str
    document_id: str
