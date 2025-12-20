import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErr("");

        const res = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to load order");
        setOrder(data);
      } catch (e: any) {
        setErr(e.message || "Error");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) run();
  }, [orderId]);

  if (loading) return <div>Loading...</div>;
  if (err) return <div style={{ color: "red" }}>{err}</div>;
  if (!order) return <div>No order found</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Order #{order.id}</h2>
      <p><b>Status:</b> {order.status}</p>
      <p><b>Created:</b> {new Date(order.createdAt).toLocaleString()}</p>
      <p><b>Shipping address:</b> {order.shippingAddress}</p>
      <p><b>Total:</b> {order.total}</p>

      <h3>Items</h3>
      <ul>
        {(order.items || []).map((it: any) => (
          <li key={it.id}>
            Qty: {it.quantity} — Price: {it.price} — Total: {it.totalPrice}
          </li>
        ))}
      </ul>
    </div>
  );
}
