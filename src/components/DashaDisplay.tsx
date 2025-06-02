
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
  language?: 'hi' | 'en';
}

const DashaDisplay: React.FC<DashaDisplayProps> = ({ moonPosition, birthDate, language = 'hi' }) => {
  // Calculate dasha periods
  const birthData = {
    fullName: "", // Add required fullName property
    date: birthDate,
    time: "12:00", // Default time since we only have date
    place: "",
    latitude: 0,
    longitude: 0,
    timezone: 5.5, // Convert string to number
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
        <CardTitle>{language === 'hi' ? "विंशोत्तरी दशा" : "Vimshottari Dasha"}</CardTitle>
        <CardDescription>
          {language === 'hi' 
            ? "आपके जीवन की महादशा अवधियां" 
            : "Major planetary periods of your life"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted/30 p-3 rounded-md">
            <h3 className="font-medium">
              {language === 'hi' ? "जन्म नक्षत्र विवरण" : "Birth Nakshatra Details"}
            </h3>
            <p className="text-sm mt-1">
              {language === 'hi' 
                ? `आपका जन्म ${nakshatra?.sanskrit} नक्षत्र में हुआ है, जिसका स्वामी ${lordPlanet?.sanskrit || lordPlanet?.name} है।`
                : `Your birth occurred in ${nakshatra?.name} (${nakshatra?.sanskrit}) nakshatra, ruled by ${lordPlanet?.name}.`}
            </p>
          </div>
          
          <Separator />
          
          {currentDasha && (
            <div className="bg-primary/10 p-3 rounded-md">
              <h3 className="font-medium">
                {language === 'hi' ? "वर्तमान दशा" : "Current Period"}
              </h3>
              <div className="mt-2 flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  {getPlanetDetails(currentDasha.planet)?.symbol}
                </div>
                <div>
                  <div className="font-medium">
                    {language === 'hi'
                      ? `${currentDasha.planetSanskrit || getPlanetDetails(currentDasha.planet)?.sanskrit || getPlanetDetails(currentDasha.planet)?.name} महादशा`
                      : `${getPlanetDetails(currentDasha.planet)?.name} Mahadasha`}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(currentDasha.startDate)} - {formatDate(currentDasha.endDate)}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <h3 className="font-medium mt-4">
            {language === 'hi' ? "आपकी महादशा श्रृंखला" : "Your Mahadasha Sequence"}
          </h3>
          
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
                      <span className="font-medium">
                        {language === 'hi' 
                          ? `${planet?.sanskrit || planet?.name} दशा` 
                          : `${planet?.name} Period`}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {language === 'hi' 
                          ? `${Math.round(period.years)} वर्ष` 
                          : `${Math.round(period.years)} years`}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {language === 'hi' 
                        ? `${formatDate(period.startDate)} से ${formatDate(period.endDate)} तक`
                        : `${formatDate(period.startDate)} to ${formatDate(period.endDate)}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="pt-2 text-xs text-muted-foreground bg-muted/20 p-2 rounded">
            <p>
              {language === 'hi' 
                ? "नोट: विंशोत्तरी दशा वैदिक ज्योतिष में जीवन के विभिन्न चरणों का संकेत देती है। प्रत्येक ग्रह की दशा एक निश्चित अवधि तक चलती है और उस अवधि में उस ग्रह के गुण व प्रभाव जीवन में दिखाई देते हैं।"
                : "Note: Vimshottari Dasha indicates different phases of life in Vedic astrology. Each planet's period lasts for a specific duration, and during that time, the qualities and influences of that planet are visible in life."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashaDisplay;
