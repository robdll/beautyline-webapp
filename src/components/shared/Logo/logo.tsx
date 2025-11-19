import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  width = 150, 
  height = 50 
}) => {
  return (
    <div className={className}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 200 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto h-auto"
      >
        <text
          x="10"
          y="35"
          fontSize="24"
          fontWeight="700"
          fill="#C89B6C"
          fontFamily="Inter, sans-serif"
        >
          BeautyLine
        </text>
        <text
          x="10"
          y="50"
          fontSize="12"
          fontWeight="400"
          fill="#1A1A1A"
          fontFamily="Inter, sans-serif"
        >
          Professional
        </text>
      </svg>
    </div>
  );
};

