
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
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 via-orange-300 to-yellow-200 rounded-full opacity-70"></div>
      <div className="absolute inset-0.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-background"
            d="M32 8 L32 56 M16 16 L48 48 M48 16 L16 48 M12 32 L52 32"
          />
          <circle cx="32" cy="32" r="6" fill="currentColor" className="text-background" />
        </svg>
      </div>
      <div className="absolute inset-0 animate-spin-slow rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
    </div>
  );
};

export default AppLogo;
