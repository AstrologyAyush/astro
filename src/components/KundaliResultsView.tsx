
import React, { Suspense, lazy, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Crown, Star, Grid, Clock, Sparkles, FileText, Bot, Target, TrendingUp, Calendar } from 'lucide-react';
import InteractiveDashboard from './InteractiveDashboard';
import EnhancedDailyHoroscope from './EnhancedDailyHoroscope';
import EnhancedKundaliPDFExport from './EnhancedKundaliPDFExport';
import DharmaAlignmentAnalysis from './DharmaAlignmentAnalysis';
import AIEnhancementSuite from './AIEnhancementSuite';

// Lazy load heavy components for better mobile performance
const KundaliConsultationView = lazy(() => import('./KundaliConsultationView'));
const EnhancedDivisionalCharts = lazy(() => import('./EnhancedDivisionalCharts'));
const DetailedDashaDisplay = lazy(() => import('./DetailedDashaDisplay'));
const KarmicReport = lazy(() => import('./KarmicReport'));
const KarmicReportComplete = lazy(() => import('./KarmicReportComplete'));
const TransitAnalysis = lazy(() => import('./TransitAnalysis'));
const KarmaAlignmentTracker = lazy(() => import('./KarmaAlignmentTracker'));
const EnhancedDashaTiming = lazy(() => import('./EnhancedDashaTiming'));

// Loading component for suspense
const TabLoadingSpinner = () => <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    <span className="ml-2 text-sm text-gray-600">Loading...</span>
  </div>;

interface KundaliResultsViewProps {
  kundaliData: any;
  language: 'hi' | 'en';
  onBack: () => void;
}

