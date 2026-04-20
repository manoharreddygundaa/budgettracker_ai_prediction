import '../../assets/styles/dashboard.css';
import { useState } from 'react';
import DashboardDetailBox from '../../components/userDashboard/dashboardDetailBox';
import CategoryExpenseChart from '../../components/userDashboard/categoryExpenseChart';
import ExpensePrediction from '../../components/userDashboard/expensePrediction';
import Header from '../../components/utils/header';
import Budget from '../../components/userDashboard/budget';
import useDashboard from '../../hooks/useDashboard';
import Loading from '../../components/utils/loading';
import Info from '../../components/utils/Info';
import Container from '../../components/utils/Container';
import toast, { Toaster } from 'react-hot-toast';

function Dashboard() {

    const months = getMonths()
    const [currentMonth, setMonth] = useState(months[0])

    const [total_expense = 0, total_income = 0, cash_in_hand = 0, no_of_transactions = 0, categorySummary = [], budgetAmount = 0,
        saveBudget, isLoading = true, isError = false] = useDashboard(currentMonth)

    const onMonthChange = (id) => {
        const month = months.find(m => m.id == id)
        setMonth(month)
    }

    return (
        <Container activeNavId={0}>
            <div className="modern-dashboard">
                <Header title="Dashboard" />
                <Toaster/>
                
                <div className="dashboard-content">
                    {(isLoading) && <Loading />}
                    
                    <div className="dashboard-controls">
                        <SelectMonth months={months} onMonthChange={onMonthChange} />
                    </div>
                    

                    
                    {/* AI Prediction Section */}
                    <div className="ai-prediction-section">
                        <ExpensePrediction currentMonth={currentMonth} />
                    </div>
                    
                    {(!isLoading && total_expense === 0 && total_income === 0) && (
                        <Info text={"You have no transactions in this month!"} />
                    )}
                    
                    {/* Top Section - 4 Summary Cards Horizontal */}
                    <div className="stats-section">
                        <DashboardDetailBox 
                            total_expense={total_expense || 0} 
                            total_income={total_income || 0} 
                            cash_in_hand={cash_in_hand || 0} 
                            no_of_transactions={no_of_transactions || 0} 
                        />
                    </div>
                    
                    {/* Charts Section - Side by Side */}
                    <div className="charts-section-grid">
                        <div className="chart-container">
                            <h3 className="chart-title">📊 Category Expenses</h3>
                            <div style={{marginTop: '20px'}}>
                                {categorySummary && categorySummary.length > 0 ? (
                                    <CategoryExpenseChart categorySummary={categorySummary} />
                                ) : (
                                    <div className="chart-placeholder">
                                        <i className="fas fa-chart-pie"></i>
                                        <p>No expense data available for this month</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="chart-container">
                            <h3 className="chart-title">💰 Monthly Budget</h3>
                            <div style={{marginTop: '20px'}}>
                                <Budget 
                                    totalExpense={total_expense} 
                                    budgetAmount={budgetAmount} 
                                    saveBudget={saveBudget} 
                                    currentMonth={currentMonth} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Dashboard;

function getMonths() {
    const months = []
    const current_date = new Date()

    for (let i = 0; i <= 11; i++) {
        const date = new Date(current_date.getFullYear(), current_date.getMonth() - i, 1)
        months.push({
            id: date.getMonth() + 1,
            year: date.getFullYear(),
            monthName: date.toLocaleString('en-US', { month: 'long' })
        })
    }

    return months;
}

function SelectMonth({ months, onMonthChange }) {
    return (
        <div className="month-selector">
            <label>📅 View Data For:</label>
            <select onChange={(e) => onMonthChange(e.target.value)} className="modern-select">
                {months.map((m) => (
                    <option value={m.id} key={m.id}>
                        {m.monthName} {m.year}
                    </option>
                ))}
            </select>
        </div>
    )
}