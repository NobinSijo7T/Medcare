import "../styles/CartScreen.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";

// Components
import CartItem from "../components/CartItem";

// Actions
import { addToCart, removeFromCart } from "../redux/actions/cartActions";
import { createOrder } from "../redux/actions/orderActions";

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
  const history = useHistory();
  useDarkPage();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderCreate = useSelector((state) => state.orderCreate);
  const { loading: orderLoading, success: orderSuccess, error: orderError } = orderCreate;

  // Checkout form state
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  useEffect(() => {
    if (orderSuccess) {
      // Clear cart after successful order
      cartItems.forEach(item => dispatch(removeFromCart(item.product)));
      // Redirect to profile page to see orders
      history.push("/profile");
    }
  }, [orderSuccess, history, cartItems, dispatch]);

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

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    
    if (!userInfo) {
      history.push("/login?redirect=cart");
      return;
    }

    // Calculate prices
    const itemsPrice = Number(getCartSubTotal());
    const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping over ₹100
    const taxPrice = Number((0.18 * itemsPrice).toFixed(2)); // 18% GST
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

    // Create order object
    const order = {
      orderItems: cartItems.map(item => ({
        name: item.title, // Cart uses 'title' not 'name'
        qty: item.qty,
        imageUrl: item.imgsrc, // Cart uses 'imgsrc' not 'imageUrl'
        price: item.price,
        product: item.product,
      })),
      shippingAddress: {
        address,
        city,
        postalCode,
        country,
      },
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    };

    dispatch(createOrder(order));
  };

  return (
    <>
      {/* Checkout Modal */}
      {showCheckoutForm && (
        <div className="checkout-modal-overlay" onClick={() => setShowCheckoutForm(false)}>
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <button className="checkout-modal-close" onClick={() => setShowCheckoutForm(false)}>
              <i className="fas fa-times"></i>
            </button>
            
            <div className="checkout-modal-header">
              <div className="checkout-modal-icon">
                <i className="fas fa-shopping-bag"></i>
              </div>
              <h2>Complete Your Order</h2>
              <p>Just a few details and you're all set!</p>
            </div>

            <div className="checkout-modal-body">
              {orderError && (
                <div className="checkout-error">
                  <i className="fas fa-exclamation-circle"></i> {orderError}
                </div>
              )}

              <form onSubmit={handlePlaceOrder} className="checkout-form">
                <div className="checkout-section">
                  <h3 className="section-title">
                    <i className="fas fa-shipping-fast"></i> Shipping Information
                  </h3>
                  
                  <div className="form-group">
                    <label htmlFor="address">
                      <i className="fas fa-map-marker-alt"></i> Street Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      placeholder="Enter your street address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">
                        <i className="fas fa-city"></i> City
                      </label>
                      <input
                        type="text"
                        id="city"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="postalCode">
                        <i className="fas fa-mail-bulk"></i> Postal Code
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        placeholder="Postal Code"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="country">
                      <i className="fas fa-globe"></i> Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      placeholder="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="checkout-section">
                  <h3 className="section-title">
                    <i className="fas fa-credit-card"></i> Payment Method
                  </h3>
                  
                  <div className="payment-options">
                    <label className={`payment-option ${paymentMethod === 'Cash on Delivery' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Cash on Delivery"
                        checked={paymentMethod === 'Cash on Delivery'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="payment-content">
                        <i className="fas fa-money-bill-wave"></i>
                        <span>Cash on Delivery</span>
                      </div>
                    </label>

                    <label className={`payment-option ${paymentMethod === 'UPI' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="UPI"
                        checked={paymentMethod === 'UPI'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="payment-content">
                        <i className="fas fa-mobile-alt"></i>
                        <span>UPI</span>
                      </div>
                    </label>

                    <label className={`payment-option ${paymentMethod === 'Card on Delivery' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Card on Delivery"
                        checked={paymentMethod === 'Card on Delivery'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="payment-content">
                        <i className="fas fa-credit-card"></i>
                        <span>Card on Delivery</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="checkout-modal-footer">
                  <div className="order-total-display">
                    <span>Order Total</span>
                    <span className="total-amount">
                      ₹{(Number(getCartSubTotal()) + (Number(getCartSubTotal()) > 100 ? 0 : 10) + (0.18 * Number(getCartSubTotal()))).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="checkout-actions">
                    <button
                      type="button"
                      className="checkout-back-btn"
                      onClick={() => setShowCheckoutForm(false)}
                    >
                      <i className="fas fa-arrow-left"></i> Cancel
                    </button>
                    <button
                      type="submit"
                      className="checkout-submit-btn"
                      disabled={orderLoading}
                    >
                      {orderLoading ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i> Processing...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check-circle"></i> Place Order
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
              <span className="label">Subtotal</span>
              <span className="value">₹{getCartSubTotal()}</span>
            </div>

            <div className="cart-summary-row">
              <span className="label">Shipping</span>
              <span className="value">₹{Number(getCartSubTotal()) > 100 ? 0 : 10}</span>
            </div>

            <div className="cart-summary-row">
              <span className="label">Tax (18% GST)</span>
              <span className="value">₹{(0.18 * Number(getCartSubTotal())).toFixed(2)}</span>
            </div>

            <div className="cart-summary-divider"></div>

            <div className="cart-summary-total">
              <span className="label">Total</span>
              <span className="value">
                ₹{(Number(getCartSubTotal()) + (Number(getCartSubTotal()) > 100 ? 0 : 10) + (0.18 * Number(getCartSubTotal()))).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="cart-checkout-wrap">
            <button 
              className="cart-checkout-btn"
              onClick={() => {
                if (!userInfo) {
                  history.push("/login?redirect=cart");
                } else {
                  setShowCheckoutForm(true);
                }
              }}
            >
              Proceed to Checkout <span>→</span>
            </button>
            <div className="cart-secure-note">
              {Number(getCartSubTotal()) > 100 && "🎉 You qualify for FREE shipping!"}
              {Number(getCartSubTotal()) <= 100 && "💡 Add ₹" + (100 - Number(getCartSubTotal())).toFixed(2) + " more for FREE shipping"}
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default CartScreen;
