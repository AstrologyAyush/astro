
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar, Star, TrendingUp, AlertCircle } from 'lucide-react';
import { calculateVimshottariDasha, calculateAntardasha, getDashaEffects } from '../lib/vimshottariDashaEngine';

interface EnhancedDashaTimingProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const EnhancedDashaTiming: React.FC<EnhancedDashaTimingProps> = ({ kundaliData, language }) => {
  const [selectedDasha, setSelectedDasha] = useState('current');

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  // Calculate real dasha data from kundali
  const dashaCalculations = useMemo(() => {
    if (!kundaliData?.birthData || !kundaliData?.planets?.MO) {
      return null;
    }

    const birthDate = new Date(kundaliData.birthData.date);
    const moonLongitude = kundaliData.planets.MO.longitude;
    const moonNakshatra = kundaliData.planets.MO.nakshatra;

    return calculateVimshottariDasha(birthDate, moonLongitude, moonNakshatra);
  }, [kundaliData]);

  // Calculate antardasha for current mahadasha
  const antardashaCalculations = useMemo(() => {
    if (!dashaCalculations?.currentMahadasha) return [];
    return calculateAntardasha(dashaCalculations.currentMahadasha);
  }, [dashaCalculations]);

  const currentAntardasha = antardashaCalculations.find(a => a.isActive);

  const calculateProgress = (startDate: Date | string, endDate: Date | string) => {
    const start = (typeof startDate === 'string' ? new Date(startDate) : startDate).getTime();
    const end = (typeof endDate === 'string' ? new Date(endDate) : endDate).getTime();
    const now = new Date().getTime();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  };

