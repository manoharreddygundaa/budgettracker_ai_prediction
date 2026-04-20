-- Sample data for Budget table
INSERT INTO budget (budget_id, user_id, category, amount, spent, month, year) VALUES
(1, 1, 'Food & Dining', 500.00, 320.50, 1, 2024),
(2, 1, 'Transportation', 200.00, 150.75, 1, 2024),
(3, 1, 'Shopping', 300.00, 180.25, 1, 2024),
(4, 1, 'Entertainment', 150.00, 95.00, 1, 2024),
(5, 1, 'Bills & Utilities', 400.00, 385.60, 1, 2024),
(6, 2, 'Food & Dining', 600.00, 420.30, 1, 2024),
(7, 2, 'Transportation', 250.00, 180.50, 1, 2024),
(8, 2, 'Healthcare', 200.00, 125.75, 1, 2024);

-- Sample data for Savings table
INSERT INTO savings (savings_id, user_id, goal_name, target_amount, saved_amount, deadline) VALUES
(1, 1, 'Emergency Fund', 5000.00, 3200.00, '2024-12-31'),
(2, 1, 'Vacation Trip', 2000.00, 800.00, '2024-06-15'),
(3, 1, 'New Laptop', 1500.00, 450.00, '2024-08-30'),
(4, 1, 'Car Down Payment', 8000.00, 2400.00, '2025-03-15'),
(5, 2, 'Wedding Fund', 15000.00, 7500.00, '2024-10-20'),
(6, 2, 'Home Renovation', 10000.00, 3500.00, '2024-09-01'),
(7, 2, 'Investment Portfolio', 5000.00, 1200.00, '2024-12-31');