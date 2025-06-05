
import { BirthData, generateKundaliChart, KundaliChart } from './kundaliUtils';

export interface EnhancedBirthData extends BirthData {
  name: string;
  dateOfBirth: Date;
  timeOfBirth: string;
  placeOfBirth: string;
}

export interface PlanetData {
  name: string;
  sign: string;
  house: number;
  degree: number;
  isRetrograde: boolean;
  shadbala?: number;
  sanskrit?: string;
  strengthGrade?: string;
  isExalted?: boolean;
  isDebilitated?: boolean;
  isOwnSign?: boolean;
}

export interface HouseData {
  number: number;
  sign: string;
  lord: string;
  cusp: number;
  significance: string[];
}

export interface YogaData {
  name: string;
  description: string;
  effects: string;
  strength: number;
  isPresent: boolean;
}

export interface DashaData {
  planet: string;
  startDate: Date;
  endDate: Date;
  years: number;
  isActive: boolean;
}

export interface PersonalityData {
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  temperament: string;
}

export interface PredictionData {
  ageGroups: {
    [key: string]: {
      period: string;
      generalTrends: string[];
      career: string[];
      finance: string[];
      relationships: string[];
      health: string[];
      remedies: string[];
    };
  };
}

export interface RemedyData {
  gemstones: string[];
  mantras: string[];
  charity: string[];
  rituals: string[];
}

export interface LagnaData {
  sign: string;
  degree: number;
  lord: string;
}

export interface KundaliData {
  birthData: EnhancedBirthData;
  chart: KundaliChart;
  personalInfo: EnhancedBirthData;
  planets: PlanetData[];
  houses: HouseData[];
  yogas: YogaData[];
  dashas: DashaData[];
  personality: PersonalityData;
  predictions: PredictionData;
  remedies: RemedyData;
  lagna: LagnaData;
  strengthestPlanet: string;
  currentDasha: string;
  lagnaLord: string;
  moonSign: string;
  sunSign: string;
}

// Enhanced planet strength calculation
function calculatePlanetStrengths(chart: KundaliChart): { [key: string]: number } {
  const strengths: { [key: string]: number } = {};
  
  Object.entries(chart.planets).forEach(([planetName, planet]) => {
    let strength = 0;
    
    // Sign strength (own sign = 5, exaltation = 6, debilitation = 1)
    const signStrengthMap: { [key: number]: number } = {
      1: 3, 2: 3, 3: 4, 4: 3, 5: 5, 6: 2,
      7: 4, 8: 2, 9: 4, 10: 3, 11: 4, 12: 3
    };
    
    strength += signStrengthMap[planet.sign] || 3;
    
    // House strength (Kendra houses = stronger)
    const houseNumber = planet.house;
    if ([1, 4, 7, 10].includes(houseNumber)) {
      strength += 3; // Kendra
    } else if ([5, 9].includes(houseNumber)) {
      strength += 2; // Trikona
    } else if ([3, 6, 11].includes(houseNumber)) {
      strength += 1; // Upachaya
    }
    
    // Retrograde consideration
    if (planet.isRetrograde) {
      strength += 1; // Retrograde planets are considered stronger
    }
    
    strengths[planetName] = strength;
  });
  
  return strengths;
}

function findStrongestPlanet(chart: KundaliChart): string {
  const strengths = calculatePlanetStrengths(chart);
  return Object.entries(strengths).reduce((a, b) => strengths[a[0]] > strengths[b[0]] ? a : b)[0];
}

function getCurrentDasha(birthData: EnhancedBirthData): string {
  // Simplified Vimshottari Dasha calculation
  const moonLongitude = 102.23; // This should come from actual moon calculation
  const nakshatra = Math.floor(moonLongitude / (360/27));
  
  const dashaLords = [
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter',
    'Saturn', 'Mercury', 'Ketu', 'Venus', 'Sun', 'Moon', 'Mars',
    'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus',
    'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'
  ];
  
  return dashaLords[nakshatra] || 'Jupiter';
}

function getLagnaLord(chart: KundaliChart): string {
  const ascendantSign = chart.ascendant.sign;
  const signLords: { [key: number]: string } = {
    1: 'Mars', 2: 'Venus', 3: 'Mercury', 4: 'Moon', 5: 'Sun', 6: 'Mercury',
    7: 'Venus', 8: 'Mars', 9: 'Jupiter', 10: 'Saturn', 11: 'Saturn', 12: 'Jupiter'
  };
  return signLords[ascendantSign] || 'Jupiter';
}

function getSignName(signNumber: number): string {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  return signs[signNumber - 1] || 'Unknown';
}

