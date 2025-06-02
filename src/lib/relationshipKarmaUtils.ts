
import { KundaliChart, PlanetPosition, getPlanetDetails, getZodiacDetails, BirthData } from './kundaliUtils';

export interface KarmaPattern {
  name: string;
  description: string;
  intensity: number;
  remedies: string[];
  type: string;
  pattern: string;
  summary: string;
  houseInvolved?: string;
  planetsConcerned: string[];
  timing?: string;
  outcome: string;
}

interface RelationshipKarma {
  pastLifeConnection: string;
  karmaType: 'positive' | 'negative' | 'neutral';
  lessons: string[];
  challenges: string[];
  opportunities: string[];
  remedies: string[];
  intensity: number;
}

interface SoulMateIndicators {
  isPresent: boolean;
  strength: number;
  indicators: string[];
  description: string;
}

export interface RelationshipKarmaAnalysis {
  compatibility: number;
  soulMateIndicators: SoulMateIndicators;
  karmaPatterns: KarmaPattern[];
  relationshipKarma: RelationshipKarma;
  recommendations: string[];
  summary: string;
  patterns: KarmaPattern[];
  overallKarmicIntensity: number;
  strengthScore: number;
  dominantKarmaType: string;
  timing: {
    activation: string;
    resolution: string;
  };
}

// Calculate relationship karma between two charts
export function calculateRelationshipKarma(
  chart1: KundaliChart, 
  chart2: KundaliChart
): RelationshipKarmaAnalysis {
  // Convert planets to arrays if needed
  const planets1 = Array.isArray(chart1.planets) ? chart1.planets : Object.values(chart1.planets);
  const planets2 = Array.isArray(chart2.planets) ? chart2.planets : Object.values(chart2.planets);
  
  // Find specific planets
  const venus1 = planets1.find(p => p.id === "VE");
  const mars1 = planets1.find(p => p.id === "MA");
  const moon1 = planets1.find(p => p.id === "MO");
  const sun1 = planets1.find(p => p.id === "SU");
  const jupiter1 = planets1.find(p => p.id === "JU");
  const rahu1 = planets1.find(p => p.id === "RA");
  const ketu1 = planets1.find(p => p.id === "KE");
  
  const venus2 = planets2.find(p => p.id === "VE");
  const mars2 = planets2.find(p => p.id === "MA");
  const moon2 = planets2.find(p => p.id === "MO");
  const sun2 = planets2.find(p => p.id === "SU");
  const jupiter2 = planets2.find(p => p.id === "JU");
  const rahu2 = planets2.find(p => p.id === "RA");
  const ketu2 = planets2.find(p => p.id === "KE");
  
  // Calculate basic compatibility
  let compatibility = 50; // Base compatibility
  
  // Moon sign compatibility
  if (moon1 && moon2) {
    const moonDistance = Math.abs(moon1.rashi - moon2.rashi);
    if ([0, 4, 8].includes(moonDistance)) {
      compatibility += 20; // Same element
    } else if ([1, 5, 9].includes(moonDistance)) {
      compatibility += 10; // Friendly signs
    }
  }
  
  // Venus-Mars compatibility
  if (venus1 && mars2) {
    const venusMarsDist = Math.abs(venus1.rashi - mars2.rashi);
    if ([0, 1, 11].includes(venusMarsDist)) {
      compatibility += 15;
    }
  }
  
  if (venus2 && mars1) {
    const marsVenusDist = Math.abs(mars1.rashi - venus2.rashi);
    if ([0, 1, 11].includes(marsVenusDist)) {
      compatibility += 15;
    }
  }
  
  // Soul mate indicators
  const soulMateIndicators = calculateSoulMateIndicators(planets1, planets2);
  
  // Karma patterns
  const karmaPatterns = calculateKarmaPatterns(planets1, planets2);
  
  // Relationship karma
  const relationshipKarma = calculateRelationshipKarmaDetails(planets1, planets2);
  
  // Generate recommendations
  const recommendations = generateRecommendations(compatibility, soulMateIndicators, karmaPatterns);
  
  // Calculate additional properties
  const overallKarmicIntensity = Math.round(karmaPatterns.reduce((sum, pattern) => sum + pattern.intensity, 0) / karmaPatterns.length) || 5;
  const strengthScore = Math.min(100, compatibility + soulMateIndicators.strength);
  const dominantKarmaType = karmaPatterns.length > 0 ? karmaPatterns[0].type : 'Neutral Karma';
  
  return {
    compatibility: Math.min(100, Math.max(0, compatibility)),
    soulMateIndicators,
    karmaPatterns,
    relationshipKarma,
    recommendations,
    summary: `Based on planetary analysis, this relationship shows ${compatibility > 70 ? 'strong' : compatibility > 50 ? 'moderate' : 'challenging'} compatibility with ${karmaPatterns.length} active karma patterns.`,
    patterns: karmaPatterns,
    overallKarmicIntensity,
    strengthScore,
    dominantKarmaType,
    timing: {
      activation: "Current life period",
      resolution: "Through conscious spiritual work"
    }
  };
}

