import React, { useState } from 'react'
import Banner from "~/components/Client/Banner";
import { contactAdminAPI } from "~/apis";

function Contact() {
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await contactAdminAPI(form);
      setStatus("Gửi thành công!");
      setForm({ fullName: "", phoneNumber: "", email: "", message: "" });
    } catch (err) {
      setStatus("Gửi thất bại, vui lòng thử lại.");
    }
  };

  return (
    <div>
      <Banner pageTitle={"Liên hệ với chúng tôi"} />
      {/* Contact Info Area start */}
      <section className="contact-info-area pt-100 rel z-1">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-4">
              <div
                className="contact-info-content mb-30 rmb-55"
                data-aos="fade-up"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="section-title mb-30">
                  <h2>Hãy nói chuyện với các hướng dẫn viên du lịch chuyên nghiệp của chúng tôi</h2>
                </div>
                <p>
                  Đội ngũ hỗ trợ tận tâm của chúng tôi luôn sẵn sàng hỗ trợ bạn giải đáp mọi thắc mắc hoặc vấn đề,
                  cung cấp các giải pháp nhanh chóng và được cá nhân hóa để đáp ứng nhu cầu của bạn.
                </p>
                <div className="features-team-box mt-40">
                  <h6>85+ Thành viên nhóm chuyên gia</h6>
                  <div className="feature-authors">
                    <img
                      src="assets/images/features/feature-author1.jpg"
                      alt="Author"
                    />
                    <img
                      src="assets/images/features/feature-author1.jpg"
                      alt="Author"
                    />
                    <img
                      src="assets/images/features/feature-author1.jpg"
                      alt="Author"
                    />
                    <img
                      src="assets/images/features/feature-author1.jpg"
                      alt="Author"
                    />
                    <img
                      src="assets/images/features/feature-author1.jpg"
                      alt="Author"
                    />
                    <img
                      src="assets/images/features/feature-author1.jpg"
                      alt="Author"
                    />
                    <span>+</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="row">
                <div className="col-md-6">
                  <div
                    className="contact-info-item"
                    data-aos="fade-up"
                    data-aos-duration={1500}
                    data-aos-offset={50}
                    data-aos-delay={50}
                  >
                    <div className="icon">
                      <i className="fas fa-envelope" />
                    </div>
                    <div className="content">
                      <h5>Cần trợ giúp và hỗ trợ</h5>
                      <div className="text">
                        <i className="far fa-envelope" />{" "}
                        <a href="mailto:kiuethai093@gmail.com">neverforget989@gmail.com</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    className="contact-info-item"
                    data-aos="fade-up"
                    data-aos-duration={1500}
                    data-aos-offset={50}
                    data-aos-delay={100}
                  >
                    <div className="icon">
                      <i className="fas fa-phone" />
                    </div>
                    <div className="content">
                      <h5>Cần bất kỳ việc khẩn cấp nào</h5>
                      <div className="text">
                        <i className="far fa-phone" />{" "}
                        <a href="callto:+123456789">+123456789</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    className="contact-info-item"
                    data-aos="fade-up"
                    data-aos-duration={1500}
                    data-aos-offset={50}
                    data-aos-delay={50}
                  >
                    <div className="icon">
                      <i className="fas fa-map-marker-alt" />
                    </div>
                    <div className="content">
                      <h5>Thanh hóa</h5>
                      <div className="text">
                        <i className="fal fa-map-marker-alt" />Hậu Lộc, Thanh Hóa   Việt Nam
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    className="contact-info-item"
                    data-aos="fade-up"
                    data-aos-duration={1500}
                    data-aos-offset={50}
                    data-aos-delay={100}
                  >
                    <div className="icon">
                      <i className="fas fa-map-marker-alt" />
                    </div>
                    <div className="content">
                      <h5>250 Kim Giang</h5>
                      <div className="text">
                        <i className="fal fa-map-marker-alt" /> Hoàng Mai, Hà Nội
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Contact Info Area end */}

      {/* Contact Form Area start */}
      <section className="contact-form-area py-70 rel z-1">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="comment-form bgc-lighter z-1 rel mb-30 rmb-55">
                <form
                  id="contactForm"
                  className="contactForm"
                  name="contactForm"
                  onSubmit={handleSubmit}
                  data-aos="fade-left"
                  data-aos-duration={1500}
                  data-aos-offset={50}
                >
                  <div className="section-title">
                    <h2>Liên hệ</h2>
                  </div>
                  <p>
                    Địa chỉ email của bạn sẽ không được công bố. Các trường bắt buộc được đánh dấu
                  </p>
                  <div className="row mt-35">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="fullName">Họ và tên</label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          className="form-control"
                          placeholder="Nhập tên của bạn"
                          value={form.fullName}
                          onChange={handleChange}
                          required
                          data-error="Please enter your Name"
                        />
                        <div className="help-block with-errors" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="phoneNumber">Số điện thoại</label>
                        <input
                          type="text"
                          id="phoneNumber"
                          name="phoneNumber"
                          className="form-control"
                          placeholder="Nhập số điện thoại của bạn"
                          value={form.phoneNumber}
                          onChange={handleChange}
                          required
                          data-error="Số điện thoại"
                        />
                        <div className="help-block with-errors" />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="email">Địa chỉ Email </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-control"
                          placeholder="Nhập địa chỉ email của bạn"
                          value={form.email}
                          onChange={handleChange}
                          required
                          data-error="Please enter your Email"
                        />
                        <div className="help-block with-errors" />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="message">Nội dung</label>
                        <textarea
                          name="message"
                          id="message"
                          className="form-control"
                          rows={5}
                          placeholder="Nội dung"
                          value={form.message}
                          onChange={handleChange}
                          required
                          data-error="Please enter your Message"
                        />
                        <div className="help-block with-errors" />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group mb-0">
                        <button type="submit" className="theme-btn style-two">
                          <span data-hover="Send Comments">Gửi</span>
                          <i className="fal fa-arrow-right" />
                        </button>
                        {status && <div style={{ marginTop: 10 }}>{status}</div>}
                        <div id="msgSubmit" className="hidden" />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-5">
              <div
                className="contact-images-part"
                data-aos="fade-right"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="row">
                  <div className="col-12">
                    <img
                      src="assets/images/contact/contact1.jpg"
                      alt="Contact"
                    />
                  </div>
                  <div className="col-6">
                    <img
                      src="assets/images/contact/contact2.jpg"
                      alt="Contact"
                    />
                  </div>
                  <div className="col-6">
                    <img
                      src="assets/images/contact/contact3.jpg"
                      alt="Contact"
                    />
                  </div>
                </div>
                <div className="circle-logo">
                  <img src="assets/images/contact/icon.png" alt="Logo" />
                  <span className="title h2">KTTravel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Contact Form Area end */}
      {/* Contact Map Start */}
      <div className="contact-map">
        <iframe
          src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJF9jgvxKsNTERsnYz-SsVpzM&key=AIzaSyAJkfQLDQsEDYV99GHOlmVJwvWrImCGx0c"
          style={{ border: 0, width: "100%" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      {/* Contact Map End */}
    </div>
  )
}

export default Contact