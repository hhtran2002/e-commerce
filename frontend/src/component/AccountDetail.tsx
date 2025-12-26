import React, { useState, useEffect } from "react";
import "../style/AccountDetails.css";
import Notification from "./Notification";

const AccountDetails: React.FC = () => {
  // Sửa từ sessionStorage thành localStorage
  const storedUser = localStorage.getItem("userInfo");
  // Kiểm tra storedUser có tồn tại và không phải "undefined" string trước khi parse
  const user =
    storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    id: user?.id || "",
    displayName: user?.userName || "",
    username: user?.userName || user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [addressFormData, setAddressFormData] = useState({
    streetName: "",
    ward: "",
    city: "",
    country: "",
  });

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [addresses, setAddresses] = useState<any[]>([]);

  // Fetch addresses for current user
  const fetchAddresses = async () => {
    try {
      if (!user || !user.id) return;
      const res = await fetch(
        `http://localhost:3000/api/addresses/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        console.error("Failed fetching addresses", res.status);
        return;
      }

      const json = await res.json();
      // backend returns { message, data }
      setAddresses(json.data || []);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  useEffect(() => {
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Cập nhật displayName khi user data thay đổi
  useEffect(() => {
    if (user && user.id) {
      setFormData((prev) => ({
        ...prev,
        id: user.id || "",
        displayName: user.userName || "",
        username: user.userName || user.username || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user?.id, user?.userName, user?.email, user?.phone]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressFormData({
      ...addressFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.id) {
      setNotification({
        message: "User ID not found",
        type: "error",
      });
      return;
    }

    try {
      const url = editingAddressId
        ? `http://localhost:3000/api/addresses/${editingAddressId}`
        : "http://localhost:3000/api/addresses";

      const method = editingAddressId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: formData.id,
          ...addressFormData,
        }),
      });

      if (response.status === 200 || response.status === 201) {
        setNotification({
          message: editingAddressId
            ? "Address updated successfully!"
            : "Address added successfully!",
          type: "success",
        });
        setAddressFormData({
          streetName: "",
          ward: "",
          city: "",
          country: "",
        });
        setShowAddressForm(false);
        setEditingAddressId(null);
        // refresh addresses list
        await fetchAddresses();
      } else {
        const errorData = await response.json();
        setNotification({
          message: errorData.message || "Failed to save address",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setNotification({
        message: "Server error",
        type: "error",
      });
    }
  };

  const handleEditAddress = (addr: any) => {
    setEditingAddressId(addr.id || null);
    setAddressFormData({
      streetName: addr.streetName || "",
      ward: addr.ward || "",
      city: addr.city || "",
      country: addr.country || "",
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/addresses/${addressId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setNotification({
          message: err.message || "Failed to delete address",
          type: "error",
        });
        return;
      }

      setNotification({ message: "Address deleted", type: "success" });
      await fetchAddresses();
    } catch (err) {
      console.error("Delete address error:", err);
      setNotification({ message: "Server error", type: "error" });
    }
  };

  const togglePassword = (field: "current" | "new" | "confirm") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.id) {
      setNotification({
        message: `User ID not found. Please refresh the page and login again.`,
        type: "error",
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setNotification({
        message: `New password does not match`,
        type: "error",
      });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/auth/users/${formData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            phone: formData.phone,
            password: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        }
      );

      if (response.status === 200) {
        const responseData = await response.json();
        setNotification({
          message: `User information updated successfully!`,
          type: "success",
        });
        // Cập nhật localStorage với thông tin user mới
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            ...user,
            userName: formData.username,
            email: formData.email,
            phone: formData.phone,
          })
        );
        setFormData((prev) => ({
          ...prev,
          displayName: formData.username,
          username: formData.username,
          email: formData.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        const errorData = await response.json();
        setNotification({
          message: errorData.message || `Failed to update user info`,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setNotification({ message: `Server error`, type: "error" });
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
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            required
            disabled
          />
          <small>
            This will be how your name will be displayed in the account section
            and in reviews
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

        <button type="submit" className="save-button">
          SAVE CHANGES
        </button>
      </form>

      {/* Address Section */}
        <div className="address-section">
          <h2>Address</h2>

          <div className="address-action">
            <button
              type="button"
              className="save-button"
              onClick={() => setShowAddressForm(!showAddressForm)}
            >
              {showAddressForm ? "Cancel" : "Add New Address"}
            </button>
          </div>

          {showAddressForm && (
            <form onSubmit={handleAddressSubmit} className="address-form">
              <h3>{editingAddressId ? "Edit Address" : "Add New Address"}</h3>

              <div className="input-group">
                <label>Street Name *</label>
                <input
                  type="text"
                  name="streetName"
                  value={addressFormData.streetName}
                  onChange={handleAddressChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Ward</label>
                <input
                  type="text"
                  name="ward"
                  value={addressFormData.ward}
                  onChange={handleAddressChange}
                />
              </div>

              <div className="input-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={addressFormData.city}
                  onChange={handleAddressChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Country *</label>
                <input
                  type="text"
                  name="country"
                  value={addressFormData.country}
                  onChange={handleAddressChange}
                  required
                />
              </div>

              <button type="submit" className="save-button">
                {editingAddressId ? "UPDATE ADDRESS" : "ADD ADDRESS"}
              </button>
            </form>
          )}

          <div className="existing-addresses">
            <h3>Your Addresses</h3>

            {addresses.length > 0 ? (
              addresses.map((addr: any) => (
                <div key={addr.id} className="address-item">
                  <p>
                    <strong>{addr.streetName}</strong>
                    {addr.ward ? `, ${addr.ward}` : ""}, {addr.city}, {addr.country}
                  </p>

                  <div className="address-buttons">
                    <button type="button" onClick={() => handleEditAddress(addr)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleDeleteAddress(addr.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-address">
                No addresses saved yet. Add your first address above.
              </p>
            )}
          </div>
        </div>

    </div>
  );
};

export default AccountDetails;
