"""
Document router connected to MongoDB providing full CRUD and upload capabilities.
"""

import re
import uuid
from datetime import datetime, timezone
from pathlib import Path

import anyio
from bson import ObjectId
from fastapi import APIRouter, File, HTTPException, Query, UploadFile, status

from app.core.config import BACKEND_DIR
from app.database import database
from app.schemas.document import (
    DocumentCreate,
    DocumentUpdate,
    DocumentResponse,
    DocumentDeleteResponse,
)

router = APIRouter(prefix="/documents", tags=["Documents"])

documents_collection = database["documents"]

# Upload configuration
UPLOAD_DIR = BACKEND_DIR / "uploads"
MAX_FILE_SIZE = 15 * 1024 * 1024  # 15 MB
CHUNK_SIZE = 1024 * 64  # 64 KB


@router.get("", tags=["Documents"])
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


@router.post(
    "/upload",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Documents"],
)
async def upload_document(file: UploadFile = File(...)):
    """
    Upload a research paper PDF file.
    Validates file extension and PDF signature, limits file size to 15 MB,
    saves the file in backend/uploads/ with a unique safe filename,
    and records the metadata in MongoDB.
    """
    original_name = file.filename or ""

    # 1. Validate file extension
    if not original_name.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported. File must have a .pdf extension.",
        )

    # 2. Validate PDF signature (magic bytes)
    header = await file.read(1024)
    if not header.startswith(b"%PDF") and b"%PDF-" not in header:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file content. The file does not have a valid PDF signature.",
        )

    # 3. Ensure local backend/uploads/ directory exists
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    # 4. Generate unique safe filename
    safe_stem = re.sub(r"[^a-zA-Z0-9_\-]", "_", Path(original_name).stem).strip("_")
    safe_stem = safe_stem[:50] if safe_stem else "document"
    stored_file_name = f"{uuid.uuid4().hex}_{safe_stem}.pdf"
    dest_path = UPLOAD_DIR / stored_file_name

    file_size = len(header)
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds maximum limit of {MAX_FILE_SIZE // (1024 * 1024)} MB.",
        )

    # 5. Stream chunks asynchronously to disk while tracking file size
    try:
        async with await anyio.open_file(dest_path, "wb") as f:
            await f.write(header)
            while True:
                chunk = await file.read(CHUNK_SIZE)
                if not chunk:
                    break
                file_size += len(chunk)
                if file_size > MAX_FILE_SIZE:
                    break
                await f.write(chunk)
    except Exception as e:
        if dest_path.exists():
            dest_path.unlink()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save uploaded file: {str(e)}",
        )

    # Reject if oversized
    if file_size > MAX_FILE_SIZE:
        if dest_path.exists():
            dest_path.unlink()
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds maximum limit of {MAX_FILE_SIZE // (1024 * 1024)} MB.",
        )

    # 6. Derive title from original filename
    raw_stem = Path(original_name).stem
    derived_title = raw_stem.replace("_", " ").replace("-", " ").strip()
    title = derived_title if derived_title else "Untitled Document"

    # 7. Prepare document metadata
    now_utc = datetime.now(timezone.utc)
    document_data = {
        "title": title,
        "file_name": stored_file_name,
        "original_file_name": original_name,
        "file_path": str(dest_path),
        "file_size": file_size,
        "content_type": file.content_type or "application/pdf",
        "status": "uploaded",
        "source": "upload",
        "uploaded_at": now_utc,
        "author": None,
        "category": "General",
        "description": None,
    }

    # 8. Insert metadata into MongoDB with rollback cleanup on error
    try:
        result = await documents_collection.insert_one(document_data)
    except Exception as e:
        if dest_path.exists():
            dest_path.unlink()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error while saving document metadata: {str(e)}",
        )

    created_document = await documents_collection.find_one(
        {"_id": result.inserted_id}
    )

    if created_document is None:
        if dest_path.exists():
            dest_path.unlink()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve created document",
        )

    created_document["document_id"] = str(created_document.pop("_id"))

    return created_document


@router.get("/{document_id}", response_model=DocumentResponse, tags=["Documents"])
async def get_document(document_id: str):
    """
    Retrieve a single document using its MongoDB ObjectId.
    """
    if not ObjectId.is_valid(document_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid document ID",
        )

    document = await documents_collection.find_one(
        {"_id": ObjectId(document_id)}
    )

    if document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )

    document["document_id"] = str(document.pop("_id"))

    return document


@router.post(
    "",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Documents"],
)
async def create_document(payload: DocumentCreate):
    """
    Create a new document in MongoDB.
    Validates input, inserts into MongoDB, and returns the created document with its string document_id.
    """
    document_data = payload.model_dump()
    result = await documents_collection.insert_one(document_data)

    created_document = await documents_collection.find_one(
        {"_id": result.inserted_id}
    )

    if created_document is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve created document",
        )

    created_document["document_id"] = str(created_document.pop("_id"))

    return created_document


@router.put(
    "/{document_id}",
    response_model=DocumentResponse,
    tags=["Documents"],
)
async def update_document(document_id: str, payload: DocumentUpdate):
    """
    Update an existing document by its MongoDB ObjectId.
    Validates ObjectId, checks for empty update payloads, applies partial updates,
    and returns the updated document. Returns 404 if not found.
    """
    if not ObjectId.is_valid(document_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid document ID",
        )

    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided for update",
        )

    result = await documents_collection.update_one(
        {"_id": ObjectId(document_id)},
        {"$set": update_data},
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )

    updated_document = await documents_collection.find_one(
        {"_id": ObjectId(document_id)}
    )

    if updated_document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )

    updated_document["document_id"] = str(updated_document.pop("_id"))

    return updated_document


@router.delete(
    "/{document_id}",
    response_model=DocumentDeleteResponse,
    tags=["Documents"],
)
async def delete_document(document_id: str):
    """
    Delete a document from MongoDB by its ObjectId.
    Validates ObjectId, removes the document, and returns a clear success message.
    Returns 404 if not found.
    """
    if not ObjectId.is_valid(document_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid document ID",
        )

    result = await documents_collection.delete_one(
        {"_id": ObjectId(document_id)}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )

    return {
        "message": "Document deleted successfully",
        "document_id": document_id,
    }
