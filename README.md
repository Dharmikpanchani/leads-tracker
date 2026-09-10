# Leads Tracking Management Portal (API + Web)

A full-stack, enterprise-grade **Leads & Activity Tracking Application** built with **Node.js, Express, MongoDB (Mongoose), React 19, TypeScript, Redux Toolkit, and Material-UI**.

The portal features secure **JWT Authentication (Access Tokens + HTTP-Only Refresh Cookies)**, **Email-based OTP Password Recovery**, **Interactive Swagger / OpenAPI Documentation**, **Rate Limiting**, **Formik + Yup Dynamic Validations**, **MongoDB Relational Indexing & Soft Deletes**, **Automated Jest Integration Tests**, and high-performance lead management supporting 3,000+ seeded records.

---

## 🚀 Key Highlights & Architecture

### **Backend Architecture**
* **Runtime & Framework:** Node.js + Express (ES Modules)
* **Database & ODM:** MongoDB with Mongoose (Indexed models for `User`, `Lead`, `Note`, and `Otp` with soft-delete support)
* **Security & Tokens:**
  * JWT Access Token (Authorization Bearer Header) + HTTP-Only Refresh Token Cookie
  * Automatic token refresh interceptor via Axios on 401 unauthorized responses
  * Security headers powered by `helmet`, CORS with credentials support
  * Dual-layer rate limiting with `express-rate-limit` (General API limiter & stricter Auth limiter)
  * Strong password hashing using `bcryptjs`
* **OTP & Email Workflow:**
  * 6-digit OTP generation and verification with expiration timers
  * Email delivery via `nodemailer` (Gmail SMTP integration)
* **Validation & Error Handling:**
  * Strict Joi schema validation middleware (`Validator.js`)
  * Standardized API response format with accurate HTTP status codes (`http-status-codes`)
  * Centralized global error handling middleware
* **API Documentation:**
  * Interactive Swagger UI OpenAPI 3.0 at `/api-docs` and `/api/docs`
  * Raw JSON specification at `/api-docs.json`
* **Testing:** Automated Jest + Supertest integration test suite (`npm test`)

### **Frontend Architecture**
* **Framework:** React 19 + TypeScript + Vite
* **State Management:** Redux Toolkit (`authSlice`, `leadSlice`, `noteSlice`)
* **Design System:** Material UI v7 (`@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`) with custom theme styling
* **Form Management:** Formik + Yup validation with `FieldArray` for multi-row dynamic inputs
* **Routing & Notifications:** React Router v7 with protected route guards, and toast notifications via `react-hot-toast`
* **Key Features:**
  * **Interactive Analytics Dashboard:** Real-time metrics breakdown (Total, New, Contacted, Qualified, Lost leads)
  * **Leads Management Table:** Live search (name, email, phone), status filtering, custom pagination, and column sorting
  * **Lead Details & Notes Timeline:** Complete lead profile view, quick status switcher, and activity notes timeline (add/delete)
  * **Batch / Multi-Lead Import:** Dynamic multi-row batch creation using Formik `FieldArray`
  * **User Profile & Security:** Profile information editing and change password workflows
  * **Password Recovery:** Step-by-step Forgot Password, OTP verification, and Set Password screens

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Backend** | Node.js, Express.js (ESM), MongoDB, Mongoose, JWT, bcryptjs, Joi, Helmet, CORS, Cookie-Parser, express-rate-limit, Nodemailer, Swagger UI, swagger-jsdoc |
| **Frontend** | React 19, TypeScript, Vite, Material UI (MUI v7), Redux Toolkit, React Router v7, Formik, Yup, Axios, React Hot Toast, js-cookie |
| **Testing & Quality** | Jest, Supertest, ESLint |

---

## 📦 Quick Start & Setup

### 1. Prerequisites
* **Node.js**: v18+ or v20+
* **npm**: v9+
* **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI

---

### 2. Environment Configuration

#### **Backend Configuration** (`backend/.env`)
Create `backend/.env` (or copy from `backend/.env.example`):
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000

