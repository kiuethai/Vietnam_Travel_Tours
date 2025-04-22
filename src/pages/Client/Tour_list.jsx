import React, { useState, useEffect } from 'react'
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

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await getAllToursAPI();
        console.log('🚀 ~ fetchTours ~ response:', response)
        setTours(response || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tours:", error);
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Lọc tour theo giá
  const filteredTours = tours.filter(tour => {
    const inPrice =
      !isPriceFilter ||
      ((tour.priceAdult || 0) >= priceRange[0] && (tour.priceAdult || 0) <= priceRange[1]);
    const inRegion =
      !selectedRegion || tour.domain === selectedRegion;
    return inPrice && inRegion;
  });

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

  return (
    <div><Banner pageTitle={"Danh sách tour du lịch"} pageName={"Tour List"} search />
      {/* Tour List Area start */}
      <section className="tour-list-page py-100 rel z-1">
        <div className="container">
          <div className="row">
            <TourSidebar
              value={priceRange}
              setValue={handlePriceChange}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
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
                  {filteredTours.length} Tours found
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
                    sortedTour.map((tour, index) => (
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
                              <span className="badge bgc-pink">Available</span>
                              :
                              <span className="badge bgc-red">Not Available</span>
                            }
                            <a href="#" className="heart">
                              <i className="fas fa-heart" />
                            </a>
                            <img
                              src={tour?.images?.[0] || "assets/images/destinations/tour-list1.jpg"}
                              alt={tour?.title || "Tour List"}
                            />
                          </div>
                          <div className="content">
                            <div className="destination-header">
                              <span className="location">
                                <i className="fal fa-map-marker-alt" /> {tour?.destination || "Location not specified"}
                              </span>
                              <div className="ratting">
                                {[...Array(5)].map((_, i) => (
                                  <i key={i} className="fas fa-star" />
                                ))}
                              </div>
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
      </section >
      {/* Tour List Area end */}
    </div >
  )
}

export default Tour_list