
import React, { memo } from 'react';
import MobileOptimizedChart from './MobileOptimizedChart';

interface EnhancedKundaliChartProps {
  chart: any;
  language?: 'hi' | 'en';
}

const EnhancedKundaliChart: React.FC<EnhancedKundaliChartProps> = memo(({ chart, language = 'hi' }) => {
  // Use mobile-optimized chart for better performance
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  if (isMobile) {
    return <MobileOptimizedChart chart={chart} language={language} />;
  }

  // Desktop chart implementation
  if (!chart) {
    return (
      <div className="w-full max-w-sm sm:max-w-md mx-auto aspect-square border-2 border-gray-700 dark:border-gray-500 bg-gray-800 dark:bg-gray-900 rounded-lg flex items-center justify-center">
        <p className="text-gray-400 dark:text-gray-300 text-sm sm:text-base text-center px-4">
          {language === 'hi' ? 'चार्ट लोड हो रहा है...' : 'Loading chart...'}
        </p>
      </div>
    );
  }

  // Create a simplified chart structure for visualization
  const houses = Array.from({ length: 12 }, (_, index) => ({
    number: index + 1,
    planets: []
  }));

  if (chart.planets) {
    Object.values(chart.planets).forEach((planet: any) => {
      if (planet.house && planet.house >= 1 && planet.house <= 12) {
        houses[planet.house - 1].planets.push(planet);
      }
    });
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto p-2 sm:p-4">
      {/* Desktop Diamond-style Kundali Chart */}
      <div className="relative aspect-square border-2 border-orange-500 dark:border-orange-400 bg-gray-900 dark:bg-gray-800 transform rotate-45 rounded-lg overflow-hidden shadow-lg">
        <div className="absolute inset-2 sm:inset-4 grid grid-cols-3 grid-rows-3 gap-0">
          {/* Top row */}
          <div className="border border-gray-600 dark:border-gray-500 bg-gray-800 dark:bg-gray-700 p-0.5 sm:p-1 text-center transform -rotate-45 flex flex-col items-center justify-center">
            <div className="text-orange-400 dark:text-orange-300 text-xs sm:text-sm font-bold">12</div>
            <div className="flex flex-wrap justify-center gap-0.5 mt-1">
              {houses[11].planets.map((planet: any, idx: number) => (
                <div key={idx} className="text-white dark:text-gray-200 text-xs leading-none">
                  {planet.symbol || planet.name?.[0]}
                </div>
              ))}
            </div>
          </div>
          <div className="border border-gray-600 dark:border-gray-500 bg-gray-800 dark:bg-gray-700 p-0.5 sm:p-1 text-center transform -rotate-45 flex flex-col items-center justify-center">
            <div className="text-orange-400 dark:text-orange-300 text-xs sm:text-sm font-bold">1</div>
            <div className="flex flex-wrap justify-center gap-0.5 mt-1">
              {houses[0].planets.map((planet: any, idx: number) => (
                <div key={idx} className="text-white dark:text-gray-200 text-xs leading-none">
                  {planet.symbol || planet.name?.[0]}
                </div>
              ))}
            </div>
          </div>
          <div className="border border-gray-600 dark:border-gray-500 bg-gray-800 dark:bg-gray-700 p-0.5 sm:p-1 text-center transform -rotate-45 flex flex-col items-center justify-center">
            <div className="text-orange-400 dark:text-orange-300 text-xs sm:text-sm font-bold">2</div>
            <div className="flex flex-wrap justify-center gap-0.5 mt-1">
              {houses[1].planets.map((planet: any, idx: number) => (
                <div key={idx} className="text-white dark:text-gray-200 text-xs leading-none">
                  {planet.symbol || planet.name?.[0]}
                </div>
              ))}
            </div>
          </div>

          {/* Middle row */}
          <div className="border border-gray-600 dark:border-gray-500 bg-gray-800 dark:bg-gray-700 p-0.5 sm:p-1 text-center transform -rotate-45 flex flex-col items-center justify-center">
            <div className="text-orange-400 dark:text-orange-300 text-xs sm:text-sm font-bold">11</div>
            <div className="flex flex-wrap justify-center gap-0.5 mt-1">
              {houses[10].planets.map((planet: any, idx: number) => (
                <div key={idx} className="text-white dark:text-gray-200 text-xs leading-none">
                  {planet.symbol || planet.name?.[0]}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-700 dark:bg-gray-600 border border-orange-500 dark:border-orange-400 flex items-center justify-center transform -rotate-45 rounded-sm">
            <div className="text-center p-1">
              <div className="text-orange-400 dark:text-orange-300 text-xs sm:text-sm font-bold leading-tight">
                {language === 'hi' ? 'कुंडली' : 'Kundali'}
              </div>
              <div className="text-white dark:text-gray-200 text-xs leading-tight mt-1">
                {chart.ascendant?.name || chart.lagna?.name || 'Asc'}
              </div>
            </div>
          </div>
          <div className="border border-gray-600 dark:border-gray-500 bg-gray-800 dark:bg-gray-700 p-0.5 sm:p-1 text-center transform -rotate-45 flex flex-col items-center justify-center">
            <div className="text-orange-400 dark:text-orange-300 text-xs sm:text-sm font-bold">3</div>
            <div className="flex flex-wrap justify-center gap-0.5 mt-1">
              {houses[2].planets.map((planet: any, idx: number) => (
                <div key={idx} className="text-white dark:text-gray-200 text-xs leading-none">
                  {planet.symbol || planet.name?.[0]}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div className="border border-gray-600 dark:border-gray-500 bg-gray-800 dark:bg-gray-700 p-0.5 sm:p-1 text-center transform -rotate-45 flex flex-col items-center justify-center">
            <div className="text-orange-400 dark:text-orange-300 text-xs sm:text-sm font-bold">10</div>
            <div className="flex flex-wrap justify-center gap-0.5 mt-1">
              {houses[9].planets.map((planet: any, idx: number) => (
                <div key={idx} className="text-white dark:text-gray-200 text-xs leading-none">
                  {planet.symbol || planet.name?.[0]}
                </div>
              ))}
            </div>
          </div>
          <div className="border border-gray-600 dark:border-gray-500 bg-gray-800 dark:bg-gray-700 p-0.5 sm:p-1 text-center transform -rotate-45 flex flex-col items-center justify-center">
            <div className="text-orange-400 dark:text-orange-300 text-xs sm:text-sm font-bold">9</div>
            <div className="flex flex-wrap justify-center gap-0.5 mt-1">
              {houses[8].planets.map((planet: any, idx: number) => (
                <div key={idx} className="text-white dark:text-gray-200 text-xs leading-none">
                  {planet.symbol || planet.name?.[0]}
                </div>
              ))}
            </div>
          </div>
          <div className="border border-gray-600 dark:border-gray-500 bg-gray-800 dark:bg-gray-700 p-0.5 sm:p-1 text-center transform -rotate-45 flex flex-col items-center justify-center">
            <div className="text-orange-400 dark:text-orange-300 text-xs sm:text-sm font-bold">8</div>
            <div className="flex flex-wrap justify-center gap-0.5 mt-1">
              {houses[7].planets.map((planet: any, idx: number) => (
                <div key={idx} className="text-white dark:text-gray-200 text-xs leading-none">
                  {planet.symbol || planet.name?.[0]}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile-Optimized Outer houses */}
        <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 -rotate-45">
          <div className="border border-gray-600 dark:border-gray-500 bg-gray-800 dark:bg-gray-700 p-1 sm:p-2 text-center w-12 h-12 sm:w-16 sm:h-16 flex flex-col items-center justify-center rounded-sm">
            <div className="text-orange-400 dark:text-orange-300 text-xs sm:text-sm font-bold">4</div>
            <div className="flex flex-wrap justify-center gap-0.5">
              {houses[3].planets.map((planet: any, idx: number) => (
                <div key={idx} className="text-white dark:text-gray-200 text-xs leading-none">
                  {planet.symbol || planet.name?.[0]}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute -right-6 sm:-right-8 top-1/2 transform -translate-y-1/2 -rotate-45">
          <div className="border border-gray-600 dark:border-gray-500 bg-gray-800 dark:bg-gray-700 p-1 sm:p-2 text-center w-12 h-12 sm:w-16 sm:h-16 flex flex-col items-center justify-center rounded-sm">
            <div className="text-orange-400 dark:text-orange-300 text-xs sm:text-sm font-bold">5</div>
            <div className="flex flex-wrap justify-center gap-0.5">
              {houses[4].planets.map((planet: any, idx: number) => (
                <div key={idx} className="text-white dark:text-gray-200 text-xs leading-none">
                  {planet.symbol || planet.name?.[0]}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 transform -translate-x-1/2 -rotate-45">
          <div className="border border-gray-600 dark:border-gray-500 bg-gray-800 dark:bg-gray-700 p-1 sm:p-2 text-center w-12 h-12 sm:w-16 sm:h-16 flex flex-col items-center justify-center rounded-sm">
            <div className="text-orange-400 dark:text-orange-300 text-xs sm:text-sm font-bold">6</div>
            <div className="flex flex-wrap justify-center gap-0.5">
              {houses[5].planets.map((planet: any, idx: number) => (
                <div key={idx} className="text-white dark:text-gray-200 text-xs leading-none">
                  {planet.symbol || planet.name?.[0]}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute -left-6 sm:-left-8 top-1/2 transform -translate-y-1/2 -rotate-45">
          <div className="border border-gray-600 dark:border-gray-500 bg-gray-800 dark:bg-gray-700 p-1 sm:p-2 text-center w-12 h-12 sm:w-16 sm:h-16 flex flex-col items-center justify-center rounded-sm">
            <div className="text-orange-400 dark:text-orange-300 text-xs sm:text-sm font-bold">7</div>
            <div className="flex flex-wrap justify-center gap-0.5">
              {houses[6].planets.map((planet: any, idx: number) => (
                <div key={idx} className="text-white dark:text-gray-200 text-xs leading-none">
                  {planet.symbol || planet.name?.[0]}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          {language === 'hi' 
            ? 'हीरे के आकार की कुंडली चार्ट' 
            : 'Diamond-shaped Kundali Chart'
          }
        </p>
      </div>
    </div>
  );
});

EnhancedKundaliChart.displayName = 'EnhancedKundaliChart';

export default EnhancedKundaliChart;
