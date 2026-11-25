# The Patron Index
### Where Buyers Become Insight

**The Patron Index** is an enterprise-grade customer intelligence and business analytics platform designed to help modern businesses understand customer behavior and make smarter, data-driven decisions.

The platform analyses historical customer purchase data and transforms it into explainable RFM insights. It helps businesses identify their most valuable customers, understand purchasing patterns, track customer engagement, and improve customer retention without on relying on synthetic or made-up data.

---

## 🌐 Live Deployments

- **Application (Vercel):** - [Live Demo](https://thepatronindex.vercel.app)


---

## 🚀 Key Features

- **CSV Data Import & Validation:** Upload customer purchase and transaction records in CSV format with client-side header checks and server-side row validation.
- **Workspace data access:** Analyst accounts are scoped to their own records; existing admin accounts retain broader access.
- **RFM Customer Segmentation:** Automatically classifies customers into 7 distinct behavioral cohorts: **VIP**, **Loyal**, **Regular**, **New**, **Occasional**, **At-Risk**, and **Inactive**.
- **Patron Index Scoring:** Calculates an adaptive loyalty index (0–100) combining Recency (35%), Frequency (30%), and Monetary value (35%).
- **Interactive Executive Dashboard:** Real-time visibility into customer counts, active revenue, customer cohorts, recent customers, and monthly revenue trends.
- **Customer Directory & Profiling:** Detailed patron registry with search, filtering, patron score distribution, and individual purchase history.
- **Transactions Ledger:** Complete transaction ledger tracking transaction IDs, customer names, dates, amounts, categories, and payment methods.
- **Customizable Business Profile:** Dynamic business settings (Business Name, Industry, Location) that seamlessly customize the workspace and profile cards across the app.
- **Authentication:** Google Sign-In and email/password with hashed passwords and persistent HttpOnly sessions.

---

## 🛠️ Technology Stack

| Component | Technologies |
|---|---|
| **Frontend** | React 19, Vite, React Router 7, CSS Modules / Custom Tokens |
| **Backend** | Node.js, Express.js, Mongoose, JWT, Helmet, Rate Limiter |
| **Database** | MongoDB Atlas (Multi-Tenant Document Store) |
| **Machine Learning** | Python, FastAPI, explainable RFM and optional heuristic scanner |
| **Security** | CSV export formula escaping, upload limits, Helmet, session cookies |
| **Hosting & CI/CD** | Vercel (Frontend), Render (Backend), Git / GitHub |

---
## 📊 RFM Analysis Methodology

The Patron Index uses Recency, Frequency, and Monetary (RFM) analysis to evaluate customer behavior and engagement.

- **Recency (35%):** Measures how recently a customer made a purchase.
- **Frequency (30%):** Evaluates how often a customer makes purchases.
- **Monetary (35%):** Measures the total monetary value of a customer's purchases.

These metrics help businesses identify valuable customers, recognize potential customer churn, and develop targeted customer retention strategies.

---git diff README.md

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create a new user account.
- `POST /api/auth/login` - Authenticate with email and password.
- `POST /api/auth/google` - Verify Google OAuth credentials.

### Customers (`/api/customers`)
- `GET /api/customers` - Retrieve authenticated user's customers with RFM classifications.
- `POST /api/customers` - Add a new customer to the user's registry.
- `GET /api/customers/:id` - Fetch single customer details and predictions.
- `POST /api/customers/import` - Bulk import customers and transactions from CSV.

### Transactions (`/api/transactions`)
- `GET /api/transactions` - Fetch customer transactions for the authenticated user.
- `GET /api/transactions/customer/:id` - Fetch transactions for a specific customer.

### Dashboard & Analytics (`/api/dashboard`)
- `GET /api/dashboard/summary` - Aggregate metrics, active patrons, segment distribution, and monthly revenue.

### Security Scanner (`/api/scan`)
- `POST /api/scan/upload` - Secure file upload with quarantine and risk assessment.
- `GET /api/scan/:id` - Query scan verdict and risk score.

---

## 💻 Local Development Setup

See [PRODUCTION_UPDATE.md](PRODUCTION_UPDATE.md) for exact deployment and verification steps.

### 1. Prerequisites
- Node.js 22.x (at least 22.12)
- npm or yarn
- MongoDB Atlas database URI

### 2. Backend Setup
```bash
cd backend
npm ci
# Configure your .env file:
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# GOOGLE_CLIENT_ID=your_google_client_id
npm run dev
```

### 3. Frontend Setup
```bash
cd Frontend
npm ci
# Configure Frontend/.env if needed:
# PATRON_API_PROXY_TARGET=http://127.0.0.1:5000 (optional)
# VITE_GOOGLE_CLIENT_ID=your_google_client_id
npm run dev
```

---

## 👥 Project Information

**Developed by Team CodeGoblins**  
Prasunex Innovathon 2026
