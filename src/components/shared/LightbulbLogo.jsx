import React from 'react';

// Unified Lightbulb Logo Component
export default function LightbulbLogo({ size = 'default', variant = 'dark' }) {
  const sizes = {
    small: { icon: 28, text: 'text-lg' },
    default: { icon: 36, text: 'text-xl' },
    large: { icon: 44, text: 'text-2xl' },
    xlarge: { icon: 52, text: 'text-3xl' }
  };
  
  const { icon, text } = sizes[size] || sizes.default;
  const color = variant === 'light' ? '#ffffff' : '#1e3a5f';
  const textColor = variant === 'light' ? 'text-white' : 'text-[#1e3a5f]';
  
  return (
    <div className="flex items-center gap-2">
      <svg 
        width={icon} 
        height={icon} 
        viewBox="0 0 100 100" 
        fill="none"
        className="flex-shrink-0"
      >
        {/* Lightbulb outline */}
        <path 
          d="M50 10C32 10 18 24 18 42C18 52 23 61 31 67V75C31 79 34 82 38 82H62C66 82 69 79 69 75V67C77 61 82 52 82 42C82 24 68 10 50 10Z" 
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Filament */}
        <path 
          d="M42 50C42 50 45 42 50 42C55 42 58 50 58 50" 
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path 
          d="M46 50V58" 
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path 
          d="M54 50V58" 
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Base lines */}
        <line x1="38" y1="86" x2="62" y2="86" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="40" y1="91" x2="60" y2="91" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
        {/* Light rays */}
        <line x1="50" y1="0" x2="50" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <line x1="75" y1="15" x2="80" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <line x1="25" y1="15" x2="20" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <line x1="88" y1="42" x2="94" y2="42" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <line x1="6" y1="42" x2="12" y2="42" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <span className={`${text} font-bold ${textColor}`} style={{ fontFamily: 'Heebo, sans-serif' }}>
        הֶאָרָה
      </span>
    </div>
  );
}