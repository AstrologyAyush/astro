
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
      icon: <Star className="h-5 w-5 text-orange-500 flex-shrink-0" />,
      title: "Detailed Birth Chart Analysis",
      description: "Complete planetary positions, houses, and their influences on your life"
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-blue-500 flex-shrink-0" />,
      title: "Life Predictions by Age Groups",
      description: "Detailed insights for different life phases: 0-14, 15-30, 31-45, 46-60, 60+"
    },
    {
      icon: <Heart className="h-5 w-5 text-pink-500 flex-shrink-0" />,
      title: "Relationship Compatibility", 
      description: "Marriage timing, partner characteristics, and compatibility analysis"
    },
    {
      icon: <Sparkles className="h-5 w-5 text-purple-500 flex-shrink-0" />,
      title: "AI-Powered Maharishi Parashar",
      description: "Chat with our AI sage for personalized guidance and remedies"
    },
    {
      icon: <Users className="h-5 w-5 text-green-500 flex-shrink-0" />,
      title: "Personality Analysis",
      description: "Discover your true nature through our advanced personality test"
    },
    {
      icon: <Gift className="h-5 w-5 text-red-500 flex-shrink-0" />,
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
        <div className="relative px-3 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-8 lg:pt-12 pb-6 sm:pb-12 lg:pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-3 sm:mb-4 bg-orange-100 text-orange-800 border-orange-200 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5">
              ✨ Completely FREE - Limited Time Launch Offer
            </Badge>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 leading-tight px-2">
              Discover Your Destiny with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 block mt-1 sm:mt-2"> AyushAstro</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6 md:mb-8 max-w-3xl mx-auto px-3 leading-relaxed">
              Get your complete Vedic astrology analysis with detailed life predictions, 
              personality insights, and AI-powered guidance - absolutely FREE!
            </p>
            
            <div className="flex flex-col gap-3 justify-center mb-6 sm:mb-8 md:mb-12 px-3 max-w-sm mx-auto">
              <Button 
                size="lg"
                onClick={() => navigate('/kundali')}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold min-h-[48px] w-full rounded-lg"
              >
                Generate Free Kundali
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/personality-test')}
                className="border-orange-600 text-orange-600 hover:bg-orange-50 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold min-h-[48px] w-full rounded-lg"
              >
                Take Personality Test
              </Button>
            </div>

            <div className="max-w-xs sm:max-w-sm mx-auto mb-6 sm:mb-8 md:mb-12 px-3">
              <CountdownTimer />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 px-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 leading-tight">
              Complete Astrology Solutions
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to understand your cosmic blueprint
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-orange-200">
                <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4 md:px-6">
                  <div className="flex items-start gap-2 sm:gap-3 mb-1 sm:mb-2">
                    {feature.icon}
                    <CardTitle className="text-sm sm:text-base md:text-lg text-gray-900 leading-tight flex-1">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 px-3 sm:px-4 md:px-6">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* What You Get Section */}
      <div className="py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 px-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 leading-tight">
              What's Included in Your FREE Analysis
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Get comprehensive insights worth thousands of rupees - completely free
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 px-2">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-2 sm:gap-3 py-2 sm:py-3">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-700 leading-relaxed">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 leading-tight px-2">
            Ready to Unlock Your Cosmic Secrets?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 md:mb-10 px-2 max-w-2xl mx-auto">
            Join thousands who have discovered their true potential through Vedic astrology
          </p>
          
          <div className="px-3 max-w-sm mx-auto">
            <Button 
              size="lg"
              onClick={() => navigate('/kundali')}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold min-h-[48px] w-full rounded-lg"
            >
              Start Your Free Analysis Now
            </Button>
          </div>
          
          <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 md:mt-6 px-2">
            No payment required • No hidden charges • Complete analysis in minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
