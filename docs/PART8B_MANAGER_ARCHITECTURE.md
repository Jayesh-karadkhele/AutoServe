# AutoServe Part 8B — Manager Dashboard Architecture Documentation

## 1. System Overview & Purpose
The AutoServe Manager Dashboard provides a complete Operational Control Centre for workshop managers. It handles appointment decisions (approval/rejection), mechanic assignment with availability conflict validation, job card tracking, inventory stock visibility, invoice generation triggers, and operational metric reporting.

---

## 2. Technical Stack & Component Topology

```
+-----------------------------------------------------------------------+
|                           React/TS Frontend                            |
|                                                                       |
|  [ManagerShell]                                                       |
|    |-- Header (Account Menu, Single/All Logout, Mobile Drawer Trigger) |
|    |-- Navigation Sidebar (12 Protected Routes)                        |
|    `-- Content Area                                                   |
|          |-- ManagerDashboardPage                                     |
|          |-- ManagerAppointmentListPage / ManagerAppointmentDetailPage |
|          |-- ManagerTeamPage                                          |
|          |-- ManagerJobCardListPage / ManagerJobCardDetailPage         |
|          |-- ManagerInventoryPage                                     |
|          |-- ManagerInvoiceListPage / ManagerInvoiceDetailPage        |
|          |-- ManagerReportsPage / ManagerActivityPage                 |
|          `-- ManagerProfilePage                                       |
+-----------------------------------------------------------------------+
                                   | (REST over HTTP with Bearer Token)
                                   v
+-----------------------------------------------------------------------+
|                          Spring Boot Backend                          |
|                                                                       |
|  [SecurityFilterChain] @EnableMethodSecurity                          |
|    `-- JwtAuthenticationFilter -> SecurityContext                      |
|                                                                       |
|  [Controllers]                                                        |
|    |-- ManagerController (/api/manager/*)                             |
|    |-- AppointmentController (/api/appointments/*)                    |
|    |-- JobCardController (/api/job_cards/*)                           |
|    |-- InventoryController (/api/inventory/*)                         |
|    `-- InvoiceController (/api/invoices/*)                            |
|                                                                       |
|  [Services]                                                           |
|    |-- ManagerServiceImpl                                             |
|    |-- AppointmentServiceImpl                                         |
|    `-- JobCardServiceImpl                                             |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                         Persistence Layer                             |
|  MySQL (H2 in tests) via Spring Data JPA                              |
|  Flyway Migrations V1 -> V5                                           |
+-----------------------------------------------------------------------+
```

---

## 3. Core Data Flow & Scope Isolation
- **Manager Scope Enforcement**: All manager endpoints enforce `@PreAuthorize("hasRole('MANAGER')")`.
- **Mechanic Assignment Workflow**:
  1. Appointment moves to `APPROVED`.
  2. Manager opens `MechanicAssignmentDrawer`.
  3. API checks mechanic active workload and availability status.
  4. Upon assignment, appointment status updates and mechanic `activeJobCount` increments.
- **Logistics Integration**: Appointments contain `fulfilment_mode` (`WORKSHOP_DROP_OFF` vs `PICKUP_AND_RETURN_REQUESTED`), `pickup_address`, and `logistics_instructions`.

---

## 4. Design System Compliance
- **Color Palette**: Light Ivory background (`#FBFBFA`), Pure White card containers (`#FFFFFF`), Slate/Charcoal text (`#111827`, `#374151`), Sky/Cyan accents (`#0284C7`, `#06B6D4`, `#E0F2FE`).
- **Typography**: Inter / Sans-serif variable font.
- **Accessibility**: Minimum touch targets (44px), `aria-current="page"`, visible focus rings, WCAG AAA text contrast, accessible modal dialogs and drawers.
