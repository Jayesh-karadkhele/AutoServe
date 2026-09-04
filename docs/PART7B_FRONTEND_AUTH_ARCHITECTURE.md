# Part 7B Frontend Authentication Architecture

## 1. Executive Summary & Security Foundations
AutoServe Part 7B implements a secure, production-quality React authentication architecture for the AutoServe web platform. Access tokens exist **exclusively in JavaScript memory** and are never persisted in browser storage. Refresh tokens are stored strictly inside secure **HttpOnly, SameSite=Strict cookies**.

### Key Architecture Highlights
1. **In-Memory Access Token Store** (`accessTokenStore.ts`):
   - Access tokens are stored in a private module-scoped memory variable.
   - Zero exposure to `localStorage`, `sessionStorage`, `IndexedDB`, or JavaScript-accessible cookies.
2. **Single-Flight Automatic Refresh Interceptor** (`apiClient.ts`):
   - Handles HTTP 401 Unauthorized responses automatically.
   - Merges concurrent 401 failures into a single token refresh network request via `refreshClient`.
   - Prevents recursive refresh loops.
3. **Session Restoration Bootstrap** (`AuthProvider.tsx`):
   - Restores session on initial page load or page reload using the HttpOnly refresh cookie.
   - Fetches current authenticated user details from `GET /api/users/me`.
4. **Role-Based Protected Routing**:
   - `GuestOnlyRoute`: Redirects authenticated users from `/login` or `/register` to their role-specific dashboard.
   - `ProtectedRoute`: Enforces authentication status and role access, redirecting unauthorized users to `/forbidden` and unauthenticated users to `/login`.
5. **Route Code Splitting**:
   - Authentication pages, forms, and Axios clients are lazy-loaded via React Suspense to ensure zero impact on the initial public landing-page bundle.

---

## 2. API Contract Mapping

| Endpoint | HTTP Method | Body Payload | Response / Cookie | Description |
| :--- | :---: | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | `{ name, email, password, phone }` | `UserResponse` (`HTTP 201`) | Creates a Customer account. Excludes `role`, `salary`, `managerId`, `isActive`, `confirmPassword`. |
| `/api/auth/login` | `POST` | `{ email, password }` | `AuthResponse` (`HTTP 200`) + Cookie | Authenticates credentials, sets `AUTOSERVE_REFRESH` HttpOnly cookie, returns JWT in body. |
| `/api/auth/refresh` | `POST` | None (Cookie sent) | `AuthResponse` (`HTTP 200`) + Cookie | Rotates refresh cookie and returns new JWT access token. |
| `/api/auth/logout` | `POST` | None / Bearer Token | `HTTP 204 No Content` + Clear Cookie | Invalidates current auth session and clears HttpOnly refresh cookie. |
| `/api/auth/logout-all` | `POST` | Bearer Token | `HTTP 204 No Content` + Clear Cookie | Revokes all active sessions for current user across all devices. |
| `/api/users/me` | `GET` | Bearer Token | `UserResponse` (`HTTP 200`) | Returns authenticated profile of the current user. |

---

## 3. Directory Structure

```text
frontend/src/features/auth/
  api/
    authApi.ts               # Raw API calls (login, register, refresh, logout)
    authContracts.ts         # TypeScript DTO interfaces & user normalizers
  components/
    AuthAlert.tsx            # Accessible alert banner (role="alert")
    AuthField.tsx            # Accessible text input with label & error association
    AuthLayout.tsx           # Premium light-themed page layout
    AuthSubmitButton.tsx     # Double-submit prevented submit button
    AuthVisual.tsx           # Code-native "Service Passport" visual
    PasswordField.tsx        # Password field with toggle visibility & Caps Lock indicator
    PasswordRequirements.tsx # Live password checklist
    SessionBootstrapLoader.tsx # Light session-loading screen
  context/
    AuthContext.ts           # React Context definition & useAuth hook
    AuthProvider.tsx         # Session restoration & state provider
    authReducer.ts           # Auth state reducer (bootstrapping | authenticated | anonymous | error)
  pages/
    LoginPage.tsx            # Premium Login page
    RegisterPage.tsx         # Customer Registration page
  routing/
    ForbiddenPage.tsx        # HTTP 403 Access Denied page
    GuestOnlyRoute.tsx       # Route guard for unauthenticated users
    ProtectedRoute.tsx       # Route guard for authenticated & role-gated routes
    RoleEntryPage.tsx        # Temporary role entry page (Part 8 handoff)
    RoleRedirect.tsx         # Role-based redirection logic
    roleUtils.ts             # Normalized role-to-path mapping
  session/
    accessTokenStore.ts      # Strictly in-memory access token storage
  validation/
    authValidation.ts        # Client-side input validation rules
```
