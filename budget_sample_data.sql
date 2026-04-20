-- Sample data for Budget table
-- Disable safe update mode temporarily
SET SQL_SAFE_UPDATES = 0;

-- Fix budget_id to be auto-increment
ALTER TABLE budget MODIFY budget_id BIGINT AUTO_INCREMENT;

-- Clear existing sample data
DELETE FROM budget WHERE user_id IN (1, 2, 13);

INSERT INTO budget (user_id, category, amount, spent, month, year) VALUES
(1, 'Food & Dining', 500.00, 320.50, 1, 2024),
(1, 'Transportation', 200.00, 150.75, 1, 2024),
(1, 'Shopping', 300.00, 180.25, 1, 2024),
(1, 'Entertainment', 150.00, 95.00, 1, 2024),
(1, 'Bills & Utilities', 400.00, 385.60, 1, 2024),
(2, 'Food & Dining', 600.00, 420.30, 1, 2024),
(2, 'Transportation', 250.00, 180.50, 1, 2024),
(2, 'Healthcare', 200.00, 125.75, 1, 2024),
(13, 'Food & Dining', 450.00, 280.75, 1, 2024),
(13, 'Transportation', 180.00, 120.50, 1, 2024),
(13, 'Shopping', 250.00, 165.25, 1, 2024),
(13, 'Entertainment', 120.00, 85.00, 1, 2024),
(13, 'Bills & Utilities', 350.00, 310.80, 1, 2024);

-- Re-enable safe update mode
SET SQL_SAFE_UPDATES = 1;