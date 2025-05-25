
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BirthData, generateKundaliChart, formatBirthDetails, KundaliChart as KundaliChartType, calculateMoonNakshatra } from '@/lib/kundaliUtils';
import { calculateEnhancedPlanetPositions, calculateEnhancedAscendant, calculateEnhancedHouses, calculateEnhancedPlanetaryStrength } from '@/lib/enhancedKundaliUtils';
import { calculateNumerologyProfile } from '@/lib/numerologyUtils';
import BirthDataForm from '@/components/BirthDataForm';
import KundaliChart from '@/components/KundaliChart';
import VisualKundaliChart from '@/components/VisualKundaliChart';
import PlanetaryPositions from '@/components/PlanetaryPositions';
import DashaDisplay from '@/components/DashaDisplay';
import DetailedPredictions from '@/components/DetailedPredictions';
import NumerologyCalculator from '@/components/NumerologyCalculator';
import FloatingChatbot from '@/components/FloatingChatbot';
import KundaliPDFExport from '@/components/KundaliPDFExport';
import CompatibilityChecker from '@/components/CompatibilityChecker';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Languages, Star, TrendingUp, Calendar, Heart, Briefcase, Home, Zap } from "lucide-react";

const Index = () => {
  const [kundaliData, setKundaliData] = useState<{
    birthData: BirthData & { fullName: string };
    chart: KundaliChartType;
  } | null>(null);
  const [language, setLanguage] = useState<'hi' | 'en'>('en'); // Default to English
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleGenerateKundali = (birthData: BirthData & { fullName: string }) => {
    try {
      // Use enhanced calculations for more accurate kundali
      const enhancedChart = generateKundaliChart(birthData);
      
      // Calculate enhanced planetary positions with Swiss Ephemeris principles
      const enhancedPlanets = calculateEnhancedPlanetPositions(birthData);
      
      // Calculate enhanced ascendant
      const enhancedAscendant = calculateEnhancedAscendant(birthData);
      
      // Calculate enhanced houses
      const enhancedHouses = calculateEnhancedHouses(enhancedAscendant, birthData);
      
      // Add enhanced planetary strengths using Shadbala
      const planetsWithStrength = enhancedPlanets.map(planet => ({
        ...planet,
        strength: calculateEnhancedPlanetaryStrength(planet, enhancedHouses, enhancedPlanets, birthData)
      }));
      
      const chart = {
        ...enhancedChart,
        ascendant: enhancedAscendant,
        planets: planetsWithStrength,
        housesList: enhancedHouses
      };
      
      setKundaliData({
        birthData,
        chart
      });

      toast({
        title: language === 'hi' ? "उन्नत कुंडली बन गई है" : "Enhanced Kundali Generated",
        description: language === 'hi' ? "आपकी जन्मपत्रिका उच्च गुणवत्ता की गणनाओं के साथ तैयार की गई है।" : "Your birth chart has been created with high-precision calculations.",
      });
    } catch (error) {
      toast({
        title: language === 'hi' ? "त्रुटि" : "Error",
        description: language === 'hi' ? "आपकी कुंडली बनाने में त्रुटि हुई है।" : "There was an error generating your kundali.",
        variant: "destructive",
      });
      console.error("Error generating kundali:", error);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'hi' ? 'en' : 'hi');
  };

  const numerologyData = kundaliData ? calculateNumerologyProfile(kundaliData.birthData.fullName, kundaliData.birthData.date) : undefined;

  // Detailed analysis sections
  const getDetailedAnalysis = () => {
    if (!kundaliData) return null;

    const { chart } = kundaliData;
    const sections = [
      {
        icon: <Star className="h-5 w-5" />,
        title: language === 'hi' ? 'व्यक्तित्व विश्लेषण' : 'Personality Analysis',
        content: language === 'hi' 
          ? `आपका लग्न ${chart.ascendantSanskrit} है जो आपके व्यक्तित्व को दर्शाता है। यह आपको ${chart.ascendant === 'Aries' ? 'साहसी और नेतृत्व की गुणवत्ता' : 'अनूठे गुण'} प्रदान करता है।`
          : `Your ascendant is ${chart.ascendant} which shapes your personality and approach to life. This gives you ${chart.ascendant === 'Aries' ? 'leadership qualities and courage' : 'unique characteristics'} that define how others perceive you.`
      },
      {
        icon: <Briefcase className="h-5 w-5" />,
        title: language === 'hi' ? 'करियर मार्गदर्शन' : 'Career Guidance',
        content: language === 'hi'
          ? 'आपके दसवें भाव और इसके स्वामी के आधार पर, आप व्यापार, तकनीक या कलात्मक क्षेत्रों में सफलता पा सकते हैं।'
          : 'Based on your 10th house and its lord, you may find success in business, technology, or creative fields. Your planetary positions suggest strong potential for leadership roles.'
      },
      {
        icon: <Heart className="h-5 w-5" />,
        title: language === 'hi' ? 'संबंध और प्रेम' : 'Relationships & Love',
        content: language === 'hi'
          ? 'आपके सातवें भाव की स्थिति आपके साझेदारी और विवाह के बारे में महत्वपूर्ण जानकारी देती है।'
          : 'Your 7th house position reveals important insights about partnerships and marriage. The planetary influences suggest harmony in relationships when approached with understanding.'
      },
      {
        icon: <TrendingUp className="h-5 w-5" />,
        title: language === 'hi' ? 'वित्तीय स्थिति' : 'Financial Prospects',
        content: language === 'hi'
          ? 'दूसरे और ग्यारहवें भाव की स्थिति आपकी आर्थिक स्थिति और आय के स्रोतों को दर्शाती है।'
          : 'Your 2nd and 11th house positions indicate good potential for wealth accumulation through multiple income sources and wise investments.'
      }
    ];

    return sections;
  };

  return (
    <div className="min-h-screen bg-background celestial-background">
      <div className="container mx-auto py-4 sm:py-6 px-4 max-w-7xl">
        {/* Header with language toggle */}
        <div className="flex justify-between items-center mb-6">
          <div></div>
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            onClick={toggleLanguage} 
            className="rounded-full min-h-[40px]" 
            title={language === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
          >
            <Languages className="h-4 w-4 mr-2" />
            {language === 'hi' ? 'EN' : 'हिं'}
          </Button>
        </div>
        
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 gradient-heading">
            {language === 'hi' ? "कुंडली एक्सप्लोरर" : "Kundali Explorer"}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-4 max-w-4xl mx-auto">
            {language === 'hi' 
              ? "उच्च-सटीक गणनाओं के साथ अपनी जन्मपत्रिका में ब्रह्मांडीय प्रभावों को खोजें" 
              : "Explore cosmic influences with high-precision astronomical calculations using Swiss Ephemeris principles"}
          </p>
        </header>

        {!kundaliData ? (
          <div className="max-w-2xl mx-auto">
            <Card className="animate-fade-in">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl sm:text-2xl font-semibold text-center">
                  {language === 'hi' ? "अपना जन्म विवरण दर्ज करें" : "Enter Your Birth Details"}
                </CardTitle>
                <CardDescription className="text-center text-sm sm:text-base">
                  {language === 'hi' 
                    ? "सटीक कुंडली के लिए सही जानकारी प्रदान करें - स्विस एफेमेरिस सिद्धांतों का उपयोग" 
                    : "Provide accurate information for precise kundali using Swiss Ephemeris principles"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BirthDataForm onSubmit={handleGenerateKundali} />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="animate-fade-in space-y-4 sm:space-y-6">
            {/* Header Card */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl sm:text-2xl font-semibold text-center">
                  {language === 'hi' ? "उन्नत जन्म कुंडली" : "Enhanced Birth Chart"}
                </CardTitle>
                <CardDescription className="text-center text-sm sm:text-base">
                  {language === 'hi' 
                    ? "उच्च-सटीक खगोलीय गणनाओं के साथ वैदिक ज्योतिष अनुसार विश्लेषण" 
                    : "Vedic astrology analysis with high-precision astronomical calculations"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <h2 className="text-lg sm:text-xl font-medium">{kundaliData.birthData.fullName}</h2>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      {formatBirthDetails(kundaliData.birthData)}
                    </p>
                  </div>
                  
                  {/* Enhanced birth details summary */}
                  <div className="bg-card/30 border rounded-lg p-3 sm:p-4 my-4">
                    <h3 className="text-base sm:text-lg font-semibold mb-3">
                      {language === 'hi' ? "उन्नत जन्म विवरण सारांश" : "Enhanced Birth Details Summary"}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="font-medium">
                          {language === 'hi' ? "लग्न:" : "Ascendant:"}
                        </span>
                        {kundaliData.chart.ascendant && (
                          <Badge variant="outline" className="text-xs">
                            {kundaliData.chart.housesList.find((_, i) => i === 0) || "Unknown"} 
                            {language === 'hi' && ` (${kundaliData.chart.ascendantSanskrit})`}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="font-medium">
                          {language === 'hi' ? "चंद्र राशि:" : "Moon Sign:"}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {language === 'hi' 
                            ? kundaliData.chart.planets.find(p => p.id === "MO")?.signSanskrit 
                            : kundaliData.chart.planets.find(p => p.id === "MO")?.sign || "Unknown"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="font-medium">
                          {language === 'hi' ? "चंद्र नक्षत्र:" : "Moon Nakshatra:"}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {calculateMoonNakshatra(kundaliData.chart.planets.find(p => p.id === "MO")!)}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="font-medium">
                          {language === 'hi' ? "सूर्य राशि:" : "Sun Sign:"}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {language === 'hi' 
                            ? kundaliData.chart.planets.find(p => p.id === "SU")?.signSanskrit 
                            : kundaliData.chart.planets.find(p => p.id === "SU")?.sign || "Unknown"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="font-medium">
                          {language === 'hi' ? "जन्म तत्त्व:" : "Birth Element:"}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {kundaliData.chart.birthElement || "Unknown"}
                        </Badge>
                      </div>
                      {kundaliData.chart.yogas?.filter(y => y.present).length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 sm:col-span-2">
                          <span className="font-medium">
                            {language === 'hi' ? "प्रमुख योग:" : "Main Yogas:"}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {kundaliData.chart.yogas.filter(y => y.present).slice(0, 2).map(y => 
                              language === 'hi' ? y.sanskritName : y.name
                            ).join(", ")}
                            {kundaliData.chart.yogas.filter(y => y.present).length > 2 && "..."}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Detailed Analysis Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                    {getDetailedAnalysis()?.map((section, index) => (
                      <Card key={index} className="p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-primary">{section.icon}</div>
                          <h4 className="font-semibold text-sm sm:text-base">{section.title}</h4>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {section.content}
                        </p>
                      </Card>
                    ))}
                  </div>

                  {/* PDF Export Button */}
                  <div className="mt-4">
                    <KundaliPDFExport 
                      birthData={kundaliData.birthData}
                      chart={kundaliData.chart}
                      numerologyData={numerologyData}
                      language={language}
                    />
                  </div>
                </div>
            
                {/* Responsive Tabs */}
                <Tabs defaultValue="chart" className="w-full mt-6">
                  <div className="flex justify-center mb-4">
                    <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3' : 'grid-cols-7'} max-w-4xl`}>
                      <TabsTrigger value="visual" className="text-xs sm:text-sm">
                        {language === 'hi' ? "इंटरैक्टिव" : "Interactive"}
                      </TabsTrigger>
                      <TabsTrigger value="chart" className="text-xs sm:text-sm">
                        {language === 'hi' ? "चार्ट" : "Chart"}
                      </TabsTrigger>
                      <TabsTrigger value="planets" className="text-xs sm:text-sm">
                        {language === 'hi' ? "ग्रह" : "Planets"}
                      </TabsTrigger>
                      {!isMobile && (
                        <>
                          <TabsTrigger value="dashas" className="text-xs sm:text-sm">
                            {language === 'hi' ? "दशाएँ" : "Dashas"}
                          </TabsTrigger>
                          <TabsTrigger value="predictions" className="text-xs sm:text-sm">
                            {language === 'hi' ? "फलादेश" : "Predictions"}
                          </TabsTrigger>
                          <TabsTrigger value="numerology" className="text-xs sm:text-sm">
                            {language === 'hi' ? "अंकज्योतिष" : "Numerology"}
                          </TabsTrigger>
                          <TabsTrigger value="compatibility" className="text-xs sm:text-sm">
                            {language === 'hi' ? "संगतता" : "Compatibility"}
                          </TabsTrigger>
                        </>
                      )}
                    </TabsList>
                  </div>

                  {/* Mobile additional tabs */}
                  {isMobile && (
                    <div className="flex justify-center mb-4">
                      <TabsList className="grid w-full grid-cols-4 max-w-4xl">
                        <TabsTrigger value="dashas" className="text-xs">
                          {language === 'hi' ? "दशाएँ" : "Dashas"}
                        </TabsTrigger>
                        <TabsTrigger value="predictions" className="text-xs">
                          {language === 'hi' ? "फलादेश" : "Predictions"}
                        </TabsTrigger>
                        <TabsTrigger value="numerology" className="text-xs">
                          {language === 'hi' ? "अंकज्योतिष" : "Numerology"}
                        </TabsTrigger>
                        <TabsTrigger value="compatibility" className="text-xs">
                          {language === 'hi' ? "संगतता" : "Compatibility"}
                        </TabsTrigger>
                      </TabsList>
                    </div>
                  )}
                  
                  <TabsContent value="visual" className="mx-auto max-w-2xl">
                    <VisualKundaliChart chart={kundaliData.chart} language={language} />
                  </TabsContent>
                  
                  <TabsContent value="chart" className="mx-auto max-w-lg">
                    <KundaliChart chart={kundaliData.chart} language={language} />
                  </TabsContent>
                  
                  <TabsContent value="planets" className="mx-auto">
                    <PlanetaryPositions planets={kundaliData.chart.planets} language={language} />
                  </TabsContent>
                  
                  <TabsContent value="dashas" className="mx-auto">
                    <DashaDisplay 
                      moonPosition={kundaliData.chart.planets.find(p => p.id === "MO")!} 
                      birthDate={kundaliData.birthData.date}
                      language={language}
                    />
                  </TabsContent>
                  
                  <TabsContent value="predictions" className="mx-auto">
                    <DetailedPredictions 
                      chart={kundaliData.chart}
                      birthData={kundaliData.birthData}
                      language={language}
                    />
                  </TabsContent>
                  
                  <TabsContent value="numerology" className="mx-auto">
                    <NumerologyCalculator language={language} />
                  </TabsContent>
                  
                  <TabsContent value="compatibility" className="mx-auto">
                    <CompatibilityChecker 
                      language={language}
                      currentProfile={numerologyData}
                      currentName={kundaliData.birthData.fullName}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <div className="text-center mt-6">
              <Button 
                className="text-primary hover:underline" 
                onClick={() => setKundaliData(null)}
                variant="link"
                size={isMobile ? "sm" : "default"}
              >
                {language === 'hi' ? "दूसरी कुंडली बनाएँ" : "Generate Another Chart"}
              </Button>
            </div>
          </div>
        )}

        {/* Floating Chatbot */}
        <FloatingChatbot 
          kundaliData={kundaliData}
          numerologyData={numerologyData}
        />
        
        <footer className="mt-8 sm:mt-12 text-center text-xs sm:text-sm text-muted-foreground px-4">
          <p className="mb-2">
            {language === 'hi' 
              ? "नोट: यह एप्लिकेशन स्विस एफेमेरिस सिद्धांतों के आधार पर उच्च-सटीक वैदिक ज्योतिष गणनाएं प्रदान करती है।" 
              : "Note: This application provides high-precision Vedic astrological calculations based on Swiss Ephemeris principles."}
          </p>
          <p>
            {language === 'hi'
              ? "जन्मपत्रिका की सटीक व्याख्या के लिए अनुभवी ज्योतिषी से परामर्श करें।"
              : "Consult an experienced astrologer for accurate interpretation of your birth chart."}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
