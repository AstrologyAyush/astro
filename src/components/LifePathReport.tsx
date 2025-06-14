
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';
import { Compass, Heart, Briefcase, Shield, Star, TrendingUp, Calendar, Target } from 'lucide-react';

interface LifePathReportProps {
  kundaliData: ComprehensiveKundaliData;
  language: 'hi' | 'en';
}

const LifePathReport: React.FC<LifePathReportProps> = ({ kundaliData, language }) => {
  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const generateLifePathAnalysis = () => {
    const lagna = kundaliData.enhancedCalculations.lagna;
    const planets = kundaliData.enhancedCalculations.planets;
    const activeYogas = kundaliData.enhancedCalculations.yogas.filter(y => y.isActive);
    const currentDasha = kundaliData.enhancedCalculations.dashas.find(d => d.isActive);

    // Generate life path based on chart analysis
    const lagnaLord = planets.SU; // Simplified - should be actual lagna lord
    const moonSign = planets.MO.rashiName;
    const sunSign = planets.SU.rashiName;

    return {
      soulPurpose: language === 'hi' ? 
        `आपकी आत्मा का उद्देश्य ${moonSign} राशि और ${lagna.signName} लग्न के संयोग से स्पिरिचुअल ग्रोथ और सेवा की दिशा में है।` :
        `Your soul's purpose, guided by ${moonSign} Moon and ${lagna.signName} Ascendant, is oriented toward spiritual growth and service.`,
      
      lifeTheme: language === 'hi' ? 
        `आपके जीवन की मुख्य थीम है: आध्यात्मिक विकास के साथ-साथ भौतिक सफलता की प्राप्ति।` :
        `Your life theme: Achieving material success while pursuing spiritual development.`,

      karmaLessons: [
        language === 'hi' ? `धैर्य और दृढ़ता का अभ्यास` : `Practice patience and perseverance`,
        language === 'hi' ? `दूसरों की सेवा में जीवन का अर्थ खोजना` : `Finding life's meaning through service to others`,
        language === 'hi' ? `अंतर्मुखी और बाह्यमुखी प्रकृति में संतुलन` : `Balancing introversion and extroversion`
      ],

      lifePhasePredictions: [
        {
          phase: language === 'hi' ? 'युवावस्था (25 वर्ष तक)' : 'Youth (Until 25)',
          description: language === 'hi' ? 
            'शिक्षा और व्यक्तित्व विकास का समय। करियर की दिशा स्पष्ट होगी।' :
            'Time for education and personality development. Career direction will become clear.'
        },
        {
          phase: language === 'hi' ? 'मध्यावस्था (25-50 वर्ष)' : 'Midlife (25-50 years)',
          description: language === 'hi' ? 
            'करियर की स्थापना और पारिवारिक जिम्मेदारियों का संतुलन। सफलता के शिखर पर पहुंचेंगे।' :
            'Career establishment and balancing family responsibilities. Will reach peak success.'
        },
        {
          phase: language === 'hi' ? 'परिपक्वता (50+ वर्ष)' : 'Maturity (50+ years)',
          description: language === 'hi' ? 
            'आध्यात्मिक जागरूकता और समाज सेवा का समय। ज्ञान साझा करने की भूमिका।' :
            'Time for spiritual awakening and social service. Role of sharing wisdom.'
        }
      ],

      strengthsAndChallenges: {
        strengths: [
          language === 'hi' ? 'मजबूत इंट्यूशन और आध्यात्मिक झुकाव' : 'Strong intuition and spiritual inclination',
          language === 'hi' ? 'नेतृत्व की प्राकृतिक क्षमता' : 'Natural leadership abilities',
          language === 'hi' ? 'कलात्मक और रचनात्मक प्रतिभा' : 'Artistic and creative talents'
        ],
        challenges: [
          language === 'hi' ? 'अधिक चिंता और तनाव की प्रवृत्ति' : 'Tendency toward anxiety and stress',
          language === 'hi' ? 'निर्णय लेने में देरी' : 'Delay in decision making',
          language === 'hi' ? 'अपेक्षाओं का बोझ' : 'Burden of expectations'
        ]
      }
    };
  };

  const lifePathData = generateLifePathAnalysis();

  return (
    <Card className="border-purple-200 shadow-lg bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-blue-100">
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Compass className="h-6 w-6 text-purple-600" />
          {getTranslation('Life Path Report', 'जीवन पथ रिपोर्ट')}
        </CardTitle>
        <p className="text-sm text-purple-600">
          {getTranslation('Your cosmic blueprint for this lifetime', 'इस जन्म के लिए आपका ब्रह्मांडीय खाका')}
        </p>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Soul Purpose */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
            <Star className="h-5 w-5" />
            {getTranslation('Soul Purpose', 'आत्मा का उद्देश्य')}
          </h4>
          <p className="text-sm text-gray-700">{lifePathData.soulPurpose}</p>
        </div>

        {/* Life Theme */}
        <div className="bg-white p-4 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
            <Target className="h-5 w-5" />
            {getTranslation('Life Theme', 'जीवन की मुख्य थीम')}
          </h4>
          <p className="text-sm text-gray-700">{lifePathData.lifeTheme}</p>
        </div>

        {/* Karma Lessons */}
        <div>
          <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {getTranslation('Karmic Lessons', 'कर्म के पाठ')}
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {lifePathData.karmaLessons.map((lesson, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs bg-purple-100">
                  {index + 1}
                </Badge>
                <span className="text-sm text-gray-700">{lesson}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Life Phase Predictions */}
        <div>
          <h4 className="font-semibold text-purple-800 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {getTranslation('Life Phase Predictions', 'जीवन चरण की भविष्यवाणी')}
          </h4>
          <div className="space-y-4">
            {lifePathData.lifePhasePredictions.map((phase, index) => (
              <div key={index} className="border border-purple-200 rounded-lg p-4 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <h5 className="font-medium text-purple-700">{phase.phase}</h5>
                </div>
                <p className="text-sm text-gray-600">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Strengths and Challenges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
              <Heart className="h-5 w-5" />
              {getTranslation('Core Strengths', 'मुख्य शक्तियां')}
            </h4>
            <div className="space-y-2">
              {lifePathData.strengthsAndChallenges.strengths.map((strength, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              {getTranslation('Growth Areas', 'विकास के क्षेत्र')}
            </h4>
            <div className="space-y-2">
              {lifePathData.strengthsAndChallenges.challenges.map((challenge, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">{challenge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cosmic Guidance */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-800 mb-2">
            {getTranslation('Cosmic Guidance', 'ब्रह्मांडीय मार्गदर्शन')}
          </h4>
          <p className="text-sm text-gray-700">
            {language === 'hi' ? 
              'आपका जीवन पथ दिखाता है कि आप एक आध्यात्मिक योद्धा हैं जो भौतिक दुनिया में अपने उद्देश्य को पूरा करने आए हैं। धैर्य, करुणा और सेवा के माध्यम से आप अपनी उच्चतम क्षमता तक पहुंच सकते हैं।' :
              'Your life path reveals you are a spiritual warrior who has come to fulfill your purpose in the material world. Through patience, compassion, and service, you can reach your highest potential.'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LifePathReport;
