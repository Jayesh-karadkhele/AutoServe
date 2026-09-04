# Part 7A Authentication API Contract

This document defines the complete backend authentication REST API contract for AutoServe Part 7A and Part 7A.1 closeout.

---

## Base Path: `/api/auth` & `/api/users`

### 1. Customer Registration
`POST /api/auth/register`
- **Access**: Public
- **Headers**:
  - `Content-Type: application/json`
  - `X-AutoServe-Client: web`
  - `Origin: http://localhost:5173` (optional for same-origin/non-browser; if present, must match allowed origins)
- **Request Body**:
```json
{
  "name": "Jane Customer",
  "email": "jane@autoserve.com",
  "password": "ValidPass123!",
  "phone": "9876543210"
}
```
- **Response (201 Created)**:
```json
{
  "userId": 1,
  "userName": "Jane Customer",
  "email": "jane@autoserve.com",
  "userRole": "CUSTOMER",
  "mobile": "9876543210",
  "active": true,
  "createdAt": "2026-09-04T18:00:00Z"
}
```

---

### 2. User Login
`POST /api/auth/login`
- **Access**: Public
- **Headers**:
  - `Content-Type: application/json`
  - `X-AutoServe-Client: web`
  - `Origin: http://localhost:5173`
- **Request Body**:
```json
{
  "email": "jane@autoserve.com",
  "password": "ValidPass123!"
}
```
- **Response (200 OK)**:
  - **Headers**: `Set-Cookie: AUTOSERVE_REFRESH=<opaque_token>; Path=/api/auth; HttpOnly; SameSite=Strict`
  - **Body**:
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "role": "CUSTOMER",
  "userId": 1,
  "name": "Jane Customer",
  "email": "jane@autoserve.com",
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

### 3. Refresh Access Token
`POST /api/auth/refresh`
- **Access**: Public (Cookie authenticated)
- **Headers**:
  - `X-AutoServe-Client: web`
  - `Origin: http://localhost:5173`
- **Cookies**: `AUTOSERVE_REFRESH=<opaque_token>`
- **Response (200 OK)**:
  - **Headers**: `Set-Cookie: AUTOSERVE_REFRESH=<new_rotated_opaque_token>; Path=/api/auth; HttpOnly; SameSite=Strict`
  - **Body**:
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "role": "CUSTOMER",
  "userId": 1,
  "name": "Jane Customer",
  "email": "jane@autoserve.com",
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

### 4. Single Session Logout
`POST /api/auth/logout`
- **Access**: Public (Cookie / Token optional)
- **Headers**:
  - `X-AutoServe-Client: web`
  - `Origin: http://localhost:5173`
  - `Authorization: Bearer <accessToken>` (optional)
- **Cookies**: `AUTOSERVE_REFRESH=<opaque_token>` (optional)
- **Response (204 No Content)**:
  - **Headers**: `Set-Cookie: AUTOSERVE_REFRESH=; Path=/api/auth; Max-Age=0; HttpOnly; SameSite=Strict`

---

### 5. Logout All User Sessions
`POST /api/auth/logout-all`
- **Access**: Authenticated (Requires valid Bearer access token)
- **Headers**:
  - `Authorization: Bearer <accessToken>`
  - `X-AutoServe-Client: web`
  - `Origin: http://localhost:5173`
- **Response (204 No Content)**:
  - **Headers**: `Set-Cookie: AUTOSERVE_REFRESH=; Path=/api/auth; Max-Age=0; HttpOnly; SameSite=Strict`

---

### 6. Get Current User Profile
`GET /api/users/me`
- **Access**: Authenticated (Requires valid Bearer access token and active DB session)
- **Headers**:
  - `Authorization: Bearer <accessToken>`
- **Response (200 OK)**:
```json
{
  "userId": 1,
  "userName": "Jane Customer",
  "email": "jane@autoserve.com",
  "userRole": "CUSTOMER",
  "mobile": "9876543210",
  "active": true
}
```
