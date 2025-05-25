
import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <img 
        src="/lovable-uploads/d1daa91d-0c7b-4a2a-8bb7-12d3b4d6b3f2.png" 
        alt="Ayu Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default AppLogo;
