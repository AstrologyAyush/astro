import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Moon, Sun, Calendar, MapPin, Clock, Sparkles } from "lucide-react";
import { ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';

interface KundaliConsultationViewProps {
  kundaliData: ComprehensiveKundaliData;
  language: 'hi' | 'en';
}

const KundaliConsultationView: React.FC<KundaliConsultationViewProps> = ({ 
  kundaliData, 
  language 
}) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const getTranslation = (en: string, hi: string) => language === 'hi' ? hi : en;

  useEffect(() => {
    generatePersonalizedInsights();
  }, [kundaliData, language]);

  const generatePersonalizedInsights = () => {
    setIsGenerating(true);
    
    // Simulate AI-powered insight generation
    setTimeout(() => {
      const generatedInsights = [
        getTranslation(
          `Your ${kundaliData.enhancedCalculations.lagna.signName} ascendant gives you natural leadership qualities and a strong personality.`,
          `आपका ${kundaliData.enhancedCalculations.lagna.signName} लग्न आपको प्राकृतिक नेतृत्व गुण और मजबूत व्यक्तित्व देता है।`
        ),
        getTranslation(
          `Moon in ${kundaliData.enhancedCalculations.planets.MO.rashiName} indicates strong emotional intelligence and intuitive nature.`,
          `${kundaliData.enhancedCalculations.planets.MO.rashiName} में चंद्रमा मजबूत भावनात्मक बुद्धि और सहज प्रकृति का संकेत देता है।`
        ),
        getTranslation(
          `Your birth nakshatra ${kundaliData.enhancedCalculations.planets.MO.nakshatraName} brings unique spiritual insights and creativity.`,
          `आपका जन्म नक्षत्र ${kundaliData.enhancedCalculations.planets.MO.nakshatraName} अनोखी आध्यात्मिक अंतर्दृष्टि और रचनात्मकता लाता है।`
        )
      ];
      
      setInsights(generatedInsights);
      setIsGenerating(false);
    }, 2000);
  };

  const formatDignity = (planet: any) => {
    if (planet.isExalted) return getTranslation('Exalted', 'उच्च');
    if (planet.isDebilitated) return getTranslation('Debilitated', 'नीच');
    if (planet.ownSign) return getTranslation('Own Sign', 'स्व राशि');
    return getTranslation('Neutral', 'तटस्थ');
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 70) return 'text-green-600 bg-green-100';
    if (strength >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-blue-800 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6" />
            {getTranslation('Personalized Consultation', 'व्यक्तिगत परामर्श')}
          </CardTitle>
          <p className="text-blue-600">
            {getTranslation(
              'Deep insights into your birth chart and life patterns',
              'आपकी जन्म कुंडली और जीवन पैटर्न की गहरी अंतर्दृष्टि'
            )}
          </p>
        </CardHeader>
      </Card>

      {/* Birth Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-600" />
            {getTranslation('Birth Chart Summary', 'जन्म चार्ट सारांश')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Sun className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-orange-800">
                {getTranslation('Ascendant', 'लग्न')}
              </h3>
              <p className="text-lg font-bold text-orange-600">
                {kundaliData.enhancedCalculations.lagna.signName}
              </p>
              <p className="text-sm text-orange-700">
                {kundaliData.enhancedCalculations.lagna.degree.toFixed(2)}°
              </p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Moon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-800">
                {getTranslation('Moon Sign', 'चन्द्र राशि')}
              </h3>
              <p className="text-lg font-bold text-blue-600">
                {kundaliData.enhancedCalculations.planets.MO.rashiName}
              </p>
              <p className="text-sm text-blue-700">
                {getTranslation('House', 'भाव')} {kundaliData.enhancedCalculations.planets.MO.house}
              </p>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <h3 className="font-semibold text-yellow-800">
                {getTranslation('Birth Nakshatra', 'जन्म नक्षत्र')}
              </h3>
              <p className="text-lg font-bold text-yellow-600">
                {kundaliData.enhancedCalculations.planets.MO.nakshatraName}
              </p>
              <p className="text-sm text-yellow-700">
                {getTranslation('Pada', 'पाद')} {kundaliData.enhancedCalculations.planets.MO.nakshatraPada}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personalized Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            {getTranslation('AI-Powered Insights', 'AI-संचालित अंतर्दृष्टि')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                {getTranslation('Generating personalized insights...', 'व्यक्तिगत अंतर्दृष्टि तैयार की जा रही है...')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <p className="text-purple-800">{insight}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Planetary Strengths */}
      <Card>
        <CardHeader>
          <CardTitle>
            {getTranslation('Planetary Strength Analysis', 'ग्रह शक्ति विश्लेषण')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(kundaliData.enhancedCalculations.planets).map(([planetId, planet]) => (
              <div key={planetId} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{planet.name}</h3>
                  <Badge className={getStrengthColor(planet.shadbala)}>
                    {planet.shadbala.toFixed(0)}%
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{getTranslation('Sign:', 'राशि:')}</span>
                    <span className="font-medium">{planet.rashiName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{getTranslation('House:', 'भाव:')}</span>
                    <span className="font-medium">{planet.house}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{getTranslation('Status:', 'स्थिति:')}</span>
                    <Badge variant={planet.isExalted ? 'default' : planet.isDebilitated ? 'destructive' : 'secondary'}>
                      {formatDignity(planet)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dasha Periods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-600" />
            {getTranslation('Current & Upcoming Dasha Periods', 'वर्तमान और आगामी दशा अवधि')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {kundaliData.enhancedCalculations.dashas.slice(0, 5).map((dasha, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border-l-4 ${
                  dasha.isActive 
                    ? 'bg-green-50 border-green-500' 
                    : 'bg-gray-50 border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {dasha.planet} {getTranslation('Dasha', 'दशा')}
                      {dasha.isActive && (
                        <Badge className="ml-2" variant="default">
                          {getTranslation('Current', 'वर्तमान')}
                        </Badge>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {dasha.startDate.toLocaleDateString()} - {dasha.endDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{dasha.years} {getTranslation('years', 'वर्ष')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Yogas */}
      {kundaliData.enhancedCalculations.yogas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {getTranslation('Special Yogas in Your Chart', 'आपके चार्ट में विशेष योग')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {kundaliData.enhancedCalculations.yogas.map((yoga, index) => (
                <div key={index} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-yellow-800">{yoga.name}</h3>
                      <p className="text-sm text-yellow-700">{yoga.sanskritName}</p>
                    </div>
                    <Badge 
                      variant={yoga.type === 'benefic' ? 'default' : 'destructive'}
                      className="ml-2"
                    >
                      {yoga.strength}% {getTranslation('strength', 'शक्ति')}
                    </Badge>
                  </div>
                  <p className="text-sm text-yellow-700 mb-2">{yoga.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {yoga.effects.map((effect, effectIndex) => (
                      <Badge key={effectIndex} variant="outline" className="text-xs">
                        {effect}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Remedies Section */}
      <Card>
        <CardHeader>
          <CardTitle>
            {getTranslation('Recommended Remedies', 'अनुशंसित उपाय')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gemstones */}
            <div>
              <h3 className="font-semibold mb-3 text-purple-800">
                {getTranslation('Gemstones', 'रत्न')}
              </h3>
              <div className="space-y-3">
                {kundaliData.interpretations.remedies.gemstones.slice(0, 2).map((gem, index) => (
                  <div key={index} className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-700">{gem.stone}</h4>
                    <p className="text-sm text-purple-600">
                      {getTranslation('For', 'के लिए')} {gem.planet} | {gem.weight} | {gem.metal}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mantras */}
            <div>
              <h3 className="font-semibold mb-3 text-blue-800">
                {getTranslation('Mantras', 'मंत्र')}
              </h3>
              <div className="space-y-3">
                {kundaliData.interpretations.remedies.mantras.slice(0, 2).map((mantra, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-700">{mantra.planet} {getTranslation('Mantra', 'मंत्र')}</h4>
                    <p className="text-sm text-blue-600 font-mono">{mantra.mantra}</p>
                    <p className="text-xs text-blue-500">{mantra.repetitions} - {mantra.timing}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="text-center">
        <Button 
          onClick={generatePersonalizedInsights}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          disabled={isGenerating}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {getTranslation('Generate New Insights', 'नई अंतर्दृष्टि तैयार करें')}
        </Button>
      </div>
    </div>
  );
};

export default KundaliConsultationView;
