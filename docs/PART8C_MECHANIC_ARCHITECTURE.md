# AutoServe Part 8C — Mechanic Architecture & Domain Model

## 1. Executive Summary

AutoServe Part 8C introduces the **Mechanic Digital Workbench**, a tablet-first, secure job execution platform designed specifically for auto repair mechanics. The architecture prioritizes active job progression, transactional parts consumption, persisted multi-stage repair evidence metadata, and strict security boundary enforcement preventing IDOR and unauthorized cross-mechanic data access.

---

## 2. Component Architecture

```
+-----------------------------------------------------------------------+
|                       React / TypeScript Workbench                    |
|  - Tablet-First Digital Workbench Shell (MechanicShell.tsx)           |
|  - Route Guards & RBAC (ProtectedMechanicRoute)                       |
|  - Responsive Stepper & Work Progress Tracker                         |
|  - Modal Components (PartUsageModal, EvidenceUploadModal)             |
+-----------------------------------------------------------------------+
                                   |
                             REST / JSON APIs
                                   v
+-----------------------------------------------------------------------+
|                      Spring Boot Security & Service                   |
|  - MechanicController & JobCardController                             |
|  - SecurityContextHolder user resolution (NO trusted frontend IDs)     |
|  - AccessControlService (Mechanic job card & appointment ownership)   |
|  - JobCardServiceImpl (Transactional status transitions & evidence)   |
|  - MechanicServiceImpl (Overview metrics & active work calculation)   |
|  - CloudinaryService (MIME validation, sanitization, evidence upload) |
+-----------------------------------------------------------------------+
                                   |
                             JPA / Hibernate
                                   v
+-----------------------------------------------------------------------+
|                       Relational Persistence                          |
|  - JobCard, JobCardItem, JobCardEvidence                              |
|  - Inventory (Optimistic Locking @Version, BigDecimal pricing)        |
|  - Flyway Schema (V1 -> V5 -> V6 Mechanic workbench & evidence meta)  |
+-----------------------------------------------------------------------+
```

---

## 3. Key Entities & Domain Schema

### 3.1 `JobCardEvidence`
- **Fields**:
  - `id`: Long (PK)
  - `jobCard`: JobCard (FK)
  - `evidenceType`: `EvidenceType` enum (`REPORTED`, `DIAGNOSIS`, `BEFORE_REPAIR`, `DURING_REPAIR`, `AFTER_REPAIR`, `COMPLETION`) [NEW V6]
  - `mediaType`: String ("image/jpeg", "image/png", etc.) [NEW V6]
  - `mediaUrl`: String (Cloudinary secure HTTPS URL)
  - `originalFilename`: String [NEW V6]
  - `uploaderId`: Long (FK to `users`) [NEW V6]
  - `mechanicNote`: Text
  - `uploadedAt`: LocalDateTime

### 3.2 `JobCardItem`
- **Fields**:
  - `id`: Long (PK)
  - `jobCard`: JobCard (FK)
  - `inventory`: Inventory (FK)
  - `quantity`: Integer (Positive non-zero validation)
  - `unitPrice`: BigDecimal (Snapshot pricing from Inventory backend entity)
  - `totalPrice`: BigDecimal (Calculated: `unitPrice * quantity`)

### 3.3 `Inventory`
- **Fields**:
  - `id`: Long (PK)
  - `partName`: String
  - `partNumber`: String
  - `quantityInStock`: Integer (Optimistic locking guarded)
  - `unitPrice`: BigDecimal
  - `version`: Long (`@Version` concurrency control)

---

## 4. Flyway Schema Evolution (V6)

`V6__mechanic_workbench_and_evidence_metadata.sql`:
- Extends `job_card_evidence` table with explicit metadata: `evidence_type`, `media_type`, `original_filename`, `uploader_id`.
- Adds performance indexes:
  - `idx_job_card_evidence_type` on `job_card_evidence(evidence_type)`
  - `idx_job_cards_mechanic_status` on `job_cards(mechanic_id, status)`
  - `idx_job_cards_assigned_date` on `job_cards(assigned_date)`

---

## 5. Architectural Capability Status

| Capability | Status | Implementation Details |
| :--- | :--- | :--- |
| Tablet-First Digital Workbench UI | **Implemented** | Built with responsive cyan/ivory color scheme, large touch targets, stepper component. |
| Security Context Resolution | **Implemented** | Resolved via JWT SecurityContext; zero trust of frontend-supplied user IDs. |
| Evidence Metadata & Type | **Implemented** | Persisted via V6 migration & `EvidenceType` enum (`REPORTED`, `DIAGNOSIS`, etc.). |
| Transactional Parts Consumption | **Implemented** | `@Transactional` isolation, optimistic stock locking, backend price snapshotting (`BigDecimal`). |
| Multi-Stage Job Transitions | **Implemented** | Restricted state machine enforcing assigned Mechanic ownership. |
| Cloudinary Evidence Upload | **Implemented** | Server-side MIME validation, safe sanitization, mock test coverage. |
| Real-Time WebSockets / Chat | **Deferred** | Out of scope for Part 8C (planned for Part 8D). |
| Mechanic Invoice Creation | **Unsupported** | Restricted to Manager/Admin per RBAC security matrix. |
