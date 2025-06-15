
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Clock, Star, Calendar, AlertCircle } from 'lucide-react';

interface TransitAnalysisProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const TransitAnalysis: React.FC<TransitAnalysisProps> = ({ kundaliData, language }) => {
  const [currentTransits, setCurrentTransits] = useState<any[]>([]);
  const [upcomingTransits, setUpcomingTransits] = useState<any[]>([]);
  const [yearlyTransits, setYearlyTransits] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  useEffect(() => {
    generateCurrentTransits();
    generateUpcomingTransits();
    generateYearlyTransits();
  }, []);

  const generateCurrentTransits = () => {
    const now = new Date();
    const transits = [
      {
        planet: 'Jupiter',
        planetHi: 'गुरु',
        currentSign: 'Taurus',
        currentSignHi: 'वृष',
        natalHouse: 5,
        transitHouse: 7,
        effect: getTranslation('Expansion in partnerships and relationships', 'साझेदारी और रिश्तों में विस्तार'),
        intensity: 'High',
        duration: getTranslation('Until May 2024', 'मई 2024 तक'),
        advice: getTranslation('Good time for marriage or business partnerships', 'विवाह या व्यावसायिक साझेदारी के लिए अच्छा समय'),
        insights: getTranslation('Jupiter in the 7th house brings opportunities for meaningful partnerships and legal matters', 'सातवें भाव में गुरु अर्थपूर्ण साझेदारी और कानूनी मामलों के अवसर लाता है')
      },
      {
        planet: 'Saturn',
        planetHi: 'शनि',
        currentSign: 'Aquarius',
        currentSignHi: 'कुम्भ',
        natalHouse: 3,
        transitHouse: 6,
        effect: getTranslation('Discipline in daily work and health routines', 'दैनिक कार्य और स्वास्थ्य दिनचर्या में अनुशासन'),
        intensity: 'Medium',
        duration: getTranslation('Until March 2025', 'मार्च 2025 तक'),
        advice: getTranslation('Focus on building healthy habits and work discipline', 'स्वस्थ आदतें और कार्य अनुशासन बनाने पर ध्यान दें'),
        insights: getTranslation('Saturn teaches patience and helps establish long-term routines', 'शनि धैर्य सिखाता है और दीर्घकालिक दिनचर्या स्थापित करने में मदद करता है')
      },
      {
        planet: 'Mars',
        planetHi: 'मंगल',
        currentSign: 'Leo',
        currentSignHi: 'सिंह',
        natalHouse: 8,
        transitHouse: 2,
        effect: getTranslation('Energy boost in financial matters', 'वित्तीय मामलों में ऊर्जा की वृद्धि'),
        intensity: 'High',
        duration: getTranslation('Until January 2024', 'जनवरी 2024 तक'),
        advice: getTranslation('Good time for investments and increasing income', 'निवेश और आय बढ़ाने के लिए अच्छा समय'),
        insights: getTranslation('Mars energizes your financial sector, bringing opportunities for wealth accumulation', 'मंगल आपके वित्तीय क्षेत्र को ऊर्जावान बनाता है, धन संचय के अवसर लाता है')
      }
    ];
    
    setCurrentTransits(transits);
  };

  const generateUpcomingTransits = () => {
    const upcomingTransits = [
      {
        planet: 'Venus',
        planetHi: 'शुक्र',
        futureSign: 'Libra',
        futureSignHi: 'तुला',
        transitHouse: 4,
        startDate: '2024-02-15',
        effect: getTranslation('Harmony in home and family matters', 'घर और पारिवारिक मामलों में सामंजस्य'),
        intensity: 'Medium',
        duration: getTranslation('Feb 2024 - Mar 2024', 'फरवरी 2024 - मार्च 2024'),
        advice: getTranslation('Focus on home decoration and family relationships', 'घर की सजावट और पारिवारिक रिश्तों पर ध्यान दें')
      },
      {
        planet: 'Mercury',
        planetHi: 'बुध',
        futureSign: 'Gemini',
        futureSignHi: 'मिथुन',
        transitHouse: 10,
        startDate: '2024-03-01',
        effect: getTranslation('Enhanced communication in career', 'करियर में बेहतर संवाद'),
        intensity: 'High',
        duration: getTranslation('Mar 2024 - Apr 2024', 'मार्च 2024 - अप्रैल 2024'),
        advice: getTranslation('Excellent time for presentations and networking', 'प्रस्तुतियों और नेटवर्किंग के लिए उत्कृष्ट समय')
      },
      {
        planet: 'Sun',
        planetHi: 'सूर्य',
        futureSign: 'Aries',
        futureSignHi: 'मेष',
        transitHouse: 9,
        startDate: '2024-03-20',
        effect: getTranslation('Spiritual growth and higher learning', 'आध्यात्मिक विकास और उच्च शिक्षा'),
        intensity: 'Medium',
        duration: getTranslation('Mar 2024 - Apr 2024', 'मार्च 2024 - अप्रैल 2024'),
        advice: getTranslation('Consider taking up spiritual practices or higher studies', 'आध्यात्मिक प्रथाओं या उच्च अध्ययन पर विचार करें')
      }
    ];
    
    setUpcomingTransits(upcomingTransits);
  };

