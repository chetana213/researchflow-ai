"""
ResearchFlow AI - Main FastAPI Application

This module initializes the FastAPI application, configures CORS middleware,
preserves system endpoints (root and health), and registers modular routers.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import documents_router, questions_router, demo_router

# Initialize the FastAPI application using configured settings
app = FastAPI(
    title=settings.app_name,
    description="Agentic Research & Knowledge Assistant - Backend API",
    version="0.1.0",
)

# Configure CORS to allow cross-origin requests from the local Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register modular routers
app.include_router(documents_router)
app.include_router(questions_router)
app.include_router(demo_router)


# ---------------------------------------------------------
# System & Health Endpoints
# ---------------------------------------------------------
@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint providing a welcoming message and basic service navigation.
    """
    return {
        "message": "Welcome to ResearchFlow AI API",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health", tags=["System"])
async def health_check():
    """
    Health check endpoint to monitor backend uptime and operational readiness.
    """
    return {
        "status": "healthy",
        "project": "ResearchFlow AI",
        "message": "Backend is running successfully",
    }
