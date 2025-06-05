
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Target, Star, Play, CheckCircle, Clock, Users, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppLogo from './AppLogo';

const LandingPage = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ hours: 6, minutes: 21, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 6, minutes: 21, seconds: 0 }; // Reset timer
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleGetStarted = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="flex items-center justify-center mb-8">
          <AppLogo size="xl" className="mr-4" />
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                AyuAstro
              </span>
            </h1>
            <p className="text-lg text-orange-600 font-medium mt-2">
              Ancient Wisdom. Precision Technology.
            </p>
          </div>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Know What's Coming. Shape What's Next.
        </h2>
        
        <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
          AyuAstro blends 5000-year-old Vedic astrology with Swiss-grade algorithms to give you 
          hyper-personalized, future-proof guidance. Decisions backed by destiny + data.
        </p>

        <Button 
          onClick={handleGetStarted}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-lg px-8 py-4 rounded-full shadow-lg"
        >
          <Play className="mr-2 h-5 w-5" />
          Get Your Free Astro Report in 60 Seconds
        </Button>
        
        <p className="text-sm text-gray-600 mt-4">
          Accurate | Vedic-Backed | Analyzed by Rishi Parasher
        </p>
      </section>

      {/* Pain + Belief Transformation */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Most Astrology Feels Like Guesswork. Ours Runs on Swiss Precision.
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-red-600 mb-4">The Problem:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p className="text-gray-700">Generic horoscope apps say the same thing to everyone</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p className="text-gray-700">Astrologers leave you more confused than before</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p className="text-gray-700">No clarity on when to act, or why things go wrong</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-green-600 mb-4">Our Solution:</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                We built AyuAstro to bring logic to the cosmic. Powered by the world's most accurate 
                ephemeris (Swiss Ephemeris), our engine calculates 100+ variables per second—so you get 
                actionable insight, not blind faith.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            One Platform. Infinite Clarity.
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12">
            <Card className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Crown className="h-12 w-12 text-orange-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Instant Kundali Decoder</h3>
                <p className="text-gray-600">Get 20+ chart layers including yogas, doshas, dashas</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Target className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Decision Timing Engine</h3>
                <p className="text-gray-600">Know when to invest, marry, move, launch</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Star className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Life Timeline View</h3>
                <p className="text-gray-600">See upcoming opportunities and threats month-by-month</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Sparkles className="h-12 w-12 text-purple-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Rishi Parasher Guided Remedies</h3>
                <p className="text-gray-600">Backed by Vedic logic, not superstition</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <CheckCircle className="h-12 w-12 text-indigo-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Shadbala Strength Scoring</h3>
                <p className="text-gray-600">See how strong your planetary support is right now</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-pink-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Bonus Features</h3>
                <p className="text-gray-600">Free monthly astro-business alerts + exclusive invite to Founder Forecast Circle</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Emotional & Aspirational */}
      <section className="bg-gradient-to-r from-orange-100 to-red-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            This Isn't About Prediction. It's About Power.
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700">
            <p>
              AyuAstro gives clarity when you're at a crossroads. It's your personal strategy oracle.
            </p>
            <p>
              Built by entrepreneurs, for those who don't want to waste a decade waiting for "divine timing".
            </p>
            <p className="font-semibold text-orange-800">
              This is practical spirituality—de-coded, digitalized, decision-ready.
            </p>
          </div>

          <Button 
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-lg px-8 py-4 rounded-full shadow-lg mt-8"
          >
            Try the Engine – First Report is Free
          </Button>
          
          <p className="text-sm text-gray-600 mt-4">
            No Card. No Guesswork. Just Truth.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Used by Founders, Healers & High Performers
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-orange-200">
              <CardContent className="p-6">
                <p className="text-gray-700 mb-4 italic">
                  "Changed how I approach product launches. I align now with cosmic flow. My last 3 launches hit 2X projections."
                </p>
                <p className="text-orange-600 font-semibold">– Sanya, SaaS Founder</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardContent className="p-6">
                <p className="text-gray-700 mb-4 italic">
                  "I used to fear retrogrades. Now I leverage them. This system is Vedic science + startup logic in one."
                </p>
                <p className="text-orange-600 font-semibold">– Rohan, Brand Strategist</p>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-gray-600 mt-8">
            <strong>Trusted By:</strong> Founders at 91Springboard | Mentors at TiE | CXOs from GrowthStage Startups
          </p>
        </div>
      </section>

      {/* Offer & Scarcity */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            Get Your Personalized Report Before Planetary Positions Shift Again
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            <div className="p-4 bg-orange-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="font-medium">Instant Janma Kundali</p>
              <p className="text-sm text-gray-600">(20+ layers decoded)</p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="font-medium">Personalized 30-Day Dasha Guidance</p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="font-medium">Business Timing Report</p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="font-medium">Relationship Karma Patterns</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto mb-8">
            <h3 className="text-xl font-bold text-red-800 mb-4">Today Only: Free Trial Report</h3>
            <div className="flex items-center justify-center gap-2 text-red-700">
              <Clock className="h-5 w-5" />
              <span className="text-lg font-bold">
                OFFER EXPIRES IN: {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>

          <Button 
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-xl px-10 py-4 rounded-full shadow-lg"
          >
            Unlock My Vedic Report
          </Button>
        </div>
      </section>

      {/* Risk Reversal + Ethics */}
      <section className="bg-gradient-to-r from-orange-100 to-red-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Built on Shastra. Enhanced by Code.
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6 text-lg text-gray-700">
            <p>
              We don't claim to change your fate. We help you understand it deeply—so you choose your battles better.
            </p>
            <p className="font-semibold">
              Try it free. If you don't feel clarity in 24 hours, don't upgrade. No spam, no calls, no tricks.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Q: Is this like a normal horoscope app?
              </h3>
              <p className="text-gray-700">
                No. It's built on precise planetary calculations, not vague zodiac summaries.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Q: Who is this for?
              </h3>
              <p className="text-gray-700">
                Entrepreneurs, life optimizers, anyone navigating key life decisions.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Q: How accurate is this?
              </h3>
              <p className="text-gray-700">
                Back-tested using Swiss Ephemeris, refined with 300+ astrological rules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Stop Guessing. Start Aligning. AyuAstro gives you decoded Vedic insight on-demand.
          </h2>
          
          <Button 
            onClick={handleGetStarted}
            className="bg-white text-orange-600 hover:bg-gray-100 text-xl px-10 py-4 rounded-full shadow-lg"
          >
            Get Your Free Report – See What's Ahead
          </Button>
          
          <p className="mt-4 text-orange-100">
            100% Personalized | Vedic-Verified | Rishi Parasher
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <AppLogo size="md" className="mr-3" />
            <span className="text-xl font-bold">AyuAstro</span>
          </div>
          <p className="text-gray-400">
            © 2025 AyuAstro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
