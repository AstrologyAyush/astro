import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Compass, Target, Clock, Zap, Shield, TrendingUp, AlertTriangle, CheckCircle, Star, Crown, Info, Lightbulb } from 'lucide-react';

interface DharmaAlignmentAnalysisProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const DharmaAlignmentAnalysis: React.FC<DharmaAlignmentAnalysisProps> = ({ kundaliData, language }) => {
  const [dharmaScore, setDharmaScore] = useState(0);
  const [karmaBlocks, setKarmaBlocks] = useState<any[]>([]);
  const [idealPaths, setIdealPaths] = useState<any[]>([]);
  const [tenthHouseAnalysis, setTenthHouseAnalysis] = useState<any>({});
  const [d10Analysis, setD10Analysis] = useState<any>({});
  const [dashaAlignment, setDashaAlignment] = useState<any>({});

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  useEffect(() => {
    analyzeDharmaAlignment();
  }, [kundaliData]);

  const analyzeDharmaAlignment = () => {
    // Extract actual Kundali data with proper null checking
    const planets = kundaliData?.enhancedCalculations?.planets || kundaliData?.planets || {};
    const houses = kundaliData?.enhancedCalculations?.houses || [];
    const lagna = kundaliData?.enhancedCalculations?.lagna || {};
    const dashas = kundaliData?.enhancedCalculations?.dashas || [];
    
    // Analyze 10th house with real data
    const tenthHouse = houses.find(h => h.number === 10) || {};
    const planetsInTenth = Object.entries(planets).filter(([_, data]: [string, any]) => data?.house === 10);
    const tenthHouseLord = getTenthHouseLord(tenthHouse);
    
    // Analyze current dasha with real data
    const currentDasha = dashas.find(d => d.isActive) || {};
    
    // Calculate dharma alignment score based on actual planetary positions
    const score = calculateRealDharmaScore(tenthHouse, currentDasha, planets, lagna);
    setDharmaScore(score);

    // Generate real 10th house analysis based on actual data
    const realPlanetsInTenth = planetsInTenth.map(([name, _]) => name);
    setTenthHouseAnalysis({
      sign: tenthHouse.signName || lagna.signName || 'Unknown',
      lord: tenthHouseLord,
      planetsInHouse: realPlanetsInTenth,
      strength: calculateRealHouseStrength(tenthHouse, planetsInTenth, planets),
      career_potential: getRealCareerPotential(planetsInTenth, planets),
      dharma_indicators: getRealDharmaIndicators(planets, lagna)
    });

    // Generate D10 chart analysis
    setD10Analysis({
      key_insights: [
        getTranslation('Strong leadership potential in professional sphere', 'व्यावसायिक क्षेत्र में मजबूत नेतृत्व क्षमता'),
        getTranslation('Natural inclination towards service-oriented careers', 'सेवा-उन्मुख करियर की प्राकृतिक प्रवृत्ति'),
        getTranslation('Success through consistent effort and discipline', 'निरंतर प्रयास और अनुशासन से सफलता')
      ],
      career_timing: getCareerTiming(currentDasha),
      professional_strengths: getProfessionalStrengths(tenthHouse)
    });

    // Generate dasha alignment
    setDashaAlignment({
      current_dasha: currentDasha.planet || 'Unknown',
      alignment_level: getDashaAlignment(currentDasha, tenthHouse),
      upcoming_opportunities: getUpcomingOpportunities(currentDasha),
      period_focus: getPeriodFocus(currentDasha)
    });

    // Generate karma blocks
    setKarmaBlocks([
      {
        id: 'authority_resistance',
        title: getTranslation('Resistance to Authority', 'अधिकार का विरोध'),
        description: getTranslation('Tendency to resist established systems may block career growth', 'स्थापित प्रणालियों का विरोध करने की प्रवृत्ति करियर की वृद्धि को रोक सकती है'),
        severity: 'medium',
        remedy: getTranslation('Practice humility and learn from mentors', 'विनम्रता का अभ्यास करें और गुरुओं से सीखें'),
        planetary_cause: 'Saturn-Mars aspect'
      },
      {
        id: 'perfectionism',
        title: getTranslation('Perfectionism Block', 'पूर्णतावाद अवरोध'),
        description: getTranslation('Excessive perfectionism causing delays in career decisions', 'अत्यधिक पूर्णतावाद करियर निर्णयों में देरी का कारण बन रहा है'),
        severity: 'low',
        remedy: getTranslation('Accept good enough and take action', 'पर्याप्त को स्वीकार करें और कार्य करें'),
        planetary_cause: 'Mercury-Venus conjunction'
      }
    ]);

    // Generate ideal paths
    setIdealPaths([
      {
        id: 'leadership_path',
        title: getTranslation('Leadership & Management', 'नेतृत्व और प्रबंधन'),
        description: getTranslation('Natural leadership abilities suggest management roles', 'प्राकृतिक नेतृत्व क्षमताएं प्रबंधन भूमिकाओं का सुझाव देती हैं'),
        alignment_score: 85,
        timing: getTranslation('Next 2-3 years favorable', 'अगले 2-3 साल अनुकूल'),
        action_steps: [
          getTranslation('Develop team management skills', 'टीम प्रबंधन कौशल विकसित करें'),
          getTranslation('Seek mentorship from senior leaders', 'वरिष्ठ नेताओं से मार्गदर्शन लें'),
          getTranslation('Take on project leadership roles', 'परियोजना नेतृत्व भूमिकाएं लें')
        ]
      },
      {
        id: 'service_path',
        title: getTranslation('Social Service & NGO Work', 'सामाजिक सेवा और एनजीओ कार्य'),
        description: getTranslation('Strong dharmic alignment through service to society', 'समाज की सेवा के माध्यम से मजबूत धार्मिक संरेखण'),
        alignment_score: 92,
        timing: getTranslation('Immediate potential', 'तत्काल संभावना'),
        action_steps: [
          getTranslation('Start with volunteer work', 'स्वयंसेवी कार्य से शुरुआत करें'),
          getTranslation('Identify causes you are passionate about', 'उन कारणों की पहचान करें जिनके बारे में आप भावुक हैं'),
          getTranslation('Build network in social sector', 'सामाजिक क्षेत्र में नेटवर्क बनाएं')
        ]
      }
    ]);
  };

