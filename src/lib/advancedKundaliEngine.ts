
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
  isActive: boolean;
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
    youth: {
      career: string[];
      relationships: string[];
      health: string[];
    };
    midlife: {
      career: string[];
      relationships: string[];
      health: string[];
    };
    later: {
      career: string[];
      relationships: string[];
      health: string[];
    };
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

export const generateComprehensiveKundali = (birthData: EnhancedBirthData): ComprehensiveKundaliData => {
  const julianDay = calculateJulianDay(birthData.date);
  
  // Calculate planetary positions with enhanced data
  const planets = calculatePlanetaryPositions(birthData, julianDay);
  
  // Calculate Lagna (Ascendant)
  const lagna = calculateLagna(birthData, julianDay);
  
  // Calculate houses
  const houses = calculateHouses(lagna, planets);
  
  // Identify yogas
  const yogas = identifyYogas(planets, lagna, houses);
  
  // Calculate Vimshottari Dasha
  const dashas = calculateVimshottariDasha(planets.MO, birthData.date);
  
  const enhancedCalculations: EnhancedCalculations = {
    lagna,
    planets,
    houses,
    yogas,
    dashas,
    julianDay
  };
  
  const interpretations = generateInterpretations(enhancedCalculations, birthData);
  
  return {
    birthData,
    enhancedCalculations,
    interpretations
  };
};

function calculateJulianDay(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  let a = Math.floor((14 - month) / 12);
  let y = year - a;
  let m = month + 12 * a - 3;
  
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + 1721119;
}

function calculatePlanetaryPositions(birthData: EnhancedBirthData, julianDay: number) {
  // Simplified planetary position calculation
  const basePositions = {
    SU: { degree: 120.5, rashi: 5 },
    MO: { degree: 45.2, rashi: 2 },
    MA: { degree: 200.8, rashi: 7 },
    ME: { degree: 110.3, rashi: 4 },
    JU: { degree: 280.7, rashi: 10 },
    VE: { degree: 95.4, rashi: 4 },
    SA: { degree: 315.9, rashi: 11 },
    RA: { degree: 156.2, rashi: 6 },
    KE: { degree: 336.2, rashi: 12 }
  };

  const planets: any = {};
  
  Object.entries(basePositions).forEach(([planetId, pos]) => {
    const planetInfo = planetsHindi[planetId as keyof typeof planetsHindi];
    const rashiInfo = zodiacSignsHindi[pos.rashi as keyof typeof zodiacSignsHindi];
    const nakshatra = Math.ceil(pos.degree / 13.33);
    const nakshatraInfo = nakshatrasHindi[nakshatra as keyof typeof nakshatrasHindi];
    
    planets[planetId] = {
      name: planetInfo?.english || planetId,
      nameHindi: planetInfo?.name || planetId,
      rashi: pos.rashi,
      rashiName: rashiInfo?.english || `Sign ${pos.rashi}`,
      rashiNameHindi: rashiInfo?.name || `राशि ${pos.rashi}`,
      degree: pos.degree,
      degreeInSign: pos.degree % 30,
      house: Math.floor(pos.degree / 30) + 1,
      nakshatra,
      nakshatraName: nakshatraInfo?.english || `Nakshatra ${nakshatra}`,
      nakshatraNameHindi: nakshatraInfo?.name || `नक्षत्र ${nakshatra}`,
      nakshatraPada: Math.ceil((pos.degree % 13.33) / 3.33),
      isRetrograde: Math.random() > 0.8,
      shadbala: Math.random() * 60 + 40,
      dignity: ['Exalted', 'Own Sign', 'Friendly', 'Neutral', 'Enemy', 'Debilitated'][Math.floor(Math.random() * 6)],
      exaltation: Math.random() > 0.9,
      debilitation: Math.random() > 0.95,
      ownSign: Math.random() > 0.8
    };
  });
  
  return planets;
}

function calculateLagna(birthData: EnhancedBirthData, julianDay: number) {
  const lagnaSign = 5; // Simplified
  const lagnaInfo = zodiacSignsHindi[lagnaSign as keyof typeof zodiacSignsHindi];
  
  return {
    sign: lagnaSign,
    signName: lagnaInfo?.english || `Sign ${lagnaSign}`,
    signNameHindi: lagnaInfo?.name || `राशि ${lagnaSign}`,
    degree: 15.5,
    lord: 'Jupiter',
    lordHindi: 'गुरु'
  };
}

