-- Clean duplicate budgets (Safe Mode Compatible)
USE expensetracker;

-- Disable safe mode
SET SQL_SAFE_UPDATES = 0;

-- See duplicates first
SELECT user_id, month, year, COUNT(*) as count, GROUP_CONCAT(budget_id) as ids
FROM budget
GROUP BY user_id, month, year
HAVING count > 1;

-- Delete duplicates, keep latest
DELETE b1 FROM budget b1
INNER JOIN budget b2 
WHERE b1.user_id = b2.user_id 
  AND b1.month = b2.month 
  AND b1.year = b2.year 
  AND b1.budget_id < b2.budget_id;

-- Add unique constraint
ALTER TABLE budget 
ADD UNIQUE KEY unique_user_month_year (user_id, month, year);

-- Re-enable safe mode
SET SQL_SAFE_UPDATES = 1;

-- Verify
SELECT 'Duplicates cleaned!' AS status;
SELECT * FROM budget ORDER BY budget_id DESC LIMIT 10;
