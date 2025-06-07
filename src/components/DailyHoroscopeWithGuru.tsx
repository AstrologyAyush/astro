
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Star, 
  Sun, 
  Moon, 
  Heart, 
  Briefcase, 
  TrendingUp, 
  Palette, 
  Clock,
  MessageCircle,
  Send,
  Sparkles,
  Target,
  Shield,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface ZodiacSign {
  name: { en: string; hi: string };
  symbol: string;
  element: string;
  dates: string;
}

const zodiacSigns: ZodiacSign[] = [
  { name: { en: 'Aries', hi: 'मेष' }, symbol: '♈', element: 'Fire', dates: 'Mar 21 - Apr 19' },
  { name: { en: 'Taurus', hi: 'वृष' }, symbol: '♉', element: 'Earth', dates: 'Apr 20 - May 20' },
  { name: { en: 'Gemini', hi: 'मिथुन' }, symbol: '♊', element: 'Air', dates: 'May 21 - Jun 20' },
  { name: { en: 'Cancer', hi: 'कर्क' }, symbol: '♋', element: 'Water', dates: 'Jun 21 - Jul 22' },
  { name: { en: 'Leo', hi: 'सिंह' }, symbol: '♌', element: 'Fire', dates: 'Jul 23 - Aug 22' },
  { name: { en: 'Virgo', hi: 'कन्या' }, symbol: '♍', element: 'Earth', dates: 'Aug 23 - Sep 22' },
  { name: { en: 'Libra', hi: 'तुला' }, symbol: '♎', element: 'Air', dates: 'Sep 23 - Oct 22' },
  { name: { en: 'Scorpio', hi: 'वृश्चिक' }, symbol: '♏', element: 'Water', dates: 'Oct 23 - Nov 21' },
  { name: { en: 'Sagittarius', hi: 'धनु' }, symbol: '♐', element: 'Fire', dates: 'Nov 22 - Dec 21' },
  { name: { en: 'Capricorn', hi: 'मकर' }, symbol: '♑', element: 'Earth', dates: 'Dec 22 - Jan 19' },
  { name: { en: 'Aquarius', hi: 'कुम्भ' }, symbol: '♒', element: 'Air', dates: 'Jan 20 - Feb 18' },
  { name: { en: 'Pisces', hi: 'मीन' }, symbol: '♓', element: 'Water', dates: 'Feb 19 - Mar 20' }
];

interface DailyHoroscope {
  general: { en: string; hi: string };
  career: { en: string; hi: string };
  love: { en: string; hi: string };
  health: { en: string; hi: string };
  luckyNumbers: number[];
  luckyColors: string[];
  auspiciousTime: { en: string; hi: string };
  energyLevel: number; // 1-10
}

