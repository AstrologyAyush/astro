
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, Star, Crown, Sparkles, Brain, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DivisionalChartsProps {
  kundaliData: ComprehensiveKundaliData;
  language: 'hi' | 'en';
}

const DivisionalCharts: React.FC<DivisionalChartsProps> = ({ kundaliData, language }) => {
  const [selectedChart, setSelectedChart] = useState('D1');
  const [showInfo, setShowInfo] = useState(false);
  const [aiInsights, setAiInsights] = useState<{[key: string]: string}>({});
  const [loadingInsights, setLoadingInsights] = useState<{[key: string]: boolean}>({});
  const [chartAnalysis, setChartAnalysis] = useState<{[key: string]: any}>({});
  const { toast } = useToast();

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const divisionalChartInfo = {
    en: {
      'D1': {
        name: 'Rashi Chart (Birth Chart)',
        purpose: 'Overall personality, basic nature, and general life path',
        significance: 'Foundation chart showing your core essence and life direction',
        lifeArea: 'Complete Life Overview'
      },
      'D2': {
        name: 'Hora Chart (Wealth)',
        purpose: 'Financial prosperity, earning capacity, and wealth accumulation',
        significance: 'Shows your relationship with money and material resources',
        lifeArea: 'Wealth & Financial Prosperity'
      },
      'D3': {
        name: 'Drekkana Chart (Siblings)',
        purpose: 'Relationships with siblings, courage, and short journeys',
        significance: 'Reveals dynamics with brothers/sisters and personal bravery',
        lifeArea: 'Siblings & Courage'
      },
      'D4': {
        name: 'Chaturthamsa Chart (Fortune)',
        purpose: 'Property, real estate, vehicles, and fixed assets',
        significance: 'Indicates material possessions and family property',
        lifeArea: 'Property & Assets'
      },
      'D5': {
        name: 'Panchmansha Chart (Fame)',
        purpose: 'Intelligence, creativity, children, and recognition',
        significance: 'Shows intellectual abilities and creative potential',
        lifeArea: 'Intelligence & Children'
      },
      'D6': {
        name: 'Shashthamsa Chart (Health)',
        purpose: 'Health issues, diseases, enemies, and daily work',
        significance: 'Reveals health patterns and work environment',
        lifeArea: 'Health & Enemies'
      },
      'D7': {
        name: 'Saptamsa Chart (Children)',
        purpose: 'Progeny, fertility, and relationship with children',
        significance: 'Shows prospects of having children and their nature',
        lifeArea: 'Children & Fertility'
      },
      'D8': {
        name: 'Ashtamsa Chart (Longevity)',
        purpose: 'Lifespan, accidents, sudden events, and transformations',
        significance: 'Indicates life duration and major life changes',
        lifeArea: 'Longevity & Transformation'
      },
      'D9': {
        name: 'Navamsa Chart (Marriage)',
        purpose: 'Marriage, spouse, spiritual growth, and dharma',
        significance: 'Most important divisional chart for marriage and spirituality',
        lifeArea: 'Marriage & Dharma'
      },
      'D10': {
        name: 'Dasamsa Chart (Career)',
        purpose: 'Profession, career success, and social status',
        significance: 'Shows career path and professional achievements',
        lifeArea: 'Career & Profession'
      }
    },
    hi: {
      'D1': {
        name: 'राशि चक्र (जन्म कुंडली)',
        purpose: 'समग्र व्यक्तित्व, मूल प्रकृति और सामान्य जीवन पथ',
        significance: 'आपके मूल सार और जीवन दिशा को दर्शाने वाला आधार चार्ट',
        lifeArea: 'संपूर्ण जीवन अवलोकन'
      },
      'D2': {
        name: 'होरा चक्र (धन)',
        purpose: 'वित्तीय समृद्धि, कमाई की क्षमता और धन संचय',
        significance: 'पैसे और भौतिक संसाधनों के साथ आपका संबंध दिखाता है',
        lifeArea: 'धन और वित्तीय समृद्धि'
      },
      'D3': {
        name: 'द्रेष्काण चक्र (भाई-बहन)',
        purpose: 'भाई-बहनों के साथ संबंध, साहस और छोटी यात्राएं',
        significance: 'भाई-बहनों के साथ गतिशीलता और व्यक्तिगत वीरता प्रकट करता है',
        lifeArea: 'भाई-बहन और साहस'
      },
      'D4': {
        name: 'चतुर्थांश चक्र (भाग्य)',
        purpose: 'संपत्ति, अचल संपत्ति, वाहन और स्थिर संपत्ति',
        significance: 'भौतिक संपत्ति और पारिवारिक संपत्ति का संकेत देता है',
        lifeArea: 'संपत्ति और संपदा'
      },
      'D5': {
        name: 'पंचमांश चक्र (यश)',
        purpose: 'बुद्धि, रचनात्मकता, संतान और पहचान',
        significance: 'बौद्धिक क्षमताओं और रचनात्मक क्षमता को दिखाता है',
        lifeArea: 'बुद्धि और संतान'
      },
      'D6': {
        name: 'षष्ठांश चक्र (स्वास्थ्य)',
        purpose: 'स्वास्थ्य समस्याएं, रोग, शत्रु और दैनिक कार्य',
        significance: 'स्वास्थ्य पैटर्न और कार्य वातावरण को प्रकट करता है',
        lifeArea: 'स्वास्थ्य और शत्रु'
      },
      'D7': {
        name: 'सप्तमांश चक्र (संतान)',
        purpose: 'संतति, प्रजनन क्षमता और बच्चों के साथ संबंध',
        significance: 'बच्चे होने की संभावना और उनकी प्रकृति दिखाता है',
        lifeArea: 'संतान और प्रजनन'
      },
      'D8': {
        name: 'अष्टमांश चक्र (आयु)',
        purpose: 'जीवनकाल, दुर्घटनाएं, अचानक घटनाएं और परिवर्तन',
        significance: 'जीवन की अवधि और प्रमुख जीवन परिवर्तनों का संकेत देता है',
        lifeArea: 'आयु और परिवर्तन'
      },
      'D9': {
        name: 'नवमांश चक्र (विवाह)',
        purpose: 'विवाह, जीवनसाथी, आध्यात्मिक विकास और धर्म',
        significance: 'विवाह और आध्यात्मिकता के लिए सबसे महत्वपूर्ण विभागीय चार्ट',
        lifeArea: 'विवाह और धर्म'
      },
      'D10': {
        name: 'दशमांश चक्र (करियर)',
        purpose: 'पेशा, करियर सफलता और सामाजिक स्थिति',
        significance: 'करियर पथ और व्यावसायिक उपलब्धियों को दिखाता है',
        lifeArea: 'करियर और पेशा'
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

  const planets = kundaliData.enhancedCalculations?.planets || {};

  const generateDivisionalChart = (division: number) => {
    const houses = Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      rashi: rashiNames[language][i],
      planets: [] as { key: string; symbol: string; name: string; color: string; degree: number; dignity: string }[]
    }));

    Object.entries(planets).forEach(([planetKey, planetData]: [string, any]) => {
      if (planetData && typeof planetData.longitude === 'number') {
        let adjustedLongitude = planetData.longitude;
        
        // Calculate divisional chart positions more accurately
        switch (division) {
          case 2: // Hora
            adjustedLongitude = (planetData.longitude % 30) < 15 ? 0 : 15;
            break;
          case 3: // Drekkana
            adjustedLongitude = Math.floor((planetData.longitude % 30) / 10) * 10;
            break;
          case 4: // Chaturthamsa
            adjustedLongitude = Math.floor((planetData.longitude % 30) / 7.5) * 7.5;
            break;
          case 9: // Navamsa
            adjustedLongitude = (planetData.longitude % 3.333) * 9;
            break;
          case 10: // Dasamsa
            adjustedLongitude = (planetData.longitude % 3) * 10;
            break;
          default:
            adjustedLongitude = (planetData.longitude % (30 / division)) * division;
        }
        
        const houseNumber = Math.floor(adjustedLongitude / 30) + 1;
        const degree = adjustedLongitude % 30;
        const houseIndex = ((houseNumber - 1) % 12);
        
        if (houseIndex >= 0 && houseIndex < 12 && planetSymbols[planetKey as keyof typeof planetSymbols]) {
          const planetInfo = planetSymbols[planetKey as keyof typeof planetSymbols];
          
          // Determine planetary dignity in divisional chart
          let dignity = 'neutral';
          if (planetData.isExalted) dignity = 'exalted';
          else if (planetData.isDebilitated) dignity = 'debilitated';
          else if (planetData.isOwnSign) dignity = 'own';
          else if (planetData.isFriendSign) dignity = 'friend';
          else if (planetData.isEnemySign) dignity = 'enemy';
          
          houses[houseIndex].planets.push({
            key: planetKey,
            symbol: planetInfo.symbol,
            name: planetInfo.name,
            color: planetInfo.color,
            degree: parseFloat(degree.toFixed(1)),
            dignity
          });
        }
      }
    });

    return houses;
  };

  const analyzeChart = (chartKey: string, chartData: any[]) => {
    const analysis = {
      strongPlanets: [] as string[],
      weakPlanets: [] as string[],
      significantHouses: [] as number[],
      specialYogas: [] as string[],
      recommendations: [] as string[]
    };

    // Analyze planetary strengths in this chart
    chartData.forEach(house => {
      house.planets.forEach((planet: any) => {
        if (planet.dignity === 'exalted' || planet.dignity === 'own') {
          analysis.strongPlanets.push(planet.name);
        } else if (planet.dignity === 'debilitated' || planet.dignity === 'enemy') {
          analysis.weakPlanets.push(planet.name);
        }
      });
      
      if (house.planets.length > 2) {
        analysis.significantHouses.push(house.number);
      }
    });

    // Generate chart-specific recommendations
    const chartType = parseInt(chartKey.substring(1));
    switch (chartType) {
      case 1:
        analysis.recommendations.push(language === 'hi' ? 'मुख्य कुंडली के अनुसार अपने स्वभाव पर कार्य करें' : 'Work on your personality as per main chart');
        break;
      case 2:
        analysis.recommendations.push(language === 'hi' ? 'धन संचय के लिए बुध और गुरु का आशीर्वाद लें' : 'Seek blessings of Mercury and Jupiter for wealth');
        break;
      case 9:
        analysis.recommendations.push(language === 'hi' ? 'वैवाहिक जीवन के लिए शुक्र और गुरु की पूजा करें' : 'Worship Venus and Jupiter for married life');
        break;
      case 10:
        analysis.recommendations.push(language === 'hi' ? 'करियर के लिए सूर्य और शनि को प्रसन्न करें' : 'Please Sun and Saturn for career');
        break;
    }

    setChartAnalysis(prev => ({ ...prev, [chartKey]: analysis }));
    return analysis;
  };

  const getEnhancedAIInsights = async (chartKey: string) => {
    if (aiInsights[chartKey] || loadingInsights[chartKey]) return;

    setLoadingInsights(prev => ({ ...prev, [chartKey]: true }));

    try {
      const chartData = generateDivisionalChart(parseInt(chartKey.substring(1)));
      const chartInfo = divisionalChartInfo[language][chartKey as keyof typeof divisionalChartInfo.en];
      const analysis = analyzeChart(chartKey, chartData);
      
      // Create enhanced prompt with chart analysis
      const chartContext = `
Chart: ${chartKey} - ${chartInfo.name}
Life Area: ${chartInfo.lifeArea}
Strong Planets: ${analysis.strongPlanets.join(', ') || 'None identified'}
Weak Planets: ${analysis.weakPlanets.join(', ') || 'None identified'}
Significant Houses: ${analysis.significantHouses.join(', ') || 'None'}

Planetary Positions in ${chartKey}:
${chartData.map(house => 
  `House ${house.number} (${house.rashi}): ${house.planets.map(p => `${p.name} ${p.degree}° [${p.dignity}]`).join(', ') || 'Empty'}`
).join('\n')}
`;

      const userQuery = language === 'hi' 
        ? `मेरे ${chartKey} चार्ट (${chartInfo.name}) का गहरा विश्लेषण करें। इस चार्ट में मेरे ग्रहों की स्थिति के आधार पर ${chartInfo.lifeArea} के लिए व्यक्तिगत मार्गदर्शन दें। कृपया निम्नलिखित पर विशेष ध्यान दें:

1. इस चार्ट में मजबूत और कमजोर ग्रह
2. ${chartInfo.purpose} के लिए विशिष्ट भविष्यवाणियां
3. व्यावहारिक सुझाव और उपाय
4. समय और अवसरों की जानकारी
5. सावधानियां और चुनौतियां

Chart Details: ${chartContext}`
        : `Please provide deep analysis of my ${chartKey} chart (${chartInfo.name}). Based on my planetary positions in this chart, give personalized guidance for ${chartInfo.lifeArea}. Please focus on:

1. Strong and weak planets in this chart
2. Specific predictions for ${chartInfo.purpose}
3. Practical suggestions and remedies
4. Timing and opportunities information
5. Cautions and challenges

Chart Details: ${chartContext}`;

      const { data, error } = await supabase.functions.invoke('kundali-ai-analysis', {
        body: {
          kundaliData,
          userQuery,
          language,
          analysisType: 'divisional_chart'
        }
      });

      if (error) throw error;

      const enhancedAnalysis = data.analysis || generateFallbackChartAnalysis(chartKey, chartInfo, analysis, language);
      
      setAiInsights(prev => ({ 
        ...prev, 
        [chartKey]: enhancedAnalysis
      }));

      toast({
        title: getTranslation('Analysis Complete', 'विश्लेषण पूर्ण'),
        description: getTranslation(`${chartKey} chart analysis updated`, `${chartKey} चार्ट विश्लेषण अपडेट हुआ`),
      });

    } catch (error) {
      console.error('AI insights error:', error);
      const chartInfo = divisionalChartInfo[language][chartKey as keyof typeof divisionalChartInfo.en];
      const fallbackAnalysis = generateFallbackChartAnalysis(chartKey, chartInfo, chartAnalysis[chartKey], language);
      
      setAiInsights(prev => ({ 
        ...prev, 
        [chartKey]: fallbackAnalysis
      }));

      toast({
        title: getTranslation('Analysis Generated', 'विश्लेषण तैयार'),
        description: getTranslation('Fallback analysis provided', 'वैकल्पिक विश्लेषण प्रदान किया गया'),
        variant: "default",
      });
    } finally {
      setLoadingInsights(prev => ({ ...prev, [chartKey]: false }));
    }
  };

  const generateFallbackChartAnalysis = (chartKey: string, chartInfo: any, analysis: any, lang: string) => {
    if (lang === 'hi') {
      return `🙏 मेरे पुत्र, आपके ${chartKey} चार्ट का विश्लेषण:

**${chartInfo.lifeArea} के लिए मुख्य अंतर्दृष्टि:**
${chartInfo.significance}

**मजबूत पहलू:** ${analysis?.strongPlanets.length > 0 ? analysis.strongPlanets.join(', ') + ' आपको शक्ति देते हैं।' : 'आपके चार्ट में संतुलन है।'}

**विकास के क्षेत्र:** ${analysis?.weakPlanets.length > 0 ? analysis.weakPlanets.join(', ') + ' को मजबूत बनाने पर ध्यान दें।' : 'निरंतर सुधार जारी रखें।'}

**व्यावहारिक मार्गदर्शन:** 
- नियमित पूजा-पाठ करें
- अपने कर्मों पर ध्यान दें  
- धैर्य और निरंतरता बनाए रखें

**समय:** यह प्रभाव जीवनभर चलता रहेगा और महत्वपूर्ण अवसरों पर विशेष फल देगा।

मेरा आशीर्वाद आपके साथ है। 🕉️`;
    } else {
      return `🙏 Dear child, analysis of your ${chartKey} chart:

**Main Insights for ${chartInfo.lifeArea}:**
${chartInfo.significance}

**Strong Aspects:** ${analysis?.strongPlanets.length > 0 ? analysis.strongPlanets.join(', ') + ' give you strength.' : 'Your chart shows balance.'}

**Growth Areas:** ${analysis?.weakPlanets.length > 0 ? 'Focus on strengthening ' + analysis.weakPlanets.join(', ') + '.' : 'Continue consistent improvement.'}

**Practical Guidance:**
- Practice regular worship and meditation
- Focus on your actions and karma
- Maintain patience and consistency

**Timing:** This influence continues throughout life and gives special results during important opportunities.

My blessings are with you. 🕉️`;
    }
  };

  const chartKeys = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'];
  const currentChartInfo = divisionalChartInfo[language][selectedChart as keyof typeof divisionalChartInfo.en];
  const currentAnalysis = chartAnalysis[selectedChart];

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
                className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white font-medium relative"
              >
                {chart}
                {aiInsights[chart] && (
                  <CheckCircle className="h-3 w-3 text-green-500 absolute -top-1 -right-1" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Enhanced Chart Information Panel */}
          <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between mb-3">
              <div className="space-y-1">
                <Badge variant="outline" className="text-orange-700 border-orange-300 bg-white font-semibold">
                  {currentChartInfo.name}
                </Badge>
                <p className="text-sm text-orange-600">{currentChartInfo.lifeArea}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInfo(!showInfo)}
                  className="text-orange-600 border-orange-300"
                >
                  <Info className="h-4 w-4 mr-1" />
                  {getTranslation('Info', 'जानकारी')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => getEnhancedAIInsights(selectedChart)}
                  disabled={loadingInsights[selectedChart]}
                  className="text-purple-600 border-purple-300 hover:bg-purple-50"
                >
                  {loadingInsights[selectedChart] ? (
                    <div className="animate-spin h-4 w-4 mr-1">⏳</div>
                  ) : (
                    <Brain className="h-4 w-4 mr-1" />
                  )}
                  {getTranslation('Enhanced AI Analysis', 'उन्नत AI विश्लेषण')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const chartData = generateDivisionalChart(parseInt(selectedChart.substring(1)));
                    analyzeChart(selectedChart, chartData);
                    toast({
                      title: getTranslation('Chart Analyzed', 'चार्ट विश्लेषित'),
                      description: getTranslation('Chart analysis refreshed', 'चार्ट विश्लेषण रीफ्रेश हुआ'),
                    });
                  }}
                  className="text-blue-600 border-blue-300"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  {getTranslation('Analyze', 'विश्लेषण')}
                </Button>
              </div>
            </div>
            
            {showInfo && (
              <div className="space-y-2 text-sm mb-4 p-3 bg-white rounded border border-orange-200">
                <p><strong>{getTranslation('Purpose:', 'उद्देश्य:')}</strong> {currentChartInfo.purpose}</p>
                <p><strong>{getTranslation('Significance:', 'महत्व:')}</strong> {currentChartInfo.significance}</p>
              </div>
            )}

            {/* Quick Analysis Summary */}
            {currentAnalysis && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {currentAnalysis.strongPlanets.length > 0 && (
                  <div className="p-2 bg-green-50 rounded border border-green-200">
                    <p className="text-xs font-semibold text-green-800 mb-1">
                      {getTranslation('Strong Planets', 'मजबूत ग्रह')}
                    </p>
                    <p className="text-xs text-green-700">{currentAnalysis.strongPlanets.join(', ')}</p>
                  </div>
                )}
                
                {currentAnalysis.weakPlanets.length > 0 && (
                  <div className="p-2 bg-orange-50 rounded border border-orange-200">
                    <p className="text-xs font-semibold text-orange-800 mb-1">
                      {getTranslation('Growth Areas', 'विकास क्षेत्र')}
                    </p>
                    <p className="text-xs text-orange-700">{currentAnalysis.weakPlanets.join(', ')}</p>
                  </div>
                )}
                
                {currentAnalysis.significantHouses.length > 0 && (
                  <div className="p-2 bg-blue-50 rounded border border-blue-200">
                    <p className="text-xs font-semibold text-blue-800 mb-1">
                      {getTranslation('Active Houses', 'सक्रिय भाव')}
                    </p>
                    <p className="text-xs text-blue-700">{currentAnalysis.significantHouses.join(', ')}</p>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced AI Insights Section */}
            {aiInsights[selectedChart] && (
              <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {getTranslation('Personalized AI Insights', 'व्यक्तिगत AI अंतर्दृष्टि')}
                  <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">
                    {selectedChart}
                  </Badge>
                </h4>
                <div className="text-sm text-purple-700 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {aiInsights[selectedChart]}
                </div>
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
                      } ${house.planets.length > 2 ? 'ring-2 ring-purple-300' : ''}`}
                    >
                      {/* House Number */}
                      <div className="absolute top-1 left-1 text-xs font-bold text-orange-800 bg-orange-200 rounded-full w-5 h-5 flex items-center justify-center">
                        {house.number}
                      </div>
                      
                      {/* Rashi Name */}
                      <div className="text-xs text-gray-600 mb-2 mt-2 font-medium">
                        {house.rashi}
                      </div>
                      
                      {/* Planets with Dignities */}
                      <div className="space-y-1 min-h-[60px] flex flex-col justify-center">
                        {house.planets.length > 0 ? (
                          house.planets.map((planet, planetIndex) => (
                            <div key={planetIndex} className="flex flex-col items-center">
                              <div className={`text-lg font-bold ${planet.color} drop-shadow-sm relative`}>
                                {planet.symbol}
                                {/* Dignity indicator */}
                                {planet.dignity === 'exalted' && <span className="absolute -top-1 -right-1 text-[8px] text-yellow-600">↑</span>}
                                {planet.dignity === 'debilitated' && <span className="absolute -top-1 -right-1 text-[8px] text-red-600">↓</span>}
                                {planet.dignity === 'own' && <span className="absolute -top-1 -right-1 text-[8px] text-green-600">●</span>}
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

                {/* Enhanced Planet Legend */}
                <div className="bg-white p-4 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    {getTranslation('Planet Legend & Dignities', 'ग्रह सूची और स्थितियां')}
                  </h4>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-3">
                    {Object.entries(planetSymbols).map(([key, planet]) => (
                      <div key={key} className="flex items-center gap-2 text-sm">
                        <span className={`text-lg font-bold ${planet.color}`}>
                          {planet.symbol}
                        </span>
                        <span className="text-gray-700">{planet.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p><strong>{getTranslation('Dignity Indicators:', 'स्थिति संकेतक:')}</strong></p>
                    <p>↑ = {getTranslation('Exalted', 'उच्च')} | ↓ = {getTranslation('Debilitated', 'नीच')} | ● = {getTranslation('Own Sign', 'स्वराशि')}</p>
                  </div>
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
