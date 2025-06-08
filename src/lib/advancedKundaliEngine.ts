
import { 
  VedicBirthData, 
  VedicKundaliResult, 
  generatePreciseVedicKundali
} from './preciseVedicKundaliEngine';

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
    console.log('🚀 Generating advanced Kundali using precise Vedic calculations');
    
    // Convert to precise birth data format
    const preciseData: VedicBirthData = {
      fullName: birthData.fullName,
      date: typeof birthData.date === 'string' ? birthData.date : birthData.date.toISOString().split('T')[0],
      time: birthData.time,
      place: birthData.place,
      latitude: birthData.latitude,
      longitude: birthData.longitude,
      timezone: birthData.timezone || 0
    };
    
    // Generate precise Vedic Kundali
    const preciseKundali = generatePreciseVedicKundali(preciseData);
    
    // Convert to enhanced format for compatibility
    const enhancedCalculations = {
      lagna: {
        signName: preciseKundali.lagna.rashiName,
        rashiName: preciseKundali.lagna.rashiName,
        degree: preciseKundali.lagna.degree,
        longitude: preciseKundali.lagna.longitude,
        sign: preciseKundali.lagna.rashi
      },
      planets: Object.keys(preciseKundali.planets).reduce((acc, planetId) => {
        const planet = preciseKundali.planets[planetId];
        acc[planetId] = {
          name: planet.name,
          rashiName: planet.rashiName,
          nakshatraName: planet.nakshatraName,
          nakshatraPada: planet.nakshatraPada,
          degree: planet.degree,
          degreeInSign: planet.degree,
          longitude: planet.longitude,
          house: planet.house,
          rashi: planet.rashi,
          isRetrograde: planet.isRetrograde,
          shadbala: planet.shadbala,
          dignity: planet.isExalted ? 'Exalted' : planet.isDebilitated ? 'Debilitated' : planet.isOwnSign ? 'Own Sign' : 'Neutral',
          exaltation: planet.isExalted,
          debilitation: planet.isDebilitated,
          ownSign: planet.isOwnSign
        };
        return acc;
      }, {} as Record<string, any>),
      yogas: preciseKundali.yogas.map(yoga => ({
        name: yoga.name,
        sanskritName: yoga.sanskritName,
        isActive: yoga.isActive,
        present: yoga.isActive,
        strength: yoga.strength,
        description: yoga.description,
        effects: yoga.effects,
        type: yoga.type
      })),
      dashas: preciseKundali.dashas.map(dasha => ({
        planet: dasha.planet,
        planetSanskrit: dasha.planetHindi,
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
        cusp: house.cusp,
        significance: house.significations
      })),
      accuracy: preciseKundali.accuracy,
      julianDay: preciseKundali.calculations.julianDay
    };
    
    // Generate interpretations
    const interpretations = generateInterpretations(preciseKundali);
    
    console.log('✅ Advanced Kundali generated with maximum accuracy');
    
    return {
      birthData: {
        ...birthData,
        fullName: birthData.fullName
      },
      enhancedCalculations,
      interpretations
    };
    
  } catch (error) {
    console.error('❌ Error generating advanced Kundali:', error);
    throw new Error('Failed to generate accurate Kundali. Please check your birth details.');
  }
}

// Export as generateComprehensiveKundali for backward compatibility
export const generateComprehensiveKundali = generateAdvancedKundali;

