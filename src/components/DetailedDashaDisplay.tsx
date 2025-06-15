
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Clock, Star } from 'lucide-react';
import { calculateVimshottariDasha, calculateAntardasha, getDashaEffects } from '../lib/vimshottariDashaEngine';

interface DetailedDashaDisplayProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const DetailedDashaDisplay: React.FC<DetailedDashaDisplayProps> = ({ kundaliData, language }) => {
  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  // Calculate real dasha data from kundali using the same engine as other components
  const dashaCalculations = useMemo(() => {
    if (!kundaliData?.birthData || !kundaliData?.planets?.MO) {
      return null;
    }

    const birthDate = new Date(kundaliData.birthData.date);
    const moonLongitude = kundaliData.planets.MO.longitude;
    const moonNakshatra = kundaliData.planets.MO.nakshatra;

    return calculateVimshottariDasha(birthDate, moonLongitude, moonNakshatra);
  }, [kundaliData]);

  const planetNames = {
    hi: {
      Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
      Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु'
    },
    en: {
      Sun: 'Sun', Moon: 'Moon', Mars: 'Mars', Mercury: 'Mercury',
      Jupiter: 'Jupiter', Venus: 'Venus', Saturn: 'Saturn', Rahu: 'Rahu', Ketu: 'Ketu'
    }
  };

  const calculateProgress = (startDate: Date, endDate: Date) => {
    const start = startDate.getTime();
    const end = endDate.getTime();
    const now = new Date().getTime();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  };

  const calculateRemainingYears = (endDate: Date) => {
    const end = endDate.getTime();
    const now = new Date().getTime();
    const remainingMs = end - now;
    return Math.max(0, remainingMs / (365.25 * 24 * 60 * 60 * 1000));
  };

  if (!dashaCalculations) {
    return (
      <Card className="border-purple-200">
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">
            {getTranslation('Unable to calculate dasha periods', 'दशा काल की गणना नहीं हो सकी')}
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentDasha = dashaCalculations.currentMahadasha;
  const antardashaCalculations = calculateAntardasha(currentDasha);
  const currentAntardasha = antardashaCalculations.find(a => a.isActive);
  const currentEffects = getDashaEffects(currentDasha.planet);

  return (
    <div className="space-y-6">
      <Card className="border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100">
          <CardTitle className="text-purple-800 flex items-center gap-2">
            <Star className="h-5 w-5" />
            {getTranslation('Detailed Dasha Periods', 'विस्तृत दशा काल')}
          </CardTitle>
          <p className="text-sm text-purple-600">
            {getTranslation('Complete Vimshottari Dasha System', 'संपूर्ण विम्शोत्तरी दशा प्रणाली')}
          </p>
        </CardHeader>
        <CardContent className="p-6">
          {/* Current Dasha Highlight */}
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <Badge className="bg-purple-600 text-white">
                {getTranslation('Current Mahadasha', 'वर्तमान महादशा')}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <Clock className="h-4 w-4" />
                <span>{calculateRemainingYears(currentDasha.endDate).toFixed(1)} {getTranslation('years left', 'साल बचे')}</span>
              </div>
            </div>
            
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-purple-800">
                {planetNames[language][currentDasha.planet as keyof typeof planetNames.en] || currentDasha.planet}
                {getTranslation(' Mahadasha', ' महादशा')}
              </h3>
              <p className="text-purple-600">
                {currentDasha.startDate.getFullYear()} - {currentDasha.endDate.getFullYear()}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-purple-600">
                <span>{getTranslation('Progress', 'प्रगति')}</span>
                <span>{calculateProgress(currentDasha.startDate, currentDasha.endDate)}%</span>
              </div>
              <Progress 
                value={calculateProgress(currentDasha.startDate, currentDasha.endDate)} 
                className="h-2"
              />
            </div>

            {currentAntardasha && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  {getTranslation('Current Antardasha', 'वर्तमान अंतर्दशा')}
                </h4>
                <div className="text-center">
                  <Badge variant="outline" className="text-blue-700 border-blue-300">
                    {planetNames[language][currentAntardasha.planet as keyof typeof planetNames.en] || currentAntardasha.planet}
                    {getTranslation(' Antardasha', ' अंतर्दशा')}
                  </Badge>
                  <div className="text-sm text-blue-600 mt-2">
                    {currentAntardasha.startDate.toLocaleDateString()} - {currentAntardasha.endDate.toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Calculation Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">
                {getTranslation('Calculation Details (Traditional Method)', 'गणना विवरण (पारंपरिक विधि)')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-semibold text-gray-600">
                    {getTranslation("Moon's Nakshatra", 'चंद्रमा का नक्षत्र')}
                  </div>
                  <div className="text-gray-800">{dashaCalculations.moonNakshatra}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">
                    {getTranslation('Nakshatra Lord', 'नक्षत्र स्वामी')}
                  </div>
                  <div className="text-gray-800">{dashaCalculations.calculationDetails.nakshatraLord}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">
                    {getTranslation('Degree in Nakshatra', 'नक्षत्र में अंश')}
                  </div>
                  <div className="text-gray-800">{dashaCalculations.moonDegreeInNakshatra.toFixed(4)}°</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">
                    {getTranslation('Balance at Birth', 'जन्म के समय शेष')}
                  </div>
                  <div className="text-gray-800">
                    {dashaCalculations.calculationDetails.balanceAtBirth.toFixed(4)} {getTranslation('years', 'वर्ष')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dasha Effects */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">
                {currentDasha.planet} {getTranslation('Mahadasha Effects', 'महादशा प्रभाव')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">
                    {getTranslation('Positive Effects', 'सकारात्मक प्रभाव')}
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {currentEffects.positive.map((effect, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {effect}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-700 mb-2">
                    {getTranslation('Challenges', 'चुनौतियां')}
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {currentEffects.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">
                    {getTranslation('General Focus', 'सामान्य फोकस')}
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {currentEffects.general.map((focus, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {focus}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* All Dasha Periods */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">
                {getTranslation('Complete Dasha Sequence', 'संपूर्ण दशा अनुक्रम')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashaCalculations.allMahadashas.map((dasha, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border ${
                      dasha.isActive 
                        ? 'bg-orange-50 border-orange-200' 
                        : dasha.isCompleted 
                          ? 'bg-gray-50 border-gray-200' 
                          : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant={dasha.isActive ? "default" : "outline"}
                          className={dasha.isActive ? "bg-orange-500" : ""}
                        >
                          {planetNames[language][dasha.planet as keyof typeof planetNames.en] || dasha.planet}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {dasha.startDate.getFullYear()} - {dasha.endDate.getFullYear()}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-800">
                          {dasha.totalYears} {getTranslation('years', 'वर्ष')}
                        </div>
                        {dasha.isActive && dasha.remainingYears && (
                          <div className="text-xs text-orange-600">
                            {Math.floor(dasha.remainingYears)}Y {Math.floor((dasha.remainingYears % 1) * 12)}M {getTranslation('left', 'बचे')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedDashaDisplay;
