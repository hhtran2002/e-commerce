import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import '../style/Register.css';


const RegisterSection: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const [phone, setPhone] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();


  const handleRegister = async () => {

    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          email,
          phone,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Đăng ký thành công!');
        navigate('/login');
      } else {
        alert(data.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      alert('Lỗi kết nối đến server');
      console.error(error);
    }

  };

  return (
    <div className="login-section">
      <h2>REGISTER</h2>

      <p>Create an account to track orders, save favorites, and more!</p>

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

        {/* Submit */}

        <button type="submit" className="login-btn">
          REGISTER
        </button>


        {/* Link về login */}
        <p style={{ color: 'black' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterSection;