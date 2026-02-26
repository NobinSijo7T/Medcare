import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/actions/userActions";
import "../styles/SignUpScreen.css";

const SignUpScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(register(name, email, password));
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-background-pattern"></div>

      <div className="signup-content">
        <div className="signup-card">
          <div className="signup-card-inner">
            {/* Logo and Branding */}
            <div className="signup-header">
              <div className="logo-section">
                <img src="/medcare.png" alt="Medcare Logo" className="logo-image" />
                <h1 className="brand-name">Medcare</h1>
              </div>
              <p className="signup-subtitle">
                Join our healthcare management system
              </p>
            </div>

            {/* Signup Form */}
            <form onSubmit={submitHandler} className="signup-form">
              {message && (
                <div className="error-message">
                  <span className="error-icon">⚠</span>
                  <span>{message}</span>
                </div>
              )}
              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠</span>
                  <span>{error}</span>
                </div>
              )}
              {loading && (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <span>Creating your account...</span>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Create a password (min. 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="6"
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <button type="submit" className="sign-up-btn" disabled={loading}>
                <span className="btn-text">Create Account</span>
                <span className="btn-icon">→</span>
              </button>
            </form>

            <div className="login-section">
              <p>
                Already have an account?{" "}
                <Link to={redirect ? `/login?redirect=${redirect}` : "/login"} className="login-link">
                  Sign In
                </Link>
              </p>
            </div>

            <div className="terms-section">
              <p>
                By creating an account, you agree to our{" "}
                <Link to="/terms" className="terms-link">
                  Terms
                </Link>{" "}
                &{" "}
                <Link to="/privacy" className="terms-link">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>

        <Link to="/" className="back-button">
          <span className="back-icon">←</span>
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default SignUpScreen;
