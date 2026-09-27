from fastapi import FastAPI
from datetime import datetime

app = FastAPI(title="TradeWise AI Service", version="0.1.0")

@app.get("/health")
def health():
    return {
        "status": "UP",
        "service": "tradewise-ai",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/ai/explain-concept")
def explain_concept(payload: dict):
    concept = payload.get("concept", "unknown concept")
    return {
        "concept": concept,
        "status": "placeholder",
        "message": "LLM integration will be added in the AI phase."
    }
