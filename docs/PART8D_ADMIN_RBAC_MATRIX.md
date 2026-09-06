# AutoServe Part 8D — Admin RBAC Matrix & Governance Rules

## 1. Enterprise Authority Matrix

| Action / Resource | Admin | Manager | Mechanic | Customer | Backend Enforced Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Access Admin Dashboard (`/admin/*`)** | ALLOW | DENY (`403`) | DENY (`403`) | DENY (`403`) | Protected by `@PreAuthorize("hasRole('ADMIN')")` |
| **Create Staff Account (Manager / Mechanic)** | ALLOW | DENY (`403`) | DENY (`403`) | DENY (`403`) | Admin-only API endpoint |
| **Deactivate User Account** | ALLOW | DENY (`403`) | DENY (`403`) | DENY (`403`) | Revokes active sessions; Audited |
| **Reassign Mechanic to New Manager** | ALLOW | DENY (`403`) | DENY (`403`) | DENY (`403`) | Audited team reassignment |
| **Assign Manager to Unassigned Appointment** | ALLOW | DENY (`403`) | DENY (`403`) | DENY (`403`) | Audited appointment assignment |
| **Perform Manual Stock Adjustment** | ALLOW | DENY (`403`) | DENY (`403`) | DENY (`403`) | Mandatory audit reason; `@Version` protected |
| **View Immutable Audit Events** | ALLOW | DENY (`403`) | DENY (`403`) | DENY (`403`) | Append-only audit trail endpoint |
| **View System Settings Telemetry** | ALLOW | DENY (`403`) | DENY (`403`) | DENY (`403`) | Read-only telemetry; Zero secret leak |
| **Manually Mark Invoice Paid** | DENY (`403`) | DENY (`403`) | DENY (`403`) | DENY (`403`) | **Unsupported** (Razorpay webhook verification only) |
| **View Raw Passwords or JWT Secrets** | DENY (`403`) | DENY (`403`) | DENY (`403`) | DENY (`403`) | **Forbidden Invariant** |

---

## 2. Platform Security Invariants

1. **Last Active Admin Protection**: Attempting to deactivate the single remaining active `ADMIN` throws `IllegalArgumentException: Cannot deactivate the last active Admin account`.
2. **Self-Deactivation Prevention**: Active Admin cannot self-deactivate their own active session.
3. **Session Revocation**: Deactivating a user immediately invalidates active JWT refresh cookies. Subsequent requests return `401 Unauthorized`.
4. **No Password Exposure**: User summary DTOs omit password fields entirely.
