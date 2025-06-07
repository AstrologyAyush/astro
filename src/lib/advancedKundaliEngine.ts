
import { 
  PreciseBirthData, 
  PreciseKundaliResult, 
  generatePreciseKundali,
  calculateJulianDay,
  calculateLahiriAyanamsa
} from './preciseKundaliEngine';

export interface BirthData {
  fullName: string;
  date: string | Date;
  time: string;
  place: string;
  latitude: number;
  longitude: number;
  timezone?: number;
}

export interface EnhancedBirthData extends BirthData {
  fullName: string;
}

export interface ComprehensiveKundaliData {
  birthData: BirthData & { fullName: string };
  enhancedCalculations: {
    lagna: {
      signName: string;
      rashiName: string;
      degree: number;
      longitude: number;
      sign: number;
    };
    planets: Record<string, {
      name: string;
      rashiName: string;
      nakshatraName: string;
      nakshatraPada: number;
      degree: number;
      degreeInSign: number;
      longitude: number;
      house: number;
      rashi: number;
      isRetrograde: boolean;
      shadbala: number;
      dignity: string;
      exaltation: boolean;
      debilitation: boolean;
      ownSign: boolean;
    }>;
    yogas: Array<{
      name: string;
      sanskritName: string;
      isActive: boolean;
      present: boolean;
      strength: number;
      description: string;
      effects: string[];
      type: string;
    }>;
    dashas: Array<{
      planet: string;
      planetSanskrit: string;
      isActive: boolean;
      startDate: Date;
      endDate: Date;
      duration: number;
      years: number;
      months?: number;
    }>;
    houses: Array<{
      number: number;
      rashi: number;
      rashiName: string;
      signName: string;
      lord: string;
      planetsInHouse: string[];
      cusp: number;
      significance: string[];
    }>;
    accuracy: string;
    julianDay: number;
  };
  interpretations: {
    personality: {
      strengths: string[];
      challenges: string[];
      coreTraits: string[];
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
      childhood: {
        ageRange: string;
        generalTrends: string[];
        career: string[];
        relationships: string[];
        health: string[];
      };
      youth: {
        ageRange: string;
        generalTrends: string[];
        career: string[];
        relationships: string[];
        health: string[];
      };
      adulthood: {
        ageRange: string;
        generalTrends: string[];
        career: string[];
        relationships: string[];
        health: string[];
      };
      maturity: {
        ageRange: string;
        generalTrends: string[];
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
        day: string;
      }>;
      mantras: Array<{
        mantra: string;
        planet: string;
        count: number;
        duration: string;
      }>;
      charities: Array<{
        item: string;
      }>;
      rituals: Array<{
        ritual: string;
      }>;
    };
  };
}

