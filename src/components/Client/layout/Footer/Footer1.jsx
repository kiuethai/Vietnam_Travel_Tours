import React from 'react'
import VisibilitySensor from 'react-visibility-sensor';
import Counter from "~/components/Client/Counter"
import { Link } from 'react-router-dom'
import ScrollToTopButton from './ScrollToTopButten';

function Footer1() {
  return (
    <footer
      className="main-footer bgs-cover overlay rel z-1 pb-25"
      style={{
        backgroundImage: "url(assets/images/backgrounds/footer.jpg)",
      }}
    >
      <div className="container">
        <div className="footer-top pt-100 pb-30">
          <div className="row justify-content-between">
            <div
              className="col-xl-5 col-lg-6"
              data-aos="fade-up"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="footer-widget footer-text">
                <div className="footer-logo mb-25">
                  <Link to="/">
                    <img src="https://res.cloudinary.com/dbkhjufja/image/upload/v1744543947/b88zgpwgvx6pd51fw4zz.png" alt="Logo" />
                  </Link>
                </div>
                <p>
                  Chúng tôi biên soạn các hành trình riêng biệt phù hợp với sở thích của bạn, đảm bảo mọi
                  chuyến đi đều liền mạch và làm phong phú thêm những viên ngọc ẩn giấu
                </p>
                <div className="social-style-one mt-15">
                  <Link to="https://www.facebook.com/kieuthaizz">
                    <i className="fab fa-facebook-f" />
                  </Link>
                  <Link to="#">
                    <i className="fab fa-youtube" />
                  </Link>
                  <Link to="#">
                    <i className="fab fa-pinterest" />
                  </Link>
                  <Link to="#">
                    <i className="fab fa-twitter" />
                  </Link>
                </div>
              </div>
            </div>
            <div
              className="col-xl-5 col-lg-6"
              data-aos="fade-up"
              data-aos-delay={50}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="section-title counter-text-wrap mb-35">
                <h2>Đăng ký nhận bản tin</h2>
                <p>
                  Website{" "}
                  <span className="count-text plus">
                    <Counter end={34500} />
                  </span>{" "}
                  trải nghiệm phổ biến nhất mà bạn sẽ nhớ
                </p>
              </div>
              <form className="newsletter-form mb-50" action="#">
                <input
                  id="news-email"
                  type="email"
                  placeholder="Email Address"
                  required=""
                />
                <button
                  type="submit"
                  className="theme-btn bgc-secondary style-two"
                >
                  <span data-hover="Đăng ký">Đăng ký</span>
                  <i className="fal fa-arrow-right" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="widget-area pt-95 pb-45">
        <div className="container">
          <div className="row row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-2">
            <div
              className="col col-small"
              data-aos="fade-up"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="footer-widget footer-links">
                <div className="footer-title">
                  <h5>Services</h5>
                </div>
                <ul className="list-style-three">
                  <li>
                    <Link to="destination-details">Hướng dẫn viên du lịch tốt nhất</Link>
                  </li>
                  <li>
                    <Link to="destination-details">Đặt tour</Link>
                  </li>
                  <li>
                    <Link to="destination-details">Đặt vé</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="col col-small"
              data-aos="fade-up"
              data-aos-delay={50}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="footer-widget footer-links">
                <div className="footer-title">
                  <h5>Công ty</h5>
                </div>
                <ul className="list-style-three">
                  <li>
                    <Link to="about">Giới thiệu về công ty</Link>
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
              data-aos-delay={100}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="footer-widget footer-links">
                <div className="footer-title">
                  <h5>Điểm đến</h5>
                </div>
                <ul className="list-style-three">
                  <li>
                    <Link to="destination-details">Miền Bắc</Link>
                  </li>
                  <li>
                    <Link to="destination-details">Miền Trunga</Link>
                  </li>
                  <li>
                    <Link to="destination-details">Miền Nam</Link>
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
              <div className="footer-widget footer-links">
                <div className="footer-title">
                  <h5>Thể loại</h5>
                </div>
                <ul className="list-style-three">
                  <li>
                    <Link to="contact">Phiêu lưu</Link>
                  </li>
                  <li>
                    <Link to="contact">Tour gia đình</Link>
                  </li>
                  <li>
                    <Link to="contact">Tour động vật hoang dã</Link>
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
                    <i className="fal fa-clock" /> Thứ 2 - Thứ 6, 08am - 05pm
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
                  <a href="">KTTravel</a>
                </p>
              </div>
            </div>
            <div className="col-lg-7 text-center text-lg-end">
              <ul className="footer-bottom-nav">
                <li>
                  <Link to="about">Điều khoản</Link>
                </li>
                <li>
                  <Link to="about">Chính sách bảo mật</Link>
                </li>
                <li>
                  <Link to="about">Thông báo pháp lý</Link>
                </li>
                <li>
                  <Link to="about">Khả năng truy cập</Link>
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

export default Footer1