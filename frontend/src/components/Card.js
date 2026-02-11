import "../styles/Product.css";
import { Link } from "react-router-dom";

function Card({ imgsrc, title, info, link, id }) {
  return (
    <div className="product-card">
      <div className="product-card__image-container">
        <img src={imgsrc} alt={title} loading="lazy" />
      </div>

      <div className="product-card__content">
        <h3 className="product-card__title">{title}</h3>
        <p className="product-card__description">{info}</p>
        <Link to={link} className="product-card__button">
          Shop Now
        </Link>
      </div>
    </div>
  )
}

export default Card