const KundaliResultsView: React.FC<KundaliResultsViewProps> = ({
  kundaliData,
  onBack,
  language = 'en'
}) => {
  const [activeTab, setActiveTab] = useState('enhanced-charts');
  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  // Memoize heavy computations
  const memoizedKundaliData = useMemo(() => kundaliData, [kundaliData]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Back Button - Mobile Optimized */}
          <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-sm">
            <Button onClick={onBack} className="w-full sm:w-auto text-orange-600 hover:text-orange-700 underline flex items-center justify-center gap-2 text-sm sm:text-base font-medium min-h-[44px]" variant="ghost">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              {getTranslation('Generate New Kundali', 'नई कुंडली बनाएं')}
            </Button>
          </div>
          
          {/* Interactive Dashboard - Mobile Optimized */}
          <Card className="w-full border-orange-200 dark:border-orange-700 shadow-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50 p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
                <CardTitle className="text-orange-800 dark:text-orange-300 flex items-center gap-2 text-base sm:text-lg lg:text-xl text-center sm:text-left">
                  <Crown className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                  <span className="leading-tight">
                    {getTranslation('Interactive Dashboard', 'इंटरैक्टिव डैशबोर्ड')}
                  </span>
                </CardTitle>
                <div className="w-full sm:w-auto">
                  <EnhancedKundaliPDFExport kundaliData={memoizedKundaliData} language={language} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <InteractiveDashboard kundaliData={memoizedKundaliData} language={language} />
            </CardContent>
          </Card>

          {/* Karma Alignment Tracker */}
          <Card className="w-full border-green-200 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <Suspense fallback={<TabLoadingSpinner />}>
                <KarmaAlignmentTracker kundaliData={memoizedKundaliData} language={language} />
              </Suspense>
            </CardContent>
          </Card>

          {/* Enhanced Dasha Timing - Separated Section */}
          <Card className="w-full border-indigo-200 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-indigo-100 to-purple-100 p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-indigo-800 flex items-center gap-2 text-base sm:text-lg lg:text-xl text-center sm:text-left">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-indigo-600 flex-shrink-0" />
                <span className="leading-tight">
                  {getTranslation('Enhanced Dasha Timing Analysis', 'उन्नत दशा समय विश्लेषण')}
                </span>
              </CardTitle>
              <p className="text-sm text-indigo-600 mt-2">
                {getTranslation('Detailed planetary period analysis with precise timing', 'सटीक समय के साथ विस्तृत ग्रहीय काल विश्लेषण')}
              </p>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <Suspense fallback={<TabLoadingSpinner />}>
                <EnhancedDashaTiming kundaliData={memoizedKundaliData} language={language} />
              </Suspense>
            </CardContent>
          </Card>

          {/* Complete Vedic Analysis - Separated Section */}
          <Card className="w-full border-purple-200 dark:border-purple-700 shadow-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-purple-800 dark:text-purple-300 flex items-center gap-2 text-base sm:text-lg lg:text-xl text-center sm:text-left">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <span className="leading-tight">
                  {getTranslation('Complete Vedic Analysis', 'संपूर्ण वैदिक विश्लेषण')}
                </span>
              </CardTitle>
              <p className="text-sm text-purple-600 mt-2">
                {getTranslation('Comprehensive astrological insights and charts', 'व्यापक ज्योतिषीय अंतर्दृष्टि और चार्ट')}
              </p>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 lg:p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-1 bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-lg">
                  <TabsTrigger value="enhanced-charts" className="flex flex-col items-center gap-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3 min-h-[60px] sm:min-h-[70px] rounded-md transition-all duration-200 border border-purple-200 dark:border-purple-600 bg-white dark:bg-gray-800">
                    <Grid className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="text-center leading-tight font-medium">
                      {getTranslation('D1-D20 Charts', 'D1-D20 चार्ट')}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="transits" className="flex flex-col items-center gap-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3 min-h-[60px] sm:min-h-[70px] rounded-md transition-all duration-200 border border-purple-200 dark:border-purple-600 bg-white dark:bg-gray-800">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="text-center leading-tight font-medium">
                      {getTranslation('Transits', 'गोचर')}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="dashas" className="flex flex-col items-center gap-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3 min-h-[60px] sm:min-h-[70px] rounded-md transition-all duration-200 border border-purple-200 dark:border-purple-600 bg-white dark:bg-gray-800">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="text-center leading-tight font-medium">
                      {getTranslation('Traditional Dasha', 'पारंपरिक दशा')}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="karmic" className="flex flex-col items-center gap-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3 min-h-[60px] sm:min-h-[70px] rounded-md transition-all duration-200 border border-purple-200 dark:border-purple-600 bg-white dark:bg-gray-800">
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="text-center leading-tight font-medium">
                      {getTranslation('Basic Karmic', 'बुनियादी कर्मिक')}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="karmic-complete" className="flex flex-col items-center gap-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3 min-h-[60px] sm:min-h-[70px] rounded-md transition-all duration-200 border border-purple-200 dark:border-purple-600 bg-white dark:bg-gray-800">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="text-center leading-tight font-medium">
                      {getTranslation('Full Karmic', 'संपूर्ण कर्मिक')}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="consultation" className="flex flex-col items-center gap-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3 min-h-[60px] sm:min-h-[70px] rounded-md transition-all duration-200 border border-purple-200 dark:border-purple-600 bg-white dark:bg-gray-800">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="text-center leading-tight font-medium">
                      {getTranslation('Full Analysis', 'पूर्ण विश्लेषण')}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="ai-enhancement" className="flex flex-col items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3 min-h-[60px] sm:min-h-[70px] rounded-md transition-all duration-200 border border-purple-200 dark:border-purple-600 bg-white dark:bg-gray-800">
                    <Bot className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="text-center leading-tight font-medium">
                      {getTranslation('AI Analysis', 'AI विश्लेषण')}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="dharma" className="flex flex-col items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3 min-h-[60px] sm:min-h-[70px] rounded-md transition-all duration-200 border border-purple-200 dark:border-purple-600 bg-white dark:bg-gray-800">
                    <Target className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="text-center leading-tight font-medium">
                      {getTranslation('Dharma', 'धर्म')}
                    </span>
                  </TabsTrigger>
                </TabsList>
                
                <div className="min-h-[300px]">
                  <TabsContent value="enhanced-charts" className="mt-0">
                    <Suspense fallback={<TabLoadingSpinner />}>
                      <EnhancedDivisionalCharts kundaliData={memoizedKundaliData} language={language} />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="transits" className="mt-0">
                    <Suspense fallback={<TabLoadingSpinner />}>
                      <TransitAnalysis kundaliData={memoizedKundaliData} language={language} />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="dashas" className="mt-0">
                    <Suspense fallback={<TabLoadingSpinner />}>
                      <DetailedDashaDisplay kundaliData={memoizedKundaliData} language={language} />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="karmic" className="mt-0">
                    <Suspense fallback={<TabLoadingSpinner />}>
                      <KarmicReport kundaliData={memoizedKundaliData} language={language} />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="karmic-complete" className="mt-0">
                    <Suspense fallback={<TabLoadingSpinner />}>
                      <KarmicReportComplete kundaliData={memoizedKundaliData} language={language} />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="consultation" className="mt-0">
                    <Suspense fallback={<TabLoadingSpinner />}>
                      <KundaliConsultationView kundaliData={memoizedKundaliData} language={language} />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="ai-enhancement" className="mt-0">
                    <Suspense fallback={<TabLoadingSpinner />}>
                      <AIEnhancementSuite kundaliData={memoizedKundaliData} language={language} />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="dharma" className="mt-6">
                    <DharmaAlignmentAnalysis kundaliData={kundaliData} language={language} />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Personalized Horoscope - Mobile Optimized */}
          <div className="mt-6 sm:mt-8 lg:mt-10">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mb-4 sm:mb-6 lg:mb-8 text-gray-800 dark:text-gray-200 px-2 leading-tight">
              {getTranslation('Your Personalized Daily Horoscope', 'आपका व्यक्तिगत दैनिक राशिफल')}
            </h2>
            <div className="flex justify-center px-2">
              <div className="w-full max-w-4xl">
                <EnhancedDailyHoroscope kundaliData={memoizedKundaliData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(KundaliResultsView);
