
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar, Star, TrendingUp, AlertCircle } from 'lucide-react';

interface EnhancedDashaTimingProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const EnhancedDashaTiming: React.FC<EnhancedDashaTimingProps> = ({ kundaliData, language }) => {
  const [selectedDasha, setSelectedDasha] = useState('current');

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  // Enhanced dasha data with detailed timing
  const dashaData = {
    current: {
      mahadasha: {
        planet: 'Jupiter',
        planetHi: 'गुरु',
        startDate: '2022-03-15',
        endDate: '2038-03-15',
        totalYears: 16,
        remainingYears: 14.2,
        strength: 85
      },
      antardasha: {
        planet: 'Saturn',
        planetHi: 'शनि',
        startDate: '2023-10-01',
        endDate: '2026-04-15',
        totalMonths: 30,
        remainingMonths: 18.5,
        strength: 70
      },
      pratyantardasha: {
        planet: 'Mercury',
        planetHi: 'बुध',
        startDate: '2023-12-01',
        endDate: '2024-03-15',
        totalDays: 105,
        remainingDays: 45,
        strength: 75
      }
    },
    upcoming: [
      {
        level: 'Antardasha',
        planet: 'Mercury',
        planetHi: 'बुध',
        startDate: '2026-04-15',
        endDate: '2028-08-22',
        duration: '2 years 4 months',
        effects: getTranslation(
          'Communication, learning, business opportunities',
          'संचार, सीखना, व्यावसायिक अवसर'
        ),
        recommendations: getTranslation(
          'Focus on education, writing, technology ventures',
          'शिक्षा, लेखन, प्रौद्योगिकी उपक्रमों पर ध्यान दें'
        )
      },
      {
        level: 'Antardasha',
        planet: 'Ketu',
        planetHi: 'केतु',
        startDate: '2028-08-22',
        endDate: '2029-07-30',
        duration: '11 months',
        effects: getTranslation(
          'Spiritual awakening, detachment, research',
          'आध्यात्मिक जागृति, वैराग्य, अनुसंधान'
        ),
        recommendations: getTranslation(
          'Pursue meditation, research, avoid major investments',
          'ध्यान, अनुसंधान करें, बड़े निवेश से बचें'
        )
      }
    ]
  };

  const calculateProgress = (start: string, end: string) => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const now = new Date().getTime();
    
    if (now < startDate) return 0;
    if (now > endDate) return 100;
    
