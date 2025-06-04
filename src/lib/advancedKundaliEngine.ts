
// Enhanced birth data interface
export interface EnhancedBirthData {
  name: string;
  dateOfBirth: Date;
  timeOfBirth: string;
  placeOfBirth: string;
  latitude: number;
  longitude: number;
}

// Planet position interface
export interface PlanetPosition {
  name: string;
  longitude: number;
  sign: string;
  degree: number;
  house: number;
  nakshatra?: string;
  pada?: number;
  isRetrograde: boolean;
  shadbala?: number;
  sanskrit?: string;
  strengthGrade?: string;
  isExalted?: boolean;
  isDebilitated?: boolean;
  isOwnSign?: boolean;
}

// House information
export interface HouseInfo {
  number: number;
  sign: string;
  lord: string;
  cusp: number;
  significance: string[];
}

// Yoga information
export interface YogaInfo {
  name: string;
  description: string;
  effects: string;
  strength: number;
  isPresent: boolean;
}

// Dasha information
export interface Dasha {
  planet: string;
  startDate: Date;
  endDate: Date;
  years: number;
  isActive?: boolean;
  antarDasha?: Dasha[];
}

// Complete Kundali data
export interface KundaliData {
  personalInfo: {
    name: string;
    dateOfBirth: Date;
    timeOfBirth: string;
    placeOfBirth: string;
    coordinates: { latitude: number; longitude: number };
  };
  lagna: {
    sign: string;
    degree: number;
    lord: string;
  };
  planets: PlanetPosition[];
  houses: HouseInfo[];
  yogas: YogaInfo[];
  doshas: any[];
  dashas: Dasha[];
  divisionalCharts: any;
  predictions: {
    ageGroups: {
      [key: string]: {
        period: string;
        generalTrends: string[];
        career: string[];
        relationships: string[];
        health: string[];
        finance: string[];
        remedies: string[];
      };
    };
  };
  remedies: {
    gemstones: string[];
    mantras: string[];
    charity: string[];
    rituals: string[];
  };
  personality: {
    traits: string[];
    strengths: string[];
    weaknesses: string[];
    temperament: string;
  };
}

// Zodiac signs mapping
const zodiacSigns = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Planet names mapping
const planetNames = {
  'Sun': 'Surya',
  'Moon': 'Chandra',
  'Mars': 'Mangal',
  'Mercury': 'Budh',
  'Jupiter': 'Guru',
  'Venus': 'Shukra',
  'Saturn': 'Shani',
  'Rahu': 'Rahu',
  'Ketu': 'Ketu'
};

// Simplified planetary calculations
function calculatePlanetaryPositions(birthData: EnhancedBirthData): PlanetPosition[] {
  // This is a simplified version - in production, use Swiss Ephemeris
  const planets: PlanetPosition[] = [];
  
  // Mock planetary positions for demonstration
  const mockPositions = [
    { name: 'Sun', longitude: 45.5 },
    { name: 'Moon', longitude: 123.7 },
    { name: 'Mars', longitude: 234.2 },
    { name: 'Mercury', longitude: 67.8 },
    { name: 'Jupiter', longitude: 156.3 },
    { name: 'Venus', longitude: 89.1 },
    { name: 'Saturn', longitude: 278.9 },
    { name: 'Rahu', longitude: 198.4 },
    { name: 'Ketu', longitude: 18.4 }
  ];

  mockPositions.forEach(planet => {
    const signIndex = Math.floor(planet.longitude / 30);
    const degreeInSign = planet.longitude % 30;
    
    planets.push({
      name: planet.name,
      longitude: planet.longitude,
      sign: zodiacSigns[signIndex],
      degree: degreeInSign,
      house: Math.floor(Math.random() * 12) + 1,
      isRetrograde: Math.random() > 0.8,
      shadbala: Math.floor(Math.random() * 100),
      sanskrit: planetNames[planet.name as keyof typeof planetNames],
      strengthGrade: Math.random() > 0.5 ? 'Strong' : 'Moderate',
      isExalted: Math.random() > 0.9,
      isDebilitated: Math.random() > 0.9,
      isOwnSign: Math.random() > 0.7
    });
  });

  return planets;
}

// Calculate houses
function calculateHouses(): HouseInfo[] {
  const houses: HouseInfo[] = [];
  
  for (let i = 1; i <= 12; i++) {
    houses.push({
      number: i,
      sign: zodiacSigns[Math.floor(Math.random() * 12)],
      lord: Object.keys(planetNames)[Math.floor(Math.random() * 7)],
      cusp: Math.random() * 360,
      significance: [`House ${i} significance`]
    });
  }
  
  return houses;
}

// Calculate yogas
function calculateYogas(): YogaInfo[] {
  const commonYogas = [
    { name: 'Raja Yoga', description: 'Royal combination for success' },
    { name: 'Dhana Yoga', description: 'Wealth bringing combination' },
    { name: 'Gaja Kesari Yoga', description: 'Moon-Jupiter combination' }
  ];

  return commonYogas.map(yoga => ({
    ...yoga,
    effects: 'Positive effects on life',
    strength: Math.floor(Math.random() * 100),
    isPresent: Math.random() > 0.5
  }));
}

