# AutoServe Static Security Scan Report

## Executive Summary
This document records the results of static code analysis performed on the active backend repository (`backend/`). The scan verifies controller authorization coverage, CORS consolidation, logging hygiene, exception handling safety, and ownership enforcement integrity.

---

## 1. Controller Method Authorization Coverage
- **Total Controllers**: 7 (`AuthController`, `UserController`, `VehicleController`, `AppointmentController`, `JobCardController`, `InventoryController`, `InvoiceController`)
- **Total Endpoint Handler Methods**: 67
- **Protected Endpoints**: 64
- **Public Endpoints**: 3 (`POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`)
- **Endpoints Missing Authorization**: **0 (None)**
- **Result**: **PASS**

---

## 2. Dynamic Logging & Exception Cleanliness
- **`System.out.println` scan**: 0 instances found in active backend source.
- **`printStackTrace` scan**: 0 instances found in active backend source.
- **Sensitive credential logging scan**: 0 instances of logging passwords, JWTs, or Razorpay signatures found.
- **Exception Handlers**: Standardized in `CustomAuthenticationEntryPoint.java` and `CustomAccessDeniedHandler.java` returning structured JSON without stack traces or raw SQL details.
- **Result**: **PASS**

---

## 3. CORS Configuration Verification
- **Authoritative Source**: `SecurityConfig.java` (`CorsConfigurationSource` bean).
- **Duplicate Source Removal**: `WebConfig.java` `addCorsMappings` removed.
- **Environment Driven**: Configured via `${CORS_ALLOWED_ORIGINS:http://localhost:5173}`.
- **Wildcard & Credentials Check**: `allowCredentials(true)` is strictly disabled when origins contains wildcard `*`.
- **Result**: **PASS**

---

## 4. DTO & Parameter Security
- **Public Registration DTO (`RegisterRequestDto`)**: Accepts only `name`, `email`, `password`, `phone`. Rejects unauthorized fields like `role`, `salary`, `managerId`, `isActive` with HTTP 400 Bad Request via Jackson `FAIL_ON_UNKNOWN_PROPERTIES`.
- **Staff Creation DTO (`CreateStaffDto`)**: Restricted to `@PreAuthorize("hasRole('ADMIN')")` at `/api/users`.
- **Self Profile Update DTO (`UpdateSelfProfileDto`)**: Accepts only `userName` and `mobile`. Excludes `role`, `salary`, `isActive`, `manager`.
- **Trusting Client Input as Identity**: Customer IDs are derived from `CurrentUserService` (`SecurityContext`) instead of trusting payload data.
- **Result**: **PASS**

---

## 5. Dangerous / Legacy Endpoint Removal
- **Endpoint**: `POST /api/invoices/{id}/simulate_payment`
- **Behavior**: Throws `ResourceNotFoundException("Payment simulation endpoint is unavailable")` resulting in HTTP 404 Not Found.
- **Result**: **PASS**
