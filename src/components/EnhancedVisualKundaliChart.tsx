
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';

interface EnhancedVisualKundaliChartProps {
  kundaliData: ComprehensiveKundaliData;
  language?: 'hi' | 'en';
}

const EnhancedVisualKundaliChart: React.FC<EnhancedVisualKundaliChartProps> = ({ 
  kundaliData, 
  language = 'en' 
}) => {
  const { enhancedCalculations } = kundaliData;
  
  // Planet symbols and colors for better visualization
  const planetInfo = {
    'SU': { symbol: '☉', name: 'Sun', hindi: 'सूर्य', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    'MO': { symbol: '☽', name: 'Moon', hindi: 'चन्द्र', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    'MA': { symbol: '♂', name: 'Mars', hindi: 'मंगल', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
    'ME': { symbol: '☿', name: 'Mercury', hindi: 'बुध', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    'JU': { symbol: '♃', name: 'Jupiter', hindi: 'गुरु', color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    'VE': { symbol: '♀', name: 'Venus', hindi: 'शुक्र', color: 'text-pink-600', bg: 'bg-pink-100 dark:bg-pink-900/30' },
    'SA': { symbol: '♄', name: 'Saturn', hindi: 'शनि', color: 'text-gray-700', bg: 'bg-gray-100 dark:bg-gray-700' },
    'RA': { symbol: '☊', name: 'Rahu', hindi: 'राहु', color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
    'KE': { symbol: '☋', name: 'Ketu', hindi: 'केतु', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' }
  };

  // Zodiac signs with colors
  const signInfo = {
    1: { name: 'Aries', hindi: 'मेष', symbol: '♈', color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700' },
    2: { name: 'Taurus', hindi: 'वृषभ', symbol: '♉', color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' },
    3: { name: 'Gemini', hindi: 'मिथुन', symbol: '♊', color: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700' },
    4: { name: 'Cancer', hindi: 'कर्क', symbol: '♋', color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' },
    5: { name: 'Leo', hindi: 'सिंह', symbol: '♌', color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700' },
    6: { name: 'Virgo', hindi: 'कन्या', symbol: '♍', color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' },
    7: { name: 'Libra', hindi: 'तुला', symbol: '♎', color: 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-700' },
    8: { name: 'Scorpio', hindi: 'वृश्चिक', symbol: '♏', color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700' },
    9: { name: 'Sagittarius', hindi: 'धनु', symbol: '♐', color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700' },
    10: { name: 'Capricorn', hindi: 'मकर', symbol: '♑', color: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600' },
    11: { name: 'Aquarius', hindi: 'कुम्भ', symbol: '♒', color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' },
    12: { name: 'Pisces', hindi: 'मीन', symbol: '♓', color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700' }
  };

  // Create house layout with planets
  const createHouseLayout = () => {
    const houses = Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      planets: Object.values(enhancedCalculations.planets).filter(planet => planet.house === i + 1),
      sign: ((i) % 12) + 1
    }));
    
    return houses;
  };

  const houses = createHouseLayout();

  // Define the positions for the traditional square chart
  const housePositions = [
    { row: 0, col: 1 }, // House 1 (top-center-left)
    { row: 0, col: 2 }, // House 2 (top-center-right)
    { row: 0, col: 3 }, // House 3 (top-right)
    { row: 1, col: 3 }, // House 4 (middle-right)
    { row: 2, col: 3 }, // House 5 (bottom-right)
    { row: 3, col: 3 }, // House 6 (bottom-right-corner)
    { row: 3, col: 2 }, // House 7 (bottom-center-right)
    { row: 3, col: 1 }, // House 8 (bottom-center-left)
    { row: 3, col: 0 }, // House 9 (bottom-left)
    { row: 2, col: 0 }, // House 10 (middle-left)
    { row: 1, col: 0 }, // House 11 (middle-left)
    { row: 0, col: 0 }  // House 12 (top-left)
  ];

  return (
    <div className="space-y-6">
      {/* Main Chart */}
      <Card className="w-full max-w-4xl mx-auto dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-center text-xl md:text-2xl text-orange-600 dark:text-orange-400 flex items-center justify-center gap-2">
            <span className="text-2xl">🏠</span>
            {language === 'hi' ? 'वैदिक जन्म कुंडली चार्ट' : 'Vedic Birth Chart'}
          </CardTitle>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            {language === 'hi' 
              ? 'आपके जन्म के समय ग्रहों की स्थिति' 
              : 'Planetary positions at the time of your birth'}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="grid grid-cols-4 grid-rows-4 gap-1 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border-2 border-orange-200 dark:border-orange-700">
              {Array.from({ length: 16 }, (_, index) => {
                const row = Math.floor(index / 4);
                const col = index % 4;
                
                // Find which house this position represents
                const houseIndex = housePositions.findIndex(pos => pos.row === row && pos.col === col);
                const house = houses[houseIndex];
                
                // Center cell (empty)
                if ((row === 1 || row === 2) && (col === 1 || col === 2)) {
                  return (
                    <div 
                      key={index} 
                      className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-800/30 dark:to-yellow-800/30 border-2 border-orange-300 dark:border-orange-600 rounded-lg flex items-center justify-center"
                    >
                      {row === 1 && col === 1 && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-800 dark:text-orange-300">
                            {language === 'hi' ? 'जन्म' : 'Birth'}
                          </div>
                          <div className="text-xs text-orange-600 dark:text-orange-400">
                            {language === 'hi' ? 'कुंडली' : 'Chart'}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
                
                if (!house) return <div key={index} className="w-16 h-16 md:w-20 md:h-20"></div>;
                
                const signData = signInfo[house.sign as keyof typeof signInfo];
                
                return (
                  <div 
                    key={index}
                    className={`w-16 h-16 md:w-20 md:h-20 border-2 rounded-lg p-1 relative ${signData.color} transition-all hover:scale-105`}
                  >
                    {/* House number */}
                    <div className="absolute -top-1 -left-1 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {house.number}
                    </div>
                    
                    {/* Sign symbol */}
                    <div className="absolute -top-1 -right-1 text-lg">
                      {signData.symbol}
                    </div>
                    
                    {/* Sign name */}
                    <div className="text-center mt-1">
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {language === 'hi' ? signData.hindi : signData.name}
                      </div>
                    </div>
                    
                    {/* Planets in house */}
                    <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center gap-1 p-1">
                      {house.planets.map((planet, planetIndex) => {
                        const planetData = planetInfo[planet.id as keyof typeof planetInfo];
                        return (
                          <div
                            key={planetIndex}
                            className={`text-lg ${planetData.color} drop-shadow-sm hover:scale-110 transition-transform`}
                            title={`${language === 'hi' ? planetData.hindi : planetData.name} - ${planet.degreeInSign.toFixed(1)}°`}
                          >
                            {planetData.symbol}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Chart Legend */}
          <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
              {language === 'hi' ? 'ग्रह सूची' : 'Planet Legend'}
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 max-w-2xl mx-auto">
              {Object.entries(enhancedCalculations.planets).map(([planetId, planet]) => {
                const planetData = planetInfo[planetId as keyof typeof planetInfo];
                return (
                  <div key={planetId} className={`p-2 rounded-lg border ${planetData.bg} border-gray-200 dark:border-gray-600`}>
                    <div className="text-center">
                      <div className={`text-xl ${planetData.color} mb-1`}>{planetData.symbol}</div>
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {language === 'hi' ? planetData.hindi : planetData.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {language === 'hi' ? 'भाव' : 'House'} {planet.house}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Planetary Positions Table */}
      <Card className="w-full max-w-4xl mx-auto dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-center text-lg text-blue-600 dark:text-blue-400">
            {language === 'hi' ? 'ग्रहों की विस्तृत स्थिति' : 'Detailed Planetary Positions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-2 text-gray-700 dark:text-gray-300">
                    {language === 'hi' ? 'ग्रह' : 'Planet'}
                  </th>
                  <th className="text-left p-2 text-gray-700 dark:text-gray-300">
                    {language === 'hi' ? 'राशि' : 'Sign'}
                  </th>
                  <th className="text-left p-2 text-gray-700 dark:text-gray-300">
                    {language === 'hi' ? 'अंश' : 'Degree'}
                  </th>
                  <th className="text-left p-2 text-gray-700 dark:text-gray-300">
                    {language === 'hi' ? 'भाव' : 'House'}
                  </th>
                  <th className="text-left p-2 text-gray-700 dark:text-gray-300">
                    {language === 'hi' ? 'नक्षत्र' : 'Nakshatra'}
                  </th>
                  <th className="text-left p-2 text-gray-700 dark:text-gray-300">
                    {language === 'hi' ? 'स्थिति' : 'Status'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(enhancedCalculations.planets).map(([planetId, planet]) => {
                  const planetData = planetInfo[planetId as keyof typeof planetInfo];
                  return (
                    <tr key={planetId} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-lg ${planetData.color}`}>{planetData.symbol}</span>
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {language === 'hi' ? planetData.hindi : planetData.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-2 text-gray-700 dark:text-gray-300">{planet.rashiName}</td>
                      <td className="p-2 text-gray-700 dark:text-gray-300">{planet.degreeInSign.toFixed(2)}°</td>
                      <td className="p-2 text-gray-700 dark:text-gray-300">{planet.house}</td>
                      <td className="p-2 text-gray-700 dark:text-gray-300">
                        {planet.nakshatraName}
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          ({language === 'hi' ? 'पद' : 'Pada'} {planet.nakshatraPada})
                        </span>
                      </td>
                      <td className="p-2">
                        <div className="flex flex-wrap gap-1">
                          {planet.isExalted && (
                            <Badge variant="default" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                              {language === 'hi' ? 'उच्च' : 'Exalted'}
                            </Badge>
                          )}
                          {planet.isDebilitated && (
                            <Badge variant="destructive" className="text-xs">
                              {language === 'hi' ? 'नीच' : 'Debilitated'}
                            </Badge>
                          )}
                          {planet.ownSign && (
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                              {language === 'hi' ? 'स्व' : 'Own'}
                            </Badge>
                          )}
                          {planet.isRetrograde && (
                            <Badge variant="outline" className="text-xs">
                              {language === 'hi' ? 'वक्री' : 'Retrograde'}
                            </Badge>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Educational Note */}
      <Card className="w-full max-w-4xl mx-auto bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
        <CardContent className="p-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
              {language === 'hi' ? '🌟 कुंडली को समझना' : '🌟 Understanding Your Chart'}
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {language === 'hi' 
                ? 'यह चार्ट आपके जन्म के समय आकाश में ग्रहों की स्थिति दिखाता है। प्रत्येक ग्रह और घर जीवन के विभिन्न पहलुओं का प्रतिनिधित्व करता है।'
                : 'This chart shows where the planets were in the sky when you were born. Each planet and house represents different aspects of life.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedVisualKundaliChart;
