
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Sparkles, Crown, Target, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppLogo from './AppLogo';

interface HeroSectionProps {
  language: 'hi' | 'en';
}

const HeroSection: React.FC<HeroSectionProps> = ({ language }) => {
  const navigate = useNavigate();

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const handleGetStarted = () => {
    // Scroll to kundali section
    const kundaliSection = document.querySelector('[data-testid="kundali-section"]');
    if (kundaliSection) {
      kundaliSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleTryEngine = () => {
    // Scroll to kundali section
    const kundaliSection = document.querySelector('[data-testid="kundali-section"]');
    if (kundaliSection) {
      kundaliSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="text-center mb-4 md:mb-6 px-2">
      <div className="flex items-center justify-center mb-3 md:mb-4 flex-col">
        <AppLogo size="xl" className="mb-2" />
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
              AyuAstro
            </span>
          </h1>
          <div className="flex items-center justify-center gap-1 md:gap-2 mt-1 md:mt-2 flex-wrap">
            <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-orange-500 flex-shrink-0" />
            <span className="text-xs md:text-sm text-orange-600 font-medium text-center leading-tight">
              {getTranslation('Based on Rishi Parasher Principles', 'पं. ऋषि पराशर के सिद्धांतों पर आधारित')}
            </span>
            <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-orange-500 flex-shrink-0" />
          </div>
        </div>
      </div>
      
      <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-4 md:mb-6 px-2 leading-relaxed">
        {getTranslation(
          "Discover Your Destiny with Precision - Advanced Astronomical Calculations & Rishi Parasher Guidance",
          "उन्नत खगोलीय गणना और पं. ऋषि पराशर के मार्गदर्शन के साथ अपने भाग्य की सटीक खोज करें"
        )}
      </p>
      
      {/* Features highlight */}
      <div className="flex flex-wrap justify-center gap-2 mt-3 md:mt-4 px-2">
        <div className="bg-orange-100 text-orange-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium flex items-center gap-1">
          <Crown className="h-3 w-3 flex-shrink-0" />
          <span className="whitespace-nowrap">{getTranslation('Swiss Ephemeris Accuracy', 'Swiss Ephemeris सटीकता')}</span>
        </div>
        <div className="bg-blue-100 text-blue-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium flex items-center gap-1">
          <Target className="h-3 w-3 flex-shrink-0" />
          <span className="whitespace-nowrap">{getTranslation('Rishi Parasher Guidance', 'पं. ऋषि पराशर मार्गदर्शन')}</span>
        </div>
        <div className="bg-green-100 text-green-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium flex items-center gap-1">
          <Star className="h-3 w-3 flex-shrink-0" />
          <span className="whitespace-nowrap">{getTranslation('Comprehensive Analysis', 'संपूर्ण विश्लेषण')}</span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col gap-3 justify-center mt-4 md:mt-6 px-2 max-w-md mx-auto">
        <Button 
          onClick={handleGetStarted}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-sm md:text-base px-4 md:px-6 py-3 md:py-4 rounded-full shadow-lg w-full transition-all duration-300 transform hover:scale-105"
        >
          <Play className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="leading-tight">
            {getTranslation('Get Your Free Astro Report in 60 Seconds', 'अपनी मुफ्त ज्योतिष रिपोर्ट 60 सेकंड में पाएं')}
          </span>
        </Button>
        <Button 
          variant="outline"
          onClick={handleTryEngine}
          className="border-orange-600 text-orange-600 hover:bg-orange-50 text-sm md:text-base px-4 md:px-6 py-3 md:py-4 rounded-full w-full transition-all duration-300"
        >
          <span className="leading-tight">
            {getTranslation('Try the Engine - First Report is Free', 'इंजन आज़माएं - पहली रिपोर्ट मुफ्त')}
          </span>
        </Button>
        <Button 
          variant="outline"
          onClick={handleGetStarted}
          className="border-green-600 text-green-600 hover:bg-green-50 text-sm md:text-base px-4 md:px-6 py-3 md:py-4 rounded-full w-full transition-all duration-300"
        >
          <Crown className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="leading-tight">
            {getTranslation('Unlock My Vedic Report', 'मेरी वैदिक रिपोर्ट अनलॉक करें')}
          </span>
        </Button>
      </div>
      
      <p className="text-xs md:text-sm text-gray-600 mt-3 md:mt-4 px-2 leading-relaxed">
        {getTranslation('No Card. No Guesswork. Just Truth.', 'कोई कार्ड नहीं। कोई अनुमान नहीं। सिर्फ सच्चाई।')}
      </p>
    </div>
  );
};

export default HeroSection;
