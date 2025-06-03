
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlanetPosition, getPlanetDetails, getZodiacDetails, degreesToDMS, calculatePlanetaryStrength, NAKSHATRAS, isPlanetCombust } from '@/lib/kundaliUtils';
import { EnhancedPlanetPosition } from '@/lib/enhancedAstronomicalEngine';
import { Badge } from "@/components/ui/badge";
import { Star, Zap, Eye } from "lucide-react";

interface PlanetaryPositionsProps {
  planets: PlanetPosition[] | Record<string, PlanetPosition | EnhancedPlanetPosition>;
  language?: 'hi' | 'en';
}

const PlanetaryPositions: React.FC<PlanetaryPositionsProps> = ({ planets, language = 'hi' }) => {
  // Convert planets to array if it's an object
  const planetsArray = Array.isArray(planets) ? planets : Object.values(planets);
  
  // Get sun position for combustion calculation
  const sun = planetsArray.find(p => p.id === "SU");
  
  // Get planet in sorted order (traditional sequence)
  const planetSequence = ["SU", "MO", "MA", "ME", "JU", "VE", "SA", "RA", "KE"];
  const sortedPlanets = [...planetsArray].sort((a, b) => {
    return planetSequence.indexOf(a.id) - planetSequence.indexOf(b.id);
  });
  
  // Get planet status with enhanced information
  const getPlanetStatus = (planet: PlanetPosition | EnhancedPlanetPosition) => {
    // Check if it's an enhanced planet position
    const isEnhanced = 'strengthGrade' in planet;
    
    if (isEnhanced) {
      const enhancedPlanet = planet as EnhancedPlanetPosition;
      return {
        status: language === 'hi' ? 
          (enhancedPlanet.strengthGrade === 'Excellent' ? 'उत्कृष्ट' :
           enhancedPlanet.strengthGrade === 'Good' ? 'अच्छा' :
           enhancedPlanet.strengthGrade === 'Average' ? 'साधारण' :
           enhancedPlanet.strengthGrade === 'Weak' ? 'कमजोर' : 'अति कमजोर') :
          enhancedPlanet.strengthGrade,
        className: enhancedPlanet.strengthGrade === 'Excellent' ? 'status-excellent' :
                  enhancedPlanet.strengthGrade === 'Good' ? 'status-good' :
                  enhancedPlanet.strengthGrade === 'Average' ? 'status-average' :
                  enhancedPlanet.strengthGrade === 'Weak' ? 'status-weak' : 'status-very-weak',
        strength: enhancedPlanet.totalStrength
      };
    }
    
    // Fallback to basic calculation
    if (isPlanetCombust(planet, sun!)) {
      return {
        status: language === 'hi' ? "अस्त" : "Combust",
        className: "text-red-400",
        strength: 0
      };
    } else if (planet.isRetrograde) {
      return {
        status: language === 'hi' ? "वक्री" : "Retrograde",
        className: "text-amber-400",
        strength: 50
      };
    }
    
    const strength = calculatePlanetaryStrength(planet);
    
    if (strength > 70) {
      return {
        status: language === 'hi' ? "उच्च" : "Strong",
        className: "status-good",
        strength
      };
    } else if (strength < 30) {
      return {
        status: language === 'hi' ? "नीच" : "Weak",
        className: "status-weak",
        strength
      };
    } else {
      return {
        status: language === 'hi' ? "साधारण" : "Moderate",
        className: "status-average",
        strength
      };
    }
  };

  return (
    <Card className="astro-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 gradient-text">
          <Star className="h-5 w-5" />
          {language === 'hi' ? "ग्रह स्थिति विश्लेषण" : "Planetary Position Analysis"}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {language === 'hi' 
            ? "आपकी जन्म कुंडली में ग्रहों का विस्तृत षड्बल विश्लेषण"
            : "Detailed Shadbala analysis of planets in your birth chart"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Enhanced Planetary Table */}
          <div className="overflow-x-auto">
            <table className="planetary-table">
              <thead>
                <tr>
                  <th className="rounded-tl-xl">{language === 'hi' ? "ग्रह" : "Planet"}</th>
                  <th>{language === 'hi' ? "राशि" : "Sign"}</th>
                  <th>{language === 'hi' ? "अंश" : "Degree"}</th>
                  <th>{language === 'hi' ? "नक्षत्र" : "Nakshatra"}</th>
                  <th>{language === 'hi' ? "शक्ति" : "Strength"}</th>
                  <th className="rounded-tr-xl">{language === 'hi' ? "स्थिति" : "Status"}</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlanets.map(planet => {
                  const planetDetails = getPlanetDetails(planet.id);
                  const zodiacSign = getZodiacDetails(planet.sign);
                  const status = getPlanetStatus(planet);
                  const nakshatra = planet.nakshatra 
                    ? NAKSHATRAS[planet.nakshatra - 1] 
                    : null;
                  
                  return (
                    <tr key={planet.id} className="group hover:bg-orange-500/5">
                      <td className="font-medium">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {planetDetails?.symbol}
                          </span>
                          <div>
                            <div className="font-semibold">
                              {language === 'hi' ? planetDetails?.sanskrit : planetDetails?.name}
                            </div>
                            {'isRetrograde' in planet && planet.isRetrograde && (
                              <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-400">
                                {language === 'hi' ? 'वक्री' : 'R'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge variant="outline" className="border-orange-500/30 text-orange-300">
                          {language === 'hi' ? zodiacSign?.sanskrit : zodiacSign?.name}
                        </Badge>
                      </td>
                      <td className="font-mono text-sm">
                        {degreesToDMS(planet.degreeInSign || 0)}
                      </td>
                      <td>
                        {nakshatra && (
                          <div className="text-sm">
                            <div className="font-medium">
                              {language === 'hi' ? nakshatra.sanskrit : nakshatra.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {planet.nakshatraPada || 1}{language === 'hi' ? ' पाद' : ' pada'}
                            </div>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-muted rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500"
                              style={{ width: `${Math.min(100, (status.strength / 150) * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-mono text-muted-foreground">
                            {Math.round(status.strength)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`font-medium ${status.className}`}>
                          {status.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Enhanced Summary Cards */}
          <div className="analysis-grid">
            <Card className="bg-emerald-500/5 border-emerald-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="h-5 w-5 text-emerald-400" />
                  <h3 className="font-semibold text-emerald-400">
                    {language === 'hi' ? "मजबूत ग्रह" : "Strong Planets"}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sortedPlanets
                    .filter(p => {
                      const status = getPlanetStatus(p);
                      return status.strength > 100;
                    })
                    .map(p => {
                      const planetDetails = getPlanetDetails(p.id);
                      return (
                        <Badge key={p.id} className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                          {planetDetails?.symbol} {language === 'hi' ? planetDetails?.sanskrit : planetDetails?.name}
                        </Badge>
                      );
                    })}
                  {sortedPlanets.filter(p => getPlanetStatus(p).strength > 100).length === 0 && (
                    <span className="text-sm text-muted-foreground">
                      {language === 'hi' ? "कोई अत्यधिक मजबूत ग्रह नहीं" : "No exceptionally strong planets"}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-amber-500/5 border-amber-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="h-5 w-5 text-amber-400" />
                  <h3 className="font-semibold text-amber-400">
                    {language === 'hi' ? "वक्री ग्रह" : "Retrograde Planets"}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sortedPlanets
                    .filter(p => p.isRetrograde)
                    .map(p => {
                      const planetDetails = getPlanetDetails(p.id);
                      return (
                        <Badge key={p.id} className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                          {planetDetails?.symbol} {language === 'hi' ? planetDetails?.sanskrit : planetDetails?.name}
                        </Badge>
                      );
                    })}
                  {sortedPlanets.filter(p => p.isRetrograde).length === 0 && (
                    <span className="text-sm text-muted-foreground">
                      {language === 'hi' ? "कोई वक्री ग्रह नहीं" : "No retrograde planets"}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-red-500/5 border-red-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Star className="h-5 w-5 text-red-400" />
                  <h3 className="font-semibold text-red-400">
                    {language === 'hi' ? "कमजोर ग्रह" : "Weak Planets"}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sortedPlanets
                    .filter(p => {
                      const status = getPlanetStatus(p);
                      return status.strength < 50 || isPlanetCombust(p, sun!);
                    })
                    .map(p => {
                      const planetDetails = getPlanetDetails(p.id);
                      return (
                        <Badge key={p.id} className="bg-red-500/20 text-red-300 border-red-500/30">
                          {planetDetails?.symbol} {language === 'hi' ? planetDetails?.sanskrit : planetDetails?.name}
                        </Badge>
                      );
                    })}
                  {sortedPlanets.filter(p => getPlanetStatus(p).strength < 50 || isPlanetCombust(p, sun!)).length === 0 && (
                    <span className="text-sm text-muted-foreground">
                      {language === 'hi' ? "कोई कमजोर ग्रह नहीं" : "No weak planets"}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights */}
          <Card className="bg-gradient-to-r from-orange-500/5 to-orange-600/5 border-orange-500/20">
            <CardContent className="p-6">
              <h3 className="font-semibold text-orange-400 mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                {language === 'hi' ? "ग्रह स्थिति के प्रभाव" : "Planetary Position Effects"}
              </h3>
              <div className="space-y-3 text-sm leading-relaxed">
                <p>
                  {language === 'hi'
                    ? "ग्रहों की षड्बल शक्ति आपके जीवन के विभिन्न पहलुओं पर गहरा प्रभाव डालती है। मजबूत ग्रह सकारात्मक परिणाम देते हैं, जबकि कमजोर ग्रह चुनौतियां पैदा कर सकते हैं।"
                    : "The Shadbala strength of planets deeply influences various aspects of your life. Strong planets give positive results, while weak planets can create challenges."}
                </p>
                <p>
                  {language === 'hi'
                    ? "वक्री ग्रह अपने प्रभावों को अधिक आंतरिक और गहरा बनाते हैं। अस्त ग्रह अपनी शक्ति खो देते हैं लेकिन आध्यात्मिक विकास में सहायक हो सकते हैं।"
                    : "Retrograde planets make their effects more internalized and profound. Combust planets lose their strength but can aid in spiritual development."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanetaryPositions;