  const calculateRealDharmaScore = (tenthHouse: any, currentDasha: any, planets: any, lagna: any) => {
    let score = 50; // Base score
    
    // Real planetary strength analysis
    const jupiterStrength = planets?.JU?.shadbala || planets?.Jupiter?.shadbala || 50;
    const sunStrength = planets?.SU?.shadbala || planets?.Sun?.shadbala || 50;
    const saturnStrength = planets?.SA?.shadbala || planets?.Saturn?.shadbala || 50;
    const marsStrength = planets?.MA?.shadbala || planets?.Mars?.shadbala || 50;
    
    // Adjust score based on actual planetary strengths
    if (jupiterStrength > 70) score += 20; // Strong Jupiter = dharmic alignment
    else if (jupiterStrength < 40) score -= 10;
    
    if (sunStrength > 70) score += 15; // Strong Sun = leadership dharma
    else if (sunStrength < 40) score -= 8;
    
    // 10th house lord strength
    const tenthLordPlanet = Object.values(planets).find((p: any) => p?.house === 10);
    if (tenthLordPlanet && typeof (tenthLordPlanet as any)?.shadbala === 'number' && (tenthLordPlanet as any).shadbala > 60) score += 12;
    
    // Current dasha alignment with actual data
    if (currentDasha?.planet) {
      const dashaPlanet = planets[currentDasha.planet] || planets[currentDasha.planet.toUpperCase()];
      if (dashaPlanet?.shadbala > 60) score += 15;
      else if (dashaPlanet?.shadbala < 40) score -= 10;
    }
    
    // Lagna lord strength for overall life direction
    if (lagna?.signName) {
      const lagnaLordStrength = getLagnaLordStrength(lagna.signName, planets);
      if (lagnaLordStrength > 60) score += 10;
      else if (lagnaLordStrength < 40) score -= 8;
    }
    
    // Malefic influences with real data
    if (saturnStrength < 30) score -= 12; // Very weak Saturn = discipline issues
    if (marsStrength < 30) score -= 8; // Very weak Mars = execution issues
    
    return Math.min(95, Math.max(25, score));
  };
  
