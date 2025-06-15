import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Sun, Moon, Star, Heart, Briefcase, Activity, Clock, Sparkles, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EnhancedDailyHoroscopeProps {
  kundaliData: any;
  language?: 'hi' | 'en';
}

interface HoroscopeData {
  mainPrediction: string;
  love: string;
  career: string;
  health: string;
  finance: string;
  luckyNumbers: number[];
  luckyColors: string[];
  luckyDirection: string;
  auspiciousTime: string;
  challenges: string;
  remedies: string[];
}

const EnhancedDailyHoroscope: React.FC<EnhancedDailyHoroscopeProps> = ({ 
  kundaliData, 
  language = 'en' 
}) => {
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const { toast } = useToast();

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const generatePersonalizedHoroscope = async () => {
    if (!kundaliData?.enhancedCalculations) {
      toast({
        title: getTranslation("Error", "त्रुटि"),
        description: getTranslation("Please generate your Kundali first to get personalized horoscope.", "व्यक्तिगत राशिफल के लिए पहले अपनी कुंडली बनाएं।"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    const today = new Date().toISOString().split('T')[0];

    try {
      // Check if we already generated horoscope for today
      if (lastGenerated === today && horoscope) {
        setIsLoading(false);
        return;
      }

      console.log('Generating horoscope for kundali data:', kundaliData);

      // Simple direct query instead of complex prompt
      const userQuery = language === 'hi' 
        ? `आज ${new Date().toLocaleDateString('hi-IN')} के लिए व्यक्तिगत राशिफल दें।`
        : `Generate personalized horoscope for today ${new Date().toLocaleDateString()}.`;
      
      const { data, error } = await supabase.functions.invoke('kundali-ai-analysis', {
        body: {
          kundaliData,
          userQuery,
          language,
          analysisType: 'daily_horoscope'
        }
      });

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (data?.analysis) {
        const parsedHoroscope = parseHoroscopeResponse(data.analysis);
        setHoroscope(parsedHoroscope);
        setLastGenerated(today);

        toast({
          title: getTranslation("Success", "सफलता"),
          description: getTranslation("Your personalized horoscope has been generated!", "आपका व्यक्तिगत राशिफल तैयार हो गया है!"),
        });
      } else {
        throw new Error('No analysis data received');
      }

    } catch (error) {
      console.error('Error generating personalized horoscope:', error);
      
      // Generate fallback horoscope immediately
      const fallbackHoroscope = generateFallbackHoroscope();
      setHoroscope(fallbackHoroscope);
      setLastGenerated(today);

      toast({
        title: getTranslation("Generated", "तैयार"),
        description: getTranslation("Horoscope generated with available data.", "उपलब्ध डेटा के साथ राशिफल तैयार किया गया।"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const parseHoroscopeResponse = (response: string): HoroscopeData => {
    console.log('Parsing horoscope response:', response);
    
    // Simple fallback parsing - if structured response fails, use fallback
    try {
      const lines = response.split('\n');
      const data: Partial<HoroscopeData> = {};
      
      lines.forEach(line => {
        const lowerLine = line.toLowerCase();
        if (lowerLine.includes('main prediction') || lowerLine.includes('मुख्य भविष्यवाणी')) {
          data.mainPrediction = line.split(':')[1]?.trim() || '';
        } else if (lowerLine.includes('love') || lowerLine.includes('प्रेम')) {
          data.love = line.split(':')[1]?.trim() || '';
        } else if (lowerLine.includes('career') || lowerLine.includes('करियर')) {
          data.career = line.split(':')[1]?.trim() || '';
        } else if (lowerLine.includes('health') || lowerLine.includes('स्वास्थ्य')) {
          data.health = line.split(':')[1]?.trim() || '';
        } else if (lowerLine.includes('finance') || lowerLine.includes('वित्त')) {
          data.finance = line.split(':')[1]?.trim() || '';
        }
      });

      // If we didn't get structured data, treat the whole response as main prediction
      if (!data.mainPrediction && response.length > 50) {
        data.mainPrediction = response.substring(0, 200) + '...';
      }

      return {
        mainPrediction: data.mainPrediction || getTranslation('Today brings new opportunities and growth based on your chart.', 'आज आपकी कुंडली के अनुसार नए अवसर और विकास लाता है।'),
        love: data.love || getTranslation('Harmony in relationships today.', 'आज रिश्तों में सामंजस्य।'),
        career: data.career || getTranslation('Focus on your goals and work steadily.', 'अपने लक्ष्यों पर ध्यान दें और लगातार काम करें।'),
        health: data.health || getTranslation('Take care of your health and stay active.', 'अपने स्वास्थ्य का ध्यान रखें और सक्रिय रहें।'),
        finance: data.finance || getTranslation('Manage finances wisely today.', 'आज वित्त का बुद्धिमानी से प्रबंधन करें।'),
        luckyNumbers: [3, 7, 9],
        luckyColors: [getTranslation('Blue', 'नीला'), getTranslation('Green', 'हरा')],
        luckyDirection: getTranslation('East', 'पूर्व'),
        auspiciousTime: getTranslation('6-8 AM', 'सुबह 6-8 बजे'),
        challenges: getTranslation('Minor delays possible, stay patient.', 'मामूली देरी संभव है, धैर्य रखें।'),
        remedies: [
          getTranslation('Chant Om Namah Shivaya', 'ॐ नमः शिवाय का जप करें'),
          getTranslation('Donate food to needy', 'जरूरतमंदों को भोजन दान करें'),
          getTranslation('Light a lamp in evening', 'शाम को दीपक जलाएं')
        ]
      };
    } catch (parseError) {
      console.error('Error parsing horoscope response:', parseError);
      return generateFallbackHoroscope();
    }
  };

  const generateFallbackHoroscope = (): HoroscopeData => {
    const calc = kundaliData?.enhancedCalculations;
    const ascendant = calc?.lagna?.signName || 'Unknown';
    const currentDasha = calc?.dashas?.find(d => d.isActive);
    
    return {
      mainPrediction: getTranslation(
        `Today is favorable for your ${ascendant} ascendant. ${currentDasha ? `Currently running ${currentDasha.planet} dasha period.` : ''} Focus on personal growth and positive actions.`,
        `आज आपके ${ascendant} लग्न के लिए अनुकूल है। ${currentDasha ? `वर्तमान में ${currentDasha.planet} दशा चल रही है।` : ''} व्यक्तिगत विकास और सकारात्मक कार्यों पर ध्यान दें।`
      ),
      love: getTranslation('Express your feelings openly today.', 'आज अपनी भावनाओं को खुलकर व्यक्त करें।'),
      career: getTranslation('Good day for important decisions at work.', 'काम पर महत्वपूर्ण निर्णयों के लिए अच्छा दिन।'),
      health: getTranslation('Maintain work-life balance for better health.', 'बेहतर स्वास्थ्य के लिए कार्य-जीवन संतुलन बनाए रखें।'),
      finance: getTranslation('Avoid major financial decisions today.', 'आज बड़े वित्तीय निर्णयों से बचें।'),
      luckyNumbers: [1, 5, 8],
      luckyColors: [getTranslation('White', 'सफेद'), getTranslation('Yellow', 'पीला')],
      luckyDirection: getTranslation('North', 'उत्तर'),
      auspiciousTime: getTranslation('10-12 PM', 'दोपहर 10-12 बजे'),
      challenges: getTranslation('Communication issues may arise.', 'संचार संबंधी समस्याएं हो सकती हैं।'),
      remedies: [
        getTranslation('Meditate for 10 minutes', '10 मिनट ध्यान करें'),
        getTranslation('Wear clean white clothes', 'साफ सफेद कपड़े पहनें'),
        getTranslation('Drink plenty of water', 'भरपूर पानी पिएं')
      ]
    };
  };

  useEffect(() => {
    if (kundaliData?.enhancedCalculations && !horoscope) {
      generatePersonalizedHoroscope();
    }
  }, [kundaliData]);

  if (!kundaliData) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <Sun className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
          <h3 className="text-lg font-semibold mb-2">
            {getTranslation('Generate Your Kundali First', 'पहले अपनी कुंडली बनाएं')}
          </h3>
          <p className="text-gray-600">
            {getTranslation(
              'Create your birth chart to get personalized daily horoscope',
              'व्यक्तिगत दैनिक राशिफल पाने के लिए अपनी जन्मपत्रिका बनाएं'
            )}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-yellow-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-yellow-100 to-orange-100">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="h-6 w-6 text-yellow-600" />
              {getTranslation('Personalized Daily Horoscope', 'व्यक्तिगत दैनिक राशिफल')}
            </div>
            <Button 
              onClick={generatePersonalizedHoroscope}
              disabled={isLoading}
              size="sm"
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  {getTranslation('Generating...', 'तैयार हो रहा...')}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {getTranslation('Refresh', 'रीफ्रेश')}
                </>
              )}
            </Button>
          </CardTitle>
          <p className="text-gray-700">
            {getTranslation(
              `Based on your ${kundaliData.enhancedCalculations?.lagna?.signName || 'Unknown'} ascendant and current planetary positions`,
              `आपके ${kundaliData.enhancedCalculations?.lagna?.signName || 'अज्ञात'} लग्न और वर्तमान ग्रह स्थितियों के आधार पर`
            )}
          </p>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                {getTranslation('Generating your personalized horoscope...', 'आपका व्यक्तिगत राशिफल तैयार हो रहा है...')}
              </p>
            </div>
          ) : horoscope ? (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  {getTranslation('Overview', 'सारांश')}
                </TabsTrigger>
                <TabsTrigger value="detailed" className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  {getTranslation('Detailed', 'विस्तृत')}
                </TabsTrigger>
                <TabsTrigger value="lucky" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {getTranslation('Lucky', 'भाग्यशाली')}
                </TabsTrigger>
                <TabsTrigger value="remedies" className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  {getTranslation('Remedies', 'उपाय')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                    <Sun className="h-5 w-5" />
                    {getTranslation("Today's Main Prediction", 'आज की मुख्य भविष्यवाणी')}
                  </h3>
                  <p className="text-yellow-700 leading-relaxed">{horoscope.mainPrediction}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                    <h4 className="font-semibold text-pink-800 mb-2 flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      {getTranslation('Love & Relationships', 'प्रेम और रिश्ते')}
                    </h4>
                    <p className="text-pink-700 text-sm">{horoscope.love}</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      {getTranslation('Career & Work', 'करियर और काम')}
                    </h4>
                    <p className="text-blue-700 text-sm">{horoscope.career}</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      {getTranslation('Health & Wellness', 'स्वास्थ्य और तंदुरुस्ती')}
                    </h4>
                    <p className="text-green-700 text-sm">{horoscope.health}</p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {getTranslation('Finance & Money', 'वित्त और धन')}
                    </h4>
                    <p className="text-purple-700 text-sm">{horoscope.finance}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="detailed" className="space-y-4">
                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200 shadow-md mt-4 mb-6 sm:mt-6 sm:mb-8">
                  <h3 className="font-semibold text-orange-800 mb-3">
                    {getTranslation('Challenges to Watch', 'देखने योग्य चुनौतियां')}
                  </h3>
                  <p className="text-orange-700">{horoscope.challenges}</p>
                </div>

                <div className="bg-teal-50 p-6 rounded-lg border border-teal-200">
                  <h3 className="font-semibold text-teal-800 mb-3">
                    {getTranslation('Auspicious Time', 'शुभ समय')}
                  </h3>
                  <p className="text-teal-700">{horoscope.auspiciousTime}</p>
                </div>
              </TabsContent>

              <TabsContent value="lucky" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-center">
                    <h4 className="font-semibold text-yellow-800 mb-3">
                      {getTranslation('Lucky Numbers', 'भाग्यशाली संख्याएं')}
                    </h4>
                    <div className="flex justify-center gap-2">
                      {horoscope.luckyNumbers.map((num, index) => (
                        <Badge key={index} className="bg-yellow-600 text-white">
                          {num}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 text-center">
                    <h4 className="font-semibold text-indigo-800 mb-3">
                      {getTranslation('Lucky Colors', 'भाग्यशाली रंग')}
                    </h4>
                    <div className="flex justify-center gap-2 flex-wrap">
                      {horoscope.luckyColors.map((color, index) => (
                        <Badge key={index} variant="outline" className="border-indigo-300 text-indigo-700">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 text-center">
                    <h4 className="font-semibold text-emerald-800 mb-3">
                      {getTranslation('Lucky Direction', 'भाग्यशाली दिशा')}
                    </h4>
                    <Badge className="bg-emerald-600 text-white">
                      {horoscope.luckyDirection}
                    </Badge>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="remedies" className="space-y-4">
                <div className="bg-violet-50 p-6 rounded-lg border border-violet-200">
                  <h3 className="font-semibold text-violet-800 mb-4">
                    {getTranslation("Today's Remedies", 'आज के उपाय')}
                  </h3>
                  <ul className="space-y-2">
                    {horoscope.remedies.map((remedy, index) => (
                      <li key={index} className="flex items-center gap-2 text-violet-700">
                        <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
                        {remedy}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-8">
              <Sun className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">
                {getTranslation('Click refresh to generate your personalized horoscope', 'अपना व्यक्तिगत राशिफल बनाने के लिए रीफ्रेश पर क्लिक करें')}
              </p>
              <Button onClick={generatePersonalizedHoroscope} className="bg-yellow-600 hover:bg-yellow-700">
                <Sparkles className="h-4 w-4 mr-2" />
                {getTranslation('Generate Horoscope', 'राशिफल बनाएं')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedDailyHoroscope;
