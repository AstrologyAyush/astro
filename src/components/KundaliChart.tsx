
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { KundaliChart as KundaliChartType, PlanetPosition, ZODIAC_SIGNS, getPlanetsInHouse, getZodiacDetails, getPlanetDetails, degreesToDMS } from '@/lib/kundaliUtils';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface KundaliChartProps {
  chart: KundaliChartType;
  language?: 'hi' | 'en';
}

const KundaliChart: React.FC<KundaliChartProps> = ({ chart, language = 'hi' }) => {
  const { ascendant, planets, housesList, yogas } = chart;

  // Create a 12-house chart layout (traditional North Indian style)
  const createHouse = (houseNumber: number) => {
    const sign = housesList[houseNumber - 1];
    const zodiacDetails = getZodiacDetails(sign);
    const planetsInHouse = getPlanetsInHouse(planets, housesList, houseNumber);
    
    return (
      <div className={`kundali-house kundali-house-${houseNumber}`} key={`house-${houseNumber}`}>
        <div className="text-xs font-semibold mb-1">
          {language === 'hi' ? `भाव ${houseNumber}` : `House ${houseNumber}`} 
          <span className="text-muted-foreground">
            {language === 'hi' ? `(${zodiacDetails.sanskrit})` : `(${zodiacDetails.name})`}
          </span>
        </div>
        <div className="zodiac-symbol" style={{ color: `var(--astrology-${zodiacDetails.name.toLowerCase()})` }}>
          {zodiacDetails.symbol}
        </div>
        <div className="flex flex-col">
          <span className="text-xs mb-1">{language === 'hi' ? zodiacDetails.sanskrit : zodiacDetails.name}</span>
          <span className="text-[10px] text-muted-foreground">
            {language === 'hi' ? zodiacDetails.element : `${zodiacDetails.element} Element`}
          </span>
        </div>
        {planetsInHouse.length > 0 && (
          <div className="planets-container text-xs mt-1 flex flex-wrap gap-1">
            {planetsInHouse.map(planet => {
              const planetDetails = getPlanetDetails(planet.id);
              return (
                <span 
                  key={planet.id} 
                  className="planet-symbol inline-flex items-center justify-center"
                  title={`${language === 'hi' ? planetDetails?.sanskrit : planetDetails?.name} ${planet.isRetrograde ? (language === 'hi' ? 'वक्री' : 'Retrograde') : ''} - ${degreesToDMS(planet.degreeInSign || 0)}`}
                >
                  <span className="mr-1 text-primary">{planetDetails?.symbol}</span>
                  <span className="text-[10px]">
                    {language === 'hi' ? planetDetails?.sanskrit : planetDetails?.name}
                  </span>
                  {planet.isRetrograde && <sup className="text-amber-500">
                    {language === 'hi' ? 'व' : 'R'}
                  </sup>}
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

  // Generate detailed planet positions
  const planetDetails = planets.map(planet => {
    const zodiacSign = getZodiacDetails(planet.sign);
    const planetInfo = getPlanetDetails(planet.id);
    const nakshatra = planet.nakshatra ? Math.ceil(planet.nakshatra) : 0;
    
    return {
      ...planet,
      zodiacSign,
      planetInfo,
      nakshatraName: nakshatra > 0 && nakshatra <= 27 ? 
        `${planet.nakshatraPada || 1} ${language === 'hi' ? 'पाद' : 'Pada'} ${language === 'hi' ? ZODIAC_SIGNS[planet.sign - 1]?.sanskrit : ZODIAC_SIGNS[planet.sign - 1]?.name || ''}` : ''
    };
  });

  // Get present yogas
  const presentYogas = yogas.filter(yoga => yoga.present);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          {language === 'hi' ? 'कुंडली चार्ट' : 'Kundali Chart'}
        </CardTitle>
        <CardDescription className="text-center">
          {language === 'hi' ? 'उत्तर भारतीय शैली' : 'North Indian Style'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <div className="text-lg font-semibold">
            {language === 'hi' ? 'लग्न:' : 'Ascendant:'} 
            <span className="font-medium"> 
              {language === 'hi' ? ascendantSign.sanskrit : ascendantSign.name}
            </span> 
            {language === 'hi' ? `(${ascendantSign.name})` : `(${ascendantSign.sanskrit})`} 
          </div>
          <div className="text-sm text-muted-foreground">
            {language === 'hi' ? `${ascendantSign.element} तत्व` : `${ascendantSign.element} Element`}
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
        
        <Separator className="my-4" />
        
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">
            {language === 'hi' ? 'ग्रह स्थितियां' : 'Planetary Positions'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {planetDetails.map(planet => (
              <div key={planet.id} className="flex items-center space-x-2 p-2 rounded-md bg-muted/40">
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                  {planet.planetInfo?.symbol}
                </div>
                <div>
                  <div className="font-medium">
                    {language === 'hi' ? planet.planetInfo?.sanskrit : planet.planetInfo?.name}
                    {language === 'hi' ? '' : ` (${planet.planetInfo?.sanskrit})`}
                    {planet.isRetrograde && 
                      <span className="text-amber-500 ml-1">
                        {language === 'hi' ? 'वक्री' : 'Retrograde'}
                      </span>}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {language === 'hi' ? 
                      `${planet.zodiacSign.sanskrit} राशि (${degreesToDMS(planet.degreeInSign || 0)})` : 
                      `${planet.zodiacSign.name} (${degreesToDMS(planet.degreeInSign || 0)})`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {presentYogas.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">
              {language === 'hi' ? 'योग' : 'Yogas'}
            </h3>
            <div className="space-y-2">
              {presentYogas.map(yoga => (
                <div key={yoga.name} className="p-2 rounded-md bg-success/10 text-success-foreground">
                  <div className="font-medium">
                    {language === 'hi' ? `${yoga.sanskritName} (${yoga.name})` : `${yoga.name} (${yoga.sanskritName})`}
                  </div>
                  <div className="text-xs mt-1">
                    {language === 'hi' ? yoga.description : yoga.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-6 text-sm bg-primary/5 p-3 rounded-md">
          <h4 className="font-medium mb-1">
            {language === 'hi' ? 'चार्ट विवरण:' : 'Chart Details:'}
          </h4>
          <p className="text-muted-foreground text-xs">
            {language === 'hi' ? 
              'यह कुंडली उत्तर भारतीय शैली में दिखाई गई है। प्रत्येक भाव (House) के अंदर उस भाव की राशि और उसमें स्थित ग्रह दिखाए गए हैं। ग्रह की स्थिति व उनके द्वारा बनने वाले योग आपके जीवन के विभिन्न पहलुओं को प्रभावित करते हैं।' : 
              'This chart is displayed in North Indian style. Each house shows the zodiac sign and planets positioned there. The planetary positions and yogas formed influence various aspects of your life.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default KundaliChart;
