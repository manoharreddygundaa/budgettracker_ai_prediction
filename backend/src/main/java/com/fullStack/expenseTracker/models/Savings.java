package com.fullStack.expenseTracker.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Savings {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long savingsId;
    private Long userId;
    private String goalName;
    private Double targetAmount;
    private Double savedAmount;
    private LocalDate deadline;

    public Savings(Long userId, String goalName, Double targetAmount, Double savedAmount, LocalDate deadline) {
        this.userId = userId;
        this.goalName = goalName;
        this.targetAmount = targetAmount;
        this.savedAmount = savedAmount;
        this.deadline = deadline;
    }
}