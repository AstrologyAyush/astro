
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from '@/hooks/use-mobile';
import MobileKundaliChart from './MobileKundaliChart';

interface KundaliChartProps {
  kundaliData?: any;
  language?: 'hi' | 'en';
}

const KundaliChart: React.FC<KundaliChartProps> = ({ kundaliData, language = 'en' }) => {
  const isMobile = useIsMobile();

  // Use mobile-optimized chart for mobile devices
  if (isMobile) {
    return <MobileKundaliChart kundaliData={kundaliData} language={language} />;
  }

  // Early return with loading state if kundaliData is not available
  if (!kundaliData) {
    return (
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-800 text-sm sm:text-base md:text-lg">
            {language === 'hi' ? 'कुंडली चार्ट' : 'Kundali Chart'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 sm:h-48 md:h-64">
            <p className="text-muted-foreground text-sm sm:text-base">
              {language === 'hi' 
                ? 'कुंडली चार्ट लोड हो रहा है...' 
                : 'Loading Kundali Chart...'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Safely destructure with defaults
  const chart = kundaliData.chart || {};
  const { 
    ascendant = 0,
    planets = {},
    houses = [],
    ascendantSanskrit = '',
    moonSign = 0,
    sunSign = 0
  } = chart;

  const birthData = kundaliData.birthData || {};

  // Zodiac signs in Hindi and English
  const zodiacSigns = {
    hi: ['मेष', 'वृष', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'],
    en: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
  };

  // Planet names in Hindi and English
  const planetNames = {
    hi: {
      Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
      Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु'
    },
    en: {
      Sun: 'Sun', Moon: 'Moon', Mars: 'Mars', Mercury: 'Mercury',
      Jupiter: 'Jupiter', Venus: 'Venus', Saturn: 'Saturn', Rahu: 'Rahu', Ketu: 'Ketu'
    }
  };

  // House names in Hindi and English
  const houseNames = {
    hi: [
      'प्रथम भाव', 'द्वितीय भाव', 'तृतीय भाव', 'चतुर्थ भाव', 'पंचम भाव', 'षष्ठ भाव',
      'सप्तम भाव', 'अष्टम भाव', 'नवम भाव', 'दशम भाव', 'एकादश भाव', 'द्वादश भाव'
    ],
    en: [
      '1st House', '2nd House', '3rd House', '4th House', '5th House', '6th House',
      '7th House', '8th House', '9th House', '10th House', '11th House', '12th House'
    ]
  };

  // Generate house data with planets
  const generateHouseData = () => {
    const houseData = Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      sign: zodiacSigns[language][(ascendant - 1 + i) % 12],
      houseName: houseNames[language][i],
      planets: []
    }));

    // Place planets in houses based on proper house calculation
    Object.entries(planets).forEach(([planetName, planetInfo]: [string, any]) => {
      if (planetInfo && typeof planetInfo.rashi === 'number') {
        // Calculate proper house position relative to ascendant
        const properHouse = ((planetInfo.rashi - ascendant + 12) % 12) + 1;
        const houseIndex = properHouse - 1;
        if (houseIndex >= 0 && houseIndex < 12) {
          houseData[houseIndex].planets.push(planetNames[language][planetName as keyof typeof planetNames.en] || planetName);
        }
      }
    });

    return houseData;
  };

  const houseData = generateHouseData();

  return (
    <Card className="border-orange-200">
      <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 p-3 sm:p-4 md:p-6">
        <CardTitle className="text-orange-800 text-sm sm:text-base md:text-lg">
          {language === 'hi' ? 'कुंडली चार्ट' : 'Kundali Chart'}
        </CardTitle>
        {birthData.fullName && (
          <p className="text-xs sm:text-sm text-orange-600">
            {language === 'hi' ? 'नाम: ' : 'Name: '}{birthData.fullName}
          </p>
        )}
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6">
        {/* Desktop calculated information */}
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
            <div>
              <h4 className="font-semibold text-orange-800 text-xs sm:text-sm">
                {language === 'hi' ? 'लग्न राशि' : 'Ascendant (Lagna)'}
              </h4>
              <p className="text-orange-600 font-medium text-sm sm:text-base">
                {ascendantSanskrit || zodiacSigns[language][ascendant] || zodiacSigns[language][0]}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-orange-800 text-xs sm:text-sm">
                {language === 'hi' ? 'चंद्र राशि' : 'Moon Sign'}
              </h4>
              <p className="text-orange-600 font-medium text-sm sm:text-base">
                {kundaliData.moonRashi || zodiacSigns[language][moonSign]}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-orange-800 text-xs sm:text-sm">
                {language === 'hi' ? 'सूर्य राशि' : 'Sun Sign'}
              </h4>
              <p className="text-orange-600 font-medium text-sm sm:text-base">
                {kundaliData.sunRashi || zodiacSigns[language][sunSign]}
              </p>
            </div>
          </div>
        </div>

        <div className="kundali-chart">
          {/* Desktop grid */}
          <div className="grid grid-cols-4 gap-0.5 sm:gap-1 max-w-sm sm:max-w-md mx-auto">
            {houseData.map((house, index) => (
              <div
                key={index}
                className={`aspect-square border border-orange-300 p-1 sm:p-2 text-center bg-white hover:bg-orange-50 transition-colors ${
                  house.number === 1 ? 'bg-orange-100 font-bold' : ''
                }`}
              >
                <div className="text-xs font-bold text-orange-800 mb-1">
                  {house.number}
                </div>
                <div className="text-xs text-gray-600 mb-1 leading-tight">
                  {house.sign}
                </div>
                <div className="text-xs">
                  {house.planets.map((planet, planetIndex) => (
                    <div key={planetIndex} className="text-orange-600 font-medium leading-tight">
                      {planet}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop additional chart information */}
        <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-600 text-center px-2">
          <p>
            {language === 'hi' 
              ? 'यह आपकी वैदिक कुंडली का चार्ट है। प्रत्येक घर में ग्रह और राशि दिखाई गई है।'
              : 'This is your Vedic birth chart. Each house shows the planets and zodiac signs.'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default KundaliChart;
