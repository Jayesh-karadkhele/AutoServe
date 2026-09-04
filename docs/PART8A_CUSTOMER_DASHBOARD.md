# AutoServe Part 8A — Customer Dashboard Documentation

## Overview
AutoServe Part 8A introduces the complete Customer Service Dashboard and live backend integration. It empowers vehicle owners to manage their garage, book appointments, track active servicing in real time, inspect transparent repair evidence, view itemized INR invoices, and manage profile settings.

## Application Architecture & Shell
- **Responsive Application Shell (`CustomerShell.tsx`)**:
  - Features an Ivory (`#FAF9F6`) canvas, sleek white surfaces, crisp charcoal text, fine automotive grid lines, and cyan accent states.
  - Desktop view incorporates a collapsible sidebar with AutoServe branding, breadcrumbs, user role indicator, profile dropdown, and explicit session logout/logout-all triggers.
  - Mobile view features a compact top bar with accessible drawer navigation, touch-friendly navigation items (minimum 44×44px), and zero horizontal scroll overflow.
- **Route Authorization (`ProtectedRoute.tsx`)**:
  - Enforces `allowedRoles={['CUSTOMER']}` on all 12 Customer sub-routes.
  - Redirects anonymous users to `/login` and non-Customer authenticated users (MANAGER, MECHANIC, ADMIN) to `/forbidden` or role landing pages.

## Customer Route Specifications

| Route Path | View Component | Core Capability |
| ---------- | -------------- | --------------- |
| `/customer/dashboard` | `CustomerDashboardPage` | Overview answering 6 core vehicle questions within 10 seconds. |
| `/customer/vehicles` | `VehicleListPage` | Grid & table listing all customer-owned vehicles from `GET /api/vehicles/me`. |
| `/customer/vehicles/new` | `AddVehiclePage` | Registration form with uppercase normalization and duplicate detection. |
| `/customer/vehicles/:vehicleId` | `VehicleDetailPage` | Vehicle specs, active appointments, history timeline, and confirmation delete modal. |
| `/customer/appointments` | `AppointmentListPage` | Filterable list (All, Upcoming, Active, Completed, Cancelled) with card/table views. |
| `/customer/appointments/new` | `BookAppointmentPage` | 4-step booking wizard (Vehicle select -> Concern -> Schedule -> Review). |
| `/customer/appointments/:appointmentId` | `AppointmentDetailPage` | Appointment breakdown, assigned staff visibility, and cancellation workflow. |
| `/customer/service/:jobCardId` | `ActiveServicePage` | Real-time service tracking timeline, mechanic notes, and repair evidence gallery. |
| `/customer/invoices` | `InvoiceListPage` | Owned invoice summary with formatted INR totals and payment status filters. |
| `/customer/invoices/:invoiceId` | `InvoiceDetailPage` | Itemized GST tax breakdown, direct PDF download, and payment safeguard state. |
| `/customer/profile` | `CustomerProfilePage` | Self-service profile management for name & phone via `PUT /api/users/me`. |
| `/customer/roadside` | `RoadsideAssistancePage` | Planned capability dispatch preview with permanent status badge. |

## Data Fetching & Security Rules
1. **Ownership Enforcement**: No browser-supplied customer IDs are passed to backend endpoints. All self-service data fetching uses `/me` routes (`/api/vehicles/me`, `/api/appointments/me`, `/api/job_cards/me`, `/api/invoices/me`) resolving `customerId` server-side via `SecurityContext`.
2. **Zero Persistent Token Storage**: Access tokens remain strictly in-memory inside `AuthContext`. Refresh tokens are held in secure HttpOnly cookies.
3. **Payment Safeguards**: Online payment gateways remain disabled until server-side Razorpay/Stripe verification is configured. Invoices display clear payment instructions for on-site settlement, avoiding simulated payment mutations.
4. **Roadside Assistance**: Clearly designated with a `Planned capability` badge to prevent misleading user expectations prior to live dispatch service activation.

## Accessibility (a11y)
- Full semantic landmark structure (`<header>`, `<nav>`, `<main>`, `<footer>`).
- Skip to main content link for keyboard navigation.
- Focus trapping and restoration inside dialog modals (`VehicleDeleteDialog`, `EvidenceDialog`).
- Complete `aria-current="page"` application for active navigation state.
- Color contrast compliant with WCAG 2.1 AA standards (charcoal text on ivory/white surfaces).
