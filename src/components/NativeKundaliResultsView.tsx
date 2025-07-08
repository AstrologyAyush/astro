import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Crown, Star, Grid, Clock, Sparkles, FileText, Calendar, Target } from 'lucide-react';
import { KundaliResult } from '@/lib/nativeVedicKundaliEngine';
import EnhancedKundaliChart from './EnhancedKundaliChart';

interface NativeKundaliResultsViewProps {
  kundaliData: KundaliResult;
  language: 'hi' | 'en';
  onBack: () => void;
}

const NativeKundaliResultsView: React.FC<NativeKundaliResultsViewProps> = ({
  kundaliData,
  onBack,
  language = 'en'
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  // Convert our data format to something the chart component can understand
  const chartData = {
    lagna: {
      name: kundaliData.lagna.sign,
      degree: kundaliData.lagna.degree
    },
    planets: kundaliData.planets.reduce((acc, planet) => {
      acc[planet.name] = {
        name: planet.name,
        sign: planet.sign,
        degree: planet.degree,
        house: planet.house,
        nakshatra: planet.nakshatra,
        pada: planet.pada,
        symbol: planet.name.charAt(0)
      };
      return acc;
    }, {} as any)
  };

  const formatDegree = (degree: number) => {
    const deg = Math.floor(degree);
    const min = Math.floor((degree - deg) * 60);
    return `${deg}°${min}'`;
  };

  const getPlanetStrength = (planet: any) => {
    if (planet.isExalted) return { status: 'Exalted', color: 'bg-green-500' };
    if (planet.isDebilitated) return { status: 'Debilitated', color: 'bg-red-500' };
    if (planet.isOwnSign) return { status: 'Own Sign', color: 'bg-blue-500' };
    return { status: 'Neutral', color: 'bg-gray-500' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={onBack} 
            variant="outline" 
            className="flex items-center gap-2 hover:bg-orange-50 border-orange-200"
          >
            <ArrowLeft className="h-4 w-4" />
            {getTranslation('Back', 'वापस')}
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {getTranslation('Complete Vedic Kundali Analysis', 'संपूर्ण वैदिक कुंडली विश्लेषण')}
            </h1>
            <p className="text-gray-600">
              {getTranslation('Generated using traditional astronomical calculations', 'पारंपरिक खगोलीय गणना का उपयोग करके तैयार')}
            </p>
          </div>
          
          <div className="w-24"></div>
        </div>

        {/* Personal Information */}
        <Card className="mb-8 shadow-xl border-2 border-orange-200 bg-white/95">
          <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Crown className="h-5 w-5 text-orange-600" />
              {getTranslation('Personal Information', 'व्यक्तिगत जानकारी')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">{getTranslation('Name', 'नाम')}</p>
                <p className="font-semibold">{kundaliData.personalInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{getTranslation('Birth Date', 'जन्म तिथि')}</p>
                <p className="font-semibold">{kundaliData.personalInfo.birthDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{getTranslation('Birth Time', 'जन्म समय')}</p>
                <p className="font-semibold">{kundaliData.personalInfo.birthTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{getTranslation('Birth Place', 'जन्म स्थान')}</p>
                <p className="font-semibold">{kundaliData.personalInfo.birthPlace}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8 bg-white/90 backdrop-blur-sm border-2 border-orange-100 rounded-xl p-2 shadow-lg">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
            >
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">{getTranslation('Overview', 'अवलोकन')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="chart" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
            >
              <Grid className="h-4 w-4" />
              <span className="hidden sm:inline">{getTranslation('Chart', 'चार्ट')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="planets" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">{getTranslation('Planets', 'ग्रह')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="dashas" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
            >
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">{getTranslation('Dashas', 'दशा')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="predictions" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
            >
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">{getTranslation('Predictions', 'भविष्यफल')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lagna Information */}
              <Card className="shadow-xl border-2 border-orange-200">
                <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100">
                  <CardTitle className="text-gray-800">
                    {getTranslation('Ascendant (Lagna)', 'लग्न')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">{getTranslation('Sign', 'राशि')}</p>
                      <p className="text-2xl font-bold text-orange-600">{kundaliData.lagna.sign}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{getTranslation('Degree', 'डिग्री')}</p>
                      <p className="text-lg font-semibold">{formatDegree(kundaliData.lagna.degree)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{getTranslation('Nakshatra', 'नक्षत्र')}</p>
                      <p className="text-lg font-semibold">{kundaliData.lagna.nakshatra}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{getTranslation('Pada', 'पाद')}</p>
                      <p className="text-lg font-semibold">{kundaliData.lagna.pada}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Dasha */}
              <Card className="shadow-xl border-2 border-orange-200">
                <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100">
                  <CardTitle className="text-gray-800">
                    {getTranslation('Current Mahadasha', 'वर्तमान महादशा')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">{getTranslation('Planet', 'ग्रह')}</p>
                      <p className="text-2xl font-bold text-orange-600">{kundaliData.currentDasha.planet}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{getTranslation('Duration', 'अवधि')}</p>
                      <p className="text-lg font-semibold">{kundaliData.currentDasha.years} years</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{getTranslation('Start Date', 'प्रारंभ तिथि')}</p>
                      <p className="text-lg font-semibold">{kundaliData.currentDasha.startDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{getTranslation('End Date', 'समाप्ति तिथि')}</p>
                      <p className="text-lg font-semibold">{kundaliData.currentDasha.endDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Yogas */}
            {kundaliData.yogas.length > 0 && (
              <Card className="shadow-xl border-2 border-orange-200">
                <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100">
                  <CardTitle className="text-gray-800">
                    {getTranslation('Special Yogas', 'विशेष योग')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {kundaliData.yogas.map((yoga, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-gradient-to-r from-orange-50 to-amber-50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-800">{yoga.name}</h4>
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                            {yoga.strength}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{yoga.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {yoga.planets.map(planet => (
                            <Badge key={planet} variant="outline" className="text-xs">
                              {planet}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Chart Tab */}
          <TabsContent value="chart" className="space-y-6">
            <Card className="shadow-xl border-2 border-orange-200">
              <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100">
                <CardTitle className="text-gray-800 text-center">
                  {getTranslation('Vedic Birth Chart (D1)', 'वैदिक जन्म कुंडली (D1)')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-center">
                  <EnhancedKundaliChart chart={chartData} language={language} />
                </div>
              </CardContent>
            </Card>

            {/* House Information */}
            <Card className="shadow-xl border-2 border-orange-200">
              <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100">
                <CardTitle className="text-gray-800">
                  {getTranslation('House-wise Planetary Positions', 'भाव अनुसार ग्रह स्थिति')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(house => (
                    <div key={house} className="border rounded-lg p-4 bg-gradient-to-r from-orange-50 to-amber-50">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {getTranslation(`House ${house}`, `भाव ${house}`)}
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {kundaliData.houses[house]?.map(planet => (
                          <Badge key={planet} variant="outline" className="text-xs">
                            {planet}
                          </Badge>
                        )) || <span className="text-gray-400 text-sm">Empty</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Planets Tab */}
          <TabsContent value="planets" className="space-y-6">
            <Card className="shadow-xl border-2 border-orange-200">
              <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100">
                <CardTitle className="text-gray-800">
                  {getTranslation('Planetary Positions & Strengths', 'ग्रह स्थिति एवं बल')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {kundaliData.planets.map((planet, index) => {
                    const strength = getPlanetStrength(planet);
                    return (
                      <div key={index} className="border rounded-lg p-4 bg-gradient-to-r from-orange-50 to-amber-50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-semibold text-gray-800">{planet.name}</h4>
                          <Badge className={`${strength.color} text-white`}>
                            {strength.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">{getTranslation('Sign', 'राशि')}</p>
                            <p className="font-semibold">{planet.sign}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">{getTranslation('House', 'भाव')}</p>
                            <p className="font-semibold">{planet.house}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">{getTranslation('Degree', 'डिग्री')}</p>
                            <p className="font-semibold">{formatDegree(planet.degree)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">{getTranslation('Nakshatra', 'नक्षत्र')}</p>
                            <p className="font-semibold">{planet.nakshatra} - {planet.pada}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dashas Tab */}
          <TabsContent value="dashas" className="space-y-6">
            <Card className="shadow-xl border-2 border-orange-200">
              <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100">
                <CardTitle className="text-gray-800">
                  {getTranslation('Vimshottari Dasha Sequence', 'विंशोत्तरी दशा क्रम')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {kundaliData.dashas.slice(0, 6).map((dasha, index) => (
                    <div key={index} className={`border rounded-lg p-4 ${index === 0 ? 'bg-gradient-to-r from-orange-100 to-amber-100 border-orange-300' : 'bg-gradient-to-r from-orange-50 to-amber-50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-800">
                          {dasha.planet} Mahadasha
                          {index === 0 && (
                            <Badge className="ml-2 bg-orange-500 text-white">Current</Badge>
                          )}
                        </h4>
                        <span className="text-sm text-gray-600">{dasha.years} years</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">{getTranslation('Start Date', 'प्रारंभ तिथि')}</p>
                          <p className="font-semibold">{dasha.startDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">{getTranslation('End Date', 'समाप्ति तिथि')}</p>
                          <p className="font-semibold">{dasha.endDate.toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Predictions Tab */}
          <TabsContent value="predictions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-xl border-2 border-orange-200">
                <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100">
                  <CardTitle className="text-gray-800">
                    {getTranslation('Career & Profession', 'करियर एवं व्यवसाय')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700">{kundaliData.predictions.career}</p>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-2 border-orange-200">
                <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100">
                  <CardTitle className="text-gray-800">
                    {getTranslation('Marriage & Relationships', 'विवाह एवं संबंध')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700">{kundaliData.predictions.marriage}</p>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-2 border-orange-200">
                <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100">
                  <CardTitle className="text-gray-800">
                    {getTranslation('Wealth & Finance', 'धन एवं वित्त')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700">{kundaliData.predictions.wealth}</p>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-2 border-orange-200">
                <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100">
                  <CardTitle className="text-gray-800">
                    {getTranslation('Success Period', 'सफलता की अवधि')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700">{kundaliData.predictions.successPeriod}</p>
                </CardContent>
              </Card>
            </div>

            {/* Divisional Charts */}
            {kundaliData.vargaCharts.length > 0 && (
              <Card className="shadow-xl border-2 border-orange-200">
                <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100">
                  <CardTitle className="text-gray-800">
                    {getTranslation('Divisional Charts (Varga)', 'वर्ग कुंडली')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {kundaliData.vargaCharts.map((chart, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-gradient-to-r from-orange-50 to-amber-50">
                        <h4 className="font-semibold text-gray-800 mb-3">
                          {chart.name} ({chart.type})
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(chart.planets).map(([planet, data]) => (
                            <div key={planet} className="flex justify-between text-sm">
                              <span className="font-medium">{planet}:</span>
                              <span>{data.sign} (House {data.house})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NativeKundaliResultsView;