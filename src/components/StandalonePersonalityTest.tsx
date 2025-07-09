
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from '@/contexts/LanguageContext';
import { Brain, Star, Heart, Lightbulb, Target, ArrowRight, ArrowLeft } from 'lucide-react';

interface Question {
  id: number;
  question: { en: string; hi: string };
  trait: 'fire' | 'earth' | 'air' | 'water' | 'sattva' | 'rajas' | 'tamas';
}

const personalityQuestions: Question[] = [
  {
    id: 1,
    question: {
      en: "I prefer taking quick action rather than lengthy planning",
      hi: "मैं लंबी योजना के बजाय त्वरित कार्रवाई पसंद करता हूं"
    },
    trait: 'fire'
  },
  {
    id: 2,
    question: {
      en: "I feel most comfortable with routine and stability",
      hi: "मैं दिनचर्या और स्थिरता के साथ सबसे आरामदायक महसूस करता हूं"
    },
    trait: 'earth'
  },
  {
    id: 3,
    question: {
      en: "I love intellectual discussions and debates",
      hi: "मुझे बौद्धिक चर्चा और बहस पसंद है"
    },
    trait: 'air'
  },
  {
    id: 4,
    question: {
      en: "I make decisions based on my emotions and intuition",
      hi: "मैं अपनी भावनाओं और अंतर्ज्ञान के आधार पर निर्णय लेता हूं"
    },
    trait: 'water'
  },
  {
    id: 5,
    question: {
      en: "I seek harmony and peace in all situations",
      hi: "मैं सभी स्थितियों में सामंजस्य और शांति की तलाश करता हूं"
    },
    trait: 'sattva'
  },
  {
    id: 6,
    question: {
      en: "I am highly ambitious and driven to succeed",
      hi: "मैं अत्यधिक महत्वाकांक्षी हूं और सफल होने के लिए प्रेरित हूं"
    },
    trait: 'rajas'
  },
  {
    id: 7,
    question: {
      en: "I often feel lazy or unmotivated",
      hi: "मैं अक्सर आलसी या अप्रेरित महसूस करता हूं"
    },
    trait: 'tamas'
  },
  {
    id: 8,
    question: {
      en: "I am naturally optimistic and enthusiastic",
      hi: "मैं स्वाभाविक रूप से आशावादी और उत्साही हूं"
    },
    trait: 'fire'
  },
  {
    id: 9,
    question: {
      en: "I prefer practical solutions over theoretical ones",
      hi: "मैं सैद्धांतिक समाधानों की तुलना में व्यावहारिक समाधान पसंद करता हूं"
    },
    trait: 'earth'
  },
  {
    id: 10,
    question: {
      en: "I enjoy socializing and meeting new people",
      hi: "मुझे सामाजिकता और नए लोगों से मिलना पसंद है"
    },
    trait: 'air'
  },
  {
    id: 11,
    question: {
      en: "I am deeply empathetic and sensitive to others' feelings",
      hi: "मैं गहराई से सहानुभूतिशील हूं और दूसरों की भावनाओं के प्रति संवेदनशील हूं"
    },
    trait: 'water'
  },
  {
    id: 12,
    question: {
      en: "I value wisdom and spiritual growth above material success",
      hi: "मैं भौतिक सफलता से ऊपर ज्ञान और आध्यात्मिक विकास को महत्व देता हूं"
    },
    trait: 'sattva'
  },
  {
    id: 13,
    question: {
      en: "I thrive in competitive environments",
      hi: "मैं प्रतिस्पर्धी वातावरण में फलता-फूलता हूं"
    },
    trait: 'rajas'
  },
  {
    id: 14,
    question: {
      en: "I tend to procrastinate and avoid difficult tasks",
      hi: "मैं विलंब करता हूं और कठिन कार्यों से बचता हूं"
    },
    trait: 'tamas'
  },
  {
    id: 15,
    question: {
      en: "I am confident and natural leader",
      hi: "मैं आत्मविश्वासी और प्राकृतिक नेता हूं"
    },
    trait: 'fire'
  }
];

