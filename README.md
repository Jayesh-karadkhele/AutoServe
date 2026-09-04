# 🚗 AutoServe - Enterprise Vehicle Maintenance System

[![Java](https://img.shields.io/badge/Java-21-orange)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-green)](https://spring.io/projects/spring-boot)
[![Status](https://img.shields.io/badge/Development-Active%20Restructuring-blue)]()

**AutoServe** is an enterprise multi-role vehicle service and maintenance platform. It manages the complete automobile service lifecycle—from customer appointment booking and Roadside Assistance (RSA) to job card execution, inventory control, and digital invoicing.

---

## 🏗 Repository Structure

```
AutoServe-main/
├── backend/               # Active Spring Boot 3.5.7 application (Java 21)
├── frontend/              # Reserved for React 18 frontend implementation
├── database/              # Database migration scripts (Flyway)
├── docs/                  # Architecture & Comprehensive Audit Reports
├── archive/
│   ├── legacy-backend/    # Obsolete nested backend (Retained temporarily for reference)
│   └── old-artifacts/     # Legacy logs, scripts, and debugging artifacts
├── .env.example           # Environment variables template
├── .gitignore             # Root Git ignore configuration
└── README.md              # Project documentation
```

---

## 🌟 Backend Feature Status

### Implemented Features
* **Role-Based Access Control (RBAC):** Multi-role authentication (Admin, Manager, Mechanic, Customer) powered by Spring Security & JWT.
* **Service Appointments & RSA:** Support for standard booking and Roadside Assistance (RSA).
* **Job Card Management:** Lifecycle tracking (CREATED, IN_PROGRESS, COMPLETED, CANCELLED) linking vehicles, mechanics, and parts used.
* **Evidence Vault:** Cloudinary integration for uploading damage/repair photos.
* **Digital Invoicing & Tax:** Automated invoice calculation with price snapshot pattern and OpenPDF generation.
* **Payment Gateway Verification:** Razorpay order creation and HMAC SHA256 signature verification.
* **Transactional Email Notifications:** JavaMailSender HTML emails for user registration, booking confirmation, and cancellation.

### Currently Pending / Under Development
* **React Frontend:** Modern single-page web interface (Placeholder reserved in `/frontend`).
* **Real-Time Live Chat:** WebSocket/STOMP chat connecting customers and managers.
* **Database Migrations:** Versioned Flyway DDL scripts (Placeholder reserved in `/database/migrations`).

---

## 🛠 Prerequisites & Quick Start

### Prerequisites
* **Java Development Kit (JDK):** Version 21
* **Database:** MySQL Server 8.0+

### Building the Active Backend

#### Windows (PowerShell / Command Prompt)
```cmd
cd backend
.\mvnw.cmd clean compile
```

#### Linux / macOS
```bash
cd backend
./mvnw clean compile
```

---

## 📚 Audit & Architecture Documentation

For complete technical specifications, security audit findings, and database schemas, see the `/docs` directory:
- [`BACKEND_AUDIT.md`](docs/BACKEND_AUDIT.md) — Comprehensive structure and inventory audit
- [`DUPLICATE_COMPARISON.md`](docs/DUPLICATE_COMPARISON.md) — Detailed comparison between active and legacy backends
- [`API_CONTRACT.md`](docs/API_CONTRACT.md) — Endpoints, DTOs, and contract specifications
- [`RBAC_MATRIX.md`](docs/RBAC_MATRIX.md) — Role permission matrix
- [`DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md) — JPA entity schemas and database design audit
- [`SECURITY_AUDIT.md`](docs/SECURITY_AUDIT.md) — Security vulnerabilities (Critical, High, Medium, Low)
- [`MISSING_FEATURES.md`](docs/MISSING_FEATURES.md) — Feature reality check
- [`IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md) — Post-audit remediation plan
