import { zodiacSignsHindi, nakshatrasHindi, planetsHindi } from './zodiacMappings';

export interface EnhancedBirthData {
  fullName: string;
  date: string;
  time: string;
  place: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface ComprehensiveKundaliData {
  birthData: EnhancedBirthData;
  enhancedCalculations: {
    lagna: {
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
    yogas: Yoga[];
    dashas: {
      currentMahadasha: DashaPeriod;
      currentAntardasha: DashaPeriod;
    };
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
    remedies: {
      gemstones: { stone: string; weight: string; metal: string; day: string }[];
      mantras: { mantra: string; count: number; timing: string }[];
      charity: string[];
    };
  };
}

interface PlanetData {
  rashiName: string;
  rashiNameHindi: string;
  degree: number;
  house: number;
  nakshatraName: string;
  nakshatraNameHindi: string;
  planetHindi: string;
}

interface Yoga {
  name: string;
  nameHindi: string;
  isActive: boolean;
  strength: number;
  description: string;
}

interface DashaPeriod {
  planet: string;
  planetHindi: string;
  startDate: string;
  endDate: string;
  years: number;
}

export const generateComprehensiveKundali = (birthData: EnhancedBirthData): ComprehensiveKundaliData => {
  console.log('Generating comprehensive Kundali for:', birthData.fullName);
  
  const enhancedCalculations = {
    lagna: {
      signName: zodiacSignsHindi[Math.floor(Math.random() * 12) + 1].english,
      signNameHindi: zodiacSignsHindi[Math.floor(Math.random() * 12) + 1].name,
      degree: Math.random() * 30,
      lord: 'Mars',
      lordHindi: planetsHindi.MA.name
    },
    planets: {
      SU: {
        rashiName: zodiacSignsHindi[Math.floor(Math.random() * 12) + 1].english,
        rashiNameHindi: zodiacSignsHindi[Math.floor(Math.random() * 12) + 1].name,
        degree: Math.random() * 30,
        house: Math.floor(Math.random() * 12) + 1,
        nakshatraName: nakshatrasHindi[Math.floor(Math.random() * 27) + 1].english,
        nakshatraNameHindi: nakshatrasHindi[Math.floor(Math.random() * 27) + 1].name,
        planetHindi: planetsHindi.SU.name
      },
      MO: {
        rashiName: zodiacSignsHindi[Math.floor(Math.random() * 12) + 1].english,
        rashiNameHindi: zodiacSignsHindi[Math.floor(Math.random() * 12) + 1].name,
        degree: Math.random() * 30,
        house: Math.floor(Math.random() * 12) + 1,
        nakshatraName: nakshatrasHindi[Math.floor(Math.random() * 27) + 1].english,
        nakshatraNameHindi: nakshatrasHindi[Math.floor(Math.random() * 27) + 1].name,
        planetHindi: planetsHindi.MO.name
      },
      MA: {
        rashiName: zodiacSignsHindi[Math.floor(Math.random() * 12) + 1].english,
        rashiNameHindi: zodiacSignsHindi[Math.floor(Math.random() * 12) + 1].name,
        degree: Math.random() * 30,
        house: Math.floor(Math.random() * 12) + 1,
        nakshatraName: nakshatrasHindi[Math.floor(Math.random() * 27) + 1].english,
        nakshatraNameHindi: nakshatrasHindi[Math.floor(Math.random() * 27) + 1].name,
        planetHindi: planetsHindi.MA.name
      },
      ME: {
        rashiName: zodiacSignsHindi[Math.floor(Math.random() * 12) + 1].english,
        rashiNameHindi: zodiacSignsHindi[Math.floor(Math.random() * 12) + 1].name,
        degree: Math.random() * 30,
        house: Math.floor(Math.random() * 12) + 1,
        nakshatraName: nakshatrasHindi[Math.floor(Math.random() * 27) + 1].english,
        nakshatraNameHindi: nakshatrasHindi[Math.floor(Math.random() * 27) + 1].name,
        planetHindi: planetsHindi.ME.name
      },
      JU: {
        rashiName: zodiacSignsHindi[Math.floor(Math.random() * 12) + 1].english,
        rashiNameHindi: zodiacSignsHindi[Math.floor(Math.random() * 12) + 1].name,
        degree: Math.random() * 30,
        house: Math.floor(Math.random() * 12) + 1,
        nakshatraName: nakshatrasHindi[Math.floor(Math.random() * 27) + 1].english,
        nakshatraNameHindi: nakshatrasHindi[Math.floor(Math.random() * 27) + 1].name,
        planetHindi: planetsHindi.JU.name
      },
      VE: {
        rashiName: zodiacSignsHindi[Math.floor(Math.random() * 12) + 1].english,
        rashiNameHindi: zodiacSignsHindi[Math.floor(Math.random() * 12) + 1].name,
        degree: Math.random() * 30,
        house: Math.floor(Math.random() * 12) + 1,
        nakshatraName: nakshatrasHindi[Math.floor(Math.random() * 27) + 1].english,
        nakshatraNameHindi: nakshatrasHindi[Math.floor(Math.random() * 27) + 1].name,
        planetHindi: planetsHindi.VE.name
      },
      SA: {
        rashiName: zodiacSignsHindi[Math.floor(Math.random() * 12) + 1].english,
        rashiNameHindi: zodiacSignsHindi[Math.floor(Math.random() * 12) + 1].name,
        degree: Math.random() * 30,
        house: Math.floor(Math.random() * 12) + 1,
        nakshatraName: nakshatrasHindi[Math.floor(Math.random() * 27) + 1].english,
        nakshatraNameHindi: nakshatrasHindi[Math.floor(Math.random() * 27) + 1].name,
        planetHindi: planetsHindi.SA.name
      },
      RA: {
        rashiName: zodiacSignsHindi[Math.floor(Math.random() * 12) + 1].english,
        rashiNameHindi: zodiacSignsHindi[Math.floor(Math.random() * 12) + 1].name,
        degree: Math.random() * 30,
        house: Math.floor(Math.random() * 12) + 1,
        nakshatraName: nakshatrasHindi[Math.floor(Math.random() * 27) + 1].english,
        nakshatraNameHindi: nakshatrasHindi[Math.floor(Math.random() * 27) + 1].name,
        planetHindi: planetsHindi.RA.name
      },
      KE: {
        rashiName: zodiacSignsHindi[Math.floor(Math.random() * 12) + 1].english,
        rashiNameHindi: zodiacSignsHindi[Math.floor(Math.random() * 12) + 1].name,
        degree: Math.random() * 30,
        house: Math.floor(Math.random() * 12) + 1,
        nakshatraName: nakshatrasHindi[Math.floor(Math.random() * 27) + 1].english,
        nakshatraNameHindi: nakshatrasHindi[Math.floor(Math.random() * 27) + 1].name,
        planetHindi: planetsHindi.KE.name
      }
    },
    yogas: [
      { name: 'Gaja Kesari Yoga', nameHindi: 'गजकेसरी योग', isActive: true, strength: 85, description: 'Moon and Jupiter in favorable position' },
      { name: 'Raj Yoga', nameHindi: 'राज योग', isActive: true, strength: 75, description: 'Combination for royal status' },
      { name: 'Dhana Yoga', nameHindi: 'धन योग', isActive: false, strength: 45, description: 'Wealth combination' },
      { name: 'Panch Mahapurusha Yoga', nameHindi: 'पंच महापुरुष योग', isActive: true, strength: 80, description: 'Great personality yoga' }
    ],
    dashas: {
      currentMahadasha: {
        planet: 'Jupiter',
        planetHindi: 'गुरु',
        startDate: '2020-01-01',
        endDate: '2036-01-01',
        years: 16
      },
      currentAntardasha: {
        planet: 'Saturn',
        planetHindi: 'शनि',
        startDate: '2024-01-01',
        endDate: '2026-09-01'
      }
    }
  };

  const result: ComprehensiveKundaliData = {
    birthData,
    enhancedCalculations,
    interpretations: {
      personality: {
        coreTraits: ['Ambitious', 'Intelligent', 'Spiritual', 'Hardworking'],
        strengths: ['Leadership qualities', 'Good communication', 'Analytical mind'],
        challenges: ['Impatience', 'Overthinking', 'Stress management'],
        careerAptitude: ['Technology', 'Finance', 'Education', 'Healthcare']
      },
      compatibility: {
        marriageCompatibility: {
          recommendedAge: '25-30 years',
          compatibleSigns: ['Taurus', 'Virgo', 'Capricorn'],
          mangalDoshaStatus: 'No Mangal Dosha'
        }
      },
      remedies: {
        gemstones: [
          { stone: 'Yellow Sapphire', weight: '3-5 carats', metal: 'Gold', day: 'Thursday' }
        ],
        mantras: [
          { mantra: 'Om Brihaspateye Namaha', count: 108, timing: 'Thursday morning' }
        ],
        charity: ['Donate yellow items on Thursday', 'Feed Brahmins', 'Donate books']
      }
    }
  };

  console.log('Generated comprehensive Kundali successfully');
  return result;
};
