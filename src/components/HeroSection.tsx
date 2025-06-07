
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Sparkles, Crown, Target, Star, Brain, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppLogo from './AppLogo';

interface HeroSectionProps {
  language: 'hi' | 'en';
  onKundaliClick?: () => void;
  onNumerologyClick?: () => void;
  onPersonalityClick?: () => void;
  onHoroscopeClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  language, 
  onKundaliClick,
  onNumerologyClick,
  onPersonalityClick,
  onHoroscopeClick
}) => {
  const navigate = useNavigate();

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const handleGetStarted = () => {
    if (onKundaliClick) {
      onKundaliClick();
    } else {
      navigate('/kundali');
    }
  };

  const handlePersonalityTest = () => {
    if (onPersonalityClick) {
      onPersonalityClick();
    } else {
      navigate('/personality-test');
    }
  };

  const handleDailyHoroscope = () => {
    if (onHoroscopeClick) {
      onHoroscopeClick();
    } else {
      navigate('/daily-horoscope');
    }
  };

  const handleTryEngine = () => {
    if (onKundaliClick) {
      onKundaliClick();
    } else {
      navigate('/kundali');
    }
  };

  return (
    <div className="text-center mb-4 md:mb-6 px-2 sm:px-4 lg:px-6">
      <div className="flex items-center justify-center mb-3 md:mb-4 flex-col">
        <AppLogo size="xl" className="mb-2" />
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight px-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
              AyuAstro
            </span>
          </h1>
          <div className="flex items-center justify-center gap-1 md:gap-2 mt-1 md:mt-2 flex-wrap px-2">
            <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-orange-500 flex-shrink-0" />
            <span className="text-xs md:text-sm text-orange-600 font-medium text-center leading-tight">
              {getTranslation('Based on Rishi Parasher Principles', 'पं. ऋषि पराशर के सिद्धांतों पर आधारित')}
            </span>
            <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-orange-500 flex-shrink-0" />
          </div>
        </div>
      </div>
      
      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4 md:mb-6 px-4 leading-relaxed">
        {getTranslation(
          "Discover Your Destiny with Precision - Advanced Astronomical Calculations & Rishi Parasher Guidance",
          "उन्नत खगोलीय गणना और पं. ऋषि पराशर के मार्गदर्शन के साथ अपने भाग्य की सटीक खोज करें"
        )}
      </p>
      
      {/* Features highlight */}
      <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mt-3 md:mt-4 px-2">
        <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium flex items-center gap-1">
          <Crown className="h-3 w-3 flex-shrink-0" />
          <span className="whitespace-nowrap">{getTranslation('Swiss Ephemeris Accuracy', 'Swiss Ephemeris सटीकता')}</span>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium flex items-center gap-1">
          <Target className="h-3 w-3 flex-shrink-0" />
          <span className="whitespace-nowrap">{getTranslation('Rishi Parasher Guidance', 'पं. ऋषि पराशर मार्गदर्शन')}</span>
        </div>
        <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium flex items-center gap-1">
          <Star className="h-3 w-3 flex-shrink-0" />
          <span className="whitespace-nowrap">{getTranslation('Comprehensive Analysis', 'संपूर्ण विश्लेषण')}</span>
        </div>
      </div>

      {/* CTA Buttons - Mobile-first responsive */}
      <div className="flex flex-col gap-2 sm:gap-3 justify-center mt-4 md:mt-6 px-4 max-w-lg mx-auto">
        <Button 
          onClick={handleGetStarted}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 py-3 md:py-4 rounded-full shadow-lg w-full transition-all duration-300 transform hover:scale-105 min-h-[44px]"
        >
          <Play className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="leading-tight text-center">
            {getTranslation('Get Your Free Astro Report in 60 Seconds', 'अपनी मुफ्त ज्योतिष रिपोर्ट 60 सेकंड में पाएं')}
          </span>
        </Button>
        <Button 
          variant="outline"
          onClick={handlePersonalityTest}
          className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 py-3 md:py-4 rounded-full w-full transition-all duration-300 min-h-[44px]"
        >
          <Brain className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="leading-tight text-center">
            {getTranslation('Take Vedic Personality Test', 'वैदिक व्यक्तित्व परीक्षण लें')}
          </span>
        </Button>
        <Button 
          variant="outline"
          onClick={handleDailyHoroscope}
          className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 py-3 md:py-4 rounded-full w-full transition-all duration-300 min-h-[44px]"
        >
          <Calendar className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="leading-tight text-center">
            {getTranslation('Get Daily Horoscope', 'दैनिक राशिफल प्राप्त करें')}
          </span>
        </Button>
        <Button 
          variant="outline"
          onClick={handleTryEngine}
          className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 py-3 md:py-4 rounded-full w-full transition-all duration-300 min-h-[44px]"
        >
          <Crown className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="leading-tight text-center">
            {getTranslation('Unlock Swiss Ephemeris Kundali', 'Swiss Ephemeris कुंडली अनलॉक करें')}
          </span>
        </Button>
      </div>
      
      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-3 md:mt-4 px-4 leading-relaxed">
        {getTranslation('No Card. No Guesswork. Just Truth.', 'कोई कार्ड नहीं। कोई अनुमान नहीं। सिर्फ सच्चाई।')}
      </p>
    </div>
  );
};

export default HeroSection;
