
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Users, Calculator, Star, AlertCircle, Lightbulb, TrendingUp } from "lucide-react";
import { calculateNumerologyProfile, NumerologyProfile } from '@/lib/numerologyUtils';
import { calculateCompatibility, CompatibilityResult } from '@/lib/numerologyCompatibility';
import { useToast } from "@/hooks/use-toast";

interface CompatibilityCheckerProps {
  language: 'hi' | 'en';
  currentProfile?: NumerologyProfile;
  currentName?: string;
}

const CompatibilityChecker: React.FC<CompatibilityCheckerProps> = ({ 
  language, 
  currentProfile, 
  currentName 
}) => {
  const [partnerData, setPartnerData] = useState({
    name: '',
    date: ''
  });
  const [compatibility, setCompatibility] = useState<CompatibilityResult | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<NumerologyProfile | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPartnerData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const calculateCompatibilityAnalysis = () => {
    if (!currentProfile || !partnerData.name || !partnerData.date) {
      toast({
        title: language === 'hi' ? "त्रुटि" : "Error",
        description: language === 'hi' ? "कृपया सभी विवरण भरें।" : "Please fill all details.",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);

    try {
      const partner = calculateNumerologyProfile(
        partnerData.name, 
        new Date(partnerData.date)
      );

      const result = calculateCompatibility(currentProfile, partner);
      
      setCompatibility(result);
      setPartnerProfile(partner);

      toast({
        title: language === 'hi' ? "विश्लेषण पूर्ण" : "Analysis Complete",
        description: language === 'hi' ? "आपकी संगतता का विस्तृत विश्लेषण तैयार है।" : "Your detailed compatibility analysis is ready.",
      });
    } catch (error) {
      toast({
        title: language === 'hi' ? "त्रुटि" : "Error",
        description: language === 'hi' ? "विश्लेषण में समस्या हुई है।" : "There was an issue with the analysis.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-blue-500";
    if (score >= 4) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-blue-600";
    if (score >= 4) return "text-yellow-600";
    return "text-red-600";
  };

  const getText = (en: string, hi: string) => language === 'hi' ? hi : en;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-500" />
          {getText('Advanced Numerology Compatibility Analysis', 'उन्नत अंकज्योतिष संगतता विश्लेषण')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentProfile && (
          <div className="bg-primary/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">
              {getText('Your Profile', 'आपका प्रोफाइल')}: {currentName}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <span>{getText('Life Path', 'मूलांक')}: {currentProfile.lifePath}</span>
              <span>{getText('Expression', 'भाग्यांक')}: {currentProfile.expression}</span>
              <span>{getText('Soul Urge', 'अंतरांक')}: {currentProfile.soulUrge}</span>
              <span>{getText('Personality', 'व्यक्तित्व')}: {currentProfile.personality}</span>
              <span>{getText('Birthday', 'जन्मदिन')}: {currentProfile.birthday}</span>
              <span>{getText('Maturity', 'परिपक्वता')}: {currentProfile.maturity}</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="partnerName">
              {getText("Partner's Full Name", 'साथी का पूरा नाम')}
            </Label>
            <Input
              id="partnerName"
              name="name"
              value={partnerData.name}
              onChange={handleInputChange}
              placeholder={getText("Enter partner's full name", 'साथी का पूरा नाम दर्ज करें')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="partnerDate">
              {getText("Partner's Birth Date", 'साथी की जन्म तिथि')}
            </Label>
            <Input
              id="partnerDate"
              name="date"
              type="date"
              value={partnerData.date}
              onChange={handleInputChange}
            />
          </div>

          <Button 
            onClick={calculateCompatibilityAnalysis}
            disabled={isCalculating || !currentProfile}
            className="w-full"
          >
            <Calculator className="h-4 w-4 mr-2" />
            {isCalculating ? 
              (getText('Analyzing...', 'विश्लेषण हो रहा है...')) :
              (getText('Analyze Compatibility', 'संगतता का विश्लेषण करें'))
            }
          </Button>
        </div>

        {compatibility && partnerProfile && (
          <div className="border-t pt-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">{getText('Overview', 'सिंहावलोकन')}</TabsTrigger>
                <TabsTrigger value="detailed">{getText('Detailed', 'विस्तृत')}</TabsTrigger>
                <TabsTrigger value="insights">{getText('Insights', 'अंतर्दृष्टि')}</TabsTrigger>
                <TabsTrigger value="guidance">{getText('Guidance', 'मार्गदर्शन')}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Users className="h-5 w-5" />
                    <span className="text-sm">
                      {currentName} & {partnerData.name}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="text-4xl font-bold mb-2 text-gray-800">
                      {compatibility.overallScore.toFixed(1)}/10
                    </div>
                    <Badge className={`${getCompatibilityColor(compatibility.overallScore)} text-white text-lg px-4 py-2`}>
                      {getText(compatibility.compatibilityLevel, compatibility.compatibilityLevel)}
                    </Badge>
                  </div>

                  <Progress 
                    value={compatibility.overallScore * 10} 
                    className="h-4 mb-4"
                  />

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      {getText('Relationship Type', 'रिश्ते का प्रकार')}
                    </h4>
                    <p className="text-blue-700 text-lg font-medium">
                      {getText(compatibility.relationship.type, compatibility.relationship.type)}
                    </p>
                    <p className="text-blue-600 text-sm mt-2">
                      {getText(compatibility.relationship.dynamics, compatibility.relationship.dynamics)}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="detailed" className="space-y-4">
                <div className="grid gap-4">
                  {Object.entries(compatibility.categoryScores).map(([category, data]) => (
                    <div key={category} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium capitalize">
                          {getText(
                            category.replace(/([A-Z])/g, ' $1').trim(),
                            category === 'lifePath' ? 'मूलांक' :
                            category === 'expression' ? 'भाग्यांक' :
                            category === 'soulUrge' ? 'अंतरांक' :
                            category === 'personality' ? 'व्यक्तित्व' :
                            category === 'birthday' ? 'जन्मदिन' : 'परिपक्वता'
                          )}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${getScoreColor(data.score)}`}>
                            {data.score}/10
                          </span>
                          <div className={`w-3 h-3 rounded-full ${getCompatibilityColor(data.score)}`}></div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {data.description}
                      </p>
                      <div className="mt-2">
                        <Progress value={data.score * 10} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-4">
                <div className="grid gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      {getText('Relationship Strengths', 'रिश्ते की मजबूतियां')}
                    </h4>
                    <ul className="space-y-1">
                      {compatibility.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {getText('Areas for Growth', 'विकास के क्षेत्र')}
                    </h4>
                    <ul className="space-y-1">
                      {compatibility.challenges.map((challenge, index) => (
                        <li key={index} className="text-sm text-orange-700 flex items-start gap-2">
                          <span className="text-orange-500 mt-1">•</span>
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      {getText('Long-term Potential', 'दीर्घकालिक संभावना')}
                    </h4>
                    <p className="text-purple-700 text-sm">
                      {getText(compatibility.relationship.longTermPotential, compatibility.relationship.longTermPotential)}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="guidance" className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    {getText('Relationship Enhancement Tips', 'रिश्ता सुधारने के सुझाव')}
                  </h4>
                  <div className="space-y-3">
                    {compatibility.remedies.map((remedy, index) => (
                      <div key={index} className="bg-white p-3 rounded border border-blue-100">
                        <p className="text-sm text-blue-700 flex items-start gap-2">
                          <span className="text-blue-500 mt-1 font-bold">{index + 1}.</span>
                          {remedy}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {partnerProfile && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">
                      {getText("Partner's Numerology Profile", 'साथी का अंकज्योतिष प्रोफाइल')}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                      <span>{getText('Life Path', 'मूलांक')}: {partnerProfile.lifePath}</span>
                      <span>{getText('Expression', 'भाग्यांक')}: {partnerProfile.expression}</span>
                      <span>{getText('Soul Urge', 'अंतरांक')}: {partnerProfile.soulUrge}</span>
                      <span>{getText('Personality', 'व्यक्तित्व')}: {partnerProfile.personality}</span>
                      <span>{getText('Birthday', 'जन्मदिन')}: {partnerProfile.birthday}</span>
                      <span>{getText('Maturity', 'परिपक्वता')}: {partnerProfile.maturity}</span>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompatibilityChecker;
