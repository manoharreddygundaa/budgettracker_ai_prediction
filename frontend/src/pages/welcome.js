import { Link } from 'react-router-dom';
import '../assets/styles/welcome.css';
import Logo from '../components/utils/Logo';

function Welcome() {
    return (
        <div className="welcome-container">
            <nav className="welcome-nav">
                <Logo/>
                <div className="nav-buttons">
                    <Link to='/auth/login' className="nav-btn login-btn">Sign In</Link>
                    <Link to='/auth/register' className="nav-btn register-btn">Get Started</Link>
                </div>
            </nav>
            
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        🚀 AI-Powered Financial Intelligence
                    </div>
                    <h1 className="hero-title">
                        Smart Finance Management
                        <span className="gradient-text"> Made Simple</span>
                    </h1>
                    <p className="hero-description">
                        Experience the future of expense tracking with AI-powered predictions, 
                        intelligent insights, and seamless financial management. Take control 
                        of your finances like never before.
                    </p>
                    
                    <div className="hero-buttons">
                        <Link to='/auth/register' className="cta-primary">
                            Start Free Trial
                            <i className="fas fa-arrow-right"></i>
                        </Link>
                        <Link to='/auth/login' className="cta-secondary">
                            <i className="fas fa-play"></i>
                            Watch Demo
                        </Link>
                    </div>
                    
                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-number">95%</span>
                            <span className="stat-label">Prediction Accuracy</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">10K+</span>
                            <span className="stat-label">Happy Users</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">24/7</span>
                            <span className="stat-label">AI Monitoring</span>
                        </div>
                    </div>
                </div>
                
                <div className="hero-visual">
                    <div className="floating-card card-1">
                        <div className="card-icon">💰</div>
                        <div className="card-content">
                            <h4>Smart Predictions</h4>
                            <p>AI forecasts your expenses</p>
                        </div>
                    </div>
                    <div className="floating-card card-2">
                        <div className="card-icon">📊</div>
                        <div className="card-content">
                            <h4>Real-time Analytics</h4>
                            <p>Track spending patterns</p>
                        </div>
                    </div>
                    <div className="floating-card card-3">
                        <div className="card-icon">🎯</div>
                        <div className="card-content">
                            <h4>Goal Achievement</h4>
                            <p>Reach financial targets</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="features-section">
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🤖</div>
                        <h3>AI Predictions</h3>
                        <p>Advanced machine learning algorithms predict your future expenses with 95% accuracy</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📱</div>
                        <h3>Smart Dashboard</h3>
                        <p>Beautiful, intuitive interface that makes financial management effortless</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔒</div>
                        <h3>Bank-Level Security</h3>
                        <p>Your financial data is protected with enterprise-grade encryption</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Welcome;