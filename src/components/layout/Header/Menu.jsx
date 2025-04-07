import React from 'react'
import useClickOutside from "../../../utility/useClickOutside";
import { Link } from 'react-router-dom';
import { Fragment, useState } from "react";
import { Accordion } from "react-bootstrap";


function Menu() {
  return (
    <nav className="main-menu navbar-expand-lg">
      <Accordion>
        <div className="navbar-header">
          <div className="mobile-logo">
            <Link to="/">
              <img src="assets/images/logos/logo.png" alt="Logo" title="Logo" />
            </Link>
          </div>
          {/* Toggle Button */}
          <Accordion.Toggle
            as={"button"}
            type="button"
            className="navbar-toggle"
            eventKey="collapse"
          >
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </Accordion.Toggle>
        </div>
        <Accordion.Collapse
          eventKey="collapse"
          className="navbar-collapse  clearfix"
        >
          <ul className="navigation clearfix">
            <li className="dropdown current">
              <a href="#">Home</a>
              <ul>
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
              <div className="dropdown-btn">
                <span className="far fa-angle-down" />
              </div>
            </li>
            <li>
              <Link to="about">About</Link>
            </li>
            <li className="dropdown">
              <a href="#">Tours</a>
              <ul>
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
              <div className="dropdown-btn">
                <span className="far fa-angle-down" />
              </div>
            </li>
            <li className="dropdown">
              <a href="#">Destinations</a>
              <ul>
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
              <div className="dropdown-btn">
                <span className="far fa-angle-down" />
              </div>
            </li>
            <li className="dropdown">
              <a href="#">Pages</a>
              <ul>
                <li>
                  <Link to="pricing">Pricing</Link>
                </li>
                <li>
                  <Link to="faqs">faqs</Link>
                </li>
                <li className="dropdown">
                  <a href="#">Gallery</a>
                  <ul>
                    <li>
                      <Link to="gellery-grid">Gallery Grid</Link>
                    </li>
                    <li>
                      <Link to="gellery-slider">Gallery Slider</Link>
                    </li>
                  </ul>
                  <div className="dropdown-btn">
                    <span className="far fa-angle-down" />
                  </div>
                </li>
                <li className="dropdown">
                  <a href="#">products</a>
                  <ul>
                    <li>
                      <Link to="shop">Our Products</Link>
                    </li>
                    <li>
                      <Link to="product-details">Product Details</Link>
                    </li>
                  </ul>
                  <div className="dropdown-btn">
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
              <div className="dropdown-btn">
                <span className="far fa-angle-down" />
              </div>
            </li>
            <li className="dropdown">
              <a href="#">blog</a>
              <ul>
                <li>
                  <Link to="blog">blog List</Link>
                </li>
                <li>
                  <Link to="blog-details">blog details</Link>
                </li>
              </ul>
              <div className="dropdown-btn">
                <span className="far fa-angle-down" />
              </div>
            </li>
          </ul>
        </Accordion.Collapse>
      </Accordion>
    </nav>
  )
}

export default Menu