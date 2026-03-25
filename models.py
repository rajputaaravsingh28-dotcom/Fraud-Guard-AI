from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime
from app.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True)
    user_id = Column(String)
    amount = Column(Float)
    location = Column(String)
    device = Column(String)
    risk_score = Column(Float)
    decision = Column(String)
    agent_logs = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

class CaseReport(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True)
    transaction_id = Column(Integer)
    status = Column(String)
    notes = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True)
    action = Column(String)
    details = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
