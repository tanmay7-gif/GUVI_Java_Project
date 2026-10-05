# FitPulse — Enterprise Online Fitness Tracking Platform

FitPulse is a modern, clinical-grade full-stack wellness and fitness telemetry application featuring interactive 3D WebGL visualizations, physiological workout tracking, and strict role-based access control.

---

## 1. Clean Full-Stack Architecture Layout

```
fitpulse/
├── frontend/                     # React 19 + Vite 8 + Three.js / R3F + Tailwind CSS v4
│   ├── src/                      # Components, pages, hooks, 3D canvases, context
│   ├── public/                   # Static icons, models, textures
│   ├── index.html                # Client entrypoint
│   ├── vite.config.ts            # Vite build & backend proxy configuration
│   ├── tsconfig.json             # TypeScript client config
│   └── package.json              # Frontend client dependencies
│
├── backend/                      # Server-side logic & APIs
│   ├── src/                      # Express controllers, routes, middleware, models
│   │   ├── config/               # Database & JWT configurations
│   │   ├── controllers/          # Auth, Workouts, Challenges, Admin, Content controllers
│   │   ├── middleware/           # RBAC authorization, JWT verification, Zod validators
│   │   ├── routes/               # Modular REST API routes (/api/*)
│   │   └── index.ts              # Express application server entrypoint
│   ├── java-spring/              # Alternative Enterprise Spring Boot 3.3.4 microservice
│   ├── test-e2e.ts               # End-to-end integration test suite
│   ├── tsconfig.json             # TypeScript server config
│   ├── .env                      # Server runtime environment configuration
│   └── package.json              # Backend dependencies and Prisma scripts
│
├── database/                     # Universal schemas & persistence artifacts
│   ├── schema.prisma             # Universal Prisma schema (SQLite / PostgreSQL)
│   ├── schema.sql                # Production ANSI SQL DDL migration script
│   ├── seed.ts                   # Comprehensive TypeScript database seeder
│   ├── dev.db                    # Ready-to-use local SQLite database
│   └── README.md                 # Database migration & schema documentation
│
├── docs/                         # Platform architecture & specifications
│   ├── ARCHITECTURE.md           # Full-stack architectural breakdown
│   ├── API_DOCUMENTATION.md      # REST API endpoints reference
│   ├── DATABASE_SCHEMA.md        # Data models and ER diagrams
│   └── README.md                 # Documentation index
│
├── .gitignore                    # Top-level Git ignore rules
├── docker-compose.yml            # Multi-container orchestration (Postgres, API, UI)
├── package.json                  # Root monorepo orchestration scripts
└── README.md                     # This file
```

---

## 2. Exact Terminal Commands to Run Locally

### Option A: Run Both Concurrently (Recommended)
From the root directory:
```bash
# 1. Install root dependencies (once)
npm install

# 2. Run both Backend (:5000) and Frontend (:5173) simultaneously
npm run dev
```

---

### Option B: Run Services Individually

#### 1. Start the Backend API Server
```bash
cd backend
npm run dev
```
> The API server will start on `http://localhost:5000` with hot-reloading.  
> Health check: `http://localhost:5000/api/health`

#### 2. Start the Frontend Client
```bash
cd frontend
npm run dev
```
> The Vite development server will start on `http://localhost:5173`.  
> API requests to `/api` are automatically proxied to the backend at `http://localhost:5000`.

---

### Option C: Database Management & Seeding

```bash
# Seed the local database with pre-populated demo data
npm run db:seed

# Push Prisma schema updates to database
npm run db:push

# Generate Prisma Client
npm run db:generate
```

---

### Option D: Run Automated Integration Tests

```bash
npm test
```

---

## 3. Pre-Seeded Default Accounts

| Role | Email Address | Password | Permissions & Features |
| :--- | :--- | :--- | :--- |
| **Athlete** | `sarah@fitpulse.com` | `User123!` | Workout logging, 3D anatomical avatar, progress analytics |
| **Administrator** | `admin@fitpulse.com` | `Admin123!` | System dashboard, user management, content moderation |

---

## 4. Port Reference
- **Frontend Web App**: `http://localhost:5173`
- **Backend REST API**: `http://localhost:5000`
- **Spring Boot Service** *(optional)*: `http://localhost:8080`
