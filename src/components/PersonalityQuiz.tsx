
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Heart, Target, Users, Star, Compass } from "lucide-react";

// Sample questions - replace with your 100 questions
const QUESTION_BANK = {
  career: [
    {
      id: 1,
      category: "career",
      question: "When facing a challenging work project, what is your first instinct?",
      options: [
        { id: "a", text: "Break it down into smaller, manageable tasks", archetype: "Sage" },
        { id: "b", text: "Dive in headfirst and learn as you go", archetype: "Warrior" },
        { id: "c", text: "Seek advice from experienced colleagues", archetype: "Empath" },
        { id: "d", text: "Find innovative and unconventional solutions", archetype: "Magician" }
      ]
    },
    {
      id: 2,
      category: "career",
      question: "What motivates you most in your professional life?",
      options: [
        { id: "a", text: "Making a positive impact on others", archetype: "Empath" },
        { id: "b", text: "Achieving personal excellence and mastery", archetype: "Sage" },
        { id: "c", text: "Leading and inspiring teams", archetype: "King" },
        { id: "d", text: "Creating something entirely new", archetype: "Magician" }
      ]
    }
  ],
  relationships: [
    {
      id: 3,
      category: "relationships",
      question: "How do you handle conflicts in personal relationships?",
      options: [
        { id: "a", text: "Address issues directly and honestly", archetype: "Warrior" },
        { id: "b", text: "Listen carefully and try to understand all perspectives", archetype: "Empath" },
        { id: "c", text: "Step back and reflect before responding", archetype: "Monk" },
        { id: "d", text: "Find creative compromises that work for everyone", archetype: "Magician" }
      ]
    },
    {
      id: 4,
      category: "relationships",
      question: "What role do you naturally take in group situations?",
      options: [
        { id: "a", text: "The mediator who keeps peace", archetype: "Empath" },
        { id: "b", text: "The leader who guides direction", archetype: "King" },
        { id: "c", text: "The supporter who helps others shine", archetype: "Monk" },
        { id: "d", text: "The challenger who questions assumptions", archetype: "Rebel" }
      ]
    }
  ],
  values: [
    {
      id: 5,
      category: "values",
      question: "Which principle guides your major life decisions?",
      options: [
        { id: "a", text: "Seeking truth and wisdom above all", archetype: "Sage" },
        { id: "b", text: "Protecting and serving those I care about", archetype: "Warrior" },
        { id: "c", text: "Finding inner peace and harmony", archetype: "Monk" },
        { id: "d", text: "Challenging injustice and fighting for change", archetype: "Rebel" }
      ]
    },
    {
      id: 6,
      category: "values",
      question: "How do you view authority and traditional systems?",
      options: [
        { id: "a", text: "Respect them but think they need improvement", archetype: "King" },
        { id: "b", text: "Question them and prefer to create my own path", archetype: "Rebel" },
        { id: "c", text: "Accept them as part of natural order", archetype: "Monk" },
        { id: "d", text: "Use them as tools when beneficial", archetype: "Magician" }
      ]
    }
  ],
  challenges: [
    {
      id: 7,
      category: "challenges",
      question: "When you face a major setback, how do you respond?",
      options: [
        { id: "a", text: "Adapt quickly and find alternative paths", archetype: "Survivor" },
        { id: "b", text: "Fight back harder and more determined", archetype: "Warrior" },
        { id: "c", text: "Reflect deeply on lessons to be learned", archetype: "Sage" },
        { id: "d", text: "Accept it as part of life's natural flow", archetype: "Monk" }
      ]
    },
    {
      id: 8,
      category: "challenges",
      question: "What is your relationship with risk and uncertainty?",
      options: [
        { id: "a", text: "I thrive in uncertain situations", archetype: "Survivor" },
        { id: "b", text: "I calculate risks carefully before acting", archetype: "Sage" },
        { id: "c", text: "I prefer stability but can handle change", archetype: "King" },
        { id: "d", text: "I try to avoid unnecessary risks", archetype: "Monk" }
      ]
    }
  ],
  growth: [
    {
      id: 9,
      category: "growth",
      question: "How do you prefer to learn and grow?",
      options: [
        { id: "a", text: "Through direct experience and trial", archetype: "Warrior" },
        { id: "b", text: "Through study and contemplation", archetype: "Sage" },
        { id: "c", text: "Through helping and connecting with others", archetype: "Empath" },
        { id: "d", text: "Through creative expression and experimentation", archetype: "Magician" }
      ]
    },
    {
      id: 10,
      category: "growth",
      question: "What kind of feedback do you find most valuable?",
      options: [
        { id: "a", text: "Honest and direct feedback", archetype: "Warrior" },
        { id: "b", text: "Detailed and analytical feedback", archetype: "Sage" },
        { id: "c", text: "Supportive and encouraging feedback", archetype: "Empath" },
        { id: "d", text: "Constructive feedback that challenges me", archetype: "Rebel" }
      ]
    }
  ],
  communication: [
    {
      id: 11,
      category: "communication",
      question: "How do you typically express yourself?",
      options: [
        { id: "a", text: "With passion and intensity", archetype: "Warrior" },
        { id: "b", text: "With careful thought and precision", archetype: "Sage" },
        { id: "c", text: "With warmth and empathy", archetype: "Empath" },
        { id: "d", text: "With creativity and humor", archetype: "Magician" }
      ]
    },
    {
      id: 12,
      category: "communication",
      question: "In conversations, you tend to:",
      options: [
        { id: "a", text: "Ask probing questions to understand deeply", archetype: "Sage" },
        { id: "b", text: "Share personal experiences and emotions", archetype: "Empath" },
        { id: "c", text: "Challenge ideas and offer alternative views", archetype: "Rebel" },
        { id: "d", text: "Listen more than you speak", archetype: "Monk" }
      ]
    }
  ]
};

