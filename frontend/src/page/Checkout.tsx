import React, { useState } from "react";
import "../style/Checkout.css";
import Breadcrumb from "../component/Breadcrumb";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Checkout: React.FC = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0;
  const total = subtotal + shipping; // chỉ dùng để hiển thị FE

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !address || !phone) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (cart.length === 0) {
      alert("Giỏ hàng đang trống.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization có cũng được, backend hiện chưa dùng thì bỏ cũng không sao
          Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          userId: 1,                 // 🚩 tạm thời dùng user có id = 1 trong DB
          shippingAddress: address,  // khớp với Order.shippingAddress
          items: cart.map((item) => ({
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("❌ Tạo đơn thất bại:", errText);
        alert("Tạo đơn hàng thất bại. Kiểm tra log backend.");
        return;
      }

      const data = await res.json();
      console.log("✅ Order created:", data);

      alert("Đặt hàng thành công! Mã đơn: " + (data.id || ""));
      clearCart();
      navigate("/");
    } catch (error) {
      console.error("❌ Lỗi khi gọi API tạo đơn:", error);
      alert("Có lỗi khi tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="checkout-page">
        <Breadcrumb title="CHECKOUT" />
        <div className="checkout-empty">
          <h2>Không có sản phẩm nào để thanh toán.</h2>
          <button onClick={() => navigate("/")}>RETURN TO SHOP</button>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <Breadcrumb title="CHECKOUT" />

      <div className="checkout-container">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Billing details</h2>

          <label>
            Full name *
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nguyễn Văn A"
            />
          </label>

          <label>
            Address *
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
            />
          </label>

          <label>
            Phone *
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0123 456 789"
            />
          </label>

          <button type="submit" className="place-order-btn" disabled={loading}>
            {loading ? "Processing..." : "PLACE ORDER"}
          </button>
        </form>

        <div className="order-summary">
          <h2>Your order</h2>

          <ul className="order-items">
            {cart.map((item) => (
              <li key={item.id} className="order-item-row">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{(item.price * item.quantity).toLocaleString()}₫</span>
              </li>
            ))}
          </ul>

          <div className="order-total-row">
            <span>Subtotal</span>
            <span>{subtotal.toLocaleString()}₫</span>
          </div>
          <div className="order-total-row">
            <span>Shipping</span>
            <span>{shipping.toLocaleString()}₫</span>
          </div>
          <div className="order-total-row total">
            <span>Total</span>
            <span>{total.toLocaleString()}₫</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;