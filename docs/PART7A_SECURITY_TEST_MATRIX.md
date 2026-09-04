# Part 7A Security Test Matrix

This matrix documents the comprehensive automated security test coverage implemented in Part 7A.

---

## 1. Test Suite Distribution

| Test Class | Purpose & Scope | Target Behaviors Verified |
| :--- | :--- | :--- |
| `LoginSessionIntegrationTests` | Session Creation & User Profile Retrieval | Active session insertion, short-lived JWT generation (`sid`, `jti`, `sub`), HttpOnly refresh cookie issuance, session validation on `/api/users/me`, inactive user rejection. |
| `RefreshTokenRotationTests` | Token Rotation & Theft Protection | Single-use refresh token rotation, pessimistic write locking, stolen/consumed token reuse detection, automatic session revocation upon token reuse, unknown token 401 handling. |
| `LogoutLifecycleTests` | Session Invalidation & Scoped Cleanup | Single session logout via cookie or Bearer `sid`, cleared cookie header (`Max-Age=0`), logout idempotency, access token rejection post-logout, `logout-all` multi-session revocation. |
| `AdminBootstrapTests` | Idempotent First-Admin Bootstrap | Environment-gated admin account creation (`app.bootstrap.admin.enabled=true`), password complexity validation, BCrypt encoding, email normalization, idempotency when admin exists. |
| `AuthCookieSecurityTests` | Custom Header & Cookie Defenses | Validation of `X-AutoServe-Client: web` header on POST `/api/auth/*`, HTTP 403 response on missing header, CORS preflight verification for `http://localhost:5173`. |
| `AuthenticationSecurityTests` | Public Endpoint & Baseline Authentication | Customer registration (`Role.CUSTOMER` enforce), rejection of ADMIN/MANAGER/MECHANIC roles in public registration, duplicate email rejection, weak password rejection. |
| `AccessControlServiceTests` | Ownership & Role Authorization | Object-level access control checks (Vehicles, Appointments, Job Cards, Invoices). |
| `UserAuthorizationTests` | User Endpoint Authorization | Secured access to user management endpoints. |
| `VehicleAuthorizationTests` | Vehicle Endpoint Authorization | Customer vs Staff vehicle access permissions. |
| `AppointmentAuthorizationTests` | Appointment Authorization | Customer booking & appointment state transition rules. |
| `JobCardAuthorizationTests` | Job Card Authorization | Manager/Mechanic job card assignment and update rules. |
| `InvoiceAuthorizationTests` | Invoice Authorization | Invoice generation, viewing, and financial access rules. |
| `InventoryAuthorizationTests` | Inventory Authorization | Parts catalog & stock management authorization. |
| `CorsSecurityTests` | Baseline CORS Security | Domain origin policies and preflight handling. |

---

## 2. Test Execution Statistics

- **Pre-Part 7A Baseline Test Count**: 67 tests (0 failures, 0 errors)
- **Part 7A Added Test Count**: 20+ tests
- **Total Post-Part 7A Test Count**: 87+ tests
- **Pass Rate Requirement**: 100% (0 failures, 0 errors)
