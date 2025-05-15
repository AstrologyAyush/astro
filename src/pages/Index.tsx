import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BirthData, generateKundaliChart, formatBirthDetails, KundaliChart as KundaliChartType, calculateMoonNakshatra } from '@/lib/kundaliUtils';
import BirthDataForm from '@/components/BirthDataForm';
import KundaliChart from '@/components/KundaliChart';
import PlanetaryPositions from '@/components/PlanetaryPositions';
import DashaDisplay from '@/components/DashaDisplay';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [kundaliData, setKundaliData] = useState<{
    birthData: BirthData & { fullName: string };
    chart: KundaliChartType;
  } | null>(null);
  const { toast } = useToast();

  const handleGenerateKundali = (birthData: BirthData & { fullName: string }) => {
    try {
      // Generate the kundali chart
      const chart = generateKundaliChart(birthData);
      
      setKundaliData({
        birthData,
        chart
      });

      toast({
        title: "कुंडली बन गई है",
        description: "आपकी जन्मपत्रिका सफलतापूर्वक बनाई गई है।",
      });
    } catch (error) {
      toast({
        title: "त्रुटि",
        description: "आपकी कुंडली बनाने में त्रुटि हुई है।",
        variant: "destructive",
      });
      console.error("Error generating kundali:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background celestial-background">
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 gradient-heading">कुंडली एक्सप्लोरर</h1>
          <p className="text-md md:text-lg text-muted-foreground">
            अपनी जन्मपत्रिका में ब्रह्मांडीय प्रभावों को खोजें
          </p>
        </header>

        {!kundaliData ? (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center">अपना जन्म विवरण दर्ज करें</CardTitle>
              <CardDescription className="text-center">सटीक कुंडली के लिए सही जानकारी प्रदान करें</CardDescription>
            </CardHeader>
            <CardContent>
              <BirthDataForm onSubmit={handleGenerateKundali} />
            </CardContent>
          </Card>
        ) : (
          <div className="animate-fade-in space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-center">जन्म कुंडली</CardTitle>
                <CardDescription className="text-center">
                  वैदिक ज्योतिष अनुसार आपकी कुंडली का विश्लेषण
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
                  
                  {/* Birth details summary */}
                  <div className="bg-card/30 border rounded-lg p-4 my-4">
                    <h3 className="text-lg font-semibold mb-2">जन्म विवरण सारांश</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium">लग्न (Ascendant):</span>{" "}
                        {kundaliData.chart.ascendant && (
                          <Badge variant="outline" className="ml-1">
                            {kundaliData.chart.housesList.find((_, i) => i === 0) || "Unknown"} ({kundaliData.chart.ascendantSanskrit})
                          </Badge>
                        )}
                      </div>
                      <div>
                        <span className="font-medium">चंद्र राशि (Moon Sign):</span>{" "}
                        <Badge variant="outline" className="ml-1">
                          {kundaliData.chart.planets.find(p => p.id === "MO")?.signSanskrit || "Unknown"}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">चंद्र नक्षत्र (Nakshatra):</span>{" "}
                        <Badge variant="outline" className="ml-1">
                          {calculateMoonNakshatra(kundaliData.chart.planets.find(p => p.id === "MO")!)}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">सूर्य राशि (Sun Sign):</span>{" "}
                        <Badge variant="outline" className="ml-1">
                          {kundaliData.chart.planets.find(p => p.id === "SU")?.signSanskrit || "Unknown"}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">जन्म तत्त्व (Birth Element):</span>{" "}
                        <Badge variant="outline" className="ml-1">
                          {kundaliData.chart.birthElement || "Unknown"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
            
                <Tabs defaultValue="chart" className="w-full">
                  <div className="flex justify-center mb-4 overflow-x-auto">
                    <TabsList>
                      <TabsTrigger value="chart">कुंडली चार्ट</TabsTrigger>
                      <TabsTrigger value="planets">ग्रह स्थिति</TabsTrigger>
                      <TabsTrigger value="dashas">दशाएँ</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="chart" className="mx-auto max-w-lg">
                    <KundaliChart chart={kundaliData.chart} />
                  </TabsContent>
                  
                  <TabsContent value="planets" className="mx-auto">
                    <PlanetaryPositions planets={kundaliData.chart.planets} />
                  </TabsContent>
                  
                  <TabsContent value="dashas" className="mx-auto">
                    <DashaDisplay 
                      moonPosition={kundaliData.chart.planets.find(p => p.id === "MO")!} 
                      birthDate={kundaliData.birthData.date} 
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
                दूसरी कुंडली बनाएँ
              </Button>
            </div>
          </div>
        )}
        
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>नोट: यह एप्लिकेशन शैक्षिक उद्देश्यों के लिए वैदिक ज्योतिष गणनाओं का एक सरलीकृत संस्करण प्रदान करती है।</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
