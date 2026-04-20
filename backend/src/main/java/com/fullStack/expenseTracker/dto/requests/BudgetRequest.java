package com.fullStack.expenseTracker.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BudgetRequest {
    long userId;
    String category;
    double amount;
    double spent;
    int month;
    long year;
}
