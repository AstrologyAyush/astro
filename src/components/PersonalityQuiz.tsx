import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Heart, Target, Users, Star, Compass, Eye } from "lucide-react";

// Enhanced psychological question bank based on Big Five, cognitive patterns, and decision-making
const ENHANCED_QUESTION_BANK: { [key: string]: any[] } = {
  cognitive_bias: [
    {
      id: 1,
      category: "cognitive_bias",
      question: "You invested $1000 in a stock that's now worth $800. A friend suggests cutting losses, but you've read that the company might recover. What drives your decision?",
      options: [
        { id: "a", text: "Cut losses immediately - past investment shouldn't influence future decisions", traits: ["analytical", "rational", "decisive"], archetype: "Analyst" },
        { id: "b", text: "Hold on - I've already invested too much to quit now", traits: ["persistent", "emotional", "loss_averse"], archetype: "Persister" },
        { id: "c", text: "Research more data and company fundamentals before deciding", traits: ["methodical", "cautious", "information_seeking"], archetype: "Researcher" },
        { id: "d", text: "Trust my gut feeling about the company's potential", traits: ["intuitive", "optimistic", "risk_tolerant"], archetype: "Intuitive" }
      ]
    },
    {
      id: 2,
      category: "cognitive_bias",
      question: "You're hiring for your team. Candidate A has perfect credentials but seems overconfident. Candidate B has good credentials and seems humble. How do you decide?",
      options: [
        { id: "a", text: "Choose A - confidence usually indicates competence", traits: ["heuristic_thinking", "confident", "quick_judge"], archetype: "Decider" },
        { id: "b", text: "Choose B - humility suggests better teamwork and growth mindset", traits: ["people_focused", "collaborative", "growth_oriented"], archetype: "Team_Builder" },
        { id: "c", text: "Design specific tests to measure actual competence objectively", traits: ["systematic", "fair", "evidence_based"], archetype: "Evaluator" },
        { id: "d", text: "Interview more candidates to have better comparison data", traits: ["thorough", "cautious", "comparative"], archetype: "Optimizer" }
      ]
    }
  ],
  moral_reasoning: [
    {
      id: 3,
      category: "moral_reasoning",
      question: "You discover your company is using a legal but environmentally harmful practice that saves money. As a manager, you:",
      options: [
        { id: "a", text: "Raise concerns internally - legality doesn't equal morality", traits: ["principled", "courageous", "ethical"], archetype: "Moral_Leader" },
        { id: "b", text: "Follow company policy - it's not my place to question legal decisions", traits: ["loyal", "rule_following", "hierarchical"], archetype: "Company_Loyalist" },
        { id: "c", text: "Research alternatives that could be both profitable and ethical", traits: ["innovative", "balanced", "solution_oriented"], archetype: "Problem_Solver" },
        { id: "d", text: "Focus on my own work - broader company decisions aren't my responsibility", traits: ["focused", "individualistic", "pragmatic"], archetype: "Task_Focused" }
      ]
    },
    {
      id: 4,
      category: "moral_reasoning",
      question: "A close friend asks you to lie to their spouse about their whereabouts so they can plan a surprise party. You:",
      options: [
        { id: "a", text: "Agree to help - small lies for good intentions are acceptable", traits: ["loyal", "flexible_ethics", "relationship_focused"], archetype: "Loyal_Friend" },
        { id: "b", text: "Refuse - lying is wrong regardless of the intention", traits: ["principled", "consistent", "truth_oriented"], archetype: "Truth_Seeker" },
        { id: "c", text: "Suggest alternative ways to keep the surprise without lying", traits: ["creative", "ethical", "problem_solving"], archetype: "Creative_Ethics" },
        { id: "d", text: "Help but feel uncomfortable about the deception", traits: ["conflicted", "people_pleasing", "anxious"], archetype: "Conflicted_Helper" }
      ]
    }
  ],
  decision_making: [
    {
      id: 5,
      category: "decision_making",
      question: "You have 30 minutes to choose between two job offers. One offers higher pay but longer hours, the other offers better work-life balance but lower pay. You:",
      options: [
        { id: "a", text: "Make a quick pros/cons list and decide rationally", traits: ["systematic", "logical", "efficient"], archetype: "Rational_Decider" },
        { id: "b", text: "Go with whichever 'feels' right in my gut", traits: ["intuitive", "emotional", "spontaneous"], archetype: "Intuitive_Decider" },
        { id: "c", text: "Ask for more time - this decision is too important to rush", traits: ["cautious", "thorough", "deliberate"], archetype: "Careful_Planner" },
        { id: "d", text: "Choose based on what my family/friends would advise", traits: ["social", "consensus_seeking", "external_validation"], archetype: "Social_Validator" }
      ]
    },
    {
      id: 6,
      category: "decision_making",
      question: "You're leading a project with a tight deadline. Your team is split 50/50 on two different approaches. You:",
      options: [
        { id: "a", text: "Make the final decision quickly based on my experience", traits: ["decisive", "confident", "leadership"], archetype: "Authority_Leader" },
        { id: "b", text: "Facilitate more discussion until we reach consensus", traits: ["collaborative", "patient", "consensus_building"], archetype: "Democratic_Leader" },
        { id: "c", text: "Split the team to try both approaches and see which works", traits: ["experimental", "resource_intensive", "data_driven"], archetype: "Experimental_Leader" },
        { id: "d", text: "Consult with external experts for guidance", traits: ["cautious", "expert_seeking", "risk_averse"], archetype: "Advisory_Leader" }
      ]
    }
  ],
  stress_response: [
    {
      id: 7,
      category: "stress_response",
      question: "Your biggest project fails publicly despite your best efforts. Your immediate response is:",
      options: [
        { id: "a", text: "Analyze what went wrong to prevent future failures", traits: ["analytical", "growth_minded", "resilient"], archetype: "Learning_Oriented" },
        { id: "b", text: "Feel devastated and need time to recover emotionally", traits: ["emotional", "sensitive", "self_reflective"], archetype: "Emotionally_Responsive" },
        { id: "c", text: "Start working immediately on the next project", traits: ["action_oriented", "avoidant", "productive"], archetype: "Action_Taker" },
        { id: "d", text: "Blame external factors beyond my control", traits: ["defensive", "external_locus", "protective"], archetype: "External_Attributor" }
      ]
    },
    {
      id: 8,
      category: "stress_response",
      question: "You're facing multiple deadlines and limited resources. You typically:",
      options: [
        { id: "a", text: "Create a detailed priority matrix and tackle systematically", traits: ["organized", "strategic", "methodical"], archetype: "Strategic_Organizer" },
        { id: "b", text: "Work on whatever feels most urgent in the moment", traits: ["reactive", "flexible", "spontaneous"], archetype: "Reactive_Responder" },
        { id: "c", text: "Negotiate deadlines or delegate to reduce workload", traits: ["diplomatic", "collaborative", "resource_savvy"], archetype: "Negotiator" },
        { id: "d", text: "Push through with long hours until everything is done", traits: ["persistent", "hardworking", "self_sacrificing"], archetype: "Persistent_Worker" }
      ]
    }
  ],
  social_dynamics: [
    {
      id: 9,
      category: "social_dynamics",
      question: "At a networking event, you notice someone standing alone who looks uncomfortable. You:",
      options: [
        { id: "a", text: "Approach them and start a friendly conversation", traits: ["empathetic", "social", "inclusive"], archetype: "Social_Includer" },
        { id: "b", text: "Want to help but worry about making them more uncomfortable", traits: ["considerate", "anxious", "overthinking"], archetype: "Thoughtful_Observer" },
        { id: "c", text: "Focus on my own networking goals for the evening", traits: ["goal_oriented", "focused", "self_interested"], archetype: "Goal_Focused" },
        { id: "d", text: "Find someone else to introduce them to", traits: ["connector", "strategic", "facilitating"], archetype: "Social_Facilitator" }
      ]
    },
    {
      id: 10,
      category: "social_dynamics",
      question: "A colleague takes credit for your idea in a meeting. You:",
      options: [
        { id: "a", text: "Speak up immediately to clarify the idea was mine", traits: ["assertive", "direct", "self_advocating"], archetype: "Direct_Asserter" },
        { id: "b", text: "Address it privately with the colleague after the meeting", traits: ["diplomatic", "conflict_averse", "private"], archetype: "Private_Resolver" },
        { id: "c", text: "Let it go this time but document future ideas better", traits: ["pragmatic", "learning_oriented", "strategic"], archetype: "Strategic_Learner" },
        { id: "d", text: "Feel hurt but say nothing to avoid conflict", traits: ["conflict_avoidant", "passive", "sensitive"], archetype: "Conflict_Avoider" }
      ]
    }
  ],
  risk_assessment: [
    {
      id: 11,
      category: "risk_assessment",
      question: "You're offered a chance to start your own business, but it means leaving a stable job and using your savings. You:",
      options: [
        { id: "a", text: "Take the leap - great opportunities require bold action", traits: ["risk_taking", "optimistic", "entrepreneurial"], archetype: "Bold_Entrepreneur" },
        { id: "b", text: "Decline - security and stability are more important", traits: ["risk_averse", "security_focused", "conservative"], archetype: "Security_Seeker" },
        { id: "c", text: "Try to start the business part-time while keeping my job", traits: ["cautious", "balanced", "gradual"], archetype: "Cautious_Explorer" },
        { id: "d", text: "Research extensively and create a detailed business plan first", traits: ["analytical", "prepared", "methodical"], archetype: "Prepared_Planner" }
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
    // Select 15 questions ensuring variety across categories
    const categories = Object.keys(ENHANCED_QUESTION_BANK);
    const selected: any[] = [];
    
    // Get at least 2 questions from each category
    categories.forEach(category => {
      const categoryQuestions = ENHANCED_QUESTION_BANK[category];
      const shuffled = categoryQuestions.sort(() => Math.random() - 0.5);
      selected.push(...shuffled.slice(0, 2));
    });
    
    // Add random questions to reach 15 total
    const allQuestions = Object.values(ENHANCED_QUESTION_BANK).flat();
    const remainingQuestions = allQuestions.filter(q => !selected.find(s => s.id === q.id));
    const additionalCount = Math.max(0, 15 - selected.length);
    
    for (let i = 0; i < additionalCount && i < remainingQuestions.length; i++) {
      const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
      selected.push(remainingQuestions.splice(randomIndex, 1)[0]);
    }
    
    // Final shuffle
    const finalSelection = selected.sort(() => Math.random() - 0.5).slice(0, 15);
    setSelectedQuestions(finalSelection);
  }, []);

  const handleAnswer = (option: any) => {
    const newAnswers = [...answers, {
      questionId: selectedQuestions[currentQuestionIndex].id,
      category: selectedQuestions[currentQuestionIndex].category,
      archetype: option.archetype,
      traits: option.traits,
      option: option
    }];
    
    setAnswers(newAnswers);

    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Complete analysis
      const result = analyzePersonality(newAnswers);
      setIsComplete(true);
      onComplete(result);
    }
  };

  const analyzePersonality = (answers: any[]) => {
    // Count traits and archetypes
    const traitCounts: { [key: string]: number } = {};
    const archetypeCounts: { [key: string]: number } = {};
    const categoryDistribution: { [key: string]: number } = {};

    answers.forEach(answer => {
      // Count traits
      answer.traits.forEach((trait: string) => {
        traitCounts[trait] = (traitCounts[trait] || 0) + 1;
      });
      
      // Count archetypes
      archetypeCounts[answer.archetype] = (archetypeCounts[answer.archetype] || 0) + 1;
      
      // Count categories
      categoryDistribution[answer.category] = (categoryDistribution[answer.category] || 0) + 1;
    });

    // Determine dominant traits and archetypes
    const dominantTraits = Object.entries(traitCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([trait, count]) => ({ trait, count, percentage: Math.round((count / answers.length) * 100) }));

    const dominantArchetype = Object.entries(archetypeCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0];

    // Generate comprehensive personality profile
    const personalityProfile = generatePersonalityProfile(dominantTraits, dominantArchetype[0], answers);

    return {
      dominantArchetype: dominantArchetype[0],
      dominantTraits,
      archetypeCounts,
      categoryDistribution,
      personalityProfile,
      totalQuestions: selectedQuestions.length,
      answers
    };
  };

  const generatePersonalityProfile = (traits: any[], archetype: string, answers: any[]) => {
    // Big Five personality dimensions analysis
    const bigFiveScores = calculateBigFive(traits, answers);
    
    // Cognitive style analysis
    const cognitiveStyle = analyzeCognitiveStyle(answers);
    
    // Leadership style
    const leadershipStyle = analyzeLeadershipStyle(answers);
    
    // Decision-making pattern
    const decisionMakingPattern = analyzeDecisionMaking(answers);
    
    // Stress response pattern
    const stressResponse = analyzeStressResponse(answers);

    return {
      archetype,
      bigFiveScores,
      cognitiveStyle,
      leadershipStyle,
      decisionMakingPattern,
      stressResponse,
      strengthsAndWeaknesses: generateStrengthsWeaknesses(traits, archetype),
      careerSuggestions: generateCareerSuggestions(archetype, traits),
      developmentAreas: generateDevelopmentAreas(traits, answers),
      communicationStyle: analyzeCommunicationStyle(answers),
      conflictStyle: analyzeConflictStyle(answers)
    };
  };

  const calculateBigFive = (traits: any[], answers: any[]) => {
    // Simplified Big Five calculation based on traits
    const bigFive = {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0
    };

    traits.forEach(({ trait, count }) => {
      const weight = count / answers.length;
      
      // Map traits to Big Five dimensions
      if (['creative', 'innovative', 'experimental', 'curious'].includes(trait)) {
        bigFive.openness += weight * 20;
      }
      if (['organized', 'systematic', 'methodical', 'prepared'].includes(trait)) {
        bigFive.conscientiousness += weight * 20;
      }
      if (['social', 'assertive', 'confident', 'leadership'].includes(trait)) {
        bigFive.extraversion += weight * 20;
      }
      if (['empathetic', 'collaborative', 'considerate', 'helpful'].includes(trait)) {
        bigFive.agreeableness += weight * 20;
      }
      if (['anxious', 'emotional', 'sensitive', 'conflicted'].includes(trait)) {
        bigFive.neuroticism += weight * 20;
      }
    });

    // Normalize scores to 0-100
    Object.keys(bigFive).forEach(key => {
      bigFive[key as keyof typeof bigFive] = Math.min(100, Math.max(0, bigFive[key as keyof typeof bigFive]));
    });

    return bigFive;
  };

  const analyzeCognitiveStyle = (answers: any[]) => {
    const cognitiveAnswers = answers.filter(a => a.category === 'cognitive_bias');
    const styles = {
      analytical: 0,
      intuitive: 0,
      systematic: 0,
      heuristic: 0
    };

    cognitiveAnswers.forEach(answer => {
      if (answer.traits.includes('analytical') || answer.traits.includes('systematic')) {
        styles.analytical++;
        styles.systematic++;
      }
      if (answer.traits.includes('intuitive') || answer.traits.includes('heuristic_thinking')) {
        styles.intuitive++;
        styles.heuristic++;
      }
    });

    const dominant = Object.entries(styles).sort(([,a], [,b]) => b - a)[0][0];
    return { dominant, scores: styles };
  };

  const analyzeLeadershipStyle = (answers: any[]) => {
    const leadershipAnswers = answers.filter(a => 
      a.category === 'decision_making' || 
      a.archetype.includes('Leader')
    );

    const styles = ['Democratic', 'Authoritative', 'Collaborative', 'Advisory'];
    const styleScores: { [key: string]: number } = {};
    
    styles.forEach(style => {
      styleScores[style] = leadershipAnswers.filter(a => 
        a.archetype.includes(style) || a.archetype.includes(style.replace('_', ' '))
      ).length;
    });

    const dominantStyle = Object.entries(styleScores).sort(([,a], [,b]) => b - a)[0][0] || 'Adaptive';
    return { dominant: dominantStyle, scores: styleScores };
  };

  const analyzeDecisionMaking = (answers: any[]) => {
    const decisionAnswers = answers.filter(a => a.category === 'decision_making');
    
    const patterns = {
      quick_decisive: 0,
      analytical_thorough: 0,
      consensus_seeking: 0,
      intuitive_based: 0
    };

    decisionAnswers.forEach(answer => {
      if (answer.traits.includes('decisive') || answer.traits.includes('quick_judge')) {
        patterns.quick_decisive++;
      }
      if (answer.traits.includes('analytical') || answer.traits.includes('thorough')) {
        patterns.analytical_thorough++;
      }
      if (answer.traits.includes('consensus_seeking') || answer.traits.includes('collaborative')) {
        patterns.consensus_seeking++;
      }
      if (answer.traits.includes('intuitive') || answer.traits.includes('emotional')) {
        patterns.intuitive_based++;
      }
    });

    const dominant = Object.entries(patterns).sort(([,a], [,b]) => b - a)[0][0];
    return { dominant, patterns };
  };

  const analyzeStressResponse = (answers: any[]) => {
    const stressAnswers = answers.filter(a => a.category === 'stress_response');
    
    const responses = {
      problem_solving: 0,
      emotional_processing: 0,
      action_taking: 0,
      avoidance: 0
    };

    stressAnswers.forEach(answer => {
      if (answer.traits.includes('analytical') || answer.traits.includes('learning_oriented')) {
        responses.problem_solving++;
      }
      if (answer.traits.includes('emotional') || answer.traits.includes('self_reflective')) {
        responses.emotional_processing++;
      }
      if (answer.traits.includes('action_oriented') || answer.traits.includes('productive')) {
        responses.action_taking++;
      }
      if (answer.traits.includes('avoidant') || answer.traits.includes('defensive')) {
        responses.avoidance++;
      }
    });

    const dominant = Object.entries(responses).sort(([,a], [,b]) => b - a)[0][0];
    return { dominant, responses };
  };

  const analyzeCommunicationStyle = (answers: any[]) => {
    const socialAnswers = answers.filter(a => a.category === 'social_dynamics');
    
    const styles = {
      direct: 0,
      diplomatic: 0,
      collaborative: 0,
      observational: 0
    };

    socialAnswers.forEach(answer => {
      if (answer.traits.includes('direct') || answer.traits.includes('assertive')) {
        styles.direct++;
      }
      if (answer.traits.includes('diplomatic') || answer.traits.includes('private')) {
        styles.diplomatic++;
      }
      if (answer.traits.includes('collaborative') || answer.traits.includes('inclusive')) {
        styles.collaborative++;
      }
      if (answer.traits.includes('thoughtful') || answer.traits.includes('considerate')) {
        styles.observational++;
      }
    });

    const dominant = Object.entries(styles).sort(([,a], [,b]) => b - a)[0][0];
    return { dominant, styles };
  };

  const analyzeConflictStyle = (answers: any[]) => {
    const conflictAnswers = answers.filter(a => 
      a.category === 'social_dynamics' || a.category === 'moral_reasoning'
    );
    
    const styles = {
      confrontational: 0,
      collaborative: 0,
      avoidant: 0,
      assertive: 0
    };

    conflictAnswers.forEach(answer => {
      if (answer.traits.includes('direct') || answer.traits.includes('courageous')) {
        styles.confrontational++;
      }
      if (answer.traits.includes('collaborative') || answer.traits.includes('consensus_seeking')) {
        styles.collaborative++;
      }
      if (answer.traits.includes('conflict_averse') || answer.traits.includes('passive')) {
        styles.avoidant++;
      }
      if (answer.traits.includes('assertive') || answer.traits.includes('principled')) {
        styles.assertive++;
      }
    });

    const dominant = Object.entries(styles).sort(([,a], [,b]) => b - a)[0][0];
    return { dominant, styles };
  };

  const generateStrengthsWeaknesses = (traits: any[], archetype: string) => {
    const topTraits = traits.slice(0, 3).map(t => t.trait);
    
    const strengthMap: { [key: string]: string[] } = {
      analytical: ["Strong problem-solving skills", "Data-driven decision making", "Logical thinking"],
      creative: ["Innovative thinking", "Adaptability", "Original solutions"],
      empathetic: ["Strong emotional intelligence", "Team building", "Conflict resolution"],
      decisive: ["Quick decision making", "Leadership potential", "Action-oriented"],
      systematic: ["Excellent planning", "Attention to detail", "Process improvement"]
    };

    const weaknessMap: { [key: string]: string[] } = {
      analytical: ["May overthink simple decisions", "Can seem cold or impersonal", "Analysis paralysis"],
      emotional: ["May make impulsive decisions", "Sensitive to criticism", "Stress from conflict"],
      risk_taking: ["May ignore important details", "Potential for reckless decisions", "Difficulty with routine"],
      conflict_avoidant: ["May avoid necessary confrontations", "Difficulty with direct feedback", "Can be taken advantage of"],
      perfectionistic: ["May procrastinate on imperfect solutions", "High stress from mistakes", "Difficulty delegating"]
    };

    const strengths: string[] = [];
    const weaknesses: string[] = [];

    topTraits.forEach(trait => {
      if (strengthMap[trait]) {
        strengths.push(...strengthMap[trait]);
      }
      if (weaknessMap[trait]) {
        weaknesses.push(...weaknessMap[trait]);
      }
    });

    return {
      strengths: strengths.slice(0, 5),
      weaknesses: weaknesses.slice(0, 5)
    };
  };

  const generateCareerSuggestions = (archetype: string, traits: any[]) => {
    const careerMap: { [key: string]: string[] } = {
      Analyst: ["Data Scientist", "Financial Analyst", "Research Scientist", "Strategy Consultant"],
      Creative_Ethics: ["Product Manager", "Social Entrepreneur", "Design Thinking Facilitator"],
      Authority_Leader: ["Executive", "Project Manager", "Team Lead", "Operations Director"],
      Democratic_Leader: ["HR Manager", "Facilitator", "Community Organizer", "Collaborative Manager"],
      Problem_Solver: ["Engineer", "Consultant", "Innovation Manager", "Systems Analyst"],
      Social_Includer: ["Human Resources", "Community Relations", "Customer Success", "Training & Development"]
    };

    return careerMap[archetype] || ["Leadership roles", "Analytical positions", "Creative fields", "People-focused careers"];
  };

  const generateDevelopmentAreas = (traits: any[], answers: any[]) => {
    const areas: string[] = [];
    
    const traitNames = traits.map(t => t.trait);
    
    if (!traitNames.includes('emotional')) {
      areas.push("Develop emotional intelligence and empathy");
    }
    if (!traitNames.includes('assertive')) {
      areas.push("Practice assertive communication and boundary setting");
    }
    if (!traitNames.includes('analytical')) {
      areas.push("Strengthen analytical and critical thinking skills");
    }
    if (!traitNames.includes('creative')) {
      areas.push("Enhance creative problem-solving abilities");
    }
    if (!traitNames.includes('collaborative')) {
      areas.push("Improve teamwork and collaboration skills");
    }

    return areas.slice(0, 4);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cognitive_bias': return <Brain className="h-5 w-5 text-pink-500 md:h-6 md:w-6" />;
      case 'moral_reasoning': return <Compass className="h-5 w-5 text-blue-500 md:h-6 md:w-6" />;
      case 'decision_making': return <Target className="h-5 w-5 text-green-600 md:h-6 md:w-6" />;
      case 'stress_response': return <Heart className="h-5 w-5 text-red-500 md:h-6 md:w-6" />;
      case 'social_dynamics': return <Users className="h-5 w-5 text-orange-500 md:h-6 md:w-6" />;
      case 'risk_assessment': return <Eye className="h-5 w-5 text-indigo-500 md:h-6 md:w-6" />;
      default: return <Star className="h-5 w-5 text-gray-400 md:h-6 md:w-6" />;
    }
  };

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  if (selectedQuestions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[250px] animate-fade-in">
        <div className="p-4 flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-2"></div>
          <span className="mt-1 text-sm text-muted-foreground text-center">
            {getTranslation("Loading Personality Quiz...", "व्यक्तित्व परीक्षण लोड हो रहा है...")}
          </span>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <Card className="w-full max-w-xl mx-auto animate-fade-in mt-4 mb-4 shadow-lg !rounded-xl">
        <CardHeader>
          <CardTitle className="text-center text-green-600">
            {getTranslation("Personality Analysis Complete!", "व्यक्तित्व विश्लेषण पूर्ण!")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-md">
          <span className="block mb-3 text-center text-muted-foreground">
            {getTranslation(
              "Your comprehensive profile has been analyzed and will be integrated into your Kundali.",
              "आपकी पूरी प्रोफ़ाइल का विश्लेषण कर लिया गया है, इसे आपकी कुंडली के साथ जोड़ा जाएगा।"
            )}
          </span>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = selectedQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / selectedQuestions.length) * 100;

  return (
    <div className="w-full flex flex-col items-center min-h-[80vh] px-1 pt-1 pb-4">
      <div
        className="max-w-md w-full rounded-xl shadow-lg bg-gradient-to-b from-orange-50 to-white dark:from-neutral-900 dark:to-neutral-900 relative animate-fade-in"
      >
        {/* Sticky progress bar/header for mobile */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-orange-100 to-transparent dark:from-neutral-900/90 p-2 md:p-3 rounded-t-xl mb-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              {getCategoryIcon(currentQuestion.category)}
              <span className="capitalize font-semibold text-xs md:text-sm text-neutral-700 dark:text-gray-200">
                {currentQuestion.category.replace(/_/g, ' ')}
              </span>
            </div>
            <span className="text-xs text-neutral-400">{currentQuestionIndex + 1}/{selectedQuestions.length}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-2 bg-gradient-to-r from-primary to-orange-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="px-3 py-3 md:px-6 md:py-6">
          <h1 className="text-base md:text-lg font-bold text-primary mb-2 text-center leading-snug">
            {currentQuestion.question}
          </h1>

          {/* Option buttons (mobile friendly, visually distinct) */}
          <div className="space-y-2 md:space-y-3">
            {currentQuestion.options.map((option: any) => (
              <Button
                key={option.id}
                variant="outline"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-primary/20 bg-white dark:bg-neutral-950 shadow-sm hover:bg-primary/10 active:scale-[0.98] transition-all text-start focus-visible:ring-2 focus-visible:ring-primary"
                style={{
                  minHeight: '52px',
                  fontWeight: 500,
                  fontSize: '1rem'
                }}
                onClick={() => handleAnswer(option)}
              >
                <span className="inline-block w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center text-lg font-bold text-primary/90 shadow">{option.id.toUpperCase()}</span>
                <span className="grow text-xs md:text-sm leading-normal">{option.text}</span>
              </Button>
            ))}
          </div>

          {/* Helper message */}
          <div className="mt-5 flex flex-col items-center">
            <div className="text-center text-xs md:text-sm text-neutral-500 dark:text-gray-400">
              <span className="block">{getTranslation(
                "Choose the answer that most truly reflects how you would respond—even if it's difficult.",
                "वह जवाब चुनें जो सच में बताता है कि आप कैसे प्रतिक्रिया करेंगे—चाहे वह कठिन क्यों न हो।"
              )}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalityQuiz;