  const getLagnaLordStrength = (lagnaSign: string, planets: any) => {
    const signLords: { [key: string]: string } = {
      'Aries': 'MA', 'Taurus': 'VE', 'Gemini': 'ME', 'Cancer': 'MO',
      'Leo': 'SU', 'Virgo': 'ME', 'Libra': 'VE', 'Scorpio': 'MA',
      'Sagittarius': 'JU', 'Capricorn': 'SA', 'Aquarius': 'SA', 'Pisces': 'JU'
    };
    const lordPlanet = signLords[lagnaSign];
    return planets[lordPlanet]?.shadbala || 50;
  };

  const getTenthHouseLord = (tenthHouse: any) => {
    // Simplified logic for demonstration
    const signLords: { [key: string]: string } = {
      'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury', 'Cancer': 'Moon',
      'Leo': 'Sun', 'Virgo': 'Mercury', 'Libra': 'Venus', 'Scorpio': 'Mars',
      'Sagittarius': 'Jupiter', 'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
    };
    return signLords[tenthHouse.signName] || 'Unknown';
  };

  const calculateRealHouseStrength = (house: any, planetsInTenth: any[], planets: any) => {
    let strength = 40; // Base strength
    
    // Add strength based on actual planets in 10th house
    planetsInTenth.forEach(([planetName, planetData]) => {
      const shadbala = planetData?.shadbala || 50;
      if (shadbala > 70) strength += 15;
      else if (shadbala > 50) strength += 10;
      else if (shadbala < 30) strength -= 10;
      
      // Benefic vs malefic consideration
      if (['JU', 'VE', 'ME'].includes(planetName)) strength += 8; // Natural benefics
      if (['SA', 'MA'].includes(planetName)) strength -= 5; // Natural malefics (can be good for 10th house)
      if (['RA', 'KE'].includes(planetName)) strength -= 8; // Nodes
    });
    
    return Math.min(95, Math.max(20, strength));
  };

  const getRealCareerPotential = (planetsInTenth: any[], planets: any) => {
    const potentials = [];
    
    // Analyze actual planets in 10th house for career potential
    planetsInTenth.forEach(([planetName, planetData]) => {
      switch(planetName) {
        case 'SU': case 'Sun':
          potentials.push(getTranslation('Government leadership roles', 'सरकारी नेतृत्व भूमिकाएं'));
          break;
        case 'JU': case 'Jupiter':
          potentials.push(getTranslation('Teaching, counseling, advisory roles', 'शिक्षण, परामर्श, सलाहकार भूमिकाएं'));
          break;
        case 'SA': case 'Saturn':
          potentials.push(getTranslation('Long-term institutional work', 'दीर्घकालिक संस्थागत कार्य'));
          break;
        case 'MA': case 'Mars':
          potentials.push(getTranslation('Engineering, military, sports', 'इंजीनियरिंग, सैन्य, खेल'));
          break;
        case 'VE': case 'Venus':
          potentials.push(getTranslation('Arts, entertainment, luxury goods', 'कला, मनोरंजन, लक्जरी सामान'));
          break;
        case 'ME': case 'Mercury':
          potentials.push(getTranslation('Communication, writing, technology', 'संचार, लेखन, प्रौद्योगिकी'));
          break;
      }
    });
    
    // If no specific planets, give general potential
    if (potentials.length === 0) {
      potentials.push(
        getTranslation('General management and administration', 'सामान्य प्रबंधन और प्रशासन'),
        getTranslation('Public service opportunities', 'लोक सेवा के अवसर')
      );
    }
    
    return potentials.slice(0, 4);
  };

  const getRealDharmaIndicators = (planets: any, lagna: any) => {
    const indicators = [];
    
    // Jupiter strength indicates dharmic alignment
    const jupiterStrength = planets?.JU?.shadbala || planets?.Jupiter?.shadbala || 50;
    if (jupiterStrength > 60) {
      indicators.push(getTranslation('Strong spiritual wisdom and guidance ability', 'मजबूत आध्यात्मिक बुद्धि और मार्गदर्शन क्षमता'));
    }
    
    // Sun strength indicates leadership dharma
    const sunStrength = planets?.SU?.shadbala || planets?.Sun?.shadbala || 50;
    if (sunStrength > 60) {
      indicators.push(getTranslation('Natural leadership and authority', 'प्राकृतिक नेतृत्व और अधिकार'));
    }
    
    // Moon strength indicates emotional dharma
    const moonStrength = planets?.MO?.shadbala || planets?.Moon?.shadbala || 50;
    if (moonStrength > 60) {
      indicators.push(getTranslation('Nurturing and caring for others', 'दूसरों का पोषण और देखभाल'));
    }
    
    // Venus strength indicates harmony dharma
    const venusStrength = planets?.VE?.shadbala || planets?.Venus?.shadbala || 50;
    if (venusStrength > 60) {
      indicators.push(getTranslation('Creating beauty and harmony in society', 'समाज में सुंदरता और सामंजस्य निर्माण'));
    }
    
    // If no strong indicators, provide general dharmic qualities
    if (indicators.length === 0) {
      indicators.push(
        getTranslation('Service to community and society', 'समुदाय और समाज की सेवा'),
        getTranslation('Ethical decision making', 'नैतिक निर्णय लेना'),
        getTranslation('Truthfulness and integrity', 'सत्यता और ईमानदारी')
      );
    }
    
    return indicators.slice(0, 3);
  };

  const getCareerTiming = (dasha: any) => {
    return {
      current_period: getTranslation('Favorable for career growth', 'करियर विकास के लिए अनुकूल'),
      peak_period: getTranslation('Next 3-5 years', 'अगले 3-5 साल'),
      caution_period: getTranslation('Avoid major changes in next 6 months', 'अगले 6 महीनों में बड़े बदलावों से बचें')
    };
  };

  const getProfessionalStrengths = (tenthHouse: any) => {
    return [
      getTranslation('Natural leadership qualities', 'प्राकृतिक नेतृत्व गुण'),
      getTranslation('Strong work ethic', 'मजबूत कार्य नैतिकता'),
      getTranslation('Ability to inspire others', 'दूसरों को प्रेरित करने की क्षमता')
    ];
  };

  const getDashaAlignment = (dasha: any, tenthHouse: any) => {
    // Simplified alignment calculation
    const favorablePlanets = ['Jupiter', 'Sun', 'Venus', 'Mercury'];
    if (favorablePlanets.includes(dasha.planet)) return 'High';
    return 'Medium';
  };

  const getUpcomingOpportunities = (dasha: any) => {
    return [
      getTranslation('Leadership role opportunities', 'नेतृत्व भूमिका के अवसर'),
      getTranslation('Professional recognition', 'व्यावसायिक मान्यता'),
      getTranslation('Career advancement', 'करियर में प्रगति')
    ];
  };

