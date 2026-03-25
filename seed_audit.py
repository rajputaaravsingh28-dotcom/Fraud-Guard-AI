import random
from datetime import datetime, timedelta
from app.database import SessionLocal, engine
from app.models import AuditLog, Base

def seed_audit():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    count = db.query(AuditLog).count()
    if count > 500:
        print("Audit Logs already natively populated.")
        db.close()
        return

    print("Synthesizing 1,500 active Audit Logs...")
    logs = []
    actions = [
        "Machine Learning Pipeline Trained", 
        "Ollama Behavioral Engine Synced", 
        "Data Batch Processed", 
        "FATF Policy Updated", 
        "Administrator System Login",
        "Investigative Query Executed",
        "Database Architecture Migrated"
    ]
    
    now = datetime.utcnow()
    for i in range(1500):
            logs.append(AuditLog(
                action=random.choice(actions),
                details=f"Secure backend operation ID-{random.randint(1000, 9999)} registered.",
                timestamp=now - timedelta(minutes=random.randint(1, 43200)) # up to 30 days
            ))
            
    db.bulk_save_objects(logs)
    db.commit()
    print("System Audit Trail successfully populated!")
    db.close()

if __name__ == "__main__":
    seed_audit()
