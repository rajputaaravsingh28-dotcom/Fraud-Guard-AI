def apply_rules(tx):
    score = 0
    reasons = []

    if tx.amount > 100000:
        score += 40
        reasons.append("High transaction amount")

    if tx.location != "India":
        score += 30
        reasons.append("Foreign transaction")

    return score, reasons
