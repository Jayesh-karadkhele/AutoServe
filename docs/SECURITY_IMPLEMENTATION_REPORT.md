# AutoServe Platform - Security Implementation Report (Part 4)

**Date:** September 4, 2026  
**Auditor/Engineer:** Principal Spring Security Engineer  
**Branch:** `security/rbac-hardening`  
**Status:** ALL VULNERABILITIES RESOLVED (Part 4 Baseline Enforced)  

---

## 1. Vulnerability & Remediation Status Summary

| # | Vulnerability Description | Initial Risk Level | Status | Remediation Summary & Code Location |
| :-: | :--- | :---: | :---: | :--- |
| 1 | Public registration accepts privileged roles (`Role.ADMIN`, `Role.MANAGER`). | **CRITICAL** | **FIXED** | [RegisterRequestDto.java](file:///c:/Users/HP/Desktop/Projets/AutoServe-main/backend/src/main/java/com/car_backend/dto/auth/RegisterRequestDto.java) stripped internal fields. [AuthServiceImpl.java](file:///c:/Users/HP/Desktop/Projets/AutoServe-main/backend/src/main/java/com/car_backend/service/auth/AuthServiceImpl.java) strictly enforces `Role.CUSTOMER` and `isActive = true`. Unknown fields in JSON are rejected with HTTP 400. |
| 2 | Inactive users (`isActive = false`) can authenticate and receive JWTs. | **HIGH** | **FIXED** | [CustomUserDetailsService.java](file:///c:/Users/HP/Desktop/Projets/AutoServe-main/backend/src/main/java/com/car_backend/security/service/CustomUserDetailsService.java) sets `.disabled(!user.isActive())`. [JwtAuthenticationFilter.java](file:///c:/Users/HP/Desktop/Projets/AutoServe-main/backend/src/main/java/com/car_backend/security/jwt/JwtAuthenticationFilter.java) validates `userDetails.isEnabled()` on every request. |
| 3 | Payment simulation endpoint permits marking arbitrary invoices `PAID`. | **CRITICAL** | **FIXED** | Removed `POST /api/invoices/{id}/simulate_payment` from [InvoiceController.java](file:///c:/Users/HP/Desktop/Projets/AutoServe-main/backend/src/main/java/com/car_backend/controller/InvoiceController.java). Requests to this route return HTTP 404 Not Found. |
| 4 | Controllers and endpoints missing `@PreAuthorize` (unprotected routes). | **CRITICAL** | **FIXED** | Enabled `@EnableMethodSecurity` in [SecurityConfig.java](file:///c:/Users/HP/Desktop/Projets/AutoServe-main/backend/src/main/java/com/car_backend/security/config/SecurityConfig.java). Added `@PreAuthorize` across all 6 main controllers (`UserController`, `VehicleController`, `AppointmentController`, `JobCardController`, `InventoryController`, `InvoiceController`). |
| 5 | ID-based endpoints lack resource ownership verification (IDOR). | **HIGH** | **FIXED** | Created [AccessControlService.java](file:///c:/Users/HP/Desktop/Projets/AutoServe-main/backend/src/main/java/com/car_backend/security/service/AccessControlService.java) and [CurrentUserService.java](file:///c:/Users/HP/Desktop/Projets/AutoServe-main/backend/src/main/java/com/car_backend/security/service/CurrentUserService.java). Enforced ownership checks for Customer, Manager, and Mechanic across services and SpEL expressions. |
| 6 | Managers can access or assign mechanics outside reporting team. | **HIGH** | **FIXED** | [AccessControlServiceImpl.java](file:///c:/Users/HP/Desktop/Projets/AutoServe-main/backend/src/main/java/com/car_backend/security/service/AccessControlServiceImpl.java) and [JobCardServiceImpl.java](file:///c:/Users/HP/Desktop/Projets/AutoServe-main/backend/src/main/java/com/car_backend/service/JobCardServiceImpl.java) validate `mechanic.getManager().getId().equals(managerId)`. |
| 7 | Mechanics can start/complete unassigned work or create job cards. | **HIGH** | **FIXED** | Restricted job card creation to Manager/Admin in [JobCardController.java](file:///c:/Users/HP/Desktop/Projets/AutoServe-main/backend/src/main/java/com/car_backend/controller/JobCardController.java). `startWork` and `completeWork` check `@accessControlService.isAssignedMechanicForJobCard(#id)`. |
| 8 | CORS uses wildcard pattern (`*`) allowing arbitrary origins. | **HIGH** | **FIXED** | Configured environment-driven CORS in [SecurityConfig.java](file:///c:/Users/HP/Desktop/Projets/AutoServe-main/backend/src/main/java/com/car_backend/security/config/SecurityConfig.java) using `CORS_ALLOWED_ORIGINS` (defaults to `http://localhost:5173`). Wildcard `*` cannot be combined with credentials. |
| 9 | Authentication & access failures return inconsistent responses or stack traces. | **MEDIUM** | **FIXED** | Created [CustomAuthenticationEntryPoint.java](file:///c:/Users/HP/Desktop/Projets/AutoServe-main/backend/src/main/java/com/car_backend/security/config/CustomAuthenticationEntryPoint.java) (HTTP 401) and [CustomAccessDeniedHandler.java](file:///c:/Users/HP/Desktop/Projets/AutoServe-main/backend/src/main/java/com/car_backend/security/config/CustomAccessDeniedHandler.java) (HTTP 403) returning standardized JSON bodies. |
| 10 | JWT filter contains `System.out.println`, `e.printStackTrace()`, and token dumps. | **LOW** | **FIXED** | Cleaned [JwtAuthenticationFilter.java](file:///c:/Users/HP/Desktop/Projets/AutoServe-main/backend/src/main/java/com/car_backend/security/jwt/JwtAuthenticationFilter.java). All console prints removed; safe logging added via Slf4j without credential text. |

---

## 2. AccessControlService & CurrentUserService Architecture

### `CurrentUserService`
- `getAuthenticatedUser()`: Retrieves `User` entity from `SecurityContextHolder`. Throws `UnauthorizedException` if unauthenticated or inactive.
- `getUserId()`, `getEmail()`, `getRole()`, `isAuthenticated()`.

### `AccessControlService` (`@Service("accessControlService")`)
- Encapsulates domain ownership and scope rules for Spring Security SpEL expressions (`@PreAuthorize("@accessControlService.canAccessJobCard(#id)")`):
  - `isSelf(userId)`
  - `ownsVehicle(vehicleId)`, `canAccessVehicle(vehicleId)`
  - `ownsAppointment(appointmentId)`, `canAccessAppointment(appointmentId)`, `managesAppointment(appointmentId)`, `isAssignedMechanicForAppointment(appointmentId)`
  - `ownsJobCard(jobCardId)`, `managesJobCard(jobCardId)`, `isAssignedMechanicForJobCard(jobCardId)`, `canAccessJobCard(jobCardId)`
  - `ownsInvoice(invoiceId)`, `managesInvoice(invoiceId)`, `canAccessInvoice(invoiceId)`
  - `mechanicReportsToCurrentManager(mechanicId)`

---

## 3. Password Policy Specification

Enforced on `RegisterRequestDto` and `CreateStaffDto`:
- **Length:** Minimum 8 characters, maximum 72 characters (BCrypt safe).
- **Complexity Regex:** `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,72}$`
  - At least 1 lowercase letter
  - At least 1 uppercase letter
  - At least 1 number
  - At least 1 special character
- **Whitespace:** Reject blank or whitespace-only inputs (`@NotBlank`).
- **Data Protection:** Passwords encoded with `BCryptPasswordEncoder` prior to persistence. Excluded from all response DTOs and log output.
