from pydantic import BaseModel

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
    created_at: str

    class Config:
        from_attributes = True
