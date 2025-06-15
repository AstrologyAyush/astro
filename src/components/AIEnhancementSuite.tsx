import React, { useState, Suspense, lazy } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Sparkles, Gem, Lightbulb, TrendingUp, Heart, Brain, Zap, Target } from "lucide-react";
import KundaliAIChat from './KundaliAIChat';

// Lazy load heavy AI components
const AIPersonalizedPredictions = lazy(() => import('./AIPersonalizedPredictions'));
const AIRemedySuggestions = lazy(() => import('./AIRemedySuggestions'));
const AICareerGuidance = lazy(() => import('./AICareerGuidance'));
const AICompatibilityAnalysis = lazy(() => import('./AICompatibilityAnalysis'));
const AIHealthInsights = lazy(() => import('./AIHealthInsights'));
const AISpiritualGuidance = lazy(() => import('./AISpiritualGuidance'));

interface AIEnhancementSuiteProps {
  kundaliData: any;
  language: 'hi' | 'en';
  numerologyData?: any;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    <span className="ml-2 text-sm text-gray-600">Loading AI Enhancement...</span>
  </div>
);

const AIEnhancementSuite: React.FC<AIEnhancementSuiteProps> = ({ 
  kundaliData, 
  language, 
  numerologyData 
}) => {
  const [activeTab, setActiveTab] = useState('ai-chat');

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mb-4">
          <Bot className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
          {getTranslation('Advanced AI-Powered Kundali Intelligence', 'उन्नत AI-संचालित कुंडली बुद्धिमत्ता')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          {getTranslation(
            'Experience cutting-edge artificial intelligence combined with ancient Vedic wisdom for the most comprehensive and personalized astrological insights available.',
            'अत्याधुनिक कृत्रिम बुद्धिमत्ता के साथ प्राचीन वैदिक ज्ञान का अनुभव करें सबसे व्यापक और व्यक्तिगत ज्योतिषीय अंतर्दृष्टि के लिए।'
          )}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1 bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-lg">
          <TabsTrigger 
            value="ai-chat" 
            className="flex flex-col items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-xs p-2 min-h-[60px] rounded-md transition-all duration-200"
          >
            <Bot className="h-3 w-3" />
            <span className="text-center font-medium">
              {getTranslation('CHAT', 'चैट')}
            </span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="predictions" 
            className="flex flex-col items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-xs p-2 min-h-[60px] rounded-md transition-all duration-200"
          >
            <TrendingUp className="h-3 w-3" />
            <span className="text-center font-medium">
              {getTranslation('Future Insights', 'भविष्य अंतर्दृष्टि')}
            </span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="remedies" 
            className="flex flex-col items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-xs p-2 min-h-[60px] rounded-md transition-all duration-200"
          >
            <Gem className="h-3 w-3" />
            <span className="text-center font-medium">
              {getTranslation('Smart Remedies', 'स्मार्ट उपाय')}
            </span>
          </TabsTrigger>

          <TabsTrigger 
            value="career-guidance" 
            className="flex flex-col items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-xs p-2 min-h-[60px] rounded-md transition-all duration-200"
          >
            <Target className="h-3 w-3" />
            <span className="text-center font-medium">
              {getTranslation('Career AI', 'करियर AI')}
            </span>
          </TabsTrigger>

          <TabsTrigger 
            value="compatibility" 
            className="flex flex-col items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-xs p-2 min-h-[60px] rounded-md transition-all duration-200"
          >
            <Heart className="h-3 w-3" />
            <span className="text-center font-medium">
              {getTranslation('Love AI', 'प्रेम AI')}
            </span>
          </TabsTrigger>

          <TabsTrigger 
            value="health-insights" 
            className="flex flex-col items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-xs p-2 min-h-[60px] rounded-md transition-all duration-200"
          >
            <Zap className="h-3 w-3" />
            <span className="text-center font-medium">
              {getTranslation('Health AI', 'स्वास्थ्य AI')}
            </span>
          </TabsTrigger>

          <TabsTrigger 
            value="spiritual-guidance" 
            className="flex flex-col items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-xs p-2 min-h-[60px] rounded-md transition-all duration-200"
          >
            <Sparkles className="h-3 w-3" />
            <span className="text-center font-medium">
              {getTranslation('Spiritual AI', 'आध्यात्मिक AI')}
            </span>
          </TabsTrigger>
        </TabsList>

        <div className="min-h-[600px]">
          <TabsContent value="ai-chat" className="mt-0">
            <Card className="border-purple-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4">
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Bot className="h-5 w-5" />
                  {getTranslation('Interactive AI Kundali Guru', 'इंटरैक्टिव AI कुंडली गुरु')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <KundaliAIChat 
                  kundaliData={kundaliData} 
                  language={language}
                  numerologyData={numerologyData}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions" className="mt-0">
            <Suspense fallback={<LoadingSpinner />}>
              <AIPersonalizedPredictions 
                kundaliData={kundaliData} 
                language={language} 
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="remedies" className="mt-0">
            <Suspense fallback={<LoadingSpinner />}>
              <AIRemedySuggestions 
                kundaliData={kundaliData} 
                language={language} 
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="career-guidance" className="mt-0">
            <Suspense fallback={<LoadingSpinner />}>
              <AICareerGuidance 
                kundaliData={kundaliData} 
                language={language} 
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="compatibility" className="mt-0">
            <Suspense fallback={<LoadingSpinner />}>
              <AICompatibilityAnalysis 
                kundaliData={kundaliData} 
                language={language} 
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="health-insights" className="mt-0">
            <Suspense fallback={<LoadingSpinner />}>
              <AIHealthInsights 
                kundaliData={kundaliData} 
                language={language} 
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="spiritual-guidance" className="mt-0">
            <Suspense fallback={<LoadingSpinner />}>
              <AISpiritualGuidance 
                kundaliData={kundaliData} 
                language={language} 
              />
            </Suspense>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AIEnhancementSuite;
