import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authApi from '../api/authApi'; // Import API
import '../style/Register.css';

const RegisterSection: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState(''); // Thêm trường FullName nếu cần
  
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      // Gọi API
      await authApi.register({
        userName: username, // Backend chờ "userName" (camelCase)
        email: email,
        password: password,
        phone: phone,
        fullName: fullName || username // Nếu chưa có input fullName thì lấy tạm username
      });

      alert('Successfully registered! Please log in.');
      navigate('/login'); // Chuyển sang trang login

    } catch (error: any) {
      console.error("Register Error:", error);
      const message = error.response?.data?.message || 'Registration failed';
      alert(message);
    }
  };

  return (
    <div className="login-section">
      <h2>REGISTER</h2>
      <p>Create an account to track orders and save favorites!</p>

      <form
        className="login-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
      >
        {/* Username */}
        <div className="input-group">
          <label htmlFor="reg-username">Username</label>
          <input
            type="text"
            id="reg-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Choose a username"
          />
        </div>
        
        {/* Full Name (Optional - Thêm vào cho đủ data backend) */}
        <div className="input-group">
          <label htmlFor="fullname">Full Name</label>
          <input
            type="text"
            id="fullname"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>

        {/* Phone */}
        <div className="input-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="Enter your phone number"
          />
        </div>

        {/* Password */}
        <div className="input-group">
          <label htmlFor="reg-password">Password</label>
          <input
            type="password"
            id="reg-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter a password"
          />
        </div>

        {/* Confirm Password */}
        <div className="input-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Re-enter your password"
          />
        </div>

        <button type="submit" className="login-btn">
          REGISTER
        </button>

        <p style={{ color: 'black' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterSection;