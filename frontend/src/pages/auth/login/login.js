import {useEffect, useState} from 'react';
import '../../../assets/styles/register.css';
import {useForm} from 'react-hook-form';
import { Link, useNavigate} from 'react-router-dom';
import AuthService from '../../../services/auth.service';
import Logo from '../../../components/utils/Logo';

function Login() {

    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (AuthService.getCurrentUser() && AuthService.getCurrentUser().roles.includes("ROLE_USER")) {
            navigate("/user/dashboard");
        }else if (AuthService.getCurrentUser() && AuthService.getCurrentUser().roles.includes("ROLE_ADMIN")) {
            navigate("/admin/transactions");
        }
        
        // Check for success message from registration
        const message = localStorage.getItem("message");
        if (message) {
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.status === "SUCCESS") {
                setSuccessMessage(parsedMessage.text);
                localStorage.removeItem("message");
            }
        }
    }, [])


    const {register, handleSubmit,formState} = useForm();

    const [response_error, setResponseError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true)        
        await AuthService.login_req(data.email, data.password).then(
            () => {
                setResponseError("");

                setTimeout(() => {
                    if (AuthService.getCurrentUser().roles.includes("ROLE_USER")) {
                        navigate("/user/dashboard");
                    }else if (AuthService.getCurrentUser().roles.includes("ROLE_ADMIN")) {
                        navigate("/admin/transactions");
                    }
                }, 5000)
                localStorage.setItem("message", JSON.stringify({ status: "SUCCESS", text: "Login successfull!" }))
            },
            (error) => {
                const resMessage =(error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                console.log(resMessage);
                if (resMessage === "Bad credentials"){
                    setResponseError("Invalid email or password!");
                }else {
                    setResponseError("Something went wrong: Try again later!");
                }
            }
          );
        setIsLoading(false);
    }

    return(
        <div className='container'>
            <form className="auth-form"  onSubmit={handleSubmit(onSubmit)}>
                <Logo/>
                <h2>Welcome Back! 👋</h2>
                {
                    (successMessage !== "") && <p className="success-message">{successMessage}</p>
                }
                {
                    (response_error!=="") && <p>{response_error}</p>
                }
                
                <div className='input-box'>
                    <label>📧 Email Address</label>
                    <input 
                        type='email'
                        placeholder="Enter your email"
                        {...register('email', {
                            required: "Email is required!",
                            pattern: {value:/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g, message:"Invalid email address!"}
                        })}
                    />
                    {formState.errors.email && <small>{formState.errors.email.message}</small>}
                </div>
                
                <div className='input-box'>
                    <label>🔒 Password</label>
                    <input 
                        type='password'
                        placeholder="Enter your password"
                        {
                            ...register('password', {
                                required: 'Password is required!'
                            })
                        }
                    />
                    {formState.errors.password && <small>{formState.errors.password.message}</small>}
                </div>
                
                <div className='msg'>
                    <Link to={'/auth/forgetpassword/verifyEmail'}>Forgot password?</Link>
                </div>
                
                <div className='input-box'>
                    <input type='submit' value={isLoading ? "Signing in..." : 'Sign In'}
                        className={isLoading ? "loading" : ""}
                        disabled={isLoading}
                    />
                </div>
                
                <div className='msg'>New to SmartFinance? <Link to='/auth/register'>Create Account</Link></div>
            </form>
        </div>
    )
}

export default Login;