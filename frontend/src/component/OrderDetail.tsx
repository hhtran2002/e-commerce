import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../style/OrderDetail.css";

export default function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to load order");
        setOrder(data);
      } catch (e: any) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [orderId]);

  if (loading) return <div className="order-detail-loading">Loading...</div>;
  if (err) return <div className="order-detail-error">{err}</div>;
  if (!order) return null;

  return (
    <div className="order-detail-page">
      <Link to="/myaccount/orders" className="order-detail-back">
        ← Back to orders
      </Link>

      <div className="order-detail-card">
        <h2>Order #{order.id}</h2>

        <div className="order-detail-info">
          <p><span>Status:</span> {order.status}</p>
          <p><span>Order date:</span> {new Date(order.createdAt).toLocaleString()}</p>
          <p><span>Shipping address:</span> {order.shippingAddress}</p>
          <p className="order-detail-total">
            <span>Total:</span> {Number(order.total).toLocaleString()}₫
          </p>
        </div>

        <h3>Order items</h3>

        <table className="order-detail-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((it: any, index: number) => (
              <tr key={it.id}>
                <td>{index + 1}</td>
                <td>{it.quantity}</td>
                <td>{Number(it.price).toLocaleString()}₫</td>
                <td>{Number(it.totalPrice).toLocaleString()}₫</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
