import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Activity, TrendingUp, Target, BarChart3 } from "lucide-react";
import VisualKundaliChart from './VisualKundaliChart';
import InteractiveKundaliChart from './InteractiveKundaliChart';
import EnhancedPlanetaryStrengthChart from './EnhancedPlanetaryStrengthChart';

interface InteractiveDashboardProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const InteractiveDashboard: React.FC<InteractiveDashboardProps> = ({ 
  kundaliData, 
  language 
}) => {
  const [activeTab, setActiveTab] = useState('interactive');

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  // Extract planets data
  const extractPlanetsData = () => {
    if (!kundaliData?.enhancedCalculations?.planets) {
      return [];
    }

    return Object.values(kundaliData.enhancedCalculations.planets).map((planet: any) => ({
      id: planet.id || planet.name?.substring(0, 2).toUpperCase(),
      name: planet.name,
      house: planet.house || 1,
      rashi: planet.rashi || 1,
      degree: planet.degree || 0,
      degreeInSign: planet.degreeInSign || 0,
      rashiName: planet.rashiName || '',
      nakshatraName: planet.nakshatraName || '',
      nakshatraPada: planet.nakshatraPada || 1,
      isExalted: planet.isExalted || false,
      isDebilitated: planet.isDebilitated || false,
      ownSign: planet.ownSign || false,
      isRetrograde: planet.isRetrograde || false
    }));
  };

  // Convert planets array to object format for VisualKundaliChart
  const convertPlanetsToObject = (planetsArray: any[]) => {
    const planetsObject: Record<string, any> = {};
    planetsArray.forEach(planet => {
      planetsObject[planet.id] = planet;
    });
    return planetsObject;
  };

  // Create complete KundaliChart object for VisualKundaliChart
  const createKundaliChart = (planetsArray: any[], ascendantValue: number) => {
    return {
      planets: convertPlanetsToObject(planetsArray),
      ascendant: ascendantValue,
      ascendantSanskrit: kundaliData?.enhancedCalculations?.ascendantSanskrit || 'मेष',
      houses: kundaliData?.enhancedCalculations?.houses || Array.from({ length: 12 }, (_, i) => i + 1),
      housesList: kundaliData?.enhancedCalculations?.housesList || Array.from({ length: 12 }, (_, i) => i + 1),
      moonSign: kundaliData?.enhancedCalculations?.moonSign || 1,
      sunSign: kundaliData?.enhancedCalculations?.sunSign || 1,
      nakshatraName: kundaliData?.enhancedCalculations?.nakshatraName || 'Ashwini',
      yogas: kundaliData?.enhancedCalculations?.yogas || [],
      dashas: kundaliData?.enhancedCalculations?.dashas || [],
      dashaPeriods: kundaliData?.enhancedCalculations?.dashaPeriods || []
    };
  };

  const planets = extractPlanetsData();
  const ascendant = kundaliData?.enhancedCalculations?.ascendant || 1;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="interactive" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {getTranslation('Interactive Chart', 'इंटरैक्टिव चार्ट')}
          </TabsTrigger>
          <TabsTrigger value="traditional" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            {getTranslation('Traditional View', 'पारंपरिक दृश्य')}
          </TabsTrigger>
          <TabsTrigger value="strength" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {getTranslation('Planetary Strength', 'ग्रह शक्ति')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="interactive" className="mt-6">
          <InteractiveKundaliChart 
            planets={planets}
            ascendant={ascendant}
            language={language}
          />
        </TabsContent>

        <TabsContent value="traditional" className="mt-6">
          <VisualKundaliChart 
            chart={createKundaliChart(planets, ascendant)}
            language={language}
          />
        </TabsContent>

        <TabsContent value="strength" className="mt-6">
          <EnhancedPlanetaryStrengthChart 
            planets={planets}
            language={language}
          />
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
                <Star className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {getTranslation('Total Planets', 'कुल ग्रह')}
                </p>
                <p className="text-xl font-bold text-blue-800 dark:text-blue-300">{planets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-800/50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {getTranslation('Exalted Planets', 'उच्च ग्रह')}
                </p>
                <p className="text-xl font-bold text-green-800 dark:text-green-300">
                  {planets.filter(p => p.isExalted).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-800/50 rounded-lg">
                <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {getTranslation('Ascendant', 'लग्न')}
                </p>
                <p className="text-xl font-bold text-purple-800 dark:text-purple-300">{ascendant}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InteractiveDashboard;