  const generateYearlyTransits = () => {
    const yearlyTransits = [
      {
        period: '2024 Q1',
        majorEvents: [
          getTranslation('Jupiter aspects your 9th house - spiritual growth', 'गुरु आपके नवम भाव को देखता है - आध्यात्मिक विकास'),
          getTranslation('Saturn stabilizes career sector', 'शनि करियर क्षेत्र को स्थिर करता है')
        ],
        overallTheme: getTranslation('Foundation Building', 'नींव निर्माण'),
        recommendation: getTranslation('Focus on long-term planning and spiritual development', 'दीर्घकालिक योजना और आध्यात्मिक विकास पर ध्यान दें')
      },
      {
        period: '2024 Q2',
        majorEvents: [
          getTranslation('Venus brings harmony to relationships', 'शुक्र रिश्तों में सामंजस्य लाता है'),
          getTranslation('Mars energizes financial sector', 'मंगल वित्तीय क्षेत्र को ऊर्जावान बनाता है')
        ],
        overallTheme: getTranslation('Relationship & Wealth Focus', 'रिश्ते और धन पर फोकस'),
        recommendation: getTranslation('Ideal time for investments and strengthening partnerships', 'निवेश और साझेदारी मजबूत करने के लिए आदर्श समय')
      },
      {
        period: '2024 Q3',
        majorEvents: [
          getTranslation('Mercury enhances communication skills', 'बुध संचार कौशल बढ़ाता है'),
          getTranslation('Sun illuminates career path', 'सूर्य करियर पथ को रोशन करता है')
        ],
        overallTheme: getTranslation('Career Advancement', 'करियर प्रगति'),
        recommendation: getTranslation('Take initiative in professional matters and public speaking', 'व्यावसायिक मामलों और सार्वजनिक बोलने में पहल करें')
      }
    ];
    
    setYearlyTransits(yearlyTransits);
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderCurrentTransits = () => (
    <div className="space-y-4">
      {currentTransits.map((transit, index) => (
        <div key={index} className="p-4 border border-blue-200 rounded-lg bg-blue-50">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-blue-800">
                {language === 'hi' ? transit.planetHi : transit.planet}
              </div>
              <div className="text-sm text-blue-600">
                <div>{getTranslation('in', 'में')} {language === 'hi' ? transit.currentSignHi : transit.currentSign}</div>
                <div>{getTranslation('Transiting House', 'गोचर भाव')} {transit.transitHouse}</div>
              </div>
            </div>
            <Badge className={`${getIntensityColor(transit.intensity)} border`}>
              {transit.intensity} {getTranslation('Impact', 'प्रभाव')}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">
                {getTranslation('Effect', 'प्रभाव')}
              </h4>
              <p className="text-sm text-gray-700">{transit.effect}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">
                {getTranslation('Advice', 'सलाह')}
              </h4>
              <p className="text-sm text-gray-700">{transit.advice}</p>
            </div>
          </div>

          {transit.insights && (
            <div className="mt-3 p-3 bg-blue-100 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-1 flex items-center gap-1">
                <Star className="h-4 w-4" />
                {getTranslation('Insights', 'अंतर्दृष्टि')}
              </h4>
              <p className="text-sm text-blue-700">{transit.insights}</p>
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="flex justify-between text-xs text-blue-600">
              <span>{getTranslation('Duration:', 'अवधि:')} {transit.duration}</span>
              <span>{getTranslation('Natal House:', 'जन्म भाव:')} {transit.natalHouse}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderUpcomingTransits = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-blue-800 mb-4">
        {getTranslation('Next 3 Months Transits', 'अगले 3 महीने के गोचर')}
      </h3>
      {upcomingTransits.map((transit, index) => (
        <div key={index} className="p-4 border border-green-200 rounded-lg bg-green-50">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="text-xl font-bold text-green-800">
                {language === 'hi' ? transit.planetHi : transit.planet}
              </div>
              <div className="text-sm text-green-600">
                <div>{getTranslation('will transit to', 'गोचर करेगा')} {language === 'hi' ? transit.futureSignHi : transit.futureSign}</div>
                <div>{getTranslation('House', 'भाव')} {transit.transitHouse}</div>
              </div>
            </div>
            <Badge className={`${getIntensityColor(transit.intensity)} border`}>
              {transit.intensity}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-green-800 mb-1">
                {getTranslation('Expected Effect', 'अपेक्षित प्रभाव')}
              </h4>
              <p className="text-sm text-gray-700">{transit.effect}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-green-800 mb-1">
                {getTranslation('Preparation Advice', 'तैयारी सलाह')}
              </h4>
              <p className="text-sm text-gray-700">{transit.advice}</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-green-200">
            <div className="flex justify-between text-xs text-green-600">
              <span>{getTranslation('Starts:', 'शुरुआत:')} {new Date(transit.startDate).toLocaleDateString()}</span>
              <span>{getTranslation('Duration:', 'अवधि:')} {transit.duration}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderYearlyTransits = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-purple-800 mb-4">
        {getTranslation('2024 Yearly Transit Overview', '2024 वार्षिक गोचर अवलोकन')}
      </h3>
      {yearlyTransits.map((period, index) => (
        <div key={index} className="p-4 border border-purple-200 rounded-lg bg-purple-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xl font-bold text-purple-800">{period.period}</h4>
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
              {period.overallTheme}
            </Badge>
          </div>

          <div className="mb-3">
            <h5 className="font-semibold text-purple-700 mb-2">
              {getTranslation('Major Events', 'प्रमुख घटनाएं')}
            </h5>
            <ul className="space-y-1">
              {period.majorEvents.map((event, eventIndex) => (
                <li key={eventIndex} className="text-sm text-gray-700 flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  {event}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-purple-100 rounded-lg">
            <h5 className="font-semibold text-purple-700 mb-1">
              {getTranslation('Recommendation', 'सिफारिश')}
            </h5>
            <p className="text-sm text-purple-700">{period.recommendation}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-cyan-100">
        <CardTitle className="text-blue-800 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {getTranslation('Current Transit Analysis', 'वर्तमान गोचर विश्लेषण')}
        </CardTitle>
        <p className="text-sm text-blue-600">
          {getTranslation('Real-time planetary movements and their effects', 'वास्तविक समय में ग्रहों की गति और उनके प्रभाव')}
        </p>
      </CardHeader>
      <CardContent className="p-6">
        {/* Period Selection */}
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <Button
              variant={selectedPeriod === 'current' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('current')}
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              {getTranslation('Current', 'वर्तमान')}
            </Button>
            <Button
              variant={selectedPeriod === 'upcoming' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('upcoming')}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              {getTranslation('Upcoming', 'आगामी')}
            </Button>
            <Button
              variant={selectedPeriod === 'yearly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('yearly')}
              className="flex items-center gap-2"
            >
              <Star className="h-4 w-4" />
              {getTranslation('Yearly', 'वार्षिक')}
            </Button>
          </div>
        </div>

        {/* Transit Content */}
        <div className="min-h-[400px]">
          {selectedPeriod === 'current' && renderCurrentTransits()}
          {selectedPeriod === 'upcoming' && renderUpcomingTransits()}
          {selectedPeriod === 'yearly' && renderYearlyTransits()}
        </div>

        {/* Transit Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {getTranslation('Overall Transit Outlook', 'समग्र गोचर दृष्टिकोण')}
          </h4>
          <p className="text-sm text-blue-700">
            {selectedPeriod === 'current' && getTranslation(
              'Current planetary transits suggest a period of growth in relationships and financial matters. Focus on building partnerships and maintaining disciplined work routines.',
              'वर्तमान ग्रहीय गोचर रिश्तों और वित्तीय मामलों में वृद्धि की अवधि का सुझाव देते हैं। साझेदारी बनाने और अनुशासित कार्य दिनचर्या बनाए रखने पर ध्यान दें।'
            )}
            {selectedPeriod === 'upcoming' && getTranslation(
              'Upcoming transits bring opportunities for communication, spiritual growth, and family harmony. Prepare for positive changes in career and relationships.',
              'आगामी गोचर संचार, आध्यात्मिक विकास और पारिवारिक सामंजस्य के अवसर लाते हैं। करियर और रिश्तों में सकारात्मक बदलाव के लिए तैयार रहें।'
            )}
            {selectedPeriod === 'yearly' && getTranslation(
              '2024 appears to be a year of steady progress with emphasis on foundation building, relationship enhancement, and career advancement. Plan accordingly for maximum benefit.',
              '2024 नींव निर्माण, रिश्ते बढ़ाने और करियर प्रगति पर जोर देने के साथ निरंतर प्रगति का वर्ष प्रतीत होता है। अधिकतम लाभ के लिए तदनुसार योजना बनाएं।'
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransitAnalysis;
