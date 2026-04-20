-- Fix Budget Table Structure
-- Run this if budget save is failing

-- Check if table exists
SELECT 'Checking budget table...' AS status;
SHOW TABLES LIKE 'budget';

-- If table doesn't exist, create it
CREATE TABLE IF NOT EXISTS budget (
    budget_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    category VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    spent DECIMAL(10,2) DEFAULT 0,
    month INT NOT NULL,
    year BIGINT NOT NULL,
    INDEX idx_user_month_year (user_id, month, year)
);

-- Ensure budget_id is auto-increment
ALTER TABLE budget MODIFY budget_id BIGINT AUTO_INCREMENT;

-- Show table structure
DESCRIBE budget;

-- Test insert (replace user_id with your actual user ID)
INSERT INTO budget (user_id, category, amount, spent, month, year) 
VALUES (1, 'General', 5000.00, 0.00, 12, 2024)
ON DUPLICATE KEY UPDATE 
    amount = 5000.00,
    spent = 0.00;

-- Verify insert
SELECT * FROM budget WHERE user_id = 1 AND month = 12 AND year = 2024;

-- If you see the record above, the table is working correctly!
SELECT 'Budget table is ready!' AS status;
