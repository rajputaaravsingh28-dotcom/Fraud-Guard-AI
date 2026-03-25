from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TransactionSchema(BaseModel):
    user_id: str
    amount: float
    location: str
    device: str

class TransactionResponseSchema(TransactionSchema):
    id: int
    risk_score: float
    decision: str
    agent_logs: Optional[str] = None

    class Config:
        from_attributes = True

class CaseReportSchema(BaseModel):
    id: int
    transaction_id: int
    status: str
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AuditLogSchema(BaseModel):
    id: int
    action: str
    details: str
    timestamp: datetime

    class Config:
        from_attributes = True
