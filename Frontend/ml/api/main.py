from fastapi import FastAPI

app = FastAPI(title="The Patron Index ML API", version="1.0.0")


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "ml-api",
        "available_services": ["business RFM classification", "file-risk analysis"],
    }
