
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { DetailedKundali } from '@/lib/advancedKundaliEngine';
import { Star, Crown, AlertTriangle, Heart, Coins, Briefcase, Shield, Clock, Gem, BookOpen } from 'lucide-react';

interface DetailedKundaliDisplayProps {
  kundaliData: DetailedKundali;
  language: 'hi' | 'en';
}

const DetailedKundaliDisplay: React.FC<DetailedKundaliDisplayProps> = ({ kundaliData, language }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-green-600 bg-green-100';
    if (strength >= 60) return 'text-blue-600 bg-blue-100';
    if (strength >= 40) return 'text-yellow-600 bg-yellow-100';
    if (strength >= 20) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Basic Information Header */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-center text-xl text-gray-900">
            {getTranslation('Detailed Vedic Birth Chart', 'विस्तृत वैदिक जन्म कुंडली')}
          </CardTitle>
          <div className="text-center text-sm text-gray-600">
            {kundaliData.birthData.fullName} • {kundaliData.birthData.dateOfBirth.toLocaleDateString()} • {kundaliData.birthData.timeOfBirth}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-600">{getTranslation('Ascendant', 'लग्न')}</div>
              <div className="font-semibold text-gray-900">{kundaliData.basicInfo.ascendantName}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-600">{getTranslation('Moon Sign', 'चंद्र राशि')}</div>
              <div className="font-semibold text-gray-900">{kundaliData.basicInfo.moonSignName}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-600">{getTranslation('Sun Sign', 'सूर्य राशि')}</div>
              <div className="font-semibold text-gray-900">{kundaliData.basicInfo.sunSignName}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-600">{getTranslation('Birth Star', 'जन्म नक्षत्र')}</div>
              <div className="font-semibold text-gray-900">{kundaliData.basicInfo.birthNakshatra}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-gray-100">
          <TabsTrigger value="overview" className="text-xs">{getTranslation('Overview', 'सारांश')}</TabsTrigger>
          <TabsTrigger value="planets" className="text-xs">{getTranslation('Planets', 'ग्रह')}</TabsTrigger>
          <TabsTrigger value="houses" className="text-xs">{getTranslation('Houses', 'भाव')}</TabsTrigger>
          <TabsTrigger value="yogas" className="text-xs">{getTranslation('Yogas', 'योग')}</TabsTrigger>
          <TabsTrigger value="doshas" className="text-xs">{getTranslation('Doshas', 'दोष')}</TabsTrigger>
          <TabsTrigger value="dashas" className="text-xs">{getTranslation('Dashas', 'दशा')}</TabsTrigger>
          <TabsTrigger value="predictions" className="text-xs">{getTranslation('Predictions', 'भविष्यफल')}</TabsTrigger>
          <TabsTrigger value="remedies" className="text-xs">{getTranslation('Remedies', 'उपाय')}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kundali Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Star className="h-5 w-5 text-orange-500" />
                  {getTranslation('Birth Chart', 'जन्म चार्ट')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square border-2 border-orange-300 relative bg-orange-50">
                  <div className="grid grid-cols-4 h-full">
                    {Array.from({length: 12}, (_, i) => {
                      const houseNum = i + 1;
                      const house = kundaliData.houses.find(h => h.number === houseNum);
                      return (
                        <div key={i} className="border border-orange-200 p-1 text-xs bg-white">
                          <div className="font-bold text-orange-600">{houseNum}</div>
                          <div className="text-gray-700">{house?.signName.substring(0, 3)}</div>
                          {house?.planets.map(planet => (
                            <div key={planet} className="text-xs text-blue-600 font-medium">
                              {planet.substring(0, 2)}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  {getTranslation('Key Information', 'मुख्य जानकारी')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{getTranslation('Tithi', 'तिथि')}:</span>
                    <span className="text-gray-900 font-medium">{kundaliData.basicInfo.tithi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{getTranslation('Karana', 'करण')}:</span>
                    <span className="text-gray-900 font-medium">{kundaliData.basicInfo.karana}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{getTranslation('Yoga', 'योग')}:</span>
                    <span className="text-gray-900 font-medium">{kundaliData.basicInfo.yoga}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{getTranslation('Sunrise', 'सूर्योदय')}:</span>
                    <span className="text-gray-900 font-medium">{kundaliData.basicInfo.sunrise}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{getTranslation('Sunset', 'सूर्यास्त')}:</span>
                    <span className="text-gray-900 font-medium">{kundaliData.basicInfo.sunset}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Planets Tab */}
        <TabsContent value="planets" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Object.values(kundaliData.planets).map((planet) => (
              <Card key={planet.id} className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between text-gray-900">
                    <span className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStrengthColor(planet.shadbala).split(' ')[1]}`}></div>
                      {planet.name} ({planet.sanskrit})
                    </span>
                    <Badge variant="outline" className={getStrengthColor(planet.shadbala)}>
                      {planet.strengthGrade}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{getTranslation('Sign', 'राशि')}:</span>
                      <span className="text-gray-900 font-medium">{planet.rashiName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{getTranslation('House', 'भाव')}:</span>
                      <span className="text-gray-900 font-medium">{planet.house}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{getTranslation('Nakshatra', 'नक्षत्र')}:</span>
                      <span className="text-gray-900 font-medium">{planet.nakshatraName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{getTranslation('Degree', 'अंश')}:</span>
                      <span className="text-gray-900 font-medium">{planet.degreeInSign.toFixed(2)}°</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">{getTranslation('Strength', 'बल')}</span>
                      <span className="text-gray-900 font-medium">{planet.shadbala}/150</span>
                    </div>
                    <Progress value={(planet.shadbala / 150) * 100} className="h-2" />
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {planet.isRetrograde && (
                      <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                        {getTranslation('Retrograde', 'वक्री')}
                      </Badge>
                    )}
                    {planet.isExalted && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                        {getTranslation('Exalted', 'उच्च')}
                      </Badge>
                    )}
                    {planet.isDebilitated && (
                      <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">
                        {getTranslation('Debilitated', 'नीच')}
                      </Badge>
                    )}
                    {planet.isOwnSign && (
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                        {getTranslation('Own Sign', 'स्वराशि')}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Houses Tab */}
        <TabsContent value="houses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kundaliData.houses.map((house) => (
              <Card key={house.number} className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-900">
                    {getTranslation(`${house.number}${getOrdinalSuffix(house.number)} House`, `${house.number}वां भाव`)} - {house.signName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{getTranslation('Lord', 'स्वामी')}:</span>
                      <span className="text-gray-900 font-medium">{house.lord}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-600 text-xs">{getTranslation('Significations', 'कारकत्व')}:</span>
                      <div className="flex flex-wrap gap-1">
                        {house.signification.slice(0, 3).map((sig, index) => (
                          <Badge key={index} variant="outline" className="text-xs text-gray-700 border-gray-300">
                            {sig}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {house.planets.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-gray-600 text-xs">{getTranslation('Planets', 'ग्रह')}:</span>
                        <div className="flex flex-wrap gap-1">
                          {house.planets.map((planet) => (
                            <Badge key={planet} variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                              {planet}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Yogas Tab */}
        <TabsContent value="yogas" className="space-y-4">
          {kundaliData.yogas.length > 0 ? (
            <div className="space-y-4">
              {kundaliData.yogas.map((yoga, index) => (
                <Card key={index} className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-gray-900">
                      <span className="flex items-center gap-2">
                        <Crown className={`h-5 w-5 ${yoga.type === 'benefic' ? 'text-green-500' : 'text-red-500'}`} />
                        {yoga.name} ({yoga.sanskritName})
                      </span>
                      <Badge variant="outline" className={yoga.type === 'benefic' ? 'text-green-700 border-green-300' : 'text-red-700 border-red-300'}>
                        {yoga.strength}% {getTranslation('Strength', 'बल')}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-gray-700 text-sm">{yoga.description}</p>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-600 text-xs font-medium">{getTranslation('Involved Planets', 'संबंधित ग्रह')}:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {yoga.planets.map((planet) => (
                            <Badge key={planet} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                              {planet}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-gray-600 text-xs font-medium">{getTranslation('Effects', 'प्रभाव')}:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {yoga.effects.slice(0, 4).map((effect, i) => (
                            <Badge key={i} variant="outline" className="text-xs text-gray-700 border-gray-300">
                              {effect}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <Progress value={yoga.strength} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-gray-200">
              <CardContent className="text-center py-8">
                <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">{getTranslation('No major yogas detected in this chart', 'इस कुंडली में कोई प्रमुख योग नहीं मिला')}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Doshas Tab */}
        <TabsContent value="doshas" className="space-y-4">
          {kundaliData.doshas.length > 0 ? (
            <div className="space-y-4">
              {kundaliData.doshas.map((dosha, index) => (
                <Card key={index} className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-gray-900">
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        {dosha.name} ({dosha.sanskritName})
                      </span>
                      <Badge variant="destructive" className="capitalize">
                        {dosha.severity} {getTranslation('Severity', 'तीव्रता')}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-gray-700 text-sm">{dosha.description}</p>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-600 text-xs font-medium">{getTranslation('Effects', 'प्रभाव')}:</span>
                        <ul className="list-disc list-inside text-xs text-gray-700 mt-1 space-y-1">
                          {dosha.effects.map((effect, i) => (
                            <li key={i}>{effect}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <span className="text-gray-600 text-xs font-medium">{getTranslation('Remedies', 'उपाय')}:</span>
                        <ul className="list-disc list-inside text-xs text-green-700 mt-1 space-y-1">
                          {dosha.remedies.slice(0, 3).map((remedy, i) => (
                            <li key={i}>{remedy}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="text-center py-8">
                <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-green-700 font-medium">{getTranslation('No major doshas detected!', 'कोई प्रमुख दोष नहीं मिला!')}</p>
                <p className="text-green-600 text-sm mt-2">{getTranslation('This is a favorable chart', 'यह एक शुभ कुंडली है')}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Dashas Tab */}
        <TabsContent value="dashas" className="space-y-4">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Clock className="h-5 w-5 text-purple-500" />
                {getTranslation('Current Dasha Period', 'वर्तमान दशा काल')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-purple-900">
                    {kundaliData.dashas.current.planet} {getTranslation('Mahadasha', 'महादशा')}
                  </h3>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {getTranslation('Active', 'सक्रिय')}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">{getTranslation('Start Date', 'आरंभ तिथि')}:</span>
                    <div className="font-medium text-gray-900">{kundaliData.dashas.current.startDate.toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">{getTranslation('End Date', 'समाप्ति तिथि')}:</span>
                    <div className="font-medium text-gray-900">{kundaliData.dashas.current.endDate.toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-gray-600 text-xs">{getTranslation('Effects', 'प्रभाव')}:</span>
                  <p className="text-sm text-gray-700 mt-1">{kundaliData.dashas.current.effects[0]}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">{getTranslation('Complete Dasha Sequence', 'संपूर्ण दशा क्रम')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {kundaliData.dashas.vimshottari.map((dasha, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${dasha.isActive ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-gray-900">{dasha.planet} {getTranslation('Mahadasha', 'महादशा')}</span>
                        <span className="text-sm text-gray-600 ml-2">({dasha.years} {getTranslation('years', 'वर्ष')})</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {dasha.startDate.getFullYear()} - {dasha.endDate.getFullYear()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Briefcase className="h-5 w-5 text-blue-500" />
                  {getTranslation('Career & Finance', 'करियर और वित्त')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{getTranslation('Career', 'करियर')}</h4>
                  <p className="text-sm text-gray-700">{kundaliData.predictions.career}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{getTranslation('Finance', 'वित्त')}</h4>
                  <p className="text-sm text-gray-700">{kundaliData.predictions.finance}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Heart className="h-5 w-5 text-pink-500" />
                  {getTranslation('Relationships', 'रिश्ते')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{kundaliData.predictions.relationships}</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Shield className="h-5 w-5 text-green-500" />
                  {getTranslation('Health', 'स्वास्थ्य')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{kundaliData.predictions.health}</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <BookOpen className="h-5 w-5 text-purple-500" />
                  {getTranslation('Education', 'शिक्षा')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{kundaliData.predictions.education}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Remedies Tab */}
        <TabsContent value="remedies" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Gem className="h-5 w-5 text-green-500" />
                  {getTranslation('Gemstones', 'रत्न')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {kundaliData.remedies.gemstones.slice(0, 3).map((gemstone, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {gemstone}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Star className="h-5 w-5 text-orange-500" />
                  {getTranslation('Mantras', 'मंत्र')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {kundaliData.remedies.mantras.slice(0, 3).map((mantra, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      {mantra}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Coins className="h-5 w-5 text-blue-500" />
                  {getTranslation('Charity', 'दान')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {kundaliData.remedies.charity.slice(0, 3).map((charity, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      {charity}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Clock className="h-5 w-5 text-purple-500" />
                  {getTranslation('Auspicious Times', 'शुभ समय')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {kundaliData.auspiciousTimes.muhurta.slice(0, 2).map((time, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      {time}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function for ordinal suffixes
function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) {
    return 'st';
  }
  if (j === 2 && k !== 12) {
    return 'nd';
  }
  if (j === 3 && k !== 13) {
    return 'rd';
  }
  return 'th';
}

export default DetailedKundaliDisplay;
