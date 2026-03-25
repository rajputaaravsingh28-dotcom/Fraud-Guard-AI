import os
import requests
import re

OLLAMA_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/api/generate")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3")

def analyze_behavior(tx):
    score = 0
    reasons = []
    
    prompt = f"Analyze this transaction: Amount ${tx.amount}, Location: {tx.location}, Device: {tx.device}. Answer very briefly with an exact number between 0 and 100 for risk, followed by exactly one sentence of explanation."
    
    try:
        response = requests.post(OLLAMA_URL, json={
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False
        }, timeout=8) # Short timeout so it falls back fast if Ollama is not installed
        
        if response.status_code == 200:
            text = response.json().get("response", "").strip()
            # Extract the first integer identified as the score
            nums = re.findall(r'\b\d{1,3}\b', text)
            if nums:
                score = min(100, int(nums[0]))
            else:
                score = 30 # standard baseline if parsing fails
            
            # The reason is just the clean text
            clean_reason = text.replace('\n', ' ')[:80] + "..."
            reasons.append(f"AI Behavior Agent: {clean_reason}")
            return score, reasons
    except Exception as e:
        print(f"Ollama Behavior evaluation fallback triggered. Error: {e}")
        pass
        
    # Heuristic fallback if Ollama fails or isn't running
    if tx.amount > 50000:
        score += 20
        reasons.append("Unusual spending spike")
    if len(tx.location) > 10:
        score += 10
        reasons.append("Suspicious location string length")

    return score, reasons
