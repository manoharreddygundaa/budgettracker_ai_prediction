package com.fullStack.expenseTracker.services.impls;

import com.fullStack.expenseTracker.dto.reponses.ExpensePredictionDto;
import com.fullStack.expenseTracker.models.Transaction;
import com.fullStack.expenseTracker.models.User;
import com.fullStack.expenseTracker.repository.TransactionRepository;
import com.fullStack.expenseTracker.repository.UserRepository;
import com.fullStack.expenseTracker.services.PredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PredictionServiceImpl implements PredictionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public ExpensePredictionDto predictMonthlyExpenses(String userEmail, int monthsAhead) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get historical transactions (last 6 months)
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusMonths(6);
        
        List<Transaction> historicalTransactions = getTransactionsBetweenDates(user.getId(), startDate, endDate);
        
        if (historicalTransactions.isEmpty()) {
            return new ExpensePredictionDto(0.0, new HashMap<>(), 
                    endDate.plusMonths(monthsAhead).format(DateTimeFormatter.ofPattern("MMMM yyyy")), 
                    0.0, "No historical data available for prediction");
        }

        // Filter only expense transactions (transaction type 1 is expense in your DB)
        List<Transaction> expenseTransactions = historicalTransactions.stream()
                .filter(t -> t.getCategory().getTransactionType().getTransactionTypeId() == 1)
                .collect(Collectors.toList());

        if (expenseTransactions.isEmpty()) {
            return new ExpensePredictionDto(0.0, new HashMap<>(), 
                    endDate.plusMonths(monthsAhead).format(DateTimeFormatter.ofPattern("MMMM yyyy")), 
                    0.0, "No expense data available for prediction");
        }

        // Group transactions by month and calculate monthly totals
        Map<String, Double> monthlyTotals = calculateMonthlyTotals(expenseTransactions);
        Map<String, Map<String, Double>> monthlyCategoryTotals = calculateMonthlyCategoryTotals(expenseTransactions);

        // Predict total expense using simple linear regression
        double predictedTotal = predictUsingLinearRegression(monthlyTotals, monthsAhead);
        
        // Predict category-wise expenses
        Map<String, Double> categoryPredictions = predictCategoryExpenses(monthlyCategoryTotals, monthsAhead);
        
        // Calculate confidence score based on data consistency
        double confidenceScore = calculateConfidenceScore(monthlyTotals);
        
        LocalDate predictionDate = endDate.plusMonths(monthsAhead);
        String predictionMonth = predictionDate.format(DateTimeFormatter.ofPattern("MMMM yyyy"));

        return new ExpensePredictionDto(
                Math.round(predictedTotal * 100.0) / 100.0,
                categoryPredictions,
                predictionMonth,
                Math.round(confidenceScore * 100.0) / 100.0,
                "Prediction based on last 6 months of expense data"
        );
    }

    private List<Transaction> getTransactionsBetweenDates(Long userId, LocalDate startDate, LocalDate endDate) {
        return transactionRepository.findByUserIdAndDateBetween(userId, startDate.toString(), endDate.toString());
    }

    private Map<String, Double> calculateMonthlyTotals(List<Transaction> transactions) {
        return transactions.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getDate().format(DateTimeFormatter.ofPattern("yyyy-MM")),
                        Collectors.summingDouble(Transaction::getAmount)
                ));
    }

    private Map<String, Map<String, Double>> calculateMonthlyCategoryTotals(List<Transaction> transactions) {
        return transactions.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getDate().format(DateTimeFormatter.ofPattern("yyyy-MM")),
                        Collectors.groupingBy(
                                t -> t.getCategory().getCategoryName(),
                                Collectors.summingDouble(Transaction::getAmount)
                        )
                ));
    }

    private double predictUsingLinearRegression(Map<String, Double> monthlyTotals, int monthsAhead) {
        if (monthlyTotals.size() < 2) {
            return monthlyTotals.values().stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        }

        List<Map.Entry<String, Double>> sortedEntries = monthlyTotals.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .collect(Collectors.toList());

        double[] x = new double[sortedEntries.size()];
        double[] y = new double[sortedEntries.size()];

        for (int i = 0; i < sortedEntries.size(); i++) {
            x[i] = i + 1; // Month index
            y[i] = sortedEntries.get(i).getValue();
        }

        // Simple linear regression: y = mx + b
        double n = x.length;
        double sumX = Arrays.stream(x).sum();
        double sumY = Arrays.stream(y).sum();
        double sumXY = 0, sumXX = 0;

        for (int i = 0; i < n; i++) {
            sumXY += x[i] * y[i];
            sumXX += x[i] * x[i];
        }

        double slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        double intercept = (sumY - slope * sumX) / n;

        // Predict for specified months ahead
        double targetMonthIndex = n + monthsAhead;
        double basePrediction = Math.max(0, slope * targetMonthIndex + intercept);
        
        // Add slight variation based on months ahead (seasonal factor)
        double seasonalFactor = 1.0 + (monthsAhead - 1) * 0.05; // 5% increase per additional month
        return basePrediction * seasonalFactor;
    }

    private Map<String, Double> predictCategoryExpenses(Map<String, Map<String, Double>> monthlyCategoryTotals, int monthsAhead) {
        Map<String, Double> categoryPredictions = new HashMap<>();
        
        // Get all unique categories
        Set<String> allCategories = monthlyCategoryTotals.values().stream()
                .flatMap(map -> map.keySet().stream())
                .collect(Collectors.toSet());

        for (String category : allCategories) {
            List<Double> categoryMonthlyAmounts = new ArrayList<>();
            
            for (Map<String, Double> monthData : monthlyCategoryTotals.values()) {
                categoryMonthlyAmounts.add(monthData.getOrDefault(category, 0.0));
            }
            
            // Simple average prediction for each category with seasonal adjustment
            double avgAmount = categoryMonthlyAmounts.stream()
                    .mapToDouble(Double::doubleValue)
                    .average()
                    .orElse(0.0);
            
            if (avgAmount > 0) {
                // Add variation based on months ahead
                double seasonalFactor = 1.0 + (monthsAhead - 1) * 0.03; // 3% increase per additional month
                double predictedAmount = avgAmount * seasonalFactor;
                categoryPredictions.put(category, Math.round(predictedAmount * 100.0) / 100.0);
            }
        }
        
        return categoryPredictions;
    }

    private double calculateConfidenceScore(Map<String, Double> monthlyTotals) {
        if (monthlyTotals.size() < 2) return 0.5;
        
        List<Double> amounts = new ArrayList<>(monthlyTotals.values());
        double mean = amounts.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        
        double variance = amounts.stream()
                .mapToDouble(amount -> Math.pow(amount - mean, 2))
                .average()
                .orElse(0.0);
        
        double stdDev = Math.sqrt(variance);
        double coefficientOfVariation = mean > 0 ? stdDev / mean : 1.0;
        
        // Lower coefficient of variation = higher confidence
        return Math.max(0.1, Math.min(1.0, 1.0 - coefficientOfVariation));
    }
}