# Admin Credentials for Seeding
DEV_ADMIN_EMAIL=developer@yopmail.com
DEV_ADMIN_PASSWORD=Admin@123
SYSTEM_ADMIN_EMAIL=admin@vidyasetu.com
SYSTEM_ADMIN_PASSWORD=Admin@123

# Database
MONGO_URI=mongodb://127.0.0.1:27017/leads_tracker

# JWT Secrets
JWT_ACCESS_SECRET=leads_tracker_access_secret_key_2026_@secure
JWT_REFRESH_SECRET=leads_tracker_refresh_secret_key_2026_@secure
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email (Gmail SMTP for OTPs)
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_MAX_API=1000
RATE_MAX_AUTH=100
```

#### **Frontend Configuration** (`frontend/.env`)
Create `frontend/.env` (or copy from `frontend/.env.example`):
```env
VITE_API_URL=/api
VITE_BACKEND_URL=http://127.0.0.1:5000
VITE_APP_TITLE=Leads Tracker Portal
```

---

### 3. Installation & Running the Application

#### **Step 1: Install Dependencies**
```bash
# In the backend directory
cd backend
npm install

# In the frontend directory
cd ../frontend
npm install
```

#### **Step 2: Seed the Database**
Populate MongoDB with default admin accounts, 3,000 realistic leads, and activity notes:
```bash
# From root directory:
npm run seed

# OR from backend directory:
cd backend
npm run seed
```

#### **Step 3: Start the Applications**

**From the Root Directory:**
```bash
# Terminal 1 - Backend:
npm run dev:backend

# Terminal 2 - Frontend:
npm run dev:frontend
```

**Or Run Individually:**
```bash
# Backend (runs on http://localhost:5000)
cd backend
npm run dev

# Frontend (runs on http://localhost:5173)
cd frontend
npm run dev
```

* **Frontend Portal:** [http://localhost:5173](http://localhost:5173)
* **Backend API Base:** [http://localhost:5000/api](http://localhost:5000/api)
* **Interactive Swagger Docs:** [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

---

## 🔑 Default Login Credentials

After running `npm run seed`, you can sign in with either of the following accounts:

| User Type | Email | Password | Role |
|---|---|---|---|
| **Developer Admin** | `developer@yopmail.com` | `Admin@123` | Full Access |
| **System Admin** | `admin@vidyasetu.com` | `Admin@123` | Full Access |

---

## 🧪 Running Automated Tests

Run the backend integration test suite covering Authentication, Leads CRUD, Search, Status Filtering, Notes, and Soft Delete:

```bash
cd backend
npm test
```

---

## 📡 API Endpoints Overview

Explore and test all endpoints interactively in the Swagger UI at `http://localhost:5000/api-docs`.

### 1. System
* `GET /api/health` - Health check status and timestamp

### 2. Authentication & Profile
* `POST /api/auth/login` - User login (Returns JWT access token & sets HTTP-only refresh cookie)
* `POST /api/auth/refresh-token` - Refresh access token
* `POST /api/auth/logout` - Logout and clear auth cookies
* `GET /api/auth/profile` - Get logged-in user profile
* `PUT /api/auth/profile` - Update user profile details
* `POST /api/auth/change-password` - Change password with old and new password
* `POST /api/auth/forgot-password` - Request 6-digit OTP sent via email
* `POST /api/auth/verify-otp` - Verify received OTP code
* `POST /api/auth/resend-otp` - Resend password reset OTP code
* `POST /api/auth/set-password` - Set new password using verified OTP

### 3. Leads Management
* `GET /api/leads` - List leads with pagination (`page`, `limit`), search (`search`), status filter (`status`), and sorting (`sortBy`, `sortOrder`)
* `GET /api/leads/stats` - Summary KPI metrics (`totalLeads`, `newLeads`, `contactedLeads`, `qualifiedLeads`, `lostLeads`)
* `POST /api/leads` - Create a single new lead
* `POST /api/leads/bulk` - Batch create multiple leads
* `GET /api/leads/:id` - Fetch lead by ID
* `PATCH /api/leads/:id` - Update lead details / status
* `DELETE /api/leads/:id` - Soft delete lead

