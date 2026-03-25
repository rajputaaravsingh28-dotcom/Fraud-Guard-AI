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
    
    # Stage 1: Isolation Forest
    try:
        iso_score = iso(tx)
    except Exception as e:
        iso_score = 25
        print(f"[Pipeline] Isolation Forest fallback: {e}")
    logs.append({"agent": "Isolation Forest", "action": "Applied statistical anomaly isolation", "score": iso_score})
    
    # Stage 2: Autoencoder
    try:
        auto_score = auto(tx)
    except Exception as e:
        auto_score = 15
        print(f"[Pipeline] Autoencoder fallback: {e}")
    logs.append({"agent": "PyTorch Autoencoder", "action": "Computed synthetic spatial reconstruction error", "score": auto_score})

    ml_score = 1 if iso_score < 0 or auto_score > 1 else 0

    # Stage 3: Rules Engine
    try:
        rule_score, rule_reasons = apply_rules(tx)
    except Exception as e:
        rule_score, rule_reasons = 10, ["Rules engine fallback triggered"]
        print(f"[Pipeline] Rules fallback: {e}")
    for r in rule_reasons:
        logs.append({"agent": "FATF Regulatory Engine", "action": r})

    # Stage 4: Behavioral Analysis (Ollama)
    try:
        behavior_score, behavior_reasons = analyze_behavior(tx)
    except Exception as e:
        behavior_score, behavior_reasons = 20, ["Behavioral analysis fallback"]
        print(f"[Pipeline] Behavior fallback: {e}")
    for r in behavior_reasons:
        logs.append({"agent": "Ollama Cognitive LLM", "action": r, "score": behavior_score})

    # Stage 5: Risk Scoring
    try:
        risk = calculate(ml_score, rule_score, behavior_score)
    except Exception as e:
        risk = 40
        print(f"[Pipeline] Risk scoring fallback: {e}")
    logs.append({"agent": "Risk Matrix Combinator", "action": "Aggregated overall behavior-transactional vector", "score": risk})

    # Stage 6: Decision Engine (Ollama)
    try:
        decision = decide(tx, risk)
    except Exception as e:
        decision = "MONITOR"
        print(f"[Pipeline] Decision fallback: {e}")
    logs.append({"agent": "Ollama Decision Engine", "action": f"Recommended System Action: {decision}"})

    reasons = rule_reasons + behavior_reasons

    report = generate(reasons, risk, decision)
    report["agent_logs"] = json.dumps(logs)
    return report
