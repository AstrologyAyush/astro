
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BirthDataForm from '@/components/BirthDataForm';
import DetailedKundaliDisplay from '@/components/DetailedKundaliDisplay';
import PersonalityTest from '@/components/PersonalityTest';
import DailyHoroscope from '@/components/DailyHoroscope';
import { generateDetailedKundali, EnhancedBirthData, KundaliData } from '@/lib/advancedKundaliEngine';
import { useToast } from "@/hooks/use-toast";
import { Star, Moon, Sun, Calculator } from 'lucide-react';

const Index = () => {
  const [kundaliData, setKundaliData] = useState<KundaliData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'hi' | 'en'>('en');
  const { toast } = useToast();

  const handleKundaliGeneration = async (birthData: any) => {
    setIsLoading(true);
    
    try {
      // Convert the form data to EnhancedBirthData format
      const enhancedBirthData: EnhancedBirthData = {
        name: birthData.name,
        dateOfBirth: birthData.dateOfBirth,
        timeOfBirth: birthData.timeOfBirth,
        placeOfBirth: birthData.placeOfBirth,
        latitude: birthData.latitude,
        longitude: birthData.longitude
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = generateDetailedKundali(enhancedBirthData);
      setKundaliData(result);
      
      toast({
        title: language === 'hi' ? "सफलता" : "Success",
        description: language === 'hi' ? "आपकी कुंडली सफलतापूर्वक तैयार हो गई है!" : "Your detailed Kundali has been generated successfully!",
      });
    } catch (error) {
      console.error('Error generating Kundali:', error);
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
              AyushAstro
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {language === 'hi' 
              ? "आपकी संपूर्ण वैदिक ज्योतिष विश्लेषण के साथ अपने भाग्य की खोज करें"
              : "Discover Your Destiny with Complete Vedic Astrology Analysis"
            }
          </p>
        </div>

        {/* Main Content */}
        {!kundaliData ? (
          <Tabs defaultValue="kundali" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="kundali" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                {language === 'hi' ? 'कुंडली' : 'Kundali'}
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
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-center text-2xl text-gray-800">
                    {language === 'hi' ? 'विस्तृत कुंडली बनवाएं' : 'Generate Detailed Kundali'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BirthDataForm 
                    onSubmit={handleKundaliGeneration}
                    isLoading={isLoading}
                    language={language}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="personality">
              <PersonalityTest language={language} />
            </TabsContent>

            <TabsContent value="horoscope">
              <DailyHoroscope language={language} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <button
                onClick={() => setKundaliData(null)}
                className="text-orange-600 hover:text-orange-700 underline mb-4"
              >
                ← {language === 'hi' ? 'नई कुंडली बनाएं' : 'Generate New Kundali'}
              </button>
            </div>
            <DetailedKundaliDisplay kundaliData={kundaliData} />
          </div>
        )}

        {/* Features Section */}
        {!kundaliData && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Star className="h-12 w-12 mx-auto text-orange-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {language === 'hi' ? 'विस्तृत विश्लेषण' : 'Detailed Analysis'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === 'hi' 
                    ? 'ग्रह स्थिति, योग, दशा और जीवन की भविष्यवाणियां'
                    : 'Planetary positions, yogas, dashas, and life predictions'
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Moon className="h-12 w-12 mx-auto text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {language === 'hi' ? 'व्यक्तित्व परीक्षण' : 'Personality Analysis'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === 'hi' 
                    ? 'आपके व्यवहार और चरित्र का गहरा विश्लेषण'
                    : 'Deep insights into your behavior and character traits'
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Sun className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {language === 'hi' ? 'दैनिक राशिफल' : 'Daily Guidance'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === 'hi' 
                    ? 'प्रतिदिन के लिए व्यक्तिगत मार्गदर्शन'
                    : 'Personalized daily insights and recommendations'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
