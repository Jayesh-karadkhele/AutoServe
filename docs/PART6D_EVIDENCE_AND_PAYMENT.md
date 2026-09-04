# AutoServe Part 6D — Repair Evidence & Transparent Payment Architecture

## 1. Repair Evidence Experience (`#repair-evidence`)

The Repair Evidence section provides visual proof at every stage of the service lifecycle, connected directly to job card `AS-JC-260884`.

### Key Features
- **Permanent Labeling**: Prominently marked with `Illustrative interface preview`.
- **4 Repair Stages**: `Reported`, `Diagnosed`, `In progress`, and `Verified`. Switching stages updates technician diagnostic notes, manager review state, evidence timestamps, and status markers.
- **Before-and-After Comparison (`EvidenceComparison.tsx`)**: Accessible interactive component featuring native range input slider + dual button controls (`View before`, `View after`, `Compare`) + native keyboard arrow support without double-stepping.
- **Evidence Integrity Copy**: Clarifies that evidence remains linked to the service record for full context before completion.

---

## 2. Transparent Payment Experience (`#transparent-payment`)

The Transparent Payment section renders an itemized billing statement and payment lifecycle preview for invoice `AS-INV-260884`.

### Key Features
- **Permanent Labeling**: Marked as `Illustrative invoice`.
- **Indian Currency Formatting**: All monetary values formatted via `Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" })` (e.g. `₹12,450.00` subtotal + 18% GST = `₹14,691.00` total).
- **Line Cost Explainer (`InvoiceLineExplainer.tsx`)**: Expandable rows with `aria-expanded` and `aria-controls` explaining line items, calculations, and stage origins.
- **Safe Invoice Preview**: Features a `Preview invoice` action button rendering an in-browser modal view. No fake PDF downloading or fake backend requests.
- **Payment Status Path (`PaymentStatusPath.tsx`)**: 5-step journey sequence with interactive status progression (`Created` → `Provider opened` → `Verification pending` → `Paid (Illustrative Preview)`). Default state is strictly `Created`.
- **Mandatory Payment Disclaimer**: `Payment interaction preview — no transaction will be created.`
- **Network Safety**: Zero network API requests (`fetch`/`axios`) triggered during interaction, verified by automated unit tests.
