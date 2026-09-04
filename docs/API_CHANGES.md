# AutoServe Platform - API Changes & Hardening Log (Part 4)

**Date:** September 4, 2026  
**Phase:** Part 4 (Authentication, RBAC & Resource Ownership Security)  

---

## Executive Summary of Changes

The AutoServe backend API has been hardened to enforce role-based access control (RBAC), parameter validation, email normalization, resource-ownership boundaries, and removal of unsafe testing endpoints.

---

## 1. Authentication & Registration (`/api/auth`)

### `POST /api/auth/register`
- **Previous Behavior:** Public caller could supply `"role": "ADMIN"` or `"role": "MANAGER"` in JSON payload to create arbitrary staff/admin accounts.
- **Hardened Behavior:** `RegisterRequestDto` now accepts ONLY `name`, `email`, `password`, and `phone`.
- **Enforcement:**
  - Public registration strictly assigns `Role.CUSTOMER` and `isActive = true`.
  - Unrecognized fields (such as `"role": "ADMIN"`) are explicitly rejected with `HTTP 400 Bad Request`.
  - Email addresses are normalized (`trim()` and `toLowerCase(Locale.ROOT)`).
  - Password policy enforced via Bean Validation: 8-72 characters, minimum 1 uppercase, 1 lowercase, 1 number, and 1 special character.

### `POST /api/auth/login`
- **Previous Behavior:** Allowed deactivated accounts (`isActive = false`) to authenticate.
- **Hardened Behavior:** Authenticates email only if `user.isActive() == true`. Returns `HTTP 401 Unauthorized` for inactive accounts.

---

## 2. User & Profile Management (`/api/users`)

### New Self-Service Endpoints
- `GET /api/users/me`: Returns the authenticated user's profile details.
- `PUT /api/users/me`: Allows authenticated users to update safe profile fields (`userName`, `mobile`). Role, active status, salary, and manager cannot be updated via this route.

### Staff Creation (`POST /api/users`)
- Restricted to `@PreAuthorize("hasRole('ADMIN')")`.
- Uses `CreateStaffDto` (`userName`, `email`, `password`, `userRole`, `mobile`, `salary`, `managerId`).
- `userRole` must be `ADMIN`, `MANAGER`, or `MECHANIC`.
- If `managerId` is supplied for a `MECHANIC`, the assigned manager must be an active `MANAGER`.

---

## 3. Vehicle Management (`/api/vehicles`)

### `POST /api/vehicles`
- `CUSTOMER` role automatically binds `customerId` to the authenticated user ID (`CurrentUserService`), preventing customers from registering vehicles under another customer's ID.

### New Route
- `GET /api/vehicles/me`: Allows customers to list their registered vehicles.

---

## 4. Payment Simulation Endpoint Removal

### `POST /api/invoices/{id}/simulate_payment`
- **Status:** **REMOVED** from production and development controllers.
- **Behavior:** Returns `HTTP 404 Not Found`. Real invoices can only be marked `PAID` via verified payment signatures or authorized administrative overrides.

---

## 5. Security Exception Responses & CORS

- **Unauthenticated (HTTP 401):** Returns standardized JSON:
  ```json
  {
    "timestamp": "...",
    "status": 401,
    "error": "Unauthorized",
    "message": "Authentication is required",
    "path": "/api/..."
  }
  ```
- **Forbidden (HTTP 403):** Returns standardized JSON:
  ```json
  {
    "timestamp": "...",
    "status": 403,
    "error": "Forbidden",
    "message": "Access is denied",
    "path": "/api/..."
  }
  ```
- **CORS:** Environment variable `CORS_ALLOWED_ORIGINS` (defaults to `http://localhost:5173` in dev) enforced as the single authoritative source in `SecurityConfig`. Wildcard CORS is disabled when credentials are enabled.
