import "../styles/Navbar.css";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/actions/userActions";
import logo from "../images/logo.png";

const Navbar = ({ click }) => {
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();
  const history = useHistory();

  const getCartCount = () => {
    return cartItems.reduce((qty, item) => Number(item.qty) + qty, 0);
  };

  const logoutHandler = () => {
    dispatch(logout());
    history.push("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    
      <Link to="/" className="">
        <span className="logo">
          <img src={logo} style={{ height: "40px", width: "200px" }} alt="" />
        </span>

      </Link>


      <ul className="navbar__links">

        <li>
          <Link to="/" className="">
            <span>
              Home
            </span>
          </Link>
        </li>
        <li>
          <Link to="/allProducts" className="">
            <span>
              Products
            </span>
          </Link>
        </li>
      </ul>


      <ul className="navbar__links">

        <li>
          <Link to="/cart" className="cart__link">
            <i className="fas fa-shopping-cart"></i>
            <span>
              Cart <span className="cartlogo__badge">{getCartCount()}</span>
            </span>
          </Link>
        </li>
        {userInfo ? (
          <li className="dropdown">
            <button className="user-profile-btn">
              <i className="fas fa-user-circle"></i>
              <span>{userInfo.name}</span>
            </button>
            <div className="dropdown-menu">
              <Link to="/profile" className="dropdown-item">
                <i className="fas fa-user"></i> Profile
              </Link>
              <Link to="/profile" className="dropdown-item">
                <i className="fas fa-shopping-bag"></i> My Orders
              </Link>
              <button onClick={logoutHandler} className="dropdown-item logout-btn">
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </li>
        ) : (
          <li>
            <Link to="/login" className="login-link">
              <i className="fas fa-sign-in-alt"></i>
              <span>Login</span>
            </Link>
          </li>
        )}
      </ul>

      <div className="hamburger__menu" onClick={click}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </nav>
  );
};

export default Navbar;
