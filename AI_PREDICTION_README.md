# AI Expense Prediction Feature

## Overview
This feature implements an AI-powered expense prediction system that analyzes users' historical transaction data to predict future monthly expenses using linear regression algorithms.

## Features
- **Monthly Expense Prediction**: Predicts total expenses for upcoming months
- **Category-wise Predictions**: Breaks down predictions by expense categories
- **Confidence Scoring**: Provides confidence levels based on data consistency
- **Flexible Time Range**: Predict expenses 1-3 months ahead

## Technical Implementation

### Backend Components

#### 1. PredictionService
- **Interface**: `PredictionService.java`
- **Implementation**: `PredictionServiceImpl.java`
- **Algorithm**: Simple Linear Regression
- **Data Analysis**: Last 6 months of transaction history

#### 2. PredictionController
- **Endpoint**: `/mywallet/predictions/expenses`
- **Methods**: 
  - `GET /expenses?monthsAhead=1` - Predict with query parameter
  - `GET /expenses/{monthsAhead}` - Predict with path variable
- **Authentication**: JWT token required

#### 3. Data Transfer Objects
- **ExpensePredictionDto**: Response structure containing:
  - Total predicted expense
  - Category-wise predictions
  - Prediction month
  - Confidence score
  - Informational message

### Frontend Components

#### 1. ExpensePrediction Component
- **Location**: `src/components/userDashboard/expensePrediction.js`
- **Features**:
  - Interactive month selector (1-3 months ahead)
  - Visual display of predictions
  - Category breakdown
  - Confidence score visualization
  - Error handling and loading states

#### 2. Integration
- Added to user dashboard
- Responsive design with inline CSS
- Real-time updates when changing prediction timeframe

## API Usage

### Request
```http
GET /mywallet/predictions/expenses?monthsAhead=1
Authorization: Bearer <JWT_TOKEN>
```

### Response
```json
{
  "status": "SUCCESS",
  "message": "Expense prediction generated successfully",
  "data": {
    "totalPredictedExpense": 1250.75,
    "categoryWisePredictions": {
      "Food": 400.50,
      "Transportation": 200.25,
      "Entertainment": 150.00
    },
    "predictionMonth": "January 2024",
    "confidenceScore": 0.85,
    "message": "Prediction based on last 6 months of expense data"
  }
}
```

## Algorithm Details

### Linear Regression Model
1. **Data Collection**: Retrieves last 6 months of expense transactions
2. **Data Processing**: Groups transactions by month and category
3. **Trend Analysis**: Applies linear regression to identify spending patterns
4. **Prediction**: Extrapolates future expenses based on historical trends
5. **Confidence Calculation**: Uses coefficient of variation to determine reliability

### Confidence Score Calculation
- Based on spending consistency over time
- Range: 0.1 to 1.0
- Higher scores indicate more predictable spending patterns
- Lower coefficient of variation = higher confidence

## Database Requirements

### New Repository Method
Added to `TransactionRepository.java`:
```java
@Query(value = "SELECT t.* FROM transaction t JOIN users u ON t.user_id = u.id WHERE u.id = :userId AND t.date >= :startDate AND t.date <= :endDate ORDER BY t.date DESC", nativeQuery = true)
List<Transaction> findByUserIdAndDateBetween(@Param("userId") Long userId, @Param("startDate") String startDate, @Param("endDate") String endDate);
```

## Testing

### Unit Tests
- **Location**: `src/test/java/com/fullStack/expenseTracker/PredictionServiceTest.java`
- **Coverage**: 
  - Valid data scenarios
  - No data scenarios
  - User not found scenarios
- **Framework**: JUnit 5 + Mockito

## Usage Instructions

### For Users
1. Navigate to the Dashboard
2. View the "AI Expense Prediction" section
3. Select prediction timeframe (1-3 months)
4. Review total predicted expense and category breakdown
5. Check confidence score for reliability assessment

### For Developers
1. Ensure user has at least 2 months of transaction history for meaningful predictions
2. The system automatically filters expense transactions (transaction type ID = 2)
3. Predictions are based on expense patterns, not income
4. Consider implementing more sophisticated algorithms for better accuracy

## Future Enhancements

### Potential Improvements
1. **Machine Learning Models**: Implement more advanced algorithms (Random Forest, Neural Networks)
2. **Seasonal Adjustments**: Account for seasonal spending patterns
3. **External Factors**: Consider holidays, economic indicators
4. **User Behavior Analysis**: Incorporate spending habit changes
5. **Multiple Prediction Models**: Ensemble methods for better accuracy
6. **Real-time Learning**: Update predictions as new data arrives

### Additional Features
1. **Budget Recommendations**: Suggest optimal budget allocations
2. **Spending Alerts**: Notify when predicted to exceed budget
3. **Goal Tracking**: Predict progress toward financial goals
4. **Comparative Analysis**: Compare predictions with actual spending

## Security Considerations
- All endpoints require JWT authentication
- User data isolation - predictions only use authenticated user's data
- No sensitive financial data exposed in logs
- Input validation for monthsAhead parameter

## Performance Notes
- Predictions are calculated on-demand
- Consider caching for frequently requested predictions
- Database queries optimized with proper indexing
- Frontend implements loading states for better UX

## Dependencies Added
- **Backend**: Mockito for testing
- **Frontend**: No additional dependencies required

## Error Handling
- Graceful handling of insufficient data
- User-friendly error messages
- Fallback to average calculations when regression fails
- Proper HTTP status codes and error responses