# AutoServe — Role-Based Access Control (RBAC) Matrix

## Permission Matrix Overview

| Feature / Resource | Anonymous | CUSTOMER | MANAGER | MECHANIC | ADMIN |
|---|---|---|---|---|---|
| Public Landing / Login | Yes | Yes | Yes | Yes | Yes |
| Customer Register | Yes | No | No | No | No |
| Add Personal Vehicle | No | Yes (Self) | No | No | Yes (Any) |
| View Owned Vehicles | No | Yes (Own) | Yes (Assigned) | Yes (Assigned) | Yes (All) |
| Book Appointment | No | Yes (Own Vehicle)| No | No | Yes |
| View Pending Appointments Queue | No | No | Yes | No | Yes |
| Claim Pending Appointment | No | No | Yes (Atomic Lock)| No | Yes |
| Approve / Reject Appointment | No | No | Yes (Managed) | No | Yes |
| Assign Mechanic | No | No | Yes (Team) | No | Yes |
| Create Job Card | No | No | Yes (Managed) | No | Yes |
| Start / Complete Work | No | No | No | Yes (Assigned) | Yes |
| Add Parts to Job Card | No | No | Yes (Managed) | Yes (Assigned) | Yes |
| Upload Evidence | No | No | Yes (Managed) | Yes (Assigned) | Yes |
| Generate Invoice | No | No | Yes (Managed) | No | Yes |
| Pay Invoice | No | Yes (Owner) | No | No | Yes |
| Download Invoice PDF | No | Yes (Owner) | Yes (Managed) | No | Yes |
| Rate Completed Service | No | Yes (Owner) | No | No | Yes |
| Inventory Control (Create/Edit)| No | No | Read-Only | Read-Only | Full Access |
| Create Manager / Mechanic Staff | No | No | No | No | Yes |
| System Audits & Reports | No | No | Manager Scope | Mechanic Scope | Full System Scope |

## Security Layer Implementation Notes
1. **Parameter Level Ownership (`@accessControlService`)**:
   - `ownsVehicle(#vehicleId)`: Verifies vehicle customer matches authenticated user ID.
   - `ownsAppointment(#appointmentId)`: Verifies appointment vehicle customer matches authenticated user ID.
   - `managesAppointment(#appointmentId)`: Verifies appointment manager matches authenticated user ID.
   - `isAssignedMechanicForJobCard(#jobCardId)`: Verifies job card mechanic matches authenticated user ID.
   - `mechanicReportsToCurrentManager(#mechanicId)`: Verifies target mechanic reports to current manager.

2. **Atomic claiming (`PESSIMISTIC_WRITE`)**:
   - Claiming an appointment uses database row lock `findByIdWithLock` to prevent double-claiming when multiple managers attempt concurrent assignment.
