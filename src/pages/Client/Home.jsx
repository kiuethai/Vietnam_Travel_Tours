import React from 'react'
// import { useInView } from 'react-intersection-observer'
import Counter from "~/components/Client/Counter";
import SearchFilter from "~/components/Client/SearchFilter";
import SectionTitle from "~/components/Client/SectionTitle";
import Testimonial from "~/components/Client/slider/Testimonial";
import ReveloLayout from '../../components/Client/layout/ReveloLayout'
import { Link } from 'react-router-dom';
import 'aos/dist/aos.css'; // Nếu sử dụng AOS animation
import Header1 from '../../components/Client/layout/Header/Header1';
import Footer1 from '../../components/Client/layout/Footer/Footer1';

function Home() {


  return (
    <div>
      {/* Hero Area Start */}
      <section className="hero-area bgc-black pt-200 rpt-120 rel z-2">
        <div className="container-fluid">
          <h1
            className="hero-title"
            data-aos="flip-up"
            data-aos-delay={50}
            data-aos-duration={1500}
            data-aos-offset={50}
          >
            tour &amp; Travel
          </h1>
          <div
            className="main-hero-image bgs-cover"
            style={{ backgroundImage: "url(assets/images/hero/hero.jpg)" }}
          />
        </div>
        <SearchFilter />
      </section>
      {/* Hero Area End */}

      <section className="destinations-area bgc-black pt-100 pb-70 rel z-1">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div
                className="section-title text-white text-center counter-text-wrap mb-70"
                data-aos="fade-up"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <SectionTitle
                  title={"Khám phá kho báu việt nam cùng KTTravel"}
                  countValue={35300}
                  subtitle1={"Website"}
                  subtitle2={"phổ biến nhất mà bạn sẽ nhớ"}
                />
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-xxl-3 col-xl-4 col-md-6">
              <div
                className="destination-item"
                data-aos="fade-up"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="image">
                  <div className="ratting">
                    <i className="fas fa-star" /> 4.8
                  </div>
                  <a href="#" className="heart">
                    <i className="fas fa-heart" />
                  </a>
                  <img
                    src="assets/images/destinations/visiting-place1.jpg"
                    alt="Destination"
                  />
                </div>
                <div className="content">
                  <span className="location">
                    <i className="fal fa-map-marker-alt" /> Miền Bắc, Hà Nội
                  </span>
                  <h5>
                    <Link to="/destination-details">
                      Việt Phủ Thành Chương - Sapa - Bản Cát Cát - Fansipan - Hạ Long - Yên Tử - KDL Tràng An - Bái Đính
                    </Link>
                  </h5>
                  <span className="time">3 ngày 2 đêm</span>
                </div>
                <div className="destination-footer">
                  <span className="price">
                    <span>10.690.000 ₫</span>/Khách
                  </span>
                  <a href="#" className="read-more">
                    Đặt ngay <i className="fal fa-angle-right" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-4 col-md-6">
              <div
                className="destination-item"
                data-aos="fade-up"
                data-aos-delay={100}
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="image">
                  <div className="ratting">
                    <i className="fas fa-star" /> 4.8
                  </div>
                  <a href="#" className="heart">
                    <i className="fas fa-heart" />
                  </a>
                  <img
                    src="assets/images/destinations/visiting-place2.jpg"
                    alt="Destination"
                  />
                </div>
                <div className="content">
                  <span className="location">
                    <i className="fal fa-map-marker-alt" /> Miền Trung, Nha Trang Phú Yên
                  </span>
                  <h5>
                    <Link to="/destination-details">
                      Nha Trang - Phú Yên: Khu Du Lịch Dốc Lết - Gành Đá Dĩa - Mũi Điện - Tháp Nghinh Phong - Vinwonders Nha Trang
                    </Link>
                  </h5>
                  <span className="time">3 ngày 2 đêm</span>
                </div>
                <div className="destination-footer">
                  <span className="price">
                    <span>4.490.000 ₫</span>/Khách
                  </span>
                  <a href="#" className="read-more">
                    Đặt ngay <i className="fal fa-angle-right" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-4 col-md-6">
              <div
                className="destination-item"
                data-aos="fade-up"
                data-aos-delay={200}
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="image">
                  <div className="ratting">
                    <i className="fas fa-star" /> 4.9
                  </div>
                  <a href="#" className="heart">
                    <i className="fas fa-heart" />
                  </a>
                  <img
                    src="assets/images/destinations/visiting-place3.jpg"
                    alt="Destination"
                  />
                </div>
                <div className="content">
                  <span className="location">
                    <i className="fal fa-map-marker-alt" /> Miền Tây Nam Bộ, Phú Quốc
                  </span>
                  <h5>
                    <Link to="/destination-details">
                      Phú Quốc: Hòn Thơm Nature Park - Thị trấn Hoàng Hôn - Kiss Bridge (Tặng vé cáp treo 3 dây vượt biển)
                    </Link>
                  </h5>
                  <span className="time">3 Ngày 2 đêm</span>
                </div>
                <div className="destination-footer">
                  <span className="price">
                    <span>6.490.000 ₫</span>/Khách
                  </span>
                  <a href="#" className="read-more">
                    Đặt ngay <i className="fal fa-angle-right" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-4 col-md-6">
              <div
                className="destination-item"
                data-aos="fade-up"
                data-aos-delay={200}
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="image">
                  <div className="ratting">
                    <i className="fas fa-star" /> 4.9
                  </div>
                  <a href="#" className="heart">
                    <i className="fas fa-heart" />
                  </a>
                  <img
                    src="assets/images/destinations/visiting-place3.jpg"
                    alt="Destination"
                  />
                </div>
                <div className="content">
                  <span className="location">
                    <i className="fal fa-map-marker-alt" /> Miền Tây Nam Bộ, Phú Quốc
                  </span>
                  <h5>
                    <Link to="/destination-details">
                      Phú Quốc: Hòn Thơm Nature Park - Thị trấn Hoàng Hôn - Kiss Bridge (Tặng vé cáp treo 3 dây vượt biển)
                    </Link>
                  </h5>
                  <span className="time">3 Ngày 2 đêm</span>
                </div>
                <div className="destination-footer">
                  <span className="price">
                    <span>6.490.000 ₫</span>/Khách
                  </span>
                  <a href="#" className="read-more">
                    Đặt ngay <i className="fal fa-angle-right" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Destinations Area end */}

      {/* About Us Area start */}
      <section className="about-us-area py-100 rpb-90 rel z-1">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-5 col-lg-6">
              <div
                className="about-us-content rmb-55"
                data-aos="fade-left"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="section-title mb-25">
                  <h2>
                    Du lịch giờ chót của KTTravel luôn đem đến cho Quý khách những niềm bất ngờ thú vị.
                  </h2>
                </div>
                <p>
                  Đó là những đường tour cuốn hút với mức giá đầy hấp dẫn, khuyến mại vào thời điểm cận ngày khởi hành. Với những giảm giá rất ưu đãi phối hợp với hệ thống đối tác lớn mạnh, KTTravel cho Quý khách cơ hội được tận hưởng những dịch vụ chất lượng vàng không đổi từ công ty lữ hành uy tín nhất Việt Nam.
                </p>
                <div className="divider counter-text-wrap mt-45 mb-55">
                  <span>
                    Chúng tôi có{" "}
                    <span>
                      <span
                        className="count-text plus"
                        data-speed={3000}
                        data-stop={10}
                      >
                        <Counter end={10} />
                      </span>{" "}
                      Năm
                    </span>{" "}
                    kinh nghiệm
                  </span>
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className="counter-item counter-text-wrap">
                      <span
                        className="count-text k-plus"
                        data-speed={3000}
                        data-stop={3}
                      >
                        <Counter end={3} />
                      </span>
                      <span className="counter-title">Điểm đến phổ biến</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="counter-item counter-text-wrap">
                      <span
                        className="count-text m-plus"
                        data-speed={3000}
                        data-stop={9}
                      >
                        <Counter end={9} />
                      </span>
                      <span className="counter-title">Khách hàng hài lòng</span>
                    </div>
                  </div>
                </div>
                <Link to="/destination1" className="theme-btn mt-10 style-two">
                  <span data-hover="Khám phá Điểm đến">
                    Khám phá Điểm đến
                  </span>
                  <i className="fal fa-arrow-right" />
                </Link>
              </div>
            </div>
            <div
              className="col-xl-7 col-lg-6"
              data-aos="fade-right"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="about-us-image">
                <div className="shape">
                  <img src="assets/images/about/shape1.png" alt="Shape" />
                </div>
                <div className="shape">
                  <img src="assets/images/about/shape2.png" alt="Shape" />
                </div>
                <div className="shape">
                  <img src="assets/images/about/shape3.png" alt="Shape" />
                </div>
                <div className="shape">
                  <img src="assets/images/about/shape4.png" alt="Shape" />
                </div>
                <div className="shape">
                  <img src="assets/images/about/shape5.png" alt="Shape" />
                </div>
                <div className="shape">
                  <img src="assets/images/about/shape6.png" alt="Shape" />
                </div>
                <div className="shape">
                  <img src="assets/images/about/shape7.png" alt="Shape" />
                </div>
                <img src="assets/images/about/about.png" alt="About" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* About Us Area end */}


      {/* Popular Destinations Area start */}
      <section className="popular-destinations-area rel z-1">
        <div className="container-fluid">
          <div className="popular-destinations-wrap br-20 bgc-lighter pt-100 pb-70">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div
                  className="section-title text-center counter-text-wrap mb-70"
                  data-aos="fade-up"
                  data-aos-duration={1500}
                  data-aos-offset={50}
                >
                  <SectionTitle
                    title={"Khám phá các điểm đến phổ biến"}
                    subtitle2="trải nghiệm phổ biến nhất"
                  />
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-xl-3 col-md-6">
                  <div
                    className="destination-item style-two"
                    data-aos="flip-up"
                    data-aos-duration={1500}
                    data-aos-offset={50}
                  >
                    <div className="image">
                      <a href="#" className="heart">
                        <i className="fas fa-heart" />
                      </a>
                      <img
                        src="assets/images/destinations/destination1.jpg"
                        alt="Destination"
                      />
                    </div>
                    <div className="content">
                      <h6>
                        <Link to="/destination-details">Tour du lịch Halong Bay</Link>
                      </h6>
                      <span className="time">
                        535+ tours &amp; 85+ Hoạt động
                      </span>
                      <a href="#" className="more">
                        <i className="fas fa-chevron-right" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div
                    className="destination-item style-two"
                    data-aos="flip-up"
                    data-aos-delay={100}
                    data-aos-duration={1500}
                    data-aos-offset={50}
                  >
                    <div className="image">
                      <a href="#" className="heart">
                        <i className="fas fa-heart" />
                      </a>
                      <img
                        src="assets/images/destinations/destination2.jpg"
                        alt="Destination"
                      />
                    </div>
                    <div className="content">
                      <h6>
                        <Link to="/destination-details">Tour du lịch Delta Mê Kông</Link>
                      </h6>
                      <span className="time">
                        5352+ tours &amp; 856+ Hoạt động
                      </span>
                      <a href="#" className="more">
                        <i className="fas fa-chevron-right" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    className="destination-item style-two"
                    data-aos="flip-up"
                    data-aos-delay={200}
                    data-aos-duration={1500}
                    data-aos-offset={50}
                  >
                    <div className="image">
                      <a href="#" className="heart">
                        <i className="fas fa-heart" />
                      </a>
                      <img
                        src="assets/images/destinations/destination3.jpg"
                        alt="Destination"
                      />
                    </div>
                    <div className="content">
                      <h6>
                        <Link to="/destination-details">
                          Biển Đà Nẵng
                        </Link>
                      </h6>
                      <span className="time">
                        5352+ tours &amp; 856+ Hoạt động
                      </span>
                      <a href="#" className="more">
                        <i className="fas fa-chevron-right" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    className="destination-item style-two"
                    data-aos="flip-up"
                    data-aos-duration={1500}
                    data-aos-offset={50}
                  >
                    <div className="image">
                      <a href="#" className="heart">
                        <i className="fas fa-heart" />
                      </a>
                      <img
                        src="assets/images/destinations/destination4.jpg"
                        alt="Destination"
                      />
                    </div>
                    <div className="content">
                      <h6>
                        <Link to="/destination-details">
                          Biển Nha Trang
                        </Link>
                      </h6>
                      <span className="time">
                        5352+ tours &amp; 856+ Hoạt động
                      </span>
                      <a href="#" className="more">
                        <i className="fas fa-chevron-right" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div
                    className="destination-item style-two"
                    data-aos="flip-up"
                    data-aos-delay={100}
                    data-aos-duration={1500}
                    data-aos-offset={50}
                  >
                    <div className="image">
                      <a href="#" className="heart">
                        <i className="fas fa-heart" />
                      </a>
                      <img
                        src="assets/images/destinations/destination5.jpg"
                        alt="Destination"
                      />
                    </div>
                    <div className="content">
                      <h6>
                        <Link to="/destination-details">
                          Phú quốc
                        </Link>
                      </h6>
                      <span className="time">
                        5352+ tours &amp; 856+ Hoat động
                      </span>
                      <a href="#" className="more">
                        <i className="fas fa-chevron-right" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div
                    className="destination-item style-two"
                    data-aos="flip-up"
                    data-aos-delay={200}
                    data-aos-duration={1500}
                    data-aos-offset={50}
                  >
                    <div className="image">
                      <a href="#" className="heart">
                        <i className="fas fa-heart" />
                      </a>
                      <img
                        src="assets/images/destinations/destination6.jpg"
                        alt="Destination"
                      />
                    </div>
                    <div className="content">
                      <h6>
                        <Link to="/destination-details">Thanh Hóa</Link>
                      </h6>
                      <span className="time">
                        5352+ tours &amp; 856+ Hoạt động
                      </span>
                      <a href="#" className="more">
                        <i className="fas fa-chevron-right" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Popular Destinations Area end */}

      {/* Features Area start */}
      <section className="features-area pt-100 pb-45 rel z-1">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-6">
              <div
                className="features-content-part mb-55"
                data-aos="fade-left"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="section-title mb-60">
                  <h2>
                    Trải nghiệm du lịch tuyệt đỉnh mang đến sự khác biệt cho công ty chúng tôi
                  </h2>
                </div>
                <div className="features-customer-box">
                  <div className="image">
                    <img
                      src="assets/images/features/features-box.jpg"
                      alt="Features"
                    />
                  </div>
                  <div className="content">
                    <div className="feature-authors mb-15">
                      <img
                        src="assets/images/features/feature-author1.jpg"
                        alt="Author"
                      />
                      <img
                        src="assets/images/features/feature-author2.jpg"
                        alt="Author"
                      />
                      <img
                        src="assets/images/features/feature-author3.jpg"
                        alt="Author"
                      />
                      <span>5k+</span>
                    </div>
                    <h6>550K+ Khách hàng hài lòng</h6>
                    <div className="divider style-two counter-text-wrap my-25">
                      <span>
                        <span
                          className="count-text plus"
                          data-speed={3000}
                          data-stop={25}
                        >
                          5
                        </span>{" "}
                        Năm
                      </span>
                    </div>
                    <p>Chúng tôi tự hào cung cấp các hành trình được cá nhân hóa</p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-xl-6"
              data-aos="fade-right"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="row pb-25">
                <div className="col-md-6">
                  <div className="feature-item">
                    <div className="icon">
                      <i className="flaticon-tent" />
                    </div>
                    <div className="content">
                      <h5>
                        <Link to="tour-details">Trải Nghiệm Đặc Sắc Việt Nam</Link>
                      </h5>
                      <p>
                        Trải nghiệm những hoạt động và lễ hội đặc trưng của văn hóa Việt.
                      </p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="icon">
                      <i className="flaticon-tent" />
                    </div>
                    <div className="content">
                      <h5>
                        <Link to="tour-details">Khám Phá Di Sản Việt Nam</Link>
                      </h5>
                      <p>
                        Khám phá các di sản thế giới và những kỳ quan thiên nhiên nổi tiếng.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="feature-item mt-20">
                    <div className="icon">
                      <i className="flaticon-tent" />
                    </div>
                    <div className="content">
                      <h5>
                        <Link to="tour-details">Vẻ Đẹp Thiên Nhiên Việt </Link>
                      </h5>
                      <p>
                        Chinh phục vẻ đẹp tự nhiên hoang sơ và kỳ vĩ của Việt Nam.
                      </p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="icon">
                      <i className="flaticon-tent" />
                    </div>
                    <div className="content">
                      <h5>
                        <Link to="tour-details">Chinh phục cảnh quan việt nam</Link>
                      </h5>
                      <p>
                        Khám phá những cảnh đep hùng vĩ và tuyệt vời của đất nước Việt Nam
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Area end */}

      {/* CTA Area start */}
      <section className="cta-area pt-100 rel z-1">
        <div className="container-fluid">
          <div className="row">
            <div
              className="col-xl-4 col-md-6"
              data-aos="zoom-in-down"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div
                className="cta-item"
                style={{ backgroundImage: "url(assets/images/cta/cta1.jpg)" }}
              >
                <span className="category">Khám Phá Vẻ Đẹp Văn Hóa Việt</span>
                <h2>Tìm hiểu những giá trị văn hóa độc đáo của các vùng miền Việt Nam.</h2>
                <Link
                  to="/tour-details"
                  className="theme-btn style-two bgc-secondary"
                >
                  <span data-hover="Khám phá">Khám phá</span>
                  <i className="fal fa-arrow-right" />
                </Link>
              </div>
            </div>
            <div
              className="col-xl-4 col-md-6"
              data-aos="zoom-in-down"
              data-aos-delay={50}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div
                className="cta-item"
                style={{ backgroundImage: "url(assets/images/cta/cta2.jpg)" }}
              >
                <span className="category">Bãi biển Cô Tô</span>
                <h2>Bãi trong xanh dạt dào ở Việt Nam</h2>
                <Link to="/tour-details" className="theme-btn style-two">
                  <span data-hover="Khám phá">Khám phá</span>
                  <i className="fal fa-arrow-right" />
                </Link>
              </div>
            </div>
            <div
              className="col-xl-4 col-md-6"
              data-aos="zoom-in-down"
              data-aos-delay={100}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div
                className="cta-item"
                style={{ backgroundImage: "url(assets/images/cta/cta3.jpg)" }}
              >
                <span className="category">Thác nước</span>
                <h2>Thác nước lớn nhất Việt Nam</h2>
                <Link
                  to="/tour-details"
                  className="theme-btn style-two bgc-secondary"
                >
                  <span data-hover="Khám phá">Khám phá</span>
                  <i className="fal fa-arrow-right" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Area end */}
    </div>

  )
}

export default Home