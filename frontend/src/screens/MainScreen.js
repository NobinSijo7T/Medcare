import React from 'react';
import { Link } from 'react-router-dom';
import caro2 from "../images/caro2.jpg";
import "../styles/MainScreen.css";
import allProductsData from "../Data/allProductsData";
import Product from "../components/Product"; // Changed from Card to Product to use the new card design?
// Wait, Card.js was refactored in Step 265 to be modern. Product.js was refactored in Step 385/404.
// MainScreen uses Card (Step 438).
// Card.js (Step 265) uses .product-card CSS.
// Product.js (Step 404) also uses .product-card CSS.
// They share the same CSS class but Product.js has "Add to Cart". Card.js only "Shop Now".
// MainScreen maps allProductsData which are CATEGORIES.
// So I should keep using Card.js (Categories) but maybe switch to Product.js CSS?
// Wait, Card.js uses Product.css too? No, Card.js imported Product.css in line 1 of Step 259.
// So Card.js renders categories using the same CSS logic. That's fine.

import Card from "../components/Card";


function MainScreen() {
    return (
        <div className="main-screen">
            {/* Modern Hero Section */}
            <section className="hero-section">
                <div className="hero-container">
                    <div className="hero-content">
                        <span className="hero-badge">AI-Powered Healthcare</span>
                        <h1 className="hero-title">
                            Your Personal <br />
                            <span className="text-highlight">Digital Pharmacy</span>
                        </h1>
                        <p className="hero-subtitle">
                            Experience the future of medicine delivery. Upload prescriptions for AI analysis or browse our premium collection of healthcare products.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/allProducts" className="hero-btn-primary">
                                Browse Store
                            </Link>
                            <Link to="/prescription" className="hero-btn-secondary">
                                <i className="fas fa-robot"></i> AI Prescription
                            </Link>
                        </div>

                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-number">24/7</span>
                                <span className="stat-label">Support</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">100%</span>
                                <span className="stat-label">Authentic</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">Fast</span>
                                <span className="stat-label">Delivery</span>
                            </div>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="visual-circle"></div>
                        <img src={caro2} alt="Modern Pharmacy" className="hero-image" />
                        <div className="visual-card visual-card-1">
                            <i className="fas fa-shield-alt"></i>
                            <span>Secure</span>
                        </div>
                        <div className="visual-card visual-card-2">
                            <i className="fas fa-bolt"></i>
                            <span>Fast</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="categories-section">
                <div className="section-header">
                    <h2 className="section-title">Explore Categories</h2>
                    <p className="section-subtitle">Find medicines by health condition</p>
                </div>

                <div className="homescreen__products">
                    {allProductsData.map((val, index) => {
                        return (
                            <Card
                                key={index}
                                imgsrc={val.imgsrc}
                                title={val.title}
                                info={val.info}
                                link={val.link}
                                id={val.id}
                            />
                        )
                    })}
                </div>
            </section>
        </div>
    )
}

export default MainScreen;
