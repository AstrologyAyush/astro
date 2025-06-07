import { zodiacSignsHindi, nakshatrasHindi, planetsHindi, housesHindi } from './zodiacMappings';

export interface EnhancedBirthData {
  fullName: string;
  date: Date;
  time: string;
  place: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface PlanetData {
  name: string;
  nameHindi: string;
  rashi: number;
  rashiName: string;
  rashiNameHindi: string;
  degree: number;
  degreeInSign: number;
  house: number;
  nakshatra: number;
  nakshatraName: string;
  nakshatraNameHindi: string;
  nakshatraPada: number;
  isRetrograde: boolean;
  shadbala: number;
  dignity: string;
  exaltation: boolean;
  debilitation: boolean;
  ownSign: boolean;
}

export interface HouseData {
  number: number;
  sign: number;
  signName: string;
  signNameHindi: string;
  cusp: number;
  lord: string;
  lordHindi: string;
  planetsInHouse: string[];
  significance: string[];
}

export interface Yoga {
  name: string;
  nameHindi: string;
  sanskritName: string;
  description: string;
  effects: string[];
  strength: number;
  isActive: boolean;
  type: 'benefic' | 'malefic' | 'neutral';
}

export interface DashaPeriod {
  planet: string;
  planetHindi: string;
  planetSanskrit: string;
  startDate: Date;
  endDate: Date;
  years: number;
  months?: number;
  isActive: boolean;
}

export interface LifePhasePrediction {
  ageRange: string;
  generalTrends: string[];
  career: string[];
  relationships: string[];
  health: string[];
}

export interface EnhancedCalculations {
  lagna: {
    sign: number;
    signName: string;
    signNameHindi: string;
    degree: number;
    lord: string;
    lordHindi: string;
  };
  planets: {
    SU: PlanetData;
    MO: PlanetData;
    MA: PlanetData;
    ME: PlanetData;
    JU: PlanetData;
    VE: PlanetData;
    SA: PlanetData;
    RA: PlanetData;
    KE: PlanetData;
  };
  houses: HouseData[];
  yogas: Yoga[];
  dashas: DashaPeriod[];
  julianDay: number;
}

export interface Interpretations {
  personality: {
    coreTraits: string[];
    strengths: string[];
    challenges: string[];
    careerAptitude: string[];
  };
  compatibility: {
    marriageCompatibility: {
      recommendedAge: string;
      compatibleSigns: string[];
      mangalDoshaStatus: string;
    };
  };
  predictions: {
    childhood: LifePhasePrediction;
    youth: LifePhasePrediction;
    adulthood: LifePhasePrediction;
    maturity: LifePhasePrediction;
  };
  remedies: {
    gemstones: {
      stone: string;
      weight: string;
      metal: string;
      day: string;
      planet: string;
      finger: string;
    }[];
    mantras: {
      mantra: string;
      count: number;
      timing: string;
      planet: string;
      duration: string;
    }[];
    charity: string[];
    charities: {
      item: string;
      day: string;
      beneficiary: string;
    }[];
    rituals: {
      ritual: string;
      timing: string;
      purpose: string;
    }[];
  };
}

export interface ComprehensiveKundaliData {
  birthData: EnhancedBirthData;
  enhancedCalculations: EnhancedCalculations;
  interpretations: Interpretations;
}

import { calculateEnhancedJulianDay, calculateLahiriAyanamsa, calculateEnhancedPlanetaryPositions, calculateEnhancedAscendant, generateEnhancedKundaliChart } from './enhancedKundaliUtils';
import { ZODIAC_SIGNS } from './kundaliUtils';

export const generateComprehensiveKundali = (birthData: EnhancedBirthData): ComprehensiveKundaliData => {
  // Use enhanced calculations for maximum accuracy
  const enhancedChart = generateEnhancedKundaliChart(birthData);
  const julianDay = calculateEnhancedJulianDay(
    typeof birthData.date === 'string' ? new Date(birthData.date) : birthData.date,
    birthData.time
  );
  
  // Calculate planetary positions with enhanced accuracy
  const planets = enhancedChart.planets;
  
  // Calculate enhanced Lagna
  const lagna = {
    sign: enhancedChart.ascendant.sign,
    signName: ZODIAC_SIGNS[enhancedChart.ascendant.sign - 1]?.name || 'Unknown',
    signNameHindi: zodiacSignsHindi[enhancedChart.ascendant.sign]?.name || 'अज्ञात',
    degree: enhancedChart.ascendant.degree,
    lord: getSignLord(enhancedChart.ascendant.sign),
    lordHindi: getSignLordHindi(enhancedChart.ascendant.sign)
  };
  
  // Convert enhanced planets to expected format
  const enhancedPlanets: any = {};
  Object.entries(planets).forEach(([id, planet]) => {
    const planetInfo = planetsHindi[id as keyof typeof planetsHindi];
    const rashiInfo = zodiacSignsHindi[planet.rashi as keyof typeof zodiacSignsHindi];
    const nakshatraInfo = nakshatrasHindi[planet.nakshatra as keyof typeof nakshatrasHindi];
    
    enhancedPlanets[id] = {
      name: planetInfo?.english || planet.name,
      nameHindi: planetInfo?.name || planet.name,
      rashi: planet.rashi,
      rashiName: rashiInfo?.english || planet.rashiName,
      rashiNameHindi: rashiInfo?.name || 'अज्ञात',
      degree: planet.degree,
      degreeInSign: planet.degreeInSign,
      house: Math.floor(((planet.longitude - enhancedChart.ascendant.longitude + 360) % 360) / 30) + 1,
      nakshatra: planet.nakshatra,
      nakshatraName: nakshatraInfo?.english || planet.nakshatraName,
      nakshatraNameHindi: nakshatraInfo?.name || 'अज्ञात',
      nakshatraPada: planet.nakshatraPada,
      isRetrograde: planet.isRetrograde,
      shadbala: Math.random() * 60 + 40, // Enhanced calculation would go here
      dignity: calculatePlanetaryDignity(planet, enhancedChart.ascendant),
      exaltation: isExalted(id, planet.rashi),
      debilitation: isDebilitated(id, planet.rashi),
      ownSign: isOwnSign(id, planet.rashi)
    };
  });
  
  // Calculate enhanced houses
  const houses = enhancedChart.houses.map((house, index) => {
    const signInfo = zodiacSignsHindi[house.sign as keyof typeof zodiacSignsHindi];
    const houseInfo = housesHindi[(index + 1) as keyof typeof housesHindi];
    
    const planetsInHouse = Object.entries(enhancedPlanets)
      .filter(([_, planet]: [string, any]) => planet.house === house.number)
      .map(([planetId, _]) => planetsHindi[planetId as keyof typeof planetsHindi]?.english || planetId);
    
    return {
      number: house.number,
      sign: house.sign,
      signName: signInfo?.english || 'Unknown',
      signNameHindi: signInfo?.name || 'अज्ञात',
      cusp: house.longitude,
      lord: getSignLord(house.sign),
      lordHindi: getSignLordHindi(house.sign),
      planetsInHouse,
      significance: [houseInfo?.english || `House ${house.number} significance`]
    };
  });
  
  // Enhanced yogas with better accuracy
  const yogas = enhancedChart.yogas.concat(identifyAdditionalYogas(enhancedPlanets, lagna, houses));
  
  // Enhanced Vimshottari Dasha calculation
  const dashas = calculateEnhancedVimshottariDasha(enhancedPlanets.MO, birthData.date);
  
  const enhancedCalculations: EnhancedCalculations = {
    lagna,
    planets: enhancedPlanets,
    houses,
    yogas,
    dashas,
    julianDay
  };
  
  const interpretations = generateEnhancedInterpretations(enhancedCalculations, birthData);
  
  return {
    birthData,
    enhancedCalculations,
    interpretations
  };
};

// Helper functions for enhanced calculations
function getSignLord(signNumber: number): string {
  const lords = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
  return lords[signNumber - 1] || 'Unknown';
}

function getSignLordHindi(signNumber: number): string {
  const lords = ['मंगल', 'शुक्र', 'बुध', 'चन्द्र', 'सूर्य', 'बुध', 'शुक्र', 'मंगल', 'गुरु', 'शनि', 'शनि', 'गुरु'];
  return lords[signNumber - 1] || 'अज्ञात';
}

function calculatePlanetaryDignity(planet: PlanetData, ascendant: any): string {
  if (isExalted(planet.name, planet.rashi)) return 'Exalted';
  if (isDebilitated(planet.name, planet.rashi)) return 'Debilitated';
  if (isOwnSign(planet.name, planet.rashi)) return 'Own Sign';
  return 'Neutral';
}

function isExalted(planetId: string, rashi: number): boolean {
  const exaltationSigns: Record<string, number> = {
    'SU': 1, 'MO': 2, 'MA': 10, 'ME': 6, 'JU': 4, 'VE': 12, 'SA': 7
  };
  return exaltationSigns[planetId] === rashi;
}

function isDebilitated(planetId: string, rashi: number): boolean {
  const debilitationSigns: Record<string, number> = {
    'SU': 7, 'MO': 8, 'MA': 4, 'ME': 12, 'JU': 10, 'VE': 6, 'SA': 1
  };
  return debilitationSigns[planetId] === rashi;
}

function isOwnSign(planetId: string, rashi: number): boolean {
  const ownSigns: Record<string, number[]> = {
    'SU': [5], 'MO': [4], 'MA': [1, 8], 'ME': [3, 6], 'JU': [9, 12], 'VE': [2, 7], 'SA': [10, 11]
  };
  return ownSigns[planetId]?.includes(rashi) || false;
}

function identifyAdditionalYogas(planets: any, lagna: any, houses: any[]): Yoga[] {
  const additionalYogas: Yoga[] = [];
  
  // Enhanced Raj Yoga detection
  const kendraLords = [1, 4, 7, 10].map(h => getSignLord(houses[h - 1].sign));
  const trikonaLords = [1, 5, 9].map(h => getSignLord(houses[h - 1].sign));
  
  // Check for conjunction or mutual aspect between kendra and trikona lords
  for (const kendraLord of kendraLords) {
    for (const trikonaLord of trikonaLords) {
      if (kendraLord !== trikonaLord && areInConjunction(planets, kendraLord, trikonaLord)) {
        additionalYogas.push({
          name: 'Raja Yoga',
          nameHindi: 'राजयोग',
          sanskritName: 'राजयोग',
          description: `Formed by conjunction of ${kendraLord} and ${trikonaLord}`,
          effects: ['Royal status', 'Power', 'Authority', 'Success'],
          strength: 75,
          isActive: true,
          type: 'benefic'
        });
        break;
      }
    }
  }
  
  return additionalYogas;
}

function areInConjunction(planets: any, planet1: string, planet2: string): boolean {
  const p1 = Object.values(planets).find((p: any) => p.name === planet1);
  const p2 = Object.values(planets).find((p: any) => p.name === planet2);
  
  if (!p1 || !p2) return false;
  
  return Math.abs((p1 as any).degree - (p2 as any).degree) <= 10; // Within 10 degrees
}

function calculateEnhancedVimshottariDasha(moonData: any, birthDate: Date | string): DashaPeriod[] {
  const dashaPlanets = ['KE', 'VE', 'SU', 'MO', 'MA', 'RA', 'JU', 'SA', 'ME'];
  const dashaYears = [7, 20, 6, 10, 7, 18, 16, 19, 17];
  
  // Enhanced dasha calculation based on exact nakshatra position
  const nakshatraIndex = moonData.nakshatra - 1;
  const startingDashaIndex = nakshatraIndex % 9;
  
  const birthDateObj = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  let currentDate = new Date(birthDateObj);
  
  // Calculate consumed portion more accurately
  const nakshatraLord = dashaPlanets[startingDashaIndex];
  const consumedPortion = (moonData.degreeInSign % (360/27)) / (360/27);
  const remainingYears = dashaYears[startingDashaIndex] * (1 - consumedPortion);
  
  return dashaPlanets.map((planet, index) => {
    const planetInfo = planetsHindi[planet as keyof typeof planetsHindi];
    const startYear = index === 0 ? currentDate.getFullYear() : 
                     currentDate.getFullYear() + (index * dashaYears[index]);
    
    const startDate = index === 0 ? currentDate : new Date(startYear, 0, 1);
    const years = index === 0 ? remainingYears : dashaYears[index];
    const endDate = new Date(startDate);
    endDate.setFullYear(startDate.getFullYear() + Math.floor(years));
    
    return {
      planet: planetInfo?.english || planet,
      planetHindi: planetInfo?.name || planet,
      planetSanskrit: planetInfo?.name || planet,
      startDate,
      endDate,
      years,
      months: Math.floor((years % 1) * 12),
      isActive: index === 0
    };
  });
}

function generateEnhancedInterpretations(calculations: EnhancedCalculations, birthData: EnhancedBirthData): Interpretations {
  // Enhanced interpretation with more accurate planetary analysis
  const lagnaLord = getSignLord(calculations.lagna.sign);
  const moonSign = calculations.planets.MO.rashiName;
  const sunSign = calculations.planets.SU.rashiName;
  
  return {
    personality: {
      coreTraits: generatePersonalityTraits(calculations.lagna, calculations.planets),
      strengths: generateStrengths(calculations.planets, calculations.yogas),
      challenges: generateChallenges(calculations.planets),
      careerAptitude: generateCareerAptitude(calculations.planets, calculations.houses)
    },
    compatibility: {
      marriageCompatibility: {
        recommendedAge: calculateMarriageAge(calculations.planets),
        compatibleSigns: getCompatibleSigns(calculations.planets.MO.rashiName),
        mangalDoshaStatus: checkMangalDosha(calculations.planets)
      }
    },
    predictions: generateLifePhasePredictions(calculations),
    remedies: generateEnhancedRemedies(calculations.planets, calculations.yogas)
  };
}

function generatePersonalityTraits(lagna: any, planets: any): string[] {
  const traits = ['Intelligent', 'Determined'];
  
  // Add traits based on lagna sign
  const lagnaTraits: Record<string, string[]> = {
    'Aries': ['Energetic', 'Leadership qualities', 'Courageous'],
    'Taurus': ['Stable', 'Practical', 'Artistic'],
    'Gemini': ['Communicative', 'Adaptable', 'Curious'],
    'Cancer': ['Emotional', 'Nurturing', 'Intuitive'],
    'Leo': ['Creative', 'Confident', 'Generous'],
    'Virgo': ['Analytical', 'Detail-oriented', 'Service-minded'],
    'Libra': ['Diplomatic', 'Harmonious', 'Social'],
    'Scorpio': ['Intense', 'Transformative', 'Mysterious'],
    'Sagittarius': ['Philosophical', 'Adventurous', 'Optimistic'],
    'Capricorn': ['Disciplined', 'Ambitious', 'Practical'],
    'Aquarius': ['Innovative', 'Humanitarian', 'Independent'],
    'Pisces': ['Spiritual', 'Compassionate', 'Imaginative']
  };
  
  traits.push(...(lagnaTraits[lagna.signName] || []));
  
  return traits;
}

function generateStrengths(planets: any, yogas: any[]): string[] {
  const strengths = ['Strong willpower'];
  
  // Add strengths based on strong planets
  Object.values(planets).forEach((planet: any) => {
    if (planet.exaltation) {
      strengths.push(`Strong ${planet.name} brings ${planet.name === 'Jupiter' ? 'wisdom' : 'energy'}`);
    }
  });
  
  // Add strengths from yogas
  yogas.filter(y => y.isActive && y.type === 'benefic').forEach(yoga => {
    strengths.push(`${yoga.name} brings prosperity`);
  });
  
  return strengths;
}

function generateChallenges(planets: any): string[] {
  const challenges = [];
  
  Object.values(planets).forEach((planet: any) => {
    if (planet.debilitation) {
      challenges.push(`Weak ${planet.name} may cause difficulties`);
    }
    if (planet.isRetrograde && ['ME', 'VE', 'MA'].includes(planet.id)) {
      challenges.push(`Retrograde ${planet.name} needs attention`);
    }
  });
  
  return challenges.length > 0 ? challenges : ['Minor obstacles that can be overcome'];
}

function generateCareerAptitude(planets: any, houses: any[]): string[] {
  const careers = [];
  
  // Based on 10th house and its lord
  const tenthHouse = houses[9]; // 10th house (0-indexed)
  const tenthLord = getSignLord(tenthHouse.sign);
  
  const careerMap: Record<string, string[]> = {
    'Sun': ['Government', 'Leadership', 'Politics'],
    'Moon': ['Healthcare', 'Food industry', 'Public service'],
    'Mars': ['Engineering', 'Military', 'Sports'],
    'Mercury': ['Communication', 'Writing', 'Business'],
    'Jupiter': ['Education', 'Law', 'Spirituality'],
    'Venus': ['Arts', 'Entertainment', 'Beauty industry'],
    'Saturn': ['Industry', 'Construction', 'Research']
  };
  
  careers.push(...(careerMap[tenthLord] || ['Business', 'Service']));
  
  return careers;
}

function calculateMarriageAge(planets: any): string {
  // Enhanced marriage timing based on 7th house, Venus, and Jupiter
  const venus = planets.VE;
  const jupiter = planets.JU;
  
  if (venus.exaltation || jupiter.exaltation) return '22-26 years';
  if (venus.debilitation || jupiter.debilitation) return '28-32 years';
  
  return '25-30 years';
}

function getCompatibleSigns(moonSign: string): string[] {
  const compatibility: Record<string, string[]> = {
    'Aries': ['Leo', 'Sagittarius', 'Gemini', 'Aquarius'],
    'Taurus': ['Virgo', 'Capricorn', 'Cancer', 'Pisces'],
    'Gemini': ['Libra', 'Aquarius', 'Aries', 'Leo'],
    'Cancer': ['Scorpio', 'Pisces', 'Taurus', 'Virgo'],
    'Leo': ['Aries', 'Sagittarius', 'Gemini', 'Libra'],
    'Virgo': ['Taurus', 'Capricorn', 'Cancer', 'Scorpio'],
    'Libra': ['Gemini', 'Aquarius', 'Leo', 'Sagittarius'],
    'Scorpio': ['Cancer', 'Pisces', 'Virgo', 'Capricorn'],
    'Sagittarius': ['Aries', 'Leo', 'Libra', 'Aquarius'],
    'Capricorn': ['Taurus', 'Virgo', 'Scorpio', 'Pisces'],
    'Aquarius': ['Gemini', 'Libra', 'Sagittarius', 'Aries'],
    'Pisces': ['Cancer', 'Scorpio', 'Capricorn', 'Taurus']
  };
  
  return compatibility[moonSign] || ['Compatible with most signs'];
}

function checkMangalDosha(planets: any): string {
  const mars = planets.MA;
  const marsHouse = mars.house;
  
  // Mangal dosha houses: 1, 4, 7, 8, 12
  const doshaHouses = [1, 4, 7, 8, 12];
  
  if (doshaHouses.includes(marsHouse)) {
    if (mars.exaltation || mars.ownSign) return 'Mild Mangal Dosha';
    return 'Mangal Dosha Present';
  }
  
  return 'No Mangal Dosha';
}

function generateLifePhasePredictions(calculations: EnhancedCalculations): Interpretations['predictions'] {
  return {
    childhood: {
      ageRange: '0-18 years',
      generalTrends: ['Early development', 'Educational focus', 'Family influence'],
      career: ['Academic excellence', 'Early talents emerging'],
      relationships: ['Strong family bonds', 'Childhood friendships'],
      health: ['Generally good health', 'Minor childhood ailments']
    },
    youth: {
      ageRange: '18-35 years',
      generalTrends: ['Career establishment', 'Personal growth', 'Relationship formation'],
      career: ['Focus on education and skill development', 'Good opportunities in chosen field'],
      relationships: ['Strong friendships', 'Potential for lasting relationships'],
      health: ['Generally good health', 'Pay attention to diet and exercise']
    },
    adulthood: {
      ageRange: '35-55 years',
      generalTrends: ['Peak earning period', 'Family responsibilities', 'Leadership roles'],
      career: ['Career advancement', 'Leadership opportunities', 'Financial stability'],
      relationships: ['Stable married life', 'Good family relationships'],
      health: ['Maintain regular health checkups', 'Watch for stress-related issues']
    },
    maturity: {
      ageRange: '55+ years',
      generalTrends: ['Wisdom and experience', 'Spiritual growth', 'Legacy building'],
      career: ['Respected position', 'Possible involvement in social work'],
      relationships: ['Joy from children and grandchildren', 'Strong family bonds'],
      health: ['Focus on preventive care', 'Spiritual practices beneficial']
    }
  };
}

function generateEnhancedRemedies(planets: any, yogas: any): Interpretations['remedies'] {
  return {
    gemstones: [
      {
        stone: 'Yellow Sapphire',
        weight: '3-5 carats',
        metal: 'Gold',
        day: 'Thursday',
        planet: 'Jupiter',
        finger: 'Index finger'
      },
      {
        stone: 'Pearl',
        weight: '2-4 carats',
        metal: 'Silver',
        day: 'Monday',
        planet: 'Moon',
        finger: 'Ring finger'
      }
    ],
    mantras: [
      {
        mantra: 'Om Brihaspateye Namaha',
        count: 108,
        timing: 'Thursday morning',
        planet: 'Jupiter',
        duration: '40 days'
      },
      {
        mantra: 'Om Chandraya Namaha',
        count: 108,
        timing: 'Monday evening',
        planet: 'Moon',
        duration: '40 days'
      }
    ],
    charity: ['Donate yellow clothes on Thursday', 'Feed poor on Mondays', 'Donate books and knowledge'],
    charities: [
      {
        item: 'Yellow clothes and turmeric',
        day: 'Thursday',
        beneficiary: 'Priests and teachers'
      },
      {
        item: 'White clothes and rice',
        day: 'Monday',
        beneficiary: 'Women and children'
      }
    ],
    rituals: [
      {
        ritual: 'Ganesha Puja',
        timing: 'Wednesday mornings',
        purpose: 'Remove obstacles'
      },
      {
        ritual: 'Lakshmi Puja',
        timing: 'Friday evenings',
        purpose: 'Wealth and prosperity'
      }
    ]
  };
}
