import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import KarmaAlignmentChart from './KarmaAlignmentChart';
import KarmicReportPDFExport from './KarmicReportPDFExport';
import { 
  Sparkles, 
  Crown, 
  Clock, 
  Target, 
  Heart, 
  TrendingUp,
  Brain,
  Star,
  Calendar,
  BarChart3,
  Download,
  FileText
} from 'lucide-react';

interface KarmicReportCompleteProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

interface PersonalizedKarmicData {
  lagna: string;
  moonNakshatra: string;
  tenthHouseLord: string;
  d10Analysis: string;
  currentDasha: string;
  careerBlocks: string[];
  idealCareers: Array<{role: string, reason: string}>;
  timeline: string;
  remedies: string[];
  weeklyActions: Array<{week: number, action: string, planet: string}>;
  coachMessage: string;
}

const KarmicReportComplete: React.FC<KarmicReportCompleteProps> = ({ kundaliData, language }) => {
  const [personalizedData, setPersonalizedData] = useState<PersonalizedKarmicData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiRetryCount, setAiRetryCount] = useState(0);
  const { toast } = useToast();

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  // Create a cache key for this specific kundali data
  const getCacheKey = () => {
    if (!kundaliData?.birthData) return null;
    const { fullName, dateOfBirth, timeOfBirth, placeOfBirth } = kundaliData.birthData;
    return `karmic_report_${fullName}_${dateOfBirth}_${timeOfBirth}_${placeOfBirth}_${language}`;
  };

  // Check if we have cached data
  const getCachedData = () => {
    const cacheKey = getCacheKey();
    if (!cacheKey) return null;
    
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsedData = JSON.parse(cached);
        // Check if cache is less than 24 hours old
        const cacheTime = new Date(parsedData.timestamp);
        const now = new Date();
        const hoursDiff = (now.getTime() - cacheTime.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          return parsedData.data;
        } else {
          localStorage.removeItem(cacheKey);
        }
      }
    } catch (error) {
      console.log('Cache read error:', error);
    }
    return null;
  };

  // Save data to cache
  const setCachedData = (data: PersonalizedKarmicData) => {
    const cacheKey = getCacheKey();
    if (!cacheKey) return;
    
    try {
      const cacheData = {
        data,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.log('Cache write error:', error);
    }
  };

  // Extract personalized data from actual Kundali
  const extractPersonalizedData = (): PersonalizedKarmicData => {
    const planets = kundaliData?.enhancedCalculations?.planets || {};
    const houses = kundaliData?.enhancedCalculations?.houses || [];
    const lagna = kundaliData?.enhancedCalculations?.lagna?.signName || 'Unknown';
    const moonNakshatra = planets?.MO?.nakshatraName || 'Unknown';
    const dashas = kundaliData?.enhancedCalculations?.dashas || [];
    const currentDasha = dashas.find((d: any) => d.isActive);

    // Get 10th house analysis with proper type checking
    const tenthHouse = houses.find((h: any) => h.number === 10);
    const planetsInTenth = Object.entries(planets).filter(([_, data]: [string, any]) => data?.house === 10);
    
    // Fix the rashiName access with proper type checking
    let tenthHouseLord = 'Unknown';
    if (planetsInTenth.length > 0) {
      const planetData = planetsInTenth[0][1] as any;
      tenthHouseLord = `${planetsInTenth[0][0]} in ${planetData?.rashiName || 'Unknown'}`;
    } else if (tenthHouse && typeof tenthHouse === 'object' && tenthHouse !== null) {
      const houseObj = tenthHouse as Record<string, any>;
      if ('rashiName' in houseObj && typeof houseObj.rashiName === 'string') {
        tenthHouseLord = houseObj.rashiName;
      }
    }

    // Analyze planetary strengths for D10 with proper type checking
    const strongPlanets = Object.entries(planets)
      .filter(([_, data]: [string, any]) => {
        const shadbala = data?.shadbala;
        return typeof shadbala === 'number' && shadbala > 60;
      })
      .map(([name, _]) => name);
    
    const weakPlanets = Object.entries(planets)
      .filter(([_, data]: [string, any]) => {
        const shadbala = data?.shadbala;
        return typeof shadbala === 'number' && shadbala < 40;
      })
      .map(([name, _]) => name);

    // Generate career blocks based on actual planetary positions
    const careerBlocks = [];
    const saturnShadbala = planets?.SA?.shadbala;
    if (planets?.SA?.isDebilitated || (typeof saturnShadbala === 'number' && saturnShadbala < 50)) {
      careerBlocks.push(language === 'hi' ? 
        'शनि कमजोर → धीमी करियर प्रगति और संघर्ष' : 
        'Weak Saturn → Slow career progress and struggles');
    }
    if (planets?.RA?.house === 6 || planets?.RA?.house === 8) {
      careerBlocks.push(language === 'hi' ? 
        'राहु 6/8 घर में → अधिक काम और छुपे हुए शत्रु' : 
        'Rahu in 6th/8th → Overwork and hidden enemies');
    }
    if (currentDasha?.planet === 'Saturn' || currentDasha?.planet === 'SA') {
      careerBlocks.push(language === 'hi' ? 
        'शनि दशा → धैर्य की परीक्षा और विलंबित परिणाम' : 
        'Saturn Dasha → Test of patience and delayed results');
    }

    // Generate ideal careers based on strong planets
    const idealCareers = [];
    if (strongPlanets.includes('JU') && strongPlanets.includes('ME')) {
      idealCareers.push({
        role: language === 'hi' ? 'शिक्षक/सलाहकार' : 'Teacher/Consultant',
        reason: language === 'hi' ? 'बृहस्पति + बुध → ज्ञान और संचार' : 'Jupiter + Mercury → Knowledge and communication'
      });
    }
    
    // Fix the tenthHouse access for Mars career check
    const tenthHouseRashi = tenthHouse && typeof tenthHouse === 'object' && tenthHouse !== null 
      ? (tenthHouse as Record<string, any>).rashiName 
      : null;
    
    if (strongPlanets.includes('MA') && (tenthHouseRashi === 'Aries' || tenthHouseRashi === 'Scorpio')) {
      idealCareers.push({
        role: language === 'hi' ? 'इंजीनियर/तकनीशियन' : 'Engineer/Technician',
        reason: language === 'hi' ? 'मंगल प्रभावी → तकनीकी और निष्पादन कौशल' : 'Strong Mars → Technical and execution skills'
      });
    }
    if (strongPlanets.includes('VE') && strongPlanets.includes('ME')) {
      idealCareers.push({
        role: language === 'hi' ? 'डिजाइनर/कलाकार' : 'Designer/Artist',
        reason: language === 'hi' ? 'शुक्र + बुध → रचनात्मकता और सौंदर्य' : 'Venus + Mercury → Creativity and aesthetics'
      });
    }

    // Default careers if none match
    if (idealCareers.length === 0) {
      idealCareers.push({
        role: language === 'hi' ? 'प्रबंधन/व्यवसाय' : 'Management/Business',
        reason: language === 'hi' ? 'लग्न आधारित → नेतृत्व क्षमता' : 'Lagna based → Leadership ability'
      });
    }

    // Timeline based on current dasha
    const timelineYear = new Date().getFullYear();
    const timeline = currentDasha ? 
      (language === 'hi' ? 
        `${timelineYear}-${timelineYear + 2}: ${currentDasha.planet} दशा → ${currentDasha.planet === 'Saturn' || currentDasha.planet === 'SA' ? 'धैर्य और कड़ी मेहनत' : 'नई संभावनाएं'}` :
        `${timelineYear}-${timelineYear + 2}: ${currentDasha.planet} Dasha → ${currentDasha.planet === 'Saturn' || currentDasha.planet === 'SA' ? 'Patience and hard work' : 'New opportunities'}`
      ) : 
      (language === 'hi' ? 
        `${timelineYear}-${timelineYear + 2}: स्थिर प्रगति की अवधि` :
        `${timelineYear}-${timelineYear + 2}: Period of steady progress`
      );

    // Personalized remedies based on weak planets
    const remedies = [];
    const saturnShadbalanum = planets?.SA?.shadbala;
    if (weakPlanets.includes('SA') || (typeof saturnShadbalanum === 'number' && saturnShadbalanum < 50)) {
      remedies.push(language === 'hi' ? 
        '🪔 शनि उपाय: शनिवार को तिल का तेल दान करें, बुजुर्गों की सेवा करें' :
        '🪔 Saturn Remedy: Donate sesame oil on Saturdays, serve elders');
    }
    const jupiterShadbala = planets?.JU?.shadbala;
    if (weakPlanets.includes('JU') || (typeof jupiterShadbala === 'number' && jupiterShadbala < 50)) {
      remedies.push(language === 'hi' ? 
        '🪔 बृहस्पति उपाय: गुरुवार को पीले वस्त्र पहनें, गुरु मंत्र जाप करें' :
        '🪔 Jupiter Remedy: Wear yellow on Thursdays, chant Guru mantras');
    }
    if (weakPlanets.includes('RA')) {
      remedies.push(language === 'hi' ? 
        '🪔 राहु उपाय: अमावस्या पर उपवास, ध्यान और मानसिक शुद्धता' :
        '🪔 Rahu Remedy: Fast on new moon, meditation and mental purity');
    }

    // Default remedy if none specific
    if (remedies.length === 0) {
      remedies.push(language === 'hi' ? 
        '🪔 सामान्य उपाय: नियमित पूजा, दान और सेवा करें' :
        '🪔 General Remedy: Regular worship, charity and service');
    }

    // Personalized weekly actions based on planetary positions
    const weeklyActions = [
      {
        week: 1,
        action: weakPlanets.includes('SA') ? 
          (language === 'hi' ? 'मजदूर या गरीब की मदद करें (शनि को खुश करने के लिए)' : 'Help a laborer or poor person (to please Saturn)') :
          (language === 'hi' ? 'अपने कौशल को बेहतर बनाने पर काम करें' : 'Work on improving your skills'),
        planet: language === 'hi' ? 'शनि' : 'Saturn'
      },
      {
        week: 2,
        action: weakPlanets.includes('MO') ? 
          (language === 'hi' ? 'भावनात्मक स्वास्थ्य पर ध्यान दें, ध्यान करें' : 'Focus on emotional health, meditate') :
          (language === 'hi' ? 'परिवार के साथ समय बिताएं' : 'Spend time with family'),
        planet: language === 'hi' ? 'चंद्र' : 'Moon'
      },
      {
        week: 3,
        action: strongPlanets.includes('JU') ? 
          (language === 'hi' ? 'किसी को ज्ञान या कौशल सिखाएं' : 'Teach someone knowledge or skills') :
          (language === 'hi' ? 'आध्यात्मिक अध्ययन करें' : 'Do spiritual study'),
        planet: language === 'hi' ? 'बृहस्पति' : 'Jupiter'
      },
      {
        week: 4,
        action: weakPlanets.includes('RA') ? 
          (language === 'hi' ? 'गपशप और नकारात्मकता से बचें' : 'Avoid gossip and negativity') :
          (language === 'hi' ? 'नेटवर्किंग और नए संपर्क बनाएं' : 'Network and make new connections'),
        planet: language === 'hi' ? 'राहु' : 'Rahu'
      }
    ];

    // Personalized coach message based on chart
    const dominantPlanet = strongPlanets[0] || 'Saturn';
    const coachMessage = language === 'hi' ? 
      `आपके ${dominantPlanet === 'JU' ? 'बृहस्पति' : dominantPlanet === 'SA' ? 'शनि' : dominantPlanet} की शक्ति आपका मार्गदर्शन कर रही है। धैर्य रखें, आपका समय आएगा। 🌟` :
      `Your ${dominantPlanet} energy is guiding your path. Stay patient, your time will come. 🌟`;

    return {
      lagna,
      moonNakshatra,
      tenthHouseLord,
      d10Analysis: `Strong: ${strongPlanets.join(', ') || 'None'}, Weak: ${weakPlanets.join(', ') || 'None'}`,
      currentDasha: currentDasha?.planet || 'Unknown',
      careerBlocks,
      idealCareers,
      timeline,
      remedies,
      weeklyActions,
      coachMessage
    };
  };

  // Auto-generate on component mount
  useEffect(() => {
    if (kundaliData && !personalizedData) {
      // First check cache
      const cachedData = getCachedData();
      if (cachedData) {
        setPersonalizedData(cachedData);
        toast({
          title: getTranslation("Cached Report Loaded", "कैश्ड रिपोर्ट लोड"),
          description: getTranslation("Using previously generated insights", "पहले से तैयार अंतर्दृष्टि का उपयोग")
        });
      } else {
        generatePersonalizedReport();
      }
    }
  }, [kundaliData]);

  // Fix the arithmetic operation by ensuring we only do math on numbers
  const calculateAlignmentPercentage = () => {
    if (!personalizedData || !kundaliData?.enhancedCalculations?.planets) {
      return 62;
    }

    const planetValues = Object.values(kundaliData.enhancedCalculations.planets);
    const validShadbalaValues = planetValues
      .map((planet: any) => typeof planet?.shadbala === 'number' ? planet.shadbala : 50)
      .filter((value): value is number => typeof value === 'number');

    if (validShadbalaValues.length === 0) {
      return 62;
    }

    const averageShadbala = validShadbalaValues.reduce((sum, value) => sum + value, 0) / validShadbalaValues.length;
    return Math.min(95, Math.max(35, Math.round(averageShadbala * 1.2)));
  };

  const karmaData = {
    alignmentPercentage: calculateAlignmentPercentage(),
    grahaEnergies: personalizedData ? [
      {
        name: language === 'hi' ? 'बृहस्पति' : 'Jupiter',
        role: language === 'hi' ? 'धर्म + ज्ञान' : 'Dharma + Wisdom',
        strength: typeof kundaliData?.enhancedCalculations?.planets?.JU?.shadbala === 'number' ? kundaliData.enhancedCalculations.planets.JU.shadbala : 80,
        color: '#F59E0B'
      },
      {
        name: language === 'hi' ? 'शनि' : 'Saturn',
        role: language === 'hi' ? 'अनुशासन + कष्ट' : 'Discipline + Suffering',
        strength: typeof kundaliData?.enhancedCalculations?.planets?.SA?.shadbala === 'number' ? kundaliData.enhancedCalculations.planets.SA.shadbala : 75,
        color: '#6366F1'
      },
      {
        name: language === 'hi' ? 'राहु' : 'Rahu',
        role: language === 'hi' ? 'जुनून + भ्रम' : 'Obsession + Illusion',
        strength: typeof kundaliData?.enhancedCalculations?.planets?.RA?.shadbala === 'number' ? kundaliData.enhancedCalculations.planets.RA.shadbala : 60,
        color: '#8B5CF6'
      },
      {
        name: language === 'hi' ? 'शुक्र' : 'Venus',
        role: language === 'hi' ? 'रचनात्मकता + आकर्षण' : 'Creativity + Charm',
        strength: typeof kundaliData?.enhancedCalculations?.planets?.VE?.shadbala === 'number' ? kundaliData.enhancedCalculations.planets.VE.shadbala : 65,
        color: '#EC4899'
      }
    ] : [],
    dashaTimeline: [],
    weeklyTracker: []
  };

  const generatePersonalizedReport = async () => {
    setIsLoading(true);
    
    try {
      // Extract personalized data from Kundali
      const extracted = extractPersonalizedData();
      
      // Try to get AI enhancement if available with timeout and retries
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('AI timeout')), 10000)
        );
        
        const aiPromise = supabase.functions.invoke('karmic-analysis', {
          body: {
            kundaliData,
            language,
            analysisType: 'personalized_karmic_report',
            extractedData: extracted,
            retryCount: aiRetryCount
          }
        });

        const { data, error } = await Promise.race([aiPromise, timeoutPromise]) as any;

        if (!error && data?.analysis) {
          // Merge AI insights with extracted data
          const enhancedData = {
            ...extracted,
            coachMessage: data.analysis.coachMessage || extracted.coachMessage,
            timeline: data.analysis.karmicTimeline || extracted.timeline
          };
          
          setPersonalizedData(enhancedData);
          setCachedData(enhancedData);
          setAiRetryCount(0); // Reset retry count on success
        } else {
          throw new Error('AI enhancement failed');
        }
      } catch (aiError) {
        console.log('AI enhancement failed, using extracted data:', aiError);
        
        // Increment retry count and use fallback
        setAiRetryCount(prev => prev + 1);
        setPersonalizedData(extracted);
        setCachedData(extracted);
        
        // Show user-friendly message about fallback
        toast({
          title: getTranslation("Report Generated", "रिपोर्ट तैयार"),
          description: getTranslation("Using astrological calculations (AI enhancement unavailable)", "ज्योतिषीय गणना का उपयोग (AI वृद्धि अनुपलब्ध)"),
          variant: "default"
        });
      }
      
      if (!personalizedData) {
        toast({
          title: getTranslation("Personalized Karmic Report Generated", "व्यक्तिगत कर्मिक रिपोर्ट तैयार"),
          description: getTranslation("Your personalized karmic insights are ready", "आपकी व्यक्तिगत कर्मिक अंतर्दृष्टि तैयार है")
        });
      }

    } catch (error) {
      console.error('Error generating personalized karmic report:', error);
      
      // Even on error, try to show extracted data
      const fallbackData = extractPersonalizedData();
      setPersonalizedData(fallbackData);
      setCachedData(fallbackData);
      
      toast({
        title: getTranslation("Report Generated with Limitations", "सीमित रिपोर्ट तैयार"),
        description: getTranslation("Basic karmic insights generated from chart analysis", "चार्ट विश्लेषण से बुनियादी कर्मिक अंतर्दृष्टि"),
        variant: "default"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCache = () => {
    const cacheKey = getCacheKey();
    if (cacheKey) {
      localStorage.removeItem(cacheKey);
      setPersonalizedData(null);
      setAiRetryCount(0);
      toast({
        title: getTranslation("Cache Cleared", "कैश साफ़"),
        description: getTranslation("Report will be regenerated", "रिपोर्ट पुन: तैयार की जाएगी")
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <Card className="w-full border-purple-200 shadow-lg mb-6">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 p-6">
          <div className="flex items-center justify-between flex-col md:flex-row gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-purple-800 text-xl">
                  🪔 {getTranslation('Your Personalized Career Karma Report', 'आपकी व्यक्तिगत करियर कर्म रिपोर्ट')}
                </CardTitle>
                <p className="text-purple-600 text-sm mt-1">
                  {getTranslation('Generated by Ayu Astro · Powered by Jyotish + NLP + Gemini AI', 'आयु एस्ट्रो द्वारा उत्पन्न · ज्योतिष + NLP + जेमिनी AI द्वारा संचालित')}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {!personalizedData && (
                <Button 
                  onClick={generatePersonalizedReport}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                >
                  {isLoading ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      {getTranslation('Generating...', 'बनाया जा रहा है...')}
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      {getTranslation('Generate Report', 'रिपोर्ट बनाएं')}
                    </>
                  )}
                </Button>
              )}
              {personalizedData && (
                <>
                  <Button 
                    onClick={clearCache}
                    variant="outline"
                    className="border-purple-500 text-purple-600 hover:bg-purple-50"
                  >
                    {getTranslation('Refresh Report', 'रिपोर्ट रीफ्रेश करें')}
                  </Button>
                  <KarmicReportPDFExport 
                    language={language}
                    reportData={personalizedData}
                  />
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {!personalizedData ? (
        <div className="text-center py-12">
          <Sparkles className="h-16 w-16 text-purple-300 mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {getTranslation('Analyzing Your Birth Chart...', 'आपकी जन्म कुंडली का विश्लेषण...')}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {getTranslation(
              'Creating personalized insights based on your planetary positions and karmic patterns',
              'आपकी ग्रहों की स्थिति और कर्मिक पैटर्न के आधार पर व्यक्तिगत अंतर्दृष्टि तैयार की जा रही है'
            )}
          </p>
          {aiRetryCount > 0 && (
            <p className="text-orange-600 text-sm mt-2">
              {getTranslation(
                `AI retry attempt ${aiRetryCount}/3 - Using backup analysis`,
                `AI पुनः प्रयास ${aiRetryCount}/3 - बैकअप विश्लेषण का उपयोग`
              )}
            </p>
          )}
        </div>
      ) : (
        <div id="karmic-report-content" className="space-y-6 print:space-y-4">
          {/* Section 1: Personalized Career Signature */}
          <Card className="border-orange-200" id="career-signature">
            <CardHeader className="bg-orange-50">
              <CardTitle className="text-orange-800 flex items-center gap-2">
                <Crown className="h-5 w-5" />
                {getTranslation('1. Your Karmic Career Signature', '1. आपका कर्मिक करियर हस्ताक्षर')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">{getTranslation('Lagna', 'लग्न')}:</span>
                    <span className="text-orange-700">{personalizedData.lagna}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">{getTranslation('Moon Nakshatra', 'चंद्र नक्षत्र')}:</span>
                    <span className="text-orange-700">{personalizedData.moonNakshatra}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">{getTranslation('10th House', '10वां घर')}:</span>
                    <span className="text-orange-700">{personalizedData.tenthHouseLord}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">{getTranslation('Current Dasha', 'वर्तमान दशा')}:</span>
                    <span className="text-orange-700">{personalizedData.currentDasha}</span>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">{getTranslation('Planetary Analysis', 'ग्रहीय विश्लेषण')}:</p>
                <p className="text-gray-700 font-medium">{personalizedData.d10Analysis}</p>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Personalized Career Blocks */}
          <Card className="border-red-200" id="career-blocks">
            <CardHeader className="bg-red-50">
              <CardTitle className="text-red-800 flex items-center gap-2">
                <Target className="h-5 w-5" />
                {getTranslation('2. Your Current Career Challenges', '2. आपकी वर्तमान करियर चुनौतियां')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {personalizedData.careerBlocks.length > 0 ? (
                <ul className="space-y-3">
                  {personalizedData.careerBlocks.map((block, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-red-600 mt-1">•</span>
                      <span className="text-gray-700">{block}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700 italic">
                  {getTranslation('No major career blocks detected in your chart', 'आपकी कुंडली में कोई बड़ी करियर बाधा नहीं मिली')}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Section 3: Personalized Career Suggestions */}
          <Card className="border-green-200" id="ideal-careers">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Target className="h-5 w-5" />
                {getTranslation('3. Your Ideal Career Path', '3. आपका आदर्श करियर पथ')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {personalizedData.idealCareers.map((career, index) => (
                  <div key={index} className="border-l-4 border-green-400 pl-4">
                    <h4 className="font-semibold text-green-800">{career.role}</h4>
                    <p className="text-gray-600 text-sm">{career.reason}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Personalized Timeline */}
          <Card className="border-blue-200" id="karmic-timeline">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {getTranslation('4. Your Career Timeline', '4. आपकी करियर समयरेखा')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700 font-medium">{personalizedData.timeline}</p>
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Karma Alignment */}
          <Card className="border-purple-200" id="karma-alignment">
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-purple-800 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {getTranslation('5. Karma Alignment', '5. कर्म संरेखण')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <KarmaAlignmentChart 
                {...karmaData}
                language={language}
              />
            </CardContent>
          </Card>

          {/* Section 6: Personalized Weekly Actions */}
          <Card className="border-indigo-200" id="weekly-actions">
            <CardHeader className="bg-indigo-50">
              <CardTitle className="text-indigo-800 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {getTranslation('6. Your Weekly Karma Actions', '6. आपके साप्ताहिक कर्म कार्य')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4">
                {personalizedData.weeklyActions.map((action, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-indigo-50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-indigo-800">
                        {getTranslation(`Week ${action.week}`, `सप्ताह ${action.week}`)}
                      </span>
                      <Badge variant="outline" className="text-indigo-600">
                        {action.planet}
                      </Badge>
                    </div>
                    <p className="text-gray-700">{action.action}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Section 7: Personalized Coach Message */}
          <Card className="border-yellow-200" id="coach-message">
            <CardHeader className="bg-yellow-50">
              <CardTitle className="text-yellow-800 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                {getTranslation('7. Message from Your Karmic Coach', '7. आपके कर्मिक कोच का संदेश')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <blockquote className="border-l-4 border-yellow-400 pl-4 italic text-lg text-gray-700 bg-yellow-50 p-4 rounded-r-lg">
                "{personalizedData.coachMessage}"
              </blockquote>
            </CardContent>
          </Card>

          {/* Section 8: Personalized Remedies */}
          <Card className="border-emerald-200" id="remedies">
            <CardHeader className="bg-emerald-50">
              <CardTitle className="text-emerald-800 flex items-center gap-2">
                <Star className="h-5 w-5" />
                {getTranslation('8. Your Karmic Remedies', '8. आपके कर्मिक उपचार')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {personalizedData.remedies.map((remedy, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                    <span className="text-emerald-600 mt-1">•</span>
                    <span className="text-gray-700">{remedy}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <Card className="border-gray-200" id="footer">
            <CardContent className="p-6 text-center">
              <p className="text-gray-600 mb-2">
                {getTranslation('Generated by Ayu Astro · Powered by Swiss Ephemeris + Gemini AI', 'आयु एस्ट्रो द्वारा उत्पन्न · स्विस एफेमेरिस + जेमिनी AI द्वारा संचालित')}
              </p>
              <p className="text-gray-500 italic">
                {getTranslation('Your karmic path is sacred. Let it guide, not restrict you.', 'आपका कर्मिक पथ पवित्र है। इसे मार्गदर्शन दें, प्रतिबंधित न करें।')}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default KarmicReportComplete;
