
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

export interface ComprehensiveKundaliData {
  birthData: BirthData & { fullName: string };
  enhancedCalculations: {
    lagna: {
      signName: string;
      rashiName: string;
      degree: number;
      longitude: number;
    };
    planets: Record<string, {
      rashiName: string;
      nakshatraName: string;
      degree: number;
      longitude: number;
      house: number;
      isRetrograde: boolean;
    }>;
    yogas: Array<{
      name: string;
      isActive: boolean;
      present: boolean;
      strength: number;
      description: string;
    }>;
    dashas: Array<{
      planet: string;
      isActive: boolean;
      startDate: Date;
      endDate: Date;
      duration: number;
    }>;
    houses: Array<{
      number: number;
      rashi: number;
      rashiName: string;
      lord: string;
      planetsInHouse: string[];
    }>;
    accuracy: string;
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
    remedies: {
      gemstones: Array<{
        stone: string;
        weight: string;
      }>;
      mantras: Array<{
        mantra: string;
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
        longitude: preciseKundali.lagna.longitude
      },
      planets: Object.keys(preciseKundali.planets).reduce((acc, planetId) => {
        const planet = preciseKundali.planets[planetId];
        acc[planetId] = {
          rashiName: planet.rashiName,
          nakshatraName: planet.nakshatraName,
          degree: planet.degree,
          longitude: planet.longitude,
          house: planet.house,
          isRetrograde: planet.isRetrograde
        };
        return acc;
      }, {} as Record<string, any>),
      yogas: preciseKundali.yogas.map(yoga => ({
        name: yoga.name,
        isActive: yoga.isActive,
        present: yoga.isActive,
        strength: yoga.strength,
        description: yoga.description
      })),
      dashas: preciseKundali.dashas.map(dasha => ({
        planet: dasha.planet,
        isActive: dasha.isActive,
        startDate: dasha.startDate,
        endDate: dasha.endDate,
        duration: dasha.duration
      })),
      houses: preciseKundali.houses.map(house => ({
        number: house.number,
        rashi: house.rashi,
        rashiName: house.rashiName,
        lord: house.lord,
        planetsInHouse: house.planetsInHouse
      })),
      accuracy: preciseKundali.accuracy
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
    gemstones.push({ stone: 'Ruby', weight: '5-7 carats' });
  }
  if (moon.shadbala < 50) {
    gemstones.push({ stone: 'Pearl', weight: '3-5 carats' });
  }
  
  // Generate mantras
  const mantras = [];
  const activeYogas = kundali.yogas.filter(y => y.isActive);
  if (activeYogas.length > 0) {
    mantras.push({ mantra: 'Om Gam Ganapataye Namaha' });
  }
  mantras.push({ mantra: 'Gayatri Mantra' });
  
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
    remedies: {
      gemstones,
      mantras
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

// Export the existing interface for backward compatibility
export { ComprehensiveKundaliData };
