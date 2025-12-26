import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import OrderList from "../component/OrderList";
import AccountDetails from "../component/AccountDetail";
import "../style/MyAccount.css";
import Breadcrumb from "../component/Breadcrumb";
import Sidebar2 from "../component/Sidebar2";

const AccountDashboard = () => {
  return (
    <div className="account-grid">

      <div className="account-card">
        <AccountDetails />
      </div>
    </div>
  );
};

const MyAccount = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("userInfo");
  const token = localStorage.getItem("token");

  const user =
    storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
  const userId = user?.id || user?._id;

  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
    }
  }, [token, user, navigate]);

  if (!user || !userId) {
    return (
      <div className="my-account">
        <Breadcrumb title="My Account" />
        <div className="account-content">
          <div style={{ padding: "20px", textAlign: "center" }}>
            <p>Loading your account information...</p>
            <p>
              If you are not redirected, please <a href="/login">login here</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-account">
      <Breadcrumb title="My Account" />
      <div className="account-content">
        <Sidebar2 />

        <div className="account-details">
          <Routes>
            {/* vào /myaccount sẽ sang dashboard (2 cột) */}
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* Dashboard: Address + Account Details */}
            <Route path="dashboard" element={<AccountDashboard />} />

            {/* Orders */}
            <Route path="orders" element={<OrderList userId={userId} />} />

            {/* (Tuỳ chọn) nếu ai gõ /myaccount/details thì cũng đưa về dashboard */}
            <Route path="details" element={<Navigate to="/myaccount/dashboard" replace />} />
            <Route path="address" element={<Navigate to="/myaccount/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
