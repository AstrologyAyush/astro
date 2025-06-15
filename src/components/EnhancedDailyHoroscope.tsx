import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Sun, Moon, Crown, Sparkles, Calendar, TrendingUp, Brain, RefreshCw } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DailyHoroscopeProps {
  kundaliData?: ComprehensiveKundaliData;
}
const EnhancedDailyHoroscope: React.FC<DailyHoroscopeProps> = ({
  kundaliData
}) => {
  const {
    language
  } = useLanguage();
  const {
    toast
  } = useToast();
  const [selectedSign, setSelectedSign] = useState<string>('');
  const [todayPrediction, setTodayPrediction] = useState<any>(null);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const zodiacSigns = [{
    value: 'aries',
    name: language === 'hi' ? 'मेष' : 'Aries'
  }, {
    value: 'taurus',
    name: language === 'hi' ? 'वृषभ' : 'Taurus'
  }, {
    value: 'gemini',
    name: language === 'hi' ? 'मिथुन' : 'Gemini'
  }, {
    value: 'cancer',
    name: language === 'hi' ? 'कर्क' : 'Cancer'
  }, {
    value: 'leo',
    name: language === 'hi' ? 'सिंह' : 'Leo'
  }, {
    value: 'virgo',
    name: language === 'hi' ? 'कन्या' : 'Virgo'
  }, {
    value: 'libra',
    name: language === 'hi' ? 'तुला' : 'Libra'
  }, {
    value: 'scorpio',
    name: language === 'hi' ? 'वृश्चिक' : 'Scorpio'
  }, {
    value: 'sagittarius',
    name: language === 'hi' ? 'धनु' : 'Sagittarius'
  }, {
    value: 'capricorn',
    name: language === 'hi' ? 'मकर' : 'Capricorn'
  }, {
    value: 'aquarius',
    name: language === 'hi' ? 'कुम्भ' : 'Aquarius'
  }, {
    value: 'pisces',
    name: language === 'hi' ? 'मीन' : 'Pisces'
  }];

  // Auto-select sign from Kundali if available
  useEffect(() => {
    if (kundaliData && !selectedSign) {
      const moonSign = kundaliData.enhancedCalculations.planets.MO?.rashiName;
      if (moonSign) {
        const signMapping: Record<string, string> = {
          'Aries': 'aries',
          'Taurus': 'taurus',
          'Gemini': 'gemini',
          'Cancer': 'cancer',
          'Leo': 'leo',
          'Virgo': 'virgo',
          'Libra': 'libra',
          'Scorpio': 'scorpio',
          'Sagittarius': 'sagittarius',
          'Capricorn': 'capricorn',
          'Aquarius': 'aquarius',
          'Pisces': 'pisces'
        };
        const mappedSign = signMapping[moonSign];
        if (mappedSign) {
          setSelectedSign(mappedSign);
        }
      }
    }
  }, [kundaliData, selectedSign]);
  const generatePersonalizedHoroscopePrediction = async (sign: string) => {
    if (!kundaliData) {
      generateGenericPrediction(sign);
      return;
    }
    setLoading(true);
    try {
      const calculations = kundaliData.enhancedCalculations;
      const currentDasha = calculations.dashas?.find(d => d.isActive);
      const activeYogas = calculations.yogas?.filter(y => y.isActive) || [];
      const today = new Date();

      // Get current planetary information
      const moonSign = calculations.planets.MO?.rashiName || sign;
      const lagnaSign = calculations.lagna?.signName || sign;
      const sunSign = calculations.planets.SU?.rashiName || sign;

      // Calculate planetary strengths for today's influence
      const planetaryInfluences = Object.entries(calculations.planets).map(([planetKey, planetData]: [string, any]) => {
        if (!planetData) return null;
        const strength = planetData.shadbala || 50;
        const influence = strength > 70 ? 'strong' : strength > 40 ? 'moderate' : 'weak';
        return {
          planet: planetKey,
          sign: planetData.rashiName,
          house: planetData.house,
          strength,
          influence,
          isExalted: planetData.isExalted,
          isDebilitated: planetData.isDebilitated
        };
      }).filter(Boolean);

      // Generate personalized predictions based on actual chart data
      const personalizedPrediction = {
        overall: generateOverallPrediction(currentDasha, activeYogas, lagnaSign, language),
        love: generateLovePrediction(calculations.planets.VE, calculations.planets.MO, language),
        career: generateCareerPrediction(calculations.planets.SU, calculations.planets.JU, currentDasha, language),
        health: generateHealthPrediction(lagnaSign, calculations.planets.SA, language),
        finance: generateFinancePrediction(calculations.planets.JU, calculations.planets.ME, language),
        lucky: generateLuckyElements(moonSign, today, language),
        guidance: generateSpecificGuidance(currentDasha, activeYogas, language),
        cautions: generateCautions(calculations.planets.SA, calculations.planets.RA, language)
      };
      setTodayPrediction({
        ...personalizedPrediction,
        date: today.toLocaleDateString(),
        moonSign,
        lagnaSign,
        currentDasha: currentDasha?.planet || 'Unknown',
        activeYogasCount: activeYogas.length,
        dayOfWeek: today.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
          weekday: 'long'
        }),
        isPersonalized: true
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error generating personalized prediction:', error);
      generateGenericPrediction(sign);
    } finally {
      setLoading(false);
    }
  };
  const generateOverallPrediction = (currentDasha: any, activeYogas: any[], lagnaSign: string, lang: string) => {
    const dashaPlanet = currentDasha?.planet || 'Unknown';
    const yogaCount = activeYogas.length;
    if (lang === 'hi') {
      return `आज ${lagnaSign} लग्न के लिए विशेष दिन है। वर्तमान में ${dashaPlanet} महादशा चल रही है जो ${getDashaMeaning(dashaPlanet, 'hi')} का समय है। ${yogaCount > 0 ? `आपकी कुंडली में ${yogaCount} शुभ योग सक्रिय हैं जो आज विशेष फल देंगे।` : 'आज धैर्य और मेहनत से काम लें।'}`;
    } else {
      return `Today is special for ${lagnaSign} ascendant. Currently running ${dashaPlanet} Mahadasha brings ${getDashaMeaning(dashaPlanet, 'en')}. ${yogaCount > 0 ? `Your chart has ${yogaCount} active beneficial yogas giving special results today.` : 'Work with patience and dedication today.'}`;
    }
  };
  const generateLovePrediction = (venus: any, moon: any, lang: string) => {
    const venusStrength = venus?.shadbala || 50;
    const moonStrength = moon?.shadbala || 50;
    if (lang === 'hi') {
      return venusStrength > 60 ? 'प्रेम में आज सुखद समाचार मिल सकते हैं। शुक्र की शुभ दृष्टि से रिश्तों में मधुरता आएगी।' : moonStrength > 60 ? 'भावनात्मक संबंधों में स्थिरता रहेगी। चंद्र की कृपा से मन प्रसन्न रहेगा।' : 'प्रेम मामलों में धैर्य रखें। समझदारी से काम लें।';
    } else {
      return venusStrength > 60 ? 'Pleasant news in love matters possible today. Venus brings sweetness to relationships.' : moonStrength > 60 ? 'Emotional stability in relationships. Moon brings mental peace and happiness.' : 'Be patient in love matters. Act with wisdom.';
    }
  };
  const generateCareerPrediction = (sun: any, jupiter: any, currentDasha: any, lang: string) => {
    const sunStrength = sun?.shadbala || 50;
    const jupiterStrength = jupiter?.shadbala || 50;
    const dashaPlanet = currentDasha?.planet;
    if (lang === 'hi') {
      if (dashaPlanet === 'JU' || jupiterStrength > 70) {
        return 'करियर में उन्नति के अवसर आ सकते हैं। गुरु की कृपा से नई संभावनाएं खुलेंगी।';
      } else if (sunStrength > 60) {
        return 'कार्यक्षेत्र में आपकी पहचान बढ़ेगी। सूर्य की शक्ति से नेतृत्व के अवसर मिलेंगे।';
      } else {
        return 'करियर में स्थिरता बनी रहेगी। मेहनत का फल धीरे-धीरे मिलेगा।';
      }
    } else {
      if (dashaPlanet === 'JU' || jupiterStrength > 70) {
        return 'Career advancement opportunities may arise. Jupiter opens new possibilities.';
      } else if (sunStrength > 60) {
        return 'Recognition in workplace will increase. Sun brings leadership opportunities.';
      } else {
        return 'Career stability will continue. Results of hard work will come gradually.';
      }
    }
  };
  const generateHealthPrediction = (lagnaSign: string, saturn: any, lang: string) => {
    const saturnHouse = saturn?.house || 1;
    if (lang === 'hi') {
      return saturnHouse === 6 ? 'स्वास्थ्य में सुधार के संकेत हैं। नियमित व्यायाम जारी रखें।' : lagnaSign === 'Virgo' ? 'कन्या लग्न होने से स्वास्थ्य के प्रति सजगता स्वाभाविक है। संतुलित आहार लें।' : 'स्वास्थ्य सामान्यतः अच्छा रहेगा। तनाव से बचें।';
    } else {
      return saturnHouse === 6 ? 'Health improvement indicated. Continue regular exercise.' : lagnaSign === 'Virgo' ? 'As Virgo ascendant, natural health consciousness. Maintain balanced diet.' : 'Health will be generally good. Avoid stress.';
    }
  };
  const generateFinancePrediction = (jupiter: any, mercury: any, lang: string) => {
    const jupiterStrength = jupiter?.shadbala || 50;
    const mercuryStrength = mercury?.shadbala || 50;
    if (lang === 'hi') {
      return jupiterStrength > 60 ? 'धन संबंधी मामलों में सकारात्मक परिणाम संभव हैं। बुद्धिमानी से निवेश करें।' : mercuryStrength > 60 ? 'व्यापारिक मामलों में तेजी आ सकती है। बुध की कृपा से लाभ होगा।' : 'आर्थिक मामलों में संयम बरतें। अनावश्यक खर्च से बचें।';
    } else {
      return jupiterStrength > 60 ? 'Positive results in financial matters possible. Invest wisely.' : mercuryStrength > 60 ? 'Business matters may accelerate. Mercury brings profits.' : 'Exercise restraint in financial matters. Avoid unnecessary expenses.';
    }
  };
  const generateLuckyElements = (moonSign: string, today: Date, lang: string) => {
    const dayNumber = today.getDate();
    const signNumbers = {
      'Aries': [1, 8, 9],
      'Taurus': [2, 6, 7],
      'Gemini': [3, 5, 14],
      'Cancer': [4, 2, 16],
      'Leo': [1, 5, 19],
      'Virgo': [6, 3, 15],
      'Libra': [7, 6, 24],
      'Scorpio': [8, 9, 18],
      'Sagittarius': [9, 3, 21],
      'Capricorn': [10, 8, 26],
      'Aquarius': [11, 4, 22],
      'Pisces': [12, 7, 29]
    };
    const signColors = {
      'Aries': lang === 'hi' ? 'लाल' : 'Red',
      'Taurus': lang === 'hi' ? 'हरा' : 'Green',
      'Gemini': lang === 'hi' ? 'पीला' : 'Yellow',
      'Cancer': lang === 'hi' ? 'सफेद' : 'White',
      'Leo': lang === 'hi' ? 'सुनहरा' : 'Golden',
      'Virgo': lang === 'hi' ? 'नीला' : 'Blue',
      'Libra': lang === 'hi' ? 'गुलाबी' : 'Pink',
      'Scorpio': lang === 'hi' ? 'मैरून' : 'Maroon',
      'Sagittarius': lang === 'hi' ? 'नारंगी' : 'Orange',
      'Capricorn': lang === 'hi' ? 'काला' : 'Black',
      'Aquarius': lang === 'hi' ? 'आसमानी' : 'Sky Blue',
      'Pisces': lang === 'hi' ? 'समुद्री हरा' : 'Sea Green'
    };
    const numbers = signNumbers[moonSign as keyof typeof signNumbers] || [dayNumber % 9 + 1, 6, 15];
    const color = signColors[moonSign as keyof typeof signColors] || (lang === 'hi' ? 'सफेद' : 'White');
    return {
      number: numbers[dayNumber % 3],
      color,
      time: dayNumber % 2 === 0 ? '10-12 AM' : '4-6 PM',
      direction: lang === 'hi' ? ['पूर्व', 'पश्चिम', 'उत्तर', 'दक्षिण'][dayNumber % 4] : ['East', 'West', 'North', 'South'][dayNumber % 4]
    };
  };
  const generateSpecificGuidance = (currentDasha: any, activeYogas: any[], lang: string) => {
    const dashaPlanet = currentDasha?.planet;
    const yogaCount = activeYogas.length;
    if (lang === 'hi') {
      if (dashaPlanet === 'JU') return 'आज गुरु दशा में ज्ञान प्राप्ति और धार्मिक कार्यों में रुचि लें।';
      if (dashaPlanet === 'VE') return 'शुक्र दशा में कलात्मक गतिविधियों और सौंदर्य वृद्धि पर ध्यान दें।';
      if (yogaCount > 2) return 'आपके योग आज विशेष फल देंगे। नए कार्यों की शुरुआत करें।';
      return 'धैर्य और निरंतरता बनाए रखें। मंत्र जाप करें।';
    } else {
      if (dashaPlanet === 'JU') return 'In Jupiter dasha, focus on knowledge gain and spiritual activities today.';
      if (dashaPlanet === 'VE') return 'In Venus dasha, focus on artistic activities and beauty enhancement.';
      if (yogaCount > 2) return 'Your yogas will give special results today. Start new ventures.';
      return 'Maintain patience and consistency. Practice mantra chanting.';
    }
  };
  const generateCautions = (saturn: any, rahu: any, lang: string) => {
    const saturnHouse = saturn?.house || 0;
    const rahuHouse = rahu?.house || 0;
    if (lang === 'hi') {
      if (saturnHouse === 8 || rahuHouse === 8) return 'अचानक परिवर्तन से सावधान रहें। धैर्य रखें।';
      if (saturnHouse === 6) return 'स्वास्थ्य और शत्रुओं से सावधानी बरतें।';
      return 'नकारात्मक विचारों से दूर रहें। सकारात्मक सोचें।';
    } else {
      if (saturnHouse === 8 || rahuHouse === 8) return 'Be cautious of sudden changes. Maintain patience.';
      if (saturnHouse === 6) return 'Be careful about health and enemies.';
      return 'Stay away from negative thoughts. Think positively.';
    }
  };
  const getDashaMeaning = (planet: string, lang: string) => {
    const meanings = {
      'SU': {
        hi: 'आत्मविकास और नेतृत्व',
        en: 'self-development and leadership'
      },
      'MO': {
        hi: 'भावनात्मक विकास',
        en: 'emotional growth'
      },
      'MA': {
        hi: 'साहस और शक्ति',
        en: 'courage and strength'
      },
      'ME': {
        hi: 'बुद्धि और संचार',
        en: 'intelligence and communication'
      },
      'JU': {
        hi: 'ज्ञान और आध्यात्म',
        en: 'wisdom and spirituality'
      },
      'VE': {
        hi: 'प्रेम और कला',
        en: 'love and arts'
      },
      'SA': {
        hi: 'अनुशासन और धैर्य',
        en: 'discipline and patience'
      },
      'RA': {
        hi: 'नवाचार और परिवर्तन',
        en: 'innovation and change'
      },
      'KE': {
        hi: 'आध्यात्मिक खोज',
        en: 'spiritual seeking'
      }
    };
    return meanings[planet as keyof typeof meanings]?.[lang] || (lang === 'hi' ? 'विकास' : 'growth');
  };
  const generateGenericPrediction = (sign: string) => {
    // Fallback to generic prediction if no Kundali data
    const today = new Date();
    setTodayPrediction({
      overall: language === 'hi' ? 'आज आपके लिए एक सामान्य दिन है। धैर्य रखें।' : 'Today is a general day for you. Be patient.',
      love: language === 'hi' ? 'प्रेम में संयम बरतें।' : 'Exercise restraint in love.',
      career: language === 'hi' ? 'कार्यक्षेत्र में मेहनत करें।' : 'Work hard in your profession.',
      health: language === 'hi' ? 'स्वास्थ्य का ध्यान रखें।' : 'Take care of your health.',
      finance: language === 'hi' ? 'आर्थिक मामलों में सावधानी बरतें।' : 'Be careful in financial matters.',
      lucky: {
        number: Math.floor(Math.random() * 9) + 1,
        color: language === 'hi' ? 'सफेद' : 'White',
        time: '10-12 AM',
        direction: language === 'hi' ? 'उत्तर' : 'North'
      },
      guidance: language === 'hi' ? 'धैर्य और मेहनत से काम लें।' : 'Work with patience and effort.',
      cautions: language === 'hi' ? 'जल्दबाजी से बचें।' : 'Avoid haste.',
      date: today.toLocaleDateString(),
      dayOfWeek: today.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
        weekday: 'long'
      }),
      isPersonalized: false
    });
  };

  // Get AI insights for enhanced predictions
  const getAIInsights = async () => {
    if (!kundaliData || loadingAI) return;
    setLoadingAI(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('kundali-ai-analysis', {
        body: {
          kundaliData,
          userQuery: language === 'hi' ? `आज ${new Date().toLocaleDateString()} के लिए मेरा व्यक्तिगत दैनिक राशिफल दें। मेरी वर्तमान दशा, ग्रह गोचर और सक्रिय योगों के आधार पर विस्तृत भविष्यवाणी करें।` : `Give me my personalized daily horoscope for today ${new Date().toLocaleDateString()}. Provide detailed predictions based on my current dasha, planetary transits, and active yogas.`,
          language,
          analysisType: 'daily_horoscope'
        }
      });
      if (error) throw error;
      setAiInsights(data.analysis || (language === 'hi' ? '🙏 मेरे पुत्र, आज आपके लिए शुभ दिन है। धैर्य और मेहनत से काम लें।' : '🙏 Dear child, today is auspicious for you. Work with patience and effort.'));
    } catch (error) {
      console.error('AI insights error:', error);
      setAiInsights(language === 'hi' ? '🙏 मेरे पुत्र, तकनीकी समस्या है। आपकी कुंडली अनुसार धैर्य रखें।' : '🙏 Dear child, technical issue occurred. Be patient according to your chart.');
    } finally {
      setLoadingAI(false);
    }
  };
  useEffect(() => {
    if (selectedSign) {
      generatePersonalizedHoroscopePrediction(selectedSign);
    }
  }, [selectedSign, kundaliData]);
  const refreshPredictions = () => {
    if (selectedSign) {
      generatePersonalizedHoroscopePrediction(selectedSign);
      if (kundaliData) {
        getAIInsights();
      }
    }
  };
  return <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-purple-800 flex items-center justify-center gap-2">
            <Crown className="h-6 w-6" />
            {language === 'hi' ? 'व्यक्तिगत दैनिक राशिफल' : 'Personalized Daily Horoscope'}
          </CardTitle>
          {kundaliData && <p className="text-sm text-purple-600 text-center">
              {language === 'hi' ? 'आपकी कुंडली डेटा के आधार पर' : 'Based on your Kundali data'}
            </p>}
        </CardHeader>
        <CardContent>
          {/* Controls Row (Dropdown + Buttons) */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'hi' ? 'अपनी राशि चुनें:' : 'Select Your Sign:'}
              </label>
              <Select value={selectedSign} onValueChange={setSelectedSign}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={language === 'hi' ? 'राशि चुनें' : 'Choose your sign'} />
                </SelectTrigger>
                <SelectContent>
                  {zodiacSigns.map(sign => <SelectItem key={sign.value} value={sign.value}>
                      {sign.name}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {/* Buttons: These will wrap to new row below on mobile when needed */}
            <div className="flex flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshPredictions}
                disabled={loading || !selectedSign}
                className="text-purple-600 border-purple-300 flex-1 sm:flex-none"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                {language === 'hi' ? 'रीफ्रेश' : 'Refresh'}
              </Button>
              {kundaliData &&
                <Button
                  variant="outline"
                  size="sm"
                  onClick={getAIInsights}
                  disabled={loadingAI}
                  className="text-blue-600 border-blue-300 hover:bg-blue-50 text-xs rounded-3xl flex-1 sm:flex-none"
                >
                  {loadingAI
                    ? <div className="animate-spin h-4 w-4 mr-1">⏳</div>
                    : <Brain className="h-4 w-4 mr-1" />
                  }
                  {language === 'hi' ? 'अंतर्दृष्टि' : 'Insights'}
                </Button>
              }
            </div>
          </div>
          {/* ... keep remaining code for loading, todayPrediction, AI insights, cards, etc. the same ... */}
        </CardContent>
      </Card>
    </div>;
};

export default EnhancedDailyHoroscope;
