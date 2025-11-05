package com.fullStack.expenseTracker;

import com.fullStack.expenseTracker.dto.reponses.ExpensePredictionDto;
import com.fullStack.expenseTracker.enums.ETransactionType;
import com.fullStack.expenseTracker.models.Category;
import com.fullStack.expenseTracker.models.Transaction;
import com.fullStack.expenseTracker.models.TransactionType;
import com.fullStack.expenseTracker.models.User;
import com.fullStack.expenseTracker.repository.TransactionRepository;
import com.fullStack.expenseTracker.repository.UserRepository;
import com.fullStack.expenseTracker.services.impls.PredictionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

public class PredictionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PredictionServiceImpl predictionService;

    private User testUser;
    private TransactionType expenseType;
    private Category testCategory;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        expenseType = new TransactionType();
        expenseType.setTransactionTypeId(2);
        expenseType.setTransactionTypeName(ETransactionType.TYPE_EXPENSE);
        testCategory = new Category();
        testCategory.setCategoryId(1);
        testCategory.setCategoryName("Food");
        testCategory.setTransactionType(expenseType);
    }

    @Test
    void testPredictMonthlyExpenses_WithValidData() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        
        List<Transaction> mockTransactions = Arrays.asList(
            new Transaction(testUser, testCategory, "Grocery", 100.0, LocalDate.now().minusMonths(1)),
            new Transaction(testUser, testCategory, "Restaurant", 50.0, LocalDate.now().minusMonths(2)),
            new Transaction(testUser, testCategory, "Grocery", 120.0, LocalDate.now().minusMonths(3))
        );
        
        when(transactionRepository.findByUserIdAndDateBetween(anyLong(), anyString(), anyString()))
            .thenReturn(mockTransactions);

        // Act
        ExpensePredictionDto result = predictionService.predictMonthlyExpenses("test@example.com", 1);

        // Assert
        assertNotNull(result);
        assertTrue(result.getTotalPredictedExpense() > 0);
        assertNotNull(result.getCategoryWisePredictions());
        assertTrue(result.getConfidenceScore() >= 0 && result.getConfidenceScore() <= 1);
        assertNotNull(result.getPredictionMonth());
    }

    @Test
    void testPredictMonthlyExpenses_WithNoData() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(transactionRepository.findByUserIdAndDateBetween(anyLong(), anyString(), anyString()))
            .thenReturn(Arrays.asList());

        // Act
        ExpensePredictionDto result = predictionService.predictMonthlyExpenses("test@example.com", 1);

        // Assert
        assertNotNull(result);
        assertEquals(0.0, result.getTotalPredictedExpense());
        assertEquals("No historical data available for prediction", result.getMessage());
    }

    @Test
    void testPredictMonthlyExpenses_UserNotFound() {
        // Arrange
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            predictionService.predictMonthlyExpenses("nonexistent@example.com", 1);
        });
    }
}