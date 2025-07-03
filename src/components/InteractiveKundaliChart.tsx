
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { getPlanetDetails } from '@/lib/kundaliUtils';

interface Planet {
  id: string;
  name: string;
  house: number;
  rashi: number;
  degree: number;
  degreeInSign: number;
  rashiName: string;
  nakshatraName: string;
  nakshatraPada: number;
  isExalted?: boolean;
  isDebilitated?: boolean;
  ownSign?: boolean;
  isRetrograde?: boolean;
}

interface InteractiveKundaliChartProps {
  planets: Planet[];
  ascendant: number;
  language?: 'hi' | 'en';
}

const InteractiveKundaliChart: React.FC<InteractiveKundaliChartProps> = ({
  planets,
  ascendant,
  language = 'en'
}) => {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<Planet | null>(null);

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  // Create houses array with planets
  const houses = Array.from({ length: 12 }, (_, index) => {
    const houseNumber = index + 1;
    const planetsInHouse = planets.filter(planet => planet.house === houseNumber);
    return {
      number: houseNumber,
      planets: planetsInHouse
    };
  });

  // Calculate house position based on ascendant
  const getHousePosition = (houseNumber: number) => {
    const adjustedHouse = ((houseNumber - ascendant + 12) % 12) || 12;
    return adjustedHouse;
  };

  // House meanings for better understanding
  const houseTranslations = {
    hi: {
      1: 'स्वयं - व्यक्तित्व',
      2: 'धन - पैसा',
      3: 'भाई-बहन - साहस',
      4: 'माता - घर',
      5: 'संतान - शिक्षा',
      6: 'शत्रु - रोग',
      7: 'जीवनसाथी - विवाह',
      8: 'आयु - गुप्त बातें',
      9: 'भाग्य - धर्म',
      10: 'कर्म - नौकरी',
      11: 'लाभ - आय',
      12: 'हानि - खर्च'
    },
    en: {
      1: 'Self - Personality',
      2: 'Wealth - Money',
      3: 'Siblings - Courage',
      4: 'Mother - Home',
      5: 'Children - Education',
      6: 'Enemies - Health',
      7: 'Spouse - Marriage',
      8: 'Longevity - Secrets',
      9: 'Fortune - Religion',
      10: 'Career - Job',
      11: 'Gains - Income',
      12: 'Losses - Expenses'
    }
  };

  // Handle planet click
  const handlePlanetClick = (planet: Planet) => {
    setSelectedPlanet(selectedPlanet?.id === planet.id ? null : planet);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <Card className="border-orange-200 dark:border-orange-700 shadow-lg overflow-hidden">
        <CardHeader className="p-3 sm:p-4 lg:p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30">
          <CardTitle className="text-center text-base sm:text-lg lg:text-xl text-orange-800 dark:text-orange-300">
            {getTranslation('Simple Kundali Chart', 'सरल कुंडली चार्ट')}
          </CardTitle>
          <p className="text-center text-sm text-orange-600 dark:text-orange-400">
            {getTranslation('Click on any house to learn its meaning', 'किसी भी भाव पर क्लिक करके उसका अर्थ जानें')}
          </p>
        </CardHeader>
        
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="relative w-full max-w-lg mx-auto">
            {/* Simple 3x3 Chart Grid */}
            <div className="aspect-square border-2 border-orange-500 dark:border-orange-400 relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              <div className="grid grid-cols-3 grid-rows-3 h-full gap-1 p-2">
                {/* House 12 */}
                <div className="border border-gray-300 dark:border-gray-600 p-2 bg-orange-50 dark:bg-orange-900/20 flex flex-col items-center justify-center relative rounded">
                  <div className="absolute top-1 left-1 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">12</div>
                  <div className="text-xs text-center mt-6 text-gray-600 dark:text-gray-400">{houseTranslations[language][12]}</div>
                  <div className="flex flex-wrap justify-center gap-1 mt-1">
                    {houses[11].planets.map((planet, idx) => (
                      <span key={idx} className="text-purple-600 text-lg cursor-pointer" onClick={() => handlePlanetClick(planet)} title={planet.name}>
                        {getPlanetDetails(planet.id)?.symbol}
                      </span>
                    ))}
                  </div>
                </div>

                {/* House 1 */}
                <div className="border border-gray-300 dark:border-gray-600 p-2 bg-green-50 dark:bg-green-900/20 flex flex-col items-center justify-center relative rounded">
                  <div className="absolute top-1 left-1 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <div className="text-xs text-center mt-6 text-gray-600 dark:text-gray-400">{houseTranslations[language][1]}</div>
                  <div className="flex flex-wrap justify-center gap-1 mt-1">
                    {houses[0].planets.map((planet, idx) => (
                      <span key={idx} className="text-purple-600 text-lg cursor-pointer" onClick={() => handlePlanetClick(planet)} title={planet.name}>
                        {getPlanetDetails(planet.id)?.symbol}
                      </span>
                    ))}
                  </div>
                </div>

                {/* House 2 */}
                <div className="border border-gray-300 dark:border-gray-600 p-2 bg-orange-50 dark:bg-orange-900/20 flex flex-col items-center justify-center relative rounded">
                  <div className="absolute top-1 left-1 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <div className="text-xs text-center mt-6 text-gray-600 dark:text-gray-400">{houseTranslations[language][2]}</div>
                  <div className="flex flex-wrap justify-center gap-1 mt-1">
                    {houses[1].planets.map((planet, idx) => (
                      <span key={idx} className="text-purple-600 text-lg cursor-pointer" onClick={() => handlePlanetClick(planet)} title={planet.name}>
                        {getPlanetDetails(planet.id)?.symbol}
                      </span>
                    ))}
                  </div>
                </div>

                {/* House 11 */}
                <div className="border border-gray-300 dark:border-gray-600 p-2 bg-orange-50 dark:bg-orange-900/20 flex flex-col items-center justify-center relative rounded">
                  <div className="absolute top-1 left-1 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">11</div>
                  <div className="text-xs text-center mt-6 text-gray-600 dark:text-gray-400">{houseTranslations[language][11]}</div>
                  <div className="flex flex-wrap justify-center gap-1 mt-1">
                    {houses[10].planets.map((planet, idx) => (
                      <span key={idx} className="text-purple-600 text-lg cursor-pointer" onClick={() => handlePlanetClick(planet)} title={planet.name}>
                        {getPlanetDetails(planet.id)?.symbol}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Center - Ascendant */}
                <div className="border-2 border-yellow-500 dark:border-yellow-400 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/40 dark:to-orange-900/40 flex items-center justify-center rounded">
                  <div className="text-center">
                    <div className="text-sm font-bold text-yellow-800 dark:text-yellow-300">{getTranslation('Ascendant', 'लग्न')}</div>
                    <div className="text-lg font-bold text-yellow-700 dark:text-yellow-200">{ascendant}</div>
                  </div>
                </div>

                {/* House 3 */}
                <div className="border border-gray-300 dark:border-gray-600 p-2 bg-orange-50 dark:bg-orange-900/20 flex flex-col items-center justify-center relative rounded">
                  <div className="absolute top-1 left-1 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <div className="text-xs text-center mt-6 text-gray-600 dark:text-gray-400">{houseTranslations[language][3]}</div>
                  <div className="flex flex-wrap justify-center gap-1 mt-1">
                    {houses[2].planets.map((planet, idx) => (
                      <span key={idx} className="text-purple-600 text-lg cursor-pointer" onClick={() => handlePlanetClick(planet)} title={planet.name}>
                        {getPlanetDetails(planet.id)?.symbol}
                      </span>
                    ))}
                  </div>
                </div>

                {/* House 10 */}
                <div className="border border-gray-300 dark:border-gray-600 p-2 bg-blue-50 dark:bg-blue-900/20 flex flex-col items-center justify-center relative rounded">
                  <div className="absolute top-1 left-1 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">10</div>
                  <div className="text-xs text-center mt-6 text-gray-600 dark:text-gray-400">{houseTranslations[language][10]}</div>
                  <div className="flex flex-wrap justify-center gap-1 mt-1">
                    {houses[9].planets.map((planet, idx) => (
                      <span key={idx} className="text-purple-600 text-lg cursor-pointer" onClick={() => handlePlanetClick(planet)} title={planet.name}>
                        {getPlanetDetails(planet.id)?.symbol}
                      </span>
                    ))}
                  </div>
                </div>

                {/* House 9 */}
                <div className="border border-gray-300 dark:border-gray-600 p-2 bg-orange-50 dark:bg-orange-900/20 flex flex-col items-center justify-center relative rounded">
                  <div className="absolute top-1 left-1 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">9</div>
                  <div className="text-xs text-center mt-6 text-gray-600 dark:text-gray-400">{houseTranslations[language][9]}</div>
                  <div className="flex flex-wrap justify-center gap-1 mt-1">
                    {houses[8].planets.map((planet, idx) => (
                      <span key={idx} className="text-purple-600 text-lg cursor-pointer" onClick={() => handlePlanetClick(planet)} title={planet.name}>
                        {getPlanetDetails(planet.id)?.symbol}
                      </span>
                    ))}
                  </div>
                </div>

                {/* House 4 */}
                <div className="border border-gray-300 dark:border-gray-600 p-2 bg-pink-50 dark:bg-pink-900/20 flex flex-col items-center justify-center relative rounded">
                  <div className="absolute top-1 left-1 w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                  <div className="text-xs text-center mt-6 text-gray-600 dark:text-gray-400">{houseTranslations[language][4]}</div>
                  <div className="flex flex-wrap justify-center gap-1 mt-1">
                    {houses[3].planets.map((planet, idx) => (
                      <span key={idx} className="text-purple-600 text-lg cursor-pointer" onClick={() => handlePlanetClick(planet)} title={planet.name}>
                        {getPlanetDetails(planet.id)?.symbol}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional houses in corners */}
            <div className="absolute -top-8 -right-8 w-16 h-16 border border-gray-300 bg-orange-50 dark:bg-orange-900/20 rounded flex flex-col items-center justify-center">
              <div className="text-xs font-bold text-orange-500">5</div>
              <div className="text-xs text-center text-gray-600">{houseTranslations[language][5].split(' - ')[0]}</div>
              <div className="flex gap-1 mt-1">
                {houses[4].planets.map((planet, idx) => (
                  <span key={idx} className="text-purple-600 text-sm cursor-pointer" onClick={() => handlePlanetClick(planet)}>
                    {getPlanetDetails(planet.id)?.symbol}
                  </span>
                ))}
              </div>
            </div>

            <div className="absolute -bottom-8 -right-8 w-16 h-16 border border-gray-300 bg-orange-50 dark:bg-orange-900/20 rounded flex flex-col items-center justify-center">
              <div className="text-xs font-bold text-orange-500">6</div>
              <div className="text-xs text-center text-gray-600">{houseTranslations[language][6].split(' - ')[0]}</div>
              <div className="flex gap-1 mt-1">
                {houses[5].planets.map((planet, idx) => (
                  <span key={idx} className="text-purple-600 text-sm cursor-pointer" onClick={() => handlePlanetClick(planet)}>
                    {getPlanetDetails(planet.id)?.symbol}
                  </span>
                ))}
              </div>
            </div>

            <div className="absolute -bottom-8 -left-8 w-16 h-16 border border-gray-300 bg-red-50 dark:bg-red-900/20 rounded flex flex-col items-center justify-center">
              <div className="text-xs font-bold text-red-500">7</div>
              <div className="text-xs text-center text-gray-600">{houseTranslations[language][7].split(' - ')[0]}</div>
              <div className="flex gap-1 mt-1">
                {houses[6].planets.map((planet, idx) => (
                  <span key={idx} className="text-purple-600 text-sm cursor-pointer" onClick={() => handlePlanetClick(planet)}>
                    {getPlanetDetails(planet.id)?.symbol}
                  </span>
                ))}
              </div>
            </div>

            <div className="absolute -top-8 -left-8 w-16 h-16 border border-gray-300 bg-orange-50 dark:bg-orange-900/20 rounded flex flex-col items-center justify-center">
              <div className="text-xs font-bold text-orange-500">8</div>
              <div className="text-xs text-center text-gray-600">{houseTranslations[language][8].split(' - ')[0]}</div>
              <div className="flex gap-1 mt-1">
                {houses[7].planets.map((planet, idx) => (
                  <span key={idx} className="text-purple-600 text-sm cursor-pointer" onClick={() => handlePlanetClick(planet)}>
                    {getPlanetDetails(planet.id)?.symbol}
                  </span>
                ))}
              </div>
            </div>

            {/* Simple hover tooltip */}
            {hoveredPlanet && (
              <div className="absolute top-4 left-4 bg-black/80 text-white p-2 rounded-lg text-sm z-50 pointer-events-none">
                <div className="font-bold">{hoveredPlanet.name}</div>
                <div>{getTranslation('House', 'भाव')}: {hoveredPlanet.house}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Planet Details Panel */}
      {selectedPlanet && (
        <Card className="border-purple-200 dark:border-purple-700 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30">
            <CardTitle className="text-purple-800 dark:text-purple-300 flex items-center gap-2">
              <span className="text-xl">{getPlanetDetails(selectedPlanet.id)?.symbol}</span>
              {selectedPlanet.name} {getTranslation('Details', 'विवरण')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{getTranslation('House', 'भाव')}:</span>
                  <span>{selectedPlanet.house}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{getTranslation('Sign', 'राशि')}:</span>
                  <span>{selectedPlanet.rashiName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{getTranslation('Degree', 'अंश')}:</span>
                  <span>{selectedPlanet.degreeInSign.toFixed(2)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{getTranslation('Nakshatra', 'नक्षत्र')}:</span>
                  <span>{selectedPlanet.nakshatraName} ({getTranslation('Pada', 'पद')} {selectedPlanet.nakshatraPada})</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {selectedPlanet.isExalted && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      {getTranslation('Exalted', 'उच्च')}
                    </span>
                  )}
                  {selectedPlanet.isDebilitated && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                      {getTranslation('Debilitated', 'नीच')}
                    </span>
                  )}
                  {selectedPlanet.ownSign && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {getTranslation('Own Sign', 'स्व राशि')}
                    </span>
                  )}
                  {selectedPlanet.isRetrograde && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                      {getTranslation('Retrograde', 'वक्री')}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setSelectedPlanet(null)}
              className="mt-4 w-full"
            >
              {getTranslation('Close Details', 'विवरण बंद करें')}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
            {getTranslation('How to use Interactive Chart', 'इंटरैक्टिव चार्ट का उपयोग कैसे करें')}
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• {getTranslation('Click on any planet symbol to see detailed information', 'विस्तृत जानकारी देखने के लिए किसी भी ग्रह चिह्न पर क्लिक करें')}</li>
            <li>• {getTranslation('Hover over planets to see quick info', 'त्वरित जानकारी देखने के लिए ग्रहों पर होवर करें')}</li>
            <li>• {getTranslation('Use zoom controls for better viewing on mobile', 'मोबाइल पर बेहतर देखने के लिए ज़ूम नियंत्रण का उपयोग करें')}</li>
            <li>• {getTranslation('Drag the chart to pan around when zoomed in', 'ज़ूम इन करने पर चार्ट को घुमाने के लिए ड्रैग करें')}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveKundaliChart;
