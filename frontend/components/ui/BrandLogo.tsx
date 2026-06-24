import React from 'react';

const BrandLogo = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 500 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <text
        x="0"
        y="60"
        fill="currentColor"
        style={{
          fontFamily: 'var(--font-fraunces), serif',
          fontWeight: 900,
          fontSize: '48px',
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
        }}
      >
        Hardik Vatukiya
      </text>
    </svg>
  );
};

export default BrandLogo;
