
import React, { memo } from 'react';

interface MobileOptimizedChartProps {
  chart: any;
  language?: 'hi' | 'en';
}

const MobileOptimizedChart: React.FC<MobileOptimizedChartProps> = memo(({ chart, language = 'hi' }) => {
  if (!chart) {
    return (
      <div className="w-full max-w-xs mx-auto aspect-square border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center px-2">
          {language === 'hi' ? 'चार्ट लोड हो रहा है...' : 'Loading chart...'}
        </p>
      </div>
    );
  }

  // Create a simplified chart structure for mobile
  const houses = Array.from({ length: 12 }, (_, index) => ({
    number: index + 1,
    planets: []
  }));

  // Add planets to houses if available
  if (chart.planets) {
    Object.values(chart.planets).forEach((planet: any) => {
      if (planet.house && planet.house >= 1 && planet.house <= 12) {
        houses[planet.house - 1].planets.push(planet);
      }
    });
  }

  return (
    <div className="w-full max-w-xs sm:max-w-sm mx-auto p-2">
      {/* Mobile-First Simple Chart */}
      <div className="relative aspect-square border border-orange-400 dark:border-orange-500 bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 grid-rows-3 h-full gap-px bg-gray-200 dark:bg-gray-700">
          {/* Simplified 3x3 grid for mobile */}
          {Array.from({ length: 9 }, (_, index) => {
            const houseMap = [12, 1, 2, 11, 0, 3, 10, 9, 8]; // Center is 0 (not a house)
            const houseNumber = houseMap[index];
            
            if (houseNumber === 0) {
              // Center cell
              return (
                <div key={index} className="bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-orange-600 dark:text-orange-400 text-xs font-bold">
                      {language === 'hi' ? 'कुंडली' : 'Chart'}
                    </div>
                  </div>
                </div>
              );
            }

            const house = houses[houseNumber - 1];
            return (
              <div key={index} className="bg-white dark:bg-gray-800 p-1 flex flex-col items-center justify-center text-center border border-gray-100 dark:border-gray-700">
                <div className="text-orange-600 dark:text-orange-400 text-xs font-bold mb-1">
                  {houseNumber}
                </div>
                <div className="flex flex-wrap justify-center gap-px">
                  {house.planets.slice(0, 2).map((planet: any, idx: number) => (
                    <div key={idx} className="text-purple-600 dark:text-purple-400 text-xs">
                      {planet.symbol || planet.name?.[0] || '•'}
                    </div>
                  ))}
                  {house.planets.length > 2 && (
                    <div className="text-purple-600 dark:text-purple-400 text-xs">+</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Info */}
      <div className="mt-2 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {language === 'hi' 
            ? 'मोबाइल कुंडली चार्ट' 
            : 'Mobile Kundali Chart'
          }
        </p>
      </div>
    </div>
  );
});

MobileOptimizedChart.displayName = 'MobileOptimizedChart';

export default MobileOptimizedChart;
