import React, { useEffect, useState } from "react";
import "../style/OrderList.css";

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
    const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        // const token = sessionStorage.getItem("token");

        fetch(`http://localhost:3001/api/orders/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
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
            const res = await fetch(`http://localhost:3001/api/orders/${orderId}/cancel`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                const errJson = await res.json();
                throw new Error(errJson.message || "Failed to cancel order");
            }

            const data = await res.json();
            const updated = data.order;

            setOrders((prev) =>
                prev.map((order) =>
                    order.id === orderId
                        ? { ...order, orderStatus: { id: updated.orderStatus.id, status: updated.orderStatus.status } }
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
        <div>
            <h1>Order List</h1>

            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}

            <table>
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
                        <td>#{order.id}</td>
                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td>{order.shippingAddress?.city + ", " + order.shippingAddress?.street_name}</td>
                        <td>{order.orderStatus?.status ?? "Unknown"}</td>
                        <td>${order.order_total}</td>
                        <td>
                            <a href={`/orders/${order.id}`}>View</a>{" "}
                            {order.orderStatus?.id === 5 && (
                                <button onClick={() => handleCancel(order.id)}>Cancel</button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderList;