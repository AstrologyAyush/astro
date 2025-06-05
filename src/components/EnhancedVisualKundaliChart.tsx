
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';
import { Star, Moon, Sun } from "lucide-react";

interface EnhancedVisualKundaliChartProps {
  kundaliData: ComprehensiveKundaliData;
  language?: 'hi' | 'en';
}

const EnhancedVisualKundaliChart: React.FC<EnhancedVisualKundaliChartProps> = ({ 
  kundaliData, 
  language = 'en' 
}) => {
  const { enhancedCalculations } = kundaliData;
  const { lagna, planets } = enhancedCalculations;
  
  // Planet symbols
  const planetSymbols: Record<string, string> = {
    SU: '☉', // Sun
    MO: '☽', // Moon
    MA: '♂', // Mars
    ME: '☿', // Mercury
    JU: '♃', // Jupiter
    VE: '♀', // Venus
    SA: '♄', // Saturn
    RA: '☊', // Rahu
    KE: '☋'  // Ketu
  };
  
  // Hindi planet names
  const planetNamesHi: Record<string, string> = {
    SU: 'सू', // Sun
    MO: 'चं', // Moon
    MA: 'मं', // Mars
    ME: 'बु', // Mercury
    JU: 'गु', // Jupiter
    VE: 'शु', // Venus
    SA: 'श', // Saturn
    RA: 'रा', // Rahu
    KE: 'के'  // Ketu
  };
  
  // Zodiac signs symbols
  const zodiacSymbols: Record<number, string> = {
    0: '♈', // Aries
    1: '♉', // Taurus
    2: '♊', // Gemini
    3: '♋', // Cancer
    4: '♌', // Leo
    5: '♍', // Virgo
    6: '♎', // Libra
    7: '♏', // Scorpio
    8: '♐', // Sagittarius
    9: '♑', // Capricorn
    10: '♒', // Aquarius
    11: '♓'  // Pisces
  };
  
  // Short zodiac names in Hindi
  const zodiacNamesHi: Record<number, string> = {
    0: 'मे', // Aries (Mesh)
    1: 'वृ', // Taurus (Vrishabh)
    2: 'मि', // Gemini (Mithun)
    3: 'क', // Cancer (Kark)
    4: 'सिं', // Leo (Simha)
    5: 'क', // Virgo (Kanya)
    6: 'तु', // Libra (Tula)
    7: 'वृ', // Scorpio (Vrishchik)
    8: 'ध', // Sagittarius (Dhanu)
    9: 'म', // Capricorn (Makar)
    10: 'कु', // Aquarius (Kumbh)
    11: 'मी'  // Pisces (Meen)
  };

  // Calculate house positions based on Lagna
  const houses = new Array(12).fill(null).map((_, index) => {
    const houseNumber = index + 1;
    const sign = (lagna.sign + index) % 12;
    const planetsInHouse: string[] = [];
    
    // Find planets in this house
    Object.entries(planets).forEach(([planetId, planet]) => {
      const planetHouse = Math.floor(((planet.rashi - lagna.sign + 12) % 12) + 1);
      if (planetHouse === houseNumber) {
        planetsInHouse.push(planetId);
      }
    });
    
    return {
      number: houseNumber,
      sign,
      signName: sign,
      planets: planetsInHouse
    };
  });
  
  // Function to get planet color
  const getPlanetColor = (planetId: string): string => {
    const colorMap: Record<string, string> = {
      SU: 'text-yellow-600', // Sun - Yellow
      MO: 'text-blue-400',   // Moon - Light Blue
      MA: 'text-red-600',    // Mars - Red
      ME: 'text-green-500',  // Mercury - Green
      JU: 'text-orange-500', // Jupiter - Orange
      VE: 'text-pink-400',   // Venus - Pink
      SA: 'text-gray-700',   // Saturn - Dark Gray
      RA: 'text-indigo-600', // Rahu - Indigo
      KE: 'text-purple-600'  // Ketu - Purple
    };
    
    return colorMap[planetId] || 'text-gray-600';
  };

  // North Indian style chart layout
  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 pb-3">
        <CardTitle className="text-center text-orange-800 flex items-center justify-center gap-2">
          <Star className="h-5 w-5 text-orange-600" />
          {language === 'hi' ? 'उत्तर भारतीय कुंडली चार्ट' : 'North Indian Kundali Chart'}
        </CardTitle>
        <div className="text-center text-sm text-orange-700">
          <span className="font-semibold">{language === 'hi' ? 'लग्न:' : 'Ascendant:'}</span> {lagna.signName} ({lagna.degree.toFixed(1)}°)
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative w-full max-w-md mx-auto">
          {/* North Indian style chart */}
          <div className="aspect-square border-2 border-orange-300 relative">
            {/* Inner cross lines */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-[2px] bg-orange-300"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[2px] h-full bg-orange-300"></div>
            </div>
            
            {/* Diagonal lines */}
            <div className="absolute inset-0">
              <div className="w-full h-full border-2 border-orange-300 transform rotate-45 origin-center"></div>
            </div>
            
            {/* Houses and Planets */}
            {/* Top row */}
            <div className="absolute top-0 left-0 w-1/4 h-1/4 border-orange-300 p-1 text-center">
              <div className="text-xs font-bold text-orange-700">{houses[11].number}</div>
              <div className="text-xs text-gray-600">
                {language === 'hi' ? zodiacNamesHi[houses[11].sign] : zodiacSymbols[houses[11].sign]}
              </div>
              {houses[11].planets.map(planet => (
                <div key={planet} className={`text-xs font-bold ${getPlanetColor(planet)}`}>
                  {language === 'hi' ? planetNamesHi[planet] : planetSymbols[planet]}
                </div>
              ))}
            </div>
            
            <div className="absolute top-0 left-1/4 w-1/4 h-1/4 border-orange-300 p-1 text-center">
              <div className="text-xs font-bold text-orange-700">{houses[0].number}</div>
              <div className="text-xs text-gray-600">
                {language === 'hi' ? zodiacNamesHi[houses[0].sign] : zodiacSymbols[houses[0].sign]}
              </div>
              {houses[0].planets.map(planet => (
                <div key={planet} className={`text-xs font-bold ${getPlanetColor(planet)}`}>
                  {language === 'hi' ? planetNamesHi[planet] : planetSymbols[planet]}
                </div>
              ))}
            </div>
            
            <div className="absolute top-0 left-1/2 w-1/4 h-1/4 border-orange-300 p-1 text-center">
              <div className="text-xs font-bold text-orange-700">{houses[1].number}</div>
              <div className="text-xs text-gray-600">
                {language === 'hi' ? zodiacNamesHi[houses[1].sign] : zodiacSymbols[houses[1].sign]}
              </div>
              {houses[1].planets.map(planet => (
                <div key={planet} className={`text-xs font-bold ${getPlanetColor(planet)}`}>
                  {language === 'hi' ? planetNamesHi[planet] : planetSymbols[planet]}
                </div>
              ))}
            </div>
            
            <div className="absolute top-0 left-3/4 w-1/4 h-1/4 border-orange-300 p-1 text-center">
              <div className="text-xs font-bold text-orange-700">{houses[2].number}</div>
              <div className="text-xs text-gray-600">
                {language === 'hi' ? zodiacNamesHi[houses[2].sign] : zodiacSymbols[houses[2].sign]}
              </div>
              {houses[2].planets.map(planet => (
                <div key={planet} className={`text-xs font-bold ${getPlanetColor(planet)}`}>
                  {language === 'hi' ? planetNamesHi[planet] : planetSymbols[planet]}
                </div>
              ))}
            </div>
            
            {/* Left column */}
            <div className="absolute top-1/4 left-0 w-1/4 h-1/4 border-orange-300 p-1 text-center">
              <div className="text-xs font-bold text-orange-700">{houses[10].number}</div>
              <div className="text-xs text-gray-600">
                {language === 'hi' ? zodiacNamesHi[houses[10].sign] : zodiacSymbols[houses[10].sign]}
              </div>
              {houses[10].planets.map(planet => (
                <div key={planet} className={`text-xs font-bold ${getPlanetColor(planet)}`}>
                  {language === 'hi' ? planetNamesHi[planet] : planetSymbols[planet]}
                </div>
              ))}
            </div>
            
            <div className="absolute top-1/2 left-0 w-1/4 h-1/4 border-orange-300 p-1 text-center">
              <div className="text-xs font-bold text-orange-700">{houses[9].number}</div>
              <div className="text-xs text-gray-600">
                {language === 'hi' ? zodiacNamesHi[houses[9].sign] : zodiacSymbols[houses[9].sign]}
              </div>
              {houses[9].planets.map(planet => (
                <div key={planet} className={`text-xs font-bold ${getPlanetColor(planet)}`}>
                  {language === 'hi' ? planetNamesHi[planet] : planetSymbols[planet]}
                </div>
              ))}
            </div>
            
            <div className="absolute top-3/4 left-0 w-1/4 h-1/4 border-orange-300 p-1 text-center">
              <div className="text-xs font-bold text-orange-700">{houses[8].number}</div>
              <div className="text-xs text-gray-600">
                {language === 'hi' ? zodiacNamesHi[houses[8].sign] : zodiacSymbols[houses[8].sign]}
              </div>
              {houses[8].planets.map(planet => (
                <div key={planet} className={`text-xs font-bold ${getPlanetColor(planet)}`}>
                  {language === 'hi' ? planetNamesHi[planet] : planetSymbols[planet]}
                </div>
              ))}
            </div>
            
            {/* Bottom row */}
            <div className="absolute top-3/4 left-1/4 w-1/4 h-1/4 border-orange-300 p-1 text-center">
              <div className="text-xs font-bold text-orange-700">{houses[7].number}</div>
              <div className="text-xs text-gray-600">
                {language === 'hi' ? zodiacNamesHi[houses[7].sign] : zodiacSymbols[houses[7].sign]}
              </div>
              {houses[7].planets.map(planet => (
                <div key={planet} className={`text-xs font-bold ${getPlanetColor(planet)}`}>
                  {language === 'hi' ? planetNamesHi[planet] : planetSymbols[planet]}
                </div>
              ))}
            </div>
            
            <div className="absolute top-3/4 left-1/2 w-1/4 h-1/4 border-orange-300 p-1 text-center">
              <div className="text-xs font-bold text-orange-700">{houses[6].number}</div>
              <div className="text-xs text-gray-600">
                {language === 'hi' ? zodiacNamesHi[houses[6].sign] : zodiacSymbols[houses[6].sign]}
              </div>
              {houses[6].planets.map(planet => (
                <div key={planet} className={`text-xs font-bold ${getPlanetColor(planet)}`}>
                  {language === 'hi' ? planetNamesHi[planet] : planetSymbols[planet]}
                </div>
              ))}
            </div>
            
            <div className="absolute top-3/4 left-3/4 w-1/4 h-1/4 border-orange-300 p-1 text-center">
              <div className="text-xs font-bold text-orange-700">{houses[5].number}</div>
              <div className="text-xs text-gray-600">
                {language === 'hi' ? zodiacNamesHi[houses[5].sign] : zodiacSymbols[houses[5].sign]}
              </div>
              {houses[5].planets.map(planet => (
                <div key={planet} className={`text-xs font-bold ${getPlanetColor(planet)}`}>
                  {language === 'hi' ? planetNamesHi[planet] : planetSymbols[planet]}
                </div>
              ))}
            </div>
            
            {/* Right column */}
            <div className="absolute top-1/2 left-3/4 w-1/4 h-1/4 border-orange-300 p-1 text-center">
              <div className="text-xs font-bold text-orange-700">{houses[4].number}</div>
              <div className="text-xs text-gray-600">
                {language === 'hi' ? zodiacNamesHi[houses[4].sign] : zodiacSymbols[houses[4].sign]}
              </div>
              {houses[4].planets.map(planet => (
                <div key={planet} className={`text-xs font-bold ${getPlanetColor(planet)}`}>
                  {language === 'hi' ? planetNamesHi[planet] : planetSymbols[planet]}
                </div>
              ))}
            </div>
            
            <div className="absolute top-1/4 left-3/4 w-1/4 h-1/4 border-orange-300 p-1 text-center">
              <div className="text-xs font-bold text-orange-700">{houses[3].number}</div>
              <div className="text-xs text-gray-600">
                {language === 'hi' ? zodiacNamesHi[houses[3].sign] : zodiacSymbols[houses[3].sign]}
              </div>
              {houses[3].planets.map(planet => (
                <div key={planet} className={`text-xs font-bold ${getPlanetColor(planet)}`}>
                  {language === 'hi' ? planetNamesHi[planet] : planetSymbols[planet]}
                </div>
              ))}
            </div>
            
            {/* Center area */}
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-orange-800">
                  {language === 'hi' ? 'जन्मपत्री' : 'Birth Chart'}
                </div>
                <div className="flex justify-center space-x-4 mt-1">
                  <div className="flex items-center text-xs">
                    <Sun className="h-3 w-3 mr-1 text-yellow-600" />
                    <span className="text-gray-700">{planets.SU.rashiName}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <Moon className="h-3 w-3 mr-1 text-blue-600" />
                    <span className="text-gray-700">{planets.MO.rashiName}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Legend below chart */}
        <div className="mt-4 bg-orange-50 rounded-lg p-3 border border-orange-200">
          <div className="text-sm font-semibold text-orange-800 mb-2">
            {language === 'hi' ? 'ग्रह सूची:' : 'Planet Legend:'}
          </div>
          <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-xs">
            {Object.entries(planetSymbols).map(([planetId, symbol]) => (
              <div key={planetId} className="flex items-center">
                <span className={`font-bold ${getPlanetColor(planetId)}`}>{symbol}</span>
                <span className="ml-1 text-gray-700">: {planets[planetId]?.name || planetId}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedVisualKundaliChart;
