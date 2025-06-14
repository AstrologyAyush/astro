import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';
import EnhancedVisualKundaliChart from './EnhancedVisualKundaliChart';
import EnhancedKundaliPDFExport from './EnhancedKundaliPDFExport';
import { Badge } from "@/components/ui/badge";
import { Star, Crown, Shield, Zap, Target, Heart, Download, FileText } from "lucide-react";

interface DetailedKundaliDisplayProps {
  kundaliData: ComprehensiveKundaliData;
  language?: 'hi' | 'en';
}

const DetailedKundaliDisplay: React.FC<DetailedKundaliDisplayProps> = ({ 
  kundaliData,
  language = 'en'
}) => {
  const { enhancedCalculations, interpretations, birthData } = kundaliData;
  
  // Helper function to safely format date
  const formatDate = (date: string | Date): string => {
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString();
    }
    return date.toLocaleDateString();
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Enhanced Header with Personal Information */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-gray-800 flex items-center justify-center gap-2">
            <Crown className="h-6 w-6 text-orange-600" />
            {language === 'hi' ? 'संपूर्ण वैदिक कुंडली विश्लेषण' : 'Complete Vedic Kundali Analysis'}
          </CardTitle>
          <div className="text-center text-gray-600">
            <p className="text-lg font-semibold">{birthData.fullName}</p>
            <p>
              {language === 'hi' ? 'जन्म: ' : 'Born: '}
              {formatDate(birthData.date)} {language === 'hi' ? 'को ' : 'at '}
              {birthData.time}
            </p>
            <p>{language === 'hi' ? 'स्थान: ' : 'Place: '}{birthData.place}</p>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-1 mb-6">
          <TabsTrigger value="overview">{language === 'hi' ? 'अवलोकन' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="chart">{language === 'hi' ? 'चार्ट' : 'Chart'}</TabsTrigger>
          <TabsTrigger value="planets">{language === 'hi' ? 'ग्रह' : 'Planets'}</TabsTrigger>
          <TabsTrigger value="houses">{language === 'hi' ? 'भाव' : 'Houses'}</TabsTrigger>
          <TabsTrigger value="yogas">{language === 'hi' ? 'योग' : 'Yogas'}</TabsTrigger>
          <TabsTrigger value="dashas">{language === 'hi' ? 'दशा' : 'Dashas'}</TabsTrigger>
          <TabsTrigger value="remedies">{language === 'hi' ? 'उपाय' : 'Remedies'}</TabsTrigger>
          <TabsTrigger value="download">
            <Download className="h-4 w-4 mr-1" />
            {language === 'hi' ? 'डाउनलोड' : 'Download'}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Core Chart Information */}
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-600 flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  {language === 'hi' ? 'मुख्य चार्ट विवरण' : 'Core Chart Details'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-1">
                      {language === 'hi' ? 'लग्न (उदयकालीन राशि)' : 'Lagna (Ascendant)'}
                    </h4>
                    <p className="text-orange-600 font-medium">{enhancedCalculations.lagna.signName}</p>
                    <p className="text-sm text-gray-600">{enhancedCalculations.lagna.degree.toFixed(2)}°</p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-1">
                      {language === 'hi' ? 'चंद्र राशि' : 'Moon Sign'}
                    </h4>
                    <p className="text-blue-600 font-medium">{enhancedCalculations.planets.MO.rashiName}</p>
                    <p className="text-sm text-gray-600">
                      {language === 'hi' ? 'मन और भावनाएँ' : 'Mind & Emotions'}
                    </p>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-1">
                      {language === 'hi' ? 'सूर्य राशि' : 'Sun Sign'}
                    </h4>
                    <p className="text-yellow-600 font-medium">{enhancedCalculations.planets.SU.rashiName}</p>
                    <p className="text-sm text-gray-600">
                      {language === 'hi' ? 'आत्मा और अहम्' : 'Soul & Ego'}
                    </p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-1">
                      {language === 'hi' ? 'नक्षत्र' : 'Birth Nakshatra'}
                    </h4>
                    <p className="text-green-600 font-medium">{enhancedCalculations.planets.MO.nakshatraName}</p>
                    <p className="text-sm text-gray-600">
                      {language === 'hi' ? 'पद' : 'Pada'}: {enhancedCalculations.planets.MO.nakshatraPada}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chart Summary */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-600 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {language === 'hi' ? 'चार्ट सारांश' : 'Chart Summary'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">
                    {language === 'hi' ? 'कुल ग्रह:' : 'Total Planets:'}
                  </span>
                  <Badge variant="outline">{Object.keys(enhancedCalculations.planets).length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">
                    {language === 'hi' ? 'सक्रिय योग:' : 'Active Yogas:'}
                  </span>
                  <Badge className="bg-green-100 text-green-800">
                    {enhancedCalculations.yogas.filter(y => y.isActive).length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">
                    {language === 'hi' ? 'वर्तमान दशा:' : 'Current Dasha:'}
                  </span>
                  <Badge className="bg-purple-100 text-purple-800">
                    {enhancedCalculations.dashas.find(d => d.isActive)?.planet || 'Not specified'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">
                    {language === 'hi' ? 'जुलियन दिन:' : 'Julian Day:'}
                  </span>
                  <Badge variant="secondary">{enhancedCalculations.julianDay.toFixed(4)}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Key Strengths */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  {language === 'hi' ? 'मुख्य शक्तियां' : 'Key Strengths'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {interpretations.personality.strengths.slice(0, 4).map((strength, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Areas for Growth */}
            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-600 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {language === 'hi' ? 'विकास के क्षेत्र' : 'Areas for Growth'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {interpretations.personality.challenges.slice(0, 4).map((weakness, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{weakness}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Life Path Insights */}
            <Card className="border-purple-200 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-purple-600 flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  {language === 'hi' ? 'जीवन मार्ग अंतर्दृष्टि' : 'Life Path Insights'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">
                      {language === 'hi' ? 'करियर और वित्त' : 'Career & Finance'}
                    </h4>
                    <p className="text-sm text-gray-700">
                      {interpretations.predictions.youth.career[0] || 'Focus on skill development and networking opportunities.'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-pink-50 rounded-lg">
                    <h4 className="font-semibold text-pink-800 mb-2">
                      {language === 'hi' ? 'रिश्ते' : 'Relationships'}
                    </h4>
                    <p className="text-sm text-gray-700">
                      {interpretations.predictions.youth.relationships[0] || 'Strong potential for meaningful connections and partnerships.'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <h4 className="font-semibold text-indigo-800 mb-2">
                      {language === 'hi' ? 'स्वास्थ्य और कल्याण' : 'Health & Wellness'}
                    </h4>
                    <p className="text-sm text-gray-700">
                      {interpretations.predictions.youth.health[0] || 'Maintain regular exercise and balanced nutrition for optimal health.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Chart Tab */}
        <TabsContent value="chart">
          <EnhancedVisualKundaliChart kundaliData={kundaliData} language={language} />
        </TabsContent>

        {/* Planets Tab */}
        <TabsContent value="planets">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(enhancedCalculations.planets).map(([planetId, planet]) => (
              <Card key={planetId} className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{planet.name}</span>
                    {planet.isRetrograde && (
                      <Badge variant="secondary" className="text-xs">
                        {language === 'hi' ? 'वक्री' : 'Retrograde'}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <strong>{language === 'hi' ? 'राशि:' : 'Sign:'}</strong> {planet.rashiName}
                    </div>
                    <div>
                      <strong>{language === 'hi' ? 'भाव:' : 'House:'}</strong> {planet.house}
                    </div>
                    <div>
                      <strong>{language === 'hi' ? 'अंश:' : 'Degree:'}</strong> {planet.degreeInSign.toFixed(2)}°
                    </div>
                    <div>
                      <strong>{language === 'hi' ? 'नक्षत्र:' : 'Nakshatra:'}</strong> {planet.nakshatraName}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {planet.shadbala > 70 && (
                      <Badge variant="default" className="text-xs">
                        {language === 'hi' ? 'शक्तिशाली' : 'Strong'}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">{planet.dignity}</Badge>
                  </div>
                  
                  <div className="space-y-1 mt-2">
                    {planet.exaltation && (
                      <div className="text-xs text-green-600">
                        ✓ {language === 'hi' ? 'उच्च राशि' : 'Exalted'}
                      </div>
                    )}
                    {planet.debilitation && (
                      <div className="text-xs text-red-600">
                        ⚠ {language === 'hi' ? 'नीच राशि' : 'Debilitated'}
                      </div>
                    )}
                    {planet.ownSign && (
                      <div className="text-xs text-blue-600">
                        ⭐ {language === 'hi' ? 'स्वराशि' : 'Own Sign'}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Houses Tab */}
        <TabsContent value="houses">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enhancedCalculations.houses.map((house) => (
              <Card key={house.number} className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    {language === 'hi' ? 'भाव' : 'House'} {house.number}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1 text-sm">
                    <div>
                      <strong>{language === 'hi' ? 'राशि:' : 'Sign:'}</strong> {house.signName}
                    </div>
                    <div>
                      <strong>{language === 'hi' ? 'स्वामी:' : 'Lord:'}</strong> {house.lord}
                    </div>
                    <div>
                      <strong>{language === 'hi' ? 'क्षेत्रफल:' : 'Cusp:'}</strong> {house.cusp.toFixed(2)}°
                    </div>
                  </div>
                  
                  {house.planetsInHouse.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">
                        {language === 'hi' ? 'स्थित ग्रह:' : 'Planets:'}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {house.planetsInHouse.map((planet, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {planet}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {house.significance.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">
                        {language === 'hi' ? 'महत्व:' : 'Significance:'}
                      </p>
                      <ul className="text-xs text-gray-600 mt-1">
                        {house.significance.map((sig, index) => (
                          <li key={index}>• {sig}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Yogas Tab */}
        <TabsContent value="yogas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enhancedCalculations.yogas.length > 0 ? (
              enhancedCalculations.yogas.map((yoga, index) => (
                <Card key={index} className={`border-gray-200 ${yoga.isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>{yoga.name}</span>
                      <Badge variant={yoga.isActive ? "default" : "secondary"}>
                        {yoga.isActive ? (language === 'hi' ? 'मौजूद' : 'Present') : (language === 'hi' ? 'अनुपस्थित' : 'Absent')}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-gray-700">{yoga.description}</p>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <strong>{language === 'hi' ? 'प्रभाव:' : 'Effects:'}</strong>
                      </p>
                      <ul className="text-xs text-gray-600">
                        {yoga.effects.map((effect, i) => (
                          <li key={i}>• {effect}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm">
                        {language === 'hi' ? 'शक्ति:' : 'Strength:'}
                      </strong>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            yoga.type === 'benefic' ? 'bg-green-500' : 
                            yoga.type === 'malefic' ? 'bg-red-500' : 'bg-orange-500'
                          }`}
                          style={{ width: `${yoga.strength}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{yoga.strength}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="md:col-span-2 text-center p-8">
                <p className="text-gray-500">
                  {language === 'hi' 
                    ? 'कोई विशेष योग नहीं मिला।' 
                    : 'No specific yogas found in the chart.'}
                </p>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Dashas Tab */}
        <TabsContent value="dashas">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">
                  {language === 'hi' ? 'विंशोत्तरी दशा अवधि' : 'Vimshottari Dasha Periods'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {enhancedCalculations.dashas.map((dasha, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border ${
                        dasha.isActive 
                          ? 'bg-orange-50 border-orange-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-lg">
                            {dasha.planet} {language === 'hi' ? 'दशा' : 'Dasha'}
                            {dasha.planetSanskrit && language === 'hi' && ` (${dasha.planetSanskrit})`}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {dasha.startDate.toLocaleDateString()} - {dasha.endDate.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{dasha.years} {language === 'hi' ? 'वर्ष' : 'years'}</p>
                          {dasha.isActive && (
                            <Badge className="mt-1">
                              {language === 'hi' ? 'वर्तमान में सक्रिय' : 'Currently Active'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Remedies Tab */}
        <TabsContent value="remedies">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">
                  {language === 'hi' ? 'रत्न' : 'Gemstones'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {interpretations.remedies.gemstones.map((gem, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">💎</span>
                      <span className="text-sm">
                        <strong>{gem.stone}</strong> - {gem.weight} {language === 'hi' ? 'के लिए' : 'for'} {gem.planet}
                        <div className="text-xs text-gray-600 mt-1">
                          {language === 'hi' ? 'धातु:' : 'Metal:'} {gem.metal}, 
                          {language === 'hi' ? ' उंगली:' : ' Finger:'} {gem.finger}
                        </div>
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">
                  {language === 'hi' ? 'मंत्र' : 'Mantras'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {interpretations.remedies.mantras.map((mantra, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">🕉️</span>
                      <span className="text-sm font-mono">{mantra.mantra}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">
                  {language === 'hi' ? 'दान और अनुदान' : 'Charity & Donations'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {interpretations.remedies.charities.map((charity, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">🤲</span>
                      <span className="text-sm">{charity.item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">
                  {language === 'hi' ? 'अनुष्ठान और प्रथाएँ' : 'Rituals & Practices'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {interpretations.remedies.rituals.map((ritual, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">🙏</span>
                      <span className="text-sm">{ritual.ritual}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Download Tab */}
        <TabsContent value="download">
          <EnhancedKundaliPDFExport kundaliData={kundaliData} language={language} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailedKundaliDisplay;
