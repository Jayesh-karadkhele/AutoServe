# AutoServe Platform - Automated Security Test Matrix (Part 4B)

**Date:** September 4, 2026  
**Test Suite Directory:** `backend/src/test/java/com/car_backend/security/`  
**Profile:** `test` (H2 In-Memory Database)  

---

## Executive Test Summary

| Test Class | Executed Test Scenarios | Passed | Failed | Skipped | Status |
|---|:---:|:---:|:---:|:---:|:---:|
| `AuthenticationSecurityTests` | 13 | 13 | 0 | 0 | **PASSED** |
| `UserAuthorizationTests` | 11 | 11 | 0 | 0 | **PASSED** |
| `VehicleAuthorizationTests` | 7 | 7 | 0 | 0 | **PASSED** |
| `AppointmentAuthorizationTests` | 7 | 7 | 0 | 0 | **PASSED** |
| `JobCardAuthorizationTests` | 7 | 7 | 0 | 0 | **PASSED** |
| `InventoryAuthorizationTests` | 8 | 8 | 0 | 0 | **PASSED** |
| `InvoiceAuthorizationTests` | 6 | 6 | 0 | 0 | **PASSED** |
| `AccessControlServiceTests` | 6 | 6 | 0 | 0 | **PASSED** |
| `CorsSecurityTests` | 2 | 2 | 0 | 0 | **PASSED** |
| **TOTAL** | **67** | **67** | **0** | **0** | **ALL PASSED** |

---

## Comprehensive Security Test Matrix

