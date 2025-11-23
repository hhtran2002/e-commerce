import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/Login.css'; // Dùng chung style với Login

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Gửi yêu cầu đặt lại mật khẩu cho:', email);
    setSubmitted(true);
    // TODO: Gọi API để gửi email đặt lại mật khẩu
  };

  return (
    <div className="login-section">
      <h2>FORGOT PASSWORD</h2>
      {!submitted ? (
        <>
          <p>
            Enter your email address below and we’ll send you instructions to reset your password.
          </p>
          <form className="login-form" onSubmit={handleSubmit}>
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

            <button type="submit" className="login-btn">Send Reset Link</button>

            <p style={{ color: 'black' }}>
              Remember your password? <Link to="/login">Back to login</Link>
            </p>
          </form>
        </>
      ) : (
        <div className="success-message">
          <p>A password reset link has been sent to <strong>{email}</strong>.</p>
          <p>Please check your inbox and follow the instructions.</p>
          <Link to="/login" className="login-btn" style={{ display: 'inline-block', marginTop: '20px' }}>
            Back to Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;