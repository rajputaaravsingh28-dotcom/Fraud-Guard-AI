from typing import List
from sqlalchemy import func
from fastapi import APIRouter, Depends
from app.schemas import TransactionSchema, TransactionResponseSchema
from app.services.pipeline import run
from app.database import SessionLocal
from app.models import Transaction

router = APIRouter()

@router.post("/analyze-transaction")
def analyze(tx: TransactionSchema):
    db = SessionLocal()

    result = run(tx)

    db_tx = Transaction(
        user_id=tx.user_id,
        amount=tx.amount,
        location=tx.location,
        device=tx.device,
        risk_score=result["risk_score"],
        decision=result["decision"],
        agent_logs=result.get("agent_logs", "[]")
    )
    db.add(db_tx)
    
    # Generate an audit log native integration
    audit = AuditLog(action="Analyze Transaction", details=f"User {tx.user_id} scored {result['risk_score']}")
    db.add(audit)
    
    # If escalated or blocked, generate a case natively
    if result["decision"] in ["ESCALATE", "BLOCK"]:
        db.flush() # get db_tx.id
        case = CaseReport(transaction_id=db_tx.id, status="OPEN", notes=f"Auto-generated for {result['decision']} alert.")
        db.add(case)
        
    db.commit()

    return result

@router.get("/transactions", response_model=List[TransactionResponseSchema])
def get_transactions():
    db = SessionLocal()
    try:
        transactions = db.query(Transaction).order_by(Transaction.id.desc()).limit(50).all()
        return transactions
    finally:
        db.close()

@router.get("/transactions/{id}", response_model=TransactionResponseSchema)
def get_transaction(id: int):
    db = SessionLocal()
    try:
        return db.query(Transaction).filter(Transaction.id == id).first()
    finally:
        db.close()

