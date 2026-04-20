import React, { useState } from 'react';
import '../assets/styles/user.css';

function Budgets() {
    const [budgets, setBudgets] = useState([
        {
            id: 1,
            category: 'Food & Dining',
            month: 'January',
            year: '2024',
            limit: 500,
            spent: 320,
            remaining: 180
        },
        {
            id: 2,
            category: 'Transportation',
            month: 'January',
            year: '2024',
            limit: 200,
            spent: 150,
            remaining: 50
        }
    ]);

    const [formData, setFormData] = useState({
        month: '',
        year: '',
        category: '',
        limit: '',
        spent: ''
    });

    const [editingId, setEditingId] = useState(null);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            setBudgets(budgets.map(budget => 
                budget.id === editingId 
                    ? {
                        ...budget,
                        category: formData.category,
                        month: formData.month,
                        year: formData.year,
                        limit: parseFloat(formData.limit),
                        spent: parseFloat(formData.spent || 0),
                        remaining: parseFloat(formData.limit) - parseFloat(formData.spent || 0)
                    }
                    : budget
            ));
            setEditingId(null);
        } else {
            const newBudget = {
                id: Date.now(),
                category: formData.category,
                month: formData.month,
                year: formData.year,
                limit: parseFloat(formData.limit),
                spent: parseFloat(formData.spent || 0),
                remaining: parseFloat(formData.limit) - parseFloat(formData.spent || 0)
            };
            setBudgets([...budgets, newBudget]);
        }
        setFormData({ month: '', year: '', category: '', limit: '', spent: '' });
    };

    const handleEdit = (id) => {
        const budget = budgets.find(b => b.id === id);
        if (budget) {
            setFormData({
                month: budget.month,
                year: budget.year,
                category: budget.category,
                limit: budget.limit.toString(),
                spent: budget.spent.toString()
            });
            setEditingId(id);
        }
    };

    const handleDelete = (id) => {
        setBudgets(budgets.filter(budget => budget.id !== id));
    };

    return (
        <div>
            <div className="modern-header">
                <div className="header-left">
                    <h1 className="page-title">🪙 Monthly Budgets</h1>
                </div>
            </div>

            <div className="st-header">
                <h2>Add New Budget</h2>
            </div>

            <div className="modern-transaction-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-section">
                            <label className="section-label">Month</label>
                            <select 
                                name="month" 
                                className="modern-select" 
                                value={formData.month}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Month</option>
                                <option value="January">January</option>
                                <option value="February">February</option>
                                <option value="March">March</option>
                                <option value="April">April</option>
                                <option value="May">May</option>
                                <option value="June">June</option>
                                <option value="July">July</option>
                                <option value="August">August</option>
                                <option value="September">September</option>
                                <option value="October">October</option>
                                <option value="November">November</option>
                                <option value="December">December</option>
                            </select>
                        </div>
                        <div className="form-section">
                            <label className="section-label">Year</label>
                            <select 
                                name="year" 
                                className="modern-select" 
                                value={formData.year}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Year</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-section">
                            <label className="section-label">Category</label>
                            <select 
                                name="category" 
                                className="modern-select" 
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="Food & Dining">Food & Dining</option>
                                <option value="Transportation">Transportation</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Bills & Utilities">Bills & Utilities</option>
                            </select>
                        </div>
                        <div className="form-section">
                            <label className="section-label">Budget Limit</label>
                            <input 
                                type="number" 
                                name="limit" 
                                className="modern-input" 
                                placeholder="Enter budget limit"
                                value={formData.limit}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-section">
                            <label className="section-label">Amount Spent</label>
                            <input 
                                type="number" 
                                name="spent" 
                                className="modern-input" 
                                placeholder="Enter amount spent"
                                value={formData.spent}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-section">
                            {/* Empty section for layout balance */}
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="save-btn">{editingId ? 'Update Budget' : 'Add Budget'}</button>
                    </div>
                </form>
            </div>

            <div className="st-list">
                {budgets.map(budget => (
                    <div key={budget.id} className="st-card">
                        <div className="st-card-header">
                            <div className="st-card-info">
                                <h4>{budget.category}</h4>
                                <p>{budget.month} {budget.year}</p>
                            </div>
                        </div>
                        <div className="budget-details">
                            <div className="budget-row">
                                <span>Spent:</span>
                                <span className="expense-indicator">${budget.spent}</span>
                            </div>
                            <div className="budget-row">
                                <span>Limit:</span>
                                <span>${budget.limit}</span>
                            </div>
                            <div className="budget-row">
                                <span>Remaining:</span>
                                <span className="income-indicator">${budget.remaining}</span>
                            </div>
                        </div>
                        <div className="st-card-actions">
                            <button className="btn-edit" onClick={() => handleEdit(budget.id)}>
                                Edit
                            </button>
                            <button className="btn-skip" onClick={() => handleDelete(budget.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Budgets;