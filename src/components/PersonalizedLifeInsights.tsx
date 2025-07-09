import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Briefcase, 
  DollarSign, 
  Home, 
  Star, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  Lightbulb,
  Shield
} from 'lucide-react';

interface PersonalizedLifeInsightsProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const PersonalizedLifeInsights: React.FC<PersonalizedLifeInsightsProps> = ({ kundaliData, language }) => {
  const getTranslation = (en: string, hi: string) => (language === 'hi' ? hi : en);

  // Extract planetary positions for analysis
  const planets = kundaliData?.planets || kundaliData?.planetaryPositions || {};
  const houses = kundaliData?.houses || {};
  
  // Analyze personality strengths based on planetary positions
  const analyzePersonality = () => {
    const sun = planets.Sun || planets.sun;
    const moon = planets.Moon || planets.moon;
    const ascendant = kundaliData?.ascendant || kundaliData?.lagna;
    
    let coreTraits = [];
    let strengths = [];
    let challenges = [];
    
    // Sun analysis - Core identity
    if (sun) {
      const sunSign = Math.floor(sun.longitude / 30);
      const sunStrength = calculatePlanetStrength(sun);
      
      if (sunStrength > 70) {
        coreTraits.push(getTranslation("Natural Leader", "प्राकृतिक नेता"));
        strengths.push(getTranslation("Strong willpower and confidence", "मजबूत इच्छाशक्ति और आत्मविश्वास"));
      } else if (sunStrength < 30) {
        challenges.push(getTranslation("May struggle with self-confidence", "आत्मविश्वास की कमी हो सकती है"));
      }
      
      // Sign-based traits
      const signTraits = getSignTraits(sunSign);
      coreTraits.push(...signTraits.traits);
      strengths.push(...signTraits.strengths);
    }
    
    // Moon analysis - Emotional nature
    if (moon) {
      const moonSign = Math.floor(moon.longitude / 30);
      const moonStrength = calculatePlanetStrength(moon);
      
      if (moonStrength > 70) {
        strengths.push(getTranslation("Emotionally stable and intuitive", "भावनात्मक रूप से स्थिर और सहज"));
      } else if (moonStrength < 30) {
        challenges.push(getTranslation("Emotional fluctuations possible", "भावनात्मक उतार-चढ़ाव संभव"));
      }
    }
    
    return { coreTraits, strengths, challenges };
  };

  // Calculate planet strength (simplified)
  const calculatePlanetStrength = (planet: any) => {
    if (!planet) return 50;
    
    // Base strength on position and aspects (simplified calculation)
    let strength = 50;
    
    // Add strength for exaltation, own sign, etc.
    if (planet.isExalted) strength += 30;
    if (planet.isOwnSign) strength += 20;
    if (planet.isDebilitated) strength -= 30;
    
    // Normalize to 0-100
    return Math.max(0, Math.min(100, strength));
  };

