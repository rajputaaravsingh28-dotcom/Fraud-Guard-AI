import sys
import json
import random
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from app.models import Transaction, CaseReport, AuditLog
from app.database import Base, engine

def seed_db():
    print("Connecting to Operational SQLite Pipeline...")
    
    print("Flushing existing Tables...")
    Base.metadata.drop_all(bind=engine)
    print("Constructing 50k-grade native Schemas...")
    Base.metadata.create_all(bind=engine)
    
    from sqlalchemy.orm import sessionmaker
    SessionList = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionList()
    
    print("Synthesizing 50,000 Transactions Matrix...")
    
    locations = ["USA", "India", "UK", "Russia", "China", "Brazil", "Germany", "Japan"]
    devices = ["mobile", "desktop", "tablet"]
    
    tx_bulk = []
    cases_bulk = []
    
    now = datetime.utcnow()
    
    for i in range(1, 50001):
        # 15% Fraud Probability Curve
        is_fraud = random.random() < 0.15
        
        if is_fraud:
            risk = random.uniform(70, 99)
            dec = "BLOCK" if risk > 90 else "ESCALATE"
        else:
            risk = random.uniform(1, 30)
            dec = "ALLOW"
            
        amount = round(random.uniform(5.0, 50000.0) if is_fraud else random.uniform(5.0, 2000.0), 2)
        
        agent_logs = [
            {"agent": "Isolation Forest", "action": "Applied statistical anomaly isolation", "score": random.uniform(-0.5, 0.5)},
            {"agent": "PyTorch Autoencoder", "action": "Computed synthetic spatial reconstruction error", "score": risk / 100 + random.uniform(0, 0.2)},
            {"agent": "Ollama Decision Engine", "action": f"Recommended System Action: {dec}"}
        ]
        
        t = {
            "id": i,
            "user_id": f"USR-{random.randint(1000, 99999)}",
            "amount": amount,
            "location": random.choice(locations),
            "device": random.choice(devices),
            "risk_score": risk,
            "decision": dec,
            "agent_logs": json.dumps(agent_logs),
            "timestamp": now - timedelta(minutes=random.randint(0, 1440))
        }
        tx_bulk.append(t)
        
        if dec in ["ESCALATE", "BLOCK"]:
            cases_bulk.append({
                "transaction_id": i,
                "status": "OPEN" if random.random() < 0.8 else "CLOSED",
                "notes": f"Auto-generated intelligence case globally spawned.",
                "created_at": now - timedelta(minutes=random.randint(0, 60))
            })
            
        if i % 10000 == 0:
            print(f"Generated {i} computational arrays...")

    print("Executing Native SQLAlchemy bulk_insert_mappings() Injection...")
    db.bulk_insert_mappings(Transaction, tx_bulk)
    print("Executing CaseReport Injection...")
    if cases_bulk:
        db.bulk_insert_mappings(CaseReport, cases_bulk)
        
    db.commit()
    print("Database physical seeding successfully completed. 50,000 active nodes injected!")
    db.close()

if __name__ == "__main__":
    seed_db()
