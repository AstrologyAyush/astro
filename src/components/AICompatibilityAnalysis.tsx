import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Users, Star, Calendar, Gift, AlertCircle } from "lucide-react";

interface AICompatibilityAnalysisProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const AICompatibilityAnalysis: React.FC<AICompatibilityAnalysisProps> = ({ 
  kundaliData, 
  language 
}) => {
  const [activeTab, setActiveTab] = useState('ideal-partner');

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const compatibilityData = {
    idealPartner: {
      zodiacCompatibility: [
        {
          sign: getTranslation('Taurus', 'वृषभ'),
          compatibility: '96%',
          description: getTranslation('Perfect emotional and physical harmony', 'आदर्श भावनात्मक और शारीरिक सामंजस्य')
        },
        {
          sign: getTranslation('Cancer', 'कर्क'),
          compatibility: '91%',
          description: getTranslation('Deep emotional connection and family values', 'गहरा भावनात्मक जुड़ाव और पारिवारिक मूल्य')
        },
        {
          sign: getTranslation('Pisces', 'मीन'),
          compatibility: '88%',
          description: getTranslation('Spiritual connection and mutual understanding', 'आध्यात्मिक जुड़ाव और पारस्परिक समझ')
        }
      ],
      idealQualities: [
        getTranslation('Emotionally mature and stable', 'भावनात्मक रूप से परिपक्व और स्थिर'),
        getTranslation('Shares spiritual and cultural values', 'आध्यात्मिक और सांस्कृतिक मूल्य साझा करता है'),
        getTranslation('Supportive of career ambitions', 'करियर की महत्वाकांक्षाओं का समर्थक'),
        getTranslation('Good communication skills', 'अच्छे संवाद कौशल'),
        getTranslation('Family-oriented mindset', 'पारिवारिक सोच')
      ]
    },
    marriageTiming: {
      bestPeriods: [
        {
          period: getTranslation('April 2024 - June 2024', 'अप्रैल 2024 - जून 2024'),
          strength: 'Excellent',
          reason: getTranslation('Venus-Jupiter conjunction brings marriage opportunities', 'शुक्र-बृहस्पति युति विवाह के अवसर लाती है')
        },
        {
          period: getTranslation('October 2024 - December 2024', 'अक्टूबर 2024 - दिसंबर 2024'),
          strength: 'Very Good',
          reason: getTranslation('Favorable dasha period for relationships', 'रिश्तों के लिए अनुकूल दशा काल')
        },
        {
          period: getTranslation('February 2025 - April 2025', 'फरवरी 2025 - अप्रैल 2025'),
          strength: 'Good',
          reason: getTranslation('Mars aspect supports commitment', 'मंगल दृष्टि प्रतिबद्धता का समर्थन करती है')
        }
      ],
      avoidPeriods: [
        getTranslation('July 2024 - September 2024 (Venus retrograde)', 'जुलाई 2024 - सितंबर 2024 (शुक्र वक्री)'),
        getTranslation('January 2025 (Saturn transit)', 'जनवरी 2025 (शनि गोचर)')
      ]
    },
    relationshipGuidance: {
      strengths: [
        getTranslation('Natural ability to attract partners', 'साझीदारों को आकर्षित करने की प्राकृतिक क्षमता'),
        getTranslation('Deep capacity for love and commitment', 'प्रेम और प्रतिबद्धता की गहरी क्षमता'),
        getTranslation('Excellent communication in relationships', 'रिश्तों में उत्कृष्ट संवाद'),
        getTranslation('Strong family values', 'मजबूत पारिवारिक मूल्य')
      ],
      challenges: [
        getTranslation('May be overly idealistic about partners', 'साझीदारों के बारे में अधिक आदर्शवादी हो सकते हैं'),
        getTranslation('Tendency to prioritize career over relationships', 'रिश्तों से ज्यादा करियर को प्राथमिकता देने की प्रवृत्ति'),
        getTranslation('Need for personal space may be misunderstood', 'व्यक्तिगत स्थान की आवश्यकता गलत समझी जा सकती है')
      ],
      advice: [
        getTranslation('Practice open and honest communication', 'खुला और ईमानदार संवाद का अभ्यास करें'),
        getTranslation('Balance career ambitions with relationship needs', 'करियर की महत्वाकांक्षाओं को रिश्ते की जरूरतों के साथ संतुलित करें'),
        getTranslation('Show appreciation and gratitude regularly', 'नियमित रूप से प्रशंसा और कृतज्ञता दिखाएं')
      ]
    },
    familyLife: {
      childrenTiming: {
        firstChild: getTranslation('2026-2027 most favorable', '2026-2027 सबसे अनुकूल'),
        secondChild: getTranslation('2029-2030 recommended', '2029-2030 अनुशंसित'),
        totalChildren: getTranslation('2-3 children indicated', '2-3 बच्चे संकेतित')
      },
      parentingStyle: getTranslation(
        'Nurturing and educational, with emphasis on values and culture',
        'मूल्यों और संस्कृति पर जोर देने के साथ पोषणकारी और शिक्षाप्रद'
      ),
      familyHappiness: '92%'
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-pink-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-pink-100 to-rose-100">
          <CardTitle className="flex items-center gap-2 text-pink-800">
            <Heart className="h-5 w-5" />
            {getTranslation('Love & Compatibility Intelligence', 'प्रेम और अनुकूलता बुद्धिमत्ता')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-6">
              <TabsTrigger value="ideal-partner" className="flex flex-col items-center gap-1 text-xs p-2">
                <Heart className="h-3 w-3" />
                {getTranslation('Ideal Partner', 'आदर्श साथी')}
              </TabsTrigger>
              <TabsTrigger value="marriage-timing" className="flex flex-col items-center gap-1 text-xs p-2">
                <Calendar className="h-3 w-3" />
                {getTranslation('Marriage Timing', 'विवाह समय')}
              </TabsTrigger>
              <TabsTrigger value="relationship-guidance" className="flex flex-col items-center gap-1 text-xs p-2">
                <Users className="h-3 w-3" />
                {getTranslation('Relationship Tips', 'रिश्ते की सलाह')}
              </TabsTrigger>
              <TabsTrigger value="family-life" className="flex flex-col items-center gap-1 text-xs p-2">
                <Gift className="h-3 w-3" />
                {getTranslation('Family Life', 'पारिवारिक जीवन')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ideal-partner" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-pink-800 mb-4">
                  {getTranslation('Most Compatible Zodiac Signs', 'सबसे अनुकूल राशि चिह्न')}
                </h3>
                {compatibilityData.idealPartner.zodiacCompatibility.map((match, index) => (
                  <Card key={index} className="border-pink-100">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-pink-800">{match.sign}</h4>
                        <Badge className="bg-pink-600 text-white">{match.compatibility}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{match.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-purple-800 mb-3">
                    {getTranslation('Ideal Partner Qualities', 'आदर्श साथी के गुण')}
                  </h4>
                  <ul className="space-y-2">
                    {compatibilityData.idealPartner.idealQualities.map((quality, idx) => (
                      <li key={idx} className="text-sm flex items-center gap-2">
                        <Star className="h-3 w-3 text-purple-600" />
                        {quality}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="marriage-timing" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-800 mb-4">
                  {getTranslation('Auspicious Marriage Periods', 'शुभ विवाह काल')}
                </h3>
                {compatibilityData.marriageTiming.bestPeriods.map((period, index) => (
                  <Card key={index} className="border-green-100">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{period.period}</span>
                        <Badge variant={period.strength === 'Excellent' ? 'default' : 'secondary'}>
                          {period.strength}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{period.reason}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {getTranslation('Periods to Avoid', 'बचने वाले काल')}
                  </h4>
                  <ul className="space-y-1">
                    {compatibilityData.marriageTiming.avoidPeriods.map((period, idx) => (
                      <li key={idx} className="text-sm text-red-700">{period}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="relationship-guidance" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-green-800 mb-3">
                      {getTranslation('Your Strengths', 'आपकी ताकतें')}
                    </h4>
                    <ul className="space-y-2">
                      {compatibilityData.relationshipGuidance.strengths.map((strength, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2"></span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-orange-800 mb-3">
                      {getTranslation('Areas to Improve', 'सुधार के क्षेत्र')}
                    </h4>
                    <ul className="space-y-2">
                      {compatibilityData.relationshipGuidance.challenges.map((challenge, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2"></span>
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-blue-800 mb-3">
                    {getTranslation('Relationship Advice', 'रिश्ते की सलाह')}
                  </h4>
                  <ul className="space-y-2">
                    {compatibilityData.relationshipGuidance.advice.map((advice, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></span>
                        {advice}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="family-life" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-indigo-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-indigo-800 mb-3">
                      {getTranslation('Children & Family Planning', 'बच्चे और पारिवारिक योजना')}
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium">{getTranslation('First Child:', 'पहला बच्चा:')}</span>
                        <p className="text-sm text-gray-600">{compatibilityData.familyLife.childrenTiming.firstChild}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">{getTranslation('Second Child:', 'दूसरा बच्चा:')}</span>
                        <p className="text-sm text-gray-600">{compatibilityData.familyLife.childrenTiming.secondChild}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">{getTranslation('Family Size:', 'परिवार का आकार:')}</span>
                        <p className="text-sm text-gray-600">{compatibilityData.familyLife.childrenTiming.totalChildren}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-teal-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-teal-800 mb-3">
                      {getTranslation('Family Happiness Index', 'पारिवारिक खुशी सूचकांक')}
                    </h4>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-teal-600">{compatibilityData.familyLife.familyHappiness}</div>
                      <p className="text-sm text-gray-600">{getTranslation('Overall Family Harmony', 'समग्र पारिवारिक सामंजस्य')}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">{getTranslation('Parenting Style:', 'पालन-पोषण शैली:')}</span>
                      <p className="text-sm text-gray-600 mt-1">{compatibilityData.familyLife.parentingStyle}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AICompatibilityAnalysis;
