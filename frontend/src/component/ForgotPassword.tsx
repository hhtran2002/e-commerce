import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/Login.css"; // Dùng chung style với Login

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/password/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError(data.message || "Failed to send reset link");
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-section">
      <h2>FORGOT PASSWORD</h2>
      {!submitted ? (
        <>
          <p>
            Enter your email address below and we’ll send you instructions to
            reset your password.
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

            {error && (
              <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
            )}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <p style={{ color: "black" }}>
              Remember your password? <Link to="/login">Back to login</Link>
            </p>
          </form>
        </>
      ) : (
        <div className="success-message">
          <p>
            A password reset link has been sent to <strong>{email}</strong>.
          </p>
          <p>Please check your inbox and follow the instructions.</p>
          <Link
            to="/login"
            className="login-btn"
            style={{ display: "inline-block", marginTop: "20px" }}
          >
            Back to Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
