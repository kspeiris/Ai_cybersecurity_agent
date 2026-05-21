import requests
import logging
from config import (
    ALERT_EMAIL_ENABLED, ALERT_EMAIL_FROM, ALERT_EMAIL_TO, SENDGRID_API_KEY,
    DISCORD_WEBHOOK_URL
)

logger = logging.getLogger(__name__)

def send_email_alert(subject: str, body: str):
    if not ALERT_EMAIL_ENABLED:
        return
    try:
        from sendgrid import SendGridAPIClient
        from sendgrid.helpers.mail import Mail
        message = Mail(
            from_email=ALERT_EMAIL_FROM,
            to_emails=ALERT_EMAIL_TO,
            subject=subject,
            html_content=body
        )
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        sg.send(message)
        logger.info(f"Email alert sent: {subject}")
    except Exception as e:
        logger.error(f"Email send failed: {e}")

def send_discord_alert(message: str):
    if not DISCORD_WEBHOOK_URL:
        return
    try:
        data = {"content": message}
        requests.post(DISCORD_WEBHOOK_URL, json=data, timeout=5)
        logger.info("Discord alert sent")
    except Exception as e:
        logger.error(f"Discord send failed: {e}")

def send_critical_alert(cve_id: str, severity: str, description: str):
    subject = f"🚨 CRITICAL CVE: {cve_id}"
    body = f"<b>{cve_id}</b><br/>Severity: {severity}<br/>{description}<br/>Action required immediately."
    send_email_alert(subject, body)
    send_discord_alert(f"**CRITICAL ALERT** {cve_id} - {severity}\n{description[:200]}")
