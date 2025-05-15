
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanetPosition, calculateActiveDasha, DASHA_PERIODS, getPlanetDetails, NAKSHATRAS } from '@/lib/kundaliUtils';

interface DashaDisplayProps {
  moonPosition: PlanetPosition;
  birthDate: Date;
}

const DashaDisplay: React.FC<DashaDisplayProps> = ({ moonPosition, birthDate }) => {
  const nakshatraId = moonPosition.nakshatra || 1;
  const nakshatra = NAKSHATRAS[nakshatraId - 1];
  const lordId = nakshatra?.ruler || "JU";
  const lordPlanet = getPlanetDetails(lordId);
  const dashaPeriod = DASHA_PERIODS[lordId as keyof typeof DASHA_PERIODS] || 0;
  
  // Calculate a simple dasha sequence (in real application, this would be more complex)
  const dashSequence = ["SU", "MO", "MA", "RA", "JU", "SA", "ME", "KE", "VE"];
  const startIndex = dashSequence.indexOf(lordId);
  const sequence = [...dashSequence.slice(startIndex), ...dashSequence.slice(0, startIndex)];
  
  // Calculate rough dates (simplified for demo)
  const calculateEndDate = (startDate: Date, yearsPeriod: number) => {
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + yearsPeriod);
    return endDate;
  };
  
  let currentDate = new Date(birthDate);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vimshottari Dasha Periods</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm">
          Your birth Moon is in <strong>{nakshatra?.name}</strong> Nakshatra, 
          ruled by <strong>{lordPlanet?.name}</strong>.
        </p>
        
        <div className="space-y-4">
          {sequence.slice(0, 5).map((planetId, index) => {
            const planet = getPlanetDetails(planetId);
            const years = DASHA_PERIODS[planetId as keyof typeof DASHA_PERIODS] || 0;
            const startDate = new Date(currentDate);
            const endDate = calculateEndDate(currentDate, years);
            currentDate = new Date(endDate);
            
            return (
              <div key={planetId} className="flex items-center space-x-2">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full 
                  ${index === 0 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                  {planet?.symbol}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{planet?.name} Dasha</span>
                    <span className="text-sm text-muted-foreground">{years} years</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {startDate.getFullYear()} to {endDate.getFullYear()}
                  </div>
                </div>
              </div>
            );
          })}
          
          <div className="pt-2 text-xs text-muted-foreground">
            Note: This is a simplified calculation. Actual Dasha calculations include sub-periods.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashaDisplay;
