# AutoServe Platform - Database Schema & JPA Entity Analysis

**Date:** September 4, 2026  
**Auditor:** Principal Java Full-Stack Architect  

---

## 1. Entity & Table Inventory

The backend domain model consists of 9 persistent JPA entities extending an abstract `@MappedSuperclass BaseEntity` (which provides `id` primary key, `created_on`, and `updated_on` timestamps).

```
+------------------+         +--------------------+         +--------------------+
|      User        | 1    *  |      Vehicle       | 1    *  |    Appointment     |
|   (users table)  +---------+  (vehicles table)  +---------+ (appointments tbl) |
+--------+---------+         +--------------------+         +---------+----------+
         | 1                                                          | 1
         | (Self-Ref Manager)                                         |
         | *                                                          | 1 (OneToOne)
+--------+---------+                                        +---------+----------+
|  Manager/Mech    |                                        |      JobCard       |
+------------------+                                        |  (job_card table)  |
                                                            +----+----------+----+
                                                                 | 1        | 1
                                                        * (Cascade)     * (Cascade)
                                                            +----+-----+  +-+--------+
                                                            | JobCard  |  | JobCard  |
                                                            | Item     |  | Evidence |
                                                            +----+-----+  +----------+
                                                                 | *
                                                                 | 1
                                                            +----+-----+
                                                            | Inventory|
                                                            +----------+
```

---

## 2. Table-by-Table Schema Specification

### 2.1 Table `users` (Entity: `User`)
- **Primary Key:** `user_id` (`BIGINT AUTO_INCREMENT`)
- **Columns:**
  - `user_name` (`VARCHAR(255)`, `NOT NULL`)
  - `email` (`VARCHAR(255)`, `UNIQUE`, `NOT NULL`)
  - `password` (`VARCHAR(255)`, `NOT NULL`) - BCrypt Encoded
  - `user_role` (`VARCHAR(50)`, Enum: `ADMIN`, `MANAGER`, `MECHANIC`, `CUSTOMER`)
  - `mobile` (`VARCHAR(255)`)
  - `salary` (`DOUBLE`) - **FLAW: Should be `DECIMAL(10,2)`**
  - `is_active` (`BOOLEAN`, `DEFAULT TRUE`) - Soft delete flag
  - `manager_id` (`BIGINT`, Foreign Key -> `users(user_id)`) - Self-referencing hierarchy
  - `created_on` (`DATETIME(6)`), `updated_on` (`DATETIME(6)`)

### 2.2 Table `vehicles` (Entity: `Vehicle`)
- **Primary Key:** `vehicle_id` (`BIGINT AUTO_INCREMENT`)
- **Columns:**
  - `license_plate` (`VARCHAR(255)`, `UNIQUE`, `NOT NULL`)
  - `brand`, `model`, `color`, `vehicle_type`, `fuel_type`, `last_service_date` (`VARCHAR`)
  - `manufacturing_year`, `total_services` (`INT`)
  - `is_active` (`BOOLEAN`, `DEFAULT TRUE`)
  - `customer_id` (`BIGINT`, `NOT NULL`, Foreign Key -> `users(user_id)`)

### 2.3 Table `appointments` (Entity: `Appointment`)
- **Primary Key:** `appointment_id` (`BIGINT AUTO_INCREMENT`)
- **Columns:**
  - `request_date` (`DATE`, `NOT NULL`)
  - `problem_description` (`VARCHAR(255)`)
  - `is_rsa` (`BOOLEAN`) - Roadside Assistance flag
  - `rsa_coordinates` (`VARCHAR(255)`) - Lat,Long string from browser geolocation
  - `status` (`VARCHAR(50)`, Enum: `PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`)
  - `customer_photo_url`, `vehicle_image_url`, `rejection_reason` (`VARCHAR(255)`)
  - `vehicle_id` (`BIGINT`, `NOT NULL`, Foreign Key -> `vehicles(vehicle_id)`)
  - `manager_id` (`BIGINT`, Foreign Key -> `users(user_id)`)
  - `mechanic_id` (`BIGINT`, Foreign Key -> `users(user_id)`)

### 2.4 Table `job_card` (Entity: `JobCard`)
- **Primary Key:** `job_card_id` (`BIGINT AUTO_INCREMENT`)
- **Columns:**
  - `appointment_id` (`BIGINT`, `UNIQUE`, Foreign Key -> `appointments(appointment_id)`)
  - `manager_id` (`BIGINT`, `NOT NULL`, Foreign Key -> `users(user_id)`)
  - `mechanic_id` (`BIGINT`, Foreign Key -> `users(user_id)`)
  - `start_time`, `completion_time` (`DATETIME(6)`)
  - `estimated_completion_date` (`DATE`)
  - `cancellation_reason` (`VARCHAR(255)`)
  - `job_card_status` (`VARCHAR(50)`, `NOT NULL`, Enum: `CREATED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`)
  - `labor_cost` (`DOUBLE`) - **FLAW: Should be `DECIMAL(10,2)`**
  - `customer_rating` (`INT`), `customer_feedback` (`VARCHAR(1000)`)