  const getPeriodFocus = (dasha: any) => {
    return getTranslation('Focus on building professional networks and taking calculated risks', 'पेशेवर नेटवर्क बनाने और गणनाकृत जोखिम लेने पर ध्यान दें');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlignmentColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDharmaScoreExplanation = () => {
    if (dharmaScore >= 80) {
      return {
        title: getTranslation('Excellent Alignment', 'उत्कृष्ट संरेखण'),
        description: getTranslation(
          'Your actions are strongly aligned with your life purpose. You are on the right track.',
          'आपके कार्य आपके जीवन उद्देश्य से दृढ़ता से मेल खाते हैं। आप सही राह पर हैं।'
        ),
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    } else if (dharmaScore >= 60) {
      return {
        title: getTranslation('Good Alignment', 'अच्छा संरेखण'),
        description: getTranslation(
          'You are mostly aligned with your dharma. Some adjustments can improve your path.',
          'आप अपने धर्म के साथ मुख्यतः संरेखित हैं। कुछ समायोजन आपके पथ में सुधार ला सकते हैं।'
        ),
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      };
    } else {
      return {
        title: getTranslation('Needs Improvement', 'सुधार की आवश्यकता'),
        description: getTranslation(
          'Your current path may not fully align with your dharma. Consider exploring new directions.',
          'आपका वर्तमान पथ आपके धर्म से पूर्णतः मेल नहीं खा सकता। नई दिशाओं की खोज पर विचार करें।'
        ),
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Dharma Score Explanation Card */}
      <Card className="border-indigo-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-100 to-purple-100">
          <CardTitle className="text-indigo-800 flex items-center gap-3">
            <div className="p-2 bg-indigo-500 rounded-full">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            {getTranslation('Understanding Your Dharma Alignment Score', 'अपने धर्म संरेखण स्कोर को समझना')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">
                {getTranslation('What is Dharma Alignment?', 'धर्म संरेखण क्या है?')}
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                {getTranslation(
                  'Dharma Alignment measures how well your current life actions and career choices align with your cosmic purpose and soul\'s mission. It considers your planetary positions, current dasha period, and karmic patterns.',
                  'धर्म संरेखण मापता है कि आपके वर्तमान जीवन कार्य और करियर विकल्प आपके ब्रह्मांडीय उद्देश्य और आत्मा के मिशन से कितनी अच्छी तरह मेल खाते हैं। यह आपकी ग्रहीय स्थितियों, वर्तमान दशा काल और कर्मिक पैटर्न पर विचार करता है।'
                )}
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    {getTranslation('80-100%: Excellent Alignment', '80-100%: उत्कृष्ट संरेखण')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    {getTranslation('60-79%: Good Alignment', '60-79%: अच्छा संरेखण')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    {getTranslation('Below 60%: Needs Improvement', '60% से कम: सुधार की आवश्यकता')}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">
                {getTranslation('How to Improve Your Score', 'अपना स्कोर कैसे सुधारें')}
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  {getTranslation('Follow the suggested ideal paths below', 'नीचे सुझाए गए आदर्श पथों का पालन करें')}
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  {getTranslation('Address karma blocks through remedies', 'उपायों के माध्यम से कर्म अवरोधों को संबोधित करें')}
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  {getTranslation('Align career choices with planetary periods', 'ग्रहीय कालों के साथ करियर विकल्पों को संरेखित करें')}
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  {getTranslation('Practice meditation and self-reflection', 'ध्यान और आत्म-चिंतन का अभ्यास करें')}
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dharma Alignment Overview */}
      <Card className="border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100">
          <CardTitle className="text-purple-800 flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-full">
              <Compass className="h-5 w-5 text-white" />
            </div>
            {getTranslation('Dharma Alignment Analysis', 'धर्म संरेखण विश्लेषण')}
          </CardTitle>
          <p className="text-sm text-purple-600">
            {getTranslation('Current alignment between your life path and cosmic purpose', 'आपके जीवन पथ और ब्रह्मांडीय उद्देश्य के बीच वर्तमान संरेखण')}
          </p>
        </CardHeader>
        <CardContent className="p-6">
          {/* Current Score Status */}
          <div className="mb-6">
            <Alert className={`${getDharmaScoreExplanation().bgColor} ${getDharmaScoreExplanation().borderColor}`}>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`font-semibold ${getDharmaScoreExplanation().color}`}>
                    {getDharmaScoreExplanation().title}
                  </span>
                  <Badge variant="outline" className={getDharmaScoreExplanation().color}>
                    {dharmaScore}%
                  </Badge>
                </div>
                <p className="text-sm">{getDharmaScoreExplanation().description}</p>
              </AlertDescription>
            </Alert>
          </div>

          {/* Mobile Responsive Cards with Carousel */}
          <div className="block md:hidden">
            <Carousel className="w-full">
              <CarouselContent>
                {/* Dharma Score Card */}
                <CarouselItem>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 mx-2">
                    <div className="text-4xl font-bold mb-2" style={{ color: getAlignmentColor(dharmaScore) }}>
                      {dharmaScore}%
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      {getTranslation('Dharma Alignment Score', 'धर्म संरेखण स्कोर')}
                    </div>
                    <Progress value={dharmaScore} className="h-2" />
                  </div>
                </CarouselItem>

                {/* Current Dasha Card */}
                <CarouselItem>
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 mx-2">
                    <div className="text-2xl font-bold text-blue-700 mb-2">
                      {dashaAlignment.current_dasha}
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      {getTranslation('Current Mahadasha', 'वर्तमान महादशा')}
                    </div>
                    <Badge className={`${dashaAlignment.alignment_level === 'High' ? 'bg-green-600' : 'bg-yellow-600'} text-white`}>
                      {dashaAlignment.alignment_level} {getTranslation('Alignment', 'संरेखण')}
                    </Badge>
                  </div>
                </CarouselItem>

                {/* 10th House Strength Card */}
                <CarouselItem>
                  <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200 mx-2">
                    <div className="text-3xl font-bold text-orange-700 mb-2">
                      {tenthHouseAnalysis.strength || 0}%
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      {getTranslation('10th House Strength', '10वें भाव की शक्ति')}
                    </div>
                    <Badge variant="outline" className="border-orange-300 text-orange-700">
                      {tenthHouseAnalysis.sign} {getTranslation('Sign', 'राशि')}
                    </Badge>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>

          {/* Desktop Grid Layout */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dharma Score */}
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
              <div className="text-4xl font-bold mb-2" style={{ color: getAlignmentColor(dharmaScore) }}>
                {dharmaScore}%
              </div>
              <div className="text-sm text-gray-600 mb-3">
                {getTranslation('Dharma Alignment Score', 'धर्म संरेखण स्कोर')}
              </div>
              <Progress value={dharmaScore} className="h-2" />
            </div>

            {/* Current Dasha */}
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <div className="text-2xl font-bold text-blue-700 mb-2">
                {dashaAlignment.current_dasha}
              </div>
              <div className="text-sm text-gray-600 mb-3">
                {getTranslation('Current Mahadasha', 'वर्तमान महादशा')}
              </div>
              <Badge className={`${dashaAlignment.alignment_level === 'High' ? 'bg-green-600' : 'bg-yellow-600'} text-white`}>
                {dashaAlignment.alignment_level} {getTranslation('Alignment', 'संरेखण')}
              </Badge>
            </div>

            {/* 10th House Strength */}
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200 md:col-span-2 lg:col-span-1">
              <div className="text-3xl font-bold text-orange-700 mb-2">
                {tenthHouseAnalysis.strength || 0}%
              </div>
              <div className="text-sm text-gray-600 mb-3">
                {getTranslation('10th House Strength', '10वें भाव की शक्ति')}
              </div>
              <Badge variant="outline" className="border-orange-300 text-orange-700">
                {tenthHouseAnalysis.sign} {getTranslation('Sign', 'राशि')}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analysis">{getTranslation('Analysis', 'विश्लेषण')}</TabsTrigger>
          <TabsTrigger value="blocks">{getTranslation('Karma', 'कर्म')}</TabsTrigger>
          <TabsTrigger value="paths">{getTranslation('Ideal Paths', 'आदर्श पथ')}</TabsTrigger>
          <TabsTrigger value="timing">{getTranslation('Timing', 'समय')}</TabsTrigger>
        </TabsList>

        {/* Detailed Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 10th House Analysis */}
            <Card className="border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-cyan-100">
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  {getTranslation('10th House Analysis', '10वें भाव का विश्लेषण')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">
                    {getTranslation('Career Potential', 'करियर क्षमता')}
                  </h4>
                  <ul className="space-y-1">
                    {tenthHouseAnalysis.career_potential?.map((potential: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Star className="h-3 w-3 text-blue-600" />
                        {potential}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">
                    {getTranslation('Dharma Indicators', 'धर्म संकेतक')}
                  </h4>
                  <ul className="space-y-1">
                    {tenthHouseAnalysis.dharma_indicators?.map((indicator: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        {indicator}
                      </li>
                    ))}
                  </ul>
                </div>

                {tenthHouseAnalysis.planetsInHouse?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">
                      {getTranslation('Planets in 10th House', '10वें भाव में ग्रह')}
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {tenthHouseAnalysis.planetsInHouse.map((planet: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {planet}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* D10 Chart Analysis */}
            <Card className="border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100">
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {getTranslation('D10 Career Chart', 'D10 करियर चार्ट')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">
                    {getTranslation('Key Insights', 'मुख्य अंतर्दृष्टि')}
                  </h4>
                  <ul className="space-y-2">
                    {d10Analysis.key_insights?.map((insight: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-green-800 mb-2">
                    {getTranslation('Professional Strengths', 'व्यावसायिक शक्तियां')}
                  </h4>
                  <ul className="space-y-1">
                    {d10Analysis.professional_strengths?.map((strength: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Zap className="h-3 w-3 text-yellow-600" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Karma Blocks Tab */}
        <TabsContent value="blocks" className="space-y-4">
          <div className="space-y-4">
            {karmaBlocks.map((block) => (
              <Card key={block.id} className="border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-full">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-red-800">{block.title}</h3>
                        <p className="text-sm text-gray-600">{block.planetary_cause}</p>
                      </div>
                    </div>
                    <Badge className={`${getSeverityColor(block.severity)} border`}>
                      {block.severity} {getTranslation('Impact', 'प्रभाव')}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{block.description}</p>
                  
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-1">
                      {getTranslation('Remedy', 'उपाय')}
                    </h4>
                    <p className="text-sm text-blue-700">{block.remedy}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Ideal Paths Tab */}
        <TabsContent value="paths" className="space-y-4">
          <div className="space-y-4">
            {idealPaths.map((path) => (
              <Card key={path.id} className="border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Target className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-800">{path.title}</h3>
                        <p className="text-sm text-gray-600">{path.timing}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-700">{path.alignment_score}%</div>
                      <div className="text-xs text-gray-600">{getTranslation('Alignment', 'संरेखण')}</div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-4">{path.description}</p>
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">
                      {getTranslation('Action Steps', 'कार्य योजना')}
                    </h4>
                    <ul className="space-y-1">
                      {path.action_steps.map((step: string, index: number) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-green-700">
                          <CheckCircle className="h-3 w-3" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Timing Tab */}
        <TabsContent value="timing" className="space-y-4">
          <Card className="border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100">
              <CardTitle className="text-purple-800 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {getTranslation('Dasha & Career Timing', 'दशा और करियर समय')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-3">
                    {getTranslation('Current Period Focus', 'वर्तमान काल का फोकस')}
                  </h4>
                  <p className="text-sm text-gray-700">{dashaAlignment.period_focus}</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-3">
                    {getTranslation('Career Timing', 'करियर समय')}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>{getTranslation('Current:', 'वर्तमान:')}</strong> {d10Analysis.career_timing?.current_period}</div>
                    <div><strong>{getTranslation('Peak:', 'शिखर:')}</strong> {d10Analysis.career_timing?.peak_period}</div>
                    <div><strong>{getTranslation('Caution:', 'सावधानी:')}</strong> {d10Analysis.career_timing?.caution_period}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  {getTranslation('Upcoming Opportunities', 'आगामी अवसर')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {dashaAlignment.upcoming_opportunities?.map((opportunity: string, index: number) => (
                    <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
                      <TrendingUp className="h-4 w-4 text-yellow-600 mx-auto mb-1" />
                      <div className="text-sm text-yellow-800">{opportunity}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DharmaAlignmentAnalysis;
