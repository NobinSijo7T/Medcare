import React from "react";
import "./BouncyCardsFeatures.css";

export const BouncyCardsFeatures = () => {
    return (
        <div className="bouncy-section-wrapper">
            <section className="bouncy-section">
                <div className="bouncy-header">
                    <h2 className="bouncy-title">
                        Why Choose Our
                        <span className="bouncy-title-accent"> Pharmacy?</span>
                    </h2>
                    <p className="bouncy-subtitle">
                        Experience healthcare made simple with our comprehensive services
                    </p>
                </div>
                <div className="bouncy-grid-top">
                    <BounceCard className="bouncy-card-small">
                        <div className="card-icon-wrapper">
                            <svg className="card-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="1" y="3" width="15" height="13"></rect>
                                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                <circle cx="18.5" cy="18.5" r="2.5"></circle>
                            </svg>
                        </div>
                        <CardTitle>Free Delivery</CardTitle>
                        <div className="bouncy-card-content bouncy-violet">
                            <span className="bouncy-card-text">
                                Fast and reliable shipping on orders over ₹500
                            </span>
                        </div>
                    </BounceCard>
                    <BounceCard className="bouncy-card-large">
                        <div className="card-icon-wrapper">
                            <svg className="card-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                <line x1="1" y1="10" x2="23" y2="10"></line>
                            </svg>
                        </div>
                        <CardTitle>Online Payment</CardTitle>
                        <div className="bouncy-card-content bouncy-orange">
                            <span className="bouncy-card-text">
                                Secure payment with multiple options
                            </span>
                        </div>
                    </BounceCard>
                </div>
                <div className="bouncy-grid-bottom">
                    <BounceCard className="bouncy-card-large">
                        <div className="card-icon-wrapper">
                            <svg className="card-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                            </svg>
                        </div>
                        <CardTitle>Easy Returns</CardTitle>
                        <div className="bouncy-card-content bouncy-green">
                            <span className="bouncy-card-text">
                                Hassle-free returns within 30 days
                            </span>
                        </div>
                    </BounceCard>
                    <BounceCard className="bouncy-card-small">
                        <div className="card-icon-wrapper">
                            <svg className="card-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </div>
                        <CardTitle>24/7 Support</CardTitle>
                        <div className="bouncy-card-content bouncy-pink">
                            <span className="bouncy-card-text">
                                Always here to help you
                            </span>
                        </div>
                    </BounceCard>
                </div>
            </section>
        </div>
    );
};

const BounceCard = ({ className, children }) => {
    return (
        <div className={`bouncy-card ${className}`}>
            {children}
        </div>
    );
};

const CardTitle = ({ children }) => {
    return (
        <h3 className="bouncy-card-title">{children}</h3>
    );
};

export default BouncyCardsFeatures;
