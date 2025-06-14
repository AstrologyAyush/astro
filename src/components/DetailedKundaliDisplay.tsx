import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';
import EnhancedVisualKundaliChart from './EnhancedVisualKundaliChart';
import EnhancedKundaliPDFExport from './EnhancedKundaliPDFExport';
import { Badge } from "@/components/ui/badge";
import { Star, Crown, Shield, Zap, Target, Heart, Download, FileText, Sparkles, Sun, Moon } from "lucide-react";

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
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-8 bg-gradient-to-br from-orange-50 via-white to-red-50 min-h-screen">
      {/* Enhanced Header with Personal Information */}
      <Card className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border-2 border-orange-200 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 via-transparent to-red-100/30"></div>
        <CardHeader className="relative z-10 text-center py-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
              <Crown className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            {language === 'hi' ? 'संपूर्ण वैदिक कुंडली विश्लेषण' : 'Complete Vedic Kundali Analysis'}
          </CardTitle>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-800">{birthData.fullName}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-yellow-500" />
                <span>
                  {language === 'hi' ? 'जन्म: ' : 'Born: '}
                  {formatDate(birthData.date)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-blue-500" />
                <span>{birthData.time}</span>
              </div>
            </div>
            <p className="text-gray-600 flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              {language === 'hi' ? 'स्थान: ' : 'Place: '}{birthData.place}
            </p>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-1 mb-8 bg-white/80 backdrop-blur-sm border-2 border-orange-100 rounded-xl p-2">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg transition-all duration-200">
            {language === 'hi' ? 'अवलोकन' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="chart" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg transition-all duration-200">
            {language === 'hi' ? 'चार्ट' : 'Chart'}
          </TabsTrigger>
          <TabsTrigger value="planets" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg transition-all duration-200">
            {language === 'hi' ? 'ग्रह' : 'Planets'}
          </TabsTrigger>
          <TabsTrigger value="houses" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg transition-all duration-200">
            {language === 'hi' ? 'भाव' : 'Houses'}
          </TabsTrigger>
          <TabsTrigger value="yogas" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg transition-all duration-200">
            {language === 'hi' ? 'योग' : 'Yogas'}
          </TabsTrigger>
          <TabsTrigger value="dashas" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg transition-all duration-200">
            {language === 'hi' ? 'दशा' : 'Dashas'}
          </TabsTrigger>
          <TabsTrigger value="remedies" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg transition-all duration-200">
            {language === 'hi' ? 'उपाय' : 'Remedies'}
          </TabsTrigger>
          <TabsTrigger value="download" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg transition-all duration-200">
            <Download className="h-4 w-4 mr-1" />
            {language === 'hi' ? 'डाउनलोड' : 'Download'}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Core Chart Information */}
            <Card className="border-2 border-orange-200 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 rounded-t-lg">
                <CardTitle className="text-orange-700 flex items-center gap-3 text-xl">
                  <div className="p-2 bg-orange-500 rounded-full">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  {language === 'hi' ? 'मुख्य चार्ट विवरण' : 'Core Chart Details'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:shadow-lg transition-all duration-200">
                    <h4 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      {language === 'hi' ? 'लग्न (उदयकालीन राशि)' : 'Lagna (Ascendant)'}
                    </h4>
                    <p className="text-xl font-bold text-orange-600">{enhancedCalculations.lagna.signName}</p>
                    <p className="text-sm text-gray-600">{enhancedCalculations.lagna.degree.toFixed(2)}°</p>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-200">
                    <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      {language === 'hi' ? 'चंद्र राशि' : 'Moon Sign'}
                    </h4>
                    <p className="text-xl font-bold text-blue-600">{enhancedCalculations.planets.MO.rashiName}</p>
                    <p className="text-sm text-gray-600">
                      {language === 'hi' ? 'मन और भावनाएँ' : 'Mind & Emotions'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 hover:shadow-lg transition-all duration-200">
                    <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      {language === 'hi' ? 'सूर्य राशि' : 'Sun Sign'}
                    </h4>
                    <p className="text-xl font-bold text-yellow-600">{enhancedCalculations.planets.SU.rashiName}</p>
                    <p className="text-sm text-gray-600">
                      {language === 'hi' ? 'आत्मा और अहम्' : 'Soul & Ego'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-200">
                    <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      {language === 'hi' ? 'नक्षत्र' : 'Birth Nakshatra'}
                    </h4>
                    <p className="text-xl font-bold text-green-600">{enhancedCalculations.planets.MO.nakshatraName}</p>
                    <p className="text-sm text-gray-600">
                      {language === 'hi' ? 'पद' : 'Pada'}: {enhancedCalculations.planets.MO.nakshatraPada}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chart Summary */}
            <Card className="border-2 border-blue-200 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-t-lg">
                <CardTitle className="text-blue-700 flex items-center gap-3 text-xl">
                  <div className="p-2 bg-blue-500 rounded-full">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  {language === 'hi' ? 'चार्ट सारांश' : 'Chart Summary'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-gray-700 font-medium">
                    {language === 'hi' ? 'कुल ग्रह:' : 'Total Planets:'}
                  </span>
                  <Badge variant="outline" className="text-lg px-3 py-1">{Object.keys(enhancedCalculations.planets).length}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <span className="text-gray-700 font-medium">
                    {language === 'hi' ? 'सक्रिय योग:' : 'Active Yogas:'}
                  </span>
                  <Badge className="bg-green-500 text-white text-lg px-3 py-1">
                    {enhancedCalculations.yogas.filter(y => y.isActive).length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <span className="text-gray-700 font-medium">
                    {language === 'hi' ? 'वर्तमान दशा:' : 'Current Dasha:'}
                  </span>
                  <Badge className="bg-purple-500 text-white text-lg px-3 py-1">
                    {enhancedCalculations.dashas.find(d => d.isActive)?.planet || 'Not specified'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                  <span className="text-gray-700 font-medium">
                    {language === 'hi' ? 'जुलियन दिन:' : 'Julian Day:'}
                  </span>
                  <Badge variant="secondary" className="text-lg px-3 py-1">{enhancedCalculations.julianDay.toFixed(4)}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Key Strengths */}
            <Card className="border-2 border-green-200 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-t-lg">
                <CardTitle className="text-green-700 flex items-center gap-3 text-xl">
                  <div className="p-2 bg-green-500 rounded-full">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  {language === 'hi' ? 'मुख्य शक्तियां' : 'Key Strengths'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {interpretations.personality.strengths.slice(0, 4).map((strength, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-50 transition-colors">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed">{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Areas for Growth */}
            <Card className="border-2 border-yellow-200 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-t-lg">
                <CardTitle className="text-yellow-700 flex items-center gap-3 text-xl">
                  <div className="p-2 bg-yellow-500 rounded-full">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  {language === 'hi' ? 'विकास के क्षेत्र' : 'Areas for Growth'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {interpretations.personality.challenges.slice(0, 4).map((weakness, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-yellow-50 transition-colors">
                      <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed">{weakness}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Life Path Insights */}
            <Card className="border-2 border-purple-200 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 lg:col-span-2">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-t-lg">
                <CardTitle className="text-purple-700 flex items-center gap-3 text-xl">
                  <div className="p-2 bg-purple-500 rounded-full">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  {language === 'hi' ? 'जीवन मार्ग अंतर्दृष्टि' : 'Life Path Insights'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-200">
                    <h4 className="font-bold text-purple-800 mb-3 text-lg">
                      {language === 'hi' ? 'करियर और वित्त' : 'Career & Finance'}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {interpretations.predictions.youth.career[0] || 'Focus on skill development and networking opportunities.'}
                    </p>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl border border-pink-200 hover:shadow-lg transition-all duration-200">
                    <h4 className="font-bold text-pink-800 mb-3 text-lg">
                      {language === 'hi' ? 'रिश्ते' : 'Relationships'}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {interpretations.predictions.youth.relationships[0] || 'Strong potential for meaningful connections and partnerships.'}
                    </p>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200 hover:shadow-lg transition-all duration-200">
                    <h4 className="font-bold text-indigo-800 mb-3 text-lg">
                      {language === 'hi' ? 'स्वास्थ्य और कल्याण' : 'Health & Wellness'}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {interpretations.predictions.youth.health[0] || 'Maintain regular exercise and balanced nutrition for optimal health.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Chart Tab */}
        <TabsContent value="chart" className="animate-fade-in">
          <EnhancedVisualKundaliChart kundaliData={kundaliData} language={language} />
        </TabsContent>

        {/* Planets Tab */}
        <TabsContent value="planets" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(enhancedCalculations.planets).map(([planetId, planet]) => (
              <Card key={planetId} className="border-2 border-gray-200 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="text-gray-800 font-bold">{planet.name}</span>
                    {planet.isRetrograde && (
                      <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                        {language === 'hi' ? 'वक्री' : 'Retrograde'}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <strong className="text-blue-700">{language === 'hi' ? 'राशि:' : 'Sign:'}</strong> 
                      <div className="text-blue-600 font-medium">{planet.rashiName}</div>
                    </div>
                    <div className="p-2 bg-green-50 rounded-lg">
                      <strong className="text-green-700">{language === 'hi' ? 'भाव:' : 'House:'}</strong> 
                      <div className="text-green-600 font-medium">{planet.house}</div>
                    </div>
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <strong className="text-purple-700">{language === 'hi' ? 'अंश:' : 'Degree:'}</strong> 
                      <div className="text-purple-600 font-medium">{planet.degreeInSign.toFixed(2)}°</div>
                    </div>
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <strong className="text-orange-700">{language === 'hi' ? 'नक्षत्र:' : 'Nakshatra:'}</strong> 
                      <div className="text-orange-600 font-medium text-xs">{planet.nakshatraName}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {planet.shadbala > 70 && (
                      <Badge className="bg-green-500 text-white text-xs">
                        {language === 'hi' ? 'शक्तिशाली' : 'Strong'}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs border-gray-400">{planet.dignity}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {planet.exaltation && (
                      <div className="text-xs text-green-600 bg-green-50 p-2 rounded-lg">
                        ✓ {language === 'hi' ? 'उच्च राशि' : 'Exalted'}
                      </div>
                    )}
                    {planet.debilitation && (
                      <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">
                        ⚠ {language === 'hi' ? 'नीच राशि' : 'Debilitated'}
                      </div>
                    )}
                    {planet.ownSign && (
                      <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg">
                        ⭐ {language === 'hi' ? 'स्वराशि' : 'Own Sign'}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Keep existing TabsContent sections for houses, yogas, dashas, remedies, and download unchanged */}
        <TabsContent value="houses" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enhancedCalculations.houses.map((house) => (
              <Card key={house.number} className="border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg dark:text-gray-100">
                    {language === 'hi' ? 'भाव' : 'House'} {house.number}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1 text-sm">
                    <div>
                      <strong className="dark:text-gray-200">{language === 'hi' ? 'राशि:' : 'Sign:'}</strong> 
                      <span className="ml-1 dark:text-gray-300">{house.signName}</span>
                    </div>
                    <div>
                      <strong className="dark:text-gray-200">{language === 'hi' ? 'स्वामी:' : 'Lord:'}</strong> 
                      <span className="ml-1 dark:text-gray-300">{house.lord}</span>
                    </div>
                    <div>
                      <strong className="dark:text-gray-200">{language === 'hi' ? 'क्षेत्रफल:' : 'Cusp:'}</strong> 
                      <span className="ml-1 dark:text-gray-300">{house.cusp.toFixed(2)}°</span>
                    </div>
                  </div>
                  
                  {house.planetsInHouse.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {language === 'hi' ? 'महत्व:' : 'Significance:'}
                      </p>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 mt-1">
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
        <TabsContent value="yogas" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enhancedCalculations.yogas.length > 0 ? (
              enhancedCalculations.yogas.map((yoga, index) => (
                <Card key={index} className={`border-gray-200 dark:border-gray-700 ${yoga.isActive ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' : 'bg-gray-50 dark:bg-gray-800'}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span className="dark:text-gray-100">{yoga.name}</span>
                      <Badge variant={yoga.isActive ? "default" : "secondary"}>
                        {yoga.isActive ? (language === 'hi' ? 'मौजूद' : 'Present') : (language === 'hi' ? 'अनुपस्थित' : 'Absent')}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{yoga.description}</p>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <strong className="dark:text-gray-200">{language === 'hi' ? 'प्रभाव:' : 'Effects:'}</strong>
                      </p>
                      <ul className="text-xs text-gray-600 dark:text-gray-400">
                        {yoga.effects.map((effect, i) => (
                          <li key={i}>• {effect}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm dark:text-gray-200">
                        {language === 'hi' ? 'शक्ति:' : 'Strength:'}
                      </strong>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            yoga.type === 'benefic' ? 'bg-green-500' : 
                            yoga.type === 'malefic' ? 'bg-red-500' : 'bg-orange-500'
                          }`}
                          style={{ width: `${yoga.strength}%` }}
                        ></div>
                      </div>
                      <span className="text-sm dark:text-gray-300">{yoga.strength}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="md:col-span-2 text-center p-8 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">
                  {language === 'hi' 
                    ? 'कोई विशेष योग नहीं मिला।' 
                    : 'No specific yogas found in the chart.'}
                </p>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Dashas Tab */}
        <TabsContent value="dashas" className="animate-fade-in">
          <div className="space-y-4">
            <Card className="dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-600 dark:text-orange-400">
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
                          ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700' 
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-lg dark:text-gray-100">
                            {dasha.planet} {language === 'hi' ? 'दशा' : 'Dasha'}
                            {dasha.planetSanskrit && language === 'hi' && ` (${dasha.planetSanskrit})`}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {dasha.startDate.toLocaleDateString()} - {dasha.endDate.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium dark:text-gray-200">{dasha.years} {language === 'hi' ? 'वर्ष' : 'years'}</p>
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
        <TabsContent value="remedies" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-600 dark:text-orange-400">
                  {language === 'hi' ? 'रत्न' : 'Gemstones'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {interpretations.remedies.gemstones.map((gem, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">💎</span>
                      <span className="text-sm dark:text-gray-300">
                        <strong>{gem.stone}</strong> - {gem.weight} {language === 'hi' ? 'के लिए' : 'for'} {gem.planet}
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {language === 'hi' ? 'धातु:' : 'Metal:'} {gem.metal}, 
                          {language === 'hi' ? ' उंगली:' : ' Finger:'} {gem.finger}
                        </div>
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-600 dark:text-orange-400">
                  {language === 'hi' ? 'मंत्र' : 'Mantras'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {interpretations.remedies.mantras.map((mantra, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">🕉️</span>
                      <span className="text-sm font-mono dark:text-gray-300">{mantra.mantra}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-600 dark:text-orange-400">
                  {language === 'hi' ? 'दान और अनुदान' : 'Charity & Donations'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {interpretations.remedies.charities.map((charity, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">🤲</span>
                      <span className="text-sm dark:text-gray-300">{charity.item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-orange-600 dark:text-orange-400">
                  {language === 'hi' ? 'अनुष्ठान और प्रथाएँ' : 'Rituals & Practices'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {interpretations.remedies.rituals.map((ritual, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">🙏</span>
                      <span className="text-sm dark:text-gray-300">{ritual.ritual}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Download Tab */}
        <TabsContent value="download" className="animate-fade-in">
          <EnhancedKundaliPDFExport kundaliData={kundaliData} language={language} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailedKundaliDisplay;
