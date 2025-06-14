
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Target, Brain, Shield, Globe, Code, Sparkles } from "lucide-react";

const AboutUs = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Star className="h-5 w-5 text-orange-500" />,
      title: "Vedic + AI Hybrid Engine",
      description: "We fuse lineage-tested Jyotish rules with automated Swiss Ephemeris logic—no guesswork, no fluff."
    },
    {
      icon: <Target className="h-5 w-5 text-blue-500" />,
      title: "Data-driven Accuracy",
      description: "Just as AI shopping assistants optimize product discovery, we optimize destiny discovery—pinpoint accuracy with every Kundali reading."
    },
    {
      icon: <Brain className="h-5 w-5 text-purple-500" />,
      title: "Tailored Interpretation",
      description: "LLM-powered explanations that feel human, contextual, and actionable—not robotic."
    },
    {
      icon: <Shield className="h-5 w-5 text-green-500" />,
      title: "Comprehensive Tools",
      description: "Includes Janma Kundali, Navamsa chart, Yogas, Remedies, personality insights, and karmic mapping."
    },
    {
      icon: <Globe className="h-5 w-5 text-indigo-500" />,
      title: "Dual-Language Reach",
      description: "Fluent in English and Hindi—astrology should speak your language."
    },
    {
      icon: <Code className="h-5 w-5 text-pink-500" />,
      title: "Enterprise-Ready",
      description: "APIs for astrologers, matchmakers, coaches, and third-party platforms."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header with back button */}
      <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-orange-100 dark:border-gray-700 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:text-orange-300 dark:hover:bg-orange-900/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">AyuAstro</span>
          </h1>
          <div className="max-w-4xl mx-auto">
            <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed px-4">
              At AyuAstro, we harness <span className="font-semibold text-orange-600 dark:text-orange-400">5,000-year-old Vedic wisdom</span> and 
              pair it with cutting-edge AI-grade algorithms to deliver hyper-personalized astrological insights—for 
              decisions based on <span className="font-semibold text-red-600 dark:text-red-400">destiny and data</span>.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-12 md:mb-16">
          <Card className="border-orange-200 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl md:text-2xl lg:text-3xl text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3">
                <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-orange-500" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
                Break through generic horoscopes. We deliver your individual birth chart, Dashas, yogas, 
                Doshas, transits, and remedies—with <span className="font-semibold text-orange-600 dark:text-orange-400">Swiss-grade precision</span>, 
                automated for modern users.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Why We Stand Out Section */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8 md:mb-12">
            Why We Stand Out
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:border-orange-200 dark:hover:border-orange-800 bg-white dark:bg-gray-800">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    {feature.icon}
                    <CardTitle className="text-sm md:text-base text-gray-900 dark:text-gray-100">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="mb-12">
          <Card className="border-red-200 dark:border-red-800 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl md:text-2xl lg:text-3xl text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3">
                <Target className="h-6 w-6 md:h-8 md:w-8 text-red-500" />
                Philosophy: Strategy Over Superstition
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
                Guided by <span className="font-semibold text-red-600 dark:text-red-400">Chanakya Niti</span> and 
                <span className="font-semibold text-orange-600 dark:text-orange-400"> Krishna's strategic wisdom</span>, 
                AyuAstro doesn't just predict your future—it equips you to shape it. 
                <span className="font-semibold text-gray-900 dark:text-gray-100"> Astrology is a tool for planning—not fate.</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6">
            Ready to Experience the Future of Astrology?
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-md mx-auto">
            <Button 
              onClick={() => navigate('/kundali')}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-full shadow-lg flex-1"
            >
              Get Your Free Report
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/personality-test')}
              className="border-orange-600 text-orange-600 hover:bg-orange-50 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-900/20 px-6 py-3 rounded-full flex-1"
            >
              Take Personality Test
            </Button>
          </div>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-4">
            No payment required • Instant results • Swiss Ephemeris accuracy
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
