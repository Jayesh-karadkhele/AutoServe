-- AutoServe Flyway V8 Migration Script: Payments, Webhooks & Password Reset Tokens

-- 1. Create payment_attempts table
CREATE TABLE IF NOT EXISTS payment_attempts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    attempt_ref VARCHAR(64) NOT NULL UNIQUE,
    invoice_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    provider VARCHAR(32) NOT NULL DEFAULT 'RAZORPAY',
    provider_order_id VARCHAR(128) NOT NULL UNIQUE,
    provider_payment_id VARCHAR(128) NULL,
    amount_paise BIGINT NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(32) NOT NULL DEFAULT 'CREATED',
    idempotency_ref VARCHAR(128) NULL,
    failure_code VARCHAR(64) NULL,
    failure_description VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    signature_verified_at TIMESTAMP NULL,
    captured_at TIMESTAMP NULL,
    CONSTRAINT fk_payment_attempts_invoice FOREIGN KEY (invoice_id) REFERENCES invoice(invoice_id),
    CONSTRAINT fk_payment_attempts_customer FOREIGN KEY (customer_id) REFERENCES users(user_id)
);

CREATE INDEX idx_payment_attempts_invoice ON payment_attempts(invoice_id);
CREATE INDEX idx_payment_attempts_customer ON payment_attempts(customer_id);
CREATE INDEX idx_payment_attempts_provider_order ON payment_attempts(provider_order_id);
CREATE INDEX idx_payment_attempts_status ON payment_attempts(status);

-- 2. Create webhook_events table for idempotent server-to-server processing
CREATE TABLE IF NOT EXISTS webhook_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    provider_event_id VARCHAR(128) NOT NULL UNIQUE,
    event_type VARCHAR(64) NOT NULL,
    payload_hash VARCHAR(64) NOT NULL,
    processing_status VARCHAR(32) NOT NULL DEFAULT 'PROCESSED',
    order_ref VARCHAR(128) NULL,
    payment_ref VARCHAR(128) NULL,
    sanitized_error VARCHAR(255) NULL,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_webhook_events_provider_event ON webhook_events(provider_event_id);
CREATE INDEX idx_webhook_events_status ON webhook_events(processing_status);

-- 3. Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    consumed_at TIMESTAMP NULL,
    invalidated_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_password_reset_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE INDEX idx_password_reset_user ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_token_hash ON password_reset_tokens(token_hash);
CREATE INDEX idx_password_reset_expires ON password_reset_tokens(expires_at);
