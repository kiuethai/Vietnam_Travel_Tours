import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const SearchFilter = () => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.append('destination', destination);
    if (startDate) params.append('startDate', dayjs(startDate).format('YYYY-MM-DD'));
    if (endDate) params.append('endDate', dayjs(endDate).format('YYYY-MM-DD'));
    navigate(`/tour?${params.toString()}`);
  };

  return (
    <div className="container container-1400">
      <div className="search-filter-inner" data-aos="zoom-out-down" data-aos-duration={1500} data-aos-offset={50}>
        <div className="filter-item clearfix">
          <div className="icon"><i className="fal fa-map-marker-alt" /></div>
          <span className="title">Điểm đến</span>
          <select
            name="destination"
            id="destination"
            value={destination}
            onChange={e => setDestination(e.target.value)}
            style={{ width: 200 }}
          >
            <option value="">Chọn điểm đến</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
            <option value="Côn Đảo">Côn Đảo</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
            <option value="Hạ Long">Hạ Long</option>
            <option value="Ninh Bình">Ninh Bình</option>
            <option value="Phú Quốc">Phú Quốc</option>
            <option value="Đà Lạt">Đà Lạt</option>
            <option value="Quảng Trị">Quảng Trị</option>
            <option value="Nha Trang">Nha Trang</option>
            <option value="Cần Thơ">Cần Thơ</option>
            <option value="Vũng Tàu">Vũng Tàu</option>
            <option value="Quảng Ninh">Quảng Ninh</option>
            <option value="Sa Pa">Lào Cai (Sa Pa)</option>
            <option value="Quy Nhơn">Bình Định (Quy Nhơn)</option>
          </select>
        </div>

        <div className="filter-item clearfix">
          <div className="icon"><i className="fal fa-calendar-alt" /></div>
          <span className="title">Ngày khởi hành</span>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={startDate}
              onChange={setStartDate}
              format="DD/MM/YY"
              renderInput={params => <TextField {...params} size="small" sx={{ width: 120 }} />}
            />
          </LocalizationProvider>
        </div>

        <div className="filter-item clearfix">
          <div className="icon"><i className="fal fa-calendar-alt" /></div>
          <span className="title">Ngày kết thúc</span>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={endDate}
              onChange={setEndDate}
              format="DD/MM/YY"
              renderInput={params => <TextField {...params} size="small" sx={{ width: 120 }} />}
            />
          </LocalizationProvider>
        </div>

        <div className="search-button">
          <button className="theme-btn" onClick={handleSearch}>
            <span data-hover="Search">Tìm kiếm</span>
            <i className="far fa-search" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
