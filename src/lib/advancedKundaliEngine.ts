
import { BirthData, generateKundaliChart, KundaliChart } from './kundaliUtils';
import {
  PreciseCoordinates,
  PreciseBirthTime,
  PlanetaryPosition,
  LagnaData,
  HouseData,
  DashaDetails,
  YogaDetails,
  calculateJulianDay,
  calculatePlanetaryPositions,
  calculateAscendant,
  calculateHouseCusps,
  calculateVimshottariDasha,
  calculateAdvancedYogas
} from './enhancedAstronomicalCalculations';

export interface EnhancedBirthData {
  fullName: string;
  date: Date;
  time: string;
  place: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface ComprehensiveKundaliData {
  birthData: EnhancedBirthData;
  basicChart: KundaliChart;
  enhancedCalculations: {
    lagna: LagnaData;
    planets: Record<string, PlanetaryPosition>;
    houses: HouseData[];
    dashas: DashaDetails[];
    yogas: YogaDetails[];
    ayanamsa: number;
    julianDay: number;
  };
  interpretations: {
    personality: PersonalityAnalysis;
    predictions: LifePhasePredictions;
    remedies: RemedySuggestions;
    compatibility: CompatibilityFactors;
  };
  additionalCharts: {
    navamsa: any; // D9 chart
    dashamsa: any; // D10 chart
    dwadhamsa: any; // D12 chart
  };
}

export interface PersonalityAnalysis {
  coreTraits: string[];
  strengths: string[];
  challenges: string[];
  mentalMakeup: string;
  physicalAttributes: string[];
  careerAptitude: string[];
  relationshipStyle: string;
  spiritualInclination: string;
}

export interface LifePhasePredictions {
  childhood: PhasePrediction;
  youth: PhasePrediction;
  adulthood: PhasePrediction;
  maturity: PhasePrediction;
}

export interface PhasePrediction {
  ageRange: string;
  generalTrends: string[];
  career: string[];
  finance: string[];
  relationships: string[];
  health: string[];
  majorEvents: string[];
  opportunities: string[];
  challenges: string[];
}

export interface RemedySuggestions {
  gemstones: GemstoneRecommendation[];
  mantras: MantraRecommendation[];
  charities: CharityRecommendation[];
  rituals: RitualRecommendation[];
  lifestyle: LifestyleRecommendation[];
  colors: ColorRecommendation[];
  directions: DirectionRecommendation[];
}

export interface GemstoneRecommendation {
  stone: string;
  planet: string;
  weight: string;
  metal: string;
  finger: string;
  day: string;
  mantra: string;
  benefits: string[];
}

export interface MantraRecommendation {
  mantra: string;
  planet: string;
  count: number;
  timing: string;
  duration: string;
  benefits: string[];
}

export interface CharityRecommendation {
  item: string;
  planet: string;
  day: string;
  quantity: string;
  benefits: string[];
}

export interface RitualRecommendation {
  ritual: string;
  planet: string;
  timing: string;
  frequency: string;
  procedure: string[];
  benefits: string[];
}

export interface LifestyleRecommendation {
  category: string;
  recommendations: string[];
  benefits: string[];
}

export interface ColorRecommendation {
  color: string;
  planet: string;
  usage: string;
  benefits: string[];
}

export interface DirectionRecommendation {
  direction: string;
  planet: string;
  usage: string;
  benefits: string[];
}

export interface CompatibilityFactors {
  marriageCompatibility: MarriageCompatibility;
  businessPartnership: BusinessCompatibility;
  friendshipCompatibility: FriendshipCompatibility;
}

export interface MarriageCompatibility {
  idealPartnerTraits: string[];
  compatibleSigns: string[];
  mangalDoshaStatus: string;
  recommendedAge: string;
  importantConsiderations: string[];
}

export interface BusinessCompatibility {
  idealPartnerTraits: string[];
  suitableBusinessTypes: string[];
  partnership: string[];
  leadership: string[];
}

export interface FriendshipCompatibility {
  idealFriendTraits: string[];
  socialBehavior: string[];
  loyaltyFactors: string[];
}

export function generateComprehensiveKundali(birthData: EnhancedBirthData): ComprehensiveKundaliData {
  console.log('Generating comprehensive Kundali with enhanced calculations...');
  
  // Convert birth data to precise format
  const birthDate = new Date(birthData.date);
  const [hours, minutes] = birthData.time.split(':').map(Number);
  const timezone = parseFloat(birthData.timezone) || 5.5; // Default to IST
  
  const preciseBirthTime: PreciseBirthTime = {
    year: birthDate.getFullYear(),
    month: birthDate.getMonth() + 1,
    day: birthDate.getDate(),
    hour: hours,
    minute: minutes,
    second: 0,
    timezone
  };
  
  const coordinates: PreciseCoordinates = {
    latitude: birthData.latitude,
    longitude: birthData.longitude
  };
  
  // Calculate Julian Day
  const julianDay = calculateJulianDay(preciseBirthTime);
  
  // Enhanced calculations
  const planets = calculatePlanetaryPositions(julianDay);
  const lagna = calculateAscendant(julianDay, coordinates);
  const houses = calculateHouseCusps(julianDay, coordinates, lagna.longitude);
  const dashas = calculateVimshottariDasha(julianDay, planets.MO.longitude);
  const yogas = calculateAdvancedYogas(planets, houses, lagna);
  
  // Assign planets to houses
  houses.forEach(house => {
    Object.values(planets).forEach(planet => {
      const planetHouse = Math.floor(((planet.rashi - lagna.sign + 12) % 12) + 1);
      if (planetHouse === house.number) {
        house.planetsInHouse.push(planet.name);
      }
    });
  });
  
  // Generate basic chart for compatibility
  const chartData: BirthData = {
    fullName: birthData.fullName,
    date: birthData.date,
    time: birthData.time,
    place: birthData.place,
    latitude: birthData.latitude,
    longitude: birthData.longitude,
    timezone: birthData.timezone
  };
  
  const basicChart = generateKundaliChart(chartData);
  
  // Generate interpretations
  const personality = generatePersonalityAnalysis(planets, lagna, houses, yogas);
  const predictions = generateLifePhasePredictions(planets, lagna, houses, dashas);
  const remedies = generateRemedySuggestions(planets, lagna, yogas);
  const compatibility = generateCompatibilityFactors(planets, lagna, houses);
  
  // Generate additional charts (simplified for now)
  const additionalCharts = {
    navamsa: generateNavamsaChart(planets),
    dashamsa: generateDashamshChart(planets),
    dwadhamsa: generateDwadhamshChart(planets)
  };
  
  return {
    birthData,
    basicChart,
    enhancedCalculations: {
      lagna,
      planets,
      houses,
      dashas,
      yogas,
      ayanamsa: 23.85, // Simplified
      julianDay
    },
    interpretations: {
      personality,
      predictions,
      remedies,
      compatibility
    },
    additionalCharts
  };
}

function generatePersonalityAnalysis(
  planets: Record<string, PlanetaryPosition>,
  lagna: LagnaData,
  houses: HouseData[],
  yogas: YogaDetails[]
): PersonalityAnalysis {
  const sun = planets.SU;
  const moon = planets.MO;
  const mars = planets.MA;
  const mercury = planets.ME;
  
  const coreTraits = [];
  const strengths = [];
  const challenges = [];
  
  // Analyze based on Lagna
  switch (lagna.sign) {
    case 0: // Aries
      coreTraits.push('Dynamic leadership', 'Pioneering spirit', 'High energy');
      strengths.push('Initiative', 'Courage', 'Independence');
      challenges.push('Impatience', 'Impulsiveness');
      break;
    case 1: // Taurus
      coreTraits.push('Stability seeking', 'Practical approach', 'Artistic nature');
      strengths.push('Persistence', 'Reliability', 'Aesthetic sense');
      challenges.push('Stubbornness', 'Resistance to change');
      break;
    // ... continue for all signs
    default:
      coreTraits.push('Unique personality traits');
      strengths.push('Individual strengths');
      challenges.push('Areas for growth');
  }
  
  // Analyze based on Moon sign
  const mentalMakeup = getMentalMakeupFromMoon(moon.rashi);
  
  // Analyze based on benefic yogas
  yogas.forEach(yoga => {
    if (yoga.type === 'benefic' && yoga.isActive) {
      strengths.push(`${yoga.name} brings ${yoga.effects.join(', ')}`);
    }
  });
  
  return {
    coreTraits,
    strengths,
    challenges,
    mentalMakeup,
    physicalAttributes: getPhysicalAttributes(lagna.sign),
    careerAptitude: getCareerAptitude(planets, houses),
    relationshipStyle: getRelationshipStyle(planets.VE.rashi, houses[6]),
    spiritualInclination: getSpiritualInclination(planets.JU.rashi, houses[8])
  };
}

function generateLifePhasePredictions(
  planets: Record<string, PlanetaryPosition>,
  lagna: LagnaData,
  houses: HouseData[],
  dashas: DashaDetails[]
): LifePhasePredictions {
  return {
    childhood: {
      ageRange: '0-16 years',
      generalTrends: ['Foundation building', 'Educational focus', 'Family influence strong'],
      career: ['Academic excellence', 'Talent development', 'Early interests emerge'],
      finance: ['Dependent on family', 'Basic needs fulfilled'],
      relationships: ['Family bonds', 'Friendship formation', 'Early social skills'],
      health: ['Generally good health', 'Building immunity', 'Growth phase'],
      majorEvents: ['Educational milestones', 'Skill development'],
      opportunities: ['Learning opportunities', 'Talent recognition'],
      challenges: ['Academic pressure', 'Social adjustment']
    },
    youth: {
      ageRange: '16-35 years',
      generalTrends: ['Career establishment', 'Independence', 'Major life decisions'],
      career: ['Professional growth', 'Skill enhancement', 'Career changes possible'],
      finance: ['Income growth', 'Investment beginning', 'Financial independence'],
      relationships: ['Romantic relationships', 'Marriage possibilities', 'Social expansion'],
      health: ['Peak physical health', 'Lifestyle establishment'],
      majorEvents: ['Career milestones', 'Marriage', 'Major purchases'],
      opportunities: ['Career advancement', 'Skill development', 'Network building'],
      challenges: ['Career competition', 'Relationship decisions', 'Financial planning']
    },
    adulthood: {
      ageRange: '35-55 years',
      generalTrends: ['Peak career phase', 'Family responsibilities', 'Wealth accumulation'],
      career: ['Leadership roles', 'Business expansion', 'Expert status'],
      finance: ['Wealth peak', 'Investment maturity', 'Property acquisition'],
      relationships: ['Stable partnerships', 'Children focus', 'Social responsibility'],
      health: ['Health awareness needed', 'Preventive care important'],
      majorEvents: ['Business success', 'Property investments', 'Children\'s education'],
      opportunities: ['Leadership opportunities', 'Wealth creation', 'Social impact'],
      challenges: ['Work-life balance', 'Health maintenance', 'Family responsibilities']
    },
    maturity: {
      ageRange: '55+ years',
      generalTrends: ['Wisdom phase', 'Spiritual focus', 'Legacy building'],
      career: ['Mentoring roles', 'Reduced work', 'Advisory positions'],
      finance: ['Wealth preservation', 'Inheritance planning', 'Charitable giving'],
      relationships: ['Grandparent role', 'Deep friendships', 'Community service'],
      health: ['Health focus critical', 'Chronic condition management'],
      majorEvents: ['Retirement', 'Spiritual pursuits', 'Legacy projects'],
      opportunities: ['Spiritual growth', 'Teaching others', 'Social contribution'],
      challenges: ['Health issues', 'Generation gap', 'Technology adaptation']
    }
  };
}

function generateRemedySuggestions(
  planets: Record<string, PlanetaryPosition>,
  lagna: LagnaData,
  yogas: YogaDetails[]
): RemedySuggestions {
  const gemstones: GemstoneRecommendation[] = [];
  const mantras: MantraRecommendation[] = [];
  const charities: CharityRecommendation[] = [];
  const rituals: RitualRecommendation[] = [];
  
  // Find weakest planet for gemstone recommendation
  let weakestPlanet = 'SU';
  let lowestStrength = 100;
  
  Object.entries(planets).forEach(([planetId, planet]) => {
    if (planet.shadbala < lowestStrength) {
      lowestStrength = planet.shadbala;
      weakestPlanet = planetId;
    }
  });
  
  // Recommend gemstone for weakest planet
  const gemstoneMap: Record<string, any> = {
    'SU': { stone: 'Ruby', weight: '3-5 carats', metal: 'Gold', finger: 'Ring', day: 'Sunday' },
    'MO': { stone: 'Pearl', weight: '4-6 carats', metal: 'Silver', finger: 'Little', day: 'Monday' },
    'MA': { stone: 'Red Coral', weight: '5-7 carats', metal: 'Gold/Copper', finger: 'Ring', day: 'Tuesday' },
    'ME': { stone: 'Emerald', weight: '3-5 carats', metal: 'Gold', finger: 'Little', day: 'Wednesday' },
    'JU': { stone: 'Yellow Sapphire', weight: '4-6 carats', metal: 'Gold', finger: 'Index', day: 'Thursday' },
    'VE': { stone: 'Diamond', weight: '1-2 carats', metal: 'Platinum/Gold', finger: 'Middle', day: 'Friday' },
    'SA': { stone: 'Blue Sapphire', weight: '4-6 carats', metal: 'Silver', finger: 'Middle', day: 'Saturday' }
  };
  
  if (gemstoneMap[weakestPlanet]) {
    const gem = gemstoneMap[weakestPlanet];
    gemstones.push({
      stone: gem.stone,
      planet: planets[weakestPlanet].name,
      weight: gem.weight,
      metal: gem.metal,
      finger: gem.finger,
      day: gem.day,
      mantra: `Om ${planets[weakestPlanet].name}aya Namaha`,
      benefits: ['Strengthen planet', 'Improve related life areas', 'Enhance positive qualities']
    });
  }
  
  // Add mantras for all planets
  Object.entries(planets).forEach(([planetId, planet]) => {
    const mantraMap: Record<string, any> = {
      'SU': { mantra: 'Om Suryaya Namaha', count: 7000 },
      'MO': { mantra: 'Om Chandraya Namaha', count: 11000 },
      'MA': { mantra: 'Om Angarakaya Namaha', count: 10000 },
      'ME': { mantra: 'Om Budhaya Namaha', count: 9000 },
      'JU': { mantra: 'Om Brihaspataye Namaha', count: 19000 },
      'VE': { mantra: 'Om Shukraya Namaha', count: 16000 },
      'SA': { mantra: 'Om Shanaye Namaha', count: 23000 }
    };
    
    if (mantraMap[planetId] && planet.shadbala < 60) {
      mantras.push({
        mantra: mantraMap[planetId].mantra,
        planet: planet.name,
        count: mantraMap[planetId].count,
        timing: 'During planet\'s hora',
        duration: '40 days',
        benefits: [`Strengthen ${planet.name}`, 'Remove negative effects', 'Enhance positive qualities']
      });
    }
  });
  
  return {
    gemstones,
    mantras,
    charities,
    rituals,
    lifestyle: [
      {
        category: 'Daily Routine',
        recommendations: ['Wake up early', 'Regular meditation', 'Healthy diet'],
        benefits: ['Improved health', 'Mental clarity', 'Spiritual growth']
      }
    ],
    colors: [
      {
        color: 'Orange/Red',
        planet: 'Sun',
        usage: 'Wear on Sundays',
        benefits: ['Confidence boost', 'Leadership qualities']
      }
    ],
    directions: [
      {
        direction: 'East',
        planet: 'Sun',
        usage: 'Face east during meditation',
        benefits: ['Positive energy', 'Spiritual growth']
      }
    ]
  };
}

function generateCompatibilityFactors(
  planets: Record<string, PlanetaryPosition>,
  lagna: LagnaData,
  houses: HouseData[]
): CompatibilityFactors {
  return {
    marriageCompatibility: {
      idealPartnerTraits: ['Understanding', 'Supportive', 'Compatible values'],
      compatibleSigns: getCompatibleSigns(lagna.sign),
      mangalDoshaStatus: checkMangalDosha(planets, lagna),
      recommendedAge: getRecommendedMarriageAge(planets, houses),
      importantConsiderations: ['Mangal dosha matching', 'Guna matching', 'Family compatibility']
    },
    businessPartnership: {
      idealPartnerTraits: ['Complementary skills', 'Trustworthy', 'Shared vision'],
      suitableBusinessTypes: getSuitableBusinessTypes(planets, houses),
      partnership: ['Equal partnership works well', 'Clear role definition needed'],
      leadership: ['Natural leadership qualities', 'Good decision making']
    },
    friendshipCompatibility: {
      idealFriendTraits: ['Loyal', 'Understanding', 'Supportive'],
      socialBehavior: ['Friendly nature', 'Good communication', 'Helpful attitude'],
      loyaltyFactors: ['Long-term friendships', 'Reliable in crisis', 'Trustworthy']
    }
  };
}

// Helper functions
function getMentalMakeupFromMoon(moonSign: number): string {
  const moonTraits = [
    'Energetic and quick-thinking', 'Stable and practical', 'Curious and communicative',
    'Emotional and intuitive', 'Creative and confident', 'Analytical and perfectionist',
    'Balanced and diplomatic', 'Intense and transformative', 'Philosophical and optimistic',
    'Disciplined and ambitious', 'Innovative and humanitarian', 'Intuitive and spiritual'
  ];
  return moonTraits[moonSign] || 'Balanced mental approach';
}

function getPhysicalAttributes(lagnaSign: number): string[] {
  const attributes = [
    ['Medium height', 'Athletic build', 'Sharp features'],
    ['Sturdy build', 'Beautiful features', 'Pleasant appearance'],
    ['Tall stature', 'Agile body', 'Expressive eyes'],
    ['Medium height', 'Round face', 'Soft features'],
    ['Tall and majestic', 'Strong build', 'Radiant personality'],
    ['Medium height', 'Well-proportioned', 'Refined features'],
    ['Tall and graceful', 'Symmetrical features', 'Charming appearance'],
    ['Medium height', 'Intense eyes', 'Magnetic personality'],
    ['Tall stature', 'Athletic build', 'Open features'],
    ['Medium height', 'Lean build', 'Sharp features'],
    ['Tall height', 'Unique features', 'Attractive personality'],
    ['Medium height', 'Soft features', 'Kind expression']
  ];
  return attributes[lagnaSign] || ['Balanced physical features'];
}

function getCareerAptitude(planets: Record<string, PlanetaryPosition>, houses: HouseData[]): string[] {
  const aptitudes = [];
  
  // Check 10th house for career indications
  const tenthHouse = houses[9]; // 0-indexed
  const tenthHousePlanets = tenthHouse.planetsInHouse;
  
  if (tenthHousePlanets.includes('Sun')) {
    aptitudes.push('Government service', 'Leadership roles', 'Administration');
  }
  if (tenthHousePlanets.includes('Moon')) {
    aptitudes.push('Public dealing', 'Hospitality', 'Healthcare');
  }
  if (tenthHousePlanets.includes('Mars')) {
    aptitudes.push('Engineering', 'Military', 'Sports', 'Technology');
  }
  if (tenthHousePlanets.includes('Mercury')) {
    aptitudes.push('Communication', 'Writing', 'Business', 'Teaching');
  }
  if (tenthHousePlanets.includes('Jupiter')) {
    aptitudes.push('Education', 'Law', 'Finance', 'Counseling');
  }
  if (tenthHousePlanets.includes('Venus')) {
    aptitudes.push('Arts', 'Entertainment', 'Fashion', 'Luxury goods');
  }
  if (tenthHousePlanets.includes('Saturn')) {
    aptitudes.push('Construction', 'Mining', 'Agriculture', 'Social service');
  }
  
  if (aptitudes.length === 0) {
    aptitudes.push('Versatile career options', 'Multi-talented', 'Adaptable to various fields');
  }
  
  return aptitudes;
}

function getRelationshipStyle(venusSign: number, seventhHouse: HouseData): string {
  const styles = [
    'Passionate and direct in relationships',
    'Loyal and committed partner',
    'Communicative and friendly',
    'Nurturing and caring',
    'Generous and romantic',
    'Practical and supportive',
    'Balanced and harmonious',
    'Intense and transformative',
    'Adventurous and freedom-loving',
    'Responsible and committed',
    'Unique and unconventional',
    'Compassionate and understanding'
  ];
  return styles[venusSign] || 'Balanced relationship approach';
}

function getSpiritualInclination(jupiterSign: number, eighthHouse: HouseData): string {
  const inclinations = [
    'Direct spiritual approach, action-oriented practices',
    'Traditional and ritualistic spiritual practices',
    'Intellectual approach to spirituality, study-oriented',
    'Devotional and emotional spiritual connection',
    'Creative and joyful spiritual expression',
    'Practical and service-oriented spirituality',
    'Balanced and harmonious spiritual practices',
    'Deep and transformative spiritual experiences',
    'Philosophical and knowledge-seeking approach',
    'Disciplined and structured spiritual practices',
    'Unique and unconventional spiritual path',
    'Compassionate and universal spiritual outlook'
  ];
  return inclinations[jupiterSign] || 'Balanced spiritual approach';
}

function getCompatibleSigns(lagnaSign: number): string[] {
  const compatibility = [
    ['Leo', 'Sagittarius', 'Gemini', 'Aquarius'], // Aries
    ['Virgo', 'Capricorn', 'Cancer', 'Pisces'], // Taurus
    ['Libra', 'Aquarius', 'Leo', 'Aries'], // Gemini
    ['Scorpio', 'Pisces', 'Virgo', 'Taurus'], // Cancer
    ['Sagittarius', 'Aries', 'Libra', 'Gemini'], // Leo
    ['Capricorn', 'Taurus', 'Scorpio', 'Cancer'], // Virgo
    ['Aquarius', 'Gemini', 'Sagittarius', 'Leo'], // Libra
    ['Pisces', 'Cancer', 'Capricorn', 'Virgo'], // Scorpio
    ['Aries', 'Leo', 'Aquarius', 'Libra'], // Sagittarius
    ['Taurus', 'Virgo', 'Pisces', 'Scorpio'], // Capricorn
    ['Gemini', 'Libra', 'Aries', 'Sagittarius'], // Aquarius
    ['Cancer', 'Scorpio', 'Taurus', 'Capricorn'] // Pisces
  ];
  return compatibility[lagnaSign] || ['Compatible with most signs'];
}

function checkMangalDosha(planets: Record<string, PlanetaryPosition>, lagna: LagnaData): string {
  const mars = planets.MA;
  const marsHouse = Math.floor(((mars.rashi - lagna.sign + 12) % 12) + 1);
  
  if ([1, 4, 7, 8, 12].includes(marsHouse)) {
    return 'Present - requires matching with similar dosha or remedies';
  }
  return 'Absent - no Mangal dosha';
}

function getRecommendedMarriageAge(planets: Record<string, PlanetaryPosition>, houses: HouseData[]): string {
  // Simplified calculation based on 7th house and Venus
  const venus = planets.VE;
  const seventhHouse = houses[6];
  
  if (venus.shadbala > 70 && seventhHouse.planetsInHouse.length > 0) {
    return '23-28 years (favorable period)';
  } else if (venus.shadbala < 50) {
    return '28-32 years (after strengthening Venus)';
  }
  return '25-30 years (normal period)';
}

function getSuitableBusinessTypes(planets: Record<string, PlanetaryPosition>, houses: HouseData[]): string[] {
  const businesses = [];
  const tenthHouse = houses[9];
  
  if (tenthHouse.planetsInHouse.includes('Mercury')) {
    businesses.push('Communication', 'IT', 'Trading', 'Education');
  }
  if (tenthHouse.planetsInHouse.includes('Venus')) {
    businesses.push('Luxury goods', 'Entertainment', 'Fashion', 'Arts');
  }
  if (tenthHouse.planetsInHouse.includes('Jupiter')) {
    businesses.push('Consulting', 'Finance', 'Education', 'Spiritual services');
  }
  if (tenthHouse.planetsInHouse.includes('Mars')) {
    businesses.push('Technology', 'Real estate', 'Manufacturing', 'Sports');
  }
  
  if (businesses.length === 0) {
    businesses.push('Service industry', 'Consulting', 'General business');
  }
  
  return businesses;
}

function generateNavamsaChart(planets: Record<string, PlanetaryPosition>): any {
  // Simplified Navamsa calculation
  const navamsaChart: any = {};
  
  Object.entries(planets).forEach(([planetId, planet]) => {
    const navamsaPosition = (planet.longitude * 9) % 360;
    const navamsaSign = Math.floor(navamsaPosition / 30);
    
    navamsaChart[planetId] = {
      sign: navamsaSign,
      signName: getSignName(navamsaSign),
      longitude: navamsaPosition
    };
  });
  
  return navamsaChart;
}

function generateDashamshChart(planets: Record<string, PlanetaryPosition>): any {
  // Simplified D10 calculation for career
  const dashamshChart: any = {};
  
  Object.entries(planets).forEach(([planetId, planet]) => {
    const dashamshPosition = (planet.longitude * 10) % 360;
    const dashamshSign = Math.floor(dashamshPosition / 30);
    
    dashamshChart[planetId] = {
      sign: dashamshSign,
      signName: getSignName(dashamshSign),
      longitude: dashamshPosition
    };
  });
  
  return dashamshChart;
}

function generateDwadhamshChart(planets: Record<string, PlanetaryPosition>): any {
  // Simplified D12 calculation for parents
  const dwadhamshChart: any = {};
  
  Object.entries(planets).forEach(([planetId, planet]) => {
    const dwadhamshPosition = (planet.longitude * 12) % 360;
    const dwadhamshSign = Math.floor(dwadhamshPosition / 30);
    
    dwadhamshChart[planetId] = {
      sign: dwadhamshSign,
      signName: getSignName(dwadhamshSign),
      longitude: dwadhamshPosition
    };
  });
  
  return dwadhamshChart;
}

function getSignName(index: number): string {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  return signs[index] || 'Unknown';
}
