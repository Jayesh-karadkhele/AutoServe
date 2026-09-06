# AutoServe Part 8B — Manager API Matrix Documentation

## Backend API Specification Matrix

| Endpoint | HTTP Method | Auth Role | Description | Request Body | Response Payload |
|---|---|---|---|---|---|
| `/api/manager/dashboard/overview` | GET | `MANAGER` | Summary metrics & recent queue | None | `ManagerOverviewDto` |
| `/api/manager/reports/summary` | GET | `MANAGER` | Report breakdowns & revenue metrics | None | `ManagerReportSummaryDto` |
| `/api/manager/team` | GET | `MANAGER` | Roster of active mechanics & workloads | None | `List<MechanicWorkloadItemDto>` |
| `/api/manager/activity` | GET | `MANAGER` | Operational audit activity log | None | `List<ManagerActivityItemDto>` |
| `/api/appointments/manager/me` | GET | `MANAGER` | Appointments assigned under manager scope | None | `List<AppointmentResponseDto>` |
| `/api/appointments/{id}` | GET | `MANAGER` | Detailed appointment record with logistics | None | `AppointmentResponseDto` |
| `/api/appointments/{id}/approve` | PUT | `MANAGER` | Approve pending appointment | None | `AppointmentResponseDto` |
| `/api/appointments/{id}/reject` | PUT | `MANAGER` | Reject appointment with mandatory reason | `{ "rejectionReason": "..." }` | `AppointmentResponseDto` |
| `/api/appointments/{id}/assign-mechanic/{mechanicId}` | PUT | `MANAGER` | Assign mechanic to appointment | None | `AppointmentResponseDto` |
| `/api/job_cards/manager/me` | GET | `MANAGER` | Active & historical workshop job cards | None | `List<JobCardResponseDto>` |
| `/api/job_cards/{id}` | GET | `MANAGER` | Detailed job card with items & evidence | None | `JobCardResponseDto` |
| `/api/job_cards/{id}/assign-mechanic/{mechanicId}` | PUT | `MANAGER` | Assign mechanic to job card | None | `JobCardResponseDto` |
| `/api/job_cards/appointment/{appointmentId}` | POST | `MANAGER` | Create job card from approved appointment | `{ "diagnosis": "..." }` | `JobCardResponseDto` |
| `/api/job_cards/{id}/generate-invoice` | POST | `MANAGER` | Generate invoice for completed job card | None | `InvoiceResponseDto` |
| `/api/inventory/available` | GET | `MANAGER` | Inventory master list & reorder status | None | `List<InventoryItemDto>` |
| `/api/invoices/manager/me` | GET | `MANAGER` | Invoices under manager workshop scope | None | `List<InvoiceResponseDto>` |
| `/api/invoices/{id}` | GET | `MANAGER` | Detailed invoice record | None | `InvoiceResponseDto` |

---

## Error Handling & Response Contracts
- `400 Bad Request`: Validation failure (e.g. missing rejection reason, invalid mechanic ID).
- `401 Unauthorized`: Missing or expired JWT token.
- `403 Forbidden`: Authenticated user lacks `MANAGER` role (e.g. `CUSTOMER` access attempt).
- `404 Not Found`: Target entity not found in manager scope.
