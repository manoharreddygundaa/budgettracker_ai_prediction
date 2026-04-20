import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function IncomeVsExpenseChart({ data }) {

    return (
        <div className="chart-container">
            <h3 className="chart-title">Income vs Expense</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="monthName" fontSize='12px' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="totalExpense" name='Expense' stroke="#ef4444" activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="totalIncome" name='Income' stroke="#10b981" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default IncomeVsExpenseChart;