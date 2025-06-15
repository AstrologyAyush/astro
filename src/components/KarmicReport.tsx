import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import KarmaAlignmentChart from './KarmaAlignmentChart';
import { 
  Sparkles, 
  Crown, 
  Clock, 
  Target, 
  Heart, 
  TrendingUp,
  Brain,
  Star,
  Calendar,
  BarChart3
} from 'lucide-react';

interface KarmicReportProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

interface KarmicAnalysis {
  careerKarmaSignature: string;
  careerBlockExplanation: string;
  idealCareerSuggestions: string[];
  karmicTimeline: string;
  coachMessage: string;
  relationshipKarma: string;
  healthKarma: string;
  spiritualPath: string;
}

const KarmicReport: React.FC<KarmicReportProps> = ({ kundaliData, language }) => {
  const [karmicAnalysis, setKarmicAnalysis] = useState<KarmicAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  // Generate sample karma alignment data based on kundali
  const generateKarmaAlignmentData = () => {
    const planets = kundaliData?.enhancedCalculations?.planets || {};
    
    // Calculate alignment percentage based on planetary strengths
    const planetValues = Object.values(planets);
    const totalShadbala = planetValues.reduce((sum: number, planet: any) => {
      const shadbalaValue = typeof planet?.shadbala === 'number' ? planet.shadbala : 50;
      return sum + shadbalaValue;
    }, 0);
    
    const planetCount = Number(planetValues.length);
    const averageShadbala = planetCount > 0 ? (Number(totalShadbala) / planetCount) : 50;
    const alignmentPercentage = Math.min(95, Math.max(35, Math.round(averageShadbala * 1.2)));

    const grahaEnergies = [
      {
        name: language === 'hi' ? 'बृहस्पति' : 'Jupiter',
        role: language === 'hi' ? 'धर्म + ज्ञान' : 'Dharma + Wisdom',
        strength: typeof planets.JU?.shadbala === 'number' ? planets.JU.shadbala : 80,
        color: '#F59E0B'
      },
      {
        name: language === 'hi' ? 'शनि' : 'Saturn',
        role: language === 'hi' ? 'अनुशासन + कष्ट' : 'Discipline + Suffering',
        strength: typeof planets.SA?.shadbala === 'number' ? planets.SA.shadbala : 75,
        color: '#6366F1'
      },
      {
        name: language === 'hi' ? 'राहु' : 'Rahu',
        role: language === 'hi' ? 'जुनून + भ्रम' : 'Obsession + Illusion',
        strength: typeof planets.RA?.shadbala === 'number' ? planets.RA.shadbala : 60,
        color: '#8B5CF6'
      },
      {
        name: language === 'hi' ? 'शुक्र' : 'Venus',
        role: language === 'hi' ? 'रचनात्मकता + आकर्षण' : 'Creativity + Charm',
        strength: typeof planets.VE?.shadbala === 'number' ? planets.VE.shadbala : 65,
        color: '#EC4899'
      }
    ];

    const dashaTimeline = [
      {
        period: language === 'hi' ? 'शनि महादशा' : 'Saturn Mahadasha',
        planet: language === 'hi' ? 'शनि' : 'Saturn',
        status: 'challenge' as const,
        startYear: 2024,
        endYear: 2026
      },
      {
        period: language === 'hi' ? 'बुध महादशा' : 'Mercury Mahadasha',
        planet: language === 'hi' ? 'बुध' : 'Mercury',
        status: 'growth' as const,
        startYear: 2026,
        endYear: 2029
      },
      {
        period: language === 'hi' ? 'केतु महादशा' : 'Ketu Mahadasha',
        planet: language === 'hi' ? 'केतु' : 'Ketu',
        status: 'transition' as const,
        startYear: 2029,
        endYear: 2031
      }
    ];

    const weeklyTracker = [
      {
        week: 1,
        action: language === 'hi' ? 'एक गरीब बुजुर्ग की सेवा करें' : 'Serve a poor elder',
        planet: language === 'hi' ? 'शनि' : 'Saturn',
        status: 'done' as const
      },
      {
        week: 2,
        action: language === 'hi' ? '7 दिन तक गपशप से बचें' : 'Avoid gossip for 7 days',
        planet: language === 'hi' ? 'राहु' : 'Rahu',
        status: 'repeating' as const
      },
      {
        week: 3,
        action: language === 'hi' ? 'किसी को कौशल सिखाएं' : 'Teach someone a skill',
        planet: language === 'hi' ? 'बृहस्पति' : 'Jupiter',
        status: 'missed' as const
      },
      {
        week: 4,
        action: language === 'hi' ? 'कलात्मक गतिविधि करें' : 'Do artistic activity',
        planet: language === 'hi' ? 'शुक्र' : 'Venus',
        status: 'done' as const
      }
    ];

    return {
      alignmentPercentage,
      grahaEnergies,
      dashaTimeline,
      weeklyTracker
    };
  };

  const generateKarmicReport = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('karmic-analysis', {
        body: {
          kundaliData,
          language,
          analysisType: 'full_karmic_report'
        }
      });

      if (error) throw error;

      setKarmicAnalysis(data.analysis);
      
      toast({
        title: getTranslation("Karmic Report Generated", "कर्मिक रिपोर्ट तैयार"),
        description: getTranslation("Your personalized karmic insights are ready", "आपकी व्यक्तिगत कर्मिक अंतर्दृष्टि तैयार है")
      });

    } catch (error) {
      console.error('Error generating karmic report:', error);
      toast({
        title: getTranslation("Error", "त्रुटि"),
        description: getTranslation("Failed to generate karmic report", "कर्मिक रिपोर्ट बनाने में त्रुटि"),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCareerSuggestions = (suggestions: string[]) => {
    return suggestions.map((suggestion, index) => (
      <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
        <Target className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
        <p className="text-gray-700">{suggestion}</p>
      </div>
    ));
  };

  return (
    <Card className="w-full border-purple-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-purple-800 text-xl">
                {getTranslation('Karmic Life Report', 'कर्मिक जीवन रिपोर्ट')}
              </CardTitle>
              <p className="text-purple-600 text-sm mt-1">
                {getTranslation('Insights from Rishi Parashar\'s Wisdom', 'ऋषि पराशर की बुद्धि से अंतर्दृष्टि')}
              </p>
            </div>
          </div>
          {!karmicAnalysis && (
            <Button 
              onClick={generateKarmicReport}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
            >
              {isLoading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  {getTranslation('Generating...', 'बनाया जा रहा है...')}
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  {getTranslation('Generate Report', 'रिपोर्ट बनाएं')}
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {!karmicAnalysis ? (
          <div className="text-center py-12">
            <Sparkles className="h-16 w-16 text-purple-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {getTranslation('Discover Your Karmic Blueprint', 'अपना कर्मिक नक्शा खोजें')}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {getTranslation(
                'Get deep insights into your career karma, life purpose, and spiritual path based on ancient Vedic wisdom',
                'प्राचीन वैदिक ज्ञान के आधार पर अपने करियर कर्म, जीवन उद्देश्य और आध्यात्मिक पथ की गहरी अंतर्दृष्टि प्राप्त करें'
              )}
            </p>
          </div>
        ) : (
          <Tabs defaultValue="karma-alignment" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6 bg-purple-50">
              <TabsTrigger value="karma-alignment" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                {getTranslation('Karma Align', 'कर्म संरेखण')}
              </TabsTrigger>
              <TabsTrigger value="career" className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                {getTranslation('Career', 'करियर')}
              </TabsTrigger>
              <TabsTrigger value="relationships" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                {getTranslation('Relations', 'रिश्ते')}
              </TabsTrigger>
              <TabsTrigger value="health" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {getTranslation('Health', 'स्वास्थ्य')}
              </TabsTrigger>
              <TabsTrigger value="spiritual" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                {getTranslation('Spiritual', 'आध्यात्मिक')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="karma-alignment" className="space-y-6">
              <KarmaAlignmentChart 
                {...generateKarmaAlignmentData()}
                language={language}
              />
            </TabsContent>

            <TabsContent value="career" className="space-y-6">
              {/* Career Karma Signature */}
              <Card className="border-orange-200">
                <CardHeader className="bg-orange-50">
                  <CardTitle className="text-orange-800 flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    {getTranslation('Career Karma Signature', 'करियर कर्म हस्ताक्षर')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-gray-700 leading-relaxed">{karmicAnalysis.careerKarmaSignature}</p>
                </CardContent>
              </Card>

              {/* Career Blocks */}
              <Card className="border-red-200">
                <CardHeader className="bg-red-50">
                  <CardTitle className="text-red-800 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {getTranslation('Career Challenges & Blocks', 'करियर चुनौतियां और बाधाएं')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-gray-700 leading-relaxed">{karmicAnalysis.careerBlockExplanation}</p>
                </CardContent>
              </Card>

              {/* Ideal Career Suggestions */}
              <Card className="border-green-200">
                <CardHeader className="bg-green-50">
                  <CardTitle className="text-green-800 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {getTranslation('Ideal Career Paths', 'आदर्श करियर पथ')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {formatCareerSuggestions(karmicAnalysis.idealCareerSuggestions)}
                  </div>
                </CardContent>
              </Card>

              {/* Karmic Timeline */}
              <Card className="border-blue-200">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="text-blue-800 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {getTranslation('Career Timeline & Phases', 'करियर समयरेखा और चरण')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-gray-700 leading-relaxed">{karmicAnalysis.karmicTimeline}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="relationships" className="space-y-6">
              <Card className="border-pink-200">
                <CardHeader className="bg-pink-50">
                  <CardTitle className="text-pink-800 flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    {getTranslation('Relationship Karma', 'रिश्ते का कर्म')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-gray-700 leading-relaxed">{karmicAnalysis.relationshipKarma}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="health" className="space-y-6">
              <Card className="border-emerald-200">
                <CardHeader className="bg-emerald-50">
                  <CardTitle className="text-emerald-800 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {getTranslation('Health & Vitality Karma', 'स्वास्थ्य और जीवन शक्ति कर्म')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-gray-700 leading-relaxed">{karmicAnalysis.healthKarma}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="spiritual" className="space-y-6">
              <Card className="border-violet-200">
                <CardHeader className="bg-violet-50">
                  <CardTitle className="text-violet-800 flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    {getTranslation('Spiritual Path & Purpose', 'आध्यात्मिक पथ और उद्देश्य')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-gray-700 leading-relaxed">{karmicAnalysis.spiritualPath}</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rishi Parashar's Coach Message */}
            <Separator className="my-6" />
            <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardHeader>
                <CardTitle className="text-yellow-800 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  {getTranslation('Rishi Parashar\'s Message', 'ऋषि पराशर का संदेश')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-4 rounded-lg border border-yellow-200">
                  <p className="text-gray-700 text-lg italic leading-relaxed">
                    "{karmicAnalysis.coachMessage}"
                  </p>
                </div>
              </CardContent>
            </Card>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default KarmicReport;
