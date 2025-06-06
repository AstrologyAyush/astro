
import React from 'react';

interface LanguageToggleProps {
  language: 'hi' | 'en';
  onLanguageChange: (lang: 'hi' | 'en') => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ language, onLanguageChange }) => {
  return (
    <div className="flex justify-center mb-4 md:mb-6 px-4">
      <div className="bg-white rounded-lg p-1 shadow-sm border">
        <button
          onClick={() => onLanguageChange('en')}
          className={`px-3 md:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            language === 'en' 
              ? 'bg-orange-500 text-white' 
              : 'text-gray-600 hover:text-orange-600'
          }`}
        >
          English
        </button>
        <button
          onClick={() => onLanguageChange('hi')}
          className={`px-3 md:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            language === 'hi' 
              ? 'bg-orange-500 text-white' 
              : 'text-gray-600 hover:text-orange-600'
          }`}
        >
          हिंदी
        </button>
      </div>
    </div>
  );
};

export default LanguageToggle;
