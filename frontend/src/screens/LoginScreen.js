import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/actions/userActions";
import "../styles/LoginScreen.css";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-section">
            <span className="logo-icon">⚕</span>
            <span className="logo-text">Logoipsum</span>
          </div>
          <h1 className="login-title">Sign in to your account</h1>
          <p className="login-subtitle">
            Don't have an account?{" "}
            <Link to={redirect ? `/signup?redirect=${redirect}` : "/signup"} className="create-link">
              Create one.
            </Link>
          </p>
        </div>

        <div className="social-login">
          <button className="social-btn twitter-btn">
            <i className="fab fa-twitter"></i>
          </button>
          <button className="social-btn github-btn">
            <i className="fab fa-github"></i>
          </button>
          <button className="sso-btn">Sign in with SSO</button>
        </div>

        <div className="divider">
          <span>OR</span>
        </div>

        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading-spinner">Loading...</div>}

        <form onSubmit={submitHandler} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="your.email@provider.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div className="password-label-row">
              <label htmlFor="password">Password</label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              placeholder="············"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="sign-in-btn" disabled={loading}>
            Sign in
          </button>
        </form>

        <div className="terms-section">
          <p>
            By signing in, you agree to our{" "}
            <Link to="/terms" className="terms-link">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="terms-link">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      <Link to="/" className="back-button">
        <i className="fas fa-arrow-left"></i> Go back
      </Link>
    </div>
  );
};

export default LoginScreen;
