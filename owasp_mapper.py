# Simplified mapping based on keywords
OWASP_MAPPING = {
    "injection": "A03:2021 – Injection",
    "broken authentication": "A07:2021 – Identification and Authentication Failures",
    "sensitive data": "A02:2021 – Cryptographic Failures",
    "xxe": "A05:2021 – Security Misconfiguration",
    "broken access control": "A01:2021 – Broken Access Control",
    "security misconfiguration": "A05:2021 – Security Misconfiguration",
    "cross-site": "A03:2021 – Injection",  # XSS
}

def map_to_owasp(description: str) -> str:
    desc_lower = description.lower()
    for keyword, owasp in OWASP_MAPPING.items():
        if keyword in desc_lower:
            return owasp
    return "Other – see NVD"
