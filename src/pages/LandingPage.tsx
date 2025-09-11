
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
      icon: <Star className="h-4 w-4 text-orange-500 flex-shrink-0" />,
      title: "Detailed Birth Chart Analysis",
      description: "Complete planetary positions, houses, and their influences on your life"
    },
    {
      icon: <TrendingUp className="h-4 w-4 text-blue-500 flex-shrink-0" />,
      title: "Life Predictions by Age Groups",
      description: "Detailed insights for different life phases: 0-14, 15-30, 31-45, 46-60, 60+"
    },
    {
      icon: <Heart className="h-4 w-4 text-pink-500 flex-shrink-0" />,
      title: "Relationship Compatibility", 
      description: "Marriage timing, partner characteristics, and compatibility analysis"
    },
    {
      icon: <Sparkles className="h-4 w-4 text-purple-500 flex-shrink-0" />,
      title: "AI-Powered Maharishi Parashar",
      description: "Chat with our AI sage for personalized guidance and remedies"
    },
    {
      icon: <Users className="h-4 w-4 text-green-500 flex-shrink-0" />,
      title: "Personality Analysis",
      description: "Discover your true nature through our advanced personality test"
    },
    {
      icon: <Gift className="h-4 w-4 text-red-500 flex-shrink-0" />,
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
        <div className="relative px-4 pt-4 pb-6 sm:px-6 sm:pt-8 sm:pb-12 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-2 bg-orange-100 text-orange-800 border-orange-200 text-xs px-2 py-1 sm:mb-4">
              ✨ Completely FREE - Limited Time Launch Offer
            </Badge>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl sm:mb-4">
              Discover Your Destiny with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 block mt-1"> AyushAstro</span>
            </h1>
            <p className="text-sm text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed sm:text-base md:text-lg sm:mb-6">
              Get your complete Vedic astrology analysis with detailed life predictions, 
              personality insights, and AI-powered guidance - absolutely FREE!
            </p>
            
            <div className="flex flex-col gap-3 justify-center mb-6 max-w-xs mx-auto sm:max-w-sm sm:gap-4 sm:mb-8">
              <Button 
                size="lg"
                onClick={() => navigate('/kundali')}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-4 py-3 text-sm font-semibold rounded-lg sm:text-base"
              >
                Get Your Free Astro Report
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/personality-test')}
                className="border-orange-600 text-orange-600 hover:bg-orange-50 px-4 py-3 text-sm font-semibold rounded-lg sm:text-base"
              >
                Take Personality Test
              </Button>
            </div>

            <div className="max-w-xs mx-auto sm:max-w-sm">
              <CountdownTimer />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-8 px-4 sm:py-12 md:py-16 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight sm:text-2xl md:text-3xl lg:text-4xl">
              Complete Astrology Solutions
            </h2>
            <p className="text-sm text-gray-600 max-w-xl mx-auto sm:text-base md:text-lg">
              Everything you need to understand your cosmic blueprint
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-orange-200">
                <CardHeader className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    {feature.icon}
                    <CardTitle className="text-sm text-gray-900 leading-tight flex-1 md:text-base">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 p-4">
                  <p className="text-xs text-gray-600 leading-relaxed md:text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* What You Get Section */}
      <div className="py-8 px-4 bg-gradient-to-r from-orange-50 to-red-50 sm:py-12 md:py-16 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight sm:text-2xl md:text-3xl lg:text-4xl">
              What's Included in Your FREE Analysis
            </h2>
            <p className="text-sm text-gray-600 max-w-xl mx-auto sm:text-base md:text-lg">
              Get comprehensive insights worth thousands of rupees - completely free
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 p-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-gray-700 leading-relaxed sm:text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-8 px-4 sm:py-12 md:py-16 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight sm:text-2xl md:text-3xl lg:text-4xl">
            Ready to Unlock Your Cosmic Secrets?
          </h2>
          <p className="text-sm text-gray-600 mb-6 max-w-xl mx-auto sm:text-base md:text-lg sm:mb-8">
            Join thousands who have discovered their true potential through Vedic astrology
          </p>
          
          <div className="max-w-xs mx-auto sm:max-w-sm">
            <Button 
              size="lg"
              onClick={() => navigate('/kundali')}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 text-sm font-semibold rounded-lg sm:text-base lg:text-lg"
            >
              Start Your Free Analysis Now
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-3 px-1 sm:mt-4">
            No payment required • No hidden charges • Complete analysis in minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
