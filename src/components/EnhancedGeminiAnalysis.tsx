
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sparkles, User, Briefcase, Heart, Activity, Target, Clock, RefreshCw } from "lucide-react";
import { getGeminiKundaliAnalysis, EnhancedKundaliAnalysis } from '@/lib/geminiKundaliAnalysis';
import { useToast } from "@/hooks/use-toast";
import AIHealthInsights from '@/components/AIHealthInsights';

interface EnhancedGeminiAnalysisProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const EnhancedGeminiAnalysis: React.FC<EnhancedGeminiAnalysisProps> = ({ 
  kundaliData, 
  language 
}) => {
  const [analysis, setAnalysis] = useState<EnhancedKundaliAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personality');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const generateAnalysis = async () => {
    console.log('🤖 Starting Enhanced Gemini Analysis generation...');
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('📊 Kundali data for analysis:', {
        hasData: !!kundaliData,
        chartKeys: kundaliData?.chart ? Object.keys(kundaliData.chart) : [],
        enhancedKeys: kundaliData?.enhancedCalculations ? Object.keys(kundaliData.enhancedCalculations) : []
      });

      const result = await getGeminiKundaliAnalysis(kundaliData);
      console.log('✅ Analysis received:', result);
      
      setAnalysis(result);
      toast({
        title: getTranslation("Analysis Complete", "विश्लेषण पूर्ण"),
        description: getTranslation(
          "AI-powered enhanced analysis has been generated successfully.",
          "AI-संचालित उन्नत विश्लेषण सफलतापूर्वक तैयार किया गया है।"
        ),
      });
    } catch (error) {
      console.error('❌ Error generating Gemini analysis:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      toast({
        title: getTranslation("Error", "त्रुटि"),
        description: getTranslation(
          "Failed to generate enhanced analysis. Please try again.",
          "उन्नत विश्लेषण तैयार करने में विफल। कृपया पुनः प्रयास करें।"
        ),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (kundaliData && !analysis && !isLoading) {
      console.log('🔄 Auto-generating analysis on component mount');
      generateAnalysis();
    }
  }, [kundaliData]);

  // Error state
  if (error && !analysis) {
    return (
      <Card className="text-center p-8 border-red-200">
        <CardContent>
          <div className="text-red-500 mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2 text-red-800">
            {getTranslation('Analysis Error', 'विश्लेषण त्रुटि')}
          </h3>
          <p className="text-red-600 mb-4 text-sm">{error}</p>
          <Button onClick={generateAnalysis} className="bg-red-600 hover:bg-red-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            {getTranslation('Try Again', 'पुनः प्रयास करें')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Initial state - no analysis generated yet
  if (!analysis && !isLoading) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-purple-500" />
          <h3 className="text-lg font-semibold mb-2">
            {getTranslation('Generate Enhanced AI Analysis', 'उन्नत AI विश्लेषण तैयार करें')}
          </h3>
          <p className="text-gray-600 mb-4">
            {getTranslation(
              'Get deep insights powered by advanced AI technology based on your birth chart',
              'आपकी जन्मपत्रिका के आधार पर उन्नत AI तकनीक द्वारा गहरी अंतर्दृष्टि प्राप्त करें'
            )}
          </p>
          <Button onClick={generateAnalysis} className="bg-purple-600 hover:bg-purple-700">
            <Sparkles className="h-4 w-4 mr-2" />
            {getTranslation('Generate Analysis', 'विश्लेषण तैयार करें')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">
            {getTranslation('Generating Enhanced Analysis...', 'उन्नत विश्लेषण तैयार हो रहा है...')}
          </h3>
          <p className="text-gray-600">
            {getTranslation('Please wait while AI analyzes your birth chart...', 'कृपया प्रतीक्षा करें जबकि AI आपकी जन्मपत्रिका का विश्लेषण कर रहा है...')}
          </p>
          <div className="mt-4 text-sm text-purple-600">
            {getTranslation('This may take up to 30 seconds', 'इसमें 30 सेकंड तक का समय लग सकता है')}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Sparkles className="h-5 w-5" />
              {getTranslation('Enhanced AI Analysis', 'उन्नत AI विश्लेषण')}
            </CardTitle>
            <Button 
              onClick={generateAnalysis} 
              variant="outline" 
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              {getTranslation('Refresh', 'रीफ्रेश')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-1 mb-6">
              <TabsTrigger value="personality" className="flex flex-col items-center gap-1 text-xs p-2">
                <User className="h-3 w-3" />
                {getTranslation('Personality', 'व्यक्तित्व')}
              </TabsTrigger>
              <TabsTrigger value="career" className="flex flex-col items-center gap-1 text-xs p-2">
                <Briefcase className="h-3 w-3" />
                {getTranslation('Career', 'करियर')}
              </TabsTrigger>
              <TabsTrigger value="relationships" className="flex flex-col items-center gap-1 text-xs p-2">
                <Heart className="h-3 w-3" />
                {getTranslation('Relations', 'रिश्ते')}
              </TabsTrigger>
              <TabsTrigger value="health" className="flex flex-col items-center gap-1 text-xs p-2">
                <Activity className="h-3 w-3" />
                {getTranslation('Health', 'स्वास्थ्य')}
              </TabsTrigger>
              <TabsTrigger value="spiritual" className="flex flex-col items-center gap-1 text-xs p-2">
                <Target className="h-3 w-3" />
                {getTranslation('Spiritual', 'आध्यात्मिक')}
              </TabsTrigger>
              <TabsTrigger value="timing" className="flex flex-col items-center gap-1 text-xs p-2">
                <Clock className="h-3 w-3" />
                {getTranslation('Timing', 'समय')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personality" className="space-y-4">
              <div className="grid gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    {getTranslation('Core Nature', 'मूल प्रकृति')}
                  </h4>
                  <p className="text-blue-700">{analysis?.detailedPersonality?.coreNature || getTranslation('Analyzing your fundamental nature...', 'आपकी मूल प्रकृति का विश्लेषण...')}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">
                    {getTranslation('Mental Tendencies', 'मानसिक प्रवृत्तियां')}
                  </h4>
                  <p className="text-green-700">{analysis?.detailedPersonality?.mentalTendencies || getTranslation('Understanding your thought patterns...', 'आपके विचार पैटर्न को समझना...')}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">
                    {getTranslation('Emotional Patterns', 'भावनात्मक पैटर्न')}
                  </h4>
                  <p className="text-purple-700">{analysis?.detailedPersonality?.emotionalPatterns || getTranslation('Analyzing emotional responses...', 'भावनात्मक प्रतिक्रियाओं का विश्लेषण...')}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="career" className="space-y-4">
              <div className="grid gap-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">
                    {getTranslation('Ideal Professions', 'आदर्श व्यवसाय')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis?.careerGuidance?.idealProfessions?.length > 0 ? 
                      analysis.careerGuidance.idealProfessions.map((profession, index) => (
                        <Badge key={index} variant="outline" className="bg-orange-100 text-orange-800">
                          {profession}
                        </Badge>
                      )) :
                      <span className="text-orange-700">{getTranslation('Analyzing career potentials...', 'करियर क्षमताओं का विश्लेषण...')}</span>
                    }
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    {getTranslation('Business Aptitude', 'व्यापारिक योग्यता')}
                  </h4>
                  <p className="text-yellow-700">{analysis?.careerGuidance?.businessAptitude || getTranslation('Evaluating business potential...', 'व्यापारिक क्षमता का मूल्यांकन...')}</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-indigo-800 mb-2">
                    {getTranslation('Leadership Qualities', 'नेतृत्व गुण')}
                  </h4>
                  <p className="text-indigo-700">{analysis?.careerGuidance?.leadershipQualities || getTranslation('Assessing leadership abilities...', 'नेतृत्व क्षमताओं का आकलन...')}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="relationships" className="space-y-4">
              <div className="grid gap-4">
                <div className="bg-pink-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-pink-800 mb-2">
                    {getTranslation('Marriage Timing', 'विवाह का समय')}
                  </h4>
                  <p className="text-pink-700">{analysis?.relationshipInsights?.marriageTimings || getTranslation('Analyzing marriage prospects...', 'विवाह की संभावनाओं का विश्लेषण...')}</p>
                </div>
                <div className="bg-rose-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-rose-800 mb-2">
                    {getTranslation('Partner Qualities', 'साथी के गुण')}
                  </h4>
                  <p className="text-rose-700">{analysis?.relationshipInsights?.partnerQualities || getTranslation('Understanding ideal partner traits...', 'आदर्श साथी के गुणों को समझना...')}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">
                    {getTranslation('Family Life', 'पारिवारिक जीवन')}
                  </h4>
                  <p className="text-red-700">{analysis?.relationshipInsights?.familyLife || getTranslation('Examining family dynamics...', 'पारिवारिक गतिशीलता की जांच...')}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="health" className="space-y-4">
              {analysis?.healthPredictions && (
                <AIHealthInsights
                  healthData={analysis.healthPredictions}
                  language={language}
                />
              )}
            </TabsContent>

            <TabsContent value="spiritual" className="space-y-4">
              <div className="grid gap-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">
                    {getTranslation('Life Dharma', 'जीवन धर्म')}
                  </h4>
                  <p className="text-purple-700">{analysis?.spiritualPath?.dharma || getTranslation('Discovering your life purpose...', 'आपके जीवन के उद्देश्य की खोज...')}</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-indigo-800 mb-2">
                    {getTranslation('Karma Lessons', 'कर्म पाठ')}
                  </h4>
                  <p className="text-indigo-700">{analysis?.spiritualPath?.karmaLessons || getTranslation('Understanding karmic patterns...', 'कर्मिक पैटर्न को समझना...')}</p>
                </div>
                <div className="bg-violet-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-violet-800 mb-2">
                    {getTranslation('Spiritual Practices', 'आध्यात्मिक अभ्यास')}
                  </h4>
                  <ul className="text-violet-700 space-y-1">
                    {analysis?.spiritualPath?.spiritualPractices?.length > 0 ? 
                      analysis.spiritualPath.spiritualPractices.map((practice, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-violet-600 rounded-full"></span>
                          {practice}
                        </li>
                      )) :
                      <li className="text-violet-700">{getTranslation('Identifying spiritual practices...', 'आध्यात्मिक प्रथाओं की पहचान...')}</li>
                    }
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timing" className="space-y-4">
              <div className="grid gap-4">
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-teal-800 mb-2">
                    {getTranslation('Current Phase', 'वर्तमान चरण')}
                  </h4>
                  <p className="text-teal-700">{analysis?.timingPredictions?.currentPhase || getTranslation('Analyzing current life phase...', 'वर्तमान जीवन चरण का विश्लेषण...')}</p>
                </div>
                <div className="bg-cyan-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-cyan-800 mb-2">
                    {getTranslation('Upcoming Opportunities', 'आगामी अवसर')}
                  </h4>
                  <ul className="text-cyan-700 space-y-1">
                    {analysis?.timingPredictions?.upcomingOpportunities?.length > 0 ? 
                      analysis.timingPredictions.upcomingOpportunities.map((opportunity, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-cyan-600 rounded-full"></span>
                          {opportunity}
                        </li>
                      )) :
                      <li className="text-cyan-700">{getTranslation('Identifying future opportunities...', 'भविष्य के अवसरों की पहचान...')}</li>
                    }
                  </ul>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-emerald-800 mb-2">
                    {getTranslation('Auspicious Periods', 'शुभ काल')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis?.timingPredictions?.auspiciousPeriods?.length > 0 ? 
                      analysis.timingPredictions.auspiciousPeriods.map((period, index) => (
                        <Badge key={index} variant="outline" className="bg-emerald-100 text-emerald-800">
                          {period}
                        </Badge>
                      )) :
                      <span className="text-emerald-700">{getTranslation('Calculating auspicious timings...', 'शुभ समय की गणना...')}</span>
                    }
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedGeminiAnalysis;
