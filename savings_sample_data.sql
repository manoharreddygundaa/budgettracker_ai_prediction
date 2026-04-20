-- Sample data for Savings table
-- Disable safe update mode temporarily
SET SQL_SAFE_UPDATES = 0;

-- Fix savings_id to be auto-increment
ALTER TABLE savings MODIFY savings_id BIGINT AUTO_INCREMENT;

-- Clear existing sample data
DELETE FROM savings WHERE user_id IN (1, 2, 13);

INSERT INTO savings (user_id, goal_name, target_amount, saved_amount, deadline) VALUES
(1, 'Emergency Fund', 5000.00, 3200.00, '2024-12-31'),
(1, 'Vacation Trip', 2000.00, 800.00, '2024-06-15'),
(1, 'New Laptop', 1500.00, 450.00, '2024-08-30'),
(1, 'Car Down Payment', 8000.00, 2400.00, '2025-03-15'),
(2, 'Wedding Fund', 15000.00, 7500.00, '2024-10-20'),
(2, 'Home Renovation', 10000.00, 3500.00, '2024-09-01'),
(2, 'Investment Portfolio', 5000.00, 1200.00, '2024-12-31'),
(13, 'Emergency Fund', 3000.00, 1800.00, '2024-11-30'),
(13, 'New Phone', 800.00, 320.00, '2024-07-15'),
(13, 'Vacation Fund', 2500.00, 950.00, '2024-09-30'),
(13, 'Education Course', 1200.00, 600.00, '2024-08-15');

-- Re-enable safe update mode
SET SQL_SAFE_UPDATES = 1;