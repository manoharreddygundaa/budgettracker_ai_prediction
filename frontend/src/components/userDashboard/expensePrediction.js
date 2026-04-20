import React, { useState, useEffect } from 'react';
import UserService from '../../services/userService';

const ExpensePrediction = ({ currentMonth }) => {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [monthsAhead, setMonthsAhead] = useState(1);
    
    const isCurrentMonth = () => {
        const now = new Date();
        return currentMonth.id === now.getMonth() + 1 && currentMonth.year === now.getFullYear();
    };

    const fetchPrediction = async () => {
        setLoading(true);
        setError('');
        setPrediction(null);
        try {
            const response = await UserService.getExpensePrediction(monthsAhead);
            if (response.data.status === 'SUCCESS') {
                setPrediction(response.data.response);
            } else {
                setError(response.data.message || 'Failed to fetch prediction');
            }
        } catch (err) {
            setError('Error fetching prediction: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isCurrentMonth()) {
            fetchPrediction();
        }
    }, [monthsAhead, currentMonth]);

    const handleMonthsChange = (e) => {
        setMonthsAhead(parseInt(e.target.value));
    };

    if (!isCurrentMonth()) {
        return (
            <div className="modern-prediction-card">
                <div className="prediction-header">
                    <h3>🤖 AI Expense Prediction</h3>
                </div>
                <div className="info-state">
                    <i className="fas fa-info-circle" style={{fontSize: '3rem', marginBottom: '15px', opacity: 0.7}}></i>
                    <p>AI predictions are only available for the current month</p>
                    <small>Switch to {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })} to see predictions</small>
                </div>
            </div>
        );
    }
    
    if (loading) {
        return (
            <div className="modern-prediction-card">
                <div className="prediction-header">
                    <h3>🤖 AI Expense Prediction</h3>
                </div>
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Analyzing your spending patterns...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="modern-prediction-card">
                <div className="prediction-header">
                    <h3>🤖 AI Expense Prediction</h3>
                </div>
                <div className="error-state">
                    <p>{error}</p>
                    <button onClick={fetchPrediction} className="retry-button">
                        <i className="fas fa-redo"></i> Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="modern-prediction-card">
            <div className="prediction-header">
                <h3>🤖 AI Expense Prediction</h3>
                <div className="prediction-controls">
                    <label>Predict for:</label>
                    <select value={monthsAhead} onChange={handleMonthsChange} className="prediction-select">
                        <option value={1}>Next Month</option>
                        <option value={2}>2 Months Ahead</option>
                        <option value={3}>3 Months Ahead</option>
                    </select>
                </div>
            </div>

            {prediction && (
                <div className="prediction-content">
                    <div className="prediction-main">
                        <div className="total-prediction">
                            <div className="prediction-amount">${prediction.totalPredictedExpense}</div>
                            <div className="prediction-label">Predicted Total for {prediction.predictionMonth}</div>
                        </div>
                        
                        <div className="confidence-badge">
                            <div className="confidence-score">{(prediction.confidenceScore * 100).toFixed(1)}%</div>
                            <div className="confidence-label">Confidence</div>
                        </div>
                    </div>

                    <div className="category-predictions">
                        <h4>Category Breakdown</h4>
                        <div className="category-grid">
                            {prediction.categoryWisePredictions && Object.keys(prediction.categoryWisePredictions).length > 0 ? (
                                Object.entries(prediction.categoryWisePredictions).map(([category, amount]) => (
                                    <div key={category} className="category-card">
                                        <div className="category-icon">
                                            {getCategoryIcon(category)}
                                        </div>
                                        <div className="category-info">
                                            <span className="category-name">{category}</span>
                                            <span className="category-amount">${amount}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // Fallback category containers
                                ['Food', 'Transport', 'Shopping', 'Entertainment', 'Utilities', 'Other'].map((category) => (
                                    <div key={category} className="category-card">
                                        <div className="category-icon">
                                            {getCategoryIcon(category)}
                                        </div>
                                        <div className="category-info">
                                            <span className="category-name">{category}</span>
                                            <span className="category-amount">$0</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="prediction-footer">
                        <i className="fas fa-info-circle"></i>
                        <span>Prediction based on last 6 months of expense data</span>
                    </div>
                </div>
            )}

            <style>{`
                .modern-prediction-card {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 24px;
                    padding: 30px;
                    color: white;
                    box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
                    position: relative;
                    overflow: hidden;
                    margin-bottom: 30px;
                }

                .modern-prediction-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>') repeat;
                    animation: float 20s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }

                .prediction-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    position: relative;
                    z-index: 2;
                }

                .prediction-header h3 {
                    font-size: 1.8rem;
                    font-weight: 800;
                    margin: 0;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }

                .prediction-controls {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .prediction-controls label {
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .prediction-select {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 20px;
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }

                .prediction-select option {
                    background: #667eea;
                    color: white;
                }

                .prediction-content {
                    position: relative;
                    z-index: 2;
                }

                .prediction-main {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    padding: 25px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .total-prediction {
                    flex: 1;
                }

                .prediction-amount {
                    font-size: 3rem;
                    font-weight: 900;
                    color: #fbbf24;
                    text-shadow: 0 4px 8px rgba(0,0,0,0.3);
                    margin-bottom: 8px;
                }

                .prediction-label {
                    font-size: 1rem;
                    color: rgba(255, 255, 255, 0.9);
                    font-weight: 500;
                }

                .confidence-badge {
                    text-align: center;
                    padding: 20px;
                    background: rgba(16, 185, 129, 0.2);
                    border-radius: 16px;
                    border: 2px solid #10b981;
                }

                .confidence-score {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #10b981;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }

                .confidence-label {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.8);
                    margin-top: 4px;
                }

                .category-predictions h4 {
                    font-size: 1.2rem;
                    font-weight: 700;
                    margin: 0 0 20px 0;
                    color: rgba(255, 255, 255, 0.95);
                }

                .category-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    margin-bottom: 25px;
                }

                .category-card {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 16px 20px;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
                    border-radius: 16px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    transition: all 0.3s ease;
                }

                .category-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                }

                .category-icon {
                    font-size: 1.5rem;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(251, 191, 36, 0.2);
                    border-radius: 12px;
                    border: 1px solid #fbbf24;
                }

                .category-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .category-name {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.8);
                    font-weight: 500;
                }

                .category-amount {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #fbbf24;
                }

                .prediction-footer {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    justify-content: center;
                    padding: 15px;
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 12px;
                    font-size: 0.85rem;
                    color: rgba(255, 255, 255, 0.7);
                }

                .loading-state, .error-state, .info-state {
                    text-align: center;
                    padding: 40px 20px;
                    position: relative;
                    z-index: 2;
                }
                
                .info-state p {
                    font-size: 1.1rem;
                    margin: 0 0 10px 0;
                    font-weight: 600;
                }
                
                .info-state small {
                    font-size: 0.9rem;
                    opacity: 0.8;
                }

                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-top: 3px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .retry-button {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    padding: 10px 20px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    margin-top: 15px;
                }

                .retry-button:hover {
                    background: rgba(255, 255, 255, 0.3);
                }

                @media (max-width: 768px) {
                    .prediction-header {
                        flex-direction: column;
                        gap: 15px;
                        text-align: center;
                    }
                    
                    .prediction-main {
                        flex-direction: column;
                        gap: 20px;
                        text-align: center;
                    }
                    
                    .prediction-amount {
                        font-size: 2.5rem;
                    }
                    
                    .category-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

const getCategoryIcon = (category) => {
    const icons = {
        'Shopping': '🛍️',
        'Transport': '🚗',
        'Food': '🍽️',
        'Rent': '🏠',
        'Entertainment': '🎬',
        'Healthcare': '🏥',
        'Utilities': '⚡',
        'Education': '📚',
        'Travel': '✈️',
        'Other': '📊'
    };
    return icons[category] || '💰';
};

export default ExpensePrediction;