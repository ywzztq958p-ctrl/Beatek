import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  transparent?: boolean;
  style?: React.CSSProperties;
}

export default function Logo({ className = '', size = 'md', transparent = false, style = {} }: LogoProps) {
  // Determine dimensions based on size
  const dimensions = {
    sm: { width: '120px', height: '120px' },
    md: { width: '180px', height: '180px' },
    lg: { width: '280px', height: '280px' },
    xl: { width: '400px', height: '400px' },
  }[size];

  return (
    <div 
      className={`relative inline-flex items-center justify-center ${transparent ? '' : 'bg-black rounded-lg p-2'} ${className}`}
      style={{ 
        width: dimensions.width, 
        height: dimensions.height,
        boxShadow: transparent ? 'none' : '0 0 15px rgba(0,0,0,0.5)',
        ...style
      }}
      id="bea-tek-logo-container"
    >
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transition-all duration-300 hover:scale-105"
        id="bea-tek-logo-svg"
      >
        <defs>
          {/* Neon Pink Glow Filter */}
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* LOGO SHAPES & TEXT */}
        <g filter="url(#neon-glow)">
          {/* "BEA" Text */}
          <text
            x="45"
            y="165"
            fill="#FF007F"
            fontFamily="'Inter', 'Arial Black', sans-serif"
            fontWeight="900"
            fontSize="54"
            letterSpacing="8"
          >
            BEA
          </text>

          {/* Line after "BEA" */}
          <rect
            x="218"
            y="135"
            width="98"
            height="11"
            rx="2"
            fill="#FF007F"
          />

          {/* Line before "TEK" */}
          <rect
            x="102"
            y="200"
            width="98"
            height="11"
            rx="2"
            fill="#FF007F"
          />

          {/* "TEK" Text */}
          <text
            x="218"
            y="228"
            fill="#FF007F"
            fontFamily="'Inter', 'Arial Black', sans-serif"
            fontWeight="900"
            fontSize="54"
            letterSpacing="8"
          >
            TEK
          </text>

          {/* "EVENTS" Text */}
          <text
            x="200"
            y="295"
            fill="#FF007F"
            fontFamily="'Inter', 'Arial', sans-serif"
            fontWeight="bold"
            fontSize="26"
            letterSpacing="18"
            textAnchor="middle"
          >
            EVENTS
          </text>
        </g>
      </svg>
    </div>
  );
}
