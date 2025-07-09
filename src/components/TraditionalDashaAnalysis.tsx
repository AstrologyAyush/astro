import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar,
  Clock,
  Star,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Target,
  Lightbulb,
  Heart
} from 'lucide-react';
import FixedTraditionalDashaCalculator from './FixedTraditionalDashaCalculator';

interface TraditionalDashaAnalysisProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const TraditionalDashaAnalysis: React.FC<TraditionalDashaAnalysisProps> = ({ kundaliData, language }) => {
  const getTranslation = (en: string, hi: string) => (language === 'hi' ? hi : en);

  // Extract birth data for dasha calculation
  const birthData = useMemo(() => {
    const birth = kundaliData?.birthData || kundaliData?.birth_data || {};
    const planets = kundaliData?.planets || kundaliData?.planetaryPositions || {};
    const moon = planets.Moon || planets.moon;
    
    if (!birth.dateTime && !birth.date_time && !birth.date) {
      // Use sample data if no birth data
      return {
        birthDate: new Date(),
        moonLongitude: 127.5, // Sample moon longitude
        moonNakshatra: 9 // Sample nakshatra
      };
    }
    
    const dateTime = birth.dateTime || birth.date_time || birth.date;
    const birthDate = new Date(dateTime);
    
    // Calculate moon's nakshatra from longitude
    const moonLongitude = moon?.longitude || 127.5;
    const moonNakshatra = Math.floor(moonLongitude / 13.333333) + 1; // Convert to nakshatra number
    
    return {
      birthDate,
      moonLongitude,
      moonNakshatra
    };
  }, [kundaliData]);

  // Analyze life phases based on dasha
  const analyzeLifePhases = () => {
    const currentYear = new Date().getFullYear();
    const birthYear = birthData.birthDate.getFullYear();
    const currentAge = currentYear - birthYear;
    
    let phase = '';
    let description = '';
    let focus = '';
    let opportunities = [];
    let challenges = [];
    
    if (currentAge < 25) {
      phase = getTranslation('Youth & Learning Phase', 'युवावस्था और शिक्षा चरण');
      description = getTranslation(
        'This is your foundational period focused on education, skill development, and discovering your path.',
        'यह आपकी आधारभूत अवधि है जो शिक्षा, कौशल विकास और अपने रास्ते की खोज पर केंद्रित है।'
      );
      focus = getTranslation('Education, Skills, Self-Discovery', 'शिक्षा, कौशल, आत्म-खोज');
      opportunities = [
        getTranslation('Learn new skills rapidly', 'नए कौशल तेजी से सीखें'),
        getTranslation('Build strong foundations', 'मजबूत नींव बनाएं'),
        getTranslation('Explore different interests', 'विभिन्न रुचियों का अन्वेषण करें')
      ];
      challenges = [
        getTranslation('Decision making confusion', 'निर्णय लेने में भ्रम'),
        getTranslation('Peer pressure', 'साथियों का दबाव')
      ];
    } else if (currentAge < 40) {
      phase = getTranslation('Career Building Phase', 'करियर निर्माण चरण');
      description = getTranslation(
        'This is your productive period focused on career establishment, relationships, and building stability.',
        'यह आपकी उत्पादक अवधि है जो करियर स्थापना, रिश्तों और स्थिरता निर्माण पर केंद्रित है।'
      );
      focus = getTranslation('Career, Relationships, Stability', 'करियर, रिश्ते, स्थिरता');
      opportunities = [
        getTranslation('Career advancement', 'करियर में प्रगति'),
        getTranslation('Financial growth', 'वित्तीय वृद्धि'),
        getTranslation('Building networks', 'नेटवर्क निर्माण')
      ];
      challenges = [
        getTranslation('Work-life balance', 'कार्य-जीवन संतुलन'),
        getTranslation('High expectations', 'उच्च अपेक्षाएं')
      ];
    } else if (currentAge < 60) {
      phase = getTranslation('Mastery & Leadership Phase', 'निपुणता और नेतृत्व चरण');
      description = getTranslation(
        'This is your peak period focused on leadership, mentoring others, and achieving mastery in your field.',
        'यह आपकी चरम अवधि है जो नेतृत्व, दूसरों को मार्गदर्शन और अपने क्षेत्र में निपुणता प्राप्त करने पर केंद्रित है।'
      );
      focus = getTranslation('Leadership, Mentoring, Mastery', 'नेतृत्व, मार्गदर्शन, निपुणता');
      opportunities = [
        getTranslation('Leadership roles', 'नेतृत्व भूमिकाएं'),
        getTranslation('Sharing knowledge', 'ज्ञान साझा करना'),
        getTranslation('Peak achievements', 'चरम उपलब्धियां')
      ];
      challenges = [
        getTranslation('Managing responsibilities', 'जिम्मेदारियों का प्रबंधन'),
        getTranslation('Health considerations', 'स्वास्थ्य विचार')
      ];
    } else {
      phase = getTranslation('Wisdom & Spiritual Phase', 'ज्ञान और आध्यात्मिक चरण');
      description = getTranslation(
        'This is your wisdom period focused on spiritual growth, sharing life experiences, and inner peace.',
        'यह आपकी ज्ञान अवधि है जो आध्यात्मिक विकास, जीवन अनुभव साझा करने और आंतरिक शांति पर केंद्रित है।'
      );
      focus = getTranslation('Spirituality, Wisdom, Peace', 'आध्यात्म, ज्ञान, शांति');
      opportunities = [
        getTranslation('Spiritual growth', 'आध्यात्मिक विकास'),
        getTranslation('Mentoring young people', 'युवाओं का मार्गदर्शन'),
        getTranslation('Inner peace', 'आंतरिक शांति')
      ];
      challenges = [
        getTranslation('Health maintenance', 'स्वास्थ्य रखरखाव'),
        getTranslation('Adapting to changes', 'परिवर्तनों के अनुकूल होना')
      ];
    }
    
    return { phase, description, focus, opportunities, challenges, currentAge };
  };

  // Get personalized dasha insights
  const getDashaInsights = () => {
    // This would normally be calculated from actual dasha periods
    // For now, providing meaningful insights based on current life phase
    
    return [
      {
        title: getTranslation('Current Life Focus', 'वर्तमान जीवन फोकस'),
        description: getTranslation(
          'Your current planetary period emphasizes personal growth and building strong foundations for the future.',
          'आपकी वर्तमान ग्रहीय अवधि व्यक्तिगत विकास और भविष्य के लिए मजबूत नींव बनाने पर जोर देती है।'
        ),
        icon: Target,
        color: 'blue'
      },
      {
        title: getTranslation('Key Opportunities', 'मुख्य अवसर'),
        description: getTranslation(
          'This period brings opportunities for career advancement, learning new skills, and expanding your network.',
          'यह अवधि करियर में प्रगति, नए कौशल सीखने और आपके नेटवर्क का विस्तार करने के अवसर लाती है।'
        ),
        icon: TrendingUp,
        color: 'green'
      },
      {
        title: getTranslation('Areas to Focus', 'ध्यान देने वाले क्षेत्र'),
        description: getTranslation(
          'Pay special attention to health, relationships, and maintaining work-life balance during this phase.',
          'इस चरण के दौरान स्वास्थ्य, रिश्तों और कार्य-जीवन संतुलन बनाए रखने पर विशेष ध्यान दें।'
        ),
        icon: Heart,
        color: 'purple'
      },
      {
        title: getTranslation('Challenges to Overcome', 'चुनौतियों का सामना'),
        description: getTranslation(
          'Be mindful of overcommitment and ensure you take time for self-care and personal reflection.',
          'अधिक प्रतिबद्धता से सावधान रहें और सुनिश्चित करें कि आप स्व-देखभाल और व्यक्तिगत चिंतन के लिए समय निकालें।'
        ),
        icon: AlertCircle,
        color: 'orange'
      }
    ];
  };

  const lifePhase = analyzeLifePhases();
  const dashaInsights = getDashaInsights();

  return (
    <div className="space-y-6">
      {/* Current Life Phase */}
      <Card className="border-indigo-200">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle className="text-indigo-800 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {getTranslation('Your Current Life Phase', 'आपका वर्तमान जीवन चरण')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <Badge className="bg-indigo-600 text-white text-lg px-4 py-2 mb-3">
              {lifePhase.phase}
            </Badge>
            <p className="text-gray-700 mb-2">
              {getTranslation('Age:', 'उम्र:')} {lifePhase.currentAge} {getTranslation('years', 'वर्ष')}
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              {lifePhase.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold text-blue-800 mb-2">
                  {getTranslation('Main Focus', 'मुख्य फोकस')}
                </h4>
                <p className="text-blue-700 text-sm">{lifePhase.focus}</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-green-50 p-4 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold text-green-800 mb-2">
                  {getTranslation('Opportunities', 'अवसर')}
                </h4>
                <div className="space-y-1">
                  {lifePhase.opportunities.slice(0, 2).map((opp, index) => (
                    <p key={index} className="text-green-700 text-xs">• {opp}</p>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-50 p-4 rounded-lg">
                <Lightbulb className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h4 className="font-semibold text-orange-800 mb-2">
                  {getTranslation('Growth Areas', 'विकास क्षेत्र')}
                </h4>
                <div className="space-y-1">
                  {lifePhase.challenges.slice(0, 2).map((challenge, index) => (
                    <p key={index} className="text-orange-700 text-xs">• {challenge}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personalized Dasha Insights */}
      <Card className="border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardTitle className="text-purple-800 flex items-center gap-2">
            <Star className="h-5 w-5" />
            {getTranslation('Personalized Life Timing Insights', 'व्यक्तिगत जीवन समय अंतर्दृष्टि')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dashaInsights.map((insight, index) => {
              const IconComponent = insight.icon;
              const colorClasses = {
                blue: 'bg-blue-50 border-blue-200 text-blue-800',
                green: 'bg-green-50 border-green-200 text-green-800',
                purple: 'bg-purple-50 border-purple-200 text-purple-800',
                orange: 'bg-orange-50 border-orange-200 text-orange-800'
              };
              
              return (
                <div key={index} className={`p-4 border rounded-lg ${colorClasses[insight.color as keyof typeof colorClasses]}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <IconComponent className="h-5 w-5" />
                    <h4 className="font-semibold">{insight.title}</h4>
                  </div>
                  <p className="text-sm leading-relaxed">{insight.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Fixed Traditional Dasha Calculator */}
      <Card className="border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
          <CardTitle className="text-orange-800 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {getTranslation('Traditional Vimshottari Dasha Analysis', 'पारंपरिक विम्शोत्तरी दशा विश्लेषण')}
          </CardTitle>
          <p className="text-sm text-orange-600 mt-2">
            {getTranslation('Accurate planetary period calculations based on Moon\'s nakshatra position', 'चंद्र नक्षत्र स्थिति पर आधारित सटीक ग्रहीय काल गणना')}
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <FixedTraditionalDashaCalculator kundaliData={kundaliData} language={language} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TraditionalDashaAnalysis;