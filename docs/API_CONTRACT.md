# AutoServe Platform - Complete API Contract & Endpoint Inventory

**Date:** September 4, 2026  
**Auditor:** Principal Java Full-Stack Architect  

---

## Endpoint Inventory & Contract Summary

This document lists every REST API endpoint existing in the codebase, alongside audit observations regarding Role-Based Access Control (RBAC), missing authorization annotations, and horizontal privilege escalation (IDOR/ownership) vulnerabilities.

---

## 1. Authentication (`/api/auth` & `/api/users/me`)

| Endpoint | Method | Permitted Role | Request DTO | Response DTO | Implementation Status | Security / Audit Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public (`permitAll`) | `RegisterRequestDto` | `UserResponseDto` | IMPLEMENTED | Strictly registers `CUSTOMER` accounts. Returns `UserResponseDto` without token. Requires `X-AutoServe-Client: web` and allowed `Origin`. |
| `/api/auth/login` | `POST` | Public (`permitAll`) | `LoginRequestDto` | `AuthResponseDto` | IMPLEMENTED | Validates active user, creates `AuthSession`, sets HttpOnly `AUTOSERVE_REFRESH` cookie, returns short-lived JWT. Requires `X-AutoServe-Client: web` and allowed `Origin`. |
| `/api/auth/refresh` | `POST` | Public (`permitAll`) | None (Cookie) | `AuthResponseDto` | IMPLEMENTED | Rotates single-use refresh token, updates HttpOnly cookie, returns new access token. Theft detection revokes session on reuse. Requires `X-AutoServe-Client: web` and allowed `Origin`. |
| `/api/auth/logout` | `POST` | Public (`permitAll`) | None (Cookie/Bearer) | `204 No Content` | IMPLEMENTED | Idempotent single-session revocation, clears `AUTOSERVE_REFRESH` cookie (`Max-Age=0`). Requires `X-AutoServe-Client: web` and allowed `Origin`. |
| `/api/auth/logout-all` | `POST` | Authenticated | None (Bearer) | `204 No Content` | IMPLEMENTED | Revokes ALL active sessions in DB belonging to current user. Requires `X-AutoServe-Client: web` and allowed `Origin`. |
| `/api/users/me` | `GET` | Authenticated | None (Bearer) | `UserResponseDto` | IMPLEMENTED | Validates JWT signature, expiration, user active status, AND active DB session state. Returns authenticated user profile. |

---

## 2. User Management (`/api/users`)

