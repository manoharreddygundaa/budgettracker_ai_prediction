import { memo, useEffect, useState } from "react";
import AuthService from "../../services/auth.service";
import user from '../../assets/images/user.png'
import useProfileImage from "../../hooks/useProfileImage";

const Header = memo(({ title}) => {

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [profileImg] = useProfileImage();

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setEmail(user.email)
            setUsername(user.username)
        }
    }, [])

    return (
        <div className='modern-header'>
            <div className="header-left">
                <h1 className="page-title">{title}</h1>
                <div className="header-badges">
                    <span className="developer-badge">
                        Developed by <strong>Manohar Reddy</strong>
                    </span>
                    <span className="ai-badge-header">
                        🤖 AI-Powered
                    </span>
                </div>
            </div>


        </div>
    )
})

export default Header;