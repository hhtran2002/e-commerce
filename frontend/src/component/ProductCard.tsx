import "../style/ProductCard.css";
import React from "react";
import { useNavigate } from "react-router-dom";

type Product = {
  id: number;
  name: string;
  img: string;
  price: number;
  discountPrice?: number;
  isOnSale?: boolean;
};

type Props = {
  product: Product;
  onBuy?: () => void;
};

const ProductCard: React.FC<Props> = ({ product, onBuy }) => {
  const navigate = useNavigate();

  const goToDetail = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className={`product-card ${product.isOnSale ? 'sale-product' : ''}`}>
      {product.isOnSale && <div className="sale-badge">SALE</div>}
      <img
        src={product.img}
        alt={product.name}
        className="product-image"
        onClick={goToDetail}
        style={{ cursor: "pointer" }}
      />

      <div className="product-info">
        <p
          className="product-name"
          onClick={goToDetail}
          style={{ cursor: "pointer" }}
        >
          {product.name}
        </p>
        <div className="product-price">
          {product.isOnSale ? (
            <>
              <span className="original-price">
                {product.price.toLocaleString()}₫
              </span>
              <span className="discount-price">
                {product.discountPrice?.toLocaleString()}₫
              </span>
            </>
          ) : (
            <span className="regular-price">
              {product.price.toLocaleString()}₫
            </span>
          )}
        </div>
      </div>

      <button className={`buy-btn ${product.isOnSale ? 'sale-btn' : ''}`} onClick={onBuy}>
        BUY NOW
      </button>
    </div>
  );
};

export default ProductCard;