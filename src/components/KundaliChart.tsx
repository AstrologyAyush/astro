
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { KundaliChart as KundaliChartType, PlanetPosition, ZODIAC_SIGNS, getPlanetsInHouse, getZodiacDetails, getPlanetDetails } from '@/lib/kundaliUtils';

interface KundaliChartProps {
  chart: KundaliChartType;
}

const KundaliChart: React.FC<KundaliChartProps> = ({ chart }) => {
  const { ascendant, planets, houses } = chart;

  // Create a 12-house chart layout (traditional North Indian style)
  const createHouse = (houseNumber: number) => {
    const sign = houses[houseNumber - 1];
    const zodiacDetails = getZodiacDetails(sign);
    const planetsInHouse = getPlanetsInHouse(planets, houses, houseNumber);
    
    return (
      <div className={`kundali-house kundali-house-${houseNumber}`}>
        <div className="text-xs font-semibold mb-1">House {houseNumber}</div>
        <div className="zodiac-symbol" style={{ color: `var(--astrology-${zodiacDetails.name.toLowerCase()})` }}>
          {zodiacDetails.symbol}
        </div>
        <div className="text-xs mb-2">{zodiacDetails.name}</div>
        {planetsInHouse.length > 0 && (
          <div className="planets-container text-xs">
            {planetsInHouse.map(planet => {
              const planetDetails = getPlanetDetails(planet.id);
              return (
                <span 
                  key={planet.id} 
                  className="planet-symbol" 
                  title={`${planetDetails?.name} ${planet.isRetrograde ? '(R)' : ''}`}
                >
                  {planetDetails?.symbol}
                  {planet.isRetrograde && 'ᴿ'}
                </span>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // North Indian style chart (simplified for demo purposes)
  const houseElements = [
    createHouse(1),  // Ascendant
    createHouse(4),  // 4th house
    createHouse(7),  // 7th house
    createHouse(10), // 10th house
  ];

  const ascendantSign = getZodiacDetails(ascendant);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">Kundali Chart</h3>
          <div className="text-sm text-muted-foreground">
            Ascendant: {ascendantSign.name} ({ascendantSign.sanskrit})
          </div>
        </div>
        
        <div className="chart-container">
          <div className="kundali-chart bg-card">
            <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
              <div className="animate-spin-slow opacity-20">✨</div>
            </div>
            {houseElements}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KundaliChart;