### 4. Notes & Activity
* `GET /api/leads/:id/notes` - Fetch all activity notes for a specific lead
* `POST /api/leads/:id/notes` - Add a new activity note to a lead
* `DELETE /api/leads/:id/notes/:noteId` - Delete a specific note

---

## 📂 Project Structure

```
leads-tracker/
├── package.json                   # Root scripts (seed, dev:backend, dev:frontend)
├── README.md                      # Project documentation
├── backend/
│   ├── seeds/
│   │   └── seed.js                # MongoDB seeder (Admins, 3,000 Leads, Activity Notes)
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # Mongoose MongoDB connection
│   │   │   ├── index.js           # Environment configuration loader
│   │   │   └── swagger.js         # OpenAPI 3.0 / Swagger configuration
│   │   ├── controller/
│   │   │   ├── AuthController.js  # Auth, profile, OTP & password reset logic
│   │   │   ├── LeadController.js  # Leads CRUD, stats & bulk import
│   │   │   └── NoteController.js  # Activity notes CRUD
│   │   ├── middleware/
│   │   │   ├── Auth.js            # JWT Bearer token authentication guard
│   │   │   ├── RateLimit.js       # General API & Auth endpoint rate limiters
│   │   │   └── Validator.js       # Joi request validation middleware
│   │   ├── models/
│   │   │   ├── Lead.js            # Lead Mongoose schema & indexes
│   │   │   ├── Note.js            # Note Mongoose schema & indexes
│   │   │   ├── Otp.js             # OTP Mongoose schema with TTL
│   │   │   └── User.js            # User Mongoose schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js     # Auth & OTP route definitions
│   │   │   ├── lead.routes.js     # Lead & Notes route definitions
│   │   │   └── index.js           # Main Express router & health endpoint
│   │   ├── services/
│   │   │   └── EmailService.js    # Nodemailer email / OTP transporter
│   │   ├── utils/
│   │   │   ├── AuthHelper.js      # Password hashing & JWT generation
│   │   │   ├── ResponseHandler.js # Standardized JSON response formatting
│   │   │   └── Validation.js      # Joi schemas for requests
│   │   └── app.js                 # Express application & middleware setup
│   ├── tests/
│   │   └── lead.test.js           # Jest + Supertest API integration tests
│   ├── .env.example
│   ├── package.json
│   └── server.js                  # Backend entry point (Port listener)
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── axios.ts           # Axios instance with auth interceptors
    │   │   ├── auth.api.ts        # Auth & Profile API calls
    │   │   └── lead.api.ts        # Leads & Notes API calls
    │   ├── assets/
    │   │   └── style/             # MUI theme setup & global styles
    │   ├── components/
    │   │   ├── Header.tsx         # Navbar with user menu & navigation
    │   │   ├── Sidebar.tsx        # Navigation sidebar
    │   │   └── Pagination.tsx     # Custom table pagination component
    │   ├── pages/
    │   │   ├── Auth/
    │   │   │   ├── ForgotPassword.tsx     # Email OTP request page
    │   │   │   ├── ForgotPasswordOtp.tsx  # OTP verification page
    │   │   │   └── SetPassword.tsx        # Set new password page
    │   │   ├── Leads/
    │   │   │   ├── AddEditLeadModal.tsx   # Lead create/edit modal
    │   │   │   ├── BatchCreateLeads.tsx   # Multi-row Formik FieldArray lead creation
    │   │   │   ├── LeadDetail.tsx         # Lead details & notes timeline view
    │   │   │   └── LeadsList.tsx          # Leads data table with filters & search
    │   │   ├── profile/
    │   │   │   ├── Profile.tsx            # Profile overview
    │   │   │   ├── EditProfile.tsx        # Profile edit form
    │   │   │   └── ChangePassword.tsx     # Password change form
    │   │   ├── Dashboard.tsx      # Analytics & KPI overview dashboard
    │   │   └── Login.tsx          # User sign-in page
    │   ├── redux/
    │   │   ├── slices/            # authSlice, leadSlice, noteSlice
    │   │   └── store.ts           # Redux store configuration
    │   ├── routes/
    │   │   └── AppRoutes.tsx      # React Router config & auth guards
    │   ├── App.tsx
    │   └── main.tsx
    ├── .env.example
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```
