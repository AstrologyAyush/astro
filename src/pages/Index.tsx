
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Star, Users, Calendar, Brain } from "lucide-react";
import BirthDataForm from '@/components/BirthDataForm';
import KundaliChart from '@/components/KundaliChart';
import PlanetaryPositions from '@/components/PlanetaryPositions';
import ArchetypeAnalysis from '@/components/ArchetypeAnalysis';
import EnhancedDailyHoroscope from '@/components/EnhancedDailyHoroscope';
import { generateEnhancedKundali } from '@/lib/enhancedKundaliEngine';
import { generateKundaliChart } from '@/lib/kundaliUtils';
import { toast } from "sonner";

const Index = () => {
  const [kundali, setKundali] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const [language, setLanguage] = useState<'hi' | 'en'>('en');

  const handleBirthDataSubmit = async (birthData: any) => {
    setLoading(true);
    try {
      // Generate enhanced kundali with personality features
      const enhancedKundali = generateEnhancedKundali(birthData);
      
      // Generate traditional kundali chart
      const traditionalKundali = generateKundaliChart(birthData);
      
      const combinedKundali = {
        ...enhancedKundali,
        ...traditionalKundali,
        birthData
      };
      
      setKundali(combinedKundali);
      setActiveTab('chart');
      
      toast.success(
        language === 'hi' 
          ? 'आपकी कुंडली सफलतापूर्वक तैयार हो गई है!' 
          : 'Your Kundali has been generated successfully!'
      );
    } catch (error) {
      console.error('Error generating Kundali:', error);
      toast.error(
        language === 'hi' 
          ? 'कुंडली बनाने में त्रुटि हुई है।' 
          : 'Error generating Kundali. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetKundali = () => {
    setKundali(null);
    setActiveTab('create');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-First Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-sm">
              <Star className="h-4 w-4" />
              <span>{language === 'hi' ? 'AI संचालित वैदिक ज्योतिष' : 'AI-Powered Vedic Astrology'}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold gradient-heading">
              {language === 'hi' ? 'आपकी डिजिटल कुंडली' : 'Your Digital Kundali'}
            </h1>
            
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {language === 'hi' 
                ? 'उन्नत गणना और व्यक्तित्व विश्लेषण के साथ अपना भविष्य जानें'
                : 'Discover your destiny with advanced calculations and personality analysis'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile Tab List */}
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="create" className="text-xs">
              <Star className="h-3 w-3 mr-1" />
              {language === 'hi' ? 'बनाएं' : 'Create'}
            </TabsTrigger>
            <TabsTrigger value="chart" disabled={!kundali} className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              {language === 'hi' ? 'चार्ट' : 'Chart'}
            </TabsTrigger>
            <TabsTrigger value="personality" disabled={!kundali} className="text-xs">
              <Brain className="h-3 w-3 mr-1" />
              {language === 'hi' ? 'व्यक्तित्व' : 'Type'}
            </TabsTrigger>
            <TabsTrigger value="horoscope" disabled={!kundali} className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              {language === 'hi' ? 'राशिफल' : 'Daily'}
            </TabsTrigger>
          </TabsList>

          {/* Create Kundali Tab */}
          <TabsContent value="create" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-center">
                  {language === 'hi' ? 'जन्म विवरण दर्ज करें' : 'Enter Birth Details'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BirthDataForm 
                  onSubmit={handleBirthDataSubmit}
                  loading={loading}
                  language={language}
                />
                
                {kundali && (
                  <Button 
                    variant="outline" 
                    onClick={resetKundali}
                    className="w-full mt-4"
                  >
                    {language === 'hi' ? 'नई कुंडली बनाएं' : 'Create New Kundali'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Kundali Chart Tab */}
          <TabsContent value="chart" className="mt-0">
            {kundali ? (
              <div className="space-y-4">
                <KundaliChart 
                  chart={kundali} 
                  language={language}
                />
                <PlanetaryPositions 
                  planets={kundali.planets} 
                  language={language}
                />
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    {language === 'hi' 
                      ? 'पहले अपनी जन्म जानकारी दर्ज करें'
                      : 'Please enter your birth details first'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Personality Analysis Tab */}
          <TabsContent value="personality" className="mt-0">
            {kundali ? (
              <ArchetypeAnalysis 
                kundali={kundali} 
                language={language}
              />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    {language === 'hi' 
                      ? 'पहले अपनी कुंडली बनाएं'
                      : 'Please create your Kundali first'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Daily Horoscope Tab */}
          <TabsContent value="horoscope" className="mt-0">
            {kundali ? (
              <EnhancedDailyHoroscope 
                kundali={kundali} 
                language={language}
              />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    {language === 'hi' 
                      ? 'पहले अपनी कुंडली बनाएं'
                      : 'Please create your Kundali first'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