| # | Test Class | Target Endpoint / Method | Scenario Description | Expected Result | DB State Assertion | Actual Result |
| :-: | :--- | :--- | :--- | :---: | :---: | :---: |
| 1 | `AuthenticationSecurityTests` | `POST /api/auth/register` | Public customer registration with valid payload | `201 Created` | User count +1 | **PASSED** |
| 2 | `AuthenticationSecurityTests` | `POST /api/auth/register` | Registration payload injecting `role: "ADMIN"` | `400 Bad Request` | User count unchanged | **PASSED** |
| 3 | `AuthenticationSecurityTests` | `POST /api/auth/register` | Registration payload injecting `role: "MANAGER"` | `400 Bad Request` | User count unchanged | **PASSED** |
| 4 | `AuthenticationSecurityTests` | `POST /api/auth/register` | Registration payload injecting `role: "MECHANIC"` | `400 Bad Request` | User count unchanged | **PASSED** |
| 5 | `AuthenticationSecurityTests` | `POST /api/auth/register` | Email normalization (trim & lowercase) | `201 Created` | Email saved lowercase | **PASSED** |
| 6 | `AuthenticationSecurityTests` | `POST /api/auth/register` | Weak password rejection (< 8 chars) | `400 Bad Request` | User count unchanged | **PASSED** |
| 7 | `AuthenticationSecurityTests` | `POST /api/auth/register` | Long password rejection (> 72 chars) | `400 Bad Request` | User count unchanged | **PASSED** |
| 8 | `AuthenticationSecurityTests` | `POST /api/auth/login` | Login with incorrect password | `401 Unauthorized` | N/A | **PASSED** |
| 9 | `AuthenticationSecurityTests` | `POST /api/auth/login` | Login attempt by deactivated account (`isActive = false`) | `401 Unauthorized` | N/A | **PASSED** |
| 10 | `AuthenticationSecurityTests` | `GET /api/users/me` | Request using valid JWT of deactivated account | `401 Unauthorized` | N/A | **PASSED** |
| 11 | `AuthenticationSecurityTests` | `GET /api/users/me` | Unauthenticated request without JWT token | `401 Unauthorized` | N/A | **PASSED** |
| 12 | `AuthenticationSecurityTests` | `GET /api/users/me` | Request with malformed JWT token | `401 Unauthorized` | N/A | **PASSED** |
| 13 | `AuthenticationSecurityTests` | `GET /api/auth/me` | Unauthenticated request to `/api/auth/me` | `401 Unauthorized` | N/A | **PASSED** |
| 14 | `UserAuthorizationTests` | `GET /api/users/getUsers` | Customer attempting to list all users | `403 Forbidden` | N/A | **PASSED** |
| 15 | `UserAuthorizationTests` | `GET /api/users/getUsers` | Manager attempting to list all users | `403 Forbidden` | N/A | **PASSED** |
| 16 | `UserAuthorizationTests` | `GET /api/users/getUsers` | Mechanic attempting to list all users | `403 Forbidden` | N/A | **PASSED** |
| 17 | `UserAuthorizationTests` | `GET /api/users/getUsers` | Admin listing all users | `200 OK` | N/A | **PASSED** |
| 18 | `UserAuthorizationTests` | `POST /api/users` | Customer attempting to create staff | `403 Forbidden` | User count unchanged | **PASSED** |
| 19 | `UserAuthorizationTests` | `POST /api/users` | Admin creating `MANAGER` staff account | `201 Created` | User count +1 | **PASSED** |
| 20 | `UserAuthorizationTests` | `GET /api/users/me` | Authenticated user fetching self profile | `200 OK` | N/A | **PASSED** |
| 21 | `UserAuthorizationTests` | `PUT /api/users/me` | Customer updating profile (safe fields only) | `200 OK` | Role unchanged | **PASSED** |
| 22 | `UserAuthorizationTests` | `GET /api/users/customer/{id}` | Customer attempting to access another customer profile | `403 Forbidden` | N/A | **PASSED** |
| 23 | `UserAuthorizationTests` | `GET /api/users/managers/{id}/mechanics` | Manager viewing own team mechanics | `200 OK` | N/A | **PASSED** |
| 24 | `UserAuthorizationTests` | `GET /api/users/managers/{id}/mechanics` | Manager attempting to view another manager's team | `403 Forbidden` | N/A | **PASSED** |
| 25 | `VehicleAuthorizationTests` | `POST /api/vehicles` | Customer creating vehicle (auto-bind customerId) | `200 OK` | Vehicle count +1 | **PASSED** |
| 26 | `VehicleAuthorizationTests` | `GET /api/vehicles/me` | Customer getting self vehicles | `200 OK` | N/A | **PASSED** |
| 27 | `VehicleAuthorizationTests` | `GET /api/vehicles/{id}` | Customer viewing owned vehicle | `200 OK` | N/A | **PASSED** |
| 28 | `VehicleAuthorizationTests` | `GET /api/vehicles/{id}` | Customer attempting to view another's vehicle | `403 Forbidden` | N/A | **PASSED** |
| 29 | `VehicleAuthorizationTests` | `PUT /api/vehicles/{id}` | Customer attempting to update another's vehicle | `403 Forbidden` | Vehicle brand unchanged | **PASSED** |
| 30 | `VehicleAuthorizationTests` | `DELETE /api/vehicles/{id}` | Customer attempting to delete another's vehicle | `403 Forbidden` | Vehicle count unchanged | **PASSED** |
| 31 | `VehicleAuthorizationTests` | `GET /api/vehicles/{id}` | Admin viewing any vehicle | `200 OK` | N/A | **PASSED** |
| 32 | `AppointmentAuthorizationTests` | `POST /api/appointments` | Customer creating appointment for owned vehicle | `200 OK` | Appt count +1 | **PASSED** |
| 33 | `AppointmentAuthorizationTests` | `POST /api/appointments` | Customer attempting to book unowned vehicle | `403 Forbidden` | Appt count unchanged | **PASSED** |
| 34 | `AppointmentAuthorizationTests` | `GET /api/appointments/{id}` | Customer viewing owned appointment | `200 OK` | N/A | **PASSED** |
| 35 | `AppointmentAuthorizationTests` | `GET /api/appointments/{id}` | Customer attempting to view another's appointment | `403 Forbidden` | N/A | **PASSED** |
| 36 | `AppointmentAuthorizationTests` | `PUT /api/appointments/{id}/approve` | Customer attempting to approve appointment | `403 Forbidden` | Status remains PENDING | **PASSED** |
| 37 | `AppointmentAuthorizationTests` | `PUT /api/appointments/{id}/approve` | Assigned Manager approving appointment | `200 OK` | Status set APPROVED | **PASSED** |
| 38 | `AppointmentAuthorizationTests` | `PUT /api/appointments/{id}/approve` | Unassigned Manager attempting to approve appointment | `403 Forbidden` | Status remains PENDING | **PASSED** |
| 39 | `JobCardAuthorizationTests` | `POST /api/job_cards` | Mechanic attempting to create job card | `403 Forbidden` | JobCard count unchanged | **PASSED** |
| 40 | `JobCardAuthorizationTests` | `POST /api/job_cards` | Customer attempting to create job card | `403 Forbidden` | JobCard count unchanged | **PASSED** |
| 41 | `JobCardAuthorizationTests` | `PUT /api/job_cards/{id}/start` | Assigned Mechanic starting work | `200 OK` | Status set IN_PROGRESS | **PASSED** |
| 42 | `JobCardAuthorizationTests` | `PUT /api/job_cards/{id}/start` | Unassigned Mechanic attempting to start work | `403 Forbidden` | Status remains CREATED | **PASSED** |
| 43 | `JobCardAuthorizationTests` | `PUT /api/job_cards/{id}/complete` | Mechanic completing CREATED job before start | `400 Bad Request` | Status remains CREATED | **PASSED** |
| 44 | `JobCardAuthorizationTests` | `GET /api/job_cards/{id}` | Customer attempting to view another's job card | `403 Forbidden` | N/A | **PASSED** |
| 45 | `JobCardAuthorizationTests` | `PUT /api/job_cards/{id}/rate` | Customer attempting to rate another's job card | `403 Forbidden` | Rating unchanged | **PASSED** |
| 46 | `InventoryAuthorizationTests` | `GET /api/inventory` | Customer attempting to read inventory | `403 Forbidden` | N/A | **PASSED** |
| 47 | `InventoryAuthorizationTests` | `GET /api/inventory/search` | Customer attempting to search inventory | `403 Forbidden` | N/A | **PASSED** |
| 48 | `InventoryAuthorizationTests` | `POST /api/inventory` | Customer attempting to create inventory | `403 Forbidden` | Inventory count unchanged | **PASSED** |
| 49 | `InventoryAuthorizationTests` | `GET /api/inventory` | Mechanic reading inventory | `200 OK` | N/A | **PASSED** |
| 50 | `InventoryAuthorizationTests` | `POST /api/inventory` | Mechanic attempting to create inventory | `403 Forbidden` | Inventory count unchanged | **PASSED** |
| 51 | `InventoryAuthorizationTests` | `DELETE /api/inventory/{id}` | Manager attempting to delete inventory item | `403 Forbidden` | Inventory count unchanged | **PASSED** |
| 52 | `InventoryAuthorizationTests` | `POST /api/inventory` | Admin creating inventory item | `200 OK` | Inventory count +1 | **PASSED** |
| 53 | `InventoryAuthorizationTests` | `DELETE /api/inventory/{id}` | Admin soft-deleting inventory item | `204 No Content` | Item deleted flag set | **PASSED** |
| 54 | `InvoiceAuthorizationTests` | `GET /api/invoices/{id}` | Customer viewing owned invoice | `200 OK` | N/A | **PASSED** |
| 55 | `InvoiceAuthorizationTests` | `GET /api/invoices/{id}` | Customer attempting to view another's invoice | `403 Forbidden` | N/A | **PASSED** |
| 56 | `InvoiceAuthorizationTests` | `GET /api/invoices` | Customer attempting to list all invoices | `403 Forbidden` | N/A | **PASSED** |
| 57 | `InvoiceAuthorizationTests` | `POST /api/invoices/generate/job_card/{id}` | Mechanic attempting to generate invoice | `403 Forbidden` | Invoice count unchanged | **PASSED** |
| 58 | `InvoiceAuthorizationTests` | `POST /api/invoices/{id}/simulate_payment` | Requesting removed payment simulation endpoint | `404 Not Found` | N/A | **PASSED** |
| 59 | `InvoiceAuthorizationTests` | `GET /api/invoices/stats/total_count` | Admin viewing total invoice count | `200 OK` | N/A | **PASSED** |
| 60 | `AccessControlServiceTests` | Service: `isSelf` | Verifying owning user vs another user ID | `true` / `false` | N/A | **PASSED** |
| 61 | `AccessControlServiceTests` | Service: `canViewUser` | Verifying Admin view permissions on any user | `true` | N/A | **PASSED** |
| 62 | `AccessControlServiceTests` | Service: `ownsVehicle` & `canAccessVehicle` | Verifying vehicle ownership and participant scoping | `true` / `false` | N/A | **PASSED** |
| 63 | `AccessControlServiceTests` | Service: `ownsAppointment` & `managesAppointment` | Verifying appointment owner and assigned manager | `true` / `false` | N/A | **PASSED** |
| 64 | `AccessControlServiceTests` | Service: `ownsJobCard`, `managesJobCard`, `isAssignedMechanicForJobCard` | Verifying job card roles | `true` / `false` | N/A | **PASSED** |
| 65 | `AccessControlServiceTests` | Service: `ownsInvoice`, `managesInvoice`, `canAccessInvoice` | Verifying invoice roles | `true` / `false` | N/A | **PASSED** |
| 66 | `CorsSecurityTests` | Preflight `OPTIONS /api/auth/login` | Allowed origin `http://localhost:5173` preflight | `200 OK` (CORS headers) | N/A | **PASSED** |
| 67 | `CorsSecurityTests` | Preflight `OPTIONS /api/auth/login` | Unknown origin preflight rejection | No CORS allow header | N/A | **PASSED** |