// Calculate dashas
function calculateDashas(birthData: EnhancedBirthData): Dasha[] {
  const dashaPlanets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const dashas: Dasha[] = [];
  
  let currentDate = new Date(birthData.dateOfBirth);
  
  dashaPlanets.forEach((planet, index) => {
    const years = [6, 10, 7, 17, 16, 20, 19][index];
    const endDate = new Date(currentDate);
    endDate.setFullYear(endDate.getFullYear() + years);
    
    dashas.push({
      planet,
      startDate: new Date(currentDate),
      endDate,
      years,
      isActive: index === 0
    });
    
    currentDate = endDate;
  });
  
  return dashas;
}

// Generate age-based predictions
function generateAgePredictions(): any {
  return {
    ageGroups: {
      '0-14': {
        period: 'Childhood & Early Education',
        generalTrends: [
          'Foundation years with focus on education and family bonds',
          'Development of core personality traits and early talents'
        ],
        career: ['Focus on studies and skill development'],
        relationships: ['Strong family connections', 'Early friendships formation'],
        health: ['Generally good health with minor childhood ailments'],
        finance: ['Dependent on family resources'],
        remedies: ['Regular prayers', 'Educational support']
      },
      '15-30': {
        period: 'Youth & Career Building',
        generalTrends: [
          'Period of exploration and career establishment',
          'Important decisions regarding education and life path'
        ],
        career: ['Career foundation', 'Higher education completion', 'First job opportunities'],
        relationships: ['Romantic relationships', 'Marriage possibilities', 'New social circles'],
        health: ['Peak physical health', 'Active lifestyle beneficial'],
        finance: ['Financial independence development', 'Earning potential growth'],
        remedies: ['Career-focused mantras', 'Networking activities']
      },
      '31-45': {
        period: 'Prime Years & Stability',
        generalTrends: [
          'Career peak and financial stability',
          'Family responsibilities and growth'
        ],
        career: ['Leadership roles', 'Business opportunities', 'Professional recognition'],
        relationships: ['Marriage stability', 'Children', 'Family expansion'],
        health: ['Maintain regular health checkups', 'Stress management important'],
        finance: ['Wealth accumulation', 'Investment opportunities', 'Property acquisition'],
        remedies: ['Family-oriented rituals', 'Wealth mantras']
      },
      '46-60': {
        period: 'Maturity & Wisdom',
        generalTrends: [
          'Consolidation of achievements',
          'Mentoring and guiding others'
        ],
        career: ['Senior positions', 'Consultation roles', 'Knowledge sharing'],
        relationships: ['Stable partnerships', 'Children\'s marriages', 'Grandchildren'],
        health: ['Preventive health measures', 'Regular medical monitoring'],
        finance: ['Financial security', 'Retirement planning', 'Legacy building'],
        remedies: ['Spiritual practices', 'Charitable activities']
      },
      '60+': {
        period: 'Golden Years & Spirituality',
        generalTrends: [
          'Focus on spiritual growth and inner peace',
          'Sharing wisdom with younger generations'
        ],
        career: ['Advisory roles', 'Spiritual pursuits', 'Creative expressions'],
        relationships: ['Deeper family bonds', 'Spiritual community', 'Legacy relationships'],
        health: ['Gentle exercise', 'Meditation', 'Holistic health approach'],
        finance: ['Enjoying accumulated wealth', 'Charitable giving', 'Family support'],
        remedies: ['Daily meditation', 'Religious practices', 'Community service']
      }
    }
  };
}

// Main function to generate detailed Kundali
export function generateDetailedKundali(birthData: EnhancedBirthData): KundaliData {
  console.log('Generating detailed Kundali for:', birthData.name);
  
  const planets = calculatePlanetaryPositions(birthData);
  const houses = calculateHouses();
  const yogas = calculateYogas();
  const dashas = calculateDashas(birthData);
  const predictions = generateAgePredictions();

  // Calculate Lagna (Ascendant)
  const lagna = {
    sign: zodiacSigns[Math.floor(Math.random() * 12)],
    degree: Math.random() * 30,
    lord: Object.keys(planetNames)[Math.floor(Math.random() * 7)]
  };

  const kundaliData: KundaliData = {
    personalInfo: {
      name: birthData.name,
      dateOfBirth: birthData.dateOfBirth,
      timeOfBirth: birthData.timeOfBirth,
      placeOfBirth: birthData.placeOfBirth,
      coordinates: {
        latitude: birthData.latitude,
        longitude: birthData.longitude
      }
    },
    lagna,
    planets,
    houses,
    yogas,
    doshas: [], // Will be calculated based on planetary positions
    dashas,
    divisionalCharts: {}, // D9, D10, etc.
    predictions,
    remedies: {
      gemstones: ['Ruby for Sun', 'Pearl for Moon', 'Red Coral for Mars'],
      mantras: ['Om Suryaya Namaha', 'Om Chandraya Namaha'],
      charity: ['Donate food on Sundays', 'Help elderly people'],
      rituals: ['Surya Namaskar daily', 'Ganga Aarti on Mondays']
    },
    personality: {
      traits: ['Ambitious', 'Creative', 'Analytical'],
      strengths: ['Leadership', 'Communication', 'Problem-solving'],
      weaknesses: ['Impatience', 'Perfectionism'],
      temperament: 'Balanced with occasional intensity'
    }
  };

  return kundaliData;
}