### 2.5 Table `job_card_item` (Entity: `JobCardItem`)
- **Primary Key:** `item_id` (`BIGINT AUTO_INCREMENT`)
- **Columns:**
  - `quantity` (`INT`, `NOT NULL`)
  - `snapshot_price` (`DOUBLE`, `NOT NULL`) - **FLAW: Should be `DECIMAL(10,2)`**
  - `snapshot_item_name` (`VARCHAR(255)`, `NOT NULL`) - Snapshot pattern implementation
  - `total_price` (`DOUBLE`, `NOT NULL`) - **FLAW: Should be `DECIMAL(10,2)`**
  - `job_card_id` (`BIGINT`, `NOT NULL`, Foreign Key -> `job_card(job_card_id)`)
  - `product_id` (`BIGINT`, `NOT NULL`, Foreign Key -> `inventory(product_id)`)

### 2.6 Table `job_card_evidence` (Entity: `JobCardEvidence`)
- **Primary Key:** `evidence_id` (`BIGINT AUTO_INCREMENT`)
- **Columns:**
  - `photo_url` (`VARCHAR(255)`, `NOT NULL`)
  - `description` (`VARCHAR(255)`)
  - `uploaded_at` (`DATETIME(6)`, `NOT NULL`)
  - `job_card_id` (`BIGINT`, `NOT NULL`, Foreign Key -> `job_card(job_card_id)`)

### 2.7 Table `inventory` (Entity: `Inventory`)
- **Primary Key:** `product_id` (`BIGINT AUTO_INCREMENT`)
- **Columns:**
  - `item_name` (`VARCHAR(255)`)
  - `sku_code` (`VARCHAR(255)`, `UNIQUE`)
  - `current_price` (`DOUBLE`, `NOT NULL`) - **FLAW: Should be `DECIMAL(10,2)`**
  - `stock_quantity` (`INT`)
  - `is_deleted` (`BOOLEAN`) - Soft delete flag
  - `version` (`INT`) - `@Version` Optimistic locking flag

### 2.8 Table `invoice` (Entity: `Invoice`)
- **Primary Key:** `invoice_id` (`BIGINT AUTO_INCREMENT`)
- **Columns:**
  - `invoice_number` (`VARCHAR(255)`, `UNIQUE`, `NOT NULL`)
  - `base_amount`, `labor_cost`, `tax_percentage`, `tax_amount`, `total_amount` (`DOUBLE`, `NOT NULL`) - **FLAW: Should be `DECIMAL(10,2)`**
  - `payment_status` (`VARCHAR(50)`, `NOT NULL`, Enum: `PENDING`, `INITIATED`, `PAID`, `FAILED`)
  - `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature` (`VARCHAR(255)`)
  - `payment_method` (`VARCHAR(50)`, Enum: `ONLINE`, `CASH`, `CARD`, `UPI`, `SIMULATED`)
  - `paid_at` (`DATETIME(6)`)
  - `job_card_id` (`BIGINT`, `UNIQUE`, `NOT NULL`, Foreign Key -> `job_card(job_card_id)`)

### 2.9 Table `chat` (Entity: `Chat`)
- **Primary Key:** `chat_id` (`BIGINT AUTO_INCREMENT`)
- **Columns:**
  - `message` (`VARCHAR(255)`)
  - `is_read` (`BOOLEAN`)
  - `job_card_id` (`BIGINT`, Foreign Key -> `job_card(job_card_id)`)
  - `sender_id` (`BIGINT`, Foreign Key -> `users(user_id)`)

---

## 3. Database Design Issues & Recommended Fixes

> [!CAUTION]
> **CRITICAL FLAW: Floating-Point Data Types for Currency**  
> `User.salary`, `JobCard.laborCost`, `JobCardItem.snapshotPrice`, `JobCardItem.totalPrice`, `Inventory.currentPrice`, `Invoice.baseAmount`, `Invoice.laborCost`, `Invoice.taxPercentage`, `Invoice.taxAmount`, and `Invoice.totalAmount` are defined using Java `Double` and SQL `DOUBLE`.  
> Floating-point arithmetic introduces IEEE 754 precision errors (e.g. `19.99 * 3 = 59.970000000000006`), causing invoice total discrepancies and payment verification failures with gateway signature hashing. All financial fields MUST be refactored to `java.math.BigDecimal` / SQL `DECIMAL(12,2)`.

### Missing Database Indexes
High-volume query filters lack database indexes:
- `vehicles(customer_id)`
- `appointments(vehicle_id, manager_id, mechanic_id, status)`
- `job_card(appointment_id, manager_id, mechanic_id, job_card_status)`
- `job_card_item(job_card_id, product_id)`
- `invoice(job_card_id, payment_status)`
