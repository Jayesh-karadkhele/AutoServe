# AutoServe Part 5A — Database Preflight Audit Report

## 1. Environment & Preflight Metadata
- **Date/Time**: 2026-09-04
- **Git Branch**: `database/flyway-foundation`
- **Base Commit**: `445f1ed` (on top of `92c324a`)
- **Port 8081 Listener Check**: Verified clean (no process running on 8081)
- **Active MySQL Host**: `localhost:3306` (MySQL 8.0.x)
- **Legacy Dev Database**: `autoserve_dev` (preserved, 0 rows)
- **Target Flyway Database**: `autoserve_flyway_dev` (fresh target)

## 2. API & Codebase Baseline Metrics
- **Main Java Source Files**: 119
- **Test Java Source Files**: 10
- **Total Java Source Files**: 129
- **Total Test Methods**: 67 (across 9 test suites, 0 failures, 0 errors, 0 skipped)
- **Mapped Endpoint Handlers**: 67 security baseline handlers (105 raw `@Mapping` methods)
- **Maven Build Verification**: `BUILD SUCCESS` (via `mvnw.cmd clean verify`)

## 3. Entity-to-Table Mappings & Table Row Counts

| Entity Class | MySQL Table Name | Table Row Count (`autoserve_dev`) | Primary Key | Soft Delete Support |
| :--- | :--- | :---: | :--- | :---: |
| `User` | `users` | 0 | `id` (BIGINT) | Yes (`deleted`) |
| `Vehicle` | `vehicles` | 0 | `id` (BIGINT) | Yes (`deleted`) |
| `Appointment` | `appointments` | 0 | `id` (BIGINT) | Yes (`deleted`) |
| `JobCard` | `job_card` | 0 | `id` (BIGINT) | Yes (`deleted`) |
| `JobCardItem` | `job_card_item` | 0 | `id` (BIGINT) | No |
| `JobCardEvidence` | `job_card_evidence` | 0 | `id` (BIGINT) | No |
| `Inventory` | `inventory` | 0 | `id` (BIGINT) | Yes (`deleted`) |
| `Invoice` | `invoice` | 0 | `id` (BIGINT) | Yes (`deleted`) |
| `Chat` | `chat` | 0 | `id` (BIGINT) | No |

## 4. Current Financial Data Types (Pre-Refactoring Audit)
- `Inventory`: `currentPrice` currently `Double` -> **Refactoring to `BigDecimal` (DECIMAL(10,2))**
- `JobCard`: `estimatedCost`, `laborCost`, `totalAmount` currently `Double`/`double` -> **Refactoring to `BigDecimal` (DECIMAL(10,2))**
- `JobCardItem`: `unitPrice`, `totalPrice` currently `Double`/`double` -> **Refactoring to `BigDecimal` (DECIMAL(10,2))**
- `Invoice`: `baseAmount`, `taxAmount`, `laborCost`, `discountAmount`, `finalAmount` currently `Double`/`double` -> **Refactoring to `BigDecimal` (DECIMAL(10,2))**
