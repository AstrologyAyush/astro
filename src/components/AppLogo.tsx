
import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <img 
        src="/lovable-uploads/13651911-1a85-4796-bf23-b9ff50004e14.png" 
        alt="AyushAstro Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default AppLogo;
