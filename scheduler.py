from apscheduler.schedulers.background import BackgroundScheduler
from orchestrator import run_research
import logging

logger = logging.getLogger(__name__)
scheduler = BackgroundScheduler()

def scheduled_research():
    logger.info("Running scheduled cybersecurity research...")
    try:
        report, path = run_research(topic="daily scheduled research")
        logger.info(f"Scheduled research completed: {path}")
    except Exception as e:
        logger.error(f"Scheduled research failed: {e}")

def start_scheduler(hour: int = 9):
    scheduler.add_job(scheduled_research, 'cron', hour=hour, minute=0)
    scheduler.start()
    logger.info(f"Scheduler started. Daily research at {hour}:00")
