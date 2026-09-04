# Part 7A & 7A.1 MySQL Migration & Verification Guide

This document outlines the Flyway database migrations (`V1`, `V2`, `V3`, `V4`) and the manual & automated verification procedure.

---

## 1. Migration Specification

- **File Inventory**:
  - `V1__initial_schema.sql` (Core database tables)
  - `V2__financial_precision_and_indexes.sql` (Monetary precision and performance indexes)
  - `V3__authentication_sessions_and_refresh_tokens.sql` (`auth_sessions` and `refresh_tokens` tables)
  - `V4__authentication_schema_corrections.sql` (Forward-only migration removing redundant `idx_refresh_tokens_hash` index)
- **Integrity Guarantee**: `V1` and `V2` remain **100% byte-for-byte unchanged** from commit `4ac7080`.
- **Changes in V4**:
  - Executes `DROP INDEX idx_refresh_tokens_hash ON refresh_tokens;`.
  - Preserves the `UNIQUE` constraint `token_hash VARCHAR(64) UNIQUE` and its implicit unique index in MySQL.

---

## 2. Verification Protocol

### Step A: Flyway Migration Execution
On application startup against MySQL:
1. Flyway applies `V1`, `V2`, `V3`, and `V4` in order.
2. `flyway_schema_history` records `V4` execution status as `SUCCESS`.
3. Subsequent application restarts report: `Schema is up to date. No migration necessary.`

### Step B: JPA & Hibernate Mapping Validation
Spring Boot configures `spring.jpa.hibernate.ddl-auto=validate`.
Upon startup:
1. Hibernate validates `AuthSession` entity against `auth_sessions` table structure.
2. Hibernate validates `RefreshToken` entity against `refresh_tokens` table structure.
3. No schema validation errors or missing column warnings are logged.

### Step C: Persistent Database & Data Protection Rules
- **Development Database**: `autoserve_dev` remains **completely untouched**.
- **Raw Token Storage**: Zero raw refresh tokens are stored in MySQL. `refresh_tokens.token_hash` stores 64-character SHA-256 hex strings.
- **Data Preservation**: Pre-existing user accounts, vehicles, appointments, and job cards remain intact without data loss or corruption.
