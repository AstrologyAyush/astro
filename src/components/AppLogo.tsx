
import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <img 
        src="/lovable-uploads/f6a4ccba-df80-49e2-88fd-17a006366d32.png" 
        alt="Ayu Astro Logo"
        className="w-full h-full object-contain rounded-lg"
      />
    </div>
  );
};

export default AppLogo;
