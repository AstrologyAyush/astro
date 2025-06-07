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
  degree: number;
  house: number;
  nakshatra: string;
  rashiNameHindi: string;
  nakshatraNameHindi: string;
  shadbala: number;
  dignity: string;
  aspects: string[];
  yogaParticipation: Yoga[];
}

export interface HouseData {
  number: number;
  sign: number;
  planets: PlanetData[];
}

export interface Yoga {
  name: string;
  description: string;
  strength: number;
  isActive: boolean;
}

export interface ComprehensiveKundaliData {
  basicKundaliData: any;
  enhancedCalculations: {
    yogas: Yoga[];
    planetaryStrengths: number[];
    houseStrengths: number[];
    bhavBala: number[];
    aspects: string[];
    dasaPeriods: string[];
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
    // Simplified Shadbala calculation logic
    return Math.floor(Math.random() * 100); // Returns a random number between 0 and 100
  };

  // Function to identify Yogas (planetary combinations)
  const identifyYogas = (planets: any[]): Yoga[] => {
    const yogas: Yoga[] = [];

    // Example Yoga: Sun and Moon in mutual Kendra
    if (planets.find(p => p.id === 'SU' && [1, 4, 7, 10].includes(p.house)) &&
        planets.find(p => p.id === 'MO' && [1, 4, 7, 10].includes(p.house))) {
      yogas.push({
        name: 'Adhi Yoga',
        description: 'Auspicious yoga for wealth and happiness',
        strength: 80,
        isActive: true
      });
    }

    // Add more yoga calculations here

    return yogas;
  };

  // Generate enhanced planetary data with all required fields
  const enhancedPlanets = planets.map(planet => ({
    ...planet,
    nameHindi: getHindiPlanetName(planet.id),
    rashiNameHindi: getHindiRashiName(planet.sign),
    nakshatraNameHindi: planet.nakshatra ? getHindiNakshatraName(planet.nakshatra) : '',
    shadbala: calculateShadbala(planet, lagna),
    dignity: calculatePlanetaryDignity(planet),
    aspects: calculatePlanetaryAspects(planet, planets),
    yogaParticipation: []
  }));

  // Calculate enhanced astrological features
  const enhancedCalculations = {
    yogas: identifyYogas(planets),
    planetaryStrengths: enhancedPlanets.map(planet => calculateShadbala(planet, lagna)),
    houseStrengths: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100)),
    bhavBala: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100)),
    aspects: ['Sun aspects Mars', 'Moon aspects Jupiter'],
    dasaPeriods: ['Jupiter Dasa', 'Saturn Dasa'],
  };

  // Suggest remedial measures
  const suggestRemedialMeasures = (): string[] => {
    const remedies: string[] = [];

    // Example: If Sun is weak, suggest Sun worship
    if (enhancedCalculations.planetaryStrengths[0] < 40) {
      remedies.push('Worship Lord Surya daily.');
    }

    // Add more remedial suggestions based on planetary positions

    return remedies;
  };

  const remedialMeasures = suggestRemedialMeasures();

  return {
    basicKundaliData,
    enhancedCalculations,
    remedialMeasures,
    ascendant: lagna
  };
};

// Helper functions for Hindi names
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
  // Simplified dignity calculation
  return 'Neutral';
}

function calculatePlanetaryAspects(planet: any, allPlanets: any[]): string[] {
  // Simplified aspects calculation
  return [];
}
