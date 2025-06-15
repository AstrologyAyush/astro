
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const AccuracyStatement: React.FC = () => {
  const { language } = useLanguage();

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  return (
    <div className="text-center py-8 px-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-700 rounded-lg mb-8 border border-orange-100 dark:border-gray-600">
      <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
        {getTranslation('All rights reserved.', 'सभी अधिकार सुरक्षित।')}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
        Rishi Parasher 500+ years of knowledge
      </p>
      <div className="flex justify-center mt-4">
        <div className="w-8 h-8 text-orange-500">
          ✨
        </div>
      </div>
    </div>
  );
};

export default AccuracyStatement;
