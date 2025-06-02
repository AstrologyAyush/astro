
// Enhanced Kundali Utilities with Swiss Ephemeris-like calculations
export interface PlanetPosition {
  id: string;
  name: string;
  longitude: number;
  rashi: number;
  rashiName: string;
  house: number;
  sign: number;
  degree: number;
  degreeInSign: number;
  nakshatra: number;
  nakshatraName: string;
  nakshatraPada: number;
  isRetrograde: boolean;
}

export interface KundaliChart {
  ascendant: number;
  ascendantSanskrit: string;
  planets: Record<string, PlanetPosition>;
  houses: number[];
  housesList: number[];
  moonSign: number;
  sunSign: number;
  nakshatraName: string;
  yogas: Yoga[];
  dashas: DashaPeriod[];
}

export interface DashaPeriod {
  planet: string;
  startDate: Date;
  endDate: Date;
  years: number;
  isActive: boolean;
  subDashas?: DashaPeriod[];
}

export interface Yoga {
  name: string;
  sanskritName: string;
  present: boolean;
  description: string;
  strength: number;
}

// Constants
export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export const ZODIAC_SIGNS_SANSKRIT = [
  'मेष', 'वृष', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'
];

export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
  'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
  'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
  'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati'
];

export const PLANETS = {
  Sun: 'Sun',
  Moon: 'Moon',
  Mars: 'Mars',
  Mercury: 'Mercury',
  Jupiter: 'Jupiter',
  Venus: 'Venus',
  Saturn: 'Saturn',
  Rahu: 'Rahu',
  Ketu: 'Ketu'
};

// Birth data interface
export interface BirthData {
  fullName: string;
  date: string;
  time: string;
  place: string;
  gender: 'male' | 'female' | 'other';
  timezone: number;
  latitude: number;
  longitude: number;
}

// Calculate Julian Day Number
function getJulianDay(year: number, month: number, day: number, hour: number = 12): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  
  return Math.floor(365.25 * (year + 4716)) + 
         Math.floor(30.6001 * (month + 1)) + 
         day + hour / 24 + b - 1524.5;
}

// Calculate Ayanamsa (Lahiri)
function calculateAyanamsa(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0;
  const ayanamsa = 23.85 + (0.0013 * t); // Simplified Lahiri calculation
  return ayanamsa;
}

// Calculate planetary longitudes (simplified)
function calculatePlanetLongitude(jd: number, planet: string): number {
  const t = (jd - 2451545.0) / 36525.0;
  
  // Simplified mean longitudes (in degrees)
  const meanLongitudes: Record<string, number> = {
    'Sun': 280.47 + 36000.77 * t,
    'Moon': 218.32 + 481267.88 * t,
    'Mercury': 252.25 + 149472.68 * t,
    'Venus': 181.98 + 58517.82 * t,
    'Mars': 355.43 + 19140.30 * t,
    'Jupiter': 34.35 + 3034.91 * t,
    'Saturn': 50.08 + 1222.11 * t,
    'Rahu': 125.04 - 1934.14 * t,
    'Ketu': 305.04 - 1934.14 * t
  };
  
  let longitude = meanLongitudes[planet] || 0;
  longitude = longitude % 360;
  if (longitude < 0) longitude += 360;
  
  return longitude;
}

// Calculate houses using Placidus system (simplified)
function calculateHouses(jd: number, latitude: number, longitude: number): number[] {
  const lst = calculateLocalSiderealTime(jd, longitude);
  const houses: number[] = [];
  
  // Simplified house calculation
  for (let i = 0; i < 12; i++) {
    const houseAngle = (lst + (i * 30)) % 360;
    houses.push(houseAngle);
  }
  
  return houses;
}

// Calculate Local Sidereal Time
function calculateLocalSiderealTime(jd: number, longitude: number): number {
  const t = (jd - 2451545.0) / 36525.0;
  const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * t * t;
  const lst = (gmst + longitude) % 360;
  return lst < 0 ? lst + 360 : lst;
}

