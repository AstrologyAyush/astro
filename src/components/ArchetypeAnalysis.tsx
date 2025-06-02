
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { detectArchetypeFromAnswer, matchArchetypeToKundali, ARCHETYPES } from '@/lib/enhancedKundaliEngine';

interface ArchetypeAnalysisProps {
  kundali?: any;
  language: 'hi' | 'en';
}

const ArchetypeAnalysis: React.FC<ArchetypeAnalysisProps> = ({ kundali, language }) => {
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const scenarios = {
    en: [
      "You're offered a powerful job that violates your personal ethics but guarantees success. What would you do?",
      "You discover a close friend has been lying to you about something important. How do you handle this?",
      "You have to choose between following your passion or taking care of family responsibilities. What's your approach?",
      "Someone challenges your beliefs in public. How do you respond?",
      "You find yourself in a leadership position during a crisis. What's your strategy?"
    ],
    hi: [
      "आपको एक शक्तिशाली नौकरी की पेशकश की जाती है जो आपकी व्यक्तिगत नैतिकता का उल्लंघन करती है लेकिन सफलता की गारंटी देती है। आप क्या करेंगे?",
      "आपको पता चलता है कि एक करीबी दोस्त आपसे किसी महत्वपूर्ण बात के बारे में झूठ बोल रहा है। आप इसे कैसे संभालते हैं?",
      "आपको अपने जुनून का पालन करने या पारिवारिक जिम्मेदारियों का ख्याल रखने के बीच चुनना है। आपका दृष्टिकोण क्या है?",
      "कोई सार्वजनिक रूप से आपकी मान्यताओं को चुनौती देता है। आप कैसे जवाब देते हैं?",
      "संकट के दौरान आप खुद को नेतृत्व की स्थिति में पाते हैं। आपकी रणनीति क्या है?"
    ]
  };

  const [currentScenario, setCurrentScenario] = useState(0);

  const analyzeResponse = async () => {
    if (!answer.trim() || !kundali) return;
    
    setLoading(true);
    try {
      // Detect psychological archetype
      const psychArchetype = detectArchetypeFromAnswer(answer);
      
      // Match against kundali
      const match = matchArchetypeToKundali(psychArchetype.type, kundali);
      
      // Calculate deviation
      const deviation = {
        aligned: psychArchetype.type === match.archetype,
        deviationScore: psychArchetype.type === match.archetype ? 0 : Math.max(10 - match.score, 1),
        message: psychArchetype.type === match.archetype 
          ? 'Psychological and astrological profile aligned.' 
          : 'Behavior conflicts with birth chart.'
      };

      setResult({
        psychArchetype: psychArchetype.type,
        psychScore: psychArchetype.score,
        ...match,
        ...deviation
      });
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextScenario = () => {
    setCurrentScenario((prev) => (prev + 1) % scenarios[language].length);
    setAnswer('');
    setResult(null);
  };

  const getArchetypeColor = (archetype: string) => {
    const colors: Record<string, string> = {
      Rebel: 'bg-red-500',
      Sage: 'bg-blue-500',
      Warrior: 'bg-orange-500',
      Monk: 'bg-purple-500',
      King: 'bg-yellow-500',
      Magician: 'bg-green-500',
      Survivor: 'bg-gray-500',
      Empath: 'bg-pink-500'
    };
    return colors[archetype] || 'bg-gray-500';
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">
            {language === 'hi' ? 'व्यक्तित्व विश्लेषण' : 'Personality Analysis'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Scenario */}
          <div className="space-y-3">
            <div className="text-sm font-medium">
              {language === 'hi' ? 'परिस्थिति:' : 'Scenario:'}
            </div>
            <div className="p-3 bg-muted rounded-lg text-sm">
              {scenarios[language][currentScenario]}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={nextScenario}
              className="w-full"
            >
              {language === 'hi' ? 'नई परिस्थिति' : 'New Scenario'}
            </Button>
          </div>

          {/* Answer Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {language === 'hi' ? 'आपका उत्तर:' : 'Your Response:'}
            </label>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={language === 'hi' 
                ? "इस स्थिति में आप क्या करेंगे? विस्तार से बताएं..."
                : "What would you do in this situation? Explain in detail..."
              }
              rows={4}
              className="text-sm"
            />
          </div>

          {/* Analyze Button */}
          <Button 
            onClick={analyzeResponse}
            disabled={!answer.trim() || !kundali || loading}
            className="w-full"
          >
            {loading 
              ? (language === 'hi' ? 'विश्लेषण हो रहा है...' : 'Analyzing...')
              : (language === 'hi' ? 'विश्लेषण करें' : 'Analyze')
            }
          </Button>

          {/* Results */}
          {result && (
            <div className="space-y-4 mt-6">
              <div className="text-center space-y-2">
                <div className="text-sm text-muted-foreground">
                  {language === 'hi' ? 'मानसिक प्रकार' : 'Psychological Type'}
                </div>
                <Badge className={`${getArchetypeColor(result.psychArchetype)} text-white`}>
                  {result.psychArchetype}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">
                  {language === 'hi' ? 'ज्योतिषीय मिलान स्कोर:' : 'Astrological Match Score:'}
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={(result.score / 10) * 100} className="flex-1" />
                  <span className="text-sm">{result.score}/10</span>
                </div>
                <Badge variant={
                  result.matchLevel === 'High' ? 'default' : 
                  result.matchLevel === 'Medium' ? 'secondary' : 'outline'
                }>
                  {result.matchLevel} Match
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">
                  {language === 'hi' ? 'विचलन:' : 'Deviation:'}
                </div>
                <div className={`p-3 rounded-lg text-sm ${
                  result.aligned ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'
                }`}>
                  {language === 'hi' ? 
                    (result.aligned ? 'आपका व्यक्तित्व और कुंडली में तालमेल है।' : 'आपके व्यवहार और जन्म कुंडली में विरोधाभास है।') :
                    result.message
                  }
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">
                  {language === 'hi' ? 'सुझाव:' : 'Recommendation:'}
                </div>
                <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
                  {result.recommendation}
                </div>
              </div>

              {result.reasons && result.reasons.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">
                    {language === 'hi' ? 'कारण:' : 'Reasons:'}
                  </div>
                  <ul className="text-sm space-y-1">
                    {result.reasons.map((reason: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ArchetypeAnalysis;
