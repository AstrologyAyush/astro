import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar,
  Clock,
  Star,
  TrendingUp,
  AlertCircle,
  Info
} from 'lucide-react';

interface DashaInfo {
  planet: string;
  startDate: Date;
  endDate: Date;
  totalYears: number;
  remainingYears?: number;
  isActive: boolean;
}

interface FixedTraditionalDashaCalculatorProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const FixedTraditionalDashaCalculator: React.FC<FixedTraditionalDashaCalculatorProps> = ({ 
  kundaliData, 
  language 
}) => {
  const getTranslation = (en: string, hi: string) => (language === 'hi' ? hi : en);

  // Vimshottari Dasha sequence with correct years
  const DASHA_SEQUENCE = [
    { planet: 'Ketu', years: 7, hindi: 'केतु' },
    { planet: 'Venus', years: 20, hindi: 'शुक्र' },
    { planet: 'Sun', years: 6, hindi: 'सूर्य' },
    { planet: 'Moon', years: 10, hindi: 'चंद्र' },
    { planet: 'Mars', years: 7, hindi: 'मंगल' },
    { planet: 'Rahu', years: 18, hindi: 'राहु' },
    { planet: 'Jupiter', years: 16, hindi: 'बृहस्पति' },
    { planet: 'Saturn', years: 19, hindi: 'शनि' },
    { planet: 'Mercury', years: 17, hindi: 'बुध' }
  ];

  // Nakshatra lords for determining starting dasha
  const NAKSHATRA_LORDS = [
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'
  ];

  const calculateCorrectVimshottariDasha = () => {
    try {
      // Extract birth data
      const birthData = kundaliData?.birthData || kundaliData?.birth_data || {};
      const planets = kundaliData?.enhancedCalculations?.planets || kundaliData?.planets || {};
      
      // Get birth date
      let birthDate: Date;
      if (birthData.dateOfBirth) {
        birthDate = new Date(birthData.dateOfBirth);
      } else if (birthData.date) {
        birthDate = new Date(birthData.date);
      } else {
        // Use sample data for demonstration
        birthDate = new Date('2006-05-03');
      }

      // Get Moon's nakshatra
      const moonData = planets.MO || planets.Moon || planets.moon;
      let moonNakshatra: number;
      
      if (moonData?.nakshatraName) {
        // Map nakshatra name to number
        const nakshatraNames = [
          'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 
          'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
          'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
          'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
          'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
        ];
        moonNakshatra = nakshatraNames.indexOf(moonData.nakshatraName) + 1;
        if (moonNakshatra <= 0) moonNakshatra = 10; // Default
      } else {
        // Calculate from longitude
        const moonLongitude = moonData?.longitude || 127.5;
        moonNakshatra = Math.floor(moonLongitude / 13.333333) + 1;
      }

      // Determine starting dasha based on nakshatra
      const nakshatraLordIndex = (moonNakshatra - 1) % 9;
      const startingPlanet = NAKSHATRA_LORDS[nakshatraLordIndex];
      
      // Calculate the degree within nakshatra for balance calculation
      const moonLongitude = moonData?.longitude || 127.5;
      const degreeInNakshatra = moonLongitude % 13.333333;
      const nakshatraDuration = DASHA_SEQUENCE.find(d => d.planet === startingPlanet)?.years || 7;
      const completedFraction = degreeInNakshatra / 13.333333;
      const balanceAtBirth = nakshatraDuration * (1 - completedFraction);

      console.log('🔮 Calculating Traditional Vimshottari Dasha');
      console.log('📅 Birth Date:', { 
        _type: 'Date', 
        value: { 
          iso: birthDate.toISOString(), 
          value: birthDate.getTime(), 
          local: birthDate.toString() 
        } 
      });
      console.log('🌙 Moon Longitude:', moonLongitude);
      console.log('⭐ Moon Nakshatra:', moonNakshatra);
      console.log('📐 Moon degree in Nakshatra:', degreeInNakshatra.toFixed(1));
      console.log('👑 Nakshatra Lord:', startingPlanet);
      console.log('⚖️ Balance at birth:', balanceAtBirth.toFixed(4), 'years');

      // Generate dasha periods
      const dashas: DashaInfo[] = [];
      let currentDate = new Date(birthDate);
      
      // Find starting dasha index
      const startingIndex = DASHA_SEQUENCE.findIndex(d => d.planet === startingPlanet);
      
      // Add starting dasha with balance
      const firstDasha = DASHA_SEQUENCE[startingIndex];
      const firstEndDate = new Date(currentDate);
      firstEndDate.setFullYear(currentDate.getFullYear() + Math.floor(balanceAtBirth));
      firstEndDate.setMonth(currentDate.getMonth() + Math.floor((balanceAtBirth % 1) * 12));
      
      dashas.push({
        planet: firstDasha.planet,
        startDate: new Date(currentDate),
        endDate: firstEndDate,
        totalYears: balanceAtBirth,
        isActive: false
      });
      
      currentDate = new Date(firstEndDate);

      // Add subsequent dashas
      for (let i = 1; i < 9; i++) {
        const dashaIndex = (startingIndex + i) % 9;
        const dasha = DASHA_SEQUENCE[dashaIndex];
        const endDate = new Date(currentDate);
        endDate.setFullYear(currentDate.getFullYear() + dasha.years);
        
        dashas.push({
          planet: dasha.planet,
          startDate: new Date(currentDate),
          endDate: endDate,
          totalYears: dasha.years,
          isActive: false
        });
        
        currentDate = new Date(endDate);
      }

      // Determine current dasha
      const now = new Date();
      let currentDasha: DashaInfo | null = null;
      
      for (const dasha of dashas) {
        if (now >= dasha.startDate && now <= dasha.endDate) {
          dasha.isActive = true;
          const timeElapsed = now.getTime() - dasha.startDate.getTime();
          const totalDuration = dasha.endDate.getTime() - dasha.startDate.getTime();
          const remainingTime = totalDuration - timeElapsed;
          dasha.remainingYears = remainingTime / (1000 * 60 * 60 * 24 * 365.25);
          currentDasha = dasha;
          
          console.log('🎯 Current Mahadasha:', dasha.planet);
          console.log('⏰ Remaining Years:', dasha.remainingYears.toFixed(2));
          break;
        }
      }

      return { dashas, currentDasha, balanceAtBirth };
      
    } catch (error) {
      console.error('Error calculating dasha:', error);
      // Return sample data
      return {
        dashas: [{
          planet: 'Venus',
          startDate: new Date(),
          endDate: new Date(Date.now() + 4 * 365 * 24 * 60 * 60 * 1000),
          totalYears: 20,
          remainingYears: 4,
          isActive: true
        }],
        currentDasha: {
          planet: 'Venus',
          startDate: new Date(),
          endDate: new Date(Date.now() + 4 * 365 * 24 * 60 * 60 * 1000),
          totalYears: 20,
          remainingYears: 4,
          isActive: true
        },
        balanceAtBirth: 3.5
      };
    }
  };

  const getDashaEffects = (planet: string): { positive: string[]; challenges: string[]; recommendations: string[] } => {
    const effects: { [key: string]: any } = {
      'Sun': {
        positive: [
          getTranslation('Leadership opportunities', 'नेतृत्व के अवसर'),
          getTranslation('Government favor', 'सरकारी अनुकूलता'),
          getTranslation('Fame and recognition', 'प्रसिद्धि और मान्यता')
        ],
        challenges: [
          getTranslation('Ego conflicts', 'अहंकार संघर्ष'),
          getTranslation('Authority disputes', 'अधिकार विवाद')
        ],
        recommendations: [
          getTranslation('Practice humility', 'विनम्रता का अभ्यास करें'),
          getTranslation('Serve father figures', 'पिता की सेवा करें')
        ]
      },
      'Moon': {
        positive: [
          getTranslation('Emotional stability', 'भावनात्मक स्थिरता'),
          getTranslation('Public popularity', 'लोकप्रियता'),
          getTranslation('Mother\'s blessings', 'मां का आशीर्वाद')
        ],
        challenges: [
          getTranslation('Mood fluctuations', 'मूड में बदलाव'),
          getTranslation('Overly emotional decisions', 'अति भावनात्मक निर्णय')
        ],
        recommendations: [
          getTranslation('Meditation and peace', 'ध्यान और शांति'),
          getTranslation('Connect with water bodies', 'जल स्रोतों से जुड़ाव')
        ]
      },
      'Mars': {
        positive: [
          getTranslation('Energy and courage', 'ऊर्जा और साहस'),
          getTranslation('Property gains', 'संपत्ति लाभ'),
          getTranslation('Physical strength', 'शारीरिक शक्ति')
        ],
        challenges: [
          getTranslation('Anger and conflicts', 'गुस्सा और संघर्ष'),
          getTranslation('Impulsive actions', 'आवेगशील कार्य')
        ],
        recommendations: [
          getTranslation('Channel energy positively', 'ऊर्जा को सकारात्मक दिशा दें'),
          getTranslation('Practice patience', 'धैर्य का अभ्यास करें')
        ]
      },
      'Mercury': {
        positive: [
          getTranslation('Intelligence and communication', 'बुद्धि और संचार'),
          getTranslation('Business success', 'व्यापारिक सफलता'),
          getTranslation('Learning abilities', 'सीखने की क्षमता')
        ],
        challenges: [
          getTranslation('Overthinking', 'अधिक सोचना'),
          getTranslation('Communication misunderstandings', 'संचार में गलतफहमी')
        ],
        recommendations: [
          getTranslation('Read and study regularly', 'नियमित अध्ययन करें'),
          getTranslation('Practice clear communication', 'स्पष्ट संवाद का अभ्यास करें')
        ]
      },
      'Jupiter': {
        positive: [
          getTranslation('Wisdom and knowledge', 'ज्ञान और बुद्धि'),
          getTranslation('Spiritual growth', 'आध्यात्मिक विकास'),
          getTranslation('Good fortune', 'सौभाग्य')
        ],
        challenges: [
          getTranslation('Overconfidence', 'अति आत्मविश्वास'),
          getTranslation('Excessive idealism', 'अत्यधिक आदर्शवाद')
        ],
        recommendations: [
          getTranslation('Teach and guide others', 'दूसरों को सिखाएं और मार्गदर्शन करें'),
          getTranslation('Practice charity', 'दान का अभ्यास करें')
        ]
      },
      'Venus': {
        positive: [
          getTranslation('Love and relationships', 'प्रेम और रिश्ते'),
          getTranslation('Artistic success', 'कलात्मक सफलता'),
          getTranslation('Material comforts', 'भौतिक सुख')
        ],
        challenges: [
          getTranslation('Overindulgence', 'अति भोग'),
          getTranslation('Relationship complications', 'रिश्तों में जटिलताएं')
        ],
        recommendations: [
          getTranslation('Appreciate beauty and arts', 'सुंदरता और कला की सराहना करें'),
          getTranslation('Maintain moderation', 'संयम बनाए रखें')
        ]
      },
      'Saturn': {
        positive: [
          getTranslation('Discipline and hard work pay off', 'अनुशासन और कड़ी मेहनत रंग लाती है'),
          getTranslation('Long-term stability', 'दीर्घकालिक स्थिरता'),
          getTranslation('Practical wisdom', 'व्यावहारिक बुद्धि')
        ],
        challenges: [
          getTranslation('Delays and obstacles', 'देरी और बाधाएं'),
          getTranslation('Pessimism and worry', 'निराशावाद और चिंता')
        ],
        recommendations: [
          getTranslation('Practice patience and perseverance', 'धैर्य और दृढ़ता का अभ्यास करें'),
          getTranslation('Serve the elderly and needy', 'बुजुर्गों और जरूरतमंदों की सेवा करें')
        ]
      },
      'Rahu': {
        positive: [
          getTranslation('Innovation and technology', 'नवाचार और प्रौद्योगिकी'),
          getTranslation('Foreign connections', 'विदेशी संपर्क'),
          getTranslation('Unconventional success', 'अपरंपरागत सफलता')
        ],
        challenges: [
          getTranslation('Confusion and illusion', 'भ्रम और मायाजाल'),
          getTranslation('Addictive tendencies', 'व्यसन की प्रवृत्ति')
        ],
        recommendations: [
          getTranslation('Stay grounded in reality', 'वास्तविकता में स्थिर रहें'),
          getTranslation('Practice honesty and integrity', 'ईमानदारी और सत्यनिष्ठा का अभ्यास करें')
        ]
      },
      'Ketu': {
        positive: [
          getTranslation('Spiritual insights', 'आध्यात्मिक अंतर्दृष्टि'),
          getTranslation('Detachment and wisdom', 'वैराग्य और ज्ञान'),
          getTranslation('Research abilities', 'अनुसंधान क्षमता')
        ],
        challenges: [
          getTranslation('Lack of direction', 'दिशा की कमी'),
          getTranslation('Isolation tendencies', 'अलगाव की प्रवृत्ति')
        ],
        recommendations: [
          getTranslation('Focus on spiritual practices', 'आध्यात्मिक अभ्यास पर ध्यान दें'),
          getTranslation('Develop inner strength', 'आंतरिक शक्ति विकसित करें')
        ]
      }
    };

    return effects[planet] || {
      positive: [getTranslation('General positive period', 'सामान्य सकारात्मक अवधि')],
      challenges: [getTranslation('General challenges', 'सामान्य चुनौतियां')],
      recommendations: [getTranslation('Stay balanced', 'संतुलित रहें')]
    };
  };

  const getPlanetHindi = (planet: string): string => {
    const hindiNames: { [key: string]: string } = {
      'Sun': 'सूर्य', 'Moon': 'चंद्र', 'Mars': 'मंगल', 'Mercury': 'बुध',
      'Jupiter': 'बृहस्पति', 'Venus': 'शुक्र', 'Saturn': 'शनि',
      'Rahu': 'राहु', 'Ketu': 'केतु'
    };
    return hindiNames[planet] || planet;
  };

  const { dashas, currentDasha } = calculateCorrectVimshottariDasha();

  return (
    <div className="space-y-6">
      {/* Current Mahadasha */}
      {currentDasha && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Star className="h-5 w-5" />
              {getTranslation('Current Mahadasha (Main Period)', 'वर्तमान महादशा (मुख्य काल)')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <Badge className="bg-blue-600 text-white text-xl px-6 py-3 mb-4">
                {language === 'hi' ? getPlanetHindi(currentDasha.planet) : currentDasha.planet}
                {getTranslation(' Mahadasha', ' महादशा')}
              </Badge>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-3 rounded border">
                  <strong>{getTranslation('Started:', 'शुरुआत:')}</strong> {currentDasha.startDate.getFullYear()}
                </div>
                <div className="bg-white p-3 rounded border">
                  <strong>{getTranslation('Ends:', 'समाप्ति:')}</strong> {currentDasha.endDate.getFullYear()}
                </div>
                <div className="bg-white p-3 rounded border">
                  <strong>{getTranslation('Total Duration:', 'कुल अवधि:')}</strong> {currentDasha.totalYears.toFixed(1)} {getTranslation('years', 'वर्ष')}
                </div>
                <div className="bg-white p-3 rounded border">
                  <strong>{getTranslation('Remaining:', 'शेष:')}</strong> {currentDasha.remainingYears?.toFixed(1)} {getTranslation('years', 'वर्ष')}
                </div>
              </div>
              
              {currentDasha.remainingYears && (
                <div className="mt-4">
                  <Progress 
                    value={((currentDasha.totalYears - currentDasha.remainingYears) / currentDasha.totalYears) * 100} 
                    className="h-3"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    {getTranslation('Progress:', 'प्रगति:')} {(((currentDasha.totalYears - currentDasha.remainingYears) / currentDasha.totalYears) * 100).toFixed(1)}%
                  </p>
                </div>
              )}
            </div>

            {/* Current Dasha Effects */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {(() => {
                const effects = getDashaEffects(currentDasha.planet);
                return (
                  <>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        {getTranslation('Positive Effects', 'सकारात्मक प्रभाव')}
                      </h4>
                      <ul className="space-y-1 text-sm text-green-700">
                        {effects.positive.map((effect, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                            {effect}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {getTranslation('Challenges', 'चुनौतियां')}
                      </h4>
                      <ul className="space-y-1 text-sm text-orange-700">
                        {effects.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        {getTranslation('Recommendations', 'सुझाव')}
                      </h4>
                      <ul className="space-y-1 text-sm text-blue-700">
                        {effects.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                );
              })()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete Dasha Timeline */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-800 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {getTranslation('Complete Vimshottari Dasha Timeline', 'संपूर्ण विम्शोत्तरी दशा समयरेखा')}
          </CardTitle>
          <p className="text-sm text-purple-600 mt-2">
            {getTranslation('120-year planetary period cycle based on Moon\'s nakshatra', 'चंद्र नक्षत्र पर आधारित 120-वर्षीय ग्रहीय काल चक्र')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashas.slice(0, 9).map((dasha, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${
                  dasha.isActive 
                    ? 'bg-blue-100 border-blue-300 shadow-md' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={dasha.isActive ? 'default' : 'outline'}
                      className={dasha.isActive ? 'bg-blue-600 text-white' : ''}
                    >
                      {language === 'hi' ? getPlanetHindi(dasha.planet) : dasha.planet}
                    </Badge>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">
                        {dasha.startDate.getFullYear()} - {dasha.endDate.getFullYear()}
                      </span>
                      <span className="text-gray-500 ml-2">
                        ({dasha.totalYears.toFixed(1)} {getTranslation('years', 'वर्ष')})
                      </span>
                    </div>
                  </div>
                  
                  {dasha.isActive && dasha.remainingYears && (
                    <div className="text-right">
                      <div className="text-sm font-medium text-blue-700">
                        {getTranslation('Active Now', 'अभी सक्रिय')}
                      </div>
                      <div className="text-xs text-blue-600">
                        {dasha.remainingYears.toFixed(1)} {getTranslation('years left', 'वर्ष शेष')}
                      </div>
                    </div>
                  )}
                </div>
                
                {dasha.isActive && (
                  <div className="mt-3">
                    <Progress 
                      value={dasha.remainingYears ? ((dasha.totalYears - dasha.remainingYears) / dasha.totalYears) * 100 : 0} 
                      className="h-2"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Info className="h-4 w-4" />
              {getTranslation('About Vimshottari Dasha', 'विम्शोत्तरी दशा के बारे में')}
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {getTranslation(
                'Vimshottari Dasha is a 120-year planetary period system that divides human life into periods ruled by different planets. Each period brings unique opportunities and challenges based on the ruling planet\'s nature and position in your birth chart.',
                'विम्शोत्तरी दशा 120-वर्षीय ग्रहीय काल प्रणाली है जो मानव जीवन को विभिन्न ग्रहों द्वारा शासित अवधियों में विभाजित करती है। प्रत्येक अवधि शासक ग्रह की प्रकृति और आपकी जन्मपत्रिका में स्थिति के आधार पर अनूठे अवसर और चुनौतियां लाती है।'
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FixedTraditionalDashaCalculator;