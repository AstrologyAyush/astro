
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

const Index = () => {
  const [kundaliData, setKundaliData] = useState<{
    birthData: BirthData & { fullName: string };
    chart: KundaliChartType;
  } | null>(null);
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');
  const { toast } = useToast();

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
        title: language === 'hi' ? "उन्नत कुंडली बन गई है" : "Enhanced Kundali has been generated",
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

  return (
    <div className="min-h-screen bg-background celestial-background">
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <div className="flex justify-end mb-4">
          <Button variant="outline" size="icon" onClick={toggleLanguage} className="rounded-full" title={language === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}>
            <Languages className="h-4 w-4" />
          </Button>
        </div>
        
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 gradient-heading">
            {language === 'hi' ? "कुंडली एक्सप्लोरर" : "Kundali Explorer"}
          </h1>
          <p className="text-md md:text-lg text-muted-foreground">
            {language === 'hi' 
              ? "उच्च-सटीक गणनाओं के साथ अपनी जन्मपत्रिका में ब्रह्मांडीय प्रभावों को खोजें" 
              : "Explore cosmic influences with high-precision astronomical calculations"}
          </p>
        </header>

        {!kundaliData ? (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center">
                {language === 'hi' ? "अपना जन्म विवरण दर्ज करें" : "Enter your birth details"}
              </CardTitle>
              <CardDescription className="text-center">
                {language === 'hi' 
                  ? "सटीक कुंडली के लिए सही जानकारी प्रदान करें - स्विस एफेमेरिस सिद्धांतों का उपयोग" 
                  : "Provide accurate information for precise kundali using Swiss Ephemeris principles"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BirthDataForm onSubmit={handleGenerateKundali} />
            </CardContent>
          </Card>
        ) : (
          <div className="animate-fade-in space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-center">
                  {language === 'hi' ? "उन्नत जन्म कुंडली" : "Enhanced Birth Chart"}
                </CardTitle>
                <CardDescription className="text-center">
                  {language === 'hi' 
                    ? "उच्च-सटीक खगोलीय गणनाओं के साथ वैदिक ज्योतिष अनुसार विश्लेषण" 
                    : "Vedic astrology analysis with high-precision astronomical calculations"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <h2 className="text-xl font-medium">{kundaliData.birthData.fullName}</h2>
                    <p className="text-muted-foreground">
                      {formatBirthDetails(kundaliData.birthData)}
                    </p>
                  </div>
                  
                  {/* Enhanced birth details summary */}
                  <div className="bg-card/30 border rounded-lg p-4 my-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {language === 'hi' ? "उन्नत जन्म विवरण सारांश" : "Enhanced Birth Details Summary"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium">
                          {language === 'hi' ? "लग्न (Ascendant):" : "Ascendant:"}
                        </span>{" "}
                        {kundaliData.chart.ascendant && (
                          <Badge variant="outline" className="ml-1">
                            {kundaliData.chart.housesList.find((_, i) => i === 0) || "Unknown"} 
                            ({language === 'hi' ? kundaliData.chart.ascendantSanskrit : ''})
                          </Badge>
                        )}
                      </div>
                      <div>
                        <span className="font-medium">
                          {language === 'hi' ? "चंद्र राशि (Moon Sign):" : "Moon Sign:"}
                        </span>{" "}
                        <Badge variant="outline" className="ml-1">
                          {language === 'hi' 
                            ? kundaliData.chart.planets.find(p => p.id === "MO")?.signSanskrit 
                            : kundaliData.chart.planets.find(p => p.id === "MO")?.sign || "Unknown"}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">
                          {language === 'hi' ? "चंद्र नक्षत्र (Nakshatra):" : "Moon Nakshatra:"}
                        </span>{" "}
                        <Badge variant="outline" className="ml-1">
                          {calculateMoonNakshatra(kundaliData.chart.planets.find(p => p.id === "MO")!)}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">
                          {language === 'hi' ? "सूर्य राशि (Sun Sign):" : "Sun Sign:"}
                        </span>{" "}
                        <Badge variant="outline" className="ml-1">
                          {language === 'hi' 
                            ? kundaliData.chart.planets.find(p => p.id === "SU")?.signSanskrit 
                            : kundaliData.chart.planets.find(p => p.id === "SU")?.sign || "Unknown"}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">
                          {language === 'hi' ? "जन्म तत्त्व (Birth Element):" : "Birth Element:"}
                        </span>{" "}
                        <Badge variant="outline" className="ml-1">
                          {kundaliData.chart.birthElement || "Unknown"}
                        </Badge>
                      </div>
                      {kundaliData.chart.yogas?.filter(y => y.present).length > 0 && (
                        <div>
                          <span className="font-medium">
                            {language === 'hi' ? "प्रमुख योग:" : "Main Yogas:"}
                          </span>{" "}
                          <Badge variant="outline" className="ml-1">
                            {kundaliData.chart.yogas.filter(y => y.present).map(y => 
                              language === 'hi' ? y.sanskritName : y.name
                            ).join(", ")}
                          </Badge>
                        </div>
                      )}
                    </div>
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
            
                <Tabs defaultValue="chart" className="w-full">
                  <div className="flex justify-center mb-4 overflow-x-auto">
                    <TabsList>
                      <TabsTrigger value="visual">
                        {language === 'hi' ? "इंटरैक्टिव चार्ट" : "Interactive Chart"}
                      </TabsTrigger>
                      <TabsTrigger value="chart">
                        {language === 'hi' ? "कुंडली चार्ट" : "Chart"}
                      </TabsTrigger>
                      <TabsTrigger value="planets">
                        {language === 'hi' ? "ग्रह स्थिति" : "Planets"}
                      </TabsTrigger>
                      <TabsTrigger value="dashas">
                        {language === 'hi' ? "दशाएँ" : "Dashas"}
                      </TabsTrigger>
                      <TabsTrigger value="predictions">
                        {language === 'hi' ? "विस्तृत फलादेश" : "Predictions"}
                      </TabsTrigger>
                      <TabsTrigger value="numerology">
                        {language === 'hi' ? "न्यूमेरोलॉजी" : "Numerology"}
                      </TabsTrigger>
                      <TabsTrigger value="compatibility">
                        {language === 'hi' ? "संगतता जांच" : "Compatibility"}
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="visual" className="mx-auto max-w-xl">
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
              >
                {language === 'hi' ? "दूसरी कुंडली बनाएँ" : "Generate another chart"}
              </Button>
            </div>
          </div>
        )}

        {/* Floating Chatbot */}
        <FloatingChatbot 
          kundaliData={kundaliData}
          numerologyData={numerologyData}
        />
        
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            {language === 'hi' 
              ? "नोट: यह एप्लिकेशन स्विस एफेमेरिस सिद्धांतों के आधार पर उच्च-सटीक वैदिक ज्योतिष गणनाएं प्रदान करती है।" 
              : "Note: This application provides high-precision Vedic astrological calculations based on Swiss Ephemeris principles."}
          </p>
          <p className="mt-1">
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
