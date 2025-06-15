
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

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4">
      <Card className="border-orange-200 dark:border-orange-700 shadow-lg">
        <CardHeader className="p-3 sm:p-4 lg:p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30">
          <CardTitle className="text-center text-base sm:text-lg lg:text-xl text-orange-800 dark:text-orange-300">
            {language === 'hi' ? 'कुंडली चार्ट' : 'Kundali Chart'}
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
                      {language === 'hi' ? 'कुंडली' : 'Kundali'}
                    </div>
                    <div className="text-xs sm:text-sm text-orange-600 dark:text-orange-300 mt-1">
                      {language === 'hi' ? 'लग्न:' : 'Asc:'} {chart.ascendant}
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
              {language === 'hi' ? 'ग्रह प्रतीक' : 'Planet Symbols'}
            </h3>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center space-y-1 max-w-md mx-auto">
              <p className="leading-relaxed">
                {language === 'hi' 
                  ? 'यह चार्ट आपके जन्म के समय ग्रहों की स्थिति दिखाता है। प्रत्येक घर जीवन के विभिन्न पहलुओं का प्रतिनिधित्व करता है।'
                  : 'This chart shows the positions of planets at your birth time. Each house represents different aspects of life.'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisualKundaliChart;
