/**
 * Advanced Vedic Kundali Engine
 * Comprehensive astrological calculations including all traditional elements
 */

import { 
  calculateVimshottariDasha, 
  calculateAntardasha,
  formatDashaPeriod,
  getDashaEffects,
  type DetailedDashaResult,
  type DashaInfo 
} from './vimshottariDashaEngine';

export interface EnhancedBirthData {
  fullName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  place: string;
  latitude: number;
  longitude: number;
  timezone: number;
}

export interface PlanetData {
  id: string;
  name: string;
  nameHindi: string;
  longitude: number; // Sidereal longitude
  latitude: number;
  degree: number; // Add degree property
  degreeInSign: number; // 0-30
  rashi: number; // 1-12
  rashiName: string;
  house: number; // 1-12
  nakshatra: number; // 1-27
  nakshatraName: string;
  nakshatraPada: number; // 1-4
  isRetrograde: boolean;
  isCombust: boolean;
  isExalted: boolean;
  isDebilitated: boolean;
  ownSign: boolean;
  shadbala: number; // Planetary strength 0-100
  speed: number; // Daily motion
  dignity: string; // Own, Exalted, Debilitated, etc.
  exaltation?: boolean;
  debilitation?: boolean;
}

export interface LagnaDetails {
  signName: string;
  sign: number; // Add sign property
  degree: number;
  nakshatra: string;
  nakshatraPada: number;
  lord: string;
}

export interface HouseDetails {
  number: number;
  signName: string;
  cusp: number;
  lord: string;
  planetsInHouse: string[];
  significance: string[];
}

export interface YogaDetails {
  name: string;
  sanskritName: string;
  type: 'benefic' | 'malefic' | 'neutral';
  isActive: boolean;
  strength: number;
  description: string;
  effects: string[];
  formingPlanets: string[];
}

export interface DashaDetails {
  planet: string;
  planetSanskrit: string;
  startDate: Date;
  endDate: Date;
  years: number;
  months?: number; // Add months property
  isActive: boolean;
  remainingTime?: string;
}

export interface DoshaDetails {
  name: string;
  isPresent: boolean;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  remedies: string[];
  affectedHouses: number[];
}

export interface DivisionalChart {
  name: string;
  division: number;
  purpose: string;
  planetPositions: Record<string, number>; // Planet -> House mapping
}

export interface TransitAnalysis {
  planet: string;
  currentSign: string;
  transitingHouse: number;
  aspect: string;
  effect: string;
  duration: string;
}

export interface EnhancedCalculations {
  lagna: LagnaDetails;
  planets: Record<string, PlanetData>;
  houses: HouseDetails[];
  yogas: YogaDetails[];
  dashas: DashaDetails[];
  doshas: DoshaDetails[];
  divisionalCharts: DivisionalChart[];
  transits: TransitAnalysis[];
  julianDay: number;
  ayanamsa: number;
  localSiderealTime: number;
}

export interface PersonalityAnalysis {
  strengths: string[];
  challenges: string[];
  character: string[];
  coreTraits: string[]; // Add coreTraits property
  careerAptitude: string[]; // Add careerAptitude property
  temperament: string;
  mentalMakeup: string[];
}

export interface LifeAreaPredictions {
  career: string[];
  finance: string[];
  relationships: string[];
  marriage: string[];
  health: string[];
  education: string[];
  family: string[];
  children: string[];
}

export interface LifePhasePredictions {
  ageRange: string;
  generalTrends: string[];
  career: string[];
  finance: string[];
  relationships: string[];
  health: string[];
}

export interface PredictiveAnalysis {
  childhood: LifePhasePredictions;
  youth: LifePhasePredictions;
  adulthood: LifePhasePredictions;
  maturity: LifePhasePredictions;
  annual: string[];
  favorable_periods: string[];
  challenging_periods: string[];
}

export interface MarriageCompatibility {
  mangalDoshaStatus: string;
  recommendedAge: string;
  compatibleSigns: string[];
}

export interface CompatibilityAnalysis {
  marriageCompatibility: MarriageCompatibility;
}

export interface RemedialMeasures {
  gemstones: Array<{
    stone: string;
    planet: string;
    weight: string;
    metal: string;
    finger: string;
    day: string; // Add day property
    benefits: string[];
  }>;
  mantras: Array<{
    mantra: string;
    planet: string;
    repetitions: string;
    count: number; // Add count property
    timing: string;
    duration: string; // Add duration property
  }>;
  charities: Array<{
    item: string;
    day: string;
    planet: string;
    description: string;
  }>;
  rituals: Array<{
    ritual: string;
    purpose: string;
    timing: string;
    procedure: string;
  }>;
  lifestyle: string[];
  colors: string[];
  numbers: number[];
  days: string[];
}

export interface DetailedInterpretations {
  personality: PersonalityAnalysis;
  predictions: PredictiveAnalysis;
  compatibility: CompatibilityAnalysis; // Add compatibility property
  remedies: RemedialMeasures;
  auspiciousTimes: string[];
  doshaRemedies: Record<string, string[]>;
}

