
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
      icon: <Star className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 flex-shrink-0" />,
      title: "Detailed Birth Chart Analysis",
      description: "Complete planetary positions, houses, and their influences on your life"
    },
    {
      icon: <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 flex-shrink-0" />,
      title: "Life Predictions by Age Groups",
      description: "Detailed insights for different life phases: 0-14, 15-30, 31-45, 46-60, 60+"
    },
    {
      icon: <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-pink-500 flex-shrink-0" />,
      title: "Relationship Compatibility", 
      description: "Marriage timing, partner characteristics, and compatibility analysis"
    },
    {
      icon: <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500 flex-shrink-0" />,
      title: "AI-Powered Maharishi Parashar",
      description: "Chat with our AI sage for personalized guidance and remedies"
    },
    {
      icon: <Users className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0" />,
      title: "Personality Analysis",
      description: "Discover your true nature through our advanced personality test"
    },
    {
      icon: <Gift className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 flex-shrink-0" />,
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
    <div className="min-h-screen-mobile bg-gradient-to-br from-orange-50 via-white to-red-50 touch-manipulation">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-red-600/10"></div>
        <div className="relative px-3 sm:px-6 pt-8 sm:pt-16 pb-12 sm:pb-20 safe-area-pt">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-3 sm:mb-4 bg-orange-100 text-orange-800 border-orange-200 text-xs sm:text-sm px-2 sm:px-3 py-1">
              ✨ Completely FREE - Limited Time Launch Offer
            </Badge>
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Discover Your Destiny with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 block sm:inline"> AyushAstro</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-2 leading-relaxed">
              Get your complete Vedic astrology analysis with detailed life predictions, 
              personality insights, and AI-powered guidance - absolutely FREE!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-2">
              <Button 
                size={isMobile ? "default" : "lg"} 
                onClick={() => navigate('/kundali')}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 sm:px-8 py-3 text-sm sm:text-base min-h-[44px] touch-manipulation tap-highlight-none"
              >
                Generate Free Kundali
              </Button>
              <Button 
                variant="outline" 
                size={isMobile ? "default" : "lg"}
                onClick={() => navigate('/personality-test')}
                className="border-orange-600 text-orange-600 hover:bg-orange-50 px-6 sm:px-8 py-3 text-sm sm:text-base min-h-[44px] touch-manipulation tap-highlight-none"
              >
                Take Personality Test
              </Button>
            </div>

            <div className="max-w-md mx-auto mb-8 sm:mb-12 px-2">
              <CountdownTimer />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 sm:py-20 px-3 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16 px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              Complete Astrology Solutions
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Everything you need to understand your cosmic blueprint
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-orange-200 touch-manipulation">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-start gap-3 mb-2">
                    {feature.icon}
                    <CardTitle className="text-base sm:text-lg text-gray-900 leading-tight">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* What You Get Section */}
      <div className="py-12 sm:py-20 px-3 sm:px-6 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-16 px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              What's Included in Your FREE Analysis
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Get comprehensive insights worth thousands of rupees - completely free
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 px-2">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 py-2 touch-manipulation">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-700 leading-relaxed">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 sm:py-20 px-3 sm:px-6 safe-area-pb">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight px-2">
            Ready to Unlock Your Cosmic Secrets?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 px-2">
            Join thousands who have discovered their true potential through Vedic astrology
          </p>
          
          <Button 
            size={isMobile ? "default" : "lg"} 
            onClick={() => navigate('/kundali')}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg min-h-[44px] touch-manipulation tap-highlight-none"
          >
            Start Your Free Analysis Now
          </Button>
          
          <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 px-2">
            No payment required • No hidden charges • Complete analysis in minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
