import React from 'react';

const DropdownArrowIcon = ({ width = 20, height = 20, color = "currentColor", strokeWidth = 1.5 }) => {
    return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={width}
          height={height}
          fill="none"
        >
          <path
            d="M7 10l5 5 5-5"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
};

export default DropdownArrowIcon;