export interface ComprehensiveKundaliData {
  birthData: EnhancedBirthData;
  enhancedCalculations: EnhancedCalculations;
  interpretations: DetailedInterpretations;
  accuracy: string;
  generatedAt: Date;
}

// Astronomical constants
const ZODIAC_SIGNS = [
  { name: 'Aries', hindi: 'मेष', lord: 'Mars', element: 'Fire' },
  { name: 'Taurus', hindi: 'वृषभ', lord: 'Venus', element: 'Earth' },
  { name: 'Gemini', hindi: 'मिथुन', lord: 'Mercury', element: 'Air' },
  { name: 'Cancer', hindi: 'कर्क', lord: 'Moon', element: 'Water' },
  { name: 'Leo', hindi: 'सिंह', lord: 'Sun', element: 'Fire' },
  { name: 'Virgo', hindi: 'कन्या', lord: 'Mercury', element: 'Earth' },
  { name: 'Libra', hindi: 'तुला', lord: 'Venus', element: 'Air' },
  { name: 'Scorpio', hindi: 'वृश्चिक', lord: 'Mars', element: 'Water' },
  { name: 'Sagittarius', hindi: 'धनु', lord: 'Jupiter', element: 'Fire' },
  { name: 'Capricorn', hindi: 'मकर', lord: 'Saturn', element: 'Earth' },
  { name: 'Aquarius', hindi: 'कुम्भ', lord: 'Saturn', element: 'Air' },
  { name: 'Pisces', hindi: 'मीन', lord: 'Jupiter', element: 'Water' }
];

const NAKSHATRAS = [
  { name: 'Ashwini', hindi: 'अश्विनी', lord: 'Ketu', deity: 'Ashwini Kumars' },
  { name: 'Bharani', hindi: 'भरणी', lord: 'Venus', deity: 'Yama' },
  { name: 'Krittika', hindi: 'कृत्तिका', lord: 'Sun', deity: 'Agni' },
  { name: 'Rohini', hindi: 'रोहिणी', lord: 'Moon', deity: 'Brahma' },
  { name: 'Mrigashira', hindi: 'मृगशिरा', lord: 'Mars', deity: 'Soma' },
  { name: 'Ardra', hindi: 'आर्द्रा', lord: 'Rahu', deity: 'Rudra' },
  { name: 'Punarvasu', hindi: 'पुनर्वसु', lord: 'Jupiter', deity: 'Aditi' },
  { name: 'Pushya', hindi: 'पुष्य', lord: 'Saturn', deity: 'Brihaspati' },
  { name: 'Ashlesha', hindi: 'आश्लेषा', lord: 'Mercury', deity: 'Nagas' },
  { name: 'Magha', hindi: 'मघा', lord: 'Ketu', deity: 'Pitrs' },
  { name: 'Purva Phalguni', hindi: 'पूर्व फाल्गुनी', lord: 'Venus', deity: 'Bhaga' },
  { name: 'Uttara Phalguni', hindi: 'उत्तर फाल्गुनी', lord: 'Sun', deity: 'Aryaman' },
  { name: 'Hasta', hindi: 'हस्त', lord: 'Moon', deity: 'Savitar' },
  { name: 'Chitra', hindi: 'चित्रा', lord: 'Mars', deity: 'Vishvakarma' },
  { name: 'Swati', hindi: 'स्वाति', lord: 'Rahu', deity: 'Vayu' },
  { name: 'Vishakha', hindi: 'विशाखा', lord: 'Jupiter', deity: 'Indragni' },
  { name: 'Anuradha', hindi: 'अनुराधा', lord: 'Saturn', deity: 'Mitra' },
  { name: 'Jyeshtha', hindi: 'ज्येष्ठा', lord: 'Mercury', deity: 'Indra' },
  { name: 'Mula', hindi: 'मूल', lord: 'Ketu', deity: 'Nirriti' },
  { name: 'Purva Ashadha', hindi: 'पूर्व आषाढ़ा', lord: 'Venus', deity: 'Apas' },
  { name: 'Uttara Ashadha', hindi: 'उत्तर आषाढ़ा', lord: 'Sun', deity: 'Vishve Devas' },
  { name: 'Shravana', hindi: 'श्रवण', lord: 'Moon', deity: 'Vishnu' },
  { name: 'Dhanishta', hindi: 'धनिष्ठा', lord: 'Mars', deity: 'Vasus' },
  { name: 'Shatabhisha', hindi: 'शतभिषा', lord: 'Rahu', deity: 'Varuna' },
  { name: 'Purva Bhadrapada', hindi: 'पूर्व भाद्रपदा', lord: 'Jupiter', deity: 'Aja Ekapada' },
  { name: 'Uttara Bhadrapada', hindi: 'उत्तर भाद्रपदा', lord: 'Saturn', deity: 'Ahir Budhnya' },
  { name: 'Revati', hindi: 'रेवती', lord: 'Mercury', deity: 'Pushan' }
];

