"""
Core application configuration management using Pydantic Settings.
"""

from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Base directory for the backend (where .env typically resides)
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    """
    Application settings model with environment variable overrides.
    """
    app_name: str = "ResearchFlow AI"
    app_env: str = "development"
    debug: bool = True
    gemini_api_key: str = ""
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "researchflow"

    model_config = SettingsConfigDict(
        env_file=(
            str(BACKEND_DIR / ".env"),
            ".env",
        ),
        env_file_encoding="utf-8",
        extra="ignore",
    )


# Single reusable instance for application-wide access
settings = Settings()
