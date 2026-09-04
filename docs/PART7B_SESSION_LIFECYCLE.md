# Part 7B Session Lifecycle & Token Management Guide

## 1. Single-Flight Token Refresh Flow

```
   Client Endpoint         apiClient (Interceptor)       refreshClient        Backend Server
          |                         |                          |                    |
   1. GET /api/users/me            |                          |                    |
   -------------------------------->| Bearer <expired-token>   |                    |
          |                         |---------------------------------------------->|
          |                         | HTTP 401 Unauthorized                         |
          |                         |<----------------------------------------------|
          |                         |                                               |
          |                         | 2. Single-Flight Check                        |
          |                         |    (refreshPromise == null)                   |
          |                         |    POST /api/auth/refresh                     |
          |                         |------------------------->| Cookie: AUTOSERVE  |
          |                         |                          |------------------->|
          |                         |                          | HTTP 200 OK + JWT  |
          |                         |                          |<-------------------|
          |                         | 3. setAccessToken(newToken)                   |
          |                         |                                               |
          |                         | 4. Retry Original GET /api/users/me           |
          |                         |    Bearer <newToken>                          |
          |                         |---------------------------------------------->|
          |                         | HTTP 200 OK (User Profile)                    |
   HTTP 200 OK                      |<----------------------------------------------|
   <--------------------------------|                                               |
```

### Protection Against Retry Loops
- If the token refresh call itself fails (HTTP 401 or 403), `clearAccessToken()` is invoked immediately, local state is reset to `anonymous`, and all queued requests fail cleanly without triggering retry loops.
- HTTP 403 Forbidden responses **never** trigger refresh attempts.

---

## 2. Page Reload & Session Restoration

Because access tokens exist only in memory, reloading the browser empties the token variable.

1. **Mount**: `AuthProvider` initializes with `status: 'bootstrapping'`.
2. **Silent Refresh**: `refreshApi()` is executed against `POST /api/auth/refresh`.
3. **Session Re-establishment**:
   - On Success: The newly issued JWT access token is stored in memory (`setAccessToken(res.token)`), and `GET /api/users/me` fetches the authenticated user profile. Status changes to `authenticated`.
   - On Failure: Access token is cleared, and status changes to `anonymous`.
4. **Loading Screen**: During `bootstrapping`, `SessionBootstrapLoader` presents a polished AutoServe branded loading screen without layout shift or login form flickering.

---

## 3. Role-Based Navigation Mapping

| User Role (`Role` enum) | Target Dashboard Route | Access Control Rule |
| :--- | :--- | :--- |
| `CUSTOMER` | `/customer/dashboard` | Accessible only to users with role `CUSTOMER`. |
| `MANAGER` | `/manager/dashboard` | Accessible only to users with role `MANAGER`. |
| `MECHANIC` | `/mechanic/dashboard` | Accessible only to users with role `MECHANIC`. |
| `ADMIN` | `/admin/dashboard` | Accessible only to users with role `ADMIN`. |
| *Unknown / Invalid* | `/forbidden` | Unknown roles receive **zero** privileged access and are redirected to HTTP 403 Forbidden. |
