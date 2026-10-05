# FitPulse REST API Specification

Base URL: `http://localhost:5000/api`

## Authentication & Authorization
All authenticated routes require standard HTTP header:
`Authorization: Bearer <JWT_TOKEN>`

### 1. Authentication Endpoints (`/api/auth`)
- `POST /api/auth/register` — Create new athlete account
- `POST /api/auth/login` — Authenticate and receive JWT Bearer token
- `GET /api/auth/me` — Retrieve authenticated profile information
- `PATCH /api/auth/profile` — Update athlete profile parameters & bio

### 2. Workout Management (`/api/workouts`)
- `GET /api/workouts` — Paginated workout log retrieval (`?page=1&limit=10&type=STRENGTH`)
- `POST /api/workouts` — Log a new workout session (triggers auto-challenge updates)
- `GET /api/workouts/:id` — Get specific workout detail
- `DELETE /api/workouts/:id` — Delete workout entry
- `GET /api/workouts/analytics` — Rolling 7-day metabolic curve & category distributions
- `GET /api/workouts/estimate-calories` — Dynamic MET formula calorie estimation

### 3. Challenges & Badges (`/api/challenges`)
- `GET /api/challenges` — List all open community endurance challenges
- `POST /api/challenges/:id/enroll` — Enroll athlete into a challenge
- `GET /api/challenges/my/progress` — Active challenge completion rates and medals

### 4. Admin Governance (`/api/admin`)
- `GET /api/admin/dashboard` — Platform cluster statistics and KPI telemetry
- `GET /api/admin/users` — Paginated user directory with search filter
- `PATCH /api/admin/users/:id/role` — Promote or demote user permissions (`USER` ↔ `ADMIN`)
- `GET /api/admin/audit-logs` — Administrative security action history
- `GET /api/admin/settings` — Platform maintenance flags & parameters
