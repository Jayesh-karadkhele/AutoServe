-- AutoServe Flyway V11 Migration Script: Notifications, Chat, Roadside Assistance, and Service Ratings

-- 1. Database-backed Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    resource_type VARCHAR(50),
    resource_id BIGINT,
    navigation_link VARCHAR(255),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_on DATETIME NOT NULL,
    updated_on DATETIME NOT NULL,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_notification_user_read (user_id, is_read),
    INDEX idx_notification_created (created_on)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Ensure Chat Table & Indexes
CREATE TABLE IF NOT EXISTS chat (
    chat_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    job_card_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    created_on DATETIME NOT NULL,
    updated_on DATETIME NOT NULL,
    CONSTRAINT fk_chat_job_card FOREIGN KEY (job_card_id) REFERENCES job_card(job_card_id) ON DELETE CASCADE,
    CONSTRAINT fk_chat_sender FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_chat_job_created (job_card_id, created_on)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Roadside Assistance Table
CREATE TABLE IF NOT EXISTS roadside_assistance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    vehicle_id BIGINT NOT NULL,
    assigned_handler_id BIGINT,
    assistance_type VARCHAR(50) NOT NULL,
    description TEXT,
    location_text VARCHAR(500),
    coordinates VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'REQUESTED',
    resolution_notes TEXT,
    created_on DATETIME NOT NULL,
    updated_on DATETIME NOT NULL,
    CONSTRAINT fk_rsa_customer FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_rsa_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    CONSTRAINT fk_rsa_handler FOREIGN KEY (assigned_handler_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_rsa_customer (customer_id),
    INDEX idx_rsa_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Service Ratings and Reviews Table
CREATE TABLE IF NOT EXISTS service_ratings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_card_id BIGINT NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    mechanic_id BIGINT,
    rating INT NOT NULL,
    comment TEXT,
    created_on DATETIME NOT NULL,
    updated_on DATETIME NOT NULL,
    CONSTRAINT fk_rating_job_card FOREIGN KEY (job_card_id) REFERENCES job_card(job_card_id) ON DELETE CASCADE,
    CONSTRAINT fk_rating_customer FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_rating_mechanic FOREIGN KEY (mechanic_id) REFERENCES users(user_id) ON DELETE SET NULL,
    CONSTRAINT chk_rating_range CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
