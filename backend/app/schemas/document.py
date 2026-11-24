
from pydantic import BaseModel
from typing import Optional


class DocumentResponse(BaseModel):
    document_id: str
    title: str
    author: Optional[str] = None
    category: Optional[str] = None
    file_name: Optional[str] = None
    status: Optional[str] = None
    description: Optional[str] = None
    source: Optional[str] = None
