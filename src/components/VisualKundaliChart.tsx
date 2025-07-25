
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KundaliChart, getPlanetDetails } from '@/lib/kundaliUtils';

interface VisualKundaliChartProps {
  chart: KundaliChart;
  language?: 'hi' | 'en';
}

const VisualKundaliChart: React.FC<VisualKundaliChartProps> = ({ chart, language = 'hi' }) => {
  // Convert planets to array if needed
  const planets = Array.isArray(chart.planets) ? chart.planets : Object.values(chart.planets);
  
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
    // Adjust house position based on ascendant
    const adjustedHouse = ((houseNumber - chart.ascendant + 12) % 12) || 12;
    return adjustedHouse;
  };

  // Hindi translations for all chart elements
  const chartTranslations = {
    hi: {
      title: 'कुंडली चार्ट',
      ascendant: 'लग्न',
      description: 'यह चार्ट आपके जन्म के समय ग्रहों की स्थिति दिखाता है। प्रत्येक घर जीवन के विभिन्न पहलुओं का प्रतिनिधित्व करता है।',
      planetSymbols: 'ग्रह प्रतीक',
      houses: {
        1: 'प्रथम भाव - व्यक्तित्व',
        2: 'द्वितीय भाव - धन',
        3: 'तृतीय भाव - भाई-बहन',
        4: 'चतुर्थ भाव - माता',
        5: 'पंचम भाव - संतान',
        6: 'षष्ठ भाव - शत्रु',
        7: 'सप्तम भाव - विवाह',
        8: 'अष्टम भाव - आयु',
        9: 'नवम भाव - भाग्य',
        10: 'दशम भाव - कर्म',
        11: 'एकादश भाव - लाभ',
        12: 'द्वादश भाव - हानि'
      }
    },
    en: {
      title: 'Kundali Chart',
      ascendant: 'Asc',
      description: 'This chart shows the positions of planets at your birth time. Each house represents different aspects of life.',
      planetSymbols: 'Planet Symbols',
      houses: {
        1: '1st House - Self',
        2: '2nd House - Wealth',
        3: '3rd House - Siblings',
        4: '4th House - Mother',
        5: '5th House - Children',
        6: '6th House - Enemies',
        7: '7th House - Marriage',
        8: '8th House - Longevity',
        9: '9th House - Fortune',
        10: '10th House - Career',
        11: '11th House - Gains',
        12: '12th House - Losses'
      }
    }
  };

  const t = chartTranslations[language];

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4">
      <Card className="border-orange-200 dark:border-orange-700 shadow-lg">
        <CardHeader className="p-3 sm:p-4 lg:p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30">
          <CardTitle className="text-center text-base sm:text-lg lg:text-xl text-orange-800 dark:text-orange-300">
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="relative w-full max-w-lg mx-auto">
            {/* Mobile-Responsive Square chart container */}
            <div className="aspect-square border-2 border-orange-500 dark:border-orange-400 relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              {/* Main grid - 4x4 with mobile optimization */}
              <div className="grid grid-cols-4 grid-rows-4 h-full gap-0">
                {/* Top row */}
                <div className="border border-gray-300 dark:border-gray-600 p-1 text-xs bg-orange-50 dark:bg-orange-900/20 flex flex-col items-center justify-center">
                  <div className="font-bold text-center text-orange-700 dark:text-orange-300 text-xs sm:text-sm">{getHousePosition(12)}</div>
                  <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                    {houses[11].planets.map((planet) => {
                      const planetDetails = getPlanetDetails(planet.id);
                      return (
                        <div key={planet.id} className="text-center text-purple-600 dark:text-purple-400 text-xs leading-none">
                          {planetDetails?.symbol}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="border border-gray-300 dark:border-gray-600 p-1 text-xs bg-orange-100 dark:bg-orange-900/30 flex flex-col items-center justify-center">
                  <div className="font-bold text-center text-orange-700 dark:text-orange-300 text-xs sm:text-sm">{getHousePosition(1)}</div>
                  <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                    {houses[0].planets.map((planet) => {
                      const planetDetails = getPlanetDetails(planet.id);
                      return (
                        <div key={planet.id} className="text-center text-purple-600 dark:text-purple-400 text-xs leading-none">
                          {planetDetails?.symbol}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="border border-gray-300 dark:border-gray-600 p-1 text-xs bg-orange-50 dark:bg-orange-900/20 flex flex-col items-center justify-center">
                  <div className="font-bold text-center text-orange-700 dark:text-orange-300 text-xs sm:text-sm">{getHousePosition(2)}</div>
                  <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                    {houses[1].planets.map((planet) => {
                      const planetDetails = getPlanetDetails(planet.id);
                      return (
                        <div key={planet.id} className="text-center text-purple-600 dark:text-purple-400 text-xs leading-none">
                          {planetDetails?.symbol}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="border border-gray-300 dark:border-gray-600 p-1 text-xs bg-orange-50 dark:bg-orange-900/20 flex flex-col items-center justify-center">
                  <div className="font-bold text-center text-orange-700 dark:text-orange-300 text-xs sm:text-sm">{getHousePosition(3)}</div>
                  <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                    {houses[2].planets.map((planet) => {
                      const planetDetails = getPlanetDetails(planet.id);
                      return (
                        <div key={planet.id} className="text-center text-purple-600 dark:text-purple-400 text-xs leading-none">
                          {planetDetails?.symbol}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Second row */}
                <div className="border border-gray-300 dark:border-gray-600 p-1 text-xs bg-orange-50 dark:bg-orange-900/20 flex flex-col items-center justify-center">
                  <div className="font-bold text-center text-orange-700 dark:text-orange-300 text-xs sm:text-sm">{getHousePosition(11)}</div>
                  <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                    {houses[10].planets.map((planet) => {
                      const planetDetails = getPlanetDetails(planet.id);
                      return (
                        <div key={planet.id} className="text-center text-purple-600 dark:text-purple-400 text-xs leading-none">
                          {planetDetails?.symbol}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="col-span-2 row-span-2 border border-orange-400 dark:border-orange-500 bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/40 dark:to-yellow-900/40 flex items-center justify-center">
                  <div className="text-center p-1">
                    <div className="font-bold text-sm sm:text-base lg:text-lg text-orange-800 dark:text-orange-200 leading-tight">
                      {t.title}
                    </div>
                    <div className="text-xs sm:text-sm text-orange-600 dark:text-orange-300 mt-1">
                      {t.ascendant}: {chart.ascendant}
                    </div>
                  </div>
                </div>
                <div className="border border-gray-300 dark:border-gray-600 p-1 text-xs bg-orange-50 dark:bg-orange-900/20 flex flex-col items-center justify-center">
                  <div className="font-bold text-center text-orange-700 dark:text-orange-300 text-xs sm:text-sm">{getHousePosition(4)}</div>
                  <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                    {houses[3].planets.map((planet) => {
                      const planetDetails = getPlanetDetails(planet.id);
                      return (
                        <div key={planet.id} className="text-center text-purple-600 dark:text-purple-400 text-xs leading-none">
                          {planetDetails?.symbol}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Third row */}
                <div className="border border-gray-300 dark:border-gray-600 p-1 text-xs bg-orange-50 dark:bg-orange-900/20 flex flex-col items-center justify-center">
                  <div className="font-bold text-center text-orange-700 dark:text-orange-300 text-xs sm:text-sm">{getHousePosition(10)}</div>
                  <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                    {houses[9].planets.map((planet) => {
                      const planetDetails = getPlanetDetails(planet.id);
                      return (
                        <div key={planet.id} className="text-center text-purple-600 dark:text-purple-400 text-xs leading-none">
                          {planetDetails?.symbol}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="border border-gray-300 dark:border-gray-600 p-1 text-xs bg-orange-50 dark:bg-orange-900/20 flex flex-col items-center justify-center">
                  <div className="font-bold text-center text-orange-700 dark:text-orange-300 text-xs sm:text-sm">{getHousePosition(5)}</div>
                  <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                    {houses[4].planets.map((planet) => {
                      const planetDetails = getPlanetDetails(planet.id);
                      return (
                        <div key={planet.id} className="text-center text-purple-600 dark:text-purple-400 text-xs leading-none">
                          {planetDetails?.symbol}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom row */}
                <div className="border border-gray-300 dark:border-gray-600 p-1 text-xs bg-orange-50 dark:bg-orange-900/20 flex flex-col items-center justify-center">
                  <div className="font-bold text-center text-orange-700 dark:text-orange-300 text-xs sm:text-sm">{getHousePosition(9)}</div>
                  <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                    {houses[8].planets.map((planet) => {
                      const planetDetails = getPlanetDetails(planet.id);
                      return (
                        <div key={planet.id} className="text-center text-purple-600 dark:text-purple-400 text-xs leading-none">
                          {planetDetails?.symbol}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="border border-gray-300 dark:border-gray-600 p-1 text-xs bg-orange-50 dark:bg-orange-900/20 flex flex-col items-center justify-center">
                  <div className="font-bold text-center text-orange-700 dark:text-orange-300 text-xs sm:text-sm">{getHousePosition(8)}</div>
                  <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                    {houses[7].planets.map((planet) => {
                      const planetDetails = getPlanetDetails(planet.id);
                      return (
                        <div key={planet.id} className="text-center text-purple-600 dark:text-purple-400 text-xs leading-none">
                          {planetDetails?.symbol}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="border border-gray-300 dark:border-gray-600 p-1 text-xs bg-orange-50 dark:bg-orange-900/20 flex flex-col items-center justify-center">
                  <div className="font-bold text-center text-orange-700 dark:text-orange-300 text-xs sm:text-sm">{getHousePosition(7)}</div>
                  <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                    {houses[6].planets.map((planet) => {
                      const planetDetails = getPlanetDetails(planet.id);
                      return (
                        <div key={planet.id} className="text-center text-purple-600 dark:text-purple-400 text-xs leading-none">
                          {planetDetails?.symbol}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="border border-gray-300 dark:border-gray-600 p-1 text-xs bg-orange-50 dark:bg-orange-900/20 flex flex-col items-center justify-center">
                  <div className="font-bold text-center text-orange-700 dark:text-orange-300 text-xs sm:text-sm">{getHousePosition(6)}</div>
                  <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                    {houses[5].planets.map((planet) => {
                      const planetDetails = getPlanetDetails(planet.id);
                      return (
                        <div key={planet.id} className="text-center text-purple-600 dark:text-purple-400 text-xs leading-none">
                          {planetDetails?.symbol}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile-Optimized Legend */}
          <div className="mt-4 sm:mt-6">
            <h3 className="text-sm sm:text-base font-semibold text-center mb-3 text-gray-800 dark:text-gray-200">
              {t.planetSymbols}
            </h3>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center space-y-1 max-w-md mx-auto">
              <p className="leading-relaxed">
                {t.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisualKundaliChart;
