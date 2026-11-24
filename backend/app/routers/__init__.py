"""
Routers package exposing modular endpoint routers.
"""

from app.routers.documents import router as documents_router
from app.routers.questions import router as questions_router
from app.routers.demo import router as demo_router

__all__ = ["documents_router", "questions_router", "demo_router"]