// Main function to generate enhanced Kundali using precise calculations
export function generateAdvancedKundali(birthData: BirthData): ComprehensiveKundaliData {
  try {
    console.log('Generating advanced Kundali using precise calculations');
    
    // Convert to precise birth data format
    const preciseData: PreciseBirthData = {
      fullName: birthData.fullName,
      date: typeof birthData.date === 'string' ? birthData.date : birthData.date.toISOString().split('T')[0],
      time: birthData.time,
      place: birthData.place,
      latitude: birthData.latitude,
      longitude: birthData.longitude,
      timezone: birthData.timezone || 0
    };
    
    // Generate precise Kundali
    const preciseKundali = generatePreciseKundali(preciseData);
    
    // Convert to enhanced format for compatibility
    const enhancedCalculations = {
      lagna: {
        signName: preciseKundali.lagna.rashiName,
        rashiName: preciseKundali.lagna.rashiName,
        degree: preciseKundali.lagna.degree,
        longitude: preciseKundali.lagna.longitude,
        sign: Math.floor(preciseKundali.lagna.longitude / 30)
      },
      planets: Object.keys(preciseKundali.planets).reduce((acc, planetId) => {
        const planet = preciseKundali.planets[planetId];
        acc[planetId] = {
          name: planet.name,
          rashiName: planet.rashiName,
          nakshatraName: planet.nakshatraName,
          nakshatraPada: planet.nakshatraPada || 1,
          degree: planet.degree,
          degreeInSign: planet.degree % 30,
          longitude: planet.longitude,
          house: planet.house,
          rashi: Math.floor(planet.longitude / 30),
          isRetrograde: planet.isRetrograde,
          shadbala: planet.shadbala || 50,
          dignity: (planet as any).dignity || 'Neutral',
          exaltation: (planet as any).exaltation || false,
          debilitation: (planet as any).debilitation || false,
          ownSign: (planet as any).ownSign || false
        };
        return acc;
      }, {} as Record<string, any>),
      yogas: preciseKundali.yogas.map(yoga => ({
        name: yoga.name,
        sanskritName: (yoga as any).sanskritName || yoga.name,
        isActive: yoga.isActive,
        present: yoga.isActive,
        strength: yoga.strength,
        description: yoga.description,
        effects: (yoga as any).effects || [yoga.description],
        type: (yoga as any).type || 'neutral'
      })),
      dashas: preciseKundali.dashas.map(dasha => ({
        planet: dasha.planet,
        planetSanskrit: (dasha as any).planetSanskrit || dasha.planet,
        isActive: dasha.isActive,
        startDate: dasha.startDate,
        endDate: dasha.endDate,
        duration: dasha.duration,
        years: Math.floor(dasha.duration),
        months: Math.round((dasha.duration - Math.floor(dasha.duration)) * 12)
      })),
      houses: preciseKundali.houses.map(house => ({
        number: house.number,
        rashi: house.rashi,
        rashiName: house.rashiName,
        signName: house.rashiName,
        lord: house.lord,
        planetsInHouse: house.planetsInHouse,
        cusp: (house as any).cusp || 0,
        significance: (house as any).significance || []
      })),
      accuracy: preciseKundali.accuracy,
      julianDay: (preciseKundali as any).julianDay || calculateJulianDay(preciseData.date, preciseData.time)
    };
    
    // Generate interpretations
    const interpretations = generateInterpretations(preciseKundali);
    
    return {
      birthData: {
        ...birthData,
        fullName: birthData.fullName
      },
      enhancedCalculations,
      interpretations
    };
    
  } catch (error) {
    console.error('Error generating advanced Kundali:', error);
    throw new Error('Failed to generate accurate Kundali. Please check your birth details.');
  }
}

// Export as generateComprehensiveKundali for backward compatibility
export const generateComprehensiveKundali = generateAdvancedKundali;

