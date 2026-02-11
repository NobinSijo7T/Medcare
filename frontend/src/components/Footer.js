import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Footer.css";
import BouncyCardsFeatures from "./BouncyCardsFeatures";

const logo = "/medcare_white.png";

function Footer() {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    return (
        <footer className="modern-footer">
            {/* Bouncy Cards Features Section - Hide on Admin Page */}
            {!isAdmin && <BouncyCardsFeatures />}

            {/* Main Footer Content */}
            <div className="footer-main">
                <div className="container">
                    <div className="footer-grid">
                        {/* Company Info */}
                        <div className="footer-column">
                            <div className="footer-logo">
                                <img src={logo} alt="MedCare Logo" />
                            </div>
                            <div className="footer-contact">
                                <div className="contact-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    <span>CEK,Karunagappally,Kollam,Kerala,India</span>
                                </div>
                                <div className="contact-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                    </svg>
                                    <span>+91 9876543210</span>
                                </div>
                                <div className="contact-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                    <span>contact@pharmacy.com</span>
                                </div>
                            </div>
                        </div>

                        {/* My Account */}
                        <div className="footer-column">
                            <h3>My Account</h3>
                            <ul className="footer-links">
                                <li><Link to="/profile">My Profile</Link></li>
                                <li><Link to="/orders">My Order History</Link></li>
                                <li><Link to="/track"> AI Prescription Ordering</Link></li>
                                <li><Link to="/cart">Shopping Cart</Link></li>
                            </ul>
                        </div>

                        {/* Shop Departments */}
                        <div className="footer-column">
                            <h3>Shop Departments</h3>
                            <ul className="footer-links">
                                <li><Link to="/products/dermatology">Dermatology</Link></li>
                                <li><Link to="/products/dental">Dental Care</Link></li>
                                <li><Link to="/products/depression">Mental Health</Link></li>
                                <li><Link to="/products/womensCare">Women's Care</Link></li>
                            </ul>
                        </div>


                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <div className="container">
                    <div className="footer-bottom-content">
                        <div className="payment-methods">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="American Express" />

                        </div>
                        <p className="copyright">© 2026 E-Pharmacy. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
