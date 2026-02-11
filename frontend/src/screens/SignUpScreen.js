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
      <div className="signup-card">
        <div className="signup-header">
          <div className="logo-section">
            <span className="logo-icon">⚕</span>
            <span className="logo-text">Logoipsum</span>
          </div>
          <h1 className="signup-title">Create your account</h1>
          <p className="signup-subtitle">
            Already have an account?{" "}
            <Link to={redirect ? `/login?redirect=${redirect}` : "/login"} className="login-link">
              Sign in.
            </Link>
          </p>
        </div>

        <div className="social-signup">
          <button className="social-btn twitter-btn">
            <i className="fab fa-twitter"></i>
          </button>
          <button className="social-btn github-btn">
            <i className="fab fa-github"></i>
          </button>
          <button className="sso-btn">Sign up with SSO</button>
        </div>

        <div className="divider">
          <span>OR</span>
        </div>

        {message && <div className="error-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading-spinner">Loading...</div>}

        <form onSubmit={submitHandler} className="signup-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="············"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="············"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="sign-up-btn" disabled={loading}>
            Create Account
          </button>
        </form>

        <div className="terms-section">
          <p>
            By signing up, you agree to our{" "}
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

export default SignUpScreen;
