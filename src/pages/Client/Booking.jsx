import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from "react";
import { Link } from 'react-router-dom'
import Banner from "~/components/Client/Banner";
import { getTourByIdAPI, addBookingTourApi, getDataPaypal, getTourBookingByUserId, addMomoPayment } from "~/apis";
import draftToHtml from 'draftjs-to-html';
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const transIdMomo = null; // hoặc giá trị thực tế

function Booking() {
  const currentUser = useSelector(selectCurrentUser)
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const EXCHANGE_RATE = 25000;
  const [errors, setErrors] = useState({});
  const [paypalReady, setPaypalReady] = useState(false);
  const [paypalClientId, setPaypalClientId] = useState("");
  const [userBooking, setUserBooking] = useState(null);
  const formatDate = d =>
    d ? new Date(d).toLocaleDateString('vi-VN') : "";
  // Thêm state form tại đây với các giá trị mặc định
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    tel: '',
    address: '',
    numAdults: 1,
    numChildren: 0,
    agree: false,
    payment: '',
    totalPrice: 0
  });

  const paypalAmountUSD = useMemo(() => {
    if (!tour) return 0;
    const vnd = (tour.priceAdult || 0) * (form.numAdults || 0) + (tour.priceChild || 0) * (form.numChildren || 0);
    return (vnd / EXCHANGE_RATE).toFixed(2); // làm tròn 2 số thập phân
  }, [tour, form.numAdults, form.numChildren]);

  const paypalAmount = useMemo(() => {
    if (!tour) return 0;
    return (tour.priceAdult || 0) * (form.numAdults || 0) + (tour.priceChild || 0) * (form.numChildren || 0);

  }, [tour, form.numAdults, form.numChildren]);

  // Hàm xử lý thanh toán PayPal
  const handlePaypalApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      const bookingSuccess = await handleSubmit();
      if (bookingSuccess !== false) {
        toast.success("Thanh toán thành công bởi " + details.payer.name.given_name);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xác nhận thanh toán PayPal");
    }
  };

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await getTourByIdAPI(id);
        setTour(response.tour || null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tour details:", error);
        setLoading(false);
      }
    };
    if (id) {
      fetchTour();
    }
  }, [id]);

  useEffect(() => {
    const fetchUserBooking = async () => {
      if (!currentUser?._id || !id) return;
      try {
        const res = await getTourBookingByUserId(currentUser._id);
        const found = res.tours?.find(
          t => t.tourDetails && t.tourDetails._id === id
        );
        if (found && found.bookingInfo) setUserBooking(found.bookingInfo);
        else setUserBooking(null);
      } catch (e) {
        setUserBooking(null);
      }
    };
    fetchUserBooking();
  }, [currentUser, id]);

  // Tính tổng tiền
  const calcTotal = (adults, children) => {
    return adults * tour?.priceAdult + children * tour?.priceChild;
  };

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Tối ưu hàm tăng/giảm số lượng
  const handleQuantity = (type, field) => {
    const MIN_VALUES = {
      numAdults: 1,
      numChildren: 0
    };
    setForm(prev => ({
      ...prev,
      [field]: type === 'inc'
        ? prev[field] + 1
        : Math.max(MIN_VALUES[field] || 0, prev[field] - 1)
    }));
  };

  // Xử lý submit
  // ...existing code...
  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    let newErrors = {};
    if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email không hợp lệ. Định dạng @gmail.com';
    if (!/^\d{10}$/.test(form.tel)) newErrors.tel = 'Số điện thoại phải có 10 chữ số';
    if (!form.fullName) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!form.email) newErrors.email = 'Vui lòng nhập email';
    if (!form.tel) newErrors.tel = 'Vui lòng nhập số điện thoại';
    if (!form.address) newErrors.address = 'Vui lòng nhập địa chỉ';
    if (!form.agree) newErrors.agree = 'Bạn phải đồng ý với điều khoản';
    if (!form.payment) newErrors.payment = 'Vui lòng chọn phương thức thanh toán';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const bookingData = {
        address: form.address,
        email: form.email,
        fullName: form.fullName,
        numAdults: form.numAdults,
        numChildren: form.numChildren,
        payment_hidden: form.payment,
        tel: form.tel,
        totalPrice: calcTotal(form.numAdults, form.numChildren),
        tourId: id,
        userId: currentUser?._id,
      };
      try {
        if (form.payment === "momo-payment") {
          // Gọi API tạo thanh toán momo
          const momoPayload = {
            amount: bookingData.totalPrice,
            orderInfo: `Thanh toán mã tour ${tour?._id}`,
            redirectUrl: `http://localhost:5173/booking/${tour?._id}`,
          };
          const momoRes = await addMomoPayment(momoPayload);
          if (momoRes && momoRes.resultCode === 0 && momoRes.payUrl) {
            // Đã tạo thanh toán thành công, lưu booking vào hệ thống
            await addBookingTourApi(bookingData);
            window.location.href = momoRes.payUrl;
            return;
          } else {
            toast.error('Không lấy được link thanh toán Momo!');
            return false;
          }
        } else {
          await addBookingTourApi(bookingData);
          toast.success('Đặt tour thành công!');
          setForm({
            fullName: '',
            email: '',
            tel: '',
            address: '',
            numAdults: 1,
            numChildren: 0,
            agree: false,
            payment: '',
            totalPrice: 0
          });
          setErrors({});
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi đặt tour!');
        return false
      }
    }
    return false
  };
  // ...existing code...

  useEffect(() => {
    const fetchPaypalClientId = async () => {
      const { data_paypal } = await getDataPaypal();
      setPaypalClientId(data_paypal);
      setPaypalReady(true);
    };
    fetchPaypalClientId();
  }, []);

  const paypalOptions = useMemo(() => ({
    "client-id": paypalClientId || "sb",
    currency: "USD",
  }), [paypalClientId]);

  return (
    <>
      <Banner pageTitle={"Đặt Tour"} pageName={"Booking"} />
      <section className="tour-details-page pb-100 pt-50">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {userBooking ? (
                <div className="alert alert-info">
                  <h4>Thông tin đặt tour của bạn</h4>
                  <p><b>Họ tên:</b> {userBooking.fullName}</p>
                  <p><b>Email:</b> {userBooking.email}</p>
                  <p><b>Số điện thoại:</b> {userBooking.phoneNumber}</p>
                  <p><b>Địa chỉ:</b> {userBooking.address}</p>
                  <p><b>Người lớn:</b> {userBooking.adults}</p>
                  <p><b>Trẻ em:</b> {userBooking.children}</p>
                  <p><b>Phương thức thanh toán:</b></p>
                  <div className="payment-method-view">
                    {userBooking.paymentMethod === "office-payment" && (
                      <label className="payment-option">
                        <input
                          type="radio"
                          name="payment"
                          value="office-payment"
                          checked
                          readOnly
                          disabled
                        />
                        <img src="/assets/images/contact/icon.png" alt="Office Payment" />
                        Thanh toán tại văn phòng
                      </label>
                    )}
                    {userBooking.paymentMethod === "paypal-payment" && (
                      <label className="payment-option">
                        <input
                          type="radio"
                          name="payment"
                          value="paypal-payment"
                          checked
                          readOnly
                          disabled
                        />
                        <img src="/assets/images/booking/cong-thanh-toan-paypal.jpg" alt="PayPal" />
                        Thanh toán bằng PayPal
                      </label>
                    )}
                    {userBooking.paymentMethod === "momo-payment" && (
                      <label className="payment-option">
                        <input
                          type="radio"
                          name="payment"
                          value="momo-payment"
                          checked
                          readOnly
                          disabled
                        />
                        <img src="/assets/images/booking/thanh-toan-momo.jpg" alt="MoMo" />
                        Thanh toán bằng Momo
                      </label>
                    )}
                  </div>

                </div>
              ) : (
                <>
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
                            name="fullName"
                            className="form-control"
                            placeholder="Nhập họ và tên của bạn"
                            value={form.fullName}
                            onChange={handleChange}
                            required
                          />
                          {errors.fullName && <span className="text-danger">{errors.fullName}</span>}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="email">Email</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Nhập email của bạn"
                            value={form.email}
                            onChange={handleChange}
                            required
                          />
                          {errors.email && <span className="text-danger">{errors.email}</span>}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="tel">Số điện thoại</label>
                          <input
                            type="tel"
                            id="tel"
                            name="tel"
                            className="form-control"
                            placeholder="Nhập số điện thoại"
                            value={form.tel}
                            onChange={handleChange}
                            required
                          />
                          {errors.tel && <span className="text-danger">{errors.tel}</span>}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="address">Địa chỉ</label>
                          <input
                            type="address"
                            id="address"
                            name="address"
                            className="form-control"
                            placeholder="Nhập địa chỉ của bạn"
                            value={form.address}
                            onChange={handleChange}
                            required
                          />
                          {errors.address && <span className="text-danger">{errors.address}</span>}
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
                      <input
                        type="checkbox"
                        id="agree"
                        name="agree"
                        checked={form.agree}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="agree">Tôi đã đọc và đồng ý với
                        <a href="#" target="_blank"> Điều khoản thanh toán</a>
                      </label>

                    </div>
                    {errors.agree && <span className="text-danger">{errors.agree}</span>}
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
                  {errors.payment && <span className="text-danger">{errors.payment}</span>}
                </>
              )}
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
                          {form.numAdults} x {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour?.priceAdult)}
                        </span>
                      </li>
                      <li>
                        Trẻ em  <span className="price">
                          {form.numChildren} x {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour?.priceChild)}
                        </span>

                      </li>
                    </ul>
                    <hr className="mb-25" />

                    <h6>
                      Tổng: <span className="price">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(paypalAmount)}
                      </span>
                    </h6>
                    {userBooking ? (
                      <button className="theme-btn style-two w-100 mt-15 mb-5 btn-danger">
                        <span>Hủy tour</span>
                      </button>
                    ) : (
                      form.payment === "paypal-payment" && paypalReady ? (
                        <PayPalScriptProvider options={{ ...paypalOptions, currency: "USD" }}>
                          <PayPalButtons
                            style={{ layout: "vertical" }}
                            forceReRender={[paypalAmountUSD]}
                            createOrder={(data, actions) => actions.order.create({
                              purchase_units: [{ amount: { value: paypalAmountUSD.toString() } }]
                            })}
                            onApprove={handlePaypalApprove}
                          />
                        </PayPalScriptProvider>
                      ) : (
                        <button
                          type="submit"
                          className="theme-btn style-two w-100 mt-15 mb-5"
                          onClick={handleSubmit}
                        >
                          <span data-hover="Book Now">Đặt ngay</span>
                          <i className="fal fa-arrow-right" />
                        </button>
                      )
                    )}
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