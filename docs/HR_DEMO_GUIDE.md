# AutoServe — HR & Portfolio Evaluator Demo Guide

Welcome to AutoServe! This guide explains how to quickly demonstrate and evaluate the AutoServe platform across all four user roles, both on the live Vercel deployment and local environments.

---

## 🌐 Live Production URL & Access Hints

- **Live Production URL**: [https://frontend-blond-two-c2ltwous72.vercel.app](https://frontend-blond-two-c2ltwous72.vercel.app)
- **Local Dev URL**: `http://localhost` (or `http://localhost:5173`)

Select the target role card on the login screen and enter any valid email format with the corresponding portfolio access password:

| Target Role | Role Card Selection | Portfolio Access Password Hint | Key Features to Inspect |
|---|---|---|---|
| **Customer** | Customer Card | Use registered account or create new | Book Appointment, Request RSA, Track Job, View Evidence, Pay Invoice, Rate Service |
| **Service Manager** | Service Manager Card | `manager0521` | Claim Pending Queue (Atomic Lock), Approve Appointments, Assign Mechanics, Add Parts, Invoice Generation |
| **Mechanic** | Mechanic Card | `Mech0521` | Workload Dashboard, Start/Complete Jobs, Upload Diagnostic Evidence Photos, Parts Consumption Log |
| **Administrator** | Administrator Card | `ad0521` | System Stats, Create Manager/Mechanic Accounts, Inventory Control, Global Audit Logs |

---

## 🔄 Step-by-Step Complete Service Lifecycle Walkthrough

### Step 1: Customer Books a Service Appointment
1. Log in as Customer (or register a new customer account).
2. Navigate to **Vehicles** and add a vehicle (e.g. `KA-05-MA-2026`, Toyota Camry).
3. Click **Book Service**, select Category (e.g. *Periodic Maintenance*), add description and date, then submit.
4. Appointment status is initially `PENDING`.

### Step 2: Service Manager Claims & Approves Appointment
1. Log in as Service Manager (`manager0521`).
2. Go to **Pending Appointments Queue**.
3. Click **Claim Appointment** (executes atomic `PESSIMISTIC_WRITE` lock).
4. Click **Approve Appointment** and assign an available Mechanic (e.g., `Mech0521`).
5. Job Card is created automatically with status `CREATED`.

### Step 3: Mechanic Executes Repairs & Uploads Diagnostic Evidence
1. Log in as Mechanic (`Mech0521`).
2. Open assigned Job Card under **Active Workload**.
3. Click **Start Repair Work** (status changes to `IN_PROGRESS`).
4. Click **Upload Diagnostic Evidence** to attach repair photos or inspection notes.
5. Log consumed spare parts (e.g., Brake Pads, Synthetic Oil).
6. Click **Mark Service Complete** (status changes to `COMPLETED`).

### Step 4: Manager Generates Final Invoice & Customer Completes Payment
1. Log in as Service Manager (`manager0521`).
2. Open Job Card and click **Generate Invoice**.
3. Log in as Customer, open **Invoices**, and view itemized cost breakdown.
4. Click **Pay Invoice** (launches Razorpay Test Mode gateway).
5. Click **Download PDF** for official invoice receipt and rate the service (5 stars).
