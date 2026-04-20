package com.fullStack.expenseTracker.services.impls;

import com.fullStack.expenseTracker.dto.reponses.ApiResponseDto;
import com.fullStack.expenseTracker.enums.ApiResponseStatus;
import com.fullStack.expenseTracker.dto.requests.BudgetRequest;
import com.fullStack.expenseTracker.exceptions.UserNotFoundException;
import com.fullStack.expenseTracker.exceptions.UserServiceLogicException;
import com.fullStack.expenseTracker.models.Budget;
import com.fullStack.expenseTracker.repository.BudgetRepository;
import com.fullStack.expenseTracker.repository.TransactionRepository;
import com.fullStack.expenseTracker.repository.UserRepository;
import com.fullStack.expenseTracker.services.BudgetService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class BudgetServiceImpl implements BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Override
    public ResponseEntity<ApiResponseDto<?>> createBudget(BudgetRequest budgetRequest) throws UserNotFoundException, UserServiceLogicException {
        if (!userRepository.existsById(budgetRequest.getUserId())) {
            throw new UserNotFoundException("User not found with id " + budgetRequest.getUserId());
        }
        try {
            log.info("Creating budget for user: {}, month: {}, year: {}, amount: {}", 
                budgetRequest.getUserId(), budgetRequest.getMonth(), budgetRequest.getYear(), budgetRequest.getAmount());
            
            Double spent = 0.0;
            try {
                spent = transactionRepository.findTotalByUserAndTransactionType(
                    budgetRequest.getUserId(), 1, budgetRequest.getMonth(), (int)budgetRequest.getYear()
                );
                log.info("Spent amount calculated: {}", spent);
            } catch (Exception e) {
                log.warn("Could not calculate spent amount: {}", e.getMessage());
                spent = 0.0;
            }
            
            Budget budget = budgetRepository.findFirstByUserIdAndMonthAndYearOrderByBudgetIdDesc(
                budgetRequest.getUserId(), budgetRequest.getMonth(), budgetRequest.getYear()
            );
            
            if (budget == null){
                budget = new Budget(
                    budgetRequest.getUserId(), 
                    budgetRequest.getCategory(), 
                    budgetRequest.getAmount(), 
                    spent != null ? spent : 0.0, 
                    budgetRequest.getMonth(), 
                    budgetRequest.getYear()
                );
                log.info("Creating new budget record");
            } else {
                budget.setAmount(budgetRequest.getAmount());
                budget.setSpent(spent != null ? spent : 0.0);
                log.info("Updating existing budget record with id: {}", budget.getBudgetId());
            }

            Budget savedBudget = budgetRepository.save(budget);
            log.info("Budget saved successfully with id: {}", savedBudget.getBudgetId());

            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponseDto<>(
                    ApiResponseStatus.SUCCESS,
                    HttpStatus.CREATED,
                    "Budget created successfully!"
            ));
        }catch (Exception e) {
            log.error("Failed to create budget: " + e.getMessage(), e);
            throw new UserServiceLogicException("Failed to create budget: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<ApiResponseDto<Map<String, Double>>> getBudgetByMonth(long userId, int month, long year) throws UserServiceLogicException {
        try {
            Budget budget = budgetRepository.findFirstByUserIdAndMonthAndYearOrderByBudgetIdDesc(userId, month, year);
            
            Double spent = 0.0;
            try {
                spent = transactionRepository.findTotalByUserAndTransactionType(userId, 1, month, (int)year);
            } catch (Exception e) {
                log.warn("Could not calculate spent for budget fetch: {}", e.getMessage());
            }
            
            Map<String, Double> budgetData = new HashMap<>();
            budgetData.put("totalBudget", budget != null ? budget.getAmount() : 0.0);
            budgetData.put("spent", spent != null ? spent : 0.0);
            budgetData.put("remaining", (budget != null ? budget.getAmount() : 0.0) - (spent != null ? spent : 0.0));

            return ResponseEntity.status(HttpStatus.OK).body(new ApiResponseDto<>(
                    ApiResponseStatus.SUCCESS,
                    HttpStatus.OK,
                    budgetData
            ));
        }catch (Exception e) {
            log.error("Failed to fetch budget: " + e.getMessage(), e);
            throw new UserServiceLogicException("Failed to fetch budget: " + e.getMessage());
        }
    }
}
