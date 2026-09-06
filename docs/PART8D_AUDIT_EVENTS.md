# AutoServe Part 8D — Administrative Audit Trail System

## 1. Executive Summary

AutoServe Part 8D implements an **Append-Only Administrative Audit Event Log** (`admin_audit_events`). All administrative actions—including staff account creation, user status activation/deactivation, team reassignment, appointment manager assignment, and stock adjustments—are persisted to an immutable database log.

---

## 2. Audited Actions Inventory

| Action Type | Resource Type | Trigger Event | Details Sanitization |
| :--- | :--- | :--- | :--- |
| `STAFF_CREATE` | `USER` | Admin creates Manager/Mechanic | Full name, role, email (Password zero-logged) |
| `USER_ACTIVATED` | `USER` | Admin activates account | User name, Admin reason |
| `USER_DEACTIVATED` | `USER` | Admin deactivates account | User name, Admin reason |
| `TEAM_REASSIGNMENT` | `USER` | Admin transfers mechanic | Mechanic name, Target manager, Reason |
| `APPOINTMENT_MANAGER_ASSIGNMENT` | `APPOINTMENT` | Admin assigns manager | Appointment ID, Manager name, Reason |
| `STOCK_ADJUSTMENT` | `INVENTORY` | Admin adjusts stock | Part name, Before $\rightarrow$ After stock, Movement type |

---

## 3. Immutability & Access Rules

1. **No Edit/Delete Interface**: The backend provides no `UPDATE` or `DELETE` endpoints for `AdminAuditEvent`.
2. **Access Scoping**: Endpoint `GET /api/admin/audit-events` is restricted to `@PreAuthorize("hasRole('ADMIN')")`.
3. **Zero Secrets**: Passwords, hashes, JWT keys, and refresh tokens are strictly omitted from audit log details.
