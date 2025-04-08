import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle forgot password logic here
    console.log("Forgot password request for:", email);
    // Add logic to send reset email (e.g., call API)
    alert("If an account exists with this email, a reset link will be sent.");
  };

  return (
    <section
      className="pt-120 pb-120"
      style={{
        backgroundImage: "url('/assets/images/backgrounds/login-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        }}
      />
      <div className="container position-relative">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div
              className="forgot-password-form-wrap p-50"
              style={{
                background: "#f8f8f8",
                borderRadius: "10px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
              }}
            >
              <div className="forgot-password-header mb-30">
                <h3>Reset Your Password</h3>
                <p>Enter your email to receive a password reset link.</p>
              </div>
              <form onSubmit={handleSubmit} className="forgot-password-form">
                <div className="form-group mb-20">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group mb-20">
                  <button
                    type="submit"
                    className="theme-btn w-100"
                    style={{ background: "#38b5fe", color: "white" }}
                  >
                    <span>Send Reset Link</span>
                    <i className="fal fa-long-arrow-right"></i>
                  </button>
                </div>
                <div className="form-group text-center mb-0">
                  <p>
                    Back to{" "}
                    <Link to="/login" style={{ color: "#38b5fe" }}>
                      Login
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}