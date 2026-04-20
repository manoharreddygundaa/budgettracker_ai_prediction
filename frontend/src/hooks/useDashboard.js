import { useEffect, useState } from "react";
import useCategories from "./useCategories";
import UserService from "../services/userService";
import AuthService from "../services/auth.service";

function useDashboard(currentMonth) {
    const [total_income, setIncome] = useState(0)
    const [total_expense, setExpense] = useState(0)
    const [no_of_transactions, setTransactions] = useState(0)
    const cash_in_hand = total_income > total_expense ? Number((total_income - total_expense)?.toFixed(2)) : 0;
    const [categories] = useCategories()
    const [categorySummary, setCategorySummary] = useState([])
    const [budgetAmount, setBudgetAmount] = useState(0)

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);


    const generateTransactionSummary = async () => {
        let hasError = false;
        
        try {
            const income_response = await UserService.getTotalIncomeOrExpense(AuthService.getCurrentUser().id, 2, currentMonth.id, currentMonth.year)
            if (income_response.data.status === "SUCCESS") {
                setIncome(Number((income_response.data.response) ? income_response.data.response.toFixed(2) : 0))
            }
        } catch (error) {
            hasError = true;
            setIncome(0);
        }

        try {
            const expense_response = await UserService.getTotalIncomeOrExpense(AuthService.getCurrentUser().id, 1, currentMonth.id, currentMonth.year)
            if (expense_response.data.status === "SUCCESS") {
                setExpense(Number((expense_response.data.response) ? expense_response.data.response.toFixed(2) : 0))
            }
        } catch (error) {
            hasError = true;
            setExpense(0);
        }

        try {
            const no_response = await UserService.getTotalNoOfTransactions(AuthService.getCurrentUser().id, currentMonth.id, currentMonth.year)
            if (no_response.data.status === "SUCCESS") {
                setTransactions(no_response.data.response)
            }
        } catch (error) {
            hasError = true;
            setTransactions(0);
        }
        
        if (hasError) setIsError(true);
    }

    const generateCategorySummary = async () => {
        if (!categories || categories.length === 0) return;
        const filtered = [];
        
        try {
            await Promise.all(categories.filter(cat => cat.transactionType.transactionTypeId === 1).map(async (cat) => {
                try {
                    const response = await UserService.getTotalByCategory(AuthService.getCurrentUser().email, cat.categoryId, currentMonth.id, currentMonth.year);
                    if (response.data.status === "SUCCESS" && response.data.response) {
                        filtered.push({ name: cat.categoryName, amount: Number(response.data.response ? response.data.response.toFixed(2) : 0) });
                    }
                } catch (error) {
                    // Silently skip failed categories
                }
            }));
        } catch (error) {
            setIsError(true)
        }
        
        setCategorySummary(filtered)
    }

    const fetchBudget = async () => {
        try {
            const response = await UserService.getBudget(currentMonth.id, currentMonth.year)
            const budgetData = response.data.response
            setBudgetAmount(budgetData?.totalBudget || 0)
        } catch (error) {
            setBudgetAmount(0)
            setIsError(true)
        }
    }



    const saveBudget = async (d) => {
        try {
            const budgetData = {
                userId: AuthService.getCurrentUser().id,
                category: "General",
                amount: parseFloat(d.amount),
                spent: 0,
                month: currentMonth.id,
                year: currentMonth.year
            };
            console.log('Saving budget:', budgetData)
            const response = await UserService.createBudget(budgetData)
            console.log('Budget save response:', response)
            
            if (response.data.status === 'SUCCESS') {
                await fetchBudget()
                return true
            } else {
                return response.data.response || 'Unknown error'
            }
        } catch (error) {
            console.error('Budget save error:', error)
            console.error('Error response:', error.response?.data)
            const errorMsg = error.response?.data?.response || error.response?.data?.message || error.message
            setIsError(true)
            return errorMsg
        }
    }

    useEffect(() => {
        if (currentMonth) {
            setIsLoading(true);
            Promise.all([
                generateTransactionSummary(),
                generateCategorySummary(),
                fetchBudget()
            ]).finally(() => {
                setIsLoading(false);
            });
        }
    }, [currentMonth, categories])

    return [
        total_expense,
        total_income,
        cash_in_hand,
        no_of_transactions,
        categorySummary,
        budgetAmount,
        saveBudget,
        isLoading,
        isError
    ]


}

export default useDashboard;