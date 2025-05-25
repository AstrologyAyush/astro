
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KundaliChart, BirthData } from '@/lib/kundaliUtils';
import { analyzeRelationshipKarma, analyzeSynastryKarma, KarmaPattern, RelationshipKarmaAnalysis as KarmaAnalysisType } from '@/lib/relationshipKarmaUtils';
import { Heart, Zap, Clock, Star, AlertCircle, CheckCircle2, TrendingUp, Users } from "lucide-react";

interface RelationshipKarmaAnalysisProps {
  chart: KundaliChart;
  birthData: BirthData & { fullName?: string };
  language: 'hi' | 'en';
}

const RelationshipKarmaAnalysis: React.FC<RelationshipKarmaAnalysisProps> = ({ 
  chart, 
  birthData, 
  language 
}) => {
  const [analysis, setAnalysis] = useState<KarmaAnalysisType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const performKarmaAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      const karmaAnalysis = analyzeRelationshipKarma(chart, birthData, language);
      setAnalysis(karmaAnalysis);
    } catch (error) {
      console.error('Error analyzing karma:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getKarmaTypeIcon = (type: string) => {
    switch (type) {
      case 'Romantic Karma':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'Emotional Karma':
        return <Star className="h-4 w-4 text-blue-500" />;
      case 'Karmic Debt':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'Past Life Connection':
        return <Clock className="h-4 w-4 text-purple-500" />;
      case 'Destined Union':
        return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'Soul Contract':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <Star className="h-4 w-4 text-gray-500" />;
    }
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 8) return 'text-red-600 bg-red-50 border-red-200';
    if (intensity >= 6) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (intensity >= 4) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getIntensityLabel = (intensity: number) => {
    if (intensity >= 8) return language === 'hi' ? 'अत्यधिक तीव्र' : 'Very Intense';
    if (intensity >= 6) return language === 'hi' ? 'तीव्र' : 'Intense';
    if (intensity >= 4) return language === 'hi' ? 'मध्यम' : 'Moderate';
    return language === 'hi' ? 'हल्का' : 'Mild';
  };

  if (!analysis) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            {language === 'hi' ? "संबंध कर्म पैटर्न विश्लेषण" : "Relationship Karma Pattern Analysis"}
          </CardTitle>
          <CardDescription>
            {language === 'hi' 
              ? "वैदिक ज्योतिष के अनुसार आपके जीवन में संबंधों के कर्मिक पैटर्न की खोज करें"
              : "Discover karmic patterns in your relationships based on ancient Vedic astrological principles"}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="bg-muted/20 p-6 rounded-lg">
            <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              {language === 'hi'
                ? "इस विश्लेषण में आपकी कुंडली के आधार पर प्रेम, विवाह और आत्मिक संबंधों के कर्मिक पैटर्न का गहन अध्ययन शामिल है।"
                : "This analysis includes deep study of karmic patterns in love, marriage, and soul connections based on your birth chart."}
            </p>
            <Button 
              onClick={performKarmaAnalysis} 
              disabled={isAnalyzing}
              className="min-h-[44px]"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {language === 'hi' ? "विश्लेषण कर रहे हैं..." : "Analyzing..."}
                </>
              ) : (
                <>
                  <Star className="h-4 w-4 mr-2" />
                  {language === 'hi' ? "कर्म पैटर्न खोजें" : "Discover Karma Patterns"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            {language === 'hi' ? "कर्मिक पैटर्न सारांश" : "Karmic Pattern Overview"}
          </CardTitle>
          <CardDescription>
            {language === 'hi' 
              ? "आपके जीवन में संबंधों के मुख्य कर्मिक प्रभाव"
              : "Main karmic influences in your relationships"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">
                {analysis.patterns.length}
              </div>
              <div className="text-xs text-muted-foreground">
                {language === 'hi' ? "सक्रिय पैटर्न" : "Active Patterns"}
              </div>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">
                {analysis.overallKarmicIntensity}/10
              </div>
              <div className="text-xs text-muted-foreground">
                {language === 'hi' ? "कर्मिक तीव्रता" : "Karmic Intensity"}
              </div>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-sm font-semibold text-primary mb-1">
                {language === 'hi' 
                  ? analysis.dominantKarmaType === 'Romantic Karma' ? 'रोमांटिक कर्म'
                    : analysis.dominantKarmaType === 'Emotional Karma' ? 'भावनात्मक कर्म'
                    : analysis.dominantKarmaType === 'Karmic Debt' ? 'कर्मिक ऋण'
                    : analysis.dominantKarmaType === 'Past Life Connection' ? 'पूर्व जन्म संबंध'
                    : analysis.dominantKarmaType === 'Destined Union' ? 'नियति मिलन'
                    : 'आत्मा अनुबंध'
                  : analysis.dominantKarmaType}
              </div>
              <div className="text-xs text-muted-foreground">
                {language === 'hi' ? "प्रमुख प्रकार" : "Dominant Type"}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{language === 'hi' ? "समग्र कर्मिक तीव्रता" : "Overall Karmic Intensity"}</span>
              <span>{getIntensityLabel(analysis.overallKarmicIntensity)}</span>
            </div>
            <Progress value={analysis.overallKarmicIntensity * 10} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Karma Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'hi' ? "विस्तृत कर्म पैटर्न" : "Detailed Karma Patterns"}
          </CardTitle>
          <CardDescription>
            {language === 'hi'
              ? "आपकी कुंडली में मिले कर्मिक संकेत और उनके प्रभाव"
              : "Karmic indicators found in your chart and their effects"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.patterns.map((pattern, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getKarmaTypeIcon(pattern.type)}
                      <h4 className="font-semibold text-sm">{pattern.pattern}</h4>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getIntensityColor(pattern.intensity)}`}
                    >
                      {getIntensityLabel(pattern.intensity)}
                    </Badge>
                  </div>
                  
                  <div className="text-sm space-y-2">
                    <p className="text-muted-foreground">{pattern.summary}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {pattern.houseInvolved && (
                        <div>
                          <span className="font-medium">
                            {language === 'hi' ? "संबंधित भाव: " : "House Involved: "}
                          </span>
                          <span className="text-muted-foreground">{pattern.houseInvolved}</span>
                        </div>
                      )}
                      <div>
                        <span className="font-medium">
                          {language === 'hi' ? "ग्रह: " : "Planets: "}
                        </span>
                        <span className="text-muted-foreground">
                          {pattern.planetsConcerned.join(", ")}
                        </span>
                      </div>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="bg-muted/10 p-2 rounded text-xs">
                      <span className="font-medium">
                        {language === 'hi' ? "परिणाम: " : "Outcome: "}
                      </span>
                      <span className="text-muted-foreground">{pattern.outcome}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {language === 'hi' ? "कर्म सुधार सुझाव" : "Karmic Healing Recommendations"}
          </CardTitle>
          <CardDescription>
            {language === 'hi'
              ? "कर्मिक पैटर्न को संतुलित करने के लिए उपाय"
              : "Remedies to balance and heal karmic patterns"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{recommendation}</span>
              </div>
            ))}
          </div>
          
          <Separator className="my-4" />
          
          <div className="bg-primary/5 p-4 rounded-lg space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {language === 'hi' ? "समयावधि" : "Timing"}
            </h4>
            <div className="text-xs space-y-1">
              <div>
                <span className="font-medium">
                  {language === 'hi' ? "सक्रियता: " : "Activation: "}
                </span>
                <span className="text-muted-foreground">{analysis.timing.activation}</span>
              </div>
              <div>
                <span className="font-medium">
                  {language === 'hi' ? "समाधान: " : "Resolution: "}
                </span>
                <span className="text-muted-foreground">{analysis.timing.resolution}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <Card className="bg-muted/10">
        <CardContent className="pt-6">
          <div className="text-center text-xs text-muted-foreground space-y-2">
            <p>
              {language === 'hi'
                ? "यह विश्लेषण प्राचीन वैदिक ज्योतिष और कर्म सिद्धांतों पर आधारित है। व्यक्तिगत मार्गदर्शन के लिए अनुभवी ज्योतिषी से सलाह लें।"
                : "This analysis is based on ancient Vedic astrological principles and karmic doctrines. Consult an experienced astrologer for personalized guidance."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelationshipKarmaAnalysis;
