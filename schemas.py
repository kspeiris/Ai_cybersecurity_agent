from pydantic import BaseModel
from datetime import datetime

class ResearchRequest(BaseModel):
    topic: str = "latest cybersecurity threats"

class ResearchResponse(BaseModel):
    report: str
    path: str

class ReportOut(BaseModel):
    id: int
    topic: str
    summary: str
    report_path: str
    created_at: datetime

    class Config:
        from_attributes = True
