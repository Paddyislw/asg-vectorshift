# VectorShift Pipeline Builder — Backend

FastAPI backend for the VectorShift Pipeline Builder. Handles DAG validation and in-memory pipeline storage.

---

## Requirements

- Python 3.11+
- pip

---

## Setup & Start

**First time only — create the virtual environment and install dependencies:**

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Start the server:**

```bash
source venv/bin/activate
python3 -m uvicorn main:app --reload
```

Server runs at **http://localhost:8000**

> The `--reload` flag hot-reloads on file changes. Drop it in production.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/pipelines/parse` | Validate pipeline, returns node/edge count + DAG check |
| `POST` | `/pipelines/save` | Save a pipeline (in-memory) |
| `GET` | `/pipelines` | List all saved pipelines |
| `GET` | `/pipelines/{id}` | Get a saved pipeline by ID |
| `DELETE` | `/pipelines/{id}` | Delete a saved pipeline |

Interactive docs available at **http://localhost:8000/docs** once the server is running.

---

## Notes

- Storage is **in-memory** — all saved pipelines are lost on server restart.
- CORS is configured for `http://localhost:3000` (the frontend dev server).