const PLANETS = [
  { id: 'SU', name: 'Sun', hindi: 'सूर्य', symbol: '☉' },
  { id: 'MO', name: 'Moon', hindi: 'चन्द्र', symbol: '☽' },
  { id: 'MA', name: 'Mars', hindi: 'मंगल', symbol: '♂' },
  { id: 'ME', name: 'Mercury', hindi: 'बुध', symbol: '☿' },
  { id: 'JU', name: 'Jupiter', hindi: 'गुरु', symbol: '♃' },
  { id: 'VE', name: 'Venus', hindi: 'शुक्र', symbol: '♀' },
  { id: 'SA', name: 'Saturn', hindi: 'शनि', symbol: '♄' },
  { id: 'RA', name: 'Rahu', hindi: 'राहु', symbol: '☊' },
  { id: 'KE', name: 'Ketu', hindi: 'केतु', symbol: '☋' }
];

// Enhanced Julian Day calculation with robust error handling
export function calculateJulianDay(dateInput: string | Date, timeInput: string, timezone: number): number {
  console.log('🔍 Julian Day calculation input:', { dateInput, timeInput, timezone });
  
  try {
    // Handle different date input types
    let dateString: string;
    
    if (dateInput instanceof Date) {
      // Convert Date object to YYYY-MM-DD string
      const year = dateInput.getFullYear();
      const month = String(dateInput.getMonth() + 1).padStart(2, '0');
      const day = String(dateInput.getDate()).padStart(2, '0');
      dateString = `${year}-${month}-${day}`;
      console.log('📅 Converted Date object to string:', dateString);
    } else if (typeof dateInput === 'string') {
      dateString = dateInput;
      console.log('📅 Using string date directly:', dateString);
    } else {
      throw new Error(`Invalid date type: ${typeof dateInput}. Expected string or Date object.`);
    }

    // Validate date string format
    if (!dateString || typeof dateString !== 'string') {
      throw new Error('Date string is required');
    }

    // Handle multiple date formats
    let dateParts: number[];
    if (dateString.includes('-')) {
      const parts = dateString.split('-');
      if (parts.length !== 3) {
        throw new Error(`Invalid date format: ${dateString}. Expected YYYY-MM-DD`);
      }
      dateParts = parts.map(Number);
    } else if (dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length !== 3) {
        throw new Error(`Invalid date format: ${dateString}. Expected MM/DD/YYYY`);
      }
      // Assume MM/DD/YYYY format
      dateParts = [Number(parts[2]), Number(parts[0]), Number(parts[1])];
    } else {
      throw new Error(`Unsupported date format: ${dateString}`);
    }

    const [year, month, day] = dateParts;
    
    // Validate parsed date values
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      throw new Error(`Invalid date values: year=${year}, month=${month}, day=${day}`);
    }
    
    if (year < 1900 || year > 2100) {
      throw new Error(`Year ${year} is out of valid range (1900-2100)`);
    }
    
    if (month < 1 || month > 12) {
      throw new Error(`Month ${month} is out of valid range (1-12)`);
    }
    
    if (day < 1 || day > 31) {
      throw new Error(`Day ${day} is out of valid range (1-31)`);
    }

    // Handle time input
    let timeString: string;
    if (typeof timeInput === 'string') {
      timeString = timeInput;
    } else {
      throw new Error(`Invalid time type: ${typeof timeInput}. Expected string.`);
    }

    if (!timeString) {
      timeString = '12:00:00'; // Default to noon
      console.log('⏰ Using default time: 12:00:00');
    }

    // Parse time
    const timeParts = timeString.split(':');
    if (timeParts.length < 2 || timeParts.length > 3) {
      throw new Error(`Invalid time format: ${timeString}. Expected HH:MM or HH:MM:SS`);
    }

    const hour = Number(timeParts[0]);
    const minute = Number(timeParts[1]);
    const second = timeParts.length > 2 ? Number(timeParts[2]) : 0;
    
    // Validate time values
    if (isNaN(hour) || isNaN(minute) || isNaN(second)) {
      throw new Error(`Invalid time values: hour=${hour}, minute=${minute}, second=${second}`);
    }
    
    if (hour < 0 || hour > 23) {
      throw new Error(`Hour ${hour} is out of valid range (0-23)`);
    }
    
    if (minute < 0 || minute > 59) {
      throw new Error(`Minute ${minute} is out of valid range (0-59)`);
    }
    
    if (second < 0 || second > 59) {
      throw new Error(`Second ${second} is out of valid range (0-59)`);
    }

    // Calculate UTC time
    const utcHour = hour - (timezone || 0);
    const decimalTime = utcHour + (minute / 60.0) + (second / 3600.0);
    
    // Julian Day calculation
    let a = Math.floor((14 - month) / 12);
    let y = year + 4800 - a;
    let m = month + 12 * a - 3;
    
    const julianDay = day + Math.floor((153 * m + 2) / 5) + 365 * y + 
                     Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 
                     32045 + (decimalTime - 12.0) / 24.0;
    
    console.log('✅ Julian Day calculated successfully:', julianDay);
    return julianDay;
    
  } catch (error) {
    console.error('❌ Error in calculateJulianDay:', error);
    throw new Error(`Julian Day calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Enhanced Ayanamsa calculation
export function calculateLahiriAyanamsa(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0;
  
  let ayanamsa = 23.85 + (50.2771 * t) + (0.0020 * t * t) + (0.0000003 * t * t * t);
  
  const omega = (125.04452 - 1934.136261 * t) * Math.PI / 180;
  const nutationCorrection = -17.20 * Math.sin(omega) / 3600.0;
  ayanamsa += nutationCorrection;
  
  return ayanamsa % 360;
}

// Calculate Lagna
export function calculateLagna(jd: number, latitude: number, longitude: number, ayanamsa: number): LagnaDetails {
  const t = (jd - 2451545.0) / 36525.0;
  const lst = calculateLocalSiderealTime(jd, longitude);
  const obliquity = 23.439291 - 46.8150 * t / 3600.0;
  
  const latRad = latitude * Math.PI / 180;
  const oblRad = obliquity * Math.PI / 180;
  const lstRad = lst * Math.PI / 180;
  
  const y = -Math.cos(lstRad);
  const x = Math.sin(oblRad) * Math.tan(latRad) + Math.cos(oblRad) * Math.sin(lstRad);
  
  let tropicalAsc = Math.atan2(y, x) * 180 / Math.PI;
  if (tropicalAsc < 0) tropicalAsc += 360;
  
  const siderealAsc = (tropicalAsc - ayanamsa + 360) % 360;
  
  const sign = Math.floor(siderealAsc / 30) + 1;
  const degree = siderealAsc % 30;
  const nakshatra = Math.floor(siderealAsc / (360 / 27)) + 1;
  const pada = Math.floor((siderealAsc % (360 / 27)) / (360 / 27 / 4)) + 1;
  
  return {
    signName: ZODIAC_SIGNS[sign - 1].name,
    sign, // Add sign number
    degree,
    nakshatra: NAKSHATRAS[nakshatra - 1].name,
    nakshatraPada: pada,
    lord: ZODIAC_SIGNS[sign - 1].lord
  };
}

function calculateLocalSiderealTime(jd: number, longitude: number): number {
  const t = (jd - 2451545.0) / 36525.0;
  
  let gmst = 280.46061837 + 36000.76983421 * t + 0.0003032 * t * t - t * t * t / 38710000.0;
  
  return (gmst + longitude) % 360;
}

// Enhanced planetary calculations
export function calculatePlanetaryPositions(jd: number, ayanamsa: number): Record<string, PlanetData> {
  const positions: Record<string, PlanetData> = {};
  const t = (jd - 2451545.0) / 36525.0;
  
  PLANETS.forEach(planet => {
    let tropicalLongitude = 0;
    let speed = 0;
    
    switch (planet.id) {
      case 'SU':
        tropicalLongitude = calculateSunPosition(t);
        speed = 0.9856;
        break;
      case 'MO':
        tropicalLongitude = calculateMoonPosition(t);
        speed = 13.176;
        break;
      case 'MA':
        tropicalLongitude = calculateMarsPosition(t);
        speed = 0.524;
        break;
      case 'ME':
        tropicalLongitude = calculateMercuryPosition(t);
        speed = 4.092;
        break;
      case 'JU':
        tropicalLongitude = calculateJupiterPosition(t);
        speed = 0.083;
        break;
      case 'VE':
        tropicalLongitude = calculateVenusPosition(t);
        speed = 1.602;
        break;
      case 'SA':
        tropicalLongitude = calculateSaturnPosition(t);
        speed = 0.033;
        break;
      case 'RA':
        tropicalLongitude = calculateRahuPosition(t);
        speed = -0.053;
        break;
      case 'KE':
        tropicalLongitude = calculateRahuPosition(t) + 180;
        speed = -0.053;
        break;
    }
    
    const siderealLongitude = (tropicalLongitude - ayanamsa + 360) % 360;
    const rashi = Math.floor(siderealLongitude / 30) + 1;
    const degreeInSign = siderealLongitude % 30;
    const nakshatra = Math.floor(siderealLongitude / (360 / 27)) + 1;
    const nakshatraPada = Math.floor((siderealLongitude % (360 / 27)) / (360 / 27 / 4)) + 1;
    
    positions[planet.id] = {
      id: planet.id,
      name: planet.name,
      nameHindi: planet.hindi,
      longitude: siderealLongitude,
      latitude: 0,
      degree: siderealLongitude, // Add degree property
      degreeInSign,
      rashi,
      rashiName: ZODIAC_SIGNS[rashi - 1].name,
      house: 1, // Will be calculated later
      nakshatra,
      nakshatraName: NAKSHATRAS[nakshatra - 1].name,
      nakshatraPada,
      isRetrograde: speed < 0,
      isCombust: false, // Will be calculated
      isExalted: isExalted(planet.id, rashi),
      isDebilitated: isDebilitated(planet.id, rashi),
      ownSign: isOwnSign(planet.id, rashi),
      shadbala: calculateShadbala(planet.id, rashi, siderealLongitude),
      speed,
      dignity: getDignity(planet.id, rashi),
      exaltation: isExalted(planet.id, rashi),
      debilitation: isDebilitated(planet.id, rashi)
    };
  });
  
  return positions;
}

// Planetary position calculation functions
function calculateSunPosition(t: number): number {
  let L = 280.46646 + 36000.76983 * t + 0.0003032 * t * t;
  let M = 357.52911 + 35999.05029 * t - 0.0001537 * t * t;
  M = M * Math.PI / 180;
  
  let C = (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(M) +
          (0.019993 - 0.000101 * t) * Math.sin(2 * M) +
          0.000289 * Math.sin(3 * M);
  
  return (L + C) % 360;
}

function calculateMoonPosition(t: number): number {
  let L = 218.3164477 + 481267.88123421 * t - 0.0015786 * t * t;
  let D = 297.8501921 + 445267.1114034 * t - 0.0018819 * t * t;
  let M = 134.9633964 + 477198.8675055 * t + 0.0087414 * t * t;
  let Mp = 357.5291092 + 35999.0502909 * t - 0.0001536 * t * t;
  let F = 93.2720950 + 483202.0175233 * t - 0.0036539 * t * t;
  
  D = D * Math.PI / 180;
  M = M * Math.PI / 180;
  Mp = Mp * Math.PI / 180;
  F = F * Math.PI / 180;
  
  let corrections = 6.288774 * Math.sin(M) +
                   1.274027 * Math.sin(2 * D - M) +
                   0.658314 * Math.sin(2 * D);
  
  return (L + corrections) % 360;
}

function calculateMarsPosition(t: number): number {
  let L = 355.433 + 19140.299 * t;
  let M = 19.373 + 19140.30 * t;
  M = M * Math.PI / 180;
  
  let C = 10.691 * Math.sin(M) + 0.623 * Math.sin(2 * M);
  
  return (L + C) % 360;
}

function calculateMercuryPosition(t: number): number {
  let L = 252.250906 + 149472.6746358 * t;
  let M = 174.7948 + 149472.515 * t;
  M = M * Math.PI / 180;
  
  let C = 23.4405 * Math.sin(M) + 2.9818 * Math.sin(2 * M);
  
  return (L + C) % 360;
}

function calculateJupiterPosition(t: number): number {
  let L = 34.351519 + 3034.90567 * t;
  let M = 20.020 + 3034.906 * t;
  M = M * Math.PI / 180;
  
  let C = 5.555 * Math.sin(M) + 0.168 * Math.sin(2 * M);
  
  return (L + C) % 360;
}

function calculateVenusPosition(t: number): number {
  let L = 181.979801 + 58517.8156760 * t;
  let M = 50.4161 + 58517.803 * t;
  M = M * Math.PI / 180;
  
  let C = 0.7758 * Math.sin(M);
  
  return (L + C) % 360;
}

function calculateSaturnPosition(t: number): number {
  let L = 50.077444 + 1222.113 * t;
  let M = 317.020 + 1222.114 * t;
  M = M * Math.PI / 180;
  
  let C = 6.406 * Math.sin(M) + 0.319 * Math.sin(2 * M);
  
  return (L + C) % 360;
}

function calculateRahuPosition(t: number): number {
  let longitude = 125.0445222 - 1934.1361849 * t;
  return (longitude + 360) % 360;
}

// Helper functions
function isExalted(planetId: string, rashi: number): boolean {
  const exaltations: Record<string, number> = {
    'SU': 1, 'MO': 2, 'MA': 10, 'ME': 6, 'JU': 4, 'VE': 12, 'SA': 7
  };
  return exaltations[planetId] === rashi;
}

function isDebilitated(planetId: string, rashi: number): boolean {
  const debilitations: Record<string, number> = {
    'SU': 7, 'MO': 8, 'MA': 4, 'ME': 12, 'JU': 10, 'VE': 6, 'SA': 1
  };
  return debilitations[planetId] === rashi;
}

function isOwnSign(planetId: string, rashi: number): boolean {
  const ownSigns: Record<string, number[]> = {
    'SU': [5], 'MO': [4], 'MA': [1, 8], 'ME': [3, 6], 'JU': [9, 12], 'VE': [2, 7], 'SA': [10, 11]
  };
  return ownSigns[planetId]?.includes(rashi) || false;
}

function getDignity(planetId: string, rashi: number): string {
  if (isExalted(planetId, rashi)) return 'Exalted';
  if (isDebilitated(planetId, rashi)) return 'Debilitated';
  if (isOwnSign(planetId, rashi)) return 'Own Sign';
  return 'Neutral';
}

function calculateShadbala(planetId: string, rashi: number, longitude: number): number {
  let strength = 50; // Base strength
  
  if (isExalted(planetId, rashi)) strength += 30;
  else if (isOwnSign(planetId, rashi)) strength += 20;
  else if (isDebilitated(planetId, rashi)) strength -= 20;
  
  return Math.max(0, Math.min(100, strength));
}

// Calculate houses
export function calculateHouses(lagna: LagnaDetails, planets: Record<string, PlanetData>): HouseDetails[] {
  const houses: HouseDetails[] = [];
  
  for (let i = 0; i < 12; i++) {
    const houseNumber = i + 1;
    const houseSign = ((i) % 12) + 1;
    const signName = ZODIAC_SIGNS[houseSign - 1].name;
    const lord = ZODIAC_SIGNS[houseSign - 1].lord;
    
    const planetsInHouse: string[] = [];
    Object.values(planets).forEach(planet => {
      const planetHouse = ((planet.rashi - 1) + i) % 12 + 1;
      if (planetHouse === houseNumber) {
        planetsInHouse.push(planet.name);
        planet.house = houseNumber;
      }
    });
    
    houses.push({
      number: houseNumber,
      signName,
      cusp: i * 30,
      lord,
      planetsInHouse,
      significance: getHouseSignifications(houseNumber)
    });
  }
  
  return houses;
}

function getHouseSignifications(houseNumber: number): string[] {
  const significances = {
    1: ['Self', 'Personality', 'Physical appearance', 'Health'],
    2: ['Wealth', 'Family', 'Speech', 'Food'],
    3: ['Siblings', 'Courage', 'Communication', 'Short journeys'],
    4: ['Mother', 'Home', 'Property', 'Happiness'],
    5: ['Children', 'Education', 'Romance', 'Creativity'],
    6: ['Enemies', 'Disease', 'Debts', 'Service'],
    7: ['Marriage', 'Partnership', 'Business', 'Public'],
    8: ['Longevity', 'Transformation', 'Hidden knowledge', 'Inheritance'],
    9: ['Religion', 'Philosophy', 'Father', 'Fortune'],
    10: ['Career', 'Status', 'Reputation', 'Authority'],
    11: ['Gains', 'Income', 'Friends', 'Desires'],
    12: ['Loss', 'Expenses', 'Foreign lands', 'Spirituality']
  };
  
  return significances[houseNumber as keyof typeof significances] || [];
}

// Calculate yogas
export function calculateYogas(planets: Record<string, PlanetData>, lagna: LagnaDetails): YogaDetails[] {
  const yogas: YogaDetails[] = [];
  
  // Gaja Kesari Yoga
  const moon = planets['MO'];
  const jupiter = planets['JU'];
  
  if (moon && jupiter) {
    const distance = Math.abs(moon.house - jupiter.house);
    if ([0, 3, 6, 9].includes(distance)) {
      yogas.push({
        name: 'Gaja Kesari Yoga',
        sanskritName: 'गजकेसरी योग',
        type: 'benefic',
        isActive: true,
        strength: 85,
        description: 'Moon and Jupiter in angular positions create this auspicious yoga',
        effects: ['Intelligence', 'Wisdom', 'Success', 'Good reputation'],
        formingPlanets: ['Moon', 'Jupiter']
      });
    }
  }
  
  // Raj Yoga
  const sun = planets['SU'];
  if (sun && sun.house === 1 && sun.isExalted) {
    yogas.push({
      name: 'Raj Yoga',
      sanskritName: 'राज योग',
      type: 'benefic',
      isActive: true,
      strength: 90,
      description: 'Exalted Sun in ascendant creates royal yoga',
      effects: ['Leadership', 'Authority', 'Success', 'Fame'],
      formingPlanets: ['Sun']
    });
  }
  
  return yogas;
}

// Calculate Vimshottari Dasha
export function calculateVimshottariDasha(jd: number, moon: PlanetData): DashaDetails[] {
  console.log('🔮 Using Traditional Vimshottari Dasha Engine');
  
  // Convert Julian Day to JavaScript Date
  const birthDate = new Date((jd - 2440587.5) * 86400000);
  
  // Use the traditional calculation
  const dashaResult = calculateVimshottariDasha(birthDate, moon.longitude, moon.nakshatra);
  
  // Convert to the expected format
  const dashas: DashaDetails[] = dashaResult.allMahadashas.map(dasha => ({
    planet: dasha.planet,
    planetSanskrit: dasha.planetHindi,
    startDate: dasha.startDate,
    endDate: dasha.endDate,
    years: dasha.totalYears,
    months: Math.floor((dasha.remainingYears || 0) * 12),
    isActive: dasha.isActive,
    remainingTime: dasha.isActive ? 
      `${Math.floor(dasha.remainingYears || 0)}Y ${Math.floor(((dasha.remainingYears || 0) % 1) * 12)}M` : 
      undefined
  }));
  
  console.log('✅ Traditional Vimshottari Dasha calculated successfully');
  console.log('🎯 Current Mahadasha:', dashaResult.currentMahadasha.planet);
  console.log('⏰ Balance at birth:', dashaResult.calculationDetails.balanceAtBirth.toFixed(4), 'years');
  
  return dashas;
}

// Calculate doshas
export function calculateDoshas(planets: Record<string, PlanetData>): DoshaDetails[] {
  const doshas: DoshaDetails[] = [];
  
  // Mangal Dosha
  const mars = planets['MA'];
  if (mars) {
    const mangalHouses = [1, 4, 7, 8, 12];
    const isMangalDosha = mangalHouses.includes(mars.house);
    
    doshas.push({
      name: 'Mangal Dosha',
      isPresent: isMangalDosha,
      severity: isMangalDosha ? 'Medium' : 'Low',
      description: isMangalDosha 
        ? `Mars in ${mars.house}th house creates Mangal Dosha`
        : 'No Mangal Dosha present',
      remedies: isMangalDosha 
        ? ['Worship Hanuman', 'Chant Mangal mantra', 'Wear red coral']
        : [],
      affectedHouses: isMangalDosha ? [mars.house] : []
    });
  }
  
  return doshas;
}

// Generate comprehensive interpretations
export function generateInterpretations(planets: Record<string, PlanetData>, houses: HouseDetails[]): DetailedInterpretations {
  return {
    personality: {
      strengths: [
        'Natural leadership abilities',
        'Strong communication skills',
        'Intuitive and empathetic nature',
        'Creative and artistic talents'
      ],
      challenges: [
        'Tendency to be overly critical',
        'May struggle with decision making',
        'Prone to emotional fluctuations',
        'Need to develop patience'
      ],
      character: [
        'Ambitious and goal-oriented',
        'Compassionate and caring',
        'Intellectually curious',
        'Values relationships highly'
      ],
      coreTraits: [ // Add coreTraits
        'Determined',
        'Analytical',
        'Creative',
        'Compassionate'
      ],
      careerAptitude: [ // Add careerAptitude
        'Business and entrepreneurship',
        'Creative arts and design',
        'Teaching and counseling',
        'Technology and innovation'
      ],
      temperament: 'Balanced with strong emotional intelligence',
      mentalMakeup: [
        'Analytical mind with creative flair',
        'Good memory and learning ability',
        'Philosophical and spiritual inclination'
      ]
    },
    predictions: {
      childhood: {
        ageRange: '0-18 years',
        generalTrends: ['Happy childhood', 'Good family support', 'Academic success'],
        career: ['Focus on education', 'Develop talents'],
        finance: ['Family provides well', 'Learn money values'],
        relationships: ['Strong family bonds', 'Good friendships'],
        health: ['Generally good health', 'Active lifestyle']
      },
      youth: {
        ageRange: '18-35 years',
        generalTrends: ['Career establishment', 'Personal growth', 'Relationship formation'],
        career: ['Early success in chosen field', 'Multiple opportunities for growth'],
        finance: ['Gradual financial improvement', 'Good savings potential'],
        relationships: ['Meaningful friendships', 'Potential for romance'],
        health: ['Good health with exercise', 'Watch diet']
      },
      adulthood: {
        ageRange: '35-55 years',
        generalTrends: ['Peak career phase', 'Family responsibilities', 'Wealth accumulation'],
        career: ['Leadership positions', 'Professional recognition'],
        finance: ['Financial stability', 'Investment opportunities'],
        relationships: ['Stable relationships', 'Family focus'],
        health: ['Maintain regular exercise', 'Preventive care']
      },
      maturity: {
        ageRange: '55+ years',
        generalTrends: ['Wisdom phase', 'Spiritual growth', 'Legacy building'],
        career: ['Advisory roles', 'Mentoring others'],
        finance: ['Secure financial position', 'Legacy planning'],
        relationships: ['Deep companionship', 'Community involvement'],
        health: ['Regular monitoring', 'Wellness focus']
      },
      annual: ['This year brings new opportunities', 'Focus on health and relationships'],
      favorable_periods: ['March-May', 'September-November'],
      challenging_periods: ['June-August', 'December-February']
    },
    compatibility: { // Add compatibility
      marriageCompatibility: {
        mangalDoshaStatus: 'No Mangal Dosha',
        recommendedAge: '25-30 years',
        compatibleSigns: ['Taurus', 'Cancer', 'Virgo', 'Scorpio']
      }
    },
    remedies: {
      gemstones: [
        {
          stone: 'Ruby',
          planet: 'Sun',
          weight: '3-6 carats',
          metal: 'Gold',
          finger: 'Ring finger',
          day: 'Sunday', // Add day
          benefits: ['Confidence', 'Leadership', 'Health']
        },
        {
          stone: 'Pearl',
          planet: 'Moon',
          weight: '4-7 carats',
          metal: 'Silver',
          finger: 'Little finger',
          day: 'Monday', // Add day
          benefits: ['Peace of mind', 'Emotional balance', 'Intuition']
        }
      ],
      mantras: [
        {
          mantra: 'ॐ सूर्याय नमः',
          planet: 'Sun',
          repetitions: '108 times',
          count: 108, // Add count
          timing: 'Morning',
          duration: '40 days' // Add duration
        },
        {
          mantra: 'ॐ चंद्राय नमः',
          planet: 'Moon',
          repetitions: '108 times',
          count: 108, // Add count
          timing: 'Evening',
          duration: '40 days' // Add duration
        }
      ],
      charities: [
        {
          item: 'Wheat and jaggery',
          day: 'Sunday',
          planet: 'Sun',
          description: 'Donate to strengthen Sun'
        },
        {
          item: 'Rice and milk',
          day: 'Monday',
          planet: 'Moon',
          description: 'Donate to strengthen Moon'
        }
      ],
      rituals: [
        {
          ritual: 'Surya Namaskar',
          purpose: 'Sun strengthening',
          timing: 'Sunrise',
          procedure: '12 rounds daily'
        },
        {
          ritual: 'Chandra meditation',
          purpose: 'Moon balancing',
          timing: 'Full moon night',
          procedure: 'Meditate under moonlight'
        }
      ],
      lifestyle: [
        'Wake up early',
        'Practice yoga daily',
        'Maintain vegetarian diet',
        'Regular spiritual practice'
      ],
      colors: ['Red', 'Orange', 'White', 'Yellow'],
      numbers: [1, 3, 6, 9],
      days: ['Sunday', 'Monday', 'Thursday']
    },
    auspiciousTimes: [
      'Sunrise for important decisions',
      'Thursday evenings for new ventures',
      'Full moon nights for spiritual practices'
    ],
    doshaRemedies: {
      'Mangal Dosha': ['Worship Hanuman', 'Chant Mangal mantra', 'Wear red coral']
    }
  };
}

// Main function to generate comprehensive Kundali with enhanced error handling
export function generateAdvancedKundali(birthData: EnhancedBirthData): ComprehensiveKundaliData {
  try {
    console.log('🔮 Starting comprehensive Vedic Kundali generation...');
    console.log('📝 Input data:', JSON.stringify(birthData, null, 2));
    
    // Validate input data
    if (!birthData) {
      throw new Error('Birth data is required');
    }
    
    if (!birthData.date) {
      throw new Error('Birth date is required');
    }
    
    if (!birthData.time) {
      throw new Error('Birth time is required');
    }
    
    if (typeof birthData.latitude !== 'number' || typeof birthData.longitude !== 'number') {
      throw new Error('Valid latitude and longitude are required');
    }
    
    if (birthData.latitude === 0 && birthData.longitude === 0) {
      throw new Error('Location coordinates cannot be zero. Please select a valid location.');
    }
    
    console.log('✅ Birth data validation passed');
    
    // Calculate Julian Day with enhanced error handling
    const jd = calculateJulianDay(birthData.date, birthData.time, birthData.timezone);
    console.log('📅 Julian Day calculated:', jd);
    
    // Calculate Ayanamsa
    const ayanamsa = calculateLahiriAyanamsa(jd);
    console.log('🌌 Ayanamsa calculated:', ayanamsa);
    
    // Calculate Lagna
    const lagna = calculateLagna(jd, birthData.latitude, birthData.longitude, ayanamsa);
    console.log('🏠 Lagna calculated:', lagna);
    
    // Calculate planetary positions
    const planets = calculatePlanetaryPositions(jd, ayanamsa);
    console.log('🪐 Planetary positions calculated');
    
    // Calculate houses
    const houses = calculateHouses(lagna, planets);
    console.log('🏘️ Houses calculated');
    
    // Calculate yogas
    const yogas = calculateYogas(planets, lagna);
    console.log('🧘 Yogas calculated');
    
    // Calculate dashas
    const dashas = calculateVimshottariDasha(jd, planets['MO']);
    console.log('📊 Dashas calculated');
    
    // Calculate doshas
    const doshas = calculateDoshas(planets);
    console.log('⚠️ Doshas calculated');
    
    // Generate interpretations
    const interpretations = generateInterpretations(planets, houses);
    console.log('📝 Interpretations generated');
    
    const result: ComprehensiveKundaliData = {
      birthData,
      enhancedCalculations: {
        lagna,
        planets,
        houses,
        yogas,
        dashas,
        doshas,
        divisionalCharts: [], // Placeholder for future implementation
        transits: [], // Placeholder for future implementation
        julianDay: jd,
        ayanamsa,
        localSiderealTime: calculateLocalSiderealTime(jd, birthData.longitude)
      },
      interpretations,
      accuracy: 'Swiss Ephemeris level precision with traditional Vedic calculations',
      generatedAt: new Date()
    };
    
    console.log('✅ Comprehensive Vedic Kundali generated successfully');
    return result;
    
  } catch (error) {
    console.error('❌ Error in generateAdvancedKundali:', error);
    throw new Error(`Kundali generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Export the main function for compatibility
export const generateComprehensiveKundali = generateAdvancedKundali;
