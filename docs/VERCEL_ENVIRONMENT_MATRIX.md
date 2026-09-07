# AutoServe — Vercel Environment Variables Matrix

This document defines the complete environment variable matrix required across Vercel environments (Production, Preview, Development) for both frontend (`autoserve-web`) and backend (`autoserve-api`) applications.

---

## 🎨 Frontend Environment Matrix (`autoserve-web`)

| Variable Name | Required | Target Environment | Description | Default / Example Value |
|---|---|---|---|---|
| `VITE_API_URL` | Yes | Production, Preview | Base URL pointing to the deployed Spring Boot REST API | `https://autoserve-api.vercel.app` (or Vercel backend proxy target) |
| `VITE_RAZORPAY_KEY_ID` | Yes | Production, Preview | Public Razorpay Test Mode Key ID | `rzp_test_51MzQ4SF...` |
| `VITE_ENABLE_MOCK_FALLBACK` | No | Development | Enable mock fallback mode for offline local development | `false` |

---

## ⚙️ Backend Environment Matrix (`autoserve-api`)

| Variable Name | Required | Target Environment | Description | Sensitive | Example Value |
|---|---|---|---|---|---|
| `SPRING_PROFILES_ACTIVE` | Yes | All | Active Spring profile | No | `prod` |
| `SPRING_DATASOURCE_URL` | Yes | Production, Preview | JDBC connection URL for TiDB Cloud Serverless MySQL | Yes | `jdbc:mysql://gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/autoserve?sslMode=VERIFY_IDENTITY` |
| `SPRING_DATASOURCE_USERNAME` | Yes | Production, Preview | TiDB database user | Yes | `3Q2x...root` |
| `SPRING_DATASOURCE_PASSWORD` | Yes | Production, Preview | TiDB database password | Yes | `********` |
| `JWT_SECRET` | Yes | Production, Preview | Minimum 512-bit Base64 secret key for HS512 JWT signing | Yes | `9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b` |
| `RAZORPAY_KEY_ID` | Yes | Production, Preview | Razorpay Test Mode Key ID | Yes | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Yes | Production, Preview | Razorpay Test Mode Key Secret | Yes | `********` |
| `CRON_SECRET` | Yes | Production, Preview | Secret key used by Vercel Cron to authenticate cleanup endpoint | Yes | `autoserve-cron-secret-2026-v101` |
| `CORS_ALLOWED_ORIGINS` | Yes | Production, Preview | Comma-separated CORS allowed origins | No | `https://frontend-blond-two-c2ltwous72.vercel.app` |

---

## 🔒 Security Best Practices for Vercel Environment Secrets

1. **Environment Scope Isolation**:
   - Production secrets (`SPRING_DATASOURCE_PASSWORD`, `JWT_SECRET`, `CRON_SECRET`) are restricted to the `Production` environment in Vercel.
2. **No Repository Leakage**:
   - All `.env` files are added to `.gitignore`. No live credentials exist in git history.
3. **Secret Verification**:
   - Application startup aborts if `JWT_SECRET` is shorter than 64 characters (512 bits).
