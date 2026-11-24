"""
Document router handling document listing and document retrieval.
"""

from fastapi import APIRouter, HTTPException
from app.schemas.document import DocumentResponse

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.get(
    "",
    tags=["Documents"],
)
async def list_documents(category: str = "all", page: int = 1):
    """
    List documents with optional filtering and pagination (Query Parameters).
    - category: filter documents by category (defaults to 'all')
    - page: 1-based page index (defaults to 1)
    """
    return {
        "category": category,
        "page": page,
        "message": "Documents listed successfully",
    }


@router.get(
    "/{document_id}",
    response_model=DocumentResponse,
    tags=["Documents"],
)
async def get_document(document_id: str):
    """
    Retrieve document details by document_id (Path Parameter).
    Returns 200 with DocumentResponse for demo document 'doc_101'.
    Raises 404 HTTPException for any other document ID.
    """
    if document_id != "doc_101":
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    return {
        "document_id": document_id,
        "message": "Document retrieved successfully",
    }
