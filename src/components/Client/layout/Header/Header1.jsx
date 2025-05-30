import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import { Fragment } from "react";

import Menu from './Menu';
import SideBar from './SideBar';

import Profiles from '../../Menus/Profiles';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../../redux/user/userSlice';
import Search from './Search';

function Header1({ sidebarClick }) {
  // Get current location to check if we're on login page
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  // Check if user is logged in
  const currentUser = useSelector(selectCurrentUser);
  const isLoggedIn = !!currentUser;

  return (
    <Fragment>
      <header className="main-header header-one white-menu menu-absolute fixed-header">
        {/*Header-Upper*/}
        <div className="header-upper py-30 rpy-0">
          <div className="container-fluid clearfix">
            <div className="header-inner rel d-flex align-items-center">
              <div className="logo-outer">
                <div className="logo">
                  <Link to="/">
                    <img
                      src="https://res.cloudinary.com/dbkhjufja/image/upload/v1744543947/b88zgpwgvx6pd51fw4zz.png"
                      alt="Logo"
                      title="Logo"
                    />

                  </Link>
                </div>
              </div>
              <div className="nav-outer mx-lg-auto ps-xxl-5 clearfix">
                {/* Main Menu */}
                <Menu />
                {/* Main Menu End*/}
              </div>
              {/* Nav Search */}
              <Search />
              {/* Menu Button */}
              <div className="menu-btns py-10">
                <Link
                  to="contact"
                  className="theme-btn style-two bgc-secondary"
                >
                  <span data-hover="Đặt ngay">Đặt ngay</span>
                  <i className="fal fa-arrow-right" />
                </Link>
                {/* User profile or login/register button */}
                {isLoggedIn ? (
                  <Profiles />
                ) : (
                  <Link to={isLoginPage ? "/register" : "/login"} className="theme-btn ms-1">
                    <span data-hover={isLoginPage ? "Đăng kí" : "Đăng nhập"}>
                      {isLoginPage ? "Đăng kí" : "Đăng nhập"}
                    </span>
                    <i className="fal fa-user" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        {/*End Header Upper*/}
      </header>
      <SideBar sidebarClick={sidebarClick} />
    </Fragment>
  );
}

export default Header1