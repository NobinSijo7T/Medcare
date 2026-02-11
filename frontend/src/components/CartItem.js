import "../styles/CartItem.css";
import { Link } from "react-router-dom";

const CartItem = ({ item, qtyChangeHandler, removeHandler }) => {
  return (
    <div className="cartitem">
      <div className="cartitem__image">
        <img
          src={item.imgsrc}
          alt={item.title}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/100?text=Rx";
          }}
        />
      </div>

      <Link to={`/product/${item.product}`} className="cartItem__name">
        <p>{item.title}</p>
      </Link>

      <p className="cartitem__price">₹{item.price}</p>

      <select
        className="cartItem__select"
        value={item.qty}
        onChange={(e) => qtyChangeHandler(item.product, e.target.value)}
      >
        {[...Array(item.countInStock).keys()].map((x) => (
          <option key={x + 1} value={x + 1}>
            {x + 1}
          </option>
        ))}
      </select>

      <button
        className="cartItem__deleteBtn"
        onClick={() => removeHandler(item.product)}
        title="Remove from cart"
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default CartItem;
