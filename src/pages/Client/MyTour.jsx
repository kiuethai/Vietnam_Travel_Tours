import Banner from "~/components/Client/Banner";
import Subscribe from "~/components/Client/Subscribe";
import TourSidebar from "~/components/Client/TourSidebar";
import { Link } from 'react-router-dom'
function MyTour() {
  return (
    <>
      <Banner pageTitle={"Tour đã đặt"} pageName={"Tour đã đặt"} />
      {/* Tour List Area start */}
      <section
        className="tour-list-page py-100 rel z-1"
        style={{
          "padding-top": "50px"
        }}
      >
        <div className="container">
          <div className="row">
            {/* <TourSidebar /> */}
            <div className="col-lg-3 col-md-6 col-sm-10 rmb-75">
              <div className="shop-sidebar mb-30">
                <div
                  className="widget widget-filter"
                  data-aos="fade-up"
                  data-aos-delay={50}
                  data-aos-duration={1500}
                  data-aos-offset={50}
                >
                  <h6 className="widget-title">Tour phổ biến</h6>
                  <div className="price-filter-wrap">
                    <div className="price-slider-range">
                      <input type="text" value={1000000} id="price" readOnly="" />
                      <p className="mb-0 fw-bold">1.000.000 VNĐ</p>
                      <p className="mb-0 fw-bold">10.000.000 VNĐ</p>
                    </div>
                    <div className="price">
                      <span>Giá</span>
                      {/* <input type="text" value={value[0]} id="price" readOnly="" /> */}
                      <p className="mb-0 fw-bold">
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-9">
              <div
                className="destination-item style-three bgc-lighter"
                data-aos="fade-up"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="image">

                  <span className="badge bgc-pink">Đã xác nhận</span>
                  <a href="#" className="heart">
                    <i className="fas fa-heart" />
                  </a>
                  <img
                    src="assets/images/destinations/tour-list1.jpg"
                    alt="Tour List"
                  />
                </div>
                <div className="content">
                  <div className="destination-header">
                    <span className="location">
                      <i className="fal fa-map-marker-alt" />  PHÚ QUỐC
                    </span>
                    <div className="ratting">
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                    </div>
                  </div>
                  <h5>
                    <Link to="tour-details">
                      BIỂN ĐẢO 3N2Đ | PHÚ QUỐC
                    </Link>
                  </h5>
                  <p>
                    PHÚ QUỐC
                  </p>
                  <ul className="blog-meta">
                    <li>
                      <i className="far fa-clock" />  2 ngày 1 đêm
                    </li>
                    <li>
                      <i className="far fa-user" /> 8 khách
                    </li>
                  </ul>
                  <div className="destination-footer">
                    <span className="price">
                      <span>3.290.000đ</span>/người lớn
                    </span>
                    <Link to="tour-details"
                      className="theme-btn style-two style-three"
                    >
                      <span data-hover="Book Now">Đặt ngay</span>
                      <i className="fal fa-arrow-right" />
                    </Link>
                  </div>
                </div>
              </div>

              <ul
                className="pagination pt-15 flex-wrap"
                data-aos="fade-up"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <li className="page-item disabled">
                  <span className="page-link">
                    <i className="far fa-chevron-left" />
                  </span>
                </li>
                <li className="page-item active">
                  <span className="page-link">
                    1<span className="sr-only">(current)</span>
                  </span>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    2
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    3
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    ...
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    <i className="far fa-chevron-right" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* Tour List Area end */}
      {/* Newsletter Area start */}
      <Subscribe />
      {/* Newsletter Area end */}
    </>
  );
};
export default MyTour;