function generateInterpretations(kundali: PreciseKundaliResult) {
  const sun = kundali.planets.SU;
  const moon = kundali.planets.MO;
  const lagna = kundali.lagna;
  
  // Generate personality traits based on placements
  const strengths = [];
  const challenges = [];
  const coreTraits = [];
  const careerAptitude = [];
  
  // Lagna-based traits
  switch (lagna.rashiName) {
    case 'Aries':
      strengths.push('Natural leadership', 'Courage', 'Initiative');
      coreTraits.push('Bold', 'Energetic', 'Independent');
      careerAptitude.push('Leadership roles', 'Sports', 'Military');
      break;
    case 'Taurus':
      strengths.push('Stability', 'Persistence', 'Practical approach');
      coreTraits.push('Reliable', 'Patient', 'Artistic');
      careerAptitude.push('Finance', 'Arts', 'Agriculture');
      break;
    case 'Gemini':
      strengths.push('Communication', 'Adaptability', 'Intelligence');
      coreTraits.push('Curious', 'Versatile', 'Social');
      careerAptitude.push('Media', 'Teaching', 'Sales');
      break;
    case 'Cancer':
      strengths.push('Emotional intelligence', 'Nurturing nature', 'Intuition');
      coreTraits.push('Caring', 'Protective', 'Sensitive');
      careerAptitude.push('Healthcare', 'Hospitality', 'Real estate');
      break;
    case 'Leo':
      strengths.push('Confidence', 'Creativity', 'Natural authority');
      coreTraits.push('Generous', 'Dramatic', 'Loyal');
      careerAptitude.push('Entertainment', 'Management', 'Politics');
      break;
    case 'Virgo':
      strengths.push('Attention to detail', 'Analytical skills', 'Service orientation');
      coreTraits.push('Practical', 'Organized', 'Helpful');
      careerAptitude.push('Research', 'Healthcare', 'Administration');
      break;
    default:
      strengths.push('Balanced approach', 'Good judgment');
      coreTraits.push('Thoughtful', 'Diplomatic');
      careerAptitude.push('Consulting', 'Advisory roles');
  }
  
  // Moon-based emotional traits
  if (moon.isRetrograde) {
    challenges.push('Emotional complexity');
  }
  
  // Check for doshas
  const mangalDosha = kundali.doshas.find(d => d.name === 'Mangal Dosha');
  const mangalDoshaStatus = mangalDosha?.isPresent ? 'Present' : 'Absent';
  
  // Generate gemstone recommendations
  const gemstones = [];
  if (sun.shadbala < 50) {
    gemstones.push({ 
      stone: 'Ruby', 
      weight: '5-7 carats',
      planet: 'Sun',
      metal: 'Gold',
      finger: 'Ring finger',
      day: 'Sunday'
    });
  }
  if (moon.shadbala < 50) {
    gemstones.push({ 
      stone: 'Pearl', 
      weight: '3-5 carats',
      planet: 'Moon',
      metal: 'Silver',
      finger: 'Little finger',
      day: 'Monday'
    });
  }
  
  // Generate mantras
  const mantras = [];
  const activeYogas = kundali.yogas.filter(y => y.isActive);
  if (activeYogas.length > 0) {
    mantras.push({ 
      mantra: 'Om Gam Ganapataye Namaha',
      planet: 'Jupiter',
      count: 108,
      duration: '40 days'
    });
  }
  mantras.push({ 
    mantra: 'Gayatri Mantra',
    planet: 'Sun',
    count: 108,
    duration: 'Daily'
  });

  // Generate predictions for different life phases
  const predictions = {
    childhood: {
      ageRange: '0-12 years',
      generalTrends: ['Early development influenced by family environment', 'Natural talents begin to emerge'],
      career: ['Focus on education and skill development'],
      relationships: ['Strong bond with family members'],
      health: ['Generally good health with proper care']
    },
    youth: {
      ageRange: '13-25 years',
      generalTrends: ['Period of exploration and self-discovery', 'Important life decisions'],
      career: ['Educational achievements and career foundation'],
      relationships: ['First romantic relationships and friendships'],
      health: ['High energy levels, maintain good habits']
    },
    adulthood: {
      ageRange: '26-50 years',
      generalTrends: ['Career establishment and family building', 'Material success opportunities'],
      career: ['Professional growth and recognition'],
      relationships: ['Marriage and family responsibilities'],
      health: ['Need to balance work and health']
    },
    maturity: {
      ageRange: '51+ years',
      generalTrends: ['Wisdom and spiritual growth', 'Mentoring others'],
      career: ['Leadership roles and legacy building'],
      relationships: ['Deeper, more meaningful connections'],
      health: ['Focus on preventive healthcare']
    }
  };
  
  return {
    personality: {
      strengths,
      challenges: challenges.length > 0 ? challenges : ['Minor challenges only'],
      coreTraits,
      careerAptitude
    },
    compatibility: {
      marriageCompatibility: {
        recommendedAge: '25-30 years',
        compatibleSigns: getCompatibleSigns(lagna.rashiName),
        mangalDoshaStatus
      }
    },
    predictions,
    remedies: {
      gemstones,
      mantras,
      charities: [
        { item: 'Food to the needy' },
        { item: 'Books to students' },
        { item: 'Water facilities' }
      ],
      rituals: [
        { ritual: 'Daily meditation and prayer' },
        { ritual: 'Weekly temple visits' },
        { ritual: 'Monthly charity work' }
      ]
    }
  };
}

function getCompatibleSigns(rashiName: string): string[] {
  const compatibility: Record<string, string[]> = {
    'Aries': ['Leo', 'Sagittarius', 'Gemini'],
    'Taurus': ['Virgo', 'Capricorn', 'Cancer'],
    'Gemini': ['Libra', 'Aquarius', 'Aries'],
    'Cancer': ['Scorpio', 'Pisces', 'Taurus'],
    'Leo': ['Aries', 'Sagittarius', 'Gemini'],
    'Virgo': ['Taurus', 'Capricorn', 'Cancer'],
    'Libra': ['Gemini', 'Aquarius', 'Leo'],
    'Scorpio': ['Cancer', 'Pisces', 'Virgo'],
    'Sagittarius': ['Aries', 'Leo', 'Libra'],
    'Capricorn': ['Taurus', 'Virgo', 'Scorpio'],
    'Aquarius': ['Gemini', 'Libra', 'Sagittarius'],
    'Pisces': ['Cancer', 'Scorpio', 'Capricorn']
  };
  
  return compatibility[rashiName] || ['Compatible signs based on detailed analysis'];
}
