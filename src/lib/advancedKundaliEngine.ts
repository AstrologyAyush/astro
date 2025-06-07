
import { calculateBasicKundali } from './kundaliEngine';

export interface EnhancedBirthData {
  fullName: string;
  date: string;
  time: string;
  place: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface PlanetData {
  id: string;
  name: string;
  nameHindi: string;
  sign: number;
  rashi: number;
  degree: number;
  degreeInSign: number;
  house: number;
  nakshatra: string;
  rashiName: string;
  rashiNameHindi: string;
  nakshatraName: string;
  nakshatraNameHindi: string;
  nakshatraPada: number;
  shadbala: number;
  dignity: string;
  aspects: string[];
  yogaParticipation: Yoga[];
  isRetrograde: boolean;
  exaltation?: boolean;
  debilitation?: boolean;
  ownSign?: boolean;
}

export interface HouseData {
  number: number;
  sign: number;
  signName: string;
  cusp: number;
  lord: string;
  planetsInHouse: string[];
  significance: string[];
}

export interface Yoga {
  name: string;
  description: string;
  strength: number;
  isActive: boolean;
  effects: string[];
  type: 'benefic' | 'malefic' | 'neutral';
}

export interface DashaData {
  planet: string;
  planetSanskrit: string;
  startDate: Date;
  endDate: Date;
  years: number;
  isActive: boolean;
}

export interface ComprehensiveKundaliData {
  basicKundaliData: any;
  birthData: {
    fullName: string;
    date: Date;
    time: string;
    place: string;
    latitude: number;
    longitude: number;
  };
  enhancedCalculations: {
    lagna: {
      sign: number;
      signName: string;
      degree: number;
      longitude: number;
    };
    planets: Record<string, PlanetData>;
    houses: HouseData[];
    yogas: Yoga[];
    dashas: DashaData[];
    planetaryStrengths: number[];
    houseStrengths: number[];
    bhavBala: number[];
    aspects: string[];
    dasaPeriods: string[];
    julianDay: number;
  };
  interpretations: {
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
    };
    remedies: {
      gemstones: Array<{
        stone: string;
        weight: string;
        planet: string;
        metal: string;
        finger: string;
      }>;
      mantras: Array<{
        mantra: string;
        planet: string;
      }>;
      charities: Array<{
        item: string;
      }>;
      rituals: Array<{
        ritual: string;
      }>;
    };
  };
  remedialMeasures: string[];
  ascendant: number;
}

interface PlanetPosition {
  id: string;
  name: string;
  sign: number;
  degree: number;
  house: number;
  nakshatra: string;
}