function generateInterpretations(kundali: VedicKundaliResult) {
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
      strengths.push('Natural leadership', 'Courage', 'Initiative', 'Pioneering spirit');
      coreTraits.push('Bold', 'Energetic', 'Independent', 'Action-oriented');
      careerAptitude.push('Leadership roles', 'Sports', 'Military', 'Entrepreneurship');
      challenges.push('Impatience', 'Impulsiveness');
      break;
    case 'Taurus':
      strengths.push('Stability', 'Persistence', 'Practical approach', 'Artistic sense');
      coreTraits.push('Reliable', 'Patient', 'Artistic', 'Material-focused');
      careerAptitude.push('Finance', 'Arts', 'Agriculture', 'Banking');
      challenges.push('Stubbornness', 'Resistance to change');
      break;
    case 'Gemini':
      strengths.push('Communication', 'Adaptability', 'Intelligence', 'Versatility');
      coreTraits.push('Curious', 'Versatile', 'Social', 'Quick-thinking');
      careerAptitude.push('Media', 'Teaching', 'Sales', 'Writing');
      challenges.push('Inconsistency', 'Superficiality');
      break;
    case 'Cancer':
      strengths.push('Emotional intelligence', 'Nurturing nature', 'Intuition', 'Memory');
      coreTraits.push('Caring', 'Protective', 'Sensitive', 'Home-oriented');
      careerAptitude.push('Healthcare', 'Hospitality', 'Real estate', 'Psychology');
      challenges.push('Over-sensitivity', 'Mood swings');
      break;
    case 'Leo':
      strengths.push('Confidence', 'Creativity', 'Natural authority', 'Generosity');
      coreTraits.push('Generous', 'Dramatic', 'Loyal', 'Charismatic');
      careerAptitude.push('Entertainment', 'Management', 'Politics', 'Creative arts');
      challenges.push('Ego issues', 'Attention-seeking');
      break;
    case 'Virgo':
      strengths.push('Attention to detail', 'Analytical skills', 'Service orientation', 'Perfectionism');
      coreTraits.push('Practical', 'Organized', 'Helpful', 'Methodical');
      careerAptitude.push('Research', 'Healthcare', 'Administration', 'Quality control');
      challenges.push('Over-criticism', 'Perfectionism');
      break;
    case 'Libra':
      strengths.push('Diplomacy', 'Aesthetic sense', 'Balance', 'Social skills');
      coreTraits.push('Diplomatic', 'Artistic', 'Social', 'Justice-oriented');
      careerAptitude.push('Law', 'Arts', 'Diplomacy', 'Fashion');
      challenges.push('Indecisiveness', 'People-pleasing');
      break;
    case 'Scorpio':
      strengths.push('Intensity', 'Research ability', 'Transformation', 'Depth');
      coreTraits.push('Intense', 'Mysterious', 'Transformative', 'Investigative');
      careerAptitude.push('Research', 'Investigation', 'Occult sciences', 'Surgery');
      challenges.push('Jealousy', 'Vindictiveness');
      break;
    case 'Sagittarius':
      strengths.push('Optimism', 'Philosophy', 'Adventure', 'Higher learning');
      coreTraits.push('Optimistic', 'Philosophical', 'Adventurous', 'Truth-seeking');
      careerAptitude.push('Teaching', 'Publishing', 'Travel', 'Religion');
      challenges.push('Over-confidence', 'Restlessness');
      break;
    case 'Capricorn':
      strengths.push('Discipline', 'Ambition', 'Responsibility', 'Endurance');
      coreTraits.push('Disciplined', 'Ambitious', 'Practical', 'Status-conscious');
      careerAptitude.push('Administration', 'Government', 'Construction', 'Traditional business');
      challenges.push('Pessimism', 'Rigidity');
      break;
    case 'Aquarius':
      strengths.push('Innovation', 'Humanitarian spirit', 'Independence', 'Future vision');
      coreTraits.push('Innovative', 'Humanitarian', 'Independent', 'Unconventional');
      careerAptitude.push('Technology', 'Social work', 'Science', 'Innovation');
      challenges.push('Detachment', 'Unpredictability');
      break;
    case 'Pisces':
      strengths.push('Compassion', 'Spirituality', 'Imagination', 'Intuition');
      coreTraits.push('Compassionate', 'Spiritual', 'Artistic', 'Intuitive');
      careerAptitude.push('Arts', 'Spirituality', 'Healing', 'Service');
      challenges.push('Over-emotionalism', 'Escapism');
      break;
    default:
      strengths.push('Balanced approach', 'Good judgment');
      coreTraits.push('Thoughtful', 'Diplomatic');
      careerAptitude.push('Consulting', 'Advisory roles');
  }
  
  // Check for doshas
  const mangalDosha = kundali.doshas.find(d => d.name === 'Mangal Dosha');
  const mangalDoshaStatus = mangalDosha?.isPresent ? `Present (${mangalDosha.severity})` : 'Absent';
  
  // Generate gemstone recommendations based on weak planets
  const gemstones = [];
  if (sun.shadbala < 60) {
    gemstones.push({ 
      stone: 'Ruby', 
      weight: '5-7 carats',
      planet: 'Sun',
      metal: 'Gold',
      finger: 'Ring finger',
      day: 'Sunday'
    });
  }
  if (moon.shadbala < 60) {
    gemstones.push({ 
      stone: 'Pearl', 
      weight: '3-5 carats',
      planet: 'Moon',
      metal: 'Silver',
      finger: 'Little finger',
      day: 'Monday'
    });
  }
  
  // Generate mantras based on planetary strengths
  const mantras = [];
  const weakPlanets = Object.values(kundali.planets).filter(p => p.shadbala < 50);
  
  if (weakPlanets.length > 0) {
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

  // Enhanced predictions for different life phases
  const predictions = {
    childhood: {
      ageRange: '0-12 years',
      generalTrends: [
        'Early development influenced by family environment',
        'Natural talents begin to emerge',
        lagna.rashiName === 'Cancer' ? 'Strong emotional bonds with mother' : 'Good family support'
      ],
      career: ['Focus on education and skill development', 'Early signs of natural abilities'],
      relationships: ['Strong bond with family members', 'Childhood friendships form'],
      health: ['Generally good health with proper care', 'Need attention to diet and routine']
    },
    youth: {
      ageRange: '13-25 years',
      generalTrends: [
        'Period of exploration and self-discovery',
        'Important life decisions regarding education and career',
        kundali.yogas.some(y => y.isActive) ? 'Favorable planetary combinations support growth' : 'Steady progress expected'
      ],
      career: ['Educational achievements and career foundation', 'Skills development phase'],
      relationships: ['First romantic relationships and friendships', 'Social circle expansion'],
      health: ['High energy levels, maintain good habits', 'Sports and physical activities beneficial']
    },
    adulthood: {
      ageRange: '26-50 years',
      generalTrends: [
        'Career establishment and family building',
        'Material success opportunities',
        'Prime earning period'
      ],
      career: ['Professional growth and recognition', 'Leadership opportunities'],
      relationships: ['Marriage and family responsibilities', 'Long-term partnerships'],
      health: ['Need to balance work and health', 'Regular health checkups recommended']
    },
    maturity: {
      ageRange: '51+ years',
      generalTrends: [
        'Wisdom and spiritual growth',
        'Mentoring others and sharing knowledge',
        'Focus on legacy building'
      ],
      career: ['Leadership roles and legacy building', 'Consulting and advisory roles'],
      relationships: ['Deeper, more meaningful connections', 'Grandparent role and family elder'],
      health: ['Focus on preventive healthcare', 'Emphasis on mental and spiritual well-being']
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
        { item: 'Water facilities' },
        { item: 'Clothes to the poor' }
      ],
      rituals: [
        { ritual: 'Daily meditation and prayer' },
        { ritual: 'Weekly temple visits' },
        { ritual: 'Monthly charity work' },
        { ritual: 'Annual spiritual pilgrimage' }
      ]
    }
  };
}

function getCompatibleSigns(rashiName: string): string[] {
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
  
  return compatibility[rashiName] || ['Compatible signs based on detailed analysis'];
}
