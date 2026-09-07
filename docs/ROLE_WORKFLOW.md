# AutoServe — Four-Role Workflow Specification

## 1. Customer Workflow
1. **Account Registration / Login**:
   - Customers register via public `/register` form or log in via `/login`.
   - Access persistent vehicles and booking history.
2. **Vehicle Management**:
   - Add vehicles with registration number, make, model, year, and fuel type.
3. **Appointment Booking**:
   - Schedule appointment with service category, description, preferred date, and image attachment.
   - Request emergency Roadside Assistance (RSA) with location coordinates & description.
4. **Service Tracking & Inspection**:
   - View live job status (Pending -> Approved -> Created -> In Progress -> Completed).
   - Review diagnostic evidence uploaded by mechanics.
   - Live chat with assigned Service Manager / Mechanic.
5. **Invoice & Payment**:
   - Review itemized cost breakdown (parts + labor + tax).
   - Complete payment online via Razorpay or simulated gateway.
   - Download official PDF invoice and rate service quality (1-5 stars).

## 2. Service Manager Workflow
1. **Appointment Queue & Atomic Claiming**:
   - View unassigned pending appointments in `/api/appointments/manager/pending`.
   - Atomically claim appointment (`POST /api/appointments/{id}/claim`) with `PESSIMISTIC_WRITE` database locking.
2. **Job Card Generation & Mechanic Assignment**:
   - Approve appointment and create official Job Card.
   - Assign mechanic from team workload roster.
3. **Parts & Labor Management**:
   - Add/remove inventory parts and custom labor line items.
4. **Invoice Verification & Customer Support**:
   - Generate finalized invoice upon job completion.
   - Manage team workload, review mechanic progress, and communicate with customers.

## 3. Mechanic Workflow
1. **Assigned Workload Dashboard**:
   - View active job cards assigned to current mechanic (`/api/job_cards/mechanic/me`).
2. **Job Execution Lifecycle**:
   - Transition status from `CREATED` -> `IN_PROGRESS` -> `COMPLETED`.
3. **Diagnostic Evidence Upload**:
   - Upload repair photos and inspection notes for customer transparency.
4. **Inventory Usage**:
   - Log parts consumed during repair directly into job card.
5. **Communication**:
   - Send real-time updates and clarification messages to customer/manager via job chat.

## 4. Administrator Workflow
1. **System Provisioning & Staff Management**:
   - Create and manage Service Manager and Mechanic staff accounts (`/api/users/staff`).
   - Assign Mechanics to specific Service Managers.
2. **Global Inventory Control**:
   - Add, update, and manage spare parts stock, SKU codes, pricing, and reorder thresholds.
3. **Financial & Operational Auditing**:
   - Monitor total platform revenue, job volume, active RSA requests, and audit logs.
   - Review global payment attempts and system configuration.
