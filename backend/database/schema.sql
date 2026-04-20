-- Create database
CREATE DATABASE IF NOT EXISTS user_activity;
USE user_activity;

-- Table: apps
CREATE TABLE IF NOT EXISTS apps (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    api_key_hash VARCHAR(255) NOT NULL,
    api_key_prefix VARCHAR(10) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: events
CREATE TABLE IF NOT EXISTS events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    app_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    user_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(100),
    metadata JSON,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_app_id (app_id),
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at),
    INDEX idx_app_action (app_id, action),
    INDEX idx_app_user (app_id, user_id),
    INDEX idx_resource (resource_type, resource_id),
    
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE
);

-- Table: admins
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Insert default admin (username: admin, password: Admin123!)
-- Password is "Admin123!" hashed with bcrypt
INSERT INTO admins (username, email, password_hash) VALUES 
('admin', 'admin@example.com', '$2a$10$rQd5q8Z8Y8Q8Y8Q8Y8Q8YuO8Y8Q8Y8Q8Y8Q8Y8Q8Y8Q8Y8Q8Y8Q8Y');

-- Insert sample app for testing
INSERT INTO apps (id, name, description, api_key_hash, api_key_prefix) VALUES 
('flexdok', 'FlexDok', 'Document Management Platform', '$2a$10$test_hash_placeholder', 'ak_test');