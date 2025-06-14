
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';
import { CalendarDays, Clock, Star } from 'lucide-react';

interface DetailedDashaDisplayProps {
  kundaliData: ComprehensiveKundaliData;
  language: 'hi' | 'en';
}

const DetailedDashaDisplay: React.FC<DetailedDashaDisplayProps> = ({ kundaliData, language }) => {
  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  // Fix: Access dashas from enhancedCalculations only
  const dashas = kundaliData.enhancedCalculations?.dashas || [];
  const currentDasha = dashas.find(d => d.isActive) || dashas[0];

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

  const getYearFromDate = (date: string | Date) => {
    if (!date) return new Date().getFullYear();
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.getFullYear();
  };

  const formatDateString = (date: string | Date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString();
  };

  const calculateProgress = (startDate: string | Date, endDate: string | Date) => {
    if (!startDate || !endDate) return 0;
    
    const start = (typeof startDate === 'string' ? new Date(startDate) : startDate).getTime();
    const end = (typeof endDate === 'string' ? new Date(endDate) : endDate).getTime();
    const now = new Date().getTime();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  };

  const calculateRemainingYears = (endDate: string | Date) => {
    if (!endDate) return 0;
    const end = (typeof endDate === 'string' ? new Date(endDate) : endDate).getTime();
    const now = new Date().getTime();
    const remainingMs = end - now;
    return Math.max(0, remainingMs / (365.25 * 24 * 60 * 60 * 1000));
  };

  return (
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
        {currentDasha && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <Badge className="bg-purple-600 text-white">
                {getTranslation('Current Mahadasha', 'वर्तमान महादशा')}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <Clock className="h-4 w-4" />
                <span>{calculateRemainingYears(currentDasha.endDate)?.toFixed(1)} {getTranslation('years left', 'साल बचे')}</span>
              </div>
            </div>
            
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-purple-800">
                {planetNames[language][currentDasha.planet as keyof typeof planetNames.en] || currentDasha.planet}
                {getTranslation(' Mahadasha', ' महादशा')}
              </h3>
              <p className="text-purple-600">
                {getYearFromDate(currentDasha.startDate)} - {getYearFromDate(currentDasha.endDate)}
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
          </div>
        )}

        {/* All Dasha Periods */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-purple-800 border-b border-purple-200 pb-2">
            {getTranslation('Complete Dasha Sequence', 'संपूर्ण दशा अनुक्रम')}
          </h4>
          
          <div className="grid gap-3">
            {dashas.map((dasha, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                  dasha.isActive 
                    ? 'bg-purple-100 border-purple-300 shadow-md' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      dasha.isActive ? 'bg-purple-600' : 'bg-gray-400'
                    }`}></div>
                    <div>
                      <h5 className={`font-semibold ${
                        dasha.isActive ? 'text-purple-800' : 'text-gray-700'
                      }`}>
                        {planetNames[language][dasha.planet as keyof typeof planetNames.en] || dasha.planet}
                        {getTranslation(' Mahadasha', ' महादशा')}
                      </h5>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <CalendarDays className="h-3 w-3" />
                        <span>
                          {getYearFromDate(dasha.startDate)} - {getYearFromDate(dasha.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      dasha.isActive ? 'text-purple-600' : 'text-gray-500'
                    }`}>
                      {dasha.years || 0} {getTranslation('years', 'वर्ष')}
                    </div>
                    {dasha.isActive && (
                      <div className="text-xs text-gray-500">
                        {calculateRemainingYears(dasha.endDate).toFixed(1)} {getTranslation('left', 'बचे')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>{getTranslation('Note:', 'नोट:')}</strong> {getTranslation(
              'Vimshottari Dasha is a 120-year planetary period system that shows the timing of life events and planetary influences.',
              'विम्शोत्तरी दशा एक 120 वर्षीय ग्रहीय काल प्रणाली है जो जीवन की घटनाओं और ग्रहीय प्रभावों का समय दिखाती है।'
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedDashaDisplay;
