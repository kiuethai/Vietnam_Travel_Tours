import React from 'react'
import { Link } from 'react-router-dom';
import ScrollToTopButton from './ScrollToTopButten';


const FooterInstagram = () => {
  return (
    <div className="container">
      <div className="footer-instagram pt-100 mb-70">
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
                    src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJF9jgvxKsNTERsnYz-SsVpzM&key=AIzaSyAJkfQLDQsEDYV99GHOlmVJwvWrImCGx0c"
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
                  <h5>Dịch vụ</h5>
                </div>
                <ul className="list-style-three">
                  <li>
                    <Link to="destination-details">Hướng dẫn viên du lịch tốt nhất</Link>
                  </li>
                  <li>
                    <Link to="destination-details">Đặt tour</Link>
                  </li>
                  <li>
                    <Link to="destination-details">Đặt tour</Link>
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
                  <h5>Công ty</h5>
                </div>
                <ul className="list-style-three">
                  <li>
                    <Link to="about">Giới thiệu về công ty</Link>
                  </li>
                  <li>
                    <Link to="contact">Việc làm và nghề nghiệp</Link>
                  </li>
                  <li>
                    <Link to="contact">Liên hệ với chúng tôi</Link>
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
                  <h5>Điểm đến</h5>
                </div>
                <ul className="list-style-three">
                  <li>
                    <Link to="destination-details">Miền Bắc</Link>
                  </li>
                  <li>
                    <Link to="destination-details">Miền Trung</Link>
                  </li>
                  <li>
                    <Link to="destination-details">Miền Nam</Link>
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
                  <h5>Liên hệ</h5>
                </div>
                <ul className="list-style-one">
                  <li>
                    <i className="fal fa-map-marked-alt" /> Kim Giang, Hoàng Mai, Hà Nội
                  </li>
                  <li>
                    <i className="fal fa-envelope" />{" "}
                    <a href="mailto:kieuthai093@gmail.com">
                      kieuthai093@gmail.com
                    </a>
                  </li>
                  <li>
                    <i className="fal fa-phone-volume" />{" "}
                    <a href="callto:+123456789">+123456789</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom pt-20 pb-5">
           <div className="container">
             <div className="row">
               <div className="col-lg-5">
                 <div className="copyright-text text-center text-lg-start">
                   <p>
                     <a href="#">KTTravel</a>
                   </p>
                 </div>
               </div>
               <div className="col-lg-7 text-center text-lg-end">
                 <ul className="footer-bottom-nav">
                   <li>
                     <Link to="/about">Điều khoản</Link>
                   </li>
                   <li>
                     <Link to="/about">Chính sách bảo mật</Link>
                   </li>
                   <li>
                     <Link to="/about">Thông báo pháp lý</Link>
                   </li>
                   <li>
                     <Link to="/about">Khả năng truy cập</Link>
                   </li>
                 </ul>
               </div>
             </div>
             {/* Scroll Top Button */}
             <ScrollToTopButton />
           </div>
         </div>
    </footer>
  );
}

export default Footer2