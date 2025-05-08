import { useState } from 'react';
import { FaBars, FaTimes, FaSignOutAlt, FaUser } from 'react-icons/fa';
import './Navbar.css'; // You can name the file anything, just make sure to import it
import { Link } from 'react-router-dom';
const Navbar = ({ userName = "abihollowbricks@gmail.com", profilePic = "", onToggleSidebar, isSidebarOpen, onLogout }) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const initial = userName.charAt(0).toUpperCase();

    return (
        <header className="navbarHeader">
            <button className="sidebarToggleBtn" onClick={onToggleSidebar}>
                {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>

            <input
                type="text"
                placeholder="Search..."
                className="navbarSearch"
            />

            <div className="navbarProfileSection">
                <div className="navbarProfile" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                    <span>{userName}</span>
                    {profilePic ? (
                        <img src={profilePic} alt="Profile" className="navbarAvatar" />
                    ) : (
                        <div className="navbarInitial">A</div>
                    )}
                </div>

                {showProfileMenu && (
                    <div className="navbarDropdown">
                        <ul>
                            <li><FaUser /> Profile</li>
                            <li onClick={onLogout}><FaSignOutAlt /> Logout</li>
                        </ul>
                    </div>
                )}
                
            </div>
            
        </header>
    );
};

export default Navbar;
