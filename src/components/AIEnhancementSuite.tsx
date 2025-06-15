
import React, { useState, Suspense, lazy } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Sparkles, Gem, Lightbulb, TrendingUp, Heart } from "lucide-react";
import KundaliAIChat from './KundaliAIChat';

// Lazy load heavy AI components
const EnhancedGeminiAnalysis = lazy(() => import('./EnhancedGeminiAnalysis'));
const AIPersonalizedPredictions = lazy(() => import('./AIPersonalizedPredictions'));
const AIRemedySuggestions = lazy(() => import('./AIRemedySuggestions'));

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
          {getTranslation('AI-Powered Enhanced Analysis', 'AI-संचालित उन्नत विश्लेषण')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {getTranslation(
            'Experience the power of artificial intelligence combined with ancient Vedic wisdom for personalized insights.',
            'व्यक्तिगत अंतर्दृष्टि के लिए प्राचीन वैदिक ज्ञान के साथ कृत्रिम बुद्धिमत्ता की शक्ति का अनुभव करें।'
          )}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-lg">
          <TabsTrigger 
            value="ai-chat" 
            className="flex flex-col items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-xs sm:text-sm p-3 min-h-[70px] rounded-md transition-all duration-200"
          >
            <Bot className="h-4 w-4" />
            <span className="text-center font-medium">
              {getTranslation('Live AI Chat', 'लाइव AI चैट')}
            </span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="enhanced-analysis" 
            className="flex flex-col items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-xs sm:text-sm p-3 min-h-[70px] rounded-md transition-all duration-200"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-center font-medium">
              {getTranslation('Enhanced Analysis', 'उन्नत विश्लेषण')}
            </span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="predictions" 
            className="flex flex-col items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-xs sm:text-sm p-3 min-h-[70px] rounded-md transition-all duration-200"
          >
            <TrendingUp className="h-4 w-4" />
            <span className="text-center font-medium">
              {getTranslation('AI Predictions', 'AI भविष्यवाणी')}
            </span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="remedies" 
            className="flex flex-col items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-xs sm:text-sm p-3 min-h-[70px] rounded-md transition-all duration-200"
          >
            <Gem className="h-4 w-4" />
            <span className="text-center font-medium">
              {getTranslation('Smart Remedies', 'स्मार्ट उपाय')}
            </span>
          </TabsTrigger>
        </TabsList>

        <div className="min-h-[600px]">
          <TabsContent value="ai-chat" className="mt-0">
            <Card className="border-purple-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4">
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Bot className="h-5 w-5" />
                  {getTranslation('Interactive AI Consultation', 'इंटरैक्टिव AI परामर्श')}
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

          <TabsContent value="enhanced-analysis" className="mt-0">
            <Suspense fallback={<LoadingSpinner />}>
              <EnhancedGeminiAnalysis 
                kundaliData={kundaliData} 
                language={language} 
              />
            </Suspense>
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
        </div>
      </Tabs>
    </div>
  );
};

export default AIEnhancementSuite;
