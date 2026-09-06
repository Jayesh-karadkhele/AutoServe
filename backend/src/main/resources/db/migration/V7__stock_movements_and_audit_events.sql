-- AutoServe Flyway Migration V7: Stock Movements Ledger and Administrative Audit Events

CREATE TABLE IF NOT EXISTS inventory_stock_movements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    inventory_id BIGINT NOT NULL,
    movement_type VARCHAR(50) NOT NULL,
    quantity_before INT NOT NULL,
    quantity_delta INT NOT NULL,
    quantity_after INT NOT NULL,
    job_card_id BIGINT NULL,
    actor_id BIGINT NOT NULL,
    reason VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_stock_mov_inventory FOREIGN KEY (inventory_id) REFERENCES inventory(product_id),
    CONSTRAINT fk_stock_mov_job_card FOREIGN KEY (job_card_id) REFERENCES job_card(job_card_id),
    CONSTRAINT fk_stock_mov_actor FOREIGN KEY (actor_id) REFERENCES users(user_id)
);

CREATE INDEX idx_stock_mov_inventory ON inventory_stock_movements(inventory_id);
CREATE INDEX idx_stock_mov_created ON inventory_stock_movements(created_at);

CREATE TABLE IF NOT EXISTS admin_audit_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    actor_id BIGINT NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(100) NULL,
    outcome VARCHAR(20) NOT NULL,
    details TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_actor FOREIGN KEY (actor_id) REFERENCES users(user_id)
);

CREATE INDEX idx_audit_actor ON admin_audit_events(actor_id);
CREATE INDEX idx_audit_action ON admin_audit_events(action_type);
CREATE INDEX idx_audit_resource ON admin_audit_events(resource_type, resource_id);
CREATE INDEX idx_audit_created ON admin_audit_events(created_at);
