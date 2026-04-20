package com.fullStack.expenseTracker.services;

import com.fullStack.expenseTracker.models.Savings;

import java.util.List;

public interface SavingsService {
    Savings createSavingsGoal(Savings savings);
    List<Savings> getSavingsGoalsByUserId(Long userId);
    Savings updateSavingsGoal(Long savingsId, Savings savings);
    void deleteSavingsGoal(Long savingsId);
    Savings getSavingsGoalById(Long savingsId);
}