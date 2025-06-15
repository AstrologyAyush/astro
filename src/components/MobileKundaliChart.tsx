
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, Info, Bot, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from '@/contexts/LanguageContext';

interface MobileKundaliChartProps {
  kundaliData?: any;
  language?: 'hi' | 'en';
}

const MobileKundaliChart: React.FC<MobileKundaliChartProps> = ({ kundaliData, language = 'en' }) => {
  const { t } = useLanguage();
  const [selectedChart, setSelectedChart] = useState('D1');
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);

  if (!kundaliData) {
    return (
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-800 text-sm text-center">
            {language === 'hi' ? 'कुंडली चार्ट लोड हो रहा है...' : 'Loading Kundali Chart...'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chart = kundaliData.chart || {};
  const { ascendant = 0, planets = {}, houses = [] } = chart;
  const birthData = kundaliData.birthData || {};

  // Divisional charts data
  const divisionalCharts = [
    { id: 'D1', name: language === 'hi' ? 'राशि चार्ट' : 'Rashi Chart', description: language === 'hi' ? 'मुख्य जन्म कुंडली' : 'Main Birth Chart' },
    { id: 'D2', name: language === 'hi' ? 'होरा चार्ट' : 'Hora Chart', description: language === 'hi' ? 'धन और संपत्ति' : 'Wealth & Assets' },
    { id: 'D3', name: language === 'hi' ? 'द्रेष्काण' : 'Drekkana', description: language === 'hi' ? 'भाई-बहन' : 'Siblings' },
    { id: 'D4', name: language === 'hi' ? 'चतुर्थांश' : 'Chaturthamsa', description: language === 'hi' ? 'भाग्य और घर' : 'Fortune & Home' },
    { id: 'D7', name: language === 'hi' ? 'सप्तांश' : 'Saptamsa', description: language === 'hi' ? 'संतान' : 'Children' },
    { id: 'D9', name: language === 'hi' ? 'नवांश' : 'Navamsa', description: language === 'hi' ? 'विवाह और आध्यात्म' : 'Marriage & Spirituality' },
    { id: 'D10', name: language === 'hi' ? 'दशांश' : 'Dasamsa', description: language === 'hi' ? 'करियर' : 'Career' }
  ];

  // Generate house data with planets
  const generateHouseData = () => {
    const houseData = Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      planets: []
    }));

    Object.entries(planets).forEach(([planetName, planetInfo]: [string, any]) => {
      if (planetInfo && typeof planetInfo.house === 'number') {
        const houseIndex = planetInfo.house - 1;
        if (houseIndex >= 0 && houseIndex < 12) {
          const planetSymbols = {
            'Sun': language === 'hi' ? 'सू' : 'Su',
            'Moon': language === 'hi' ? 'च' : 'Mo',
            'Mars': language === 'hi' ? 'मं' : 'Ma',
            'Mercury': language === 'hi' ? 'बु' : 'Me',
            'Jupiter': language === 'hi' ? 'गु' : 'Ju',
            'Venus': language === 'hi' ? 'श' : 'Ve',
            'Saturn': language === 'hi' ? 'श' : 'Sa',
            'Rahu': language === 'hi' ? 'रा' : 'Ra',
            'Ketu': language === 'hi' ? 'के' : 'Ke'
          };
          houseData[houseIndex].planets.push(planetSymbols[planetName as keyof typeof planetSymbols] || planetName.substring(0, 2));
        }
      }
    });

    return houseData;
  };

  const houseData = generateHouseData();

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Main Chart Card */}
      <Card className="border-orange-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 p-3">
          <CardTitle className="text-orange-800 text-center text-base flex items-center justify-center gap-2">
            <Grid className="h-4 w-4" />
            {language === 'hi' ? 'मोबाइल कुंडली चार्ट' : 'Mobile Kundali Chart'}
          </CardTitle>
          {birthData.fullName && (
            <p className="text-xs text-orange-600 text-center">
              {language === 'hi' ? 'नाम: ' : 'Name: '}{birthData.fullName}
            </p>
          )}
        </CardHeader>
        <CardContent className="p-3">
          {/* Main Chart Grid - Mobile Optimized */}
          <div className="mb-4">
            <div className="grid grid-cols-4 gap-0.5 max-w-sm mx-auto aspect-square border-2 border-orange-400 rounded-lg overflow-hidden">
              {/* Row 1 */}
              <div className="bg-orange-50 border border-orange-300 p-1 text-center text-xs">
                <div className="font-bold text-orange-700 mb-1">12</div>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {houseData[11].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 text-xs font-medium">{planet}</span>
                  ))}
                </div>
              </div>
              <div className="bg-orange-100 border border-orange-300 p-1 text-center text-xs">
                <div className="font-bold text-orange-700 mb-1">1</div>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {houseData[0].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 text-xs font-medium">{planet}</span>
                  ))}
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-300 p-1 text-center text-xs">
                <div className="font-bold text-orange-700 mb-1">2</div>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {houseData[1].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 text-xs font-medium">{planet}</span>
                  ))}
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-300 p-1 text-center text-xs">
                <div className="font-bold text-orange-700 mb-1">3</div>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {houseData[2].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 text-xs font-medium">{planet}</span>
                  ))}
                </div>
              </div>

              {/* Row 2 */}
              <div className="bg-orange-50 border border-orange-300 p-1 text-center text-xs">
                <div className="font-bold text-orange-700 mb-1">11</div>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {houseData[10].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 text-xs font-medium">{planet}</span>
                  ))}
                </div>
              </div>
              <div className="col-span-2 bg-gradient-to-br from-orange-200 to-yellow-200 border border-orange-400 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-bold text-orange-800 text-sm leading-tight">
                    {language === 'hi' ? 'कुंडली' : 'Kundali'}
                  </div>
                  <div className="text-orange-600 text-xs mt-1">
                    {language === 'hi' ? 'लग्न: ' : 'Asc: '}{ascendant}
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-300 p-1 text-center text-xs">
                <div className="font-bold text-orange-700 mb-1">4</div>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {houseData[3].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 text-xs font-medium">{planet}</span>
                  ))}
                </div>
              </div>

              {/* Row 3 */}
              <div className="bg-orange-50 border border-orange-300 p-1 text-center text-xs">
                <div className="font-bold text-orange-700 mb-1">10</div>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {houseData[9].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 text-xs font-medium">{planet}</span>
                  ))}
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-300 p-1 text-center text-xs">
                <div className="font-bold text-orange-700 mb-1">9</div>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {houseData[8].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 text-xs font-medium">{planet}</span>
                  ))}
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-300 p-1 text-center text-xs">
                <div className="font-bold text-orange-700 mb-1">8</div>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {houseData[7].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 text-xs font-medium">{planet}</span>
                  ))}
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-300 p-1 text-center text-xs">
                <div className="font-bold text-orange-700 mb-1">7</div>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {houseData[6].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 text-xs font-medium">{planet}</span>
                  ))}
                </div>
              </div>

              {/* Row 4 */}
              <div className="bg-orange-50 border border-orange-300 p-1 text-center text-xs">
                <div className="font-bold text-orange-700 mb-1">6</div>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {houseData[5].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 text-xs font-medium">{planet}</span>
                  ))}
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-300 p-1 text-center text-xs">
                <div className="font-bold text-orange-700 mb-1">5</div>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {houseData[4].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 text-xs font-medium">{planet}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Second Row - Divisional Charts and Options */}
      <Card className="border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 p-3">
          <CardTitle className="text-purple-800 text-center text-sm flex items-center justify-center gap-2">
            <Star className="h-4 w-4" />
            {language === 'hi' ? 'विभाजनीय चार्ट विकल्प' : 'Divisional Chart Options'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          {/* Horizontal Scrollable Chart Options */}
          <ScrollArea className="w-full whitespace-nowrap pb-2">
            <div className="flex gap-2 pb-2">
              {divisionalCharts.map((chart) => (
                <Button
                  key={chart.id}
                  variant={selectedChart === chart.id ? "default" : "outline"}
                  size="sm"
                  className={`flex-shrink-0 min-w-[80px] h-16 flex flex-col items-center justify-center gap-1 text-xs ${
                    selectedChart === chart.id 
                      ? 'bg-purple-600 text-white' 
                      : 'border-purple-300 text-purple-700 hover:bg-purple-50'
                  }`}
                  onClick={() => setSelectedChart(chart.id)}
                >
                  <span className="font-bold">{chart.id}</span>
                  <span className="text-xs leading-tight text-center">{chart.name}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>

          {/* Selected Chart Info */}
          <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-center">
              <h3 className="font-semibold text-purple-800 text-sm">
                {divisionalCharts.find(c => c.id === selectedChart)?.name}
              </h3>
              <p className="text-xs text-purple-600 mt-1">
                {divisionalCharts.find(c => c.id === selectedChart)?.description}
              </p>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center justify-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50 min-h-[44px]"
            >
              <Info className="h-4 w-4" />
              <span className="text-xs">
                {language === 'hi' ? 'जानकारी' : 'Information'}
              </span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center justify-center gap-2 border-indigo-300 text-indigo-700 hover:bg-indigo-50 min-h-[44px]"
              onClick={() => setShowAIAnalysis(!showAIAnalysis)}
            >
              <Bot className="h-4 w-4" />
              <span className="text-xs">
                {language === 'hi' ? 'उन्नत AI विश्लेषण' : 'Advanced AI Analysis'}
              </span>
            </Button>
          </div>

          {/* AI Analysis Panel */}
          {showAIAnalysis && (
            <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-2">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-indigo-800 text-sm mb-2">
                  {language === 'hi' ? 'AI विश्लेषण' : 'AI Analysis'}
                </h4>
                <p className="text-xs text-indigo-600">
                  {language === 'hi' 
                    ? 'उन्नत AI द्वारा संचालित विश्लेषण जल्द ही उपलब्ध होगा।'
                    : 'Advanced AI-powered analysis coming soon.'
                  }
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Info Card */}
      <Card className="border-green-200 shadow-sm">
        <CardContent className="p-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <h4 className="font-semibold text-green-800 text-xs">
                {language === 'hi' ? 'लग्न राशि' : 'Ascendant'}
              </h4>
              <p className="text-green-600 font-medium text-sm">
                {kundaliData.ascendantSanskrit || kundaliData.ascendantName || 'Aries'}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 text-xs">
                {language === 'hi' ? 'चंद्र राशि' : 'Moon Sign'}
              </h4>
              <p className="text-green-600 font-medium text-sm">
                {kundaliData.moonRashi || 'Taurus'}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 text-xs">
                {language === 'hi' ? 'सूर्य राशि' : 'Sun Sign'}
              </h4>
              <p className="text-green-600 font-medium text-sm">
                {kundaliData.sunRashi || 'Gemini'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileKundaliChart;
