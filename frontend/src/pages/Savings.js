import React, { useState } from 'react';
import '../assets/styles/user.css';

function Savings() {
    const [goals, setGoals] = useState([
        {
            id: 1,
            name: 'Emergency Fund',
            target: 5000,
            saved: 3200,
            deadline: '2024-12-31',
            remaining: 1800
        },
        {
            id: 2,
            name: 'Vacation Trip',
            target: 2000,
            saved: 800,
            deadline: '2024-06-15',
            remaining: 1200
        }
    ]);

    const [formData, setFormData] = useState({
        name: '',
        target: '',
        saved: '',
        deadline: ''
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
        const target = parseFloat(formData.target);
        const saved = parseFloat(formData.saved);
        
        if (editingId) {
            setGoals(goals.map(goal => 
                goal.id === editingId 
                    ? {
                        ...goal,
                        name: formData.name,
                        target: target,
                        saved: saved,
                        deadline: formData.deadline,
                        remaining: target - saved
                    }
                    : goal
            ));
            setEditingId(null);
        } else {
            const newGoal = {
                id: Date.now(),
                name: formData.name,
                target: target,
                saved: saved,
                deadline: formData.deadline,
                remaining: target - saved
            };
            setGoals([...goals, newGoal]);
        }
        setFormData({ name: '', target: '', saved: '', deadline: '' });
    };

    const handleEdit = (id) => {
        const goal = goals.find(g => g.id === id);
        if (goal) {
            setFormData({
                name: goal.name,
                target: goal.target.toString(),
                saved: goal.saved.toString(),
                deadline: goal.deadline
            });
            setEditingId(id);
        }
    };

    const handleDelete = (id) => {
        setGoals(goals.filter(goal => goal.id !== id));
    };

    const getProgressPercentage = (saved, target) => {
        return Math.min((saved / target) * 100, 100);
    };

    return (
        <div>
            <div className="modern-header">
                <div className="header-left">
                    <h1 className="page-title">🎯 Savings Goals Tracker</h1>
                </div>
            </div>

            <div className="st-header">
                <h2>Add New Savings Goal</h2>
            </div>

            <div className="modern-transaction-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-section">
                            <label className="section-label">Goal Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                className="modern-input" 
                                placeholder="Enter goal name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-section">
                            <label className="section-label">Target Amount</label>
                            <input 
                                type="number" 
                                name="target" 
                                className="modern-input" 
                                placeholder="Enter target amount"
                                value={formData.target}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-section">
                            <label className="section-label">Saved Amount</label>
                            <input 
                                type="number" 
                                name="saved" 
                                className="modern-input" 
                                placeholder="Enter saved amount"
                                value={formData.saved}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-section">
                            <label className="section-label">Deadline</label>
                            <input 
                                type="date" 
                                name="deadline" 
                                className="modern-input" 
                                value={formData.deadline}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="save-btn">{editingId ? 'Update Goal' : 'Add Goal'}</button>
                    </div>
                </form>
            </div>

            <div className="st-list">
                {goals.map(goal => (
                    <div key={goal.id} className="st-card">
                        <div className="st-card-header">
                            <div className="st-card-info">
                                <h4>{goal.name}</h4>
                                <p>Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="savings-details">
                            <div className="savings-row">
                                <span>Saved:</span>
                                <span className="income-indicator">${goal.saved}</span>
                            </div>
                            <div className="savings-row">
                                <span>Target:</span>
                                <span>${goal.target}</span>
                            </div>
                            <div className="savings-row">
                                <span>Remaining:</span>
                                <span className="expense-indicator">${goal.remaining}</span>
                            </div>
                            <div className="progress-section">
                                <div className="progress-label">
                                    <span>Progress</span>
                                    <span>{getProgressPercentage(goal.saved, goal.target).toFixed(1)}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill" 
                                        style={{ width: `${getProgressPercentage(goal.saved, goal.target)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <div className="st-card-actions">
                            <button className="btn-edit" onClick={() => handleEdit(goal.id)}>
                                Edit
                            </button>
                            <button className="btn-skip" onClick={() => handleDelete(goal.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Savings;