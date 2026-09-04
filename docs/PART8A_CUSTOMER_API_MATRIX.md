# AutoServe Part 8A — Customer API Matrix

This document provides a comprehensive mapping of all secured backend APIs used to support the Customer experience in AutoServe Part 8A.

## API Matrix

| Capability | Endpoint | Method | Request DTO | Response DTO | Ownership Rule | Status |
| ---------- | -------- | ------ | ----------- | ------------ | -------------- | ------ |
| Get Customer Profile | `/api/users/me` | GET | None | `UserResponseDto` | Current authenticated user from security context | Existing |
| Update Customer Profile | `/api/users/me` | PUT | `UpdateSelfProfileDto` | `UserResponseDto` | Current authenticated user from security context | Existing |
| Get My Vehicles | `/api/vehicles/me` | GET | None | `List<VehicleResponseDto>` | Resolved from security context (`customerId`) | Existing |
| Add Vehicle | `/api/vehicles` | POST | `CreateVehicleDto` | `VehicleResponseDto` | Customer ID assigned from security context | Existing |
| Get Vehicle Details | `/api/vehicles/{vehicleId}` | GET | None | `VehicleResponseDto` | `@accessControlService.canAccessVehicle(#vehicleId)` | Existing |
| Update Vehicle | `/api/vehicles/{vehicleId}` | PUT | `VehicleUpdateDto` | `VehicleResponseDto` | `@accessControlService.ownsVehicle(#vehicleId)` | Existing |
| Delete Vehicle | `/api/vehicles/{vehicleId}` | DELETE | None | `VehicleResponseDto` | `@accessControlService.ownsVehicle(#vehicleId)` | Existing |
| Get My Appointments | `/api/appointments/me` | GET | None | `List<AppointmentResponseDto>` | Resolved from security context (`customerId`) | Added in 8A |
| Get Customer Appointments | `/api/appointments/customer/{customerId}` | GET | None | `List<AppointmentResponseDto>` | `@accessControlService.isSelf(#customerId)` | Existing |
| Book Appointment | `/api/appointments` | POST | `CreateAppointmentDto` (multipart) | `AppointmentResponseDto` | `@accessControlService.ownsVehicle(#dto.vehicleId)` | Existing |
| Get Appointment Details | `/api/appointments/{appointmentId}` | GET | None | `AppointmentResponseDto` | `@accessControlService.canAccessAppointment(#appointmentId)` | Existing |
| Update Appointment | `/api/appointments/{appointmentId}` | PUT | `UpdateAppointmentDto` | `AppointmentResponseDto` | `@accessControlService.ownsAppointment(#appointmentId)` | Existing |
| Cancel Appointment | `/api/appointments/{appointmentId}/cancel` | DELETE | None | Void | `@accessControlService.ownsAppointment(#appointmentId)` | Existing |
| Get My Job Cards | `/api/job_cards/me` | GET | None | `List<JobCardResponseDto>` | Resolved from security context (`customerId`) | Added in 8A |
| Get Customer Job Cards | `/api/job_cards/customer/{customerId}` | GET | None | `List<JobCardResponseDto>` | `@accessControlService.isSelf(#customerId)` | Existing |
| Get Job Card Details | `/api/job_cards/{id}` | GET | None | `JobCardResponseDto` | `@accessControlService.canAccessJobCard(#id)` | Existing |
| Get Job Card by Appointment | `/api/job_cards/appointment/{appointmentId}` | GET | None | `JobCardResponseDto` | `@accessControlService.canAccessAppointment(#appointmentId)` | Existing |
| Get Job Card Evidence | `/api/job_cards/{id}/evidence` | GET | None | `JobCardResponseDto` | `@accessControlService.canAccessJobCard(#id)` | Existing |
| Rate Job Card | `/api/job_cards/{id}/rate` | PUT | `Map<String, Object>` | `JobCardResponseDto` | `@accessControlService.ownsJobCard(#id)` | Existing |
| Get My Invoices | `/api/invoices/me` | GET | None | `List<InvoiceResponseDto>` | Resolved from security context (`customerId`) | Added in 8A |
| Get Customer Invoices | `/api/invoices/customer/{customerId}` | GET | None | `List<InvoiceResponseDto>` | `@accessControlService.isSelf(#customerId)` | Existing |
| Get Invoice Details | `/api/invoices/{id}` | GET | None | `InvoiceResponseDto` | `@accessControlService.canAccessInvoice(#id)` | Existing |
| Get Invoice by Job Card | `/api/invoices/job_card/{jobCardId}` | GET | None | `InvoiceResponseDto` | `@accessControlService.canAccessJobCard(#jobCardId)` | Existing |
| Download Invoice PDF | `/api/invoices/{id}/download` | GET | None | `byte[]` (`application/pdf`) | `@accessControlService.canAccessInvoice(#id)` | Existing |

## Key Security Principles
1. **Ownership Enforcement**: All endpoints use `@accessControlService` or resolve the user ID directly from `SecurityContext` via `CurrentUserService`.
2. **Zero Browser Customer ID Passing**: Frontend self-service routes leverage `/me` endpoints to prevent URL tampering.
3. **No Entity Leakage**: All controllers return DTOs rather than JPA entities.
4. **Strict Customer Scope**: Customers cannot manage staff, assign mechanics, modify invoice amounts, or delete evidence.
