# Part 7A Authentication Architecture

## 1. Executive Summary & Security Principles
AutoServe Part 7A establishes a production-grade, stateful authentication security architecture designed to support a multi-role web platform (Customer, Manager, Mechanic, Admin).

### Core Security Guarantees
1. **Short-Lived JWT Access Tokens**: Signed using HMAC-SHA512 (`HS512`). Access tokens have a default lifetime of 15 minutes (`900,000 ms`). They contain non-sensitive identity claims (`sub`, `email`, `role`, `sid`, `jti`, `iat`, `exp`).
2. **Opaque Refresh Tokens**: 256-bit cryptographically secure random entropy strings generated via `SecureRandom`. Raw refresh tokens are never persisted in the database; only their SHA-256 binary/hex hashes are stored in `refresh_tokens`.
3. **HttpOnly Refresh Cookies**: Refresh tokens are returned exclusively via an HttpOnly cookie (`AUTOSERVE_REFRESH`, `HttpOnly=true`, `SameSite=Strict`, `Path=/api/auth`). Creation and deletion cookies share identical Name, Path, HttpOnly, Secure, SameSite, and Domain attributes.
4. **Database Session Validation**: Every incoming authenticated request validates JWT signature, expiration, user active status, AND database authentication session state (`auth_sessions.revoked_at is null`). Session revocation immediately invalidates all associated access tokens before JWT expiration.
5. **Atomic Token Rotation & Theft Detection**: Refresh tokens are single-use. Refreshing consumes the presented token and issues a new token pair inside a database transaction with pessimistic write locking (`@Lock(LockModeType.PESSIMISTIC_WRITE)`). Presenting an already-consumed token triggers theft detection, immediately revoking the entire authentication session.
6. **Explicit Origin & Custom Header Defenses**: `AuthRequestProtectionFilter` selectively validates state-changing POST authentication endpoints (`/api/auth/register`, `/login`, `/refresh`, `/logout`, `/logout-all`). Requiring `X-AutoServe-Client: web` and validating `Origin` against allowed origins (`http://localhost:5173`).
7. **Environment-Gated Admin Bootstrap**: First-Admin account creation is handled by `AdminBootstrapRunner`, gated by `@ConditionalOnProperty(prefix = "app.bootstrap.admin", name = "enabled", havingValue = "true")`. It uses the shared `PasswordEncoder` and runs idempotently only when zero Admin accounts exist.
8. **Bounded Token Cleanup Strategy**: `AuthTokenCleanupService` executes bounded cleanup of expired sessions and tokens (deleting child tokens before parent sessions, retaining consumed tokens for 14 days for theft detection). Scheduled cleanup is disabled during test profiles (`app.auth.cleanup.enabled=false`).

---

## 2. Token Lifecycle & Session Model

```
+----------------+          +-------------------+          +----------------------+
|  React Client  |          |   Spring Security |          |  MySQL Database      |
+-------+--------+          +---------+---------+          +----------+-----------+
        |                             |                               |
        | POST /api/auth/login        |                               |
        | Origin: http://localhost... | Validate Origin & Client Hdr  |
        | Header: X-AutoServe-Client  | Authenticate Credentials      |
        |---------------------------->| Create AuthSession (sid)      |
        |                             | Create RefreshToken (hash)    |------> Persist Session & Hash
        | HTTP 200 OK + JWT           |                               |
        |<----------------------------| Set HttpOnly AUTOSERVE_REFRESH|
        |                             |                               |
        | GET /api/users/me           |                               |
        | Header: Bearer <JWT>        | Validate JWT + Check sid      |
        |---------------------------->|------------------------------>| Query Session (Active?)
        | HTTP 200 OK (User Data)     | Session Active                |
        |<----------------------------|                               |
        |                             |                               |
        | POST /api/auth/refresh      |                               |
        | Cookie: AUTOSERVE_REFRESH   | Lock & Validate Token Hash    |
        | Header: X-AutoServe-Client  |------------------------------>| SELECT ... FOR UPDATE
        |---------------------------->| Mark Old Consumed             |
        | HTTP 200 OK + New JWT       | Issue New Token               |
        |<----------------------------| Set New HttpOnly Cookie       |
        |                             |                               |
        | POST /api/auth/logout       |                               |
        | Cookie / Bearer sid         | Revoke Session                |
        |---------------------------->|------------------------------>| UPDATE auth_sessions SET revoked_at
        | HTTP 204 No Content         | Clear AUTOSERVE_REFRESH Cookie|
        |<----------------------------|                               |
```

---

## 3. Flyway Database Schema Overview

### Migration Inventory
- `V1__initial_schema.sql` (Initial core database tables)
- `V2__financial_precision_and_indexes.sql` (BigDecimal monetary columns and performance indexes)
- `V3__authentication_sessions_and_refresh_tokens.sql` (`auth_sessions` and `refresh_tokens` tables)
- `V4__authentication_schema_corrections.sql` (Removes redundant non-unique `idx_refresh_tokens_hash` index, preserving unique constraint)

---

## 4. Environment Configuration Properties

| Property Key | Default Value | Description |
| :--- | :--- | :--- |
| `app.auth.jwt-secret` | `env(JWT_SECRET)` | 512-bit HMAC secret key |
| `app.auth.jwt-access-expiration-ms` | `900000` (15m) | Access token validity in milliseconds |
| `app.auth.refresh-token-expiration-ms` | `604800000` (7d) | Refresh token validity in milliseconds |
| `app.auth.auth-session-expiration-ms` | `604800000` (7d) | Absolute session validity in milliseconds |
| `app.auth.cookie-name` | `AUTOSERVE_REFRESH` | Name of HttpOnly refresh cookie |
| `app.auth.cookie-same-site` | `Strict` | SameSite cookie policy |
| `app.auth.cookie-secure` | `false` (dev) / `true` (prod) | Secure flag requiring HTTPS |
| `app.auth.cookie-domain` | `` (empty) | Cookie domain boundary |
| `app.auth.cookie-path` | `/api/auth` | Cookie path scoping |
| `app.auth.required-client-header` | `X-AutoServe-Client` | Header required for cookie auth requests |
| `app.auth.allowed-client-header-value` | `web` | Required header value |
| `app.auth.cleanup.enabled` | `true` (dev/prod) / `false` (test) | Enables bounded token cleanup scheduler |
| `app.bootstrap.admin.enabled` | `false` (dev) / `true` (prod) | Master toggle for initial Admin bootstrap |
| `app.bootstrap.admin.email` | `env(BOOTSTRAP_ADMIN_EMAIL)` | Initial admin email |
| `app.bootstrap.admin.password` | `env(BOOTSTRAP_ADMIN_PASSWORD)` | Initial admin password |
