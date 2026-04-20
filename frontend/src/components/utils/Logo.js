import { useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";

function Logo() {
    const navigate = useNavigate();
    
    const handleLogoClick = () => {
        if (AuthService.getCurrentUser()) {
            navigate('/user/dashboard');
        } else {
            navigate('/');
        }
    };
    
    return (
        <div className="logo-wrapper" onClick={handleLogoClick}>
            <div className="logo-icon">💰</div>
            <h1 className="logo-text">
                Smart<span className="logo-accent">Finance</span>
            </h1>
        </div>
    )
}

export default Logo;