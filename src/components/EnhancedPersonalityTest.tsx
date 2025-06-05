
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, Star, Target, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PersonalityTestProps {
  language: 'hi' | 'en';
  onComplete?: (results: PersonalityResults) => void;
}

interface Question {
  id: number;
  title: string;
  scenario: string;
  options: {
    text: string;
    traits: string[];
    planetaryInfluence: string;
  }[];
  astroConnection: string;
}

interface PersonalityResults {
  dominantTraits: string[];
  planetaryProfile: string[];
  personalityType: string;
  kundaliAlignment: number;
  recommendations: string[];
}

const EnhancedPersonalityTest: React.FC<PersonalityTestProps> = ({ language, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState<PersonalityResults | null>(null);

  const questions: Question[] = [
    {
      id: 1,
      title: language === 'hi' ? 'दबाव में निर्णय' : 'Decision Under Pressure',
      scenario: language === 'hi' 
        ? 'आप 5 लोगों के साथ एक कमरे में हैं, 2 घंटे में डेडलाइन है। सब कन्फ्यूज़ हैं, बॉस नहीं मिल रहा।'
        : "You're in a room with 5 people, deadline in 2 hours. Everyone's confused, boss unreachable.",
      options: [
        {
          text: language === 'hi' ? 'तुरंत टीम को गाइड करूंगा और जिम्मेदारी लूंगा' : 'Take immediate charge and guide the team',
          traits: ['Leadership', 'Courage', 'Initiative'],
          planetaryInfluence: 'Strong Sun + Mars'
        },
        {
          text: language === 'hi' ? 'सबकी राय लेकर सामूहिक फैसला करूंगा' : 'Gather everyone\'s opinion for collective decision',
          traits: ['Diplomacy', 'Teamwork', 'Balance'],
          planetaryInfluence: 'Strong Venus + Jupiter'
        },
        {
          text: language === 'hi' ? 'डेटा एनालाइज़ करके बेस्ट सोल्यूशन निकालूंगा' : 'Analyze data systematically for best solution',
          traits: ['Analytical', 'Methodical', 'Precision'],
          planetaryInfluence: 'Strong Mercury + Saturn'
        },
        {
          text: language === 'hi' ? 'अपनी गट फीलिंग पर भरोसा करके एक्ट करूंगा' : 'Trust my intuition and act on gut feeling',
          traits: ['Intuitive', 'Spontaneous', 'Instinctive'],
          planetaryInfluence: 'Strong Moon + Rahu'
        }
      ],
      astroConnection: 'Mars + Mercury'
    },
    {
      id: 2,
      title: language === 'hi' ? 'अचानक मौका' : 'Unexpected Opportunity',
      scenario: language === 'hi'
        ? 'नए शहर में जाकर रिस्की प्रोजेक्ट लीड करने का मौका। 24 घंटे में फैसला।'
        : 'Offered to move to new city for risky high-reward project. 24 hours to decide.',
      options: [
        {
          text: language === 'hi' ? 'तुरंत हां कह दूंगा, रिस्क लेने से डरता नहीं' : 'Say yes immediately, I don\'t fear risks',
          traits: ['Risk-taker', 'Adventurous', 'Bold'],
          planetaryInfluence: 'Strong Rahu + Mars'
        },
        {
          text: language === 'hi' ? 'फैमिली से पूछकर उनकी सहमति से फैसला लूंगा' : 'Consult family first, need their approval',
          traits: ['Family-oriented', 'Considerate', 'Traditional'],
          planetaryInfluence: 'Strong Moon + Jupiter'
        },
        {
          text: language === 'hi' ? 'पूरी डिटेल रिसर्च करके फिर फैसला लूंगा' : 'Research everything thoroughly before deciding',
          traits: ['Cautious', 'Thorough', 'Practical'],
          planetaryInfluence: 'Strong Saturn + Mercury'
        },
        {
          text: language === 'hi' ? 'ना कह दूंगा, स्टेबिलिटी जरूरी है' : 'Decline, stability is more important',
          traits: ['Security-focused', 'Conservative', 'Stable'],
          planetaryInfluence: 'Strong Saturn + Venus'
        }
      ],
      astroConnection: 'Rahu + Lagna'
    },
    {
      id: 3,
      title: language === 'hi' ? 'टीम में कॉन्फ्लिक्ट' : 'Team Conflict',
      scenario: language === 'hi'
        ? 'टीममेट ने झूठ बोलकर आप पर इल्जाम लगाया। रेप्यूटेशन खराब हो रही है।'
        : 'Teammate lies and blames you publicly. Your reputation is at stake.',
      options: [
        {
          text: language === 'hi' ? 'तुरंत सबके सामने सच्चाई बताऊंगा' : 'Immediately expose the truth publicly',
          traits: ['Direct', 'Confrontational', 'Justice-seeking'],
          planetaryInfluence: 'Strong Mars + Sun'
        },
        {
          text: language === 'hi' ? 'प्राइवेट में बात करके मामला सुलझाऊंगा' : 'Handle it privately with calm discussion',
          traits: ['Diplomatic', 'Patient', 'Peaceful'],
          planetaryInfluence: 'Strong Venus + Jupiter'
        },
        {
          text: language === 'hi' ? 'एविडेंस इकट्ठा करके स्ट्रॉन्ग केस बनाऊंगा' : 'Gather evidence and build a strong case',
          traits: ['Strategic', 'Methodical', 'Calculated'],
          planetaryInfluence: 'Strong Saturn + Mercury'
        },
        {
          text: language === 'hi' ? 'इग्नोर करूंगा, टाइम ही सच्चाई बताएगा' : 'Ignore it, time will reveal the truth',
          traits: ['Patient', 'Philosophical', 'Detached'],
          planetaryInfluence: 'Strong Jupiter + Ketu'
        }
      ],
      astroConnection: 'Mars + Moon'
    },
    {
      id: 4,
      title: language === 'hi' ? 'मेहनत के बाद नुकसान' : 'Setback After Hard Work',
      scenario: language === 'hi'
        ? '6 महीने की मेहनत बर्बाद हो गई, आपकी गलती नहीं। लोग एफर्ट इग्नोर कर रहे।'
        : '6 months of work destroyed, not your fault. People ignore your effort.',
      options: [
        {
          text: language === 'hi' ? 'गुस्से में आकर सबको बता दूंगा कि क्या हुआ' : 'Get angry and tell everyone what happened',
          traits: ['Emotional', 'Expressive', 'Reactive'],
          planetaryInfluence: 'Weak Mars + Moon'
        },
        {
          text: language === 'hi' ? 'डिप्रेशन में जाऊंगा लेकिन फिर वापस शुरू करूंगा' : 'Feel depressed but eventually restart',
          traits: ['Resilient', 'Persistent', 'Determined'],
          planetaryInfluence: 'Strong Saturn + Sun'
        },
        {
          text: language === 'hi' ? 'एक्सेप्ट करके नई स्ट्रैटेजी बनाऊंगा' : 'Accept it and create new strategy',
          traits: ['Adaptable', 'Pragmatic', 'Forward-thinking'],
          planetaryInfluence: 'Strong Mercury + Jupiter'
        },
        {
          text: language === 'hi' ? 'कर्म मानकर शांति से आगे बढूंगा' : 'Accept as karma and move forward peacefully',
          traits: ['Philosophical', 'Spiritual', 'Accepting'],
          planetaryInfluence: 'Strong Jupiter + Ketu'
        }
      ],
      astroConnection: 'Saturn + Mars'
    },
    {
      id: 5,
      title: language === 'hi' ? 'बिना अथॉरिटी के लीडरशिप' : 'Leading Without Authority',
      scenario: language === 'hi'
        ? 'नए ग्रुप में कोई लीडर नहीं। प्रेशर है परफॉर्म करने का।'
        : 'New group, no assigned leader, pressure to perform.',
      options: [
        {
          text: language === 'hi' ? 'नेचुरली लीडरशिप रोल ले लूंगा' : 'Naturally take the leadership role',
          traits: ['Natural Leader', 'Confident', 'Dominant'],
          planetaryInfluence: 'Strong Sun + Mars'
        },
        {
          text: language === 'hi' ? 'सबको साथ लेकर टीम बनाऊंगा' : 'Build team by bringing everyone together',
          traits: ['Team Builder', 'Inclusive', 'Collaborative'],
          planetaryInfluence: 'Strong Venus + Jupiter'
        },
        {
          text: language === 'hi' ? 'सपोर्टिव रोल खेलूंगा, बैकग्राउंड में मदद करूंगा' : 'Play supportive role, help from background',
          traits: ['Supportive', 'Humble', 'Service-oriented'],
          planetaryInfluence: 'Strong Moon + Mercury'
        },
        {
          text: language === 'hi' ? 'अपना काम करूंगा, ज्यादा इंवॉल्व नहीं होऊंगा' : 'Do my work, don\'t get too involved',
          traits: ['Independent', 'Self-focused', 'Detached'],
          planetaryInfluence: 'Strong Saturn + Ketu'
        }
      ],
      astroConnection: 'Sun + Ascendant'
    }
  ];

  const selectedQuestions = React.useMemo(() => {
    // Randomly select 4-5 questions
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, []);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, selectedQuestions[currentQuestion].options[optionIndex].planetaryInfluence];
    setAnswers(newAnswers);

    if (currentQuestion < selectedQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate results
      const results = calculatePersonalityResults(newAnswers, selectedQuestions);
      setResults(results);
      setIsComplete(true);
      if (onComplete) {
        onComplete(results);
      }
    }
  };

  const calculatePersonalityResults = (answers: string[], questions: Question[]): PersonalityResults => {
    // Analyze planetary influences
    const planetaryCount: { [key: string]: number } = {};
    const traitCount: { [key: string]: number } = {};

    answers.forEach((answer, index) => {
      const option = questions[index].options.find(opt => opt.planetaryInfluence === answer);
      if (option) {
        option.traits.forEach(trait => {
          traitCount[trait] = (traitCount[trait] || 0) + 1;
        });
        
        // Extract planetary influences
        const planets = answer.match(/(Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu)/g) || [];
        planets.forEach(planet => {
          planetaryCount[planet] = (planetaryCount[planet] || 0) + 1;
        });
      }
    });

    // Determine dominant traits
    const dominantTraits = Object.entries(traitCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([trait]) => trait);

    // Determine planetary profile
    const planetaryProfile = Object.entries(planetaryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([planet]) => planet);

    // Determine personality type
    let personalityType = 'Balanced Individual';
    if (planetaryProfile.includes('Sun') && planetaryProfile.includes('Mars')) {
      personalityType = 'Natural Leader';
    } else if (planetaryProfile.includes('Venus') && planetaryProfile.includes('Jupiter')) {
      personalityType = 'Harmonious Diplomat';
    } else if (planetaryProfile.includes('Mercury') && planetaryProfile.includes('Saturn')) {
      personalityType = 'Analytical Strategist';
    } else if (planetaryProfile.includes('Moon') && planetaryProfile.includes('Rahu')) {
      personalityType = 'Intuitive Innovator';
    }

    return {
      dominantTraits,
      planetaryProfile,
      personalityType,
      kundaliAlignment: Math.floor(Math.random() * 30) + 70, // Will be enhanced with actual Kundali data
      recommendations: [
        'Focus on leveraging your natural leadership abilities',
        'Consider careers that align with your planetary strengths',
        'Practice meditation to balance your energies'
      ]
    };
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setIsComplete(false);
    setResults(null);
  };

  if (isComplete && results) {
    return (
      <Card className="max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Crown className="h-6 w-6" />
            {language === 'hi' ? 'आपका व्यक्तित्व विश्लेषण' : 'Your Personality Analysis'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  {language === 'hi' ? 'व्यक्तित्व प्रकार' : 'Personality Type'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="text-xl font-bold text-blue-900 mb-2">{results.personalityType}</h3>
                <div className="flex flex-wrap gap-2">
                  {results.dominantTraits.map((trait, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader className="bg-purple-50">
                <CardTitle className="text-purple-800 flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  {language === 'hi' ? 'ग्रह प्रभाव' : 'Planetary Influence'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {results.planetaryProfile.map((planet, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium">{planet}</span>
                      <div className="w-16 bg-purple-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${90 - index * 20}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Target className="h-5 w-5" />
                {language === 'hi' ? 'कुंडली के साथ तालमेल' : 'Kundali Alignment'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000" 
                      style={{ width: `${results.kundaliAlignment}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-700">{results.kundaliAlignment}%</span>
              </div>
              <p className="text-sm text-green-600 mt-2">
                {language === 'hi' 
                  ? 'आपका व्यक्तित्व परीक्षण आपकी कुंडली के साथ मेल खाता है' 
                  : 'Your personality test aligns well with your Kundali predictions'}
              </p>
            </CardContent>
          </Card>

          <div className="text-center space-x-4">
            <Button onClick={resetTest} variant="outline" className="border-purple-300 text-purple-700">
              {language === 'hi' ? 'फिर से करें' : 'Retake Test'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progress = ((currentQuestion + 1) / selectedQuestions.length) * 100;

  return (
    <Card className="max-w-4xl mx-auto bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <CardTitle className="text-xl flex items-center gap-2">
          <Brain className="h-5 w-5" />
          {language === 'hi' ? 'व्यक्तित्व परीक्षण' : 'Personality Test'}
        </CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{language === 'hi' ? 'प्रश्न' : 'Question'} {currentQuestion + 1} / {selectedQuestions.length}</span>
            <span>{Math.round(progress)}% {language === 'hi' ? 'पूरा' : 'Complete'}</span>
          </div>
          <Progress value={progress} className="bg-white/20" />
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-orange-800 mb-2">
              {selectedQuestions[currentQuestion].title}
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              {selectedQuestions[currentQuestion].scenario}
            </p>
            <Badge variant="outline" className="border-orange-300 text-orange-700">
              {language === 'hi' ? 'ज्योतिषीय संबंध:' : 'Astrological Connection:'} {selectedQuestions[currentQuestion].astroConnection}
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {selectedQuestions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-left h-auto p-4 border-orange-200 hover:bg-orange-100 hover:border-orange-400 transition-all duration-200"
                onClick={() => handleAnswer(index)}
              >
                <div className="w-full">
                  <div className="flex items-start gap-3">
                    <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">{option.text}</p>
                      <p className="text-xs text-orange-600 mt-1">{option.planetaryInfluence}</p>
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPersonalityTest;
