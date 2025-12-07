import React from "react";
import "../style/ShoppingCart.css";
import Breadcrumb from "../component/Breadcrumb";
import CartItem from "../component/CartItem";
import CartSummary from "../component/CartSummary";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const ShoppingCart: React.FC = () => {
  const { cart, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = 0; // tạm thời cho 0, sau này bạn có thể tính phí ship riêng

  const handleCheckout = () => {
    navigate("/checkout");
  };

  // Nếu giỏ hàng trống
  if (cart.length === 0) {
    return (
      <main className="shopping-cart-page">
        <Breadcrumb title="SHOPPING CART" />
        <div className="content-container">
          <div className="cart-container empty-cart">
            <h2>Your cart is currently empty.</h2>
            <button className="return-shop-btn" onClick={() => navigate("/")}>
              RETURN TO SHOP
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="shopping-cart-page">
      <Breadcrumb title="SHOPPING CART" />
      <div className="content-container">
        <div className="cart-container">
          {/* Danh sách sản phẩm trong giỏ hàng */}
          <div className="cart-items">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    product={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </tbody>
            </table>

            {/* Nhập mã giảm giá */}
            <div className="cart-actions">
              <input
                type="text"
                placeholder="Coupon code"
                className="coupon-input"
              />
              <button className="apply-coupon">APPLY COUPON</button>
            </div>
          </div>

          {/* Tóm tắt giỏ hàng */}
          <CartSummary
            subtotal={subtotal}
            shipping={shipping}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </main>
  );
};

export default ShoppingCart;
