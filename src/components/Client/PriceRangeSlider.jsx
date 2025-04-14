import React from 'react';
import Slider from 'rc-slider';
// Import CSS directly in the component that uses it
import 'rc-slider/assets/index.css';

const PriceRangeSlider = ({ min = 0, max = 1000, onChange }) => {
  return (
    <div className="price-range-slider">
      <Slider
        range
        min={min}
        max={max}
        defaultValue={[min, max]}
        onChange={onChange}
      />
    </div>
  );
};

export default PriceRangeSlider;
