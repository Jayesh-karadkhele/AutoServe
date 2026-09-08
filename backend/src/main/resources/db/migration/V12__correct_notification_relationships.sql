-- AutoServe Flyway V12 Migration Script: Forward-only correction for notification indexes and relationships
-- Ensures clean migration across V1 through V12 schemas

ALTER TABLE notifications ADD INDEX IF NOT EXISTS idx_notification_resource (resource_type, resource_id);
