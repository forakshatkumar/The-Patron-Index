"""Explainable RFM customer segmentation used by The Patron Index MVP."""


def _clamp(value, low=0.0, high=100.0):
    return max(low, min(high, float(value)))


def patron_index(recency: float, frequency: float, monetary: float) -> int:
    recency_score = _clamp(100 - recency)
    frequency_score = _clamp(frequency * 5)
    monetary_score = _clamp(monetary / 1000)
    return round(recency_score * 0.35 + frequency_score * 0.30 + monetary_score * 0.35)


def classify_customer(recency: float, frequency: float, monetary: float):
    score = patron_index(recency, frequency, monetary)
    if recency >= 120:
        segment = "Inactive"
    elif recency >= 60:
        segment = "At-Risk"
    elif frequency <= 2 and recency <= 30:
        segment = "New"
    elif score >= 85 or (monetary >= 75000 and frequency >= 15):
        segment = "VIP"
    elif score >= 70 or frequency >= 12:
        segment = "Loyal"
    elif frequency >= 6:
        segment = "Regular"
    else:
        segment = "Occasional"

    recommendations = {
        "VIP": "Offer exclusive benefits, early access and premium rewards.",
        "Loyal": "Reward loyalty and recommend relevant products.",
        "Regular": "Use targeted bundles or cross-sell offers.",
        "New": "Send a welcome offer and encourage a second purchase.",
        "Occasional": "Use seasonal reminders to improve purchase frequency.",
        "At-Risk": "Start a personalized win-back campaign.",
        "Inactive": "Run a reactivation campaign and request feedback.",
    }
    return {
        "segment": segment,
        "patron_index": score,
        "recommendation": recommendations[segment],
    }
