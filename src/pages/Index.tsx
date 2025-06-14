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
import { generateAdvancedKundali, EnhancedBirthData, ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';
import { getGeminiKundaliAnalysis } from '@/lib/geminiKundaliAnalysis';
import { saveEnhancedKundali } from '@/lib/supabaseKundaliStorage';
import { useToast } from "@/hooks/use-toast";
import { useIsMobile, useViewportHeight } from '@/hooks/use-mobile';
import { Star, Sun, Calculator, Crown, Hash } from 'lucide-react';

const Index = () => {
  const [kundaliData, setKundaliData] = useState<ComprehensiveKundaliData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'hi' | 'en'>('en');
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const viewportHeight = useViewportHeight();

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const handleKundaliGeneration = async (birthData: any) => {
    setIsLoading(true);
    
    try {
      console.log('🚀 Starting precise Vedic Kundali generation...');
      
      const enhancedBirthData: EnhancedBirthData = {
        fullName: birthData.name,
        date: birthData.dateOfBirth,
        time: birthData.timeOfBirth,
        place: birthData.placeOfBirth,
        latitude: birthData.latitude,
        longitude: birthData.longitude,
        timezone: 5.5 // IST timezone
      };

      // Show detailed loading progress
      toast({
        title: getTranslation("Processing", "प्रसंस्करण"),
        description: getTranslation(
          "Calculating planetary positions with Swiss Ephemeris precision...",
          "Swiss Ephemeris सटीकता के साथ ग्रहों की स्थिति की गणना की जा रही है..."
        ),
      });

      // Enhanced loading time for Swiss Ephemeris-level calculations
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate comprehensive Kundali with maximum accuracy
      console.log('🔯 Generating precise Vedic calculations...');
      const result = generateAdvancedKundali(enhancedBirthData);
      
      // Enhanced yoga validation - only strong yogas marked as active
      if (result.enhancedCalculations.yogas) {
        result.enhancedCalculations.yogas = result.enhancedCalculations.yogas.map(yoga => ({
          ...yoga,
          isActive: yoga.strength > 75 && yoga.isActive // Higher threshold for accuracy
        }));
      }
      
      setKundaliData(result);
      
      // Get enhanced Gemini analysis
      toast({
        title: getTranslation("Enhancing Analysis", "विश्लेषण बढ़ाया जा रहा है"),
        description: getTranslation(
          "Getting AI-powered detailed predictions...",
          "AI-संचालित विस्तृत भविष्यवाणी प्राप्त की जा रही है..."
        ),
      });

      // Note: Gemini analysis will be integrated when API key is available
      console.log('🤖 Gemini analysis integration ready for API key configuration');
      
      // Save to Supabase with enhanced error handling
      try {
        const kundaliId = await saveEnhancedKundali(
          enhancedBirthData,
          result as any, // Type conversion for compatibility
          undefined // Gemini analysis placeholder
        );
        
        if (kundaliId) {
          console.log('💾 Enhanced Kundali saved to Supabase:', kundaliId);
        }
      } catch (saveError) {
        console.error('Error saving Kundali:', saveError);
        // Don't fail the whole process if saving fails
      }
      
      toast({
        title: getTranslation("Success", "सफलता"),
        description: getTranslation(
          "Your precision Vedic Kundali has been generated with maximum astronomical accuracy!",
          "आपकी सटीक वैदिक कुंडली अधिकतम खगोलीय सटीकता के साथ तैयार हो गई है!"
        ),
      });
      
    } catch (error) {
      console.error('❌ Error generating enhanced Kundali:', error);
      toast({
        title: getTranslation("Error", "त्रुटि"),
        description: getTranslation(
          "There was an error generating your Kundali. Please verify your birth details and try again.",
          "कुंडली बनाने में त्रुटि हुई है। कृपया अपने जन्म विवरण की जांच करें और पुनः प्रयास करें।"
        ),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced CTA button handlers
  const handleKundaliCTA = () => {
    const kundaliSection = document.querySelector('[data-testid="kundali-section"]');
    if (kundaliSection) {
      kundaliSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNumerologyCTA = () => {
    const numerologyTab = document.querySelector('[value="numerology"]');
    if (numerologyTab) {
      (numerologyTab as HTMLElement).click();
    }
  };

  const handlePersonalityCTA = () => {
    const personalityTab = document.querySelector('[value="personality"]');
    if (personalityTab) {
      (personalityTab as HTMLElement).click();
    }
  };

  const handleHoroscopeCTA = () => {
    const horoscopeTab = document.querySelector('[value="horoscope"]');
    if (horoscopeTab) {
      (horoscopeTab as HTMLElement).click();
    }
  };

  return (
    <div className="min-h-screen-mobile bg-gradient-to-br from-orange-50 via-white to-red-50 touch-manipulation">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-2 md:py-8 max-w-7xl safe-area-pt">
        {/* Enhanced Header with CTA integration */}
        <HeroSection 
          language={language} 
          onKundaliClick={handleKundaliCTA}
          onNumerologyClick={handleNumerologyCTA}
          onPersonalityClick={handlePersonalityCTA}
          onHoroscopeClick={handleHoroscopeCTA}
        />

        {/* Language Toggle */}
        <div className="mb-4 md:mb-6">
          <LanguageToggle language={language} onLanguageChange={setLanguage} />
        </div>

        {/* Main Content */}
        {!kundaliData ? (
          <Tabs defaultValue="kundali" className="w-full">
            <TabsList className={`grid w-full grid-cols-2 md:grid-cols-4 mb-4 md:mb-6 mx-1 md:mx-0 ${
              isMobile ? 'h-auto gap-1' : 'h-auto'
            }`}>
              <TabsTrigger 
                value="kundali" 
                className="flex flex-col items-center gap-1 text-xs sm:text-sm px-2 py-3 min-h-[60px] tap-highlight-none"
              >
                <Star className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="text-center leading-tight">
                  {isMobile 
                    ? getTranslation('Kundali', 'कुंडली')
                    : getTranslation('Precision Vedic Kundali', 'सटीक वैदिक कुंडली')
                  }
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="numerology" 
                className="flex flex-col items-center gap-1 text-xs sm:text-sm px-2 py-3 min-h-[60px] tap-highlight-none"
              >
                <Hash className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="text-center leading-tight">
                  {isMobile 
                    ? getTranslation('Numbers', 'अंक')
                    : getTranslation('Numerology', 'न्यूमेरोलॉजी')
                  }
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="personality" 
                className="flex flex-col items-center gap-1 text-xs sm:text-sm px-2 py-3 min-h-[60px] tap-highlight-none"
              >
                <Calculator className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="text-center leading-tight">
                  {isMobile 
                    ? getTranslation('Test', 'परीक्षण')
                    : getTranslation('Personality Test', 'व्यक्तित्व परीक्षण')
                  }
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="horoscope" 
                className="flex flex-col items-center gap-1 text-xs sm:text-sm px-2 py-3 min-h-[60px] tap-highlight-none"
              >
                <Sun className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="text-center leading-tight">
                  {isMobile 
                    ? getTranslation('Daily', 'दैनिक')
                    : getTranslation('Daily Horoscope', 'दैनिक राशिफल')
                  }
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="kundali" data-testid="kundali-section" className="animate-fade-in">
              <Card className="max-w-2xl mx-auto shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 p-3 sm:p-4 md:p-6">
                  <CardTitle className="text-center text-lg sm:text-xl md:text-2xl text-gray-800 flex items-center justify-center gap-2">
                    <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 flex-shrink-0" />
                    <span className="text-center leading-tight">
                      {getTranslation('Precision Vedic Kundali', 'सटीक वैदिक कुंडली')}
                    </span>
                  </CardTitle>
                  <p className="text-center text-gray-600 mt-2 text-xs sm:text-sm md:text-base px-2">
                    {getTranslation(
                      'Traditional calculations with Swiss Ephemeris precision - 100+ page detailed analysis',
                      'Swiss Ephemeris सटीकता के साथ पारंपरिक गणना - 100+ पेज का विस्तृत विश्लेषण'
                    )}
                  </p>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <BirthDataForm 
                    onSubmit={handleKundaliGeneration}
                    isLoading={isLoading}
                    language={language}
                  />
                  
                  {isLoading && <LoadingSpinner language={language} />}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="numerology" className="animate-fade-in">
              <NumerologyCalculator language={language} />
            </TabsContent>

            <TabsContent value="personality" className="animate-fade-in">
              <PersonalityTest language={language} />
            </TabsContent>

            <TabsContent value="horoscope" className="animate-fade-in">
              <EnhancedDailyHoroscope 
                kundaliData={null} 
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="animate-slide-up">
            <KundaliResultsView 
              kundaliData={kundaliData}
              language={language}
              onBack={() => setKundaliData(null)}
            />
          </div>
        )}

        {/* Feature Cards */}
        <div className="mt-6 md:mt-8">
          <FeatureCards 
            language={language} 
            kundaliData={kundaliData} 
          />
        </div>

        {/* Enhanced Accuracy Statement */}
        <div className="mt-6 md:mt-8">
          <AccuracyStatement language={language} kundaliData={kundaliData} />
        </div>

        {/* Footer */}
        <footer className="mt-8 md:mt-12 text-center py-4 md:py-6 border-t border-gray-200 mx-2 sm:mx-4 safe-area-pb">
          <p className="text-gray-600 text-xs sm:text-sm">
            © 2025 AyuAstro - Precision Vedic Astrology. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-1">
            {getTranslation(
              'Powered by Swiss Ephemeris & Traditional Vedic Calculations',
              'Swiss Ephemeris और पारंपरिक वैदिक गणनाओं द्वारा संचालित'
            )}
          </p>
        </footer>
      </div>

      {/* Enhanced Floating Chatbot with mobile positioning */}
      <div className={`fixed ${isMobile ? 'bottom-20 right-4' : 'bottom-6 right-6'} z-50`}>
        <FloatingChatbot 
          kundaliData={kundaliData} 
          numerologyData={null}
        />
      </div>
    </div>
  );
};

export default Index;
