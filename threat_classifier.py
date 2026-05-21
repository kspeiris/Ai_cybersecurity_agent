import re

THREAT_KEYWORDS = {
    "ransomware": ["ransom", "encrypt", "decrypt", "bitlocker", "lockbit"],
    "phishing": ["phish", "spearphish", "credential harvest", "fake login"],
    "api_attack": ["api", "graphql", "rest", "broken object", "excessive data"],
    "malware": ["trojan", "worm", "dropper", "backdoor", "malicious"],
    "supply_chain": ["dependency confusion", "typosquat", "compromised package"],
    "zero_day": ["zero-day", "0day", "unpatched", "unknown exploit"],
}

def classify_threat(description: str) -> str:
    desc_lower = description.lower()
    for threat, keywords in THREAT_KEYWORDS.items():
        if any(k in desc_lower for k in keywords):
            return threat
    return "other"

def severity_score(severity_str: str) -> int:
    """Convert severity string like '8.5 (HIGH)' to numeric score."""
    match = re.search(r"([\d\.]+)", severity_str)
    if match:
        score = float(match.group(1))
        if score >= 9.0:
            return 10
        elif score >= 7.0:
            return 8
        elif score >= 4.0:
            return 5
        else:
            return 2
    # Fallback
    if "CRITICAL" in severity_str.upper():
        return 10
    if "HIGH" in severity_str.upper():
        return 8
    if "MEDIUM" in severity_str.upper():
        return 5
    return 2
