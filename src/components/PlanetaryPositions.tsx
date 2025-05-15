
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanetPosition, ZODIAC_SIGNS, PLANETS, NAKSHATRAS, calculatePlanetaryStrength } from '@/lib/kundaliUtils';

interface PlanetaryPositionsProps {
  planets: PlanetPosition[];
}

const PlanetaryPositions: React.FC<PlanetaryPositionsProps> = ({ planets }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Planetary Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Planet</TableHead>
              <TableHead>Sign</TableHead>
              <TableHead>Nakshatra</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Strength</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {planets.map((planet) => {
              const zodiacSign = ZODIAC_SIGNS.find(sign => sign.id === planet.sign);
              const planetInfo = PLANETS.find(p => p.id === planet.id);
              const nakshatra = planet.nakshatra ? NAKSHATRAS[planet.nakshatra - 1]?.name : "Unknown";
              const strength = calculatePlanetaryStrength(planet);
              
              return (
                <TableRow key={planet.id}>
                  <TableCell className="font-medium">
                    <span className="mr-1">{planetInfo?.symbol}</span>
                    {planetInfo?.name}
                  </TableCell>
                  <TableCell>
                    <span className="mr-1">{zodiacSign?.symbol}</span>
                    {zodiacSign?.name}
                  </TableCell>
                  <TableCell>{nakshatra}</TableCell>
                  <TableCell>
                    {planet.isRetrograde && (
                      <span className="text-amber-500">Retrograde</span>
                    )}
                    {!planet.isRetrograde && (
                      <span className="text-green-500">Direct</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${(strength / 20) * 100}%` }}
                        />
                      </div>
                      <span className="ml-2 text-xs">{strength}/20</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PlanetaryPositions;
