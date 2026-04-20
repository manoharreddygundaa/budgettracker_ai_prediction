function DashboardDetailBox({ total_income, total_expense, cash_in_hand, no_of_transactions }) {
    return (
        <div className='modern-stats-grid'>
            {/* Income Card - Green */}
            <div className="modern-stat-card">
                <div className="stat-card-content">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                        <div className="stat-amount">Rs. {total_income}</div>
                        <div className="stat-title">Income</div>
                    </div>
                </div>
            </div>
            
            {/* Expense Card - Red */}
            <div className="modern-stat-card">
                <div className="stat-card-content">
                    <div className="stat-icon">💸</div>
                    <div className="stat-info">
                        <div className="stat-amount">Rs. {total_expense}</div>
                        <div className="stat-title">Expense</div>
                    </div>
                </div>
            </div>
            
            {/* Cash in Hand Card - Blue */}
            <div className="modern-stat-card">
                <div className="stat-card-content">
                    <div className="stat-icon">🏦</div>
                    <div className="stat-info">
                        <div className="stat-amount">Rs. {cash_in_hand}</div>
                        <div className="stat-title">Cash in Hand</div>
                    </div>
                </div>
            </div>
            
            {/* Transactions Card - Pink */}
            <div className="modern-stat-card">
                <div className="stat-card-content">
                    <div className="stat-icon">🧾</div>
                    <div className="stat-info">
                        <div className="stat-amount">{no_of_transactions}</div>
                        <div className="stat-title">No. of Transactions</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardDetailBox;