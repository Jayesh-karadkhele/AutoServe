# Part 8E.1 — Payment Security Matrix & IDOR Prevention

## 1. Security Assurance & Threat Mitigation

| Security Risk | Mitigation Strategy | Enforcement Layer | Status |
|---|---|---|---|
| **IDOR (Payment Order Creation)** | Customer can ONLY create order for invoices belonging to their registered vehicles | `PaymentServiceImpl.java` owner check | ✅ VERIFIED |
| **IDOR (Signature Verification)** | Signature verification checks target invoice ownership before marking paid | `PaymentServiceImpl.java` owner check | ✅ VERIFIED |
| **Tampered Amount Attacks** | Amount is derived server-side (`invoice.getTotalAmount() * 100`) and never trusted from frontend request | `PaymentServiceImpl.createPaymentOrder()` | ✅ VERIFIED |
| **Signature Fraud / Spoofing** | Strict `HMAC-SHA256(orderId + '|' + paymentId, keySecret)` comparison with constant-time equality | `PaymentServiceImpl.verifyPayment()` | ✅ VERIFIED |
| **Replay Attacks** | Payment attempts tracked by `provider_payment_id` with status state machine checks | `PaymentAttemptRepository` & state validations | ✅ VERIFIED |
| **Webhook Spoofing** | HMAC header signature validation on `/api/payments/webhooks/razorpay` | `PaymentServiceImpl.processWebhook()` | ✅ VERIFIED |
| **Webhook Replay / Duplication** | Idempotency keying on `event_id` in `webhook_events` table | `WebhookEventRepository` lookup | ✅ VERIFIED |
