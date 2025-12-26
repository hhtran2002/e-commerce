import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Order = {
  id: number;
  guest_name: string;
  guest_phone: string;
  guest_email: string;
  user: {
    id: number;
    username: string;
    phone: string;
    email: string;
  };
  shippingAddress?: {
    street_name: string;
    city: string;
  };
  order_total: number;
  orderStatus: {
    id: number;
    status: string;
  } | null;
  orderDate: string;
};

const OrderList: React.FC<{ userId: number }> = ({ userId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    // Kiểm tra userId có giá trị không
    if (!userId) {
      console.warn("User ID is not available");
      setOrders([]);
      return;
    }

    fetch(`http://localhost:3000/api/orders/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Unexpected response format");
        }
        setOrders(data);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setOrders([]);
      });
  }, [userId]);

  const handleCancel = async (orderId: number) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/orders/${orderId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || "Failed to cancel order");
      }

      const data = await res.json();
      const updated = data.order;

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                orderStatus: {
                  id: updated.orderStatus.id,
                  status: updated.orderStatus.status,
                },
              }
            : order
        )
      );
      setNotification({ message: "Order canceled!", type: "success" });
    } catch (err: any) {
      console.error("Cancel order failed", err);
      setNotification({ message: err.message, type: "error" });
    }
  };

  return (
  <div className="order-list">
    <h1 className="order-title">My Orders</h1>

    {notification && (
      <div className={`notification ${notification.type}`}>
        {notification.message}
      </div>
    )}

    <div className="order-table-wrapper">
      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order date</th>
            <th>Shipping Address</th>
            <th>Status</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="order-id">#{order.id}</td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              <td>
                {order.shippingAddress?.city},{" "}
                {order.shippingAddress?.street_name}
              </td>
              <td>
                <span
                  className={`order-status ${
                    order.orderStatus?.status?.toLowerCase()
                  }`}
                >
                  {order.orderStatus?.status ?? "Unknown"}
                </span>
              </td>
              <td className="order-total">${order.order_total}</td>
              <td className="order-actions">
                <Link to={`/myaccount/orders/${order.id}`} className="view-btn">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

};

export default OrderList;
