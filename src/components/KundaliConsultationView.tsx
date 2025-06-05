
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';
import EnhancedKundaliPDFExport from './EnhancedKundaliPDFExport';
import EnhancedVisualKundaliChart from './EnhancedVisualKundaliChart';
import RishiParasherGuru from './RishiParasherGuru';
import { FileText, ChevronDown, Star, Moon, Sun, MessageCircle, Download, Crown, Shield } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface KundaliConsultationViewProps {
  kundaliData: ComprehensiveKundaliData;
  language?: 'hi' | 'en';
}

const KundaliConsultationView: React.FC<KundaliConsultationViewProps> = ({
  kundaliData,
  language = 'en'
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const lagna = kundaliData.enhancedCalculations.lagna;
  const planets = kundaliData.enhancedCalculations.planets;
  const dashas = kundaliData.enhancedCalculations.dashas;
  const yogas = kundaliData.enhancedCalculations.yogas;
  
  const planetSummary = [
    {
      name: language === 'hi' ? 'सूर्य' : 'Sun',
      sign: planets.SU.rashiName,
      house: Math.floor(((planets.SU.rashi - lagna.sign + 12) % 12) + 1),
      icon: <Sun className="h-4 w-4 text-yellow-500" />
    },
    {
      name: language === 'hi' ? 'चंद्र' : 'Moon',
      sign: planets.MO.rashiName,
      house: Math.floor(((planets.MO.rashi - lagna.sign + 12) % 12) + 1),
      icon: <Moon className="h-4 w-4 text-blue-500" />
    }
  ];
  
  const currentDasha = dashas.find(dasha => dasha.isActive);
  const activeYogas = yogas.filter(yoga => yoga.isActive);
  
  // Check for doshas (simplified)
  const doshas = [];
  const marsHouse = Math.floor(((planets.MA.rashi - lagna.sign + 12) % 12) + 1);
  if ([1, 4, 7, 8, 12].includes(marsHouse)) {
    doshas.push(language === 'hi' ? 'मंगल दोष' : 'Mangal Dosha');
  }
  
  return (
    <Card className="w-full border-orange-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-orange-800 flex items-center gap-2">
            <Crown className="h-5 w-5 text-orange-600" />
            {language === 'hi' ? 'आपकी संपूर्ण कुंडली विश्लेषण' : 'Your Complete Kundali Analysis'}
          </CardTitle>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-orange-600 hover:text-orange-700"
          >
            <ChevronDown className={`h-5 w-5 transform transition-transform ${isCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>
        
        {/* Always visible summary */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2 text-sm">
          <div className="bg-white px-3 py-1 rounded-lg shadow-sm border border-orange-200">
            <span className="font-medium text-orange-800">{language === 'hi' ? 'लग्न:' : 'Asc:'}</span> {lagna.signName}
          </div>
          
          {planetSummary.map((planet, index) => (
            <div key={index} className="bg-white px-3 py-1 rounded-lg shadow-sm border border-orange-200 flex items-center gap-1">
              {planet.icon}
              <span>{planet.sign}</span>
              <span className="text-xs text-gray-500">H{planet.house}</span>
            </div>
          ))}
          
          {currentDasha && (
            <div className="bg-white px-3 py-1 rounded-lg shadow-sm border border-orange-200">
              <span className="font-medium text-orange-800">{language === 'hi' ? 'दशा:' : 'Dasha:'}</span> {currentDasha.planet}
            </div>
          )}
        </div>
      </CardHeader>
      
      {!isCollapsed && (
        <CardContent className="p-4">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                {language === 'hi' ? 'अवलोकन' : 'Overview'}
              </TabsTrigger>
              <TabsTrigger value="chart" className="text-xs sm:text-sm">
                {language === 'hi' ? 'चार्ट' : 'Chart'}
              </TabsTrigger>
              <TabsTrigger value="download" className="text-xs sm:text-sm">
                <Download className="h-3 w-3 mr-1" />
                {language === 'hi' ? 'डाउनलोड' : 'Download'}
              </TabsTrigger>
              <TabsTrigger value="rishi" className="text-xs sm:text-sm flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {language === 'hi' ? 'महर्षि पराशर' : 'Rishi Parasher'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="space-y-6">
                {/* Core Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Rashi & Lagna */}
                  <Card className="border-blue-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-blue-600 text-lg flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        {language === 'hi' ? 'राशि और लग्न' : 'Rashi & Lagna'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <span className="font-medium">{language === 'hi' ? 'लग्न:' : 'Lagna:'}</span> {lagna.signName}
                      </div>
                      <div>
                        <span className="font-medium">{language === 'hi' ? 'चंद्र राशि:' : 'Moon Sign:'}</span> {planets.MO.rashiName}
                      </div>
                      <div>
                        <span className="font-medium">{language === 'hi' ? 'सूर्य राशि:' : 'Sun Sign:'}</span> {planets.SU.rashiName}
                      </div>
                      <div>
                        <span className="font-medium">{language === 'hi' ? 'नक्षत्र:' : 'Nakshatra:'}</span> {planets.MO.nakshatraName}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Active Yogas */}
                  <Card className="border-green-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-green-600 text-lg flex items-center gap-2">
                        <Crown className="h-4 w-4" />
                        {language === 'hi' ? 'प्रमुख योग' : 'Main Yogas'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {activeYogas.length > 0 ? (
                        <div className="space-y-2">
                          {activeYogas.slice(0, 3).map((yoga, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Badge variant={yoga.type === 'benefic' ? 'default' : 'destructive'} className="text-xs">
                                {yoga.name}
                              </Badge>
                              <span className="text-xs text-gray-500">{yoga.strength}%</span>
                            </div>
                          ))}
                          {activeYogas.length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{activeYogas.length - 3} {language === 'hi' ? 'और योग' : 'more yogas'}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">
                          {language === 'hi' ? 'कोई विशेष योग नहीं मिला' : 'No specific yogas found'}
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Doshas */}
                  <Card className="border-red-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-red-600 text-lg flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        {language === 'hi' ? 'दोष विश्लेषण' : 'Dosha Analysis'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {doshas.length > 0 ? (
                        <div className="space-y-2">
                          {doshas.map((dosha, index) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              {dosha}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-green-600">
                          {language === 'hi' ? 'कोई मुख्य दोष नहीं' : 'No major doshas'}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Current Dasha */}
                <Card className="border-purple-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-purple-600 flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      {language === 'hi' ? 'वर्तमान दशा' : 'Current Dasha'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentDasha ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <span className="font-medium">{language === 'hi' ? 'दशा स्वामी:' : 'Dasha Lord:'}</span> {currentDasha.planet}
                        </div>
                        <div>
                          <span className="font-medium">{language === 'hi' ? 'अवधि:' : 'Duration:'}</span> {currentDasha.years} {language === 'hi' ? 'वर्ष' : 'years'}
                        </div>
                        <div>
                          <span className="font-medium">{language === 'hi' ? 'समाप्ति:' : 'Ends:'}</span> {currentDasha.endDate.toLocaleDateString()}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">
                        {language === 'hi' ? 'दशा जानकारी उपलब्ध नहीं है' : 'Dasha information not available'}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Planetary Strengths */}
                <Card className="border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-gray-600 flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      {language === 'hi' ? 'ग्रह शक्ति' : 'Planetary Strengths'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(planets).map(([planetId, planet]) => (
                        <div key={planetId} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{planet.name}:</span>
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  planet.shadbala > 70 ? 'bg-green-500' : 
                                  planet.shadbala > 40 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${planet.shadbala}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{planet.shadbala.toFixed(0)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="chart">
              <EnhancedVisualKundaliChart kundaliData={kundaliData} language={language} />
            </TabsContent>
            
            <TabsContent value="download">
              <EnhancedKundaliPDFExport kundaliData={kundaliData} language={language} />
            </TabsContent>
            
            <TabsContent value="rishi">
              <div className="max-h-[500px] overflow-hidden">
                <RishiParasherGuru kundaliData={kundaliData} language={language} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
};

export default KundaliConsultationView;
