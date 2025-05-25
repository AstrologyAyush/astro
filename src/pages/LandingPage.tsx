
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, Star, Zap, Calendar, Users, Brain, ShieldCheck, Clock } from "lucide-react";
import AppLogo from "@/components/AppLogo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import CountdownTimer from "@/components/CountdownTimer";

const LandingPage = () => {
  const navigate = useNavigate();

  // Navigation function to ensure consistent redirection
  const navigateToKundali = () => {
    navigate('/kundali');
  };

  // Animation variants
  const fadeIn = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  
  return <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      {/* Hero Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12">
            <motion.div className="flex-1 space-y-4 sm:space-y-6 text-center lg:text-left" initial="hidden" animate="visible" variants={fadeIn}>
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4 sm:mb-6">
                <AppLogo size="lg" />
                <h1 className="text-2xl sm:text-3xl font-bold gradient-heading">Ayu</h1>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Know What's Coming. <span className="gradient-heading">Shape What's Next.</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                Ayu blends 5000-year-old Vedic astrology with Swiss-grade algorithms to give you hyper-personalized, 
                future-proof guidance. Decisions backed by destiny + data.
              </p>
              <div className="pt-2 sm:pt-4">
                <Button size="lg" onClick={navigateToKundali} className="group bg-red-600 hover:bg-red-500 rounded-2xl text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 min-h-[44px]">
                  Get Your Free Astro Report in 60 Seconds
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <div className="flex gap-2 sm:gap-4 mt-4 justify-center lg:justify-start flex-wrap">
                  <Badge variant="outline" className="bg-background/50 text-xs sm:text-sm">Accurate</Badge>
                  <Badge variant="outline" className="bg-background/50 text-xs sm:text-sm">Vedic-Backed</Badge>
                  <Badge variant="outline" className="bg-background/50 text-xs sm:text-sm">AI-Powered</Badge>
                </div>
              </div>
            </motion.div>
            
            <motion.div className="flex-1 w-full lg:w-auto" initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 0.8
          }}>
              <div className="relative max-w-lg mx-auto">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-orange-500 rounded-2xl blur opacity-30 animate-pulse-slow"></div>
                <div className="relative bg-card rounded-xl overflow-hidden border shadow-xl">
                  <img src="https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Ayu Dashboard" className="w-full aspect-[4/3] object-cover object-center rounded-t-xl" />
                  <div className="p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-medium">Your Kundali Dashboard</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Dynamic insights based on your birth details</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pain + Belief Section */}
      <section className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <motion.div className="text-center mb-8 sm:mb-12" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Most Astrology Feels Like Guesswork. <span className="gradient-heading">Ours Runs on Swiss Precision.</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            <motion.div className="space-y-4 sm:space-y-6" initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }}>
              <h3 className="text-lg sm:text-xl font-semibold">The Pain</h3>
              <ul className="space-y-3 sm:space-y-4">
                <li className="flex gap-3">
                  <div className="mt-1 text-destructive flex-shrink-0"><Check size={18} /></div>
                  <p className="text-sm sm:text-base">Generic horoscope apps say the same thing to everyone</p>
                </li>
                <li className="flex gap-3">
                  <div className="mt-1 text-destructive flex-shrink-0"><Check size={18} /></div>
                  <p className="text-sm sm:text-base">Astrologers leave you more confused than before</p>
                </li>
                <li className="flex gap-3">
                  <div className="mt-1 text-destructive flex-shrink-0"><Check size={18} /></div>
                  <p className="text-sm sm:text-base">No clarity on when to act, or why things go wrong</p>
                </li>
              </ul>
            </motion.div>
            
            <motion.div className="space-y-4 sm:space-y-6" initial={{
            opacity: 0,
            x: 20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }}>
              <h3 className="text-lg sm:text-xl font-semibold">The Solution</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                We built Ayu to bring logic to the cosmic. Powered by the world's most accurate ephemeris 
                (Swiss Ephemeris), our engine calculates 100+ variables per second—so you get actionable insight, not blind faith.
              </p>
              <div className="bg-card/60 border p-3 sm:p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="text-primary flex-shrink-0" />
                  <h4 className="font-medium text-sm sm:text-base">Swiss-Grade Precision</h4>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Our algorithms process planetary positions with sub-second accuracy for reliable predictions.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Benefits Section */}
      <section className="py-8 sm:py-12 md:py-20 px-3 sm:px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div className="text-center mb-8 sm:mb-12" initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              One Platform. <span className="gradient-heading">Infinite Clarity.</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Tools designed for modern seekers who want clarity, not confusion.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[{
            icon: <Star className="text-amber-500" />,
            title: "Instant Kundali Decoder",
            description: "Get 20+ chart layers including yogas, doshas, dashas"
          }, {
            icon: <Clock className="text-emerald-500" />,
            title: "Decision Timing Engine",
            description: "Know when to invest, marry, move, launch"
          }, {
            icon: <Calendar className="text-blue-500" />,
            title: "Life Timeline View",
            description: "See upcoming opportunities and threats month-by-month"
          }, {
            icon: <Brain className="text-purple-500" />,
            title: "AI-Guided Remedies",
            description: "Backed by Vedic logic, not superstition"
          }, {
            icon: <ShieldCheck className="text-rose-500" />,
            title: "Shadbala Strength Scoring",
            description: "See how strong your planetary support is right now"
          }, {
            icon: <Users className="text-cyan-500" />,
            title: "Founder Forecast Circle",
            description: "Exclusive invite to Vedic business timing cohort"
          }].map((feature, index) => <motion.div key={index} className="bg-card border p-4 sm:p-6 rounded-xl hover:shadow-lg transition-shadow" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.4,
            delay: index * 0.1
          }}>
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-muted flex items-center justify-center mb-3 sm:mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">{feature.description}</p>
              </motion.div>)}
          </div>
          
          <motion.div className="mt-8 sm:mt-12 text-center" initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <p className="text-muted-foreground mb-4 text-xs sm:text-sm">
              <span className="font-semibold">Bonus:</span> Free monthly astro-business alerts + 
              exclusive invite to Founder Forecast Circle (Vedic business timing cohort)
            </p>
            <Button size="lg" onClick={navigateToKundali} variant="outline" className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border-primary/30 min-h-[44px] text-sm sm:text-base">
              Unlock Your Cosmic Strategy
              <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Emotional & Aspirational Section */}
      <section className="py-8 sm:py-12 md:py-20 px-3 sm:px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              This Isn't About Prediction. <span className="gradient-heading">It's About Power.</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl mb-4 sm:mb-6">
              Ayu gives clarity when you're at a crossroads. It's your personal strategy oracle.
              Built by entrepreneurs, for those who don't want to waste a decade waiting for "divine timing".
            </p>
            <p className="text-base sm:text-lg font-semibold mb-6 sm:mb-10">
              This is practical spirituality—de-coded, digitalized, decision-ready.
            </p>
            <Button size="lg" onClick={navigateToKundali} className="group min-h-[44px] text-sm sm:text-base">
              Try the Engine – First Report is Free
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="mt-4 text-xs sm:text-sm text-muted-foreground">
              No Card. No Guesswork. Just Truth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-8 sm:py-12 md:py-20 px-3 sm:px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div className="text-center mb-8 sm:mb-12" initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Used by <span className="gradient-heading">Founders, Healers & High Performers</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }}>
              <Card>
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex gap-1 mb-3 sm:mb-4">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <blockquote className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-6">
                    "Changed how I approach product launches. I align now with cosmic flow. My last 3 launches hit 2X projections."
                  </blockquote>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-600"></div>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Sanya</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">SaaS Founder</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div initial={{
            opacity: 0,
            x: 20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }}>
              <Card>
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex gap-1 mb-3 sm:mb-4">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <blockquote className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-6">
                    "I used to fear retrogrades. Now I leverage them. This system is Vedic science + startup logic in one."
                  </blockquote>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600"></div>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Rohan</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Brand Strategist</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          <motion.div className="mt-8 sm:mt-12 text-center" initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <p className="text-muted-foreground text-xs sm:text-sm">
              <span className="font-semibold">Trusted By:</span> Founders at 91Springboard | 
              Mentors at TiE | CXOs from GrowthStage Startups
            </p>
          </motion.div>
        </div>
      </section>

      {/* Offer & Scarcity Section with Working Timer */}
      <section className="py-8 sm:py-12 md:py-20 px-3 sm:px-4 bg-gradient-to-r from-primary/10 to-orange-500/10">
        <div className="container mx-auto max-w-5xl">
          <motion.div className="text-center mb-8 sm:mb-12" initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Get Your Personalized Report <span className="gradient-heading">Free for Limited Time</span>
            </h2>
          </motion.div>
          
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3">
                <div className="text-primary mt-1 flex-shrink-0"><Check /></div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">Instant Janma Kundali</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">20+ layers decoded</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-primary mt-1 flex-shrink-0"><Check /></div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">Personalized 30-Day Dasha Guidance</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Daily insights for your month ahead</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-primary mt-1 flex-shrink-0"><Check /></div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">Business Timing Report</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Strategic moments for key decisions</p>
                </div>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3">
                <div className="text-primary mt-1 flex-shrink-0"><Check /></div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">Relationship Karma Patterns</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Understand repeating dynamics</p>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-card border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium">Limited Time:</span>
                  <Badge className="bg-green-500 text-white text-xs">100% FREE</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm sm:text-base">Premium Reading</span>
                  <div>
                    <span className="text-base sm:text-lg font-bold text-green-600">FREE</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div className="text-center mb-8 sm:mb-12" initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <CountdownTimer className="mb-6 sm:mb-8" />
            
            <Button size="lg" onClick={navigateToKundali} className="group animate-pulse-slow min-h-[44px] text-sm sm:text-base px-6 sm:px-8">
              Get My Free Vedic Report
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Risk Reversal + Ethics Section */}
      <section className="py-8 sm:py-12 md:py-16 px-3 sm:px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
              Built on Shastra. Enhanced by Code.
            </h2>
            <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
              We don't claim to change your fate. We help you understand it deeply—so you choose your battles better.
            </p>
            <p className="font-medium mb-4 sm:mb-6 text-sm sm:text-base">
              Try it free. If you don't feel clarity in 24 hours, no worries. No spam, no calls, no tricks.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <motion.div className="text-center mb-8 sm:mb-12" initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-2xl sm:text-3xl font-bold">Frequently Asked Questions</h2>
          </motion.div>
          
          <motion.div initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <Tabs defaultValue="q1" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger value="q1" className="text-xs sm:text-sm p-2 sm:p-3">Basics</TabsTrigger>
                <TabsTrigger value="q2" className="text-xs sm:text-sm p-2 sm:p-3">For Who?</TabsTrigger>
                <TabsTrigger value="q3" className="text-xs sm:text-sm p-2 sm:p-3">Accuracy</TabsTrigger>
              </TabsList>
              <TabsContent value="q1" className="p-3 sm:p-4 mt-4 bg-card rounded-lg border">
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Is this like a normal horoscope app?</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  No. It's built on precise planetary calculations, not vague zodiac summaries. We use the Swiss Ephemeris
                  for calculations that are accurate to the second, providing personalized insights based on your exact birth time.
                </p>
              </TabsContent>
              <TabsContent value="q2" className="p-3 sm:p-4 mt-4 bg-card rounded-lg border">
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Who is this for?</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Entrepreneurs, life optimizers, anyone navigating key life decisions. Our platform is especially valuable
                  for those who want data-backed insights for important life and business decisions.
                </p>
              </TabsContent>
              <TabsContent value="q3" className="p-3 sm:p-4 mt-4 bg-card rounded-lg border">
                <h3 className="font-semibold mb-2 text-sm sm:text-base">How accurate is this?</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Back-tested using Swiss Ephemeris, refined with 300+ astrological rules. Our system has been validated by
                  professional astrologers and continues to improve with user feedback and additional data.
                </p>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 bg-gradient-to-r from-primary/20 to-orange-500/20">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
              Stop Guessing. Start Aligning.
              <span className="block mt-2 gradient-heading">Ayu gives you decoded Vedic insight on-demand.</span>
            </h2>
            
            <Button size="lg" onClick={navigateToKundali} className="group min-h-[44px] text-sm sm:text-base">
              Get Your Free Report – See What's Ahead
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="flex gap-2 sm:gap-4 mt-4 justify-center flex-wrap">
              <Badge variant="outline" className="bg-background/50 text-xs sm:text-sm">100% Personalized</Badge>
              <Badge variant="outline" className="bg-background/50 text-xs sm:text-sm">Vedic-Verified</Badge>
              <Badge variant="outline" className="bg-background/50 text-xs sm:text-sm">AI Precision</Badge>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-6 sm:py-8 px-3 sm:px-4 border-t">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <AppLogo size="sm" />
              <span className="font-semibold text-sm sm:text-base">Ayu</span>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
              Copyright © {new Date().getFullYear()} Ayu. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default LandingPage;
