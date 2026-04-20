import { useState, useEffect } from "react";
import AuthService from "../../services/auth.service";
import ProfileCard from "../../components/userProfile/userProfileCard";
import Header from '../../components/utils/header';
import ChangePassword from "../../components/userProfile/changePassword";
import { Toaster } from "react-hot-toast";

function UserProfile() {

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setEmail(user.email)
            setUsername(user.username)
        }
    }, [])

    return (
        <div className="profile-container">
            <Header title="Settings" />
            <Toaster/>
            <div className="profile-grid">
                <div className="profile-info-card">
                    <h3 className="profile-card-title">Profile Information</h3>
                    <ProfileCard username={username} email={email} />
                </div>
                <div className="profile-security-card">
                    <h3 className="profile-card-title">Security Settings</h3>
                    <ChangePassword email={email} />
                </div>
            </div>
        </div>
    )
}

export default UserProfile;