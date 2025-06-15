import {
  BirthData,
  PlanetPosition,
  Yoga,
  ZODIAC_SIGNS,
  NAKSHATRAS,
  PLANETS,
  degreesToDMS,
  getZodiacDetails,
  getPlanetDetails,
  isPlanetCombust,
  calculatePlanetaryStrength,
  NAKSHATRA_LORDS
} from './kundaliUtils';
import { calculateVimshottariDasha as calculateVimshottariDashaFromEngine, calculateAntardasha, getDashaEffects } from './vimshottariDashaEngine';

export interface EnhancedBirthData extends BirthData {
  dateOfBirth?: Date | string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  name?: string;
}

export interface ComprehensivePlanetData extends PlanetPosition {
  strength: number;
  isCombust: boolean;
  zodiacDetails: {
    name: string;
    element: string;
    quality: string;
    sanskrit: string;
    ruler: string;
  };
  planetDetails: {
    name: string;
    symbol: string;
    element: string;
    sanskrit: string;
  };
}

export interface ComprehensiveHouseData {
  houseNumber: number;
  sign: string;
  lord: string;
  aspects: string[];
  significantPlanets: string[];
}

export interface ComprehensiveYogaData extends Yoga {
  details: string;
  benefits: string[];
  remedies: string[];
}

export interface ComprehensiveNakshatraData {
  planet: string;
  nakshatra: string;
  pada: number;
  lord: string;
}

export interface DashaPeriod {
  planet: string;
  planetSanskrit: string;
  startDate: Date;
  endDate: Date;
  years: number;
  isActive: boolean;
  subDashas?: DashaPeriod[];
}

export interface ComprehensiveKundaliData {
  birthData: EnhancedBirthData;
  planets: Record<string, ComprehensivePlanetData>;
  houses: ComprehensiveHouseData[];
  ascendant: {
    sign: number;
    degree: number;
    nakshatra: string;
    lord: string;
  };
  moonSign: number;
  sunSign: number;
  enhancedCalculations: {
    yogas: ComprehensiveYogaData[];
    nakshatras: ComprehensiveNakshatraData[];
    birthChartAnalysis: string[];
    houseAnalysis: Record<number, string[]>;
    dashaAnalysis: string[];
    planetaryStrengths: Record<string, number>;
    favorablePeriods: string[];
    challengesAndRemedies: string[];
    dashas: DashaPeriod[];
  };
}

function getSignLord(signIndex: number): string {
  const sign = ZODIAC_SIGNS[signIndex - 1];
  return sign?.ruler || 'Unknown';
}

function getNakshatraLord(nakshatraName: string): string {
  const nakshatra = NAKSHATRAS.find(n => n.name === nakshatraName);
  return nakshatra ? nakshatra.ruler : 'Unknown';
}

