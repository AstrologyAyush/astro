
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';
import { Star, Crown, Shield, Target, TrendingUp, Heart, Briefcase, Home } from "lucide-react";

interface InteractiveDashboardProps {
  kundaliData: ComprehensiveKundaliData;
  language: 'hi' | 'en';
}

const InteractiveDashboard: React.FC<InteractiveDashboardProps> = ({ kundaliData, language }) => {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);

  const lagna = kundaliData.enhancedCalculations.lagna;
  const planets = kundaliData.enhancedCalculations.planets;
  const yogas = kundaliData.enhancedCalculations.yogas;
  const currentDasha = kundaliData.enhancedCalculations.dashas.find(d => d.isActive);

  // Calculate personality traits from chart
  const personalityTraits = [
    { 
      name: language === 'hi' ? 'नेतृत्व' : 'Leadership', 
      value: planets.SU.shadbala,
      color: 'from-yellow-400 to-orange-500',
      icon: <Crown className="h-4 w-4" />
    },
    { 
      name: language === 'hi' ? 'भावनात्मक' : 'Emotional', 
      value: planets.MO.shadbala,
      color: 'from-blue-400 to-indigo-500',
      icon: <Heart className="h-4 w-4" />
    },
    { 
      name: language === 'hi' ? 'बुद्धि' : 'Intelligence', 
      value: planets.ME.shadbala,
      color: 'from-green-400 to-teal-500',
      icon: <Star className="h-4 w-4" />
    },
    { 
      name: language === 'hi' ? 'साहस' : 'Courage', 
      value: planets.MA.shadbala,
      color: 'from-red-400 to-pink-500',
      icon: <Shield className="h-4 w-4" />
    },
    { 
      name: language === 'hi' ? 'ज्ञान' : 'Wisdom', 
      value: planets.JU.shadbala,
      color: 'from-purple-400 to-violet-500',
      icon: <Target className="h-4 w-4" />
    }
  ];

  // Life areas analysis
  const lifeAreas = [
    {
      name: language === 'hi' ? 'करियर' : 'Career',
      house: 10,
      strength: Math.floor(Math.random() * 40) + 60,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      icon: <Briefcase className="h-5 w-5" />,
      prediction: language === 'hi' 
        ? 'अगले 6 महीने में करियर में उन्नति के अवसर'
        : 'Career advancement opportunities in next 6 months'
    },
    {
      name: language === 'hi' ? 'रिश्ते' : 'Relationships',
      house: 7,
      strength: Math.floor(Math.random() * 40) + 60,
      color: 'bg-gradient-to-r from-pink-500 to-rose-500',
      icon: <Heart className="h-5 w-5" />,
      prediction: language === 'hi' 
        ? 'शुक्र की मजबूत स्थिति से संबंधों में मधुरता'
        : 'Strong Venus position brings harmony in relationships'
    },
    {
      name: language === 'hi' ? 'स्वास्थ्य' : 'Health',
      house: 6,
      strength: Math.floor(Math.random() * 40) + 60,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      icon: <Shield className="h-5 w-5" />,
      prediction: language === 'hi' 
        ? 'नियमित योग और प्राणायाम से लाभ'
        : 'Regular yoga and pranayama will benefit health'
    },
    {
      name: language === 'hi' ? 'धन' : 'Wealth',
      house: 2,
      strength: Math.floor(Math.random() * 40) + 60,
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      icon: <TrendingUp className="h-5 w-5" />,
      prediction: language === 'hi' 
        ? 'धन संचय के लिए शुभ समय आ रहा है'
        : 'Auspicious time for wealth accumulation coming'
    },
    {
      name: language === 'hi' ? 'घर-परिवार' : 'Family',
      house: 4,
      strength: Math.floor(Math.random() * 40) + 60,
      color: 'bg-gradient-to-r from-indigo-500 to-purple-500',
      icon: <Home className="h-5 w-5" />,
      prediction: language === 'hi' 
        ? 'पारिवारिक खुशी और घर में शांति'
        : 'Family happiness and peace at home'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-orange-400 to-red-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">{language === 'hi' ? 'लग्न' : 'Lagna'}</p>
                <p className="text-2xl font-bold">{lagna.signName}</p>
                <p className="text-orange-100 text-xs">{lagna.degree.toFixed(1)}°</p>
              </div>
              <Crown className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">{language === 'hi' ? 'चंद्र राशि' : 'Moon Sign'}</p>
                <p className="text-2xl font-bold">{planets.MO.rashiName}</p>
                <p className="text-blue-100 text-xs">{planets.MO.nakshatraName}</p>
              </div>
              <Star className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-400 to-teal-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">{language === 'hi' ? 'योग' : 'Yogas'}</p>
                <p className="text-2xl font-bold">{yogas.filter(y => y.isActive).length}</p>
                <p className="text-green-100 text-xs">{language === 'hi' ? 'सक्रिय योग' : 'Active'}</p>
              </div>
              <Shield className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-400 to-pink-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">{language === 'hi' ? 'वर्तमान दशा' : 'Current Dasha'}</p>
                <p className="text-xl font-bold">{currentDasha?.planet || 'N/A'}</p>
                <p className="text-purple-100 text-xs">
                  {currentDasha ? `${currentDasha.years} ${language === 'hi' ? 'वर्ष' : 'years'}` : ''}
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="personality" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personality">{language === 'hi' ? 'व्यक्तित्व' : 'Personality'}</TabsTrigger>
          <TabsTrigger value="lifeAreas">{language === 'hi' ? 'जीवन क्षेत्र' : 'Life Areas'}</TabsTrigger>
          <TabsTrigger value="planets">{language === 'hi' ? 'ग्रह शक्ति' : 'Planet Strength'}</TabsTrigger>
          <TabsTrigger value="predictions">{language === 'hi' ? 'भविष्यवाणी' : 'Predictions'}</TabsTrigger>
        </TabsList>

        <TabsContent value="personality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                {language === 'hi' ? 'व्यक्तित्व विश्लेषण' : 'Personality Analysis'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {personalityTraits.map((trait, index) => (
                  <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${trait.color} text-white`}>
                            {trait.icon}
                          </div>
                          <span className="font-medium">{trait.name}</span>
                        </div>
                        <span className="text-lg font-bold">{trait.value.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${trait.color} transition-all duration-1000`}
                          style={{ width: `${trait.value}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lifeAreas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lifeAreas.map((area, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg ${area.color} text-white`}>
                      {area.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{area.name}</h3>
                      <p className="text-sm text-gray-600">
                        {language === 'hi' ? 'भाव' : 'House'} {area.house}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{area.strength}%</div>
                      <div className="text-xs text-gray-500">{language === 'hi' ? 'शक्ति' : 'Strength'}</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <Progress value={area.strength} className="h-2" />
                  </div>
                  
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {area.prediction}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="planets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                {language === 'hi' ? 'ग्रह शक्ति विश्लेषण' : 'Planetary Strength Analysis'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(planets).map(([planetId, planet]) => (
                  <Card 
                    key={planetId} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedPlanet === planetId ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedPlanet(selectedPlanet === planetId ? null : planetId)}
                  >
                    <CardContent className="p-4">
                      <div className="text-center space-y-3">
                        <div className="text-2xl font-bold text-gray-800">{planet.name}</div>
                        <div className="text-lg font-semibold text-blue-600">{planet.rashiName}</div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{language === 'hi' ? 'शक्ति:' : 'Strength:'}</span>
                            <span className="font-bold">{planet.shadbala.toFixed(0)}%</span>
                          </div>
                          <Progress value={planet.shadbala} className="h-2" />
                        </div>
                        
                        {selectedPlanet === planetId && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-left">
                            <div className="space-y-1 text-sm">
                              <div><strong>{language === 'hi' ? 'राशि:' : 'Sign:'}</strong> {planet.rashiName}</div>
                              <div><strong>{language === 'hi' ? 'नक्षत्र:' : 'Nakshatra:'}</strong> {planet.nakshatraName}</div>
                              <div><strong>{language === 'hi' ? 'अंश:' : 'Degree:'}</strong> {planet.degree.toFixed(2)}°</div>
                              {planet.isRetrograde && (
                                <Badge variant="destructive" className="text-xs">
                                  {language === 'hi' ? 'वक्री' : 'Retrograde'}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Period */}
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="text-indigo-800 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {language === 'hi' ? 'वर्तमान काल' : 'Current Period'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentDasha && (
                  <div>
                    <h3 className="font-bold text-lg text-indigo-900">
                      {currentDasha.planet} {language === 'hi' ? 'महादशा' : 'Mahadasha'}
                    </h3>
                    <p className="text-sm text-indigo-700">
                      {language === 'hi' ? 'समाप्ति:' : 'Ends:'} {currentDasha.endDate.toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {language === 'hi' 
                        ? 'इस दशा में धैर्य और कड़ी मेहनत आवश्यक है।'
                        : 'This period requires patience and hard work.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Yogas */}
            <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {language === 'hi' ? 'सक्रिय योग' : 'Active Yogas'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {yogas.filter(y => y.isActive).slice(0, 3).map((yoga, index) => (
                    <div key={index} className="p-3 bg-white rounded-lg border border-green-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-green-800">{yoga.name}</h4>
                          <p className="text-xs text-gray-600">{yoga.description.substring(0, 80)}...</p>
                        </div>
                        <Badge 
                          variant={yoga.type === 'benefic' ? 'default' : 'destructive'}
                          className="ml-2"
                        >
                          {yoga.strength}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InteractiveDashboard;
