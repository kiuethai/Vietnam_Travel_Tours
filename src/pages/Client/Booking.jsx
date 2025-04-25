import React, { useState } from 'react';
import RaveloAccordion from "~/components/Client/RaveloAccordion";
import { useParams } from 'react-router-dom';
import { useEffect } from "react"; // Add this if it's not already imported
import Subscribe from "~/components/Client/Subscribe";
import ReveloLayout from "~/components/Client/layout/ReveloLayout";
import { Link } from 'react-router-dom'
import { Accordion } from "react-bootstrap";
import Banner from "~/components/Client/Banner";
import { getTourByIdAPI } from "~/apis";
import draftToHtml from 'draftjs-to-html';


const transIdMomo = null; // hoặc giá trị thực tế

function Booking() {
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const [errors, setErrors] = useState({});
  const [discount, setDiscount] = useState(0);

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



  // Tính tổng tiền
  const calcTotal = (adults, children, discountValue = discount) => {
    return adults * tour?.priceAdult + children * tour?.priceChild - discountValue;
  };

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Tăng/giảm số lượng
  const handleQuantity = (type, field) => {
    setForm((prev) => {
      let val = prev[field];
      if (type === 'inc') val++;
      if (type === 'dec') val = Math.max(field === 'numAdults' ? 1 : 0, val - 1);
      return {
        ...prev,
        [field]: val,
      };
    });
  };

  

  // Xử lý submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate đơn giản
    let newErrors = {};
    if (!form.fullName) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!form.email) newErrors.email = 'Vui lòng nhập email';
    if (!form.tel) newErrors.tel = 'Vui lòng nhập số điện thoại';
    if (!form.address) newErrors.address = 'Vui lòng nhập địa chỉ';
    if (!form.agree) newErrors.agree = 'Bạn phải đồng ý với điều khoản';
    if (!form.payment) newErrors.payment = 'Vui lòng chọn phương thức thanh toán';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // Gửi dữ liệu booking (gọi API ở đây)
      alert('Đặt tour thành công!');
    }
  };

  // Tính lại tổng tiền khi số lượng hoặc discount thay đổi
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      totalPrice: calcTotal(prev.numAdults, prev.numChildren),
    }));
  }, [form.numAdults, form.numChildren, discount]);
  const [active, setActive] = useState("collapse0");

  return (
    <>
      <Banner pageTitle={"Đặt Tour"} pageName={"Đặt Tour"} />
      <section className="tour-details-page pb-100 pt-50">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <h3>Thông tin liên lạc</h3>
              <form
                id="comment-form"
                className="comment-form bgc-lighter z-1 rel mt-30"
                name="thong-tin-lien-lac  -form"
                action="#"
                method="post"
                data-aos="fade-up"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="row gap-20 mt-20">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="full-name">Họ và tên</label>
                      <input
                        type="text"
                        id="full-name"
                        name="full-name"
                        className="form-control"
                        placeholder="Nhập họ và tên của bạn"
                        defaultValue=""
                        required=""
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="phone">Email</label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        className="form-control"
                        placeholder="Nhập email của bạn"
                        defaultValue=""
                        required=""
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="full-name">Số điện thoại</label>
                      <input
                        type="text"
                        id="full-name"
                        name="full-name"
                        className="form-control"
                        placeholder="Nhập số điện thoại của bạn"
                        defaultValue=""
                        required=""
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="phone">Địa chỉ</label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        className="form-control"
                        placeholder="Nhập địa chỉ của bạn"
                        defaultValue=""
                        required=""
                      />
                    </div>
                  </div>
                </div>
              </form>
              <hr className="mb-25" />

              {/* Passenger Details */}
              <h3>Hành Khách</h3>
              <div className="row mb-3" >
                <div className="col-md-6 d-flex align-items-center mb-2 p-3 bg-light border " style={{
                  width: '40%', marginRight: '90px'
                }}>
                  <label className="ms-5 me-4 mb-0" style={{ minWidth: 100 }}>Người lớn:</label>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => handleQuantity('dec', 'numAdults')}
                    disabled={form.numAdults <= 1}
                    style={{ width: 36, height: 36, fontSize: 20 }}
                  >-</button>
                  <span className="mx-3" style={{ minWidth: 24, display: 'inline-block', textAlign: 'center' }}>{form.numAdults}</span>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => handleQuantity('inc', 'numAdults')}
                    style={{ width: 36, height: 36, fontSize: 20 }}
                  >+</button>
                </div>
                <div className="col-md-6 d-flex align-items-center mb-2 p-3 bg-light border"
                  style={{
                    width: '40%'
                  }}
                >
                  <label className=" ms-5 me-3 mb-0" style={{ minWidth: 100 }}>Trẻ em:</label>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => handleQuantity('dec', 'numChildren')}
                    disabled={form.numChildren <= 0}
                    style={{ width: 36, height: 36, fontSize: 20 }}
                  >-</button>
                  <span className="mx-3" style={{ minWidth: 24, display: 'inline-block', textAlign: 'center' }}>{form.numChildren}</span>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => handleQuantity('inc', 'numChildren')}
                    style={{ width: 36, height: 36, fontSize: 20 }}
                  >+</button>
                </div>
              </div>
              {/*  Privacy Agreement Section */}
              <div className="privacy-section">
                <p>Bằng cách nhấp chuột vào nút "ĐỒNG Ý" dưới đây, Khách hàng đồng ý rằng các điều kiện điều khoản
                  này sẽ được áp dụng. Vui lòng đọc kỹ điều kiện điều khoản trước khi lựa chọn sử dụng dịch vụ của
                  Travela.</p>
                <div className="privacy-checkbox">
                  <input type="checkbox" id="agree" name="agree" required />
                  <label for="agree">Tôi đã đọc và đồng ý với <a href="#" target="_blank">Điều khoản thanh oán</a></label>
                </div>
              </div>

              {/* <!-- Payment Method --> */}
              <h2 className="booking-header">Phương Thức Thanh Toán</h2>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="office-payment"
                  checked={form.payment === "office-payment"}
                  onChange={handleChange}
                  required
                />
                <img src="/assets/images/contact/icon.png" alt="Office Payment" />
                Thanh toán tại văn phòng
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="paypal-payment"
                  checked={form.payment === "paypal-payment"}
                  onChange={handleChange}
                  required
                />
                <img src="/assets/images/booking/cong-thanh-toan-paypal.jpg" alt="PayPal" />
                Thanh toán bằng PayPal
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="momo-payment"
                  checked={form.payment === "momo-payment"}
                  onChange={handleChange}
                  required
                />
                <img src="/assets/images/booking/thanh-toan-momo.jpg" alt="MoMo" />
                Thanh toán bằng Momo
                {transIdMomo && (
                  <input type="hidden" name="transactionIdMomo" value={transIdMomo} />
                )}
              </label>
              <input type="hidden" name="payment_hidden" id="payment_hidden" />
            </div>

            {/* Order Summary  */}
            <div className="col-lg-4 col-md-8 col-sm-10 rmt-75">
              <div className="blog-sidebar tour-sidebar">
                <div
                  className="widget widget-booking"
                  data-aos="fade-up"
                  data-aos-duration={1500}
                  data-aos-offset={50}
                >
                  <p>Mã tour: {tour?._id}</p>
                  <h5 className="widget-title">{tour?.title}</h5>
                  <form action="#">
                    <div className="date mb-25" >
                      <b>Ngày đi</b>
                      <input
                        type="date"
                        value={
                          tour?.startDate
                            ? new Date(tour.startDate).toISOString().split("T")[0]
                            : ""
                        }
                        disabled
                      />

                    </div>
                    <div className="date mb-25">
                      <b>Ngày về</b>
                      <input
                        type="date"
                        value={
                          tour?.endDate
                            ? new Date(tour?.endDate).toISOString().split("T")[0]
                            : ""
                        }
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
                         1 x {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour?.priceAdult)}
                        </span>
                      </li>
                      <li>
                        Trẻ em  <span className="price">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour?.priceChild)}
                        </span>

                      </li>
                    </ul>
                    <hr className="mb-25" />

                    <h6>
                      Tổng: <span className="price">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((tour?.priceAdult) + (tour?.priceChild))}
                      </span>
                    </h6>
                    <button
                      type="submit"
                      className="theme-btn style-two w-100 mt-15 mb-5"
                    >
                      <Link
                        to={`/booking/${tour?._id}`}
                      >
                      <span data-hover="Book Now">Đặt ngay</span>
                      <i className="fal fa-arrow-right" />
                      </Link>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >
    </>

  )
}

export default Booking;