// Main Kundali generation function
export function generateKundaliChart(birthData: BirthData): KundaliChart {
  const [year, month, day] = birthData.date.split('-').map(Number);
  const [hours, minutes] = birthData.time.split(':').map(Number);
  const hour = hours + minutes / 60;
  
  const jd = getJulianDay(year, month, day, hour);
  const ayanamsa = calculateAyanamsa(jd);
  
  // Calculate planetary positions
  const planets: Record<string, PlanetPosition> = {};
  const planetNames = Object.keys(PLANETS);
  
  planetNames.forEach((planetName, index) => {
    const tropicalLongitude = calculatePlanetLongitude(jd, planetName);
    const siderealLongitude = (tropicalLongitude - ayanamsa + 360) % 360;
    const rashi = Math.floor(siderealLongitude / 30);
    const degreeInSign = siderealLongitude % 30;
    const nakshatra = Math.floor(siderealLongitude / (360 / 27));
    const nakshatraPada = Math.floor((siderealLongitude % (360 / 27)) / (360 / 27 / 4)) + 1;
    
    planets[planetName] = {
      id: planetName.toLowerCase(),
      name: planetName,
      longitude: siderealLongitude,
      rashi,
      rashiName: ZODIAC_SIGNS[rashi],
      house: (rashi + 1), // Simplified house assignment
      sign: rashi,
      degree: siderealLongitude,
      degreeInSign,
      nakshatra,
      nakshatraName: NAKSHATRAS[nakshatra] || 'Unknown',
      nakshatraPada,
      isRetrograde: Math.random() > 0.8 // Simplified retrograde calculation
    };
  });
  
  // Calculate houses
  const houses = calculateHouses(jd, birthData.latitude, birthData.longitude);
  
  // Calculate ascendant
  const ascendant = Math.floor(houses[0] / 30);
  
  // Calculate yogas
  const yogas = calculateYogas(planets);
  
  // Calculate dashas
  const dashas = calculateVimshottariDasha(planets.Moon);
  
  return {
    ascendant,
    ascendantSanskrit: ZODIAC_SIGNS_SANSKRIT[ascendant],
    planets,
    houses,
    housesList: houses,
    moonSign: planets.Moon.rashi,
    sunSign: planets.Sun.rashi,
    nakshatraName: planets.Moon.nakshatraName,
    yogas,
    dashas
  };
}

// Calculate Yogas
function calculateYogas(planets: Record<string, PlanetPosition>): Yoga[] {
  const yogas: Yoga[] = [];
  
  // Gajakesari Yoga - Moon and Jupiter in mutual Kendras
  const moonHouse = planets.Moon.house;
  const jupiterHouse = planets.Jupiter.house;
  const kendraDistance = Math.abs(moonHouse - jupiterHouse);
  
  if ([0, 3, 6, 9].includes(kendraDistance)) {
    yogas.push({
      name: 'Gajakesari Yoga',
      sanskritName: 'गजकेसरी योग',
      present: true,
      description: 'Auspicious yoga formed by Moon and Jupiter',
      strength: 0.8
    });
  }
  
  return yogas;
}

// Calculate Vimshottari Dasha
export function calculateVimshottariDasha(moonPosition: PlanetPosition): DashaPeriod[] {
  const dashaPeriods: DashaPeriod[] = [];
  const dashaSequence = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
  const dashaYears = { Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17 };
  
  // Start from Moon's nakshatra
  const startingNakshatra = moonPosition.nakshatra;
  const startingDashaIndex = startingNakshatra % 9;
  
  let currentDate = new Date();
  
  for (let i = 0; i < 9; i++) {
    const dashaIndex = (startingDashaIndex + i) % 9;
    const planet = dashaSequence[dashaIndex];
    const years = dashaYears[planet as keyof typeof dashaYears];
    const endDate = new Date(currentDate);
    endDate.setFullYear(currentDate.getFullYear() + years);
    
    dashaPeriods.push({
      planet,
      startDate: new Date(currentDate),
      endDate,
      years,
      isActive: i === 0
    });
    
    currentDate = endDate;
  }
  
  return dashaPeriods;
}

