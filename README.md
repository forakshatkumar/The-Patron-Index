# The Patron Index
### Where Buyers Become Insight

**The Patron Index** is an enterprise-grade customer intelligence and business analytics platform designed to help modern businesses understand customer behavior and make smarter, data-driven decisions.

The platform analyses historical customer purchase data and transforms it into meaningful predictive insights. It helps businesses identify their most valuable customers, understand purchasing patterns, track customer engagement, and improve customer retention without relying on synthetic or made-up data.

---

## 🌐 Live Deployments

- **Frontend Application (Vercel):** [https://the-patron-index.vercel.app/](https://the-patron-index.vercel.app/)
- **Backend API Service (Render):** [https://the-patron-index-backend.onrender.com/](https://the-patron-index-backend.onrender.com/)

---

## 🚀 Key Features

- **CSV Data Import & Validation:** Upload customer purchase and transaction records in CSV format with instant client-side pre-validation and server-side virus/malware scanning.
- **Strict Multi-Tenant Isolation:** Zero data leakage. Every business user's customers, transactions, and scan metrics are strictly isolated to their own authenticated workspace.
- **RFM Customer Segmentation:** Automatically classifies customers into 7 distinct behavioral cohorts: **VIP**, **Loyal**, **Regular**, **New**, **Occasional**, **At-Risk**, and **Inactive**.
- **Patron Index Scoring:** Calculates an adaptive loyalty index (0–100) combining Recency (35%), Frequency (30%), and Monetary value (35%).
- **Interactive Executive Dashboard:** Real-time visibility into customer counts, active revenue, customer cohorts, recent customers, and monthly revenue trends.
- **Customer Directory & Profiling:** Detailed patron registry with search, filtering, patron score distribution, and individual purchase history.
- **Transactions Ledger:** Complete transaction ledger tracking transaction IDs, customer names, dates, amounts, categories, and payment methods.
- **Customizable Business Profile:** Dynamic business settings (Business Name, Industry, Location) that seamlessly customize the workspace and profile cards across the app.
- **Google OAuth 2.0 & JWT Authentication:** Secure login using Google One Tap / Sign-In or encrypted email credentials.

---

## 🛠️ Technology Stack

| Component | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router 6, CSS Modules / Custom Tokens |
| **Backend** | Node.js, Express.js, Mongoose, JWT, Helmet, Rate Limiter |
| **Database** | MongoDB Atlas (Multi-Tenant Document Store) |
| **Machine Learning** | Python, FastAPI, LightGBM, Scikit-learn, Isotonic Calibration |
| **Security** | DDE / Formula Injection Sanitizer, Malware File Isolation, Helmet CSP |
| **Hosting & CI/CD** | Vercel (Frontend), Render (Backend), Git / GitHub |

---

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

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas database URI

### 2. Backend Setup
```bash
cd backend
npm install
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
npm install
# Configure Frontend/.env if needed:
# VITE_API_URL=http://localhost:5000/api
# VITE_GOOGLE_CLIENT_ID=your_google_client_id
npm run dev
```

---

## 👥 Project Information

**Developed by Team CodeGoblins**  
Prasunex Innovathon 2026
