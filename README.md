# 🚗 AutoServe — Enterprise Automotive Service Management Platform

[![Java](https://img.shields.io/badge/Java-21-orange)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-green)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-purple)](https://vite.dev/)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-brightgreen)](https://frontend-blond-two-c2ltwous72.vercel.app)
[![JUnit 5](https://img.shields.io/badge/JUnit-161%2F161%20Passed-brightgreen)](#-test-verification)
[![Vitest](https://img.shields.io/badge/Vitest-158%2F158%20Passed-brightgreen)](#-test-verification)
[![Playwright](https://img.shields.io/badge/Playwright-3%2F3%20Passed-brightgreen)](#-test-verification)

**AutoServe** is a full-stack, multi-role automotive service management platform. It powers complete end-to-end service lifecycles across four user roles: **Customer**, **Service Manager**, **Mechanic**, and **Administrator**.

---

## 🌐 Live Production Deployment

- **Live Production Web Portal**: [https://frontend-blond-two-c2ltwous72.vercel.app](https://frontend-blond-two-c2ltwous72.vercel.app)
- **Deployment Platform**: Vercel Hobby Tier (`jayeshkaradkhele-9663s-projects`)
- **Database Engine**: TiDB Cloud Serverless MySQL (Flyway Migrations `V1` through `V11`)
- **Payment Provider**: Razorpay (Test Mode)

---

## 🚀 Quickstart via Docker Compose

Run the entire platform locally (MySQL 8.0, Backend REST API, Frontend Nginx SPA) with a single command:

```bash
# 1. Clone & prepare environment
cp .env.production.example .env

# 2. Build and launch containers
docker compose up -d --build
```

- **Local Web Portal**: `http://localhost`
- **Local Backend API**: `http://localhost/api`
- **Health Check**: `http://localhost/actuator/health`

---

## 🔑 Portfolio Access Hints & Credentials

AutoServe features persistent staff principals for evaluator testing. Select any role card on the login screen and enter any valid email format with the corresponding portfolio password:

| Role | UI Card Selection | Portfolio Password Hint | Key Features |
|---|---|---|---|
| **Customer** | Customer Card | Register or use existing | Add Vehicles, Book Service, Track Repair, Pay Invoice (Razorpay), Rate Service |
| **Service Manager** | Service Manager Card | `manager0521` | Claim Queue (Atomic Lock), Approve Job, Assign Mechanic, Add Parts, Invoice Generation |
| **Mechanic** | Mechanic Card | `Mech0521` | Assigned Roster, Start/Complete Job, Upload Inspection Photo Evidence, Parts Consumption |
| **Administrator** | Administrator Card | `ad0521` | Provision Staff, Inventory Management, Revenue Analytics, Global Audit Logs |

---

## 🧪 Test Verification

All automated test suites pass with 100% success rate:

```text
Backend JUnit 5 Integration Suite :  161 / 161 Passed (0 Failures, 0 Errors)
Frontend Vitest Component Suite  :  158 / 158 Passed (0 Failures, 0 Errors)
Playwright E2E Browser Suite     :    3 /   3 Passed (0 Failures, 0 Errors)
Vite Production Build             :  Clean Build (0 TypeScript Errors)
```

---

## 🏗 Repository Structure

```text
AutoServe-main/
├── backend/               # Spring Boot 3.5.7 (Java 21, Security 6, JWT, Razorpay)
├── frontend/              # React 18 + TypeScript + Vite 8 (Vercel SPA Routing)
├── database/              # MySQL schema & Flyway migrations (V1-V11)
├── docs/                  # Platform & Architecture Documentation
│   ├── FINAL_ARCHITECTURE.md
│   ├── VERCEL_DEPLOYMENT_GUIDE.md
│   ├── VERCEL_ENVIRONMENT_MATRIX.md
│   ├── LIVE_RELEASE_VERIFICATION.md
│   ├── ROLE_WORKFLOW.md
│   ├── API_INTEGRATION_MATRIX.md
│   ├── RBAC_MATRIX.md
│   ├── DATABASE_SCHEMA.md
│   ├── E2E_TEST_REPORT.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── PRODUCTION_READINESS_CHECKLIST.md
│   ├── KNOWN_LIMITATIONS.md
│   └── HR_DEMO_GUIDE.md
├── docker-compose.yml     # Production Docker orchestration
└── .github/workflows/ci.yml # GitHub Actions CI/CD Pipeline
```

---

## 📚 Technical Documentation Index

- [`VERCEL_DEPLOYMENT_GUIDE.md`](docs/VERCEL_DEPLOYMENT_GUIDE.md) — Vercel serverless architecture & deployment guide
- [`VERCEL_ENVIRONMENT_MATRIX.md`](docs/VERCEL_ENVIRONMENT_MATRIX.md) — Complete environment variables matrix
- [`LIVE_RELEASE_VERIFICATION.md`](docs/LIVE_RELEASE_VERIFICATION.md) — Comprehensive v1.0.1 live release audit report
- [`FINAL_ARCHITECTURE.md`](docs/FINAL_ARCHITECTURE.md) — Multi-tier system architecture & component diagrams
- [`ROLE_WORKFLOW.md`](docs/ROLE_WORKFLOW.md) — Four-role end-to-end operational workflows
- [`API_INTEGRATION_MATRIX.md`](docs/API_INTEGRATION_MATRIX.md) — Comprehensive REST API endpoint reference
- [`RBAC_MATRIX.md`](docs/RBAC_MATRIX.md) — Security permissions & SpEL rules
- [`E2E_TEST_REPORT.md`](docs/E2E_TEST_REPORT.md) — JUnit 5, Vitest, and Playwright automated test report
- [`DEPLOYMENT_GUIDE.md`](docs/DEPLOYMENT_GUIDE.md) — Docker Compose & local deployment guide
- [`PRODUCTION_READINESS_CHECKLIST.md`](docs/PRODUCTION_READINESS_CHECKLIST.md) — Production audit verification
- [`HR_DEMO_GUIDE.md`](docs/HR_DEMO_GUIDE.md) — Step-by-step evaluator demo guide
