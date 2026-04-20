import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import '../../assets/styles/sidebar.css'
import SideBarLinks from './sideBarLinks';
import { useState } from 'react';
import AuthVerify from '../../services/auth.verify';
import Logo from '../utils/Logo';


function Sidebar({ activeNavId }) {

    const [isSideBarOpen, setIsSideBarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const isActiveLink = (linkTo) => {
        return location.pathname === linkTo;
    };

    const logout = () => {
        AuthService.logout_req();
        navigate('/')
        window.location.reload()
    }

    return (
        <div className={(isSideBarOpen) ? "side-bar open" : "side-bar"}>
            <div style={{ padding: '25px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div className="logo-container">
                    <Logo/>
                </div>
                <span onClick={() => setIsSideBarOpen(false)} className='mobile'><i className="fa fa-times" aria-hidden='true'></i></span>
                <span onClick={() => setIsSideBarOpen(true)} className='mobile menu'><i className="fa fa-bars" aria-hidden='true'></i></span>
            </div>

            <ul>
                {
                    SideBarLinks
                        .filter(link => AuthService.getCurrentUser() && AuthService.getCurrentUser().roles.includes(link.role))
                        .map((link) => {
                            return (
                                <Link key={link.id} className='nav-link' to={link.to}>
                                    <li
                                        className={isActiveLink(link.to) ? "active" : ""}
                                    >
                                        <i className={link.icon} aria-hidden='true'></i>
                                        {link.name}
                                    </li>
                                </Link>
                            );
                        })
                }
                <div className="logout-item">
                    <span onClick={logout}><Link className='nav-link'><li><i className="fa fa-sign-out" aria-hidden="true"></i>Log out</li></Link></span>
                </div>
            </ul>
            <AuthVerify logOut={logout}/>

        </div>
    )
}

export default Sidebar;