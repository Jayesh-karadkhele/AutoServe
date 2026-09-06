# AutoServe Part 8D — Admin Governance Architecture & Domain Model

## 1. Executive Summary

AutoServe Part 8D introduces the **Platform Governance Dashboard**, an enterprise administrative control system. The architecture delivers staff management (Manager/Mechanic creation), Manager–Mechanic team structure management, global appointment and job card oversight, controlled transactional stock movements with an append-only ledger, invoice payment verification, organization-wide operational reporting, immutable security audit logging, and safe read-only platform settings visibility.

---

## 2. Platform Architecture Diagram

```
+-----------------------------------------------------------------------+
|                      React / TypeScript Frontend                      |
|  - Governance Shell & Sidebar (AdminShell.tsx)                        |
|  - Role Guard & RBAC (/admin/* protected by ROLE_ADMIN)               |
|  - Staff Creation, Team Reassignment & Stock Adjustment Modals       |
|  - Dedicated Governance Workspaces (Users, Teams, Audit, Inventory)   |
+-----------------------------------------------------------------------+
                                   |
                             REST / JSON APIs
                                   v
+-----------------------------------------------------------------------+
|                   Spring Boot Governance & Security                   |
|  - AdminController (@PreAuthorize("hasRole('ADMIN')"))               |
|  - AdminService & AdminServiceImpl (Transactional Domain Logic)       |
|  - PasswordEncoder (Bcrypt hashing for staff accounts)                |
|  - Last-Active Admin & Self-Deactivation Protection Invariants       |
|  - Audit Log Producer (recordAuditEvent for all admin actions)        |
+-----------------------------------------------------------------------+
                                   |
                             JPA / Hibernate
                                   v
+-----------------------------------------------------------------------+
|                      Relational Persistence (V7)                      |
|  - Users, Role, Manager-Mechanic Foreign Keys                         |
|  - Inventory (@Version Optimistic Locking) & StockMovement Ledger     |
|  - AdminAuditEvent (Append-Only Immutable Audit Log)                  |
|  - Flyway Migrations (V1 -> V6 -> V7 Stock movements & Audit events)  |
+-----------------------------------------------------------------------+
```

---

## 3. Key Entities & Domain Schema

### 3.1 `StockMovement`
- **Fields**: `id`, `inventory` (FK), `movementType` (`INITIAL_STOCK`, `MANUAL_INCREASE`, `MANUAL_DECREASE`, `JOB_CONSUMPTION`, `JOB_ITEM_REVERSAL`, `CORRECTION`), `quantityBefore`, `quantityDelta`, `quantityAfter`, `jobCard` (FK, nullable), `actor` (FK to `users`), `reason`, `createdAt`.
- **Invariants**: Append-only (no edit/delete UI); transactional stock updates.

### 3.2 `AdminAuditEvent`
- **Fields**: `id`, `actor` (FK to `users`), `actionType` (`STAFF_CREATE`, `USER_ACTIVATED`, `USER_DEACTIVATED`, `TEAM_REASSIGNMENT`, `APPOINTMENT_MANAGER_ASSIGNMENT`, `STOCK_ADJUSTMENT`, `INVENTORY_CREATE`, `INVENTORY_UPDATE`, `ADMIN_OVERRIDE`), `resourceType` (`USER`, `APPOINTMENT`, `JOB_CARD`, `INVENTORY`, `INVOICE`, `SYSTEM`), `resourceId`, `outcome` ("SUCCESS", "FAILURE"), `details`, `createdAt`.
- **Invariants**: Append-only, read-only for Admins; zero storage of raw passwords or secrets.

---

## 4. Architectural Capability Status

| Capability | Status | Implementation Details |
| :--- | :--- | :--- |
| Admin Governance UI | **Implemented** | Built with Ivory canvas, soft cyan/violet accents, bright data surfaces. |
| Staff Account Creation | **Implemented** | Admin-only creation of Manager & Mechanic accounts with Bcrypt hashing. |
| Account Deactivation | **Implemented** | Immediate session revocation; protects last active Admin & self-deactivation. |
| Team Reassignment | **Implemented** | Transfer mechanics across managers with explicit active job warning. |
| Stock Movement Ledger | **Implemented** | Transactional stock updates with `@Version` optimistic locking & append-only log. |
| Immutable Audit Events | **Implemented** | All governance actions write append-only audit records. |
| Safe System Settings | **Implemented** | Configuration telemetry visibility with zero secret/JWT key leakage. |
| Razorpay Gateway & Webhooks | **Deferred** | Planned for Part 8E enterprise payment release. |
