from openai import OpenAI
from config import OPENAI_API_KEY, OPENAI_MODEL

client = OpenAI(api_key=OPENAI_API_KEY)

def _make_completion(prompt: str) -> str:
    """Helper to call OpenAI and return text."""
    if not OPENAI_API_KEY:
        return "AI summarization unavailable (no API key)."
    try:
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=1500,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"AI summarization error: {str(e)}"

def summarize_cves(cve_data: list) -> str:
    if not cve_data:
        return "No recent CVEs found."
    cve_text = "\n".join(
        f"- {c['id']} (Severity: {c['severity']}): {c['description'][:200]}"
        for c in cve_data
    )
    prompt = (
        "You are a cybersecurity expert. Summarize the following CVE list in a concise, "
        "technical markdown report. Highlight the most critical vulnerabilities, potential "
        "impact, and suggested mitigation if available.\n\n"
        f"{cve_text}\n\nSummary:"
    )
    return _make_completion(prompt)

def summarize_news(news_data: list) -> str:
    if not news_data:
        return "No recent cybersecurity news."
    news_text = "\n".join(
        f"- {n['title']} ({n['published']})\n  {n['summary'][:200]}..."
        for n in news_data
    )
    prompt = (
        "Summarize the following cybersecurity news articles into a brief, insightful overview. "
        "Group related themes, note any emerging threats, and keep it beginner-friendly.\n\n"
        f"{news_text}\n\nSummary:"
    )
    return _make_completion(prompt)

def summarize_advisories(advisory_data: list) -> str:
    if not advisory_data:
        return "No recent GitHub advisories."
    adv_text = "\n".join(
        f"- {a['ghsa_id']} (CVE: {a['cve_id']}) - {a['summary'][:150]} (severity: {a['severity']})"
        for a in advisory_data
    )
    prompt = (
        "Summarize these GitHub security advisories for developers. Mention affected packages, "
        "severity, and recommended update steps.\n\n"
        f"{adv_text}\n\nSummary:"
    )
    return _make_completion(prompt)

def generate_overall_report(cve_summary, news_summary, advisory_summary, topic="General Research"):
    """Combine all summaries into one full markdown report."""
    return f"# Cybersecurity Research Report: {topic}\n\n" \
           f"## Vulnerabilities (CVEs)\n{cve_summary}\n\n" \
           f"## Latest News\n{news_summary}\n\n" \
           f"## GitHub Security Advisories\n{advisory_summary}\n"
