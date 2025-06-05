
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';
import EnhancedKundaliPDFExport from './EnhancedKundaliPDFExport';
import EnhancedVisualKundaliChart from './EnhancedVisualKundaliChart';
import AyuAstroAIGuru from './AyuAstroAIGuru';
import { FileText, ChevronDown, Star, Moon, Sun, MessageCircle } from 'lucide-react';

interface KundaliConsultationViewProps {
  kundaliData: ComprehensiveKundaliData;
  language?: 'hi' | 'en';
}

const KundaliConsultationView: React.FC<KundaliConsultationViewProps> = ({
  kundaliData,
  language = 'en'
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Core information
  const lagna = kundaliData.enhancedCalculations.lagna;
  const planets = kundaliData.enhancedCalculations.planets;
  const dashas = kundaliData.enhancedCalculations.dashas;
  
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
  
  const yogas = kundaliData.enhancedCalculations.yogas;
  const currentDasha = dashas.find(dasha => dasha.isActive);
  
  return (
    <Card className="w-full border-orange-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-orange-800 flex items-center gap-2">
            <Star className="h-5 w-5 text-orange-600" />
            {language === 'hi' ? 'आपकी कुंडली परामर्श' : 'Your Kundali Consultation'}
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
          <Tabs defaultValue="chart">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="chart" className="text-xs sm:text-sm">
                {language === 'hi' ? 'चार्ट' : 'Chart'}
              </TabsTrigger>
              <TabsTrigger value="download" className="text-xs sm:text-sm">
                {language === 'hi' ? 'डाउनलोड' : 'Download'}
              </TabsTrigger>
              <TabsTrigger value="guru" className="text-xs sm:text-sm flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {language === 'hi' ? 'AI गुरु' : 'AI Guru'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart">
              <EnhancedVisualKundaliChart kundaliData={kundaliData} language={language} />
              
              {/* Key Highlights */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Yogas */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-3 rounded-lg border border-orange-200">
                  <h3 className="font-medium text-orange-800 mb-2 flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    {language === 'hi' ? 'प्रमुख योग' : 'Key Yogas'}
                  </h3>
                  <ul className="space-y-1 text-sm">
                    {yogas.length > 0 ? (
                      yogas.slice(0, 3).map((yoga, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${yoga.type === 'benefic' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span>{yoga.name}</span>
                          <span className="text-xs text-gray-500">({yoga.strength}%)</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-600">
                        {language === 'hi' ? 'कोई विशेष योग नहीं मिला' : 'No specific yogas found'}
                      </li>
                    )}
                  </ul>
                </div>
                
                {/* Dasha periods */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-2">
                    {language === 'hi' ? 'वर्तमान दशा' : 'Current Dasha'}
                  </h3>
                  {currentDasha ? (
                    <div className="text-sm">
                      <p className="font-medium">{currentDasha.planet} {language === 'hi' ? 'महादशा' : 'Mahadasha'}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {currentDasha.startDate.toLocaleDateString()} - {currentDasha.endDate.toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">
                      {language === 'hi' ? 'दशा जानकारी उपलब्ध नहीं है' : 'Dasha information not available'}
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="download">
              <EnhancedKundaliPDFExport kundaliData={kundaliData} language={language} />
            </TabsContent>
            
            <TabsContent value="guru">
              <div className="max-h-[500px] overflow-y-auto">
                <AyuAstroAIGuru kundaliData={kundaliData} language={language} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
};

export default KundaliConsultationView;
