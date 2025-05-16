
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  PlanetPosition, 
  calculateVimshottariDasha, 
  getCurrentDasha,
  getPlanetDetails, 
  NAKSHATRAS,
  DashaPeriod
} from '@/lib/kundaliUtils';
import { format } from 'date-fns';
import { Separator } from "@/components/ui/separator";

interface DashaDisplayProps {
  moonPosition: PlanetPosition;
  birthDate: Date;
}

const DashaDisplay: React.FC<DashaDisplayProps> = ({ moonPosition, birthDate }) => {
  // Calculate dasha periods
  const birthData = {
    date: birthDate,
    time: "12:00", // Default time since we only have date
    place: "",
    latitude: 0,
    longitude: 0,
    timezone: "",
  };
  
  const dashaPeriods = calculateVimshottariDasha(birthData, moonPosition);
  const currentDasha = getCurrentDasha(dashaPeriods);
  
  const nakshatraId = moonPosition.nakshatra || 1;
  const nakshatra = NAKSHATRAS[nakshatraId - 1];
  const lordId = nakshatra?.ruler || "JU";
  const lordPlanet = getPlanetDetails(lordId);
  
  const formatDate = (date: Date) => {
    return format(date, 'MMM yyyy');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>विंशोत्तरी दशा</CardTitle>
        <CardDescription>आपके जीवन की महादशा अवधियां</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted/30 p-3 rounded-md">
            <h3 className="font-medium">जन्म नक्षत्र विवरण</h3>
            <p className="text-sm mt-1">
              आपका जन्म <strong>{nakshatra?.sanskrit}</strong> नक्षत्र में हुआ है, 
              जिसका स्वामी <strong>{lordPlanet?.sanskrit}</strong> ({lordPlanet?.name}) है।
            </p>
          </div>
          
          <Separator />
          
          {currentDasha && (
            <div className="bg-primary/10 p-3 rounded-md">
              <h3 className="font-medium">वर्तमान दशा</h3>
              <div className="mt-2 flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  {getPlanetDetails(currentDasha.planet)?.symbol}
                </div>
                <div>
                  <div className="font-medium">
                    {currentDasha.planetSanskrit} महादशा
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(currentDasha.startDate)} - {formatDate(currentDasha.endDate)}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <h3 className="font-medium mt-4">आपकी महादशा श्रृंखला</h3>
          
          <div className="space-y-4">
            {dashaPeriods.slice(0, 6).map((period: DashaPeriod, index) => {
              const planet = getPlanetDetails(period.planet);
              const isCurrent = currentDasha?.planet === period.planet;
              
              return (
                <div 
                  key={period.planet + index} 
                  className={`flex items-center space-x-3 p-2 rounded-lg ${
                    isCurrent ? 'bg-primary/20 border border-primary/30' : 'bg-card'
                  }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full 
                    ${isCurrent ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    {planet?.symbol}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{planet?.sanskrit} दशा</span>
                      <span className="text-sm text-muted-foreground">{Math.round(period.years)} वर्ष</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(period.startDate)} से {formatDate(period.endDate)} तक
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="pt-2 text-xs text-muted-foreground bg-muted/20 p-2 rounded">
            <p>नोट: विंशोत्तरी दशा वैदिक ज्योतिष में जीवन के विभिन्न चरणों का संकेत देती है। प्रत्येक ग्रह की दशा एक निश्चित अवधि तक चलती है और उस अवधि में उस ग्रह के गुण व प्रभाव जीवन में दिखाई देते हैं।</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashaDisplay;
