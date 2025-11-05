-- AI Prediction Test Data for existing database
-- Using your existing user_id=10 and categories

-- Add historical transactions for last 6 months for user_id=10
INSERT INTO transaction (user_id, category_id, description, amount, date) VALUES 
-- 6 months ago (May 2024)
(10, 1, 'Grocery Shopping', 320.50, '2024-05-05'),
(10, 1, 'Restaurant Dinner', 145.00, '2024-05-10'),
(10, 2, 'Gas Station', 160.00, '2024-05-15'),
(10, 3, 'Online Shopping', 289.99, '2024-05-20'),
(10, 4, 'Rent Payment', 1200.00, '2024-05-01'),

-- 5 months ago (June 2024)
(10, 1, 'Grocery Shopping', 335.75, '2024-06-05'),
(10, 1, 'Fast Food', 128.50, '2024-06-12'),
(10, 2, 'Public Transport', 145.00, '2024-06-18'),
(10, 3, 'Clothing Shopping', 450.00, '2024-06-25'),
(10, 4, 'Rent Payment', 1200.00, '2024-06-01'),

-- 4 months ago (July 2024)
(10, 1, 'Grocery Shopping', 342.30, '2024-07-03'),
(10, 1, 'Coffee Shop', 115.75, '2024-07-08'),
(10, 2, 'Gas Station', 165.00, '2024-07-15'),
(10, 3, 'Electronics', 599.99, '2024-07-22'),
(10, 4, 'Rent Payment', 1200.00, '2024-07-01'),

-- 3 months ago (August 2024)
(10, 1, 'Grocery Shopping', 328.90, '2024-08-02'),
(10, 1, 'Restaurant Lunch', 132.50, '2024-08-09'),
(10, 2, 'Uber Rides', 118.75, '2024-08-16'),
(10, 3, 'Books & Supplies', 245.99, '2024-08-23'),
(10, 4, 'Rent Payment', 1200.00, '2024-08-01'),

-- 2 months ago (September 2024)
(10, 1, 'Grocery Shopping', 355.20, '2024-09-04'),
(10, 1, 'Pizza Delivery', 122.99, '2024-09-11'),
(10, 2, 'Gas Station', 170.00, '2024-09-18'),
(10, 3, 'Home Supplies', 189.50, '2024-09-25'),
(10, 4, 'Rent Payment', 1200.00, '2024-09-01'),

-- 1 month ago (October 2024)
(10, 1, 'Grocery Shopping', 348.75, '2024-10-03'),
(10, 1, 'Restaurant Dinner', 167.50, '2024-10-10'),
(10, 2, 'Car Maintenance', 400.00, '2024-10-17'),
(10, 3, 'Online Shopping', 325.99, '2024-10-24'),
(10, 4, 'Rent Payment', 1200.00, '2024-10-01'),

-- Add some income for user_id=10
(10, 5, 'Monthly Salary', 5000.00, '2024-10-01'),
(10, 5, 'Monthly Salary', 5000.00, '2024-09-01'),
(10, 5, 'Monthly Salary', 5000.00, '2024-08-01'),
(10, 5, 'Monthly Salary', 5000.00, '2024-07-01'),
(10, 5, 'Monthly Salary', 5000.00, '2024-06-01'),
(10, 5, 'Monthly Salary', 5000.00, '2024-05-01');

-- Verify the data
SELECT 'Monthly Expense Summary' as Info;
SELECT 
    DATE_FORMAT(date, '%Y-%m') as month,
    COUNT(*) as transaction_count,
    SUM(CASE WHEN c.transaction_type_id = 1 THEN amount ELSE 0 END) as total_expenses
FROM transaction t 
JOIN category c ON t.category_id = c.category_id 
WHERE t.user_id = 10 
GROUP BY DATE_FORMAT(date, '%Y-%m') 
ORDER BY month DESC;

SELECT 'Category-wise Expenses' as Info;
SELECT 
    c.category_name,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount
FROM transaction t 
JOIN category c ON t.category_id = c.category_id 
WHERE t.user_id = 10 AND c.transaction_type_id = 1
GROUP BY c.category_name 
ORDER BY total_amount DESC;