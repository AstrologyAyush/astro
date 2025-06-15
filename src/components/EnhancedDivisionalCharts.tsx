
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Grid, Star, Clock, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

interface EnhancedDivisionalChartsProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const EnhancedDivisionalCharts: React.FC<EnhancedDivisionalChartsProps> = ({ kundaliData, language }) => {
  const [selectedChart, setSelectedChart] = useState('D1');
  const [currentChartIndex, setCurrentChartIndex] = useState(0);

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const divisionalCharts = [
    { id: 'D1', name: getTranslation('Rashi Chart', 'राशि चार्ट'), description: getTranslation('Main Birth Chart - Overall Life', 'मुख्य जन्म कुंडली - संपूर्ण जीवन'), significance: getTranslation('Life path, personality, health', 'जीवन पथ, व्यक्तित्व, स्वास्थ्य') },
    { id: 'D2', name: getTranslation('Hora Chart', 'होरा चार्ट'), description: getTranslation('Wealth & Assets', 'धन और संपत्ति'), significance: getTranslation('Financial prosperity, material gains', 'वित्तीय समृद्धि, भौतिक लाभ') },
    { id: 'D3', name: getTranslation('Drekkana', 'द्रेष्काण'), description: getTranslation('Siblings & Courage', 'भाई-बहन और साहस'), significance: getTranslation('Brothers, sisters, bravery', 'भाई, बहन, वीरता') },
    { id: 'D4', name: getTranslation('Chaturthamsa', 'चतुर्थांश'), description: getTranslation('Fortune & Property', 'भाग्य और संपत्ति'), significance: getTranslation('Luck, real estate, inheritance', 'भाग्य, अचल संपत्ति, विरासत') },
    { id: 'D7', name: getTranslation('Saptamsa', 'सप्तांश'), description: getTranslation('Children & Creativity', 'संतान और रचनात्मकता'), significance: getTranslation('Offspring, creative expression', 'संतान, रचनात्मक अभिव्यक्ति') },
    { id: 'D9', name: getTranslation('Navamsa', 'नवांश'), description: getTranslation('Marriage & Spirituality', 'विवाह और आध्यात्म'), significance: getTranslation('Spouse, dharma, spiritual growth', 'जीवनसाथी, धर्म, आध्यात्मिक विकास') },
    { id: 'D10', name: getTranslation('Dasamsa', 'दशांश'), description: getTranslation('Career & Profession', 'करियर और व्यवसाय'), significance: getTranslation('Job, reputation, achievements', 'नौकरी, प्रतिष्ठा, उपलब्धियां') },
    { id: 'D12', name: getTranslation('Dvadasamsa', 'द्वादशांश'), description: getTranslation('Parents & Lineage', 'माता-पिता और वंश'), significance: getTranslation('Father, mother, ancestry', 'पिता, माता, पूर्वज') },
    { id: 'D16', name: getTranslation('Shodasamsa', 'षोडशांश'), description: getTranslation('Vehicles & Happiness', 'वाहन और खुशी'), significance: getTranslation('Transportation, material comfort', 'परिवहन, भौतिक आराम') },
    { id: 'D20', name: getTranslation('Vimsamsa', 'विंशांश'), description: getTranslation('Spiritual Practices', 'आध्यात्मिक अभ्यास'), significance: getTranslation('Religious activities, devotion', 'धार्मिक गतिविधियां, भक्ति') }
  ];

