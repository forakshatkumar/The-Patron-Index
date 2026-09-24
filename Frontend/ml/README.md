# ML Services

The submission contains two lightweight, runnable services:

- `ml.business.api.main:app` - explainable RFM segmentation and Patron Index scoring.
- `ml.malware.api.main:app` - file-risk API with a transparent heuristic fallback. The EMBER research/preprocessing code is included, but a trained malware model artifact is not committed to Git.

## Run

From the repository root:

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r ml/requirements.txt
uvicorn ml.business.api.main:app --reload --port 8001
```

For the file-risk service:

```bash
uvicorn ml.malware.api.main:app --reload --port 8002
```
