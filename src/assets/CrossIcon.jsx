import React from 'react';

const CrossIcon = ({ height = 24, width = 24, color = "#ffffff", fillColor = "#fff" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={width}
        height={height}
        color={color}
        fill={fillColor}
    >
        <path
            d="M19.0005 4.99988L5.00049 18.9999M5.00049 4.99988L19.0005 18.9999"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default CrossIcon;
