# ⚡ FitPulse — Enterprise Online Fitness Tracking Platform

> Production-ready, secure, and responsive full-stack fitness tracking application engineered with **React 19, TypeScript, Tailwind CSS, Recharts, Express, Prisma ORM, and SQLite / PostgreSQL**.

---

## 📸 Platform Architecture & Dashboard Preview

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons + Recharts
- **Backend**: Node.js + Express + TypeScript + Clean MVC Architecture
- **Database & ORM**: Prisma ORM with typed client (Pre-configured for zero-setup SQLite; switches to PostgreSQL by modifying one line in `schema.prisma`)
- **Authentication & RBAC**: JWT Bearer authentication, bcrypt hashing, and strict Role-Based Access Control (`ADMIN` vs `USER`)
- **API Standards**: RESTful API conventions, Zod boundary validations, centralized error handling, and structured JSON responses.

---

## 🔑 Demo Access Credentials

Both accounts are pre-seeded with complete realistic telemetry, workout logs, active challenges, and audit events.

| Role | Email Address | Password | Permissions & Scope |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@fitpulse.com` | `Admin123!` | Full Admin Portal, User Management CRUD, Content Moderation, Global Settings, System Audit Feed |
| **Athlete (User)** | `sarah@fitpulse.com` | `User123!` | Athlete Dashboard, Biometric Telemetry & Recharts, Log Workouts, Challenge Milestones, Profile |
| **Athlete (User)** | `david@fitpulse.com` | `User123!` | Athlete Dashboard, Personal Workouts, Community Guides |

*(The UI also includes a 1-click Demo Role Switcher in the top navigation bar to toggle between Admin and Athlete instantly).*

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js v18+ (tested on Node.js v24)
- npm v9+

### 2. Backend Setup
```bash
cd server
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
# Server starts on http://localhost:5000
# Health check: http://localhost:5000/api/health
```

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
# Vite client starts on http://127.0.0.1:5173
```

### 4. Run Automated End-to-End Test Suite
```bash
cd server
npx tsx test-e2e.ts
```
Expected output: `📊 Verification Summary: 11 Passed, 0 Failed`.

---

## 🗄️ Database Entities & Data Models

1. **`User`**: `id`, `name`, `email`, `password_hash`, `role` (`ADMIN` | `USER`), `profile_image`, `is_active`, `created_at`, `updated_at`.
2. **`WorkoutLog`**: `id`, `user_id`, `type`, `duration_minutes`, `intensity` (`LOW`, `MEDIUM`, `HIGH`), `calories_burned`, `date`, `notes`.
3. **`FitnessContent`**: `id`, `creator_id`, `title`, `description`, `category`, `media_url`, `status` (`PENDING`, `APPROVED`, `REJECTED`), `feedback`, `created_at`.
4. **`Challenge`**: `id`, `title`, `description`, `target_metric` (`CALORIES`, `DURATION`, `WORKOUT_COUNT`), `target_value`, `start_date`, `end_date`, `reward_badge`.
5. **`UserChallenge`**: `id`, `user_id`, `challenge_id`, `status` (`IN_PROGRESS`, `COMPLETED`, `ABANDONED`), `current_progress`, `joined_at`, `completed_at`.
6. **`SystemSetting`**: `id`, `key`, `value`, `description`, `updated_by`, `updated_at`.
7. **`AuditLog`**: `id`, `user_id`, `action`, `details`, `timestamp`.

---

## 📡 RESTful API Endpoints Matrix

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new athlete account (Validated by Zod)
- `POST /api/auth/login` — Sign in and issue signed JWT token
- `GET /api/auth/me` — Retrieve active profile (Auth required)
- `PATCH /api/auth/profile` — Update display name, email, or avatar
- `POST /api/auth/change-password` — Change password with current password verification

### Workouts (`/api/workouts`)
- `GET /api/workouts` — Query user's logged workouts with filters (type, date range, pagination)
- `GET /api/workouts/analytics` — Fetch aggregated telemetry: weekly volume, daily expenditure trend, intensity breakdown, lifetime records
- `GET /api/workouts/estimate-calories` — Real-time dynamic MET caloric burn estimation
- `POST /api/workouts` — Create workout log (Enforces boundary checks: > 0 duration, >= 0 calories)
- `PUT /api/workouts/:id` — Update workout log
- `DELETE /api/workouts/:id` — Delete workout log

### Challenges (`/api/challenges`)
- `GET /api/challenges` — List public community challenges with participant counts & personal progress
- `POST /api/challenges/:challengeId/join` — Enroll athlete into challenge
- `GET /api/challenges/my/progress` — Fetch user's active challenges & unlocked trophy cabinet badges
- `POST /api/challenges/admin/create` — Launch new challenge (`ADMIN` only)

### Content & Guides (`/api/content`)
- `GET /api/content` — Browse approved community guides and workout protocols
- `POST /api/content` — Submit guide (Regular users start in `PENDING` queue)
- `GET /api/content/admin/all` — Inspect moderation queue (`ADMIN` only)
- `PATCH /api/content/admin/:id/moderate` — Moderate guide (`APPROVED` or `REJECTED` with feedback) (`ADMIN` only)

### Administrator Operations (`/api/admin`)
- `GET /api/admin/dashboard` — Platform KPIs, 7-day engagement telemetry, and real-time audit feed (`ADMIN` only)
- `GET /api/admin/users` — Paginated user management table with role filter and search (`ADMIN` only)
- `POST /api/admin/users` — Provision new user account (`ADMIN` only)
- `PATCH /api/admin/users/:id` — Modify user role, details, or active toggle (`ADMIN` only)
- `DELETE /api/admin/users/:id` — Purge user account (`ADMIN` only)
- `GET /api/admin/settings` — Query global system settings (`ADMIN` only)
- `PUT /api/admin/settings/:key` — Update system setting key-value configuration (`ADMIN` only)
- `GET /api/admin/audit-logs` — Query forensic system audit trail (`ADMIN` only)
