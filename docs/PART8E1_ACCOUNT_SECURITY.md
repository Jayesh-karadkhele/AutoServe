# Part 8E.1 — Account Security & Authenticated Password Change Guide

## 1. Overview
The Account Security module provides authenticated users across all roles (`CUSTOMER`, `MECHANIC`, `MANAGER`, `ADMIN`) with the capability to change their password securely, review password strength metrics, enforce password policies, and manage active session revocation.

## 2. Authenticated Password Change Workflow
1. **Endpoint**: `POST /api/auth/change-password`
2. **Authorization**: Any authenticated JWT user.
3. **Payload**:
   ```json
   {
     "currentPassword": "OldPassword123!",
     "newPassword": "NewStrongPassword456!"
   }
   ```
4. **Validation Steps**:
   - Verify current password using `passwordEncoder.matches(currentPassword, user.getPassword())`. If invalid, throw `BadCredentialsException` / return 400.
   - Enforce password strength (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character).
   - Ensure new password differs from current password.
   - Update password hash in database.
   - Audit action in `audit_logs` (`CHANGE_PASSWORD`).

## 3. Frontend UI (`/account/security`)
- Features password visibility toggles, strength meter, real-time validation checks (length, character composition), and immediate feedback upon password modification.
