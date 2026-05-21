from fastapi import FastAPI, HTTPException
from schemas import ResearchRequest, ResearchResponse, ReportOut
from orchestrator import run_research
from database import SessionLocal, init_db
from models import ResearchReport
from chroma_memory import search_reports

# Initialise database tables on startup
init_db()

app = FastAPI(
    title="AI Cybersecurity Research Agent",
    description="Autonomous cybersecurity intelligence platform with AI summaries",
    version="1.0.0"
)

@app.post("/research", response_model=ResearchResponse)
def trigger_research(request: ResearchRequest):
    """Start a new cybersecurity research run."""
    try:
        content, path = run_research(request.topic)
        return ResearchResponse(report=content, path=path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/reports", response_model=list[ReportOut])
def list_reports():
    """Return the latest 20 stored research reports."""
    db = SessionLocal()
    try:
        reports = db.query(ResearchReport).order_by(
            ResearchReport.created_at.desc()
        ).limit(20).all()
        return reports
    finally:
        db.close()

@app.get("/search")
def semantic_search(q: str):
    """Search stored reports using semantic (vector) similarity."""
    if not q:
        raise HTTPException(status_code=400, detail="Query parameter 'q' is required")
    results = search_reports(q)
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
