import React from 'react'
import { Link } from 'react-router-dom'
function NotFound() {
  return (
    <> 
    <section className="error-area pt-70 pb-100 rel z-1">
      <div className="container">
        <div className="row align-items-center justify-content-between">
          <div className="col-xl-5 col-lg-6">
            <div
              className="error-content rmb-55"
              data-aos="fade-left"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <h1>404! </h1>
              <div className="section-title mt-15 mb-25">
                <h2>Trang này có thể được tìm thấy
                </h2>
              </div>
              <p>
              Các tính năng tốt nhất để bao gồm trên trang đích kinh doanh là những tính năng nhanh chóng truyền đạt đề xuất giá trị của bạn, xây dựng niềm tin và khuyến khích hành động. Đây là sáu tính năng thiết yếu
              </p>
              
              <div className="keywords">
                <Link to="/tour">Hà giang</Link>
                <Link to="/tour">Hà nội</Link>
                <Link to="/tour">Phú quốc</Link>
                <Link to="/tour">Đà Nẵng</Link>
                <Link to="/tour">Du lịch theo tour</Link>
              </div>
            </div>
          </div>
          <div className="col-xl-5 col-lg-6">
            <div
              className="error-images"
              data-aos="fade-right"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <img src="assets/images/newsletter/404.png" alt="404 Error" />
            </div>
          </div>
        </div>
      </div>
    </section>

  </>
  )
}

export default NotFound