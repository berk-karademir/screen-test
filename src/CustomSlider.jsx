// components/CustomSlider.jsx
import React from "react";

const CustomSlider = ({
  value,
  min,
  max,
  step,
  onChange,
  className = "",
  label,
  showInput = true,
}) => {
  return (
    <>
      <div className="">
        <label className="">{label}</label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${className}`}
        />
        {showInput && (
          <input
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value) || 0)}
            className="w-14 border rounded-md text-center"
          />
        )}
      </div>
    </>
  );
};

export default CustomSlider;
