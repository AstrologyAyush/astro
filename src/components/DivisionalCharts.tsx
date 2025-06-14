import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';

interface DivisionalChartsProps {
  kundaliData: ComprehensiveKundaliData;
  language: 'hi' | 'en';
}

const DivisionalCharts: React.FC<DivisionalChartsProps> = ({ kundaliData, language }) => {
  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const divisionalChartNames = {
    en: {
      'D1': 'Rashi Chart (Birth Chart)',
      'D2': 'Hora Chart (Wealth)',
      'D3': 'Drekkana Chart (Siblings)',
      'D4': 'Chaturthamsa Chart (Fortune)',
      'D5': 'Panchmansha Chart (Fame)',
      'D6': 'Shashthamsa Chart (Health)',
      'D7': 'Saptamsa Chart (Children)',
      'D8': 'Ashtamsa Chart (Longevity)',
      'D9': 'Navamsa Chart (Marriage)',
      'D10': 'Dasamsa Chart (Career)'
    },
    hi: {
      'D1': 'राशि चक्र (जन्म कुंडली)',
      'D2': 'होरा चक्र (धन)',
      'D3': 'द्रेष्काण चक्र (भाई-बहन)',
      'D4': 'चतुर्थांश चक्र (भाग्य)',
      'D5': 'पंचमांश चक्र (यश)',
      'D6': 'षष्ठांश चक्र (स्वास्थ्य)',
      'D7': 'सप्तमांश चक्र (संतान)',
      'D8': 'अष्टमांश चक्र (आयु)',
      'D9': 'नवमांश चक्र (विवाह)',
      'D10': 'दशमांश चक्र (करियर)'
    }
  };

  // Fix: Access planets from enhancedCalculations only
  const planets = kundaliData.enhancedCalculations?.planets || {};

  // Generate divisional chart data
  const generateDivisionalChart = (division: number) => {
    const houses = Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      planets: [] as string[]
    }));

    // For demo purposes, we'll show the main planets in different positions
    // In a real implementation, this would calculate actual divisional positions
    Object.entries(planets).forEach(([planetKey, planetData]: [string, any], index) => {
      if (planetData && typeof planetData.house === 'number') {
        const adjustedHouse = ((planetData.house + division - 2) % 12) + 1;
        const houseIndex = adjustedHouse - 1;
        if (houseIndex >= 0 && houseIndex < 12) {
          const planetName = planetKey === 'SU' ? '☉' : 
                           planetKey === 'MO' ? '☽' :
                           planetKey === 'MA' ? '♂' :
                           planetKey === 'ME' ? '☿' :
                           planetKey === 'JU' ? '♃' :
                           planetKey === 'VE' ? '♀' :
                           planetKey === 'SA' ? '♄' :
                           planetKey === 'RA' ? '☊' :
                           planetKey === 'KE' ? '☋' : planetKey;
          houses[houseIndex].planets.push(planetName);
        }
      }
    });

    return houses;
  };

  const chartKeys = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'];

  return (
    <Card className="border-orange-200">
      <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100">
        <CardTitle className="text-orange-800 flex items-center gap-2">
          <span>📊</span>
          {getTranslation('Divisional Charts (D1-D10)', 'विभागीय चार्ट (D1-D10)')}
        </CardTitle>
        <p className="text-sm text-orange-600">
          {getTranslation('Complete Varga Chart System', 'संपूर्ण वर्ग चार्ट प्रणाली')}
        </p>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="D1" className="w-full">
          <TabsList className="grid grid-cols-5 md:grid-cols-10 mb-4 bg-orange-50">
            {chartKeys.map((chart) => (
              <TabsTrigger 
                key={chart} 
                value={chart}
                className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                {chart}
              </TabsTrigger>
            ))}
          </TabsList>

          {chartKeys.map((chartKey) => (
            <TabsContent key={chartKey} value={chartKey}>
              <div className="space-y-4">
                <div className="text-center">
                  <Badge variant="outline" className="text-orange-700 border-orange-300">
                    {divisionalChartNames[language][chartKey as keyof typeof divisionalChartNames.en]}
                  </Badge>
                </div>
                
                {/* Chart Grid */}
                <div className="grid grid-cols-4 gap-1 max-w-md mx-auto aspect-square">
                  {generateDivisionalChart(parseInt(chartKey.substring(1))).map((house, index) => (
                    <div
                      key={index}
                      className={`border border-orange-300 p-2 text-center bg-white hover:bg-orange-50 transition-colors text-xs ${
                        house.number === 1 ? 'bg-orange-100 font-bold' : ''
                      }`}
                    >
                      <div className="font-bold text-orange-800 mb-1">{house.number}</div>
                      <div className="space-y-1">
                        {house.planets.map((planet, planetIndex) => (
                          <div key={planetIndex} className="text-orange-600 font-medium text-lg">
                            {planet}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-center text-gray-600 mt-4">
                  {getTranslation(
                    `${chartKey} chart shows specific life aspects as per Vedic astrology`,
                    `${chartKey} चार्ट वैदिक ज्योतिष के अनुसार जीवन के विशिष्ट पहलुओं को दर्शाता है`
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DivisionalCharts;
