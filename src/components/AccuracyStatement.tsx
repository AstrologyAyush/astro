
import React from 'react';

interface AccuracyStatementProps {
  language: 'hi' | 'en';
  kundaliData: any;
}

const AccuracyStatement: React.FC<AccuracyStatementProps> = ({ language, kundaliData }) => {
  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  if (kundaliData) return null; // Don't show when kundali is generated

  return (
    <div className="mt-8 md:mt-12 text-center bg-gradient-to-r from-orange-100 to-red-100 p-4 md:p-6 rounded-lg border border-orange-200 mx-4">
      <h3 className="text-base md:text-lg font-semibold text-orange-800 mb-2">
        {getTranslation('Accuracy Guarantee', 'सटीकता की गारंटी')}
      </h3>
      <p className="text-orange-700 text-sm max-w-3xl mx-auto leading-relaxed">
        {getTranslation(
          'Our advanced calculation system uses Swiss Ephemeris data, the same astronomical calculations used by NASA and the most accurate astrological calculations in the world. Analysis according to Rishi Parasher scriptures.',
          'हमारी उन्नत गणना प्रणाली Swiss Ephemeris डेटा का उपयोग करती है, जो NASA और दुनिया की सबसे सटीक ज्योतिषीय गणना है। पं. ऋषि पराशर के शास्त्रों के अनुसार विश्लेषण।'
        )}
      </p>
    </div>
  );
};

export default AccuracyStatement;