  const getDashaStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-green-600';
    if (strength >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTimeRemaining = (years?: number, months?: number, days?: number) => {
    if (years !== undefined) {
      const y = Math.floor(years);
      const m = Math.floor((years % 1) * 12);
      return `${y}Y ${m}M`;
    }
    if (months !== undefined) {
      const m = Math.floor(months);
      const d = Math.floor((months % 1) * 30);
      return `${m}M ${d}D`;
    }
    if (days !== undefined) {
      return `${Math.floor(days)} days`;
    }
    return '';
  };

  const getPlanetStrength = (planet: string) => {
    // Calculate strength based on planet position in kundali
    const planetData = kundaliData?.planets?.[planet.toUpperCase().substring(0, 2)];
    if (!planetData) return 75; // Default strength
    
    let strength = 50;
    
    // Add strength based on house position
    if (planetData.house >= 1 && planetData.house <= 4) strength += 20;
    else if (planetData.house >= 5 && planetData.house <= 8) strength += 10;
    
    // Add strength based on sign
    if (planetData.degreeInSign >= 15 && planetData.degreeInSign <= 20) strength += 15;
    
    // Reduce if retrograde
    if (planetData.isRetrograde) strength -= 10;
    
    return Math.min(100, Math.max(0, strength));
  };

  if (!dashaCalculations) {
    return (
      <Card className="border-indigo-200">
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">
            {getTranslation('Unable to calculate dasha timing', 'दशा समय की गणना नहीं हो सकी')}
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentMahadasha = dashaCalculations.currentMahadasha;
  const currentEffects = getDashaEffects(currentMahadasha.planet);

  return (
    <Card className="border-indigo-200">
      <CardHeader className="bg-gradient-to-r from-indigo-100 to-purple-100">
        <CardTitle className="text-indigo-800 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {getTranslation('Enhanced Dasha Timing', 'उन्नत दशा समय')}
        </CardTitle>
        <p className="text-sm text-indigo-600">
          {getTranslation('Precise planetary period analysis with timing', 'समय के साथ सटीक ग्रहीय काल विश्लेषण')}
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">
              {getTranslation('Current', 'वर्तमान')}
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              {getTranslation('Upcoming', 'आगामी')}
            </TabsTrigger>
            <TabsTrigger value="analysis">
              {getTranslation('Analysis', 'विश्लेषण')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="mt-6">
            {/* Current Mahadasha */}
            <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Badge className="bg-indigo-600 text-white mb-2">
                    {getTranslation('Current Mahadasha', 'वर्तमान महादशा')}
                  </Badge>
                  <h3 className="text-xl font-bold text-indigo-800">
                    {currentMahadasha.planet} {getTranslation(' Mahadasha', ' महादशा')}
                  </h3>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getDashaStrengthColor(getPlanetStrength(currentMahadasha.planet))}`}>
                    {getPlanetStrength(currentMahadasha.planet)}%
                  </div>
                  <div className="text-xs text-gray-500">{getTranslation('Strength', 'शक्ति')}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm text-indigo-600">{getTranslation('Duration', 'अवधि')}</div>
                  <div className="font-semibold">{currentMahadasha.totalYears} {getTranslation('years', 'वर्ष')}</div>
                </div>
                <div>
                  <div className="text-sm text-indigo-600">{getTranslation('Remaining', 'बचे हुए')}</div>
                  <div className="font-semibold">{formatTimeRemaining(currentMahadasha.remainingYears)}</div>
                </div>
                <div>
                  <div className="text-sm text-indigo-600">{getTranslation('Period', 'काल')}</div>
                  <div className="font-semibold text-xs">
                    {currentMahadasha.startDate.getFullYear()} - {currentMahadasha.endDate.getFullYear()}
                  </div>
                </div>
              </div>
              
              <Progress 
                value={calculateProgress(currentMahadasha.startDate, currentMahadasha.endDate)} 
                className="h-2" 
              />
            </div>

            {/* Current Antardasha */}
            {currentAntardasha && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Badge variant="outline" className="border-blue-300 text-blue-700 mb-2">
                      {getTranslation('Current Antardasha', 'वर्तमान अंतर्दशा')}
                    </Badge>
                    <h4 className="text-lg font-semibold text-blue-800">
                      {currentAntardasha.planet} {getTranslation(' Antardasha', ' अंतर्दशा')}
                    </h4>
                  </div>
                  <div className="text-right">
                    <div className={`text-md font-bold ${getDashaStrengthColor(getPlanetStrength(currentAntardasha.planet))}`}>
                      {getPlanetStrength(currentAntardasha.planet)}%
                    </div>
                    <div className="text-xs text-gray-500">{getTranslation('Strength', 'शक्ति')}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-blue-600">{getTranslation('Duration', 'अवधि')}</div>
                    <div className="font-semibold">{Math.round(currentAntardasha.durationMonths)} {getTranslation('months', 'महीने')}</div>
                  </div>
                  <div>
                    <div className="text-sm text-blue-600">{getTranslation('Period', 'काल')}</div>
                    <div className="font-semibold text-xs">
                      {currentAntardasha.startDate.toLocaleDateString()} - {currentAntardasha.endDate.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <Progress 
                  value={calculateProgress(currentAntardasha.startDate, currentAntardasha.endDate)} 
                  className="h-2" 
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4">
                {getTranslation('Upcoming Mahadashas', 'आगामी महादशा')}
              </h3>
              
              {dashaCalculations.allMahadashas.filter(d => !d.isCompleted && !d.isActive).slice(0, 3).map((dasha, index) => (
                <div key={index} className="p-4 border border-indigo-200 rounded-lg bg-indigo-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Badge className="bg-indigo-600 text-white mb-2">
                        {getTranslation('Upcoming Mahadasha', 'आगामी महादशा')}
                      </Badge>
                      <h4 className="text-lg font-semibold text-indigo-800">
                        {dasha.planet} {getTranslation('Mahadasha', 'महादशा')}
                      </h4>
                      <div className="text-sm text-indigo-600">
                        {dasha.startDate.getFullYear()} - {dasha.endDate.getFullYear()} ({dasha.totalYears} {getTranslation('years', 'वर्ष')})
                      </div>
                    </div>
                    <div className="text-right">
                      <Calendar className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-indigo-800 mb-1">
                        {getTranslation('Expected Effects', 'अपेक्षित प्रभाव')}
                      </h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {getDashaEffects(dasha.planet).positive.slice(0, 2).map((effect, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {effect}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-indigo-800 mb-1">
                        {getTranslation('Recommendations', 'सिफारिशें')}
                      </h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {getDashaEffects(dasha.planet).general.slice(0, 2).map((recommendation, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="mt-6">
            <div className="space-y-6">
              {/* Current Period Analysis */}
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-yellow-800">
                    {getTranslation('Current Period Analysis', 'वर्तमान काल विश्लेषण')}
                  </h3>
                </div>
                <p className="text-sm text-yellow-700 mb-3">
                  {getTranslation(
                    `${currentMahadasha.planet} Mahadasha brings ${currentEffects.general[0] || 'general influences'}. ${currentAntardasha ? `Currently in ${currentAntardasha.planet} Antardasha which adds specific themes.` : ''}`,
                    `${currentMahadasha.planet} महादशा ${currentEffects.general[0] || 'सामान्य प्रभाव'} लाता है। ${currentAntardasha ? `वर्तमान में ${currentAntardasha.planet} अंतर्दशा चल रहा है।` : ''}`
                  )}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-yellow-700">
                    {getTranslation(`Focus Areas: ${currentEffects.general.join(', ')}`, `मुख्य क्षेत्र: ${currentEffects.general.join(', ')}`)}
                  </span>
                </div>
              </div>

              {/* Strength Breakdown */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {getTranslation('Dasha Strength Breakdown', 'दशा शक्ति विभाजन')}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {getTranslation(`Mahadasha Lord (${currentMahadasha.planet})`, `महादशा स्वामी (${currentMahadasha.planet})`)}
                    </span>
                    <div className="flex items-center gap-2">
                      <Progress value={getPlanetStrength(currentMahadasha.planet)} className="h-2 w-20" />
                      <span className={`text-sm font-semibold ${getDashaStrengthColor(getPlanetStrength(currentMahadasha.planet))}`}>
                        {getPlanetStrength(currentMahadasha.planet)}%
                      </span>
                    </div>
                  </div>
                  
                  {currentAntardasha && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {getTranslation(`Antardasha Lord (${currentAntardasha.planet})`, `अंतर्दशा स्वामी (${currentAntardasha.planet})`)}
                      </span>
                      <div className="flex items-center gap-2">
                        <Progress value={getPlanetStrength(currentAntardasha.planet)} className="h-2 w-20" />
                        <span className={`text-sm font-semibold ${getDashaStrengthColor(getPlanetStrength(currentAntardasha.planet))}`}>
                          {getPlanetStrength(currentAntardasha.planet)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedDashaTiming;
