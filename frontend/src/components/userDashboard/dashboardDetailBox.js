import incomeImg from '../../assets/images/income.png'
import expenseImg from '../../assets/images/expense.png'
import cashInHandImg from '../../assets/images/cashInHand.png'
import transactionImg from '../../assets/images/transaction.png'

function DashboardDetailBox({ total_income, total_expense, cash_in_hand, no_of_transactions }) {

    return (
        <div className='details'>
            <Box amount={'Rs. ' + total_income} src={incomeImg} title="Income"/>
            <Box amount={'Rs. ' + total_expense} src={expenseImg} title="Expense"/>
            <Box amount={'Rs. ' + cash_in_hand} src={cashInHandImg} title="Cash in hand"/>
            <Box amount={no_of_transactions} src={transactionImg} title="No of transactions"/>
        </div>
    )
}

function Box({amount, src, title}) {
    const getIcon = (title) => {
        switch(title) {
            case 'Income': return '💰';
            case 'Expense': return '💸';
            case 'Cash in hand': return '🏦';
            case 'No of transactions': return '📊';
            default: return '📈';
        }
    };

    const getGradient = (title) => {
        switch(title) {
            case 'Income': return 'linear-gradient(135deg, #10b981 0%, #34d399 100%)';
            case 'Expense': return 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)';
            case 'Cash in hand': return 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)';
            case 'No of transactions': return 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)';
            default: return 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)';
        }
    };

    return (
        <div className="modern-box" style={{background: getGradient(title)}}>
            <div className="box-content">
                <div className="box-icon">{getIcon(title)}</div>
                <div className="box-info">
                    <h2 className="box-amount">{amount}</h2>
                    <h4 className="box-title">{title}</h4>
                </div>
            </div>
            <div className="box-decoration"></div>
        </div>
    )
}

export default DashboardDetailBox;