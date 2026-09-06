# AutoServe Part 8D — Transactional Inventory Stock Movements Ledger

## 1. Executive Summary

In AutoServe Part 8D, master inventory management is backed by an **Append-Only Stock Movement Ledger** (`inventory_stock_movements`). Generic, un-audited in-place stock field mutations are strictly forbidden. Every stock change—whether manual stock receiving, damage audit decrease, manual correction, or mechanic job consumption—produces an immutable ledger entry.

---

## 2. Stock Movement Types

| Movement Type | Trigger Action | Quantity Delta | Audit Invariants |
| :--- | :--- | :--- | :--- |
| `INITIAL_STOCK` | Master inventory creation | Positive (`+N`) | Initial catalog onboarding |
| `MANUAL_INCREASE` | Admin shipment receipt | Positive (`+N`) | Mandatory audit reason required |
| `MANUAL_DECREASE` | Admin damage / loss audit | Negative (`-N`) | Validates `stockQuantity - N >= 0` |
| `JOB_CONSUMPTION` | Mechanic part usage on job | Negative (`-N`) | Linked to `JobCardItem` & `JobCard` |
| `JOB_ITEM_REVERSAL` | Mechanic part removal | Positive (`+N`) | Transactionally restores master stock |
| `CORRECTION` | Audit stock reconciliation | Signed (`+N` or `-N`) | Mandatory audit reason required |

---

## 3. Concurrency & Locking Control

1. **Optimistic Locking**: The `Inventory` entity is guarded by JPA `@Version`. Concurrent stock adjustments or mechanic parts usage targeting stale stock versions trigger optimistic lock exception retries.
2. **Non-Negative Stock Invariant**: If an adjustment would reduce `stockQuantity` below `0`, the operation is aborted and throws `IllegalArgumentException`.
