
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Brain, Star, Users, Target } from "lucide-react";

interface Question {
  id: number;
  scenario: string;
  scenarioHi: string;
  question: string;
  questionHi: string;
  options: Array<{
    text: string;
    textHi: string;
    traits: {
      actionStyle: number;
      emotionalResponse: number;
      decisionMethod: number;
      leadershipStyle: number;
    };
  }>;
}

interface PersonalityTestProps {
  language: 'hi' | 'en';
  onComplete?: (results: any) => void;
}

const personalityQuestions: Question[] = [
  {
    id: 1,
    scenario: "Decision Under Pressure",
    scenarioHi: "दबाव में निर्णय",
    question: "You're in a group, time is running out, and no one is helping. What do you do first?",
    questionHi: "आप एक समूह में हैं, समय कम है, और कोई मदद नहीं कर रहा। आप पहले क्या करते हैं?",
    options: [
      {
        text: "Take immediate charge and assign tasks to everyone",
        textHi: "तुरंत नेतृत्व संभालूंगा और सभी को काम बांटूंगा",
        traits: { actionStyle: 2, emotionalResponse: 1, decisionMethod: 2, leadershipStyle: 2 }
      },
      {
        text: "Quickly analyze the situation and make a plan",
        textHi: "स्थिति का विश्लेषण करके योजना बनाऊंगा",
        traits: { actionStyle: 1, emotionalResponse: 1, decisionMethod: 2, leadershipStyle: 1 }
      },
      {
        text: "Ask others for their input before deciding",
        textHi: "निर्णय से पहले दूसरों की राय लूंगा",
        traits: { actionStyle: 0, emotionalResponse: 1, decisionMethod: 1, leadershipStyle: 1 }
      },
      {
        text: "Focus on my own work and hope others follow",
        textHi: "अपने काम पर ध्यान दूंगा और उम्मीद करूंगा कि दूसरे भी करें",
        traits: { actionStyle: 0, emotionalResponse: 0, decisionMethod: 1, leadershipStyle: 0 }
      }
    ]
  },
  {
    id: 2,
    scenario: "Unexpected Opportunity",
    scenarioHi: "अप्रत्याशित अवसर",
    question: "You suddenly get a great opportunity but must leave everything behind. How do you decide?",
    questionHi: "आपको अचानक एक शानदार अवसर मिलता है लेकिन सब कुछ छोड़ना पड़ेगा। आप कैसे निर्णय लेते हैं?",
    options: [
      {
        text: "Trust my gut feeling and take the leap",
        textHi: "अपनी अंतरात्मा पर भरोसा करके कदम उठाऊंगा",
        traits: { actionStyle: 2, emotionalResponse: 2, decisionMethod: 0, leadershipStyle: 1 }
      },
      {
        text: "Carefully weigh pros and cons before deciding",
        textHi: "फायदे-नुकसान को ध्यान से देखकर निर्णय लूंगा",
        traits: { actionStyle: 1, emotionalResponse: 1, decisionMethod: 2, leadershipStyle: 1 }
      },
      {
        text: "Consult family and friends first",
        textHi: "पहले परिवार और दोस्तों से सलाह लूंगा",
        traits: { actionStyle: 0, emotionalResponse: 1, decisionMethod: 1, leadershipStyle: 0 }
      },
      {
        text: "Take time to think and research thoroughly",
        textHi: "समय लेकर अच्छी तरह सोचूंगा और रिसर्च करूंगा",
        traits: { actionStyle: 0, emotionalResponse: 0, decisionMethod: 2, leadershipStyle: 0 }
      }
    ]
  },
  {
    id: 3,
    scenario: "Conflict in Team",
    scenarioHi: "टीम में संघर्ष",
    question: "A teammate blames you for something you didn't do. What do you say or do next?",
    questionHi: "एक साथी आप पर झूठा आरोप लगाता है। आप क्या कहते या करते हैं?",
    options: [
      {
        text: "Confront them immediately and clear my name",
        textHi: "तुरंत उनका सामना करूंगा और अपना नाम साफ करूंगा",
        traits: { actionStyle: 2, emotionalResponse: 2, decisionMethod: 1, leadershipStyle: 2 }
      },
      {
        text: "Present facts calmly to prove my innocence",
        textHi: "शांति से तथ्य पेश करके अपनी बेगुनाही साबित करूंगा",
        traits: { actionStyle: 1, emotionalResponse: 1, decisionMethod: 2, leadershipStyle: 1 }
      },
      {
        text: "Talk to them privately to understand their perspective",
        textHi: "निजी में बात करके उनका नजरिया समझूंगा",
        traits: { actionStyle: 1, emotionalResponse: 1, decisionMethod: 1, leadershipStyle: 1 }
      },
      {
        text: "Let it go and hope the truth comes out eventually",
        textHi: "छोड़ दूंगा और उम्मीद करूंगा कि सच सामने आ जाएगा",
        traits: { actionStyle: 0, emotionalResponse: 0, decisionMethod: 0, leadershipStyle: 0 }
      }
    ]
  }
];

