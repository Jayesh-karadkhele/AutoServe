# AutoServe Part 8C — Mechanic API Matrix

## Internal API Specification & Security Mapping

This document details all API endpoints utilized or introduced in Part 8C for the Mechanic Digital Workbench.

| Screen Action | HTTP Method | Endpoint | Request DTO | Response DTO | Required Role | Ownership Rule | Status-Transition Rule | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Get Overview** | `GET` | `/api/mechanic/dashboard/overview` | None | `MechanicOverviewDto` | `ROLE_MECHANIC` | Resolved from `SecurityContext` (Authenticated Mechanic) | N/A | **Implemented** |
| **Get Assigned Jobs** | `GET` | `/api/job_cards/mechanic/me` | Query params (page, size, status, search) | `Page<JobCardDto>` | `ROLE_MECHANIC` | Authenticated Mechanic ID match only | N/A | **Implemented** |
| **Get Job Detail** | `GET` | `/api/job_cards/{id}` | None | `JobCardDto` | `ROLE_MECHANIC` / `ROLE_MANAGER` / `ROLE_ADMIN` | Mechanic must be assigned to `jobCard.mechanic.id` | N/A | **Implemented** |
| **Start Repair Work** | `PUT` | `/api/job_cards/{id}/start` | None | `JobCardDto` | `ROLE_MECHANIC` | Authenticated Mechanic must be assigned to Job | `SCHEDULED` / `IN_PROGRESS` -> `IN_PROGRESS` | **Implemented** |
| **Update Diagnosis & Notes** | `PUT` | `/api/job_cards/{id}/diagnosis` | `UpdateDiagnosisDto` | `JobCardDto` | `ROLE_MECHANIC` | Authenticated Mechanic must be assigned to Job | Active job (`IN_PROGRESS`) | **Implemented** |
| **Add Part to Job** | `POST` | `/api/job_cards/{id}/items` | `AddJobCardItemDto` | `JobCardItemDto` | `ROLE_MECHANIC` | Authenticated Mechanic must be assigned to Job | Active job (`IN_PROGRESS`); Stock must be sufficient | **Implemented** |
| **Remove Part from Job** | `DELETE` | `/api/job_cards/{id}/items/{itemId}` | None | `Void` | `ROLE_MECHANIC` | Authenticated Mechanic must be assigned to Job | Active job (`IN_PROGRESS`); Transactional stock restoration | **Implemented** |
| **Upload Repair Evidence** | `POST` | `/api/job_cards/{id}/evidence` | `MultipartFile`, `evidenceType`, `mechanicNote` | `JobCardEvidenceDto` | `ROLE_MECHANIC` | Authenticated Mechanic must be assigned to Job | Active job (`IN_PROGRESS`); MIME & size validated | **Implemented** |
| **Complete Job** | `PUT` | `/api/job_cards/{id}/complete` | `CompleteJobCardDto` | `JobCardDto` | `ROLE_MECHANIC` | Authenticated Mechanic must be assigned to Job | `IN_PROGRESS` -> `COMPLETED` / `REVIEW_PENDING` | **Implemented** |
| **Get Completed Jobs** | `GET` | `/api/job_cards/mechanic/me?status=COMPLETED` | Query params (page, size) | `Page<JobCardDto>` | `ROLE_MECHANIC` | Authenticated Mechanic ID match only | Read-Only | **Implemented** |
| **Get Mechanic Profile** | `GET` | `/api/mechanic/profile` | None | `UserResponseDto` | `ROLE_MECHANIC` | Resolved from `SecurityContext` | N/A | **Implemented** |
| **Update Self Profile** | `PUT` | `/api/mechanic/profile` | `UpdateProfileDto` | `UserResponseDto` | `ROLE_MECHANIC` | Self profile update only (role/salary immutable) | N/A | **Implemented** |
