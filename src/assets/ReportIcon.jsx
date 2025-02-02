import React from 'react';

const ReportIcon = ({ color = '#ffffff', fillColor = 'none', width = 24, height = 24 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={width}
      height={height}
      fill={fillColor}
    >
      <circle cx="5" cy="7" r="3" stroke={color} strokeWidth="1.5" />
      <circle cx="8" cy="18" r="4" stroke={color} strokeWidth="1.5" />
      <circle cx="17" cy="7" r="5" stroke={color} strokeWidth="1.5" />
    </svg>
  );
};

export default ReportIcon;
