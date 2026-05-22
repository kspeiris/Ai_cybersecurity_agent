# AI Cybersecurity Research Agent

An autonomous cybersecurity intelligence platform that collects threat data, analyzes it with a multi-agent pipeline, generates Markdown reports, stores analyst memory, and exposes everything through a FastAPI backend plus a SOC-style Next.js dashboard.

The system is designed for security analysts, developers, students, and teams who want a local AI assistant for CVEs, API risks, GitHub advisories, remediation guidance, and report retrieval.

## What This System Does

- Collects recent CVEs from NVD.
- Collects cybersecurity news from an RSS feed.
- Collects GitHub Security Advisories.
- Classifies vulnerability descriptions into threat categories.
- Estimates severity/risk scores.
- Generates remediation suggestions for higher-risk findings.
- Uses Gemini to summarize collected intelligence.
- Saves complete Markdown reports in `reports/`.
- Stores report metadata in SQLite.
- Stores report content in ChromaDB for semantic search and RAG answers.
- Provides a web dashboard for monitoring, chat, research, reports, and analytics.
- Provides a REST API for automation and integrations.

## Main User Workflow

1. Start the FastAPI backend.
2. Start the Next.js frontend.
3. Open `http://localhost:3000`.
4. Run a research task from the API or use the dashboard data already stored.
5. Use the dashboard to review risk summary, feed items, charts, and AI summary.
6. Use AI Chat or Research to ask questions over saved reports.
7. Open Reports to view generated report summaries and download the full Markdown report.

## Architecture

```text
User / Browser
    |
    v
Next.js Dashboard
    |
    v
FastAPI Backend
    |
    +--> Multi-Agent Pipeline
    |       +--> Research Agent: CVEs, news, GitHub advisories
    |       +--> Analysis Agent: threat type and severity scoring
    |       +--> Remediation Agent: mitigation suggestions
    |       +--> Summarization Agent: Gemini summaries
    |       +--> Report Agent: final Markdown report
    |
    +--> SQLite: report metadata
    +--> reports/: Markdown report files
    +--> ChromaDB: semantic report memory
```

## Project Structure

```text
.
|-- main.py                  # FastAPI app and API routes
|-- agents.py                # Multi-agent research pipeline
|-- orchestrator.py          # Runs research, stores DB records, saves embeddings
|-- modules/
|   |-- cve.py               # CVE collection
|   |-- news.py              # News collection
|   |-- github_advisories.py # GitHub advisory collection
|   `-- summarizer.py        # Gemini summaries
|-- report_generator.py      # Writes Markdown reports to disk
|-- rag.py                   # Ask questions using saved report context
|-- chroma_memory.py         # ChromaDB semantic memory
|-- database.py              # SQLite session setup
|-- models.py                # SQLAlchemy models
|-- reports/                 # Generated Markdown reports
|-- chroma_db/               # Persistent vector memory
`-- frontend/                # Next.js dashboard
```

## Prerequisites

- Python 3.12
- Node.js and npm
- Gemini API key
- Optional: GitHub token for higher GitHub API rate limits
- Optional: SendGrid and Discord webhook credentials for alerts

## Backend Setup

From the project root:

```powershell
py -3.12 -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Create your environment file:

```powershell
Copy-Item .env.example .env
```

Edit `.env` and set at least:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
DATABASE_URL=sqlite:///cyber_agent.db
CHROMA_PERSIST_DIR=./chroma_db
REPORT_DIR=./reports
```

Optional values:

```env
NEWS_FEED_URL=https://feeds.feedburner.com/TheHackersNews
GITHUB_TOKEN=your_github_token
SCHEDULER_HOUR=9

ALERT_EMAIL_ENABLED=false
ALERT_EMAIL_FROM=alerts@yourdomain.com
ALERT_EMAIL_TO=security@yourdomain.com
SENDGRID_API_KEY=your_sendgrid_key
DISCORD_WEBHOOK_URL=your_discord_webhook_url
```

Start the backend:

```powershell
uvicorn main:app --reload --port 8000
```

Backend API docs:

```text
http://127.0.0.1:8000/docs
```

Health check:

```text
http://127.0.0.1:8000/health
```

## Frontend Setup

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

The frontend uses `/api/*` rewrites to reach the backend at `http://localhost:8000`, so keep the backend running.

## How To Use The Dashboard

### Dashboard

URL:

```text
http://localhost:3000
```

Use this page to see the system overview:

- Critical and high severity counts
- Number of generated reports
- AI risk score
- Severity distribution chart
- Threat timeline chart
- Source feed chart
- Latest threat findings
- AI security summary and recommendations

The dashboard data comes from stored research reports. If the page looks empty, generate a report first.

### Threat Feed

URL:

```text
http://localhost:3000/threat-feed
```

Use this page to review correlated findings from generated reports. Each feed item shows:

- Finding/report ID
- Severity
- Clean finding title
- Short preview
- Source/topic
- Date

### AI Chat

URL:

```text
http://localhost:3000/chat
```

Use chat to ask questions such as:

- `Explain this API vulnerability in simple terms`
- `What are the most critical findings from previous reports?`
- `How should I mitigate reflected XSS?`
- `Which reports mention credential theft?`

The chat uses RAG: it searches saved report memory in ChromaDB, sends relevant context to Gemini, and returns an answer.

