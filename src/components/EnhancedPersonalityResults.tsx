
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Target, Heart, Lightbulb, Brain, Sparkles, ArrowRight } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

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

interface EnhancedPersonalityResultsProps {
  results: PersonalityResults;
  language: 'hi' | 'en';
  onRestart: () => void;
}

interface EnhancedInsights {
  simplePersonalityType: string;
  easyBigFiveExplanation: {
    openness: string;
    conscientiousness: string;
    extraversion: string;
    agreeableness: string;
    neuroticism: string;
  };
  lifeAdvice: string[];
  relationshipTips: string[];
  careerGuidance: string[];
  personalGrowth: string[];
  dailyHabits: string[];
}

const EnhancedPersonalityResults: React.FC<EnhancedPersonalityResultsProps> = ({ 
  results, 
  language, 
  onRestart 
}) => {
  const [enhancedInsights, setEnhancedInsights] = useState<EnhancedInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateEnhancedInsights = async () => {
    setIsLoading(true);
    try {
      const prompt = language === 'hi' 
        ? `आप एक मित्रवत व्यक्तित्व सलाहकार हैं। इस व्यक्ति के व्यक्तित्व को बहुत सरल भाषा में समझाएं:

व्यक्तित्व प्रकार: ${results.personalityType}
मुख्य गुण: ${results.dominantTraits.join(', ')}

बिग फाइव स्कोर:
- खुलापन: ${results.bigFiveScores.openness}%
- जिम्मेदारी: ${results.bigFiveScores.conscientiousness}%
- बाहरमुखता: ${results.bigFiveScores.extraversion}%
- सहमति: ${results.bigFiveScores.agreeableness}%
- चिंता स्तर: ${results.bigFiveScores.neuroticism}%

कृपया निम्नलिखित प्रारूप में जवाब दें:

1. सरल व्यक्तित्व प्रकार (एक वाक्य में)
2. बिग फाइव आसान व्याख्या (प्रत्येक के लिए एक सरल वाक्य)
3. जीवन सलाह (5 व्यावहारिक सुझाव)
4. रिश्ते की सलाह (4 सुझाव)
5. करियर मार्गदर्शन (4 सुझाव)
6. व्यक्तिगत विकास (4 सुझाव)
7. दैनिक आदतें (5 सुझाव)`
        : `You are a friendly personality advisor. Explain this person's personality in very simple, relatable language:

Personality Type: ${results.personalityType}
Key Traits: ${results.dominantTraits.join(', ')}

Big Five Scores:
- Openness: ${results.bigFiveScores.openness}%
- Conscientiousness: ${results.bigFiveScores.conscientiousness}%
- Extraversion: ${results.bigFiveScores.extraversion}%
- Agreeableness: ${results.bigFiveScores.agreeableness}%
- Neuroticism: ${results.bigFiveScores.neuroticism}%

Please respond in this format:

1. Simple Personality Type (one sentence)
2. Easy Big Five Explanation (one simple sentence for each)
3. Life Advice (5 practical tips)
4. Relationship Tips (4 tips)
5. Career Guidance (4 tips)
6. Personal Growth (4 tips)
7. Daily Habits (5 suggestions)`;

      const { data, error } = await supabase.functions.invoke('kundali-ai-analysis', {
        body: {
          kundaliData: { personality: results },
          userQuery: prompt,
          language,
          analysisType: 'personality_enhancement'
        }
      });

      if (error) throw error;

      const analysis = data.analysis;
      
      // Parse the AI response into structured data
      const insights = parseAIResponse(analysis, language);
      setEnhancedInsights(insights);

    } catch (error) {
      console.error('Error generating enhanced insights:', error);
      
      // Provide fallback insights
      setEnhancedInsights(generateFallbackInsights(results, language));
      
      toast({
        title: language === 'hi' ? "सूचना" : "Notice",
        description: language === 'hi' 
          ? "AI विश्लेषण उपलब्ध नहीं है, बुनियादी अंतर्दृष्टि दिखाई जा रही है।"
          : "AI analysis unavailable, showing basic insights.",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const parseAIResponse = (response: string, lang: string): EnhancedInsights => {
    // Simple parsing - in production, you'd want more sophisticated parsing
    const sections = response.split(/\d+\.|[A-Z][A-Za-z\s]+:|[अ-ह][ा-्\s]*:/);
    
    return {
      simplePersonalityType: sections[1]?.trim() || (lang === 'hi' ? "आप एक अनोखे व्यक्ति हैं" : "You are a unique individual"),
      easyBigFiveExplanation: {
        openness: lang === 'hi' ? "आप नए विचारों के लिए खुले हैं" : "You are open to new experiences",
        conscientiousness: lang === 'hi' ? "आप व्यवस्थित व्यक्ति हैं" : "You are organized and responsible",
        extraversion: lang === 'hi' ? "आप सामाजिक व्यक्ति हैं" : "You enjoy being around people",
        agreeableness: lang === 'hi' ? "आप दयालु व्यक्ति हैं" : "You are kind and cooperative",
        neuroticism: lang === 'hi' ? "आप भावनात्मक संतुलन रखते हैं" : "You handle stress well"
      },
      lifeAdvice: extractListFromResponse(response, lang === 'hi' ? ['जीवन', 'सलाह'] : ['life', 'advice']),
      relationshipTips: extractListFromResponse(response, lang === 'hi' ? ['रिश्ते', 'संबंध'] : ['relationship', 'tips']),
      careerGuidance: extractListFromResponse(response, lang === 'hi' ? ['करियर', 'व्यवसाय'] : ['career', 'work']),
      personalGrowth: extractListFromResponse(response, lang === 'hi' ? ['विकास', 'सुधार'] : ['growth', 'development']),
      dailyHabits: extractListFromResponse(response, lang === 'hi' ? ['दैनिक', 'आदतें'] : ['daily', 'habits'])
    };
  };

  const extractListFromResponse = (response: string, keywords: string[]): string[] => {
    // Simple extraction logic - in production, you'd want more sophisticated parsing
    const lines = response.split('\n').filter(line => line.trim());
    const relevantLines = lines.filter(line => 
      keywords.some(keyword => line.toLowerCase().includes(keyword.toLowerCase()))
    );
    
    return relevantLines.slice(0, 5).map(line => line.replace(/^\d+\.?\s*/, '').trim());
  };

  const generateFallbackInsights = (results: PersonalityResults, lang: string): EnhancedInsights => {
    return {
      simplePersonalityType: lang === 'hi' 
        ? `आप एक ${results.personalityType.toLowerCase()} व्यक्ति हैं जो अपने अनोखे तरीके से दुनिया को देखते हैं।`
        : `You are a ${results.personalityType.toLowerCase()} who sees the world in your own unique way.`,
      easyBigFiveExplanation: {
        openness: getBigFiveExplanation('openness', results.bigFiveScores.openness, lang),
        conscientiousness: getBigFiveExplanation('conscientiousness', results.bigFiveScores.conscientiousness, lang),
        extraversion: getBigFiveExplanation('extraversion', results.bigFiveScores.extraversion, lang),
        agreeableness: getBigFiveExplanation('agreeableness', results.bigFiveScores.agreeableness, lang),
        neuroticism: getBigFiveExplanation('neuroticism', results.bigFiveScores.neuroticism, lang)
      },
      lifeAdvice: lang === 'hi' 
        ? ["अपनी मजबूती का उपयोग करें", "चुनौतियों से सीखें", "धैर्य रखें", "लक्ष्य निर्धारित करें", "खुद पर विश्वास रखें"]
        : ["Use your strengths", "Learn from challenges", "Be patient with yourself", "Set clear goals", "Trust your instincts"],
      relationshipTips: lang === 'hi'
        ? ["खुला संवाद रखें", "दूसरों को समझें", "सीमाएं निर्धारित करें", "प्रशंसा दिखाएं"]
        : ["Communicate openly", "Listen actively", "Set healthy boundaries", "Show appreciation"],
      careerGuidance: lang === 'hi'
        ? ["अपनी प्रतिभा पहचानें", "नेटवर्किंग करें", "नए कौशल सीखें", "अवसरों की तलाश करें"]
        : ["Recognize your talents", "Build your network", "Keep learning", "Seek new opportunities"],
      personalGrowth: lang === 'hi'
        ? ["आत्म-चिंतन करें", "फीडबैक स्वीकारें", "नई चुनौतियां लें", "माइंडफुलनेस अभ्यास करें"]
        : ["Practice self-reflection", "Accept feedback", "Take on new challenges", "Practice mindfulness"],
      dailyHabits: lang === 'hi'
        ? ["नियमित व्यायाम करें", "पर्याप्त नींद लें", "पढ़ने की आदत डालें", "ध्यान करें", "कृतज्ञता दिखाएं"]
        : ["Exercise regularly", "Get enough sleep", "Read daily", "Practice meditation", "Express gratitude"]
    };
  };

  const getBigFiveExplanation = (trait: string, score: number, lang: string): string => {
    const level = score > 70 ? 'high' : score > 30 ? 'medium' : 'low';
    
    const explanations = {
      openness: {
        hi: {
          high: "आप नए अनुभवों और विचारों के लिए बहुत खुले हैं",
          medium: "आप कभी-कभी नई चीजें आजमाना पसंद करते हैं",
          low: "आप परंपरागत तरीकों को पसंद करते हैं"
        },
        en: {
          high: "You love new experiences and creative ideas",
          medium: "You sometimes enjoy trying new things",
          low: "You prefer familiar and traditional approaches"
        }
      },
      conscientiousness: {
        hi: {
          high: "आप बहुत व्यवस्थित और जिम्मेदार हैं",
          medium: "आप अधिकतर समय व्यवस्थित रहते हैं",
          low: "आप स्वतंत्र और लचीले हैं"
        },
        en: {
          high: "You are very organized and responsible",
          medium: "You are generally organized and reliable",
          low: "You are flexible and go with the flow"
        }
      },
      extraversion: {
        hi: {
          high: "आप बहुत सामाजिक और ऊर्जावान हैं",
          medium: "आप लोगों के साथ रहना पसंद करते हैं",
          low: "आप शांत समय और अकेलापन पसंद करते हैं"
        },
        en: {
          high: "You are very social and energetic",
          medium: "You enjoy being around people",
          low: "You prefer quiet time and solitude"
        }
      },
      agreeableness: {
        hi: {
          high: "आप बहुत दयालु और सहयोगी हैं",
          medium: "आप दूसरों की मदद करना पसंद करते हैं",
          low: "आप अपनी बात कहने से नहीं डरते"
        },
        en: {
          high: "You are very kind and cooperative",
          medium: "You like to help others",
          low: "You speak your mind and stand firm"
        }
      },
      neuroticism: {
        hi: {
          high: "आप भावनाओं को गहराई से महसूस करते हैं",
          medium: "आप कभी-कभी तनाव महसूस करते हैं",
          low: "आप शांत और तनावमुक्त रहते हैं"
        },
        en: {
          high: "You feel emotions deeply and intensely",
          medium: "You sometimes feel stressed or worried",
          low: "You stay calm and handle stress well"
        }
      }
    };

    return explanations[trait as keyof typeof explanations]?.[lang as 'hi' | 'en']?.[level] || "";
  };

  useEffect(() => {
    generateEnhancedInsights();
  }, [results]);

  if (isLoading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg">
            {language === 'hi' 
              ? 'आपके लिए व्यक्तिगत अंतर्दृष्टि तैयार की जा रही है...'
              : 'Preparing your personalized insights...'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Personality Card */}
      <Card className="max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg p-6">
          <CardTitle className="text-2xl md:text-3xl flex items-center justify-center gap-3">
            <Crown className="h-8 w-8" />
            {language === 'hi' ? 'आपका व्यक्तित्व विश्लेषण' : 'Your Personality Analysis'}
          </CardTitle>
          <p className="text-purple-100 mt-2">
            {enhancedInsights?.simplePersonalityType || results.personalityType}
          </p>
        </CardHeader>
        
        <CardContent className="p-6 space-y-8">
          {/* Simple Big Five Explanation */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-800">
              <Brain className="h-5 w-5" />
              {language === 'hi' ? 'आपके व्यक्तित्व के पांच मुख्य पहलू' : 'Five Key Aspects of Your Personality'}
            </h3>
            <div className="grid gap-4">
              {enhancedInsights && Object.entries(enhancedInsights.easyBigFiveExplanation).map(([trait, explanation]) => {
                const score = results.bigFiveScores[trait as keyof typeof results.bigFiveScores];
                const traitNames = {
                  openness: language === 'hi' ? 'नवीनता के लिए खुलापन' : 'Openness to New Things',
                  conscientiousness: language === 'hi' ? 'जिम्मेदारी' : 'Responsibility',
                  extraversion: language === 'hi' ? 'सामाजिकता' : 'Social Energy',
                  agreeableness: language === 'hi' ? 'सहयोग' : 'Cooperation',
                  neuroticism: language === 'hi' ? 'भावनात्मक स्थिरता' : 'Emotional Stability'
                };
                
                return (
                  <div key={trait} className="bg-white p-4 rounded-lg border border-purple-100">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-800">
                        {traitNames[trait as keyof typeof traitNames]}
                      </h4>
                      <span className="text-lg font-bold text-purple-600">{score}%</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{explanation}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1000" 
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Life Advice */}
          {enhancedInsights && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-green-200">
                <CardHeader className="bg-green-50">
                  <CardTitle className="text-green-800 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    {language === 'hi' ? 'जीवन सलाह' : 'Life Advice'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="space-y-2">
                    {enhancedInsights.lifeAdvice.map((advice, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{advice}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-pink-200">
                <CardHeader className="bg-pink-50">
                  <CardTitle className="text-pink-800 flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    {language === 'hi' ? 'रिश्तों की सलाह' : 'Relationship Tips'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="space-y-2">
                    {enhancedInsights.relationshipTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-pink-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="text-blue-800 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {language === 'hi' ? 'करियर मार्गदर्शन' : 'Career Guidance'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="space-y-2">
                    {enhancedInsights.careerGuidance.map((guidance, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{guidance}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader className="bg-orange-50">
                  <CardTitle className="text-orange-800 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    {language === 'hi' ? 'दैनिक आदतें' : 'Daily Habits'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="space-y-2">
                    {enhancedInsights.dailyHabits.map((habit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{habit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action Buttons */}
          <div className="text-center space-x-4 pt-4">
            <Button onClick={onRestart} variant="outline" className="border-purple-300 text-purple-700">
              {language === 'hi' ? 'फिर से करें' : 'Retake Test'}
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-md">
            <p>
              {language === 'hi' 
                ? "यह विश्लेषण मार्गदर्शन के लिए है। व्यावसायिक सलाह के लिए योग्य मनोवैज्ञानिक से संपर्क करें।" 
                : "This analysis is for guidance only. Consult a qualified psychologist for professional advice."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedPersonalityResults;
