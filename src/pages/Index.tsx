
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Star, Users, Calendar, Brain } from "lucide-react";
import BirthDataForm from '@/components/BirthDataForm';
import KundaliChart from '@/components/KundaliChart';
import PlanetaryPositions from '@/components/PlanetaryPositions';
import ArchetypeAnalysis from '@/components/ArchetypeAnalysis';
import EnhancedDailyHoroscope from '@/components/EnhancedDailyHoroscope';
import FloatingChatbot from '@/components/FloatingChatbot';
import { generateEnhancedKundali } from '@/lib/enhancedKundaliEngine';
import { generateKundaliChart } from '@/lib/kundaliUtils';
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
      
      // Generate enhanced kundali with personality features
      const enhancedKundali = generateEnhancedKundali(birthData);
      console.log('Enhanced kundali generated:', enhancedKundali);
      
      // Generate traditional kundali chart with proper calculations
      const traditionalKundali = generateKundaliChart(birthData);
      console.log('Traditional kundali generated:', traditionalKundali);
      
      const combinedKundali = {
        ...enhancedKundali,
        chart: traditionalKundali,
        birthData,
        // Add calculated rashi information
        moonRashi: traditionalKundali.planets?.Moon?.rashiName || 'Not calculated',
        sunRashi: traditionalKundali.planets?.Sun?.rashiName || 'Not calculated',
        nakshatraName: traditionalKundali.planets?.Moon?.nakshatraName || 'Not calculated'
      };
      
      console.log('Combined kundali:', combinedKundali);
      setKundali(combinedKundali);
      setActiveTab('chart');
      
      toast.success(
        language === 'hi' 
          ? `आपकी कुंडली तैयार! चंद्र राशि: ${combinedKundali.moonRashi}, सूर्य राशि: ${combinedKundali.sunRashi}` 
          : `Kundali generated! Moon Sign: ${combinedKundali.moonRashi}, Sun Sign: ${combinedKundali.sunRashi}`
      );
    } catch (error) {
      console.error('Error generating Kundali:', error);
      toast.error(
        language === 'hi' 
          ? 'कुंडली बनाने में त्रुटि हुई है। कृपया पुनः प्रयास करें।' 
          : 'Error generating Kundali. Please try again.'
      );
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Mobile-First Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-100 via-red-50 to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-200 to-red-200 rounded-full text-sm border border-orange-300">
              <Star className="h-4 w-4 text-orange-600" />
              <span className="text-orange-800 font-medium">
                {language === 'hi' ? 'AI संचालित वैदिक ज्योतिष' : 'AI-Powered Vedic Astrology'}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {language === 'hi' ? 'आपकी डिजिटल कुंडली' : 'Your Digital Kundali'}
            </h1>
            
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              {language === 'hi' 
                ? 'उन्नत गणना और व्यक्तित्व विश्लेषण के साथ अपना भविष्य जानें'
                : 'Discover your destiny with advanced calculations and personality analysis'
              }
            </p>

            <Button
              onClick={toggleLanguage}
              variant="outline"
              size="sm"
              className="border-orange-200 text-orange-700 hover:bg-orange-100"
            >
              {language === 'hi' ? 'English' : 'हिंदी'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile Tab List */}
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white border border-orange-200">
            <TabsTrigger value="create" className="text-xs data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Star className="h-3 w-3 mr-1" />
              {language === 'hi' ? 'बनाएं' : 'Create'}
            </TabsTrigger>
            <TabsTrigger value="chart" disabled={!kundali} className="text-xs data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Calendar className="h-3 w-3 mr-1" />
              {language === 'hi' ? 'चार्ट' : 'Chart'}
            </TabsTrigger>
            <TabsTrigger value="personality" disabled={!kundali} className="text-xs data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Brain className="h-3 w-3 mr-1" />
              {language === 'hi' ? 'व्यक्तित्व' : 'Type'}
            </TabsTrigger>
            <TabsTrigger value="horoscope" disabled={!kundali} className="text-xs data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              <Users className="h-3 w-3 mr-1" />
              {language === 'hi' ? 'राशिफल' : 'Daily'}
            </TabsTrigger>
          </TabsList>

          {/* Create Kundali Tab */}
          <TabsContent value="create" className="mt-0">
            <Card className="border-orange-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100">
                <CardTitle className="text-lg text-center text-orange-800">
                  {language === 'hi' ? 'जन्म विवरण दर्ज करें' : 'Enter Birth Details'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <BirthDataForm 
                  onSubmit={handleBirthDataSubmit}
                  loading={loading}
                  language={language}
                />
                
                {kundali && (
                  <Button 
                    variant="outline" 
                    onClick={resetKundali}
                    className="w-full mt-4 border-orange-200 text-orange-700 hover:bg-orange-50"
                  >
                    {language === 'hi' ? 'नई कुंडली बनाएं' : 'Create New Kundali'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Kundali Chart Tab */}
          <TabsContent value="chart" className="mt-0">
            {kundali ? (
              <div className="space-y-4">
                {/* Display calculated Rashi information prominently */}
                <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <h3 className="font-bold text-orange-800">{language === 'hi' ? 'चंद्र राशि' : 'Moon Sign'}</h3>
                        <p className="text-lg text-orange-600">{kundali.moonRashi}</p>
                      </div>
                      <div>
                        <h3 className="font-bold text-orange-800">{language === 'hi' ? 'सूर्य राशि' : 'Sun Sign'}</h3>
                        <p className="text-lg text-orange-600">{kundali.sunRashi}</p>
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <h3 className="font-bold text-orange-800">{language === 'hi' ? 'नक्षत्र' : 'Nakshatra'}</h3>
                      <p className="text-lg text-orange-600">{kundali.nakshatraName}</p>
                    </div>
                  </CardContent>
                </Card>

                <KundaliChart 
                  kundaliData={kundali} 
                  language={language}
                />
                <PlanetaryPositions 
                  planets={kundali.chart?.planets || {}} 
                  language={language}
                />
              </div>
            ) : (
              <Card className="border-orange-200">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    {language === 'hi' 
                      ? 'पहले अपनी जन्म जानकारी दर्ज करें'
                      : 'Please enter your birth details first'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Personality Analysis Tab */}
          <TabsContent value="personality" className="mt-0">
            {kundali ? (
              <ArchetypeAnalysis 
                kundali={kundali} 
                language={language}
              />
            ) : (
              <Card className="border-orange-200">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    {language === 'hi' 
                      ? 'पहले अपनी कुंडली बनाएं'
                      : 'Please create your Kundali first'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Daily Horoscope Tab */}
          <TabsContent value="horoscope" className="mt-0">
            {kundali ? (
              <EnhancedDailyHoroscope 
                kundali={kundali} 
                language={language}
              />
            ) : (
              <Card className="border-orange-200">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    {language === 'hi' 
                      ? 'पहले अपनी कुंडली बनाएं'
                      : 'Please create your Kundali first'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating AI Chatbot */}
      <FloatingChatbot kundaliData={kundali} />
    </div>
  );
};

export default Index;
