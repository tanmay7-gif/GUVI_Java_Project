# FitPulse System Architecture

## 1. High-Level Architecture Overview

FitPulse is structured as an enterprise-grade full-stack mono-repository designed for high-performance fitness telemetry, physiological analytics, and interactive client-side 3D micro-experiences.

```
fitpulse/
├── frontend/             # React 19 + Vite 8 + Three.js / R3F + Tailwind CSS
├── backend/              # Node.js + Express / TypeScript REST API (+ Spring Boot 3)
│   ├── src/              # Express controllers, routes, middleware, models
│   └── java-spring/      # Spring Boot 3.3.4 enterprise microservice
├── database/             # Prisma schema, SQL migrations, seed scripts, SQLite/PostgreSQL
├── docs/                 # System architecture and API specifications
├── .gitignore            # Root-level ignore rules
├── package.json          # Root monorepo orchestration scripts
└── README.md             # Developer setup and operational manual
```

## 2. Frontend Subsystem (`/frontend`)
- **Framework**: React 19 with Vite 8.
- **Styling**: Tailwind CSS v4 with custom clinical-mint wellness tokens (`#FFFFFF`, `#FAFCFA`, `#10B981`, `#A7F3D0`).
- **Interactive Visualization**: Three.js & React Three Fiber (R3F) for interactive anatomical body models, volumetric volume charts, and metabolic pulsers.
- **Routing**: React Router DOM v7 (Multi-route clinical separation: `/`, `/workouts`, `/analytics`, `/challenges`, `/profile`, `/admin/*`).
- **Icons**: Lucide React.

## 3. Backend Subsystem (`/backend`)
- **API Server**: Node.js with Express & TypeScript (`src/index.ts`).
- **Data Access**: Prisma ORM with type-safe client querying.
- **Authentication**: JWT Bearer token authentication with BCrypt password hashing.
- **Validation**: Zod schema validation on all mutation endpoints.
- **Alternative Java Backend**: Included in `backend/java-spring/` with Spring Boot 3.3.4, Spring Security 6, and Hibernate JPA.

## 4. Database Layer (`/database`)
- Local development: Zero-configuration SQLite (`dev.db`).
- Production: PostgreSQL with native connection pooling and ANSI SQL DDL scripts (`schema.sql`).
