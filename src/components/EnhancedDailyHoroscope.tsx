import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Star, Heart, Briefcase, DollarSign, Activity, Sparkles } from "lucide-react";

interface EnhancedDailyHoroscopeProps {
  kundaliData?: any;
  language: 'hi' | 'en';
}

const EnhancedDailyHoroscope: React.FC<EnhancedDailyHoroscopeProps> = ({ kundaliData, language }) => {
  const [horoscope, setHoroscope] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (kundaliData) {
      generatePersonalizedHoroscope();
    } else {
      generateGenericHoroscope();
    }
  }, [kundaliData]);

  const generatePersonalizedHoroscope = async () => {
    if (!kundaliData) return;
    
    setLoading(true);
    try {
      const today = new Date();
      
      // Use actual Kundali data for personalized predictions
      const moonSign = kundaliData.planets?.find((p: any) => p.name === 'Moon')?.sign || 'Aries';
      const ascendant = kundaliData.lagna?.sign || 'Aries';
      const strongestPlanet = findStrongestPlanet(kundaliData.planets || []);
      const currentDasha = kundaliData.dashas?.find((d: any) => d.isActive)?.planet || 'Sun';
      
      const predictions = {
        overall: generatePersonalizedPrediction(moonSign, ascendant, strongestPlanet, currentDasha, language),
        career: generateCareerPrediction(ascendant, strongestPlanet, language),
        finance: generateFinancePrediction(moonSign, currentDasha, language),
        health: generateHealthPrediction(ascendant, language),
        relationships: generateRelationshipPrediction(moonSign, language)
      };

      const ratings = calculatePersonalizedRatings(kundaliData);

      setHoroscope({
        date: today.toLocaleDateString(),
        moonSign,
        ascendant,
        strongestPlanet: strongestPlanet.name,
        currentDasha,
        predictions,
        ratings,
        luckyNumbers: generateLuckyNumbers(kundaliData),
        luckyColors: generateLuckyColors(strongestPlanet.name),
        auspiciousTime: generateAuspiciousTime(currentDasha),
        isPersonalized: true
      });
    } catch (error) {
      console.error('Error generating personalized horoscope:', error);
      generateGenericHoroscope();
    } finally {
      setLoading(false);
    }
  };

  const generateGenericHoroscope = () => {
    const today = new Date();
    const genericSign = 'Aries'; // Default for demo
    
    const predictions = {
      overall: language === 'hi' 
        ? "आज आपके लिए मिश्रित फल है। सकारात्मक दृष्टिकोण बनाए रखें।"
        : "Today brings mixed results. Maintain a positive outlook.",
      career: language === 'hi'
        ? "कार्यक्षेत्र में नई संभावनाएं हो सकती हैं।"
        : "New opportunities may arise in your professional sphere.",
      finance: language === 'hi'
        ? "वित्तीय मामलों में सावधानी बरतें।"
        : "Exercise caution in financial matters.",
      health: language === 'hi'
        ? "स्वास्थ्य का ध्यान रखें और पर्याप्त आराम करें।"
        : "Take care of your health and get adequate rest.",
      relationships: language === 'hi'
        ? "रिश्तों में धैर्य और समझदारी दिखाएं।"
        : "Show patience and understanding in relationships."
    };

    setHoroscope({
      date: today.toLocaleDateString(),
      moonSign: genericSign,
      predictions,
      ratings: {
        overall: 7,
        career: 6,
        finance: 5,
        health: 8,
        relationships: 7
      },
      luckyNumbers: [3, 7, 21],
      luckyColors: ['Blue', 'Green'],
      auspiciousTime: '10:30 AM - 12:30 PM',
      isPersonalized: false
    });
  };

  const findStrongestPlanet = (planets: any[]) => {
    let strongest = { name: 'Sun', strength: 0 };
    planets.forEach(planet => {
      if (planet.shadbala && planet.shadbala > strongest.strength) {
        strongest = { name: planet.name, strength: planet.shadbala };
      }
    });
    return strongest;
  };

  const generatePersonalizedPrediction = (moonSign: string, ascendant: string, strongestPlanet: any, currentDasha: string, lang: 'hi' | 'en') => {
    const predictions = {
      en: [
        `With your Moon in ${moonSign} and ${strongestPlanet.name} being your strongest planet, today brings focus on ${getLifeArea(strongestPlanet.name)}.`,
        `Your ${ascendant} ascendant suggests that taking initiative will be beneficial today.`,
        `The current ${currentDasha} dasha period influences your daily activities positively.`,
        `Planetary alignments favor your natural strengths in ${getStrengthArea(moonSign)}.`
      ],
      hi: [
        `आपका चंद्र ${moonSign} में है और ${strongestPlanet.name} आपका सबसे शक्तिशाली ग्रह है, आज ${getLifeAreaHindi(strongestPlanet.name)} पर ध्यान दें।`,
        `आपका ${ascendant} लग्न सुझाता है कि आज पहल करना लाभकारी होगा।`,
        `वर्तमान ${currentDasha} दशा काल आपकी दैनिक गतिविधियों को सकारात्मक रूप से प्रभावित करता है।`,
        `ग्रहों की स्थिति आपकी प्राकृतिक शक्तियों का समर्थन करती है।`
      ]
    };
    return predictions[lang][Math.floor(Math.random() * predictions[lang].length)];
  };

  const calculatePersonalizedRatings = (kundaliData: any) => {
    const baseRating = 5;
    const strongPlanets = kundaliData.planets?.filter((p: any) => p.shadbala > 70).length || 0;
    const yogaCount = kundaliData.yogas?.filter((y: any) => y.present).length || 0;
    
    return {
      overall: Math.min(10, baseRating + Math.floor(strongPlanets / 2) + Math.floor(yogaCount / 3)),
      career: Math.min(10, baseRating + Math.floor(yogaCount / 2)),
      finance: Math.min(10, baseRating + Math.floor(strongPlanets / 3)),
      health: Math.min(10, baseRating + Math.floor(strongPlanets / 2)),
      relationships: Math.min(10, baseRating + Math.floor(yogaCount / 2))
    };
  };

  const generateLuckyNumbers = (kundaliData: any) => {
    if (!kundaliData) return [3, 7, 21];
    
    const moonDegree = Math.floor(kundaliData.planets?.find((p: any) => p.name === 'Moon')?.degree || 0);
    const ascendantDegree = Math.floor(kundaliData.lagna?.degree || 0);
    
    return [
      (moonDegree % 9) + 1,
      (ascendantDegree % 9) + 1,
      ((moonDegree + ascendantDegree) % 9) + 1
    ];
  };

  const generateLuckyColors = (strongestPlanet: string) => {
    const planetColors: { [key: string]: string[] } = {
      'Sun': ['Orange', 'Gold'],
      'Moon': ['White', 'Silver'],
      'Mars': ['Red', 'Maroon'],
      'Mercury': ['Green', 'Yellow'],
      'Jupiter': ['Yellow', 'Orange'],
      'Venus': ['White', 'Pink'],
      'Saturn': ['Blue', 'Black'],
      'Rahu': ['Grey', 'Brown'],
      'Ketu': ['Grey', 'Brown']
    };
    return planetColors[strongestPlanet] || ['Blue', 'Green'];
  };

  const generateAuspiciousTime = (currentDasha: string) => {
    const dashaTimes: { [key: string]: string } = {
      'Sun': '6:00 AM - 8:00 AM',
      'Moon': '6:00 PM - 8:00 PM',
      'Mars': '12:00 PM - 2:00 PM',
      'Mercury': '10:00 AM - 12:00 PM',
      'Jupiter': '8:00 AM - 10:00 AM',
      'Venus': '2:00 PM - 4:00 PM',
      'Saturn': '4:00 PM - 6:00 PM'
    };
    return dashaTimes[currentDasha] || '10:00 AM - 12:00 PM';
  };

  const getLifeArea = (planet: string): string => {
    const areas: { [key: string]: string } = {
      'Sun': 'leadership and authority',
      'Moon': 'emotions and intuition', 
      'Mars': 'energy and action',
      'Mercury': 'communication and learning',
      'Jupiter': 'wisdom and growth',
      'Venus': 'relationships and creativity',
      'Saturn': 'discipline and responsibility'
    };
    return areas[planet] || 'personal growth';
  };

  const getLifeAreaHindi = (planet: string): string => {
    const areas: { [key: string]: string } = {
      'Sun': 'नेतृत्व और अधिकार',
      'Moon': 'भावनाएं और अंतर्ज्ञान',
      'Mars': 'ऊर्जा और कार्य',
      'Mercury': 'संवाद और शिक्षा',
      'Jupiter': 'ज्ञान और विकास',
      'Venus': 'रिश्ते और रचनात्मकता',
      'Saturn': 'अनुशासन और जिम्मेदारी'
    };
    return areas[planet] || 'व्यक्तिगत विकास';
  };

  const getStrengthArea = (moonSign: string): string => {
    // Simplified mapping - in real implementation, use comprehensive moon sign characteristics
    return 'emotional intelligence and intuitive decision-making';
  };

  const generateCareerPrediction = (ascendant: string, strongestPlanet: any, lang: 'hi' | 'en'): string => {
    const predictions = {
      en: [
        "Professional opportunities may present themselves today.",
        "Your leadership qualities will be recognized at work.",
        "Focus on collaborative projects for best results.",
        "A creative approach to work challenges will pay off."
      ],
      hi: [
        "आज पेशेवर अवसर आपके सामने आ सकते हैं।",
        "कार्यक्षेत्र में आपके नेतृत्व गुणों की पहचान होगी।",
        "सर्वोत्तम परिणामों के लिए सहयोगी परियोजनाओं पर ध्यान दें।",
        "कार्य चुनौतियों के लिए रचनात्मक दृष्टिकोण फलदायी होगा।"
      ]
    };
    return predictions[lang][Math.floor(Math.random() * predictions[lang].length)];
  };

  const generateFinancePrediction = (moonSign: string, currentDasha: string, lang: 'hi' | 'en'): string => {
    const predictions = {
      en: [
        "Financial stability is indicated by current planetary positions.",
        "Avoid major investments today, stick to planned expenses.",
        "A small financial gain is possible through hard work.",
        "Review your budget and make necessary adjustments."
      ],
      hi: [
        "वर्तमान ग्रह स्थितियों से वित्तीय स्थिरता का संकेत मिलता है।",
        "आज बड़े निवेश से बचें, नियोजित खर्चों पर टिके रहें।",
        "कड़ी मेहनत से छोटा वित्तीय लाभ संभव है।",
        "अपने बजट की समीक्षा करें और आवश्यक समायोजन करें।"
      ]
    };
    return predictions[lang][Math.floor(Math.random() * predictions[lang].length)];
  };

  const generateHealthPrediction = (ascendant: string, lang: 'hi' | 'en'): string => {
    const predictions = {
      en: [
        "Pay attention to your mental health and stress levels.",
        "Physical exercise will boost your energy today.",
        "Stay hydrated and maintain a balanced diet.",
        "Some minor health issue may need attention."
      ],
      hi: [
        "अपने मानसिक स्वास्थ्य और तनाव के स्तर पर ध्यान दें।",
        "शारीरिक व्यायाम आज आपकी ऊर्जा बढ़ाएगा।",
        "हाइड्रेटेड रहें और संतुलित आहार बनाए रखें।",
        "कुछ मामूली स्वास्थ्य समस्या पर ध्यान देने की आवश्यकता हो सकती है।"
      ]
    };
    return predictions[lang][Math.floor(Math.random() * predictions[lang].length)];
  };

  const generateRelationshipPrediction = (moonSign: string, lang: 'hi' | 'en'): string => {
    const predictions = {
      en: [
        "Relationships may require extra patience and understanding today.",
        "A conversation with a loved one will bring clarity.",
        "Social gatherings may present new connection opportunities.",
        "Express your feelings openly for better harmony."
      ],
      hi: [
        "रिश्तों में आज अतिरिक्त धैर्य और समझ की आवश्यकता हो सकती है।",
        "किसी प्रिय व्यक्ति के साथ बातचीत स्पष्टता लाएगी।",
        "सामाजिक समारोह नए संपर्क के अवसर प्रस्तुत कर सकते हैं।",
        "बेहतर सामंजस्य के लिए अपनी भावनाओं को खुले में व्यक्त करें।"
      ]
    };
    return predictions[lang][Math.floor(Math.random() * predictions[lang].length)];
  };

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>{language === 'hi' ? 'व्यक्तिगत राशिफल तैयार हो रहा है...' : 'Generating personalized horoscope...'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!horoscope) {
    return (
      <div className="w-full max-w-md mx-auto p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p>{language === 'hi' ? 'राशिफल उपलब्ध नहीं है' : 'Horoscope not available'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" />
            {language === 'hi' ? 'आज का राशिफल' : 'Today\'s Horoscope'}
            {horoscope.isPersonalized && (
              <Badge className="bg-orange-100 text-orange-700 ml-2">
                <Sparkles className="h-3 w-3 mr-1" />
                {language === 'hi' ? 'व्यक्तिगत' : 'Personalized'}
              </Badge>
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{horoscope.date}</p>
          {horoscope.isPersonalized && (
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {language === 'hi' ? 'चंद्र राशि' : 'Moon'}: {horoscope.moonSign}
              </Badge>
              {horoscope.ascendant && (
                <Badge variant="outline" className="text-xs">
                  {language === 'hi' ? 'लग्न' : 'Asc'}: {horoscope.ascendant}
                </Badge>
              )}
              {horoscope.currentDasha && (
                <Badge variant="outline" className="text-xs">
                  {language === 'hi' ? 'दशा' : 'Dasha'}: {horoscope.currentDasha}
                </Badge>
              )}
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Overall Prediction */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4" />
              {language === 'hi' ? 'समग्र भविष्यवाणी' : 'Overall Prediction'}
            </CardTitle>
            <Badge variant="outline">{horoscope.ratings.overall}/10</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Progress value={(horoscope.ratings.overall / 10) * 100} className="mb-3" />
          <p className="text-sm">{horoscope.predictions.overall}</p>
        </CardContent>
      </Card>

      {/* Life Areas */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {language === 'hi' ? 'करियर' : 'Career'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 mb-2">
              <Progress value={(horoscope.ratings.career / 10) * 100} className="flex-1" />
              <span className="text-xs">{horoscope.ratings.career}/10</span>
            </div>
            <p className="text-xs text-muted-foreground">{horoscope.predictions.career}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {language === 'hi' ? 'वित्त' : 'Finance'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 mb-2">
              <Progress value={(horoscope.ratings.finance / 10) * 100} className="flex-1" />
              <span className="text-xs">{horoscope.ratings.finance}/10</span>
            </div>
            <p className="text-xs text-muted-foreground">{horoscope.predictions.finance}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1">
              <Activity className="h-3 w-3" />
              {language === 'hi' ? 'स्वास्थ्य' : 'Health'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 mb-2">
              <Progress value={(horoscope.ratings.health / 10) * 100} className="flex-1" />
              <span className="text-xs">{horoscope.ratings.health}/10</span>
            </div>
            <p className="text-xs text-muted-foreground">{horoscope.predictions.health}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {language === 'hi' ? 'रिश्ते' : 'Relations'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 mb-2">
              <Progress value={(horoscope.ratings.relationships / 10) * 100} className="flex-1" />
              <span className="text-xs">{horoscope.ratings.relationships}/10</span>
            </div>
            <p className="text-xs text-muted-foreground">{horoscope.predictions.relationships}</p>
          </CardContent>
        </Card>
      </div>

      {/* Lucky Elements */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            {language === 'hi' ? 'शुभ तत्व' : 'Lucky Elements'}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div>
            <p className="text-sm font-medium mb-1">
              {language === 'hi' ? 'शुभ संख्या:' : 'Lucky Numbers:'}
            </p>
            <div className="flex gap-2">
              {horoscope.luckyNumbers.map((num: number, index: number) => (
                <Badge key={index} variant="secondary">{num}</Badge>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">
              {language === 'hi' ? 'शुभ रंग:' : 'Lucky Colors:'}
            </p>
            <div className="flex gap-2">
              {horoscope.luckyColors.map((color: string, index: number) => (
                <Badge key={index} variant="outline">{color}</Badge>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">
              {language === 'hi' ? 'शुभ समय:' : 'Auspicious Time:'}
            </p>
            <Badge variant="default">{horoscope.auspiciousTime}</Badge>
          </div>
        </CardContent>
      </Card>

      {!horoscope.isPersonalized && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-orange-700">
              {language === 'hi' 
                ? 'अधिक सटीक और व्यक्तिगत राशिफल के लिए कुंडली बनवाएं'
                : 'Generate your Kundali for more accurate and personalized horoscope'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedDailyHoroscope;
