
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Clock, Star, Calendar } from 'lucide-react';

interface TransitAnalysisProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const TransitAnalysis: React.FC<TransitAnalysisProps> = ({ kundaliData, language }) => {
  const [currentTransits, setCurrentTransits] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  useEffect(() => {
    // Generate current transit data
    generateCurrentTransits();
  }, []);

  const generateCurrentTransits = () => {
    const now = new Date();
    const transits = [
      {
        planet: 'Jupiter',
        planetHi: 'गुरु',
        currentSign: 'Taurus',
        currentSignHi: 'वृष',
        natalHouse: 5,
        transitHouse: 7,
        effect: getTranslation('Expansion in partnerships and relationships', 'साझेदारी और रिश्तों में विस्तार'),
        intensity: 'High',
        duration: getTranslation('Until May 2024', 'मई 2024 तक'),
        advice: getTranslation('Good time for marriage or business partnerships', 'विवाह या व्यावसायिक साझेदारी के लिए अच्छा समय')
      },
      {
        planet: 'Saturn',
        planetHi: 'शनि',
        currentSign: 'Aquarius',
        currentSignHi: 'कुम्भ',
        natalHouse: 3,
        transitHouse: 6,
        effect: getTranslation('Discipline in daily work and health routines', 'दैनिक कार्य और स्वास्थ्य दिनचर्या में अनुशासन'),
        intensity: 'Medium',
        duration: getTranslation('Until March 2025', 'मार्च 2025 तक'),
        advice: getTranslation('Focus on building healthy habits and work discipline', 'स्वस्थ आदतें और कार्य अनुशासन बनाने पर ध्यान दें')
      },
      {
        planet: 'Mars',
        planetHi: 'मंगल',
        currentSign: 'Leo',
        currentSignHi: 'सिंह',
        natalHouse: 8,
        transitHouse: 2,
        effect: getTranslation('Energy boost in financial matters', 'वित्तीय मामलों में ऊर्जा की वृद्धि'),
        intensity: 'High',
        duration: getTranslation('Until January 2024', 'जनवरी 2024 तक'),
        advice: getTranslation('Good time for investments and increasing income', 'निवेश और आय बढ़ाने के लिए अच्छा समय')
      },
      {
        planet: 'Venus',
        planetHi: 'शुक्र',
        currentSign: 'Virgo',
        currentSignHi: 'कन्या',
        natalHouse: 12,
        transitHouse: 3,
        effect: getTranslation('Harmonious communication and creative expression', 'सामंजस्यपूर्ण संचार और रचनात्मक अभिव्यक्ति'),
        intensity: 'Medium',
        duration: getTranslation('Until February 2024', 'फरवरी 2024 तक'),
        advice: getTranslation('Express creativity and improve relationships with siblings', 'रचनात्मकता व्यक्त करें और भाई-बहनों के साथ संबंध सुधारें')
      }
    ];
    
    setCurrentTransits(transits);
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-cyan-100">
        <CardTitle className="text-blue-800 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {getTranslation('Current Transit Analysis', 'वर्तमान गोचर विश्लेषण')}
        </CardTitle>
        <p className="text-sm text-blue-600">
          {getTranslation('Real-time planetary movements and their effects', 'वास्तविक समय में ग्रहों की गति और उनके प्रभाव')}
        </p>
      </CardHeader>
      <CardContent className="p-6">
        {/* Period Selection */}
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <Button
              variant={selectedPeriod === 'current' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('current')}
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              {getTranslation('Current', 'वर्तमान')}
            </Button>
            <Button
              variant={selectedPeriod === 'upcoming' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('upcoming')}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              {getTranslation('Upcoming', 'आगामी')}
            </Button>
            <Button
              variant={selectedPeriod === 'yearly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('yearly')}
              className="flex items-center gap-2"
            >
              <Star className="h-4 w-4" />
              {getTranslation('Yearly', 'वार्षिक')}
            </Button>
          </div>
        </div>

        {/* Transit Cards */}
        <div className="space-y-4">
          {currentTransits.map((transit, index) => (
            <div key={index} className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-blue-800">
                    {language === 'hi' ? transit.planetHi : transit.planet}
                  </div>
                  <div className="text-sm text-blue-600">
                    <div>{getTranslation('in', 'में')} {language === 'hi' ? transit.currentSignHi : transit.currentSign}</div>
                    <div>{getTranslation('Transiting House', 'गोचर भाव')} {transit.transitHouse}</div>
                  </div>
                </div>
                <Badge className={`${getIntensityColor(transit.intensity)} border`}>
                  {transit.intensity} {getTranslation('Impact', 'प्रभाव')}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">
                    {getTranslation('Effect', 'प्रभाव')}
                  </h4>
                  <p className="text-sm text-gray-700">{transit.effect}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">
                    {getTranslation('Advice', 'सलाह')}
                  </h4>
                  <p className="text-sm text-gray-700">{transit.advice}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="flex justify-between text-xs text-blue-600">
                  <span>{getTranslation('Duration:', 'अवधि:')} {transit.duration}</span>
                  <span>{getTranslation('Natal House:', 'जन्म भाव:')} {transit.natalHouse}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Transit Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">
            {getTranslation('Overall Transit Outlook', 'समग्र गोचर दृष्टिकोण')}
          </h4>
          <p className="text-sm text-blue-700">
            {getTranslation(
              'Current planetary transits suggest a period of growth in relationships and financial matters. Focus on building partnerships and maintaining disciplined work routines.',
              'वर्तमान ग्रहीय गोचर रिश्तों और वित्तीय मामलों में वृद्धि की अवधि का सुझाव देते हैं। साझेदारी बनाने और अनुशासित कार्य दिनचर्या बनाए रखने पर ध्यान दें।'
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransitAnalysis;
