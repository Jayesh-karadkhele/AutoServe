# AutoServe Part 6C — Four-Role Platform Experience

## 1. Section Overview

The `#roles` section (`ONE PLATFORM. FOUR FOCUSED WORKSPACES.`) provides an accessible workspace preview for each of AutoServe's four core user roles:

1. **Customer**: Vehicle Care Portal. Personal vehicle profile, active service timeline, latest repair evidence, itemized invoice, and one-click booking.
2. **Manager**: Workshop Operations Desk. Today's appointment queue, unassigned requests, mechanic availability, evidence review, and invoice readiness.
3. **Mechanic**: Technical Execution View. Assigned job cards, diagnostic checklists, requisitioned parts, and evidence photo/video upload.
4. **Admin**: Platform Control Center. User governance, staff account provisioning, RBAC role matrix, inventory stock levels, and system health status.

## 2. Permanent Labeling & Focused Access Rules

- Every workspace preview contains a permanent badge: `Illustrative interface preview` to clarify that previews are non-live connected mockups.
- Each role includes a compact `Focused Access` panel detailing 3 representative allowed actions and 1-2 restricted operational boundaries (strictly aligned with Spring Security RBAC backend rules).

## 3. Accessible Role Selector (`RoleSelector.tsx`)

- Implements WAI-ARIA `tablist`, `tab`, and `tabpanel` pattern.
- Keyboard navigation supports `ArrowLeft`, `ArrowRight`, `Home`, and `End` keys.
- Fully focusable with visible focus rings (`focus-visible:ring-2`).
