# AutoServe v1.0.1 — Live Release Verification & Quality Audit Report

This report summarizes the complete automated quality verification, security audits, and Vercel release status for **AutoServe v1.0.1**.

---

## 📌 Release Metadata

- **GitHub Repository**: [https://github.com/Jayesh-karadkhele/AutoServe.git](https://github.com/Jayesh-karadkhele/AutoServe.git)
- **Release Branch**: `release/autoserve-complete`
- **Release Tag**: `v1.0.1`
- **Live Vercel Frontend URL**: [https://frontend-blond-two-c2ltwous72.vercel.app](https://frontend-blond-two-c2ltwous72.vercel.app)
- **Deployment Platform**: Vercel Hobby (`jayeshkaradkhele-9663s-projects`)
- **Database Engine**: TiDB Cloud Serverless MySQL (Flyway Migrations `V1__...` through `V11__...`)

---

## 🧪 Automated Quality Gates Audit

| Suite | Scope | Executed Command | Total Tests | Passed | Failed | Skipped | Pass Rate |
|---|---|---|---|---|---|---|---|
| **Backend Integration** | Spring Boot, Security, REST, DB | `mvnw.cmd test` | 161 | 161 | 0 | 0 | **100%** |
| **Frontend Vitest** | React 18, State, UI, Auth, Forms | `npm run test -- --run` | 158 | 158 | 0 | 0 | **100%** |
| **Playwright E2E** | End-to-End User & Staff Workflows | `npx playwright test` | 3 | 3 | 0 | 0 | **100%** |

---

## 🔒 Security Audit & Contradiction Resolution

1. **Payment Provider Enforcement**:
   - **Provider**: **Razorpay** (Test Mode).
   - **Verification**: Backend signature verification (`RazorpaySignatureVerifier.java`) and webhook idempotency are fully active. Zero Stripe dependencies or code references exist in the platform.
   - **Client Protection**: Client UI is prohibited from marking invoices as paid directly; payments must pass backend Razorpay webhook verification.

2. **Role Name Standard**:
   - **Backend Canonical Role**: `MANAGER`.
   - **UI Display Label**: *Service Manager*.
   - Zero `SERVICE_MANAGER` enums or DB strings exist in the codebase.

3. **BCrypt Staff Password Persistence**:
   - All pre-seeded portfolio staff credentials (`manager0521`, `Mech0521`, `ad0521`) are stored exclusively as BCrypt hashes in MySQL (`AuthServiceImpl.java`). Plaintext passwords are never stored.

4. **Cookie & Session Security**:
   - `Refresh-Token` cookies enforce `HttpOnly`, `SameSite=Strict`, and `Secure` flags. Single-use token rotation and instant revocation on theft detection are active.

5. **Vercel Cron Cleanup Flow**:
   - `/api/cron/cleanup` endpoint verified with `X-Cron-Secret` header validation, rejecting unauthorized calls with `401 Unauthorized`.

---

## 📦 Deployment Verification

- **Vercel Frontend Build**: Clean Vite 8 compilation into `frontend/dist/`.
- **SPA Rewrites**: Verified `frontend/vercel.json` routing rules (`/(.*)` $\rightarrow$ `/index.html`).
- **Serverless HikariCP Sizing**: `maximum-pool-size: 4`, `minimum-idle: 0`, `idle-timeout: 30000`.
