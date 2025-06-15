
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Planet {
  id: string;
  name: string;
  house: number;
  rashi: number;
  degree: number;
  degreeInSign: number;
  rashiName: string;
  nakshatraName: string;
  nakshatraPada: number;
  isExalted?: boolean;
  isDebilitated?: boolean;
  ownSign?: boolean;
  isRetrograde?: boolean;
}

interface EnhancedPlanetaryStrengthChartProps {
  planets: Planet[];
  language?: 'hi' | 'en';
}

const EnhancedPlanetaryStrengthChart: React.FC<EnhancedPlanetaryStrengthChartProps> = ({
  planets,
  language = 'en'
}) => {
  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  // Calculate planetary strength based on various factors
  const calculatePlanetaryStrength = (planet: Planet) => {
    let strength = 50; // Base strength
    
    // Sign strength
    if (planet.isExalted) strength += 30;
    else if (planet.isDebilitated) strength -= 25;
    else if (planet.ownSign) strength += 20;
    
    // House strength (simplified)
    const beneficHouses = [1, 4, 5, 7, 9, 10, 11];
    if (beneficHouses.includes(planet.house)) strength += 15;
    
    // Degree strength (within 15 degrees of exact exaltation/debilitation)
    const degreeBonus = Math.max(0, 15 - Math.abs(planet.degreeInSign - 15)) / 15 * 10;
    strength += degreeBonus;
    
    // Retrograde effect
    if (planet.isRetrograde && !['RA', 'KE'].includes(planet.id)) {
      strength += 5; // Retrograde can add strength for most planets
    }
    
    return Math.min(100, Math.max(0, strength));
  };

  // Calculate Dig Bala (Directional Strength)
  const calculateDigBala = (planet: Planet) => {
    const digBalaHouses: Record<string, number> = {
      'SU': 1,  // Sun strong in 1st house
      'MO': 4,  // Moon strong in 4th house
      'MA': 10, // Mars strong in 10th house
      'ME': 1,  // Mercury strong in 1st house
      'JU': 1,  // Jupiter strong in 1st house
      'VE': 4,  // Venus strong in 4th house
      'SA': 7   // Saturn strong in 7th house
    };

    const strongHouse = digBalaHouses[planet.id];
    if (!strongHouse) return 50;

    if (planet.house === strongHouse) return 100;
    
    // Calculate based on distance from strong house
    const distance = Math.min(
      Math.abs(planet.house - strongHouse),
      12 - Math.abs(planet.house - strongHouse)
    );
    
    return Math.max(20, 100 - (distance * 15));
  };

  // Get strength color
  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (strength >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (strength >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  // Get strength icon
  const getStrengthIcon = (strength: number) => {
    if (strength >= 70) return <TrendingUp className="h-4 w-4" />;
    if (strength >= 40) return <Minus className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  // Get planet symbol
  const getPlanetSymbol = (planetId: string) => {
    const symbols: Record<string, string> = {
      'SU': '☉', 'MO': '☽', 'MA': '♂', 'ME': '☿',
      'JU': '♃', 'VE': '♀', 'SA': '♄', 'RA': '☊', 'KE': '☋'
    };
    return symbols[planetId] || planetId;
  };

  return (
    <Card className="border-purple-200 dark:border-purple-700 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30">
        <CardTitle className="text-purple-800 dark:text-purple-300 flex items-center gap-2">
          <Star className="h-5 w-5" />
          {getTranslation('Enhanced Planetary Strength Analysis', 'उन्नत ग्रह शक्ति विश्लेषण')}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        {planets.map((planet) => {
          const strength = calculatePlanetaryStrength(planet);
          const digBala = calculateDigBala(planet);
          const strengthColor = getStrengthColor(strength);
          const strengthIcon = getStrengthIcon(strength);

          return (
            <div key={planet.id} className="border rounded-lg p-4 space-y-3">
              {/* Planet Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getPlanetSymbol(planet.id)}</span>
                  <div>
                    <h3 className="font-semibold text-lg">{planet.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getTranslation(`${planet.rashiName} - House ${planet.house}`, `${planet.rashiName} - भाव ${planet.house}`)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {strengthIcon}
                  <Badge className={strengthColor}>
                    {strength.toFixed(0)}%
                  </Badge>
                </div>
              </div>

              {/* Strength Bars */}
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{getTranslation('Overall Strength', 'समग्र शक्ति')}</span>
                    <span>{strength.toFixed(0)}%</span>
                  </div>
                  <Progress value={strength} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{getTranslation('Directional Strength (Dig Bala)', 'दिग्बल')}</span>
                    <span>{digBala.toFixed(0)}%</span>
                  </div>
                  <Progress value={digBala} className="h-2" />
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                {planet.isExalted && (
                  <Badge variant="secondary" className="text-green-700 bg-green-100">
                    {getTranslation('Exalted', 'उच्च')}
                  </Badge>
                )}
                {planet.isDebilitated && (
                  <Badge variant="secondary" className="text-red-700 bg-red-100">
                    {getTranslation('Debilitated', 'नीच')}
                  </Badge>
                )}
                {planet.ownSign && (
                  <Badge variant="secondary" className="text-blue-700 bg-blue-100">
                    {getTranslation('Own Sign', 'स्व राशि')}
                  </Badge>
                )}
                {planet.isRetrograde && (
                  <Badge variant="secondary" className="text-orange-700 bg-orange-100">
                    {getTranslation('Retrograde', 'वक्री')}
                  </Badge>
                )}
              </div>

              {/* Detailed Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    {getTranslation('Nakshatra', 'नक्षत्र')}:
                  </span>
                  <span className="ml-2 font-medium">
                    {planet.nakshatraName} ({getTranslation('Pada', 'पद')} {planet.nakshatraPada})
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    {getTranslation('Degree', 'अंश')}:
                  </span>
                  <span className="ml-2 font-medium">
                    {planet.degreeInSign.toFixed(2)}°
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Summary Stats */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-semibold mb-3">
            {getTranslation('Strength Summary', 'शक्ति सारांश')}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {planets.filter(p => calculatePlanetaryStrength(p) >= 70).length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {getTranslation('Strong', 'मजबूत')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {planets.filter(p => {
                  const s = calculatePlanetaryStrength(p);
                  return s >= 50 && s < 70;
                }).length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {getTranslation('Average', 'औसत')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">
                {planets.filter(p => {
                  const s = calculatePlanetaryStrength(p);
                  return s >= 30 && s < 50;
                }).length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {getTranslation('Weak', 'कमजोर')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">
                {planets.filter(p => calculatePlanetaryStrength(p) < 30).length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {getTranslation('Very Weak', 'बहुत कमजोर')}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPlanetaryStrengthChart;