  const generateDivisionalChart = (chartType: string) => {
    // Generate sample divisional chart data based on main chart
    const chart = kundaliData.chart || {};
    const planets = chart.planets || {};
    
    const houseData = Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      planets: []
    }));

    // Simulate divisional chart planet placement
    Object.entries(planets).forEach(([planetName, planetInfo]: [string, any]) => {
      if (planetInfo && typeof planetInfo.house === 'number') {
        let adjustedHouse = planetInfo.house;
        
        // Apply divisional chart logic (simplified)
        switch (chartType) {
          case 'D2':
            adjustedHouse = planetInfo.longitude > 180 ? 2 : 1;
            break;
          case 'D3':
            adjustedHouse = Math.floor((planetInfo.longitude % 30) / 10) * 4 + Math.floor(planetInfo.house / 3) + 1;
            break;
          case 'D9':
            adjustedHouse = Math.floor((planetInfo.longitude % 30) / 3.33) + 1;
            break;
          case 'D10':
            adjustedHouse = Math.floor((planetInfo.longitude % 30) / 3) + 1;
            break;
          default:
            adjustedHouse = planetInfo.house;
        }
        
        adjustedHouse = ((adjustedHouse - 1) % 12) + 1;
        
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
        
        const houseIndex = adjustedHouse - 1;
        if (houseIndex >= 0 && houseIndex < 12) {
          houseData[houseIndex].planets.push(planetSymbols[planetName as keyof typeof planetSymbols] || planetName.substring(0, 2));
        }
      }
    });

    return houseData;
  };

  const currentChart = divisionalCharts.find(chart => chart.id === selectedChart) || divisionalCharts[0];
  const houseData = generateDivisionalChart(selectedChart);

  return (
    <div className="space-y-4">
      <Card className="border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4">
          <CardTitle className="text-purple-800 flex items-center gap-2 text-lg">
            <Grid className="h-5 w-5" />
            {getTranslation('Enhanced Divisional Charts', 'उन्नत विभाजित चार्ट')}
          </CardTitle>
          <p className="text-sm text-purple-600">
            {getTranslation('Complete Varga Chart Analysis', 'संपूर्ण वर्ग चार्ट विश्लेषण')}
          </p>
        </CardHeader>
        <CardContent className="p-4">
          {/* Chart Navigation */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">
                {getTranslation('Select Divisional Chart', 'विभाजित चार्ट चुनें')}
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentChartIndex(Math.max(0, currentChartIndex - 1))}
                  disabled={currentChartIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentChartIndex(Math.min(divisionalCharts.length - 1, currentChartIndex + 1))}
                  disabled={currentChartIndex === divisionalCharts.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {divisionalCharts.map((chart, index) => (
                <Button
                  key={chart.id}
                  variant={selectedChart === chart.id ? "default" : "outline"}
                  size="sm"
                  className={`h-auto p-3 flex flex-col items-center gap-1 ${
                    selectedChart === chart.id 
                      ? 'bg-purple-600 text-white' 
                      : 'border-purple-300 text-purple-700 hover:bg-purple-50'
                  }`}
                  onClick={() => {
                    setSelectedChart(chart.id);
                    setCurrentChartIndex(index);
                  }}
                >
                  <span className="font-bold text-xs">{chart.id}</span>
                  <span className="text-xs text-center leading-tight">{chart.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Current Chart Display */}
          <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-center mb-4">
              <Badge className="bg-purple-600 text-white mb-2">
                {currentChart.id} - {currentChart.name}
              </Badge>
              <h3 className="font-semibold text-purple-800 mb-1">{currentChart.description}</h3>
              <p className="text-sm text-purple-600">{currentChart.significance}</p>
            </div>

            {/* Chart Grid */}
            <div className="grid grid-cols-4 gap-1 max-w-md mx-auto aspect-square border-2 border-purple-400 rounded-lg overflow-hidden">
              {/* Row 1 */}
              <div className="bg-purple-50 border border-purple-300 p-2 text-center text-xs">
                <div className="font-bold text-purple-700 mb-1">12</div>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {houseData[11].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 text-xs font-medium">{planet}</span>
                  ))}
                </div>
              </div>
              <div className="bg-purple-100 border border-purple-300 p-2 text-center text-xs">
                <div className="font-bold text-purple-700 mb-1">1</div>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {houseData[0].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 text-xs font-medium">{planet}</span>
                  ))}
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-300 p-2 text-center text-xs">
                <div className="font-bold text-purple-700 mb-1">2</div>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {houseData[1].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 text-xs font-medium">{planet}</span>
                  ))}
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-300 p-2 text-center text-xs">
                <div className="font-bold text-purple-700 mb-1">3</div>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {houseData[2].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 text-xs font-medium">{planet}</span>
                  ))}
                </div>
              </div>

              {/* Row 2 */}
              <div className="bg-purple-50 border border-purple-300 p-2 text-center text-xs">
                <div className="font-bold text-purple-700 mb-1">11</div>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {houseData[10].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 text-xs font-medium">{planet}</span>
                  ))}
                </div>
              </div>
              <div className="col-span-2 bg-gradient-to-br from-purple-200 to-indigo-200 border border-purple-400 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-bold text-purple-800 text-sm">{currentChart.id}</div>
                  <div className="text-purple-600 text-xs mt-1">{currentChart.name}</div>
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-300 p-2 text-center text-xs">
                <div className="font-bold text-purple-700 mb-1">4</div>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {houseData[3].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 text-xs font-medium">{planet}</span>
                  ))}
                </div>
              </div>

              {/* Row 3 */}
              <div className="bg-purple-50 border border-purple-300 p-2 text-center text-xs">
                <div className="font-bold text-purple-700 mb-1">10</div>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {houseData[9].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 text-xs font-medium">{planet}</span>
                  ))}
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-300 p-2 text-center text-xs">
                <div className="font-bold text-purple-700 mb-1">9</div>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {houseData[8].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 text-xs font-medium">{planet}</span>
                  ))}
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-300 p-2 text-center text-xs">
                <div className="font-bold text-purple-700 mb-1">8</div>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {houseData[7].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 text-xs font-medium">{planet}</span>
                  ))}
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-300 p-2 text-center text-xs">
                <div className="font-bold text-purple-700 mb-1">7</div>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {houseData[6].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 text-xs font-medium">{planet}</span>
                  ))}
                </div>
              </div>

              {/* Row 4 */}
              <div className="bg-purple-50 border border-purple-300 p-2 text-center text-xs">
                <div className="font-bold text-purple-700 mb-1">6</div>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {houseData[5].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 text-xs font-medium">{planet}</span>
                  ))}
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-300 p-2 text-center text-xs">
                <div className="font-bold text-purple-700 mb-1">5</div>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {houseData[4].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 text-xs font-medium">{planet}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Chart Analysis */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">
              {getTranslation('Chart Analysis', 'चार्ट विश्लेषण')}
            </h4>
            <p className="text-sm text-gray-600">
              {selectedChart === 'D1' && getTranslation(
                'This is your main birth chart showing overall life patterns, personality, and general life direction.',
                'यह आपकी मुख्य जन्म कुंडली है जो समग्र जीवन पैटर्न, व्यक्तित्व और सामान्य जीवन दिशा दिखाती है।'
              )}
              {selectedChart === 'D9' && getTranslation(
                'Navamsa chart reveals details about marriage, spouse characteristics, and spiritual development.',
                'नवांश चार्ट विवाह, जीवनसाथी की विशेषताओं और आध्यात्मिक विकास के बारे में विवरण प्रकट करता है।'
              )}
              {selectedChart === 'D10' && getTranslation(
                'Career chart shows professional life, reputation, achievements, and work-related matters.',
                'करियर चार्ट व्यावसायिक जीवन, प्रतिष्ठा, उपलब्धियों और कार्य संबंधी मामलों को दिखाता है।'
              )}
              {!['D1', 'D9', 'D10'].includes(selectedChart) && getTranslation(
                `This ${currentChart.name} provides insights into ${currentChart.description.toLowerCase()}.`,
                `यह ${currentChart.name} ${currentChart.description.toLowerCase()} में अंतर्दृष्टि प्रदान करता है।`
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedDivisionalCharts;
