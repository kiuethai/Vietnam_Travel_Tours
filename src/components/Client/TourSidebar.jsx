import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Slider from "rc-slider";
import { getDashboardDataAPI, getAllToursAPI } from "~/apis";

const   TourSidebar = ({ value, setValue, selectedRegion, setSelectedRegion }) => {

  const [Domain, setDomain] = useState([]);


  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await getDashboardDataAPI();
        setDomain(response.dataDomain.values || []);

      } catch (error) {
        console.error("Error fetching tours:", error);

      }
    };

    fetchTours();
  }, []);


  return (
    <div className="col-lg-3 col-md-6 col-sm-10 rmb-75">
      <div className="shop-sidebar mb-30">
        <div
          className="widget widget-filter"
          data-aos="fade-up"
          data-aos-delay={50}
          data-aos-duration={1500}
          data-aos-offset={50}
        >
          <h6 className="widget-title">Lọc theo giá</h6>
          <div className="price-filter-wrap">
            <div className="price-slider-range">
              <Slider
                value={value}
                range
                min={1000000}
                max={10000000}
                onChange={(e) => setValue(e)}
                trackStyle={{ backgroundColor: "#63AB45" }}
                handleStyle={{
                  borderColor: "#63AB45",
                  backgroundColor: "#63AB45",
                }}
                railStyle={{ backgroundColor: "rgba(99, 171, 69,0.2)" }}
              />
            </div>
            <div className="price">
              <span>Giá</span>
              {/* <input type="text" value={value[0]} id="price" readOnly="" /> */}
              <p className="mb-0 fw-bold">
                {value[0].toLocaleString()} VNĐ
              </p>

              <p className="mb-0 fw-bold">
                - {value[1].toLocaleString()} VNĐ
              </p>
            </div>
          </div>
        </div>


        <div
          className="widget widget-activity"
          data-aos="fade-up"
          data-aos-duration={1500}
          data-aos-offset={50}
        >
          <h6 className="widget-title">Vùng miền</h6>
          <ul className="radio-filter">
            <li>
              <input
                className="form-check-input"
                type="radio"
                name="ByActivities"
                id="b"
                checked={selectedRegion === "b"}
                onChange={() => setSelectedRegion("b")}
              />
              <label htmlFor="b">
                Miền Bắc <span>{Domain?.[0]}</span>
              </label>
            </li>
            <li>
              <input
                className="form-check-input"
                type="radio"
                name="ByActivities"
                id="t"
                checked={selectedRegion === "t"}
                onChange={() => setSelectedRegion("t")}
              />
              <label htmlFor="t">
                Miền Trung <span>{Domain?.[1]}</span>
              </label>
            </li>
            <li>
              <input
                className="form-check-input"
                type="radio"
                name="ByActivities"
                id="n"
                checked={selectedRegion === "n"}
                onChange={() => setSelectedRegion("n")}
              />
              <label htmlFor="n">
                Miền Nam <span>{Domain?.[2]}</span>
              </label>
            </li>
            <li>
              <input
                className="form-check-input"
                type="radio"
                name="ByActivities"
                id="tatca"
                checked={selectedRegion === ""}
                onChange={() => setSelectedRegion("")}
              />
              <label htmlFor="tatca">
                Tất cả
              </label>
            </li>
          </ul>
        </div>

        <div
          className="widget widget-reviews"
          data-aos="fade-up"
          data-aos-duration={1500}
          data-aos-offset={50}
        >
          <h6 className="widget-title">Đánh giá</h6>
          <ul className="radio-filter">
            <li>
              <input
                className="form-check-input"
                type="radio"
                defaultChecked=""
                name="ByReviews"
                id="review1"
              />
              <label htmlFor="review1">
                <span className="ratting">
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                </span>
              </label>
            </li>
            <li>
              <input
                className="form-check-input"
                type="radio"
                name="ByReviews"
                id="review2"
              />
              <label htmlFor="review2">
                <span className="ratting">
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star-half-alt white" />
                </span>
              </label>
            </li>
            <li>
              <input
                className="form-check-input"
                type="radio"
                name="ByReviews"
                id="review3"
              />
              <label htmlFor="review3">
                <span className="ratting">
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star white" />
                  <i className="fas fa-star-half-alt white" />
                </span>
              </label>
            </li>
            <li>
              <input
                className="form-check-input"
                type="radio"
                name="ByReviews"
                id="review4"
              />
              <label htmlFor="review4">
                <span className="ratting">
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star white" />
                  <i className="fas fa-star white" />
                  <i className="fas fa-star-half-alt white" />
                </span>
              </label>
            </li>
            <li>
              <input
                className="form-check-input"
                type="radio"
                name="ByReviews"
                id="review5"
              />
              <label htmlFor="review5">
                <span className="ratting">
                  <i className="fas fa-star" />
                  <i className="fas fa-star white" />
                  <i className="fas fa-star white" />
                  <i className="fas fa-star white" />
                  <i className="fas fa-star-half-alt white" />
                </span>
              </label>
            </li>
          </ul>
        </div>

      </div>
      <div
        className="widget widget-cta"
        data-aos="fade-up"
        data-aos-duration={1500}
        data-aos-offset={50}
      >

      </div>
    </div>
  );
};
export default TourSidebar;
