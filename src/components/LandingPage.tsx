
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { Star, Users, Heart, TrendingUp, Sparkles, Gift, CheckCircle } from "lucide-react";
import CountdownTimer from './CountdownTimer';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Star className="h-6 w-6 text-orange-500" />,
      title: "Detailed Birth Chart Analysis",
      description: "Complete planetary positions, houses, and their influences on your life"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-blue-500" />,
      title: "Life Predictions by Age Groups",
      description: "Detailed insights for different life phases: 0-14, 15-30, 31-45, 46-60, 60+"
    },
    {
      icon: <Heart className="h-6 w-6 text-pink-500" />,
      title: "Relationship Compatibility", 
      description: "Marriage timing, partner characteristics, and compatibility analysis"
    },
    {
      icon: <Sparkles className="h-6 w-6 text-purple-500" />,
      title: "AI-Powered Maharishi Parashar",
      description: "Chat with our AI sage for personalized guidance and remedies"
    },
    {
      icon: <Users className="h-6 w-6 text-green-500" />,
      title: "Personality Analysis",
      description: "Discover your true nature through our advanced personality test"
    },
    {
      icon: <Gift className="h-6 w-6 text-red-500" />,
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
        <div className="relative px-6 pt-16 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-orange-100 text-orange-800 border-orange-200">
              ✨ Completely FREE - Limited Time Launch Offer
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover Your Destiny with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600"> AyushAstro</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get your complete Vedic astrology analysis with detailed life predictions, 
              personality insights, and AI-powered guidance - absolutely FREE!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                onClick={() => navigate('/kundali')}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3"
              >
                Generate Free Kundali
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/personality-test')}
                className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-3"
              >
                Take Personality Test
              </Button>
            </div>

            <div className="max-w-md mx-auto mb-12">
              <CountdownTimer />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Astrology Solutions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to understand your cosmic blueprint
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-orange-200">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    {feature.icon}
                    <CardTitle className="text-lg text-gray-900">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* What You Get Section */}
      <div className="py-20 px-6 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What's Included in Your FREE Analysis
            </h2>
            <p className="text-xl text-gray-600">
              Get comprehensive insights worth thousands of rupees - completely free
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Unlock Your Cosmic Secrets?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands who have discovered their true potential through Vedic astrology
          </p>
          
          <Button 
            size="lg" 
            onClick={() => navigate('/kundali')}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-12 py-4 text-lg"
          >
            Start Your Free Analysis Now
          </Button>
          
          <p className="text-sm text-gray-500 mt-4">
            No payment required • No hidden charges • Complete analysis in minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
