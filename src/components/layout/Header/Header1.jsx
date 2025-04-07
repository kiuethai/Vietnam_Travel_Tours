import React from 'react'
import useClickOutside from "../../../utility/useClickOutside";
import { Link } from 'react-router-dom';
import { Fragment, useState } from "react";
import { Accordion } from "react-bootstrap";
import Menu from './Menu';
import SideBar from './SideBar';

function Header1({ sidebarClick }) {
  const [toggleSearch, setToggleSearch] = useState(false);
  const domNode = useClickOutside(() => {
    setToggleSearch(false);
  });
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
                      src="assets/images/logos/logo.png"
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
              <div className="nav-search">
                <button
                  className="far fa-search"
                  onClick={() => setToggleSearch(!toggleSearch)}
                />
                <form
                  action="#"
                  className={toggleSearch ? "" : "hide"}
                  ref={domNode}
                >
                  <input
                    type="text"
                    placeholder="Search"
                    className="searchbox"
                    required
                  />
                  <button
                    type="submit"
                    className="searchbutton far fa-search"
                  />
                </form>
              </div>
              {/* Menu Button */}
              <div className="menu-btns py-10">
                <Link
                  to="contact"
                  className="theme-btn style-two bgc-secondary"
                >
                  <span data-hover="Book Now">Book Now</span>
                  <i className="fal fa-arrow-right" />
                </Link>
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
      <SideBar sidebarClick={sidebarClick} />
    </Fragment>
  );
}

export default Header1