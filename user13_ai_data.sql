-- AI Prediction Test Data for user_id=13

-- Add historical transactions for last 6 months for user_id=13
INSERT INTO transaction (user_id, category_id, description, amount, date) VALUES 
-- 6 months ago
(13, 1, 'Grocery Shopping', 420.50, DATE_SUB(CURDATE(), INTERVAL 6 MONTH)),
(13, 1, 'Restaurant Dinner', 245.00, DATE_SUB(CURDATE(), INTERVAL 6 MONTH)),
(13, 2, 'Gas Station', 260.00, DATE_SUB(CURDATE(), INTERVAL 6 MONTH)),
(13, 3, 'Online Shopping', 389.99, DATE_SUB(CURDATE(), INTERVAL 6 MONTH)),
(13, 4, 'Rent Payment', 1500.00, DATE_SUB(CURDATE(), INTERVAL 6 MONTH)),

-- 5 months ago
(13, 1, 'Grocery Shopping', 435.75, DATE_SUB(CURDATE(), INTERVAL 5 MONTH)),
(13, 1, 'Fast Food', 228.50, DATE_SUB(CURDATE(), INTERVAL 5 MONTH)),
(13, 2, 'Public Transport', 245.00, DATE_SUB(CURDATE(), INTERVAL 5 MONTH)),
(13, 3, 'Clothing Shopping', 550.00, DATE_SUB(CURDATE(), INTERVAL 5 MONTH)),
(13, 4, 'Rent Payment', 1500.00, DATE_SUB(CURDATE(), INTERVAL 5 MONTH)),

-- 4 months ago
(13, 1, 'Grocery Shopping', 442.30, DATE_SUB(CURDATE(), INTERVAL 4 MONTH)),
(13, 1, 'Coffee Shop', 215.75, DATE_SUB(CURDATE(), INTERVAL 4 MONTH)),
(13, 2, 'Gas Station', 265.00, DATE_SUB(CURDATE(), INTERVAL 4 MONTH)),
(13, 3, 'Electronics', 799.99, DATE_SUB(CURDATE(), INTERVAL 4 MONTH)),
(13, 4, 'Rent Payment', 1500.00, DATE_SUB(CURDATE(), INTERVAL 4 MONTH)),

-- 3 months ago
(13, 1, 'Grocery Shopping', 428.90, DATE_SUB(CURDATE(), INTERVAL 3 MONTH)),
(13, 1, 'Restaurant Lunch', 232.50, DATE_SUB(CURDATE(), INTERVAL 3 MONTH)),
(13, 2, 'Uber Rides', 218.75, DATE_SUB(CURDATE(), INTERVAL 3 MONTH)),
(13, 3, 'Books & Supplies', 345.99, DATE_SUB(CURDATE(), INTERVAL 3 MONTH)),
(13, 4, 'Rent Payment', 1500.00, DATE_SUB(CURDATE(), INTERVAL 3 MONTH)),

-- 2 months ago
(13, 1, 'Grocery Shopping', 455.20, DATE_SUB(CURDATE(), INTERVAL 2 MONTH)),
(13, 1, 'Pizza Delivery', 222.99, DATE_SUB(CURDATE(), INTERVAL 2 MONTH)),
(13, 2, 'Gas Station', 270.00, DATE_SUB(CURDATE(), INTERVAL 2 MONTH)),
(13, 3, 'Home Supplies', 289.50, DATE_SUB(CURDATE(), INTERVAL 2 MONTH)),
(13, 4, 'Rent Payment', 1500.00, DATE_SUB(CURDATE(), INTERVAL 2 MONTH)),

-- 1 month ago
(13, 1, 'Grocery Shopping', 448.75, DATE_SUB(CURDATE(), INTERVAL 1 MONTH)),
(13, 1, 'Restaurant Dinner', 267.50, DATE_SUB(CURDATE(), INTERVAL 1 MONTH)),
(13, 2, 'Car Maintenance', 500.00, DATE_SUB(CURDATE(), INTERVAL 1 MONTH)),
(13, 3, 'Online Shopping', 425.99, DATE_SUB(CURDATE(), INTERVAL 1 MONTH)),
(13, 4, 'Rent Payment', 1500.00, DATE_SUB(CURDATE(), INTERVAL 1 MONTH)),

-- Add some income for user_id=13
(13, 5, 'Monthly Salary', 6000.00, DATE_SUB(CURDATE(), INTERVAL 1 MONTH)),
(13, 5, 'Monthly Salary', 6000.00, DATE_SUB(CURDATE(), INTERVAL 2 MONTH)),
(13, 5, 'Monthly Salary', 6000.00, DATE_SUB(CURDATE(), INTERVAL 3 MONTH)),
(13, 5, 'Monthly Salary', 6000.00, DATE_SUB(CURDATE(), INTERVAL 4 MONTH)),
(13, 5, 'Monthly Salary', 6000.00, DATE_SUB(CURDATE(), INTERVAL 5 MONTH)),
(13, 5, 'Monthly Salary', 6000.00, DATE_SUB(CURDATE(), INTERVAL 6 MONTH));

-- Verify the data for user_id=13
SELECT 'Monthly Expense Summary for User 13' as Info;
SELECT 
    DATE_FORMAT(date, '%Y-%m') as month,
    COUNT(*) as transaction_count,
    SUM(CASE WHEN c.transaction_type_id = 1 THEN amount ELSE 0 END) as total_expenses
FROM transaction t 
JOIN category c ON t.category_id = c.category_id 
WHERE t.user_id = 13 
GROUP BY DATE_FORMAT(date, '%Y-%m') 
ORDER BY month DESC;

SELECT 'Category-wise Expenses for User 13' as Info;
SELECT 
    c.category_name,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount
FROM transaction t 
JOIN category c ON t.category_id = c.category_id 
WHERE t.user_id = 13 AND c.transaction_type_id = 1
GROUP BY c.category_name 
ORDER BY total_amount DESC;