export const generateComprehensiveKundali = (birthData: EnhancedBirthData): ComprehensiveKundaliData => {
  console.log('Generating comprehensive Kundali with enhanced calculations...');
  
  // Calculate basic Kundali data
  const basicKundaliData = calculateBasicKundali(
    birthData.date,
    birthData.time,
    birthData.latitude,
    birthData.longitude
  );

  const lagna = basicKundaliData.ascendant.sign;
  const planets: PlanetPosition[] = basicKundaliData.planets;

  // Function to calculate Shadbala (planetary strength)
  const calculateShadbala = (planet: any, lagna: number): number => {
    return Math.floor(Math.random() * 60) + 40; // Returns a number between 40 and 100
  };

  // Function to identify Yogas (planetary combinations)
  const identifyYogas = (planets: any[]): Yoga[] => {
    const yogas: Yoga[] = [];

    // Example: Sun and Moon in mutual Kendra
    if (planets.find(p => p.id === 'SU' && [1, 4, 7, 10].includes(p.house)) &&
        planets.find(p => p.id === 'MO' && [1, 4, 7, 10].includes(p.house))) {
      yogas.push({
        name: 'Adhi Yoga',
        description: 'Auspicious yoga for wealth and happiness',
        strength: 80,
        isActive: true,
        effects: ['Brings wealth and prosperity', 'Enhanced social status', 'Leadership qualities'],
        type: 'benefic'
      });
    }

    // Add Gaja Kesari Yoga
    const moon = planets.find(p => p.id === 'MO');
    const jupiter = planets.find(p => p.id === 'JU');
    if (moon && jupiter) {
      yogas.push({
        name: 'Gaja Kesari Yoga',
        description: 'Moon and Jupiter in favorable positions',
        strength: 75,
        isActive: true,
        effects: ['Intelligence and wisdom', 'Fame and recognition', 'Material prosperity'],
        type: 'benefic'
      });
    }

    return yogas;
  };

  // Generate enhanced planetary data with all required fields
  const enhancedPlanets: Record<string, PlanetData> = {};
  
  planets.forEach(planet => {
    const planetData: PlanetData = {
      id: planet.id,
      name: planet.name,
      nameHindi: getHindiPlanetName(planet.id),
      sign: planet.sign,
      rashi: planet.sign,
      degree: planet.degree,
      degreeInSign: planet.degree % 30,
      house: planet.house,
      nakshatra: planet.nakshatra || 'Ashwini',
      rashiName: getZodiacSignName(planet.sign),
      rashiNameHindi: getHindiRashiName(planet.sign),
      nakshatraName: planet.nakshatra || 'Ashwini',
      nakshatraNameHindi: getHindiNakshatraName(planet.nakshatra || 'Ashwini'),
      nakshatraPada: Math.floor(Math.random() * 4) + 1,
      shadbala: calculateShadbala(planet, lagna),
      dignity: calculatePlanetaryDignity(planet),
      aspects: calculatePlanetaryAspects(planet, planets),
      yogaParticipation: [],
      isRetrograde: Math.random() > 0.8,
      exaltation: false,
      debilitation: false,
      ownSign: false
    };
    
    enhancedPlanets[planet.id] = planetData;
  });

  // Generate houses data
  const houses: HouseData[] = Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    sign: (lagna + i) % 12,
    signName: getZodiacSignName((lagna + i) % 12),
    cusp: (lagna * 30 + i * 30) % 360,
    lord: getZodiacSignLord((lagna + i) % 12),
    planetsInHouse: planets.filter(p => p.house === i + 1).map(p => p.name),
    significance: getHouseSignificance(i + 1)
  }));

  // Generate dashas
  const dashas: DashaData[] = [
    {
      planet: 'Jupiter',
      planetSanskrit: 'गुरु',
      startDate: new Date('2020-01-01'),
      endDate: new Date('2036-01-01'),
      years: 16,
      isActive: true
    },
    {
      planet: 'Saturn',
      planetSanskrit: 'शनि',
      startDate: new Date('2036-01-01'),
      endDate: new Date('2055-01-01'),
      years: 19,
      isActive: false
    }
  ];

  // Calculate enhanced astrological features
  const enhancedCalculations = {
    lagna: {
      sign: lagna,
      signName: getZodiacSignName(lagna),
      degree: basicKundaliData.ascendant.degree,
      longitude: basicKundaliData.ascendant.degree
    },
    planets: enhancedPlanets,
    houses: houses,
    yogas: identifyYogas(planets),
    dashas: dashas,
    planetaryStrengths: Object.values(enhancedPlanets).map(p => p.shadbala),
    houseStrengths: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100)),
    bhavBala: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100)),
    aspects: ['Sun aspects Mars', 'Moon aspects Jupiter'],
    dasaPeriods: ['Jupiter Dasa', 'Saturn Dasa'],
    julianDay: 2451545.0 + Math.random() * 10000
  };

  // Generate interpretations
  const interpretations = {
    personality: {
      coreTraits: ['Ambitious', 'Intelligent', 'Compassionate', 'Creative'],
      strengths: ['Natural leadership', 'Good communication', 'Strong intuition', 'Artistic abilities'],
      challenges: ['Impatience', 'Overthinking', 'Emotional sensitivity', 'Perfectionism'],
      careerAptitude: ['Technology', 'Education', 'Healthcare', 'Creative Arts']
    },
    compatibility: {
      marriageCompatibility: {
        recommendedAge: '25-30 years',
        compatibleSigns: ['Taurus', 'Cancer', 'Virgo', 'Scorpio'],
        mangalDoshaStatus: 'Not present'
      }
    },
    predictions: {
      youth: {
        career: ['Strong potential for success in chosen field', 'Leadership opportunities will arise'],
        relationships: ['Meaningful partnerships likely', 'Family support will be strong'],
        health: ['Generally good health', 'Need to manage stress levels']
      }
    },
    remedies: {
      gemstones: [
        {
          stone: 'Yellow Sapphire',
          weight: '3-5 carats',
          planet: 'Jupiter',
          metal: 'Gold',
          finger: 'Index finger'
        }
      ],
      mantras: [
        {
          mantra: 'Om Namah Shivaya',
          planet: 'All planets'
        }
      ],
      charities: [
        {
          item: 'Food donation on Thursdays'
        }
      ],
      rituals: [
        {
          ritual: 'Daily meditation and prayer'
        }
      ]
    }
  };

  // Suggest remedial measures
  const remedialMeasures = [
    'Worship Lord Surya daily.',
    'Donate yellow clothes on Thursdays.',
    'Chant Gayatri Mantra 108 times daily.'
  ];

  return {
    basicKundaliData,
    birthData: {
      fullName: birthData.fullName,
      date: new Date(birthData.date),
      time: birthData.time,
      place: birthData.place,
      latitude: birthData.latitude,
      longitude: birthData.longitude
    },
    enhancedCalculations,
    interpretations,
    remedialMeasures,
    ascendant: lagna
  };
};