// New function for single chart analysis
export function analyzeRelationshipKarma(
  chart: KundaliChart,
  birthData: BirthData,
  language: 'hi' | 'en'
): RelationshipKarmaAnalysis {
  const planets = Array.isArray(chart.planets) ? chart.planets : Object.values(chart.planets);
  
  // Analyze karma patterns from single chart
  const patterns: KarmaPattern[] = [];
  
  // Venus analysis for romantic karma
  const venus = planets.find(p => p.id === "VE");
  if (venus) {
    patterns.push({
      name: "Venus Karma Pattern",
      description: language === 'hi' ? "शुक्र ग्रह का प्रभाव प्रेम और रिश्तों में" : "Venus influence in love and relationships",
      intensity: Math.floor(Math.random() * 5) + 5,
      remedies: [
        language === 'hi' ? "शुक्रवार को सफेद वस्त्र धारण करें" : "Wear white clothes on Friday",
        language === 'hi' ? "शुक्र मंत्र का जाप करें" : "Chant Venus mantras"
      ],
      type: "Romantic Karma",
      pattern: language === 'hi' ? "प्रेम कर्म पैटर्न" : "Love Karma Pattern",
      summary: language === 'hi' ? "आपके जीवन में प्रेम और रोमांस के क्षेत्र में विशेष कर्मिक प्रभाव दिखाई दे रहा है।" : "Special karmic influence is visible in the area of love and romance in your life.",
      houseInvolved: `${Math.floor(venus.degree / 30) + 1}th House`,
      planetsConcerned: ["Venus"],
      timing: language === 'hi' ? "वर्तमान समय में सक्रिय" : "Active in current period",
      outcome: language === 'hi' ? "संबंधों में गहराई और स्थिरता" : "Depth and stability in relationships"
    });
  }
  
  // Mars analysis for passion karma
  const mars = planets.find(p => p.id === "MA");
  if (mars) {
    patterns.push({
      name: "Mars Karma Pattern",
      description: language === 'hi' ? "मंगल ग्रह का प्रभाव जुनून और ऊर्जा में" : "Mars influence in passion and energy",
      intensity: Math.floor(Math.random() * 4) + 6,
      remedies: [
        language === 'hi' ? "मंगलवार का व्रत रखें" : "Observe Mars day fasting",
        language === 'hi' ? "लाल रंग का प्रयोग करें" : "Use red color"
      ],
      type: "Emotional Karma",
      pattern: language === 'hi' ? "भावनात्मक कर्म पैटर्न" : "Emotional Karma Pattern",
      summary: language === 'hi' ? "आपकी भावनाओं और जुनून में मंगल का प्रभाव दिखाई दे रहा है।" : "Mars influence is visible in your emotions and passion.",
      houseInvolved: `${Math.floor(mars.degree / 30) + 1}th House`,
      planetsConcerned: ["Mars"],
      timing: language === 'hi' ? "आगामी 2-3 वर्षों में प्रभावी" : "Effective in next 2-3 years",
      outcome: language === 'hi' ? "भावनात्मक संतुलन और शक्ति" : "Emotional balance and strength"
    });
  }
  
  // Rahu analysis for karmic debt
  const rahu = planets.find(p => p.id === "RA");
  if (rahu) {
    patterns.push({
      name: "Rahu Karma Pattern",
      description: language === 'hi' ? "राहु का प्रभाव कर्मिक ऋण में" : "Rahu influence in karmic debt",
      intensity: Math.floor(Math.random() * 3) + 7,
      remedies: [
        language === 'hi' ? "राहु के उपाय करें" : "Perform Rahu remedies",
        language === 'hi' ? "दान और सेवा करें" : "Practice charity and service"
      ],
      type: "Karmic Debt",
      pattern: language === 'hi' ? "कर्मिक ऋण पैटर्न" : "Karmic Debt Pattern",
      summary: language === 'hi' ? "पूर्व जन्म के कर्मों का प्रभाव वर्तमान जीवन में दिखाई दे रहा है।" : "Influence of past life actions is visible in current life.",
      houseInvolved: `${Math.floor(rahu.degree / 30) + 1}th House`,
      planetsConcerned: ["Rahu"],
      timing: language === 'hi' ? "जीवनभर प्रभावी" : "Effective throughout life",
      outcome: language === 'hi' ? "कर्मिक मुक्ति और आध्यात्मिक विकास" : "Karmic liberation and spiritual growth"
    });
  }
  
  const overallKarmicIntensity = Math.round(patterns.reduce((sum, pattern) => sum + pattern.intensity, 0) / patterns.length) || 6;
  const strengthScore = Math.min(100, 70 + (patterns.length * 10));
  const dominantKarmaType = patterns.length > 0 ? patterns[0].type : 'Neutral Karma';
  
  return {
    compatibility: 75, // Single chart base compatibility
    soulMateIndicators: {
      isPresent: patterns.length > 2,
      strength: strengthScore,
      indicators: patterns.map(p => p.name),
      description: language === 'hi' ? "आध्यात्मिक संकेत मिले हैं" : "Spiritual indicators found"
    },
    karmaPatterns: patterns,
    relationshipKarma: {
      pastLifeConnection: language === 'hi' ? "पूर्व जन्म के संबंधों का प्रभाव" : "Influence of past life connections",
      karmaType: 'positive',
      lessons: [
        language === 'hi' ? "प्रेम में धैर्य रखना" : "Practicing patience in love",
        language === 'hi' ? "स्वीकृति और समझदारी" : "Acceptance and understanding"
      ],
      challenges: [
        language === 'hi' ? "भावनात्मक संतुलन" : "Emotional balance",
        language === 'hi' ? "कर्मिक बंधन" : "Karmic bonds"
      ],
      opportunities: [
        language === 'hi' ? "आध्यात्मिक विकास" : "Spiritual growth",
        language === 'hi' ? "गहरे रिश्ते" : "Deep relationships"
      ],
      remedies: [
        language === 'hi' ? "ध्यान और मंत्र जाप" : "Meditation and mantra chanting",
        language === 'hi' ? "दान और सेवा" : "Charity and service"
      ],
      intensity: overallKarmicIntensity
    },
    recommendations: [
      language === 'hi' ? "नियमित आध्यात्मिक अभ्यास करें" : "Practice regular spiritual exercises",
      language === 'hi' ? "संबंधों में धैर्य रखें" : "Be patient in relationships",
      language === 'hi' ? "कर्मिक उपाय अपनाएं" : "Adopt karmic remedies"
    ],
    summary: `${language === 'hi' ? 'ग्रहों के विश्लेषण के आधार पर, आपके जीवन में' : 'Based on planetary analysis, your life shows'} ${patterns.length} ${language === 'hi' ? 'सक्रिय कर्म पैटर्न दिखाई दे रहे हैं।' : 'active karma patterns.'}`,
    patterns,
    overallKarmicIntensity,
    strengthScore,
    dominantKarmaType,
    timing: {
      activation: language === 'hi' ? "वर्तमान जीवन काल" : "Current life period",
      resolution: language === 'hi' ? "सचेत आध्यात्मिक कार्य के माध्यम से" : "Through conscious spiritual work"
    }
  };
}

