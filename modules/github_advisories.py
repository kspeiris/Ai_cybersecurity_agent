import requests
from config import GITHUB_API_URL

def fetch_advisories(limit: int = 5) -> list[dict]:
    """
    Fetch GitHub Security Advisories (public, no auth needed).
    Returns list of dicts: ghsa_id, summary, severity, cve_id, url.
    """
    params = {
        "per_page": limit,
        "sort": "updated",
        "direction": "desc",
    }
    headers = {"Accept": "application/vnd.github+json"}
    try:
        resp = requests.get(GITHUB_API_URL, params=params, headers=headers, timeout=15)
        resp.raise_for_status()
        advisories = resp.json()
    except Exception as e:
        print(f"Error fetching GitHub Advisories: {e}")
        return []

    result = []
    for adv in advisories:
        result.append({
            "ghsa_id": adv.get("ghsa_id", "N/A"),
            "summary": adv.get("summary", "No summary"),
            "severity": adv.get("severity", "UNKNOWN"),
            "cve_id": adv.get("cve_id", "N/A"),
            "url": adv.get("html_url", ""),
        })
    return result