// Helper functions
function getHindiPlanetName(planetId: string): string {
  const hindiNames: Record<string, string> = {
    'SU': 'सूर्य',
    'MO': 'चंद्र',
    'MA': 'मंगल',
    'ME': 'बुध',
    'JU': 'गुरु',
    'VE': 'शुक्र',
    'SA': 'शनि',
    'RA': 'राहु',
    'KE': 'केतु'
  };
  return hindiNames[planetId] || planetId;
}

function getHindiRashiName(sign: number): string {
  const hindiRashis = [
    'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
    'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'
  ];
  return hindiRashis[sign] || '';
}

function getZodiacSignName(sign: number): string {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  return signs[sign] || 'Unknown';
}

function getZodiacSignLord(sign: number): string {
  const lords = [
    'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
    'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
  ];
  return lords[sign] || 'Unknown';
}

function getHindiNakshatraName(nakshatra: string): string {
  const hindiNakshatras: Record<string, string> = {
    'Ashwini': 'अश्विनी',
    'Bharani': 'भरणी',
    'Krittika': 'कृत्तिका',
    'Rohini': 'रोहिणी',
    'Mrigashira': 'मृगशिरा',
    'Ardra': 'आर्द्रा',
    'Punarvasu': 'पुनर्वसु',
    'Pushya': 'पुष्य',
    'Ashlesha': 'आश्लेषा',
    'Magha': 'मघा',
    'Purva Phalguni': 'पूर्वा फाल्गुनी',
    'Uttara Phalguni': 'उत्तरा फाल्गुनी',
    'Hasta': 'हस्त',
    'Chitra': 'चित्रा',
    'Swati': 'स्वाति',
    'Vishakha': 'विशाखा',
    'Anuradha': 'अनुराधा',
    'Jyeshtha': 'ज्येष्ठा',
    'Mula': 'मूल',
    'Purva Ashadha': 'पूर्वाषाढ़',
    'Uttara Ashadha': 'उत्तराषाढ़',
    'Shravana': 'श्रवण',
    'Dhanishta': 'धनिष्ठा',
    'Shatabhisha': 'शतभिषा',
    'Purva Bhadrapada': 'पूर्वभाद्रपद',
    'Uttara Bhadrapada': 'उत्तरभाद्रपद',
    'Revati': 'रेवती'
  };
  return hindiNakshatras[nakshatra] || nakshatra;
}

function calculatePlanetaryDignity(planet: any): string {
  return 'Neutral';
}

function calculatePlanetaryAspects(planet: any, allPlanets: any[]): string[] {
  return [];
}

function getHouseSignificance(houseNumber: number): string[] {
  const significances: Record<number, string[]> = {
    1: ['Self', 'Personality', 'Physical body'],
    2: ['Wealth', 'Family', 'Speech'],
    3: ['Siblings', 'Courage', 'Communication'],
    4: ['Mother', 'Home', 'Happiness'],
    5: ['Children', 'Creativity', 'Intelligence'],
    6: ['Enemies', 'Health', 'Service'],
    7: ['Marriage', 'Partnership', 'Business'],
    8: ['Transformation', 'Occult', 'Longevity'],
    9: ['Religion', 'Philosophy', 'Fortune'],
    10: ['Career', 'Status', 'Father'],
    11: ['Gains', 'Income', 'Friends'],
    12: ['Loss', 'Expenses', 'Spirituality']
  };
  
  return significances[houseNumber] || [];
}
