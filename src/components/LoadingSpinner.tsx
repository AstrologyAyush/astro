
import React from 'react';

interface LoadingSpinnerProps {
  language: 'hi' | 'en';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ language }) => {
  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  return (
    <div className="mt-4 md:mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg mx-4">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
        <div>
          <p className="text-orange-800 font-medium text-sm md:text-base">
            {getTranslation('Advanced Calculations in Progress...', 'उन्नत गणना प्रगति में...')}
          </p>
          <p className="text-orange-600 text-xs md:text-sm">
            {getTranslation(
              'Calculating planetary positions, yogas, dashas, and Rishi Parasher analysis',
              'ग्रह स्थिति, योग, दशा और ऋषि पराशर विश्लेषण तैयार हो रहा है'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
