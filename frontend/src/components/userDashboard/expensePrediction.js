import React, { useState, useEffect } from 'react';
import UserService from '../../services/userService';

const ExpensePrediction = () => {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [monthsAhead, setMonthsAhead] = useState(1);

    const fetchPrediction = async () => {
        setLoading(true);
        setError('');
        setPrediction(null); // Clear previous prediction
        try {
            console.log('Fetching prediction for months ahead:', monthsAhead);
            const response = await UserService.getExpensePrediction(monthsAhead);
            console.log('API Response:', response);
            if (response.data.status === 'SUCCESS') {
                setPrediction(response.data.response);
            } else {
                setError(response.data.message || 'Failed to fetch prediction');
            }
        } catch (err) {
            console.error('Prediction API Error:', err);
            setError('Error fetching prediction: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrediction();
    }, [monthsAhead]);

    const handleMonthsChange = (e) => {
        const newMonthsAhead = parseInt(e.target.value);
        console.log('Changing months ahead from', monthsAhead, 'to', newMonthsAhead);
        setMonthsAhead(newMonthsAhead);
    };

    if (loading) {
        return (
            <div className="prediction-container">
                <h3>AI Expense Prediction</h3>
                <div className="loading">Loading prediction...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="prediction-container">
                <h3>AI Expense Prediction</h3>
                <div className="error-message">{error}</div>
                <button onClick={fetchPrediction} className="retry-btn">Retry</button>
            </div>
        );
    }

    return (
        <div className="prediction-container">
            <div className="prediction-header">
                <h3>AI Expense Prediction</h3>
                <div className="months-selector">
                    <label>Predict for: </label>
                    <select value={monthsAhead} onChange={handleMonthsChange}>
                        <option value={1}>Next Month</option>
                        <option value={2}>2 Months Ahead</option>
                        <option value={3}>3 Months Ahead</option>
                    </select>
                </div>
            </div>

            {prediction && (
                <div className="prediction-content">
                    <div className="prediction-summary">
                        <div className="total-prediction">
                            <h4>Predicted Total Expense</h4>
                            <div className="amount">${prediction.totalPredictedExpense}</div>
                            <div className="prediction-month">for {prediction.predictionMonth}</div>
                        </div>
                        
                        <div className="confidence-score">
                            <h4>Confidence Score</h4>
                            <div className="score">{(prediction.confidenceScore * 100).toFixed(1)}%</div>
                        </div>
                    </div>

                    {prediction.categoryWisePredictions && Object.keys(prediction.categoryWisePredictions).length > 0 && (
                        <div className="category-predictions">
                            <h4>Category-wise Predictions</h4>
                            <div className="category-list">
                                {Object.entries(prediction.categoryWisePredictions).map(([category, amount]) => (
                                    <div key={category} className="category-item">
                                        <span className="category-name">{category}</span>
                                        <span className="category-amount">${amount}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="prediction-note">
                        <small>{prediction.message}</small>
                    </div>
                </div>
            )}

            <style jsx>{`
                .prediction-container {
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                    color: white;
                    border-radius: 16px;
                    padding: 24px;
                    margin: 20px 0;
                    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    position: relative;
                    overflow: hidden;
                }
                
                .prediction-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, #10b981, #34d399, #6ee7b7);
                    animation: shimmer 2s linear infinite;
                }
                
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                .prediction-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .prediction-header h3 {
                    margin: 0;
                    color: white;
                    font-size: 24px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .prediction-header h3::before {
                    content: '🤖';
                    font-size: 28px;
                    animation: bounce 2s infinite;
                }
                
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                }

                .months-selector select {
                    padding: 5px 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    margin-left: 10px;
                }

                .prediction-summary {
                    display: flex;
                    gap: 30px;
                    margin-bottom: 20px;
                }

                .total-prediction, .confidence-score {
                    flex: 1;
                    text-align: center;
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .total-prediction h4, .confidence-score h4 {
                    margin: 0 0 10px 0;
                    color: #666;
                    font-size: 14px;
                }

                .amount {
                    font-size: 32px;
                    font-weight: 800;
                    color: #fbbf24;
                    margin-bottom: 8px;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }

                .score {
                    font-size: 32px;
                    font-weight: 800;
                    color: #34d399;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }

                .prediction-month {
                    color: #666;
                    font-size: 12px;
                }

                .category-predictions {
                    margin-bottom: 15px;
                }

                .category-predictions h4 {
                    margin: 0 0 15px 0;
                    color: #333;
                }

                .category-list {
                    display: grid;
                    gap: 8px;
                }

                .category-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 12px 16px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    border-left: 4px solid #34d399;
                    backdrop-filter: blur(5px);
                    transition: all 0.3s ease;
                }
                
                .category-item:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: translateX(5px);
                }

                .category-name {
                    color: rgba(255, 255, 255, 0.9);
                    font-weight: 500;
                }

                .category-amount {
                    font-weight: 700;
                    color: #fbbf24;
                    font-size: 16px;
                }

                .prediction-note {
                    text-align: center;
                    color: #666;
                    font-style: italic;
                    margin-top: 15px;
                }

                .loading, .error-message {
                    text-align: center;
                    padding: 20px;
                    color: #666;
                }

                .error-message {
                    color: #e74c3c;
                }

                .retry-btn {
                    background: #3498db;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-top: 10px;
                }

                .retry-btn:hover {
                    background: #2980b9;
                }
            `}</style>
        </div>
    );
};

export default ExpensePrediction;