# AutoServe Platform - Comprehensive Security Audit Report

**Date:** September 4, 2026  
**Auditor:** Technical Auditor & Senior Security Specialist  

---

## Executive Summary

A comprehensive security audit of the AutoServe backend codebase was performed. Several critical and high-severity security vulnerabilities were identified that pose immediate risk to system integrity, customer data privacy, and financial transaction security.

---

## Vulnerability Classification Summary

| Severity | Count | Summary |
| :--- | :---: | :--- |
| **CRITICAL** | 3 | Public Admin role escalation, Inactive user authentication bypass, Payment simulation bypass |
| **HIGH** | 6 | Completely unannotated controllers, Massive IDOR / ownership flaws, CORS wildcard credentials, Unrestricted file uploads |
| **MEDIUM** | 4 | Hardcoded secrets in config, Missing refresh token & logout, Sensitive logging in JWT filter, Mass assignment risk |
| **LOW** | 2 | Exposed Swagger UI without auth, Weak password validation rules |

---

## 1. CRITICAL VULNERABILITIES

### 1.1 Public Privilege Escalation via User Registration (`CRITICAL`)
- **Location:** `AuthController.java` line 28 (`POST /api/auth/register`), `RegisterRequestDto.java` line 30, `AuthServiceImpl.java` line 48.
- **Root Cause:** `RegisterRequestDto` exposes `@NotNull private Role role;`. In `AuthServiceImpl.java`:
  ```java
  user.setUserRole(request.getRole() != null ? request.getRole() : Role.CUSTOMER);
  ```
- **Exploit:** Any unauthenticated public user can send a POST request to `/api/auth/register` with body `{"email": "attacker@test.com", "password": "password123", "role": "ADMIN"}` and instantly receive a valid JWT token with full `ROLE_ADMIN` privileges.
- **Remediation:** Remove the `role` field from public `RegisterRequestDto`. Public registration MUST hardcode `userRole = Role.CUSTOMER`. Admins, Managers, and Mechanics MUST only be created via the protected Admin endpoint (`POST /api/users`).

### 1.2 Deactivated / Inactive User Login Bypass (`CRITICAL`)
- **Location:** `CustomUserDetailsService.java` line 53-56 (`buildUserDetails`).
- **Root Cause:**
  ```java
  return org.springframework.security.core.userdetails.User.builder()
      .username(user.getEmail())
      .password(user.getPassword())
      .authorities(authorities)
      .accountExpired(false)
      .accountLocked(false)
      .credentialsExpired(false)
      .disabled(false) // <--- ALWAYS FALSE!
      .build();
  ```
  The line `.disabled(!user.isActive())` was commented out.
- **Exploit:** When an Admin deactivates a fired manager or rogue mechanic (`isActive = false`), the user can STILL log in and issue JWT requests without restriction.
- **Remediation:** Change `.disabled(false)` to `.disabled(!user.isActive())` and verify `user.isActive()` during authentication.

### 1.3 Payment Simulation Endpoint Bypassing Gateway (`CRITICAL`)
- **Location:** `InvoiceController.java` line 86 (`POST /api/invoices/{id}/simulate_payment`), `InvoiceServiceImpl.java` line 329.
- **Root Cause:** The controller exposes an unauthenticated endpoint that sets `invoice.setPaymentStatus(PaymentStatus.PAID)` and `paymentMethod = SIMULATED` without contacting Razorpay or verifying real money transfer.
- **Exploit:** Any customer can issue a POST request to `/api/invoices/123/simulate_payment` to mark any invoice as PAID for free.
- **Remediation:** Disable or remove `/simulate_payment` in non-test profiles (`@Profile("dev")`), or restrict strictly to `ROLE_ADMIN`.

---

## 2. HIGH VULNERABILITIES

### 2.1 Missing Method Security Annotations (`HIGH`)
- **Location:** `InventoryController.java` (ALL endpoints), `InvoiceController.java` (ALL endpoints), `UserController.java` line 54 (`PUT /{userId}`), `AppointmentController.java` line 42 (`PUT /{appointmentId}`), `JobCardController.java` lines 132-145 (Evidence endpoints).
- **Root Cause:** Entire controllers and critical state-modifying endpoints lack `@PreAuthorize` annotations.
- **Impact:** Any authenticated user with role `CUSTOMER` can modify inventory stock, alter part prices, delete inventory, update user accounts, modify service appointments, and manipulate job card evidence photos.
- **Remediation:** Add explicit `@PreAuthorize` annotations to every controller method.

### 2.2 Horizontal Privilege Escalation / Missing Ownership Checks (IDOR) (`HIGH`)
- **Locations:**
  - `VehicleController.java` (`PUT /{vehicleId}`, `DELETE /{vehicleId}`, `GET /{vehicleId}`)
  - `AppointmentController.java` (`GET /customer/{customerId}`, `DELETE /{appointmentId}/cancel`)
  - `JobCardController.java` (`PUT /{id}/start`, `PUT /{id}/complete`, `GET /dashboard/manager/{managerId}`, `GET /dashboard/mechanic/{mechanicId}`, `GET /customer/{customerId}`)
  - `InvoiceController.java` (`GET /customer/{customerId}`, `GET /{id}/download`)
