# SmartFinance - AI Expense Tracker

An intelligent expense tracking application with AI-powered predictions built with Spring Boot and React.

## 🚀 Features

### Core Features
- **User Authentication** - Secure JWT-based login/registration
- **Expense Management** - Add, edit, delete transactions
- **Category Management** - Organize expenses by categories
- **Budget Tracking** - Set and monitor monthly budgets
- **Dashboard Analytics** - Visual charts and summaries

### 🤖 AI-Powered Features
- **Expense Prediction** - Predict future monthly expenses using linear regression
- **Category-wise Predictions** - Detailed breakdown by expense categories
- **Confidence Scoring** - Reliability assessment of predictions
- **Trend Analysis** - 6-month historical data analysis

## 🛠️ Technology Stack

### Backend
- **Java 17** with Spring Boot 3.2.1
- **Spring Security** for authentication
- **Spring Data JPA** for database operations
- **MySQL** database
- **JWT** for secure authentication
- **Custom AI Algorithm** for expense prediction

### Frontend
- **React 18** with modern hooks
- **Axios** for API communication
- **Recharts** for data visualization
- **React Router** for navigation
- **CSS3** for styling

## 📊 AI Prediction Algorithm

The application uses a custom linear regression model that:
1. Analyzes last 6 months of expense data
2. Identifies spending patterns and trends
3. Generates predictions for 1-3 months ahead
4. Provides category-wise expense breakdown
5. Calculates confidence scores based on data consistency

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 16+
- MySQL 8.0+
- Maven 3.6+

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Database Setup
1. Create MySQL database: `smartfinance`
2. Update `application.properties` with your database credentials
3. Run the application - tables will be created automatically

## 📱 Usage

1. **Register/Login** to your account
2. **Add Categories** for your expenses
3. **Record Transactions** daily
4. **Set Monthly Budgets** to track spending
5. **View AI Predictions** on the dashboard
6. **Analyze Trends** with interactive charts

## 🎯 AI Prediction Accuracy

The AI model achieves:
- **70-90% confidence** with 3+ months of data
- **Category-wise accuracy** based on spending consistency
- **Seasonal adjustments** for longer-term predictions

## 🔮 Future Enhancements

- Machine Learning models (Random Forest, Neural Networks)
- Seasonal spending pattern recognition
- Budget optimization recommendations
- Mobile app development
- Integration with bank APIs

## 👨‍💻 Developer

**Your Name**
- LinkedIn: https://www.linkedin.com/in/gunda-manoharreddy-00409027a/
- GitHub: (https://github.com/manoharreddygundaa/budgettracker_ai_prediction)
- Email: gundamanoharreddy15@gmail.com

## 📄 License

This project is licensed under the MIT License.

---

*Built with ❤️ and AI intelligence*