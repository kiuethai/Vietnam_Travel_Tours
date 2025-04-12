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
              <a href="/">Trang chủ</a>
              <div className="dropdown-btn">
              </div>
            </li>
            <li>
              <Link to="/about">Giới thiệu</Link>
            </li>
            <li className="dropdown">
              <a href="/tour">Tours</a>
              <ul>
                <li>
                  <Link to="/tour">Tour List</Link>
                </li>

                <li>
                  <Link to="/tour_guide">Hướng dẫn viên</Link>
                </li>
              </ul>
              <div className="dropdown-btn">
                <span className="far fa-angle-down" />
              </div>
            </li>
            <li>
              <Link to="/destination">Điểm đến</Link>
            </li>
            <li>
              <Link to="/contact">Liên Hệ</Link>
            </li>
          </ul>
        </Accordion.Collapse>
      </Accordion>
    </nav>
  )
}

export default Menu