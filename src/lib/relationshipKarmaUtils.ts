
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
  
  // All other planets should be between Rahu and Ketu
  const otherPlanets = planets.filter(p => p.id !== "RA" && p.id !== "KE");
  const rahuDegree = rahu.degree;
  const ketuDegree = ketu.degree;
  
  let minDegree = Math.min(rahuDegree, ketuDegree);
  let maxDegree = Math.max(rahuDegree, ketuDegree);
  
  // Handle the circular nature of degrees
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
  
  // 1. Venus + Ketu Conjunction
  if (venus && ketu) {
    const angleDiff = calculateAngleDifference(venus.degree, ketu.degree);
    if (angleDiff <= 10) {
      patterns.push({
        pattern: language === 'hi' ? "शुक्र-केतु युति" : "Venus-Ketu Conjunction",
        type: 'Romantic Karma',
        summary: language === 'hi' 
          ? "पूर्व जन्म का अधूरा प्रेम। अचानक शुरुआत और अंत की संभावना।"
          : "Past-life romantic entanglement. May have ended abruptly in last incarnation.",
        intensity: 8,
        houseInvolved: `${getPlanetHouse(venus, houses)}${language === 'hi' ? 'वां भाव' : 'th house'}`,
        outcome: language === 'hi'
          ? "पुनर्मिलन संभावित, लेकिन भावनात्मक सहनशीलता की परीक्षा होगी।"
          : "Reunion likely, but will test emotional endurance.",
        active: true,
        planetsConcerned: ["VE", "KE"]
      });
    }
  }
  
  // 2. Rahu in 7th House
  if (rahu) {
    const rahuHouse = getPlanetHouse(rahu, houses);
    if (rahuHouse === 7) {
      patterns.push({
        pattern: language === 'hi' ? "राहु सप्तम भाव में" : "Rahu in 7th House",
        type: 'Destined Union',
        summary: language === 'hi'
          ? "कर्मिक विवाह। नियति द्वारा निर्धारित, तीव्र लेकिन अशांत संबंध।"
          : "Karmic marriage. Destined, intense but potentially turbulent relationship.",
        intensity: 9,
        houseInvolved: language === 'hi' ? "सप्तम भाव (साझेदारी)" : "7th house (partnerships)",
        outcome: language === 'hi'
          ? "भाग्य से मिलने वाला साथी, चुनौतियों के साथ गहरा बंधन।"
          : "Fated partner with deep karmic bond, challenging but transformative.",
        active: true,
        planetsConcerned: ["RA"]
      });
    }
  }
  
  // 3. Moon Conjunct Saturn
  if (moon && saturn) {
    const angleDiff = calculateAngleDifference(moon.degree, saturn.degree);
    if (angleDiff <= 10) {
      patterns.push({
        pattern: language === 'hi' ? "चंद्र-शनि युति" : "Moon-Saturn Conjunction",
        type: 'Emotional Karma',
        summary: language === 'hi'
          ? "भावनात्मक प्रतिबंध, पूर्व जन्म का कर्मिक ऋण (देखभाल या अस्वीकृति से संबंधित)।"
          : "Emotional restriction, karmic debt from past life (usually unfulfilled caregiving or rejection).",
        intensity: 7,
        houseInvolved: `${getPlanetHouse(moon, houses)}${language === 'hi' ? 'वां भाव' : 'th house'}`,
        outcome: language === 'hi'
          ? "धैर्य और समझ से भावनात्मक मुक्ति संभव।"
          : "Emotional healing possible through patience and understanding.",
        active: true,
        planetsConcerned: ["MO", "SA"]
      });
    }
  }
  
  // 4. Mars + Venus Conjunction
  if (mars && venus) {
    const angleDiff = calculateAngleDifference(mars.degree, venus.degree);
    if (angleDiff <= 8) {
      const marsHouse = getPlanetHouse(mars, houses);
      const isDestructive = [6, 8, 12].includes(marsHouse);
      
      patterns.push({
        pattern: language === 'hi' ? "मंगल-शुक्र युति" : "Mars-Venus Conjunction",
        type: 'Romantic Karma',
        summary: language === 'hi'
          ? `शारीरिक आकर्षण और कामुक इच्छा के माध्यम से कर्म। ${isDestructive ? 'विनाशकारी हो सकता है।' : 'सकारात्मक ऊर्जा।'}`
          : `Karma through physical attraction and sensual desire. ${isDestructive ? 'Can be destructive.' : 'Positive energy.'}`,
        intensity: isDestructive ? 6 : 8,
        houseInvolved: `${marsHouse}${language === 'hi' ? 'वां भाव' : 'th house'}`,
        outcome: language === 'hi'
          ? isDestructive ? "संयम और आत्म-नियंत्रण आवश्यक।" : "जुनूनी लेकिन संतुष्टिजनक संबंध।"
          : isDestructive ? "Moderation and self-control required." : "Passionate but fulfilling relationship.",
        active: true,
        planetsConcerned: ["MA", "VE"]
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
        pattern: language === 'hi' ? "सप्तमेश दुष्ठान या राहु-केतु से युत" : "7th Lord in Dusthana or with Rahu/Ketu",
        type: 'Karmic Debt',
        summary: language === 'hi'
          ? "संबंधों में कर्मिक दर्द। पूर्व जन्म का बाध्यकारी कर्मिक अनुबंध।"
          : "Karmic pain in relationships. Binding karmic contract from past lives.",
        intensity: 7,
        houseInvolved: `${getPlanetHouse(seventhLordPlanet, houses)}${language === 'hi' ? 'वां भाव' : 'th house'}`,
        outcome: language === 'hi'
          ? "चुनौतियों के माध्यम से आत्मिक विकास और समझ।"
          : "Spiritual growth and understanding through challenges.",
        active: true,
        planetsConcerned: [seventhLord]
      });
    }
  }
  
  // 6. Kala Sarpa Yoga
  const hasKalaSarpa = checkKalaSarpaYoga(planets);
  if (hasKalaSarpa) {
    patterns.push({
      pattern: language === 'hi' ? "काल सर्प योग" : "Kala Sarpa Yoga",
      type: 'Soul Contract',
      summary: language === 'hi'
        ? "भाग्य-बद्ध अनुभव, तीव्र आत्मिक अनुबंध। गहन कर्मिक संबंध।"
        : "Destiny-bound experiences, intense soul contracts. Deep karmic relationships.",
      intensity: 9,
      houseInvolved: language === 'hi' ? "सम्पूर्ण कुंडली" : "Entire chart",
      outcome: language === 'hi'
        ? "नियति से जुड़े तीव्र संबंध, आत्मिक रूपांतरण।"
        : "Intense destined relationships leading to soul transformation.",
      active: true,
      planetsConcerned: ["RA", "KE"]
    });
  }
  
  // 7. Saturn Aspecting Venus or 7th Lord
  if (saturn && venus) {
    const saturnAspectsVenus = checkSaturnAspect(saturn, venus);
    if (saturnAspectsVenus) {
      patterns.push({
        pattern: language === 'hi' ? "शनि की शुक्र पर दृष्टि" : "Saturn Aspecting Venus",
        type: 'Karmic Debt',
        summary: language === 'hi'
          ? "संबंधों में विलंब और कर्मिक सबक। धैर्य, विकास और परिपक्वता की आवश्यकता।"
          : "Delays and karmic lessons in relationships. Requires patience, growth, and maturity.",
        intensity: 6,
        houseInvolved: `${getPlanetHouse(venus, houses)}${language === 'hi' ? 'वां भाव' : 'th house'}`,
        outcome: language === 'hi'
          ? "धैर्य और समर्पण से स्थायी और गहरे संबंध।"
          : "Lasting and deep relationships through patience and commitment.",
        active: true,
        planetsConcerned: ["SA", "VE"]
      });
    }
  }
  
  // Calculate overall intensity and dominant type
  const totalIntensity = patterns.reduce((sum, pattern) => sum + pattern.intensity, 0);
  const overallKarmicIntensity = Math.min(Math.round(totalIntensity / Math.max(patterns.length, 1)), 10);
  
  const typeCount: Record<string, number> = {};
  patterns.forEach(pattern => {
    typeCount[pattern.type] = (typeCount[pattern.type] || 0) + 1;
  });
  
  const dominantKarmaType = Object.entries(typeCount).reduce((a, b) => 
    typeCount[a[0]] > typeCount[b[0]] ? a : b
  )[0] || 'Past Life Connection';
  
  // Generate recommendations
  const recommendations = language === 'hi' ? [
    "नियमित ध्यान और आत्म-चिंतन करें",
    "संबंधों में धैर्य और समझ रखें",
    "पूर्व जन्म के कर्मों को स्वीकार करें",
    "आत्मिक विकास पर ध्यान दें",
    "गुरु या आध्यात्मिक सलाहकार से मार्गदर्शन लें"
  ] : [
    "Practice regular meditation and self-reflection",
    "Cultivate patience and understanding in relationships",
    "Accept and work through past-life karmas",
    "Focus on spiritual growth and development",
    "Seek guidance from spiritual mentors or counselors"
  ];
  
  return {
    patterns: patterns.filter(p => p.active),
    overallKarmicIntensity,
    dominantKarmaType,
    recommendations,
    timing: {
      activation: language === 'hi' ? "वर्तमान दशा काल में सक्रिय" : "Active during current dasha period",
      resolution: language === 'hi' ? "आत्मिक कार्य और समझ के माध्यम से" : "Through spiritual work and understanding"
    }
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
        pattern: language === 'hi' ? "चंद्र-शुक्र आवरण" : "Moon-Venus Overlay",
        type: 'Past Life Connection',
        summary: language === 'hi'
          ? "प्राकृतिक भावनात्मक बंधन, पूर्व जन्म की स्मृति सक्रिय।"
          : "Natural emotional bond, past-life memory activated.",
        intensity: 8,
        houseInvolved: language === 'hi' ? "सप्तम भाव" : "7th house",
        outcome: language === 'hi'
          ? "गहरा भावनात्मक संबंध और समझ।"
          : "Deep emotional connection and understanding.",
        active: true,
        planetsConcerned: ["MO", "VE"]
      });
    }
  }
  
  return synastryPatterns;
};
