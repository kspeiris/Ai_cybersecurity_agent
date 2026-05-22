from datetime import datetime
from pathlib import Path
import re
from config import REPORT_DIR

def _slugify(value: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", value.strip().lower()).strip("-")
    return slug[:50] or "research"

def save_report(content: str, topic: str = "research") -> str:
    """Write markdown content to a file and return the file path."""
    report_dir = Path(REPORT_DIR)
    report_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    filename = f"report_{timestamp}_{_slugify(topic)}.md"
    filepath = report_dir / filename
    with filepath.open("w", encoding="utf-8") as f:
        f.write(content)
    return str(filepath)
