import "../styles/ProductScreen.css";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// Actions
import { getProductDetails } from "../redux/actions/productActions";
import { addToCart } from "../redux/actions/cartActions";

const ProductScreen = ({ match, history }) => {
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.getProductDetails);
  const { loading, error, product } = productDetails;

  useEffect(() => {
    if (product && match.params.id !== product._id) {
      dispatch(getProductDetails(match.params.id));
    }
  }, [dispatch, match, product]);

  const addToCartHandler = () => {
    dispatch(addToCart(product._id, qty));
    history.push(`/cart`);
  };

  return (
    <div className="productscreen">
      {loading ? (
        <div className="product-loading">
          <div className="loader-spinner"></div>
          <h2>Loading Product Details...</h2>
        </div>
      ) : error ? (
        <div className="product-error">
          <h2>{error}</h2>
        </div>
      ) : (
        <>
          <div className="productscreen__content">
            {/* Left Column: Image */}
            <div className="product-image-section">
              <img src={product.imgsrc} alt={product.title} />
            </div>

            {/* Middle Column: Details */}
            <div className="product-details-section">
              <div className="details-card">
                <h1 className="product-title">{product.title}</h1>
                <div className="product-price-tag">₹{product.price}</div>

                <div className="product-info-group">
                  <h3 className="info-label">Indication</h3>
                  <p className="info-text">{product.indication}</p>
                </div>

                <div className="product-info-group">
                  <h3 className="info-label">Dosage</h3>
                  <p className="info-text">{product.dosage}</p>
                </div>

                <div className="product-info-group">
                  <h3 className="info-label">Side Effects</h3>
                  <p className="info-text">{product.sideEffects}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Actions */}
            <div className="product-action-section">
              <div className="action-card">
                <div className="action-row">
                  <span>Price:</span>
                  <span className="price-value">₹{product.price}</span>
                </div>

                <div className="action-row">
                  <span>Status:</span>
                  <span className={product.countInStock > 0 ? "status-success" : "status-error"}>
                    {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <div className="action-row">
                  <span>Quantity:</span>
                  <select value={qty} onChange={(e) => setQty(e.target.value)}>
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  className="add-to-cart-btn"
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                >
                  <i className="fas fa-shopping-cart" style={{ marginRight: '8px' }}></i>
                  <span>{product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductScreen;
