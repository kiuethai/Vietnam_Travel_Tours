import React from 'react'
import Banner from "~/components/Client/Banner";
import SectionTitle from "~/components/Client/SectionTitle";
import Subscribe from "~/components/Client/Subscribe";
import { Link } from 'react-router-dom';
function Destination2() {
  return (
    <div>
      <Banner pageTitle={"Điểm đến"} search={true} />
      {/* Page Banner End */}
      {/* Popular Destinations Area start */}
      <section className="popular-destinations-area pt-100 pb-90 rel z-1">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div
                className="section-title text-center counter-text-wrap mb-40"
                data-aos="fade-up"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <SectionTitle title={"Khám phá các điểm đến phổ biến"} />
                <ul className="destinations-nav mt-30">
                  <li data-filter="*" className="active">
                    Tất cả
                  </li>
                  <li data-filter=".domain-b">Miền Bắc</li>
                  <li data-filter=".domain-t">Miền Trung</li>
                  <li data-filter=".domain-n">Miền Nam</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row gap-10 destinations-active justify-content-center">
              <div className="col-xl-3 col-md-6 item recent rating">
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
                      <Link to="destination-details">Biển Đà Nẵng</Link>
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
              <div className="col-xl-3 col-md-6 item features">
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
                      <Link to="destination-details">Tour du lịch Delta Mê Kông</Link>
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
              <div className="col-md-6 item recent city rating">
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
                      <Link to="destination-details">
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
              <div className="col-md-6 item city features">
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
                      <Link to="destination-details">
                        Hà Giang
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
              <div className="col-xl-3 col-md-6 item recent">
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
                      <Link to="destination-details">
                        HCM City, Vietnam
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
              <div className="col-xl-3 col-md-6 item features rating">
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
                      <Link to="destination-details">Thanh Hóa</Link>
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
      </section>
      {/* Popular Destinations Area end */}

      {/* Newsletter Area start */}
      <Subscribe />
      {/* Newsletter Area end */}
    </div>
  )
}

export default Destination2