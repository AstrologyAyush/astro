
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Grid, Star, ChevronLeft, ChevronRight, Sparkles, BookOpen } from 'lucide-react';

interface MobileOptimizedDivisionalChartsProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const MobileOptimizedDivisionalCharts: React.FC<MobileOptimizedDivisionalChartsProps> = ({ 
  kundaliData, 
  language 
}) => {
  const [selectedChart, setSelectedChart] = useState('D1');
  const [showRishiAdvice, setShowRishiAdvice] = useState(false);

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const divisionalCharts = [
    { 
      id: 'D1', 
      name: getTranslation('Rashi', 'राशि'), 
      description: getTranslation('Main Birth Chart', 'मुख्य जन्म कुंडली'),
      significance: getTranslation('Overall life, personality, health', 'संपूर्ण जीवन, व्यक्तित्व, स्वास्थ्य'),
      rishiWisdom: getTranslation(
        'The Rashi chart is the foundation of all predictions. Maharishi Parashar emphasized that a strong ascendant and well-placed Moon determine life success.',
        'राशि चार्ट सभी भविष्यवाणियों का आधार है। महर्षि पराशर ने जोर दिया कि मजबूत लग्न और अच्छी स्थिति में चंद्रमा जीवन की सफलता निर्धारित करते हैं।'
      )
    },
    { 
      id: 'D2', 
      name: getTranslation('Hora', 'होरा'), 
      description: getTranslation('Wealth Chart', 'धन चार्ट'),
      significance: getTranslation('Financial prosperity, material gains', 'वित्तीय समृद्धि, भौतिक लाभ'),
      rishiWisdom: getTranslation(
        'Hora chart reveals wealth patterns. Parashar taught that planets in own signs in Hora bring lasting prosperity.',
        'होरा चार्ट धन के पैटर्न प्रकट करता है। पराशर ने सिखाया कि होरा में अपनी राशि में स्थित ग्रह स्थायी समृद्धि लाते हैं।'
      )
    },
    { 
      id: 'D3', 
      name: getTranslation('Drekkana', 'द्रेष्काण'), 
      description: getTranslation('Siblings Chart', 'भाई-बहन चार्ट'),
      significance: getTranslation('Brothers, sisters, courage', 'भाई, बहन, साहस'),
      rishiWisdom: getTranslation(
        'Drekkana shows sibling relationships and inner courage. Strong Mars here indicates protective nature towards family.',
        'द्रेष्काण भाई-बहन के रिश्ते और आंतरिक साहस दिखाता है। यहाँ मजबूत मंगल पारिवारिक सुरक्षा की प्रकृति दर्शाता है।'
      )
    },
    { 
      id: 'D4', 
      name: getTranslation('Chaturthamsa', 'चतुर्थांश'), 
      description: getTranslation('Fortune Chart', 'भाग्य चार्ट'),
      significance: getTranslation('Luck, property, mother', 'भाग्य, संपत्ति, माता'),
      rishiWisdom: getTranslation(
        'This chart reveals karmic fortune. Parashar said well-placed Moon here brings maternal blessings and property gains.',
        'यह चार्ट कर्मिक भाग्य प्रकट करता है। पराशर ने कहा कि यहाँ अच्छी स्थिति में चंद्रमा मातृ आशीर्वाद और संपत्ति लाभ देता है।'
      )
    },
    { 
      id: 'D7', 
      name: getTranslation('Saptamsa', 'सप्तांश'), 
      description: getTranslation('Children Chart', 'संतान चार्ट'),
      significance: getTranslation('Offspring, creativity', 'संतान, रचनात्मकता'),
      rishiWisdom: getTranslation(
        'Saptamsa governs progeny and creative expression. Jupiter\'s strength here determines quality of children and their achievements.',
        'सप्तांश संतान और रचनात्मक अभिव्यक्ति को नियंत्रित करता है। यहाँ गुरु की शक्ति संतान की गुणवत्ता और उनकी उपलब्धियों को निर्धारित करती है।'
      )
    },
    { 
      id: 'D9', 
      name: getTranslation('Navamsa', 'नवांश'), 
      description: getTranslation('Marriage Chart', 'विवाह चार्ट'),
      significance: getTranslation('Spouse, dharma, spirituality', 'जीवनसाथी, धर्म, आध्यात्मिकता'),
      rishiWisdom: getTranslation(
        'Navamsa is the soul of the horoscope. Parashar declared that planets gain true strength only when well-placed in Navamsa.',
        'नवांश कुंडली की आत्मा है। पराशर ने घोषणा की कि ग्रह तभी वास्तविक शक्ति प्राप्त करते हैं जब वे नवांश में अच्छी स्थिति में हों।'
      )
    },
    { 
      id: 'D10', 
      name: getTranslation('Dasamsa', 'दशांश'), 
      description: getTranslation('Career Chart', 'करियर चार्ट'),
      significance: getTranslation('Profession, status, achievements', 'व्यवसाय, स्थिति, उपलब्धियां'),
      rishiWisdom: getTranslation(
        'Dasamsa reveals professional destiny. The 10th lord\'s placement here shows the true nature of one\'s calling in life.',
        'दशांश व्यावसायिक नियति प्रकट करता है। यहाँ दशमेश की स्थिति जीवन में व्यक्ति के वास्तविक आह्वान की प्रकृति दिखाती है।'
      )
    }
  ];

  const generateDivisionalChart = (chartType: string) => {
    const chart = kundaliData.chart || {};
    const planets = chart.planets || kundaliData.planets || {};
    
    const houseData = Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      planets: []
    }));

    Object.entries(planets).forEach(([planetName, planetInfo]: [string, any]) => {
      if (planetInfo && typeof planetInfo.house === 'number') {
        let adjustedHouse = planetInfo.house;
        
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
          'Ketu': language === 'hi' ? 'के' : 'Ke',
          'SU': language === 'hi' ? 'सू' : 'Su',
          'MO': language === 'hi' ? 'च' : 'Mo',
          'MA': language === 'hi' ? 'मं' : 'Ma',
          'ME': language === 'hi' ? 'बु' : 'Me',
          'JU': language === 'hi' ? 'गु' : 'Ju',
          'VE': language === 'hi' ? 'श' : 'Ve',
          'SA': language === 'hi' ? 'श' : 'Sa',
          'RA': language === 'hi' ? 'रा' : 'Ra',
          'KE': language === 'hi' ? 'के' : 'Ke'
        };
        
        const houseIndex = adjustedHouse - 1;
        if (houseIndex >= 0 && houseIndex < 12) {
          houseData[houseIndex].planets.push(
            planetSymbols[planetName as keyof typeof planetSymbols] || 
            planetName.substring(0, 2)
          );
        }
      }
    });

    return houseData;
  };

  const currentChart = divisionalCharts.find(chart => chart.id === selectedChart) || divisionalCharts[0];
  const houseData = generateDivisionalChart(selectedChart);

  const personalizedAdvice = useMemo(() => {
    if (!kundaliData?.planets) return '';
    
    const strongPlanets = Object.entries(kundaliData.planets)
      .filter(([_, planet]: [string, any]) => planet.strength > 70)
      .map(([name, _]) => name);
    
    if (strongPlanets.length > 0) {
      return getTranslation(
        `With strong ${strongPlanets.join(', ')} in your ${currentChart.name} chart, Rishi Parashar would advise focusing on ${currentChart.significance.toLowerCase()}.`,
        `आपके ${currentChart.name} चार्ट में मजबूत ${strongPlanets.join(', ')} के साथ, ऋषि पराशर ${currentChart.significance.toLowerCase()} पर ध्यान देने की सलाह देंगे।`
      );
    }
    
    return currentChart.rishiWisdom;
  }, [selectedChart, kundaliData, currentChart, language]);

  return (
    <div className="space-y-4 max-w-full">
      {/* Mobile-Optimized Chart Selector */}
      <Card className="border-purple-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-purple-800 flex items-center gap-2 text-base">
            <Grid className="h-4 w-4" />
            {getTranslation('Divisional Charts (D1-D10)', 'विभाजित चार्ट (D1-D10)')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Horizontal Scrollable Chart Buttons */}
          <ScrollArea className="w-full whitespace-nowrap pb-3">
            <div className="flex gap-2 pb-2">
              {divisionalCharts.map((chart) => (
                <Button
                  key={chart.id}
                  variant={selectedChart === chart.id ? "default" : "outline"}
                  size="sm"
                  className={`flex-shrink-0 min-w-[70px] h-16 flex flex-col items-center justify-center gap-1 text-xs ${
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

          {/* Current Chart Display */}
          <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-center mb-3">
              <Badge className="bg-purple-600 text-white mb-2 text-xs">
                {currentChart.id} - {currentChart.name}
              </Badge>
              <h3 className="font-semibold text-purple-800 text-sm mb-1">{currentChart.description}</h3>
              <p className="text-xs text-purple-600">{currentChart.significance}</p>
            </div>

            {/* Mobile-Optimized Chart Grid */}
            <div className="grid grid-cols-4 gap-0.5 max-w-xs mx-auto aspect-square border-2 border-purple-400 rounded-md overflow-hidden">
              {/* Row 1 */}
              <div className="bg-purple-50 border border-purple-300 p-1 text-center">
                <div className="font-bold text-purple-700 text-xs mb-0.5">12</div>
                <div className="flex flex-wrap justify-center gap-0.5 text-xs">
                  {houseData[11].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 font-medium">{planet}</span>
                  ))}
                </div>
              </div>
              <div className="bg-purple-100 border border-purple-300 p-1 text-center">
                <div className="font-bold text-purple-700 text-xs mb-0.5">1</div>
                <div className="flex flex-wrap justify-center gap-0.5 text-xs">
                  {houseData[0].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 font-medium">{planet}</span>
                  ))}
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-300 p-1 text-center">
                <div className="font-bold text-purple-700 text-xs mb-0.5">2</div>
                <div className="flex flex-wrap justify-center gap-0.5 text-xs">
                  {houseData[1].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 font-medium">{planet}</span>
                  ))}
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-300 p-1 text-center">
                <div className="font-bold text-purple-700 text-xs mb-0.5">3</div>
                <div className="flex flex-wrap justify-center gap-0.5 text-xs">
                  {houseData[2].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 font-medium">{planet}</span>
                  ))}
                </div>
              </div>

              {/* Row 2 */}
              <div className="bg-purple-50 border border-purple-300 p-1 text-center">
                <div className="font-bold text-purple-700 text-xs mb-0.5">11</div>
                <div className="flex flex-wrap justify-center gap-0.5 text-xs">
                  {houseData[10].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 font-medium">{planet}</span>
                  ))}
                </div>
              </div>
              <div className="col-span-2 bg-gradient-to-br from-purple-200 to-indigo-200 border border-purple-400 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-bold text-purple-800 text-xs">{currentChart.id}</div>
                  <div className="text-purple-600 text-xs mt-0.5">{currentChart.name}</div>
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-300 p-1 text-center">
                <div className="font-bold text-purple-700 text-xs mb-0.5">4</div>
                <div className="flex flex-wrap justify-center gap-0.5 text-xs">
                  {houseData[3].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 font-medium">{planet}</span>
                  ))}
                </div>
              </div>

              {/* Row 3 */}
              <div className="bg-purple-50 border border-purple-300 p-1 text-center">
                <div className="font-bold text-purple-700 text-xs mb-0.5">10</div>
                <div className="flex flex-wrap justify-center gap-0.5 text-xs">
                  {houseData[9].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 font-medium">{planet}</span>
                  ))}
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-300 p-1 text-center">
                <div className="font-bold text-purple-700 text-xs mb-0.5">9</div>
                <div className="flex flex-wrap justify-center gap-0.5 text-xs">
                  {houseData[8].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 font-medium">{planet}</span>
                  ))}
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-300 p-1 text-center">
                <div className="font-bold text-purple-700 text-xs mb-0.5">8</div>
                <div className="flex flex-wrap justify-center gap-0.5 text-xs">
                  {houseData[7].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 font-medium">{planet}</span>
                  ))}
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-300 p-1 text-center">
                <div className="font-bold text-purple-700 text-xs mb-0.5">7</div>
                <div className="flex flex-wrap justify-center gap-0.5 text-xs">
                  {houseData[6].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 font-medium">{planet}</span>
                  ))}
                </div>
              </div>

              {/* Row 4 */}
              <div className="bg-purple-50 border border-purple-300 p-1 text-center">
                <div className="font-bold text-purple-700 text-xs mb-0.5">6</div>
                <div className="flex flex-wrap justify-center gap-0.5 text-xs">
                  {houseData[5].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 font-medium">{planet}</span>
                  ))}
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-300 p-1 text-center">
                <div className="font-bold text-purple-700 text-xs mb-0.5">5</div>
                <div className="flex flex-wrap justify-center gap-0.5 text-xs">
                  {houseData[4].planets.map((planet, idx) => (
                    <span key={idx} className="text-purple-600 font-medium">{planet}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Rishi Parashar Advice Section */}
          <div className="space-y-3">
            <Button
              onClick={() => setShowRishiAdvice(!showRishiAdvice)}
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-2 border-amber-300 text-amber-700 hover:bg-amber-50 min-h-[44px]"
            >
              <BookOpen className="h-4 w-4" />
              <span className="text-sm">
                {showRishiAdvice 
                  ? getTranslation('Hide Rishi Parashar Wisdom', 'ऋषि पराशर की बुद्धि छुपाएं')
                  : getTranslation('Show Rishi Parashar Wisdom', 'ऋषि पराशर की बुद्धि देखें')
                }
              </span>
            </Button>

            {showRishiAdvice && (
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-amber-600" />
                  <h4 className="font-semibold text-amber-800 text-sm">
                    {getTranslation('Maharishi Parashar\'s Wisdom', 'महर्षि पराशर की बुद्धि')}
                  </h4>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-amber-700 leading-relaxed">
                    {currentChart.rishiWisdom}
                  </p>
                  <div className="p-3 bg-amber-100 rounded-md border border-amber-300">
                    <h5 className="font-semibold text-amber-800 text-xs mb-2">
                      {getTranslation('Personalized Insight', 'व्यक्तिगत अंतर्दृष्टि')}
                    </h5>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      {personalizedAdvice}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileOptimizedDivisionalCharts;
