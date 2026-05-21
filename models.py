from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base
import datetime

class ResearchReport(Base):
    __tablename__ = "research_reports"

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String(255), nullable=False)
    summary = Column(Text, nullable=False)  # short excerpt
    report_path = Column(String(500), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
