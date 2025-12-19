import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../style/Login.css"; // Dùng chung style với Login

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword)
      return setMessage("Passwords do not match");

    try {
      const res = await fetch(
        "http://localhost:3000/api/password/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage("Password reset successful!");
        setTimeout(() => navigate("/login"), 2000);
      } else setMessage(data.message);
    } catch (err) {
      console.error(err);
      setMessage("Error resetting password");
    }
  };

  return (
    <div className="login-section">
      <h2>Reset Password</h2>
      <p>Please enter your new password.</p>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>New Password</label>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button className="login-btn" type="submit">
          Reset Password
        </button>

        <p style={{ textAlign: "center", marginTop: 12 }}>
          <Link to="/login">Back to Login</Link>
        </p>
      </form>

      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </div>
  );
};

export default ResetPassword;
