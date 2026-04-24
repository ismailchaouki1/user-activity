-- ============================================
-- SEED SCRIPT - Generate realistic demo data
-- Run this to populate database with sample events
-- ============================================

USE user_activity;

-- ============================================
-- 1. Create demo applications
-- ============================================

-- First, ensure apps exist (or insert if not)
INSERT IGNORE INTO apps (id, name, description, api_key_hash, api_key_prefix, is_active, created_at) VALUES
('flexdok', 'FlexDok', 'Document Management Platform', '$2a$10$dummyhash1', 'ak_flexdok', 1, DATE_SUB(NOW(), INTERVAL 30 DAY)),
('webhook', 'Webhook Service', 'Webhook Integration Gateway', '$2a$10$dummyhash2', 'ak_webhook', 1, DATE_SUB(NOW(), INTERVAL 25 DAY)),
('authsvc', 'Auth Service', 'Authentication & Authorization', '$2a$10$dummyhash3', 'ak_authsvc', 1, DATE_SUB(NOW(), INTERVAL 20 DAY)),
('analytics', 'Analytics Engine', 'Data Analytics Platform', '$2a$10$dummyhash4', 'ak_analytics', 1, DATE_SUB(NOW(), INTERVAL 15 DAY)),
('storage', 'Cloud Storage', 'File Storage Service', '$2a$10$dummyhash5', 'ak_storage', 1, DATE_SUB(NOW(), INTERVAL 10 DAY));

-- ============================================
-- 2. Generate 500+ realistic events
-- ============================================

-- Helper: Generate random date within last 30 days
SET @start_date = DATE_SUB(NOW(), INTERVAL 30 DAY);
SET @end_date = NOW();

-- ============================================
-- User Login/Logout Events (100 events)
-- ============================================
INSERT INTO events (app_id, user_id, user_email, action, resource_type, resource_id, ip_address, user_agent, created_at)
SELECT 
    ELT(FLOOR(1 + RAND() * 5), 'flexdok', 'webhook', 'authsvc', 'analytics', 'storage') as app_id,
    CONCAT('user_', FLOOR(100 + RAND() * 900)) as user_id,
    CONCAT('user', FLOOR(100 + RAND() * 900), '@example.com') as user_email,
    ELT(FLOOR(1 + RAND() * 2), 'user.login', 'user.logout') as action,
    'user' as resource_type,
    CONCAT('user_', FLOOR(100 + RAND() * 900)) as resource_id,
    CONCAT(FLOOR(192 + RAND() * 63), '.', FLOOR(RAND() * 255), '.', FLOOR(RAND() * 255), '.', FLOOR(RAND() * 255)) as ip_address,
    ELT(FLOOR(1 + RAND() * 4), 
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
        'Mozilla/5.0 (Linux; Android 11; SM-G973F) AppleWebKit/537.36') as user_agent,
    DATE_ADD(@start_date, INTERVAL FLOOR(RAND() * 2592000) SECOND) as created_at
FROM 
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION 
     SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) t1,
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION 
     SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) t2
LIMIT 100;

-- ============================================
-- Document Operations (150 events)
-- ============================================
INSERT INTO events (app_id, user_id, user_email, action, resource_type, resource_id, metadata, ip_address, user_agent, created_at)
SELECT 
    'flexdok' as app_id,
    CONCAT('user_', FLOOR(100 + RAND() * 900)) as user_id,
    CONCAT('user', FLOOR(100 + RAND() * 900), '@example.com') as user_email,
    ELT(FLOOR(1 + RAND() * 4), 'document.create', 'document.edit', 'document.view', 'document.delete') as action,
    'document' as resource_type,
    CONCAT('doc_', FLOOR(1000 + RAND() * 9000)) as resource_id,
    JSON_OBJECT(
        'title', CONCAT('Document ', FLOOR(100 + RAND() * 900)),
        'size', FLOOR(1024 + RAND() * 1048576),
        'format', ELT(FLOOR(1 + RAND() * 3), 'pdf', 'docx', 'txt'),
        'version', FLOOR(1 + RAND() * 10)
    ) as metadata,
    CONCAT(FLOOR(192 + RAND() * 63), '.', FLOOR(RAND() * 255), '.', FLOOR(RAND() * 255), '.', FLOOR(RAND() * 255)) as ip_address,
    ELT(FLOOR(1 + RAND() * 3), 
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36') as user_agent,
    DATE_ADD(@start_date, INTERVAL FLOOR(RAND() * 2592000) SECOND) as created_at
FROM 
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION 
     SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) t1,
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION 
     SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) t2,
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) t3
LIMIT 150;

