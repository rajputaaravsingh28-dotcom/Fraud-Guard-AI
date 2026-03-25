def calculate(ml_score, rule_score, behavior_score):
    risk = (ml_score * 40) + (rule_score * 0.4) + (behavior_score * 0.2)
    return min(risk, 100)
