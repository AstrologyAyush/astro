import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Target, TrendingUp, Sparkles, Shield } from "lucide-react";
import { ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';

interface SimpleComprehensiveAnalysisProps {
  kundaliData: ComprehensiveKundaliData;
  language?: 'hi' | 'en';
}

const SimpleComprehensiveAnalysis: React.FC<SimpleComprehensiveAnalysisProps> = ({ 
  kundaliData, 
  language = 'en' 
}) => {
  const { enhancedCalculations, interpretations } = kundaliData;

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  return (
    <div className="space-y-6">
      {/* Your Core Nature */}
      <Card className="border-2 border-blue-200 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-blue-800 flex items-center gap-2 text-lg">
            <Star className="h-5 w-5" />
            {getTranslation('Your Core Nature', 'आपका मूल स्वभाव')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {getTranslation('Your Strengths', 'आपकी शक्तियां')}
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                {interpretations.personality.strengths.slice(0, 4).map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-700 mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                {getTranslation('Areas to Focus On', 'सुधार के क्षेत्र')}
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                {interpretations.personality.challenges.slice(0, 4).map((challenge, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-700 mb-2">
              {getTranslation('Your Mental Nature', 'आपकी मानसिक प्रकृति')}
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {interpretations.personality.temperament}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Life Areas */}
      <Card className="border-2 border-green-200 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-800 flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5" />
            {getTranslation('Life Areas Outlook', 'जीवन के मुख्य क्षेत्र')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-700 mb-2">
                {getTranslation('Career & Money', 'करियर और धन')}
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                {interpretations.predictions.youth.career[0] || getTranslation(
                  'Focus on building skills and networking for career growth.',
                  'कौशल विकास और नेटवर्किंग पर ध्यान दें।'
                )}
              </p>
              <p className="text-gray-600 text-xs">
                <strong>{getTranslation('Money:', 'धन:')}</strong> {
                  interpretations.predictions.youth.finance[0] || getTranslation(
                    'Gradual financial improvement expected.',
                    'वित्तीय स्थिति में धीरे-धीरे सुधार।'
                  )
                }
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-pink-200">
              <h4 className="font-semibold text-pink-700 mb-2">
                {getTranslation('Love & Relationships', 'प्रेम और रिश्ते')}
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {interpretations.predictions.youth.relationships[0] || getTranslation(
                  'Good potential for meaningful relationships and partnerships.',
                  'अच्छे रिश्ते और साझेदारी की संभावना।'
                )}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-700 mb-2">
                {getTranslation('Health & Wellness', 'स्वास्थ्य और कल्याण')}
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {interpretations.predictions.youth.health[0] || getTranslation(
                  'Maintain good health with regular exercise and balanced diet.',
                  'नियमित व्यायाम और संतुलित आहार से अच्छा स्वास्थ्य।'
                )}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-700 mb-2">
                {getTranslation('Family & Home', 'परिवार और घर')}
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {interpretations.predictions.childhood.generalTrends[0] || getTranslation(
                  'Strong family bonds and supportive home environment.',
                  'मजबूत पारिवारिक संबंध और सहायक घरेलू माहौल।'
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lucky Combinations (Yogas) */}
      <Card className="border-2 border-yellow-200 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-amber-800 flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5" />
            {getTranslation('Lucky Combinations in Your Chart', 'आपकी कुंडली के शुभ योग')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {enhancedCalculations.yogas.filter(y => y.isActive).length > 0 ? (
            enhancedCalculations.yogas.filter(y => y.isActive).slice(0, 3).map((yoga, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg border border-yellow-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-amber-800">{yoga.name}</h4>
                  <Badge className="bg-yellow-600 text-white text-xs">
                    {yoga.strength}% {getTranslation('Strong', 'शक्तिशाली')}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm mb-2">{yoga.description}</p>
                <div className="text-sm">
                  <strong className="text-amber-700">
                    {getTranslation('Benefits:', 'लाभ:')}
                  </strong>
                  <span className="text-gray-700 ml-1">
                    {yoga.effects.slice(0, 3).join(', ')}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <p className="text-gray-600 text-sm">
                {getTranslation(
                  'Your chart shows general planetary influences. Specific beneficial combinations may form as planets move.',
                  'आपकी कुंडली में सामान्य ग्रहीय प्रभाव दिखते हैं। विशिष्ट शुभ योग ग्रहों की गति से बन सकते हैं।'
                )}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Simple Recommendations */}
      <Card className="border-2 border-purple-200 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-purple-800 flex items-center gap-2 text-lg">
            <Heart className="h-5 w-5" />
            {getTranslation('Simple Recommendations for You', 'आपके लिए सरल सुझाव')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-700 mb-2">
                {getTranslation('Colors that Suit You', 'आपके अनुकूल रंग')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {(interpretations.remedies.colors || ['Blue', 'Green', 'White', 'Yellow']).map((color, idx) => (
                  <Badge key={idx} className="bg-green-100 text-green-800 text-xs">
                    {color}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-700 mb-2">
                {getTranslation('Lucky Numbers', 'भाग्यशाली अंक')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {(interpretations.remedies.numbers || [1, 3, 5, 7, 9]).slice(0, 5).map((number, idx) => (
                  <Badge key={idx} className="bg-blue-100 text-blue-800 text-xs">
                    {number}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-700 mb-2">
              {getTranslation('Good Days for Important Work', 'महत्वपूर्ण कार्यों के लिए शुभ दिन')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {(interpretations.remedies.days || ['Sunday', 'Wednesday', 'Thursday']).map((day, idx) => (
                <Badge key={idx} className="bg-purple-100 text-purple-800 text-xs">
                  {day}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleComprehensiveAnalysis;