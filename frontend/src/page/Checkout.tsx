import React, { useState } from "react";
import "../style/Checkout.css";
import Breadcrumb from "../component/Breadcrumb";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Checkout: React.FC = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState(""); // dùng cho input, gửi lên dưới tên shippingAddress
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !address || !phone) {
      alert("Please fill in all required fields.");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }

    try {
      setLoading(true);

      const body = {
        userId: 1, // tạm thời, nếu backend cần userId
        fullName,
        shippingAddress: address, // 🔥 backend yêu cầu shippingAddress
        phone,
        subtotal,
        shipping,
        total,
        items: cart.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const res = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        let errMessage = "Create order failed.";
        try {
          const errData = await res.json();
          console.error("Create order failed:", errData);
          if (errData?.message) {
            errMessage = `Create order failed: ${errData.message}`;
          }
        } catch (parseErr) {
          const errText = await res.text();
          console.error("Create order failed (text):", errText);
        }
        alert(errMessage);
        return;
      }

      const data = await res.json();
      console.log("Order created:", data);

      alert("Order created successfully!" + (data.id ? ` Order ID: ${data.id}` : ""));
      clearCart();
      navigate("/");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("An error occurred while creating the order.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="checkout-page">
        <Breadcrumb title="CHECKOUT" />
        <div className="checkout-empty">
          <h2>No product</h2>
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
              placeholder="Nguyen Van A"
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