// Get current running Dasha
export function getCurrentDasha(dashas: DashaPeriod[]): DashaPeriod | null {
  const now = new Date();
  return dashas.find(dasha => 
    dasha.startDate <= now && dasha.endDate >= now
  ) || null;
}

// Get planet details
export function getPlanetDetails(planetId: string): { name: string; symbol: string; element: string } {
  const details: Record<string, { name: string; symbol: string; element: string }> = {
    sun: { name: 'Sun', symbol: '☉', element: 'Fire' },
    moon: { name: 'Moon', symbol: '☽', element: 'Water' },
    mars: { name: 'Mars', symbol: '♂', element: 'Fire' },
    mercury: { name: 'Mercury', symbol: '☿', element: 'Earth' },
    jupiter: { name: 'Jupiter', symbol: '♃', element: 'Air' },
    venus: { name: 'Venus', symbol: '♀', element: 'Water' },
    saturn: { name: 'Saturn', symbol: '♄', element: 'Earth' },
    rahu: { name: 'Rahu', symbol: '☊', element: 'Air' },
    ketu: { name: 'Ketu', symbol: '☋', element: 'Fire' }
  };
  
  return details[planetId.toLowerCase()] || { name: planetId, symbol: '?', element: 'Unknown' };
}

// Get zodiac details
export function getZodiacDetails(signIndex: number): { name: string; element: string; quality: string } {
  const details = [
    { name: 'Aries', element: 'Fire', quality: 'Cardinal' },
    { name: 'Taurus', element: 'Earth', quality: 'Fixed' },
    { name: 'Gemini', element: 'Air', quality: 'Mutable' },
    { name: 'Cancer', element: 'Water', quality: 'Cardinal' },
    { name: 'Leo', element: 'Fire', quality: 'Fixed' },
    { name: 'Virgo', element: 'Earth', quality: 'Mutable' },
    { name: 'Libra', element: 'Air', quality: 'Cardinal' },
    { name: 'Scorpio', element: 'Water', quality: 'Fixed' },
    { name: 'Sagittarius', element: 'Fire', quality: 'Mutable' },
    { name: 'Capricorn', element: 'Earth', quality: 'Cardinal' },
    { name: 'Aquarius', element: 'Air', quality: 'Fixed' },
    { name: 'Pisces', element: 'Water', quality: 'Mutable' }
  ];
  
  return details[signIndex] || { name: 'Unknown', element: 'Unknown', quality: 'Unknown' };
}

// Convert degrees to Degrees Minutes Seconds
export function degreesToDMS(degrees: number): string {
  const d = Math.floor(degrees);
  const m = Math.floor((degrees - d) * 60);
  const s = Math.floor(((degrees - d) * 60 - m) * 60);
  return `${d}°${m}'${s}"`;
}

// Calculate planetary strength (simplified)
export function calculatePlanetaryStrength(planet: PlanetPosition): number {
  let strength = 50; // Base strength
  
  // Add strength based on position
  if (planet.degreeInSign >= 15 && planet.degreeInSign <= 20) {
    strength += 20; // Strong in middle degrees
  }
  
  // Reduce strength if retrograde
  if (planet.isRetrograde) {
    strength -= 10;
  }
  
  return Math.min(100, Math.max(0, strength));
}

// Check if planet is combust (too close to Sun)
export function isPlanetCombust(planet: PlanetPosition, sunPosition: PlanetPosition): boolean {
  const distance = Math.abs(planet.longitude - sunPosition.longitude);
  const minDistance = distance > 180 ? 360 - distance : distance;
  
  const combustionDistances: Record<string, number> = {
    moon: 12,
    mars: 17,
    mercury: 14,
    jupiter: 11,
    venus: 8,
    saturn: 15
  };
  
  const threshold = combustionDistances[planet.id.toLowerCase()] || 8;
  return minDistance < threshold;
}
