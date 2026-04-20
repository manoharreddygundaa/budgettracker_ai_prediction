import {useForm} from 'react-hook-form';
import { useRef, useState } from 'react';
import UserService from '../../services/userService';
import toast from 'react-hot-toast';

function ChangePassword({email}) {

    const {register, handleSubmit, watch, reset, formState} = useForm();
    const password = useRef({});
    password.current = watch('newPassword', "");
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);     
        await UserService.settingsResetPassword(email, data.currentPassword, data.newPassword).then(
            (response) => {
                if (response.data.status === "SUCCESS"){
                    toast.success(response.data.response)
                    reset({currentPassword: "", newPassword: "", cpassword: ""})
                    return
                }
            },
            (error) => {
                error.response ? 
                    toast.error(error.response.data.response)
                : 
                    toast.error("Failed to change password: Try again later!")
            }
          );
        setIsLoading(false);
    }

    return(
        <form className="security-form" onSubmit={handleSubmit(onSubmit)}>
            <div className='security-input-group'>
                <label>Current Password</label>
                <input 
                    type='password'
                    {
                        ...register('currentPassword', {
                        required: 'Current password is required!',
                            minLength: {
                                value:8,
                                message: "Password must have atleast 8 characters"
                            }
                        })
                    }
                />
                {formState.errors.currentPassword && <small>{formState.errors.currentPassword.message}</small>}
            </div>

            <div className='security-input-group'>
                <label>New Password</label>
                <input 
                    type='password'
                    {
                        ...register('newPassword', {
                        required: 'Password is required!',
                            minLength: {
                                value:8,
                                message: "Password must have atleast 8 characters"
                            }
                        })
                    }
                />
                {formState.errors.newPassword && <small>{formState.errors.newPassword.message}</small>}
            </div>
                
            <div className='security-input-group'>
                <label>Confirm New Password</label>
                <input 
                    type='password'
                    {
                        ...register('cpassword', {
                            required: 'Confirm password is required!',
                            minLength: {
                                value:8,
                                message: "Password must have atleast 8 characters"
                            },
                            validate: cpass => cpass === password.current || "Passwords do not match!"
                        })
                    }
                />
                {formState.errors.cpassword && <small>{formState.errors.cpassword.message}</small>}
            </div>

            <div className='security-actions'>
                <button 
                    type='submit' 
                    className={`security-btn ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? "Updating..." : 'Update Password'}
                </button>
            </div>
        </form>
    )
}

export default ChangePassword;