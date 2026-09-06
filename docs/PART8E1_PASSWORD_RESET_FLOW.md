# Part 8E.1 — Password Reset & Recovery Workflow Documentation

## 1. Overview
The Forgotten Password Recovery Subsystem provides a secure, token-based self-service recovery mechanism for unauthenticated users who have lost access to their accounts.

## 2. End-to-End Recovery Flow

```
[ Unauthenticated User ] ──► Navigates to /forgot-password
           │
           ├── 1. POST /api/auth/forgot-password { email: "user@example.com" }
           ▼
[ AccountSecurityController ]
           │
           ▼
[ AccountSecurityServiceImpl.processForgotPassword() ]
           │
           ├── User Exists? ─────── NO ───────► Return generic success response
           │                                    (Prevents Email Enumeration)
           ▼ YES
   [ Create PasswordResetToken ]
    - Crypto-random 64-char hex token
    - Expires in 15 minutes (`expiry_date`)
    - `used = false`
           │
           ▼
  [ Save Token & Send Email ] ──► Email sent with link:
                                   `http://localhost:5173/reset-password?token=XYZ...`
           │
           ▼
[ User Clicks Email Link ] ──► Navigates to /reset-password?token=XYZ...
           │
           ├── 2. POST /api/auth/reset-password { token: "XYZ...", newPassword: "..." }
           ▼
 [ Validate Token & Expiry ]
           │
           ├───── Invalid / Expired / Used ───► Return Error (400 Bad Request)
           ▼ Valid
 [ Hash New Password & Save ]
           │
           ▼
 [ Mark Token `used = true` ]
           │
           ▼
   [ Audit Log Recorded ]
```

## 3. Security Design Considerations
- **Enumeration Defense**: The forgot-password endpoint returns the same HTTP 200 response regardless of whether the email address exists in the system.
- **Single-Use Constraint**: Password reset tokens are marked `used = true` immediately upon execution, preventing token reuse.
- **Short Lifespan**: Tokens automatically expire after 15 minutes.
