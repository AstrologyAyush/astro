
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Activity, TrendingUp, Target, BarChart3, Sparkles, Heart } from "lucide-react";
import VisualKundaliChart from './VisualKundaliChart';
import InteractiveKundaliChart from './InteractiveKundaliChart';
import PlanetaryStrengthChart from './PlanetaryStrengthChart';
import AIRemedySuggestions from './AIRemedySuggestions';
import AdvancedNumerologyCompatibility from './AdvancedNumerologyCompatibility';

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
      isRetrograde: planet.isRetrograde || false,
      shadbala: planet.totalStrength || planet.shadbala || 0
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
    <div className="space-y-4 sm:space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Mobile-optimized TabsList with scrollable horizontal layout */}
        <div className="relative mb-4 sm:mb-6">
          <TabsList className="w-full h-auto p-1 sm:p-2 bg-white/90 backdrop-blur-sm border-2 border-orange-100 rounded-xl shadow-lg overflow-x-auto overflow-y-hidden scrollbar-hide">
            <div className="flex space-x-1 sm:space-x-2 min-w-max sm:min-w-0 sm:grid sm:grid-cols-5 sm:gap-1">
              <TabsTrigger 
                value="interactive" 
                className="flex flex-col items-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-3 sm:py-4 min-h-[60px] sm:min-h-[70px] min-w-[80px] sm:min-w-0 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-200 hover:shadow-md whitespace-nowrap"
              >
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="text-center leading-tight font-medium">
                  {getTranslation('Interactive', 'इंटरैक्टिव')}
                </span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="traditional" 
                className="flex flex-col items-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-3 sm:py-4 min-h-[60px] sm:min-h-[70px] min-w-[80px] sm:min-w-0 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-200 hover:shadow-md whitespace-nowrap"
              >
                <Star className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="text-center leading-tight font-medium">
                  {getTranslation('Traditional', 'पारंपरिक')}
                </span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="strength" 
                className="flex flex-col items-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-3 sm:py-4 min-h-[60px] sm:min-h-[70px] min-w-[80px] sm:min-w-0 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-200 hover:shadow-md whitespace-nowrap"
              >
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="text-center leading-tight font-medium">
                  {getTranslation('Strength', 'शक्ति')}
                </span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="remedies" 
                className="flex flex-col items-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-3 sm:py-4 min-h-[60px] sm:min-h-[70px] min-w-[80px] sm:min-w-0 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-200 hover:shadow-md whitespace-nowrap"
              >
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="text-center leading-tight font-medium">
                  {getTranslation('Remedies', 'उपाय')}
                </span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="compatibility" 
                className="flex flex-col items-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-3 sm:py-4 min-h-[60px] sm:min-h-[70px] min-w-[80px] sm:min-w-0 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-200 hover:shadow-md whitespace-nowrap"
              >
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="text-center leading-tight font-medium">
                  {getTranslation('Match', 'मैच')}
                </span>
              </TabsTrigger>
            </div>
          </TabsList>
          
          {/* Mobile scroll indicator */}
          <div className="sm:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none rounded-r-xl"></div>
        </div>

        {/* Tab Content with mobile-optimized spacing */}
        <TabsContent value="interactive" className="mt-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-4">
            <InteractiveKundaliChart 
              planets={planets}
              ascendant={ascendant}
              language={language}
            />
          </div>
        </TabsContent>

        <TabsContent value="traditional" className="mt-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-4">
            <VisualKundaliChart 
              chart={createKundaliChart(planets, ascendant)}
              language={language}
            />
          </div>
        </TabsContent>

        <TabsContent value="strength" className="mt-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-4">
            <PlanetaryStrengthChart 
              planets={planets}
            />
          </div>
        </TabsContent>

        <TabsContent value="remedies" className="mt-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-4">
            <AIRemedySuggestions 
              kundaliData={kundaliData}
              language={language}
            />
          </div>
        </TabsContent>

        <TabsContent value="compatibility" className="mt-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-4">
            <AdvancedNumerologyCompatibility 
              language={language}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Mobile-optimized Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex-shrink-0">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  {getTranslation('Total Planets', 'कुल ग्रह')}
                </p>
                <p className="text-lg sm:text-xl font-bold text-blue-800 dark:text-blue-300">{planets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-800/50 rounded-lg flex-shrink-0">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  {getTranslation('Exalted', 'उच्च')}
                </p>
                <p className="text-lg sm:text-xl font-bold text-green-800 dark:text-green-300">
                  {planets.filter(p => p.isExalted).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 sm:col-span-1 col-span-1">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-purple-100 dark:bg-purple-800/50 rounded-lg flex-shrink-0">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  {getTranslation('Ascendant', 'लग्न')}
                </p>
                <p className="text-lg sm:text-xl font-bold text-purple-800 dark:text-purple-300">{ascendant}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InteractiveDashboard;
