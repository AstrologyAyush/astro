
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BirthDataForm from '@/components/BirthDataForm';
import DetailedKundaliDisplay from '@/components/DetailedKundaliDisplay';
import PersonalityTest from '@/components/PersonalityTest';
import EnhancedDailyHoroscope from '@/components/EnhancedDailyHoroscope';
import FloatingChatbot from '@/components/FloatingChatbot';
import AppLogo from '@/components/AppLogo';
import { generateComprehensiveKundali, EnhancedBirthData, ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';
import { useToast } from "@/hooks/use-toast";
import { Star, Moon, Sun, Calculator, Sparkles, Crown, Target } from 'lucide-react';

const Index = () => {
  const [kundaliData, setKundaliData] = useState<ComprehensiveKundaliData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'hi' | 'en'>('en');
  const { toast } = useToast();

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
        timezone: '5.5' // Default to IST, can be enhanced
      };

      // Simulate processing time for complex calculations
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const result = generateComprehensiveKundali(enhancedBirthData);
      setKundaliData(result);
      
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
                  {language === 'hi' ? 'AI संचालित वैदिक ज्योतिष' : 'AI-Powered Vedic Astrology'}
                </span>
                <Sparkles className="h-4 w-4 text-orange-500" />
              </div>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === 'hi' 
              ? "उन्नत खगोलीय गणना और AI गुरु के साथ अपने भाग्य की सटीक खोज करें"
              : "Discover Your Destiny with Precision - Advanced Astronomical Calculations & AI Guru Guidance"
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
              {language === 'hi' ? 'Gemini AI गुरु' : 'Gemini AI Guru'}
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
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="kundali" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                {language === 'hi' ? 'संपूर्ण कुंडली' : 'Complete Kundali'}
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
                              ? 'ग्रह स्थिति, योग, दशा और AI विश्लेषण तैयार हो रहा है'
                              : 'Calculating planetary positions, yogas, dashas, and AI analysis'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
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
                ← {language === 'hi' ? 'नई कुंडली बनाएं' : 'Generate New Kundali'}
              </button>
            </div>
            
            {/* Display comprehensive Kundali - we'll need to adapt DetailedKundaliDisplay */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 flex items-center justify-center gap-2">
                <Crown className="h-6 w-6 text-orange-600" />
                {language === 'hi' ? 'आपकी संपूर्ण कुंडली विश्लेषण' : 'Your Comprehensive Kundali Analysis'}
              </h2>
              
              {/* We'll create a new component to display comprehensive data */}
              <div className="text-center p-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                <p className="text-lg text-gray-700 mb-4">
                  {language === 'hi'
                    ? 'आपकी संपूर्ण कुंडली सफलतापूर्वक तैयार हो गई है!'
                    : 'Your comprehensive Kundali has been successfully generated!'
                  }
                </p>
                <p className="text-gray-600">
                  {language === 'hi'
                    ? 'कृपया PDF डाउनलोड करें या AI गुरु से चर्चा करें।'
                    : 'Please download the PDF or discuss with AI Guru.'
                  }
                </p>
              </div>
            </div>
            
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
                  {language === 'hi' ? 'Gemini AI गुरु' : 'Gemini AI Guru'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === 'hi' 
                    ? 'AI संचालित व्यक्तिगत ज्योतिष परामर्श और मार्गदर्शन'
                    : 'AI-powered personalized astrology consultation and guidance'
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
              ? 'हमारी उन्नत गणना प्रणाली Swiss Ephemeris डेटा का उपयोग करती है, जो NASA और दुनिया की सबसे सटीक ज्योतिषीय गणना है।'
              : 'Our advanced calculation system uses Swiss Ephemeris data, the same astronomical calculations used by NASA and the most accurate astrological calculations in the world.'
            }
          </p>
        </div>
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
