# AutoServe Part 8D — Admin Governance Rules & System Policies

## 1. Operational Governance Rules

1. **Staff Account Creation**:
   - Staff accounts (`MANAGER` or `MECHANIC`) may only be created by an authenticated active Admin via `/api/admin/staff`.
   - Public self-registration via `/api/auth/register` creates only `CUSTOMER` accounts.
   - Initial passwords must meet minimum 8-character complexity and are stored strictly as Bcrypt hashes using `PasswordEncoder`.

2. **Team Reassignment Policy**:
   - Reassigning a Mechanic to a new Manager requires an explicit audit reason.
   - Active job cards assigned to the mechanic remain under the original Manager until work completion to prevent financial or operational state corruption.

3. **Global Appointment Oversight Policy**:
   - Unassigned customer service requests must be assigned to an active Manager.
   - Manager assignment writes an audit event record (`APPOINTMENT_MANAGER_ASSIGNMENT`).

4. **Invoice & Payment Policy**:
   - Billed financial totals are calculated strictly from verified database `Invoice` entities.
   - Manual mark-as-paid endpoints or payment status overrides are strictly unsupported. Verification relies on Razorpay webhooks (Part 8E).
