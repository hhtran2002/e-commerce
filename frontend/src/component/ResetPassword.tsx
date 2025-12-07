import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
