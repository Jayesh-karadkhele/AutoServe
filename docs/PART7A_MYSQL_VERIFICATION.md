# Part 7A MySQL Migration & Verification Guide

This document outlines the Flyway database migration `V3__authentication_sessions_and_refresh_tokens.sql` and the manual & automated verification procedure.

---

## 1. Migration Specification

- **File**: `backend/src/main/resources/db/migration/V3__authentication_sessions_and_refresh_tokens.sql`
- **Integrity Guarantee**: `V1__initial_schema.sql` and `V2__seed_initial_data.sql` remain **100% byte-for-byte unchanged**.
- **Scope**:
  1. Creates `auth_sessions` table with foreign key `fk_auth_sessions_user` to `users(user_id)`.
  2. Creates `refresh_tokens` table with foreign keys `fk_refresh_tokens_session` to `auth_sessions(session_id)` and `fk_refresh_tokens_replaced_by` to `refresh_tokens(id)`.
  3. Creates indexes: `idx_auth_sessions_user`, `idx_auth_sessions_status`, `idx_refresh_tokens_hash`, `idx_refresh_tokens_session`.

---

## 2. Verification Protocol

### Step A: Flyway Migration Execution
On application startup against an empty or existing Flyway-managed schema:
1. Flyway detects `V3__authentication_sessions_and_refresh_tokens.sql` and applies it cleanly.
2. `flyway_schema_history` records `V3` execution status as `SUCCESS`.
3. Subsequent application restarts report: `Schema is up to date. No migration necessary.`

### Step B: JPA & Hibernate Mapping Validation
Spring Boot configures `spring.jpa.hibernate.ddl-auto=validate`.
Upon startup:
1. Hibernate validates `AuthSession` entity against `auth_sessions` table structure, data types, and nullability.
2. Hibernate validates `RefreshToken` entity against `refresh_tokens` table structure, data types, and nullability.
3. No schema validation errors or missing column warnings are logged.

### Step C: Persistent Database & Data Protection Rules
- **Development Database**: `autoserve_dev` remains **completely untouched**. All tests execute in isolated H2 test databases (`@ActiveProfiles("test")`).
- **Raw Token Storage**: Zero raw refresh tokens are stored in MySQL. `refresh_tokens.token_hash` stores 64-character SHA-256 hex strings.
- **Data Preservation**: Pre-existing user accounts, vehicles, appointments, and job cards remain intact without data loss or corruption.
