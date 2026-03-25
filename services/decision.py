import os
import requests

OLLAMA_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/api/generate")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3")

def decide(tx, risk):
    prompt = f"As the final Decision Engine for a bank API, verify this payload: User ID {tx.user_id}, Amount ${tx.amount}, Branch {tx.location}. Calculated Risk: {risk}/100. Choose EXACTLY ONE response: [ALLOW, MONITOR, ESCALATE, BLOCK]."
    
    try:
        response = requests.post(OLLAMA_URL, json={
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False
        }, timeout=5)
        
        if response.status_code == 200:
            text = response.json().get("response", "").upper()
            if "BLOCK" in text: return "BLOCK"
            if "ESCALATE" in text: return "ESCALATE"
            if "MONITOR" in text: return "MONITOR"
            if "ALLOW" in text: return "ALLOW"
    except Exception as e:
        print(f"Ollama Decision evaluation fallback triggered: {e}")
        pass
        
    # Heuristic fallback if Ollama times out or errors
    if risk > 80:
        return "BLOCK"
    elif risk > 60:
        return "ESCALATE"
    elif risk > 30:
        return "MONITOR"
    return "ALLOW"
