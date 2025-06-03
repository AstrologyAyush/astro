
import React from 'react';

interface EnhancedKundaliChartProps {
  chart: any;
  language?: 'hi' | 'en';
}

const EnhancedKundaliChart: React.FC<EnhancedKundaliChartProps> = ({ chart, language = 'hi' }) => {
  if (!chart) {
    return (
      <div className="w-full max-w-md mx-auto aspect-square border-2 border-gray-700 bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">
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

  // Add planets to houses if available
  if (chart.planets) {
    Object.values(chart.planets).forEach((planet: any) => {
      if (planet.house && planet.house >= 1 && planet.house <= 12) {
        houses[planet.house - 1].planets.push(planet);
      }
    });
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Diamond-style Kundali Chart */}
      <div className="relative aspect-square border-2 border-orange-500 bg-gray-900 transform rotate-45">
        <div className="absolute inset-4 grid grid-cols-3 grid-rows-3 gap-0">
          {/* Top row */}
          <div className="border border-gray-600 bg-gray-800 p-1 text-center transform -rotate-45 flex flex-col items-center justify-center">
            <div className="text-orange-400 text-xs font-bold">12</div>
            {houses[11].planets.map((planet: any, idx: number) => (
              <div key={idx} className="text-white text-xs">
                {planet.symbol || planet.name?.[0]}
              </div>
            ))}
          </div>
          <div className="border border-gray-600 bg-gray-800 p-1 text-center transform -rotate-45 flex flex-col items-center justify-center">
            <div className="text-orange-400 text-xs font-bold">1</div>
            {houses[0].planets.map((planet: any, idx: number) => (
              <div key={idx} className="text-white text-xs">
                {planet.symbol || planet.name?.[0]}
              </div>
            ))}
          </div>
          <div className="border border-gray-600 bg-gray-800 p-1 text-center transform -rotate-45 flex flex-col items-center justify-center">
            <div className="text-orange-400 text-xs font-bold">2</div>
            {houses[1].planets.map((planet: any, idx: number) => (
              <div key={idx} className="text-white text-xs">
                {planet.symbol || planet.name?.[0]}
              </div>
            ))}
          </div>

          {/* Middle row */}
          <div className="border border-gray-600 bg-gray-800 p-1 text-center transform -rotate-45 flex flex-col items-center justify-center">
            <div className="text-orange-400 text-xs font-bold">11</div>
            {houses[10].planets.map((planet: any, idx: number) => (
              <div key={idx} className="text-white text-xs">
                {planet.symbol || planet.name?.[0]}
              </div>
            ))}
          </div>
          <div className="bg-gray-700 border border-orange-500 flex items-center justify-center transform -rotate-45">
            <div className="text-center">
              <div className="text-orange-400 text-xs font-bold">
                {language === 'hi' ? 'कुंडली' : 'Kundali'}
              </div>
              <div className="text-white text-xs">
                {chart.ascendant?.name || chart.lagna?.name || 'Asc'}
              </div>
            </div>
          </div>
          <div className="border border-gray-600 bg-gray-800 p-1 text-center transform -rotate-45 flex flex-col items-center justify-center">
            <div className="text-orange-400 text-xs font-bold">3</div>
            {houses[2].planets.map((planet: any, idx: number) => (
              <div key={idx} className="text-white text-xs">
                {planet.symbol || planet.name?.[0]}
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div className="border border-gray-600 bg-gray-800 p-1 text-center transform -rotate-45 flex flex-col items-center justify-center">
            <div className="text-orange-400 text-xs font-bold">10</div>
            {houses[9].planets.map((planet: any, idx: number) => (
              <div key={idx} className="text-white text-xs">
                {planet.symbol || planet.name?.[0]}
              </div>
            ))}
          </div>
          <div className="border border-gray-600 bg-gray-800 p-1 text-center transform -rotate-45 flex flex-col items-center justify-center">
            <div className="text-orange-400 text-xs font-bold">9</div>
            {houses[8].planets.map((planet: any, idx: number) => (
              <div key={idx} className="text-white text-xs">
                {planet.symbol || planet.name?.[0]}
              </div>
            ))}
          </div>
          <div className="border border-gray-600 bg-gray-800 p-1 text-center transform -rotate-45 flex flex-col items-center justify-center">
            <div className="text-orange-400 text-xs font-bold">8</div>
            {houses[7].planets.map((planet: any, idx: number) => (
              <div key={idx} className="text-white text-xs">
                {planet.symbol || planet.name?.[0]}
              </div>
            ))}
          </div>
        </div>

        {/* Outer houses */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 -rotate-45">
          <div className="border border-gray-600 bg-gray-800 p-2 text-center w-16 h-16 flex flex-col items-center justify-center">
            <div className="text-orange-400 text-xs font-bold">4</div>
            {houses[3].planets.map((planet: any, idx: number) => (
              <div key={idx} className="text-white text-xs">
                {planet.symbol || planet.name?.[0]}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 -rotate-45">
          <div className="border border-gray-600 bg-gray-800 p-2 text-center w-16 h-16 flex flex-col items-center justify-center">
            <div className="text-orange-400 text-xs font-bold">5</div>
            {houses[4].planets.map((planet: any, idx: number) => (
              <div key={idx} className="text-white text-xs">
                {planet.symbol || planet.name?.[0]}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 -rotate-45">
          <div className="border border-gray-600 bg-gray-800 p-2 text-center w-16 h-16 flex flex-col items-center justify-center">
            <div className="text-orange-400 text-xs font-bold">6</div>
            {houses[5].planets.map((planet: any, idx: number) => (
              <div key={idx} className="text-white text-xs">
                {planet.symbol || planet.name?.[0]}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 -rotate-45">
          <div className="border border-gray-600 bg-gray-800 p-2 text-center w-16 h-16 flex flex-col items-center justify-center">
            <div className="text-orange-400 text-xs font-bold">7</div>
            {houses[6].planets.map((planet: any, idx: number) => (
              <div key={idx} className="text-white text-xs">
                {planet.symbol || planet.name?.[0]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedKundaliChart;
