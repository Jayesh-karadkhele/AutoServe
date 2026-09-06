# Part 8E.1 — Payment System Architecture & Integration Guide

## 1. Overview
The AutoServe Secure Payment Subsystem implements production-ready online invoice settlement using Razorpay integration with server-side checkout order creation, HMAC-SHA256 signature verification, idempotent webhook processing, and transaction audit trails.

## 2. Component Architecture & Data Flow

```
[ Frontend: Customer Invoice Detail ]
                 │
                 ├── 1. POST /api/payments/create-order?invoiceId=X
                 ▼
     [ PaymentController ] ──(Security Check: Must own invoice)
                 │
                 ▼
      [ PaymentServiceImpl ] ──(Calculates Amount in Paise: amount * 100)
                 │
                 ▼
       [ Razorpay SDK / API ] ──► Returns provider_order_id (order_xxx)
                 │
                 ▼
  [ Persist PaymentAttempt (CREATED) ]
                 │
                 ▼
      Returns Order DTO to Frontend
                 │
                 ▼
   [ Razorpay Checkout Modal ] ──(User completes payment)
                 │
                 ▼
 2. POST /api/payments/verify (orderId, paymentId, signature)
                 │
                 ▼
   [ HMAC-SHA256 Verification ]
    - Calculate HMAC(orderId + "|" + paymentId, secret)
    - Compare with client signature using constant-time equality
                 │
                 ├───────── VALID ────────┐
                 ▼                        ▼
 [ Mark PaymentAttempt CAPTURED ]   [ Mark Invoice PAID ]
                 │                        │
                 └──────────┬─────────────┘
                            ▼
             [ Audit Log: INVOICE_PAID ]
```

## 3. Asynchronous Webhook Integration

In addition to frontend signature verification, Razorpay sends asynchronous webhooks to `/api/payments/webhooks/razorpay`:

1. **Header Validation**: Verifies `X-Razorpay-Signature` against `payment.webhook.secret`.
2. **Deduplication**: Records payload in `webhook_events` table indexed by `event_id`. Duplicate event IDs return `200 OK` with status `SKIPPED_DUPLICATE`.
3. **Status Sync**: Handles `payment.captured` and `payment.failed` to update `PaymentAttempt` and `Invoice` status asynchronously.

## 4. Entity Schema Relationships

- **Invoice** (1) ── (N) **PaymentAttempt**
  - Columns: `id`, `invoice_id`, `provider_order_id`, `provider_payment_id`, `amount_paise`, `currency`, `status`, `payment_method`, `error_code`, `error_description`, `created_at`, `updated_at`.
- **WebhookEvent**
  - Columns: `id`, `event_id`, `event_type`, `payload`, `status`, `processed_at`, `error_message`.
