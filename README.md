# ResearchFlow AI

**ResearchFlow AI – Agentic Research & Knowledge Assistant**

ResearchFlow AI is designed to help researchers ingest academic papers and research documents, perform Retrieval-Augmented Generation (RAG) queries, and coordinate multi-agent research workflows.

---

## Current Technology Stack

- **Backend Framework:** Python 3.13 + [FastAPI](https://fastapi.tiangolo.com/)
- **ASGI Web Server:** [Uvicorn](https://www.uvicorn.org/)
- *(Planned for future iterations: MongoDB, ChromaDB, Gemini API, LangGraph, Redis/Celery, React.js)*

---

## Project Structure

```text
ResearchFlow -AI/
├── backend/
│   ├── .venv/               # Virtual environment (ignored by Git)
│   ├── app/
│   │   ├── __init__.py      # App package marker
│   │   └── main.py          # FastAPI application instance & routes
│   └── requirements.txt     # Pinned Python package dependencies
├── .gitignore
└── README.md
```

---

## Backend Setup Instructions (Windows PowerShell)

### 1. Prerequisites
- Python 3.10+ (tested on Python 3.13)
- PowerShell (Windows)

### 2. Navigate to the Backend Directory
```powershell
cd backend
```

### 3. Create & Activate Virtual Environment
If not already created:
```powershell
python -m venv .venv
```

Activate the virtual environment in PowerShell:
```powershell
.\.venv\Scripts\Activate.ps1
```
> *Note: If PowerShell displays a script execution policy error, enable local script execution for the current session:*
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
> ```

### 4. Install Dependencies
```powershell
python -m pip install -r requirements.txt
```

---

## Running the FastAPI Application

From the `backend` folder, start the Uvicorn development server:
```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- `app.main:app` refers to the `app` object in `backend/app/main.py`.
- `--reload` enables auto-reload on file edits.

---

## API Documentation

FastAPI provides built-in interactive API documentation:
- **Swagger UI:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

### Core Endpoints:
- `GET /` — API welcome message
- `GET /health` — Service health and status
