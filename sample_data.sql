-- Sample data for testing AI Expense Prediction
-- Run this after your application has created the basic schema

-- Insert sample user (if not exists)
INSERT IGNORE INTO users (id, email, password, username, enabled, verification_code, verification_code_expires_at) 
VALUES (1, 'test@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HI/2/VQ1vqh4Atle/0EUA', 'testuser', 1, NULL, NULL);

-- Insert transaction types (if not exists)
INSERT IGNORE INTO transaction_type (transaction_type_id, transaction_type_name) VALUES 
(1, 'TYPE_INCOME'),
(2, 'TYPE_EXPENSE');

-- Insert sample categories
INSERT IGNORE INTO category (category_id, category_name, transaction_type_id, enabled) VALUES 
(1, 'Food & Dining', 2, 1),
(2, 'Transportation', 2, 1),
(3, 'Shopping', 2, 1),
(4, 'Entertainment', 2, 1),
(5, 'Bills & Utilities', 2, 1),
(6, 'Healthcare', 2, 1),
(7, 'Salary', 1, 1),
(8, 'Freelance', 1, 1);

-- Insert sample transactions for the last 6 months
-- Month 1 (6 months ago)
INSERT INTO transaction (user_id, category_id, description, amount, date) VALUES 
(1, 1, 'Grocery Shopping', 120.50, DATE_SUB(CURDATE(), INTERVAL 6 MONTH)),
(1, 1, 'Restaurant Dinner', 45.00, DATE_SUB(CURDATE(), INTERVAL 6 MONTH)),
(1, 2, 'Gas Station', 60.00, DATE_SUB(CURDATE(), INTERVAL 6 MONTH)),
(1, 3, 'Online Shopping', 89.99, DATE_SUB(CURDATE(), INTERVAL 6 MONTH)),
(1, 4, 'Movie Tickets', 25.00, DATE_SUB(CURDATE(), INTERVAL 6 MONTH)),
(1, 5, 'Electricity Bill', 85.00, DATE_SUB(CURDATE(), INTERVAL 6 MONTH));

-- Month 2 (5 months ago)
INSERT INTO transaction (user_id, category_id, description, amount, date) VALUES 
(1, 1, 'Grocery Shopping', 135.75, DATE_SUB(CURDATE(), INTERVAL 5 MONTH)),
(1, 1, 'Fast Food', 28.50, DATE_SUB(CURDATE(), INTERVAL 5 MONTH)),
(1, 2, 'Public Transport', 45.00, DATE_SUB(CURDATE(), INTERVAL 5 MONTH)),
(1, 3, 'Clothing', 150.00, DATE_SUB(CURDATE(), INTERVAL 5 MONTH)),
(1, 4, 'Concert Tickets', 75.00, DATE_SUB(CURDATE(), INTERVAL 5 MONTH)),
(1, 5, 'Internet Bill', 50.00, DATE_SUB(CURDATE(), INTERVAL 5 MONTH)),
(1, 6, 'Pharmacy', 35.25, DATE_SUB(CURDATE(), INTERVAL 5 MONTH));

-- Month 3 (4 months ago)
INSERT INTO transaction (user_id, category_id, description, amount, date) VALUES 
(1, 1, 'Grocery Shopping', 142.30, DATE_SUB(CURDATE(), INTERVAL 4 MONTH)),
(1, 1, 'Coffee Shop', 15.75, DATE_SUB(CURDATE(), INTERVAL 4 MONTH)),
(1, 2, 'Gas Station', 65.00, DATE_SUB(CURDATE(), INTERVAL 4 MONTH)),
(1, 3, 'Electronics', 299.99, DATE_SUB(CURDATE(), INTERVAL 4 MONTH)),
(1, 4, 'Streaming Service', 12.99, DATE_SUB(CURDATE(), INTERVAL 4 MONTH)),
(1, 5, 'Phone Bill', 40.00, DATE_SUB(CURDATE(), INTERVAL 4 MONTH)),
(1, 6, 'Doctor Visit', 120.00, DATE_SUB(CURDATE(), INTERVAL 4 MONTH));