function generateMockData(birthData: EnhancedBirthData, chart: KundaliChart): KundaliData {
  // Generate mock planets data
  const planets: PlanetData[] = [
    { name: 'Sun', sign: 'Leo', house: 5, degree: 15.23, isRetrograde: false, shadbala: 85, strengthGrade: 'Strong' },
    { name: 'Moon', sign: 'Cancer', house: 4, degree: 22.45, isRetrograde: false, shadbala: 78, strengthGrade: 'Good' },
    { name: 'Mars', sign: 'Aries', house: 1, degree: 8.67, isRetrograde: false, shadbala: 90, strengthGrade: 'Excellent' },
    { name: 'Mercury', sign: 'Virgo', house: 6, degree: 12.89, isRetrograde: true, shadbala: 72, strengthGrade: 'Good' },
    { name: 'Jupiter', sign: 'Sagittarius', house: 9, degree: 25.34, isRetrograde: false, shadbala: 88, strengthGrade: 'Excellent' },
    { name: 'Venus', sign: 'Libra', house: 7, degree: 18.56, isRetrograde: false, shadbala: 82, strengthGrade: 'Strong' },
    { name: 'Saturn', sign: 'Capricorn', house: 10, degree: 3.21, isRetrograde: false, shadbala: 75, strengthGrade: 'Good' }
  ];

  // Generate mock houses data
  const houses: HouseData[] = Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    sign: getSignName(((i + chart.ascendant.sign - 1) % 12) + 1),
    lord: ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'][i],
    cusp: i * 30 + Math.random() * 30,
    significance: [`House ${i + 1} represents various life aspects`]
  }));

  // Generate mock yogas
  const yogas: YogaData[] = [
    { name: 'Raj Yoga', description: 'Royal combination for success', effects: 'Leadership and authority', strength: 85, isPresent: true },
    { name: 'Gaj Kesari Yoga', description: 'Moon-Jupiter combination', effects: 'Wisdom and prosperity', strength: 70, isPresent: true },
    { name: 'Panch Mahapurush Yoga', description: 'Great personality yoga', effects: 'Excellence in chosen field', strength: 60, isPresent: false }
  ];

  // Generate mock dashas
  const currentDate = new Date();
  const dashas: DashaData[] = [
    { planet: 'Jupiter', startDate: new Date(currentDate.getFullYear() - 2, 0, 1), endDate: new Date(currentDate.getFullYear() + 14, 0, 1), years: 16, isActive: true },
    { planet: 'Saturn', startDate: new Date(currentDate.getFullYear() + 14, 0, 1), endDate: new Date(currentDate.getFullYear() + 33, 0, 1), years: 19, isActive: false }
  ];

  // Generate personality data
  const personality: PersonalityData = {
    traits: ['Analytical', 'Compassionate', 'Determined', 'Creative'],
    strengths: ['Strong intuition', 'Natural leadership', 'Good communication', 'Spiritual inclination'],
    weaknesses: ['Tendency to overthink', 'Sometimes impatient', 'Can be too critical'],
    temperament: 'Balanced with fiery determination'
  };

  // Generate predictions
  const predictions: PredictionData = {
    ageGroups: {
      '15-30': {
        period: 'Youth and Learning',
        generalTrends: ['Focus on education and skill development', 'Building foundation for career'],
        career: ['Good opportunities in chosen field', 'Possibility of foreign connections'],
        finance: ['Gradual improvement in financial status', 'Investment opportunities'],
        relationships: ['Possibility of meaningful relationships', 'Marriage prospects'],
        health: ['Generally good health', 'Need to maintain work-life balance'],
        remedies: ['Wear yellow sapphire', 'Chant Jupiter mantras']
      },
      '30-50': {
        period: 'Career and Family',
        generalTrends: ['Peak career phase', 'Family responsibilities increase'],
        career: ['Leadership positions possible', 'Business ventures may succeed'],
        finance: ['Significant financial growth', 'Property investments'],
        relationships: ['Stable family life', 'Children bring joy'],
        health: ['Monitor stress levels', 'Regular health checkups needed'],
        remedies: ['Donate to education causes', 'Practice meditation']
      }
    }
  };

  // Generate remedies
  const remedies: RemedyData = {
    gemstones: ['Yellow Sapphire for Jupiter', 'Red Coral for Mars', 'Pearl for Moon'],
    mantras: ['Om Gam Ganapataye Namaha', 'Om Namah Shivaya', 'Gayatri Mantra'],
    charity: ['Donate yellow items on Thursdays', 'Feed cows', 'Support education'],
    rituals: ['Light lamp daily', 'Visit temple regularly', 'Fast on appropriate days']
  };

  return {
    birthData,
    chart,
    personalInfo: birthData,
    planets,
    houses,
    yogas,
    dashas,
    personality,
    predictions,
    remedies,
    lagna: {
      sign: getSignName(chart.ascendant.sign),
      degree: chart.ascendant.degree,
      lord: getLagnaLord(chart)
    },
    strengthestPlanet: findStrongestPlanet(chart),
    currentDasha: getCurrentDasha(birthData),
    lagnaLord: getLagnaLord(chart),
    moonSign: getSignName(chart.planets['Moon']?.sign || 1),
    sunSign: getSignName(chart.planets['Sun']?.sign || 1)
  };
}

export function generateDetailedKundali(birthData: EnhancedBirthData): KundaliData {
  console.log('Generating Kundali with coordinates:', {
    latitude: birthData.latitude,
    longitude: birthData.longitude,
    date: birthData.dateOfBirth,
    time: birthData.timeOfBirth
  });
  
  // Generate the chart using the enhanced birth data with proper coordinates
  const chart = generateKundaliChart(birthData);
  
  // Generate comprehensive kundali data
  return generateMockData(birthData, chart);
}
