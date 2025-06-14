import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Target, Star, Play, CheckCircle, Clock, Users, Sparkles, Brain, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppLogo from './AppLogo';
import { useLanguage } from '@/contexts/LanguageContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const {
    t
  } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({
    hours: 6,
    minutes: 21,
    seconds: 0
  });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return {
            ...prev,
            seconds: prev.seconds - 1
          };
        } else if (prev.minutes > 0) {
          return {
            ...prev,
            minutes: prev.minutes - 1,
            seconds: 59
          };
        } else if (prev.hours > 0) {
          return {
            hours: prev.hours - 1,
            minutes: 59,
            seconds: 59
          };
        } else {
          return {
            hours: 6,
            minutes: 21,
            seconds: 0
          }; // Reset timer
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Navigation handlers
  const handleGetStarted = () => {
    navigate('/kundali');
  };
  const handlePersonalityTest = () => {
    navigate('/personality-test');
  };
  const handleDailyHoroscope = () => {
    navigate('/daily-horoscope');
  };
  const handleKundaliGeneration = () => {
    navigate('/kundali');
  };
  return <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-16 text-center">
        <div className="flex items-center justify-center mb-6 md:mb-8">
          <AppLogo size="xl" className="mr-4" />
          <div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                AyuAstro
              </span>
            </h1>
            <p className="text-sm md:text-lg text-orange-600 font-medium mt-2">
              {t('Based on Rishi Parasher Principles') || 'Ancient Wisdom. Precision Technology.'}
            </p>
          </div>
        </div>

        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6">
          Know What's Coming. Shape What's Next.
        </h2>
        
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-6 md:mb-8 px-4">
          AyuAstro blends 5000-year-old Vedic astrology with Swiss-grade algorithms to give you 
          hyper-personalized, future-proof guidance. Decisions backed by destiny + data.
        </p>

        {/* Main CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-6 md:mb-8 px-4 max-w-4xl mx-auto">
          <Button onClick={handleKundaliGeneration} className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white md:text-lg md:px-8 md:py-4 shadow-lg flex-1 max-w-sm sm:mx-0 rounded-3xl font-bold py-[5px] text-sm px-[100px] my-[3px] mx-[4px] text-center">
            <Play className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            Get Your Free Astro Report in 60 Seconds
          </Button>
        </div>

        {/* Feature Navigation Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto mb-6 md:mb-8 px-4">
          <Button onClick={handlePersonalityTest} variant="outline" className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-sm md:text-base px-4 md:px-6 py-3 md:py-4 rounded-xl">
            <Brain className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            {t('personality_test') || 'Vedic Personality Test'}
          </Button>
          
          <Button onClick={handleDailyHoroscope} variant="outline" className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm md:text-base px-4 md:px-6 py-3 md:py-4 rounded-xl">
            <Calendar className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            {t('daily_horoscope') || 'Daily Horoscope'}
          </Button>
          
          <Button onClick={handleGetStarted} variant="outline" className="border-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 text-sm md:text-base px-4 md:px-6 py-3 md:py-4 rounded-xl sm:col-span-2 lg:col-span-1">
            <Crown className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            Swiss Ephemeris Kundali
          </Button>
        </div>
        
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-4 px-4">
          Accurate | Vedic-Backed | Analyzed by Rishi Parasher
        </p>
      </section>

      {/* Product Benefits */}
      <section className="py-8 md:py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-4">
            One Platform. Infinite Clarity.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto mt-8 md:mt-12">
            <Card className="border-orange-200 dark:border-orange-800 hover:shadow-lg transition-shadow bg-white dark:bg-gray-900">
              <CardContent className="p-4 md:p-6">
                <Crown className="h-8 w-8 md:h-12 md:w-12 text-orange-500 mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Swiss Ephemeris Kundali</h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">Get 20+ chart layers including yogas, doshas, dashas with astronomical precision</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 dark:border-orange-800 hover:shadow-lg transition-shadow bg-white dark:bg-gray-900">
              <CardContent className="p-4 md:p-6">
                <Brain className="h-8 w-8 md:h-12 md:w-12 text-purple-500 mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Vedic Personality Analysis</h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">Discover your cosmic personality based on ancient Vedic wisdom and psychological insights</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 dark:border-orange-800 hover:shadow-lg transition-shadow bg-white dark:bg-gray-900">
              <CardContent className="p-4 md:p-6">
                <Calendar className="h-8 w-8 md:h-12 md:w-12 text-blue-500 mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Daily Vedic Guidance</h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">Get daily horoscope with Rishi Parasher wisdom and practical astrological guidance</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 dark:border-orange-800 hover:shadow-lg transition-shadow bg-white dark:bg-gray-900">
              <CardContent className="p-4 md:p-6">
                <Target className="h-8 w-8 md:h-12 md:w-12 text-green-500 mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Decision Timing Engine</h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">Know when to invest, marry, move, launch based on planetary calculations</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 dark:border-orange-800 hover:shadow-lg transition-shadow bg-white dark:bg-gray-900">
              <CardContent className="p-4 md:p-6">
                <Sparkles className="h-8 w-8 md:h-12 md:w-12 text-indigo-500 mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">AI Rishi Parasher Guidance</h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">Chat with our AI sage for personalized remedies and astrological insights</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 dark:border-orange-800 hover:shadow-lg transition-shadow bg-white dark:bg-gray-900">
              <CardContent className="p-4 md:p-6">
                <Users className="h-8 w-8 md:h-12 md:w-12 text-pink-500 mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Complete Life Analysis</h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">Career, relationships, health, wealth - comprehensive Vedic insights for all life areas</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Offer & Scarcity */}
      <section className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 py-8 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8 md:mb-12">
            Get Your Personalized Report Before Planetary Positions Shift Again
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-4xl mx-auto mb-6 md:mb-8">
            <div className="p-3 md:p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
              <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-500 mx-auto mb-2" />
              <p className="font-medium text-sm md:text-base text-gray-900 dark:text-gray-100">Instant Janma Kundali</p>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">(20+ layers decoded)</p>
            </div>
            
            <div className="p-3 md:p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
              <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-500 mx-auto mb-2" />
              <p className="font-medium text-sm md:text-base text-gray-900 dark:text-gray-100">Personality Analysis</p>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Vedic Psychology</p>
            </div>
            
            <div className="p-3 md:p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
              <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-500 mx-auto mb-2" />
              <p className="font-medium text-sm md:text-base text-gray-900 dark:text-gray-100">Daily Guidance</p>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Rishi Parasher AI</p>
            </div>
            
            <div className="p-3 md:p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
              <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-500 mx-auto mb-2" />
              <p className="font-medium text-sm md:text-base text-gray-900 dark:text-gray-100">Life Predictions</p>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Career & Relationships</p>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 md:p-6 max-w-md mx-auto mb-6 md:mb-8">
            <h3 className="text-lg md:text-xl font-bold text-red-800 dark:text-red-300 mb-3 md:mb-4">Today Only: Free Trial Report</h3>
            <div className="flex items-center justify-center gap-2 text-red-700 dark:text-red-400">
              <Clock className="h-4 w-4 md:h-5 md:w-5" />
              <span className="text-base md:text-lg font-bold">
                OFFER EXPIRES IN: {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>

          <Button onClick={handleKundaliGeneration} className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-lg md:text-xl px-8 md:px-10 py-3 md:py-4 rounded-full shadow-lg">
            Unlock My Vedic Report
          </Button>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 py-8 md:py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8">
            Stop Guessing. Start Aligning. AyuAstro gives you decoded Vedic insight on-demand.
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-6 max-w-4xl mx-auto">
            <Button onClick={handleKundaliGeneration} className="bg-white text-orange-600 hover:bg-gray-100 md:text-xl px-8 md:px-10 py-3 md:py-4 rounded-full shadow-lg mx-px text-base">
              Get Your Free Report – See What's Ahead
            </Button>
            
            <Button onClick={handlePersonalityTest} variant="outline" className="border-2 border-white hover:bg-white text-lg md:text-xl px-8 md:px-10 py-3 md:py-4 rounded-full text-red-500">
              Take Personality Test
            </Button>
          </div>
          
          <p className="mt-4 text-orange-100 text-sm md:text-base">
            100% Personalized | Vedic-Verified | Rishi Parasher
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 md:py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <AppLogo size="md" className="mr-3" />
            <span className="text-lg md:text-xl font-bold">AyuAstro</span>
          </div>
          <div className="flex justify-center gap-4 mb-4">
            <Button 
              variant="link" 
              onClick={() => navigate('/about')}
              className="text-gray-400 hover:text-white p-0 h-auto"
            >
              About Us
            </Button>
            <Button 
              variant="link" 
              onClick={() => navigate('/faq')}
              className="text-gray-400 hover:text-white p-0 h-auto"
            >
              FAQ
            </Button>
            <Button 
              variant="link" 
              onClick={() => navigate('/kundali')}
              className="text-gray-400 hover:text-white p-0 h-auto"
            >
              Kundali
            </Button>
            <Button 
              variant="link" 
              onClick={() => navigate('/personality-test')}
              className="text-gray-400 hover:text-white p-0 h-auto"
            >
              Personality Test
            </Button>
          </div>
          <p className="text-gray-400 text-sm md:text-base">
            © 2025 AyuAstro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>;
};

export default LandingPage;
