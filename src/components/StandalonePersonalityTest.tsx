
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

  const getEnergyExplanation = (element: string, language: string) => {
    const explanations: Record<string, any> = {
      fire: {
        en: "Fire energy represents passion, action, and leadership. You're a natural born leader who loves to take charge and make things happen. You have incredible drive and enthusiasm that inspires others around you.",
        hi: "अग्नि ऊर्जा जुनून, कार्य और नेतृत्व का प्रतिनिधित्व करती है। आप एक प्राकृतिक नेता हैं जो जिम्मेदारी लेना और चीजों को साकार करना पसंद करते हैं।"
      },
      earth: {
        en: "Earth energy represents stability, practicality, and reliability. You're the rock that others lean on - steady, dependable, and always there when people need you. You build lasting foundations.",
        hi: "पृथ्वी ऊर्जा स्थिरता, व्यावहारिकता और विश्वसनीयता का प्रतिनिधित्व करती है। आप वह चट्टान हैं जिस पर दूसरे भरोसा करते हैं।"
      },
      air: {
        en: "Air energy represents communication, intellect, and social connection. You're a natural communicator who loves sharing ideas and connecting with people. Your mind is always buzzing with new thoughts.",
        hi: "वायु ऊर्जा संचार, बुद्धि और सामाजिक संपर्क का प्रतिनिधित्व करती है। आप एक प्राकृतिक संचारक हैं जो विचार साझा करना पसंद करते हैं।"
      },
      water: {
        en: "Water energy represents emotions, intuition, and healing. You feel deeply and understand others' emotions naturally. You have a gift for healing and helping people through difficult times.",
        hi: "जल ऊर्जा भावनाओं, अंतर्ज्ञान और उपचार का प्रतिनिधित्व करती है। आप गहराई से महसूस करते हैं और दूसरों की भावनाओं को समझते हैं।"
      }
    };
    return explanations[element]?.[language] || '';
  };

  const getLifeApproach = (element: string, language: string) => {
    const approaches: Record<string, any> = {
      fire: {
        en: "You tackle life head-on with confidence and courage. When you see a goal, you charge towards it with determination. You prefer action over endless planning and inspire others to follow your lead.",
        hi: "आप आत्मविश्वास और साहस के साथ जीवन का सामना करते हैं। जब आप कोई लक्ष्य देखते हैं, तो दृढ़ संकल्प के साथ उसकी ओर बढ़ते हैं।"
      },
      earth: {
        en: "You approach life with careful planning and steady progress. You build things to last and prefer proven methods over risky experiments. Security and stability are your priorities.",
        hi: "आप सावधानीपूर्वक योजना और स्थिर प्रगति के साथ जीवन से निपटते हैं। आप चीजों को टिकाऊ बनाते हैं और जोखिम भरे प्रयोगों पर सिद्ध तरीकों को प्राथमिकता देते हैं।"
      },
      air: {
        en: "You approach life through learning, sharing, and connecting. You love exploring new ideas and discussing them with others. Flexibility and variety keep you energized and engaged.",
        hi: "आप सीखने, साझा करने और जुड़ने के माध्यम से जीवन से निपटते हैं। आप नए विचारों की खोज करना और उन्हें दूसरों के साथ साझा करना पसंद करते हैं।"
      },
      water: {
        en: "You approach life with empathy and intuition as your guides. You feel your way through situations and make decisions based on what feels right in your heart. Helping others is your natural calling.",
        hi: "आप सहानुभूति और अंतर्ज्ञान को अपना मार्गदर्शक मानकर जीवन से निपटते हैं। आप स्थितियों को महसूस करते हैं और दिल में सही लगने के आधार पर निर्णय लेते हैं।"
      }
    };
    return approaches[element]?.[language] || '';
  };

  const getEnergyBalanceAnalysis = (elementScores: Record<string, number>, language: string) => {
    const sortedElements = Object.entries(elementScores).sort(([,a], [,b]) => b - a);
    const [highest, second, third, lowest] = sortedElements;
    
    const highestPercent = Math.round((highest[1] / 15) * 100);
    const secondPercent = Math.round((second[1] / 15) * 100);
    const gap = highestPercent - secondPercent;
    
    if (gap < 10) {
      return language === 'en' 
        ? `You have a beautifully balanced personality! Your ${highest[0]} energy (${highestPercent}%) works closely with your ${second[0]} energy (${secondPercent}%). This balance gives you flexibility and multiple approaches to handle different situations. You can be both ${highest[0] === 'fire' ? 'passionate' : highest[0] === 'earth' ? 'practical' : highest[0] === 'air' ? 'intellectual' : 'empathetic'} and ${second[0] === 'fire' ? 'passionate' : second[0] === 'earth' ? 'practical' : second[0] === 'air' ? 'intellectual' : 'empathetic'} depending on what the situation needs.`
        : `आपका व्यक्तित्व खूबसूरती से संतुलित है! आपकी ${highest[0]} ऊर्जा (${highestPercent}%) आपकी ${second[0]} ऊर्जा (${secondPercent}%) के साथ मिलकर काम करती है। यह संतुलन आपको लचीलापन देता है।`;
    } else {
      return language === 'en'
        ? `You have a strong ${highest[0]} personality (${highestPercent}%) with ${second[0]} as your secondary strength (${secondPercent}%). Your ${third[0]} and ${lowest[0]} energies are lower but still contribute to your unique personality blend. This strong ${highest[0]} energy makes you particularly good at ${highest[0] === 'fire' ? 'leading and taking action' : highest[0] === 'earth' ? 'creating stability and solving practical problems' : highest[0] === 'air' ? 'communicating and generating ideas' : 'understanding emotions and helping others heal'}.`
        : `आपका ${highest[0]} व्यक्तित्व मजबूत है (${highestPercent}%) और ${second[0]} आपकी द्वितीयक शक्ति है (${secondPercent}%)। यह मजबूत ${highest[0]} ऊर्जा आपको विशेष रूप से अच्छा बनाती है।`;
    }
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

  const getThingsToAvoid = (element: string, language: string) => {
    const avoidances: Record<string, any> = {
      fire: {
        en: [
          {
            title: "Being too Impulsive",
            description: "You might make quick decisions without thinking through the consequences.",
            solution: "Take a 5-minute pause before major decisions. Ask yourself: 'What could go wrong?'"
          },
          {
            title: "Burning Out from Overcommitment",
            description: "Your enthusiasm can lead you to say yes to too many things at once.",
            solution: "Use a calendar and limit yourself to 3 major commitments at a time."
          },
          {
            title: "Being Impatient with Others",
            description: "You might get frustrated when others can't keep up with your pace.",
            solution: "Remember that everyone has different speeds. Practice deep breathing when you feel impatient."
          }
        ],
        hi: [
          {
            title: "अत्यधिक आवेगशील होना",
            description: "आप परिणामों के बारे में सोचे बिना तुरंत निर्णय ले सकते हैं।",
            solution: "महत्वपूर्ण निर्णयों से पहले 5 मिनट रुकें। खुद से पूछें: 'क्या गलत हो सकता है?'"
          },
          {
            title: "अधिक प्रतिबद्धता से थकान",
            description: "आपका उत्साह आपको एक साथ बहुत सी चीजों के लिए हां कहने पर मजबूर कर सकता है।",
            solution: "कैलेंडर का उपयोग करें और खुद को एक समय में 3 मुख्य प्रतिबद्धताओं तक सीमित करें।"
          }
        ]
      },
      earth: {
        en: [
          {
            title: "Being Too Resistant to Change",
            description: "You might miss opportunities because you prefer familiar routines.",
            solution: "Try one small new thing each week. Start with low-risk changes like a new route to work."
          },
          {
            title: "Over-Planning and Under-Doing",
            description: "You might spend too much time planning and not enough time taking action.",
            solution: "Set a planning deadline. After 2 hours of planning, take one small action step."
          },
          {
            title: "Being Overly Critical of Mistakes",
            description: "You might be too hard on yourself and others when things don't go perfectly.",
            solution: "Practice the '80% rule' - if something is 80% right, that's often good enough to move forward."
          }
        ],
        hi: [
          {
            title: "परिवर्तन के प्रति अत्यधिक प्रतिरोध",
            description: "आप अवसरों को खो सकते हैं क्योंकि आप परिचित दिनचर्या को प्राथमिकता देते हैं।",
            solution: "हर सप्ताह एक छोटी नई चीज आजमाएं। कम जोखिम वाले बदलावों से शुरुआत करें।"
          }
        ]
      },
      air: {
        en: [
          {
            title: "Getting Scattered and Unfocused",
            description: "You might start many projects but have trouble finishing them.",
            solution: "Use the 'One Thing' rule - focus on completing one project before starting another."
          },
          {
            title: "Overthinking Simple Decisions",
            description: "You might analyze things so much that you get paralyzed by choices.",
            solution: "Set a decision deadline. For small choices, give yourself maximum 5 minutes to decide."
          },
          {
            title: "Talking More Than Listening",
            description: "Your love of sharing ideas might sometimes overwhelm others.",
            solution: "Practice the 70/30 rule - listen 70% of the time, talk 30% of the time."
          }
        ],
        hi: [
          {
            title: "बिखराव और ध्यान की कमी",
            description: "आप कई परियोजनाएं शुरू कर सकते हैं लेकिन उन्हें पूरा करने में कठिनाई हो सकती है।",
            solution: "'एक चीज' नियम का उपयोग करें - दूसरी शुरू करने से पहले एक परियोजना पूरी करने पर ध्यान दें।"
          }
        ]
      },
      water: {
        en: [
          {
            title: "Taking on Others' Emotions Too Much",
            description: "You might absorb others' negative feelings and make them your own.",
            solution: "Practice emotional boundaries. After helping someone, do a 5-minute meditation to release their emotions."
          },
          {
            title: "Avoiding Conflict Even When Necessary",
            description: "Your desire for harmony might prevent you from addressing important issues.",
            solution: "Remember that healthy conflict can strengthen relationships. Practice gentle honesty."
          },
          {
            title: "Being Too Self-Critical",
            description: "You might judge yourself harshly when you can't help everyone.",
            solution: "Practice self-compassion. Treat yourself with the same kindness you show others."
          }
        ],
        hi: [
          {
            title: "दूसरों की भावनाओं को अत्यधिक अपनाना",
            description: "आप दूसरों की नकारात्मक भावनाओं को अवशोषित कर सकते हैं और उन्हें अपना बना सकते हैं।",
            solution: "भावनात्मक सीमाओं का अभ्यास करें। किसी की मदद के बाद, उनकी भावनाओं को छोड़ने के लिए 5 मिनट का ध्यान करें।"
          }
        ]
      }
    };
    return avoidances[element]?.[language] || [];
  };

  const getPersonalizedGrowthPath = (dominantElement: string, elementScores: Record<string, number>, language: string) => {
    const sortedElements = Object.entries(elementScores).sort(([,a], [,b]) => b - a);
    const [highest, second] = sortedElements;
    const secondPercent = Math.round((second[1] / 15) * 100);
    
    const growthPaths: Record<string, any> = {
      fire: {
        en: `As a Fire spirit, focus on developing patience and emotional intelligence this month. Your natural leadership is strong, but balancing it with your ${second[0]} energy (${secondPercent}%) will make you even more effective. Practice active listening and consider others' perspectives before making decisions.`,
        hi: `अग्नि व्यक्तित्व के रूप में, इस महीने धैर्य और भावनात्मक बुद्धिमत्ता विकसित करने पर ध्यान दें। आपका प्राकृतिक नेतृत्व मजबूत है।`
      },
      earth: {
        en: `As an Earth guardian, work on embracing change and spontaneity this month. Your stability is your superpower, but incorporating your ${second[0]} energy (${secondPercent}%) will add flexibility. Try saying 'yes' to one unexpected opportunity each week.`,
        hi: `पृथ्वी संरक्षक के रूप में, इस महीने परिवर्तन और सहजता को अपनाने पर काम करें। आपकी स्थिरता आपकी महाशक्ति है।`
      },
      air: {
        en: `As an Air thinker, focus on turning ideas into action this month. Your creativity and communication skills are excellent, but combining them with your ${second[0]} energy (${secondPercent}%) will help you finish what you start. Set one concrete goal and stick to it.`,
        hi: `वायु चिंतक के रूप में, इस महीने विचारों को कार्यों में बदलने पर ध्यान दें। आपकी रचनात्मकता और संचार कौशल उत्कृष्ट हैं।`
      },
      water: {
        en: `As a Water healer, work on setting healthy boundaries this month. Your empathy is beautiful, but balancing it with your ${second[0]} energy (${secondPercent}%) will prevent emotional burnout. Practice saying 'no' with compassion when you need to recharge.`,
        hi: `जल चिकित्सक के रूप में, इस महीने स्वस्थ सीमाएं निर्धारित करने पर काम करें। आपकी सहानुभूति सुंदर है।`
      }
    };
    return growthPaths[dominantElement]?.[language] || '';
  };

  const getCompatibilityInsights = (dominantElement: string, language: string) => {
    const compatibility: Record<string, any> = {
      fire: {
        en: "You work amazingly with Earth people (they help ground your ideas) and Air people (they match your energy and add creativity). Water people teach you emotional intelligence. Be patient with Earth people's slower pace - they're building something lasting!",
        hi: "आप पृथ्वी लोगों के साथ अद्भुत रूप से काम करते हैं (वे आपके विचारों को आधार देते हैं) और वायु लोगों के साथ (वे आपकी ऊर्जा से मेल खाते हैं)।"
      },
      earth: {
        en: "You're the perfect complement to Fire people (you help them plan and execute) and Water people (you provide stability for their emotions). Air people inspire you with new ideas. Remember, Fire people aren't being reckless - they just move faster!",
        hi: "आप अग्नि लोगों के लिए सही पूरक हैं (आप उन्हें योजना बनाने और क्रियान्वित करने में मदद करते हैं) और जल लोगों के लिए।"
      },
      air: {
        en: "You thrive with Fire people (they help turn your ideas into action) and other Air people (great brainstorming sessions!). Earth people help you focus and Water people add emotional depth. Don't take Earth people's 'slow' approach personally - they're being thorough!",
        hi: "आप अग्नि लोगों के साथ फलते-फूलते हैं (वे आपके विचारों को कार्यों में बदलने में मदद करते हैं) और अन्य वायु लोगों के साथ।"
      },
      water: {
        en: "You naturally connect with Earth people (they appreciate your depth) and other Water people (instant emotional understanding). Fire people energize you and Air people help you express your feelings. Remember, Fire people's directness isn't personal - they're just focused!",
        hi: "आप प्राकृतिक रूप से पृथ्वी लोगों से जुड़ते हैं (वे आपकी गहराई की सराहना करते हैं) और अन्य जल लोगों से।"
      }
    };
    return compatibility[dominantElement]?.[language] || '';
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
                  {result.dominantElement === 'fire' && language === 'en' ? '🔥 Fire Spirit' : 
                   result.dominantElement === 'fire' && language === 'hi' ? '🔥 अग्नि व्यक्तित्व' :
                   result.dominantElement === 'earth' && language === 'en' ? '🌍 Earth Guardian' :
                   result.dominantElement === 'earth' && language === 'hi' ? '🌍 पृथ्वी व्यक्तित्व' :
                   result.dominantElement === 'air' && language === 'en' ? '💨 Air Thinker' :
                   result.dominantElement === 'air' && language === 'hi' ? '💨 वायु व्यक्तित्व' :
                   result.dominantElement === 'water' && language === 'en' ? '💧 Water Healer' :
                   '💧 जल व्यक्तित्व'}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {language === 'en' ? 'Your dominant energy type' : 'आपका मुख्य ऊर्जा प्रकार'}
                </p>
              </div>

              {/* Energy Type Deep Explanation */}
              <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 p-6 rounded-xl border border-yellow-200 dark:border-gray-600">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                  <span className="text-2xl mr-3">
                    {result.dominantElement === 'fire' ? '🔥' : 
                     result.dominantElement === 'earth' ? '🌍' : 
                     result.dominantElement === 'air' ? '💨' : '💧'}
                  </span>
                  {language === 'en' ? `Understanding Your ${result.dominantElement.charAt(0).toUpperCase() + result.dominantElement.slice(1)} Energy` : 
                   `आपकी ${result.dominantElement} ऊर्जा को समझना`}
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'en' ? '🌟 What This Energy Means:' : '🌟 इस ऊर्जा का अर्थ:'}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {getEnergyExplanation(result.dominantElement, language)}
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'en' ? '🎯 How You Approach Life:' : '🎯 आप जीवन से कैसे निपटते हैं:'}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {getLifeApproach(result.dominantElement, language)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Power Levels with Enhanced Analysis */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-center mb-4 text-gray-800 dark:text-gray-200">
                  ⚡ {language === 'en' ? 'Your Complete Energy Profile' : 'आपकी पूर्ण ऊर्जा प्रोफ़ाइल'}
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {Object.entries(result.elementScores).map(([element, score]) => {
                    const percentage = Math.round((score / 15) * 100);
                    const elementEmoji = element === 'fire' ? '🔥' : element === 'earth' ? '🌍' : element === 'air' ? '💨' : '💧';
                    const elementName = element === 'fire' ? (language === 'en' ? 'Fire Energy' : 'अग्नि ऊर्जा') :
                                      element === 'earth' ? (language === 'en' ? 'Earth Energy' : 'पृथ्वी ऊर्जा') :
                                      element === 'air' ? (language === 'en' ? 'Air Energy' : 'वायु ऊर्जा') :
                                      (language === 'en' ? 'Water Energy' : 'जल ऊर्जा');
                    
                    const isHighest = element === result.dominantElement;
                    
                    return (
                      <div key={element} className={`p-4 rounded-lg shadow-sm border-2 ${
                        isHighest 
                          ? 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border-yellow-400 dark:border-yellow-600' 
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600'
                      }`}>
                        <div className="text-center">
                          <div className="text-2xl mb-1">{elementEmoji}</div>
                          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{elementName}</div>
                          <div className={`text-2xl font-bold ${isHighest ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-gray-100'}`}>
                            {percentage}%
                          </div>
                          <Progress 
                            value={percentage} 
                            className={`h-3 mt-2 ${isHighest ? 'bg-yellow-200 dark:bg-yellow-800' : ''}`}
                          />
                          {isHighest && (
                            <div className="text-xs text-orange-600 dark:text-orange-400 font-medium mt-1">
                              {language === 'en' ? 'Dominant' : 'प्रमुख'}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Secondary Energy Analysis */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    🔄 {language === 'en' ? 'Your Energy Balance Analysis:' : 'आपका ऊर्जा संतुलन विश्लेषण:'}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {getEnergyBalanceAnalysis(result.elementScores, language)}
                  </p>
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

              {/* What to Avoid */}
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800">
                <h3 className="text-xl font-semibold mb-4 text-red-700 dark:text-red-400 flex items-center">
                  ⚠️ {language === 'en' ? 'Things to Avoid & Watch Out For' : 'बचने योग्य चीजें और सतर्कताएं'}
                </h3>
                <div className="space-y-4">
                  {getThingsToAvoid(result.dominantElement, language).map((avoidance, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                      <div className="flex items-start">
                        <span className="text-red-500 mr-3 text-lg">⚠️</span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{avoidance.title}</h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{avoidance.description}</p>
                          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded border-l-4 border-green-400">
                            <p className="text-green-700 dark:text-green-400 text-sm font-medium">
                              💡 {language === 'en' ? 'Better approach: ' : 'बेहतर तरीका: '}{avoidance.solution}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personalized Growth Path */}
              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 p-6 rounded-xl border border-indigo-200 dark:border-gray-600">
                <h3 className="text-xl font-semibold mb-4 text-indigo-700 dark:text-indigo-400 flex items-center">
                  🌱 {language === 'en' ? 'Your Personal Growth Journey' : 'आपकी व्यक्तिगत विकास यात्रा'}
                </h3>
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      🎯 {language === 'en' ? 'Focus Areas for This Month:' : 'इस महीने के लिए मुख्य क्षेत्र:'}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {getPersonalizedGrowthPath(result.dominantElement, result.elementScores, language)}
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      🤝 {language === 'en' ? 'Who You Work Best With:' : 'आप किसके साथ बेहतर काम करते हैं:'}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {getCompatibilityInsights(result.dominantElement, language)}
                    </p>
                  </div>
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
