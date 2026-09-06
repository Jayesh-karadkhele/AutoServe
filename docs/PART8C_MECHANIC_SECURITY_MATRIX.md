# AutoServe Part 8C — Mechanic Security Matrix & IDOR Audit

## 1. Security Philosophy & Boundaries

The Mechanic Digital Workbench is built on a **Zero-Trust Access Model**:
1. **No Trusted Frontend Parameters**: The authenticated Mechanic identity is resolved strictly from the JWT `SecurityContextHolder.getContext().getAuthentication()`.
2. **Strict Ownership Control**: All backend endpoints enforce access control rules via `AccessControlService` ensuring a Mechanic can only access job cards, appointments, vehicles, and evidence assigned directly to them.
3. **No Cross-Role Elevation**: Mechanics cannot create invoices, alter inventory master data, reassign staff, view customer addresses, or access Manager/Admin financial reports.

---

## 2. Authorization Rules Matrix

| Operation / Resource | Mechanic A (Assigned) | Mechanic B (Unassigned) | Customer (Owner) | Manager (Managed Shop) | Result / Enforced Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **View Mechanic Overview** | ALLOW | ALLOW (Own data only) | DENY (`403 Forbidden`) | DENY (`403 Forbidden`) | Resolved via Security Context |
| **List Assigned Jobs (`/mechanic/me`)** | ALLOW (Own jobs) | ALLOW (Own jobs) | DENY (`403 Forbidden`) | DENY (`403 Forbidden`) | SQL scoped to `mechanic_id = authenticated_id` |
| **Get Job Card Details** | ALLOW | DENY (`403 Forbidden`) | ALLOW (Own appointment) | ALLOW (Managed shop) | `403 Forbidden` for Mechanic B |
| **Start Repair Work** | ALLOW | DENY (`403 Forbidden`) | DENY (`403 Forbidden`) | DENY (`403 Forbidden`) | State machine transition enforced |
| **Update Diagnosis & Notes** | ALLOW | DENY (`403 Forbidden`) | DENY (`403 Forbidden`) | DENY (`403 Forbidden`) | Enforced in `JobCardServiceImpl` |
| **Add Job Item (Parts Usage)** | ALLOW | DENY (`403 Forbidden`) | DENY (`403 Forbidden`) | DENY (`403 Forbidden`) | Stock validated & transaction locked |
| **Upload Repair Evidence** | ALLOW | DENY (`403 Forbidden`) | DENY (`403 Forbidden`) | DENY (`403 Forbidden`) | MIME & size validated; Cloudinary mock |
| **Complete Job Card** | ALLOW | DENY (`403 Forbidden`) | DENY (`403 Forbidden`) | DENY (`403 Forbidden`) | Readiness validation enforced |
| **Create / Pay Invoice** | DENY (`403`) | DENY (`403`) | DENY (`403`) | ALLOW (Manager only) | `403 Forbidden` for Mechanic |
| **Edit Inventory Master Data** | DENY (`403`) | DENY (`403`) | DENY (`403`) | ALLOW (Manager only) | `403 Forbidden` for Mechanic |
| **View Customer Address** | DENY | DENY | ALLOW (Self) | ALLOW (Manager) | Customer address redacted for Mechanic |

---

## 3. Real-ID IDOR Verification Test Cases

The backend security suite (`MechanicAuthorizationTests.java`) verifies the following 26 real-database IDOR rules:

1. `mechanicA_canListOwnJobs` -> `200 OK`
2. `mechanicA_cannotListMechanicBJobs` -> `403 Forbidden` / Scoped SQL
3. `mechanicA_canOpenAssignedJob` -> `200 OK`
4. `mechanicA_receives403ForMechanicBJob` -> `403 Forbidden`
5. `mechanicA_canStartAssignedJob` -> `200 OK` (Status -> `IN_PROGRESS`)
6. `mechanicA_cannotStartMechanicBJob` -> `403 Forbidden`
7. `mechanicA_canUpdateDiagnosisOnOwnJob` -> `200 OK`
8. `mechanicA_cannotUpdateDiagnosisOnMechanicBJob` -> `403 Forbidden`
9. `mechanicA_canAddPartToActiveJob` -> `200 OK` (Stock decremented)
10. `mechanicA_cannotAddPartToMechanicBJob` -> `403 Forbidden`
11. `insufficientStock_isRejected` -> `400 Bad Request`
12. `concurrentPartConsumption_cannotCreateNegativeStock` -> Transaction abort / `@Version` retry
13. `browserProvidedPriceManipulation_isIgnored` -> Price loaded strictly from Inventory entity (`BigDecimal`)
14. `mechanicA_canUploadEvidenceToOwnJob` -> `200 OK` (`EvidenceType` persisted)
15. `mechanicA_cannotUploadEvidenceToMechanicBJob` -> `403 Forbidden`
16. `invalidFileType_isRejected` -> `400 Bad Request` (Non-image/video rejected)
17. `oversizedFile_isRejected` -> `400 Bad Request` (>10MB rejected)
18. `customer_canViewPermittedEvidenceForOwnJob` -> `200 OK`
19. `customer_cannotViewOtherCustomerEvidence` -> `403 Forbidden`
20. `manager_canViewEvidenceForManagedJob` -> `200 OK`
21. `unrelatedManager_receives403ForEvidence` -> `403 Forbidden`
22. `mechanic_cannotCreateInvoice` -> `403 Forbidden`
23. `mechanic_cannotAccessManagerReports` -> `403 Forbidden`
24. `deactivatedMechanic_receives401` -> `401 Unauthorized`
25. `loggedOutMechanicToken_isRejected` -> `401 Unauthorized`
26. `wrongRoleFrontendNavigation_isBlocked` -> `ForbiddenPage` rendered (`403 Forbidden`)
