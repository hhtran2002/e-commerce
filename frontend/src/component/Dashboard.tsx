import React, { useEffect, useState } from "react";
import "../style/DashBoard.css";

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    orders: 0,
    users: 0,
  });

  const [type, setType] = useState("day");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInitialStats = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes, orderRes, userRes] = await Promise.all([
          fetch("http://localhost:3000/api/categories", {
            headers: {
              Authorization: "Bearer " + (sessionStorage.getItem("token") || ""),
            },
          }),
          fetch("http://localhost:3000/api/products", {
            headers: {
              Authorization: "Bearer " + (sessionStorage.getItem("token") || ""),
            },
          }),
          fetch("http://localhost:3000/api/orders/count", {
            headers: {
              Authorization: "Bearer " + (sessionStorage.getItem("token") || ""),
            },
          }),
          fetch("http://localhost:3000/api/users/count", {
            headers: {
              Authorization: "Bearer " + (sessionStorage.getItem("token") || ""),
            },
          }),
        ]);

        const [catData, prodData, orderData, userData] = await Promise.all([
          catRes.json(),
          prodRes.json(),
          orderRes.json(),
          userRes.json(),
        ]);

        setStats({
          categories: Array.isArray(catData) ? catData.length : 0,
          products: 0,
          orders: 0,
          users: Array.isArray(userData) ? userData.length : 0,
        });
       setStats(prev => ({
          ...prev,
          categories: Array.isArray(catData) ? catData.length : 0,
          products: typeof prodData.totalCount === "number" ? prodData.totalCount : 0,
          orders: typeof orderData.count === "number" ? orderData.count : 0,
          users: typeof userData.count === "number" ? userData.count : 0,
        }));
      } catch (err) {
        console.error("❌ Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialStats();
  }, []);

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        const [prodRes, orderRes] = await Promise.all([
          fetch(`http://localhost:3000/api/statistics/products?type=${type}&date=${date}`,{

            headers:{"Authorization": 'Bearer ' + sessionStorage.getItem('token') || ''}
          }),
          fetch(`http://localhost:3000/api/statistics/orders?type=${type}&date=${date}`,
              {
                headers:{"Authorization": 'Bearer ' + sessionStorage.getItem('token') || ''}
          }),
        ]);
 
        const prodData = await prodRes.json();
        const orderData = await orderRes.json();
        setStats(prev => ({
          ...prev,
          products: prodData.totalInStock || 0,

          orders: orderData.totalOrders || 0,
        }));
      } catch (err) {
        console.error("Failed to load order statistics:", err);
        setStats(prev => ({ ...prev, orders: 0 }));
      }
    };

    fetchOrderStats();
  }, [type, date]);

  return (
    <div className="dashboard-container">

      <h1>Welcome to the Admin Dashboard</h1>
      
      <div className="dashboard-filter">
        <select className="dashboard-select" value={type} onChange={e => setType(e.target.value)}>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
        <input
          className="dashboard-input"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>

      <div className="stats-boxes">
        <div className="stat-box">
          <h2>Categories</h2>
          <p>{stats.categories}</p>
        </div>
        <div className="stat-box">
          <h2>Products</h2>
          <p>{stats.products}</p>
        </div>
        <div className="stat-box">
          <h2>Orders</h2>
          <p>{stats.orders}</p>
        </div>
        <div className="stat-box">
          <h2>Users</h2>
          <p>{stats.users}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;