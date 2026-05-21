import logging
from database import SessionLocal
from models import ResearchReport
from modules.cve import fetch_cves
from modules.news import fetch_news
from modules.github_advisories import fetch_advisories
from modules.summarizer import (
    summarize_cves,
    summarize_news,
    summarize_advisories,
    generate_overall_report,
)
from report_generator import save_report
from chroma_memory import store_report_embedding
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_research(topic: str = "latest threats"):
    """Orchestrate data collection, AI analysis, storage, and report generation."""
    logger.info(f"Starting research on topic: {topic}")

    # 1. Collect data
    logger.info("Fetching CVEs...")
    cve_data = fetch_cves(limit=5)
    logger.info("Fetching news...")
    news_data = fetch_news(limit=5)
    logger.info("Fetching GitHub advisories...")
    advisory_data = fetch_advisories(limit=5)

    # 2. AI Summarization
    logger.info("Generating AI summaries...")
    cve_summary = summarize_cves(cve_data)
    news_summary = summarize_news(news_data)
    advisory_summary = summarize_advisories(advisory_data)

    # 3. Build final report content
    full_report = generate_overall_report(cve_summary, news_summary, advisory_summary, topic)

    # 4. Save report to disk
    report_path = save_report(full_report)
    logger.info(f"Report saved to {report_path}")

    # 5. Store in SQLite database
    db = SessionLocal()
    try:
        report = ResearchReport(
            topic=topic,
            summary=full_report[:500],  # short preview
            report_path=report_path,
            created_at=datetime.utcnow()
        )
        db.add(report)
        db.commit()
        db.refresh(report)
        report_id = report.id
        logger.info(f"Report stored in DB with ID {report_id}")
    except Exception as e:
        logger.error(f"Database error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

    # 6. Store embedding in ChromaDB (long‑term memory)
    try:
        store_report_embedding(report_id, full_report, {"topic": topic})
        logger.info("Report embedding stored in ChromaDB")
    except Exception as e:
        logger.error(f"ChromaDB error: {e}")

    return full_report, report_path
