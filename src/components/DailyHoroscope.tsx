
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Sparkles, Heart, Briefcase, Coins, ChevronLeft, ChevronRight } from "lucide-react";

interface HoroscopeData {
  sign: string;
  signHindi: string;
  date: string;
  prediction: {
    general: string;
    love: string;
    career: string;
    finance: string;
    health: string;
    lucky_number: number;
    lucky_color: string;
  };
}

interface DailyHoroscopeProps {
  language: 'hi' | 'en';
}

const zodiacSigns = [
  { en: 'Aries', hi: 'मेष', icon: '♈' },
  { en: 'Taurus', hi: 'वृषभ', icon: '♉' },
  { en: 'Gemini', hi: 'मिथुन', icon: '♊' },
  { en: 'Cancer', hi: 'कर्क', icon: '♋' },
  { en: 'Leo', hi: 'सिंह', icon: '♌' },
  { en: 'Virgo', hi: 'कन्या', icon: '♍' },
  { en: 'Libra', hi: 'तुला', icon: '♎' },
  { en: 'Scorpio', hi: 'वृश्चिक', icon: '♏' },
  { en: 'Sagittarius', hi: 'धनु', icon: '♐' },
  { en: 'Capricorn', hi: 'मकर', icon: '♑' },
  { en: 'Aquarius', hi: 'कुंभ', icon: '♒' },
  { en: 'Pisces', hi: 'मीन', icon: '♓' }
];

// Sample horoscope data - in a real app, this would come from an API
const generateHoroscopeData = (sign: string): HoroscopeData => {
  const predictions = {
    Aries: {
      general: "Today brings new opportunities for growth. Your energetic nature will help you overcome challenges.",
      generalHi: "आज आपके लिए नए अवसर लेकर आ रहा है। आपकी ऊर्जा आपको चुनौतियों से पार पाने में मदद करेगी।",
      love: "Romance is in the air. Express your feelings openly.",
      loveHi: "प्रेम में आज अच्छा दिन है। अपनी भावनाएं खुलकर व्यक्त करें।",
      career: "Professional recognition awaits. Stay focused on your goals.",
      careerHi: "करियर में पहचान मिलने की संभावना है। अपने लक्ष्यों पर केंद्रित रहें।",
      finance: "Financial gains are possible through careful planning.",
      financeHi: "सोच-समझकर निवेश करने से आर्थिक लाभ हो सकता है।",
      health: "Maintain a balanced diet and exercise regularly."
    },
    // Add more signs as needed
  };

  const signData = predictions.Aries; // Default to Aries for demo

  return {
    sign,
    signHindi: zodiacSigns.find(z => z.en === sign)?.hi || sign,
    date: new Date().toLocaleDateString(),
    prediction: {
      general: signData.general,
      love: signData.love,
      career: signData.career,
      finance: signData.finance,
      health: signData.health || "Take care of your physical and mental well-being.",
      lucky_number: Math.floor(Math.random() * 100) + 1,
      lucky_color: ['Red', 'Blue', 'Green', 'Yellow', 'Purple'][Math.floor(Math.random() * 5)]
    }
  };
};

const DailyHoroscope: React.FC<DailyHoroscopeProps> = ({ language }) => {
  const [selectedSign, setSelectedSign] = useState('Aries');
  const [horoscopeData, setHoroscopeData] = useState<HoroscopeData | null>(null);
  const [currentSignIndex, setCurrentSignIndex] = useState(0);

  useEffect(() => {
    const data = generateHoroscopeData(selectedSign);
    setHoroscopeData(data);
  }, [selectedSign]);

  const handleNextSign = () => {
    const nextIndex = (currentSignIndex + 1) % zodiacSigns.length;
    setCurrentSignIndex(nextIndex);
    setSelectedSign(zodiacSigns[nextIndex].en);
  };

  const handlePrevSign = () => {
    const prevIndex = (currentSignIndex - 1 + zodiacSigns.length) % zodiacSigns.length;
    setCurrentSignIndex(prevIndex);
    setSelectedSign(zodiacSigns[prevIndex].en);
  };

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  if (!horoscopeData) return null;

  const currentSign = zodiacSigns[currentSignIndex];

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Star className="h-5 w-5 text-orange-500" />
            {getTranslation('Daily Horoscope', 'दैनिक राशिफल')}
          </CardTitle>
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            {new Date().toLocaleDateString()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Zodiac Sign Selector */}
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevSign}
            className="text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-center">
            <div className="text-3xl mb-2">{currentSign.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'hi' ? currentSign.hi : currentSign.en}
            </h3>
            <p className="text-sm text-gray-600">
              {getTranslation('Today', 'आज')}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextSign}
            className="text-gray-600 hover:text-gray-900"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Lucky Numbers and Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-3 rounded-lg text-center">
            <Sparkles className="h-5 w-5 text-orange-500 mx-auto mb-1" />
            <p className="text-xs text-gray-600 mb-1">
              {getTranslation('Lucky Number', 'भाग्यांक')}
            </p>
            <p className="text-lg font-bold text-orange-600">
              {horoscopeData.prediction.lucky_number}
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg text-center">
            <div className="h-5 w-5 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 mx-auto mb-1"></div>
            <p className="text-xs text-gray-600 mb-1">
              {getTranslation('Lucky Color', 'भाग्यशाली रंग')}
            </p>
            <p className="text-lg font-bold text-purple-600">
              {horoscopeData.prediction.lucky_color}
            </p>
          </div>
        </div>

        {/* Predictions */}
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-blue-600" />
              <h4 className="font-semibold text-blue-900">
                {getTranslation('General', 'सामान्य')}
              </h4>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
              {horoscopeData.prediction.general}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-pink-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-pink-600" />
                <h4 className="font-semibold text-pink-900 text-sm">
                  {getTranslation('Love', 'प्रेम')}
                </h4>
              </div>
              <p className="text-xs text-pink-800 leading-relaxed">
                {horoscopeData.prediction.love}
              </p>
            </div>

            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-4 w-4 text-green-600" />
                <h4 className="font-semibold text-green-900 text-sm">
                  {getTranslation('Career', 'करियर')}
                </h4>
              </div>
              <p className="text-xs text-green-800 leading-relaxed">
                {horoscopeData.prediction.career}
              </p>
            </div>

            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="h-4 w-4 text-yellow-600" />
                <h4 className="font-semibold text-yellow-900 text-sm">
                  {getTranslation('Finance', 'धन')}
                </h4>
              </div>
              <p className="text-xs text-yellow-800 leading-relaxed">
                {horoscopeData.prediction.finance}
              </p>
            </div>

            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-purple-600" />
                <h4 className="font-semibold text-purple-900 text-sm">
                  {getTranslation('Health', 'स्वास्थ्य')}
                </h4>
              </div>
              <p className="text-xs text-purple-800 leading-relaxed">
                {horoscopeData.prediction.health}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            {getTranslation(
              'Horoscope predictions are for entertainment purposes only',
              'राशिफल केवल मनोरंजन के उद्देश्य से है'
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyHoroscope;