const DailyHoroscopeWithGuru: React.FC = () => {
  const { language, t } = useLanguage();
  const [selectedSign, setSelectedSign] = useState<number>(0);
  const [horoscope, setHoroscope] = useState<DailyHoroscope | null>(null);
  const [question, setQuestion] = useState('');
  const [guruResponse, setGuruResponse] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [showSignSelector, setShowSignSelector] = useState(true);

  useEffect(() => {
    if (!showSignSelector) {
      generateDailyHoroscope();
    }
  }, [selectedSign, showSignSelector, language]);

  const generateDailyHoroscope = () => {
    const sign = zodiacSigns[selectedSign];
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    // Generate deterministic but varied content based on current date and sign
    const seedValue = dayOfYear + selectedSign;
    
    const horoscopeData: DailyHoroscope = {
      general: generateGeneralPrediction(sign, seedValue),
      career: generateCareerPrediction(sign, seedValue),
      love: generateLovePrediction(sign, seedValue),
      health: generateHealthPrediction(sign, seedValue),
      luckyNumbers: generateLuckyNumbers(seedValue),
      luckyColors: generateLuckyColors(sign.element, seedValue),
      auspiciousTime: generateAuspiciousTime(seedValue),
      energyLevel: (seedValue % 5) + 6 // 6-10 range
    };

    setHoroscope(horoscopeData);
  };

  const generateGeneralPrediction = (sign: ZodiacSign, seed: number): { en: string; hi: string } => {
    const predictions = {
      Fire: {
        en: [
          "Today brings dynamic energy and new opportunities. Your natural leadership will shine through challenges.",
          "A day of action and achievement awaits. Trust your instincts and take bold steps forward.",
          "Your fiery energy attracts positive outcomes. Focus on personal growth and relationships."
        ],
        hi: [
          "आज गतिशील ऊर्जा और नए अवसर लाता है। आपका प्राकृतिक नेतृत्व चुनौतियों के माध्यम से चमकेगा।",
          "कार्य और उपलब्धि का दिन आपका इंतजार कर रहा है। अपनी सहज बुद्धि पर भरोसा करें और साहसिक कदम उठाएं।",
          "आपकी ज्वलंत ऊर्जा सकारात्मक परिणाम आकर्षित करती है। व्यक्तिगत विकास और रिश्तों पर ध्यान दें।"
        ]
      },
      Earth: {
        en: [
          "Stability and practical solutions guide your day. Your methodical approach yields steady progress.",
          "Ground yourself in reality while pursuing your goals. Financial matters receive positive attention.",
          "Your patience and persistence are rewarded today. Focus on building lasting foundations."
        ],
        hi: [
          "स्थिरता और व्यावहारिक समाधान आपके दिन का मार्गदर्शन करते हैं। आपका व्यवस्थित दृष्टिकोण निरंतर प्रगति देता है।",
          "अपने लक्ष्यों का पीछा करते समय वास्तविकता में स्थिर रहें। वित्तीय मामलों को सकारात्मक ध्यान मिलता है।",
          "आपके धैर्य और दृढ़ता का आज फल मिलता है। स्थायी नींव बनाने पर ध्यान दें।"
        ]
      },
      Air: {
        en: [
          "Communication and intellectual pursuits take center stage. Your ideas find receptive audiences.",
          "Social connections and learning opportunities abound. Share your knowledge generously.",
          "Mental clarity and creative thinking lead to breakthrough moments. Embrace change with optimism."
        ],
        hi: [
          "संचार और बौद्धिक गतिविधियां केंद्र में हैं। आपके विचारों को ग्रहणशील दर्शक मिलते हैं।",
          "सामाजिक संपर्क और सीखने के अवसर भरपूर हैं। अपने ज्ञान को उदारता से साझा करें।",
          "मानसिक स्पष्टता और रचनात्मक सोच सफलता के क्षणों की ओर ले जाती है। आशावाद के साथ परिवर्तन को अपनाएं।"
        ]
      },
      Water: {
        en: [
          "Intuition and emotions guide your path today. Trust your inner voice in important decisions.",
          "Deep connections and healing energies surround you. Your compassion touches others' hearts.",
          "Spiritual insights and emotional growth are highlighted. Pay attention to your dreams and signs."
        ],
        hi: [
          "अंतर्ज्ञान और भावनाएं आज आपके मार्ग का मार्गदर्शन करती हैं। महत्वपूर्ण निर्णयों में अपनी आंतरिक आवाज पर भरोसा करें।",
          "गहरे संपर्क और उपचार की ऊर्जा आपको घेरती है। आपकी करुणा दूसरों के दिलों को छूती है।",
          "आध्यात्मिक अंतर्दृष्टि और भावनात्मक विकास प्रकाशित होते हैं। अपने सपनों और संकेतों पर ध्यान दें।"
        ]
      }
    };

    const elementPredictions = predictions[sign.element as keyof typeof predictions];
    const index = seed % elementPredictions.en.length;
    return {
      en: elementPredictions.en[index],
      hi: elementPredictions.hi[index]
    };
  };

  const generateCareerPrediction = (sign: ZodiacSign, seed: number): { en: string; hi: string } => {
    const predictions = [
      {
        en: "Professional recognition comes your way. A project shows promising results.",
        hi: "व्यावसायिक पहचान आपके पास आती है। एक परियोजना आशाजनक परिणाम दिखाती है।"
      },
      {
        en: "Collaboration and teamwork bring success. Your skills are valued by colleagues.",
        hi: "सहयोग और टीम वर्क सफलता लाते हैं। आपके कौशल को सहयोगियों द्वारा महत्व दिया जाता है।"
      },
      {
        en: "New opportunities for advancement appear. Trust your abilities and take initiative.",
        hi: "उन्नति के नए अवसर दिखाई देते हैं। अपनी क्षमताओं पर भरोसा करें और पहल करें।"
      }
    ];

    const index = seed % predictions.length;
    return predictions[index];
  };

  const generateLovePrediction = (sign: ZodiacSign, seed: number): { en: string; hi: string } => {
    const predictions = [
      {
        en: "Romance and harmony fill your relationships. Express your feelings openly.",
        hi: "रोमांस और सामंजस्य आपके रिश्तों को भरते हैं। अपनी भावनाओं को खुले तौर पर व्यक्त करें।"
      },
      {
        en: "Deep conversations strengthen bonds. Your empathy creates meaningful connections.",
        hi: "गहरी बातचीत बंधन को मजबूत बनाती है। आपकी सहानुभूति अर्थपूर्ण संपर्क बनाती है।"
      },
      {
        en: "Past relationships may resurface. Approach with wisdom and an open heart.",
        hi: "पुराने रिश्ते फिर से उभर सकते हैं। ज्ञान और खुले दिल के साथ संपर्क करें।"
      }
    ];

    const index = seed % predictions.length;
    return predictions[index];
  };

  const generateHealthPrediction = (sign: ZodiacSign, seed: number): { en: string; hi: string } => {
    const predictions = [
      {
        en: "Energy levels are high. Perfect time for physical activities and exercise.",
        hi: "ऊर्जा का स्तर ऊंचा है। शारीरिक गतिविधियों और व्यायाम के लिए उत्तम समय।"
      },
      {
        en: "Focus on mental health and relaxation. Meditation brings inner peace.",
        hi: "मानसिक स्वास्थ्य और आराम पर ध्यान दें। ध्यान आंतरिक शांति लाता है।"
      },
      {
        en: "Balanced nutrition supports your wellbeing. Listen to your body's needs.",
        hi: "संतुलित पोषण आपकी भलाई का समर्थन करता है। अपने शरीर की जरूरतों को सुनें।"
      }
    ];

    const index = seed % predictions.length;
    return predictions[index];
  };

  const generateLuckyNumbers = (seed: number): number[] => {
    const numbers = [];
    for (let i = 0; i < 3; i++) {
      numbers.push(((seed + i * 7) % 99) + 1);
    }
    return numbers;
  };

  const generateLuckyColors = (element: string, seed: number): string[] => {
    const colorsByElement = {
      Fire: ['Red', 'Orange', 'Yellow', 'Gold'],
      Earth: ['Brown', 'Green', 'Beige', 'Maroon'],
      Air: ['Blue', 'Silver', 'White', 'Light Blue'],
      Water: ['Deep Blue', 'Teal', 'Purple', 'Black']
    };

    const colors = colorsByElement[element as keyof typeof colorsByElement];
    return [colors[seed % colors.length], colors[(seed + 1) % colors.length]];
  };

  const generateAuspiciousTime = (seed: number): { en: string; hi: string } => {
    const times = [
      { en: "6:00 AM - 8:00 AM", hi: "सुबह 6:00 - 8:00" },
      { en: "10:00 AM - 12:00 PM", hi: "सुबह 10:00 - दोपहर 12:00" },
      { en: "2:00 PM - 4:00 PM", hi: "दोपहर 2:00 - 4:00" },
      { en: "6:00 PM - 8:00 PM", hi: "शाम 6:00 - 8:00" }
    ];

    return times[seed % times.length];
  };

  const askRishiParasher = async () => {
    if (!question.trim()) return;

    setIsAsking(true);
    try {
      const { data, error } = await supabase.functions.invoke('kundali-ai-analysis', {
        body: {
          prompt: `As Rishi Parasher, the ancient Vedic sage and father of astrology, answer this question with wisdom, compassion, and practical guidance. Keep the response concise but meaningful. Question: "${question}". Current context: The person is asking about ${zodiacSigns[selectedSign].name.en} sign guidance.`,
          context: `Vedic astrology guidance from Rishi Parasher perspective`
        }
      });

      if (error) throw error;
      
      setGuruResponse(data.response || "The cosmic energies guide you towards wisdom and truth. Trust in the divine plan and follow your dharma.");
    } catch (error) {
      console.error('Error getting Rishi Parasher guidance:', error);
      setGuruResponse(language === 'hi' 
        ? "ब्रह्मांडीय ऊर्जाएं आपको ज्ञान और सत्य की ओर मार्गदर्शन करती हैं। दिव्य योजना में विश्वास रखें और अपने धर्म का पालन करें।"
        : "The cosmic energies guide you towards wisdom and truth. Trust in the divine plan and follow your dharma."
      );
    } finally {
      setIsAsking(false);
    }
  };

  if (showSignSelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardHeader className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg p-6">
              <div className="flex items-center justify-center mb-4">
                <Star className="h-8 w-8 mr-3" />
                <CardTitle className="text-2xl md:text-3xl">{t('daily_horoscope_title')}</CardTitle>
              </div>
              <p className="text-indigo-100">{t('daily_horoscope_subtitle')}</p>
            </CardHeader>
            
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">
                {t('select_sign')}
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {zodiacSigns.map((sign, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedSign(index);
                      setShowSignSelector(false);
                    }}
                    className="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-200 text-center bg-white dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                  >
                    <div className="text-3xl mb-2">{sign.symbol}</div>
                    <div className="font-semibold text-gray-800 dark:text-gray-200">
                      {sign.name[language]}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {sign.dates}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!horoscope) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const currentSign = zodiacSigns[selectedSign];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg p-6">
            <div className="flex items-center justify-between">
              <Button
                onClick={() => setShowSignSelector(true)}
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t('change_sign')}
              </Button>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-4xl mr-3">{currentSign.symbol}</span>
                  <CardTitle className="text-2xl">{currentSign.name[language]}</CardTitle>
                </div>
                <p className="text-indigo-100">{new Date().toLocaleDateString()}</p>
              </div>
              
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {horoscope.energyLevel}/10
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Today's Energy */}
        <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Sun className="h-6 w-6 mr-3 text-yellow-500" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {t('todays_energy')}
              </h3>
            </div>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 p-4 rounded-lg">
              {horoscope.general[language]}
            </p>
          </CardContent>
        </Card>

        {/* Detailed Predictions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Briefcase className="h-6 w-6 mr-3 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {t('career_finance')}
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {horoscope.career[language]}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Heart className="h-6 w-6 mr-3 text-pink-500" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {t('love_relationships')}
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {horoscope.love[language]}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 mr-3 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {t('health_wellness')}
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {horoscope.health[language]}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <div className="flex items-center mb-2">
                    <Target className="h-5 w-5 mr-2 text-purple-500" />
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                      {t('lucky_numbers')}
                    </h4>
                  </div>
                  <div className="flex space-x-2">
                    {horoscope.luckyNumbers.map((num, index) => (
                      <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                        {num}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Palette className="h-5 w-5 mr-2 text-orange-500" />
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                      {t('lucky_colors')}
                    </h4>
                  </div>
                  <div className="flex space-x-2">
                    {horoscope.luckyColors.map((color, index) => (
                      <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 mr-2 text-green-500" />
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                      {t('auspicious_time')}
                    </h4>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    {horoscope.auspiciousTime[language]}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rishi Parasher Guidance */}
        <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg p-4">
            <div className="flex items-center">
              <MessageCircle className="h-6 w-6 mr-3" />
              <CardTitle className="text-xl">{t('ask_rishi_parasher')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex space-x-4">
              <Textarea
                placeholder={t('type_question')}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-1 min-h-[100px] resize-none"
              />
              <Button
                onClick={askRishiParasher}
                disabled={isAsking || !question.trim()}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                {isAsking ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {t('ask_question')}
                  </>
                )}
              </Button>
            </div>

            {guruResponse && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 p-4 rounded-lg border-l-4 border-amber-500">
                <div className="flex items-center mb-2">
                  <Star className="h-5 w-5 mr-2 text-amber-600" />
                  <span className="font-semibold text-amber-800 dark:text-amber-300">
                    {language === 'hi' ? 'ऋषि पराशर का मार्गदर्शन' : 'Rishi Parasher\'s Guidance'}
                  </span>
                </div>
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                  {guruResponse}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyHoroscopeWithGuru;
