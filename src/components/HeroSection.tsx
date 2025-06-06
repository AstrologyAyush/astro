
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
    navigate('/');
    // Scroll to kundali section or trigger kundali tab
    setTimeout(() => {
      const kundaliSection = document.querySelector('[data-testid="kundali-section"]');
      if (kundaliSection) {
        kundaliSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="text-center mb-6 md:mb-8 px-4">
      <div className="flex items-center justify-center mb-4 flex-col md:flex-row">
        <AppLogo size="xl" className="mr-0 md:mr-4 mb-2 md:mb-0" />
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
              AyuAstro
            </span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
            <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-orange-500" />
            <span className="text-xs md:text-sm text-orange-600 font-medium text-center">
              {getTranslation('Based on Rishi Parasher Principles', 'पं. ऋषि पराशर के सिद्धांतों पर आधारित')}
            </span>
            <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-orange-500" />
          </div>
        </div>
      </div>
      
      <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6 px-2">
        {getTranslation(
          "Discover Your Destiny with Precision - Advanced Astronomical Calculations & Rishi Parasher Guidance",
          "उन्नत खगोलीय गणना और पं. ऋषि पराशर के मार्गदर्शन के साथ अपने भाग्य की सटीक खोज करें"
        )}
      </p>
      
      {/* Features highlight */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-4 md:mt-6 px-2">
        <div className="bg-orange-100 text-orange-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
          <Crown className="h-3 w-3 inline mr-1" />
          {getTranslation('Swiss Ephemeris Accuracy', 'Swiss Ephemeris सटीकता')}
        </div>
        <div className="bg-blue-100 text-blue-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
          <Target className="h-3 w-3 inline mr-1" />
          {getTranslation('Rishi Parasher Guidance', 'पं. ऋषि पराशर मार्गदर्शन')}
        </div>
        <div className="bg-green-100 text-green-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
          <Star className="h-3 w-3 inline mr-1" />
          {getTranslation('Comprehensive Analysis', 'संपूर्ण विश्लेषण')}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mt-6 md:mt-8 px-2">
        <Button 
          onClick={handleGetStarted}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-sm md:text-base px-6 md:px-8 py-3 md:py-4 rounded-full shadow-lg w-full sm:w-auto"
        >
          <Play className="mr-2 h-4 w-4" />
          {getTranslation('Get Your Free Astro Report in 60 Seconds', 'अपनी मुफ्त ज्योतिष रिपोर्ट 60 सेकंड में पाएं')}
        </Button>
        <Button 
          variant="outline"
          onClick={handleGetStarted}
          className="border-orange-600 text-orange-600 hover:bg-orange-50 text-sm md:text-base px-6 md:px-8 py-3 md:py-4 rounded-full w-full sm:w-auto"
        >
          {getTranslation('Try the Engine - First Report is Free', 'इंजन आज़माएं - पहली रिपोर्ट मुफ्त')}
        </Button>
      </div>
      
      <p className="text-xs md:text-sm text-gray-600 mt-3 md:mt-4 px-2">
        {getTranslation('No Card. No Guesswork. Just Truth.', 'कोई कार्ड नहीं। कोई अनुमान नहीं। सिर्फ सच्चाई।')}
      </p>
    </div>
  );
};

export default HeroSection;
