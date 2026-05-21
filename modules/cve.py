import requests
from datetime import datetime, timedelta
from config import NVD_API_URL

def fetch_cves(limit: int = 10) -> list[dict]:
    """
    Fetch latest CVE entries from NVD.
    Returns list of dicts with keys: id, severity, description.
    """
    # Get CVEs published in the last 7 days
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=7)

    params = {
        "pubStartDate": start_date.isoformat() + "Z",
        "pubEndDate": end_date.isoformat() + "Z",
        "resultsPerPage": limit,
    }

    try:
        resp = requests.get(NVD_API_URL, params=params, timeout=15)
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        print(f"Error fetching CVEs: {e}")
        return []

    cve_list = []
    for vuln in data.get("vulnerabilities", []):
        cve = vuln.get("cve", {})
        cve_id = cve.get("id", "N/A")
        # Description
        descriptions = cve.get("descriptions", [])
        desc = next((d["value"] for d in descriptions if d["lang"] == "en"), "No description")
        # Severity (CVSS v3.1 base score)
        severity = "UNKNOWN"
        metrics = cve.get("metrics", {})
        if "cvssMetricV31" in metrics:
            cvss_data = metrics["cvssMetricV31"][0]["cvssData"]
            severity = f"{cvss_data.get('baseScore', 'N/A')} ({cvss_data.get('baseSeverity', 'N/A')})"
        elif "cvssMetricV30" in metrics:
            cvss_data = metrics["cvssMetricV30"][0]["cvssData"]
            severity = f"{cvss_data.get('baseScore', 'N/A')} ({cvss_data.get('baseSeverity', 'N/A')})"
        cve_list.append({
            "id": cve_id,
            "severity": severity,
            "description": desc,
        })
    return cve_list