function calculateSoulMateIndicators(planets1: PlanetPosition[], planets2: PlanetPosition[]): SoulMateIndicators {
  const indicators: string[] = [];
  let strength = 0;
  
  // Find nodes (Rahu/Ketu) connections
  const rahu1 = planets1.find(p => p.id === "RA");
  const ketu1 = planets1.find(p => p.id === "KE");
  const rahu2 = planets2.find(p => p.id === "RA");
  const ketu2 = planets2.find(p => p.id === "KE");
  
  if (rahu1 && ketu2 && Math.abs(rahu1.rashi - ketu2.rashi) <= 1) {
    indicators.push("North Node - South Node connection");
    strength += 30;
  }
  
  if (ketu1 && rahu2 && Math.abs(ketu1.rashi - rahu2.rashi) <= 1) {
    indicators.push("South Node - North Node connection");
    strength += 30;
  }
  
  // Venus-Jupiter connections
  const venus1 = planets1.find(p => p.id === "VE");
  const jupiter2 = planets2.find(p => p.id === "JU");
  const venus2 = planets2.find(p => p.id === "VE");
  const jupiter1 = planets1.find(p => p.id === "JU");
  
  if (venus1 && jupiter2 && Math.abs(venus1.rashi - jupiter2.rashi) <= 1) {
    indicators.push("Venus-Jupiter blessing");
    strength += 25;
  }
  
  if (venus2 && jupiter1 && Math.abs(venus2.rashi - jupiter1.rashi) <= 1) {
    indicators.push("Jupiter-Venus harmony");
    strength += 25;
  }
  
  return {
    isPresent: strength > 30,
    strength: Math.min(100, strength),
    indicators,
    description: strength > 50 ? "Strong soul mate connection" : 
                strength > 30 ? "Possible soul mate indicators" : 
                "Limited soul mate indicators"
  };
}

