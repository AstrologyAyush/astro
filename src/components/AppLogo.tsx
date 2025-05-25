
import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-32 h-32'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <img 
        src="/lovable-uploads/ef953165-84e1-467d-b535-1c9bb7d356ff.png" 
        alt="Ayu Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default AppLogo;
