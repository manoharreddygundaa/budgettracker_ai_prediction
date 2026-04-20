package com.fullStack.expenseTracker.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    long budgetId;
    long userId;
    String category;
    double amount;
    double spent;
    int month;
    long year;

    public Budget(long userId, String category, double amount, double spent, int month, long year) {
        this.userId = userId;
        this.category = category;
        this.amount = amount;
        this.spent = spent;
        this.month = month;
        this.year = year;
    }
}
