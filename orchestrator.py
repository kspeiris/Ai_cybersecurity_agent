from agents import run_multi_agent_research
from report_generator import save_report
from database import SessionLocal
from models import ResearchReport
from chroma_memory import store_report_embedding
from datetime import datetime

def run_research(topic: str = "latest threats"):
    # Use multi-agent system
    final_report = run_multi_agent_research(topic)

    # Save report
    report_path = save_report(final_report)

    # Store in DB
    db = SessionLocal()
    report = ResearchReport(
        topic=topic,
        summary=final_report[:500],
        report_path=report_path,
        created_at=datetime.utcnow()
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    db.close()

    # Store in ChromaDB
    store_report_embedding(report.id, final_report, {"topic": topic})

    return final_report, report_path