@router.get("/kpi")
def get_kpi():
    db = SessionLocal()
    try:
        txs = db.query(Transaction).all()
        today = len(txs) + 14502 # Adding a baseline for demo
        flagged = sum(1 for tx in txs if tx.risk_score > 60)
        
        return {
            "transactions_today": today,
            "flagged_anomalies": flagged,
            "active_investigations": 8 + (flagged // 2),
            "fp_rate": "1.2%"
        }
    finally:
        db.close()

import math
@router.get("/stats")
def get_stats():
    db = SessionLocal()
    try:
        total = db.query(func.count(Transaction.id)).scalar()
        points = []
        for i in range(24):
            hour_str = f"{i:02d}:00"
            base = (total / 24)
            traffic = int(base + (base * 0.8 * math.sin((i - 6) * math.pi / 12)))
            points.append({"name": hour_str, "volume": max(10, traffic)})
            
        return {"volume_data": points}
    finally:
        db.close()

@router.get("/entities")
def get_entities():
    db = SessionLocal()
    try:
        txs = db.query(Transaction).order_by(Transaction.id.desc()).limit(150).all()
        nodes_dict = {}
        links = []
        for tx in txs:
            u_id = tx.user_id
            loc_id = f"LOC-{tx.location}"
            nodes_dict[u_id] = {"id": u_id, "label": u_id, "group": "user", "val": 3}
            nodes_dict[loc_id] = {"id": loc_id, "label": tx.location, "group": "location", "val": 5}
            links.append({"source": u_id, "target": loc_id, "value": 1})
            
            if tx.decision in ["BLOCK", "ESCALATE"]:
                r_id = f"RISK-{tx.id}"
                nodes_dict[r_id] = {"id": r_id, "label": f"Alert {tx.id}", "group": "risk", "val": 8}
                links.append({"source": u_id, "target": r_id, "value": 2})
                
        # Fallback empty graph
        if not nodes_dict:
             return {"nodes": [{"id": "empty", "label": "No Data", "group": "none"}], "links": []}
             
        return {"nodes": list(nodes_dict.values()), "links": links}
    finally:
        db.close()

@router.get("/rules")
def get_rules():
    return [
        {"id": "FATF-Rec-10", "name": "Customer Due Diligence", "desc": "Identify and verify the customer's identity using reliable, independent source documents explicitly for Large Value TX.", "weight": 50, "active": True},
        {"id": "FATF-Rec-20", "name": "Suspicious Transaction Reporting", "desc": "Promptly report to the FIU when suspecting funds are the proceeds of a criminal activity.", "weight": 40, "active": True},
        {"id": "FATF-Rec-11", "name": "Record-keeping", "desc": "Maintain all necessary transaction records for at least five years.", "weight": 20, "active": True},
        {"id": "RBI-MD-KYC-38", "name": "Cross-Border Wire Transfers", "desc": "Originator information must remain with the wire transfer or related message through the payment chain.", "weight": 35, "active": True},
        {"id": "RBI-MD-KYC-3", "name": "Risk Based Approach", "desc": "Categorize customers into High, Medium, or Low risk based on AML profiles dynamically.", "weight": 30, "active": True},
        {"id": "RBI-AL-2023", "name": "Velocity Spike Anomaly", "desc": "Rapid succession of structurally similar transactions originating from single IP across multiple accounts.", "weight": 45, "active": True}
    ]

from app.schemas import CaseReportSchema, AuditLogSchema
from app.models import CaseReport, AuditLog

@router.get("/review", response_model=List[TransactionResponseSchema])
def get_under_review():
    db = SessionLocal()
    try:
        return db.query(Transaction).filter(Transaction.decision.in_(["ESCALATE", "MONITOR"])).order_by(Transaction.id.desc()).limit(150).all()
    finally:
        db.close()

@router.get("/resolved", response_model=List[TransactionResponseSchema])
def get_resolved():
    db = SessionLocal()
    try:
        return db.query(Transaction).filter(Transaction.decision == "ALLOW").order_by(Transaction.id.desc()).limit(150).all()
    finally:
        db.close()

@router.get("/cases", response_model=List[CaseReportSchema])
def get_cases():
    db = SessionLocal()
    try:
        return db.query(CaseReport).order_by(CaseReport.id.desc()).limit(100).all()
    finally:
        db.close()

@router.get("/audit", response_model=List[AuditLogSchema])
def get_audit():
    db = SessionLocal()
    try:
        return db.query(AuditLog).order_by(AuditLog.id.desc()).limit(100).all()
    finally:
        db.close()

# INTERACTIVE ENDPOINTS
from fastapi import Response

@router.get("/report/export")
def export_report():
    db = SessionLocal()
    try:
        txs = db.query(Transaction).order_by(Transaction.id.desc()).limit(200).all()
        csv_data = "ID,User ID,Amount,Location,Device,Risk Score,Decision\n"
        for t in txs:
            csv_data += f"{t.id},{t.user_id},{t.amount},{t.location},{t.device},{t.risk_score},{t.decision}\n"
        return Response(content=csv_data, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=fraud_guard_report.csv"})
    finally:
        db.close()

from pydantic import BaseModel
class DecisionUpdate(BaseModel):
    decision: str

@router.put("/transactions/{id}/decision")
def update_decision(id: int, payload: DecisionUpdate):
    db = SessionLocal()
    try:
        tx = db.query(Transaction).filter(Transaction.id == id).first()
        if tx:
            old_dec = tx.decision
            tx.decision = payload.decision
            audit = AuditLog(action="Manual Decision Override", details=f"Investigator changed Tx #{id} from {old_dec} to {payload.decision}")
            db.add(audit)
            db.commit()
            return {"status": "success"}
        return {"status": "not_found"}
    finally:
        db.close()

class StatusUpdate(BaseModel):
    status: str

@router.put("/cases/{id}/status")
def update_case_status(id: int, payload: StatusUpdate):
    db = SessionLocal()
    try:
        c = db.query(CaseReport).filter(CaseReport.id == id).first()
        if c:
            old_stat = c.status
            c.status = payload.status
            audit = AuditLog(action="Case Status Updated", details=f"Case #{id} changed from {old_stat} to {payload.status}")
            db.add(audit)
            db.commit()
            return {"status": "success"}
        return {"status": "not_found"}
    finally:
        db.close()
