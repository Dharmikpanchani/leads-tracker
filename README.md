# Leads Tracking Management Portal (API + Web)

A production-grade, full-stack **Leads & Activity Tracking Application** built with **Node.js, Express, SQLite, React, TypeScript, Redux Toolkit, and Material-UI**.

Designed with enterprise standards including **JWT Authentication (Access Tokens + HTTP-Only Refresh Token Cookies)**, **Rate Limiting**, **Formik + Yup FieldArray validation**, **SQLite relational modeling**, **Jest integration tests**, and **Docker containerization**.

---

## 🚀 Key Highlights & Architecture

### **Backend Architecture**
* **Framework:** Node.js + Express (ES Modules)
* **Database:** SQLite (Relational schema with Foreign Keys and Indexes on `leads` and `notes`)
* **Security & Tokens:**
  * JWT Access Token + HTTP-Only, Secure Refresh Token Cookies
  * Auto-refresh interceptor on 401 response in Axios
  * Rate limiting with `express-rate-limit` for General API and Auth endpoints
  * Headers protection with `helmet`, CORS with credentials, and input sanitization
* **Validation & Error Handling:**
  * Strict Joi validation middleware (`Validator.js`)
  * Standard API Response envelopes (`ResponseHandler` & `CatchErrorHandler`)
  * Accurate HTTP status codes (`200`, `201`, `400`, `401`, `404`, `500`)
* **Testing:** 15 automated Jest + Supertest unit/integration tests (`npm test`)

### **Frontend Architecture**
* **Framework:** React 19 + TypeScript + Vite
* **State Management:** Redux Toolkit (`authSlice`, `leadSlice`, `noteSlice`)
* **Design System:** Material UI (`@mui/material`, `@mui/icons-material`) styled with a custom modern Navy/Gold palette (`#002147`, `#00509d`, `#f1b000`)
* **Form Management:** Formik + Yup validation using `getIn(touched, name)` and dynamic multi-row inputs with `FieldArray`
* **Features:**
  * Interactive Dashboard with pipeline metrics (Total, New, Contacted, Qualified, Lost)
  * Leads Table with search by name/email, status filtering, and custom pagination
  * Add/Edit Lead dialogs with real-time feedback
  * Lead Detail View with Notes Timeline and quick status updating
  * Batch / Multi-Lead Import using Formik `FieldArray`

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Backend** | Node.js, Express, SQLite3, JWT, bcryptjs, Joi, Helmet, CORS, Cookie-Parser, express-rate-limit |
| **Frontend** | React, TypeScript, Vite, Material UI (MUI), Redux Toolkit, Formik, Yup, Axios, React Hot Toast |
| **DevOps & Testing** | Jest, Supertest, Docker, Docker Compose, Nginx |

---

## 📦 Quick Start (Single Command Run)

### 1. Prerequisites
* **Node.js**: v18+ or v20+
* **npm**: v9+

### 2. Run Everything in One Step
In the root project directory (`leads-tracker/`), simply run:

```bash
# 1. Install dependencies for all packages & seed sample data
npm run setup

# 2. Start both Backend & Frontend concurrently with a single command
npm run dev
```

* **Frontend URL:** `http://localhost:5173`
* **Backend API:** `http://localhost:5000/api`

---

### 3. Alternative: Run Individually

**Backend:**
```bash
cd backend
npm install
npm run seed
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Default Login Credentials

| Role | Email | Password |
|---|---|---|
| **Admin User** | `admin@vidyasetu.com` | `Admin@123` |

---

## 🧪 Running Automated Tests

Run the complete test suite (15 unit/integration tests for authentication, leads CRUD, filtering, and notes):

```bash
cd backend
npm test
```

---

## 🐳 Docker Deployment

To build and run the entire application (Backend + Frontend) with Docker Compose:

```bash
docker-compose up --build
```
* **Frontend Portal:** `http://localhost:3000`
* **Backend API:** `http://localhost:5000/api`

---

## 📡 API Endpoints & cURL Examples

### 1. Authentication

#### **A. Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vidyasetu.com","password":"Admin@123"}'
```

#### **B. Refresh Token**
```bash
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Content-Type: application/json"
```

#### **C. Get Profile**
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

---

### 2. Leads Endpoints

#### **A. Get All Leads (with Search & Status Filter & Pagination)**
```bash
curl -X GET "http://localhost:5000/api/leads?search=Rajesh&status=new&page=1&limit=10" \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

#### **B. Get Lead Statistics**
```bash
curl -X GET http://localhost:5000/api/leads/stats \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

#### **C. Create New Lead**
```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
  -d '{
    "name": "Harshvardhan Joshi",
    "email": "harsh.joshi@example.com",
    "phone": "+91 9876543210",
    "status": "new",
    "source": "Web Inbound"
  }'
```

#### **D. Get Single Lead**
```bash
curl -X GET http://localhost:5000/api/leads/1 \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

#### **E. Update Lead**
```bash
curl -X PATCH http://localhost:5000/api/leads/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
  -d '{
    "status": "contacted"
  }'
```

#### **F. Delete Lead**
```bash
curl -X DELETE http://localhost:5000/api/leads/1 \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

---

### 3. Notes Endpoints

#### **A. Get Notes for Lead**
```bash
curl -X GET http://localhost:5000/api/leads/1/notes \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

#### **B. Add Note to Lead**
```bash
curl -X POST http://localhost:5000/api/leads/1/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
  -d '{
    "content": "Follow-up meeting scheduled for next Monday at 11 AM."
  }'
```

#### **C. Delete Note**
```bash
curl -X DELETE http://localhost:5000/api/leads/1/notes/1 \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

---

## 📂 Project Structure

```
leads-tracker/
├── backend/
│   ├── data/                      # SQLite database storage
│   ├── seeds/                     # Database seeders
│   ├── src/
│   │   ├── config/                # DB & environment configs
│   │   ├── controller/            # Business logic controllers
│   │   ├── middleware/            # Auth, Rate limiting & Validation
│   │   ├── models/                # SQLite query data models
│   │   ├── routes/                # Express REST routes
│   │   ├── services/              # Common services & token management
│   │   └── utils/                 # Response messages & Joi schemas
│   ├── tests/                     # Jest integration test suite
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/                   # Axios client & endpoints
│   │   ├── assets/style/          # Custom theme & global styles
│   │   ├── components/            # Sidebar, Header, Modals, Pagination
│   │   ├── pages/                 # Login, Dashboard, LeadsList, LeadDetail, Batch
│   │   ├── redux/                 # Redux Toolkit store and slices
│   │   └── routes/                # Route definitions & guards
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml
└── README.md
```
