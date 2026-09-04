-- AutoServe Flyway Migration: V3__authentication_sessions_and_refresh_tokens.sql
-- Establishes database-backed authentication sessions and SHA-256 hashed refresh token lifecycle

CREATE TABLE auth_sessions (
    session_id VARCHAR(36) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    last_used_at DATETIME(6) NOT NULL,
    expires_at DATETIME(6) NOT NULL,
    revoked_at DATETIME(6) DEFAULT NULL,
    revocation_reason VARCHAR(255) DEFAULT NULL,
    CONSTRAINT fk_auth_sessions_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE refresh_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(36) NOT NULL,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    issued_at DATETIME(6) NOT NULL,
    expires_at DATETIME(6) NOT NULL,
    consumed_at DATETIME(6) DEFAULT NULL,
    revoked_at DATETIME(6) DEFAULT NULL,
    replaced_by_id BIGINT DEFAULT NULL,
    CONSTRAINT fk_refresh_tokens_session FOREIGN KEY (session_id) REFERENCES auth_sessions (session_id) ON DELETE CASCADE,
    CONSTRAINT fk_refresh_tokens_replaced_by FOREIGN KEY (replaced_by_id) REFERENCES refresh_tokens (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Performance Indexes
CREATE INDEX idx_auth_sessions_user ON auth_sessions (user_id);
CREATE INDEX idx_auth_sessions_expires ON auth_sessions (expires_at);
CREATE INDEX idx_auth_sessions_revoked ON auth_sessions (revoked_at);

CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens (token_hash);
CREATE INDEX idx_refresh_tokens_session ON refresh_tokens (session_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens (expires_at);
