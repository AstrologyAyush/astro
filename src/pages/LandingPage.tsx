
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { Star, Users, Heart, TrendingUp, Sparkles, Gift, CheckCircle } from "lucide-react";
import { useIsMobile, useViewportHeight } from '@/hooks/use-mobile';
import CountdownTimer from '../components/CountdownTimer';

const LandingPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const viewportHeight = useViewportHeight();

  const features = [
    {
      icon: <Star className="h-3 w-3 text-orange-500 flex-shrink-0 sm:h-4 sm:w-4" />,
      title: "Detailed Birth Chart Analysis",
      description: "Complete planetary positions, houses, and their influences on your life"
    },
    {
      icon: <TrendingUp className="h-3 w-3 text-blue-500 flex-shrink-0 sm:h-4 sm:w-4" />,
      title: "Life Predictions by Age Groups",
      description: "Detailed insights for different life phases: 0-14, 15-30, 31-45, 46-60, 60+"
    },
    {
      icon: <Heart className="h-3 w-3 text-pink-500 flex-shrink-0 sm:h-4 sm:w-4" />,
      title: "Relationship Compatibility", 
      description: "Marriage timing, partner characteristics, and compatibility analysis"
    },
    {
      icon: <Sparkles className="h-3 w-3 text-purple-500 flex-shrink-0 sm:h-4 sm:w-4" />,
      title: "AI-Powered Maharishi Parashar",
      description: "Chat with our AI sage for personalized guidance and remedies"
    },
    {
      icon: <Users className="h-3 w-3 text-green-500 flex-shrink-0 sm:h-4 sm:w-4" />,
      title: "Personality Analysis",
      description: "Discover your true nature through our advanced personality test"
    },
    {
      icon: <Gift className="h-3 w-3 text-red-500 flex-shrink-0 sm:h-4 sm:w-4" />,
      title: "Daily Horoscope",
      description: "Personalized daily insights based on your birth chart"
    }
  ];

  const benefits = [
    "Complete Lagna Chart with planetary positions",
    "Detailed Dasha periods (Mahadasha, Antardasha, Pratyantardasha)",
    "Yoga formations (Raja Yoga, Dhana Yoga, etc.)",
    "Dosha analysis (Mangal Dosha, Kaal Sarp Dosha, Sade Sati)",
    "Transit analysis for current planetary movements",
    "Annual Horoscope (Varshphal) predictions",
    "Remedial measures and gemstone recommendations",
    "Career, finance, health, and relationship insights",
    "Lucky numbers, colors, and auspicious timings"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-red-600/10"></div>
        <div className="relative px-2 pt-3 pb-4 sm:px-4 sm:pt-6 sm:pb-8 lg:px-8 lg:pt-8 lg:pb-12">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-1.5 bg-orange-100 text-orange-800 border-orange-200 text-[9px] px-1 py-0.5 sm:text-xs sm:px-2 sm:py-1 sm:mb-2">
              ✨ Completely FREE - Limited Time Launch Offer
            </Badge>
            <h1 className="text-base font-bold text-gray-900 mb-1.5 leading-tight px-1 sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl sm:mb-2">
              Discover Your Destiny with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 block mt-0.5 sm:mt-1"> AyushAstro</span>
            </h1>
            <p className="text-[10px] text-gray-600 mb-2 max-w-2xl mx-auto leading-relaxed px-2 sm:text-sm md:text-base lg:text-lg sm:mb-3">
              Get your complete Vedic astrology analysis with detailed life predictions, 
              personality insights, and AI-powered guidance - absolutely FREE!
            </p>
            
            <div className="flex flex-col gap-1.5 justify-center mb-3 max-w-[280px] mx-auto sm:max-w-sm sm:gap-2 sm:mb-6 md:mb-8">
              <Button 
                size="lg"
                onClick={() => navigate('/kundali')}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-2 py-2 text-[10px] font-semibold min-h-[36px] w-full rounded-lg leading-tight sm:px-4 sm:py-3 sm:text-sm sm:min-h-[44px]"
              >
                <span className="text-center break-words">Get Your Free Astro Report in 60 Seconds</span>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/personality-test')}
                className="border-orange-600 text-orange-600 hover:bg-orange-50 px-2 py-2 text-[10px] font-semibold min-h-[36px] w-full rounded-lg leading-tight sm:px-4 sm:py-3 sm:text-sm sm:min-h-[44px]"
              >
                Take Personality Test
              </Button>
            </div>

            <div className="max-w-[280px] mx-auto mb-3 sm:max-w-sm sm:mb-6 md:mb-8">
              <CountdownTimer />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-4 px-2 sm:py-8 sm:px-4 md:py-12 lg:py-16 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4 sm:mb-8 md:mb-12">
            <h2 className="text-sm font-bold text-gray-900 mb-1.5 leading-tight px-1 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sm:mb-2">
              Complete Astrology Solutions
            </h2>
            <p className="text-[10px] text-gray-600 max-w-xl mx-auto px-2 sm:text-sm md:text-base lg:text-lg">
              Everything you need to understand your cosmic blueprint
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 md:gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-orange-200">
                <CardHeader className="pb-1 px-2 sm:pb-2 sm:px-4">
                  <div className="flex items-start gap-1.5 mb-0.5 sm:gap-2 sm:mb-1.5">
                    {feature.icon}
                    <CardTitle className="text-[10px] text-gray-900 leading-tight flex-1 sm:text-sm md:text-base">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 px-2 sm:px-4">
                  <p className="text-[9px] text-gray-600 leading-relaxed sm:text-xs md:text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* What You Get Section */}
      <div className="py-4 px-2 bg-gradient-to-r from-orange-50 to-red-50 sm:py-8 sm:px-4 md:py-12 lg:py-16 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4 sm:mb-8 md:mb-12">
            <h2 className="text-sm font-bold text-gray-900 mb-1.5 leading-tight px-1 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sm:mb-2">
              What's Included in Your FREE Analysis
            </h2>
            <p className="text-[10px] text-gray-600 max-w-xl mx-auto px-2 sm:text-sm md:text-base lg:text-lg">
              Get comprehensive insights worth thousands of rupees - completely free
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-2 md:gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-1.5 py-1 px-1.5 sm:gap-2 sm:py-2 sm:px-2">
                <CheckCircle className="h-2.5 w-2.5 text-green-600 mt-0.5 flex-shrink-0 sm:h-4 sm:w-4" />
                <span className="text-[9px] text-gray-700 leading-relaxed sm:text-xs md:text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-4 px-2 sm:py-8 sm:px-4 md:py-12 lg:py-16 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-sm font-bold text-gray-900 mb-1.5 leading-tight px-1 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sm:mb-2">
            Ready to Unlock Your Cosmic Secrets?
          </h2>
          <p className="text-[10px] text-gray-600 mb-3 max-w-xl mx-auto px-2 sm:text-sm sm:mb-6 md:text-base md:mb-8 lg:text-lg">
            Join thousands who have discovered their true potential through Vedic astrology
          </p>
          
          <div className="max-w-[280px] mx-auto sm:max-w-sm">
            <Button 
              size="lg"
              onClick={() => navigate('/kundali')}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-3 py-2.5 text-[10px] font-semibold min-h-[36px] w-full rounded-lg leading-tight sm:px-6 sm:py-3 sm:text-sm sm:min-h-[44px] lg:text-base"
            >
              Start Your Free Analysis Now
            </Button>
          </div>
          
          <p className="text-[8px] text-gray-500 mt-1.5 px-1 sm:text-xs sm:mt-3 md:mt-4">
            No payment required • No hidden charges • Complete analysis in minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
