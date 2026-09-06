# AutoServe Part 8B — Manager RBAC Matrix Documentation

## Role-Based Access Control (RBAC) Security Matrix

| URL Path / Resource | Required Role | Anonymous | CUSTOMER | MECHANIC | MANAGER | ADMIN |
|---|---|---|---|---|---|---|
| `/manager` (Overview Dashboard) | `MANAGER` | 401 Redirect | 403 Forbidden | 403 Forbidden | 200 OK | 403 Forbidden |
| `/manager/appointments` | `MANAGER` | 401 Redirect | 403 Forbidden | 403 Forbidden | 200 OK | 403 Forbidden |
| `/manager/appointments/:id` | `MANAGER` | 401 Redirect | 403 Forbidden | 403 Forbidden | 200 OK | 403 Forbidden |
| `/manager/team` | `MANAGER` | 401 Redirect | 403 Forbidden | 403 Forbidden | 200 OK | 403 Forbidden |
| `/manager/job-cards` | `MANAGER` | 401 Redirect | 403 Forbidden | 403 Forbidden | 200 OK | 403 Forbidden |
| `/manager/inventory` | `MANAGER` | 401 Redirect | 403 Forbidden | 403 Forbidden | 200 OK | 403 Forbidden |
| `/manager/invoices` | `MANAGER` | 401 Redirect | 403 Forbidden | 403 Forbidden | 200 OK | 403 Forbidden |
| `/manager/reports` | `MANAGER` | 401 Redirect | 403 Forbidden | 403 Forbidden | 200 OK | 403 Forbidden |
| `/manager/activity` | `MANAGER` | 401 Redirect | 403 Forbidden | 403 Forbidden | 200 OK | 403 Forbidden |
| `/manager/profile` | `MANAGER` | 401 Redirect | 403 Forbidden | 403 Forbidden | 200 OK | 403 Forbidden |
| `/api/manager/**` | `MANAGER` | 401 Unauthorized | 403 Forbidden | 403 Forbidden | 200 OK | 403 Forbidden |
| `/api/appointments/manager/me` | `MANAGER` | 401 Unauthorized | 403 Forbidden | 403 Forbidden | 200 OK | 403 Forbidden |

---

## Security Implementation Details
- **Spring Security Configuration**: `@EnableMethodSecurity` enables method-level `@PreAuthorize` checks on service and controller layers.
- **Frontend Route Security**: `ProtectedRoute` wrapper inspects `user.role`. Access by unauthorized roles automatically navigates to `/forbidden`.
- **Session Management**: JWT stored securely in memory with HTTP-only refresh tokens. Single session logout and global `logoutAll` invalidate active tokens on backend security filter.
