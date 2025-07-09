import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Grid, Star, Heart, Crown, TrendingUp, Home, Users, Target, Award, Book } from 'lucide-react';

interface EnhancedDivisionalChartsFixedProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const EnhancedDivisionalChartsFixed: React.FC<EnhancedDivisionalChartsFixedProps> = ({ 
  kundaliData, 
  language 
}) => {
  const [selectedChart, setSelectedChart] = useState('D1');
  
  const getTranslation = (en: string, hi: string) => (language === 'hi' ? hi : en);

  // Define divisional charts with their significance
  const divisionalCharts = [
    {
      id: 'D1',
      name: getTranslation('D1 - Rashi Chart', 'D1 - राशि चार्ट'),
      significance: getTranslation('Overall life, personality, basic nature', 'संपूर्ण जीवन, व्यक्तित्व, मूल स्वभाव'),
      icon: Crown,
      color: 'blue'
    },
    {
      id: 'D2',
      name: getTranslation('D2 - Hora Chart', 'D2 - होरा चार्ट'),
      significance: getTranslation('Wealth, money matters, financial status', 'धन, आर्थिक मामले, वित्तीय स्थिति'),
      icon: TrendingUp,
      color: 'green'
    },
    {
      id: 'D3',
      name: getTranslation('D3 - Drekkana', 'D3 - द्रेक्काण'),
      significance: getTranslation('Siblings, courage, short journeys', 'भाई-बहन, साहस, छोटी यात्राएं'),
      icon: Users,
      color: 'purple'
    },
    {
      id: 'D4',
      name: getTranslation('D4 - Chaturthamsa', 'D4 - चतुर्थांश'),
      significance: getTranslation('Property, vehicles, home, mother', 'संपत्ति, वाहन, घर, माता'),
      icon: Home,
      color: 'orange'
    },
    {
      id: 'D7',
      name: getTranslation('D7 - Saptamsa', 'D7 - सप्तमांश'),
      significance: getTranslation('Children, creativity, progeny', 'संतान, रचनात्मकता, संतति'),
      icon: Heart,
      color: 'pink'
    },
    {
      id: 'D9',
      name: getTranslation('D9 - Navamsa', 'D9 - नवमांश'),
      significance: getTranslation('Marriage, dharma, spiritual strength', 'विवाह, धर्म, आध्यात्मिक शक्ति'),
      icon: Star,
      color: 'indigo'
    },
    {
      id: 'D10',
      name: getTranslation('D10 - Dasamsa', 'D10 - दशमांश'),
      significance: getTranslation('Career, profession, reputation', 'करियर, व्यवसाय, प्रतिष्ठा'),
      icon: Award,
      color: 'yellow'
    },
    {
      id: 'D12',
      name: getTranslation('D12 - Dvadasamsa', 'D12 - द्वादशांश'),
      significance: getTranslation('Parents, ancestry, past life', 'माता-पिता, वंश, पूर्व जन्म'),
      icon: Book,
      color: 'gray'
    },
    {
      id: 'D16',
      name: getTranslation('D16 - Shodasamsa', 'D16 - षोडशांश'),
      significance: getTranslation('Vehicles, happiness, comforts', 'वाहन, खुशी, सुख-सुविधाएं'),
      icon: Target,
      color: 'teal'
    },
    {
      id: 'D20',
      name: getTranslation('D20 - Vimsamsa', 'D20 - विम्शांश'),
      significance: getTranslation('Spiritual practices, devotion', 'आध्यात्मिक अभ्यास, भक्ति'),
      icon: Star,
      color: 'violet'
    }
  ];

  // Extract planetary data for analysis
  const extractPlanetaryData = () => {
    const planets = kundaliData?.enhancedCalculations?.planets || kundaliData?.planets || {};
    const houses = kundaliData?.enhancedCalculations?.houses || [];
    const lagna = kundaliData?.enhancedCalculations?.lagna || {};
    
    return { planets, houses, lagna };
  };

  // Generate divisional chart analysis
  const generateDivisionalAnalysis = (chartType: string) => {
    const { planets, lagna } = extractPlanetaryData();
    
    switch(chartType) {
      case 'D1':
        return analyzeD1Chart(planets, lagna);
      case 'D2':
        return analyzeD2Chart(planets);
      case 'D3':
        return analyzeD3Chart(planets);
      case 'D4':
        return analyzeD4Chart(planets);
      case 'D7':
        return analyzeD7Chart(planets);
      case 'D9':
        return analyzeD9Chart(planets);
      case 'D10':
        return analyzeD10Chart(planets);
      case 'D12':
        return analyzeD12Chart(planets);
      case 'D16':
        return analyzeD16Chart(planets);
      case 'D20':
        return analyzeD20Chart(planets);
      default:
        return {
          strength: 'Medium',
          keyPlanets: [],
          insights: [getTranslation('Analysis in progress', 'विश्लेषण जारी है')],
          recommendations: [getTranslation('General recommendations', 'सामान्य सुझाव')]
        };
    }
  };

  const analyzeD1Chart = (planets: any, lagna: any) => {
    const strongPlanets = Object.entries(planets).filter(([_, data]: [string, any]) => 
      (data?.shadbala || 50) > 60
    ).map(([name, _]) => name);

    return {
      strength: strongPlanets.length > 3 ? 'Strong' : 'Medium',
      keyPlanets: strongPlanets.slice(0, 3),
      insights: [
        getTranslation(`Lagna in ${lagna?.signName || 'Unknown'} shows your basic nature`, `${lagna?.signName || 'अज्ञात'} में लग्न आपका मूल स्वभाव दर्शाता है`),
        getTranslation(`${strongPlanets.length} planets are strong in your chart`, `आपके चार्ट में ${strongPlanets.length} ग्रह मजबूत हैं`),
        getTranslation('Overall personality analysis based on planetary positions', 'ग्रहीय स्थितियों पर आधारित समग्र व्यक्तित्व विश्लेषण')
      ],
      recommendations: [
        getTranslation('Focus on strengthening weak planets through remedies', 'उपायों के माध्यम से कमजोर ग्रहों को मजबूत करने पर ध्यान दें'),
        getTranslation('Leverage strong planetary periods for major decisions', 'प्रमुख निर्णयों के लिए मजबूत ग्रहीय कालों का लाभ उठाएं')
      ]
    };
  };

  const analyzeD2Chart = (planets: any) => {
    const venusStrength = planets?.VE?.shadbala || planets?.Venus?.shadbala || 50;
    const jupiterStrength = planets?.JU?.shadbala || planets?.Jupiter?.shadbala || 50;
    const wealthIndicators = (venusStrength + jupiterStrength) / 2;

    return {
      strength: wealthIndicators > 60 ? 'Strong' : 'Medium',
      keyPlanets: ['Venus', 'Jupiter', 'Mercury'],
      insights: [
        getTranslation(`Wealth potential is ${wealthIndicators > 60 ? 'high' : 'moderate'}`, `धन संभावना ${wealthIndicators > 60 ? 'उच्च' : 'मध्यम'} है`),
        getTranslation('Venus and Jupiter influence your financial growth', 'शुक्र और बृहस्पति आपकी वित्तीय वृद्धि को प्रभावित करते हैं'),
        getTranslation('Multiple income sources are indicated', 'कई आय स्रोतों के संकेत हैं')
      ],
      recommendations: [
        getTranslation('Invest in education and skills for long-term wealth', 'दीर्घकालिक धन के लिए शिक्षा और कौशल में निवेश करें'),
        getTranslation('Be cautious with speculation and quick gains', 'सट्टे और त्वरित लाभ के साथ सावधान रहें')
      ]
    };
  };

  const analyzeD3Chart = (planets: any) => {
    const marsStrength = planets?.MA?.shadbala || planets?.Mars?.shadbala || 50;
    const mercuryStrength = planets?.ME?.shadbala || planets?.Mercury?.shadbala || 50;

    return {
      strength: marsStrength > 60 ? 'Strong' : 'Medium',
      keyPlanets: ['Mars', 'Mercury'],
      insights: [
        getTranslation('Good relationship with siblings is indicated', 'भाई-बहनों के साथ अच्छे संबंध के संकेत हैं'),
        getTranslation(`Courage level is ${marsStrength > 60 ? 'high' : 'moderate'}`, `साहस का स्तर ${marsStrength > 60 ? 'उच्च' : 'मध्यम'} है`),
        getTranslation('Short journeys bring opportunities', 'छोटी यात्राएं अवसर लाती हैं')
      ],
      recommendations: [
        getTranslation('Maintain harmony with siblings and close friends', 'भाई-बहनों और करीबी दोस्तों के साथ सामंजस्य बनाए रखें'),
        getTranslation('Channel your courage in constructive activities', 'अपने साहस को रचनात्मक गतिविधियों में लगाएं')
      ]
    };
  };

  const analyzeD4Chart = (planets: any) => {
    const moonStrength = planets?.MO?.shadbala || planets?.Moon?.shadbala || 50;
    const marsStrength = planets?.MA?.shadbala || planets?.Mars?.shadbala || 50;

    return {
      strength: (moonStrength + marsStrength) / 2 > 60 ? 'Strong' : 'Medium',
      keyPlanets: ['Moon', 'Mars', 'Venus'],
      insights: [
        getTranslation('Property and vehicle acquisition is favorable', 'संपत्ति और वाहन अधिग्रहण अनुकूल है'),
        getTranslation('Strong connection with mother and homeland', 'माता और मातृभूमि के साथ मजबूत संबंध'),
        getTranslation('Home brings peace and happiness', 'घर शांति और खुशी लाता है')
      ],
      recommendations: [
        getTranslation('Invest in real estate during favorable periods', 'अनुकूल अवधि के दौरान रियल एस्टेट में निवेश करें'),
        getTranslation('Maintain good relationship with mother', 'माता के साथ अच्छे संबंध बनाए रखें')
      ]
    };
  };

  const analyzeD7Chart = (planets: any) => {
    const jupiterStrength = planets?.JU?.shadbala || planets?.Jupiter?.shadbala || 50;
    const venusStrength = planets?.VE?.shadbala || planets?.Venus?.shadbala || 50;

    return {
      strength: jupiterStrength > 60 ? 'Strong' : 'Medium',
      keyPlanets: ['Jupiter', 'Venus', 'Moon'],
      insights: [
        getTranslation('Children bring joy and fulfillment', 'संतान खुशी और संतुष्टि लाती है'),
        getTranslation('Creative abilities are well-developed', 'रचनात्मक क्षमताएं अच्छी तरह विकसित हैं'),
        getTranslation('Teaching and mentoring others comes naturally', 'दूसरों को सिखाना और मार्गदर्शन करना स्वाभाविक है')
      ],
      recommendations: [
        getTranslation('Encourage creative expression in children', 'बच्चों में रचनात्मक अभिव्यक्ति को प्रोत्साहित करें'),
        getTranslation('Use your wisdom to guide younger generations', 'युवा पीढ़ी का मार्गदर्शन करने के लिए अपनी बुद्धि का उपयोग करें')
      ]
    };
  };

  const analyzeD9Chart = (planets: any) => {
    const venusStrength = planets?.VE?.shadbala || planets?.Venus?.shadbala || 50;
    const jupiterStrength = planets?.JU?.shadbala || planets?.Jupiter?.shadbala || 50;
    const dharmaStrength = (venusStrength + jupiterStrength) / 2;

    return {
      strength: dharmaStrength > 65 ? 'Strong' : 'Medium',
      keyPlanets: ['Venus', 'Jupiter', 'Mars'],
      insights: [
        getTranslation(`Marriage prospects are ${dharmaStrength > 65 ? 'excellent' : 'good'}`, `विवाह संभावनाएं ${dharmaStrength > 65 ? 'उत्कृष्ट' : 'अच्छी'} हैं`),
        getTranslation('Spiritual inclination grows with age', 'आध्यात्मिक झुकाव उम्र के साथ बढ़ता है'),
        getTranslation('Partnership brings strength and growth', 'साझेदारी शक्ति और विकास लाती है')
      ],
      recommendations: [
        getTranslation('Choose life partner based on compatibility and values', 'अनुकूलता और मूल्यों के आधार पर जीवनसाथी चुनें'),
        getTranslation('Engage in spiritual practices regularly', 'नियमित रूप से आध्यात्मिक अभ्यास में संलग्न हों')
      ]
    };
  };

  const analyzeD10Chart = (planets: any) => {
    const sunStrength = planets?.SU?.shadbala || planets?.Sun?.shadbala || 50;
    const saturnStrength = planets?.SA?.shadbala || planets?.Saturn?.shadbala || 50;
    const careerStrength = (sunStrength + saturnStrength) / 2;

    return {
      strength: careerStrength > 60 ? 'Strong' : 'Medium',
      keyPlanets: ['Sun', 'Saturn', 'Mars'],
      insights: [
        getTranslation(`Career prospects are ${careerStrength > 60 ? 'excellent' : 'moderate'}`, `करियर संभावनाएं ${careerStrength > 60 ? 'उत्कृष्ट' : 'मध्यम'} हैं`),
        getTranslation('Leadership roles suit your nature', 'नेतृत्व भूमिकाएं आपके स्वभाव के अनुकूल हैं'),
        getTranslation('Recognition and reputation grow gradually', 'मान्यता और प्रतिष्ठा धीरे-धीरे बढ़ती है')
      ],
      recommendations: [
        getTranslation('Focus on building expertise in your chosen field', 'अपने चुने गए क्षेत्र में विशेषज्ञता बनाने पर ध्यान दें'),
        getTranslation('Network with industry leaders and mentors', 'उद्योग के नेताओं और गुरुओं के साथ नेटवर्क बनाएं')
      ]
    };
  };

  const analyzeD12Chart = (planets: any) => {
    const jupiterStrength = planets?.JU?.shadbala || planets?.Jupiter?.shadbala || 50;
    const moonStrength = planets?.MO?.shadbala || planets?.Moon?.shadbala || 50;

    return {
      strength: jupiterStrength > 60 ? 'Strong' : 'Medium',
      keyPlanets: ['Jupiter', 'Moon', 'Sun'],
      insights: [
        getTranslation('Strong ancestral blessings protect you', 'मजबूत पैतृक आशीर्वाद आपकी रक्षा करते हैं'),
        getTranslation('Good relationship with parents indicated', 'माता-पिता के साथ अच्छे संबंध के संकेत हैं'),
        getTranslation('Past life karma influences current situations', 'पूर्व जन्म का कर्म वर्तमान स्थितियों को प्रभावित करता है')
      ],
      recommendations: [
        getTranslation('Honor your ancestors and family traditions', 'अपने पूर्वजों और पारिवारिक परंपराओं का सम्मान करें'),
        getTranslation('Practice gratitude towards parents and teachers', 'माता-पिता और शिक्षकों के प्रति कृतज्ञता का अभ्यास करें')
      ]
    };
  };

  const analyzeD16Chart = (planets: any) => {
    const venusStrength = planets?.VE?.shadbala || planets?.Venus?.shadbala || 50;
    const moonStrength = planets?.MO?.shadbala || planets?.Moon?.shadbala || 50;

    return {
      strength: venusStrength > 60 ? 'Strong' : 'Medium',
      keyPlanets: ['Venus', 'Moon', 'Mercury'],
      insights: [
        getTranslation('Luxury and comfort are within reach', 'विलासिता और आराम पहुंच के भीतर हैं'),
        getTranslation('Vehicle ownership brings happiness', 'वाहन स्वामित्व खुशी लाता है'),
        getTranslation('Material comforts support your well-being', 'भौतिक सुख आपकी कल्याण का समर्थन करते हैं')
      ],
      recommendations: [
        getTranslation('Appreciate and maintain your possessions', 'अपनी संपत्ति की सराहना करें और उसे बनाए रखें'),
        getTranslation('Share your comforts with family and friends', 'अपने सुख-सुविधाओं को परिवार और दोस्तों के साथ साझा करें')
      ]
    };
  };

  const analyzeD20Chart = (planets: any) => {
    const jupiterStrength = planets?.JU?.shadbala || planets?.Jupiter?.shadbala || 50;
    const sunStrength = planets?.SU?.shadbala || planets?.Sun?.shadbala || 50;

    return {
      strength: jupiterStrength > 65 ? 'Strong' : 'Medium',
      keyPlanets: ['Jupiter', 'Sun', 'Moon'],
      insights: [
        getTranslation('Natural inclination towards spirituality', 'आध्यात्म की ओर प्राकृतिक झुकाव'),
        getTranslation('Devotional practices bring inner peace', 'भक्ति अभ्यास आंतरिक शांति लाते हैं'),
        getTranslation('Teaching spiritual subjects comes naturally', 'आध्यात्मिक विषयों को सिखाना स्वाभाविक है')
      ],
      recommendations: [
        getTranslation('Develop a regular meditation practice', 'नियमित ध्यान अभ्यास विकसित करें'),
        getTranslation('Study sacred texts and spiritual literature', 'पवित्र ग्रंथों और आध्यात्मिक साहित्य का अध्ययन करें')
      ]
    };
  };

  const selectedChartData = useMemo(() => {
    return divisionalCharts.find(chart => chart.id === selectedChart);
  }, [selectedChart]);

  const analysisData = useMemo(() => {
    return generateDivisionalAnalysis(selectedChart);
  }, [selectedChart, kundaliData]);

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800',
      pink: 'bg-pink-50 border-pink-200 text-pink-800',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      gray: 'bg-gray-50 border-gray-200 text-gray-800',
      teal: 'bg-teal-50 border-teal-200 text-teal-800',
      violet: 'bg-violet-50 border-violet-200 text-violet-800'
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="space-y-6">
      <Card className="border-indigo-200">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle className="text-indigo-800 flex items-center gap-2">
            <Grid className="h-5 w-5" />
            {getTranslation('Enhanced Divisional Charts (D1-D20)', 'उन्नत विभागीय चार्ट (D1-D20)')}
          </CardTitle>
          <p className="text-sm text-indigo-600 mt-2">
            {getTranslation('Specialized charts revealing different aspects of life', 'जीवन के विभिन्न पहलुओं को प्रकट करने वाले विशेषज्ञ चार्ट')}
          </p>
        </CardHeader>
        <CardContent className="p-6">
          {/* Chart Selection Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            {divisionalCharts.map((chart) => {
              const IconComponent = chart.icon;
              const isSelected = selectedChart === chart.id;
              
              return (
                <Button
                  key={chart.id}
                  variant={isSelected ? "default" : "outline"}
                  className={`h-auto p-3 flex flex-col items-center gap-2 ${
                    isSelected 
                      ? 'bg-indigo-600 text-white border-indigo-600' 
                      : 'hover:bg-indigo-50 hover:border-indigo-300'
                  }`}
                  onClick={() => setSelectedChart(chart.id)}
                >
                  <IconComponent className="h-5 w-5" />
                  <div className="text-center">
                    <div className="font-semibold text-sm">{chart.id}</div>
                    <div className="text-xs opacity-75">
                      {chart.name.split(' - ')[1] || chart.name}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Selected Chart Analysis */}
          {selectedChartData && (
            <div className="space-y-6">
              {/* Chart Header */}
              <div className={`p-6 rounded-lg border ${getColorClasses(selectedChartData.color)}`}>
                <div className="flex items-center gap-3 mb-3">
                  <selectedChartData.icon className="h-6 w-6" />
                  <h3 className="text-xl font-bold">{selectedChartData.name}</h3>
                </div>
                <p className="text-sm opacity-80 mb-4">{selectedChartData.significance}</p>
                
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="px-3 py-1">
                    {getTranslation('Strength:', 'शक्ति:')} {analysisData.strength}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {getTranslation('Key Planets:', 'मुख्य ग्रह:')}
                    </span>
                    <div className="flex gap-1">
                      {analysisData.keyPlanets.slice(0, 3).map((planet, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {planet}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-green-200">
                  <CardHeader className="bg-green-50">
                    <CardTitle className="text-green-800 text-lg">
                      {getTranslation('Key Insights', 'मुख्य अंतर्दृष्टि')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <ul className="space-y-3">
                      {analysisData.insights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700 leading-relaxed">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-blue-200">
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="text-blue-800 text-lg">
                      {getTranslation('Recommendations', 'सुझाव')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <ul className="space-y-3">
                      {analysisData.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700 leading-relaxed">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Reference */}
              <Card className="border-gray-200 bg-gray-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    {getTranslation('Quick Reference Guide', 'त्वरित संदर्भ गाइड')}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    {divisionalCharts.slice(0, 6).map((chart) => (
                      <div key={chart.id} className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs px-2">
                          {chart.id}
                        </Badge>
                        <span className="text-gray-600 text-xs">
                          {chart.significance.split(',')[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedDivisionalChartsFixed;