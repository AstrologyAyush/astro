
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BirthData, generateKundaliChart, formatBirthDetails, KundaliChart as KundaliChartType, calculateMoonNakshatra } from '@/lib/kundaliUtils';
import BirthDataForm from '@/components/BirthDataForm';
import KundaliChart from '@/components/KundaliChart';
import PlanetaryPositions from '@/components/PlanetaryPositions';
import DashaDisplay from '@/components/DashaDisplay';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        title: "Kundali Generated",
        description: "Your birth chart has been successfully created.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error generating your kundali chart.",
        variant: "destructive",
      });
      console.error("Error generating kundali:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background celestial-background">
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 gradient-heading">Kundali Explorer</h1>
          <p className="text-md md:text-lg text-muted-foreground">
            Discover the cosmic influences in your birth chart
          </p>
        </header>

        {!kundaliData ? (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center">Enter Your Birth Details</CardTitle>
            </CardHeader>
            <CardContent>
              <BirthDataForm onSubmit={handleGenerateKundali} />
            </CardContent>
          </Card>
        ) : (
          <div className="animate-fade-in space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-center">Birth Chart</CardTitle>
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
                    <h3 className="text-lg font-semibold mb-2">Birth Details Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium">Ascendant (Lagna):</span>{" "}
                        {kundaliData.chart.ascendant && kundaliData.chart.ascendant} 
                      </div>
                      <div>
                        <span className="font-medium">Moon Sign:</span>{" "}
                        {kundaliData.chart.planets.find(p => p.id === "MO")?.sign || "Unknown"}
                      </div>
                      <div>
                        <span className="font-medium">Moon Nakshatra:</span>{" "}
                        {calculateMoonNakshatra(kundaliData.chart.planets.find(p => p.id === "MO")!)}
                      </div>
                      <div>
                        <span className="font-medium">Sun Sign:</span>{" "}
                        {kundaliData.chart.planets.find(p => p.id === "SU")?.sign || "Unknown"}
                      </div>
                    </div>
                  </div>
                </div>
            
                <Tabs defaultValue="chart" className="w-full">
                  <div className="flex justify-center mb-4 overflow-x-auto">
                    <TabsList>
                      <TabsTrigger value="chart">Chart</TabsTrigger>
                      <TabsTrigger value="planets">Planets</TabsTrigger>
                      <TabsTrigger value="dashas">Dashas</TabsTrigger>
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
              <button 
                className="text-primary hover:underline" 
                onClick={() => setKundaliData(null)}
              >
                Generate Another Chart
              </button>
            </div>
          </div>
        )}
        
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Note: This application provides a simplified version of Vedic astrology calculations for educational purposes.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
