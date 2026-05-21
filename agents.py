from typing import TypedDict, List
from modules.cve import fetch_cves
from modules.news import fetch_news
from modules.github_advisories import fetch_advisories
from threat_classifier import classify_threat, severity_score
from remediation import generate_remediation
from modules.summarizer import summarize_cves, summarize_news, summarize_advisories
from alerts import send_critical_alert

class AgentState(TypedDict):
    topic: str
    cve_data: List[dict]
    news_data: List[dict]
    advisory_data: List[dict]
    cve_summary: str
    news_summary: str
    advisory_summary: str
    remediations: dict
    alerts_sent: bool
    final_report: str

def research_agent(state: AgentState) -> AgentState:
    state["cve_data"] = fetch_cves(limit=5)
    state["news_data"] = fetch_news(limit=5)
    state["advisory_data"] = fetch_advisories(limit=5)
    return state

def analysis_agent(state: AgentState) -> AgentState:
    for cve in state["cve_data"]:
        cve["threat_type"] = classify_threat(cve["description"])
        cve["score"] = severity_score(cve["severity"])
    # Critical alerts
    for cve in state["cve_data"]:
        if cve["score"] >= 8:
            send_critical_alert(cve["id"], cve["severity"], cve["description"])
    return state

def remediation_agent(state: AgentState) -> AgentState:
    remediations = {}
    for cve in state["cve_data"]:
        if cve["score"] >= 5:
            remediations[cve["id"]] = generate_remediation(
                cve["id"], cve["description"], cve["threat_type"]
            )
    state["remediations"] = remediations
    return state

def summarization_agent(state: AgentState) -> AgentState:
    state["cve_summary"] = summarize_cves(state["cve_data"])
    state["news_summary"] = summarize_news(state["news_data"])
    state["advisory_summary"] = summarize_advisories(state["advisory_data"])
    return state

def report_agent(state: AgentState) -> AgentState:
    # Build final report including remediations
    remediation_text = "\n".join(
        f"### {cve_id}\n{remediation}" for cve_id, remediation in state["remediations"].items()
    )
    full = f"""# Multi-Agent Research Report: {state['topic']}

## CVEs Summary
{state['cve_summary']}

## Remediation Suggestions
{remediation_text if remediation_text else "No high-severity remediations generated."}

## News
{state['news_summary']}

## Advisories
{state['advisory_summary']}
"""
    state["final_report"] = full
    return state

def run_multi_agent_research(topic: str = "latest cybersecurity threats"):
    state = AgentState(
        topic=topic,
        cve_data=[],
        news_data=[],
        advisory_data=[],
        cve_summary="",
        news_summary="",
        advisory_summary="",
        remediations={},
        alerts_sent=False,
        final_report=""
    )
    for step in (
        research_agent,
        analysis_agent,
        remediation_agent,
        summarization_agent,
        report_agent,
    ):
        state = step(state)
    return state["final_report"]
