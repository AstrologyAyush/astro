
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Heart, Brain, Shield, Apple, AlertTriangle, CheckCircle, Clock } from "lucide-react";

import { HealthPredictions } from '@/lib/geminiKundaliAnalysis';

interface AIHealthInsightsProps {
  healthData: HealthPredictions;
  language: 'hi' | 'en';
}

const AIHealthInsights: React.FC<AIHealthInsightsProps> = ({ 
  healthData,
  language 
}) => {
  const [activeTab, setActiveTab] = useState('health-overview');

  const getTranslation = (en: string, hi: string) => {
    // Note: The AI response will be in English.
    // For a full solution, a translation service would be needed here.
    // For now, we will just return the English text if language is 'hi'.
    return language === 'hi' ? en : en;
  };

  // The hardcoded data is removed. The component will now use healthData from props.
  if (!healthData) {
    return <div>{getTranslation('Loading health data...', 'स्वास्थ्य डेटा लोड हो रहा है...')}</div>;
  }

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
