import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/actions/userActions";
import "../styles/LoginScreen.css";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState("user"); // 'user' or 'admin'

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (userInfo) {
      // Redirect admin to admin panel, regular users to home
      if (userInfo.isAdmin && loginType === "admin") {
        history.push("/admin");
      } else if (!userInfo.isAdmin && loginType === "user") {
        history.push(redirect);
      } else if (userInfo.isAdmin && loginType === "user") {
        // Admin trying to login as user
        history.push(redirect);
      } else {
        // Regular user trying to access admin - show error
        // This will be handled by the backend
        history.push(redirect);
      }
    }
  }, [history, userInfo, redirect, loginType]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <div className="login-container">
      <div className="login-background-pattern"></div>

      <div className="login-content">
        <div className="login-card">
          <div className="login-card-inner">
            {/* Logo and Branding */}
            <div className="login-header">
              <div className="logo-section">
                <img src="/medcare.png" alt="Medcare Logo" className="logo-image" />
                <h1 className="brand-name">Medcare</h1>
              </div>
              <p className="login-subtitle">
                Quality Healthcare Management System
              </p>
            </div>

            {/* Role Selection Tabs */}
            <div className="role-selector">
              <button
                className={`role-tab ${loginType === "user" ? "active" : ""}`}
                onClick={() => setLoginType("user")}
              >
                <span className="role-icon">👤</span>
                <span className="role-label">Patient Login</span>
              </button>
              <button
                className={`role-tab ${loginType === "admin" ? "active" : ""}`}
                onClick={() => setLoginType("admin")}
              >
                <span className="role-icon">🔐</span>
                <span className="role-label">Admin Portal</span>
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={submitHandler} className="login-form">
              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠</span>
                  <span>{error}</span>
                </div>
              )}
              {loading && (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <span>Authenticating...</span>
                </div>
              )}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    id="email"
                    placeholder={loginType === "admin" ? "admin@medcare.com" : "Enter your email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="password-label-row">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  {loginType === "user" && (
                    <Link to="/forgot-password" className="forgot-link">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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

              <div className="form-options">
                {loginType === "user" && (
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-text">Remember me</span>
                  </label>
                )}
              </div>

              <button type="submit" className="sign-in-btn" disabled={loading}>
                <span className="btn-text">
                  {loginType === "admin" ? "Access Portal" : "Sign In"}
                </span>
                <span className="btn-icon">→</span>
              </button>
            </form>

            {/* Additional Info */}
            {loginType === "user" && (
              <div className="signup-section">
                <p>
                  Don't have an account?{" "}
                  <Link to={redirect ? `/signup?redirect=${redirect}` : "/signup"} className="signup-link">
                    Create Account
                  </Link>
                </p>
              </div>
            )}

            {loginType === "admin" && (
              <div className="admin-notice">
                <span className="notice-icon">ℹ️</span>
                <p>Restricted to authorized administrators. All activities are monitored and logged.</p>
              </div>
            )}

            <div className="terms-section">
              <p>
                By continuing, you agree to our{" "}
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

export default LoginScreen;
