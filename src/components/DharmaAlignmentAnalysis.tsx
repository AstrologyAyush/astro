
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Compass, Target, Clock, Zap, Shield, TrendingUp, AlertTriangle, CheckCircle, Star, Crown } from 'lucide-react';

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
    // Analyze 10th house
    const tenthHouse = kundaliData.enhancedCalculations?.houses?.find(h => h.number === 10) || {};
    const tenthHouseLord = getTenthHouseLord(tenthHouse);
    
    // Analyze current dasha
    const currentDasha = kundaliData.enhancedCalculations?.dashas?.find(d => d.isActive) || {};
    
    // Calculate dharma alignment score
    const score = calculateDharmaScore(tenthHouse, currentDasha);
    setDharmaScore(score);

    // Generate 10th house analysis
    setTenthHouseAnalysis({
      sign: tenthHouse.signName || 'Unknown',
      lord: tenthHouseLord,
      planetsInHouse: tenthHouse.planetsInHouse || [],
      strength: calculateHouseStrength(tenthHouse),
      career_potential: getCareerPotential(tenthHouse),
      dharma_indicators: getDharmaIndicators(tenthHouse)
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

  const calculateDharmaScore = (tenthHouse: any, currentDasha: any) => {
    let score = 50; // Base score
    
    // Add points for beneficial planets in 10th house
    if (tenthHouse.planetsInHouse?.includes('Jupiter')) score += 15;
    if (tenthHouse.planetsInHouse?.includes('Sun')) score += 10;
    if (tenthHouse.planetsInHouse?.includes('Mercury')) score += 8;
    
    // Add points for favorable dasha
    if (['Jupiter', 'Sun', 'Venus'].includes(currentDasha.planet)) score += 10;
    
    // Subtract points for malefic influences
    if (tenthHouse.planetsInHouse?.includes('Saturn')) score -= 5;
    if (tenthHouse.planetsInHouse?.includes('Rahu')) score -= 8;
    
    return Math.min(100, Math.max(0, score));
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

  const calculateHouseStrength = (house: any) => {
    // Simplified strength calculation
    let strength = 50;
    if (house.planetsInHouse?.length > 0) strength += 20;
    if (house.planetsInHouse?.includes('Jupiter')) strength += 15;
    if (house.planetsInHouse?.includes('Sun')) strength += 10;
    return Math.min(100, strength);
  };

  const getCareerPotential = (tenthHouse: any) => {
    const potentials = [
      getTranslation('Government service', 'सरकारी सेवा'),
      getTranslation('Business leadership', 'व्यावसायिक नेतृत्व'),
      getTranslation('Professional expertise', 'व्यावसायिक विशेषज्ञता'),
      getTranslation('Public recognition', 'सार्वजनिक मान्यता')
    ];
    return potentials.slice(0, 2 + (tenthHouse.planetsInHouse?.length || 0));
  };

  const getDharmaIndicators = (tenthHouse: any) => {
    return [
      getTranslation('Service orientation', 'सेवा अभिविन्यास'),
      getTranslation('Ethical leadership', 'नैतिक नेतृत्व'),
      getTranslation('Social responsibility', 'सामाजिक जिम्मेदारी')
    ];
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

  return (
    <div className="space-y-6">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
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
          <TabsTrigger value="blocks">{getTranslation('Karma Blocks', 'कर्म अवरोध')}</TabsTrigger>
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
