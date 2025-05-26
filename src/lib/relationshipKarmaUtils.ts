
import { PlanetPosition, KundaliChart, BirthData, NAKSHATRAS } from './kundaliUtils';

export interface KarmaPattern {
  pattern: string;
  type: 'Romantic Karma' | 'Emotional Karma' | 'Karmic Debt' | 'Past Life Connection' | 'Destined Union' | 'Soul Contract';
  summary: string;
  intensity: number; // 1-10 scale
  houseInvolved?: string;
  outcome: string;
  active: boolean;
  planetsConcerned: string[];
  timing?: string;
  remedies?: string[];
}

export interface RelationshipKarmaAnalysis {
  patterns: KarmaPattern[];
  overallKarmicIntensity: number;
  dominantKarmaType: string;
  recommendations: string[];
  timing: {
    activation: string;
    resolution: string;
  };
  summary: string;
  strengthScore: number;
}

// Calculate angle difference between two planets (considering circular degrees)
const calculateAngleDifference = (angle1: number, angle2: number): number => {
  const diff = Math.abs(angle1 - angle2);
  return Math.min(diff, 360 - diff);
};

// Check if planet is in specific house
const getPlanetHouse = (planet: PlanetPosition, houses: number[]): number => {
  return houses.findIndex(sign => sign === planet.sign) + 1;
};

// Check Saturn aspects (3rd, 7th, 10th from planet)
const checkSaturnAspect = (saturn: PlanetPosition, target: PlanetPosition): boolean => {
  const saturnSign = saturn.sign;
  const targetSign = target.sign;
  
  // Saturn aspects 3rd, 7th, and 10th from its position
  const aspectSigns = [
    ((saturnSign + 2) % 12) + 1, // 3rd house
    ((saturnSign + 6) % 12) + 1, // 7th house
    ((saturnSign + 9) % 12) + 1  // 10th house
  ];
  
  return aspectSigns.includes(targetSign);
};

// Get 7th lord based on ascendant
const get7thLord = (ascendant: number): string => {
  const seventhHouse = ((ascendant + 5) % 12) + 1;
  
  // Map signs to their lords
  const signLords: Record<number, string> = {
    1: "MA", 2: "VE", 3: "ME", 4: "MO", 5: "SU", 6: "ME",
    7: "VE", 8: "MA", 9: "JU", 10: "SA", 11: "SA", 12: "JU"
  };
  
  return signLords[seventhHouse] || "SU";
};

// Check if planet is in dusthana houses (6, 8, 12)
const isInDusthana = (planet: PlanetPosition, houses: number[]): boolean => {
  const house = getPlanetHouse(planet, houses);
  return [6, 8, 12].includes(house);
};

// Check Kala Sarpa Yoga
const checkKalaSarpaYoga = (planets: PlanetPosition[]): boolean => {
  const rahu = planets.find(p => p.id === "RA");
  const ketu = planets.find(p => p.id === "KE");
  
  if (!rahu || !ketu) return false;
  
  const otherPlanets = planets.filter(p => p.id !== "RA" && p.id !== "KE");
  const rahuDegree = rahu.degree;
  const ketuDegree = ketu.degree;
  
  let minDegree = Math.min(rahuDegree, ketuDegree);
  let maxDegree = Math.max(rahuDegree, ketuDegree);
  
  if (maxDegree - minDegree > 180) {
    [minDegree, maxDegree] = [maxDegree, 360 + minDegree];
  }
  
  return otherPlanets.every(planet => {
    const degree = planet.degree;
    return (degree >= minDegree && degree <= maxDegree) ||
           (maxDegree > 360 && (degree >= minDegree - 360 || degree <= maxDegree - 360));
  });
};

