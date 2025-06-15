import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';
import { Star, Globe, Clock, TrendingUp, Heart, Briefcase, Home, Users } from 'lucide-react';

interface InteractiveDashboardProps {
  kundaliData: ComprehensiveKundaliData;
  language: 'hi' | 'en';
}

const InteractiveDashboard: React.FC<InteractiveDashboardProps> = ({ kundaliData, language }) => {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'planets' | 'houses' | 'yogas'>('overview');

  const getTranslation = (en: string, hi: string) => language === 'hi' ? hi : en;

  const planetSymbols: Record<string, string> = {
    'SU': '☉', 'MO': '☽', 'MA': '♂', 'ME': '☿', 
    'JU': '♃', 'VE': '♀', 'SA': '♄', 'RA': '☊', 'KE': '☋'
  };

  const planetColors: Record<string, string> = {
    'SU': 'text-yellow-600 bg-yellow-100',
    'MO': 'text-blue-600 bg-blue-100',
    'MA': 'text-red-600 bg-red-100',
    'ME': 'text-green-600 bg-green-100',
    'JU': 'text-purple-600 bg-purple-100',
    'VE': 'text-pink-600 bg-pink-100',
    'SA': 'text-gray-600 bg-gray-100',
    'RA': 'text-indigo-600 bg-indigo-100',
    'KE': 'text-orange-600 bg-orange-100'
  };

  const houseSignifications = {
    1: { icon: Users, title: 'Self & Personality', hindi: 'स्व और व्यक्तित्व' },
    2: { icon: TrendingUp, title: 'Wealth & Family', hindi: 'धन और परिवार' },
    3: { icon: Users, title: 'Siblings & Communication', hindi: 'भाई-बहन और संवाद' },
    4: { icon: Home, title: 'Home & Mother', hindi: 'घर और माता' },
    5: { icon: Heart, title: 'Children & Education', hindi: 'संतान और शिक्षा' },
    6: { icon: Briefcase, title: 'Service & Health', hindi: 'सेवा और स्वास्थ्य' },
    7: { icon: Heart, title: 'Marriage & Partnership', hindi: 'विवाह और साझेदारी' },
    8: { icon: Clock, title: 'Transformation', hindi: 'परिवर्तन' },
    9: { icon: Star, title: 'Religion & Fortune', hindi: 'धर्म और भाग्य' },
    10: { icon: Briefcase, title: 'Career & Status', hindi: 'करियर और प्रतिष्ठा' },
    11: { icon: TrendingUp, title: 'Gains & Friends', hindi: 'लाभ और मित्र' },
    12: { icon: Globe, title: 'Loss & Spirituality', hindi: 'हानि और आध्यात्म' }
  };

  const renderPlanetInfo = (planetId: string, planet: any) => {
    return (
      <Card 
        key={planetId}
        className={`cursor-pointer transition-all hover:shadow-md ${
          selectedPlanet === planetId ? 'ring-2 ring-orange-500' : ''
        }`}
        onClick={() => setSelectedPlanet(selectedPlanet === planetId ? null : planetId)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={`text-2xl p-2 rounded-full ${planetColors[planetId]}`}>
                {planetSymbols[planetId]}
              </span>
              <div>
                <h3 className="font-semibold">{planet.name}</h3>
                <p className="text-sm text-gray-600">{planet.nameHindi}</p>
              </div>
            </div>
            <Badge variant={planet.isExalted ? 'default' : planet.isDebilitated ? 'destructive' : 'secondary'}>
              {planet.dignity}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{getTranslation('Sign:', 'राशि:')}</span>
              <span className="font-medium">{planet.rashiName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{getTranslation('House:', 'भाव:')}</span>
              <span className="font-medium">{planet.house}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{getTranslation('Degree:', 'अंश:')}</span>
              <span className="font-medium">{planet.longitude.toFixed(2)}°</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{getTranslation('Nakshatra:', 'नक्षत्र:')}</span>
              <span className="font-medium">{planet.nakshatraName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{getTranslation('Strength:', 'शक्ति:')}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-green-500 rounded-full" 
                    style={{ width: `${planet.shadbala}%` }}
                  ></div>
                </div>
                <span className="text-xs">{planet.shadbala.toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {selectedPlanet === planetId && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">
                {getTranslation('Additional Details', 'अतिरिक्त विवरण')}
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>{getTranslation('Retrograde:', 'वक्री:')}</span>
                  <span>{planet.isRetrograde ? 
                    getTranslation('Yes', 'हाँ') : 
                    getTranslation('No', 'नहीं')
                  }</span>
                </div>
                <div className="flex justify-between">
                  <span>{getTranslation('Speed:', 'गति:')}</span>
                  <span>{planet.speed.toFixed(3)}°/day</span>
                </div>
                <div className="flex justify-between">
                  <span>{getTranslation('Pada:', 'पाद:')}</span>
                  <span>{planet.nakshatraPada}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderHouseInfo = (house: any) => {
    const houseInfo = houseSignifications[house.number as keyof typeof houseSignifications];

    if (!houseInfo) {
      // Render a fallback card to prevent error and communicate missing data
      return (
        <Card key={house.number} className="hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="mb-2">
              <h3 className="font-semibold text-red-500">
                {getTranslation('House', 'भाव')} {house.number}
              </h3>
              <p className="text-sm text-gray-500">
                {getTranslation('No info available for this house number.', 'इस भाव के लिए जानकारी उपलब्ध नहीं है।')}
              </p>
            </div>
            <div className="flex justify-between text-sm">
              <span>{getTranslation('Sign:', 'राशि:')}</span>
              <span className="font-medium">{house.signName ?? '-'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{getTranslation('Lord:', 'स्वामी:')}</span>
              <span className="font-medium">{house.lord ?? '-'}</span>
            </div>
          </CardContent>
        </Card>
      );
    }

    const IconComponent = houseInfo.icon;

    return (
      <Card key={house.number} className="hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-100 rounded-full">
              <IconComponent className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold">
                {getTranslation('House', 'भाव')} {house.number}
              </h3>
              <p className="text-sm text-gray-600">
                {getTranslation(houseInfo.title, houseInfo.hindi)}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{getTranslation('Sign:', 'राशि:')}</span>
              <span className="font-medium">{house.signName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{getTranslation('Lord:', 'स्वामी:')}</span>
              <span className="font-medium">{house.lord}</span>
            </div>
            {house.planetsInHouse.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-1">
                  {getTranslation('Planets:', 'ग्रह:')}
                </p>
                <div className="flex flex-wrap gap-1">
                  {house.planetsInHouse.map((planet: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {planet}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderYogaInfo = (yoga: any) => {
    return (
      <Card key={yoga.name} className="hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold">{yoga.name}</h3>
              <p className="text-sm text-gray-600">{yoga.sanskritName}</p>
            </div>
            <Badge 
              variant={yoga.type === 'benefic' ? 'default' : 'destructive'}
              className="ml-2"
            >
              {yoga.type}
            </Badge>
          </div>

          <p className="text-sm text-gray-700 mb-3">{yoga.description}</p>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{getTranslation('Strength:', 'शक्ति:')}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-green-500 rounded-full" 
                    style={{ width: `${yoga.strength}%` }}
                  ></div>
                </div>
                <span className="text-xs">{yoga.strength}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">
                {getTranslation('Effects:', 'प्रभाव:')}
              </p>
              <div className="flex flex-wrap gap-1">
                {yoga.effects.map((effect: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {effect}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">
                {getTranslation('Forming Planets:', 'योग बनाने वाले ग्रह:')}
              </p>
              <div className="flex flex-wrap gap-1">
                {yoga.formingPlanets.map((planet: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {planet}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-center text-orange-800">
            {getTranslation('Interactive Kundali Dashboard', 'इंटरैक्टिव कुंडली डैशबोर्ड')}
          </CardTitle>
          <p className="text-center text-orange-600 text-sm">
            {getTranslation(
              'Explore your birth chart interactively', 
              'अपनी जन्म कुंडली को इंटरैक्टिव रूप से देखें'
            )}
          </p>
        </CardHeader>
      </Card>

      {/* Navigation Tabs */}
      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{getTranslation('Overview', 'अवलोकन')}</TabsTrigger>
          <TabsTrigger value="planets">{getTranslation('Planets', 'ग्रह')}</TabsTrigger>
          <TabsTrigger value="houses">{getTranslation('Houses', 'भाव')}</TabsTrigger>
          <TabsTrigger value="yogas">{getTranslation('Yogas', 'योग')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {getTranslation('Birth Details', 'जन्म विवरण')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{getTranslation('Name:', 'नाम:')}</span>
                    <span className="font-medium">{kundaliData.birthData.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{getTranslation('Place:', 'स्थान:')}</span>
                    <span className="font-medium">{kundaliData.birthData.place}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{getTranslation('Date:', 'दिनांक:')}</span>
                    <span className="font-medium">
                      {kundaliData.birthData.date instanceof Date
                        ? kundaliData.birthData.date.toLocaleDateString()
                        : kundaliData.birthData.date}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{getTranslation('Time:', 'समय:')}</span>
                    <span className="font-medium">
                      {kundaliData.birthData.time instanceof Date
                        ? kundaliData.birthData.time.toLocaleTimeString()
                        : kundaliData.birthData.time}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {getTranslation('Primary Chart Details', 'मुख्य चार्ट विवरण')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{getTranslation('Ascendant:', 'लग्न:')}</span>
                    <span className="font-medium">{kundaliData.enhancedCalculations.lagna.signName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{getTranslation('Moon Sign:', 'चन्द्र राशि:')}</span>
                    <span className="font-medium">{kundaliData.enhancedCalculations.planets.MO.rashiName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{getTranslation('Sun Sign:', 'सूर्य राशि:')}</span>
                    <span className="font-medium">{kundaliData.enhancedCalculations.planets.SU.rashiName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{getTranslation('Birth Nakshatra:', 'जन्म नक्षत्र:')}</span>
                    <span className="font-medium">{kundaliData.enhancedCalculations.planets.MO.nakshatraName}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {getTranslation('Current Dasha', 'वर्तमान दशा')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {kundaliData.enhancedCalculations.dashas.find(d => d.isActive) ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{getTranslation('Planet:', 'ग्रह:')}</span>
                      <span className="font-medium">
                        {kundaliData.enhancedCalculations.dashas.find(d => d.isActive)?.planet}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{getTranslation('Duration:', 'अवधि:')}</span>
                      <span className="font-medium">
                        {kundaliData.enhancedCalculations.dashas.find(d => d.isActive)?.years} years
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    {getTranslation('No active dasha period found', 'कोई सक्रिय दशा अवधि नहीं मिली')}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="planets" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(kundaliData.enhancedCalculations.planets).map(([planetId, planet]) =>
              renderPlanetInfo(planetId, planet)
            )}
          </div>
        </TabsContent>

        <TabsContent value="houses" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kundaliData.enhancedCalculations.houses.map(house => renderHouseInfo(house))}
          </div>
        </TabsContent>

        <TabsContent value="yogas" className="mt-6">
          {kundaliData.enhancedCalculations.yogas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kundaliData.enhancedCalculations.yogas.map(yoga => renderYogaInfo(yoga))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">
                  {getTranslation(
                    'No specific yogas found in your chart', 
                    'आपके चार्ट में कोई विशिष्ट योग नहीं मिला'
                  )}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InteractiveDashboard;
