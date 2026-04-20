import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

function CategoryExpenseChart({ categorySummary }) {
    const COLORS = ["#ff6e6e", "#ffb26e", "#e6cd10", "#00a33c", "#6ea1ff", "#a36eff", "#ff6eff", "#6ee0ff", "#676d6e"];

    return (
        <div className='category-chart-wrapper'>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={categorySummary}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="amount"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {categorySummary.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value) => [`Rs. ${value}`, 'Amount']} />
                </PieChart>
            </ResponsiveContainer>
            
            <style jsx>{`
                .category-chart-wrapper {
                    width: 100%;
                    height: 100%;
                }
            `}</style>
        </div>
    )
}

export default CategoryExpenseChart;