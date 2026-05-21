# AI Cybersecurity Research Agent

Autonomous AI‑powered cybersecurity research platform that collects, analyses, and stores intelligence from CVE databases, news feeds, and GitHub advisories.

## Features

- Fetches latest CVEs from NIST NVD
- Retrieves cybersecurity news via RSS
- Collects GitHub Security Advisories
- AI summarisation (OpenAI) with technical and beginner‑friendly insights
- Stores reports in SQLite
- Long‑term semantic memory with ChromaDB
- Generates Markdown reports
- REST API powered by FastAPI

## Setup

1. Clone the repository and navigate to the project folder.

2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate   # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

3. Copy `.env.example` to `.env` and fill in your `OPENAI_API_KEY`:
   ```bash
   cp .env.example .env
   ```

4. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

5. Visit `http://localhost:8000/docs` for interactive API documentation.

## API Endpoints

- `POST /research` – start a research run (body: `{"topic": "..."}`)
- `GET /reports` – list recent reports
- `GET /search?q=your+query` – semantic search through past reports

## Architecture

```
User → FastAPI → Orchestrator → Modules (CVE, News, GitHub)
                       ↓
                  AI Summarization
                       ↓
                  SQLite + ChromaDB + Markdown Report
```
