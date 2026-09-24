from fastapi import FastAPI
from pydantic import BaseModel, Field

from ml.business.classifier import classify_customer

app = FastAPI(title="The Patron Index Business Classification API", version="1.0.0")


class CustomerFeatures(BaseModel):
    recency: float = Field(ge=0)
    frequency: float = Field(ge=0)
    monetary: float = Field(ge=0)


@app.get("/health")
def health():
    return {"status": "ok", "service": "business-classification", "engine": "RFM-v1"}


@app.post("/classify")
def classify(features: CustomerFeatures):
    return classify_customer(features.recency, features.frequency, features.monetary)