| Endpoint | Method | Permitted Role (Configured) | Request DTO | Response DTO | Implementation Status | Security / Audit Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/users` | `POST` | `hasRole('ADMIN')` | `CreateUserDto` | `UserResponseDto` | IMPLEMENTED | Admin endpoint to create staff (Managers, Mechanics). |
| `/api/users/getUsers` | `GET` | `hasRole('ADMIN')` | None | `List<UserResponseDto>` | IMPLEMENTED | Admin list of all users. |
| `/api/users/getUserById/{userId}` | `GET` | `hasAnyRole('MANAGER','MECHANIC','ADMIN','CUSTOMER')` | None | `UserResponseDto` | IMPLEMENTED | **HIGH IDOR ISSUE:** Any logged-in customer can fetch details of any other user/customer by changing `{userId}`. |
| `/api/users/{userId}` | `PUT` | **MISSING (`permitAll` by default)** | `UpdateUserDto` | `UserResponseDto` | IMPLEMENTED | **CRITICAL IDOR ISSUE:** No `@PreAuthorize`! Any user can overwrite any user's profile data. |
| `/api/users/{userId}` | `DELETE` | `hasRole('ADMIN')` | None | String message | IMPLEMENTED | Soft deactivates user (`isActive = false`). |
| `/api/users/active` | `GET` | `hasRole('ADMIN')` | None | `List<UserResponseDto>` | IMPLEMENTED | Fetches active users. |
| `/api/users/customers` | `GET` | `hasRole('ADMIN')` | None | `List<UserResponseDto>` | IMPLEMENTED | Fetches all customers. |
| `/api/users/customer/{customerId}` | `GET` | `hasAnyRole('MANAGER','MECHANIC','ADMIN','CUSTOMER')` | None | `UserResponseDto` | IMPLEMENTED | **HIGH IDOR ISSUE:** No check that `customerId == authenticatedUser`. |
| `/api/users/managers` | `GET` | `hasRole('ADMIN')` | None | `List<UserResponseDto>` | IMPLEMENTED | Fetches all managers. |
| `/api/users/manager/{managerId}` | `GET` | `hasAnyRole('MANAGER','MECHANIC','ADMIN','CUSTOMER')` | None | `UserResponseDto` | IMPLEMENTED | Fetches manager profile. |
| `/api/users/managers/{managerId}/mechanics` | `GET` | `hasAnyRole('MANAGER','ADMIN')` | None | `List<UserResponseDto>` | IMPLEMENTED | **MEDIUM IDOR ISSUE:** Manager A can list Mechanics under Manager B. |
| `/api/users/mechanics` | `GET` | `hasAnyRole('MANAGER','ADMIN')` | None | `List<UserResponseDto>` | IMPLEMENTED | Fetches all mechanics. |
| `/api/users/mechanic/{mechanicId}` | `GET` | `hasAnyRole('MANAGER','MECHANIC','ADMIN','CUSTOMER')` | None | `UserResponseDto` | IMPLEMENTED | Fetches mechanic profile. |
| `/api/users/mechanics/{mechanicId}/assign_manager/{managerId}` | `PUT` | `hasRole('ADMIN')` | None | `UserResponseDto` | IMPLEMENTED | Admin assigns mechanic to manager. |

---

## 3. Vehicle Management (`/api/vehicles`)

| Endpoint | Method | Permitted Role (Configured) | Request DTO | Response DTO | Implementation Status | Security / Audit Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/vehicles` | `POST` | **MISSING (Annotation commented out)** | `CreateVehicleDto` | `VehicleResponseDto` | IMPLEMENTED | **HIGH ISSUE:** `@PreAuthorize` commented out. Any user can create vehicles. |
| `/api/vehicles` | `GET` | `hasRole('CUSTOMER')` | None | `List<VehicleResponseDto>` | IMPLEMENTED | Returns all vehicles in system (should return logged-in customer's vehicles). |
| `/api/vehicles/{vehicleId}` | `PUT` | `hasRole('CUSTOMER')` | `VehicleUpdateDto` | `VehicleResponseDto` | IMPLEMENTED | **HIGH IDOR ISSUE:** No check if vehicle belongs to caller. Customer A can modify Customer B's vehicle. |
| `/api/vehicles/{vehicleId}` | `GET` | `hasAnyRole('CUSTOMER','ADMIN')` | None | `VehicleResponseDto` | IMPLEMENTED | **HIGH IDOR ISSUE:** Missing vehicle ownership verification. |
| `/api/vehicles/license_plate/{licensePlate}` | `GET` | **MISSING** | None | `VehicleResponseDto` | IMPLEMENTED | **HIGH ISSUE:** Unprotected public/authenticated vehicle search by license plate. |
| `/api/vehicles/customer/{customerId}` | `GET` | **MISSING** | None | `List<VehicleResponseDto>` | IMPLEMENTED | **HIGH IDOR ISSUE:** Unprotected listing of any customer's vehicles by customerId. |
| `/api/vehicles/{vehicleId}` | `DELETE` | `hasAnyRole('CUSTOMER','ADMIN')` | None | String message | IMPLEMENTED | **HIGH IDOR ISSUE:** Missing vehicle ownership check before deletion. |

---

## 4. Appointment & RSA Management (`/api/appointments`)

| Endpoint | Method | Permitted Role (Configured) | Request / Multipart | Response DTO | Implementation Status | Security / Audit Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/appointments` | `POST` | `hasRole('CUSTOMER')` | Part `"appointment"` (`CreateAppointmentDto`), Part `"image"` (`MultipartFile`) | `AppointmentResponseDto` | IMPLEMENTED | Creates regular or RSA appointment. Supports Cloudinary photo upload. |
| `/api/appointments/{appointmentId}` | `PUT` | **MISSING** | `UpdateAppointmentDto` | `AppointmentResponseDto` | IMPLEMENTED | **CRITICAL IDOR ISSUE:** No `@PreAuthorize`. Any authenticated user can modify any appointment. |
| `/api/appointments/{appointmentId}/cancel` | `DELETE` | `hasAnyRole('CUSTOMER','ADMIN')` | None | Void (244 No Content) | IMPLEMENTED | **HIGH IDOR ISSUE:** No ownership check to ensure appointment belongs to customer. |
| `/api/appointments/customer/{customerId}` | `GET` | `hasAnyRole('CUSTOMER','ADMIN')` | None | `List<AppointmentResponseDto>` | IMPLEMENTED | **HIGH IDOR ISSUE:** Customer A can fetch Customer B's appointments. |
| `/api/appointments/vehicle/{vehicleId}` | `GET` | **MISSING** | None | `List<AppointmentResponseDto>` | IMPLEMENTED | **HIGH ISSUE:** Unprotected query for vehicle appointment history. |
| `/api/appointments` | `GET` | `hasAnyRole('MANAGER','ADMIN')` | None | `List<AppointmentResponseDto>` | IMPLEMENTED | Lists all appointments in system. |
| `/api/appointments/{appointmentId}` | `GET` | `hasAnyRole('MANAGER','ADMIN')` | None | `AppointmentResponseDto` | IMPLEMENTED | Fetches single appointment. |
| `/api/appointments/pending` | `GET` | `hasAnyRole('MANAGER','ADMIN')` | None | `List<AppointmentResponseDto>` | IMPLEMENTED | Fetches pending appointments. |
| `/api/appointments/status/{status}` | `GET` | `hasAnyRole('MANAGER','ADMIN')` | None | `List<AppointmentResponseDto>` | IMPLEMENTED | Filter appointments by status. |
| `/api/appointments/{appointmentId}/approve` | `PUT` | `hasAnyRole('MANAGER','ADMIN')` | None | `AppointmentResponseDto` | IMPLEMENTED | Approves customer appointment. |
| `/api/appointments/{appointmentId}/reject` | `PUT` | `hasAnyRole('MANAGER','ADMIN')` | `ApproveRejectDto` | `AppointmentResponseDto` | IMPLEMENTED | Rejects appointment with mandatory reason. |
| `/api/appointments/status/pending_count` | `GET` | `hasAnyRole('MANAGER','ADMIN')` | None | Long count | IMPLEMENTED | Returns pending appointment count. |
| `/api/appointments/rsa` | `GET` | **MISSING** | None | `List<AppointmentResponseDto>` | IMPLEMENTED | **HIGH ISSUE:** Unprotected RSA appointments query. |
| `/api/appointments/rsa/pending` | `GET` | **MISSING** | None | `List<AppointmentResponseDto>` | IMPLEMENTED | **HIGH ISSUE:** Unprotected pending RSA query. |
| `/api/appointments/rsa/{status}` | `GET` | **MISSING** | None | `List<AppointmentResponseDto>` | IMPLEMENTED | **HIGH ISSUE:** Unprotected RSA status filter. |
| `/api/appointments/status/rsa_count` | `GET` | **MISSING** | None | Long count | IMPLEMENTED | **HIGH ISSUE:** Unprotected RSA count query. |
| `/api/appointments/{appointmentId}/assign-manager/{managerId}` | `PUT` | `hasRole('ADMIN')` | None | `AppointmentResponseDto` | IMPLEMENTED | Admin assigns manager to appointment. |
| `/api/appointments/{appointmentId}/assign-mechanic/{mechanicId}` | `PUT` | `hasAnyRole('MANAGER','ADMIN')` | None | `AppointmentResponseDto` | IMPLEMENTED | Manager assigns mechanic to appointment. |
| `/api/appointments/mechanic/{mechanicId}` | `GET` | `hasAnyRole('MANAGER','ADMIN','MECHANIC')` | None | `List<AppointmentResponseDto>` | IMPLEMENTED | **MEDIUM IDOR ISSUE:** Mechanic A can view Mechanic B's assigned appointments. |
| `/api/appointments/manager/{managerId}` | `GET` | `hasAnyRole('MANAGER','ADMIN')` | None | `List<AppointmentResponseDto>` | IMPLEMENTED | **MEDIUM IDOR ISSUE:** Manager A can view Manager B's appointments. |

---

## 5. Job Card Management (`/api/job_cards`)

| Endpoint | Method | Permitted Role (Configured) | Request DTO | Response DTO | Implementation Status | Security / Audit Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/job_cards` | `POST` | `hasAnyRole('MANAGER','MECHANIC')` | `CreateJobCardDto` | `JobCardResponseDto` | IMPLEMENTED | Creates job card for approved appointment. |
| `/api/job_cards/{id}` | `GET` | `hasAnyRole('MANAGER','MECHANIC')` | None | `JobCardResponseDto` | IMPLEMENTED | **HIGH IDOR ISSUE:** Mechanic/Manager can view unassigned job card. |
| `/api/job_cards` | `GET` | `hasAnyRole('MANAGER','ADMIN')` | None | `List<JobCardResponseDto>` | IMPLEMENTED | Lists all job cards. |
| `/api/job_cards/appointment/{appointmentId}` | `GET` | `hasAnyRole('MANAGER','ADMIN')` | None | `JobCardResponseDto` | IMPLEMENTED | Fetches job card by appointment. |
| `/api/job_cards/{id}/assign_mechanic` | `PUT` | `hasAnyRole('MANAGER','MECHANIC')` | `AssignMechanicDto` | `JobCardResponseDto` | IMPLEMENTED | **HIGH ISSUE:** Allows Mechanic role to assign mechanics. |
| `/api/job_cards/{id}/reassign_mechanic` | `PUT` | `hasRole('MANAGER')` | `AssignMechanicDto` | `JobCardResponseDto` | IMPLEMENTED | Manager reassigns mechanic. |
| `/api/job_cards/{id}/start` | `PUT` | `hasRole('MECHANIC')` | None | `JobCardResponseDto` | IMPLEMENTED | **HIGH IDOR ISSUE:** Any mechanic can start any job card, even if not assigned to them. |
| `/api/job_cards/{id}/complete` | `PUT` | `hasRole('MECHANIC')` | None | `JobCardResponseDto` | IMPLEMENTED | **HIGH IDOR ISSUE:** Any mechanic can complete any job card. |
| `/api/job_cards/{id}/cancel` | `DELETE` | `hasAnyRole('MANAGER','ADMIN')` | `CancelJobCardDto` | `JobCardResponseDto` | IMPLEMENTED | Cancels job card with reason. |
| `/api/job_cards/{id}/items` | `POST` | `hasAnyRole('MANAGER','MECHANIC')` | `AddItemToJobCardDto` | `JobCardResponseDto` | IMPLEMENTED | Deducts inventory and snapshots price. |
| `/api/job_cards/{jobCardId}/items/{itemId}` | `DELETE` | `hasAnyRole('MANAGER','MECHANIC')` | None | `JobCardResponseDto` | IMPLEMENTED | Restores inventory stock upon removal. |
| `/api/job_cards/{id}/items` | `GET` | `hasAnyRole('MANAGER','MECHANIC')` | None | `List<JobCardItemDto>` | IMPLEMENTED | Lists job card items. |
| `/api/job_cards/{id}/evidence` | `POST` | **MISSING** | `JobCardEvidenceDto` | `JobCardResponseDto` | IMPLEMENTED | **HIGH ISSUE:** Unprotected evidence creation. |
| `/api/job_cards/{jobCardId}/evidence/{evidenceId}` | `DELETE` | **MISSING** | None | `JobCardResponseDto` | IMPLEMENTED | **HIGH ISSUE:** Unprotected evidence deletion. |
| `/api/job_cards/{id}/evidence` | `GET` | **MISSING** | None | `JobCardResponseDto` | IMPLEMENTED | **HIGH ISSUE:** Unprotected evidence viewing. |
| `/api/job_cards/manager/{managerId}` | `GET` | `hasRole('ADMIN')` | None | `List<JobCardResponseDto>` | IMPLEMENTED | Returns manager's job cards. |
| `/api/job_cards/mechanic/{mechanicId}` | `GET` | `hasAnyRole('MANAGER','ADMIN','MECHANIC')` | None | `List<JobCardResponseDto>` | IMPLEMENTED | Returns mechanic's assigned job cards. |
| `/api/job_cards/status/{status}` | `GET` | `hasAnyRole('MANAGER','ADMIN','MECHANIC')` | None | `List<JobCardResponseDto>` | IMPLEMENTED | Filters job cards by status. |
| `/api/job_cards/dashboard/manager/{managerId}` | `GET` | `hasRole('MANAGER')` | None | `ManagerDashboardDto` | IMPLEMENTED | **HIGH IDOR ISSUE:** Manager A can view Manager B's dashboard metrics. |
| `/api/job_cards/dashboard/mechanic/{mechanicId}` | `GET` | `hasRole('MECHANIC')` | None | `MechanicDashboardDto` | IMPLEMENTED | **HIGH IDOR ISSUE:** Mechanic A can view Mechanic B's dashboard. |
| `/api/job_cards/revenue/manager/{managerId}` | `GET` | `hasAnyRole('MANAGER','ADMIN')` | None | Map (`"revenue"`) | IMPLEMENTED | **HIGH IDOR ISSUE:** Manager A can view Manager B's revenue. |
| `/api/job_cards/team/manager/{managerId}` | `GET` | `hasAnyRole('MANAGER','ADMIN')` | None | `List<MechanicWorkloadDto>` | IMPLEMENTED | Returns team workload breakdown. |
| `/api/job_cards/customer/{customerId}` | `GET` | `hasRole('CUSTOMER')` | None | `List<JobCardResponseDto>` | IMPLEMENTED | **HIGH IDOR ISSUE:** Customer A can view Customer B's job cards. |
| `/api/job_cards/{id}/rate` | `PUT` | `hasRole('CUSTOMER')` | Map (`"rating"`, `"feedback"`) | `JobCardResponseDto` | IMPLEMENTED | Customer submits rating & feedback. |

---

## 6. Inventory Management (`/api/inventory`)

> [!WARNING]
> **ENTIRE INVENTORY CONTROLLER HAS NO `@PreAuthorize` ANNOTATIONS!**  
> All inventory operations are open to any authenticated user, including CUSTOMER roles.

| Endpoint | Method | Permitted Role (Configured) | Request DTO | Response DTO | Implementation Status | Security / Audit Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/inventory` | `POST` | **MISSING** | `CreateInventoryDto` | `InventoryResponseDto` | IMPLEMENTED | **HIGH ISSUE:** Unprotected part creation. Should be ADMIN/MANAGER only. |
| `/api/inventory` | `GET` | **MISSING** | None | `List<InventoryResponseDto>` | IMPLEMENTED | Lists inventory items. |
| `/api/inventory/{id}` | `GET` | **MISSING** | None | `InventoryResponseDto` | IMPLEMENTED | Fetches single inventory item. |
| `/api/inventory/sku/{skuCode}` | `GET` | **MISSING** | None | `InventoryResponseDto` | IMPLEMENTED | SKU lookup. |
| `/api/inventory/{id}` | `PUT` | **MISSING** | `UpdateInventoryDto` | `InventoryResponseDto` | IMPLEMENTED | **HIGH ISSUE:** Unprotected price/stock update. |
| `/api/inventory/{id}` | `DELETE` | **MISSING** | None | Void (204) | IMPLEMENTED | **HIGH ISSUE:** Unprotected soft-delete of inventory items. |
| `/api/inventory/available` | `GET` | **MISSING** | None | `List<InventoryResponseDto>` | IMPLEMENTED | Filters available stock. |
| `/api/inventory/low_stock` | `GET` | **MISSING** | None | `List<InventoryResponseDto>` | IMPLEMENTED | Filters low stock (< 10). |
| `/api/inventory/out_of_stock` | `GET` | **MISSING** | None | `List<InventoryResponseDto>` | IMPLEMENTED | Filters out of stock (<= 0). |
| `/api/inventory/search` | `GET` | **MISSING** | Query (`keyword`) | `List<InventoryResponseDto>` | IMPLEMENTED | Search parts by keyword. |

---

## 7. Invoices & Payments (`/api/invoices`)

> [!WARNING]
> **ENTIRE INVOICE CONTROLLER HAS NO `@PreAuthorize` ANNOTATIONS!**  
> All invoice and payment endpoints are open to any authenticated user.

| Endpoint | Method | Permitted Role (Configured) | Request DTO | Response DTO | Implementation Status | Security / Audit Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/invoices/generate/job_card/{jobCardId}` | `POST` | **MISSING** | None | `InvoiceResponseDto` | IMPLEMENTED | **HIGH ISSUE:** Unprotected invoice generation. |
| `/api/invoices/{id}` | `GET` | **MISSING** | None | `InvoiceResponseDto` | IMPLEMENTED | **HIGH IDOR ISSUE:** Unprotected invoice retrieval. |
| `/api/invoices/number/{invoiceNumber}` | `GET` | **MISSING** | None | `InvoiceResponseDto` | IMPLEMENTED | Invoice lookup by number. |
| `/api/invoices/job_card/{jobCardId}` | `GET` | **MISSING** | None | `InvoiceResponseDto` | IMPLEMENTED | Invoice lookup by job card. |
| `/api/invoices` | `GET` | **MISSING** | None | `List<InvoiceResponseDto>` | IMPLEMENTED | **HIGH ISSUE:** Unprotected fetch of all invoices. |
| `/api/invoices/customer/{customerId}` | `GET` | **MISSING** | None | `List<InvoiceResponseDto>` | IMPLEMENTED | **HIGH IDOR ISSUE:** Unprotected fetch of customer invoices. |
| `/api/invoices/status/{status}` | `GET` | **MISSING** | None | `List<InvoiceResponseDto>` | IMPLEMENTED | Invoice status filter. |
| `/api/invoices/{id}/create_payment_order` | `POST` | **MISSING** | None | `CreatePaymentOrderResponseDto` | IMPLEMENTED | Creates Razorpay order ID. |
| `/api/invoices/{id}/verify_payment` | `POST` | **MISSING** | `VerifyPaymentRequestDto` | `PaymentVerificationResponseDto` | IMPLEMENTED | HMAC SHA256 signature verification. |
| `/api/invoices/{id}/simulate_payment` | `POST` | **MISSING** | None | `PaymentVerificationResponseDto` | IMPLEMENTED | **CRITICAL SECURITY ISSUE:** Bypasses Razorpay payment completely and marks invoice as PAID. Must be disabled in production! |
| `/api/invoices/{id}/download` | `GET` | **MISSING** | None | Binary PDF (`byte[]`) | IMPLEMENTED | Downloads OpenPDF invoice document. Missing ownership check. |
| `/api/invoices/stats/total_revenue` | `GET` | **MISSING** | None | Map (`"totalRevenue"`) | IMPLEMENTED | **HIGH ISSUE:** Unprotected company total revenue disclosure. |
| `/api/invoices/stats/pending_revenue` | `GET` | **MISSING** | None | Map (`"pendingRevenue"`) | IMPLEMENTED | **HIGH ISSUE:** Unprotected pending revenue disclosure. |
