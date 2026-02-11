import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/actions/userActions';
import '../styles/UserProfileButton.css';

const UserProfileButton = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const dispatch = useDispatch();
    const history = useHistory();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const logoutHandler = () => {
        dispatch(logout());
        setShowDropdown(false);
        history.push('/');
    };

    if (!userInfo) {
        return (
            <div className="user-profile-container">
                <Link to="/login" className="login-circle-button">
                    <i className="fas fa-sign-in-alt"></i>
                </Link>
            </div>
        );
    }

    return (
        <div className="user-profile-container" ref={dropdownRef}>
            <button
                className={`user-circle-button ${showDropdown ? 'active' : ''}`}
                onClick={() => setShowDropdown(!showDropdown)}
                aria-label="User profile menu"
            >
                <i className="fas fa-user-circle"></i>
            </button>

            {showDropdown && (
                <div className="user-profile-dropdown">
                    <div className="dropdown-header">
                        <div className="user-avatar">
                            <i className="fas fa-user-circle"></i>
                        </div>
                        <div className="user-info">
                            <h4>{userInfo.name}</h4>
                            <p>{userInfo.email}</p>
                        </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link 
                        to="/profile" 
                        className="dropdown-link" 
                        onClick={() => setShowDropdown(false)}
                    >
                        <i className="fas fa-user"></i>
                        <span>My Profile</span>
                    </Link>
                    <Link 
                        to="/profile" 
                        className="dropdown-link" 
                        onClick={() => setShowDropdown(false)}
                    >
                        <i className="fas fa-shopping-bag"></i>
                        <span>My Orders</span>
                    </Link>
                    <Link 
                        to="/cart" 
                        className="dropdown-link" 
                        onClick={() => setShowDropdown(false)}
                    >
                        <i className="fas fa-shopping-cart"></i>
                        <span>Cart</span>
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button 
                        className="dropdown-link logout-link" 
                        onClick={logoutHandler}
                    >
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfileButton;
