
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Book, Star, Shield, Clock, Target, Heart } from "lucide-react";
import { useState } from 'react';

const FAQ = () => {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<number[]>([0]); // First item open by default

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "What is a Kundali?",
      answer: "It's your birth chart—a snapshot of where the Sun, Moon, and other planets were when you were born. Think of it like your personal cosmic map 🌌",
      icon: <Star className="h-5 w-5 text-orange-500" />
    },
    {
      question: "Why is it useful?",
      answer: "It helps you understand your strengths, challenges, and what kind of person you are. You can even use it to plan for things like school, friendships, or future goals.",
      icon: <Target className="h-5 w-5 text-blue-500" />
    },
    {
      question: "How accurate is it?",
      answer: "We use precise star positions (real astronomy!) and proven Vedic rules—no guesswork. That's why our app is trusted and reliable.",
      icon: <Shield className="h-5 w-5 text-green-500" />
    },
    {
      question: "What if I don't know my birth time?",
      answer: "No problem! You can still get your Moon-sign and basic chart. Later, you can update it if you find the exact time.",
      icon: <Clock className="h-5 w-5 text-purple-500" />
    },
    {
      question: "Is astrology all about fate?",
      answer: "No. It's more like a guide—not \"your life is set in stone.\" You get to make choices and plan better decisions.",
      icon: <Heart className="h-5 w-5 text-red-500" />
    },
    {
      question: "Is my birth-data safe?",
      answer: "Absolutely. We keep your birth info locked and secure. Only you can see or use it.",
      icon: <Shield className="h-5 w-5 text-indigo-500" />
    }
  ];

  const glossaryTerms = [
    {
      term: "Kundali",
      meaning: "Your birth chart—where planets were when you were born"
    },
    {
      term: "Ascendant (Lagna)",
      meaning: "The zodiac sign on the horizon as you were born. It shows your personality style"
    },
    {
      term: "Moon Sign (Rashi)",
      meaning: "The Moon's position at your birth—it shapes your feelings and habits"
    },
    {
      term: "House",
      meaning: "The 12 life areas in your chart (like home, friends, school), marked by boxes"
    },
    {
      term: "Planet (Graha)",
      meaning: "Nine cosmic players: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu—each affects life in different ways"
    },
    {
      term: "Dasha",
      meaning: "Time periods ruled by planets. Shows when certain energies are stronger—like a school timetable for your life"
    },
    {
      term: "Yoga",
      meaning: "Special planet combos that can bring extra talent or challenges"
    },
    {
      term: "Dosha",
      meaning: "Small issues in the chart (like Manglik Dosha). Fixable with simple remedies"
    },
    {
      term: "Nakshatra",
      meaning: "The Moon moves through 27 special star-groups. They add more detail to your chart"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header with back button */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-orange-100 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Questions</span>
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed px-4 max-w-3xl mx-auto">
            Everything you need to know about Vedic astrology and how AyuAstro works
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mb-12 md:mb-16">
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-orange-200 hover:shadow-lg transition-all duration-300">
                <Collapsible open={openItems.includes(index)} onOpenChange={() => toggleItem(index)}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-orange-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {faq.icon}
                          <CardTitle className="text-sm md:text-base lg:text-lg text-gray-900 text-left">
                            {faq.question}
                          </CardTitle>
                        </div>
                        <ChevronDown 
                          className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                            openItems.includes(index) ? 'rotate-180' : ''
                          }`} 
                        />
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <p className="text-sm md:text-base text-gray-600 leading-relaxed pl-8">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </div>

        {/* Glossary Section */}
        <div className="mb-12">
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl md:text-2xl lg:text-3xl text-gray-900 flex items-center justify-center gap-3">
                <Book className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
                📘 Simple Glossary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {glossaryTerms.map((term, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-blue-100 hover:shadow-md transition-shadow">
                        <h4 className="font-semibold text-sm md:text-base text-blue-800 mb-2">
                          {term.term}
                        </h4>
                        <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                          {term.meaning}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
            Ready to Explore Your Cosmic Blueprint?
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-md mx-auto">
            <Button 
              onClick={() => navigate('/kundali')}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-full shadow-lg flex-1"
            >
              Get Your Free Kundali
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/personality-test')}
              className="border-orange-600 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-full flex-1"
            >
              Take Personality Test
            </Button>
          </div>
          <p className="text-xs md:text-sm text-gray-500 mt-4">
            No payment required • Instant results • Swiss Ephemeris accuracy
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