const archetypes = [
  {
    name: "The Warrior",
    nameHi: "योद्धा",
    description: "Bold, direct, action-oriented",
    descriptionHi: "साहसी, सीधे, कार्य-उन्मुख",
    traits: ["High Action", "Strong Leadership", "Quick Decisions"],
    traitsHi: ["उच्च कार्यशीलता", "मजबूत नेतृत्व", "त्वरित निर्णय"],
    icon: "⚔️",
    color: "red"
  },
  {
    name: "The Sage",
    nameHi: "ऋषि",
    description: "Wise, thoughtful, moral",
    descriptionHi: "बुद्धिमान, विचारशील, नैतिक",
    traits: ["Deep Thinking", "Balanced Emotions", "Principled Decisions"],
    traitsHi: ["गहन चिंतन", "संतुलित भावनाएं", "सिद्धांतवादी निर्णय"],
    icon: "🧙‍♂️",
    color: "purple"
  },
  {
    name: "The Empath",
    nameHi: "संवेदनशील",
    description: "Caring, sensitive, relationship-focused",
    descriptionHi: "देखभाल करने वाला, संवेदनशील, रिश्ते-केंद्रित",
    traits: ["High Empathy", "Supportive Leadership", "Emotion-based Decisions"],
    traitsHi: ["उच्च सहानुभूति", "सहायक नेतृत्व", "भावना-आधारित निर्णय"],
    icon: "💙",
    color: "blue"
  },
  {
    name: "The Strategist",
    nameHi: "रणनीतिकार",
    description: "Analytical, careful, systematic",
    descriptionHi: "विश्लेषणात्मक, सावधान, व्यवस्थित",
    traits: ["Logical Thinking", "Measured Actions", "Data-driven Decisions"],
    traitsHi: ["तार्किक सोच", "मापे गए कार्य", "डेटा-संचालित निर्णय"],
    icon: "🎯",
    color: "green"
  }
];

