-- AutoServe Flyway Schema Migration: V5__appointment_logistics_and_indexes.sql
-- Adds appointment logistics fields (fulfilment mode, pickup address, instructions)
-- Adds performance indexes for manager and mechanic query paths

ALTER TABLE appointments ADD COLUMN fulfilment_mode VARCHAR(50) DEFAULT 'WORKSHOP_DROP_OFF';
ALTER TABLE appointments ADD COLUMN pickup_address VARCHAR(500);
ALTER TABLE appointments ADD COLUMN logistics_instructions VARCHAR(1000);

CREATE INDEX idx_appointments_manager_status ON appointments (manager_id, status);
CREATE INDEX idx_appointments_mechanic_status ON appointments (mechanic_id, status);
CREATE INDEX idx_job_card_manager_status ON job_card (manager_id, job_card_status);
CREATE INDEX idx_job_card_mechanic_status ON job_card (mechanic_id, job_card_status);
