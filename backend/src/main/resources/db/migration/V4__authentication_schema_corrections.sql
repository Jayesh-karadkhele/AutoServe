-- AutoServe Flyway Migration: V4__authentication_schema_corrections.sql
-- Removes redundant non-unique token_hash index on refresh_tokens table
-- Preserves unique constraint on refresh_tokens (token_hash)

DROP INDEX idx_refresh_tokens_hash ON refresh_tokens;
