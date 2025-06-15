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
    const mercury = planets.ME;

    // Traditional Vedic sign rulers
    const signLords = {
      1: 'MA',  // Aries - Mars
      2: 'VE',  // Taurus - Venus
      3: 'ME',  // Gemini - Mercury
      4: 'MO',  // Cancer - Moon
      5: 'SU',  // Leo - Sun
      6: 'ME',  // Virgo - Mercury
      7: 'VE',  // Libra - Venus
      8: 'MA',  // Scorpio - Mars
      9: 'JU',  // Sagittarius - Jupiter
      10: 'SA', // Capricorn - Saturn
      11: 'SA', // Aquarius - Saturn
      12: 'JU'  // Pisces - Jupiter
    };

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

    // Get house lords based on ascendant
    const getHouseLords = () => {
      const lagnaSign = getLagnaSignNumber();
      const houseLords = {};
      
      for (let house = 1; house <= 12; house++) {
        const signNumber = ((lagnaSign - 1 + house - 1) % 12) + 1;
        houseLords[house] = signLords[signNumber];
      }
      
      return houseLords;
    };

    const houseLords = getHouseLords();

    // Check planetary strength based on position and lordship
    const getPlanetaryStrength = (planetId: string) => {
      const planet = planets[planetId];
      if (!planet) return 0;
      
      let strength = 0;
      
      // Check if planet is in own sign
      const planetOwnSigns = {
        'SU': [5],
        'MO': [4],
        'MA': [1, 8],
        'ME': [3, 6],
        'JU': [9, 12],
        'VE': [2, 7],
        'SA': [10, 11]
      };
      
      const planetSign = Math.ceil(planet.longitude / 30);
      if (planetOwnSigns[planetId]?.includes(planetSign)) strength += 20;
      
      // Check exaltation
      const exaltationSigns = {
        'SU': 1, 'MO': 2, 'MA': 10, 'ME': 6, 'JU': 4, 'VE': 12, 'SA': 7
      };
      if (exaltationSigns[planetId] === planetSign) strength += 30;
      
      // Check debilitation
      const debilitationSigns = {
        'SU': 7, 'MO': 8, 'MA': 4, 'ME': 12, 'JU': 10, 'VE': 6, 'SA': 1
      };
      if (debilitationSigns[planetId] === planetSign) strength -= 20;
      
      return Math.max(0, strength);
    };

    // Generate soul purpose based on actual chart with house lords
    const generateSoulPurpose = () => {
      const moonSign = moon ? Math.ceil(moon.longitude / 30) : 1;
      const lagnaSign = getLagnaSignNumber();
      
      // Check 9th house lord (dharma/purpose)
      const ninthLord = houseLords[9];
      const ninthLordPlanet = planets[ninthLord];
      const ninthLordStrength = getPlanetaryStrength(ninthLord);
      
      // Check if 9th lord is strong
      if (ninthLordStrength > 15 && ninthLordPlanet) {
        const ninthLordSign = Math.ceil(ninthLordPlanet.longitude / 30);
        
        if (ninthLord === 'JU') {
          return language === 'hi' 
            ? `गुरु आपके धर्म भाव के स्वामी हैं और ${ninthLordSign} राशि में स्थित हैं। आपका आत्मिक उद्देश्य ज्ञान, शिक्षा और आध्यात्मिक मार्गदर्शन के माध्यम से जगत का कल्याण करना है।`
            : `Jupiter is your 9th house lord placed in sign ${ninthLordSign}. Your soul purpose is to benefit the world through knowledge, education, and spiritual guidance.`;
        }
        
        if (ninthLord === 'VE') {
          return language === 'hi'
            ? `शुक्र आपके धर्म भाव के स्वामी हैं। आपका उद्देश्य कला, सौंदर्य और प्रेम के माध्यम से संसार में सामंजस्य लाना है।`
            : `Venus is your 9th house lord. Your purpose is to bring harmony to the world through art, beauty, and love.`;
        }
        
        if (ninthLord === 'SA') {
          return language === 'hi'
            ? `शनि आपके धर्म भाव के स्वामी हैं। आपका उद्देश्य धैर्य, अनुशासन और कड़ी मेहनत से समाज की सेवा करना है।`
            : `Saturn is your 9th house lord. Your purpose is to serve society through patience, discipline, and hard work.`;
        }
      }
      
      // Fallback based on lagna lord
      const lagnaLord = houseLords[1];
      return language === 'hi'
        ? `आपके ${lagna.signName || 'अज्ञात'} लग्न के स्वामी ${lagnaLord} ग्रह हैं। आपका आत्मिक उद्देश्य स्वयं के विकास और आत्म-साक्षात्कार के माध्यम से जगत की सेवा करना है।`
        : `Your ${lagna.signName || 'unknown'} ascendant is ruled by ${lagnaLord}. Your soul purpose is to serve the world through self-development and self-realization.`;
    };

    // Generate life theme based on key house lords
    const generateLifeTheme = () => {
      const lagnaLord = houseLords[1];  // Self
      const tenthLord = houseLords[10]; // Career/Status
      const seventhLord = houseLords[7]; // Relationships
      
      const lagnaLordStrength = getPlanetaryStrength(lagnaLord);
      const tenthLordStrength = getPlanetaryStrength(tenthLord);
      
      if (lagnaLordStrength > 20 && tenthLordStrength > 15) {
        return language === 'hi'
          ? `लग्नेश ${lagnaLord} और दशमेश ${tenthLord} की शुभ स्थिति से आपका जीवन नेतृत्व, सफलता और समाज में उच्च स्थान पाने के लिए है।`
          : `The favorable position of ascendant lord ${lagnaLord} and 10th lord ${tenthLord} shows your life is meant for leadership, success, and high social status.`;
      }
      
      // Check for strong yogas
      if (activeYogas.length > 0) {
        const strongYoga = activeYogas[0];
        return language === 'hi'
          ? `आपकी कुंडली में ${strongYoga.name} योग के कारण आपका जीवन विशेष सफलता और मान-सम्मान पाने के लिए है।`
          : `Due to ${strongYoga.name} in your chart, your life theme is achieving special success and honor.`;
      }
      
      return language === 'hi'
        ? `आपके ग्रहों की स्थिति आत्म-विकास, संतुलन और निरंतर प्रगति की यात्रा दर्शाती है।`
        : `Your planetary positions indicate a journey of self-development, balance, and continuous progress.`;
    };

    // Generate karma lessons based on house lord positions
    const generateKarmaLessons = () => {
      const lessons = [];
      
      // Check 6th house lord (enemies/obstacles)
      const sixthLord = houseLords[6];
      const sixthLordPlanet = planets[sixthLord];
      if (sixthLordPlanet && sixthLordPlanet.house === 1) {
        lessons.push(language === 'hi' ? `स्वास्थ्य और शत्रुओं से सावधानी` : `Health and protection from enemies`);
      }
      
      // Check 8th house lord (transformation)
      const eighthLord = houseLords[8];
      const eighthLordPlanet = planets[eighthLord];
      if (eighthLordPlanet) {
        lessons.push(language === 'hi' ? `जीवन में परिवर्तन को स्वीकार करना` : `Accepting transformation in life`);
      }
      
      // Check 12th house lord (losses/spirituality)
      const twelfthLord = houseLords[12];
      const twelfthLordPlanet = planets[twelfthLord];
      if (twelfthLordPlanet && getPlanetaryStrength(twelfthLord) > 10) {
        lessons.push(language === 'hi' ? `भौतिक त्याग और आध्यात्मिक विकास` : `Material detachment and spiritual growth`);
      }
      
      // Default lessons if none specific
      if (lessons.length === 0) {
        lessons.push(
          language === 'hi' ? `धैर्य और दृढ़ता का अभ्यास` : `Practice of patience and perseverance`,
          language === 'hi' ? `कर्म में श्रद्धा और निष्काम भाव` : `Faith in action and detachment from results`,
          language === 'hi' ? `आत्म-अनुशासन और मानसिक शुद्धता` : `Self-discipline and mental purity`
        );
      }
      
      return lessons.slice(0, 3);
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

    // Generate strengths and challenges based on house lords
    const generateStrengthsAndChallenges = () => {
      const strengths = [];
      const challenges = [];
      
      // Check strong house lords
      const lagnaLord = houseLords[1];
      const fifthLord = houseLords[5];
      const ninthLord = houseLords[9];
      const tenthLord = houseLords[10];
      
      if (getPlanetaryStrength(lagnaLord) > 15) {
        strengths.push(language === 'hi' ? `मजबूत व्यक्तित्व और आत्मविश्वास` : `Strong personality and confidence`);
      }
      
      if (getPlanetaryStrength(fifthLord) > 15) {
        strengths.push(language === 'hi' ? `बुद्धि और रचनात्मकता` : `Intelligence and creativity`);
      }
      
      if (getPlanetaryStrength(ninthLord) > 15) {
        strengths.push(language === 'hi' ? `भाग्य और आध्यात्मिक झुकाव` : `Fortune and spiritual inclination`);
      }
      
      // Check challenging positions
      const sixthLord = houseLords[6];
      const eighthLord = houseLords[8];
      const twelfthLord = houseLords[12];
      
      if (getPlanetaryStrength(sixthLord) < 5) {
        challenges.push(language === 'hi' ? `स्वास्थ्य और शत्रुओं से सावधानी` : `Health and enemy-related challenges`);
      }
      
      if (getPlanetaryStrength(eighthLord) < 5) {
        challenges.push(language === 'hi' ? `अचानक परिवर्तन का सामना` : `Facing sudden changes`);
      }
      
      // Default if none found
      if (strengths.length === 0) {
        strengths.push(
          language === 'hi' ? `प्राकृतिक अनुकूलनशीलता` : `Natural adaptability`,
          language === 'hi' ? `मेहनत की क्षमता` : `Capacity for hard work`
        );
      }
      
      if (challenges.length === 0) {
        challenges.push(
          language === 'hi' ? `धैर्य का विकास` : `Developing patience`,
          language === 'hi' ? `निर्णय लेने में स्पष्टता` : `Clarity in decision making`
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
