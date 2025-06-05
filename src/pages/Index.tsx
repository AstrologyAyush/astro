
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BirthDataForm from '@/components/BirthDataForm';
import PersonalityTest from '@/components/PersonalityTest';
import EnhancedDailyHoroscope from '@/components/EnhancedDailyHoroscope';
import FloatingChatbot from '@/components/FloatingChatbot';
import AppLogo from '@/components/AppLogo';
import KundaliConsultationView from '@/components/KundaliConsultationView';
import NumerologyCalculator from '@/components/NumerologyCalculator';
import { generateComprehensiveKundali, EnhancedBirthData, ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';
import { useToast } from "@/hooks/use-toast";
import { Star, Moon, Sun, Calculator, Sparkles, Crown, Target, ArrowLeft, Hash } from 'lucide-react';
import InteractiveDashboard from '@/components/InteractiveDashboard';
import EnhancedKundaliPDFExport from '@/components/EnhancedKundaliPDFExport';
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [kundaliData, setKundaliData] = useState<ComprehensiveKundaliData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'hi' | 'en'>('en');
  const { toast } = useToast();

  const logUserActivity = async (activityType: string, activityData?: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('user_activities').insert({
          user_id: user.id,
          activity_type: activityType,
          activity_data: activityData
        });
      }
    } catch (error) {
      console.error('Error logging user activity:', error);
    }
  };

  const handleKundaliGeneration = async (birthData: any) => {
    setIsLoading(true);
    
    try {
      const enhancedBirthData: EnhancedBirthData = {
        fullName: birthData.name,
        date: birthData.dateOfBirth,
        time: birthData.timeOfBirth,
        place: birthData.placeOfBirth,
        latitude: birthData.latitude,
        longitude: birthData.longitude,
        timezone: '5.5'
      };

      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const result = generateComprehensiveKundali(enhancedBirthData);
      setKundaliData(result);
      
      // Save to Supabase
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('kundali_reports').insert({
            user_id: user.id,
            name: birthData.name,
            birth_data: enhancedBirthData,
            kundali_data: result
          });
        }
      } catch (error) {
        console.error('Error saving kundali:', error);
      }

      // Log activity
      await logUserActivity('kundali_generated', {
        name: birthData.name,
        place: birthData.placeOfBirth
      });
      
      toast({
        title: language === 'hi' ? "सफलता" : "Success",
        description: language === 'hi' ? "आपकी संपूर्ण कुंडली सफलतापूर्वक तैयार हो गई है!" : "Your comprehensive Kundali has been generated successfully with enhanced accuracy!",
      });
    } catch (error) {
      console.error('Error generating comprehensive Kundali:', error);
      toast({
        title: language === 'hi' ? "त्रुटि" : "Error",
        description: language === 'hi' ? "कुंडली बनाने में त्रुटि हुई है। कृपया पुनः प्रयास करें।" : "There was an error generating your Kundali. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header with Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <AppLogo size="xl" className="mr-4" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                  AyuAstro
                </span>
              </h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Sparkles className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-orange-600 font-medium">
                  {language === 'hi' ? 'पं. ऋषि पराशर के सिद्धांतों पर आधारित' : 'Based on Rishi Parasher Principles'}
                </span>
                <Sparkles className="h-4 w-4 text-orange-500" />
              </div>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === 'hi' 
              ? "उन्नत खगोलीय गणना और पं. ऋषि पराशर के मार्गदर्शन के साथ अपने भाग्य की सटीक खोज करें"
              : "Discover Your Destiny with Precision - Advanced Astronomical Calculations & Rishi Parasher Guidance"
            }
          </p>
          
          {/* Features highlight */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
              <Crown className="h-3 w-3 inline mr-1" />
              {language === 'hi' ? 'Swiss Ephemeris सटीकता' : 'Swiss Ephemeris Accuracy'}
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              <Target className="h-3 w-3 inline mr-1" />
              {language === 'hi' ? 'पं. ऋषि पराशर मार्गदर्शन' : 'Rishi Parasher Guidance'}
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              <Star className="h-3 w-3 inline mr-1" />
              {language === 'hi' ? 'संपूर्ण विश्लेषण' : 'Comprehensive Analysis'}
            </div>
          </div>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                language === 'en' 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                language === 'hi' 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>

        {/* Main Content */}
        {!kundaliData ? (
          <Tabs defaultValue="kundali" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="kundali" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                {language === 'hi' ? 'संपूर्ण कुंडली' : 'Complete Kundali'}
              </TabsTrigger>
              <TabsTrigger value="numerology" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                {language === 'hi' ? 'न्यूमेरोलॉजी' : 'Numerology'}
              </TabsTrigger>
              <TabsTrigger value="personality" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                {language === 'hi' ? 'व्यक्तित्व परीक्षण' : 'Personality Test'}
              </TabsTrigger>
              <TabsTrigger value="horoscope" className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                {language === 'hi' ? 'दैनिक राशिफल' : 'Daily Horoscope'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="kundali">
              <Card className="max-w-2xl mx-auto shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100">
                  <CardTitle className="text-center text-2xl text-gray-800 flex items-center justify-center gap-2">
                    <Crown className="h-6 w-6 text-orange-600" />
                    {language === 'hi' ? 'उन्नत संपूर्ण कुंडली बनवाएं' : 'Generate Advanced Complete Kundali'}
                  </CardTitle>
                  <p className="text-center text-gray-600 mt-2">
                    {language === 'hi' 
                      ? 'Swiss Ephemeris की सटीकता के साथ 90+ पेज का विस्तृत विश्लेषण'
                      : 'Detailed 90+ page analysis with Swiss Ephemeris precision'
                    }
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  <BirthDataForm 
                    onSubmit={handleKundaliGeneration}
                    isLoading={isLoading}
                    language={language}
                  />
                  
                  {isLoading && (
                    <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                        <div>
                          <p className="text-orange-800 font-medium">
                            {language === 'hi' ? 'उन्नत गणना प्रगति में...' : 'Advanced Calculations in Progress...'}
                          </p>
                          <p className="text-orange-600 text-sm">
                            {language === 'hi' 
                              ? 'ग्रह स्थिति, योग, दशा और ऋषि पराशर विश्लेषण तैयार हो रहा है'
                              : 'Calculating planetary positions, yogas, dashas, and Rishi Parasher analysis'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="numerology">
              <NumerologyCalculator language={language} />
            </TabsContent>

            <TabsContent value="personality">
              <PersonalityTest language={language} />
            </TabsContent>

            <TabsContent value="horoscope">
              <EnhancedDailyHoroscope 
                kundaliData={null} 
                language={language} 
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <button
                onClick={() => setKundaliData(null)}
                className="text-orange-600 hover:text-orange-700 underline mb-4 flex items-center gap-2 mx-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                {language === 'hi' ? 'नई कुंडली बनाएं' : 'Generate New Kundali'}
              </button>
            </div>
            
            {/* Interactive Dashboard */}
            <Card className="w-full border-orange-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-orange-800 flex items-center gap-2">
                    <Crown className="h-5 w-5 text-orange-600" />
                    {language === 'hi' ? 'इंटरैक्टिव डैशबोर्ड' : 'Interactive Dashboard'}
                  </CardTitle>
                  <EnhancedKundaliPDFExport kundaliData={kundaliData} language={language} />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <InteractiveDashboard kundaliData={kundaliData} language={language} />
              </CardContent>
            </Card>
            
            {/* Display comprehensive Kundali using KundaliConsultationView */}
            <KundaliConsultationView 
              kundaliData={kundaliData}
              language={language}
            />
            
            {/* Show personalized horoscope after Kundali generation */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                {language === 'hi' ? 'आपका व्यक्तिगत दैनिक राशिफल' : 'Your Personalized Daily Horoscope'}
              </h2>
              <div className="flex justify-center">
                <EnhancedDailyHoroscope 
                  kundaliData={kundaliData} 
                  language={language} 
                />
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Features Section */}
        {!kundaliData && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="pt-6">
                <Crown className="h-12 w-12 mx-auto text-orange-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-orange-800">
                  {language === 'hi' ? 'Swiss Ephemeris सटीकता' : 'Swiss Ephemeris Precision'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === 'hi' 
                    ? 'NASA ग्रेड सटीकता के साथ ग्रह स्थिति और योग गणना'
                    : 'NASA-grade accuracy for planetary positions and yoga calculations'
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="pt-6">
                <Target className="h-12 w-12 mx-auto text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-blue-800">
                  {language === 'hi' ? 'पं. ऋषि पराशर मार्गदर्शन' : 'Rishi Parasher Guidance'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === 'hi' 
                    ? 'वैदिक ज्योतिष के महान गुरु के सिद्धांतों पर आधारित व्यक्तिगत परामर्श'
                    : 'Personalized consultation based on the great sage of Vedic astrology principles'
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="pt-6">
                <Star className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-green-800">
                  {language === 'hi' ? '90+ पेज विश्लेषण' : '90+ Page Analysis'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === 'hi' 
                    ? 'संपूर्ण जीवन विश्लेषण, उपाय और भविष्यवाणी के साथ'
                    : 'Complete life analysis with remedies and predictions'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Accuracy Statement */}
        <div className="mt-12 text-center bg-gradient-to-r from-orange-100 to-red-100 p-6 rounded-lg border border-orange-200">
          <h3 className="text-lg font-semibold text-orange-800 mb-2">
            {language === 'hi' ? 'सटीकता की गारंटी' : 'Accuracy Guarantee'}
          </h3>
          <p className="text-orange-700 text-sm max-w-3xl mx-auto">
            {language === 'hi'
              ? 'हमारी उन्नत गणना प्रणाली Swiss Ephemeris डेटा का उपयोग करती है, जो NASA और दुनिया की सबसे सटीक ज्योतिषीय गणना है। पं. ऋषि पराशर के शास्त्रों के अनुसार विश्लेषण।'
              : 'Our advanced calculation system uses Swiss Ephemeris data, the same astronomical calculations used by NASA and the most accurate astrological calculations in the world. Analysis according to Rishi Parasher scriptures.'
            }
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center py-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            © 2025 AyuAstro. All rights reserved.
          </p>
        </footer>
      </div>

      {/* Enhanced Floating Chatbot - Always present */}
      <FloatingChatbot 
        kundaliData={kundaliData} 
        numerologyData={null}
      />
    </div>
  );
};

export default Index;
