"""
Question router handling question submission and validation.
"""

from fastapi import APIRouter
from app.schemas.question import QuestionRequest, QuestionResponse

router = APIRouter(prefix="/questions", tags=["Questions"])


@router.post(
    "",
    response_model=QuestionResponse,
    status_code=201,
    tags=["Questions"],
)
async def submit_question(payload: QuestionRequest):
    """
    Submit a research question for a document (JSON Request Body).
    Automatically validated against QuestionRequest schema.
    Returns 201 Created with QuestionResponse.
    """
    return {
        "document_id": payload.document_id,
        "question": payload.question,
        "message": "Question submitted successfully",
    }
