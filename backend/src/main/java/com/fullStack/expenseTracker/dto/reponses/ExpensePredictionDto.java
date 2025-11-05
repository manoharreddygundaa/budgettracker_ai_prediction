package com.fullStack.expenseTracker.dto.reponses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpensePredictionDto {
    private double totalPredictedExpense;
    private Map<String, Double> categoryWisePredictions;
    private String predictionMonth;
    private double confidenceScore;
    private String message;
}