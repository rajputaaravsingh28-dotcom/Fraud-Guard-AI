# Fraud Guard AI - Financial Intelligence Platform

Fraud Guard AI is a full-stack, bank-grade anomaly detection and financial crime investigation platform. It seamlessly merges deterministic FATF/KYC regulatory logic with probabilistic machine learning models to classify real-time transactional risks globally.

##  Architectural Workflow

Our platform operates on a completely decoupled microservice topology:

### 1. The Core Intake Pipeline (FastAPI & SQLite)
- Real-time transactions enter natively through the `POST /analyze-transaction` gateway.
- Data structures are immediately handed perfectly into our orchestration pipeline (`pipeline.py`).

### 2. Multi-Agent Artificial Intelligence
The exact transaction matrix is piped sequentially through a massive Cognitive Engine:
- **Isolation Forest**: Calculates a fundamental statistical anomaly bounded score targeting geographical constraints and monetary extremes natively using `scikit-learn`.
- **PyTorch Autoencoder**: A 5-layer symmetrical auto-encoder reconstructs the synthetic transactional sequence to pinpoint non-linear structural defects in spending physics.
- **Rules Engine**: The transaction is verified strictly against an immutable dictation of global FATF frameworks and RBI master compliance directions.
- **Ollama Cognitive LLM**: For extremely complex logic bounds, transaction vectors are beamed directly to a locally executing `llama3` intelligence to query logical semantics natively!

### 3. Edge-Synchronized UI Dashboard (React & Vite)
- The entire graphical frontend requests active algorithmic status from the Python Backend (`GET /kpi`, `GET /review`).
- **Data Densities**: Over 65,000 synthetic metrics calculate immediately against SQL aggregations perfectly projecting the UI without memory crashing.
- **Interactive Triggers**: The Dashboard utilizes explicit `PUT` bindings enabling administrators to physically trigger `Approve` or `Block` decisions, completely overriding AI configurations while spawning massive traceable `AuditLog` events safely.

---

##  Tech Stack

- **Frontend:** React, Vite, Recharts, `react-force-graph-2d`, Lucide Icons
- **Backend:** Python, FastAPI, Uvicorn, SQLAlchemy (SQLite physical engine)
- **Machine Learning Engine:** PyTorch, Scikit-Learn
- **Cognitive Text Processing:** Ollama daemon

## ⚙️ Running Locally
1. Start the UI: `npm run dev` (inside `frontend/`).
2. Boot Python: `python -m uvicorn app.main:app --host 127.0.0.1 --port 8001`
