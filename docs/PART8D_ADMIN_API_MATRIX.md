# AutoServe Part 8D — Admin API Matrix

## Internal API Specification & Authority Mapping

This document details all REST API endpoints introduced or utilized for the Admin Governance Dashboard.

| UI Action | HTTP Method | Endpoint | Request DTO | Response DTO | Required Authority | Validation & Audit Rules | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Get Governance Overview** | `GET` | `/api/admin/overview` | None | `AdminOverviewDto` | `ROLE_ADMIN` | Real DB telemetry; verified invoice totals only | **Implemented** |
| **List Users Directory** | `GET` | `/api/admin/users` | Query params (role, isActive, search) | `Page<UserSummaryDto>` | `ROLE_ADMIN` | Safe user DTOs; zero password/hash exposure | **Implemented** |
| **Get User Detail** | `GET` | `/api/admin/users/{userId}` | None | `UserSummaryDto` | `ROLE_ADMIN` | Scoped detail lookup | **Implemented** |
| **Create Staff Account** | `POST` | `/api/admin/staff` | `CreateStaffDto` | `UserSummaryDto` | `ROLE_ADMIN` | `MANAGER`/`MECHANIC` only; Bcrypt hashed; Audited (`STAFF_CREATE`) | **Implemented** |
| **Toggle User Active Status** | `PUT` | `/api/admin/users/{userId}/toggle-active` | Query param (`reason`) | `UserSummaryDto` | `ROLE_ADMIN` | Revokes sessions; Last-Admin protection; Self-deactivation blocked | **Implemented** |
| **Get Manager Directory** | `GET` | `/api/admin/managers` | Pageable | `Page<UserSummaryDto>` | `ROLE_ADMIN` | Scoped to `Role.MANAGER` | **Implemented** |
| **Get Manager Team** | `GET` | `/api/admin/managers/{managerId}/team` | None | `ManagerTeamDto` | `ROLE_ADMIN` | Manager + assigned mechanics + active counts | **Implemented** |
| **Get Mechanic Directory** | `GET` | `/api/admin/mechanics` | Pageable | `Page<UserSummaryDto>` | `ROLE_ADMIN` | Scoped to `Role.MECHANIC` | **Implemented** |
| **Reassign Mechanic** | `PUT` | `/api/admin/mechanics/reassign` | `ReassignMechanicDto` | `UserSummaryDto` | `ROLE_ADMIN` | Validates target manager; Audited (`TEAM_REASSIGNMENT`) | **Implemented** |
| **Assign Manager to Appt** | `PUT` | `/api/admin/appointments/assign-manager` | `AssignManagerAppointmentDto` | `Void` | `ROLE_ADMIN` | Active manager check; Audited (`APPOINTMENT_MANAGER_ASSIGNMENT`) | **Implemented** |
| **Adjust Inventory Stock** | `POST` | `/api/admin/inventory/adjust-stock` | `StockAdjustmentDto` | `StockMovementDto` | `ROLE_ADMIN` | Mandatory reason; `@Version` locking; Non-negative stock check | **Implemented** |
| **Get Stock Movements** | `GET` | `/api/admin/inventory/movements` | Query param (`inventoryId`) | `Page<StockMovementDto>` | `ROLE_ADMIN` | Append-only ledger history | **Implemented** |
| **Get Audit Events** | `GET` | `/api/admin/audit-events` | Query params (actorId, actionType, resourceType) | `Page<AdminAuditEventDto>` | `ROLE_ADMIN` | Append-only security audit trail | **Implemented** |
| **Get System Settings** | `GET` | `/api/admin/settings` | None | `SystemSettingsDto` | `ROLE_ADMIN` | Read-only configuration status; Zero secret exposure | **Implemented** |
