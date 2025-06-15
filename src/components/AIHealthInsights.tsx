
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Heart, Brain, Shield, Apple, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface AIHealthInsightsProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const AIHealthInsights: React.FC<AIHealthInsightsProps> = ({ 
  kundaliData, 
  language 
}) => {
  const [activeTab, setActiveTab] = useState('health-overview');

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const healthData = {
    overview: {
      overallScore: '78%',
      constitution: getTranslation('Vata-Pitta dominant', 'वात-पित्त प्रधान'),
      lifeExpectancy: getTranslation('Above average (78-82 years)', 'औसत से ऊपर (78-82 वर्ष)'),
      immuneSystem: getTranslation('Moderate to Strong', 'मध्यम से मजबूत')
    },
    vulnerableAreas: [
      {
        system: getTranslation('Digestive System', 'पाचन तंत्र'),
        risk: 'Medium',
        planets: getTranslation('Mars-Mercury aspect', 'मंगल-बुध दृष्टि'),
        issues: [
          getTranslation('Acidity and gastric problems', 'अम्लता और गैस्ट्रिक समस्याएं'),
          getTranslation('Irregular eating patterns', 'अनियमित खाने के पैटर्न'),
          getTranslation('Food sensitivities', 'खाद्य संवेदनशीलताएं')
        ]
      },
      {
        system: getTranslation('Nervous System', 'तंत्रिका तंत्र'),
        risk: 'Low-Medium',
        planets: getTranslation('Mercury-Saturn influence', 'बुध-शनि प्रभाव'),
        issues: [
          getTranslation('Stress and anxiety tendencies', 'तनाव और चिंता की प्रवृत्तियां'),
          getTranslation('Sleep disorders', 'नींद संबंधी विकार'),
          getTranslation('Mental fatigue', 'मानसिक थकान')
        ]
      },
      {
        system: getTranslation('Cardiovascular System', 'हृदय संवहनी तंत्र'),
        risk: 'Low',
        planets: getTranslation('Sun-Venus harmony', 'सूर्य-शुक्र सामंजस्य'),
        issues: [
          getTranslation('Mild blood pressure fluctuations', 'हल्के रक्तचाप में उतार-चढ़ाव'),
          getTranslation('Cholesterol management needed after 40', '40 के बाद कोलेस्ट्रॉल प्रबंधन आवश्यक')
        ]
      }
    ],
    preventiveMeasures: {
      dietary: [
        getTranslation('Follow regular meal timings', 'नियमित भोजन समय का पालन करें'),
        getTranslation('Include more fiber and probiotics', 'अधिक फाइबर और प्रोबायोटिक्स शामिल करें'),
        getTranslation('Limit spicy and oily foods', 'मसालेदार और तैलीय भोजन सीमित करें'),
        getTranslation('Stay hydrated with warm water', 'गर्म पानी के साथ हाइड्रेटेड रहें'),
        getTranslation('Avoid eating late at night', 'रात में देर से खाना खाने से बचें')
      ],
      lifestyle: [
        getTranslation('Regular moderate exercise', 'नियमित मध्यम व्यायाम'),
        getTranslation('Daily meditation or pranayama', 'दैनिक ध्यान या प्राणायाम'),
        getTranslation('Maintain consistent sleep schedule', 'निरंतर नींद की अनुसूची बनाए रखें'),
        getTranslation('Stress management techniques', 'तनाव प्रबंधन तकनीकें'),
        getTranslation('Regular health checkups', 'नियमित स्वास्थ्य जांच')
      ],
      supplements: [
        getTranslation('Vitamin D (especially in winter)', 'विटामिन डी (विशेषकर सर्दियों में)'),
        getTranslation('Omega-3 fatty acids', 'ओमेगा-3 फैटी एसिड'),
        getTranslation('Probiotics for gut health', 'आंत के स्वास्थ्य के लिए प्रोबायोटिक्स'),
        getTranslation('Magnesium for stress', 'तनाव के लिए मैग्नीशियम')
      ]
    },
    mentalHealth: {
      score: '75%',
      strengths: [
        getTranslation('Good emotional intelligence', 'अच्छी भावनात्मक बुद्धिमत्ता'),
        getTranslation('Natural optimism', 'प्राकृतिक आशावाद'),
        getTranslation('Strong willpower', 'मजबूत इच्छाशक्ति'),
        getTranslation('Ability to bounce back from setbacks', 'असफलताओं से वापसी की क्षमता')
      ],
      challenges: [
        getTranslation('Tendency to overthink', 'अधिक सोचने की प्रवृत्ति'),
        getTranslation('Perfectionist tendencies', 'पूर्णतावादी प्रवृत्तियां'),
        getTranslation('Work-life balance issues', 'कार्य-जीवन संतुलन की समस्याएं')
      ],
      recommendations: [
        getTranslation('Practice mindfulness meditation', 'माइंडफुलनेस मेडिटेशन का अभ्यास करें'),
        getTranslation('Set boundaries between work and personal life', 'कार्य और व्यक्तिगत जीवन के बीच सीमाएं निर्धारित करें'),
        getTranslation('Regular social interactions', 'नियमित सामाजिक बातचीत'),
        getTranslation('Pursue creative hobbies', 'रचनात्मक शौक अपनाएं')
      ]
    },
    criticalPeriods: [
      {
        period: getTranslation('Age 28-30', 'आयु 28-30'),
        focus: getTranslation('Digestive health monitoring', 'पाचन स्वास्थ्य निगरानी'),
        actions: getTranslation('Establish healthy eating habits', 'स्वस्थ खाने की आदतें स्थापित करें')
      },
      {
        period: getTranslation('Age 35-40', 'आयु 35-40'),
        focus: getTranslation('Cardiovascular screening', 'हृदय संवहनी जांच'),
        actions: getTranslation('Regular blood pressure and cholesterol monitoring', 'नियमित रक्तचाप और कोलेस्ट्रॉल निगरानी')
      },
      {
        period: getTranslation('Age 45-50', 'आयु 45-50'),
        focus: getTranslation('Comprehensive health assessment', 'व्यापक स्वास्थ्य मूल्यांकन'),
        actions: getTranslation('Full body checkup and preventive measures', 'पूर्ण शरीर जांच और निवारक उपाय')
      }
    ]
  };

  return (
    <div className="space-y-6">
      <Card className="border-green-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Activity className="h-5 w-5" />
            {getTranslation('AI Health & Wellness Intelligence', 'AI स्वास्थ्य और कल्याण बुद्धिमत्ता')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-6">
              <TabsTrigger value="health-overview" className="flex flex-col items-center gap-1 text-xs p-2">
                <Heart className="h-3 w-3" />
                {getTranslation('Overview', 'सिंहावलोकन')}
              </TabsTrigger>
              <TabsTrigger value="vulnerable-areas" className="flex flex-col items-center gap-1 text-xs p-2">
                <AlertTriangle className="h-3 w-3" />
                {getTranslation('Risk Areas', 'जोखिम क्षेत्र')}
              </TabsTrigger>
              <TabsTrigger value="prevention" className="flex flex-col items-center gap-1 text-xs p-2">
                <Shield className="h-3 w-3" />
                {getTranslation('Prevention', 'रोकथाम')}
              </TabsTrigger>
              <TabsTrigger value="mental-health" className="flex flex-col items-center gap-1 text-xs p-2">
                <Brain className="h-3 w-3" />
                {getTranslation('Mental Health', 'मानसिक स्वास्थ्य')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="health-overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-800 mb-3">
                      {getTranslation('Health Constitution Analysis', 'स्वास्थ्य संविधान विश्लेषण')}
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{getTranslation('Overall Health Score', 'समग्र स्वास्थ्य स्कोर')}</span>
                        <Badge className="bg-blue-600 text-white">{healthData.overview.overallScore}</Badge>
                      </div>
                      <div>
                        <span className="text-sm font-medium">{getTranslation('Constitution:', 'संविधान:')}</span>
                        <p className="text-sm text-gray-600">{healthData.overview.constitution}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">{getTranslation('Life Expectancy:', 'जीवन प्रत्याशा:')}</span>
                        <p className="text-sm text-gray-600">{healthData.overview.lifeExpectancy}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">{getTranslation('Immune System:', 'प्रतिरक्षा प्रणाली:')}</span>
                        <p className="text-sm text-gray-600">{healthData.overview.immuneSystem}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-purple-800 mb-3">
                      {getTranslation('Critical Health Periods', 'महत्वपूर्ण स्वास्थ्य अवधि')}
                    </h4>
                    <div className="space-y-3">
                      {healthData.criticalPeriods.map((period, idx) => (
                        <div key={idx} className="border-l-4 border-purple-400 pl-3">
                          <div className="font-medium text-sm">{period.period}</div>
                          <div className="text-xs text-gray-600 mb-1">{period.focus}</div>
                          <div className="text-xs text-purple-700">{period.actions}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="vulnerable-areas" className="space-y-6">
              <div className="space-y-4">
                {healthData.vulnerableAreas.map((area, index) => (
                  <Card key={index} className="border-orange-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-orange-800">{area.system}</h4>
                        <Badge variant={area.risk === 'Medium' ? 'destructive' : 'secondary'}>
                          {area.risk} Risk
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        <strong>{getTranslation('Astrological Influence:', 'ज्योतिषीय प्रभाव:')}</strong> {area.planets}
                      </p>
                      <div>
                        <strong className="text-sm">{getTranslation('Potential Issues:', 'संभावित समस्याएं:')}</strong>
                        <ul className="mt-1 space-y-1">
                          {area.issues.map((issue, idx) => (
                            <li key={idx} className="text-sm flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="prevention" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                      <Apple className="h-4 w-4" />
                      {getTranslation('Dietary Guidelines', 'आहार दिशानिर्देश')}
                    </h4>
                    <ul className="space-y-2">
                      {healthData.preventiveMeasures.dietary.map((measure, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                          {measure}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      {getTranslation('Lifestyle Changes', 'जीवनशैली परिवर्तन')}
                    </h4>
                    <ul className="space-y-2">
                      {healthData.preventiveMeasures.lifestyle.map((measure, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
                          {measure}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      {getTranslation('Supplements', 'पूरक आहार')}
                    </h4>
                    <ul className="space-y-2">
                      {healthData.preventiveMeasures.supplements.map((supplement, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-purple-600 mt-0.5 flex-shrink-0" />
                          {supplement}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="mental-health" className="space-y-6">
              <Card className="border-teal-200 bg-teal-50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-teal-800">
                      {getTranslation('Mental Health Assessment', 'मानसिक स्वास्थ्य मूल्यांकन')}
                    </h4>
                    <Badge className="bg-teal-600 text-white">{healthData.mentalHealth.score}</Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-green-800 mb-3">
                      {getTranslation('Mental Strengths', 'मानसिक शक्तियां')}
                    </h4>
                    <ul className="space-y-2">
                      {healthData.mentalHealth.strengths.map((strength, idx) => (
                        <li key={idx} className="text-sm flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-orange-800 mb-3">
                      {getTranslation('Areas to Watch', 'ध्यान देने वाले क्षेत्र')}
                    </h4>
                    <ul className="space-y-2">
                      {healthData.mentalHealth.challenges.map((challenge, idx) => (
                        <li key={idx} className="text-sm flex items-center gap-2">
                          <AlertTriangle className="h-3 w-3 text-orange-600" />
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-indigo-200 bg-indigo-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-indigo-800 mb-3">
                    {getTranslation('Mental Wellness Recommendations', 'मानसिक कल्याण सिफारिशें')}
                  </h4>
                  <ul className="space-y-2">
                    {healthData.mentalHealth.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <Brain className="h-3 w-3 text-indigo-600 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIHealthInsights;
