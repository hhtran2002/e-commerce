import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ShoppingCartPopup.css";
import { CartItem, useCart } from "../context/CartContext";
type ProductItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};
type Props = {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  updateQuantity: (id: number, newQuantity: number) => void;
  removeItem: (id: number) => void;
};



const ShoppingCartPopup: React.FC<Props> = ({
  isOpen,
  onClose,
  cartItems,
  updateQuantity,
  removeItem,
}) => {
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <>
      <div className={`overlay ${isOpen ? "show" : ""}`} onClick={onClose}></div>

      <div className={`shopping-cart-popup ${isOpen ? "open" : ""}`}>
        <div className="header">
          <h3>Shopping cart</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="content">
          {cartItems.length === 0 ? (
            <p>No products in the cart.</p>
          ) : (
            <>
              <ul className="cart-list">
                {cartItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <li className="cart-item">
                      <img src={item.image} alt={item.name} className="cart-img" />
                      <div className="cart-info">
                        <h4>{item.name}</h4>
                        <p>{item.price.toLocaleString()}₫</p>

                        <div className="quantity-controls">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>

                        <button className="remove-btn" onClick={() => removeItem(item.id)}>
                          Delete
                        </button>
                      </div>
                    </li>
                    {index < cartItems.length - 1 && <hr className="cart-divider" />}
                  </React.Fragment>
                ))}
              </ul>

              <div className="cart-total">
                <strong>Total:</strong>{" "}
                <span>{totalPrice.toLocaleString()}₫</span>
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                PROCEED TO CHECKOUT
              </button>
            </>
          )}

          <button className="return-btn" onClick={onClose}>
            RETURN TO SHOP
          </button>
        </div>
      </div>
    </>
  );
};

export default ShoppingCartPopup;