function calculateKarmaPatterns(planets1: PlanetPosition[], planets2: PlanetPosition[]): KarmaPattern[] {
  const patterns: KarmaPattern[] = [];
  
  // Saturn connections (karmic lessons)
  const saturn1 = planets1.find(p => p.id === "SA");
  const saturn2 = planets2.find(p => p.id === "SA");
  
  if (saturn1 && saturn2) {
    const saturnDistance = Math.abs(saturn1.rashi - saturn2.rashi);
    if (saturnDistance <= 2) {
      patterns.push({
        name: "Saturn Karma Pattern",
        description: "Shared life lessons and responsibilities",
        intensity: 8,
        remedies: ["Practice patience and understanding", "Focus on long-term commitment"],
        type: "Karmic Debt",
        pattern: "Saturn Connection",
        summary: "Deep karmic lessons to be learned together",
        houseInvolved: "Multiple houses",
        planetsConcerned: ["Saturn"],
        timing: "Long-term influence",
        outcome: "Spiritual maturity and wisdom"
      });
    }
  }
  
  // Rahu-Ketu karma
  const rahu1 = planets1.find(p => p.id === "RA");
  const ketu1 = planets1.find(p => p.id === "KE");
  const rahu2 = planets2.find(p => p.id === "RA");
  const ketu2 = planets2.find(p => p.id === "KE");
  
  if (rahu1 && rahu2 && Math.abs(rahu1.rashi - rahu2.rashi) <= 1) {
    patterns.push({
      name: "Desire Karma",
      description: "Shared material and worldly desires",
      intensity: 7,
      remedies: ["Practice spiritual detachment", "Focus on higher purposes"],
      type: "Past Life Connection",
      pattern: "Nodal Connection",
      summary: "Past life desires bringing you together",
      houseInvolved: "Rahu axis",
      planetsConcerned: ["Rahu", "Ketu"],
      timing: "Current incarnation",
      outcome: "Transcendence of material desires"
    });
  }
  
  return patterns;
}

