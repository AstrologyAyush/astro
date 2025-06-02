
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Star, Heart, Briefcase, DollarSign, Activity } from "lucide-react";

interface EnhancedDailyHoroscopeProps {
  kundali?: any;
  language: 'hi' | 'en';
}

const EnhancedDailyHoroscope: React.FC<EnhancedDailyHoroscopeProps> = ({ kundali, language }) => {
  const [horoscope, setHoroscope] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (kundali) {
      generateDailyHoroscope();
    }
  }, [kundali]);

  const generateDailyHoroscope = async () => {
    if (!kundali) return;
    
    setLoading(true);
    try {
      // Simulate enhanced horoscope generation
      const today = new Date();
      const moonHouse = Math.floor(Math.random() * 12) + 1;
      
      const predictions = {
        overall: generateOverallPrediction(moonHouse, language),
        career: generateCareerPrediction(moonHouse, language),
        finance: generateFinancePrediction(moonHouse, language),
        health: generateHealthPrediction(moonHouse, language),
        relationships: generateRelationshipPrediction(moonHouse, language)
      };

      const ratings = {
        overall: Math.floor(Math.random() * 5) + 6,
        career: Math.floor(Math.random() * 5) + 6,
        finance: Math.floor(Math.random() * 5) + 6,
        health: Math.floor(Math.random() * 5) + 6,
        relationships: Math.floor(Math.random() * 5) + 6
      };

      setHoroscope({
        date: today.toLocaleDateString(),
        moonHouse,
        predictions,
        ratings,
        luckyNumbers: [Math.floor(Math.random() * 9) + 1, Math.floor(Math.random() * 9) + 1, Math.floor(Math.random() * 9) + 1],
        luckyColors: ['Blue', 'Green', 'Yellow'],
        auspiciousTime: '10:30 AM - 12:30 PM'
      });
    } catch (error) {
      console.error('Error generating horoscope:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateOverallPrediction = (moonHouse: number, lang: 'hi' | 'en'): string => {
    const predictions = {
      en: [
        `The Moon's transit through your ${moonHouse}th house brings positive energy today.`,
        `Planetary alignments suggest a day of opportunities and growth.`,
        `Your intuitive powers are heightened with favorable lunar positions.`,
        `Cosmic energies support your endeavors today.`
      ],
      hi: [
        `चंद्रमा का आपके ${moonHouse}वें भाव में गोचर आज सकारात्मक ऊर्जा लाता है।`,
        `ग्रहों की स्थिति आज अवसरों और विकास का दिन सुझाती है।`,
        `अनुकूल चंद्र स्थिति के साथ आपकी सहज शक्तियां बढ़ी हुई हैं।`,
        `ब्रह्मांडीय ऊर्जाएं आज आपके प्रयासों का समर्थन करती हैं।`
      ]
    };
    return predictions[lang][Math.floor(Math.random() * predictions[lang].length)];
  };

  const generateCareerPrediction = (moonHouse: number, lang: 'hi' | 'en'): string => {
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

  const generateFinancePrediction = (moonHouse: number, lang: 'hi' | 'en'): string => {
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

  const generateHealthPrediction = (moonHouse: number, lang: 'hi' | 'en'): string => {
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

  const generateRelationshipPrediction = (moonHouse: number, lang: 'hi' | 'en'): string => {
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
            <p>{language === 'hi' ? 'दैनिक राशिफल तैयार हो रहा है...' : 'Generating daily horoscope...'}</p>
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
          </CardTitle>
          <p className="text-sm text-muted-foreground">{horoscope.date}</p>
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
    </div>
  );
};

export default EnhancedDailyHoroscope;
