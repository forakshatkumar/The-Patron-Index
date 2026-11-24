# ML Subsystem Architecture

The Patron Index provides two dedicated machine learning and statistical microservices:

1. **Business Intelligence Service (`ml/business`)**:
   - RFM (Recency, Frequency, Monetary) clustering and segmentation engine.
   - Normalized Patron Index score calculator (0-100 rating scale).
   - Automated cohort classification (VIP, Loyal, Regular, New, Occasional, At-Risk, Inactive).

2. **File Quarantine & Risk Assessment Engine (`ml/malware`)**:
   - Static heuristic detection and PE binary structure analysis.
   - Shannon entropy distribution inspection for packed/encrypted content.
   - Automated quarantine verdict generation (ALLOW vs. REVIEW).
