import Banner from "~/components/Client/Banner";
import Subscribe from "~/components/Client/Subscribe";
import TourSidebar from "~/components/Client/TourSidebar";
import { Link } from 'react-router-dom'
import { getTourBookingByUserId, updateBookingApi, getRecommends } from "~/apis";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

function MyTour() {
  const currentUser = useSelector(selectCurrentUser);
  
  const [bookings, setBookings] = useState();
  const [loading, setLoading] = useState(true);
  const [recommendedTours, setRecommendedTours] = useState([]);
  // Add missing state variable
  const [recommendationSource, setRecommendationSource] = useState('');

  useEffect(() => {
    const fetchBookingTour = async () => {
      try {
        const response = await getTourBookingByUserId(currentUser?.user?.id);
        setBookings(response.tours || null);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    
    };

    if (currentUser?.user?.id) {
      fetchBookingTour();
    }
  }, [currentUser?.user?.id]);
  // console.log('🚀 ~ MyTour ~ currentUser:', currentUser)
  // Fixed effect to fetch recommended tours
  useEffect(() => {
    const fetchRecommendedTours = async () => {
      try {
        const viewedTours = JSON.parse(localStorage.getItem('viewedTours') || '[]');
        const lastViewedTour = viewedTours[0];

        // Only attempt personalized recommendations if we have history
        if (lastViewedTour) {
          try {
            const tours = await getRecommends({ clickedTourId: lastViewedTour });
            setRecommendedTours(tours);
            setRecommendationSource('history');
            // console.log('Recommended tours based on last viewed:', tours);
            return;
          } catch (error) {
            console.error('Error fetching personalized recommendations:', error);
          
          }
        }

        // Default recommendations (shared code path)
        const tours = await getRecommends();
        setRecommendedTours(tours);
        setRecommendationSource('default');
      } catch (error) {
        console.error('Error fetching any recommendations:', error);
      }
    };

    fetchRecommendedTours();
  }, []);

  useEffect(() => {
    if (!bookings) return;
    const now = new Date();
    bookings.forEach((booking) => {
      const endDate = new Date(booking?.tourDetails?.endDate);
      if (
        booking?.bookingInfo?.status !== "completed" &&
        endDate &&
        now > endDate
      ) {
        updateBookingApi(booking?.bookingInfo?.bookingId, { status: "completed" });
        window.location.reload();
        return
      }
    });
  }, [bookings]);

  return (
    <>
      <Banner pageTitle={"Tour đã đặt"} pageName={"Tour đã đặt"} />
      <section className="tour-list-page py-100 rel z-1" style={{ "paddingTop": "50px" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-10 rmb-75">
              <div className="shop-sidebar mb-30">
                <div
                  className="widget widget-filter"
                  data-aos="fade-up"
                  data-aos-delay={50}
                  data-aos-duration={1500}
                  data-aos-offset={50}
                >
                  {recommendedTours.length > 0 && (
                    <>
                      <h5 className="section-title mb-4 pb-2 border-bottom">
                        <i className="fas fa-map-marked-alt me-2"></i>Tour Gợi Ý
                      </h5>
                      <div className="recommended-tours">
                        {recommendedTours.map(t => (
                          <div key={t._id} className="mb-4">
                            <Link
                              to={`/tour-details/${t._id}`}
                              className="recommend-card d-block text-decoration-none"
                              onClick={() => {
                                window.scrollTo({
                                  top: 0,
                                  behavior: 'smooth'
                                });
                              }}
                            >
                              <div className="recommend-item p-3 rounded hover-shadow border border-light position-relative">
                                <div className="recommend-img mb-3 position-relative">
                                  <img
                                    src={t.images?.[0] || '/placeholder-image.jpg'}
                                    alt={t.title}
                                    className="rounded-3 shadow-sm w-100"
                                    style={{ height: 150, objectFit: 'cover' }}
                                    onError={(e) => {
                                      e.target.src = '/placeholder-image.jpg'; // Fallback image
                                    }}
                                  />
                                  {/* Price badge with error handling */}
                                  {t.priceAdult && (
                                    <div className="tour-price-badge position-absolute top-0 end-0 m-2 px-2 py-1 bg-primary text-white rounded shadow-sm">
                                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(t.priceAdult)}
                                    </div>
                                  )}
                                </div>
                                <div className="recommend-content">
                                  <h6 className="tour-title text-dark mb-2 fw-bold">
                                    {t.title}
                                  </h6>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div className="tour-rating">
                                      {Array.from({ length: 5 }).map((_, idx) => (
                                        <i
                                          key={idx}
                                          className={`${idx < (t.rating || 4) ? "fas" : "far"} fa-star text-warning`}
                                          style={{ fontSize: '14px' }}
                                        />
                                      ))}
                                      <span className="ms-1 text-muted small">
                                        ({t.reviewCount || 5})
                                      </span>
                                    </div>
                                    <div className="tour-duration small text-muted">
                                      <i className="far fa-clock me-1"></i>
                                      {t.time || '3 ngày'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-9">
              {loading ? (
                <div>Đang tải...</div>
              ) : bookings && bookings?.length > 0 ? (
                bookings
                  .slice()
                  .sort((a, b) => {
                    const order = { confirmed: 0, pending: 1, completed: 2 };
                    const statusA = a?.bookingInfo?.status || "";
                    const statusB = b?.bookingInfo?.status || "";
                    return (order[statusA] ?? 99) - (order[statusB] ?? 99);
                  })
                  .map((booking) => (
                    <div
                      key={booking?._id}
                      className="destination-item style-three bgc-lighter mb-4"
                      data-aos="fade-up"
                      data-aos-duration={1500}
                      data-aos-offset={50}
                    >
                      <div className="image">
                        {booking?.bookingInfo?.status === "pending" && (
                          <span className="badge">Đợi xác nhận</span>
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
                          <Link to={`/booking/${booking?.tourDetails?._id}`}>
                            {booking?.tourDetails?.title}
                          </Link>
                        </h5>
                        <p>
                          {booking?.tourDetails?.destination || "Không có mô tả nào"}
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
      <Subscribe />
    </>
  );
}
export default MyTour;
