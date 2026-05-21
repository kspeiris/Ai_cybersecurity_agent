import os
from dotenv import load_dotenv

load_dotenv()

# OpenAI
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

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
