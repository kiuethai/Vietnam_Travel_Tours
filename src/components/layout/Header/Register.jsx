import React, { useState } from "react";
import { Link } from "react-router-dom"; 

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
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
    // Validate password matching
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Handle registration logic here
    console.log("Registration form submitted:", formData);
    // Add registration logic (e.g., call API)
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
          <div className="col-lg-8">
            <div
              className="register-form-wrap p-50"
              style={{
                background: "#f8f8f8",
                borderRadius: "10px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
              }}
            >
              <div className="register-header mb-30">
                <h3>Create Your Account</h3>
              </div>
              <form onSubmit={handleSubmit} className="register-form">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-20">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        required
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-20">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        required
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
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
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group mb-20">
                  <div className="remember">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="agreeTerms" className="ms-2">
                      I agree to the <Link to="/terms">Terms & Conditions</Link>
                    </label>
                  </div>
                </div>
                <div className="form-group mb-20">
                  <button
                    type="submit"
                    className="theme-btn w-100"
                    style={{ background: "#38b5fe", color: "white" }}
                  >
                    <span>Register</span>
                    <i className="fal fa-long-arrow-right"></i>
                  </button>
                </div>
                <div className="form-group text-center mb-0">
                  <p>
                    Already have an account?{" "}
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