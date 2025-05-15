
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { KundaliChart as KundaliChartType, PlanetPosition, ZODIAC_SIGNS, getPlanetsInHouse, getZodiacDetails, getPlanetDetails } from '@/lib/kundaliUtils';

interface KundaliChartProps {
  chart: KundaliChartType;
}

const KundaliChart: React.FC<KundaliChartProps> = ({ chart }) => {
  const { ascendant, planets, housesList } = chart;

  // Create a 12-house chart layout (traditional North Indian style)
  const createHouse = (houseNumber: number) => {
    const sign = housesList[houseNumber - 1];
    const zodiacDetails = getZodiacDetails(sign);
    const planetsInHouse = getPlanetsInHouse(planets, housesList, houseNumber);
    
    return (
      <div className={`kundali-house kundali-house-${houseNumber}`} key={`house-${houseNumber}`}>
        <div className="text-xs font-semibold mb-1">
          भाव {houseNumber} <span className="text-muted-foreground">({zodiacDetails.sanskrit})</span>
        </div>
        <div className="zodiac-symbol" style={{ color: `var(--astrology-${zodiacDetails.name.toLowerCase()})` }}>
          {zodiacDetails.symbol}
        </div>
        <div className="flex flex-col">
          <span className="text-xs mb-1">{zodiacDetails.name}</span>
          <span className="text-[10px] text-muted-foreground">{zodiacDetails.sanskrit}</span>
        </div>
        {planetsInHouse.length > 0 && (
          <div className="planets-container text-xs mt-1 flex flex-wrap gap-1">
            {planetsInHouse.map(planet => {
              const planetDetails = getPlanetDetails(planet.id);
              return (
                <span 
                  key={planet.id} 
                  className="planet-symbol inline-flex items-center justify-center"
                  title={`${planetDetails?.sanskrit} (${planetDetails?.name}) ${planet.isRetrograde ? 'वक्री' : ''}`}
                >
                  <span className="mr-1 text-primary">{planetDetails?.symbol}</span>
                  <span className="text-[10px]">{planetDetails?.sanskrit}</span>
                  {planet.isRetrograde && <sup className="text-amber-500">व</sup>}
                </span>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Generate all 12 houses for complete chart
  const houseElements = [
    createHouse(1),  // Ascendant/Lagna
    createHouse(4),  // 4th house
    createHouse(7),  // 7th house
    createHouse(10), // 10th house
    createHouse(2),  // 2nd house
    createHouse(5),  // 5th house
    createHouse(8),  // 8th house
    createHouse(11), // 11th house
    createHouse(3),  // 3rd house
    createHouse(6),  // 6th house
    createHouse(9),  // 9th house
    createHouse(12), // 12th house
  ];

  const ascendantSign = getZodiacDetails(ascendant);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">कुंडली चार्ट</h3>
          <div className="text-sm">
            लग्न: <span className="font-medium">{ascendantSign.sanskrit}</span> ({ascendantSign.name}) 
            <span className="ml-1 text-muted-foreground">
              {ascendantSign.element} तत्व
            </span>
          </div>
        </div>
        
        <div className="chart-container">
          <div className="kundali-chart bg-card">
            <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
              <div className="animate-spin-slow opacity-20">✨</div>
            </div>
            <div className="kundali-grid">
              {houseElements}
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm">
          <h4 className="font-medium mb-1">चार्ट विवरण:</h4>
          <p className="text-muted-foreground text-xs">
            यह कुंडली उत्तर भारतीय शैली में दिखाई गई है। प्रत्येक भाव (House) में स्थित ग्रह जन्म के समय की स्थिति दर्शाते हैं।
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default KundaliChart;
