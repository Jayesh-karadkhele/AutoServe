# AutoServe Platform - Role-Based Access Control (RBAC) & Ownership Matrix

**Date:** September 4, 2026  
**Status:** Hardened & Enforced (Part 4 Baseline)  

---

## Executive Overview

The AutoServe platform defines four distinct business roles:
1. **CUSTOMER:** Manages own profile (`/api/users/me`), own vehicles, books service appointments/RSA for own vehicles, views repair evidence for own job cards, pays own invoices, downloads PDFs, submits ratings.
2. **MANAGER:** Approves/rejects assigned appointments, assigns reporting mechanics, manages job cards for assigned work, adds labour & parts, uploads evidence, monitors team workload & team revenue.
3. **MECHANIC:** Views assigned jobs, starts/completes assigned jobs, records work notes, adds parts used on assigned active jobs, uploads evidence, views personal performance.
4. **ADMIN:** Controls system staff creation, assigns mechanics to managers, manages inventory master data, views platform-wide revenue & audit metrics.

---

## Hardened RBAC & Resource Ownership Matrix

**Legend:**
- `ALLOW`: Role is authorized and resource ownership / assignment is verified.
- `DENY`: Role is strictly prohibited (HTTP 403 Forbidden).
- `PUBLIC`: Endpoint is accessible unauthenticated.
- `404 NOT FOUND`: Endpoint removed in dev/prod (e.g. payment simulation).

