# AutoServe Part 6D — Roadside Assistance & Product Credibility

## 1. Roadside Assistance Planned Experience (`#roadside-assistance`)

The Roadside Assistance section details the planned emergency vehicle care workflow.

### Product-Truth Safeguards
- **Permanent Badge**: `Planned capability preview` badge is permanently visible on desktop and mobile and does not disappear when switching stages.
- **Scope Limits**: No claims of live GPS tracking, real driver dispatch, towing networks, medical emergency, or police dispatch.
- **Illustrative Estimates**: All time and distance indicators are explicitly labeled `Illustrative estimate`.

### Code-Native SVG Map (`RoadsideMapPreview.tsx`)
- Abstract city grid geometry rendering customer vehicle location marker (`2022 Porsche Taycan 4S`), AutoServe assistance point marker (`Metro Hub`), and route preview line.
- Accessible SVG label: `Planned Roadside Assistance SVG Route Map`.
- Reduced-motion mode renders complete static route immediately without continuous animation loop.

### 5 Planned RSA Stages
1. **Request Help**: Emergency request logged.
2. **Confirm Location**: Coordinates and landmark confirmed.
3. **Review Assistance Type**: Flat Tyre, Battery Jumpstart, Breakdown, or Towing selected.
4. **Track Planned Dispatch**: En-route simulation on city geometry.
5. **Confirm Resolution**: Assistance completed and archived into vehicle history.

---

## 2. Product Credibility & Trust (`#trust`)

The Trust section highlights AutoServe's core operational governance principles without marketing hype or fake metrics.

### Four Credibility Principles
1. **Controlled Access**: Role-based access control (RBAC) scope for Customers, Managers, Mechanics, and Admins.
2. **Documented Work**: Job progress, diagnostic notes, and evidence vault linked to job card.
3. **Precise Billing**: Itemized parts, labor, discounts, and GST represented using precise monetary values.
4. **Connected History**: Appointments, job cards, evidence, and invoices forming a retained service record.

### End-to-End Operational Traceability Flow (`ServiceRecordTrace.tsx`)
- Demonstrates data accumulation across stages: `Appointment` → `Job Card` → `Evidence` → `Invoice` → `Service History`.
- Uses consistent reference identifier `Record #AS-260884`.

---

## 3. Product-Truth Compliance Summary

Prohibited marketing terms strictly avoided across codebase:
- ❌ "Bank-grade security"
- ❌ "Military-grade encryption"
- ❌ "100% secure"
- ❌ "Tamper-proof"
- ❌ "PCI compliant"
- ❌ "ISO certified"
- ❌ Fake ratings, reviews, awards, or customer counts
