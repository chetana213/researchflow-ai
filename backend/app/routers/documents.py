
"""
Document router connected to MongoDB.
"""

from bson import ObjectId
from fastapi import APIRouter, HTTPException, Query

from app.database import database
from app.schemas.document import DocumentResponse

router = APIRouter(prefix="/documents", tags=["Documents"])

documents_collection = database["documents"]


@router.get("")
async def list_documents(
    category: str = "all",
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
):
    """
    Retrieve documents from MongoDB with filtering and pagination.
    """

    query = {}

    if category.lower() != "all":
        query["category"] = category

    skip = (page - 1) * limit

    cursor = (
        documents_collection
        .find(query)
        .skip(skip)
        .limit(limit)
    )

    documents = []

    async for document in cursor:
        document["document_id"] = str(document.pop("_id"))
        documents.append(document)

    total = await documents_collection.count_documents(query)

    return {
        "category": category,
        "page": page,
        "limit": limit,
        "total": total,
        "documents": documents,
        "message": "Documents retrieved successfully",
    }


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: str):
    """
    Retrieve a single document using its MongoDB ObjectId.
    """

    if not ObjectId.is_valid(document_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid document ID",
        )

    document = await documents_collection.find_one(
        {"_id": ObjectId(document_id)}
    )

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    document["document_id"] = str(document.pop("_id"))

    return document
