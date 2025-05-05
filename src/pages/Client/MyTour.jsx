import Banner from "~/components/Client/Banner";
import Subscribe from "~/components/Client/Subscribe";
import TourSidebar from "~/components/Client/TourSidebar";
import { Link } from 'react-router-dom'
import { getTourBookingByUserId } from "~/apis";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'


function MyTour() {
  const currentUser = useSelector(selectCurrentUser);
  const [bookings, setBookings] = useState();
  const [loading, setLoading] = useState(true);
  console.log("currentUser", currentUser?._id);

  useEffect(() => {
    const fetchBookingTour = async () => {
      try {
        const response = await getTourBookingByUserId(currentUser?._id);
        console.log('🚀 ~ fetchTour ~ response.data:', response.data)
        console.log('🚀 ~ fetchTour ~ response:', response)
        setBookings(response.tours || null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tour details:", error);
        setLoading(false);
      }
    };
    if (currentUser?._id) {
      fetchBookingTour();
    }
  }, [currentUser?._id]);

  console.log("getTourBookingByUserId", bookings);

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
                      <p className="mb-0 fw-bold">
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-9">
              {loading ? (
                <div>Đang tải...</div>
              ) : bookings && bookings?.length > 0 ? (
                bookings?.map((booking) => (
                  <div
                    key={booking?._id}
                    className="destination-item style-three bgc-lighter mb-4"
                    data-aos="fade-up"
                    data-aos-duration={1500}
                    data-aos-offset={50}
                  >
                    <div className="image">
                      {/* Hiển thị trạng thái */}
                      {booking?.bookingInfo?.status === "pending" && (
                        <span className="badge">Chưa xác nhận</span>
                      )}
                      {booking?.bookingInfo?.status === "confirmed" && (
                        <span className="badge bgc-primary">Đã xác nhận</span>
                      )}
                      {booking?.bookingInfo?.status === "completed" && (
                        <span className="badge bgc-pink">Tour đã hoàn thành</span>
                      )}

                      <img
                        src={booking?.tourDetails?.images?.[0] || "assets/images/destinations/tour-list1.jpg"}
                        alt="Tour List"
                      />
                    </div>
                    <div className="content">
                      <div className="destination-header">
                        <span className="location">
                          <i className="fal fa-map-marker-alt" /> {booking?.tourDetails?.destination}
                        </span>
                      </div>
                      <h5>
                        <Link to={`/tour-details/${booking?.tourId}`}>
                          {booking?.tourDetails?.title}
                        </Link>
                      </h5>
                      <p>
                        {booking?.tourDetails?.destination || "No description available"}
                      </p>
                      <ul className="blog-meta">
                        <li>
                          <i className="far fa-clock" /> {booking?.tourDetails?.time || "Duration not specified"}
                        </li>
                        <li>
                          <i className="far fa-user" /> {booking?.tourDetails?.quantity || 0} khách
                        </li>
                      </ul>
                      <div className="destination-footer">
                        <span className="price">
                          <span>{booking?.tourDetails?.priceAdult?.toLocaleString('vi-VN')}đ</span>/người lớn
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>Bạn chưa đặt tour nào.</div> 
              )}
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
