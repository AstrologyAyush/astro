import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Star, Calendar, Brain, Sparkles, Moon, Sun } from "lucide-react";
import BirthDataForm from '@/components/BirthDataForm';
import PlanetaryPositions from '@/components/PlanetaryPositions';
import EnhancedKundaliChart from '@/components/EnhancedKundaliChart';
import ArchetypeAnalysis from '@/components/ArchetypeAnalysis';
import EnhancedDailyHoroscope from '@/components/EnhancedDailyHoroscope';
import FloatingChatbot from '@/components/FloatingChatbot';
import { generateEnhancedKundali } from '@/lib/enhancedKundaliEngine';
import { generateEnhancedKundaliChart } from '@/lib/enhancedAstronomicalEngine';
import { toast } from "sonner";
const Index = () => {
  const [kundali, setKundali] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');
  const handleBirthDataSubmit = async (birthData: any) => {
    setLoading(true);
    try {
      console.log('Processing birth data:', birthData);

      // Generate enhanced kundali with sophisticated calculations
      const enhancedChart = generateEnhancedKundaliChart(birthData);
      const enhancedKundali = generateEnhancedKundali(birthData);
      console.log('Enhanced kundali generated:', enhancedChart);
      const combinedKundali = {
        ...enhancedKundali,
        chart: enhancedChart,
        enhancedChart,
        birthData,
        moonRashi: enhancedChart.planets?.MO?.rashiName || 'Not calculated',
        sunRashi: enhancedChart.planets?.SU?.rashiName || 'Not calculated',
        nakshatraName: enhancedChart.planets?.MO?.nakshatraName || 'Not calculated'
      };
      console.log('Combined kundali:', combinedKundali);
      setKundali(combinedKundali);
      setActiveTab('chart');
      toast.success(language === 'hi' ? `✨ आपकी उन्नत कुंडली तैयार! चंद्र राशि: ${combinedKundali.moonRashi}` : `✨ Enhanced Kundali generated! Moon Sign: ${combinedKundali.moonRashi}`);
    } catch (error) {
      console.error('Error generating Enhanced Kundali:', error);
      toast.error(language === 'hi' ? 'कुंडली बनाने में त्रुटि हुई है। कृपया पुनः प्रयास करें।' : 'Error generating Kundali. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const resetKundali = () => {
    setKundali(null);
    setActiveTab('create');
  };
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'hi' ? 'en' : 'hi');
  };
  return <div className="min-h-screen bg-background">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-background to-background"></div>
        <div className="relative container mx-auto px-4 py-12">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-orange-500/10 border border-orange-500/20">
              <Sparkles className="h-5 w-5 text-orange-400 animate-pulse" />
              <span className="text-orange-300 font-medium">
                {language === 'hi' ? 'उन्नत AI संचालित वैदिक ज्योतिष' : 'Advanced AI-Powered Vedic Astrology'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="Ayush">
                {language === 'hi' ? 'आपकी डिजिटल कुंडली' : 'Your Digital Kundali'}
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {language === 'hi' ? 'स्विस एफेमेरिस गणना और षड्बल विश्लेषण के साथ अपना भविष्य जानें। उन्नत ज्योतिषीय इंजन द्वारा संचालित।' : 'Discover your destiny with Swiss Ephemeris calculations and Shadbala analysis. Powered by advanced astrological engine.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button onClick={toggleLanguage} variant="outline" className="astro-button-outline">
                {language === 'hi' ? <>English <span className="ml-2">🌍</span></> : <>हिंदी <span className="ml-2">🇮🇳</span></>}
              </Button>
              
              {!kundali && <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Star className="h-4 w-4 text-orange-400" />
                  {language === 'hi' ? 'निःशुल्क विस्तृत विश्लेषण' : 'Free Detailed Analysis'}
                </div>}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Enhanced Tab List */}
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-2">
            <TabsTrigger value="create" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-300 rounded-xl transition-all duration-200">
              <Star className="h-4 w-4 mr-2" />
              {language === 'hi' ? 'बनाएं' : 'Create'}
            </TabsTrigger>
            <TabsTrigger value="chart" disabled={!kundali} className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-300 rounded-xl transition-all duration-200">
              <Calendar className="h-4 w-4 mr-2" />
              {language === 'hi' ? 'चार्ट' : 'Chart'}
            </TabsTrigger>
            <TabsTrigger value="personality" disabled={!kundali} className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-300 rounded-xl transition-all duration-200">
              <Brain className="h-4 w-4 mr-2" />
              {language === 'hi' ? 'व्यक्तित्व' : 'Analysis'}
            </TabsTrigger>
            <TabsTrigger value="horoscope" disabled={!kundali} className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-300 rounded-xl transition-all duration-200">
              <Moon className="h-4 w-4 mr-2" />
              {language === 'hi' ? 'राशिफल' : 'Daily'}
            </TabsTrigger>
          </TabsList>

          {/* Create Kundali Tab */}
          <TabsContent value="create" className="mt-0">
            <Card className="astro-card max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold gradient-text">
                  {language === 'hi' ? 'जन्म विवरण दर्ज करें' : 'Enter Birth Details'}
                </CardTitle>
                <p className="text-muted-foreground">
                  {language === 'hi' ? 'सटीक गणना के लिए सभी विवरण आवश्यक हैं' : 'All details required for accurate calculations'}
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <BirthDataForm onSubmit={handleBirthDataSubmit} loading={loading} language={language} />
                
                {kundali && <Button variant="outline" onClick={resetKundali} className="w-full mt-6 astro-button-outline">
                    <Sparkles className="h-4 w-4 mr-2" />
                    {language === 'hi' ? 'नई कुंडली बनाएं' : 'Create New Kundali'}
                  </Button>}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Chart Tab */}
          <TabsContent value="chart" className="mt-0">
            {kundali ? <div className="space-y-8">
                {/* Key Information Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="astro-card">
                    <CardContent className="p-6 text-center">
                      <Moon className="h-8 w-8 mx-auto mb-3 text-blue-400" />
                      <h3 className="font-bold text-blue-400 mb-2">
                        {language === 'hi' ? 'चंद्र राशि' : 'Moon Sign'}
                      </h3>
                      <p className="text-xl font-semibold">{kundali.moonRashi}</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="astro-card">
                    <CardContent className="p-6 text-center">
                      <Sun className="h-8 w-8 mx-auto mb-3 text-yellow-400" />
                      <h3 className="font-bold text-yellow-400 mb-2">
                        {language === 'hi' ? 'सूर्य राशि' : 'Sun Sign'}
                      </h3>
                      <p className="text-xl font-semibold">{kundali.sunRashi}</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="astro-card">
                    <CardContent className="p-6 text-center">
                      <Star className="h-8 w-8 mx-auto mb-3 text-orange-400" />
                      <h3 className="font-bold text-orange-400 mb-2">
                        {language === 'hi' ? 'लग्न' : 'Ascendant'}
                      </h3>
                      <p className="text-xl font-semibold">{kundali.enhancedChart?.ascendant || 'N/A'}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Enhanced Kundali Chart */}
                {kundali.enhancedChart && <EnhancedKundaliChart chart={kundali.enhancedChart} language={language} />}

                {/* Planetary Positions */}
                <PlanetaryPositions planets={kundali.enhancedChart?.planets || kundali.chart?.planets || {}} language={language} />
              </div> : <Card className="astro-card">
                <CardContent className="p-12 text-center">
                  <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground animate-pulse" />
                  <p className="text-lg text-muted-foreground">
                    {language === 'hi' ? 'पहले अपनी जन्म जानकारी दर्ज करें' : 'Please enter your birth details first'}
                  </p>
                </CardContent>
              </Card>}
          </TabsContent>

          {/* Personality Analysis Tab */}
          <TabsContent value="personality" className="mt-0">
            {kundali ? <ArchetypeAnalysis kundali={kundali} language={language} /> : <Card className="astro-card">
                <CardContent className="p-12 text-center">
                  <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground animate-pulse" />
                  <p className="text-lg text-muted-foreground">
                    {language === 'hi' ? 'पहले अपनी कुंडली बनाएं' : 'Please create your Kundali first'}
                  </p>
                </CardContent>
              </Card>}
          </TabsContent>

          {/* Daily Horoscope Tab */}
          <TabsContent value="horoscope" className="mt-0">
            {kundali ? <EnhancedDailyHoroscope kundali={kundali} language={language} /> : <Card className="astro-card">
                <CardContent className="p-12 text-center">
                  <Moon className="h-16 w-16 mx-auto mb-4 text-muted-foreground animate-pulse" />
                  <p className="text-lg text-muted-foreground">
                    {language === 'hi' ? 'पहले अपनी कुंडली बनाएं' : 'Please create your Kundali first'}
                  </p>
                </CardContent>
              </Card>}
          </TabsContent>
        </Tabs>
      </div>

      {/* Enhanced Floating AI Chatbot */}
      <FloatingChatbot kundaliData={kundali} />
    </div>;
};
export default Index;