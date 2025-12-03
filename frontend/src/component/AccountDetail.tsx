import React, { useState } from "react";
import "../style/AccountDetails.css";
import Notification from './Notification';

const AccountDetails: React.FC = () => {
  const storedUser = sessionStorage.getItem("userInfo");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [notification,setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    id: user?.id || "",
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const togglePassword = (field: "current" | "new" | "confirm") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setNotification({ message: `New password does not match`, type: 'error' });
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/users/changeInfo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          id: formData.id,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          password: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (response.status === 204) {
        const updatedUser = {
      ...user,
            username: formData.username,
            email: formData.email,
      };
        setNotification({ message: `User information updated successfully!`, type: 'success' });
        sessionStorage.setItem(
            "userInfo",
            JSON.stringify({ ...user, username: formData.username, email: formData.email })
        );
        setFormData((prev) => ({
          ...prev,
          username: updatedUser.username,
          email: updatedUser.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        // const data = await response.json();
        setNotification({ message: `Failed to update user info`, type: 'error' });
        // alert(data.message || "Failed to update user info");
      }
    } catch (error) {
      console.error("Error:", error);
      setNotification({ message: `Server error`, type: 'error' });
      // alert("Server error");
    }
  };

  return (

      <div className="account-details">
        {notification && (
            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification(null)}
            />
        )}
        <h2>Account Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Display name *</label>
            <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
            disabled/>
            <small>
              This will be how your name will be displayed in the account section and in reviews
            </small>
          </div>

          <div className="input-group">
            <label>Email address *</label>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
            />
          </div>
          <div className="input-group">
            <label>Phone *</label>
            <input
                type="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
            />
          </div>
          {/* Password Change Section */}
          <div className="password-section">
            <h3>Password change</h3>

            <div className="input-group">
              <label>Current password</label>
              <div className="password-input">
                <input
                    type={showPassword.current ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}

                />
                <span onClick={() => togglePassword("current")}>
                {showPassword.current ? "👁" : "👁‍🗨"}
              </span>
              </div>
            </div>

            <div className="input-group">
              <label>New password</label>
              <div className="password-input">
                <input
                    type={showPassword.new ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                />
                <span onClick={() => togglePassword("new")}>
                {showPassword.new ? "👁" : "👁‍🗨"}
              </span>
              </div>
            </div>

            <div className="input-group">
              <label>Confirm new password</label>
              <div className="password-input">
                <input
                    type={showPassword.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />
                <span onClick={() => togglePassword("confirm")}>
                {showPassword.confirm ? "👁" : "👁‍🗨"}
              </span>
              </div>
            </div>
          </div>

          <button type="submit" className="save-button">SAVE CHANGES</button>
        </form>
      </div>
  );
};


export default AccountDetails;