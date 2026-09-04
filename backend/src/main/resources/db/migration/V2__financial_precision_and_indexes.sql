-- AutoServe Flyway Migration: V2__financial_precision_and_indexes.sql
-- Enforces DECIMAL(10,2) monetary precision and adds production indexes

-- 1. Financial Column Refactoring to DECIMAL(10,2)
ALTER TABLE users MODIFY COLUMN salary DECIMAL(10, 2);

ALTER TABLE inventory MODIFY COLUMN current_price DECIMAL(10, 2) NOT NULL;

ALTER TABLE job_card MODIFY COLUMN labor_cost DECIMAL(10, 2);

ALTER TABLE job_card_item MODIFY COLUMN snapshot_price DECIMAL(10, 2) NOT NULL;
ALTER TABLE job_card_item MODIFY COLUMN total_price DECIMAL(10, 2) NOT NULL;

ALTER TABLE invoice MODIFY COLUMN base_amount DECIMAL(10, 2) NOT NULL;
ALTER TABLE invoice MODIFY COLUMN labor_cost DECIMAL(10, 2);
ALTER TABLE invoice MODIFY COLUMN tax_percentage DECIMAL(5, 2) NOT NULL;
ALTER TABLE invoice MODIFY COLUMN tax_amount DECIMAL(10, 2) NOT NULL;
ALTER TABLE invoice MODIFY COLUMN total_amount DECIMAL(10, 2) NOT NULL;

-- 2. Performance Indexes
CREATE INDEX idx_users_user_role ON users (user_role);
CREATE INDEX idx_users_manager_id ON users (manager_id);
CREATE INDEX idx_users_is_active ON users (is_active);

CREATE INDEX idx_vehicles_customer_id ON vehicles (customer_id);
CREATE INDEX idx_vehicles_license_plate ON vehicles (license_plate);

CREATE INDEX idx_appointments_vehicle_id ON appointments (vehicle_id);
CREATE INDEX idx_appointments_status ON appointments (status);
CREATE INDEX idx_appointments_manager_id ON appointments (manager_id);
CREATE INDEX idx_appointments_mechanic_id ON appointments (mechanic_id);

CREATE INDEX idx_inventory_sku_code ON inventory (sku_code);
CREATE INDEX idx_inventory_is_deleted ON inventory (is_deleted);

CREATE INDEX idx_job_card_appointment_id ON job_card (appointment_id);
CREATE INDEX idx_job_card_status ON job_card (job_card_status);
CREATE INDEX idx_job_card_manager_id ON job_card (manager_id);
CREATE INDEX idx_job_card_mechanic_id ON job_card (mechanic_id);

CREATE INDEX idx_job_card_item_job_card_id ON job_card_item (job_card_id);
CREATE INDEX idx_job_card_item_product_id ON job_card_item (product_id);

CREATE INDEX idx_job_card_evidence_job_card_id ON job_card_evidence (job_card_id);

CREATE INDEX idx_invoice_invoice_number ON invoice (invoice_number);
CREATE INDEX idx_invoice_payment_status ON invoice (payment_status);
CREATE INDEX idx_invoice_job_card_id ON invoice (job_card_id);

CREATE INDEX idx_chat_job_card_id ON chat (job_card_id);
CREATE INDEX idx_chat_sender_id ON chat (sender_id);
