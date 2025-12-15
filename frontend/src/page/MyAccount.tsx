import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import OrderList from "../component/OrderList";
import Address from "../component/Address";
import AccountDetails from "../component/AccountDetail";
import "../style/MyAccount.css";
import Breadcrumb from "../component/Breadcrumb";
import Sidebar2 from "../component/Sidebar2";

const MyAccount = () => {
  const navigate = useNavigate();

  // Sửa từ sessionStorage thành localStorage để khớp với nơi lưu login
  const storedUser = localStorage.getItem("userInfo");
  const token = localStorage.getItem("token");

  // Kiểm tra storedUser có tồn tại và không phải "undefined" string trước khi parse
  const user =
    storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
  const userId = user?.id || user?._id;

  // Log để debug
  console.log("MyAccount - storedUser:", storedUser);
  console.log("MyAccount - user:", user);
  console.log("MyAccount - userId:", userId);
  console.log("MyAccount - token:", token);

  // Nếu không có token hoặc user, redirect về login
  useEffect(() => {
    if (!token || !user) {
      console.warn("No user data found. Redirecting to login...");
      navigate("/login");
    }
  }, [token, user, navigate]);

  // Nếu user data chưa load, hiển thị loading
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
        {/* Sidebar nằm dưới navbar */}
        <Sidebar2 />
        <div className="account-details">
          <Routes>
            <Route index element={<Navigate to="orders" />} />
            <Route path="orders" element={<OrderList userId={userId} />} />
            <Route path="address" element={<Address />} />
            <Route path="details" element={<AccountDetails />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
