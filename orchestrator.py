from agents import run_multi_agent_research
from report_generator import save_report
from database import SessionLocal
from models import ResearchReport
from chroma_memory import store_report_embedding
from datetime import datetime
from report_utils import build_report_summary
import logging

logger = logging.getLogger(__name__)

def run_research(topic: str = "latest threats"):
    topic = (topic or "latest threats").strip()

    final_report = run_multi_agent_research(topic)
    if not final_report or not final_report.strip():
        raise RuntimeError("Report generation returned empty content.")

    report_path = save_report(final_report, topic=topic)
    summary = build_report_summary(final_report)

    db = SessionLocal()
    try:
        report = ResearchReport(
            topic=topic,
            summary=summary,
            report_path=report_path,
            created_at=datetime.utcnow()
        )
        db.add(report)
        db.commit()
        db.refresh(report)
        report_id = report.id
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

    try:
        store_report_embedding(report_id, final_report, {"topic": topic, "path": report_path})
    except Exception as exc:
        logger.warning("Report %s was saved, but ChromaDB embedding failed: %s", report_id, exc)

    return final_report, report_path
