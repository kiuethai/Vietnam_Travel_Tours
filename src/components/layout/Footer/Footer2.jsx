import React from 'react'
import { Link } from 'react-router-dom';


const FooterInstagram = () => {
  return (
    <div className="container">
      <div className="footer-instagram pt-100 mb-70">
        <div className="row row-cols-xxl-6 row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-2">
          <div
            className="col"
            data-aos="zoom-in-up"
            data-aos-duration={1500}
            data-aos-offset={50}
          >
            <a
              className="instagram-item"
              href="assets/images/instagram/instagram1.jpg"
            >
              <img
                src="assets/images/instagram/instagram1.jpg"
                alt="Instagram"
              />
            </a>
          </div>
          <div
            className="col"
            data-aos="zoom-in-down"
            data-aos-duration={1500}
            data-aos-offset={50}
          >
            <a
              className="instagram-item"
              href="assets/images/instagram/instagram2.jpg"
            >
              <img
                src="assets/images/instagram/instagram2.jpg"
                alt="Instagram"
              />
            </a>
          </div>
          <div
            className="col"
            data-aos="zoom-in-up"
            data-aos-duration={1500}
            data-aos-offset={50}
          >
            <a
              className="instagram-item"
              href="assets/images/instagram/instagram3.jpg"
            >
              <img
                src="assets/images/instagram/instagram3.jpg"
                alt="Instagram"
              />
            </a>
          </div>
          <div
            className="col"
            data-aos="zoom-in-down"
            data-aos-duration={1500}
            data-aos-offset={50}
          >
            <a
              className="instagram-item"
              href="assets/images/instagram/instagram4.jpg"
            >
              <img
                src="assets/images/instagram/instagram4.jpg"
                alt="Instagram"
              />
            </a>
          </div>
          <div
            className="col"
            data-aos="zoom-in-up"
            data-aos-duration={1500}
            data-aos-offset={50}
          >
            <a
              className="instagram-item"
              href="assets/images/instagram/instagram5.jpg"
            >
              <img
                src="assets/images/instagram/instagram5.jpg"
                alt="Instagram"
              />
            </a>
          </div>
          <div
            className="col"
            data-aos="zoom-in-down"
            data-aos-duration={1500}
            data-aos-offset={50}
          >
            <a
              className="instagram-item"
              href="assets/images/instagram/instagram6.jpg"
            >
              <img
                src="assets/images/instagram/instagram6.jpg"
                alt="Instagram"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

function Footer2({ insta }) {
  return (
    <footer
      className={`main-footer footer-two bgp-bottom bgc-black rel z-15 ${insta ? "" : "pt-100 pb-115"
        }`}
      style={{
        backgroundImage: "url(assets/images/backgrounds/footer-two.png)",
      }}
    >
      {insta && <FooterInstagram />}
      <div className="widget-area">
        <div className="container">
          <div className="row row-cols-xxl-5 row-cols-xl-4 row-cols-md-3 row-cols-2">
            <div
              className="col col-small"
              data-aos="fade-up"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="footer-widget footer-text">
                <div className="footer-logo mb-40">
                  <Link to="/">
                    <img src="assets/images/logos/logo.png" alt="Logo" />
                  </Link>
                </div>
                <div className="footer-map">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d96777.16150026117!2d-74.00840582560909!3d40.71171357405996!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1706508986625!5m2!1sen!2sbd"
                    style={{ border: 0, width: "100%" }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
            <div
              className="col col-small"
              data-aos="fade-up"
              data-aos-delay={50}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="footer-widget footer-links ms-sm-5">
                <div className="footer-title">
                  <h5>Services</h5>
                </div>
                <ul className="list-style-three">
                  <li>
                    <Link to="destination-details">Best Tour Guide</Link>
                  </li>
                  <li>
                    <Link to="destination-details">Tour Booking</Link>
                  </li>
                  <li>
                    <Link to="destination-details">Hotel Booking</Link>
                  </li>
                  <li>
                    <Link to="destination-details">Ticket Booking</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="col col-small"
              data-aos="fade-up"
              data-aos-delay={100}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="footer-widget footer-links ms-md-4">
                <div className="footer-title">
                  <h5>Company</h5>
                </div>
                <ul className="list-style-three">
                  <li>
                    <Link to="about">About Company</Link>
                  </li>
                  <li>
                    <Link to="blog">Community Blog</Link>
                  </li>
                  <li>
                    <Link to="contact">Jobs and Careers</Link>
                  </li>
                  <li>
                    <Link to="blog">latest News Blog</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="col col-small"
              data-aos="fade-up"
              data-aos-delay={150}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="footer-widget footer-links ms-lg-4">
                <div className="footer-title">
                  <h5>Destinations</h5>
                </div>
                <ul className="list-style-three">
                  <li>
                    <Link to="destination-details">African Safaris</Link>
                  </li>
                  <li>
                    <Link to="destination-details">Alaska &amp; Canada</Link>
                  </li>
                  <li>
                    <Link to="destination-details">South America</Link>
                  </li>
                  <li>
                    <Link to="destination-details">Middle East</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="col col-md-6 col-10 col-small"
              data-aos="fade-up"
              data-aos-delay={200}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="footer-widget footer-contact">
                <div className="footer-title">
                  <h5>Get In Touch</h5>
                </div>
                <ul className="list-style-one">
                  <li>
                    <i className="fal fa-map-marked-alt" /> 578 Level, D-block
                    45 Street Melbourne, Australia
                  </li>
                  <li>
                    <i className="fal fa-envelope" />{" "}
                    <a href="mailto:supportrevelo@gmail.com">
                      supportrevelo @gmail.com
                    </a>
                  </li>
                  <li>
                    <i className="fal fa-phone-volume" />{" "}
                    <a href="callto:+88012334588">+880 (123) 345 88</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom bg-transparent pt-20 pb-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div className="copyright-text text-center text-lg-start">
                <p>
                  @Linkopy 202/4 <a href="">Ravelo</a>, All rights reserved
                </p>
              </div>
            </div>
            <div className="col-lg-7 text-center text-lg-end">
              <ul className="footer-bottom-nav">
                <li>
                  <Link to="about">Terms</Link>
                </li>
                <li>
                  <Link to="about">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="about">Legal notice</Link>
                </li>
                <li>
                  <Link to="about">Accessibility</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer2