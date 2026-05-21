import os
from dotenv import load_dotenv

load_dotenv()

# Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

# NVD API
NVD_API_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0"

# News RSS
NEWS_FEED_URL = os.getenv(
    "NEWS_FEED_URL",
    "https://feeds.feedburner.com/TheHackersNews"
)

# GitHub Advisories
GITHUB_API_URL = "https://api.github.com/advisories"

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///cyber_agent.db")

# ChromaDB
CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")

# Report output
REPORT_DIR = os.getenv("REPORT_DIR", "./reports")

# Alerting
ALERT_EMAIL_ENABLED = os.getenv("ALERT_EMAIL_ENABLED", "false").lower() == "true"
ALERT_EMAIL_FROM = os.getenv("ALERT_EMAIL_FROM", "")
ALERT_EMAIL_TO = os.getenv("ALERT_EMAIL_TO", "")
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY", "")

DISCORD_WEBHOOK_URL = os.getenv("DISCORD_WEBHOOK_URL", "")

# GitHub Scanner
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")  # optional, for higher rate limits

# Scheduler
SCHEDULER_HOUR = int(os.getenv("SCHEDULER_HOUR", 9))  # 9 AM daily
