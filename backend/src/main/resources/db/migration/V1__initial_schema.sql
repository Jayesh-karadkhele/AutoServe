-- AutoServe Flyway Baseline Schema Migration: V1__initial_schema.sql
-- Establishes baseline DDL for all 9 domain tables

CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    user_role VARCHAR(50),
    mobile VARCHAR(255),
    salary DOUBLE,
    is_active BIT(1) NOT NULL DEFAULT 1,
    manager_id BIGINT,
    created_on DATETIME(6),
    updated_on DATETIME(6),
    CONSTRAINT fk_users_manager FOREIGN KEY (manager_id) REFERENCES users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE vehicles (
    vehicle_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    license_plate VARCHAR(255) NOT NULL UNIQUE,
    brand VARCHAR(255),
    model VARCHAR(255),
    color VARCHAR(255),
    vehicle_type VARCHAR(255),
    manufacturing_year INT,
    fuel_type VARCHAR(255),
    last_service_date VARCHAR(255),
    total_services INT DEFAULT 0,
    is_active BIT(1) NOT NULL DEFAULT 1,
    customer_id BIGINT NOT NULL,
    created_on DATETIME(6),
    updated_on DATETIME(6),
    CONSTRAINT fk_vehicles_customer FOREIGN KEY (customer_id) REFERENCES users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE appointments (
    appointment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_date DATE NOT NULL,
    problem_description VARCHAR(255),
    is_rsa BIT(1),
    rsa_coordinates VARCHAR(255),
    status VARCHAR(50),
    customer_photo_url VARCHAR(255),
    vehicle_image_url VARCHAR(255),
    rejection_reason VARCHAR(255),
    vehicle_id BIGINT NOT NULL,
    manager_id BIGINT,
    mechanic_id BIGINT,
    created_on DATETIME(6),
    updated_on DATETIME(6),
    CONSTRAINT fk_appointments_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles (vehicle_id),
    CONSTRAINT fk_appointments_manager FOREIGN KEY (manager_id) REFERENCES users (user_id),
    CONSTRAINT fk_appointments_mechanic FOREIGN KEY (mechanic_id) REFERENCES users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE inventory (
    product_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255),
    sku_code VARCHAR(255) UNIQUE,
    current_price DOUBLE NOT NULL,
    stock_quantity INT,
    is_deleted BIT(1) DEFAULT 0,
    version INT,
    created_on DATETIME(6),
    updated_on DATETIME(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE job_card (
    job_card_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    appointment_id BIGINT UNIQUE,
    manager_id BIGINT NOT NULL,
    mechanic_id BIGINT,
    start_time DATETIME(6),
    completion_time DATETIME(6),
    estimated_completion_date DATE,
    cancellation_reason VARCHAR(255),
    job_card_status VARCHAR(50) NOT NULL,
    labor_cost DOUBLE,
    customer_rating INT,
    customer_feedback VARCHAR(1000),
    created_on DATETIME(6),
    updated_on DATETIME(6),
    CONSTRAINT fk_job_card_appointment FOREIGN KEY (appointment_id) REFERENCES appointments (appointment_id),
    CONSTRAINT fk_job_card_manager FOREIGN KEY (manager_id) REFERENCES users (user_id),
    CONSTRAINT fk_job_card_mechanic FOREIGN KEY (mechanic_id) REFERENCES users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE job_card_item (
    item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quantity INT NOT NULL,
    snapshot_price DOUBLE NOT NULL,
    snapshot_item_name VARCHAR(255) NOT NULL,
    total_price DOUBLE NOT NULL,
    job_card_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_on DATETIME(6),
    updated_on DATETIME(6),
    CONSTRAINT fk_job_card_item_job_card FOREIGN KEY (job_card_id) REFERENCES job_card (job_card_id),
    CONSTRAINT fk_job_card_item_product FOREIGN KEY (product_id) REFERENCES inventory (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE job_card_evidence (
    evidence_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    photo_url VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    uploaded_at DATETIME(6) NOT NULL,
    job_card_id BIGINT NOT NULL,
    created_on DATETIME(6),
    updated_on DATETIME(6),
    CONSTRAINT fk_job_card_evidence_job_card FOREIGN KEY (job_card_id) REFERENCES job_card (job_card_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE invoice (
    invoice_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(255) NOT NULL UNIQUE,
    base_amount DOUBLE NOT NULL,
    labor_cost DOUBLE,
    tax_percentage DOUBLE NOT NULL,
    tax_amount DOUBLE NOT NULL,
    total_amount DOUBLE NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    razorpay_signature VARCHAR(255),
    payment_method VARCHAR(50),
    paid_at DATETIME(6),
    job_card_id BIGINT NOT NULL UNIQUE,
    created_on DATETIME(6),
    updated_on DATETIME(6),
    CONSTRAINT fk_invoice_job_card FOREIGN KEY (job_card_id) REFERENCES job_card (job_card_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE chat (
    chat_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message VARCHAR(255),
    is_read BIT(1) DEFAULT 0,
    job_card_id BIGINT,
    sender_id BIGINT,
    created_on DATETIME(6),
    updated_on DATETIME(6),
    CONSTRAINT fk_chat_job_card FOREIGN KEY (job_card_id) REFERENCES job_card (job_card_id),
    CONSTRAINT fk_chat_sender FOREIGN KEY (sender_id) REFERENCES users (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