-- Month 4 (3 months ago)
INSERT INTO transaction (user_id, category_id, description, amount, date) VALUES 
(1, 1, 'Grocery Shopping', 128.90, DATE_SUB(CURDATE(), INTERVAL 3 MONTH)),
(1, 1, 'Restaurant Lunch', 32.50, DATE_SUB(CURDATE(), INTERVAL 3 MONTH)),
(1, 2, 'Uber Ride', 18.75, DATE_SUB(CURDATE(), INTERVAL 3 MONTH)),
(1, 3, 'Books', 45.99, DATE_SUB(CURDATE(), INTERVAL 3 MONTH)),
(1, 4, 'Gaming', 59.99, DATE_SUB(CURDATE(), INTERVAL 3 MONTH)),
(1, 5, 'Water Bill', 30.00, DATE_SUB(CURDATE(), INTERVAL 3 MONTH)),
(1, 6, 'Dental Checkup', 150.00, DATE_SUB(CURDATE(), INTERVAL 3 MONTH));

-- Month 5 (2 months ago)
INSERT INTO transaction (user_id, category_id, description, amount, date) VALUES 
(1, 1, 'Grocery Shopping', 155.20, DATE_SUB(CURDATE(), INTERVAL 2 MONTH)),
(1, 1, 'Pizza Delivery', 22.99, DATE_SUB(CURDATE(), INTERVAL 2 MONTH)),
(1, 2, 'Gas Station', 70.00, DATE_SUB(CURDATE(), INTERVAL 2 MONTH)),
(1, 3, 'Home Supplies', 89.50, DATE_SUB(CURDATE(), INTERVAL 2 MONTH)),
(1, 4, 'Sports Event', 85.00, DATE_SUB(CURDATE(), INTERVAL 2 MONTH)),
(1, 5, 'Insurance', 125.00, DATE_SUB(CURDATE(), INTERVAL 2 MONTH)),
(1, 6, 'Prescription', 25.75, DATE_SUB(CURDATE(), INTERVAL 2 MONTH));

-- Month 6 (1 month ago)
INSERT INTO transaction (user_id, category_id, description, amount, date) VALUES 
(1, 1, 'Grocery Shopping', 148.75, DATE_SUB(CURDATE(), INTERVAL 1 MONTH)),
(1, 1, 'Restaurant Dinner', 67.50, DATE_SUB(CURDATE(), INTERVAL 1 MONTH)),
(1, 2, 'Car Maintenance', 200.00, DATE_SUB(CURDATE(), INTERVAL 1 MONTH)),
(1, 3, 'Online Shopping', 125.99, DATE_SUB(CURDATE(), INTERVAL 1 MONTH)),
(1, 4, 'Gym Membership', 35.00, DATE_SUB(CURDATE(), INTERVAL 1 MONTH)),
(1, 5, 'Rent', 800.00, DATE_SUB(CURDATE(), INTERVAL 1 MONTH)),
(1, 6, 'Eye Exam', 95.00, DATE_SUB(CURDATE(), INTERVAL 1 MONTH));

-- Add some income transactions for completeness
INSERT INTO transaction (user_id, category_id, description, amount, date) VALUES 
(1, 7, 'Monthly Salary', 3500.00, DATE_SUB(CURDATE(), INTERVAL 1 MONTH)),
(1, 7, 'Monthly Salary', 3500.00, DATE_SUB(CURDATE(), INTERVAL 2 MONTH)),
(1, 7, 'Monthly Salary', 3500.00, DATE_SUB(CURDATE(), INTERVAL 3 MONTH)),
(1, 8, 'Freelance Project', 500.00, DATE_SUB(CURDATE(), INTERVAL 2 MONTH)),
(1, 8, 'Freelance Project', 750.00, DATE_SUB(CURDATE(), INTERVAL 4 MONTH));

-- Verify the data
SELECT 'Transaction Count by Month' as Info;
SELECT 
    DATE_FORMAT(date, '%Y-%m') as month,
    COUNT(*) as transaction_count,
    SUM(CASE WHEN c.transaction_type_id = 2 THEN amount ELSE 0 END) as total_expenses
FROM transaction t 
JOIN category c ON t.category_id = c.category_id 
WHERE t.user_id = 1 
GROUP BY DATE_FORMAT(date, '%Y-%m') 
ORDER BY month DESC;

SELECT 'Expense Categories' as Info;
SELECT 
    c.category_name,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount
FROM transaction t 
JOIN category c ON t.category_id = c.category_id 
WHERE t.user_id = 1 AND c.transaction_type_id = 2
GROUP BY c.category_name 
ORDER BY total_amount DESC;