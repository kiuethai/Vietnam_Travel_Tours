import React from 'react'
import { Link } from 'react-router-dom';
import { Fragment } from "react";
import Menu from './Menu';
import SideBar from './SideBar';
import Profiles from '../../Menus/Profiles';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../redux/user/userSlice';

function Header3({ sidebarClick }) {
  // Check if user is logged in
  const currentUser = useSelector(selectCurrentUser);
  const isLoggedIn = !!currentUser;

  return (
    <Fragment>
      <header className="main-header header-one">
        {/*Header-Upper*/}
        <div className="header-upper bg-white py-30 rpy-0">
          <div className="container-fluid clearfix">
            <div className="header-inner rel d-flex align-items-center">
              <div className="logo-outer">
                <div className="logo">
                  <Link href="/">
                    <img
                      src="assets/images/logos/logo-two.png"
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
              {/* Menu Button */}
              <div className="menu-btns py-10">
                <Link
                  href="contact"
                  className="theme-btn style-two bgc-secondary"
                >
                  <span data-hover="Book Now">Book Now</span>
                  <i className="fal fa-arrow-right" />
                </Link>
                {/* User profile or login button */}
                {isLoggedIn ? (
                  <Profiles />
                ) : (
                  <Link to="/login" className="theme-btn ms-1">
                    <span data-hover="Login">Login</span>
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

export default Header3