### Research

URL:

```text
http://localhost:3000/research
```

Use this page to ask research-style questions over the stored report memory. It is useful when you want a more direct answer from previous reports instead of a chat conversation.

### Reports

URL:

```text
http://localhost:3000/reports
```

Use this page to view recent generated reports. Each report shows:

- Topic
- Created time
- Summary preview
- Link to open the full Markdown report

Full reports are stored in the local `reports/` folder and served by the backend through `/report-file/{filename}`.

### Analytics

URL:

```text
http://localhost:3000/analytics
```

Use this page for severity mix, detection timeline, and preview mappings such as OWASP/MITRE categories.

## How To Generate Reports

Reports are generated through the backend research endpoint.

With PowerShell:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8000/research" `
  -ContentType "application/json" `
  -Body '{"topic":"latest API security vulnerabilities"}'
```

With curl:

```bash
curl -X POST "http://127.0.0.1:8000/research" \
  -H "Content-Type: application/json" \
  -d '{"topic":"latest API security vulnerabilities"}'
```

What happens during report generation:

1. `research_agent` fetches CVEs, news, and GitHub advisories.
2. `analysis_agent` classifies CVEs and scores severity.
3. Critical alerts may be sent if alert credentials are configured.
4. `remediation_agent` generates remediation guidance.
5. `summarization_agent` asks Gemini to summarize CVEs, news, and advisories.
6. `report_agent` creates the final Markdown report.
7. `orchestrator.py` saves the report file to `reports/`.
8. The report metadata is saved to SQLite.
9. The full report is embedded into ChromaDB for semantic search and chat.

The response includes:

```json
{
  "report": "full markdown report content",
  "path": "./reports/report_YYYYMMDD_HHMMSS.md"
}
```

## How To Get Reports

List recent reports:

```powershell
Invoke-RestMethod "http://127.0.0.1:8000/reports"
```

Open a report from the frontend:

```text
http://localhost:3000/reports
```

Open a report file directly from the backend:

```text
http://127.0.0.1:8000/report-file/report_YYYYMMDD_HHMMSS.md
```

You can also open the Markdown files directly from:

```text
reports/
```

## Semantic Search And RAG

Search previous reports:

```powershell
Invoke-RestMethod "http://127.0.0.1:8000/search?q=reflected%20xss"
```

Ask an AI question over saved reports:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8000/ask?query=How%20do%20I%20mitigate%20API%20XSS"
```

The `/ask` endpoint:

1. Searches ChromaDB for relevant report chunks.
2. Builds a prompt with the retrieved context.
3. Sends the prompt to Gemini.
4. Returns the answer.

## API Reference

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Check backend status |
| `POST` | `/research` | Generate a new research report |
| `GET` | `/reports` | List recent reports |
| `GET` | `/report-file/{filename}` | Download/open a generated Markdown report |
| `GET` | `/search?q=...` | Semantic search over stored reports |
| `POST` | `/ask?query=...` | Ask a RAG question over saved reports |
| `POST` | `/classify` | Classify a CVE description and map it to OWASP |
| `POST` | `/scan-repo` | Scan a GitHub repository URL |
| `GET` | `/dashboard-data` | Data used by the dashboard |
| `GET` | `/analytics` | Summary analytics |

## Example API Calls

Classify a vulnerability:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8000/classify?cve_id=CVE-2026-0001&description=Reflected%20XSS%20in%20API%20endpoint&severity=High"
```

Scan a GitHub repository:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8000/scan-repo?repo_url=https://github.com/owner/repo"
```

Get dashboard data:

```powershell
Invoke-RestMethod "http://127.0.0.1:8000/dashboard-data"
```

## Data Storage

| Storage | Path/File | Contents |
| --- | --- | --- |
| SQLite | `cyber_agent.db` | Report metadata: topic, summary, path, created time |
| Markdown | `reports/` | Full generated reports |
| ChromaDB | `chroma_db/` | Vector memory for semantic search and RAG |

## Scheduler

The backend starts a scheduler on FastAPI startup:

```env
SCHEDULER_HOUR=9
```

This controls the configured daily scheduler hour. Keep the backend running if you want scheduled behavior to execute.

## Troubleshooting

### Frontend says it cannot reach FastAPI

Start the backend:

```powershell
uvicorn main:app --reload --port 8000
```

Then refresh the frontend.

### Dashboard is empty

Generate at least one report:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8000/research" `
  -ContentType "application/json" `
  -Body '{"topic":"latest cybersecurity threats"}'
```

### AI answers say summarization is unavailable

Check `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Restart the backend after editing `.env`.

### Reports do not open

Make sure the file exists in:

```text
reports/
```

The backend only serves files from the configured `REPORT_DIR`.

### GitHub advisory or repository scans are rate-limited

Set:

```env
GITHUB_TOKEN=your_github_token
```

Restart the backend.

## Development Commands

Backend:

```powershell
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload --port 8000
```

Frontend:

```powershell
cd frontend
npm run dev
```

Production frontend build:

```powershell
cd frontend
npm run build
```

## Notes

- Do not commit real API keys or webhook URLs.
- Generated reports may include AI-generated guidance. Validate important remediation steps before applying them in production.
- ChromaDB memory improves after you generate more reports.
- The frontend requires the backend for live data, report access, chat, and research answers.
