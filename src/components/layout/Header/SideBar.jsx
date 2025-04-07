import React from 'react'
import { Link } from 'react-router-dom';
import { Fragment, useState } from "react";

function SideBar({ sidebarClick }) {
   return (
      <Fragment>
        {/*Form Back Drop*/}
        <div className="form-back-drop" onClick={() => sidebarClick()} />
        {/* Hidden Sidebar */}
        <section className="hidden-bar">
          <div className="inner-box text-center">
            <div className="cross-icon" onClick={() => sidebarClick()}>
              <span className="fa fa-times" />
            </div>
            <div className="title">
              <h4>Get Appointment</h4>
            </div>
            {/*Appointment Form*/}
            <div className="appointment-form">
              <form method="post">
                <div className="form-group">
                  <input
                    type="text"
                    name="text"
                    defaultValue=""
                    placeholder="Name"
                    required=""
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    defaultValue=""
                    placeholder="Email Address"
                    required=""
                  />
                </div>
                <div className="form-group">
                  <textarea placeholder="Message" rows={5} defaultValue={""} />
                </div>
                <div className="form-group">
                  <button type="submit" className="theme-btn style-two">
                    <span data-hover="Submit now">Submit now</span>
                    <i className="fal fa-arrow-right" />
                  </button>
                </div>
              </form>
            </div>
            {/*Social Icons*/}
            <div className="social-style-one">
              <Link href="contact">
                <i className="fab fa-twitter" />
              </Link>
              <Link href="contact">
                <i className="fab fa-facebook-f" />
              </Link>
              <Link href="contact">
                <i className="fab fa-instagram" />
              </Link>
              <a href="#">
                <i className="fab fa-pinterest-p" />
              </a>
            </div>
          </div>
        </section>
      </Fragment>
   )
}

export default SideBar