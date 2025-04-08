import React, { useState } from "react";
import { Link } from "react-router-dom"; 

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login form submitted:", formData);
    // Add authentication logic (e.g., call API)
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
              className="login-form-wrap p-50"
              style={{
                background: "#f8f8f8",
                borderRadius: "10px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
              }}
            >
              <div className="login-header mb-30">
                <h3>Login to Your Account</h3>
              </div>
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group mb-20">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group mb-20">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group mb-20">
                  <div className="d-flex justify-content-between">
                    <div className="remember">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                      />
                      <label htmlFor="rememberMe" className="ms-2">
                        Remember Me
                      </label>
                    </div>
                    <div className="forgot">
                      <Link to="/forgot-password">Forgot Password?</Link>
                    </div>
                  </div>
                </div>
                <div className="form-group mb-20">
                  <button
                    type="submit"
                    className="theme-btn w-100"
                    style={{ background: "#38b5fe", color: "white" }}
                  >
                    <span>Login</span>
                    <i className="fal fa-long-arrow-right"></i>
                  </button>
                </div>
                <div className="form-group text-center mb-0">
                  <p>
                    Don't have an account?{" "}
                    <Link to="/register" style={{ color: "#38b5fe" }}>
                      Register Now
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