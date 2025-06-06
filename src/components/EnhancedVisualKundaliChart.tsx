
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';
import { Star, Sun, Moon } from 'lucide-react';

interface EnhancedVisualKundaliChartProps {
  kundaliData: ComprehensiveKundaliData;
  language?: 'hi' | 'en';
}

const EnhancedVisualKundaliChart: React.FC<EnhancedVisualKundaliChartProps> = ({ 
  kundaliData, 
  language = 'en' 
}) => {
  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const lagna = kundaliData.enhancedCalculations.lagna;
  const planets = kundaliData.enhancedCalculations.planets;

  // Zodiac signs in both languages
  const zodiacSigns = [
    { en: 'Aries', hi: 'मेष', symbol: '♈' },
    { en: 'Taurus', hi: 'वृष', symbol: '♉' },
    { en: 'Gemini', hi: 'मिथुन', symbol: '♊' },
    { en: 'Cancer', hi: 'कर्क', symbol: '♋' },
    { en: 'Leo', hi: 'सिंह', symbol: '♌' },
    { en: 'Virgo', hi: 'कन्या', symbol: '♍' },
    { en: 'Libra', hi: 'तुला', symbol: '♎' },
    { en: 'Scorpio', hi: 'वृश्चिक', symbol: '♏' },
    { en: 'Sagittarius', hi: 'धनु', symbol: '♐' },
    { en: 'Capricorn', hi: 'मकर', symbol: '♑' },
    { en: 'Aquarius', hi: 'कुम्भ', symbol: '♒' },
    { en: 'Pisces', hi: 'मीन', symbol: '♓' }
  ];

  // Planet symbols and colors
  const planetInfo = {
    SU: { symbol: '☉', color: 'text-yellow-600', name: language === 'hi' ? 'सूर्य' : 'Sun' },
    MO: { symbol: '☽', color: 'text-blue-600', name: language === 'hi' ? 'चंद्र' : 'Moon' },
    MA: { symbol: '♂', color: 'text-red-600', name: language === 'hi' ? 'मंगल' : 'Mars' },
    ME: { symbol: '☿', color: 'text-green-600', name: language === 'hi' ? 'बुध' : 'Mercury' },
    JU: { symbol: '♃', color: 'text-purple-600', name: language === 'hi' ? 'गुरु' : 'Jupiter' },
    VE: { symbol: '♀', color: 'text-pink-600', name: language === 'hi' ? 'शुक्र' : 'Venus' },
    SA: { symbol: '♄', color: 'text-gray-600', name: language === 'hi' ? 'शनि' : 'Saturn' },
    RA: { symbol: '☊', color: 'text-orange-600', name: language === 'hi' ? 'राहु' : 'Rahu' },
    KE: { symbol: '☋', color: 'text-indigo-600', name: language === 'hi' ? 'केतु' : 'Ketu' }
  };

  // Calculate house positions for display
  const getHouseData = () => {
    const houses = Array.from({ length: 12 }, (_, index) => ({
      number: index + 1,
      sign: zodiacSigns[index],
      planets: []
    }));

    // Place planets in houses
    Object.entries(planets).forEach(([planetId, planet]) => {
      const houseNumber = Math.floor(((planet.rashi - lagna.sign + 12) % 12)) + 1;
      const houseIndex = houseNumber - 1;
      if (houseIndex >= 0 && houseIndex < 12) {
        houses[houseIndex].planets.push({
          id: planetId,
          ...planetInfo[planetId as keyof typeof planetInfo]
        });
      }
    });

    return houses;
  };

  const houseData = getHouseData();

  // Chart layout positions (North Indian style)
  const chartLayout = [
    { house: 12, position: 'col-start-1 row-start-1' },
    { house: 1, position: 'col-start-2 row-start-1' },
    { house: 2, position: 'col-start-3 row-start-1' },
    { house: 3, position: 'col-start-4 row-start-1' },
    { house: 11, position: 'col-start-1 row-start-2' },
    { house: 0, position: 'col-start-2 row-start-2 col-span-2 row-span-2' }, // Center
    { house: 4, position: 'col-start-4 row-start-2' },
    { house: 10, position: 'col-start-1 row-start-3' },
    { house: 5, position: 'col-start-4 row-start-3' },
    { house: 9, position: 'col-start-1 row-start-4' },
    { house: 8, position: 'col-start-2 row-start-4' },
    { house: 7, position: 'col-start-3 row-start-4' },
    { house: 6, position: 'col-start-4 row-start-4' }
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Birth Details Card */}
      <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-orange-800 text-center text-lg md:text-xl">
            {getTranslation('Birth Chart Details', 'जन्म कुंडली विवरण')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 text-center">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <h4 className="font-semibold text-orange-800 text-sm mb-1">
                {getTranslation('Ascendant (Lagna)', 'लग्न')}
              </h4>
              <p className="text-orange-600 font-medium text-lg">
                {lagna.signName}
              </p>
              <p className="text-xs text-gray-600">
                {zodiacSigns[lagna.sign - 1]?.symbol} {lagna.degree.toFixed(2)}°
              </p>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <h4 className="font-semibold text-blue-800 text-sm mb-1 flex items-center justify-center gap-1">
                <Moon className="h-4 w-4" />
                {getTranslation('Moon Sign', 'चंद्र राशि')}
              </h4>
              <p className="text-blue-600 font-medium text-lg">
                {planets.MO.rashiName}
              </p>
              <p className="text-xs text-gray-600">
                {zodiacSigns[planets.MO.rashi - 1]?.symbol} {planets.MO.degree.toFixed(2)}°
              </p>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <h4 className="font-semibold text-yellow-800 text-sm mb-1 flex items-center justify-center gap-1">
                <Sun className="h-4 w-4" />
                {getTranslation('Sun Sign', 'सूर्य राशि')}
              </h4>
              <p className="text-yellow-600 font-medium text-lg">
                {planets.SU.rashiName}
              </p>
              <p className="text-xs text-gray-600">
                {zodiacSigns[planets.SU.rashi - 1]?.symbol} {planets.SU.degree.toFixed(2)}°
              </p>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <h4 className="font-semibold text-purple-800 text-sm mb-1">
                {getTranslation('Nakshatra', 'नक्षत्र')}
              </h4>
              <p className="text-purple-600 font-medium text-lg">
                {planets.MO.nakshatraName}
              </p>
              <p className="text-xs text-gray-600">
                {getTranslation('Pada', 'पाद')} {planets.MO.nakshatraPada}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kundali Chart */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-800 text-center">
            {getTranslation('Kundali Chart (North Indian Style)', 'कुंडली चार्ट (उत्तर भारतीय शैली)')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-lg mx-auto">
            <div className="grid grid-cols-4 grid-rows-4 gap-1 aspect-square">
              {chartLayout.map((layout, index) => {
                if (layout.house === 0) {
                  // Center area
                  return (
                    <div
                      key={index}
                      className={`${layout.position} bg-gradient-to-br from-orange-100 to-red-100 border-2 border-orange-300 rounded flex flex-col items-center justify-center p-2`}
                    >
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-800 mb-1">
                          {getTranslation('Kundali', 'कुंडली')}
                        </div>
                        <div className="text-sm text-orange-600">
                          {getTranslation('Lagna:', 'लग्न:')} {lagna.signName}
                        </div>
                      </div>
                    </div>
                  );
                }

                const house = houseData[layout.house - 1];
                const isLagnaHouse = layout.house === lagna.sign;

                return (
                  <div
                    key={index}
                    className={`${layout.position} border border-gray-300 p-1 bg-white hover:bg-gray-50 transition-colors ${
                      isLagnaHouse ? 'bg-orange-100 border-orange-400 font-bold' : ''
                    }`}
                  >
                    <div className="text-xs text-center h-full flex flex-col">
                      <div className="font-bold text-gray-800 mb-1">
                        {layout.house}
                      </div>
                      <div className="text-xs text-gray-600 mb-1">
                        {language === 'hi' ? house.sign.hi : house.sign.en}
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-1">
                        {house.planets.map((planet: any, planetIndex: number) => (
                          <div
                            key={planetIndex}
                            className={`${planet.color} text-sm font-medium`}
                            title={planet.name}
                          >
                            {planet.symbol}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Planet Positions Table */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-800 flex items-center gap-2">
            <Star className="h-5 w-5" />
            {getTranslation('Planetary Positions', 'ग्रह स्थिति')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-orange-200">
                  <th className="text-left p-2 font-semibold text-orange-800">
                    {getTranslation('Planet', 'ग्रह')}
                  </th>
                  <th className="text-left p-2 font-semibold text-orange-800">
                    {getTranslation('Sign', 'राशि')}
                  </th>
                  <th className="text-left p-2 font-semibold text-orange-800">
                    {getTranslation('Degree', 'अंश')}
                  </th>
                  <th className="text-left p-2 font-semibold text-orange-800">
                    {getTranslation('Nakshatra', 'नक्षत्र')}
                  </th>
                  <th className="text-left p-2 font-semibold text-orange-800">
                    {getTranslation('House', 'भाव')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(planets).map(([planetId, planet]) => {
                  const planetDetail = planetInfo[planetId as keyof typeof planetInfo];
                  const houseNumber = Math.floor(((planet.rashi - lagna.sign + 12) % 12)) + 1;
                  
                  return (
                    <tr key={planetId} className="border-b border-gray-100 hover:bg-orange-50">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <span className={`${planetDetail?.color} text-lg`}>
                            {planetDetail?.symbol}
                          </span>
                          <span className="font-medium">{planetDetail?.name}</span>
                        </div>
                      </td>
                      <td className="p-2">{planet.rashiName}</td>
                      <td className="p-2">{planet.degree.toFixed(2)}°</td>
                      <td className="p-2">{planet.nakshatraName}</td>
                      <td className="p-2">{houseNumber}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedVisualKundaliChart;
