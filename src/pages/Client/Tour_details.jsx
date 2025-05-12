import RaveloAccordion from "~/components/Client/RaveloAccordion";
import { useParams } from 'react-router-dom';
import { useEffect } from "react"; // Add this if it's not already imported
import { Link } from 'react-router-dom'
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import { getTourByIdAPI } from "~/apis";
import draftToHtml from 'draftjs-to-html';

function Tour_details() {
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const formatDate = d =>
    d ? new Date(d).toLocaleDateString('vi-VN') : "";

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await getTourByIdAPI(id);
        // console.log('🚀 ~ fetchTour ~ response.data:', response.data)
        // console.log('🚀 ~ fetchTour ~ response:', response)
        setTour(response.tour || null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tour details:", error);
        setLoading(false);
      }
    };
    // console.log('🚀 ~ fetchTour ~ response:', tour)
    if (id) {
      fetchTour();
    }
  }, [id]);
  const [active, setActive] = useState("collapse0");
  return (
    <>
      <section className="page-banner-two rel z-1">
        <div className="container-fluid">
          <hr className="mt-0" />
          <div className="container">
            <div className="banner-inner pt-15 pb-25">
              <h2
                className="page-title mb-10"
                data-aos="fade-left"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                {tour?.destination}
              </h2>
              <nav aria-label="breadcrumb">
                <ol
                  className="breadcrumb justify-content-center mb-20"
                  data-aos="fade-right"
                  data-aos-delay={200}
                  data-aos-duration={1500}
                  data-aos-offset={50}
                >
                  <li className="breadcrumb-item">
                    <Link to="/">Trang chủ</Link>
                  </li>
                  <li className="breadcrumb-item active">Chi tiết tour du lịch</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>
      {/* Page Banner End */}
      {/* Tour Gallery start */}
      <div className="tour-gallery">
        <div className="container-fluid">
          <div className="row gap-10 justify-content-center rel">
            <div className="col-lg-4 col-md-6">
              <div className="gallery-item">
                <img
                  style={{ height: "434px" }}
                  src={tour?.images?.[0]}
                  alt={tour?.title || "Tour List"}
                />
              </div>
              <div className="gallery-item">
                <img
                  style={{ height: "445px" }}
                  src={tour?.images?.[1]}
                  alt={tour?.title || "Tour List"}
                />
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="gallery-item">
                <img
                  style={{ height: "434px" }}
                  src={tour?.images?.[2]}
                  alt={tour?.title || "Tour List"}
                />

              </div>
              <div className="gallery-item">
                <img
                  style={{ height: "445px" }}
                  src={tour?.images?.[5]}
                  alt={tour?.title || "Tour List"}
                />
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="gallery-item">
                <img
                  style={{ height: "434px" }}
                  src={tour?.images?.[3]}
                  alt={tour?.title || "Tour List"}
                />
              </div>
              <div className="gallery-item">
                <img
                  style={{ height: "445px" }}
                  src={tour?.images?.[4]}
                  alt={tour?.title || "Tour List"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Tour Gallery End */}
      {/* Tour Header Area start */}
      <section className="tour-header-area pt-70 rel z-1">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-xl-6 col-lg-7">
              <div
                className="tour-header-content mb-15"
                data-aos="fade-left"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <span className="location d-inline-block mb-10">
                  <i className="fal fa-map-marker-alt" /> {tour?.destination}
                </span>
                <div className="section-title pb-5">
                  <h2>
                    {tour?.title}
                  </h2>
                </div>
                <div className="ratting">
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star-half-alt" />
                </div>
              </div>
            </div>
            <div
              className="col-xl-4 col-lg-5 text-lg-end"
              data-aos="fade-right"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="tour-header-social mb-10">
                <a to="#">
                  <i className="far fa-share-alt" />
                  Share tours
                </a>
                <a to="#">
                  <i className="fas fa-heart bgc-secondary" />
                  Wish list
                </a>
              </div>
            </div>
          </div>
          <hr className="mt-50 mb-70" />
        </div>
      </section>
      {/* Tour Header Area end */}
      {/* Tour Details Area start */}
      <section className="tour-details-page pb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="tour-details-content">
                <h3>Tổng quan</h3>
                <p>
                  {tour?.description
                    ? <span dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(tour.description)) }} />
                    : null}
                </p>
                <div className="row pb-55">
                  <div className="col-md-6">
                    <div className="tour-include-exclude mt-30">
                      <h5>Bao gồm và không bao gồm</h5>
                      <ul className="list-style-one check mt-25">
                        <li>
                          <i className="far fa-check" /> Dịch vụ đón và trả khách
                        </li>
                        <li>
                          <i className="far fa-check" /> 1 bữa ăn mỗi ngày
                        </li>
                        <li>
                          <i className="far fa-check" /> Nước đóng chai trên xe
                        </li>
                        <li>
                          <i className="far fa-check" /> Phương tiện di chuyển Xe buýt du lịch hạng sang
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="tour-include-exclude mt-30">
                      <h5>Không bao gồm</h5>
                      <ul className="list-style-one mt-25">
                        <li>
                          <i className="far fa-times" />Tiền boa
                        </li>
                        <li>
                          <i className="far fa-times" /> Đón và trả khách tại khách sạn
                        </li>
                        <li>
                          <i className="far fa-times" /> Bữa trưa, Đồ ăn & Đồ uống
                        </li>
                        <li>
                          <i className="far fa-times" /> Dịch vụ bổ sung
                        </li>
                        <li>
                          <i className="far fa-times" /> Bảo hiểm du lịch
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <h3>Lịch trình</h3>
              <Accordion
                className="accordion-two mt-25 mb-60"
                defaultActiveKey={active}
              >
                {tour?.itinerary && tour.itinerary.length > 0 ? (
                  tour.itinerary.map((item, i) => (
                    <RaveloAccordion
                      key={item.id || i}
                      event={`collapse${i}`}
                      active={active}
                      onClick={(eventKey) => setActive(active === eventKey ? "" : eventKey)}
                      title={item.title}
                      description={item.description}
                    />
                  ))
                ) : (
                  <div>Chưa có lịch trình cho tour này.</div>
                )}
              </Accordion>
              {/* Child cost and cancellation policy */}
              <div className="tour-extra-info mt-25 mb-60">
                <h4>Chi phí trẻ em</h4>
                <ul className="child-cost-list list-unstyled mt-20">
                  <li><strong>Em bé:</strong> Được mua bảo hiểm du lịch, có chỗ ngồi trên xe, ngủ ghép với gia đình, chi phí phát sinh trên tour gia đình tự chi trả.</li>
                  <li><strong>Trẻ em:</strong> Dịch vụ như người lớn, ngủ ghép với gia đình.</li>
                  <li><strong>Trẻ em đủ 11 tuổi trở lên:</strong> Dịch vụ như người lớn.</li>
                  <li><strong>Trường hợp 1 trẻ em đi chung với 1 người lớn hoặc không đủ người lớn trong nhóm để ngủ ghép phòng:</strong> vui lòng nâng dịch vụ trẻ em lên để lấy thêm suất ngủ.</li>
                </ul>
                <h4>Quy định hủy tour</h4>
                <ul className="cancel-policy-list list-unstyled mt-20">
                  <li><strong>Ngay sau khi kí hợp đồng:</strong> 50% giá tour.</li>
                  <li><strong>Từ 45 ngày đến 30 ngày:</strong> 70% giá tour.</li>
                  <li><strong>Từ 29 đến 15 ngày:</strong> 90% giá tour.</li>
                  <li><strong>Trong vòng 14 ngày:</strong> 100% giá tour.</li>
                </ul>
              </div>

              <h3>Khách hàng đánh giá</h3>
              <div className="clients-reviews bgc-black mt-30 mb-60">
                <div className="left">
                  <b>4.9</b>
                  <span>(1 reviews)</span>
                  <div className="ratting">
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                    <i className="fas fa-star-half-alt" />
                  </div>
                </div>
                <div className="right">
                  <div className="ratting-item">
                    <span className="title">Dịch vụ</span>
                    <span className="line">
                      <span style={{ width: "90%" }} />
                    </span>
                    <div className="ratting">
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star-half-alt" />
                    </div>
                  </div>
                </div>
              </div>
              <h3>Nhận xét của khách hàng</h3>
              <div className="comments mt-30 mb-60">
                <div
                  className="comment-body"
                  data-aos="fade-up"
                  data-aos-duration={1500}
                  data-aos-offset={50}
                >
                  <div className="author-thumb">
                    <img
                      src="https://res.cloudinary.com/dbkhjufja/image/upload/v1742119408/samples/logo.png"
                      alt="Author"
                    />
                  </div>
                  <div className="content">
                    <h6>Hoa</h6>
                    <div className="ratting">
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star-half-alt" />
                    </div>
                    <span className="time">
                      Phú Quốc, 3 ngày 2 đêm
                    </span>
                    <p>
                      Dịch vụ tốt, hướng dẫn viên nhiệt tình, vui vẻ. Chúng tôi đã có một chuyến đi tuyệt vời.
                    </p>
                    <a className="read-more" href="#">
                      Reply <i className="far fa-angle-right" />
                    </a>
                  </div>
                </div>

              </div>
              <h3>Thêm đánh giá</h3>
              <form
                id="comment-form"
                className="comment-form bgc-lighter z-1 rel mt-30"
                name="review-form"
                action="#"
                method="post"
                data-aos="fade-up"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="comment-review-wrap">
                  <div className="comment-ratting-item">
                    <span className="title">Đánh giá</span>
                    <div className="ratting">
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star-half-alt" />
                    </div>
                  </div>

                </div>
                <hr className="mt-30 mb-40" />
                <h5>Để lại phả hồi</h5>
                <div className="row gap-20 mt-20">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="message">Nội dung</label>
                      <textarea
                        name="message"
                        id="message"
                        className="form-control"
                        rows={5}
                        required=""
                        defaultValue={""}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group mb-0">
                      <button
                        type="submit"
                        className="theme-btn bgc-secondary style-two"
                      >
                        <span data-hover="Submit reviews">Đánh giá</span>
                        <i className="fal fa-arrow-right" />
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-lg-4 col-md-8 col-sm-10 rmt-75">
              <div className="blog-sidebar tour-sidebar">
                <div
                  className="widget widget-booking"
                  data-aos="fade-up"
                  data-aos-duration={1500}
                  data-aos-offset={50}
                >
                  <h5 className="widget-title">Đặt Tour</h5>
                  <form action="#">
                    <div className="date mb-25" >
                      <b>Ngày đi</b>
                      <input
                        type="text"
                        value={formatDate(tour?.startDate)}
                        disabled
                      />

                    </div>
                    <div className="date mb-25">
                      <b>Ngày về</b>
                      <input
                        type="text"
                        value={formatDate(tour?.endDate)}
                        disabled
                      />
                    </div>
                    <hr />
                    <div className="time py-5">
                      <b>Thời gian :</b>
                      <ul className="radio-filter">
                        {tour?.time}
                      </ul>
                    </div>
                    <hr className="mb-25" />
                    <h6>Vé :</h6>
                    <ul className="tickets clearfix">
                      <li>
                        Người lớn <span className="price">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour?.priceAdult)}
                        </span>
                      </li>
                      <li>
                        Trẻ em  <span className="price">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour?.priceChild)}
                        </span>

                      </li>
                    </ul>
                    <hr className="mb-25" />


                    <Link
                      to={`/booking/${tour?._id}`}
                      className="theme-btn style-two w-100 mt-15 mb-5 d-flex justify-content-center align-items-center"
                    >
                      <span data-hover="Book Now">Đặt ngay</span>
                      <i className="fal fa-arrow-right ml-2" />
                    </Link>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Tour Details Area end */}

    </>
  )
}

export default Tour_details