export const analyzeRelationshipKarma = (
  chart: KundaliChart, 
  birthData: BirthData,
  language: 'hi' | 'en' = 'en'
): RelationshipKarmaAnalysis => {
  const patterns: KarmaPattern[] = [];
  const planets = chart.planets;
  const houses = chart.housesList;
  
  // Find key planets
  const venus = planets.find(p => p.id === "VE");
  const ketu = planets.find(p => p.id === "KE");
  const rahu = planets.find(p => p.id === "RA");
  const moon = planets.find(p => p.id === "MO");
  const saturn = planets.find(p => p.id === "SA");
  const mars = planets.find(p => p.id === "MA");
  const sun = planets.find(p => p.id === "SU");
  
  // 1. Venus + Ketu Conjunction (Strong karma indicator)
  if (venus && ketu) {
    const angleDiff = calculateAngleDifference(venus.degree, ketu.degree);
    if (angleDiff <= 10) {
      patterns.push({
        pattern: language === 'hi' ? "शुक्र-केतु युति (अत्यधिक महत्वपूर्ण)" : "Venus-Ketu Conjunction (Highly Significant)",
        type: 'Romantic Karma',
        summary: language === 'hi' 
          ? "पूर्व जन्म का अधूरा प्रेम। यह योग दिखाता है कि आपका पिछले जन्म में कोई गहरा प्रेम अधूरा रह गया था। इस जन्म में अचानक मिलना और बिछुड़ना हो सकता है।"
          : "Unfinished love from past life. This powerful combination indicates a deep romantic connection left incomplete in previous incarnation. Sudden meetings and separations are likely in this lifetime.",
        intensity: 9,
        houseInvolved: `${getPlanetHouse(venus, houses)}${language === 'hi' ? 'वां भाव' : 'th house'}`,
        outcome: language === 'hi'
          ? "पुनर्मिलन अवश्यंभावी है, लेकिन भावनात्मक तैयारी आवश्यक है। धैर्य और समझ से स्थायी संबंध संभव।"
          : "Reunion is inevitable, but emotional preparation is essential. With patience and understanding, lasting relationships are possible.",
        active: true,
        planetsConcerned: ["VE", "KE"],
        timing: language === 'hi' ? "वीनस या केतु की दशा में सक्रिय" : "Active during Venus or Ketu periods",
        remedies: language === 'hi' 
          ? ["शुक्रवार को सफेद फूल चढ़ाएं", "केतु मंत्र का जाप करें", "दान-पुण्य करें"]
          : ["Offer white flowers on Fridays", "Chant Ketu mantras", "Practice charity and spiritual giving"]
      });
    }
  }
  
  // 2. Rahu in 7th House (Destined partnership)
  if (rahu) {
    const rahuHouse = getPlanetHouse(rahu, houses);
    if (rahuHouse === 7) {
      patterns.push({
        pattern: language === 'hi' ? "राहु सप्तम भाव में (नियति का साझीदार)" : "Rahu in 7th House (Destined Partnership)",
        type: 'Destined Union',
        summary: language === 'hi'
          ? "यह योग दर्शाता है कि आपका विवाह या मुख्य साझीदारी पूर्ण रूप से नियति द्वारा निर्धारित है। साझीदार विदेशी, अलग जाति या अनूठे व्यक्तित्व का हो सकता है।"
          : "This placement indicates your marriage or primary partnership is completely destined by fate. Partner may be foreign, from different caste, or have unique personality traits.",
        intensity: 9,
        houseInvolved: language === 'hi' ? "सप्तम भाव (साझेदारी और विवाह)" : "7th house (partnerships and marriage)",
        outcome: language === 'hi'
          ? "तीव्र आकर्षण और गहरा बंधन, लेकिन चुनौतियों का सामना करना पड़ेगा। अंततः रूपांतरकारी संबंध।"
          : "Intense attraction and deep bond, but challenges must be faced. Ultimately transformative relationship.",
        active: true,
        planetsConcerned: ["RA"],
        timing: language === 'hi' ? "राहु की महादशा में विशेष रूप से सक्रिय" : "Especially active during Rahu major period",
        remedies: language === 'hi'
          ? ["राहु शांति पूजा करवाएं", "नीलम धारण करें", "गोमेद रत्न का उपयोग करें"]
          : ["Perform Rahu peace puja", "Wear blue sapphire", "Use hessonite garnet"]
      });
    }
  }
  
  // 3. Moon Conjunct Saturn (Emotional karma)
  if (moon && saturn) {
    const angleDiff = calculateAngleDifference(moon.degree, saturn.degree);
    if (angleDiff <= 10) {
      patterns.push({
        pattern: language === 'hi' ? "चंद्र-शनि युति (भावनात्मक कर्म)" : "Moon-Saturn Conjunction (Emotional Karma)",
        type: 'Emotional Karma',
        summary: language === 'hi'
          ? "पूर्व जन्म में भावनात्मक उपेक्षा या देखभाल का कर्जा। आपने किसी की भावनाओं को आघात पहुंचाया था या स्वयं आघात सहा था।"
          : "Past life emotional neglect or caregiving debt. You either hurt someone emotionally or suffered emotional trauma that needs healing.",
        intensity: 7,
        houseInvolved: `${getPlanetHouse(moon, houses)}${language === 'hi' ? 'वां भाव' : 'th house'}`,
        outcome: language === 'hi'
          ? "धैर्य और गहरी समझ से भावनात्मक मुक्ति संभव। मातृत्व या संरक्षण के माध्यम से उपचार।"
          : "Emotional healing possible through patience and deep understanding. Recovery through nurturing or protective care.",
        active: true,
        planetsConcerned: ["MO", "SA"],
        timing: language === 'hi' ? "चंद्र या शनि की दशा में प्रभावी" : "Effective during Moon or Saturn periods",
        remedies: language === 'hi'
          ? ["सोमवार को दूध का दान करें", "शनि शांति मंत्र जाप", "वृद्धों की सेवा करें"]
          : ["Donate milk on Mondays", "Chant Saturn peace mantras", "Serve elderly people"]
      });
    }
  }
  
  // 4. Mars + Venus Conjunction (Passionate karma)
  if (mars && venus) {
    const angleDiff = calculateAngleDifference(mars.degree, venus.degree);
    if (angleDiff <= 8) {
      const marsHouse = getPlanetHouse(mars, houses);
      const isDestructive = [6, 8, 12].includes(marsHouse);
      
      patterns.push({
        pattern: language === 'hi' ? "मंगल-शुक्र युति (कामुक कर्म)" : "Mars-Venus Conjunction (Passionate Karma)",
        type: 'Romantic Karma',
        summary: language === 'hi'
          ? `शारीरिक आकर्षण और कामुक इच्छाओं के माध्यम से कर्म। ${isDestructive ? 'यह योग विनाशकारी हो सकता है यदि संयम न बरता जाए।' : 'यह योग सकारात्मक ऊर्जा प्रदान करता है।'}`
          : `Karma through physical attraction and sensual desires. ${isDestructive ? 'This combination can be destructive if moderation is not practiced.' : 'This combination provides positive energy.'}`,
        intensity: isDestructive ? 6 : 8,
        houseInvolved: `${marsHouse}${language === 'hi' ? 'वां भाव' : 'th house'}`,
        outcome: language === 'hi'
          ? isDestructive ? "संयम और आत्म-नियंत्रण आवश्यक। अन्यथा संबंधों में समस्या।" : "जुनूनी लेकिन संतुष्टिजनक संबंध। शारीरिक और भावनात्मक तृप्ति।"
          : isDestructive ? "Moderation and self-control required. Otherwise relationship problems." : "Passionate but fulfilling relationship. Physical and emotional satisfaction.",
        active: true,
        planetsConcerned: ["MA", "VE"],
        timing: language === 'hi' ? "मंगल या शुक्र की दशा में तीव्र" : "Intense during Mars or Venus periods",
        remedies: language === 'hi'
          ? ["मंगलवार को हनुमान जी की पूजा", "शुक्रवार को लक्ष्मी पूजा", "ब्रह्मचर्य का पालन"]
          : ["Worship Hanuman on Tuesdays", "Lakshmi worship on Fridays", "Practice moderation"]
      });
    }
  }
  
  // 5. 7th Lord in Dusthana or with Rahu/Ketu
  const seventhLord = get7thLord(chart.ascendant);
  const seventhLordPlanet = planets.find(p => p.id === seventhLord);
  
  if (seventhLordPlanet) {
    const isInDustthana = isInDusthana(seventhLordPlanet, houses);
    const conjunctRahuKetu = rahu && ketu && (
      calculateAngleDifference(seventhLordPlanet.degree, rahu.degree) <= 8 ||
      calculateAngleDifference(seventhLordPlanet.degree, ketu.degree) <= 8
    );
    
    if (isInDustthana || conjunctRahuKetu) {
      patterns.push({
        pattern: language === 'hi' ? "सप्तमेश दुष्ठान या छाया ग्रह युति" : "7th Lord in Dusthana or with Shadow Planets",
        type: 'Karmic Debt',
        summary: language === 'hi'
          ? "संबंधों में कर्मिक दर्द और चुनौतियां। पूर्व जन्म का बाध्यकारी कर्मिक अनुबंध जिसे इस जन्म में पूरा करना है।"
          : "Karmic pain and challenges in relationships. Binding karmic contract from past lives that must be fulfilled in this lifetime.",
        intensity: 7,
        houseInvolved: `${getPlanetHouse(seventhLordPlanet, houses)}${language === 'hi' ? 'वां भाव' : 'th house'}`,
        outcome: language === 'hi'
          ? "कठिनाइयों के माध्यम से आत्मिक विकास। धैर्य और समर्पण से अंततः मुक्ति।"
          : "Spiritual growth through difficulties. Eventually liberation through patience and surrender.",
        active: true,
        planetsConcerned: [seventhLord],
        timing: language === 'hi' ? "सप्तमेश की दशा में चुनौतियां" : "Challenges during 7th lord's period",
        remedies: language === 'hi'
          ? ["गुरु से आशीर्वाद लें", "संबंधों में क्षमा भाव रखें", "आध्यात्मिक साधना करें"]
          : ["Seek guru's blessings", "Practice forgiveness in relationships", "Engage in spiritual practices"]
      });
    }
  }
  
  // 6. Kala Sarpa Yoga (Soul contracts)
  const hasKalaSarpa = checkKalaSarpaYoga(planets);
  if (hasKalaSarpa) {
    patterns.push({
      pattern: language === 'hi' ? "काल सर्प योग (आत्मिक अनुबंध)" : "Kala Sarpa Yoga (Soul Contracts)",
      type: 'Soul Contract',
      summary: language === 'hi'
        ? "आपकी कुंडली में काल सर्प योग है जो दर्शाता है कि आपके जीवन में भाग्य-बद्ध अनुभव होंगे। तीव्र आत्मिक अनुबंध और गहन कर्मिक संबंध।"
        : "Your chart has Kala Sarpa Yoga indicating destiny-bound experiences in life. Intense soul contracts and profound karmic relationships.",
      intensity: 9,
      houseInvolved: language === 'hi' ? "सम्पूर्ण कुंडली प्रभावित" : "Entire chart affected",
      outcome: language === 'hi'
        ? "नियति से जुड़े तीव्र संबंध जो आत्मिक रूपांतरण लाएंगे। जीवन में गहरे अर्थ की खोज।"
        : "Intense destined relationships leading to soul transformation. Search for deeper meaning in life.",
      active: true,
      planetsConcerned: ["RA", "KE"],
      timing: language === 'hi' ? "जीवनभर प्रभावशाली, विशेषकर राहु-केतु दशा में" : "Influential throughout life, especially during Rahu-Ketu periods",
      remedies: language === 'hi'
        ? ["नाग देवता की पूजा", "सर्प दोष निवारण पूजा", "गंगा स्नान और दान"]
        : ["Worship serpent deities", "Perform serpent dosha removal puja", "Ganga bath and charity"]
    });
  }
  
  // 7. Saturn Aspecting Venus (Delayed but lasting love)
  if (saturn && venus) {
    const saturnAspectsVenus = checkSaturnAspect(saturn, venus);
    if (saturnAspectsVenus) {
      patterns.push({
        pattern: language === 'hi' ? "शनि की शुक्र पर दृष्टि (विलम्बित प्रेम)" : "Saturn Aspecting Venus (Delayed Love)",
        type: 'Karmic Debt',
        summary: language === 'hi'
          ? "संबंधों में विलंब लेकिन स्थायित्व। पूर्व जन्म में आपने प्रेम की उपेक्षा की थी या समय से पहले त्याग दिया था।"
          : "Delays in relationships but permanence. In past life, you neglected love or abandoned it prematurely.",
        intensity: 6,
        houseInvolved: `${getPlanetHouse(venus, houses)}${language === 'hi' ? 'वां भाव' : 'th house'}`,
        outcome: language === 'hi'
          ? "धैर्य और निरंतर प्रयास से दीर्घकालिक और गहरे संबंध। देर से मिलने वाला प्रेम स्थायी होता है।"
          : "Long-term and deep relationships through patience and persistent effort. Late-found love tends to be permanent.",
        active: true,
        planetsConcerned: ["SA", "VE"],
        timing: language === 'hi' ? "35 वर्ष की आयु के बाद अधिक स्पष्ट" : "More evident after age 35",
        remedies: language === 'hi'
          ? ["शनिवार को तेल का दान", "शुक्रवार को सफेद वस्त्र दान", "धैर्य और निष्ठा का अभ्यास"]
          : ["Donate oil on Saturdays", "Donate white clothes on Fridays", "Practice patience and loyalty"]
      });
    }
  }
  
  // Generate overall analysis
  const totalIntensity = patterns.reduce((sum, pattern) => sum + pattern.intensity, 0);
  const overallKarmicIntensity = Math.min(Math.round(totalIntensity / Math.max(patterns.length, 1)), 10);
  
  const typeCount: Record<string, number> = {};
  patterns.forEach(pattern => {
    typeCount[pattern.type] = (typeCount[pattern.type] || 0) + 1;
  });
  
  const dominantKarmaType = Object.entries(typeCount).reduce((a, b) => 
    typeCount[a[0]] > typeCount[b[0]] ? a : b
  )[0] || 'Past Life Connection';
  
  // Calculate strength score
  const strengthScore = Math.round(
    (patterns.filter(p => p.intensity >= 7).length / Math.max(patterns.length, 1)) * 100
  );
  
  // Generate comprehensive recommendations
  const recommendations = language === 'hi' ? [
    "प्रतिदिन ध्यान और आत्म-चिंतन का अभ्यास करें",
    "संबंधों में धैर्य, समझ और क्षमा का भाव रखें",
    "पूर्व जन्म के कर्मों को स्वीकार करें और उनसे सीखें",
    "आध्यात्मिक गुरु या सलाहकार से मार्गदर्शन लें",
    "नियमित पूजा-पाठ और मंत्र जाप करें",
    "दान-पुण्य और सेवा कार्यों में भाग लें",
    "ज्योतिषीय उपाय और रत्न धारण करें",
    "संबंधों में सच्चाई और पारदर्शिता बनाए रखें"
  ] : [
    "Practice daily meditation and self-reflection",
    "Cultivate patience, understanding and forgiveness in relationships",
    "Accept and learn from past-life karmas",
    "Seek guidance from spiritual mentors or counselors",
    "Engage in regular worship and mantra chanting",
    "Participate in charity and service activities",
    "Follow astrological remedies and wear appropriate gems",
    "Maintain honesty and transparency in relationships"
  ];
  
  // Generate summary
  const summary = language === 'hi' 
    ? `आपकी कुंडली में ${patterns.length} मुख्य कर्मिक पैटर्न मिले हैं। आपकी समग्र कर्मिक तीव्रता ${overallKarmicIntensity}/10 है, जिसमें ${dominantKarmaType === 'Romantic Karma' ? 'रोमांटिक कर्म' : dominantKarmaType === 'Emotional Karma' ? 'भावनात्मक कर्म' : dominantKarmaType === 'Karmic Debt' ? 'कर्मिक ऋण' : dominantKarmaType === 'Past Life Connection' ? 'पूर्व जन्म संबंध' : dominantKarmaType === 'Destined Union' ? 'नियति मिलन' : 'आत्मा अनुबंध'} सबसे प्रमुख है।`
    : `Your chart reveals ${patterns.length} major karmic patterns. Your overall karmic intensity is ${overallKarmicIntensity}/10, with ${dominantKarmaType} being the most prominent theme.`;
  
  return {
    patterns: patterns.filter(p => p.active),
    overallKarmicIntensity,
    dominantKarmaType,
    recommendations,
    timing: {
      activation: language === 'hi' ? "वर्तमान दशा काल में सक्रिय हो रहे हैं" : "Activating during current dasha periods",
      resolution: language === 'hi' ? "आध्यात्मिक साधना और कर्म सुधार से मुक्ति संभव" : "Resolution possible through spiritual practice and karmic healing"
    },
    summary,
    strengthScore
  };
};