interface PersonalityResult {
  dominantElement: string;
  dominantGuna: string;
  elementScores: Record<string, number>;
  gunaScores: Record<string, number>;
  description: { en: string; hi: string };
  strengths: { en: string[]; hi: string[] };
  challenges: { en: string[]; hi: string[] };
  recommendations: { en: string[]; hi: string[] };
}

const StandalonePersonalityTest: React.FC = () => {
  const { language, t } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<PersonalityResult | null>(null);

  const handleAnswer = (value: number) => {
    setAnswers({ ...answers, [personalityQuestions[currentQuestion].id]: value });
  };

  const nextQuestion = () => {
    if (currentQuestion < personalityQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    const elementScores = { fire: 0, earth: 0, air: 0, water: 0 };
    const gunaScores = { sattva: 0, rajas: 0, tamas: 0 };

    personalityQuestions.forEach(question => {
      const answer = answers[question.id] || 3;
      if (['fire', 'earth', 'air', 'water'].includes(question.trait)) {
        elementScores[question.trait as keyof typeof elementScores] += answer;
      } else {
        gunaScores[question.trait as keyof typeof gunaScores] += answer;
      }
    });

    const dominantElement = Object.keys(elementScores).reduce((a, b) => 
      elementScores[a as keyof typeof elementScores] > elementScores[b as keyof typeof elementScores] ? a : b
    );

    const dominantGuna = Object.keys(gunaScores).reduce((a, b) => 
      gunaScores[a as keyof typeof gunaScores] > gunaScores[b as keyof typeof gunaScores] ? a : b
    );

    const personalityResult = generatePersonalityResult(dominantElement, dominantGuna, elementScores, gunaScores);
    setResult(personalityResult);
    setShowResults(true);
  };

  const generatePersonalityResult = (
    dominantElement: string, 
    dominantGuna: string, 
    elementScores: Record<string, number>,
    gunaScores: Record<string, number>
  ): PersonalityResult => {
    const combinations: Record<string, any> = {
      'fire-sattva': {
        description: {
          en: "You are a Spiritual Warrior - dynamic yet balanced, passionate about righteous causes.",
          hi: "आप एक आध्यात्मिक योद्धा हैं - गतिशील लेकिन संतुलित, धर्म के कारणों के लिए उत्साही।"
        },
        strengths: {
          en: ["Natural leadership", "Inspiring others", "Moral courage", "Quick decision making"],
          hi: ["प्राकृतिक नेतृत्व", "दूसरों को प्रेरित करना", "नैतिक साहस", "त्वरित निर्णय लेना"]
        },
        challenges: {
          en: ["Impatience with others", "Tendency to be overly critical", "Burnout from overcommitment"],
          hi: ["दूसरों के साथ अधीरता", "अत्यधिक आलोचनात्मक होने की प्रवृत्ति", "अत्यधिक प्रतिबद्धता से थकान"]
        },
        recommendations: {
          en: ["Practice meditation for patience", "Engage in regular physical exercise", "Take up teaching or mentoring"],
          hi: ["धैर्य के लिए ध्यान का अभ्यास करें", "नियमित शारीरिक व्यायाम करें", "शिक्षण या मार्गदर्शन करें"]
        }
      },
      'earth-sattva': {
        description: {
          en: "You are a Grounded Sage - practical wisdom combined with spiritual depth.",
          hi: "आप एक धरती से जुड़े ऋषि हैं - व्यावहारिक ज्ञान और आध्यात्मिक गहराई का संयोजन।"
        },
        strengths: {
          en: ["Reliability", "Practical wisdom", "Patience", "Creating stability for others"],
          hi: ["विश्वसनीयता", "व्यावहारिक ज्ञान", "धैर्य", "दूसरों के लिए स्थिरता बनाना"]
        },
        challenges: {
          en: ["Resistance to change", "Overly cautious", "Difficulty with spontaneity"],
          hi: ["परिवर्तन के प्रति प्रतिरोध", "अत्यधिक सतर्कता", "स्वतःस्फूर्तता में कठिनाई"]
        },
        recommendations: {
          en: ["Practice flexibility exercises", "Try new experiences gradually", "Focus on service to others"],
          hi: ["लचीलेपन के अभ्यास करें", "धीरे-धीरे नए अनुभव करें", "दूसरों की सेवा पर ध्यान दें"]
        }
      }
      // Add more combinations...
    };

    const key = `${dominantElement}-${dominantGuna}`;
    return combinations[key] || {
      description: {
        en: `You have a ${dominantElement}-${dominantGuna} personality type.`,
        hi: `आपका व्यक्तित्व ${dominantElement}-${dominantGuna} प्रकार का है।`
      },
      strengths: { en: [], hi: [] },
      challenges: { en: [], hi: [] },
      recommendations: { en: [], hi: [] },
      dominantElement,
      dominantGuna,
      elementScores,
      gunaScores
    };
  };

  const getCareerOptions = (element: string, lang: string) => {
    const careers: Record<string, any> = {
      fire: {
        en: [
          { emoji: '👨‍💼', title: 'Business Leader', description: 'Start companies, lead teams, make big decisions' },
          { emoji: '🎬', title: 'Entertainment', description: 'Actor, director, performer, artist' },
          { emoji: '⚖️', title: 'Lawyer', description: 'Fight for justice, argue cases, defend rights' },
          { emoji: '🚀', title: 'Entrepreneur', description: 'Create new products, innovate, take risks' }
        ],
        hi: [
          { emoji: '👨‍💼', title: 'व्यावसायिक नेता', description: 'कंपनियां शुरू करें, टीमों का नेतृत्व करें, बड़े फैसले लें' },
          { emoji: '🎬', title: 'मनोरंजन', description: 'अभिनेता, निर्देशक, कलाकार, प्रदर्शनकर्ता' },
          { emoji: '⚖️', title: 'वकील', description: 'न्याय के लिए लड़ें, मामलों की पैरवी करें' },
          { emoji: '🚀', title: 'उद्यमी', description: 'नए उत्पाद बनाएं, नवाचार करें, जोखिम उठाएं' }
        ]
      },
      earth: {
        en: [
          { emoji: '🏥', title: 'Healthcare', description: 'Doctor, nurse, therapist, help people heal' },
          { emoji: '🏗️', title: 'Engineering', description: 'Build bridges, design systems, solve problems' },
          { emoji: '💰', title: 'Finance', description: 'Banking, accounting, financial planning' },
          { emoji: '👨‍🌾', title: 'Agriculture', description: 'Farming, environmental work, sustainability' }
        ],
        hi: [
          { emoji: '🏥', title: 'स्वास्थ्य सेवा', description: 'डॉक्टर, नर्स, चिकित्सक, लोगों की मदद करें' },
          { emoji: '🏗️', title: 'इंजीनियरिंग', description: 'पुल बनाएं, सिस्टम डिज़ाइन करें, समस्याएं हल करें' },
          { emoji: '💰', title: 'वित्त', description: 'बैंकिंग, लेखांकन, वित्तीय योजना' },
          { emoji: '👨‍🌾', title: 'कृषि', description: 'खेती, पर्यावरण कार्य, स्थिरता' }
        ]
      },
      air: {
        en: [
          { emoji: '👨‍🏫', title: 'Education', description: 'Teacher, professor, trainer, share knowledge' },
          { emoji: '📰', title: 'Media & Communication', description: 'Journalist, writer, social media manager' },
          { emoji: '💻', title: 'Technology', description: 'Software developer, tech consultant, innovator' },
          { emoji: '🎨', title: 'Creative Arts', description: 'Designer, artist, creative director' }
        ],
        hi: [
          { emoji: '👨‍🏫', title: 'शिक्षा', description: 'शिक्षक, प्रोफेसर, प्रशिक्षक, ज्ञान साझा करें' },
          { emoji: '📰', title: 'मीडिया और संचार', description: 'पत्रकार, लेखक, सोशल मीडिया प्रबंधक' },
          { emoji: '💻', title: 'तकनीक', description: 'सॉफ्टवेयर डेवलपर, तकनीकी सलाहकार, नवप्रवर्तक' },
          { emoji: '🎨', title: 'रचनात्मक कला', description: 'डिज़ाइनर, कलाकार, रचनात्मक निर्देशक' }
        ]
      },
      water: {
        en: [
          { emoji: '🧠', title: 'Psychology', description: 'Counselor, therapist, help people emotionally' },
          { emoji: '👥', title: 'Social Work', description: 'Help communities, support those in need' },
          { emoji: '🎭', title: 'Arts & Music', description: 'Musician, artist, express deep emotions' },
          { emoji: '🌿', title: 'Healing Arts', description: 'Alternative medicine, yoga instructor, wellness' }
        ],
        hi: [
          { emoji: '🧠', title: 'मनोविज्ञान', description: 'परामर्शदाता, चिकित्सक, भावनात्मक मदद करें' },
          { emoji: '👥', title: 'सामाजिक कार्य', description: 'समुदायों की मदद करें, जरूरतमंदों का समर्थन करें' },
          { emoji: '🎭', title: 'कला और संगीत', description: 'संगीतकार, कलाकार, गहरी भावनाओं को व्यक्त करें' },
          { emoji: '🌿', title: 'उपचार कला', description: 'वैकल्पिक चिकित्सा, योग प्रशिक्षक, कल्याण' }
        ]
      }
    };

    return careers[element]?.[lang] || [];
  };

  const restartTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setResult(null);
  };

  const progress = ((currentQuestion + 1) / personalityQuestions.length) * 100;

  if (showResults && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg p-6">
              <div className="flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 mr-3" />
                <CardTitle className="text-2xl md:text-3xl">{t('personality_test_title')}</CardTitle>
              </div>
              <p className="text-purple-100">{t('your_cosmic_personality')}</p>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              {/* Personality Type Header */}
              <div className="text-center">
                <div className="inline-flex items-center bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg">
                  <Brain className="h-5 w-5 mr-2" />
                  {result.dominantElement === 'fire' && language === 'en' ? '🔥 Fire Person' : 
                   result.dominantElement === 'fire' && language === 'hi' ? '🔥 अग्नि व्यक्तित्व' :
                   result.dominantElement === 'earth' && language === 'en' ? '🌍 Earth Person' :
                   result.dominantElement === 'earth' && language === 'hi' ? '🌍 पृथ्वी व्यक्तित्व' :
                   result.dominantElement === 'air' && language === 'en' ? '💨 Air Person' :
                   result.dominantElement === 'air' && language === 'hi' ? '💨 वायु व्यक्तित्व' :
                   result.dominantElement === 'water' && language === 'en' ? '💧 Water Person' :
                   '💧 जल व्यक्तित्व'}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {language === 'en' ? 'Your dominant personality type' : 'आपका मुख्य व्यक्तित्व प्रकार'}
                </p>
              </div>

              {/* Power Percentages */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-center mb-4 text-gray-800 dark:text-gray-200">
                  🌟 {language === 'en' ? 'Your Power Levels' : 'आपकी शक्ति के स्तर'}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(result.elementScores).map(([element, score]) => {
                    const percentage = Math.round((score / 15) * 100);
                    const elementEmoji = element === 'fire' ? '🔥' : element === 'earth' ? '🌍' : element === 'air' ? '💨' : '💧';
                    const elementName = element === 'fire' ? (language === 'en' ? 'Fire Energy' : 'अग्नि ऊर्जा') :
                                      element === 'earth' ? (language === 'en' ? 'Earth Energy' : 'पृथ्वी ऊर्जा') :
                                      element === 'air' ? (language === 'en' ? 'Air Energy' : 'वायु ऊर्जा') :
                                      (language === 'en' ? 'Water Energy' : 'जल ऊर्जा');
                    
                    return (
                      <div key={element} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                        <div className="text-center">
                          <div className="text-2xl mb-1">{elementEmoji}</div>
                          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{elementName}</div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{percentage}%</div>
                          <Progress value={percentage} className="h-2 mt-2" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Simple Description */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl border-l-4 border-yellow-400">
                <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200 flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  {language === 'en' ? 'What This Means For You' : 'आपके लिए इसका क्या मतलब है'}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {result.description[language]}
                </p>
              </div>

              {/* Career & Use Cases */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400 flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    💪 {language === 'en' ? 'Your Superpowers' : 'आपकी महाशक्तियां'}
                  </h3>
                  <div className="space-y-3">
                    {result.strengths[language].map((strength, index) => (
                      <div key={index} className="flex items-start bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                        <span className="text-green-500 mr-3 text-lg">✨</span>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">{strength}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {language === 'en' ? 'This helps you shine in leadership and teamwork!' : 'यह आपको नेतृत्व और टीम वर्क में चमकने में मदद करता है!'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-4 text-orange-700 dark:text-orange-400 flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    🎯 {language === 'en' ? 'Things to Work On' : 'सुधार के क्षेत्र'}
                  </h3>
                  <div className="space-y-3">
                    {result.challenges[language].map((challenge, index) => (
                      <div key={index} className="flex items-start bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                        <span className="text-orange-500 mr-3 text-lg">🎯</span>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">{challenge}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {language === 'en' ? 'Working on this will make you even better!' : 'इस पर काम करने से आप और भी बेहतर बनेंगे!'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Career Options */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-400 flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  🚀 {language === 'en' ? 'Perfect Careers For You' : 'आपके लिए आदर्श करियर'}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {getCareerOptions(result.dominantElement, language).map((career, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-blue-400">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{career.emoji}</span>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{career.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{career.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Steps */}
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-400 flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  📝 {language === 'en' ? 'What You Can Do Today' : 'आज आप क्या कर सकते हैं'}
                </h3>
                <div className="space-y-3">
                  {result.recommendations[language].map((recommendation, index) => (
                    <div key={index} className="flex items-start bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                      <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{recommendation}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {language === 'en' ? 'Start small and build your confidence!' : 'छोटी शुरुआत करें और अपना आत्मविश्वास बढ़ाएं!'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={restartTest} variant="outline" className="flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('retake_test')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg p-6">
            <div className="flex items-center justify-center mb-4">
              <Brain className="h-8 w-8 mr-3" />
              <CardTitle className="text-2xl md:text-3xl">{t('personality_test_title')}</CardTitle>
            </div>
            <p className="text-purple-100">{t('personality_test_subtitle')}</p>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('question')} {currentQuestion + 1} {t('of')} {personalityQuestions.length}
                </span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="mb-8">
              <h3 className="text-lg md:text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100 leading-relaxed">
                {personalityQuestions[currentQuestion].question[language]}
              </h3>

              <div className="space-y-3">
                {[
                  { value: 1, label: t('strongly_disagree') },
                  { value: 2, label: t('disagree') },
                  { value: 3, label: t('neutral') },
                  { value: 4, label: t('agree') },
                  { value: 5, label: t('strongly_agree') }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      answers[personalityQuestions[currentQuestion].id] === option.value
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-25 dark:hover:bg-purple-900/10'
                    }`}
                  >
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                variant="outline"
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('back')}
              </Button>

              <Button
                onClick={nextQuestion}
                disabled={!answers[personalityQuestions[currentQuestion].id]}
                className="flex items-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {currentQuestion === personalityQuestions.length - 1 ? t('finish') : t('next')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StandalonePersonalityTest;
