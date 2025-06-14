
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
import { Star, Sun, Calculator, Crown, Hash, Sparkles } from 'lucide-react';
import RishiParasharOverview from '@/components/RishiParasharOverview';
import LifePathReport from '@/components/LifePathReport';

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
      console.log('🚀 Starting comprehensive Vedic Kundali generation...');
      console.log('📝 Input birth data:', birthData);
      
      // Enhanced data processing with better validation
      let processedBirthData: EnhancedBirthData;
      
      try {
        // Handle different date formats
        let dateString: string;
        let timeString: string;
        
        if (birthData.dateOfBirth instanceof Date) {
          // Convert Date object to string
          const year = birthData.dateOfBirth.getFullYear();
          const month = String(birthData.dateOfBirth.getMonth() + 1).padStart(2, '0');
          const day = String(birthData.dateOfBirth.getDate()).padStart(2, '0');
          dateString = `${year}-${month}-${day}`;
        } else if (typeof birthData.dateOfBirth === 'string') {
          dateString = birthData.dateOfBirth;
        } else if (birthData.date) {
          dateString = birthData.date;
        } else {
          throw new Error('Birth date is required and must be a valid date');
        }
        
        // Handle time format
        if (typeof birthData.timeOfBirth === 'string') {
          timeString = birthData.timeOfBirth;
          // Ensure time has seconds
          if (timeString.split(':').length === 2) {
            timeString += ':00';
          }
        } else if (birthData.time) {
          timeString = birthData.time;
          if (timeString.split(':').length === 2) {
            timeString += ':00';
          }
        } else {
          timeString = '12:00:00'; // Default time
        }
        
        // Validate coordinates
        const latitude = Number(birthData.latitude);
        const longitude = Number(birthData.longitude);
        
        if (isNaN(latitude) || isNaN(longitude)) {
          throw new Error('Invalid coordinates. Please select a valid location.');
        }
        
        if (latitude === 0 && longitude === 0) {
          throw new Error('Location coordinates are required. Please select your birth place.');
        }
        
        processedBirthData = {
          fullName: birthData.name || birthData.fullName || 'Unknown',
          date: dateString,
          time: timeString,
          place: birthData.placeOfBirth || birthData.place || 'Unknown',
          latitude: latitude,
          longitude: longitude,
          timezone: 5.5 // IST timezone
        };
        
        console.log('✅ Enhanced birth data prepared:', processedBirthData);
        
      } catch (processingError) {
        console.error('❌ Error processing birth data:', processingError);
        throw new Error(`Data processing failed: ${processingError instanceof Error ? processingError.message : 'Invalid data format'}`);
      }

      // Show detailed loading progress
      toast({
        title: getTranslation("Processing", "प्रसंस्करण"),
        description: getTranslation("Calculating comprehensive astrological analysis...", "व्यापक ज्योतिषीय विश्लेषण की गणना की जा रही है...")
      });

      // Enhanced loading time for comprehensive calculations
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate comprehensive Kundali with all traditional elements
      console.log('🔯 Generating comprehensive Vedic calculations...');
      const result = generateAdvancedKundali(processedBirthData);

      if (!result) {
        throw new Error('Failed to generate Kundali data');
      }

      setKundaliData(result);

      // Save to Supabase with enhanced error handling
      try {
        const kundaliId = await saveEnhancedKundali(processedBirthData, result as any, undefined);
        if (kundaliId) {
          console.log('💾 Comprehensive Kundali saved to Supabase:', kundaliId);
        }
      } catch (saveError) {
        console.error('Error saving Kundali:', saveError);
        // Don't fail the whole process if saving fails
      }
      
      toast({
        title: getTranslation("Success", "सफलता"),
        description: getTranslation("Your comprehensive Vedic Kundali with all traditional elements has been generated!", "आपकी संपूर्ण वैदिक कुंडली सभी पारंपरिक तत्वों के साथ तैयार हो गई है!")
      });
      
    } catch (error) {
      console.error('❌ Error generating comprehensive Kundali:', error);
      
      // Enhanced error messaging
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: getTranslation("Error", "त्रुटि"),
        description: getTranslation(
          `There was an error generating your Kundali: ${errorMessage}. Please verify your birth details and try again.`, 
          `कुंडली बनाने में त्रुटि हुई है: ${errorMessage}। कृपया अपने जन्म विवरण की जांच करें और पुनः प्रयास करें।`
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 touch-manipulation">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-8 max-w-7xl">
        {/* Enhanced Astrological Background Image with Better Styling */}
        <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 mb-6 md:mb-8 overflow-hidden rounded-2xl shadow-2xl">
          <img 
            src="/lovable-uploads/18da27cd-3784-4fde-a3ba-199421c6eb86.png" 
            alt="Astrological Chart and Galaxy" 
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-6 rounded-xl bg-black/20 backdrop-blur-sm">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 md:h-12 md:w-12 text-yellow-300 animate-pulse" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 md:mb-4 drop-shadow-2xl bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                {getTranslation('Vedic Astrology Portal', 'वैदिक ज्योतिष पोर्टल')}
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl drop-shadow-lg text-orange-100">
                {getTranslation('Discover Your Cosmic Blueprint', 'अपना ब्रह्मांडीय खाका खोजें')}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Header with CTA integration */}
        <HeroSection 
          language={language} 
          onKundaliClick={handleKundaliCTA} 
          onNumerologyClick={handleNumerologyCTA} 
          onPersonalityClick={handlePersonalityCTA} 
          onHoroscopeClick={handleHoroscopeCTA} 
        />

        {/* Language Toggle with Better Styling */}
        <div className="mb-6 md:mb-8">
          <LanguageToggle language={language} onLanguageChange={setLanguage} />
        </div>

        {/* Rishi Parashar's Profound Thoughts on Kundali */}
        <div className="mb-8 md:mb-10">
          <RishiParasharOverview language={language} />
        </div>

        {/* Enhanced Main Content */}
        {!kundaliData ? (
          <Tabs defaultValue="kundali" className="w-full">
            <TabsList className={`grid w-full grid-cols-2 md:grid-cols-4 mb-6 md:mb-8 mx-1 md:mx-0 bg-white/90 backdrop-blur-sm border-2 border-orange-100 rounded-xl p-2 shadow-lg ${isMobile ? 'h-auto gap-1' : 'h-auto'}`}>
              <TabsTrigger 
                value="kundali" 
                className="flex flex-col items-center gap-2 text-xs sm:text-sm px-3 py-4 min-h-[70px] rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-200 hover:shadow-md"
              >
                <Star className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                <span className="text-center leading-tight font-medium">
                  {isMobile ? getTranslation('Kundali', 'कुंडली') : getTranslation('Precision Vedic Kundali', 'सटीक वैदिक कुंडली')}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="numerology" 
                className="flex flex-col items-center gap-2 text-xs sm:text-sm px-3 py-4 min-h-[70px] rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-200 hover:shadow-md"
              >
                <Hash className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                <span className="text-center leading-tight font-medium">
                  {isMobile ? getTranslation('Numbers', 'अंक') : getTranslation('Numerology', 'न्यूमेरोलॉजी')}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="personality" 
                className="flex flex-col items-center gap-2 text-xs sm:text-sm px-3 py-4 min-h-[70px] rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-200 hover:shadow-md"
              >
                <Calculator className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                <span className="text-center leading-tight font-medium">
                  {isMobile ? getTranslation('Test', 'परीक्षण') : getTranslation('Personality Test', 'व्यक्तित्व परीक्षण')}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="horoscope" 
                className="flex flex-col items-center gap-2 text-xs sm:text-sm px-3 py-4 min-h-[70px] rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-200 hover:shadow-md"
              >
                <Sun className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                <span className="text-center leading-tight font-medium">
                  {isMobile ? getTranslation('Daily', 'दैनिक') : getTranslation('Daily Horoscope', 'दैनिक राशिफल')}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="kundali" data-testid="kundali-section" className="animate-fade-in">
              <Card className="max-w-3xl mx-auto shadow-2xl border-2 border-orange-200 bg-white/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-orange-100 via-amber-50 to-red-100 p-4 sm:p-6 md:p-8 rounded-t-lg">
                  <CardTitle className="text-center text-xl sm:text-2xl md:text-3xl text-gray-800 flex items-center justify-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                      <Crown className="h-6 w-6 sm:h-7 sm:w-7 text-white flex-shrink-0" />
                    </div>
                    <span className="text-center leading-tight">
                      {getTranslation('Precision Vedic Kundali', 'सटीक वैदिक कुंडली')}
                    </span>
                  </CardTitle>
                  <p className="text-center text-gray-600 mt-4 text-sm sm:text-base md:text-lg px-4 leading-relaxed">
                    {getTranslation('Traditional calculations with Swiss Ephemeris precision - 100+ page detailed analysis', 'Swiss Ephemeris सटीकता के साथ पारंपरिक गणना - 100+ पेज का विस्तृत विश्लेषण')}
                  </p>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <BirthDataForm onSubmit={handleKundaliGeneration} isLoading={isLoading} language={language} />
                  
                  {isLoading && <LoadingSpinner language={language} />}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="numerology" className="animate-fade-in">
              <NumerologyCalculator />
            </TabsContent>

            <TabsContent value="personality" className="animate-fade-in">
              <PersonalityTest language={language} />
            </TabsContent>

            <TabsContent value="horoscope" className="animate-fade-in">
              <EnhancedDailyHoroscope kundaliData={null} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="animate-slide-up space-y-8">
            <KundaliResultsView kundaliData={kundaliData} language={language} onBack={() => setKundaliData(null)} />
            
            {/* Life Path Report */}
            <LifePathReport kundaliData={kundaliData} language={language} />
          </div>
        )}

        {/* Enhanced Feature Cards */}
        <div className="mt-8 md:mt-12">
          <FeatureCards language={language} kundaliData={kundaliData} />
        </div>

        {/* Enhanced Accuracy Statement */}
        <div className="mt-8 md:mt-12">
          <AccuracyStatement language={language} kundaliData={kundaliData} />
        </div>

        {/* Enhanced Footer */}
        <footer className="mt-12 md:mt-16 text-center py-6 md:py-8 border-t-2 border-orange-200 mx-2 sm:mx-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-t-2xl">
          <div className="space-y-3">
            <p className="text-gray-700 text-sm sm:text-base font-medium">
              © 2025 AyuAstro - Precision Vedic Astrology. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs sm:text-sm">
              {getTranslation('Powered by Swiss Ephemeris & Traditional Vedic Calculations', 'Swiss Ephemeris और पारंपरिक वैदिक गणनाओं द्वारा संचालित')}
            </p>
            <div className="flex justify-center">
              <Sparkles className="h-4 w-4 text-orange-500" />
            </div>
          </div>
        </footer>
      </div>

      {/* Enhanced Floating Chatbot with better positioning */}
      <div className={`fixed ${isMobile ? 'bottom-24 right-4' : 'bottom-8 right-8'} z-50`}>
        <FloatingChatbot kundaliData={kundaliData} numerologyData={null} />
      </div>
    </div>
  );
};

export default Index;
