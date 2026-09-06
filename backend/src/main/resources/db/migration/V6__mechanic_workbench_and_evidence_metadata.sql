-- AutoServe Flyway Schema Migration: V6__mechanic_workbench_and_evidence_metadata.sql
-- Adds evidence type, media type, original filename, and uploader ID to job_card_evidence
-- Adds performance indexes for mechanic workbench queries

ALTER TABLE job_card_evidence ADD COLUMN evidence_type VARCHAR(50) DEFAULT 'DURING_REPAIR';
ALTER TABLE job_card_evidence ADD COLUMN media_type VARCHAR(50) DEFAULT 'image/jpeg';
ALTER TABLE job_card_evidence ADD COLUMN original_filename VARCHAR(255);
ALTER TABLE job_card_evidence ADD COLUMN uploader_id BIGINT;

ALTER TABLE job_card_evidence ADD CONSTRAINT fk_evidence_uploader FOREIGN KEY (uploader_id) REFERENCES users (user_id);

CREATE INDEX idx_job_card_evidence_type ON job_card_evidence (job_card_id, evidence_type);