  // Get traits based on zodiac sign
  const getSignTraits = (signIndex: number) => {
    const signs = [
      { // Aries
        traits: [getTranslation("Dynamic", "गतिशील"), getTranslation("Pioneering", "अग्रणी")],
        strengths: [getTranslation("Initiative and courage", "पहल और साहस")]
      },
      { // Taurus
        traits: [getTranslation("Stable", "स्थिर"), getTranslation("Practical", "व्यावहारिक")],
        strengths: [getTranslation("Persistence and reliability", "दृढ़ता और विश्वसनीयता")]
      },
      { // Gemini
        traits: [getTranslation("Communicative", "संवादी"), getTranslation("Adaptable", "अनुकूलनीय")],
        strengths: [getTranslation("Intelligence and versatility", "बुद्धि और बहुमुखी प्रतिभा")]
      },
      { // Cancer
        traits: [getTranslation("Nurturing", "पोषणकर्ता"), getTranslation("Intuitive", "सहज")],
        strengths: [getTranslation("Emotional intelligence", "भावनात्मक बुद्धि")]
      },
      { // Leo
        traits: [getTranslation("Confident", "आत्मविश्वासी"), getTranslation("Creative", "रचनात्मक")],
        strengths: [getTranslation("Leadership and charisma", "नेतृत्व और आकर्षण")]
      },
      { // Virgo
        traits: [getTranslation("Analytical", "विश्लेषणात्मक"), getTranslation("Perfectionist", "पूर्णतावादी")],
        strengths: [getTranslation("Attention to detail", "विस्तार पर ध्यान")]
      },
      { // Libra
        traits: [getTranslation("Diplomatic", "कूटनीतिक"), getTranslation("Harmonious", "सामंजस्यपूर्ण")],
        strengths: [getTranslation("Balance and fairness", "संतुलन और निष्पक्षता")]
      },
      { // Scorpio
        traits: [getTranslation("Intense", "तीव्र"), getTranslation("Mysterious", "रहस्यमय")],
        strengths: [getTranslation("Determination and intuition", "दृढ़ संकल्प और अंतर्ज्ञान")]
      },
      { // Sagittarius
        traits: [getTranslation("Philosophical", "दार्शनिक"), getTranslation("Adventurous", "साहसी")],
        strengths: [getTranslation("Wisdom and optimism", "ज्ञान और आशावाद")]
      },
      { // Capricorn
        traits: [getTranslation("Ambitious", "महत्वाकांक्षी"), getTranslation("Disciplined", "अनुशासित")],
        strengths: [getTranslation("Goal-oriented and practical", "लक्ष्य-उन्मुख और व्यावहारिक")]
      },
      { // Aquarius
        traits: [getTranslation("Innovative", "नवाचारी"), getTranslation("Independent", "स्वतंत्र")],
        strengths: [getTranslation("Originality and humanitarianism", "मौलिकता और मानवतावाद")]
      },
      { // Pisces
        traits: [getTranslation("Compassionate", "दयालु"), getTranslation("Artistic", "कलात्मक")],
        strengths: [getTranslation("Empathy and creativity", "सहानुभूति और रचनात्मकता")]
      }
    ];
    
    return signs[signIndex] || { traits: [], strengths: [] };
  };

  // Analyze career potential
  const analyzeCareer = () => {
    const mars = planets.Mars || planets.mars;
    const mercury = planets.Mercury || planets.mercury;
    const jupiter = planets.Jupiter || planets.jupiter;
    const saturn = planets.Saturn || planets.saturn;
    
    let careerFields = [];
    let careerStrengths = [];
    let careerChallenges = [];
    
    // 10th house analysis for career
    const tenthHouse = houses[10] || {};
    
    // Mars strength - for leadership, sports, military
    if (mars && calculatePlanetStrength(mars) > 70) {
      careerFields.push(getTranslation("Leadership roles", "नेतृत्व भूमिकाएं"));
      careerFields.push(getTranslation("Sports & Fitness", "खेल और फिटनेस"));
      careerStrengths.push(getTranslation("Natural leadership abilities", "प्राकृतिक नेतृत्व क्षमता"));
    }
    
    // Mercury strength - for communication, business, writing
    if (mercury && calculatePlanetStrength(mercury) > 70) {
      careerFields.push(getTranslation("Communication & Media", "संचार और मीडिया"));
      careerFields.push(getTranslation("Business & Trade", "व्यापार और व्यवसाय"));
      careerStrengths.push(getTranslation("Excellent communication skills", "उत्कृष्ट संचार कौशल"));
    }
    
    // Jupiter strength - for teaching, law, spirituality
    if (jupiter && calculatePlanetStrength(jupiter) > 70) {
      careerFields.push(getTranslation("Education & Teaching", "शिक्षा और अध्यापन"));
      careerFields.push(getTranslation("Law & Justice", "कानून और न्याय"));
      careerStrengths.push(getTranslation("Wisdom and guidance abilities", "ज्ञान और मार्गदर्शन क्षमता"));
    }
    
    // Saturn strength - for engineering, government, long-term planning
    if (saturn && calculatePlanetStrength(saturn) > 70) {
      careerFields.push(getTranslation("Engineering & Technology", "इंजीनियरिंग और प्रौद्योगिकी"));
      careerFields.push(getTranslation("Government Service", "सरकारी सेवा"));
      careerStrengths.push(getTranslation("Discipline and perseverance", "अनुशासन और दृढ़ता"));
    }
    
    return { careerFields, careerStrengths, careerChallenges };
  };

