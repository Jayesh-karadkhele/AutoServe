# AutoServe Part 8C — Mechanic Digital Workbench Workflow Guide

## 1. Overview & Operational Principles

The **Mechanic Digital Workbench** is designed specifically for shop-floor tablet and touch interaction. It eliminates administrative noise and presents the mechanic with a clear, step-by-step workflow for executing vehicle repairs, consuming inventory, uploading evidence, and completing assigned work.

---

## 2. Mechanic Workflow Lifecycle

```
[1. Today's Workbench Overview]
               |
               v
[2. Assigned-Job Queue & Filters] -> Select Active Job Card
               |
               v
[3. Digital Workbench Header & Customer Concern]
               |
               v
[4. Start Work Action] -------------> Job Status -> IN_PROGRESS
               |
               v
[5. Diagnosis & Repair Notes] ------> Persist Technical Notes & Summary
               |
               v
[6. Parts Usage & Stock Audit] ----> Transactional Inventory Consumption (optimistic locking & snapshot pricing)
               |
               v
[7. Multi-Stage Evidence Upload] ---> Upload Before/During/After Repair Media with Metadata (Cloudinary)
               |
               v
[8. Completion Readiness Audit] ----> Validate Minimum Notes, Parts & Evidence
               |
               v
[9. Submit / Complete Job] ---------> Job Status -> COMPLETED / REVIEW_PENDING
               |
               v
[10. Read-Only Job Archive] --------> Historical Completed Job History
```

---

## 3. Detailed Workflow Steps

### Step 1: Dashboard & Active Job Identification
- Mechanic views key metrics: Active Job, Jobs Assigned Today, In Progress, Ready for Completion, Completed Today.
- Primary CTA (`Open Current Job` / `Start Next Job`) directs mechanic straight into active work without multi-click navigation.

### Step 2: Assigned Job Queue & Search
- Paginated, filterable queue showing vehicle registration, customer complaint summary, assigned time, and current workflow status.
- **Strict Isolation**: Mechanic sees only jobs assigned to their own user ID.

### Step 3: Work Execution & Status Transition
- Mechanic reviews vehicle details (Make, Model, Registration) and reported customer concern.
- Clicks `Start Repair Work` to move job to `IN_PROGRESS`.

### Step 4: Technical Diagnosis & Labour Notes
- Mechanic enters technical diagnosis findings, repair procedures performed, and follow-up recommendations.
- Saved directly to the backend database with timestamp and author validation.

### Step 5: Transactional Parts Usage
- Mechanic searches active inventory for replacement parts (e.g. Brake Pads, Synthetic Oil).
- Enters quantity; backend checks available stock, applies optimistic locking `@Version`, records price snapshot using `BigDecimal`, and decrements stock.
- Removing a part transactionally restores stock to inventory.

### Step 6: Multi-Stage Evidence Collection
- Mechanic selects evidence type (`DIAGNOSIS`, `BEFORE_REPAIR`, `DURING_REPAIR`, `AFTER_REPAIR`, `COMPLETION`).
- Drag-and-drops or uploads images/media.
- Server validates MIME type, size limit, sanitizes filename, uploads to Cloudinary, and persists metadata (`evidenceType`, `mediaType`, `originalFilename`, `uploaderId`).

### Step 7: Completion Validation & Handoff
- Workbench checks completion readiness:
  - Work started (`IN_PROGRESS`)
  - Technical diagnosis present
  - Repair notes present
  - Parts usage reconciled
  - Completion evidence attached
- Mechanic submits job to `COMPLETED` / `REVIEW_PENDING`.
- Job moves to the read-only Completed Jobs history.
