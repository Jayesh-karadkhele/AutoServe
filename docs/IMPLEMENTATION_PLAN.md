# AutoServe Platform - Post-Audit Remediation & Development Plan

**Date:** September 4, 2026  
**Author:** Principal Java Full-Stack Architect  

---

## Executive Summary

Based on the findings of the Audit Phase, this document outlines the prioritized implementation plan required to transform AutoServe into a production-ready, secure, enterprise-grade platform. 

---

## Phase 1: Critical Security & RBAC Hardening

### 1.1 Fix Public Registration Vulnerability
- Refactor `RegisterRequestDto` to remove the `role` field.
- Hardcode `userRole = Role.CUSTOMER` in `AuthServiceImpl.register()`.
- Ensure Admin, Manager, and Mechanic creation is strictly restricted to `POST /api/users` (Admin only).

### 1.2 Enforce Inactive User Login Checks
- Update `CustomUserDetailsService.java` to set `.disabled(!user.isActive())`.
- Verify user status during `AuthenticationManager.authenticate()`.

### 1.3 Secure Payment Endpoints
- Remove or strictly restrict `POST /api/invoices/{id}/simulate_payment` to `ROLE_ADMIN` under `@Profile("dev")`.

### 1.4 Annotate Missing Method Security
- Add `@PreAuthorize` annotations across all unannotated controllers (`InventoryController`, `InvoiceController`, `UserController`, `AppointmentController`, `JobCardController`).

### 1.5 Enforce Horizontal Privilege & Ownership Checks (IDOR Prevention)
- Create a reusable security evaluation service or check principal IDs in service implementations:
  - Vehicles: Verify `vehicle.getCustomer().getId().equals(authenticatedUserId)`.
  - Appointments: Verify `appointment.getVehicleDetails().getCustomer().getId().equals(authenticatedUserId)`.
  - Job Cards: Verify assigned Mechanic / Manager before status updates.
  - Dashboards: Verify `{managerId}` or `{mechanicId}` matches logged-in user.

---

## Phase 2: Database Schema & Financial Refactoring

### 2.1 Refactor Currency Fields to `BigDecimal`
- Replace Java `Double` with `java.math.BigDecimal` across `User`, `JobCard`, `JobCardItem`, `Inventory`, and `Invoice`.
- Update MySQL column mapping to `DECIMAL(12,2)`.

### 2.2 Add Missing Database Indexes
- Add indexes on foreign keys (`customer_id`, `vehicle_id`, `manager_id`, `mechanic_id`, `appointment_id`, `job_card_id`, `product_id`).

### 2.3 Implement Database Migrations
- Integrate Flyway DB migration scripts in `src/main/resources/db/migration/`.

---

## Phase 3: Missing Feature Implementation

### 3.1 Implement WebSocket / STOMP Live Chat
- Add `WebSocketConfig` (`@EnableWebSocketMessageBroker`).
- Implement `ChatRepository`, `ChatService`, and `ChatController` for real-time messaging between Customer and Manager.

### 3.2 Add Refresh Token & Logout Mechanism
- Create `RefreshToken` entity and `/api/auth/refresh` endpoint.
- Implement token revocation / logout handling.

---

## Phase 4: Production-Grade React Frontend

- Initialize a modern Vite + React 18 frontend with Material UI (MUI), React Router, Axios, and Context API.
- Build responsive dashboards for Customer, Manager, Mechanic, and Admin roles.
- Integrate Razorpay Checkout SDK and Google Maps API.
