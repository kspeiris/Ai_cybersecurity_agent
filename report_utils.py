import re


def strip_markdown(text: str) -> str:
    """Convert Markdown-ish report text into compact plain text."""
    if not text:
        return ""

    cleaned = re.sub(r"```[\s\S]*?```", " ", text)
    cleaned = re.sub(r"`([^`]+)`", r"\1", cleaned)
    cleaned = re.sub(r"\*\*([^*]+)\*\*", r"\1", cleaned)
    cleaned = re.sub(r"\*([^*]+)\*", r"\1", cleaned)
    cleaned = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", cleaned)
    cleaned = re.sub(r"^#{1,6}\s*", "", cleaned, flags=re.MULTILINE)
    cleaned = re.sub(r"^\s*[-*]\s+", "", cleaned, flags=re.MULTILINE)
    cleaned = re.sub(r"\s+", " ", cleaned)
    return cleaned.strip()


def build_report_summary(report: str, limit: int = 700) -> str:
    """Extract a useful plain-language summary from a generated report."""
    if not report:
        return "No report content was generated."

    lines = [strip_markdown(line) for line in report.splitlines()]
    lines = [
        line
        for line in lines
        if line
        and not line.lower().startswith("multi-agent research report")
        and line.lower()
        not in {
            "cves summary",
            "remediation suggestions",
            "news",
            "advisories",
            "latest news",
            "github security advisories",
        }
    ]

    summary = " ".join(lines)
    if not summary:
        summary = strip_markdown(report)

    return summary[: limit - 3].rstrip() + "..." if len(summary) > limit else summary
