
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Crown, Star, Grid, Clock, Sparkles, FileText } from 'lucide-react';
import InteractiveDashboard from './InteractiveDashboard';
import KundaliConsultationView from './KundaliConsultationView';
import EnhancedDailyHoroscope from './EnhancedDailyHoroscope';
import EnhancedKundaliPDFExport from './EnhancedKundaliPDFExport';
import DivisionalCharts from './DivisionalCharts';
import DetailedDashaDisplay from './DetailedDashaDisplay';
import KarmicReport from './KarmicReport';
import KarmicReportComplete from './KarmicReportComplete';

interface KundaliResultsViewProps {
  kundaliData: any;
  language: 'hi' | 'en';
  onBack: () => void;
}

const KundaliResultsView: React.FC<KundaliResultsViewProps> = ({ 
  kundaliData, 
  language, 
  onBack 
}) => {
  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 max-w-7xl">
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          {/* Back Button - Mobile Optimized */}
          <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-sm">
            <Button
              onClick={onBack}
              className="w-full sm:w-auto text-orange-600 hover:text-orange-700 underline flex items-center justify-center gap-2 text-sm sm:text-base font-medium min-h-[44px]"
              variant="ghost"
            >
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
                  <EnhancedKundaliPDFExport kundaliData={kundaliData} language={language} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <InteractiveDashboard kundaliData={kundaliData} language={language} />
            </CardContent>
          </Card>

          {/* Enhanced Kundali Analysis with Mobile-Optimized Tabs */}
          <Card className="w-full border-purple-200 dark:border-purple-700 shadow-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-purple-800 dark:text-purple-300 flex items-center gap-2 text-base sm:text-lg lg:text-xl text-center sm:text-left">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <span className="leading-tight">
                  {getTranslation('Complete Vedic Analysis', 'संपूर्ण वैदिक विश्लेषण')}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 lg:p-6">
              <Tabs defaultValue="charts" className="w-full">
                {/* Mobile-First Tab Navigation */}
                <div className="overflow-x-auto mb-4 sm:mb-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <div className="scrollbar-hide">
                    <TabsList className="flex w-max min-w-full sm:w-full sm:grid sm:grid-cols-2 lg:grid-cols-5 bg-purple-50 dark:bg-purple-900/30 h-auto gap-1 p-1 rounded-lg">
                      <TabsTrigger 
                        value="charts" 
                        className="flex flex-col items-center gap-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3 min-h-[60px] sm:min-h-[70px] min-w-[100px] whitespace-nowrap rounded-md"
                      >
                        <Grid className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="text-center leading-tight font-medium">
                          {getTranslation('D1-D10 Charts', 'D1-D10 चार्ट')}
                        </span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="dashas" 
                        className="flex flex-col items-center gap-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3 min-h-[60px] sm:min-h-[70px] min-w-[100px] whitespace-nowrap rounded-md"
                      >
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="text-center leading-tight font-medium">
                          {getTranslation('Dasha Periods', 'दशा काल')}
                        </span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="karmic" 
                        className="flex flex-col items-center gap-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3 min-h-[60px] sm:min-h-[70px] min-w-[100px] whitespace-nowrap rounded-md"
                      >
                        <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="text-center leading-tight font-medium">
                          {getTranslation('Basic Karmic', 'बुनियादी कर्मिक')}
                        </span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="karmic-complete" 
                        className="flex flex-col items-center gap-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3 min-h-[60px] sm:min-h-[70px] min-w-[100px] whitespace-nowrap rounded-md"
                      >
                        <FileText className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="text-center leading-tight font-medium">
                          {getTranslation('Full Karmic Report', 'संपूर्ण कर्मिक रिपोर्ट')}
                        </span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="consultation" 
                        className="flex flex-col items-center gap-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3 min-h-[60px] sm:min-h-[70px] min-w-[100px] whitespace-nowrap rounded-md col-span-2 lg:col-span-1"
                      >
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="text-center leading-tight font-medium">
                          {getTranslation('Full Analysis', 'पूर्ण विश्लेषण')}
                        </span>
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>

                {/* Tab Content with Mobile Optimization */}
                <div className="min-h-[300px]">
                  <TabsContent value="charts" className="mt-0">
                    <DivisionalCharts kundaliData={kundaliData} language={language} />
                  </TabsContent>

                  <TabsContent value="dashas" className="mt-0">
                    <DetailedDashaDisplay kundaliData={kundaliData} language={language} />
                  </TabsContent>

                  <TabsContent value="karmic" className="mt-0">
                    <KarmicReport kundaliData={kundaliData} language={language} />
                  </TabsContent>

                  <TabsContent value="karmic-complete" className="mt-0">
                    <KarmicReportComplete kundaliData={kundaliData} language={language} />
                  </TabsContent>

                  <TabsContent value="consultation" className="mt-0">
                    <KundaliConsultationView 
                      kundaliData={kundaliData}
                      language={language}
                    />
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
                <EnhancedDailyHoroscope 
                  kundaliData={kundaliData} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KundaliResultsView;
