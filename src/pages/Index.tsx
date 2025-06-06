
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BirthDataForm from '@/components/BirthDataForm';
import PersonalityTest from '@/components/PersonalityTest';
import EnhancedDailyHoroscope from '@/components/EnhancedDailyHoroscope';
import FloatingChatbot from '@/components/FloatingChatbot';
import NumerologyCalculator from '@/components/NumerologyCalculator';
import HeroSection from '@/components/HeroSection';
import LanguageToggle from '@/components/LanguageToggle';
import FeatureCards from '@/components/FeatureCards';
import AccuracyStatement from '@/components/AccuracyStatement';
import KundaliResultsView from '@/components/KundaliResultsView';
import LoadingSpinner from '@/components/LoadingSpinner';
import { generateComprehensiveKundali, EnhancedBirthData, ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';
import { useToast } from "@/hooks/use-toast";
import { Star, Sun, Calculator, Crown, Hash } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [kundaliData, setKundaliData] = useState<ComprehensiveKundaliData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'hi' | 'en'>('en');
  const { toast } = useToast();

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

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
      
      // Save to Supabase with enhanced error handling
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();

          const { error: insertError } = await supabase
            .from('kundali_reports')
            .insert({
              user_id: user.id,
              profile_id: profile?.id || null,
              name: birthData.name,
              birth_data: enhancedBirthData as any,
              kundali_data: result as any
            } as any);

          if (insertError) {
            console.error('Error saving kundali:', insertError);
          }
        }
      } catch (error) {
        console.error('Error saving kundali:', error);
      }

      await logUserActivity('kundali_generated', {
        name: birthData.name,
        place: birthData.placeOfBirth
      });
      
      toast({
        title: getTranslation("Success", "सफलता"),
        description: getTranslation(
          "Your comprehensive Kundali has been generated successfully with enhanced accuracy!",
          "आपकी संपूर्ण कुंडली सफलतापूर्वक तैयार हो गई है!"
        ),
      });
    } catch (error) {
      console.error('Error generating comprehensive Kundali:', error);
      toast({
        title: getTranslation("Error", "त्रुटि"),
        description: getTranslation(
          "There was an error generating your Kundali. Please try again.",
          "कुंडली बनाने में त्रुटि हुई है। कृपया पुनः प्रयास करें।"
        ),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="container mx-auto px-2 md:px-4 py-4 md:py-8 max-w-7xl">
        {/* Enhanced Header */}
        <HeroSection language={language} />

        {/* Language Toggle */}
        <LanguageToggle language={language} onLanguageChange={setLanguage} />

        {/* Main Content */}
        {!kundaliData ? (
          <Tabs defaultValue="kundali" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 md:mb-8 mx-2 md:mx-0">
              <TabsTrigger value="kundali" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-4">
                <Star className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">{getTranslation('Complete Kundali', 'संपूर्ण कुंडली')}</span>
                <span className="sm:hidden">{getTranslation('Kundali', 'कुंडली')}</span>
              </TabsTrigger>
              <TabsTrigger value="numerology" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-4">
                <Hash className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">{getTranslation('Numerology', 'न्यूमेरोलॉजी')}</span>
                <span className="sm:hidden">{getTranslation('Numbers', 'अंक')}</span>
              </TabsTrigger>
              <TabsTrigger value="personality" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-4">
                <Calculator className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">{getTranslation('Personality Test', 'व्यक्तित्व परीक्षण')}</span>
                <span className="sm:hidden">{getTranslation('Test', 'परीक्षण')}</span>
              </TabsTrigger>
              <TabsTrigger value="horoscope" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-4">
                <Sun className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">{getTranslation('Daily Horoscope', 'दैनिक राशिफल')}</span>
                <span className="sm:hidden">{getTranslation('Daily', 'दैनिक')}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="kundali" data-testid="kundali-section">
              <Card className="max-w-2xl mx-auto shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 p-4 md:p-6">
                  <CardTitle className="text-center text-xl md:text-2xl text-gray-800 flex items-center justify-center gap-2">
                    <Crown className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />
                    {getTranslation('Generate Advanced Complete Kundali', 'उन्नत संपूर्ण कुंडली बनवाएं')}
                  </CardTitle>
                  <p className="text-center text-gray-600 mt-2 text-sm md:text-base px-2">
                    {getTranslation(
                      'Detailed 90+ page analysis with Swiss Ephemeris precision',
                      'Swiss Ephemeris की सटीकता के साथ 90+ पेज का विस्तृत विश्लेषण'
                    )}
                  </p>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <BirthDataForm 
                    onSubmit={handleKundaliGeneration}
                    isLoading={isLoading}
                    language={language}
                  />
                  
                  {isLoading && <LoadingSpinner language={language} />}
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
          <KundaliResultsView 
            kundaliData={kundaliData}
            language={language}
            onBack={() => setKundaliData(null)}
          />
        )}

        {/* Feature Cards */}
        <FeatureCards language={language} kundaliData={kundaliData} />

        {/* Accuracy Statement */}
        <AccuracyStatement language={language} kundaliData={kundaliData} />

        {/* Footer */}
        <footer className="mt-12 md:mt-16 text-center py-6 md:py-8 border-t border-gray-200 mx-4">
          <p className="text-gray-600 text-sm">
            © 2025 AyuAstro. All rights reserved.
          </p>
        </footer>
      </div>

      {/* Enhanced Floating Chatbot */}
      <FloatingChatbot 
        kundaliData={kundaliData} 
        numerologyData={null}
      />
    </div>
  );
};

export default Index;
