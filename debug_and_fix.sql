-- Debug and fix the AI prediction issue

-- 1. Check current data
SELECT 'Current Users' as Info;
SELECT id, username, email FROM users;

SELECT 'Transaction Types' as Info;
SELECT * FROM transaction_type;

SELECT 'Categories and their types' as Info;
SELECT c.*, tt.transaction_type_name 
FROM category c 
JOIN transaction_type tt ON c.transaction_type_id = tt.transaction_type_id;

SELECT 'Transactions for user_id=10' as Info;
SELECT COUNT(*) as total_transactions, 
       MIN(date) as earliest, 
       MAX(date) as latest 
FROM transaction 
WHERE user_id = 10;

-- 2. Fix the transaction type issue
-- Update categories to use correct transaction type IDs
UPDATE category SET transaction_type_id = 2 WHERE category_name IN ('Food', 'Transport', 'Shopping', 'Rent');
UPDATE category SET transaction_type_id = 1 WHERE category_name = 'Salary';

-- 3. Add more recent data (last 6 months from current date)
INSERT INTO transaction (user_id, category_id, description, amount, date) VALUES 
-- Recent data for better AI prediction
(10, 1, 'Grocery Store', 450.00, DATE_SUB(CURDATE(), INTERVAL 1 MONTH)),
(10, 1, 'Restaurant', 200.00, DATE_SUB(CURDATE(), INTERVAL 1 MONTH)),
(10, 2, 'Gas Station', 180.00, DATE_SUB(CURDATE(), INTERVAL 1 MONTH)),
(10, 3, 'Online Shopping', 350.00, DATE_SUB(CURDATE(), INTERVAL 1 MONTH)),
(10, 4, 'Monthly Rent', 1200.00, DATE_SUB(CURDATE(), INTERVAL 1 MONTH)),

(10, 1, 'Grocery Store', 420.00, DATE_SUB(CURDATE(), INTERVAL 2 MONTH)),
(10, 1, 'Fast Food', 150.00, DATE_SUB(CURDATE(), INTERVAL 2 MONTH)),
(10, 2, 'Public Transport', 160.00, DATE_SUB(CURDATE(), INTERVAL 2 MONTH)),
(10, 3, 'Shopping Mall', 400.00, DATE_SUB(CURDATE(), INTERVAL 2 MONTH)),
(10, 4, 'Monthly Rent', 1200.00, DATE_SUB(CURDATE(), INTERVAL 2 MONTH)),

(10, 1, 'Grocery Store', 480.00, DATE_SUB(CURDATE(), INTERVAL 3 MONTH)),
(10, 1, 'Coffee Shop', 120.00, DATE_SUB(CURDATE(), INTERVAL 3 MONTH)),
(10, 2, 'Gas Station', 190.00, DATE_SUB(CURDATE(), INTERVAL 3 MONTH)),
(10, 3, 'Electronics', 600.00, DATE_SUB(CURDATE(), INTERVAL 3 MONTH)),
(10, 4, 'Monthly Rent', 1200.00, DATE_SUB(CURDATE(), INTERVAL 3 MONTH));

-- 4. Verify the fix
SELECT 'Final Verification' as Info;
SELECT 
    DATE_FORMAT(t.date, '%Y-%m') as month,
    c.category_name,
    c.transaction_type_id,
    tt.transaction_type_name,
    COUNT(*) as count,
    SUM(t.amount) as total
FROM transaction t
JOIN category c ON t.category_id = c.category_id
JOIN transaction_type tt ON c.transaction_type_id = tt.transaction_type_id
WHERE t.user_id = 10 
  AND t.date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
GROUP BY DATE_FORMAT(t.date, '%Y-%m'), c.category_name, c.transaction_type_id, tt.transaction_type_name
ORDER BY month DESC, total DESC;