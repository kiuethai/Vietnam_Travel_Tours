const SearchFilter = () => {
  return (
    <div className="container container-1400">
      <div
        className="search-filter-inner"
        data-aos="zoom-out-down"
        data-aos-duration={1500}
        data-aos-offset={50}
      >
        <div className="filter-item clearfix">
          <div className="icon">
            <i className="fal fa-map-marker-alt" />
          </div>
          <span className="title">Điểm đến</span>
          <select name="city" id="city">
            <option value="value1">Chọn điểm đến</option>
            <option value="value2">City</option>
            <option value="value2">Region</option>
          </select>
        </div>
        
        <div className="filter-item clearfix">
          <div className="icon">
            <i className="fal fa-calendar-alt" />
          </div>
          <span className="title">Ngày khởi hành</span>
          <select name="date" id="date">
            <option value="value1">Chọn ngày đi</option>
            <option value="value2">10</option>
            <option value="value2">20</option>
          </select>
        </div>
        <div className="filter-item clearfix">
          <div className="icon">
            <i className="fal fa-calendar-alt" />
          </div>
          <span className="title">Ngày kết thúc</span>
          <select name="date" id="date">
          <option value="value1">Chọn ngày kết thúc</option>
            <option value="value2">10</option>
            <option value="value2">20</option>
          </select>
        </div>
        <div className="search-button">
          <button className="theme-btn">
            <span data-hover="Search">Tìm kiếm</span>
            <i className="far fa-search" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default SearchFilter;
