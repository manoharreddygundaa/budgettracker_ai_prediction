import { useState } from "react";
import { useForm } from 'react-hook-form';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import toast from 'react-hot-toast';

function Budget({totalExpense, budgetAmount, saveBudget, currentMonth}) {

    const { register, handleSubmit, reset, formState } = useForm();
    const [formToggle, setFormToggle] = useState(false)
    const [saving, setSaving] = useState(false)
    const balance = budgetAmount > 0 ? Math.max(0, budgetAmount - totalExpense) : 0

    const toggleForm = (e) => {
        e.preventDefault()
        setFormToggle(!formToggle)
        reset({amount: budgetAmount})
    }

    const onSubmit = async (formData) => {
        setSaving(true)
        const result = await saveBudget(formData)
        setSaving(false)
        if (result === true) {
            toast.success('Budget saved successfully!')
            setFormToggle(false)
            reset({amount: budgetAmount})
        } else {
            const errorMsg = typeof result === 'string' ? result : 'Failed to save budget. Check console for details.'
            toast.error(errorMsg)
        }
    }

    const data = [
        { name: 'Spent', value: totalExpense },
        { name: 'Balance', value: balance}
    ];

    const COLORS = ["#ef4444", "#10b981"];

    return (
        <div style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            {(currentMonth.id === new Date().getMonth() + 1) && (
                <div className="budget-header" style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '10px'}}>
                    <button onClick={toggleForm} className="edit-budget-btn">
                        <i className="fas fa-edit"></i> Edit
                    </button>
                </div>
            )}

            <div className="budget-amount-display" style={{marginTop: currentMonth.id === new Date().getMonth() + 1 ? '0' : '10px'}}>
                <span className="budget-label">Total Budget</span>
                <span className="budget-value">
                    {budgetAmount > 0 ? `Rs. ${budgetAmount}` : 'No budget set'}
                </span>
            </div>

            <div className="budget-chart-container">
                {budgetAmount > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                startAngle={180}
                                endAngle={0}
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`Rs. ${value}`, '']} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="no-budget-message">
                        <p>📊 Set up your monthly budget to track spending</p>
                        <button onClick={toggleForm} className="setup-budget-btn">
                            Set Budget
                        </button>
                    </div>
                )}
            </div>

            <div className="budget-summary">
                <div className="budget-stat">
                    <span className="stat-dot spent"></span>
                    <span className="stat-label">Spent</span>
                    <span className="stat-value">Rs. {totalExpense || 0}</span>
                </div>
                <div className="budget-stat">
                    <span className="stat-dot remaining"></span>
                    <span className="stat-label">Remaining</span>
                    <span className="stat-value">Rs. {budgetAmount > 0 ? Math.max(0, budgetAmount - totalExpense) : 0}</span>
                </div>
            </div>

            {formToggle && (
                <div className="budget-form-overlay">
                    <div className="budget-form-modal">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-header">
                                <h3>💰 Budget Settings</h3>
                                <button type="button" onClick={toggleForm} className="close-btn">
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            
                            <div className='form-input'>
                                <label>Monthly Budget Amount</label>
                                <input
                                    type='number'
                                    step="0.01"
                                    placeholder="Enter budget amount"
                                    defaultValue={budgetAmount}
                                    {...register('amount', {
                                        required: "Amount is required!",
                                        min: { value: 0, message: "Amount must be positive!" }
                                    })}
                                />
                                {formState.errors.amount && <small>{formState.errors.amount.message}</small>}
                            </div>
                            
                            <div className='form-input'>
                                <label>Amount Spent (Auto-calculated from transactions)</label>
                                <input
                                    type='number'
                                    step="0.01"
                                    value={totalExpense || 0}
                                    disabled
                                    style={{backgroundColor: '#f5f5f5', cursor: 'not-allowed', color: '#666'}}
                                />
                                <small style={{color: '#666', fontSize: '0.8rem'}}>This value is automatically calculated from your transactions</small>
                            </div>
                            
                            <div className='form-buttons'>
                                <button type='submit' className="save-btn" disabled={saving}>
                                    <i className={saving ? "fas fa-spinner fa-spin" : "fas fa-check"}></i> 
                                    {saving ? 'Saving...' : 'Save Budget'}
                                </button>
                                <button type='button' className='cancel-btn' onClick={toggleForm} disabled={saving}>
                                    <i className="fas fa-times"></i> Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                .budget-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .budget-title {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .budget-icon {
                    font-size: 1.5rem;
                }

                .budget-title h3 {
                    margin: 0;
                    font-weight: 700;
                    font-size: 1.2rem;
                    transition: color 0.3s ease;
                }

                .light .budget-title h3 {
                    color: #1a202c;
                }

                .dark .budget-title h3 {
                    color: #f1f5f9;
                }

                .edit-budget-btn {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 12px;
                    cursor: pointer;
                    font-size: 0.85rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .edit-budget-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
                }

                .budget-amount-display {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 20px;
                    padding: 20px;
                    border-radius: 16px;
                    transition: background 0.3s ease;
                }

                .light .budget-amount-display {
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                }

                .dark .budget-amount-display {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                }

                .budget-label {
                    font-size: 0.9rem;
                    font-weight: 600;
                    margin-bottom: 8px;
                    transition: color 0.3s ease;
                }

                .light .budget-label {
                    color: #64748b;
                }

                .dark .budget-label {
                    color: #94a3b8;
                }

                .budget-value {
                    font-size: 2rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .budget-chart-container {
                    margin: 20px 0;
                }

                .budget-summary {
                    display: flex;
                    justify-content: space-between;
                    gap: 15px;
                }

                .budget-stat {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex: 1;
                    padding: 12px;
                    border-radius: 12px;
                    transition: background 0.3s ease;
                }

                .light .budget-stat {
                    background: rgba(248, 250, 252, 0.8);
                }

                .dark .budget-stat {
                    background: rgba(15, 23, 42, 0.8);
                }

                .stat-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                }

                .stat-dot.spent {
                    background: #ef4444;
                }

                .stat-dot.remaining {
                    background: #10b981;
                }

                .stat-label {
                    font-size: 0.85rem;
                    font-weight: 500;
                    flex: 1;
                    transition: color 0.3s ease;
                }

                .light .stat-label {
                    color: #64748b;
                }

                .dark .stat-label {
                    color: #94a3b8;
                }

                .stat-value {
                    font-weight: 700;
                    font-size: 0.95rem;
                    transition: color 0.3s ease;
                }

                .light .stat-value {
                    color: #1a202c;
                }

                .dark .stat-value {
                    color: #f1f5f9;
                }

                .budget-form-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(5px);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .budget-form-modal {
                    border-radius: 20px;
                    padding: 30px;
                    width: 90%;
                    max-width: 400px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
                    transition: background 0.3s ease;
                }

                .light .budget-form-modal {
                    background: white;
                }

                .dark .budget-form-modal {
                    background: #1e293b;
                }

                .form-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                }

                .form-header h3 {
                    margin: 0;
                    font-weight: 700;
                    transition: color 0.3s ease;
                }

                .light .form-header h3 {
                    color: #1a202c;
                }

                .dark .form-header h3 {
                    color: #f1f5f9;
                }

                .close-btn {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 5px;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }

                .light .close-btn {
                    color: #64748b;
                }

                .dark .close-btn {
                    color: #94a3b8;
                }

                .light .close-btn:hover {
                    background: #f1f5f9;
                    color: #1a202c;
                }

                .dark .close-btn:hover {
                    background: #0f172a;
                    color: #f1f5f9;
                }

                .form-input {
                    margin-bottom: 20px;
                }

                .form-input label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    transition: color 0.3s ease;
                }

                .light .form-input label {
                    color: #374151;
                }

                .dark .form-input label {
                    color: #d1d5db;
                }

                .form-input input {
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid;
                    border-radius: 12px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    box-sizing: border-box;
                }

                .light .form-input input {
                    background: white;
                    color: #374151;
                    border-color: #e5e7eb;
                }

                .dark .form-input input {
                    background: #0f172a;
                    color: #d1d5db;
                    border-color: #374151;
                }

                .form-input input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .form-input small {
                    color: #ef4444;
                    font-size: 0.8rem;
                    margin-top: 5px;
                    display: block;
                }

                .form-buttons {
                    display: flex;
                    gap: 12px;
                }

                .save-btn, .cancel-btn {
                    flex: 1;
                    padding: 12px 20px;
                    border: none;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .save-btn {
                    background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
                    color: white;
                }

                .save-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
                }

                .save-btn:disabled, .cancel-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .cancel-btn {
                    border: 1px solid;
                    transition: all 0.3s ease;
                }

                .light .cancel-btn {
                    background: #f1f5f9;
                    color: #64748b;
                    border-color: #e2e8f0;
                }

                .dark .cancel-btn {
                    background: #0f172a;
                    color: #94a3b8;
                    border-color: #374151;
                }

                .light .cancel-btn:hover {
                    background: #e2e8f0;
                    color: #374151;
                }

                .dark .cancel-btn:hover {
                    background: #374151;
                    color: #d1d5db;
                }

                @media (max-width: 768px) {
                    .budget-summary {
                        flex-direction: column;
                    }
                    
                    .budget-form-modal {
                        margin: 20px;
                        padding: 25px;
                    }
                    
                    .form-buttons {
                        flex-direction: column;
                    }
                }
            `}</style>
        </div>
    )
}

export default Budget;