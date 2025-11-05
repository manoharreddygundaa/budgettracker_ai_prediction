package com.fullStack.expenseTracker.services;

import com.fullStack.expenseTracker.dto.reponses.ExpensePredictionDto;

public interface PredictionService {
    ExpensePredictionDto predictMonthlyExpenses(String userEmail, int monthsAhead);
}