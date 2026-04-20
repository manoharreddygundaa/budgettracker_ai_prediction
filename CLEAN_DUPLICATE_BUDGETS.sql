-- Clean up duplicate budget records
-- Run this to remove duplicates

USE expensetracker;

-- Step 1: See the duplicates
SELECT user_id, month, year, COUNT(*) as count
FROM budget
GROUP BY user_id, month, year
HAVING count > 1;

-- Step 2: Keep only the latest record for each user/month/year
DELETE b1 FROM budget b1
INNER JOIN budget b2 
WHERE b1.user_id = b2.user_id 
  AND b1.month = b2.month 
  AND b1.year = b2.year 
  AND b1.budget_id < b2.budget_id;

-- Step 3: Add unique constraint to prevent future duplicates
ALTER TABLE budget 
ADD UNIQUE KEY unique_user_month_year (user_id, month, year);

-- Step 4: Verify - should return no rows
SELECT user_id, month, year, COUNT(*) as count
FROM budget
GROUP BY user_id, month, year
HAVING count > 1;

SELECT 'Duplicates cleaned!' AS status;