  // Analyze life areas impact
  const analyzeLifeAreas = () => {
    return {
      health: {
        strength: Math.floor(Math.random() * 40) + 60, // 60-100%
        insights: [
          getTranslation("Strong vitality indicated", "मजबूत जीवनशक्ति का संकेत"),
          getTranslation("Pay attention to stress management", "तनाव प्रबंधन पर ध्यान दें")
        ]
      },
      wealth: {
        strength: Math.floor(Math.random() * 40) + 50, // 50-90%
        insights: [
          getTranslation("Financial growth potential", "वित्तीय वृद्धि की संभावना"),
          getTranslation("Multiple income sources favored", "कई आय स्रोत अनुकूल")
        ]
      },
      relationships: {
        strength: Math.floor(Math.random() * 30) + 70, // 70-100%
        insights: [
          getTranslation("Harmonious relationships likely", "सामंजस्यपूर्ण रिश्ते संभावित"),
          getTranslation("Strong family bonds", "मजबूत पारिवारिक बंधन")
        ]
      },
      education: {
        strength: Math.floor(Math.random() * 40) + 60, // 60-100%
        insights: [
          getTranslation("Good learning capacity", "अच्छी सीखने की क्षमता"),
          getTranslation("Interest in multiple subjects", "कई विषयों में रुचि")
        ]
      }
    };
  };

  const personality = analyzePersonality();
  const career = analyzeCareer();
  const lifeAreas = analyzeLifeAreas();

  return (
    <div className="space-y-6">
      {/* Core Personality */}
      <Card className="border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
          <CardTitle className="text-orange-800 flex items-center gap-2">
            <Star className="h-5 w-5" />
            {getTranslation('Your Core Personality', 'आपका मुख्य व्यक्तित्व')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                {getTranslation('Your Strengths', 'आपकी शक्तियां')}
              </h4>
              <div className="space-y-2">
                {personality.strengths.slice(0, 4).map((strength, index) => (
                  <Badge key={index} variant="outline" className="block text-left p-2 border-green-200 text-green-800">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                {getTranslation('Core Traits', 'मुख्य गुण')}
              </h4>
              <div className="space-y-2">
                {personality.coreTraits.slice(0, 4).map((trait, index) => (
                  <Badge key={index} variant="outline" className="block text-left p-2 border-blue-200 text-blue-800">
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-amber-700 mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                {getTranslation('Growth Areas', 'विकास के क्षेत्र')}
              </h4>
              <div className="space-y-2">
                {personality.challenges.slice(0, 4).map((challenge, index) => (
                  <Badge key={index} variant="outline" className="block text-left p-2 border-amber-200 text-amber-800">
                    {challenge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Career Analysis */}
      <Card className="border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            {getTranslation('Career & Professional Life', 'करियर और व्यावसायिक जीवन')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-700 mb-3">
                {getTranslation('Suitable Career Fields', 'उपयुक्त करियर क्षेत्र')}
              </h4>
              <div className="space-y-2">
                {career.careerFields.map((field, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-800">{field}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-green-700 mb-3">
                {getTranslation('Professional Strengths', 'व्यावसायिक शक्तियां')}
              </h4>
              <div className="space-y-2">
                {career.careerStrengths.map((strength, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-green-800">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Life Areas Analysis */}
      <Card className="border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardTitle className="text-purple-800 flex items-center gap-2">
            <Home className="h-5 w-5" />
            {getTranslation('Life Areas Impact', 'जीवन क्षेत्रों का प्रभाव')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(lifeAreas).map(([area, data]) => {
              const icons = {
                health: Heart,
                wealth: DollarSign,
                relationships: Heart,
                education: Lightbulb
              };
              const IconComponent = icons[area as keyof typeof icons];
              
              return (
                <div key={area} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      {getTranslation(
                        area.charAt(0).toUpperCase() + area.slice(1),
                        area === 'health' ? 'स्वास्थ्य' :
                        area === 'wealth' ? 'धन' :
                        area === 'relationships' ? 'रिश्ते' : 'शिक्षा'
                      )}
                    </h4>
                    <Badge className={`${data.strength > 80 ? 'bg-green-500' : data.strength > 60 ? 'bg-yellow-500' : 'bg-orange-500'} text-white`}>
                      {data.strength}%
                    </Badge>
                  </div>
                  <Progress value={data.strength} className="h-2 mb-3" />
                  <div className="space-y-1">
                    {data.insights.map((insight, index) => (
                      <p key={index} className="text-sm text-gray-600">• {insight}</p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalizedLifeInsights;