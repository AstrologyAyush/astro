
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KundaliChartProps {
  chart?: any;
  language?: 'hi' | 'en';
}

const KundaliChart: React.FC<KundaliChartProps> = ({ chart, language = 'en' }) => {
  // Early return with loading state if chart is not available
  if (!chart) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'hi' ? 'कुंडली चार्ट' : 'Kundali Chart'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">
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
  const { 
    ascendant = 0, 
    houses = [], 
    planets = {},
    birthData = {}
  } = chart;

  // Zodiac signs in Hindi and English
  const zodiacSigns = {
    hi: ['मेष', 'वृष', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'],
    en: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
  };

  // Planet names in Hindi and English
  const planetNames = {
    hi: {
      Sun: 'सूर्य',
      Moon: 'चंद्र',
      Mars: 'मंगल',
      Mercury: 'बुध',
      Jupiter: 'गुरु',
      Venus: 'शुक्र',
      Saturn: 'शनि',
      Rahu: 'राहु',
      Ketu: 'केतु'
    },
    en: {
      Sun: 'Sun',
      Moon: 'Moon',
      Mars: 'Mars',
      Mercury: 'Mercury',
      Jupiter: 'Jupiter',
      Venus: 'Venus',
      Saturn: 'Saturn',
      Rahu: 'Rahu',
      Ketu: 'Ketu'
    }
  };

  // Generate house data with planets
  const generateHouseData = () => {
    const houseData = Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      sign: zodiacSigns[language][i],
      planets: []
    }));

    // Place planets in houses
    Object.entries(planets).forEach(([planetName, planetInfo]: [string, any]) => {
      if (planetInfo && typeof planetInfo.house === 'number') {
        const houseIndex = planetInfo.house - 1;
        if (houseIndex >= 0 && houseIndex < 12) {
          houseData[houseIndex].planets.push(planetNames[language][planetName as keyof typeof planetNames.en] || planetName);
        }
      }
    });

    return houseData;
  };

  const houseData = generateHouseData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'hi' ? 'कुंडली चार्ट' : 'Kundali Chart'}
        </CardTitle>
        {birthData.name && (
          <p className="text-sm text-muted-foreground">
            {language === 'hi' ? 'नाम: ' : 'Name: '}{birthData.name}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="kundali-chart">
          <div className="kundali-grid">
            {houseData.map((house, index) => (
              <div
                key={index}
                className={`kundali-house kundali-house-${house.number}`}
              >
                <div className="house-number text-xs font-bold">
                  {house.number}
                </div>
                <div className="zodiac-symbol text-xs">
                  {house.sign}
                </div>
                <div className="planets">
                  {house.planets.map((planet, planetIndex) => (
                    <span key={planetIndex} className="planet-symbol">
                      {planet}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Center area */}
            <div className="center-area col-span-2 row-span-2 flex flex-col items-center justify-center text-center">
              <div className="text-xs font-semibold">
                {language === 'hi' ? 'लग्न' : 'Ascendant'}
              </div>
              <div className="text-sm">
                {zodiacSigns[language][ascendant] || zodiacSigns[language][0]}
              </div>
            </div>
          </div>
        </div>

        {/* Additional chart information */}
        <div className="mt-4 text-sm text-muted-foreground">
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
