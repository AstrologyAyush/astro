
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanetPosition, ZODIAC_SIGNS, PLANETS, NAKSHATRAS, calculatePlanetaryStrength } from '@/lib/kundaliUtils';
import { Badge } from '@/components/ui/badge';

interface PlanetaryPositionsProps {
  planets: PlanetPosition[];
}

const PlanetaryPositions: React.FC<PlanetaryPositionsProps> = ({ planets }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ग्रह स्थिति (Planetary Positions)</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ग्रह (Planet)</TableHead>
              <TableHead>राशि (Sign)</TableHead>
              <TableHead>नक्षत्र (Nakshatra)</TableHead>
              <TableHead>स्थिति (Status)</TableHead>
              <TableHead>शक्ति (Strength)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {planets.map((planet) => {
              const zodiacSign = ZODIAC_SIGNS.find(sign => sign.id === planet.sign);
              const planetInfo = PLANETS.find(p => p.id === planet.id);
              const nakshatra = planet.nakshatra ? NAKSHATRAS[planet.nakshatra - 1]?.name : "Unknown";
              const nakshatraSanskrit = planet.nakshatra ? NAKSHATRAS[planet.nakshatra - 1]?.sanskrit : "अज्ञात";
              const strength = calculatePlanetaryStrength(planet);
              
              return (
                <TableRow key={planet.id}>
                  <TableCell className="font-medium">
                    <span className="mr-1">{planetInfo?.symbol}</span>
                    <span className="mr-1">{planetInfo?.sanskrit}</span>
                    <span className="text-xs text-muted-foreground">({planetInfo?.name})</span>
                  </TableCell>
                  <TableCell>
                    <span className="mr-1">{zodiacSign?.symbol}</span>
                    <span className="mr-1">{zodiacSign?.sanskrit}</span>
                    <span className="text-xs text-muted-foreground">({zodiacSign?.name})</span>
                  </TableCell>
                  <TableCell>
                    <span>{nakshatraSanskrit}</span>
                    <span className="text-xs text-muted-foreground block">({nakshatra})</span>
                  </TableCell>
                  <TableCell>
                    {planet.isRetrograde ? (
                      <Badge variant="outline" className="text-amber-500 border-amber-500">
                        वक्री (Retrograde)
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-green-500 border-green-500">
                        सीधा (Direct)
                      </Badge>
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
