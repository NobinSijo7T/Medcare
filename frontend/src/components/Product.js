import "../styles/Product.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/actions/cartActions";
import { useState } from "react";

const Product = ({ imgsrc, title, unique_id, price, category, productId }) => {
  const dispatch = useDispatch();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Adding to cart:", productId);
    dispatch(addToCart(productId, 1));
    
    // Show visual feedback
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="product-card">
      <div className="product-card__image-container">
        <Link to={`/product/${productId}`}>
          <img src={imgsrc} alt={title} loading="lazy" />
        </Link>
      </div>

      <div className="product-card__content">
        <h3 className="product-card__title">{title}</h3>

        <div className="product-card__meta">
          <span className="product-card__category">{category}</span>
          <span className="product-card__price">₹{price}</span>
        </div>

        {/* ID is usually not needed for users, but if required, we can add it subtly
           <span className="product-card__id">#{unique_id}</span> 
        */}

        <div className="product-card__actions">
          <Link to={`/product/${productId}`} className="product-card__button product-card__button--primary">
            View Details
          </Link>
          <button 
            onClick={handleAddToCart} 
            className={`product-card__button product-card__button--secondary ${isAdded ? 'added' : ''}`}
            aria-label="Add to Cart"
            type="button"
          >
            {isAdded ? (
              <i className="fas fa-check"></i>
            ) : (
              <i className="fas fa-shopping-cart"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
