-- AutoServe Flyway V9 Migration Script: Payment Integrity, Security Indexes & Idempotency Constraints

-- 1. Idempotency index on payment_attempts
CREATE INDEX idx_payment_attempts_idempotency ON payment_attempts(customer_id, idempotency_ref);

-- 2. Composite index on payment_attempts for invoice, customer and status lookup
CREATE INDEX idx_payment_attempts_composite ON payment_attempts(invoice_id, customer_id, status, created_at);

-- 3. Composite index on webhook_events
CREATE INDEX idx_webhook_events_composite ON webhook_events(processing_status, received_at, provider_event_id);

-- 4. Composite index on password_reset_tokens
CREATE INDEX idx_password_reset_composite ON password_reset_tokens(user_id, expires_at, consumed_at);