// Synastry analysis for two charts (for compatibility)
export const analyzeSynastryKarma = (
  chart1: KundaliChart,
  chart2: KundaliChart,
  language: 'hi' | 'en' = 'en'
): KarmaPattern[] => {
  const synastryPatterns: KarmaPattern[] = [];
  
  // Check Moon-Venus overlay
  const moon1 = chart1.planets.find(p => p.id === "MO");
  const venus2 = chart2.planets.find(p => p.id === "VE");
  const venus1 = chart1.planets.find(p => p.id === "VE");
  const moon2 = chart2.planets.find(p => p.id === "MO");
  
  if (moon1 && venus2) {
    const house = chart2.housesList.findIndex(sign => sign === moon1.sign) + 1;
    if (house === 7) {
      synastryPatterns.push({
        pattern: language === 'hi' ? "चंद्र-शुक्र आवरण (आत्मिक बंधन)" : "Moon-Venus Overlay (Soul Bond)",
        type: 'Past Life Connection',
        summary: language === 'hi'
          ? "प्राकृतिक भावनात्मक बंधन, पूर्व जन्म की स्मृति सक्रिय। आप दोनों के बीच गहरा आत्मिक संबंध है।"
          : "Natural emotional bond, past-life memory activated. Deep soul connection between both of you.",
        intensity: 8,
        houseInvolved: language === 'hi' ? "सप्तम भाव (साझेदारी)" : "7th house (partnerships)",
        outcome: language === 'hi'
          ? "गहरा भावनात्मक संबंध और स्वाभाविक समझ। एक-दूसरे की भावनाओं को बिना कहे समझना।"
          : "Deep emotional connection and natural understanding. Intuitive understanding of each other's feelings.",
        active: true,
        planetsConcerned: ["MO", "VE"],
        timing: language === 'hi' ? "तत्काल पहचान, आजीवन बंधन" : "Immediate recognition, lifelong bond"
      });
    }
  }
  
  return synastryPatterns;
};