- **Root Cause:** Controllers accept IDs from path parameters (e.g. `{customerId}`, `{vehicleId}`, `{managerId}`) and return/modify resources without checking if the authenticated user owns or is assigned to the resource.
- **Exploit:**
  - Customer A can fetch, update, or delete Customer B's vehicle and appointments.
  - Manager A can view Manager B's dashboard metrics and revenue figures.
  - Mechanic A can start or complete Job Cards assigned to Mechanic B.
- **Remediation:** Inject `Authentication` principal into service layer methods and verify `resource.getCustomer().getId().equals(authenticatedUserId)` or `resource.getMechanic().getId().equals(authenticatedUserId)`.

### 2.3 Wildcard CORS Configuration with Credentials Allowed (`HIGH`)
- **Location:** `SecurityConfig.java` line 93 (`config.setAllowedOriginPatterns(List.of("*"))`).
- **Root Cause:** Permitting wildcard origins (`*`) while enabling `setAllowCredentials(true)`.
- **Impact:** Allows malicious third-party websites visited by an authenticated user to make cross-site requests to the AutoServe API and steal sensitive session tokens or data.
- **Remediation:** Configure explicit allowed origin origins in `application.properties` (e.g. `http://localhost:3000`, `https://app.autoserve.com`).

### 2.4 Unrestricted Image Uploads (`HIGH`)
- **Location:** `AppointmentController.java` (`POST /api/appointments`), `CloudinaryServiceImpl.java`.
- **Root Cause:** Upload endpoints accept `MultipartFile` without validating file size limits, MIME content type (e.g., verifying `image/jpeg`, `image/png`), or extension.
- **Impact:** Potential remote execution or storage exhaustion by uploading executable scripts or oversized files.
- **Remediation:** Enforce file size bounds (e.g., max 5MB) and strict image content type checking (`file.getContentType().startsWith("image/")`).

---

## 3. MEDIUM VULNERABILITIES

### 3.1 Hardcoded Secrets in Properties (`MEDIUM`)
- **Location:** `src/main/resources/application.properties` lines 16, 20-22, 25-26.
- **Root Cause:** Plaintext secret keys in source control:
  - `jwt.secret=[REDACTED_PREVIOUS_PLAINTEXT_SECRET]`
  - `cloudinary.api_key=[REDACTED_PREVIOUS_API_KEY]`
  - `razorpay.key.secret=[REDACTED_PREVIOUS_KEY_SECRET]`
- **Remediation:** Use environment variables (e.g. `${JWT_SECRET}`, `${RAZORPAY_SECRET}`) with sensible local defaults.

### 3.2 Missing Refresh Token, Logout & Password Reset (`MEDIUM`)
- **Root Cause:** No token invalidation mechanism exists. JWT expiration is set to 24 hours (`86400000 ms`). If a token is compromised, it cannot be revoked before expiration.
- **Remediation:** Implement refresh tokens, token revocation list/Redis blacklist, and password reset email flow.

### 3.3 Sensitive Logging in JwtAuthenticationFilter (`MEDIUM`)
- **Location:** `JwtAuthenticationFilter.java` lines 38-44.
- **Root Cause:** `System.out.println(">>> Authorization Header: " + header);` prints raw JWT tokens to server console logs.
- **Remediation:** Remove raw token `System.out.println` print statements.

---

## 4. LOW VULNERABILITIES

### 4.1 Exposed Swagger UI Without Authentication (`LOW`)
- **Location:** `SecurityConfig.java` line 67-69 (`/swagger-ui/**`, `/v3/api-docs/**` `permitAll()`).
- **Impact:** Exposes complete API structure to anonymous callers.
- **Remediation:** Restrict Swagger UI to `ROLE_ADMIN` or disable in production.

---

## 5. Summary Matrix of Required Security Fixes

| Issue | Severity | Target File | Action Required |
| :--- | :---: | :--- | :--- |
| Public Role Choice | **CRITICAL** | `AuthServiceImpl.java`, `RegisterRequestDto.java` | Force default `Role.CUSTOMER` on public register |
| Inactive User Login | **CRITICAL** | `CustomUserDetailsService.java` | Enable `.disabled(!user.isActive())` check |
| Payment Simulation Bypass | **CRITICAL** | `InvoiceController.java` | Restrict/disable `/simulate_payment` |
| Missing `@PreAuthorize` | **HIGH** | `InventoryController`, `InvoiceController`, `UserController`, `AppointmentController`, `JobCardController` | Add method security to all endpoints |
| IDOR / Ownership Flaws | **HIGH** | All Service Implementations | Verify principal matches target entity owner |
| Wildcard CORS | **HIGH** | `SecurityConfig.java` | Replace `*` with configured domain list |
