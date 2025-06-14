
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Crown, Star, Grid, Clock } from 'lucide-react';
import InteractiveDashboard from './InteractiveDashboard';
import KundaliConsultationView from './KundaliConsultationView';
import EnhancedDailyHoroscope from './EnhancedDailyHoroscope';
import EnhancedKundaliPDFExport from './EnhancedKundaliPDFExport';
import DivisionalCharts from './DivisionalCharts';
import DetailedDashaDisplay from './DetailedDashaDisplay';

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
    <div className="space-y-4 md:space-y-6 px-4">
      <div className="text-center">
        <Button
          onClick={onBack}
          className="text-orange-600 hover:text-orange-700 underline mb-4 flex items-center gap-2 mx-auto text-sm md:text-base"
          variant="ghost"
        >
          <ArrowLeft className="h-4 w-4" />
          {getTranslation('Generate New Kundali', 'नई कुंडली बनाएं')}
        </Button>
      </div>
      
      {/* Interactive Dashboard */}
      <Card className="w-full border-orange-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 p-4 md:p-6">
          <div className="flex justify-between items-center flex-col md:flex-row gap-3">
            <CardTitle className="text-orange-800 flex items-center gap-2 text-lg md:text-xl">
              <Crown className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
              {getTranslation('Interactive Dashboard', 'इंटरैक्टिव डैशबोर्ड')}
            </CardTitle>
            <EnhancedKundaliPDFExport kundaliData={kundaliData} language={language} />
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <InteractiveDashboard kundaliData={kundaliData} language={language} />
        </CardContent>
      </Card>

      {/* Enhanced Kundali Analysis with Tabs */}
      <Card className="w-full border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4 md:p-6">
          <CardTitle className="text-purple-800 flex items-center gap-2 text-lg md:text-xl">
            <Star className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
            {getTranslation('Complete Vedic Analysis', 'संपूर्ण वैदिक विश्लेषण')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <Tabs defaultValue="charts" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-purple-50">
              <TabsTrigger 
                value="charts" 
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Grid className="h-4 w-4" />
                {getTranslation('D1-D10 Charts', 'D1-D10 चार्ट')}
              </TabsTrigger>
              <TabsTrigger 
                value="dashas" 
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Clock className="h-4 w-4" />
                {getTranslation('Dasha Periods', 'दशा काल')}
              </TabsTrigger>
              <TabsTrigger 
                value="consultation" 
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Star className="h-4 w-4" />
                {getTranslation('Full Analysis', 'पूर्ण विश्लेषण')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="charts">
              <DivisionalCharts kundaliData={kundaliData} language={language} />
            </TabsContent>

            <TabsContent value="dashas">
              <DetailedDashaDisplay kundaliData={kundaliData} language={language} />
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
      
      {/* Personalized horoscope */}
      <div className="mt-6 md:mt-8">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6 text-gray-800 px-2">
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