-- ============================================
-- Webhook Events (80 events)
-- ============================================
INSERT INTO events (app_id, user_id, user_email, action, resource_type, resource_id, metadata, ip_address, user_agent, created_at)
SELECT 
    'webhook' as app_id,
    CONCAT('service_', FLOOR(1 + RAND() * 50)) as user_id,
    CONCAT('service', FLOOR(1 + RAND() * 50), '@webhook.com') as user_email,
    ELT(FLOOR(1 + RAND() * 4), 'webhook.trigger', 'webhook.deliver', 'webhook.fail', 'webhook.retry') as action,
    'webhook' as resource_type,
    CONCAT('wh_', FLOOR(100 + RAND() * 900)) as resource_id,
    JSON_OBJECT(
        'endpoint', CONCAT('https://api.example.com/webhook/', FLOOR(1 + RAND() * 10)),
        'status', ELT(FLOOR(1 + RAND() * 3), 'success', 'failed', 'pending'),
        'duration_ms', FLOOR(50 + RAND() * 950)
    ) as metadata,
    CONCAT('10.', FLOOR(RAND() * 255), '.', FLOOR(RAND() * 255), '.', FLOOR(RAND() * 255)) as ip_address,
    'WebhookWorker/1.0' as user_agent,
    DATE_ADD(@start_date, INTERVAL FLOOR(RAND() * 2592000) SECOND) as created_at
FROM 
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION 
     SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) t1,
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION 
     SELECT 6 UNION SELECT 7 UNION SELECT 8) t2
LIMIT 80;

-- ============================================
-- Authentication Events (100 events)
-- ============================================
INSERT INTO events (app_id, user_id, user_email, action, resource_type, resource_id, metadata, ip_address, user_agent, created_at)
SELECT 
    'authsvc' as app_id,
    CONCAT('user_', FLOOR(100 + RAND() * 900)) as user_id,
    CONCAT('user', FLOOR(100 + RAND() * 900), '@example.com') as user_email,
    ELT(FLOOR(1 + RAND() * 5), 'auth.login.success', 'auth.login.fail', 'auth.logout', 'auth.password.reset', 'auth.mfa.verify') as action,
    'auth' as resource_type,
    CONCAT('session_', FLOOR(1000 + RAND() * 9000)) as resource_id,
    JSON_OBJECT(
        'method', ELT(FLOOR(1 + RAND() * 3), 'password', 'google', 'sso'),
        'location', ELT(FLOOR(1 + RAND() * 4), 'US', 'EU', 'ASIA', 'OTHER')
    ) as metadata,
    CONCAT(FLOOR(192 + RAND() * 63), '.', FLOOR(RAND() * 255), '.', FLOOR(RAND() * 255), '.', FLOOR(RAND() * 255)) as ip_address,
    ELT(FLOOR(1 + RAND() * 3), 
        'Chrome/120.0.0.0',
        'Safari/17.0',
        'Firefox/121.0') as user_agent,
    DATE_ADD(@start_date, INTERVAL FLOOR(RAND() * 2592000) SECOND) as created_at
FROM 
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) t1,
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION 
     SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) t2,
    (SELECT 1 UNION SELECT 2) t3
LIMIT 100;

