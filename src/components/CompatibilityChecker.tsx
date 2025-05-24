
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Calculator } from "lucide-react";
import { calculateNumerologyProfile, checkCompatibility, NumerologyProfile } from '@/lib/numerologyUtils';
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
  const [compatibility, setCompatibility] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPartnerData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const calculateCompatibility = () => {
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
      const partnerProfile = calculateNumerologyProfile(
        partnerData.name, 
        new Date(partnerData.date)
      );

      const result = checkCompatibility(currentProfile, partnerProfile);
      
      setCompatibility({
        ...result,
        partnerProfile,
        partnerName: partnerData.name
      });

      toast({
        title: language === 'hi' ? "गणना पूर्ण" : "Calculation Complete",
        description: language === 'hi' ? "आपकी संगतता की गणना हो गई है।" : "Your compatibility has been calculated.",
      });
    } catch (error) {
      toast({
        title: language === 'hi' ? "त्रुटि" : "Error",
        description: language === 'hi' ? "गणना में समस्या हुई है।" : "There was an issue with calculation.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getCompatibilityText = (rating: string) => {
    const translations: Record<string, string> = {
      'Excellent Match': 'उत्कृष्ट जोड़ी',
      'Good Match': 'अच्छी जोड़ी',
      'Moderate Match': 'सामान्य जोड़ी',
      'Challenging': 'चुनौतीपूर्ण'
    };
    return language === 'hi' ? translations[rating] || rating : rating;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-500" />
          {language === 'hi' ? 'अंकज्योतिष संगतता जांच' : 'Numerology Compatibility Checker'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentProfile && (
          <div className="bg-primary/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">
              {language === 'hi' ? 'आपका प्रोफाइल' : 'Your Profile'}: {currentName}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span>{language === 'hi' ? 'मूलांक' : 'Life Path'}: {currentProfile.lifePath}</span>
              <span>{language === 'hi' ? 'भाग्यांक' : 'Expression'}: {currentProfile.expression}</span>
              <span>{language === 'hi' ? 'अंतरांक' : 'Soul Urge'}: {currentProfile.soulUrge}</span>
              <span>{language === 'hi' ? 'व्यक्तित्व' : 'Personality'}: {currentProfile.personality}</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="partnerName">
              {language === 'hi' ? 'साथी का नाम' : 'Partner\'s Name'}
            </Label>
            <Input
              id="partnerName"
              name="name"
              value={partnerData.name}
              onChange={handleInputChange}
              placeholder={language === 'hi' ? 'साथी का पूरा नाम' : 'Partner\'s full name'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="partnerDate">
              {language === 'hi' ? 'साथी की जन्म तिथि' : 'Partner\'s Birth Date'}
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
            onClick={calculateCompatibility}
            disabled={isCalculating || !currentProfile}
            className="w-full"
          >
            <Calculator className="h-4 w-4 mr-2" />
            {isCalculating ? 
              (language === 'hi' ? 'गणना हो रही है...' : 'Calculating...') :
              (language === 'hi' ? 'संगतता की जांच करें' : 'Check Compatibility')
            }
          </Button>
        </div>

        {compatibility && (
          <div className="space-y-4 border-t pt-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                {language === 'hi' ? 'संगतता परिणाम' : 'Compatibility Result'}
              </h3>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users className="h-5 w-5" />
                <span className="text-sm">
                  {currentName} & {compatibility.partnerName}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {language === 'hi' ? 'कुल स्कोर' : 'Overall Score'}
                </span>
                <Badge className={getCompatibilityColor(compatibility.score)}>
                  {compatibility.score}/100
                </Badge>
              </div>

              <Progress 
                value={compatibility.score} 
                className="h-3"
              />

              <div className="text-center">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {getCompatibilityText(compatibility.rating)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium">
                    {language === 'hi' ? 'विस्तृत स्कोर' : 'Detailed Scores'}
                  </h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>{language === 'hi' ? 'मूलांक मैच' : 'Life Path'}:</span>
                      <span>{compatibility.details.lifePathMatch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'hi' ? 'अंतरांक मैच' : 'Soul Urge'}:</span>
                      <span>{compatibility.details.soulUrgeMatch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'hi' ? 'भाग्यांक मैच' : 'Expression'}:</span>
                      <span>{compatibility.details.expressionMatch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'hi' ? 'वर्ष तालमेल' : 'Year Sync'}:</span>
                      <span>{compatibility.details.personalYearAlignment}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">
                    {language === 'hi' ? 'साथी का प्रोफाइल' : 'Partner\'s Profile'}
                  </h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>{language === 'hi' ? 'मूलांक' : 'Life Path'}:</span>
                      <span>{compatibility.partnerProfile.lifePath}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'hi' ? 'भाग्यांक' : 'Expression'}:</span>
                      <span>{compatibility.partnerProfile.expression}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'hi' ? 'अंतरांक' : 'Soul Urge'}:</span>
                      <span>{compatibility.partnerProfile.soulUrge}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'hi' ? 'व्यक्तित्व' : 'Personality'}:</span>
                      <span>{compatibility.partnerProfile.personality}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompatibilityChecker;