| Functional Area & Endpoint | PUBLIC | CUSTOMER | MANAGER | MECHANIC | ADMIN | Security Enforcement Rules |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Authentication & Profile** | | | | | | |
| `POST /api/auth/register` | `PUBLIC` | N/A | N/A | N/A | N/A | Strictly creates `CUSTOMER`. `role` parameter ignored/rejected. |
| `POST /api/auth/login` | `PUBLIC` | N/A | N/A | N/A | N/A | Rejects inactive users (`isActive = false` -> HTTP 401). |
| `GET /api/users/me` | DENY | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` | Returns caller's authenticated profile. |
| `PUT /api/users/me` | DENY | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` | Updates caller's safe fields only (`name`, `phone`). |
| **User & Staff Management** | | | | | | |
| `POST /api/users` | DENY | DENY | DENY | DENY | `ALLOW` | Admin creates staff accounts (`MANAGER`, `MECHANIC`, `ADMIN`). |
| `GET /api/users/getUsers` | DENY | DENY | DENY | DENY | `ALLOW` | Admin lists all users. |
| `GET /api/users/getUserById/{id}` | DENY | DENY | Scoped | Scoped | `ALLOW` | Admin or staff operationally connected to customer. |
| `PUT /api/users/{userId}` | DENY | DENY | DENY | DENY | `ALLOW` | Admin edits user fields. |
| `DELETE /api/users/{userId}` | DENY | DENY | DENY | DENY | `ALLOW` | Admin deactivates user account. |
| `PUT /api/users/mechanics/{mId}/assign_manager/{mgrId}` | DENY | DENY | DENY | DENY | `ALLOW` | Admin assigns mechanic to manager. |
| **Vehicle Management** | | | | | | |
| `POST /api/vehicles` | DENY | `ALLOW` | DENY | DENY | `ALLOW` | Customer registers vehicle for self (`customerId` from context). |
| `GET /api/vehicles/me` | DENY | `ALLOW` | DENY | DENY | N/A | Customer lists own vehicles. |
| `GET /api/vehicles/{vehicleId}` | DENY | Own | Scoped | Scoped | `ALLOW` | Verified ownership or operational assignment. |
| `PUT/DELETE /api/vehicles/{vehicleId}` | DENY | Own | DENY | DENY | `ALLOW` | Customer updates/deletes own vehicle or Admin override. |
| `GET /api/vehicles/customer/{customerId}` | DENY | Self | Scoped | Scoped | `ALLOW` | Customer can view only own ID (`isSelf`). |
| **Appointment & RSA** | | | | | | |
| `POST /api/appointments` | DENY | Own | DENY | DENY | `ALLOW` | Customer creates appointment for own active vehicle. |
| `GET /api/appointments/customer/{cId}` | DENY | Self | DENY | DENY | `ALLOW` | Customer views own appointments (`isSelf`). |
| `PUT /api/appointments/{id}` | DENY | Own | Scoped | DENY | `ALLOW` | Customer updates own pending appointment. |
| `PUT /api/appointments/{id}/cancel` | DENY | Own | Scoped | DENY | `ALLOW` | Customer cancels own pending appointment. |
| `PUT /api/appointments/{id}/approve` | DENY | DENY | Assigned | DENY | `ALLOW` | Assigned Manager approves appointment. |
| `PUT /api/appointments/{id}/reject` | DENY | DENY | Assigned | DENY | `ALLOW` | Assigned Manager rejects appointment. |
| `PUT /api/appointments/{id}/assign-mechanic/{mId}` | DENY | DENY | Team | DENY | `ALLOW` | Manager assigns mechanic from reporting team. |
| `GET /api/appointments/rsa` | DENY | DENY | Scoped | Scoped | `ALLOW` | Staff views assigned RSA requests. |
| **Job Cards** | | | | | | |
| `POST /api/job_cards` | DENY | DENY | Assigned | DENY | `ALLOW` | Assigned Manager creates job card for approved appointment. |
| `GET /api/job_cards/{id}` | DENY | Own | Assigned | Assigned | `ALLOW` | Customer (vehicle owner), Manager (assigned), Mechanic (assigned). |
| `PUT /api/job_cards/{id}/assign_mechanic` | DENY | DENY | Team | DENY | `ALLOW` | Manager assigns mechanic from reporting team. |
| `PUT /api/job_cards/{id}/start` | DENY | DENY | DENY | Assigned | DENY | Assigned Mechanic starts job (`CREATED -> IN_PROGRESS`). |
| `PUT /api/job_cards/{id}/complete` | DENY | DENY | DENY | Assigned | DENY | Assigned Mechanic completes job (`IN_PROGRESS -> COMPLETED`). |
| `POST /api/job_cards/{id}/items` | DENY | DENY | Assigned | Assigned | `ALLOW` | Manager or assigned Mechanic adds item. |
| `POST /api/job_cards/{id}/evidence` | DENY | DENY | Assigned | Assigned | `ALLOW` | Assigned Manager or Mechanic uploads evidence. |
| `POST /api/job_cards/{id}/rate` | DENY | Own | DENY | DENY | DENY | Customer rates completed job card (1-5). |
| `GET /api/job_cards/dashboard/manager/{mId}` | DENY | DENY | Self | DENY | `ALLOW` | Manager views own team metrics (`isSelf`). |
| `GET /api/job_cards/dashboard/mechanic/{mId}` | DENY | DENY | DENY | Self | `ALLOW` | Mechanic views own workload (`isSelf`). |
| **Inventory Management** | | | | | | |
| `POST /api/inventory` | DENY | DENY | DENY | DENY | `ALLOW` | Admin creates inventory master item. |
| `PUT /api/inventory/{id}` | DENY | DENY | DENY | DENY | `ALLOW` | Admin updates inventory item/price/stock. |
| `DELETE /api/inventory/{id}` | DENY | DENY | DENY | DENY | `ALLOW` | Admin soft-deletes inventory item. |
| `GET /api/inventory/**` | DENY | DENY | `ALLOW` | `ALLOW` | `ALLOW` | Staff views inventory availability and stock levels. |
| **Invoices & Payments** | | | | | | |
| `POST /api/invoices/generate/job_card/{id}` | DENY | DENY | Assigned | DENY | `ALLOW` | Manager generates invoice for completed job card. |
| `GET /api/invoices/{id}` | DENY | Own | Assigned | DENY | `ALLOW` | Owning customer, assigned manager, or admin. |
| `GET /api/invoices/customer/{cId}` | DENY | Self | DENY | DENY | `ALLOW` | Customer views own invoices (`isSelf`). |
| `POST /api/invoices/{id}/create_payment_order` | DENY | Own | DENY | DENY | `ALLOW` | Owning customer initiates Razorpay order. |
| `POST /api/invoices/{id}/verify_payment` | DENY | Own | DENY | DENY | `ALLOW` | Owning customer submits payment signature verification. |
| `POST /api/invoices/{id}/simulate_payment` | `404` | `404` | `404` | `404` | `404` | **REMOVED** from controller (returns HTTP 404). |
| `GET /api/invoices/stats/total_revenue` | DENY | DENY | DENY | DENY | `ALLOW` | Admin views platform revenue. |
