import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EnhancedPersonalityResults from './EnhancedPersonalityResults';

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
    psychProfile: string;
    cognitiveStyle: string;
  }[];
  psychologicalFramework: string;
}

interface PersonalityResults {
  dominantTraits: string[];
  psychologicalProfile: string;
  cognitiveStyle: string;
  personalityType: string;
  bigFiveScores: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  strengths: string[];
  challenges: string[];
  recommendations: string[];
  careerAlignment: string[];
  relationshipStyle: string;
  leadershipPotential: number;
  emotionalIntelligence: number;
  stressResilience: number;
}

const EnhancedPersonalityTest: React.FC<PersonalityTestProps> = ({ language, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState<PersonalityResults | null>(null);

  const psychologicalQuestions: Question[] = [
    {
      id: 1,
      title: language === 'hi' ? 'नैतिक दुविधा' : 'Moral Dilemma',
      scenario: language === 'hi' 
        ? 'आप ट्रेन ट्रैक पर खड़े हैं। एक भागती हुई ट्रेन 5 लोगों को मारने वाली है। आप लीवर खींचकर ट्रेन को दूसरे ट्रैक पर भेज सकते हैं, लेकिन वहाँ 1 व्यक्ति मर जाएगा।'
        : "You're standing by a railway track. A runaway train will kill 5 people. You can pull a lever to divert it to another track, but 1 person will die there.",
      options: [
        {
          text: language === 'hi' ? 'लीवर खींचूंगा - 1 की मौत 5 से बेहतर है' : 'Pull the lever - 1 death is better than 5',
          traits: ['Utilitarian', 'Logical', 'Consequentialist'],
          psychProfile: 'Rational Decision Maker',
          cognitiveStyle: 'Analytical Thinking'
        },
        {
          text: language === 'hi' ? 'लीवर नहीं खींचूंगा - किसी को जानबूझकर मारना गलत है' : "Won't pull lever - intentionally killing someone is wrong",
          traits: ['Deontological', 'Principled', 'Rights-focused'],
          psychProfile: 'Moral Absolutist',
          cognitiveStyle: 'Values-based Thinking'
        },
        {
          text: language === 'hi' ? 'फ्रीज हो जाऊंगा - यह निर्णय बहुत कठिन है' : "Freeze up - this decision is too difficult",
          traits: ['Analysis Paralysis', 'Conflict Avoidant', 'Overwhelmed'],
          psychProfile: 'Decision Avoidant',
          cognitiveStyle: 'Emotional Overwhelm'
        },
        {
          text: language === 'hi' ? 'तुरंत चिल्लाकर सभी को चेतावनी दूंगा' : 'Immediately shout to warn everyone',
          traits: ['Creative Problem Solving', 'Optimistic', 'Action-oriented'],
          psychProfile: 'Solution Innovator',
          cognitiveStyle: 'Divergent Thinking'
        }
      ],
      psychologicalFramework: 'Moral Psychology + Trolley Problem'
    },
    {
      id: 2,
      title: language === 'hi' ? 'प्राधिकरण परीक्षण' : 'Authority Test',
      scenario: language === 'hi'
        ? 'आपका बॉस आपको एक ऐसा काम करने को कहता है जो कानूनी तो है लेकिन आपको लगता है कि यह नैतिक रूप से गलत है। बॉस कहता है "सिर्फ ऑर्डर फॉलो करो"।'
        : 'Your boss asks you to do something legal but you feel is morally wrong. The boss says "just follow orders".',
      options: [
        {
          text: language === 'hi' ? 'ऑर्डर फॉलो करूंगा - बॉस की जिम्मेदारी है' : "Follow orders - it's the boss's responsibility",
          traits: ['Authority Compliant', 'Hierarchical', 'Responsibility Diffusion'],
          psychProfile: 'Authority Follower',
          cognitiveStyle: 'Conformist Thinking'
        },
        {
          text: language === 'hi' ? 'मना कर दूंगा - मेरे सिद्धांत समझौते की अनुमति नहीं देते' : "Refuse - my principles don't allow compromise",
          traits: ['Autonomous', 'Principled', 'Integrity-focused'],
          psychProfile: 'Moral Autonomist',
          cognitiveStyle: 'Independent Thinking'
        },
        {
          text: language === 'hi' ? 'बॉस से पूछूंगा कि क्यों यह जरूरी है' : 'Ask the boss why this is necessary',
          traits: ['Questioning', 'Diplomatic', 'Information-seeking'],
          psychProfile: 'Thoughtful Inquirer',
          cognitiveStyle: 'Critical Thinking'
        },
        {
          text: language === 'hi' ? 'करूंगा लेकिन असहज महसूस करूंगा' : "Do it but feel uncomfortable",
          traits: ['Conflict Avoidant', 'Compromising', 'Internal Tension'],
          psychProfile: 'Reluctant Complier',
          cognitiveStyle: 'Cognitive Dissonance'
        }
      ],
      psychologicalFramework: 'Milgram Obedience Study + Moral Agency'
    },
    {
      id: 3,
      title: language === 'hi' ? 'सामाजिक दबाव' : 'Social Pressure',
      scenario: language === 'hi'
        ? 'आप एक ग्रुप में हैं जहाँ सभी एक गलत जवाब पर सहमत हो रहे हैं। आपको लगता है कि आप सही हैं लेकिन बाकी सब आपसे असहमत हैं।'
        : "You're in a group where everyone agrees on an answer you believe is wrong. You think you're right but everyone else disagrees.",
      options: [
        {
          text: language === 'hi' ? 'अपनी बात कहूंगा भले ही सब विरोध करें' : "State my view even if everyone opposes",
          traits: ['Independent', 'Confident', 'Non-conformist'],
          psychProfile: 'Independent Thinker',
          cognitiveStyle: 'Autonomous Reasoning'
        },
        {
          text: language === 'hi' ? 'चुप रहूंगा - शायद मैं गलत हूं' : "Stay quiet - maybe I'm wrong",
          traits: ['Conformist', 'Self-doubting', 'Group-oriented'],
          psychProfile: 'Social Conformist',
          cognitiveStyle: 'Social Validation Seeking'
        },
        {
          text: language === 'hi' ? 'प्राइवेट में एक व्यक्ति से अपनी बात कहूंगा' : 'Share my view privately with one person',
          traits: ['Cautious', 'Strategic', 'Diplomatic'],
          psychProfile: 'Strategic Communicator',
          cognitiveStyle: 'Risk-averse Reasoning'
        },
        {
          text: language === 'hi' ? 'सबूत मांगूंगा और फैक्ट चेक करूंगा' : 'Ask for evidence and fact-check',
          traits: ['Analytical', 'Evidence-based', 'Rational'],
          psychProfile: 'Evidence Seeker',
          cognitiveStyle: 'Scientific Thinking'
        }
      ],
      psychologicalFramework: 'Asch Conformity Experiments + Social Psychology'
    },
    {
      id: 4,
      title: language === 'hi' ? 'संसाधन वितरण' : 'Resource Distribution',
      scenario: language === 'hi'
        ? 'आपके पास $1000 हैं। आप 3 लोगों में बांट सकते हैं: A (बहुत जरूरतमंद), B (मेहनती लेकिन गरीब), C (आपका दोस्त)। कैसे बांटेंगे?'
        : 'You have $1000 to distribute among 3 people: A (desperately needy), B (hardworking but poor), C (your friend). How do you distribute?',
      options: [
        {
          text: language === 'hi' ? 'A को $600, B को $300, C को $100' : 'A gets $600, B gets $300, C gets $100',
          traits: ['Empathetic', 'Need-based', 'Altruistic'],
          psychProfile: 'Compassionate Helper',
          cognitiveStyle: 'Empathy-driven Thinking'
        },
        {
          text: language === 'hi' ? 'सभी को $333 बराबर बांटूंगा' : 'Equal $333 to everyone',
          traits: ['Fair', 'Egalitarian', 'Justice-oriented'],
          psychProfile: 'Equality Advocate',
          cognitiveStyle: 'Fairness-based Thinking'
        },
        {
          text: language === 'hi' ? 'B को $500 (मेहनत का इनाम), A को $400, C को $100' : 'B gets $500 (reward effort), A gets $400, C gets $100',
          traits: ['Merit-based', 'Achievement-oriented', 'Incentive-focused'],
          psychProfile: 'Merit Rewarding',
          cognitiveStyle: 'Achievement-based Thinking'
        },
        {
          text: language === 'hi' ? 'C को $500 (दोस्ती), A को $300, B को $200' : 'C gets $500 (friendship), A gets $300, B gets $200',
          traits: ['Loyalty-focused', 'Relationship-based', 'Tribal'],
          psychProfile: 'Loyalty Prioritizer',
          cognitiveStyle: 'Relationship-centered Thinking'
        }
      ],
      psychologicalFramework: 'Distributive Justice + Social Value Orientation'
    },
    {
      id: 5,
      title: language === 'hi' ? 'भविष्य की योजना' : 'Future Planning',
      scenario: language === 'hi'
        ? 'आपको दो विकल्प दिए गए हैं: अभी $50 या 1 साल बाद $100। वैज्ञानिक रूप से 1 साल बाद $100 बेहतर है।'
        : "You're offered two choices: $50 now or $100 in 1 year. Scientifically, $100 in 1 year is better.",
      options: [
        {
          text: language === 'hi' ? '$50 अभी लूंगा - भविष्य अनिश्चित है' : 'Take $50 now - future is uncertain',
          traits: ['Present-focused', 'Risk-averse', 'Immediate gratification'],
          psychProfile: 'Present Hedonist',
          cognitiveStyle: 'Short-term Thinking'
        },
        {
          text: language === 'hi' ? '$100 का इंतजार करूंगा - लॉन्ग टर्म बेहतर है' : 'Wait for $100 - long-term is better',
          traits: ['Future-oriented', 'Self-controlled', 'Strategic'],
          psychProfile: 'Future Planner',
          cognitiveStyle: 'Long-term Thinking'
        },
        {
          text: language === 'hi' ? 'अपनी वर्तमान जरूरत के आधार पर तय करूंगा' : 'Decide based on my current needs',
          traits: ['Contextual', 'Practical', 'Adaptive'],
          psychProfile: 'Situational Adaptor',
          cognitiveStyle: 'Context-dependent Thinking'
        },
        {
          text: language === 'hi' ? 'दोनों के बीच कोई कॉम्प्रोमाइज ढूंढूंगा' : 'Look for a compromise between both',
          traits: ['Negotiating', 'Creative', 'Win-win seeking'],
          psychProfile: 'Creative Negotiator',
          cognitiveStyle: 'Integrative Thinking'
        }
      ],
      psychologicalFramework: 'Temporal Discounting + Self-Control Research'
    },
    {
      id: 6,
      title: language === 'hi' ? 'गलती की जिम्मेदारी' : 'Responsibility for Mistakes',
      scenario: language === 'hi'
        ? 'टीम प्रोजेक्ट में गलती हुई। आपकी गलती नहीं थी लेकिन आप टीम लीडर हैं। क्लाइंट गुस्से में है।'
        : "Team project failed. It wasn't your fault but you're the team leader. Client is angry.",
      options: [
        {
          text: language === 'hi' ? 'जिम्मेदारी लूंगा और माफी मांगूंगा' : 'Take responsibility and apologize',
          traits: ['Accountable', 'Leadership', 'Protective'],
          psychProfile: 'Responsible Leader',
          cognitiveStyle: 'Accountability-focused Thinking'
        },
        {
          text: language === 'hi' ? 'सच बताऊंगा कि किसकी गलती थी' : 'Tell the truth about whose fault it was',
          traits: ['Honest', 'Direct', 'Truth-focused'],
          psychProfile: 'Truth Teller',
          cognitiveStyle: 'Factual Thinking'
        },
        {
          text: language === 'hi' ? 'टीम के साथ मिलकर समाधान पर फोकस करूंगा' : 'Focus on solutions with the team',
          traits: ['Solution-oriented', 'Collaborative', 'Forward-thinking'],
          psychProfile: 'Solution Focuser',
          cognitiveStyle: 'Problem-solving Thinking'
        },
        {
          text: language === 'hi' ? 'सिस्टम की कमी बताऊंगा जिससे यह हुआ' : 'Explain the system flaws that caused this',
          traits: ['Systems-thinking', 'Analytical', 'Root-cause focused'],
          psychProfile: 'Systems Analyst',
          cognitiveStyle: 'Systematic Thinking'
        }
      ],
      psychologicalFramework: 'Leadership Psychology + Attribution Theory'
    }
  ];

  const selectedQuestions = React.useMemo(() => {
    return psychologicalQuestions.sort(() => 0.5 - Math.random()).slice(0, 6);
  }, []);

  const handleAnswer = (optionIndex: number) => {
    const selectedOption = selectedQuestions[currentQuestion].options[optionIndex];
    const newAnswers = [...answers, selectedOption.psychProfile];
    setAnswers(newAnswers);

    if (currentQuestion < selectedQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate comprehensive results
      const results = calculateAdvancedPersonalityResults(newAnswers, selectedQuestions);
      setResults(results);
      setIsComplete(true);
      if (onComplete) {
        onComplete(results);
      }
    }
  };

  const calculateAdvancedPersonalityResults = (answers: string[], questions: Question[]): PersonalityResults => {
    // Analyze psychological profiles
    const profileCounts: { [key: string]: number } = {};
    const cognitiveStyles: { [key: string]: number } = {};
    const traitCounts: { [key: string]: number } = {};

    answers.forEach((answer, index) => {
      const option = questions[index].options.find(opt => opt.psychProfile === answer);
      if (option) {
        profileCounts[option.psychProfile] = (profileCounts[option.psychProfile] || 0) + 1;
        cognitiveStyles[option.cognitiveStyle] = (cognitiveStyles[option.cognitiveStyle] || 0) + 1;
        
        option.traits.forEach(trait => {
          traitCounts[trait] = (traitCounts[trait] || 0) + 1;
        });
      }
    });

    // Determine dominant patterns
    const dominantProfile = Object.entries(profileCounts)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    const dominantCognitiveStyle = Object.entries(cognitiveStyles)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    const dominantTraits = Object.entries(traitCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([trait]) => trait);

    // Calculate Big Five scores based on responses
    const bigFiveScores = calculateBigFiveFromResponses(answers, questions);
    
    // Generate comprehensive analysis
    const personalityType = generatePersonalityType(dominantProfile, dominantCognitiveStyle);
    const strengths = generateStrengths(dominantTraits, dominantProfile);
    const challenges = generateChallenges(dominantTraits, dominantProfile);
    const recommendations = generateRecommendations(dominantProfile, dominantCognitiveStyle);
    const careerAlignment = generateCareerAlignment(dominantProfile, dominantTraits);
    const relationshipStyle = generateRelationshipStyle(dominantProfile, dominantTraits);
    
    // Calculate psychological metrics
    const leadershipPotential = calculateLeadershipPotential(dominantTraits, answers);
    const emotionalIntelligence = calculateEmotionalIntelligence(dominantTraits, answers);
    const stressResilience = calculateStressResilience(dominantTraits, answers);

    return {
      dominantTraits,
      psychologicalProfile: dominantProfile,
      cognitiveStyle: dominantCognitiveStyle,
      personalityType,
      bigFiveScores,
      strengths,
      challenges,
      recommendations,
      careerAlignment,
      relationshipStyle,
      leadershipPotential,
      emotionalIntelligence,
      stressResilience
    };
  };

  const calculateBigFiveFromResponses = (answers: string[], questions: Question[]) => {
    const scores = {
      openness: 50,
      conscientiousness: 50,
      extraversion: 50,
      agreeableness: 50,
      neuroticism: 50
    };

    answers.forEach((answer, index) => {
      const option = questions[index].options.find(opt => opt.psychProfile === answer);
      if (option) {
        // Map psychological profiles to Big Five dimensions
        switch (option.psychProfile) {
          case 'Independent Thinker':
          case 'Solution Innovator':
          case 'Creative Negotiator':
            scores.openness += 15;
            break;
          case 'Responsible Leader':
          case 'Future Planner':
          case 'Evidence Seeker':
            scores.conscientiousness += 15;
            break;
          case 'Truth Teller':
          case 'Moral Autonomist':
            scores.extraversion += 10;
            break;
          case 'Compassionate Helper':
          case 'Equality Advocate':
            scores.agreeableness += 15;
            break;
          case 'Decision Avoidant':
          case 'Reluctant Complier':
            scores.neuroticism += 10;
            break;
        }
      }
    });

    // Normalize scores to 0-100 range
    Object.keys(scores).forEach(key => {
      scores[key as keyof typeof scores] = Math.max(0, Math.min(100, scores[key as keyof typeof scores]));
    });

    return scores;
  };

  const generatePersonalityType = (profile: string, cognitiveStyle: string) => {
    const typeMap: { [key: string]: string } = {
      'Rational Decision Maker': 'The Analytical Strategist',
      'Moral Autonomist': 'The Principled Individual',
      'Independent Thinker': 'The Authentic Leader',
      'Compassionate Helper': 'The Empathetic Supporter',
      'Future Planner': 'The Visionary Planner',
      'Responsible Leader': 'The Accountable Guardian'
    };

    return typeMap[profile] || 'The Balanced Individual';
  };

  const generateStrengths = (traits: string[], profile: string) => {
    const strengthMap: { [key: string]: string[] } = {
      'Rational Decision Maker': ['Excellent analytical skills', 'Makes logical decisions under pressure', 'Objective problem-solving'],
      'Moral Autonomist': ['Strong ethical foundation', 'Maintains integrity under pressure', 'Independent moral reasoning'],
      'Independent Thinker': ['Thinks outside the box', 'Resists groupthink', 'Confident in unique perspectives'],
      'Compassionate Helper': ['High emotional intelligence', 'Natural empathy', 'Excellent at understanding others'],
      'Future Planner': ['Strategic long-term thinking', 'Excellent self-control', 'Goal-oriented behavior'],
      'Responsible Leader': ['Takes accountability', 'Protective of team members', 'Natural leadership qualities']
    };

    return strengthMap[profile] || ['Balanced perspective', 'Adaptable thinking', 'Reasonable decision-making'];
  };

  const generateChallenges = (traits: string[], profile: string) => {
    const challengeMap: { [key: string]: string[] } = {
      'Rational Decision Maker': ['May appear cold or unfeeling', 'Could ignore emotional factors', 'Risk of analysis paralysis'],
      'Moral Autonomist': ['May be seen as rigid', 'Could clash with authority', 'Difficulty with moral compromises'],
      'Independent Thinker': ['May be seen as stubborn', 'Could alienate team members', 'Risk of isolation'],
      'Compassionate Helper': ['May be taken advantage of', 'Could neglect own needs', 'Difficulty with tough decisions'],
      'Future Planner': ['May miss present opportunities', 'Could be seen as inflexible', 'Risk of over-planning'],
      'Responsible Leader': ['May take on too much burden', 'Could enable others\' irresponsibility', 'Risk of burnout']
    };

    return challengeMap[profile] || ['Need for better balance', 'Could improve consistency', 'Room for growth in decision-making'];
  };

  const generateRecommendations = (profile: string, cognitiveStyle: string) => {
    const recommendationMap: { [key: string]: string[] } = {
      'Rational Decision Maker': ['Practice emotional intelligence', 'Include stakeholder perspectives', 'Balance logic with intuition'],
      'Moral Autonomist': ['Develop diplomatic communication', 'Practice situational flexibility', 'Build coalition-building skills'],
      'Independent Thinker': ['Practice active listening', 'Develop team collaboration skills', 'Learn to communicate ideas effectively'],
      'Compassionate Helper': ['Set clear boundaries', 'Practice assertiveness', 'Balance helping with self-care'],
      'Future Planner': ['Practice present-moment awareness', 'Develop adaptability skills', 'Balance planning with spontaneity'],
      'Responsible Leader': ['Learn to delegate effectively', 'Practice saying no', 'Develop team accountability systems']
    };

    return recommendationMap[profile] || ['Continue developing self-awareness', 'Practice balanced decision-making', 'Seek diverse perspectives'];
  };

  const generateCareerAlignment = (profile: string, traits: string[]) => {
    const careerMap: { [key: string]: string[] } = {
      'Rational Decision Maker': ['Strategy Consultant', 'Data Scientist', 'Financial Analyst', 'Operations Research'],
      'Moral Autonomist': ['Ethics Officer', 'Lawyer', 'Human Rights Advocate', 'Compliance Manager'],
      'Independent Thinker': ['Entrepreneur', 'Research Scientist', 'Innovation Manager', 'Creative Director'],
      'Compassionate Helper': ['Counselor', 'Social Worker', 'Healthcare Provider', 'Non-profit Leader'],
      'Future Planner': ['Strategic Planner', 'Investment Advisor', 'Project Manager', 'Urban Planner'],
      'Responsible Leader': ['Team Manager', 'Operations Director', 'Department Head', 'CEO/Executive']
    };

    return careerMap[profile] || ['Management', 'Consulting', 'Education', 'Healthcare'];
  };

  const generateRelationshipStyle = (profile: string, traits: string[]) => {
    const styleMap: { [key: string]: string } = {
      'Rational Decision Maker': 'Logical Partner - Values clear communication and rational decision-making in relationships',
      'Moral Autonomist': 'Principled Partner - Seeks relationships built on shared values and mutual respect',
      'Independent Thinker': 'Autonomous Partner - Values independence while maintaining deep connections',
      'Compassionate Helper': 'Nurturing Partner - Prioritizes emotional support and caring for partner\'s needs',
      'Future Planner': 'Committed Partner - Focuses on long-term relationship building and shared goals',
      'Responsible Leader': 'Protective Partner - Takes responsibility for relationship health and partner\'s wellbeing'
    };

    return styleMap[profile] || 'Balanced Partner - Adapts relationship style based on circumstances and partner needs';
  };

  const calculateLeadershipPotential = (traits: string[], answers: string[]) => {
    let score = 50;
    
    const leadershipTraits = ['Accountable', 'Independent', 'Confident', 'Responsible', 'Strategic'];
    const leadershipProfiles = ['Responsible Leader', 'Independent Thinker', 'Rational Decision Maker'];
    
    traits.forEach(trait => {
      if (leadershipTraits.includes(trait)) score += 10;
    });
    
    answers.forEach(answer => {
      if (leadershipProfiles.includes(answer)) score += 8;
    });
    
    return Math.min(100, Math.max(0, score));
  };

  const calculateEmotionalIntelligence = (traits: string[], answers: string[]) => {
    let score = 50;
    
    const eiTraits = ['Empathetic', 'Compassionate', 'Diplomatic', 'Understanding'];
    const eiProfiles = ['Compassionate Helper', 'Strategic Communicator', 'Thoughtful Inquirer'];
    
    traits.forEach(trait => {
      if (eiTraits.includes(trait)) score += 12;
    });
    
    answers.forEach(answer => {
      if (eiProfiles.includes(answer)) score += 10;
    });
    
    return Math.min(100, Math.max(0, score));
  };

  const calculateStressResilience = (traits: string[], answers: string[]) => {
    let score = 50;
    
    const resilienceTraits = ['Strategic', 'Analytical', 'Future-oriented', 'Solution-oriented'];
    const resilienceProfiles = ['Future Planner', 'Solution Focuser', 'Systems Analyst'];
    
    traits.forEach(trait => {
      if (resilienceTraits.includes(trait)) score += 10;
    });
    
    answers.forEach(answer => {
      if (resilienceProfiles.includes(answer)) score += 8;
    });
    
    return Math.min(100, Math.max(0, score));
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setIsComplete(false);
    setResults(null);
  };

  if (isComplete && results) {
    return (
      <EnhancedPersonalityResults 
        results={results}
        language={language}
        onRestart={resetTest}
      />
    );
  }

  const progress = ((currentQuestion + 1) / selectedQuestions.length) * 100;

  return (
    <Card className="max-w-4xl mx-auto bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <CardTitle className="text-xl flex items-center gap-2">
          <Brain className="h-5 w-5" />
          {language === 'hi' ? 'गहन मनोवैज्ञानिक मूल्यांकन' : 'In-Depth Psychological Assessment'}
        </CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{language === 'hi' ? 'स्थिति' : 'Scenario'} {currentQuestion + 1} / {selectedQuestions.length}</span>
            <span>{Math.round(progress)}% {language === 'hi' ? 'पूरा' : 'Complete'}</span>
          </div>
          <Progress value={progress} className="bg-white/20" />
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-orange-800 mb-2 leading-tight">
              {selectedQuestions[currentQuestion].title}
            </h3>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 px-1">
              {selectedQuestions[currentQuestion].scenario}
            </p>
            <Badge variant="outline" className="border-orange-300 text-orange-700 text-xs sm:text-sm">
              {language === 'hi' ? 'मनोवैज्ञानिक ढांचा:' : 'Framework:'} {selectedQuestions[currentQuestion].psychologicalFramework}
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {selectedQuestions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-left h-auto p-3 sm:p-4 border-orange-200 hover:bg-orange-100 hover:border-orange-400 transition-all duration-200 min-h-[80px] sm:min-h-[auto]"
                onClick={() => handleAnswer(index)}
              >
                <div className="w-full text-left">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 font-medium leading-relaxed text-sm sm:text-base break-words pr-2">
                        {option.text}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {option.traits.map((trait, traitIndex) => (
                          <Badge key={traitIndex} variant="secondary" className="text-xs">
                            {trait}
                          </Badge>
                        ))}
                      </div>
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