const PersonalityTest: React.FC<PersonalityTestProps> = ({ language, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState<any>(null);

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, { questionId: personalityQuestions[currentQuestion].id, option: optionIndex }];
    setAnswers(newAnswers);

    if (currentQuestion < personalityQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (allAnswers: any[]) => {
    let totalTraits = { actionStyle: 0, emotionalResponse: 0, decisionMethod: 0, leadershipStyle: 0 };
    
    allAnswers.forEach((answer, index) => {
      const question = personalityQuestions[index];
      const selectedOption = question.options[answer.option];
      
      totalTraits.actionStyle += selectedOption.traits.actionStyle;
      totalTraits.emotionalResponse += selectedOption.traits.emotionalResponse;
      totalTraits.decisionMethod += selectedOption.traits.decisionMethod;
      totalTraits.leadershipStyle += selectedOption.traits.leadershipStyle;
    });

    // Determine dominant archetype based on trait scores
    let dominantArchetype = archetypes[0];
    if (totalTraits.actionStyle >= 4 && totalTraits.leadershipStyle >= 4) {
      dominantArchetype = archetypes[0]; // Warrior
    } else if (totalTraits.decisionMethod >= 4 && totalTraits.emotionalResponse <= 2) {
      dominantArchetype = archetypes[3]; // Strategist
    } else if (totalTraits.emotionalResponse >= 4 && totalTraits.leadershipStyle <= 2) {
      dominantArchetype = archetypes[2]; // Empath
    } else {
      dominantArchetype = archetypes[1]; // Sage
    }

    const finalResults = {
      archetype: dominantArchetype,
      traits: totalTraits,
      percentage: Math.round((Object.values(totalTraits).reduce((a, b) => a + b, 0) / (personalityQuestions.length * 8)) * 100)
    };

    setResults(finalResults);
    setIsComplete(true);
    onComplete?.(finalResults);
  };

  const restartTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setIsComplete(false);
    setResults(null);
  };

  if (isComplete && results) {
    return (
      <Card className="bg-white border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-gray-900">
            <Brain className="h-6 w-6 text-purple-600" />
            {getTranslation('Your Personality Type', 'आपका व्यक्तित्व प्रकार')}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6 text-center">
          <div className="text-6xl">{results.archetype.icon}</div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {language === 'hi' ? results.archetype.nameHi : results.archetype.name}
            </h2>
            <p className="text-gray-600">
              {language === 'hi' ? results.archetype.descriptionHi : results.archetype.description}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">
              {getTranslation('Key Traits', 'मुख्य विशेषताएं')}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {(language === 'hi' ? results.archetype.traitsHi : results.archetype.traits).map((trait: string, index: number) => (
                <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                  {trait}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">
              {getTranslation('Trait Breakdown', 'विशेषता विवरण')}
            </h3>
            
            <div className="space-y-2 text-left">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{getTranslation('Action Style', 'कार्य शैली')}</span>
                  <span className="text-gray-600">{Math.round(results.traits.actionStyle / 6 * 100)}%</span>
                </div>
                <Progress value={results.traits.actionStyle / 6 * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{getTranslation('Emotional Response', 'भावनात्मक प्रतिक्रिया')}</span>
                  <span className="text-gray-600">{Math.round(results.traits.emotionalResponse / 6 * 100)}%</span>
                </div>
                <Progress value={results.traits.emotionalResponse / 6 * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{getTranslation('Decision Method', 'निर्णय पद्धति')}</span>
                  <span className="text-gray-600">{Math.round(results.traits.decisionMethod / 6 * 100)}%</span>
                </div>
                <Progress value={results.traits.decisionMethod / 6 * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{getTranslation('Leadership Style', 'नेतृत्व शैली')}</span>
                  <span className="text-gray-600">{Math.round(results.traits.leadershipStyle / 6 * 100)}%</span>
                </div>
                <Progress value={results.traits.leadershipStyle / 6 * 100} className="h-2" />
              </div>
            </div>
          </div>

          <Button onClick={restartTest} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            {getTranslation('Take Test Again', 'फिर से टेस्ट लें')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const question = personalityQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / personalityQuestions.length) * 100;

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Brain className="h-5 w-5 text-purple-600" />
            {getTranslation('Personality Test', 'व्यक्तित्व परीक्षण')}
          </CardTitle>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            {currentQuestion + 1} / {personalityQuestions.length}
          </Badge>
        </div>
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-600">
            {Math.round(progress)}% {getTranslation('Complete', 'पूर्ण')}
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center">
          <Badge variant="outline" className="mb-4 border-purple-200 text-purple-700">
            {language === 'hi' ? question.scenarioHi : question.scenario}
          </Badge>
          <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
            {language === 'hi' ? question.questionHi : question.question}
          </h3>
        </div>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full p-4 h-auto text-left border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-900"
              onClick={() => handleAnswer(index)}
            >
              <div className="flex items-center justify-between w-full">
                <span className="flex-1 text-sm leading-relaxed">
                  {language === 'hi' ? option.textHi : option.text}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
              </div>
            </Button>
          ))}
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            {getTranslation(
              'Choose the option that best describes your natural response',
              'वह विकल्प चुनें जो आपकी प्राकृतिक प्रतिक्रिया का सबसे अच्छा वर्णन करता है'
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalityTest;