interface PersonalityQuizProps {
  language: 'hi' | 'en';
  onComplete: (result: any) => void;
}

const PersonalityQuiz: React.FC<PersonalityQuizProps> = ({ language, onComplete }) => {
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Select 12 random questions (minimum 1 from each category)
    const categories = Object.keys(QUESTION_BANK);
    const selected: any[] = [];
    
    // First, get one question from each category
    categories.forEach(category => {
      const categoryQuestions = QUESTION_BANK[category];
      const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
      selected.push(categoryQuestions[randomIndex]);
    });
    
    // Fill remaining slots with random questions from all categories
    const allQuestions = Object.values(QUESTION_BANK).flat();
    const remainingCount = 12 - selected.length;
    
    for (let i = 0; i < remainingCount; i++) {
      const availableQuestions = allQuestions.filter(q => !selected.find(s => s.id === q.id));
      if (availableQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        selected.push(availableQuestions[randomIndex]);
      }
    }
    
    // Shuffle the selected questions
    const shuffled = selected.sort(() => Math.random() - 0.5);
    setSelectedQuestions(shuffled);
  }, []);

  const handleAnswer = (option: any) => {
    const newAnswers = [...answers, {
      questionId: selectedQuestions[currentQuestionIndex].id,
      category: selectedQuestions[currentQuestionIndex].category,
      archetype: option.archetype,
      option: option
    }];
    
    setAnswers(newAnswers);

    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Complete the quiz and analyze results
      const archetypeScores = {};
      newAnswers.forEach(answer => {
        archetypeScores[answer.archetype] = (archetypeScores[answer.archetype] || 0) + 1;
      });
      
      const dominantArchetype = Object.entries(archetypeScores)
        .sort(([,a], [,b]) => b - a)[0][0];
      
      const result = {
        dominantArchetype,
        archetypeScores,
        answers: newAnswers,
        totalQuestions: selectedQuestions.length
      };
      
      setIsComplete(true);
      onComplete(result);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'career': return <Target className="h-4 w-4" />;
      case 'relationships': return <Heart className="h-4 w-4" />;
      case 'values': return <Compass className="h-4 w-4" />;
      case 'challenges': return <Star className="h-4 w-4" />;
      case 'growth': return <Brain className="h-4 w-4" />;
      case 'communication': return <Users className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  if (selectedQuestions.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">
              {getTranslation("Loading quiz questions...", "प्रश्न लोड हो रहे हैं...")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isComplete) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-green-600">
            {getTranslation("Quiz Complete!", "प्रश्नोत्तरी पूर्ण!")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            {getTranslation(
              "Your personality profile has been analyzed and will be integrated with your Kundali for more accurate predictions.",
              "आपकी व्यक्तित्व प्रोफ़ाइल का विश्लेषण हो गया है और बेहतर भविष्यवाणियों के लिए इसे आपकी कुंडली के साथ जोड़ा जाएगा।"
            )}
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = selectedQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / selectedQuestions.length) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {getCategoryIcon(currentQuestion.category)}
            <Badge variant="outline" className="capitalize">
              {currentQuestion.category}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {currentQuestionIndex + 1} / {selectedQuestions.length}
          </div>
        </div>
        <Progress value={progress} className="w-full" />
        <CardTitle className="text-lg mt-4">
          {currentQuestion.question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {currentQuestion.options.map((option: any) => (
            <Button
              key={option.id}
              variant="outline"
              className="w-full text-left justify-start h-auto p-4 hover:bg-primary/5"
              onClick={() => handleAnswer(option)}
            >
              <span className="text-sm">{option.text}</span>
            </Button>
          ))}
        </div>
        
        <div className="mt-6 text-center text-xs text-muted-foreground">
          {getTranslation(
            "Choose the option that best resonates with you",
            "जो विकल्प आपको सबसे उपयुक्त लगे उसे चुनें"
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalityQuiz;
