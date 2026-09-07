# AutoServe — Production Readiness & Vercel Release Checklist

| Category | Checklist Item | Status | Verification Detail |
|---|---|---|---|
| Security | BCrypt Password Hashing | COMPLETED | Staff credentials (`manager0521`, `Mech0521`, `ad0521`) hashed with BCrypt prior to DB persistence |
| Security | JWT HS512 Secret Enforcement | COMPLETED | Enforces minimum 64-byte (512-bit) secret key length |
| Security | Refresh Token Rotation | COMPLETED | Single-use rotation with instant theft revocation |
| Security | HttpOnly Cookie Security | COMPLETED | `SameSite=Strict`, `HttpOnly`, `Secure` flags enforced |
| Security | Method-Level RBAC | COMPLETED | `@PreAuthorize` with `@P` parameter discovery and `MANAGER` role |
| Security | CORS Protection | COMPLETED | Configurable origin whitelist in `AuthRequestProtectionFilter` |
| Security | Vercel Cron Authentication | COMPLETED | `/api/cron/cleanup` protected by `CRON_SECRET` validation |
| Payment | Razorpay Integration | COMPLETED | Server-side signature verification & webhook idempotency (No Stripe) |
| Database | Schema Migration | COMPLETED | Flyway migrations `V1__...` through `V11__...` |
| Concurrency | Atomic Claiming | COMPLETED | `PESSIMISTIC_WRITE` locks on appointment claiming |
| Quality | Backend Integration Tests | COMPLETED | 161 / 161 JUnit 5 integration tests passing |
| Quality | Frontend Component Tests | COMPLETED | 158 / 158 Vitest unit tests passing |
| Quality | Playwright E2E Tests | COMPLETED | 3 / 3 Playwright end-to-end browser tests passing |
| Build | TypeScript & Vite Build | COMPLETED | Clean production compilation into `frontend/dist` |
| Packaging | Container Orchestration | COMPLETED | Multi-stage `Dockerfile` and `docker-compose.yml` |
| Deployment | Vercel SPA Hosting | COMPLETED | Deployed on Vercel Hobby with `frontend/vercel.json` SPA rewrites |
| Deployment | Live URL Verified | COMPLETED | `https://frontend-blond-two-c2ltwous72.vercel.app` verified functional |
| CI/CD | Automated Pipeline | COMPLETED | GitHub Actions `.github/workflows/ci.yml` |
| Docs | System Documentation | COMPLETED | Architecture, Role Workflows, API Matrix, RBAC, Deployment Guide, Vercel Guide |
