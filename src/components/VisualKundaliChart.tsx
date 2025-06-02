
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
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'hi' ? 'कुंडली चार्ट' : 'Kundali Chart'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full max-w-md mx-auto">
          {/* Square chart container */}
          <div className="aspect-square border-2 border-primary relative">
            {/* Main grid - 4x4 */}
            <div className="grid grid-cols-4 grid-rows-4 h-full">
              {/* Top row */}
              <div className="border border-muted-foreground p-1 text-xs bg-card/50">
                <div className="font-bold text-center">{getHousePosition(12)}</div>
                {houses[11].planets.map((planet) => {
                  const planetDetails = getPlanetDetails(planet.id);
                  return (
                    <div key={planet.id} className="text-center text-primary">
                      {planetDetails?.symbol}
                    </div>
                  );
                })}
              </div>
              <div className="border border-muted-foreground p-1 text-xs bg-card/50">
                <div className="font-bold text-center">{getHousePosition(1)}</div>
                {houses[0].planets.map((planet) => {
                  const planetDetails = getPlanetDetails(planet.id);
                  return (
                    <div key={planet.id} className="text-center text-primary">
                      {planetDetails?.symbol}
                    </div>
                  );
                })}
              </div>
              <div className="border border-muted-foreground p-1 text-xs bg-card/50">
                <div className="font-bold text-center">{getHousePosition(2)}</div>
                {houses[1].planets.map((planet) => {
                  const planetDetails = getPlanetDetails(planet.id);
                  return (
                    <div key={planet.id} className="text-center text-primary">
                      {planetDetails?.symbol}
                    </div>
                  );
                })}
              </div>
              <div className="border border-muted-foreground p-1 text-xs bg-card/50">
                <div className="font-bold text-center">{getHousePosition(3)}</div>
                {houses[2].planets.map((planet) => {
                  const planetDetails = getPlanetDetails(planet.id);
                  return (
                    <div key={planet.id} className="text-center text-primary">
                      {planetDetails?.symbol}
                    </div>
                  );
                })}
              </div>

              {/* Second row */}
              <div className="border border-muted-foreground p-1 text-xs bg-card/50">
                <div className="font-bold text-center">{getHousePosition(11)}</div>
                {houses[10].planets.map((planet) => {
                  const planetDetails = getPlanetDetails(planet.id);
                  return (
                    <div key={planet.id} className="text-center text-primary">
                      {planetDetails?.symbol}
                    </div>
                  );
                })}
              </div>
              <div className="col-span-2 row-span-2 border border-muted-foreground bg-muted/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-bold text-lg">
                    {language === 'hi' ? 'कुंडली' : 'Kundali'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'hi' ? 'लग्न:' : 'Asc:'} {chart.ascendant}
                  </div>
                </div>
              </div>
              <div className="border border-muted-foreground p-1 text-xs bg-card/50">
                <div className="font-bold text-center">{getHousePosition(4)}</div>
                {houses[3].planets.map((planet) => {
                  const planetDetails = getPlanetDetails(planet.id);
                  return (
                    <div key={planet.id} className="text-center text-primary">
                      {planetDetails?.symbol}
                    </div>
                  );
                })}
              </div>

              {/* Third row */}
              <div className="border border-muted-foreground p-1 text-xs bg-card/50">
                <div className="font-bold text-center">{getHousePosition(10)}</div>
                {houses[9].planets.map((planet) => {
                  const planetDetails = getPlanetDetails(planet.id);
                  return (
                    <div key={planet.id} className="text-center text-primary">
                      {planetDetails?.symbol}
                    </div>
                  );
                })}
              </div>
              <div className="border border-muted-foreground p-1 text-xs bg-card/50">
                <div className="font-bold text-center">{getHousePosition(5)}</div>
                {houses[4].planets.map((planet) => {
                  const planetDetails = getPlanetDetails(planet.id);
                  return (
                    <div key={planet.id} className="text-center text-primary">
                      {planetDetails?.symbol}
                    </div>
                  );
                })}
              </div>

              {/* Bottom row */}
              <div className="border border-muted-foreground p-1 text-xs bg-card/50">
                <div className="font-bold text-center">{getHousePosition(9)}</div>
                {houses[8].planets.map((planet) => {
                  const planetDetails = getPlanetDetails(planet.id);
                  return (
                    <div key={planet.id} className="text-center text-primary">
                      {planetDetails?.symbol}
                    </div>
                  );
                })}
              </div>
              <div className="border border-muted-foreground p-1 text-xs bg-card/50">
                <div className="font-bold text-center">{getHousePosition(8)}</div>
                {houses[7].planets.map((planet) => {
                  const planetDetails = getPlanetDetails(planet.id);
                  return (
                    <div key={planet.id} className="text-center text-primary">
                      {planetDetails?.symbol}
                    </div>
                  );
                })}
              </div>
              <div className="border border-muted-foreground p-1 text-xs bg-card/50">
                <div className="font-bold text-center">{getHousePosition(7)}</div>
                {houses[6].planets.map((planet) => {
                  const planetDetails = getPlanetDetails(planet.id);
                  return (
                    <div key={planet.id} className="text-center text-primary">
                      {planetDetails?.symbol}
                    </div>
                  );
                })}
              </div>
              <div className="border border-muted-foreground p-1 text-xs bg-card/50">
                <div className="font-bold text-center">{getHousePosition(6)}</div>
                {houses[5].planets.map((planet) => {
                  const planetDetails = getPlanetDetails(planet.id);
                  return (
                    <div key={planet.id} className="text-center text-primary">
                      {planetDetails?.symbol}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualKundaliChart;
