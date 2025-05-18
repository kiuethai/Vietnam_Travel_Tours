import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import dayjs from 'dayjs'
import Banner from "~/components/Client/Banner"
import Subscribe from "~/components/Client/Subscribe"
import TourSidebar from "~/components/Client/TourSidebar"
import { Link } from 'react-router-dom'
import { getAllToursAPI } from '~/apis'

function Tour_list() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([1000000, 10000000]);
  const [isPriceFilter, setIsPriceFilter] = useState(false);
  const [sortType, setSortType] = useState("default");
  const [selectedRegion, setSelectedRegion] = useState(""); // "" là tất cả
  const [selectedRating, setSelectedRating] = useState(null)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const qDestination = params.get('destination')
  const qStart = params.get('startDate')
  const qEnd = params.get('endDate')

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await getAllToursAPI();
        setTours(response || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tours:", error);
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const filteredTours = tours.filter(t => {
    // 1. filter theo destination substring
    if (qDestination && !t.title?.toLowerCase().includes(qDestination.toLowerCase())) {
      return false
    }

    // 2. filter theo range ngày metadata
    if (qStart) {
      const tourStart = dayjs(t.startDate)
      const queryStart = dayjs(qStart)
      if (tourStart.isBefore(queryStart, 'day')) {
        return false
      }
    }
    if (qEnd) {
      const tourEnd = dayjs(t.endDate)
      const queryEnd = dayjs(qEnd)
      if (tourEnd.isAfter(queryEnd, 'day')) {
        return false
      }
    }

    // 3. các filter price / region / rating…
    const p = t.priceAdult || 0
    if (p < priceRange[0] || p > priceRange[1]) return false
    if (selectedRegion && t.domain !== selectedRegion) return false
    if (selectedRating != null && Math.round(t.averageRating || 0) < selectedRating) return false

    return true
  })


  const sortedTour = [...filteredTours].sort((a, b) => {
    if (sortType === "hight-to-low") {
      return b.priceAdult - a.priceAdult;
    }
    if (sortType === "low-to-high") {
      return a.priceAdult - b.priceAdult;
    }
    return 0;
  })
  // Khi slider thay đổi, bật lọc giá
  const handlePriceChange = (range) => {
    setPriceRange(range);
    setIsPriceFilter(true);
  };

  // ==== Thêm trước return ====
  const totalPages = Math.ceil(sortedTour.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTours = sortedTour.slice(indexOfFirst, indexOfLast);
  // ==== Kết thúc thêm ====

  return (
    <div><Banner pageTitle={"Danh sách tour du lịch"} pageName={"Tour List"} search />
      {/* Tour List Area start */}
      <section className="tour-list-page py-100 rel z-1">
        <div className="container">
          <div className="row">
            <TourSidebar
              value={priceRange}
              setValue={setPriceRange}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
            />
            <div className="col-lg-9">
              <div className="shop-shorter rel z-3 mb-20">
                <ul className="grid-list mb-15 me-2">
                  <li>
                    <a href="#">
                      <i className="fal fa-border-all" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="far fa-list" />
                    </a>
                  </li>
                </ul>
                <div className="sort-text mb-15 me-4 me-xl-auto">
                  {filteredTours.length} chuyến tham quan
                </div>
                <div className="sort-text mb-15 me-4">Sắp xếp theo giá tiền:</div>
                <select
                  value={sortType}
                  onChange={e => setSortType(e.target.value)}
                >
                  <option value="default" selected="">
                    Sắp xếp theo
                  </option>
                  <option value="hight-to-low">Cao đến thấp</option>
                  <option value="low-to-high">Thấp đến cao</option>
                </select>
              </div>

              <div className="tour-grid-wrap">
                <div className="row">
                  {loading ? (
                    <div className="text-center">Loading tours...</div>
                  ) : (
                    currentTours.map((tour, index) => (
                      <div className="col-xl-4 col-md-6" key={tour?._id || index}>
                        <div
                          key={tour?._id || index}
                          className="destination-item tour-grid style-three bgc-lighter"
                          data-aos="fade-up"
                          data-aos-duration={1500}
                          data-aos-offset={50}

                        >
                          <div className="image">
                            {tour?.availability
                              ?
                              <span className="badge bgc-primary">Có sẵn</span>
                              :
                              <span className="badge bgc-red">Đã hoàn thành</span>
                            }
                            <a href="#" className="heart">
                              <i className="fas fa-heart" />
                            </a>
                            <img
                              src={tour?.images?.[0] || "assets/images/destinations/tour-list1.jpg"}
                              alt={tour?.title || "Tour List"}
                              style={{ height: " 177px" }}
                            />
                          </div>
                          <div className="content">
                            <div className="destination-header">
                              <span className="location">
                                <i className="fal fa-map-marker-alt" /> {tour?.destination || "Location not specified"}
                              </span>
                              {tour?.averageRating > 0 && (
                                <div className="ratting">
                                  {Array.from({ length: 5 }).map((_, idx) => (
                                    <i
                                      key={idx}
                                      className={
                                        idx < Math.round(tour?.averageRating)
                                          ? "fas fa-star"
                                          : "far fa-star"
                                      }
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                            <h5>
                              <Link to={`/tour-details/${tour?._id}`}>
                                {tour?.title || "Tour Title"}
                              </Link>
                            </h5>
                            <p>
                              {tour?.destination || "No description available"}
                            </p>
                            <ul className="blog-meta">
                              <li>
                                <i className="far fa-clock" /> {tour?.time || "Duration not specified"}
                              </li>
                              <li>
                                <i className="far fa-user" /> {tour?.quantity || 0} khách
                              </li>
                            </ul>
                            <div className="destination-footer">
                              <span className="price">
                                <span>{tour.priceAdult?.toLocaleString('vi-VN')}đ</span>/người lớn
                              </span>
                              <Link
                                to={`/tour-details/${tour?._id}`}
                                className="theme-btn style-two style-three"
                              >
                                <span data-hover="Đặt Ngay"></span>
                                <i className="fal fa-arrow-right" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                    )
                  )
                  }
                </div>
              </div>
              {/* ==== Thay block pagination cũ bằng block sau ==== */}
              <ul
                className="pagination pt-15 flex-wrap"
                data-aos="fade-up"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  >
                    <i className="far fa-chevron-left" />
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <li
                    key={number}
                    className={`page-item ${currentPage === number ? 'active' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(number)}
                    >
                      {number}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() =>
                      currentPage < totalPages && setCurrentPage(currentPage + 1)
                    }
                  >
                    <i className="far fa-chevron-right" />
                  </button>
                </li>
              </ul>
              {/* ==== Kết thúc pagination ==== */}
            </div>
          </div>
        </div>
      </section >
      {/* Tour List Area end */}
    </div >
  )
}


export default Tour_list