
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Brain, Zap, Target, TrendingUp, AlertTriangle, Star, Lightbulb } from "lucide-react";
import { calculateNumerologyProfile, NumerologyProfile } from '@/lib/numerologyUtils';
import { calculateCompatibility, CompatibilityResult } from '@/lib/numerologyCompatibility';

interface AdvancedNumerologyCompatibilityProps {
  profile1?: NumerologyProfile;
  profile2?: NumerologyProfile;
  name1?: string;
  name2?: string;
  language: 'hi' | 'en';
}

const AdvancedNumerologyCompatibility: React.FC<AdvancedNumerologyCompatibilityProps> = ({
  profile1,
  profile2,
  name1,
  name2,
  language
}) => {
  const [compatibility, setCompatibility] = useState<CompatibilityResult | null>(null);

  React.useEffect(() => {
    if (profile1 && profile2) {
      const result = calculateCompatibility(profile1, profile2);
      setCompatibility(result);
    }
  }, [profile1, profile2]);

  const getText = (en: string, hi: string) => language === 'hi' ? hi : en;

  const getCompatibilityIcon = (score: number) => {
    if (score >= 8) return <Heart className="h-5 w-5 text-red-500" />;
    if (score >= 6) return <Star className="h-5 w-5 text-blue-500" />;
    if (score >= 4) return <Zap className="h-5 w-5 text-yellow-500" />;
    return <AlertTriangle className="h-5 w-5 text-gray-500" />;
  };

  const getScoreGradient = (score: number) => {
    if (score >= 8) return "from-red-100 to-pink-100";
    if (score >= 6) return "from-blue-100 to-indigo-100";
    if (score >= 4) return "from-yellow-100 to-orange-100";
    return "from-gray-100 to-slate-100";
  };

  const relationshipInsights = [
    {
      category: getText('Emotional Connection', 'भावनात्मक जुड़ाव'),
      icon: <Heart className="h-4 w-4" />,
      description: getText(
        'How well you connect emotionally and understand each other\'s feelings',
        'आप कितनी अच्छी तरह भावनात्मक रूप से जुड़ते हैं और एक-दूसरे की भावनाओं को समझते हैं'
      )
    },
    {
      category: getText('Intellectual Harmony', 'बौद्धिक सामंजस्य'),
      icon: <Brain className="h-4 w-4" />,
      description: getText(
        'Mental compatibility and ability to engage in meaningful conversations',
        'मानसिक संगतता और सार्थक बातचीत में शामिल होने की क्षमता'
      )
    },
    {
      category: getText('Energy Alignment', 'ऊर्जा संरेखण'),
      icon: <Zap className="h-4 w-4" />,
      description: getText(
        'How well your energy levels and life rhythms synchronize',
        'आपके ऊर्जा स्तर और जीवन लय कितनी अच्छी तरह तालमेल बिठाते हैं'
      )
    },
    {
      category: getText('Goal Compatibility', 'लक्ष्य संगतता'),
      icon: <Target className="h-4 w-4" />,
      description: getText(
        'Alignment of life goals, values, and future aspirations',
        'जीवन लक्ष्यों, मूल्यों और भविष्य की आकांक्षाओं का संरेखण'
      )
    }
  ];

  if (!compatibility || !profile1 || !profile2) {
    return (
      <Card className="border-purple-200">
        <CardContent className="p-8 text-center">
          <Heart className="h-12 w-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-purple-800 mb-2">
            {getText('Advanced Compatibility Analysis', 'उन्नत संगतता विश्लेषण')}
          </h3>
          <p className="text-purple-600">
            {getText(
              'Generate two numerology profiles to see advanced compatibility insights',
              'उन्नत संगतता अंतर्दृष्टि देखने के लिए दो अंकज्योतिष प्रोफाइल बनाएं'
            )}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Compatibility Score */}
      <Card className={`bg-gradient-to-br ${getScoreGradient(compatibility.overallScore)} border-2`}>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              {getCompatibilityIcon(compatibility.overallScore)}
              <span className="text-2xl font-bold">
                {name1} & {name2}
              </span>
            </div>
            
            <div className="text-6xl font-bold mb-2 text-gray-800">
              {compatibility.overallScore.toFixed(1)}
            </div>
            
            <Badge className="text-lg px-6 py-2 mb-4">
              {getText(compatibility.compatibilityLevel, compatibility.compatibilityLevel)}
            </Badge>
            
            <Progress value={compatibility.overallScore * 10} className="h-4 mb-4" />
            
            <p className="text-gray-700 font-medium">
              {getText(compatibility.relationship.type, compatibility.relationship.type)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="detailed" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="detailed">{getText('Detailed', 'विस्तृत')}</TabsTrigger>
          <TabsTrigger value="insights">{getText('Insights', 'अंतर्दृष्टि')}</TabsTrigger>
          <TabsTrigger value="guidance">{getText('Guidance', 'मार्गदर्शन')}</TabsTrigger>
          <TabsTrigger value="numerology">{getText('Numbers', 'अंक')}</TabsTrigger>
        </TabsList>

        <TabsContent value="detailed" className="space-y-4">
          <div className="grid gap-4">
            {relationshipInsights.map((insight, index) => {
              const categoryKey = insight.category.toLowerCase().replace(/\s+/g, '');
              const categoryData = compatibility.categoryScores[Object.keys(compatibility.categoryScores)[index]];
              
              return (
                <Card key={index} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {insight.icon}
                        <h4 className="font-semibold">{insight.category}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">
                          {categoryData?.score || (5 + Math.random() * 4).toFixed(1)}/10
                        </span>
                        <div className={`w-3 h-3 rounded-full ${
                          (categoryData?.score || 6) >= 7 ? 'bg-green-500' :
                          (categoryData?.score || 6) >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                    <Progress value={(categoryData?.score || 6) * 10} className="h-2" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  {getText('Relationship Strengths', 'रिश्ते की मजबूतियां')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {compatibility.strengths.slice(0, 4).map((strength, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span className="text-green-800 text-sm">{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-orange-800 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {getText('Growth Opportunities', 'विकास के अवसर')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {compatibility.challenges.slice(0, 3).map((challenge, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span className="text-orange-800 text-sm">{challenge}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="guidance" className="space-y-4">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                {getText('Relationship Enhancement Tips', 'रिश्ता सुधारने के सुझाव')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {compatibility.remedies.map((remedy, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-blue-100">
                    <div className="flex items-start gap-3">
                      <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <p className="text-blue-800 text-sm">{remedy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-800">
                {getText('Long-term Potential', 'दीर्घकालिक संभावना')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700">
                {getText(compatibility.relationship.longTermPotential, compatibility.relationship.longTermPotential)}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="numerology" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-indigo-200">
              <CardHeader className="bg-indigo-50">
                <CardTitle className="text-indigo-800">{name1}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{getText('Life Path', 'मूलांक')}:</span>
                    <span className="font-bold">{profile1.lifePath}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{getText('Expression', 'भाग्यांक')}:</span>
                    <span className="font-bold">{profile1.expression}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{getText('Soul Urge', 'अंतरांक')}:</span>
                    <span className="font-bold">{profile1.soulUrge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{getText('Personality', 'व्यक्तित्व')}:</span>
                    <span className="font-bold">{profile1.personality}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-pink-200">
              <CardHeader className="bg-pink-50">
                <CardTitle className="text-pink-800">{name2}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{getText('Life Path', 'मूलांक')}:</span>
                    <span className="font-bold">{profile2.lifePath}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{getText('Expression', 'भाग्यांक')}:</span>
                    <span className="font-bold">{profile2.expression}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{getText('Soul Urge', 'अंतरांक')}:</span>
                    <span className="font-bold">{profile2.soulUrge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{getText('Personality', 'व्यक्तित्व')}:</span>
                    <span className="font-bold">{profile2.personality}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedNumerologyCompatibility;
