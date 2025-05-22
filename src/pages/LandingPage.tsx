import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, Star, Zap, Calendar, Users, Brain, ShieldCheck, Clock } from "lucide-react";
import AppLogo from "@/components/AppLogo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
const LandingPage = () => {
  const navigate = useNavigate();

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
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <motion.div className="flex-1 space-y-6" initial="hidden" animate="visible" variants={fadeIn}>
              <div className="flex items-center gap-3 mb-6">
                <AppLogo size="md" />
                <h1 className="text-3xl font-bold gradient-heading">AyushAstro</h1>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Know What's Coming. <span className="gradient-heading">Shape What's Next.</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                AyushAstro blends 5000-year-old Vedic astrology with Swiss-grade algorithms to give you hyper-personalized, 
                future-proof guidance. Decisions backed by destiny + data.
              </p>
              <div className="pt-4">
                <Button size="lg" onClick={() => navigate('/')} className="group bg-red-600 hover:bg-red-500 rounded-2xl">
                  Get Your Free Astro Report in 60 Seconds
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <div className="flex gap-4 mt-4">
                  <Badge variant="outline" className="bg-background/50">Accurate</Badge>
                  <Badge variant="outline" className="bg-background/50">Vedic-Backed</Badge>
                  <Badge variant="outline" className="bg-background/50">AI-Powered</Badge>
                </div>
              </div>
            </motion.div>
            <motion.div className="flex-1" initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 0.8
          }}>
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-orange-500 rounded-2xl blur opacity-30 animate-pulse-slow"></div>
                <div className="relative bg-card rounded-xl overflow-hidden border shadow-xl">
                  <img src="https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="AyushAstro Dashboard" className="w-full aspect-[4/3] object-cover object-center rounded-t-xl" />
                  <div className="p-4">
                    <h3 className="text-lg font-medium">Your Kundali Dashboard</h3>
                    <p className="text-sm text-muted-foreground">Dynamic insights based on your birth details</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pain + Belief Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div className="text-center mb-12" initial={{
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Most Astrology Feels Like Guesswork. <span className="gradient-heading">Ours Runs on Swiss Precision.</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <motion.div className="space-y-6" initial={{
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
              <h3 className="text-xl font-semibold">The Pain</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="mt-1 text-destructive"><Check size={18} /></div>
                  <p>Generic horoscope apps say the same thing to everyone</p>
                </li>
                <li className="flex gap-3">
                  <div className="mt-1 text-destructive"><Check size={18} /></div>
                  <p>Astrologers leave you more confused than before</p>
                </li>
                <li className="flex gap-3">
                  <div className="mt-1 text-destructive"><Check size={18} /></div>
                  <p>No clarity on when to act, or why things go wrong</p>
                </li>
              </ul>
            </motion.div>
            
            <motion.div className="space-y-6" initial={{
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
              <h3 className="text-xl font-semibold">The Solution</h3>
              <p className="text-muted-foreground">
                We built AyushAstro to bring logic to the cosmic. Powered by the world's most accurate ephemeris 
                (Swiss Ephemeris), our engine calculates 100+ variables per second—so you get actionable insight, not blind faith.
              </p>
              <div className="bg-card/60 border p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="text-primary" />
                  <h4 className="font-medium">Swiss-Grade Precision</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our algorithms process planetary positions with sub-second accuracy for reliable predictions.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div className="text-center mb-12" initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              One Platform. <span className="gradient-heading">Infinite Clarity.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tools designed for modern seekers who want clarity, not confusion.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          }].map((feature, index) => <motion.div key={index} className="bg-card border p-6 rounded-xl hover:shadow-lg transition-shadow" initial={{
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
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>)}
          </div>
          
          <motion.div className="mt-12 text-center" initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <p className="text-muted-foreground mb-4">
              <span className="font-semibold">Bonus:</span> Free monthly astro-business alerts + 
              exclusive invite to Founder Forecast Circle (Vedic business timing cohort)
            </p>
            <Button size="lg" onClick={() => navigate('/')} variant="outline" className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border-primary/30">
              Unlock Your Cosmic Strategy
              <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Emotional & Aspirational Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              This Isn't About Prediction. <span className="gradient-heading">It's About Power.</span>
            </h2>
            <p className="text-lg md:text-xl mb-6">
              AyushAstro gives clarity when you're at a crossroads. It's your personal strategy oracle.
              Built by entrepreneurs, for those who don't want to waste a decade waiting for "divine timing".
            </p>
            <p className="text-lg font-semibold mb-10">
              This is practical spirituality—de-coded, digitalized, decision-ready.
            </p>
            <Button size="lg" onClick={() => navigate('/')} className="group">
              Try the Engine – First Report is Free
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              No Card. No Guesswork. Just Truth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div className="text-center mb-12" initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-3xl md:text-4xl font-bold">
              Used by <span className="gradient-heading">Founders, Healers & High Performers</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <CardContent className="pt-6">
                  <div className="flex gap-4 mb-4">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className="h-5 w-5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <blockquote className="text-lg mb-6">
                    "Changed how I approach product launches. I align now with cosmic flow. My last 3 launches hit 2X projections."
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-600"></div>
                    <div>
                      <p className="font-semibold">Sanya</p>
                      <p className="text-sm text-muted-foreground">SaaS Founder</p>
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
                <CardContent className="pt-6">
                  <div className="flex gap-4 mb-4">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className="h-5 w-5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <blockquote className="text-lg mb-6">
                    "I used to fear retrogrades. Now I leverage them. This system is Vedic science + startup logic in one."
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600"></div>
                    <div>
                      <p className="font-semibold">Rohan</p>
                      <p className="text-sm text-muted-foreground">Brand Strategist</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          <motion.div className="mt-12 text-center" initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <p className="text-muted-foreground">
              <span className="font-semibold">Trusted By:</span> Founders at 91Springboard | 
              Mentors at TiE | CXOs from GrowthStage Startups
            </p>
          </motion.div>
        </div>
      </section>

      {/* Offer & Scarcity Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-orange-500/10">
        <div className="container mx-auto max-w-4xl">
          <motion.div className="text-center mb-12" initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Get Your Personalized Report <span className="gradient-heading">Before Planetary Positions Shift Again</span>
            </h2>
          </motion.div>
          
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12" initial={{
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
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="text-primary mt-1"><Check /></div>
                <div>
                  <h3 className="font-semibold">Instant Janma Kundali</h3>
                  <p className="text-sm text-muted-foreground">20+ layers decoded</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-primary mt-1"><Check /></div>
                <div>
                  <h3 className="font-semibold">Personalized 30-Day Dasha Guidance</h3>
                  <p className="text-sm text-muted-foreground">Daily insights for your month ahead</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-primary mt-1"><Check /></div>
                <div>
                  <h3 className="font-semibold">Business Timing Report</h3>
                  <p className="text-sm text-muted-foreground">Strategic moments for key decisions</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="text-primary mt-1"><Check /></div>
                <div>
                  <h3 className="font-semibold">Relationship Karma Patterns</h3>
                  <p className="text-sm text-muted-foreground">Understand repeating dynamics</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-card border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Today Only:</span>
                  <Badge>70% Off</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Premium Reading</span>
                  <div>
                    <span className="text-sm line-through text-muted-foreground mr-2">₹999</span>
                    <span className="text-lg font-bold">₹299</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div className="text-center mb-12" initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <div className="inline-block bg-card border rounded-lg p-4 mb-8">
              <p className="text-sm font-medium mb-1">OFFER EXPIRES IN:</p>
              <div className="flex gap-4 text-2xl font-bold">
                <div className="w-16 p-2 bg-muted/50 rounded">06</div>
                <div className="w-16 p-2 bg-muted/50 rounded">43</div>
                <div className="w-16 p-2 bg-muted/50 rounded">21</div>
              </div>
            </div>
            
            <Button size="lg" onClick={() => navigate('/')} className="group animate-pulse-slow">
              Unlock My Vedic Report
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Risk Reversal + Ethics Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Built on Shastra. Enhanced by Code.
            </h2>
            <p className="text-muted-foreground mb-6">
              We don't claim to change your fate. We help you understand it deeply—so you choose your battles better.
            </p>
            <p className="font-medium mb-6">
              Try it free. If you don't feel clarity in 24 hours, don't upgrade. No spam, no calls, no tricks.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <motion.div className="text-center mb-12" initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="q1">Basics</TabsTrigger>
                <TabsTrigger value="q2">For Who?</TabsTrigger>
                <TabsTrigger value="q3">Accuracy</TabsTrigger>
              </TabsList>
              <TabsContent value="q1" className="p-4 mt-4 bg-card rounded-lg border">
                <h3 className="font-semibold mb-2">Is this like a normal horoscope app?</h3>
                <p className="text-muted-foreground">
                  No. It's built on precise planetary calculations, not vague zodiac summaries. We use the Swiss Ephemeris
                  for calculations that are accurate to the second, providing personalized insights based on your exact birth time.
                </p>
              </TabsContent>
              <TabsContent value="q2" className="p-4 mt-4 bg-card rounded-lg border">
                <h3 className="font-semibold mb-2">Who is this for?</h3>
                <p className="text-muted-foreground">
                  Entrepreneurs, life optimizers, anyone navigating key life decisions. Our platform is especially valuable
                  for those who want data-backed insights for important life and business decisions.
                </p>
              </TabsContent>
              <TabsContent value="q3" className="p-4 mt-4 bg-card rounded-lg border">
                <h3 className="font-semibold mb-2">How accurate is this?</h3>
                <p className="text-muted-foreground">
                  Back-tested using Swiss Ephemeris, refined with 300+ astrological rules. Our system has been validated by
                  professional astrologers and continues to improve with user feedback and additional data.
                </p>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/20 to-orange-500/20">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Stop Guessing. Start Aligning.
              <span className="block mt-2 gradient-heading">AyushAstro gives you decoded Vedic insight on-demand.</span>
            </h2>
            
            <Button size="lg" onClick={() => navigate('/')} className="group">
              Get Your Free Report – See What's Ahead
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="flex gap-4 mt-4 justify-center">
              <Badge variant="outline" className="bg-background/50">100% Personalized</Badge>
              <Badge variant="outline" className="bg-background/50">Vedic-Verified</Badge>
              <Badge variant="outline" className="bg-background/50">AI Precision</Badge>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center gap-3">
              <AppLogo size="sm" />
              <span className="font-semibold">AyushAstro</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Copyright © {new Date().getFullYear()} AyushAstro. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default LandingPage;