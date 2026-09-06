# Part 8E.1 — Razorpay Integration API Contract & DTO Schemas

## 1. Endpoints Summary

| Method | Endpoint | Authorization | Description |
|---|---|---|---|
| `POST` | `/api/payments/create-order?invoiceId={id}` | Customer / Admin / Manager | Creates Razorpay order & returns order credentials |
| `POST` | `/api/payments/verify` | Customer / Admin / Manager | Verifies HMAC-SHA256 signature and settles invoice |
| `GET` | `/api/payments/attempts/{invoiceId}` | Authenticated Owner / Staff | Fetches history of payment attempts for an invoice |
| `POST` | `/api/payments/webhooks/razorpay` | Public (Signature Verified) | Idempotent webhook receiver for payment state sync |

## 2. Request / Response DTO Contracts

### Create Order Response (`PaymentOrderResponseDto`)
```json
{
  "providerOrderId": "order_761234901",
  "invoiceId": 12,
  "amountPaise": 150000,
  "currency": "INR",
  "keyId": "rzp_test_mockKeyId12345",
  "status": "CREATED",
  "customerName": "Customer Name",
  "customerEmail": "customer@example.com",
  "customerMobile": "9876543210"
}
```

### Verify Payment Request (`VerifyPaymentRequestDto`)
```json
{
  "invoiceId": 12,
  "razorpayOrderId": "order_761234901",
  "razorpayPaymentId": "pay_987654321",
  "razorpaySignature": "4c9d...e10f"
}
```

### Payment Attempt Item (`PaymentAttemptDto`)
```json
{
  "id": 1,
  "invoiceId": 12,
  "providerOrderId": "order_761234901",
  "providerPaymentId": "pay_987654321",
  "amountPaise": 150000,
  "currency": "INR",
  "status": "CAPTURED",
  "paymentMethod": "card",
  "errorCode": null,
  "errorDescription": null,
  "createdAt": "2026-09-06T12:00:00Z",
  "updatedAt": "2026-09-06T12:00:05Z"
}
```
