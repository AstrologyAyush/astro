import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BirthData, generateKundaliChart, formatBirthDetails, KundaliChart as KundaliChartType } from '@/lib/kundaliUtils';
import BirthDataForm from '@/components/BirthDataForm';
import KundaliChart from '@/components/KundaliChart';
import PlanetaryPositions from '@/components/PlanetaryPositions';
import DashaDisplay from '@/components/DashaDisplay';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [kundaliData, setKundaliData] = useState<{
    birthData: BirthData;
    chart: KundaliChartType;
  } | null>(null);
  const { toast } = useToast();

  const handleGenerateKundali = (birthData: BirthData) => {
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
      <div className="container mx-auto py-8 px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 gradient-heading">Kundali Explorer</h1>
          <p className="text-lg text-muted-foreground">
            Discover the cosmic influences in your birth chart
          </p>
        </header>

        {!kundaliData ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-lg shadow-lg p-6 animate-fade-in">
              <h2 className="text-2xl font-semibold mb-4">Enter Your Birth Details</h2>
              <BirthDataForm onSubmit={handleGenerateKundali} />
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold">Birth Chart</h2>
              <p className="text-muted-foreground">
                {formatBirthDetails(kundaliData.birthData)}
              </p>
            </div>
            
            <Tabs defaultValue="chart" className="w-full">
              <div className="flex justify-center mb-4">
                <TabsList>
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                  <TabsTrigger value="planets">Planets</TabsTrigger>
                  <TabsTrigger value="dashas">Dashas</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="chart" className="mx-auto max-w-lg">
                <KundaliChart chart={kundaliData.chart} />
              </TabsContent>
              
              <TabsContent value="planets" className="mx-auto max-w-3xl">
                <PlanetaryPositions planets={kundaliData.chart.planets} />
              </TabsContent>
              
              <TabsContent value="dashas" className="mx-auto max-w-md">
                <DashaDisplay 
                  moonPosition={kundaliData.chart.planets.find(p => p.id === "MO")!} 
                  birthDate={kundaliData.birthData.date} 
                />
              </TabsContent>
            </Tabs>
            
            <div className="text-center mt-8">
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