-- ============================================
-- Analytics Events (70 events)
-- ============================================
INSERT INTO events (app_id, user_id, user_email, action, resource_type, resource_id, metadata, ip_address, user_agent, created_at)
SELECT 
    'analytics' as app_id,
    CONCAT('analyst_', FLOOR(1 + RAND() * 20)) as user_id,
    CONCAT('analyst', FLOOR(1 + RAND() * 20), '@analytics.com') as user_email,
    ELT(FLOOR(1 + RAND() * 4), 'analytics.query.run', 'analytics.report.generate', 'analytics.dashboard.create', 'analytics.export') as action,
    'analytics' as resource_type,
    CONCAT('report_', FLOOR(100 + RAND() * 900)) as resource_id,
    JSON_OBJECT(
        'query_time_ms', FLOOR(100 + RAND() * 5000),
        'rows_returned', FLOOR(10 + RAND() * 10000),
        'report_type', ELT(FLOOR(1 + RAND() * 3), 'daily', 'weekly', 'monthly')
    ) as metadata,
    CONCAT('10.', FLOOR(RAND() * 255), '.', FLOOR(RAND() * 255), '.', FLOOR(RAND() * 255)) as ip_address,
    'AnalyticsEngine/2.0' as user_agent,
    DATE_ADD(@start_date, INTERVAL FLOOR(RAND() * 2592000) SECOND) as created_at
FROM 
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION 
     SELECT 6 UNION SELECT 7) t1,
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION 
     SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) t2
LIMIT 70;

-- ============================================
-- Storage Events (50 events)
-- ============================================
INSERT INTO events (app_id, user_id, user_email, action, resource_type, resource_id, metadata, ip_address, user_agent, created_at)
SELECT 
    'storage' as app_id,
    CONCAT('user_', FLOOR(100 + RAND() * 900)) as user_id,
    CONCAT('user', FLOOR(100 + RAND() * 900), '@example.com') as user_email,
    ELT(FLOOR(1 + RAND() * 5), 'storage.upload', 'storage.download', 'storage.delete', 'storage.share', 'storage.move') as action,
    'file' as resource_type,
    CONCAT('file_', FLOOR(1000 + RAND() * 9000)) as resource_id,
    JSON_OBJECT(
        'file_size_mb', ROUND(0.1 + RAND() * 100, 2),
        'file_type', ELT(FLOOR(1 + RAND() * 5), 'image', 'video', 'audio', 'document', 'archive'),
        'storage_class', ELT(FLOOR(1 + RAND() * 3), 'standard', 'cold', 'archive')
    ) as metadata,
    CONCAT(FLOOR(192 + RAND() * 63), '.', FLOOR(RAND() * 255), '.', FLOOR(RAND() * 255), '.', FLOOR(RAND() * 255)) as ip_address,
    'StorageClient/1.0' as user_agent,
    DATE_ADD(@start_date, INTERVAL FLOOR(RAND() * 2592000) SECOND) as created_at
FROM 
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) t1,
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION 
     SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) t2
LIMIT 50;

-- ============================================
-- 3. Create activity spikes (peak hour traffic)
-- ============================================

-- Insert additional events during peak hours (9 AM - 5 PM)
INSERT INTO events (app_id, user_id, user_email, action, resource_type, resource_id, created_at)
SELECT 
    ELT(FLOOR(1 + RAND() * 5), 'flexdok', 'webhook', 'authsvc', 'analytics', 'storage'),
    CONCAT('user_', FLOOR(100 + RAND() * 900)),
    CONCAT('user', FLOOR(100 + RAND() * 900), '@example.com'),
    ELT(FLOOR(1 + RAND() * 10), 
        'document.create', 'document.edit', 'document.view', 'user.login', 'user.logout',
        'auth.login.success', 'storage.upload', 'analytics.query.run', 'webhook.trigger', 'document.share'),
    ELT(FLOOR(1 + RAND() * 5), 'document', 'user', 'auth', 'file', 'webhook'),
    CONCAT('res_', FLOOR(1000 + RAND() * 9000)),
    DATE_ADD(DATE_ADD(@start_date, INTERVAL FLOOR(RAND() * 30) DAY), INTERVAL FLOOR(9 + RAND() * 8) HOUR)
FROM 
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) t1,
    (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) t2,
    (SELECT 1 UNION SELECT 2) t3
LIMIT 100;

-- ============================================
-- 4. Verify data
-- ============================================
SELECT '=== SEED COMPLETE ===' as Status;
SELECT COUNT(*) as total_apps FROM apps;
SELECT COUNT(*) as total_events FROM events;
SELECT action, COUNT(*) as count FROM events GROUP BY action ORDER BY count DESC LIMIT 10;
SELECT DATE(created_at) as date, COUNT(*) as events_per_day FROM events GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 10;
SELECT app_id, COUNT(*) as events_by_app FROM events GROUP BY app_id;