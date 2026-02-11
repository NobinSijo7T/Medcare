import "../styles/CartScreen.css";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";

// Components
import CartItem from "../components/CartItem";

// Actions
import { addToCart, removeFromCart } from "../redux/actions/cartActions";

// Hook for dark theme (copied from prescription screen logic)
const useDarkPage = () => {
  useEffect(() => {
    const body = document.body;
    const app = document.querySelector('.app');
    const footer = document.querySelector('.modern-footer');

    // Save originals
    const origBodyBg = body.style.background;
    const origAppBg = app?.style.background;
    const origAppPt = app?.style.paddingTop;
    const origFooterMt = footer?.style.marginTop;
    const origFooterBg = footer?.style.backgroundColor;

    // Apply dark overrides
    body.style.background = '#0a0a0a';
    if (app) {
      app.style.background = '#0a0a0a';
      app.style.paddingTop = '0';
    }
    if (footer) {
      footer.style.marginTop = '0';
      footer.style.backgroundColor = '#0a0a0a';
    }

    return () => {
      body.style.background = origBodyBg;
      if (app) {
        app.style.background = origAppBg;
        app.style.paddingTop = origAppPt;
      }
      if (footer) {
        footer.style.marginTop = origFooterMt;
        footer.style.backgroundColor = origFooterBg;
      }
    };
  }, []);
};

const CartScreen = () => {
  const dispatch = useDispatch();
  useDarkPage();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const qtyChangeHandler = (id, qty) => {
    dispatch(addToCart(id, qty));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const getCartCount = () => {
    return cartItems.reduce((qty, item) => Number(item.qty) + qty, 0);
  };

  const getCartSubTotal = () => {
    return cartItems
      .reduce((price, item) => price + item.price * item.qty, 0)
      .toFixed(2);
  };

  const makePayment = token => {
    const body = {
      token,
      product: cartItems,
      price: getCartSubTotal()
    }
    const headers = {
      "content-type": "application/json"
    }

    return fetch(`http://localhost:5000/payment`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    }).then(response => {
      cartItems.forEach(item => dispatch(removeFromCart(item.product)))
    }).catch(error => {
      console.log("ERROR", error)
    })
  }

  return (
    <div className="cartscreen">
      <div className="cartscreen__left">
        <h2>Your Cart</h2>
        <p className="cart-subtitle">Review and manage your selected items</p>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty-icon">🛒</span>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/allProducts" className="cart-empty-link">
              Start Shopping
            </Link>
          </div>
        ) : (
          cartItems.map((item) => (
            <CartItem
              key={item.product}
              item={item}
              qtyChangeHandler={qtyChangeHandler}
              removeHandler={removeFromCartHandler}
            />
          ))
        )}

        {cartItems.length > 0 && (
          <div className="cart-continue">
            <Link to="/allProducts" className="cart-continue-link">
              ← Continue Shopping
            </Link>
          </div>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="cartscreen__right">
          <div className="cartscreen__info">
            <div className="cart-summary-title">Order Summary</div>

            <div className="cart-summary-row">
              <span className="label">Total Items</span>
              <span className="value">{getCartCount()}</span>
            </div>

            <div className="cart-summary-row">
              <span className="label">Subtotal (INR)</span>
              <span className="value">₹{getCartSubTotal()}</span>
            </div>

            <div className="cart-summary-row">
              <span className="label">USD Approx.</span>
              <span className="value">${(getCartSubTotal() * 0.014).toFixed(2)}</span>
            </div>

            <div className="cart-summary-divider"></div>

            <div className="cart-summary-total">
              <span className="label">Total</span>
              <span className="value">₹{getCartSubTotal()}</span>
            </div>
          </div>

          <div className="cart-checkout-wrap">
            <StripeCheckout
              stripeKey="pk_test_51IPsBgEwEbzzqba9A4AQsmpCvFKjJbN9AyCrLYwCykIR1XTe8mFHcRQB6qWHz1Y6D8XZSK0gHi2CIr92nDzrs07f00W0hXIIRv"
              token={makePayment}
              amount={getCartSubTotal() * 100}
              name="Pharmacy Checkout"
              currency="INR"
              shippingAddress
              billingAddress
            >
              <button className="cart-checkout-btn">
                Proceed to Checkout <span>→</span>
              </button>
            </StripeCheckout>

            <div className="cart-secure-note">
              🔒 Powered by Stripe for secure payments
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;
