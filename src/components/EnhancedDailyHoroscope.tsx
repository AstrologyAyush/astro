
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Star, Sun, Moon, Crown } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';

interface DailyHoroscopeProps {
  kundaliData?: ComprehensiveKundaliData;
}

const EnhancedDailyHoroscope: React.FC<DailyHoroscopeProps> = ({ kundaliData }) => {
  const { language } = useLanguage();
  const [selectedSign, setSelectedSign] = useState<string>('');
  const [todayPrediction, setTodayPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const zodiacSigns = [
    { value: 'aries', name: language === 'hi' ? 'मेष' : 'Aries' },
    { value: 'taurus', name: language === 'hi' ? 'वृषभ' : 'Taurus' },
    { value: 'gemini', name: language === 'hi' ? 'मिथुन' : 'Gemini' },
    { value: 'cancer', name: language === 'hi' ? 'कर्क' : 'Cancer' },
    { value: 'leo', name: language === 'hi' ? 'सिंह' : 'Leo' },
    { value: 'virgo', name: language === 'hi' ? 'कन्या' : 'Virgo' },
    { value: 'libra', name: language === 'hi' ? 'तुला' : 'Libra' },
    { value: 'scorpio', name: language === 'hi' ? 'वृश्चिक' : 'Scorpio' },
    { value: 'sagittarius', name: language === 'hi' ? 'धनु' : 'Sagittarius' },
    { value: 'capricorn', name: language === 'hi' ? 'मकर' : 'Capricorn' },
    { value: 'aquarius', name: language === 'hi' ? 'कुम्भ' : 'Aquarius' },
    { value: 'pisces', name: language === 'hi' ? 'मीन' : 'Pisces' }
  ];

  // Auto-select sign from Kundali if available
  useEffect(() => {
    if (kundaliData && !selectedSign) {
      // Use Moon sign from Kundali data
      const moonSign = kundaliData.enhancedCalculations.planets.MO?.rashiName;
      if (moonSign) {
        // Convert rashiName to our sign format
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

  const generateHoroscopePrediction = (sign: string) => {
    setLoading(true);
    
    // Generate today's Vedic prediction based on sign
    const today = new Date();
    const dayOfWeek = today.getDay();
    const nakshatra = Math.floor(Math.random() * 27) + 1;
    
    // Simplified planetary strength for demo
    let yogaStrength = 'medium';
    let activeYogas = [];
    
    if (kundaliData) {
      const yogas = kundaliData.enhancedCalculations.yogas || [];
      activeYogas = yogas.filter(y => y.isActive);
      
      if (activeYogas.length > 0) {
        const avgStrength = activeYogas.reduce((sum, y) => sum + y.strength, 0) / activeYogas.length;
        yogaStrength = avgStrength > 70 ? 'high' : avgStrength > 40 ? 'medium' : 'low';
      }
      
      // Check planetary strength
      const moonStrength = kundaliData.enhancedCalculations.planets.MO?.shadbala || 50;
      const sunStrength = kundaliData.enhancedCalculations.planets.SU?.shadbala || 50;
      
      if (moonStrength < 40 || sunStrength < 40) {
        yogaStrength = 'low';
      }
    }

    // Generate prediction based on current planetary transits (simplified)
    const predictions = {
      aries: {
        overall: language === 'hi' ? 'आज आपकी ऊर्जा उच्च है। नए कार्यों की शुरुआत के लिए अच्छा दिन।' : 'High energy day. Good for starting new projects.',
        love: language === 'hi' ? 'प्रेम संबंधों में सकारात्मकता।' : 'Positive developments in love.',
        career: language === 'hi' ? 'करियर में प्रगति के अवसर।' : 'Career advancement opportunities.',
        health: language === 'hi' ? 'स्वास्थ्य अच्छा रहेगा।' : 'Good health overall.',
        lucky: { number: 3, color: language === 'hi' ? 'लाल' : 'Red', time: '10-12 AM' }
      },
      taurus: {
        overall: language === 'hi' ? 'स्थिरता और धैर्य का दिन। वित्तीय मामलों पर ध्यान दें।' : 'Day of stability. Focus on financial matters.',
        love: language === 'hi' ? 'रिश्तों में गहराई आएगी।' : 'Deeper connections in relationships.',
        career: language === 'hi' ? 'कार्यक्षेत्र में स्थिरता।' : 'Stability in work environment.',
        health: language === 'hi' ? 'शारीरिक शक्ति अच्छी।' : 'Good physical strength.',
        lucky: { number: 6, color: language === 'hi' ? 'हरा' : 'Green', time: '2-4 PM' }
      },
      // Add more signs as needed...
    };

    const signPrediction = predictions[sign as keyof typeof predictions] || predictions.aries;
    
    setTimeout(() => {
      setTodayPrediction({
        ...signPrediction,
        date: today.toLocaleDateString(),
        nakshatra: `Nakshatra ${nakshatra}`,
        yogaStrength,
        activeYogas: activeYogas.length
      });
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (selectedSign) {
      generateHoroscopePrediction(selectedSign);
    }
  }, [selectedSign]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-purple-800 flex items-center justify-center gap-2">
            <Crown className="h-6 w-6" />
            {language === 'hi' ? 'आज का राशिफल' : 'Today\'s Horoscope'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'hi' ? 'अपनी राशि चुनें:' : 'Select Your Sign:'}
            </label>
            <Select value={selectedSign} onValueChange={setSelectedSign}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={language === 'hi' ? 'राशि चुनें' : 'Choose your sign'} />
              </SelectTrigger>
              <SelectContent>
                {zodiacSigns.map((sign) => (
                  <SelectItem key={sign.value} value={sign.value}>
                    {sign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
              <p className="mt-4 text-purple-600">
                {language === 'hi' ? 'राशिफल तैयार किया जा रहा है...' : 'Generating your horoscope...'}
              </p>
            </div>
          )}

          {todayPrediction && !loading && (
            <div className="space-y-4">
              {/* Main Prediction */}
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-700 flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    {language === 'hi' ? 'आज का मुख्य राशिफल' : 'Today\'s Main Prediction'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{todayPrediction.overall}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Badge variant="outline" className="text-center py-2">
                      {language === 'hi' ? 'तारीख:' : 'Date:'} {todayPrediction.date}
                    </Badge>
                    <Badge variant="outline" className="text-center py-2">
                      {language === 'hi' ? 'नक्षत्र:' : 'Nakshatra:'} {todayPrediction.nakshatra}
                    </Badge>
                    <Badge variant="outline" className="text-center py-2">
                      {language === 'hi' ? 'योग शक्ति:' : 'Yoga Strength:'} {todayPrediction.yogaStrength}
                    </Badge>
                    <Badge variant="outline" className="text-center py-2">
                      {language === 'hi' ? 'सक्रिय योग:' : 'Active Yogas:'} {todayPrediction.activeYogas}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Predictions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-600 flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      {language === 'hi' ? 'प्रेम और रिश्ते' : 'Love & Relationships'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{todayPrediction.love}</p>
                  </CardContent>
                </Card>

                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-600 flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      {language === 'hi' ? 'करियर और कार्य' : 'Career & Work'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{todayPrediction.career}</p>
                  </CardContent>
                </Card>

                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-600 flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      {language === 'hi' ? 'स्वास्थ्य' : 'Health'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{todayPrediction.health}</p>
                  </CardContent>
                </Card>

                <Card className="border-yellow-200">
                  <CardHeader>
                    <CardTitle className="text-yellow-600 flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      {language === 'hi' ? 'भाग्यशाली' : 'Lucky Elements'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm"><strong>{language === 'hi' ? 'संख्या:' : 'Number:'}</strong> {todayPrediction.lucky.number}</p>
                    <p className="text-sm"><strong>{language === 'hi' ? 'रंग:' : 'Color:'}</strong> {todayPrediction.lucky.color}</p>
                    <p className="text-sm"><strong>{language === 'hi' ? 'समय:' : 'Time:'}</strong> {todayPrediction.lucky.time}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedDailyHoroscope;
