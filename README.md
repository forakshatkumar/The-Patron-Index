# The Patron Index

**Secure Customer Intelligence & Segmentation Platform**

The Patron Index helps business owners turn raw purchase history into understandable customer segments and actions. It combines a React SaaS dashboard, a Node/Express API, MongoDB storage, explainable RFM-based customer classification, JWT authentication, secure file handling, and optional ML/security services.

## Core workflow

1. Business owner registers/signs in.
2. Uploads a customer purchase CSV.
3. Backend validates and quarantines the upload.
4. CSV data is aggregated into customer-level RFM features: **Recency, Frequency, Monetary value**.
5. Customers are assigned a **Patron Index (0-100)** and segment such as VIP, Loyal, Regular, New, Occasional, At-Risk or Inactive.
6. Dashboard and customer pages show business-friendly insights and recommendations.

## Repository structure

```text
The-Patron-Index/
├── Frontend/          React + Vite SaaS dashboard
├── backend/           Node.js + Express + MongoDB API
├── ml/                Business classification + file-risk services/research
├── sample-data/       Ready-to-import demo CSV
└── README.md
```

## Tech stack

- **Frontend:** React, React Router, Vite
- **Backend:** Node.js, Express
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + bcrypt
- **Customer Intelligence:** RFM analysis + Patron Index scoring
- **Security:** Multer file restrictions, size validation, quarantine, Helmet, JWT-protected endpoints, audit logging
- **ML API:** FastAPI services for business classification and file-risk analysis

## Quick demo (frontend only)

The frontend includes **Demo Mode**, so evaluators can explore the complete UI without database credentials.

```bash
cd Frontend
npm install
npm run dev
```

Open the Vite URL and click **Open Demo Dashboard**.

## Full-stack setup

### 1. Backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in your own values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Run:

```bash
npm run dev
```

Health check:

```text
GET http://localhost:5000/api/health
```

### 2. Frontend

```bash
cd Frontend
npm install
npm run dev
```

Optional `Frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Register a user from the UI, then sign in.

### 3. Import sample customer data

Use:

```text
sample-data/customer_purchases.csv
```

The required columns are:

```text
customer_id,name,purchase_date,amount
```

`email` and `product` are optional.

## API overview

### Public

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/health
```

### JWT protected

```text
GET  /api/dashboard/summary
GET  /api/customers
GET  /api/customers/:id
POST /api/customers
POST /api/customers/import
POST /api/scan/upload
GET  /api/scan/:id
```

Protected calls use:

```text
Authorization: Bearer <JWT_TOKEN>
```

## ML services

Install:

```bash
pip install -r ml/requirements.txt
```

Business classification API:

```bash
uvicorn ml.business.api.main:app --reload --port 8001
```

File-risk API:

```bash
uvicorn ml.malware.api.main:app --reload --port 8002
```

The repository contains EMBER research/preprocessing code. A trained malware model artifact is **not** included in the submission; the runnable file-risk API transparently uses a heuristic fallback until a trained artifact is mounted.

## Security notes

- Real `.env` files, database credentials and JWT secrets are intentionally excluded.
- Uploaded files are restricted by extension and size and stored in a quarantine directory.
- CSV customer imports undergo schema validation before processing.
- Business APIs require JWT authentication.
- Sensitive actions create audit logs.

## Submission checklist

- No `node_modules/` included.
- No `.env` or credentials included.
- `.env.example` files included.
- Sample dataset included.
- Frontend Demo Mode works without external services.