    const total = endDate - startDate;
    const elapsed = now - startDate;
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
                    {language === 'hi' ? dashaData.current.mahadasha.planetHi : dashaData.current.mahadasha.planet}
                    {getTranslation(' Mahadasha', ' महादशा')}
                  </h3>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getDashaStrengthColor(dashaData.current.mahadasha.strength)}`}>
                    {dashaData.current.mahadasha.strength}%
                  </div>
                  <div className="text-xs text-gray-500">{getTranslation('Strength', 'शक्ति')}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm text-indigo-600">{getTranslation('Duration', 'अवधि')}</div>
                  <div className="font-semibold">{dashaData.current.mahadasha.totalYears} {getTranslation('years', 'वर्ष')}</div>
                </div>
                <div>
                  <div className="text-sm text-indigo-600">{getTranslation('Remaining', 'बचे हुए')}</div>
                  <div className="font-semibold">{formatTimeRemaining(dashaData.current.mahadasha.remainingYears)}</div>
                </div>
                <div>
                  <div className="text-sm text-indigo-600">{getTranslation('Period', 'काल')}</div>
                  <div className="font-semibold text-xs">
                    {dashaData.current.mahadasha.startDate} - {dashaData.current.mahadasha.endDate}
                  </div>
                </div>
              </div>
              
              <Progress 
                value={calculateProgress(dashaData.current.mahadasha.startDate, dashaData.current.mahadasha.endDate)} 
                className="h-2" 
              />
            </div>

            {/* Current Antardasha */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Badge variant="outline" className="border-blue-300 text-blue-700 mb-2">
                    {getTranslation('Current Antardasha', 'वर्तमान अंतर्दशा')}
                  </Badge>
                  <h4 className="text-lg font-semibold text-blue-800">
                    {language === 'hi' ? dashaData.current.antardasha.planetHi : dashaData.current.antardasha.planet}
                    {getTranslation(' Antardasha', ' अंतर्दशा')}
                  </h4>
                </div>
                <div className="text-right">
                  <div className={`text-md font-bold ${getDashaStrengthColor(dashaData.current.antardasha.strength)}`}>
                    {dashaData.current.antardasha.strength}%
                  </div>
                  <div className="text-xs text-gray-500">{getTranslation('Strength', 'शक्ति')}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <div className="text-sm text-blue-600">{getTranslation('Duration', 'अवधि')}</div>
                  <div className="font-semibold">{dashaData.current.antardasha.totalMonths} {getTranslation('months', 'महीने')}</div>
                </div>
                <div>
                  <div className="text-sm text-blue-600">{getTranslation('Remaining', 'बचे हुए')}</div>
                  <div className="font-semibold">{formatTimeRemaining(undefined, dashaData.current.antardasha.remainingMonths)}</div>
                </div>
                <div>
                  <div className="text-sm text-blue-600">{getTranslation('Period', 'काल')}</div>
                  <div className="font-semibold text-xs">
                    {dashaData.current.antardasha.startDate} - {dashaData.current.antardasha.endDate}
                  </div>
                </div>
              </div>
              
              <Progress 
                value={calculateProgress(dashaData.current.antardasha.startDate, dashaData.current.antardasha.endDate)} 
                className="h-2" 
              />
            </div>

            {/* Current Pratyantardasha */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Badge variant="outline" className="border-green-300 text-green-700 mb-2">
                    {getTranslation('Current Pratyantardasha', 'वर्तमान प्रत्यंतर्दशा')}
                  </Badge>
                  <h4 className="text-lg font-semibold text-green-800">
                    {language === 'hi' ? dashaData.current.pratyantardasha.planetHi : dashaData.current.pratyantardasha.planet}
                    {getTranslation(' Pratyantardasha', ' प्रत्यंतर्दशा')}
                  </h4>
                </div>
                <div className="text-right">
                  <div className={`text-md font-bold ${getDashaStrengthColor(dashaData.current.pratyantardasha.strength)}`}>
                    {dashaData.current.pratyantardasha.strength}%
                  </div>
                  <div className="text-xs text-gray-500">{getTranslation('Strength', 'शक्ति')}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <div className="text-sm text-green-600">{getTranslation('Duration', 'अवधि')}</div>
                  <div className="font-semibold">{dashaData.current.pratyantardasha.totalDays} {getTranslation('days', 'दिन')}</div>
                </div>
                <div>
                  <div className="text-sm text-green-600">{getTranslation('Remaining', 'बचे हुए')}</div>
                  <div className="font-semibold">{formatTimeRemaining(undefined, undefined, dashaData.current.pratyantardasha.remainingDays)}</div>
                </div>
                <div>
                  <div className="text-sm text-green-600">{getTranslation('Period', 'काल')}</div>
                  <div className="font-semibold text-xs">
                    {dashaData.current.pratyantardasha.startDate} - {dashaData.current.pratyantardasha.endDate}
                  </div>
                </div>
              </div>
              
              <Progress 
                value={calculateProgress(dashaData.current.pratyantardasha.startDate, dashaData.current.pratyantardasha.endDate)} 
                className="h-2" 
              />
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4">
                {getTranslation('Upcoming Planetary Periods', 'आगामी ग्रहीय अवधि')}
              </h3>
              
              {dashaData.upcoming.map((period, index) => (
                <div key={index} className="p-4 border border-indigo-200 rounded-lg bg-indigo-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Badge className="bg-indigo-600 text-white mb-2">
                        {period.level}
                      </Badge>
                      <h4 className="text-lg font-semibold text-indigo-800">
                        {language === 'hi' ? period.planetHi : period.planet} {period.level}
                      </h4>
                      <div className="text-sm text-indigo-600">
                        {period.startDate} - {period.endDate} ({period.duration})
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
                      <p className="text-sm text-gray-700">{period.effects}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-indigo-800 mb-1">
                        {getTranslation('Recommendations', 'सिफारिशें')}
                      </h5>
                      <p className="text-sm text-gray-700">{period.recommendations}</p>
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
                    'Jupiter Mahadasha with Saturn Antardasha creates a balanced period of growth through discipline. Mercury Pratyantardasha adds communication and learning opportunities.',
                    'शनि अंतर्दशा के साथ गुरु महादशा अनुशासन के माध्यम से विकास की संतुलित अवधि बनाता है। बुध प्रत्यंतर्दशा संचार और सीखने के अवसर जोड़ता है।'
                  )}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-yellow-700">
                    {getTranslation('Favorable for: Education, Philosophy, Teaching', 'अनुकूल: शिक्षा, दर्शन, शिक्षण')}
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
                    <span className="text-sm text-gray-600">{getTranslation('Mahadasha Lord (Jupiter)', 'महादशा स्वामी (गुरु)')}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={85} className="h-2 w-20" />
                      <span className="text-sm font-semibold text-green-600">85%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{getTranslation('Antardasha Lord (Saturn)', 'अंतर्दशा स्वामी (शनि)')}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={70} className="h-2 w-20" />
                      <span className="text-sm font-semibold text-yellow-600">70%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{getTranslation('Pratyantardasha Lord (Mercury)', 'प्रत्यंतर्दशा स्वामी (बुध)')}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={75} className="h-2 w-20" />
                      <span className="text-sm font-semibold text-green-600">75%</span>
                    </div>
                  </div>
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
