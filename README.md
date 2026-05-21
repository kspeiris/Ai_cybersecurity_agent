# AI Cybersecurity Research Agent

Autonomous AI-powered cybersecurity research platform that collects, analyses, and stores intelligence from CVE databases, news feeds, and GitHub advisories.

## Features

- Fetches latest CVEs from NIST NVD
- Retrieves cybersecurity news via RSS
- Collects GitHub Security Advisories
- AI summarisation with Gemini
- Stores reports in SQLite
- Long-term semantic memory with ChromaDB
- Generates Markdown reports
- REST API powered by FastAPI
- Professional SOC-style dashboard with Next.js, Tailwind CSS, Recharts, and Lucide React

## Setup

1. Clone the repository and navigate to the project folder.

2. Create a virtual environment and install dependencies:

   ```powershell
   py -3.12 -m venv venv
   .\venv\Scripts\Activate.ps1
   python -m pip install --upgrade pip
   pip install -r requirements.txt
   ```

3. Copy `.env.example` to `.env` and fill in your Gemini API key:

   ```powershell
   Copy-Item .env.example .env
   ```

   Required values:

   ```env
   GEMINI_API_KEY=your_gemini_api_key
   GEMINI_MODEL=gemini-2.5-flash
   ```

4. Run the FastAPI server:

   ```powershell
   uvicorn main:app --reload
   ```

5. Visit `http://127.0.0.1:8000/docs` for interactive API documentation.

## Dashboard

The dashboard lives in `frontend/` and runs as a separate Next.js app.

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

The frontend proxies `/api/*` requests to the FastAPI backend on `http://localhost:8000`, so keep the backend running while using the dashboard.

## API Endpoints

- `POST /research` - start a research run (body: `{"topic": "..."}`)
- `GET /reports` - list recent reports
- `GET /search?q=your+query` - semantic search through past reports
- `POST /ask?query=...` - ask a RAG question over saved reports
- `POST /classify` - classify a CVE description
- `POST /scan-repo` - scan a GitHub repository URL
- `GET /dashboard-data` - dashboard summary metrics, severity data, timeline, feed, AI summary, and recent reports

## Architecture

```text
User -> FastAPI -> Orchestrator -> Modules (CVE, News, GitHub)
                       |
                  Gemini Summarization
                       |
             SQLite + ChromaDB + Markdown Report
```
