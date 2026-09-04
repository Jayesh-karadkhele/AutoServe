# 🚗 AutoServe - Enterprise Vehicle Maintenance System

[![Java](https://img.shields.io/badge/Java-21-orange)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-green)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-cyan)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.2-purple)](https://vite.dev/)

**AutoServe** is an enterprise multi-role vehicle service and maintenance platform. It manages the complete automobile service lifecycle—from customer appointment booking and Roadside Assistance (RSA) to job card execution, inventory control, repair evidence, and digital invoicing.

---

## 🏗 Monorepo Repository Structure

```text
AutoServe-main/
├── backend/               # Active Spring Boot 3.5.7 backend (Java 21, Port 8081)
├── frontend/              # Official React 19 + TypeScript Vite frontend (Port 5173)
├── database/              # Database migration scripts & Flyway foundation
├── docs/                  # Architecture, Design System & Audit Documentation
└── archive/               # Legacy baseline code reference
```

---

## 💻 Frontend Development (Part 6A Scope)

The AutoServe frontend is built with React 19, TypeScript, Tailwind CSS v4, Motion for React, and Lenis smooth scrolling under a light automotive design system.

### Prerequisites
- **Node.js**: v20.19+ or v22.12+ (v24.11+ recommended)
- **npm**: v11+

### Local Frontend Commands
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Vite local dev server (Port 5173)
npm run dev

# Run Vitest unit test suite (10 tests)
npm run test

# Run Oxlint linter (0 errors, 0 warnings)
npm run lint

# Build production bundle
npm run build
```

---

## 🛠 Backend Development

### Local Backend Commands
```bash
cd backend
.\mvnw.cmd clean verify
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.jvmArguments=-DJWT_SECRET=your-64-byte-jwt-secret"
```
- **Backend Port**: 8081
- **Database**: MySQL 8.0 (`autoserve_flyway_dev`)

---

## 📚 Technical Documentation

For complete technical specifications, design tokens, and audit reports, explore the `/docs` directory:
- [`FRONTEND_ARCHITECTURE.md`](docs/FRONTEND_ARCHITECTURE.md) — Frontend layout, structure & module components
- [`DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — Light automotive color palette, typography & tokens
- [`MOTION_SYSTEM.md`](docs/MOTION_SYSTEM.md) — Motion sequences, Lenis scroll engine & reduced motion
- [`PART6A_VISUAL_QA.md`](docs/PART6A_VISUAL_QA.md) — Viewport audit, responsive testing & QA metrics
- [`PART5A_PREFLIGHT.md`](docs/PART5A_PREFLIGHT.md) — Flyway migration audit & database metrics
