# AutoServe — Vercel Deployment & Architecture Guide

This guide documents the complete serverless architecture, configuration, and deployment procedure for hosting AutoServe on **Vercel Hobby Tier** paired with **TiDB Cloud Serverless MySQL**.

---

## 🏗 Deployment Architecture Overview

```
                      +---------------------------------------+
                      |         Vercel CDN / Edge             |
                      |   https://frontend-blond-two-c2ltwous72.vercel.app  |
                      +-------------------+-------------------+
                                          |
                                  REST API / WebSockets
                                          |
                      +-------------------v-------------------+
                      |      AutoServe Spring Boot API        |
                      |          (autoserve-api)              |
                      +-------------------+-------------------+
                                          |
                                  Serverless HikariCP
                                (max: 4, min-idle: 0)
                                          |
                      +-------------------v-------------------+
                      |     TiDB Cloud Serverless MySQL       |
                      |         (Flyway V1 - V11)             |
                      +---------------------------------------+
```

### Components:
1. **Frontend (`autoserve-web`)**:
   - Deployed on **Vercel Hobby** (`jayeshkaradkhele-9663s-projects`).
   - Root directory: `frontend/`
   - Single Page Application (SPA) routing via `frontend/vercel.json` rewrites (`/(.*)` $\rightarrow$ `/index.html`).
   - Connected API target via environment variable `VITE_API_URL`.

2. **Backend (`autoserve-api`)**:
   - Containerized Spring Boot 3.5.7 application.
   - Profile `prod` configured in `backend/src/main/resources/application-prod.yml`.
   - Vercel Cron cleanup endpoint `/api/cron/cleanup` protected via `X-Cron-Secret` / `CRON_SECRET`.

3. **Database**:
   - **TiDB Cloud Serverless** (MySQL-compatible, zero-maintenance database).
   - Flyway automated migrations (`V1` through `V11`) run on application initialization.

---

## ⚙️ Serverless Database Sizing & HikariCP Pool Configuration

To ensure optimal performance and resource efficiency on serverless runtimes without exhausting connection quotas:

```yaml
# backend/src/main/resources/application-prod.yml
spring:
  datasource:
    hikari:
      maximum-pool-size: 4
      minimum-idle: 0
      idle-timeout: 30000
      max-lifetime: 600000
      connection-timeout: 20000
```

- **`maximum-pool-size: 4`**: Restricts connections per serverless container instance.
- **`minimum-idle: 0`**: Allows idle connections to scale down to 0 when inactive.
- **`idle-timeout: 30000`**: Closes idle connections after 30 seconds.

---

## 🕒 Vercel Cron Schedule & Cleanup Flow

AutoServe includes an automated serverless cleanup task scheduled via Vercel Cron:

- **Schedule**: `0 3 * * *` (Daily at 3:00 AM UTC).
- **Endpoint**: `GET /api/cron/cleanup` or `POST /api/cron/cleanup`.
- **Security**: Protected by header `X-Cron-Secret` matching `CRON_SECRET`.

### `backend/vercel.json` Configuration:
```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 3 * * *"
    }
  ]
}
```

---

## 🚀 Step-by-Step Vercel Deployment Instructions

### 1. Frontend Deployment (`autoserve-web`)
```bash
# Navigate to frontend directory
cd frontend

# Deploy to Vercel via CLI
vercel --prod --yes
```

### 2. Verify Frontend Rewrite Configuration (`frontend/vercel.json`)
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🔒 Security & Environment Safeguards

1. **BCrypt Password Hashing**:
   - All staff accounts (`manager0521`, `Mech0521`, `ad0521`) are stored as BCrypt hashes in MySQL. Plaintext passwords are never persisted.
2. **HttpOnly Cookie Security**:
   - `Refresh-Token` cookie is stored with `HttpOnly`, `SameSite=Strict`, and `Secure` attributes.
3. **Razorpay Integration**:
   - Configured in Test Mode (`rzp_test_*`). Signature verification is executed server-side.
