
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, Star, Crown } from "lucide-react";
import { ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';

interface DivisionalChartsProps {
  kundaliData: ComprehensiveKundaliData;
  language: 'hi' | 'en';
}

const DivisionalCharts: React.FC<DivisionalChartsProps> = ({ kundaliData, language }) => {
  const [selectedChart, setSelectedChart] = useState('D1');
  const [showInfo, setShowInfo] = useState(false);

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const divisionalChartInfo = {
    en: {
      'D1': {
        name: 'Rashi Chart (Birth Chart)',
        purpose: 'Overall personality, basic nature, and general life path',
        significance: 'Foundation chart showing your core essence and life direction'
      },
      'D2': {
        name: 'Hora Chart (Wealth)',
        purpose: 'Financial prosperity, earning capacity, and wealth accumulation',
        significance: 'Shows your relationship with money and material resources'
      },
      'D3': {
        name: 'Drekkana Chart (Siblings)',
        purpose: 'Relationships with siblings, courage, and short journeys',
        significance: 'Reveals dynamics with brothers/sisters and personal bravery'
      },
      'D4': {
        name: 'Chaturthamsa Chart (Fortune)',
        purpose: 'Property, real estate, vehicles, and fixed assets',
        significance: 'Indicates material possessions and family property'
      },
      'D5': {
        name: 'Panchmansha Chart (Fame)',
        purpose: 'Intelligence, creativity, children, and recognition',
        significance: 'Shows intellectual abilities and creative potential'
      },
      'D6': {
        name: 'Shashthamsa Chart (Health)',
        purpose: 'Health issues, diseases, enemies, and daily work',
        significance: 'Reveals health patterns and work environment'
      },
      'D7': {
        name: 'Saptamsa Chart (Children)',
        purpose: 'Progeny, fertility, and relationship with children',
        significance: 'Shows prospects of having children and their nature'
      },
      'D8': {
        name: 'Ashtamsa Chart (Longevity)',
        purpose: 'Lifespan, accidents, sudden events, and transformations',
        significance: 'Indicates life duration and major life changes'
      },
      'D9': {
        name: 'Navamsa Chart (Marriage)',
        purpose: 'Marriage, spouse, spiritual growth, and dharma',
        significance: 'Most important divisional chart for marriage and spirituality'
      },
      'D10': {
        name: 'Dasamsa Chart (Career)',
        purpose: 'Profession, career success, and social status',
        significance: 'Shows career path and professional achievements'
      }
    },
    hi: {
      'D1': {
        name: 'राशि चक्र (जन्म कुंडली)',
        purpose: 'समग्र व्यक्तित्व, मूल प्रकृति और सामान्य जीवन पथ',
        significance: 'आपके मूल सार और जीवन दिशा को दर्शाने वाला आधार चार्ट'
      },
      'D2': {
        name: 'होरा चक्र (धन)',
        purpose: 'वित्तीय समृद्धि, कमाई की क्षमता और धन संचय',
        significance: 'पैसे और भौतिक संसाधनों के साथ आपका संबंध दिखाता है'
      },
      'D3': {
        name: 'द्रेष्काण चक्र (भाई-बहन)',
        purpose: 'भाई-बहनों के साथ संबंध, साहस और छोटी यात्राएं',
        significance: 'भाई-बहनों के साथ गतिशीलता और व्यक्तिगत वीरता प्रकट करता है'
      },
      'D4': {
        name: 'चतुर्थांश चक्र (भाग्य)',
        purpose: 'संपत्ति, अचल संपत्ति, वाहन और स्थिर संपत्ति',
        significance: 'भौतिक संपत्ति और पारिवारिक संपत्ति का संकेत देता है'
      },
      'D5': {
        name: 'पंचमांश चक्र (यश)',
        purpose: 'बुद्धि, रचनात्मकता, संतान और पहचान',
        significance: 'बौद्धिक क्षमताओं और रचनात्मक क्षमता को दिखाता है'
      },
      'D6': {
        name: 'षष्ठांश चक्र (स्वास्थ्य)',
        purpose: 'स्वास्थ्य समस्याएं, रोग, शत्रु और दैनिक कार्य',
        significance: 'स्वास्थ्य पैटर्न और कार्य वातावरण को प्रकट करता है'
      },
      'D7': {
        name: 'सप्तमांश चक्र (संतान)',
        purpose: 'संतति, प्रजनन क्षमता और बच्चों के साथ संबंध',
        significance: 'बच्चे होने की संभावना और उनकी प्रकृति दिखाता है'
      },
      'D8': {
        name: 'अष्टमांश चक्र (आयु)',
        purpose: 'जीवनकाल, दुर्घटनाएं, अचानक घटनाएं और परिवर्तन',
        significance: 'जीवन की अवधि और प्रमुख जीवन परिवर्तनों का संकेत देता है'
      },
      'D9': {
        name: 'नवमांश चक्र (विवाह)',
        purpose: 'विवाह, जीवनसाथी, आध्यात्मिक विकास और धर्म',
        significance: 'विवाह और आध्यात्मिकता के लिए सबसे महत्वपूर्ण विभागीय चार्ट'
      },
      'D10': {
        name: 'दशमांश चक्र (करियर)',
        purpose: 'पेशा, करियर सफलता और सामाजिक स्थिति',
        significance: 'करियर पथ और व्यावसायिक उपलब्धियों को दिखाता है'
      }
    }
  };

  const planetSymbols = {
    'SU': { symbol: '☉', name: language === 'hi' ? 'सूर्य' : 'Sun', color: 'text-yellow-600' },
    'MO': { symbol: '☽', name: language === 'hi' ? 'चंद्र' : 'Moon', color: 'text-blue-400' },
    'MA': { symbol: '♂', name: language === 'hi' ? 'मंगल' : 'Mars', color: 'text-red-500' },
    'ME': { symbol: '☿', name: language === 'hi' ? 'बुध' : 'Mercury', color: 'text-green-500' },
    'JU': { symbol: '♃', name: language === 'hi' ? 'गुरु' : 'Jupiter', color: 'text-orange-500' },
    'VE': { symbol: '♀', name: language === 'hi' ? 'शुक्र' : 'Venus', color: 'text-pink-500' },
    'SA': { symbol: '♄', name: language === 'hi' ? 'शनि' : 'Saturn', color: 'text-gray-600' },
    'RA': { symbol: '☊', name: language === 'hi' ? 'राहु' : 'Rahu', color: 'text-purple-600' },
    'KE': { symbol: '☋', name: language === 'hi' ? 'केतु' : 'Ketu', color: 'text-indigo-600' }
  };

  const rashiNames = {
    en: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
    hi: ['मेष', 'वृष', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन']
  };

  // Access planets from enhancedCalculations only
  const planets = kundaliData.enhancedCalculations?.planets || {};

  // Generate more realistic divisional chart data
  const generateDivisionalChart = (division: number) => {
    const houses = Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      rashi: rashiNames[language][i],
      planets: [] as { key: string; symbol: string; name: string; color: string; degree: number }[]
    }));

    // Calculate divisional positions based on actual Vedic astrology rules
    Object.entries(planets).forEach(([planetKey, planetData]: [string, any]) => {
      if (planetData && typeof planetData.longitude === 'number') {
        let adjustedLongitude = planetData.longitude;
        
        // Apply divisional calculation
        if (division === 2) { // Hora
          adjustedLongitude = (planetData.longitude % 30) * 2;
        } else if (division === 3) { // Drekkana
          adjustedLongitude = (planetData.longitude % 10) * 3;
        } else if (division === 9) { // Navamsa
          adjustedLongitude = (planetData.longitude % 3.333) * 9;
        } else {
          // General formula for other divisions
          adjustedLongitude = (planetData.longitude % (30 / division)) * division;
        }
        
        const houseNumber = Math.floor(adjustedLongitude / 30) + 1;
        const degree = adjustedLongitude % 30;
        const houseIndex = ((houseNumber - 1) % 12);
        
        if (houseIndex >= 0 && houseIndex < 12 && planetSymbols[planetKey as keyof typeof planetSymbols]) {
          const planetInfo = planetSymbols[planetKey as keyof typeof planetSymbols];
          houses[houseIndex].planets.push({
            key: planetKey,
            symbol: planetInfo.symbol,
            name: planetInfo.name,
            color: planetInfo.color,
            degree: parseFloat(degree.toFixed(1))
          });
        }
      }
    });

    return houses;
  };

  const chartKeys = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'];
  const currentChartInfo = divisionalChartInfo[language][selectedChart as keyof typeof divisionalChartInfo.en];

  return (
    <Card className="border-orange-200">
      <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100">
        <CardTitle className="text-orange-800 flex items-center gap-2">
          <Crown className="h-5 w-5" />
          {getTranslation('Advanced Divisional Charts (Varga Charts)', 'उन्नत विभागीय चार्ट (वर्ग चार्ट)')}
        </CardTitle>
        <p className="text-sm text-orange-600">
          {getTranslation('Complete Vedic Varga Chart Analysis System', 'संपूर्ण वैदिक वर्ग चार्ट विश्लेषण प्रणाली')}
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        <Tabs value={selectedChart} onValueChange={setSelectedChart} className="w-full">
          <TabsList className="grid grid-cols-5 md:grid-cols-10 mb-6 bg-orange-50">
            {chartKeys.map((chart) => (
              <TabsTrigger 
                key={chart} 
                value={chart}
                className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white font-medium"
              >
                {chart}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Chart Information Panel */}
          <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="outline" className="text-orange-700 border-orange-300 bg-white font-semibold">
                {currentChartInfo.name}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInfo(!showInfo)}
                className="text-orange-600 border-orange-300"
              >
                <Info className="h-4 w-4 mr-1" />
                {getTranslation('Info', 'जानकारी')}
              </Button>
            </div>
            
            {showInfo && (
              <div className="space-y-2 text-sm">
                <p><strong>{getTranslation('Purpose:', 'उद्देश्य:')}</strong> {currentChartInfo.purpose}</p>
                <p><strong>{getTranslation('Significance:', 'महत्व:')}</strong> {currentChartInfo.significance}</p>
              </div>
            )}
          </div>

          {chartKeys.map((chartKey) => (
            <TabsContent key={chartKey} value={chartKey}>
              <div className="space-y-6">
                {/* Enhanced Chart Grid */}
                <div className="grid grid-cols-4 gap-2 max-w-2xl mx-auto aspect-square bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-lg border-2 border-orange-200">
                  {generateDivisionalChart(parseInt(chartKey.substring(1))).map((house, index) => (
                    <div
                      key={index}
                      className={`border-2 border-orange-300 p-3 text-center bg-white hover:bg-orange-50 transition-all duration-200 rounded-md shadow-sm relative ${
                        house.number === 1 ? 'bg-orange-100 border-orange-400 shadow-md' : ''
                      }`}
                    >
                      {/* House Number */}
                      <div className="absolute top-1 left-1 text-xs font-bold text-orange-800 bg-orange-200 rounded-full w-5 h-5 flex items-center justify-center">
                        {house.number}
                      </div>
                      
                      {/* Rashi Name */}
                      <div className="text-xs text-gray-600 mb-2 mt-2 font-medium">
                        {house.rashi}
                      </div>
                      
                      {/* Planets */}
                      <div className="space-y-1 min-h-[60px] flex flex-col justify-center">
                        {house.planets.length > 0 ? (
                          house.planets.map((planet, planetIndex) => (
                            <div key={planetIndex} className="flex flex-col items-center">
                              <div className={`text-lg font-bold ${planet.color} drop-shadow-sm`}>
                                {planet.symbol}
                              </div>
                              <div className="text-xs text-gray-500">
                                {planet.degree}°
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-400 text-xs">
                            {getTranslation('Empty', 'खाली')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Planet Legend */}
                <div className="bg-white p-4 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    {getTranslation('Planet Legend', 'ग्रह सूची')}
                  </h4>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {Object.entries(planetSymbols).map(([key, planet]) => (
                      <div key={key} className="flex items-center gap-2 text-sm">
                        <span className={`text-lg font-bold ${planet.color}`}>
                          {planet.symbol}
                        </span>
                        <span className="text-gray-700">{planet.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart Analysis */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    {getTranslation(`${chartKey} Chart Analysis`, `${chartKey} चार्ट विश्लेषण`)}
                  </h4>
                  <p className="text-sm text-blue-700">
                    {getTranslation(
                      `This ${chartKey} chart reveals specific insights about ${currentChartInfo.purpose.toLowerCase()}. Each house represents different aspects of this life area, and planetary placements show your karmic patterns and potential in this domain.`,
                      `यह ${chartKey} चार्ट ${currentChartInfo.purpose.toLowerCase()} के बारे में विशिष्ट अंतर्दृष्टि प्रकट करता है। प्रत्येक घर इस जीवन क्षेत्र के विभिन्न पहलुओं का प्रतिनिधित्व करता है, और ग्रहीय स्थिति इस डोमेन में आपके कर्मिक पैटर्न और क्षमता को दर्शाती है।`
                    )}
                  </p>
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
