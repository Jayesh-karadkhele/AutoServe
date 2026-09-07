# AutoServe — Final System Architecture

## Executive Overview
AutoServe is an enterprise automotive service management platform built with Spring Boot 3, React 18, TypeScript, MySQL 8, and Flyway. It supports complete end-to-end service lifecycles across four dedicated user roles: Customer, Service Manager, Mechanic, and Administrator.

```
                   +---------------------------------------+
                   |          AutoServe Web App            |
                   |      (React 18 + TS + Tailwind)       |
                   +-------------------+-------------------+
                                       |
                                       | HTTPS / WSS
                                       v
                   +-------------------+-------------------+
                   |           Nginx Reverse Proxy         |
                   +-------------------+-------------------+
                                       |
                     +-----------------+-----------------+
                     |                                   |
                     v                                   v
       +-------------+-------------+       +-------------+-------------+
       |   Spring Boot REST API    |       |   WebSocket Chat Server   |
       |  (Spring Security 6, JWT) |       |     (STOMP / SockJS)      |
       +-------------+-------------+       +-------------+-------------+
                     |                                   |
                     +-----------------+-----------------+
                                       |
                                       v
                   +-------------------+-------------------+
                   |         MySQL 8 Database          |
                   |      (Flyway Migrations V1-V11)   |
                   +---------------------------------------+
```

## Architectural Layers

### 1. Presentation Layer (Frontend)
- **Framework**: React 18 + TypeScript + Vite 8
- **UI Design System**: Automotive Light Theme (White, Slate, Cyan/Sky/Emerald accents)
- **Role Routing**: Dynamic role-based navigation with `GuestOnlyRoute`, `ProtectedRoute`, and `RoleRedirect`
- **State & Communication**: Axios REST API client + STOMP WebSocket subscriber for real-time chat & notifications

### 2. Application & Security Layer (Backend)
- **Framework**: Spring Boot 3.5.7 (Java 21)
- **Authentication**: Stateless JWT access tokens + HttpOnly Secure Refresh Tokens with automatic rotation & reuse theft detection
- **Method-Level RBAC**: Spring Security `@PreAuthorize` with SpEL-based parameter-level ownership checks via `AccessControlService`
- **Database Concurrency**: Atomic pessimistic write locks (`findByIdWithLock`) for concurrent appointment claiming and job status transitions

### 3. Data & Persistence Layer
- **ORM**: Hibernate 6 / Spring Data JPA
- **Database**: MySQL 8.0 (production) / H2 in-memory (integration test suite)
- **Version Control**: Flyway Database Migrations (`V1__...` through `V11__notifications_chat_roadside_ratings.sql`)

### 4. Integration & Real-time Services
- **WebSocket / Chat**: STOMP over SockJS endpoint `/ws-autoserve` with destination topic `/topic/job-cards/{jobCardId}`
- **Payment Processing**: Razorpay order creation & HMAC SHA-256 signature verification, with mock fallback for local testing
- **Notifications**: Event-driven notification dispatch for job card creation, mechanic assignment, status changes, and invoices

## Production Deployment Stack
- **Docker Compose**: Multi-container orchestration (Backend + Frontend Nginx + MySQL 8)
- **CI/CD**: GitHub Actions workflow running Maven build, JUnit 5 integration suite, Vitest frontend suite, Vite production build, and Docker artifact verification.
