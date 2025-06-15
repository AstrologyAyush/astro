import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';
import { Compass, Heart, Briefcase, Shield, Star, TrendingUp, Calendar, Target } from 'lucide-react';

interface LifePathReportProps {
  kundaliData: ComprehensiveKundaliData;
  language: 'hi' | 'en';
}

const LifePathReport: React.FC<LifePathReportProps> = ({ kundaliData, language }) => {
  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  const generatePersonalizedLifePathAnalysis = () => {
    const calculations = kundaliData.enhancedCalculations;
    const lagna = calculations.lagna;
    const planets = calculations.planets;
    const activeYogas = calculations.yogas?.filter(y => y.isActive) || [];
    const currentDasha = calculations.dashas?.find(d => d.isActive);

    // Get key planetary positions
    const sun = planets.SU;
    const moon = planets.MO;
    const jupiter = planets.JU;
    const venus = planets.VE;
    const mars = planets.MA;
    const saturn = planets.SA;
    const rahu = planets.RA;
    const ketu = planets.KE;

    // Calculate lagna sign number from degree
    const getLagnaSignNumber = () => {
      if (lagna.degree !== undefined) {
        return Math.floor(lagna.degree / 30) + 1;
      }
      // Fallback: try to derive from sign name
      const signNames = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                         'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
      const signIndex = signNames.findIndex(name => lagna.signName?.includes(name));
      return signIndex >= 0 ? signIndex + 1 : 1;
    };

    // Determine dominant elements based on planetary positions
    const getDominantElement = () => {
      const fireSignPlanets = [sun, mars].filter(p => p && [1, 5, 9].includes(Math.ceil(p.longitude / 30)));
      const earthSignPlanets = [venus, saturn].filter(p => p && [2, 6, 10].includes(Math.ceil(p.longitude / 30)));
      const airSignPlanets = [jupiter].filter(p => p && [3, 7, 11].includes(Math.ceil(p.longitude / 30)));
      const waterSignPlanets = [moon].filter(p => p && [4, 8, 12].includes(Math.ceil(p.longitude / 30)));

      if (fireSignPlanets.length >= 2) return 'fire';
      if (earthSignPlanets.length >= 2) return 'earth';
      if (airSignPlanets.length >= 2) return 'air';
      if (waterSignPlanets.length >= 2) return 'water';
      return 'balanced';
    };

    // Generate soul purpose based on actual chart
    const generateSoulPurpose = () => {
      const moonSign = moon ? Math.ceil(moon.longitude / 30) : 1;
      const lagnaSign = getLagnaSignNumber();
      const ninthHouseSign = (lagnaSign + 8) % 12 + 1;
      
      // Check for spiritual yogas
      const hasKetuvianInfluence = ketu && [1, 5, 9, 12].includes(Math.ceil(ketu.longitude / 30));
      const hasJupiterianInfluence = jupiter && [1, 4, 5, 9, 10].includes(Math.ceil(jupiter.longitude / 30));
      
      if (hasKetuvianInfluence && hasJupiterianInfluence) {
        return language === 'hi' 
          ? `आपकी आत्मा का मुख्य उद्देश्य आध्यात्मिक जागृति और मानवता की सेवा है। केतु और गुरु की संयुक्त स्थिति दर्शाती है कि आप इस जन्म में भौतिक बंधनों से मुक्त होकर उच्च चेतना प्राप्त करने आए हैं।`
          : `Your soul's primary purpose is spiritual awakening and service to humanity. The combined position of Ketu and Jupiter shows you have come to transcend material bonds and achieve higher consciousness.`;
      }
      
      if (hasJupiterianInfluence) {
        return language === 'hi'
          ? `गुरु की शुभ स्थिति दर्शाती है कि आपका जीवन उद्देश्य ज्ञान प्रसार, शिक्षा और मार्गदर्शन के माध्यम से समाज की सेवा करना है। आप एक प्राकृतिक गुरु और शिक्षक हैं।`
          : `Jupiter's auspicious position shows your life purpose is to serve society through knowledge dissemination, education, and guidance. You are a natural teacher and guide.`;
      }
      
      return language === 'hi'
        ? `आपकी ${moon ? ['मेष', 'वृष', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'][moonSign - 1] : 'अज्ञात'} चंद्र राशि और ${lagna.signName || 'अज्ञात'} लग्न का संयोग दर्शाता है कि आपका आत्मिक उद्देश्य संतुलन, करुणा और व्यावहारिक सेवा के माध्यम से आत्म-साक्षात्कार करना है।`
        : `The combination of your ${moon ? ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][moonSign - 1] : 'unknown'} Moon sign and ${lagna.signName || 'unknown'} ascendant shows your soul purpose is self-realization through balance, compassion, and practical service.`;
    };

    // Generate life theme based on planetary combinations
    const generateLifeTheme = () => {
      const dominant = getDominantElement();
      const hasRajYoga = activeYogas.some(y => y.name.toLowerCase().includes('raj'));
      const hasDhanYoga = activeYogas.some(y => y.name.toLowerCase().includes('dhan'));
      
      if (hasRajYoga && hasDhanYoga) {
        return language === 'hi'
          ? `आपके जीवन की मुख्य थीम है राज योग और धन योग के कारण नेतृत्व, प्रभाव और समृद्धि। आप उच्च पदों पर पहुंचेंगे और समाज में सम्मानित स्थान पाएंगे।`
          : `Your life theme is leadership, influence, and prosperity due to Raj Yoga and Dhan Yoga. You will reach high positions and gain respected status in society.`;
      }
      
      if (dominant === 'fire') {
        return language === 'hi'
          ? `अग्नि तत्व की प्रधानता के कारण आपका जीवन साहस, नवाचार और पहल की भावना से भरा है। आप अग्रणी बनने और नए रास्ते बनाने के लिए आए हैं।`
          : `Due to the dominance of fire element, your life is filled with courage, innovation, and pioneering spirit. You have come to be a leader and create new paths.`;
      }
      
      if (dominant === 'water') {
        return language === 'hi'
          ? `जल तत्व की प्रधानता भावनात्मक गहराई, सहानुभूति और अंतर्ज्ञान को दर्शाती है। आपका जीवन दूसरों को समझने और उनकी सहायता करने के लिए है।`
          : `The dominance of water element shows emotional depth, empathy, and intuition. Your life is meant for understanding and helping others.`;
      }
      
      return language === 'hi'
        ? `आपकी ग्रहों की संतुलित स्थिति दर्शाती है कि आपका जीवन विविधता, अनुकूलनशीलता और सभी क्षेत्रों में संतुलित विकास के लिए है।`
        : `Your balanced planetary positions show that your life is meant for diversity, adaptability, and balanced growth in all areas.`;
    };

    // Generate karma lessons based on challenging planetary positions
    const generateKarmaLessons = () => {
      const lessons = [];
      
      // Saturn lessons
      if (saturn && [1, 4, 7, 8, 10].includes(Math.ceil(saturn.longitude / 30))) {
        lessons.push(language === 'hi' ? `धैर्य और दृढ़ता - शनि की चुनौती आपको सिखाती है` : `Patience and perseverance - Saturn's challenge teaches you`);
      }
      
      // Rahu-Ketu lessons
      if (rahu && ketu) {
        lessons.push(language === 'hi' ? `भौतिक इच्छाओं और आध्यात्मिकता में संतुलन` : `Balance between material desires and spirituality`);
      }
      
      // Mars lessons
      if (mars && [1, 4, 7, 8, 12].includes(Math.ceil(mars.longitude / 30))) {
        lessons.push(language === 'hi' ? `क्रोध पर नियंत्रण और शक्ति का सदुपयोग` : `Controlling anger and proper use of power`);
      }
      
      // Moon lessons
      if (moon && moon.isRetrograde) {
        lessons.push(language === 'hi' ? `भावनात्मक स्थिरता और मानसिक शांति` : `Emotional stability and mental peace`);
      }
      
      // Default lessons if no specific challenges
      if (lessons.length === 0) {
        lessons.push(
          language === 'hi' ? `आत्म-स्वीकृति और आंतरिक शक्ति का विकास` : `Self-acceptance and developing inner strength`,
          language === 'hi' ? `दूसरों के साथ सहयोग और सामंजस्य` : `Cooperation and harmony with others`,
          language === 'hi' ? `जीवन में उद्देश्य और दिशा खोजना` : `Finding purpose and direction in life`
        );
      }
      
      return lessons.slice(0, 3); // Return maximum 3 lessons
    };

    // Generate life phases based on dashas
    const generateLifePhases = () => {
      const phases = [];
      
      if (currentDasha) {
        const dashaPlanet = currentDasha.planet;
        const endYear = new Date(currentDasha.endDate).getFullYear();
        const currentYear = new Date().getFullYear();
        const yearsLeft = endYear - currentYear;
        
        phases.push({
          phase: language === 'hi' ? `वर्तमान दशा (${yearsLeft} वर्ष शेष)` : `Current Period (${yearsLeft} years left)`,
          description: language === 'hi' 
            ? `${dashaPlanet} महादशा चल रही है। यह समय ${getDashaPlanetMeaning(dashaPlanet, 'hi')} के लिए उपयुक्त है।`
            : `${dashaPlanet} Mahadasha is running. This time is suitable for ${getDashaPlanetMeaning(dashaPlanet, 'en')}.`
        });
      }
      
      // Add general life phases
      phases.push(
        {
          phase: language === 'hi' ? 'युवावस्था में विकास' : 'Growth in Youth',
          description: language === 'hi' 
            ? `आपकी कुंडली में ${lagna.signName || 'अज्ञात'} लग्न शिक्षा और व्यक्तित्व विकास के लिए शुभ है।`
            : `Your ${lagna.signName || 'unknown'} ascendant is favorable for education and personality development.`
        },
        {
          phase: language === 'hi' ? 'मध्यावस्था में स्थिरता' : 'Stability in Midlife',
          description: language === 'hi'
            ? `करियर और पारिवारिक जिम्मेदारियों का संतुलन। आपकी ग्रह स्थिति मध्यम आयु में स्थिरता का संकेत देती है।`
            : `Balance of career and family responsibilities. Your planetary positions indicate stability in middle age.`
        }
      );
      
      return phases;
    };

    // Generate strengths and challenges based on actual planetary positions
    const generateStrengthsAndChallenges = () => {
      const strengths = [];
      const challenges = [];
      
      // Jupiter strengths
      if (jupiter && [1, 4, 5, 9, 10, 11].includes(Math.ceil(jupiter.longitude / 30))) {
        strengths.push(language === 'hi' ? `प्राकृतिक ज्ञान और शिक्षण क्षमता` : `Natural wisdom and teaching ability`);
      }
      
      // Venus strengths
      if (venus && [1, 2, 4, 5, 7, 10, 11].includes(Math.ceil(venus.longitude / 30))) {
        strengths.push(language === 'hi' ? `कलात्मक प्रतिभा और सामाजिक कौशल` : `Artistic talent and social skills`);
      }
      
      // Sun strengths
      if (sun && [1, 3, 5, 9, 10, 11].includes(Math.ceil(sun.longitude / 30))) {
        strengths.push(language === 'hi' ? `नेतृत्व क्षमता और आत्मविश्वास` : `Leadership ability and confidence`);
      }
      
      // Saturn challenges
      if (saturn && [1, 4, 7, 8].includes(Math.ceil(saturn.longitude / 30))) {
        challenges.push(language === 'hi' ? `जीवन में देरी और बाधाओं का सामना` : `Facing delays and obstacles in life`);
      }
      
      // Mars challenges
      if (mars && [1, 4, 7, 8, 12].includes(Math.ceil(mars.longitude / 30))) {
        challenges.push(language === 'hi' ? `अधीरता और क्रोध पर नियंत्रण` : `Controlling impatience and anger`);
      }
      
      // Default strengths if none found
      if (strengths.length === 0) {
        strengths.push(
          language === 'hi' ? `अनुकूलनशीलता और लचीलापन` : `Adaptability and flexibility`,
          language === 'hi' ? `दृढ़ संकल्प और मेहनत` : `Determination and hard work`
        );
      }
      
      // Default challenges if none found
      if (challenges.length === 0) {
        challenges.push(
          language === 'hi' ? `निर्णय लेने में संकोच` : `Hesitation in decision making`,
          language === 'hi' ? `अपेक्षाओं का दबाव` : `Pressure of expectations`
        );
      }
      
      return { strengths: strengths.slice(0, 3), challenges: challenges.slice(0, 3) };
    };

    const getDashaPlanetMeaning = (planet: string, lang: 'hi' | 'en') => {
      const meanings = {
        'SU': { hi: 'आत्मविकास और नेतृत्व', en: 'self-development and leadership' },
        'MO': { hi: 'भावनात्मक विकास और यात्रा', en: 'emotional growth and travel' },
        'MA': { hi: 'साहस और तकनीकी कार्य', en: 'courage and technical work' },
        'ME': { hi: 'बुद्धि और संचार', en: 'intelligence and communication' },
        'JU': { hi: 'ज्ञान और आध्यात्मिक विकास', en: 'wisdom and spiritual growth' },
        'VE': { hi: 'प्रेम और कलात्मक गतिविधियाँ', en: 'love and artistic activities' },
        'SA': { hi: 'अनुशासन और कड़ी मेहनत', en: 'discipline and hard work' },
        'RA': { hi: 'नवाचार और अप्रत्याशित अवसर', en: 'innovation and unexpected opportunities' },
        'KE': { hi: 'आध्यात्मिक खोज और मुक्ति', en: 'spiritual seeking and liberation' }
      };
      return meanings[planet as keyof typeof meanings]?.[lang] || (lang === 'hi' ? 'विकास' : 'growth');
    };

    return {
      soulPurpose: generateSoulPurpose(),
      lifeTheme: generateLifeTheme(),
      karmaLessons: generateKarmaLessons(),
      lifePhasePredictions: generateLifePhases(),
      strengthsAndChallenges: generateStrengthsAndChallenges()
    };
  };

  const lifePathData = generatePersonalizedLifePathAnalysis();

  return (
    <Card className="border-purple-200 shadow-lg bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-blue-100">
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Compass className="h-6 w-6 text-purple-600" />
          {getTranslation('Personalized Life Path Report', 'व्यक्तिगत जीवन पथ रिपोर्ट')}
        </CardTitle>
        <p className="text-sm text-purple-600">
          {getTranslation('Based on your unique planetary positions and cosmic blueprint', 'आपकी अनूठी ग्रह स्थितियों और ब्रह्मांडीय खाके के आधार पर')}
        </p>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Soul Purpose */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
            <Star className="h-5 w-5" />
            {getTranslation('Your Soul Purpose', 'आपके आत्मा का उद्देश्य')}
          </h4>
          <p className="text-sm text-gray-700">{lifePathData.soulPurpose}</p>
        </div>

        {/* Life Theme */}
        <div className="bg-white p-4 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
            <Target className="h-5 w-5" />
            {getTranslation('Your Life Theme', 'आपके जीवन की मुख्य थीम')}
          </h4>
          <p className="text-sm text-gray-700">{lifePathData.lifeTheme}</p>
        </div>

        {/* Karma Lessons */}
        <div>
          <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {getTranslation('Your Karmic Lessons', 'आपके कर्म के पाठ')}
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {lifePathData.karmaLessons.map((lesson, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs bg-purple-100">
                  {index + 1}
                </Badge>
                <span className="text-sm text-gray-700">{lesson}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Life Phase Predictions */}
        <div>
          <h4 className="font-semibold text-purple-800 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {getTranslation('Your Life Phases', 'आपके जीवन के चरण')}
          </h4>
          <div className="space-y-4">
            {lifePathData.lifePhasePredictions.map((phase, index) => (
              <div key={index} className="border border-purple-200 rounded-lg p-4 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <h5 className="font-medium text-purple-700">{phase.phase}</h5>
                </div>
                <p className="text-sm text-gray-600">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Strengths and Challenges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
              <Heart className="h-5 w-5" />
              {getTranslation('Your Core Strengths', 'आपकी मुख्य शक्तियां')}
            </h4>
            <div className="space-y-2">
              {lifePathData.strengthsAndChallenges.strengths.map((strength, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              {getTranslation('Growth Areas', 'विकास के क्षेत्र')}
            </h4>
            <div className="space-y-2">
              {lifePathData.strengthsAndChallenges.challenges.map((challenge, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">{challenge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cosmic Guidance */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-800 mb-2">
            {getTranslation('Personalized Cosmic Guidance', 'व्यक्तिगत ब्रह्मांडीय मार्गदर्शन')}
          </h4>
          <p className="text-sm text-gray-700">
            {language === 'hi' ? 
              `आपकी ${kundaliData.enhancedCalculations.lagna.signName || 'अज्ञात'} लग्न कुंडली के अनुसार, आप एक विशेष आत्मा हैं जो इस जन्म में अपने कर्मों को पूरा करने और आध्यात्मिक उन्नति करने आई है। अपने ग्रहों की स्थिति के अनुसार कार्य करें और धैर्य रखें।` :
              `According to your ${kundaliData.enhancedCalculations.lagna.signName || 'unknown'} ascendant chart, you are a special soul who has come to complete your karma and achieve spiritual progress in this lifetime. Work according to your planetary positions and be patient.`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LifePathReport;
