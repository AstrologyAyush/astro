
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Star, 
  Zap, 
  Heart, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Timer,
  Gift
} from "lucide-react";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Timer countdown logic
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const targetDate = new Date(now + (7 * 24 * 60 * 60 * 1000)).getTime(); // 7 days from now
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <Star className="h-6 w-6" />,
      title: "Swiss Precision Calculations",
      titleHi: "स्विस सटीक गणना",
      description: "Advanced astronomical calculations using Swiss Ephemeris for unmatched accuracy",
      descriptionHi: "बेजोड़ सटीकता के लिए स्विस एफेमेरिस का उपयोग करके उन्नत खगोलीय गणना"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Karma Pattern Analysis",
      titleHi: "कर्म पैटर्न विश्लेषण",
      description: "Deep insights into relationship karma and past-life connections",
      descriptionHi: "संबंध कर्म और पूर्व जन्म के संबंधों में गहरी अंतर्दृष्टि"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "AI-Powered Predictions",
      titleHi: "AI-संचालित भविष्यवाणियां",
      description: "Machine learning enhanced interpretations for personalized guidance",
      descriptionHi: "व्यक्तिगत मार्गदर्शन के लिए मशीन लर्निंग बेहतर व्याख्या"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Interactive Charts",
      titleHi: "इंटरैक्टिव चार्ट",
      description: "3D visualizations and interactive birth chart exploration",
      descriptionHi: "3D विज़ुअलाइज़ेशन और इंटरैक्टिव जन्म चार्ट अन्वेषण"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative px-4 py-12 sm:py-20 lg:py-24">
        <div className="container mx-auto max-w-6xl">
          {/* Limited Time Banner */}
          <div className="text-center mb-8">
            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 text-sm animate-pulse">
              <Gift className="h-4 w-4 mr-2" />
              LIMITED TIME FREE ACCESS
            </Badge>
          </div>

          <div className="text-center space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="gradient-heading">Ayu Explorer</span>
              <br />
              <span className="text-muted-foreground text-xl sm:text-2xl md:text-3xl">
                Swiss Precision Vedic Astrology
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Experience the most accurate Kundali analysis powered by Swiss Ephemeris calculations 
              and ancient Vedic wisdom. Discover your cosmic blueprint with unprecedented precision.
            </p>

            {/* Countdown Timer */}
            <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-6 max-w-lg mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Timer className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium text-red-600">Offer Expires In:</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                {[
                  { label: 'Days', labelHi: 'दिन', value: timeLeft.days },
                  { label: 'Hours', labelHi: 'घंटे', value: timeLeft.hours },
                  { label: 'Min', labelHi: 'मिनट', value: timeLeft.minutes },
                  { label: 'Sec', labelHi: 'सेकंड', value: timeLeft.seconds }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-lg p-2 sm:p-3 font-bold text-lg sm:text-2xl">
                      {item.value.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-muted-foreground mt-4">
                🎁 Normally $99/year - Now FREE for limited time
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => navigate('/')} 
                size={isMobile ? "lg" : "lg"}
                className="min-h-[52px] px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-lg font-semibold"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Create Your Free Kundali
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              
              <div className="text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 inline mr-1 text-green-500" />
                No credit card required
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 sm:py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-heading">Ayu Explorer?</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Advanced technology meets ancient wisdom for the most accurate astrological insights
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <div className="text-primary">{feature.icon}</div>
                  </div>
                  <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="px-4 py-16 sm:py-20 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              What's Included <span className="gradient-heading">FREE</span>
            </h2>
            <p className="text-muted-foreground">Everything you need for complete astrological insights</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              "Complete Birth Chart Analysis",
              "Planetary Position Details",
              "Dasha Period Calculations", 
              "Karma Pattern Analysis",
              "Relationship Compatibility",
              "Career & Financial Guidance",
              "Health & Wellness Insights",
              "Remedial Measures",
              "PDF Export of Full Report",
              "Multi-language Support",
              "Interactive 3D Charts",
              "AI-Powered Predictions"
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-card/50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm sm:text-base">{item}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button 
              onClick={() => navigate('/')}
              size="lg"
              className="min-h-[52px] px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
            >
              <Clock className="h-5 w-5 mr-2" />
              Start Free Analysis Now
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials/Social Proof */}
      <section className="px-4 py-16 sm:py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Trusted by <span className="gradient-heading">Thousands</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">50,000+</div>
              <div className="text-muted-foreground">Kundalis Generated</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">4.9/5</div>
              <div className="text-muted-foreground">User Rating</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-muted-foreground">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-16 sm:py-20 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Don't Miss This <span className="gradient-heading">Limited Time Offer</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands who have discovered their cosmic blueprint with Ayu Explorer
          </p>
          
          <Button 
            onClick={() => navigate('/')}
            size="lg"
            className="min-h-[56px] px-12 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
          >
            <Sparkles className="h-6 w-6 mr-2" />
            Get Your Free Kundali Now
            <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
          
          <p className="text-xs text-muted-foreground mt-4">
            No registration required • Instant results • 100% Free
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
