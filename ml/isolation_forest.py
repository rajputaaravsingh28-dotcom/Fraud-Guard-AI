import numpy as np
import joblib
import os

model_path = os.path.join(os.path.dirname(__file__), "iso_forest.joblib")
_model = None

def get_model():
    global _model
    if _model is None:
        if os.path.exists(model_path):
            _model = joblib.load(model_path)
        else:
            # Fallback
            from sklearn.ensemble import IsolationForest
            _model = IsolationForest(contamination=0.05, random_state=42)
            _model.fit(np.random.rand(100, 2))
    return _model

def get_score(transaction) -> float:
    model = get_model()
    amount = getattr(transaction, "amount", transaction.get("amount", 0) if isinstance(transaction, dict) else 0) / 200000.0
    loc_len = len(getattr(transaction, "location", transaction.get("location", "") if isinstance(transaction, dict) else "")) / 20.0
    
    score = model.decision_function([[amount, loc_len]])[0]
    # decision_function outputs values where < 0 is anomaly, > 0 is normal.
    # Convert this to a 0-100 risk score
    # score is typically between -0.5 and 0.5
    normalized_score = max(0, min(100, ((-score) + 0.5) * 100))
    return int(normalized_score)
