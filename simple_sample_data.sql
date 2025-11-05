-- First, check what categories exist in your database
SELECT * FROM category;
SELECT * FROM transaction_type;
SELECT * FROM users;

-- Use existing categories from your database
-- Replace the category_id values below with actual IDs from your category table

-- Sample transactions using existing categories (update category_id values as needed)
INSERT INTO transaction (user_id, category_id, description, amount, date) VALUES 
-- 6 months ago
(1, 1, 'Grocery Shopping', 120.50, '2024-05-05'),
(1, 1, 'Restaurant', 45.00, '2024-05-10'),
(1, 2, 'Gas Station', 60.00, '2024-05-15'),
(1, 3, 'Shopping', 89.99, '2024-05-20'),

-- 5 months ago  
(1, 1, 'Grocery Shopping', 135.75, '2024-06-05'),
(1, 1, 'Fast Food', 28.50, '2024-06-12'),
(1, 2, 'Transport', 45.00, '2024-06-18'),
(1, 3, 'Clothing', 150.00, '2024-06-25'),

-- 4 months ago
(1, 1, 'Grocery Shopping', 142.30, '2024-07-03'),
(1, 1, 'Coffee Shop', 15.75, '2024-07-08'),
(1, 2, 'Gas Station', 65.00, '2024-07-15'),
(1, 3, 'Electronics', 299.99, '2024-07-22'),

-- 3 months ago
(1, 1, 'Grocery Shopping', 128.90, '2024-08-02'),
(1, 1, 'Restaurant', 32.50, '2024-08-09'),
(1, 2, 'Uber Ride', 18.75, '2024-08-16'),
(1, 3, 'Books', 45.99, '2024-08-23'),

-- 2 months ago
(1, 1, 'Grocery Shopping', 155.20, '2024-09-04'),
(1, 1, 'Pizza', 22.99, '2024-09-11'),
(1, 2, 'Gas Station', 70.00, '2024-09-18'),
(1, 3, 'Home Supplies', 89.50, '2024-09-25'),

-- 1 month ago
(1, 1, 'Grocery Shopping', 148.75, '2024-10-03'),
(1, 1, 'Restaurant', 67.50, '2024-10-10'),
(1, 2, 'Car Service', 200.00, '2024-10-17'),
(1, 3, 'Online Shopping', 125.99, '2024-10-24');

-- Check the inserted data
SELECT 
    DATE_FORMAT(date, '%Y-%m') as month,
    COUNT(*) as count,
    SUM(amount) as total
FROM transaction 
WHERE user_id = 1 
GROUP BY DATE_FORMAT(date, '%Y-%m') 
ORDER BY month;