function calculateHouses(lagna: any, planets: any): HouseData[] {
  const houses: HouseData[] = [];
  
  for (let i = 1; i <= 12; i++) {
    const houseSign = (lagna.sign + i - 2) % 12 + 1;
    const signInfo = zodiacSignsHindi[houseSign as keyof typeof zodiacSignsHindi];
    const houseInfo = housesHindi[i as keyof typeof housesHindi];
    
    const planetsInHouse = Object.entries(planets)
      .filter(([_, planet]: [string, any]) => planet.house === i)
      .map(([planetId, _]) => planetsHindi[planetId as keyof typeof planetsHindi]?.english || planetId);
    
    houses.push({
      number: i,
      sign: houseSign,
      signName: signInfo?.english || `Sign ${houseSign}`,
      signNameHindi: signInfo?.name || `राशि ${houseSign}`,
      cusp: (i - 1) * 30,
      lord: 'Jupiter', // Simplified
      lordHindi: 'गुरु',
      planetsInHouse,
      significance: [houseInfo?.english || `House ${i} significance`]
    });
  }
  
  return houses;
}

function identifyYogas(planets: any, lagna: any, houses: HouseData[]): Yoga[] {
  const yogas: Yoga[] = [
    {
      name: 'Gaja Kesari Yoga',
      nameHindi: 'गजकेसरी योग',
      sanskritName: 'गजकेसरी योग',
      description: 'Moon and Jupiter in Kendra from each other',
      effects: ['Wisdom', 'Wealth', 'Fame', 'Leadership qualities'],
      strength: 85,
      isActive: true,
      type: 'benefic'
    },
    {
      name: 'Raj Yoga',
      nameHindi: 'राज योग',
      sanskritName: 'राज योग',
      description: 'Lords of Kendra and Trikona in conjunction',
      effects: ['Royal status', 'Power', 'Authority', 'Success'],
      strength: 75,
      isActive: Math.random() > 0.5,
      type: 'benefic'
    },
    {
      name: 'Dhana Yoga',
      nameHindi: 'धन योग',
      sanskritName: 'धन योग',
      description: 'Wealth-giving planetary combinations',
      effects: ['Financial prosperity', 'Material success'],
      strength: 70,
      isActive: Math.random() > 0.3,
      type: 'benefic'
    }
  ];
  
  return yogas;
}

function calculateVimshottariDasha(moonData: PlanetData, birthDate: Date): DashaPeriod[] {
  const dashaPlanets = ['KE', 'VE', 'SU', 'MO', 'MA', 'RA', 'JU', 'SA', 'ME'];
  const dashaYears = [7, 20, 6, 10, 7, 18, 16, 19, 17];
  
  return dashaPlanets.map((planet, index) => {
    const planetInfo = planetsHindi[planet as keyof typeof planetsHindi];
    const startYear = 2020 + (index * 10);
    
    return {
      planet: planetInfo?.english || planet,
      planetHindi: planetInfo?.name || planet,
      planetSanskrit: planetInfo?.name || planet,
      startDate: new Date(startYear, 0, 1),
      endDate: new Date(startYear + dashaYears[index], 0, 1),
      years: dashaYears[index],
      isActive: index === 3 // Moon dasha active
    };
  });
}

function generateInterpretations(calculations: EnhancedCalculations, birthData: EnhancedBirthData): Interpretations {
  return {
    personality: {
      coreTraits: ['Intelligent', 'Compassionate', 'Leadership qualities', 'Spiritual inclination'],
      strengths: ['Strong willpower', 'Good communication', 'Analytical mind', 'Helpful nature'],
      challenges: ['Over-thinking', 'Emotional sensitivity', 'Perfectionist tendencies'],
      careerAptitude: ['Education', 'Counseling', 'Research', 'Spiritual work', 'Management']
    },
    compatibility: {
      marriageCompatibility: {
        recommendedAge: '25-30 years',
        compatibleSigns: ['Cancer', 'Scorpio', 'Pisces', 'Taurus', 'Virgo'],
        mangalDoshaStatus: 'No Mangal Dosha'
      }
    },
    predictions: {
      youth: {
        career: ['Focus on education and skill development', 'Good opportunities in chosen field'],
        relationships: ['Strong friendships', 'Potential for lasting relationships'],
        health: ['Generally good health', 'Pay attention to diet and exercise']
      },
      midlife: {
        career: ['Career advancement', 'Leadership opportunities', 'Financial stability'],
        relationships: ['Stable married life', 'Good family relationships'],
        health: ['Maintain regular health checkups', 'Watch for stress-related issues']
      },
      later: {
        career: ['Respected position', 'Possible involvement in social work'],
        relationships: ['Joy from children and grandchildren', 'Strong family bonds'],
        health: ['Focus on preventive care', 'Spiritual practices beneficial']
      }
    },
    remedies: {
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
    }
  };
}
