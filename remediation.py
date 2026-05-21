from modules.summarizer import _make_completion

def generate_remediation(cve_id: str, description: str, threat_type: str) -> str:
    prompt = f"""You are a security engineer. Provide a concise remediation plan for the following vulnerability:
CVE ID: {cve_id}
Description: {description}
Threat type: {threat_type}

Include:
- Immediate mitigation steps
- Long-term fixes
- Code-level example if applicable

Remediation:"""
    return _make_completion(prompt)