function calculateRelationshipKarmaDetails(planets1: PlanetPosition[], planets2: PlanetPosition[]): RelationshipKarma {
  // Find key planets
  const rahu1 = planets1.find(p => p.id === "RA");
  const ketu1 = planets1.find(p => p.id === "KE");
  const venus1 = planets1.find(p => p.id === "VE");
  const mars1 = planets1.find(p => p.id === "MA");
  
  const rahu2 = planets2.find(p => p.id === "RA");
  const ketu2 = planets2.find(p => p.id === "KE");
  const venus2 = planets2.find(p => p.id === "VE");
  const mars2 = planets2.find(p => p.id === "MA");
  
  let karmaType: 'positive' | 'negative' | 'neutral' = 'neutral';
  let intensity = 50;
  
  // Determine karma type based on nodal connections
  if (rahu1 && ketu2 && Math.abs(rahu1.rashi - ketu2.rashi) <= 1) {
    karmaType = 'positive';
    intensity += 30;
  }
  
  if (ketu1 && rahu2 && Math.abs(ketu1.rashi - rahu2.rashi) <= 1) {
    karmaType = 'positive';
    intensity += 30;
  }
  
  return {
    pastLifeConnection: karmaType === 'positive' ? 
      "Strong past life connection with unfinished positive karma" :
      "Past life connection with lessons to learn",
    karmaType,
    lessons: [
      "Learning to balance individual desires with partnership needs",
      "Developing unconditional love and acceptance",
      "Understanding the nature of attachment and detachment"
    ],
    challenges: [
      "Overcoming past life patterns",
      "Balancing karma from previous incarnations",
      "Learning to forgive and let go"
    ],
    opportunities: [
      "Spiritual growth through relationship",
      "Healing past life wounds",
      "Creating positive karma for future lives"
    ],
    remedies: [
      "Practice meditation together",
      "Perform charitable acts as a couple",
      "Study spiritual texts and teachings"
    ],
    intensity: Math.min(100, Math.max(0, intensity))
  };
}

function generateRecommendations(
  compatibility: number, 
  soulMate: SoulMateIndicators, 
  patterns: KarmaPattern[]
): string[] {
  const recommendations: string[] = [];
  
  if (compatibility > 70) {
    recommendations.push("This is a highly compatible relationship with strong potential for long-term happiness");
  } else if (compatibility > 50) {
    recommendations.push("Good compatibility with some areas needing attention and understanding");
  } else {
    recommendations.push("Challenging relationship that requires significant effort and commitment from both partners");
  }
  
  if (soulMate.isPresent) {
    recommendations.push("Strong soul mate indicators suggest a deep spiritual connection");
    recommendations.push("Focus on spiritual growth and higher purposes together");
  }
  
  if (patterns.length > 0) {
    recommendations.push("Karmic patterns indicate important life lessons to be learned together");
    recommendations.push("Practice patience and understanding during challenging times");
  }
  
  recommendations.push("Regular spiritual practices and open communication will strengthen the bond");
  
  return recommendations;
}

// Helper function to get planet by ID
function getPlanetById(planets: PlanetPosition[], id: string): PlanetPosition | undefined {
  return planets.find(p => p.id === id);
}

// Export additional utility functions
export {
  calculateSoulMateIndicators,
  calculateKarmaPatterns,
  calculateRelationshipKarmaDetails
};
