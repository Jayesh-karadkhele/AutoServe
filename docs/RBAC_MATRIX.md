# AutoServe Platform - Role-Based Access Control (RBAC) Matrix

**Date:** September 4, 2026  
**Auditor:** Principal Java Full-Stack Architect  

---

## Executive Overview

The AutoServe platform defines four distinct business roles:
1. **CUSTOMER:** Manages own vehicles, books service appointments/RSA, views repair evidence, pays invoices, downloads PDFs, submits ratings.
2. **MANAGER:** Approves/rejects appointments, assigns mechanics, manages job cards, adds labour & parts, uploads evidence, monitors team workload & revenue.
3. **MECHANIC:** Views assigned jobs, starts/completes jobs, records work notes, adds parts used, uploads evidence, views personal performance.
4. **ADMIN:** Controls system, creates staff accounts, assigns mechanics to managers, manages inventory, views platform-wide revenue & audit metrics.

---

## RBAC Permission Matrix

**Legend:**
- `ALLOW`: Role is authorized both in code and by business design.
- `DENY`: Role is prohibited.
- `OVER-PERMISSIVE`: Allowed in current code due to missing or flawed annotations, but violates business security.
- `UNPROTECTED`: Missing `@PreAuthorize` annotation entirely.

| Functional Area & Endpoint | CUSTOMER | MANAGER | MECHANIC | ADMIN | Security Finding |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Authentication** | | | | | |
| `POST /api/auth/register` | Public | Public | Public | Public | **CRITICAL:** Caller can specify any `Role` (e.g. `ADMIN`) |
| `POST /api/auth/login` | Public | Public | Public | Public | **HIGH:** Logs in inactive users (`isActive = false`) |
| `GET /api/auth/me` | ALLOW | ALLOW | ALLOW | ALLOW | Proper context lookup |
| **User Management** | | | | | |
| `POST /api/users` | DENY | DENY | DENY | ALLOW | Admin creates staff accounts |
| `GET /api/users/getUsers` | DENY | DENY | DENY | ALLOW | Admin views user registry |
| `GET /api/users/getUserById/{id}` | OVER-PERMISSIVE | ALLOW | ALLOW | ALLOW | Missing ownership check (Customer A reads Customer B) |
| `PUT /api/users/{userId}` | UNPROTECTED | UNPROTECTED | UNPROTECTED | UNPROTECTED | **CRITICAL:** Missing `@PreAuthorize`. Anyone edits any user! |
| `DELETE /api/users/{userId}` | DENY | DENY | DENY | ALLOW | Soft-deactivates account |
| `PUT /api/users/mechanics/{mId}/assign_manager/{mgrId}` | DENY | DENY | DENY | ALLOW | Admin assigns staff relationship |
| **Vehicle Management** | | | | | |
| `POST /api/vehicles` | UNPROTECTED | UNPROTECTED | UNPROTECTED | UNPROTECTED | **HIGH:** `@PreAuthorize` commented out |
| `GET /api/vehicles` | OVER-PERMISSIVE | DENY | DENY | DENY | Returns system-wide vehicles rather than caller's |
| `PUT /api/vehicles/{vehicleId}` | OVER-PERMISSIVE | DENY | DENY | DENY | Missing ownership check (Customer A edits Customer B's car) |
| `GET /api/vehicles/customer/{customerId}` | UNPROTECTED | UNPROTECTED | UNPROTECTED | UNPROTECTED | Unprotected listing of any customer's vehicles |
| `GET /api/vehicles/license_plate/{plate}` | UNPROTECTED | UNPROTECTED | UNPROTECTED | UNPROTECTED | Unprotected license plate lookup |
| **Appointment & RSA** | | | | | |
| `POST /api/appointments` | ALLOW | DENY | DENY | DENY | Customer creates service request / RSA |
| `PUT /api/appointments/{id}` | UNPROTECTED | UNPROTECTED | UNPROTECTED | UNPROTECTED | **CRITICAL:** Missing `@PreAuthorize`. Anyone edits appointment |
| `PUT /api/appointments/{id}/approve` | DENY | ALLOW | DENY | ALLOW | Manager approves appointment |
| `PUT /api/appointments/{id}/reject` | DENY | ALLOW | DENY | ALLOW | Manager rejects appointment |
| `PUT /api/appointments/{id}/assign-mechanic/{mId}` | DENY | ALLOW | DENY | ALLOW | Manager assigns mechanic |
| `GET /api/appointments/rsa` | UNPROTECTED | UNPROTECTED | UNPROTECTED | UNPROTECTED | Unprotected RSA request feed |
| **Job Cards** | | | | | |
| `POST /api/job_cards` | DENY | ALLOW | OVER-PERMISSIVE | ALLOW | Mechanic shouldn't create job cards |
| `PUT /api/job_cards/{id}/assign_mechanic` | DENY | ALLOW | OVER-PERMISSIVE | ALLOW | **HIGH:** Mechanic can re-assign job cards |
| `PUT /api/job_cards/{id}/start` | DENY | DENY | OVER-PERMISSIVE | DENY | Missing assignment check (Mechanic A starts Mechanic B's job) |
| `PUT /api/job_cards/{id}/complete` | DENY | DENY | OVER-PERMISSIVE | DENY | Missing assignment check (Mechanic A completes Mechanic B's job) |
| `POST /api/job_cards/{id}/items` | DENY | ALLOW | ALLOW | ALLOW | Adds parts to job card |
| `POST /api/job_cards/{id}/evidence` | UNPROTECTED | UNPROTECTED | UNPROTECTED | UNPROTECTED | **HIGH:** Missing `@PreAuthorize` on evidence upload |
| `GET /api/job_cards/dashboard/manager/{mId}` | DENY | OVER-PERMISSIVE | DENY | DENY | Missing ownership check (Manager A reads Manager B's dashboard) |
| `GET /api/job_cards/dashboard/mechanic/{mId}` | DENY | DENY | OVER-PERMISSIVE | DENY | Missing ownership check (Mechanic A reads Mechanic B's dashboard) |
| **Inventory Management** | | | | | |
| `POST /api/inventory` | UNPROTECTED | UNPROTECTED | UNPROTECTED | UNPROTECTED | **HIGH:** Entire controller lacks `@PreAuthorize` |
| `PUT /api/inventory/{id}` | UNPROTECTED | UNPROTECTED | UNPROTECTED | UNPROTECTED | Customer can edit part prices / stock |
| `DELETE /api/inventory/{id}` | UNPROTECTED | UNPROTECTED | UNPROTECTED | UNPROTECTED | Customer can soft-delete parts |
| **Invoices & Payments** | | | | | |
| `POST /api/invoices/generate/job_card/{id}` | UNPROTECTED | UNPROTECTED | UNPROTECTED | UNPROTECTED | **HIGH:** Entire controller lacks `@PreAuthorize` |
| `POST /api/invoices/{id}/create_payment_order` | UNPROTECTED | UNPROTECTED | UNPROTECTED | UNPROTECTED | Customer creates Razorpay order |
| `POST /api/invoices/{id}/verify_payment` | UNPROTECTED | UNPROTECTED | UNPROTECTED | UNPROTECTED | Customer verifies payment |
| `POST /api/invoices/{id}/simulate_payment` | UNPROTECTED | UNPROTECTED | UNPROTECTED | UNPROTECTED | **CRITICAL:** Anyone can bypass payment and force invoice PAID |
| `GET /api/invoices/stats/total_revenue` | UNPROTECTED | UNPROTECTED | UNPROTECTED | UNPROTECTED | Customer can view total company revenue |
