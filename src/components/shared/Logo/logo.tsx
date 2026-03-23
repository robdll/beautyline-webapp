import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  width = 48, 
  height = 16 
}) => {
  return (
    <div className={className}>
      <Image
        src="/images/logo-bl.png"
        alt="BeautyLine Professional"
        width={width}
        height={height}
        className="w-auto h-[50px]"
        priority
      />
    </div>
  );
};

