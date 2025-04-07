import React from 'react'
import { Link } from 'react-router-dom';
import { Fragment, useState } from "react";
import SideBar from './SideBar';


function Header2({ sidebarClick }) {
  const [activeMenu, setActiveMenu] = useState("");
  const [multiMenu, setMultiMenu] = useState("");
  const activeMenuSet = (value) =>
    setActiveMenu(activeMenu === value ? "" : value),
    activeLi = (value) =>
      value === activeMenu ? { display: "block" } : { display: "none" };
  const multiMenuSet = (value) =>
    setMultiMenu(multiMenu === value ? "" : value),
    multiMenuActiveLi = (value) =>
      value === multiMenu ? { display: "block" } : { display: "none" };

  return (
    <Fragment>
      <header className="main-header header-two">
        {/*Header-Upper*/}
        <div className="header-upper">
          <div className="container-fluid clearfix">
            <div className="header-inner rel d-flex align-items-center justify-content-between">
              <div className="logo-outer d-block">
                <div className="logo">
                  <Link to="/">
                    <img
                      src="assets/images/logos/logo-two.png"
                      alt="Logo"
                      title="Logo"
                    />
                  </Link>
                </div>
              </div>
              {/* Menu Button */}
              <div className="menu-btns py-10">
                {/* menu sidbar */}
                <div className="menu-sidebar" onClick={() => sidebarClick()}>
                  <button className="bg-transparent">
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*End Header Upper*/}
      </header>
      <section className="hidden-bar">
        <div className="inner-box">
          <div className="cross-icon" onClick={() => sidebarClick()}>
            <span className="fal fa-times" />
          </div>
          <div className="logo text-lg-center">
            <Link to="/">
              <img src="assets/images/logos/logo-two.png" alt="Logo" />
            </Link>
          </div>
          <hr className="my-40" />
          <ul className="sidebar-menu">
            <li className="dropdown current">
              <a href="#" onClick={() => activeMenuSet("home")}>
                Home
              </a>
              <ul style={activeLi("home")}>
                <li>
                  <Link to="/">Travel Agency</Link>
                </li>
                <li>
                  <Link to="index2">City Tou</Link>
                </li>
                <li>
                  <Link to="index3">Tour Package</Link>
                </li>
              </ul>
              <div
                className="dropdown-btn"
                onClick={() => activeMenuSet("home")}
              >
                <span className="far fa-angle-down" />
              </div>
            </li>
            <li>
              <Link to="about">About</Link>
            </li>
            <li className="dropdown">
              <a href="#" onClick={() => activeMenuSet("Tours")}>
                Tours
              </a>
              <ul style={activeLi("Tours")}>
                <li>
                  <Link to="tour-list">Tour List</Link>
                </li>
                <li>
                  <Link to="tour-grid">Tour Grid</Link>
                </li>
                <li>
                  <Link to="tour-sidebar">Tour Sidebar</Link>
                </li>
                <li>
                  <Link to="tour-details">Tour Details</Link>
                </li>
                <li>
                  <Link to="tour-guide">Tour Guide</Link>
                </li>
              </ul>
              <div
                className="dropdown-btn"
                onClick={() => activeMenuSet("Tours")}
              >
                <span className="far fa-angle-down" />
              </div>
            </li>
            <li className="dropdown">
              <a href="#" onClick={() => activeMenuSet("Destinations")}>
                Destinations
              </a>
              <ul style={activeLi("Destinations")}>
                <li>
                  <Link to="destination1">Destination 01</Link>
                </li>
                <li>
                  <Link to="destination2">Destination 02</Link>
                </li>
                <li>
                  <Link to="destination-details">Destination Details</Link>
                </li>
              </ul>
              <div
                className="dropdown-btn"
                onClick={() => activeMenuSet("Destinations")}
              >
                <span className="far fa-angle-down" />
              </div>
            </li>
            <li className="dropdown">
              <a href="#" onClick={() => activeMenuSet("Pages")}>
                Pages
              </a>
              <ul style={activeLi("Pages")}>
                <li>
                  <Link to="pricing">Pricing</Link>
                </li>
                <li>
                  <Link to="faqs">faqs</Link>
                </li>
                <li className="dropdown">
                  <a href="#">Gallery</a>
                  <ul style={multiMenuActiveLi("Gallery")}>
                    <li>
                      <Link to="gellery-grid">Gallery Grid</Link>
                    </li>
                    <li>
                      <Link to="gellery-slider">Gallery Slider</Link>
                    </li>
                  </ul>
                  <div
                    className="dropdown-btn"
                    onClick={() => multiMenuSet("Gallery")}
                  >
                    <span className="far fa-angle-down" />
                  </div>
                </li>
                <li className="dropdown">
                  <a href="#">products</a>
                  <ul style={multiMenuActiveLi("products")}>
                    <li>
                      <Link to="shop">Our Products</Link>
                    </li>
                    <li>
                      <Link to="product-details">Product Details</Link>
                    </li>
                  </ul>
                  <div
                    className="dropdown-btn"
                    onClick={() => multiMenuSet("products")}
                  >
                    <span className="far fa-angle-down" />
                  </div>
                </li>
                <li>
                  <Link to="contact">Contact Us</Link>
                </li>
                <li>
                  <Link to="404">404 Error</Link>
                </li>
              </ul>
              <div
                className="dropdown-btn"
                onClick={() => activeMenuSet("Pages")}
              >
                <span className="far fa-angle-down" />
              </div>
            </li>
            <li className="dropdown">
              <a href="#" onClick={() => activeMenuSet("blog")}>
                blog
              </a>
              <ul style={activeLi("blog")}>
                <li>
                  <Link to="blog">blog List</Link>
                </li>
                <li>
                  <Link to="blog-details">blog details</Link>
                </li>
              </ul>
              <div
                className="dropdown-btn"
                onClick={() => activeMenuSet("blog")}
              >
                <span className="far fa-angle-down" />
              </div>
            </li>
          </ul>
          <Link
            to="contact"
            className="theme-btn style-two style-three mt-15 mb-55"
          >
            <span data-hover="Book Now">Book Now</span>
            <i className="fal fa-arrow-right" />
          </Link>
          <hr className="mb-65" />
          <h6>Social Media</h6>
          {/*Social Icons*/}
          <div className="social-style-two mt-10">
            <Link to="contact">
              <i className="fab fa-twitter" />
            </Link>
            <Link to="contact">
              <i className="fab fa-facebook-f" />
            </Link>
            <Link to="contact">
              <i className="fab fa-instagram" />
            </Link>
            <a href="#">
              <i className="fab fa-pinterest-p" />
            </a>
          </div>
        </div>
      </section>

      <div className="form-back-drop" onClick={() => sidebarClick()} />
    </Fragment>
  );
};

export default Header2