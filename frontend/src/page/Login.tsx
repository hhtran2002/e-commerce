import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";
import "../style/Login.css";

const LoginSection: React.FC = () => {
  //const [username, setUsername] = useState('');
  const [email, setEmail] = useState(""); // Sử dụng email thay vì username
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Gọi API qua axios
      const res: any = await authApi.login({
        email: email,
        password: password,
      });

      // Backend trả về: { message, data: { message, token, user } } hoặc { message, token, user }
      // axiosClient interceptor đã unwrap response.data
      console.log("Login Response:", res);

      // Handle both formats
      const tokenData = res.data?.token || res.token;
      const userData = res.data?.user || res.user;

      console.log("res.token:", tokenData);
      console.log("res.user:", userData);

      if (!tokenData || !userData) {
        alert("Login failed: missing token or user data");
        return;
      }

      // Lưu token và user info vào LocalStorage (Bền vững hơn SessionStorage)
      localStorage.setItem("token", tokenData);
      localStorage.setItem("userInfo", JSON.stringify(userData));

      console.log(
        "After saving - localStorage.token:",
        localStorage.getItem("token")
      );
      console.log(
        "After saving - localStorage.userInfo:",
        localStorage.getItem("userInfo")
      );

      alert("Login Successful!");
      navigate("/"); // Chuyển về trang chủ
    } catch (error: any) {
      console.error("Login Error:", error);
      // Lấy thông báo lỗi từ Backend trả về
      const message = error.response?.data?.message || "Login failed";
      alert(message);
    }
  };

  return (
    <div className="login-section">
      <h2>LOGIN</h2>
      <p>Please login using your account details.</p>

      <form
        className="login-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        {/* Sửa Username thành Email để khớp Backend */}
        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="login-btn">
          LOGIN
        </button>

        <p style={{ color: "black" }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>

        <div className="forgot-password">
          <Link to="/forgot-password">Forgot your password?</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginSection;
