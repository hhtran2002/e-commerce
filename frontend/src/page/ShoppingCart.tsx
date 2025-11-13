import React, { useState } from "react";
import "../style/ShoppingCart.css";
import Breadcrumb from "../component/Breadcrumb";
// import Sidebar from "../component/Sidebar";
import CartItem from "../component/CartItem";
import CartSummary from "../component/CartSummary";

interface CartProduct {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const ShoppingCart: React.FC = () => {
  const [cart, setCart] = useState<CartProduct[]>([
    {
      id: 1,
      name: "Amorino Crop Top - Green, XS",
      price: 415.0,
      quantity: 1,
      image: "https://stitched-lb.com/wp-content/uploads/2023/07/641dd35dbafb9-533x800.jpg",
    },
  ]);

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const removeItem = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 15.0;

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
          <CartItem key={item.id} product={item} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
        ))}
      </tbody>
    </table>

    {/* Nhập mã giảm giá */}
    <div className="cart-actions">
      <input type="text" placeholder="Coupon code" className="coupon-input" />
      <button className="apply-coupon">APPLY COUPON</button>
    </div>
  </div>

  {/* Tóm tắt giỏ hàng */}
  <CartSummary subtotal={subtotal} shipping={shipping} onCheckout={() => alert("Proceeding to checkout!")} />
</div>

      </div>
    </main>
  );
};

export default ShoppingCart;