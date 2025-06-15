
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
    <div className="space-y-3 sm:space-y-4 md:space-y-6 px-2 sm:px-4">
      <div className="text-center">
        <Button
          onClick={onBack}
          className="text-orange-600 hover:text-orange-700 underline mb-3 sm:mb-4 flex items-center gap-2 mx-auto text-sm md:text-base"
          variant="ghost"
        >
          <ArrowLeft className="h-4 w-4" />
          {getTranslation('Generate New Kundali', 'नई कुंडली बनाएं')}
        </Button>
      </div>
      
      {/* Mobile-optimized Interactive Dashboard */}
      <Card className="w-full border-orange-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 p-3 sm:p-4 md:p-6">
          <div className="flex justify-between items-center flex-col sm:flex-row gap-3">
            <CardTitle className="text-orange-800 flex items-center gap-2 text-base sm:text-lg md:text-xl">
              <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
              {getTranslation('Interactive Dashboard', 'इंटरैक्टिव डैशबोर्ड')}
            </CardTitle>
            <div className="w-full sm:w-auto">
              <EnhancedKundaliPDFExport kundaliData={kundaliData} language={language} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6">
          <InteractiveDashboard kundaliData={kundaliData} language={language} />
        </CardContent>
      </Card>

      {/* Mobile-optimized Enhanced Kundali Analysis with Tabs */}
      <Card className="w-full border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 p-3 sm:p-4 md:p-6">
          <CardTitle className="text-purple-800 flex items-center gap-2 text-base sm:text-lg md:text-xl">
            <Star className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            {getTranslation('Complete Vedic Analysis', 'संपूर्ण वैदिक विश्लेषण')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6">
          <Tabs defaultValue="charts" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-4 sm:mb-6 bg-purple-50 h-auto gap-1 p-1">
              <TabsTrigger 
                value="charts" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3 min-h-[50px] sm:min-h-[60px]"
              >
                <Grid className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-center leading-tight">
                  {getTranslation('D1-D10 Charts', 'D1-D10 चार्ट')}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="dashas" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3 min-h-[50px] sm:min-h-[60px]"
              >
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-center leading-tight">
                  {getTranslation('Dasha Periods', 'दशा काल')}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="karmic" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3 min-h-[50px] sm:min-h-[60px]"
              >
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-center leading-tight">
                  {getTranslation('Basic Karmic', 'बुनियादी कर्मिक')}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="karmic-complete" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3 min-h-[50px] sm:min-h-[60px]"
              >
                <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-center leading-tight">
                  {getTranslation('Full Karmic Report', 'संपूर्ण कर्मिक रिपोर्ट')}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="consultation" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3 min-h-[50px] sm:min-h-[60px] col-span-2 lg:col-span-1"
              >
                <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-center leading-tight">
                  {getTranslation('Full Analysis', 'पूर्ण विश्लेषण')}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="charts">
              <DivisionalCharts kundaliData={kundaliData} language={language} />
            </TabsContent>

            <TabsContent value="dashas">
              <DetailedDashaDisplay kundaliData={kundaliData} language={language} />
            </TabsContent>

            <TabsContent value="karmic">
              <KarmicReport kundaliData={kundaliData} language={language} />
            </TabsContent>

            <TabsContent value="karmic-complete">
              <KarmicReportComplete kundaliData={kundaliData} language={language} />
            </TabsContent>

            <TabsContent value="consultation">
              <KundaliConsultationView 
                kundaliData={kundaliData}
                language={language}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Mobile-optimized Personalized horoscope */}
      <div className="mt-4 sm:mt-6 md:mt-8">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-3 sm:mb-4 md:mb-6 text-gray-800 px-2">
          {getTranslation('Your Personalized Daily Horoscope', 'आपका व्यक्तिगत दैनिक राशिफल')}
        </h2>
        <div className="flex justify-center">
          <EnhancedDailyHoroscope 
            kundaliData={kundaliData} 
          />
        </div>
      </div>
    </div>
  );
};

export default KundaliResultsView;
