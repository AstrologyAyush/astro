
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import KarmaAlignmentChart from './KarmaAlignmentChart';
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

interface KarmicAnalysis {
  careerKarmaSignature: string;
  careerBlockExplanation: string;
  idealCareerSuggestions: string[];
  karmicTimeline: string;
  coachMessage: string;
  relationshipKarma: string;
  healthKarma: string;
  spiritualPath: string;
  remedies: string[];
  weeklyActions: Array<{
    week: number;
    action: string;
    planet: string;
  }>;
}

const KarmicReportComplete: React.FC<KarmicReportCompleteProps> = ({ kundaliData, language }) => {
  const [karmicAnalysis, setKarmicAnalysis] = useState<KarmicAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  // Generate comprehensive karma alignment data
  const generateKarmaAlignmentData = () => {
    const planets = kundaliData?.enhancedCalculations?.planets || {};
    
    const planetValues = Object.values(planets);
    const totalShadbala = planetValues.reduce((sum: number, planet: any) => {
      const shadbalaValue = typeof planet?.shadbala === 'number' ? planet.shadbala : 50;
      return sum + shadbalaValue;
    }, 0);
    
    const planetCount = Number(planetValues.length) || 1;
    const averageShadbala = planetCount > 0 ? (Number(totalShadbala) / planetCount) : 50;
    const alignmentPercentage = Math.min(95, Math.max(35, Math.round(averageShadbala * 1.2)));

    const grahaEnergies = [
      {
        name: language === 'hi' ? 'बृहस्पति' : 'Jupiter',
        role: language === 'hi' ? 'धर्म + ज्ञान' : 'Dharma + Wisdom',
        strength: typeof planets.JU?.shadbala === 'number' ? planets.JU.shadbala : 80,
        color: '#F59E0B'
      },
      {
        name: language === 'hi' ? 'शनि' : 'Saturn',
        role: language === 'hi' ? 'अनुशासन + कष्ट' : 'Discipline + Suffering',
        strength: typeof planets.SA?.shadbala === 'number' ? planets.SA.shadbala : 75,
        color: '#6366F1'
      },
      {
        name: language === 'hi' ? 'राहु' : 'Rahu',
        role: language === 'hi' ? 'जुनून + भ्रम' : 'Obsession + Illusion',
        strength: typeof planets.RA?.shadbala === 'number' ? planets.RA.shadbala : 60,
        color: '#8B5CF6'
      },
      {
        name: language === 'hi' ? 'शुक्र' : 'Venus',
        role: language === 'hi' ? 'रचनात्मकता + आकर्षण' : 'Creativity + Charm',
        strength: typeof planets.VE?.shadbala === 'number' ? planets.VE.shadbala : 65,
        color: '#EC4899'
      }
    ];

    const dashaTimeline = [
      {
        period: language === 'hi' ? 'शनि महादशा' : 'Saturn Mahadasha',
        planet: language === 'hi' ? 'शनि' : 'Saturn',
        status: 'challenge' as const,
        startYear: 2024,
        endYear: 2026
      },
      {
        period: language === 'hi' ? 'बुध महादशा' : 'Mercury Mahadasha',
        planet: language === 'hi' ? 'बुध' : 'Mercury',
        status: 'growth' as const,
        startYear: 2026,
        endYear: 2029
      },
      {
        period: language === 'hi' ? 'केतु महादशा' : 'Ketu Mahadasha',
        planet: language === 'hi' ? 'केतु' : 'Ketu',
        status: 'transition' as const,
        startYear: 2029,
        endYear: 2031
      }
    ];

    const weeklyTracker = [
      {
        week: 1,
        action: language === 'hi' ? 'एक गरीब बुजुर्ग की सेवा करें' : 'Serve a poor elder',
        planet: language === 'hi' ? 'शनि' : 'Saturn',
        status: 'done' as const
      },
      {
        week: 2,
        action: language === 'hi' ? '7 दिन तक गपशप से बचें' : 'Avoid gossip for 7 days',
        planet: language === 'hi' ? 'राहु' : 'Rahu',
        status: 'repeating' as const
      },
      {
        week: 3,
        action: language === 'hi' ? 'किसी को कौशल सिखाएं' : 'Teach someone a skill',
        planet: language === 'hi' ? 'बृहस्पति' : 'Jupiter',
        status: 'missed' as const
      },
      {
        week: 4,
        action: language === 'hi' ? 'कलात्मक गतिविधि करें' : 'Do artistic activity',
        planet: language === 'hi' ? 'शुक्र' : 'Venus',
        status: 'done' as const
      }
    ];

    return {
      alignmentPercentage,
      grahaEnergies,
      dashaTimeline,
      weeklyTracker
    };
  };

  const generateKarmicReport = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('karmic-analysis', {
        body: {
          kundaliData,
          language,
          analysisType: 'complete_karmic_report'
        }
      });

      if (error) throw error;

      // Enhanced analysis with all sections
      const enhancedAnalysis = {
        ...data.analysis,
        weeklyActions: [
          {
            week: 1,
            action: language === 'hi' ? 'एक मजदूर या ड्राइवर की बिना अपेक्षा के मदद करें' : 'Help a laborer or driver without expecting anything',
            planet: language === 'hi' ? 'शनि' : 'Saturn'
          },
          {
            week: 2,
            action: language === 'hi' ? 'अपने सबसे बड़े भावनात्मक घाव को डायरी में लिखें' : 'Journal your biggest emotional wound',
            planet: language === 'hi' ? 'चंद्र' : 'Moon'
          },
          {
            week: 3,
            action: language === 'hi' ? 'किसी को अपना महारत हासिल कौशल सिखाएं' : 'Teach someone a skill you have mastered',
            planet: language === 'hi' ? 'बृहस्पति' : 'Jupiter'
          },
          {
            week: 4,
            action: language === 'hi' ? 'गपशप या ऑफिस राजनीति से बचें' : 'Avoid gossip or office politics',
            planet: language === 'hi' ? 'राहु' : 'Rahu'
          }
        ],
        remedies: [
          language === 'hi' ? '🪔 शनि: साप्ताहिक बुजुर्ग मजदूरों की सेवा करें, काला तिल दान करें' : '🪔 Saturn: Serve elder laborers weekly, donate black sesame',
          language === 'hi' ? '🪔 राहु: रोज 5 मिनट सांस पर ध्यान दें, अमावस्या पर डिटॉक्स करें' : '🪔 Rahu: Do 5 minutes of breath focus daily, detox on new moon',
          language === 'hi' ? '🪔 चंद्र: पूर्णिमा जल चिकित्सा, चांदी पहनें, सच बोलें' : '🪔 Moon: Full moon water therapy, wear silver, speak your truth'
        ]
      };

      setKarmicAnalysis(enhancedAnalysis);
      
      toast({
        title: getTranslation("Complete Karmic Report Generated", "संपूर्ण कर्मिक रिपोर्ट तैयार"),
        description: getTranslation("Your comprehensive karmic insights are ready", "आपकी व्यापक कर्मिक अंतर्दृष्टि तैयार है")
      });

    } catch (error) {
      console.error('Error generating karmic report:', error);
      toast({
        title: getTranslation("Error", "त्रुटि"),
        description: getTranslation("Failed to generate karmic report", "कर्मिक रिपोर्ट बनाने में त्रुटि"),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = () => {
    // This will be handled by the PDF export component
    const reportContent = document.getElementById('karmic-report-content');
    if (reportContent) {
      // Trigger PDF generation
      window.print();
    }
  };

  const karmaData = generateKarmaAlignmentData();

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
              {!karmicAnalysis && (
                <Button 
                  onClick={generateKarmicReport}
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
                      {getTranslation('Generate Complete Report', 'संपूर्ण रिपोर्ट बनाएं')}
                    </>
                  )}
                </Button>
              )}
              {karmicAnalysis && (
                <Button 
                  onClick={downloadPDF}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {getTranslation('📥 Download PDF', '📥 PDF डाउनलोड करें')}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {!karmicAnalysis ? (
        <div className="text-center py-12">
          <Sparkles className="h-16 w-16 text-purple-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {getTranslation('Generate Your Complete Karmic Career Report', 'अपनी संपूर्ण कर्मिक करियर रिपोर्ट बनाएं')}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {getTranslation(
              'Get comprehensive insights into your career karma, timeline, remedies, and weekly action plan based on ancient Vedic wisdom',
              'प्राचीन वैदिक ज्ञान के आधार पर अपने करियर कर्म, समयरेखा, उपचार और साप्ताहिक कार्य योजना की व्यापक अंतर्दृष्टि प्राप्त करें'
            )}
          </p>
        </div>
      ) : (
        <div id="karmic-report-content" className="space-y-6 print:space-y-4">
          {/* Section 1: Karmic Career Signature */}
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
                    <span>Capricorn – {getTranslation('The Builder', 'निर्माता')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">{getTranslation('Moon Nakshatra', 'चंद्र नक्षत्र')}:</span>
                    <span>Magha – {getTranslation('Seeks legacy', 'विरासत चाहता है')}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">{getTranslation('10th House Planet', '10वें घर का ग्रह')}:</span>
                    <span>Mars – {getTranslation('Execution, drive', 'क्रियान्वयन, प्रेरणा')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">{getTranslation('D10 Summary', 'D10 सारांश')}:</span>
                    <span>Saturn – {getTranslation('Structure, slow rise', 'संरचना, धीमी उन्नति')}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic bg-orange-50 p-3 rounded-lg">
                {karmicAnalysis.careerKarmaSignature}
              </p>
            </CardContent>
          </Card>

          {/* Section 2: Career Blocks */}
          <Card className="border-red-200" id="career-blocks">
            <CardHeader className="bg-red-50">
              <CardTitle className="text-red-800 flex items-center gap-2">
                <Target className="h-5 w-5" />
                {getTranslation('2. Career Karma Blocks', '2. करियर कर्म बाधाएं')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3 mb-4">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 mt-1">•</span>
                  <span><strong>Saturn–Moon Dasha</strong> → {getTranslation('Emotional suppression + delayed rewards', 'भावनात्मक दमन + विलंबित पुरस्कार')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 mt-1">•</span>
                  <span><strong>10th Lord in 8th</strong> → {getTranslation('Hidden power struggles', 'छुपे हुए शक्ति संघर्ष')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 mt-1">•</span>
                  <span><strong>Rahu in 6th</strong> → {getTranslation('Overwork loop + authority resistance', 'अधिक काम का चक्र + अधिकार प्रतिरोध')}</span>
                </li>
              </ul>
              <p className="text-gray-700 italic bg-red-50 p-3 rounded-lg">
                {karmicAnalysis.careerBlockExplanation}
              </p>
            </CardContent>
          </Card>

          {/* Section 3: Ideal Career Roles */}
          <Card className="border-green-200" id="ideal-careers">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Target className="h-5 w-5" />
                {getTranslation('3. Ideal Career Path', '3. आदर्श करियर पथ')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-semibold">{getTranslation('Role', 'भूमिका')}</th>
                      <th className="text-left p-2 font-semibold">{getTranslation('Why', 'क्यों')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2">{getTranslation('Product Manager', 'प्रोडक्ट मैनेजर')}</td>
                      <td className="p-2">{getTranslation('Build systems with user focus (Saturn + Mercury)', 'उपयोगकर्ता केंद्रित सिस्टम बनाना (शनि + बुध)')}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">{getTranslation('Policy Designer', 'नीति डिजाइनर')}</td>
                      <td className="p-2">{getTranslation('Strategic dharma-aligned career (Saturn + Jupiter)', 'रणनीतिक धर्म-संरेखित करियर (शनि + बृहस्पति)')}</td>
                    </tr>
                    <tr>
                      <td className="p-2">{getTranslation('UX Architect', 'UX आर्किटेक्ट')}</td>
                      <td className="p-2">{getTranslation('Mercury + Moon – Design mind-friendly systems', 'बुध + चंद्र – मन-अनुकूल सिस्टम डिजाइन')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-700 italic bg-green-50 p-3 rounded-lg mt-4">
                {getTranslation('You\'re karmically aligned for structured innovation — not chaos or freelance.', 'आप संरचित नवाचार के लिए कर्मिक रूप से संरेखित हैं — अराजकता या स्वतंत्र कार्य के लिए नहीं।')}
              </p>
            </CardContent>
          </Card>

          {/* Section 4: Karmic Timeline */}
          <Card className="border-blue-200" id="karmic-timeline">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {getTranslation('4. Your Career Timeline', '4. आपकी करियर समयरेखा')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="timeline-container mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">2025</span>
                  <span className="text-sm font-semibold">2028</span>
                </div>
                <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div className="absolute left-0 top-0 h-full w-1/3 bg-amber-600 flex items-center justify-center text-white text-xs font-medium">
                    🟫 Saturn
                  </div>
                  <div className="absolute left-1/3 top-0 h-full w-1/3 bg-green-600 flex items-center justify-center text-white text-xs font-medium">
                    🟩 Mercury
                  </div>
                  <div className="absolute left-2/3 top-0 h-full w-1/3 bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
                    🟦 Transition
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <span>{getTranslation('Build + Wait', 'निर्माण + प्रतीक्षा')}</span>
                  <span>{getTranslation('Strategic Leap', 'रणनीतिक छलांग')}</span>
                  <span>{getTranslation('New Phase', 'नया चरण')}</span>
                </div>
              </div>
              <p className="text-gray-700 italic bg-blue-50 p-3 rounded-lg">
                {karmicAnalysis.karmicTimeline}
              </p>
            </CardContent>
          </Card>

          {/* Section 5: Karma Alignment Visualization */}
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

          {/* Section 6: Weekly Action Plan */}
          <Card className="border-indigo-200" id="weekly-actions">
            <CardHeader className="bg-indigo-50">
              <CardTitle className="text-indigo-800 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {getTranslation('6. Weekly Karma Actions', '6. साप्ताहिक कर्म कार्य')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-indigo-50">
                      <th className="text-left p-3 font-semibold">{getTranslation('Week', 'सप्ताह')}</th>
                      <th className="text-left p-3 font-semibold">{getTranslation('Action', 'कार्य')}</th>
                      <th className="text-left p-3 font-semibold">{getTranslation('Planet', 'ग्रह')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {karmicAnalysis.weeklyActions.map((action, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3 font-medium">{action.week}</td>
                        <td className="p-3">{action.action}</td>
                        <td className="p-3">
                          <Badge variant="outline">{action.planet}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Section 7: Gemini Insight */}
          <Card className="border-yellow-200" id="coach-message">
            <CardHeader className="bg-yellow-50">
              <CardTitle className="text-yellow-800 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                {getTranslation('7. Message from Your Karmic Coach', '7. आपके कर्मिक कोच का संदेश')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <blockquote className="border-l-4 border-yellow-400 pl-4 italic text-lg text-gray-700 bg-yellow-50 p-4 rounded-r-lg">
                "{karmicAnalysis.coachMessage}"
              </blockquote>
            </CardContent>
          </Card>

          {/* Section 8: Remedies */}
          <Card className="border-emerald-200" id="remedies">
            <CardHeader className="bg-emerald-50">
              <CardTitle className="text-emerald-800 flex items-center gap-2">
                <Star className="h-5 w-5" />
                {getTranslation('8. Karmic Remedies', '8. कर्मिक उपचार')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                {karmicAnalysis.remedies.map((remedy, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                    <span className="text-emerald-600 mt-1">•</span>
                    <span className="text-gray-700">{remedy}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Section 9: Next Check-in */}
          <Card className="border-cyan-200" id="next-checkin">
            <CardHeader className="bg-cyan-50">
              <CardTitle className="text-cyan-800 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {getTranslation('9. Check-In Point', '9. चेक-इन पॉइंट')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 mb-3">
                {getTranslation('Major shift window begins:', 'प्रमुख बदलाव की शुरुआत:')} <strong>{getTranslation('October 2026', 'अक्टूबर 2026')}</strong>
              </p>
              <Button variant="outline" className="w-full">
                {getTranslation('📅 Add to calendar', '📅 कैलेंडर में जोड़ें')}
              </Button>
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
