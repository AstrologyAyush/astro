
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlanetPosition, getPlanetDetails, getZodiacDetails, degreesToDMS, calculatePlanetaryStrength, NAKSHATRAS, isPlanetCombust } from '@/lib/kundaliUtils';
import { Badge } from "@/components/ui/badge";

interface PlanetaryPositionsProps {
  planets: PlanetPosition[];
  language?: 'hi' | 'en';
}

const PlanetaryPositions: React.FC<PlanetaryPositionsProps> = ({ planets, language = 'hi' }) => {
  // Get sun position for combustion calculation
  const sun = planets.find(p => p.id === "SU");
  
  // Get planet in sorted order (traditional sequence)
  const planetSequence = ["SU", "MO", "MA", "ME", "JU", "VE", "SA", "RA", "KE"];
  const sortedPlanets = [...planets].sort((a, b) => {
    return planetSequence.indexOf(a.id) - planetSequence.indexOf(b.id);
  });
  
  // Get planet status
  const getPlanetStatus = (planet: PlanetPosition) => {
    if (isPlanetCombust(planet, sun!)) {
      return {
        status: language === 'hi' ? "अस्त" : "Combust",
        className: "text-destructive"
      };
    } else if (planet.isRetrograde) {
      return {
        status: language === 'hi' ? "वक्री" : "Retrograde",
        className: "text-amber-500"
      };
    }
    
    const strength = calculatePlanetaryStrength(planet);
    
    if (strength > 7) {
      return {
        status: language === 'hi' ? "उच्च" : "Strong",
        className: "text-success"
      };
    } else if (strength < 3) {
      return {
        status: language === 'hi' ? "नीच" : "Weak",
        className: "text-destructive"
      };
    } else {
      return {
        status: language === 'hi' ? "साधारण" : "Moderate",
        className: "text-muted-foreground"
      };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{language === 'hi' ? "ग्रह स्थिति" : "Planetary Positions"}</CardTitle>
        <CardDescription>
          {language === 'hi' 
            ? "आपकी जन्म कुंडली में ग्रहों का विस्तृत विवरण"
            : "Detailed information about planets in your birth chart"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid gap-3 sm:grid-cols-1">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-2 rounded-tl-md">{language === 'hi' ? "ग्रह" : "Planet"}</th>
                  <th className="text-left p-2">{language === 'hi' ? "राशि" : "Sign"}</th>
                  <th className="text-left p-2">{language === 'hi' ? "अंश" : "Degree"}</th>
                  <th className="text-left p-2">{language === 'hi' ? "नक्षत्र" : "Nakshatra"}</th>
                  <th className="text-left p-2 rounded-tr-md">{language === 'hi' ? "स्थिति" : "Status"}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sortedPlanets.map(planet => {
                  const planetDetails = getPlanetDetails(planet.id);
                  const zodiacSign = getZodiacDetails(planet.sign);
                  const status = getPlanetStatus(planet);
                  const nakshatra = planet.nakshatra 
                    ? NAKSHATRAS[planet.nakshatra - 1] 
                    : null;
                  
                  return (
                    <tr key={planet.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-2 flex items-center space-x-2">
                        <span className="text-primary text-lg mr-1">
                          {planetDetails?.symbol}
                        </span>
                        <span>
                          {language === 'hi' ? planetDetails?.sanskrit : planetDetails?.name}
                        </span>
                      </td>
                      <td className="p-2">
                        <Badge variant="outline">
                          {language === 'hi' ? zodiacSign?.sanskrit : zodiacSign?.name}
                        </Badge>
                      </td>
                      <td className="p-2">{degreesToDMS(planet.degreeInSign || 0)}</td>
                      <td className="p-2">
                        {nakshatra && (
                          <span className="text-xs">
                            {language === 'hi' ? nakshatra.sanskrit : nakshatra.name}
                            <span className="text-muted-foreground ml-1">
                              ({planet.nakshatraPada || 1}{language === 'hi' ? ' पाद' : ' pada'})
                            </span>
                          </span>
                        )}
                      </td>
                      <td className="p-2">
                        <span className={status.className}>{status.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="space-y-4 mt-4">
            <div className="bg-muted/20 p-3 rounded-md">
              <h3 className="font-medium text-md mb-2">
                {language === 'hi' ? "ग्रह स्थिति के प्रभाव" : "Effects of Planetary Positions"}
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  {language === 'hi'
                    ? "ग्रहों की शक्ति और स्थिति आपके जीवन के विभिन्न पहलुओं पर प्रभाव डालती है। मजबूत ग्रह अच्छे परिणाम देते हैं, जबकि कमजोर या पीड़ित ग्रह चुनौतियां पैदा कर सकते हैं।"
                    : "The strength and position of planets influence various aspects of your life. Strong planets give good results, while weak or afflicted planets can create challenges."}
                </p>
                <p>
                  {language === 'hi'
                    ? "वक्री ग्रह अपने प्रभावों को अधिक आंतरिक और गहरा बनाते हैं। अस्त (सूर्य के निकट) ग्रह अपनी शक्ति खो देते हैं और उनका प्रभाव कम हो जाता है।"
                    : "Retrograde planets make their effects more internalized and profound. Combust (close to Sun) planets lose their strength and their influence is diminished."}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-success/10 p-3 rounded-md">
                <h4 className="font-medium text-sm">
                  {language === 'hi' ? "मजबूत ग्रह" : "Strong Planets"}
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {sortedPlanets
                    .filter(p => calculatePlanetaryStrength(p) > 7)
                    .map(p => {
                      const planetDetails = getPlanetDetails(p.id);
                      return (
                        <Badge key={p.id} className="bg-success/20 text-success-foreground">
                          {planetDetails?.symbol} {language === 'hi' ? planetDetails?.sanskrit : planetDetails?.name}
                        </Badge>
                      );
                    })}
                  {sortedPlanets.filter(p => calculatePlanetaryStrength(p) > 7).length === 0 && (
                    <span className="text-xs text-muted-foreground">
                      {language === 'hi' ? "कोई उत्कृष्ट ग्रह नहीं" : "No excellent planets"}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="bg-amber-500/10 p-3 rounded-md">
                <h4 className="font-medium text-sm">
                  {language === 'hi' ? "वक्री ग्रह" : "Retrograde Planets"}
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {sortedPlanets
                    .filter(p => p.isRetrograde)
                    .map(p => {
                      const planetDetails = getPlanetDetails(p.id);
                      return (
                        <Badge key={p.id} className="bg-amber-500/20 text-amber-500">
                          {planetDetails?.symbol} {language === 'hi' ? planetDetails?.sanskrit : planetDetails?.name}
                        </Badge>
                      );
                    })}
                  {sortedPlanets.filter(p => p.isRetrograde).length === 0 && (
                    <span className="text-xs text-muted-foreground">
                      {language === 'hi' ? "कोई वक्री ग्रह नहीं" : "No retrograde planets"}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="bg-destructive/10 p-3 rounded-md">
                <h4 className="font-medium text-sm">
                  {language === 'hi' ? "कमजोर ग्रह" : "Weak Planets"}
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {sortedPlanets
                    .filter(p => calculatePlanetaryStrength(p) < 3 || isPlanetCombust(p, sun!))
                    .map(p => {
                      const planetDetails = getPlanetDetails(p.id);
                      return (
                        <Badge key={p.id} className="bg-destructive/20 text-destructive-foreground">
                          {planetDetails?.symbol} {language === 'hi' ? planetDetails?.sanskrit : planetDetails?.name}
                        </Badge>
                      );
                    })}
                  {sortedPlanets.filter(p => calculatePlanetaryStrength(p) < 3 || isPlanetCombust(p, sun!)).length === 0 && (
                    <span className="text-xs text-muted-foreground">
                      {language === 'hi' ? "कोई कमजोर ग्रह नहीं" : "No weak planets"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanetaryPositions;
