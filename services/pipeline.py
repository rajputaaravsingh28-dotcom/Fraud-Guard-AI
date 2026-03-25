import json
from app.ml.isolation_forest import get_score as iso
from app.ml.autoencoder import get_score as auto
from app.rules.rule_engine import apply_rules
from app.services.behavior import analyze_behavior
from app.services.risk_scoring import calculate
from app.services.decision import decide
from app.utils.report import generate

def run(tx):
    logs = []
    
    iso_score = iso(tx)
    logs.append({"agent": "Isolation Forest", "action": "Applied statistical anomaly isolation", "score": iso_score})
    
    auto_score = auto(tx)
    logs.append({"agent": "PyTorch Autoencoder", "action": "Computed synthetic spatial reconstruction error", "score": auto_score})

    ml_score = 1 if iso_score < 0 or auto_score > 1 else 0

    rule_score, rule_reasons = apply_rules(tx)
    for r in rule_reasons:
        logs.append({"agent": "FATF Regulatory Engine", "action": r})

    behavior_score, behavior_reasons = analyze_behavior(tx)
    for r in behavior_reasons:
        logs.append({"agent": "Ollama Cognitive LLM", "action": r, "score": behavior_score})

    risk = calculate(ml_score, rule_score, behavior_score)
    logs.append({"agent": "Risk Matrix Combinator", "action": "Aggregated overall behavior-transactional vector", "score": risk})

    decision = decide(tx, risk)
    logs.append({"agent": "Ollama Decision Engine", "action": f"Recommended System Action: {decision}"})

    reasons = rule_reasons + behavior_reasons

    report = generate(reasons, risk, decision)
    report["agent_logs"] = json.dumps(logs)
    return report
