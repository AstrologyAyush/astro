
import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} relative animate-pulse-slow`}>
      {/* Ancient-style ornate mandala background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 via-orange-400 to-amber-300 rounded-full opacity-90"></div>
      
      {/* Inner glow */}
      <div className="absolute inset-1 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full"></div>
      
      {/* Ancient symbols overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 64 64" className="w-full h-full">
          {/* Ancient yantra-inspired design */}
          <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-background/70" />
          <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="1" className="text-background/70" />
          <circle cx="32" cy="32" r="16" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-background/70" />
          <circle cx="32" cy="32" r="6" fill="currentColor" className="text-background" />
          
          {/* Cosmic rays/lotus petals */}
          <path
            d="M32 4 L32 60 M4 32 L60 32 M16 16 L48 48 M48 16 L16 48"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            className="text-background"
          />
          
          {/* Sanskrit-inspired symbol */}
          <path
            d="M32 26 C34 30, 38 30, 38 34 C38 38, 32 38, 32 42 C32 38, 26 38, 26 34 C26 30, 30 30, 32 26"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            className="text-background"
          />
        </svg>
      </div>
      
      {/* Animated cosmic energy */}
      <div className="absolute inset-0 animate-spin-slow rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
    </div>
  );
};

export default AppLogo;