export function generateAdvancedKundali(birthData: EnhancedBirthData): ComprehensiveKundaliData {
  console.log('🔮 Generating comprehensive Vedic Kundali...');
  console.log('📊 Birth data received:', birthData);

  try {
    // Validate birth data
    if (!birthData.date || !birthData.time || !birthData.latitude || !birthData.longitude) {
      throw new Error('Incomplete birth data. Please provide date, time, latitude, and longitude.');
    }

    // Convert date and time to appropriate formats
    const birthDate = typeof birthData.date === 'string' ? new Date(birthData.date) : birthData.date;
    const [hours, minutes] = birthData.time.split(':').map(Number);
    birthDate.setHours(hours, minutes, 0, 0);

    // Basic calculations (simplified for demonstration)
    const ascendantSign = Math.floor(Math.random() * 12) + 1;
    const ascendantDegree = Math.random() * 30;
    const ascendantNakshatra = NAKSHATRAS[Math.floor(Math.random() * NAKSHATRAS.length)].name;

    const planets: Record<string, ComprehensivePlanetData> = {};
    PLANETS.forEach(planet => {
      const rashi = Math.floor(Math.random() * 12) + 1;
      const degreeInSign = Math.random() * 30;
      const nakshatra = NAKSHATRAS[Math.floor(Math.random() * NAKSHATRAS.length)];
      const longitude = (rashi - 1) * 30 + degreeInSign;

      const zodiacDetails = getZodiacDetails(rashi);
      const planetDetails = getPlanetDetails(planet.id);
      const strength = calculatePlanetaryStrength({
        id: planet.id,
        name: planet.name,
        longitude,
        rashi,
        rashiName: zodiacDetails.name,
        house: Math.floor(Math.random() * 12) + 1,
        sign: rashi,
        degree: longitude,
        degreeInSign,
        nakshatra: nakshatra.id,
        nakshatraName: nakshatra.name,
        nakshatraPada: Math.floor(Math.random() * 4) + 1,
        isRetrograde: Math.random() > 0.5
      });

      planets[planet.id] = {
        id: planet.id,
        name: planet.name,
        longitude,
        rashi,
        rashiName: zodiacDetails.name,
        house: Math.floor(Math.random() * 12) + 1,
        sign: rashi,
        degree: longitude,
        degreeInSign,
        nakshatra: nakshatra.id,
        nakshatraName: nakshatra.name,
        nakshatraPada: Math.floor(Math.random() * 4) + 1,
        isRetrograde: Math.random() > 0.5,
        strength,
        isCombust: isPlanetCombust(
          {
            id: planet.id,
            name: planet.name,
            longitude,
            rashi,
            rashiName: zodiacDetails.name,
            house: Math.floor(Math.random() * 12) + 1,
            sign: rashi,
            degree: longitude,
            degreeInSign,
            nakshatra: nakshatra.id,
            nakshatraName: nakshatra.name,
            nakshatraPada: Math.floor(Math.random() * 4) + 1,
            isRetrograde: Math.random() > 0.5
          },
          {
            id: 'SU',
            name: 'Sun',
            longitude: planets['SU']?.longitude || 0,
            rashi: planets['SU']?.rashi || 1,
            rashiName: planets['SU']?.rashiName || 'Aries',
            house: planets['SU']?.house || 1,
            sign: planets['SU']?.sign || 1,
            degree: planets['SU']?.degree || 0,
            degreeInSign: planets['SU']?.degreeInSign || 0,
            nakshatra: planets['SU']?.nakshatra || 1,
            nakshatraName: planets['SU']?.nakshatraName || 'Ashwini',
            nakshatraPada: planets['SU']?.nakshatraPada || 1,
            isRetrograde: false
          }
        ),
        zodiacDetails,
        planetDetails
      };
    });

    const houses: ComprehensiveHouseData[] = Array.from({ length: 12 }, (_, i) => {
      const houseNumber = i + 1;
      const signIndex = (ascendantSign + i - 1) % 12 + 1;
      return {
        houseNumber,
        sign: ZODIAC_SIGNS[signIndex - 1].name,
        lord: getSignLord(signIndex),
        aspects: ['None'],
        significantPlanets: ['None']
      };
    });

    // Enhanced Dasha Calculations using the consistent engine
    console.log('📅 Calculating enhanced Vimshottari Dasha system...');
    const moonPosition = planets.MO;
    const birthDateForDasha = new Date(birthData.date);
    const dashaCalculations = calculateVimshottariDashaFromEngine(
      birthDateForDasha,
      moonPosition.longitude,
      moonPosition.nakshatra
    );

    const dashas: DashaPeriod[] = dashaCalculations.allMahadashas.map(dasha => ({
      planet: dasha.planet,
      planetSanskrit: dasha.planetHindi,
      startDate: dasha.startDate,
      endDate: dasha.endDate,
      years: dasha.totalYears,
      isActive: dasha.isActive,
      subDashas: dasha.isActive ? calculateAntardasha(dasha).map(antardasha => ({
        planet: antardasha.planet,
        planetSanskrit: antardasha.planetHindi,
        startDate: antardasha.startDate,
        endDate: antardasha.endDate,
        years: antardasha.durationMonths / 12,
        isActive: antardasha.isActive
      })) : undefined
    }));

    // Example yoga calculations
    const yogas: ComprehensiveYogaData[] = [
      {
        name: 'Gaja Kesari Yoga',
        sanskritName: 'गज केसरी योग',
        present: true,
        description: 'Formed when Jupiter is in Kendra from Moon',
        strength: 0.7,
        details: 'Confers wealth, fame, and leadership abilities.',
        benefits: ['Wealth', 'Fame', 'Leadership'],
        remedies: ['Worship Lord Vishnu', 'Donate to educational institutions']
      }
    ];

    // Example birth chart analysis
    const birthChartAnalysis: string[] = [
      'Strong ascendant indicates good health and vitality.',
      'Moon in a favorable position suggests emotional stability.'
    ];

    // Example house analysis
    const houseAnalysis: Record<number, string[]> = {
      1: ['Strong personality', 'Leadership qualities'],
      7: ['Potential for strong partnerships', 'Focus on relationships']
    };

    // Example dasha analysis
    const dashaAnalysis: string[] = [
      'Current dasha indicates a period of growth and learning.',
      'Upcoming dasha may bring challenges in career.'
    ];

    // Example planetary strengths
    const planetaryStrengths: Record<string, number> = {
      SU: planets.SU.strength,
      MO: planets.MO.strength
    };

    // Example favorable periods
    const favorablePeriods: string[] = [
      'Mid-year is favorable for career advancements.',
      'Late months are good for financial investments.'
    ];

    // Example challenges and remedies
    const challengesAndRemedies: string[] = [
      'Potential health issues, practice yoga and meditation.',
      'Relationship conflicts, communicate openly and honestly.'
    ];

    return {
      birthData,
      planets,
      houses,
      ascendant: {
        sign: ascendantSign,
        degree: ascendantDegree,
        nakshatra: ascendantNakshatra,
        lord: getSignLord(ascendantSign)
      },
      moonSign: moonPosition.rashi,
      sunSign: planets.SU.rashi,
      enhancedCalculations: {
        dashas,
        yogas,
        nakshatras: Object.values(planets).map(planet => ({
          planet: planet.name,
          nakshatra: planet.nakshatraName,
          pada: planet.nakshatraPada,
          lord: getNakshatraLord(planet.nakshatra)
        })),
        birthChartAnalysis,
        houseAnalysis,
        dashaAnalysis,
        planetaryStrengths,
        favorablePeriods,
        challengesAndRemedies
      }
    };

  } catch (error) {
    console.error('❌ Error in advanced Kundali generation:', error);
    throw error;
  }
}
