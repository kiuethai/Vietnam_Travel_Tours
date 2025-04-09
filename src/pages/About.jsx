import React from 'react'
import Banner from "../../src/components/Banner";
import Counter from "../../src/components/Counter";
import SectionTitle from "../../src/components/SectionTitle";
import Client from "../../src/components/slider/Client";
import Testimonial from "../../src/components/slider/Testimonial";
import { Link } from 'react-router-dom';
function About() {
  return (
    <div>
      <Banner pageTitle={"About Us"} />
      {/* About Area start */}
      <section className="about-area-two py-100 rel z-1">
        <div className="container">
          <div className="row justify-content-between">
            <div
              className="col-xl-3"
              data-aos="fade-right"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <span className="subtitle mb-35">Về chúng tôi</span>
            </div>
            <div className="col-xl-9">
              <div
                className="about-page-content"
                data-aos="fade-left"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="row">
                  <div className="col-lg-8 pe-lg-5 me-lg-5">
                    <div className="section-title mb-25">
                      <h2>
                        Kinh nghiệm và công ty du lịch chuyên nghiệp ở Việt Nam
                      </h2>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="experience-years rmb-20">
                      <span className="title bgc-secondary">
                        Năm kinh nghiệm
                      </span>
                      <span className="text">Chúng tôi</span>
                      <span className="years">5+</span>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <p>
                      Chúng tôi chuyên tạo ra những trải nghiệm thành phố khó quên cho du khách muốn khám phá
                      trái tim và tâm hồn của cảnh quan đô thị. Các tour du lịch có hướng dẫn viên chuyên
                      nghiệp của chúng tôi sẽ đưa du khách qua những con phố sôi động, các địa danh lịch sử và những viên ngọc ẩn giấu của mỗi thành phố.
                    </p>
                    <ul className="list-style-two mt-35">
                      <li>Cơ quan Trải nghiệm</li>
                      <li>Đội ngũ Chuyên nghiệp</li>
                      <li>Du lịch Chi phí Thấp</li>
                      <li>Hỗ trợ Trực tuyến 24/7</li>
                    </ul>
                    <Link to="about" className="theme-btn style-three mt-30">
                      <span data-hover="Khám phá Tours">Khám phá Tours</span>
                      <i className="fal fa-arrow-right" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* About Area end */}

      {/* Features Area start */}
      <section className="about-features-area">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-4 col-md-6">
              <div
                className="about-feature-image"
                data-aos="fade-up"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <img src="assets/images/about/about-feature1.jpg" alt="About" />
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div
                className="about-feature-image"
                data-aos="fade-up"
                data-aos-delay={50}
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <img src="assets/images/about/about-feature2.jpg" alt="About" />
              </div>
            </div>
            <div className="col-xl-4 col-md-8">
              <div
                className="about-feature-boxes"
                data-aos="fade-up"
                data-aos-delay={100}
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="feature-item style-three bgc-secondary">
                  <div className="icon-title">
                    <div className="icon">
                      <i className="flaticon-award-symbol" />
                    </div>
                    <h5>
                      <Link to="destination-details">
                        Chúng tôi là công ty đạt giải thưởng
                      </Link>
                    </h5>
                  </div>
                  <div className="content">
                    <p>
                      Tại Pinnacle Business Solutions cam kết về sự xuất sắc và đổi mới đã đạt được
                    </p>
                  </div>
                </div>
                <div className="feature-item style-three bgc-primary">
                  <div className="icon-title">
                    <div className="icon">
                      <i className="flaticon-tourism" />
                    </div>
                    <h5>
                      <Link to="destination-details">
                        500+ Điểm đến du lịch phổ biến
                      </Link>
                    </h5>
                  </div>
                  <div className="content">
                    <p>Đội ngũ chuyên gia của chúng tôi tận tâm phát triển các chiến lược tiên tiến thúc đẩy
                      thành công</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Area end */}


      {/* About Us Area start */}
      <section className="about-us-area pt-70 pb-100 rel z-1">
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
                    Du lịch với sự tự tin Lý do hàng đầu để chọn công ty của chúng tôi
                  </h2>
                </div>
                <p>Chúng tôi hợp tác chặt chẽ với khách hàng để hiểu rõ những thách thức và mục tiêu, cung
                  cấp các giải pháp tùy chỉnh để nâng cao hiệu quả, tăng lợi nhuận và thúc đẩy tăng trưởng bền
                  vững.</p>
                <div className="row pt-25">
                  <div className="col-6">
                    <div className="counter-item counter-text-wrap">
                      <span className="count-text k-plus">
                        <Counter end={3} />
                      </span>
                      <span className="counter-title">Điểm đến phổ biến</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="counter-item counter-text-wrap">
                      <span className="count-text m-plus">
                        <Counter end={9} />
                      </span>
                      <span className="counter-title">Khách hàng hài lòng</span>
                    </div>
                  </div>
                </div>
                <Link
                  href="destination-details"
                  className="theme-btn mt-10 style-two"
                >
                  <span data-hover="Explore Destinations">
                    Khám phá các điểm đến
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
              <div className="about-us-page">
                <img src="assets/images/about/about-page.jpg" alt="About" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* About Us Area end */}


      {/* Team Area start */}
      <section className="about-team-area pb-70 rel z-1">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div
                className="section-title text-center counter-text-wrap mb-50"
                data-aos="fade-up"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <SectionTitle title={"Gặp gỡ những hướng dẫn viên du lịch giàu kinh nghiệm của chúng tôi"} />
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-xl-3 col-lg-4 col-sm-6">
              <div
                className="team-item hover-content"
                data-aos="fade-up"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <img src="assets/images/team/guide1.jpg" alt="Guide" />
                <div className="content">
                  <h6>Kiều Văn Thái<i></i></h6>
                  <span className="designation">Founder</span>
                  <div className="social-style-one inner-content">
                    <Link to="#">
                      <i className="fab fa-twitter" />
                    </Link>
                    <Link to="https://www.facebook.com/kieuthaizz">
                      <i className="fab fa-facebook-f" />
                    </Link>
                    <Link to="#">
                      <i className="fab fa-instagram" />
                    </Link>
                    <a href="#">
                      <i className="fab fa-pinterest-p" />
                    </a>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
      {/* Team Area end */}

      {/* Features Area start */}
      <section className="about-feature-two bgc-black pt-100 pb-45 rel z-1">
        <div className="container">
          <div
            className="section-title text-center text-white counter-text-wrap mb-50"
            data-aos="fade-up"
            data-aos-duration={1500}
            data-aos-offset={50}
          >
            <SectionTitle title={"Làm thế nào để hưởng lợi từ các chuyến du lịch của chúng tôi"} />
          </div>
          <div className="row">
            <div
              className="col-xl-3 col-lg-4 col-md-6"
              data-aos="fade-up"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="feature-item style-two">
                <div className="icon">
                  <i className="flaticon-save-money" />
                </div>
                <div className="content">
                  <h5>
                    <Link to="tour">Đảm bảo giá tốt nhất</Link>
                  </h5>
                  <p>Cam kết giá ưu đãi nhất, giúp bạn tiết kiệm tối đa chi phí du lịch.</p>
                </div>
              </div>
            </div>
            <div
              className="col-xl-3 col-lg-4 col-md-6"
              data-aos="fade-up"
              data-aos-delay={50}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="feature-item style-two">
                <div className="icon">
                  <i className="flaticon-travel-1" />
                </div>
                <div className="content">
                  <h5>
                    <Link to="tour">Điểm đến đa dạng</Link>
                  </h5>
                  <p>
                    Hàng nghìn điểm đến hấp dẫn, phù hợp mọi sở thích và phong cách du lịch.
                  </p>
                </div>
              </div>
            </div>
            <div
              className="col-xl-3 col-lg-4 col-md-6"
              data-aos="fade-up"
              data-aos-delay={100}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="feature-item style-two">
                <div className="icon">
                  <i className="flaticon-booking" />
                </div>
                <div className="content">
                  <h5>
                    <Link to="tour">Đặt chỗ nhanh</Link>
                  </h5>
                  <p>Quy trình đặt chỗ đơn giản, nhanh chóng, đảm bảo chuyến đi suôn sẻ.
                  </p>                </div>
              </div>
            </div>
            <div
              className="col-xl-3 col-lg-4 col-md-6"
              data-aos="fade-up"
              data-aos-delay={150}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="feature-item style-two">
                <div className="icon">
                  <i className="flaticon-guidepost" />
                </div>
                <div className="content">
                  <h5>
                    <Link to="destination-details">Hướng dẫn du lịch tốt</Link>
                  </h5>
                  <p>Đội ngũ hướng dẫn tận tâm, giàu kinh nghiệm, đồng hành cùng bạn mọi hành trình.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="shape">
          <img src="assets/images/video/shape1.png" alt="shape" />
        </div>
      </section>
      {/* Features Area end */}

     

    </div>
  )
}

export default About