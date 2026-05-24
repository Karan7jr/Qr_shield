-- Create database
CREATE DATABASE IF NOT EXISTS qrshield_db;
USE qrshield_db;

-- Scans table
CREATE TABLE IF NOT EXISTS scans (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    raw_content     TEXT NOT NULL,
    content_type    VARCHAR(20) NOT NULL DEFAULT 'url',
    url             TEXT,
    domain          VARCHAR(255),
    is_https        BOOLEAN DEFAULT FALSE,
    is_shortener    BOOLEAN DEFAULT FALSE,
    risk_level      ENUM('low','medium','high','unknown') NOT NULL DEFAULT 'unknown',
    risk_score      INT DEFAULT 0,
    risk_reasons    TEXT,
    danger_keywords TEXT,
    ip_address      VARCHAR(45),
    user_agent      VARCHAR(500),
    scanned_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_risk_level (risk_level),
    INDEX idx_scanned_at (scanned_at)
);

-- Stats view
CREATE OR REPLACE VIEW scan_stats AS
SELECT
    COUNT(*)                     AS total_scans,
    SUM(risk_level = 'low')      AS low_risk,
    SUM(risk_level = 'medium')   AS medium_risk,
    SUM(risk_level = 'high')     AS high_risk,
    SUM(risk_level = 'unknown')  AS unknown_risk,
    DATE(MAX(scanned_at))        AS last_scan_date
FROM scans;