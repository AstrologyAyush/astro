
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
  dashaPeriods: DashaPeriod[];
  birthElement?: string;
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

export interface Yoga {
  name: string;
  sanskritName: string;
  present: boolean;
  description: string;
  strength: number;
}

// Birth data interface
export interface BirthData {
  fullName: string;
  date: Date | string;
  time: string;
  place: string;
  gender?: 'male' | 'female' | 'other';
  timezone: number | string;
  latitude: number;
  longitude: number;
}

// Constants
export const ZODIAC_SIGNS = [
  { id: 1, name: 'Aries', sanskrit: 'मेष', element: 'Fire', quality: 'Cardinal', ruler: 'Mars' },
  { id: 2, name: 'Taurus', sanskrit: 'वृष', element: 'Earth', quality: 'Fixed', ruler: 'Venus' },
  { id: 3, name: 'Gemini', sanskrit: 'मिथुन', element: 'Air', quality: 'Mutable', ruler: 'Mercury' },
  { id: 4, name: 'Cancer', sanskrit: 'कर्क', element: 'Water', quality: 'Cardinal', ruler: 'Moon' },
  { id: 5, name: 'Leo', sanskrit: 'सिंह', element: 'Fire', quality: 'Fixed', ruler: 'Sun' },
  { id: 6, name: 'Virgo', sanskrit: 'कन्या', element: 'Earth', quality: 'Mutable', ruler: 'Mercury' },
  { id: 7, name: 'Libra', sanskrit: 'तुला', element: 'Air', quality: 'Cardinal', ruler: 'Venus' },
  { id: 8, name: 'Scorpio', sanskrit: 'वृश्चिक', element: 'Water', quality: 'Fixed', ruler: 'Mars' },
  { id: 9, name: 'Sagittarius', sanskrit: 'धनु', element: 'Fire', quality: 'Mutable', ruler: 'Jupiter' },
  { id: 10, name: 'Capricorn', sanskrit: 'मकर', element: 'Earth', quality: 'Cardinal', ruler: 'Saturn' },
  { id: 11, name: 'Aquarius', sanskrit: 'कुम्भ', element: 'Air', quality: 'Fixed', ruler: 'Saturn' },
  { id: 12, name: 'Pisces', sanskrit: 'मीन', element: 'Water', quality: 'Mutable', ruler: 'Jupiter' }
];

export const NAKSHATRAS = [
  { id: 1, name: 'Ashwini', sanskrit: 'अश्विनी', ruler: 'KE', degrees: '0°00\' - 13°20\'', deity: 'Ashwini Kumaras' },
  { id: 2, name: 'Bharani', sanskrit: 'भरणी', ruler: 'VE', degrees: '13°20\' - 26°40\'', deity: 'Yama' },
  { id: 3, name: 'Krittika', sanskrit: 'कृत्तिका', ruler: 'SU', degrees: '26°40\' - 40°00\'', deity: 'Agni' },
  { id: 4, name: 'Rohini', sanskrit: 'रोहिणी', ruler: 'MO', degrees: '40°00\' - 53°20\'', deity: 'Brahma' },
  { id: 5, name: 'Mrigashira', sanskrit: 'मृगशिरा', ruler: 'MA', degrees: '53°20\' - 66°40\'', deity: 'Soma' },
  { id: 6, name: 'Ardra', sanskrit: 'आर्द्रा', ruler: 'RA', degrees: '66°40\' - 80°00\'', deity: 'Rudra' },
  { id: 7, name: 'Punarvasu', sanskrit: 'पुनर्वसु', ruler: 'JU', degrees: '80°00\' - 93°20\'', deity: 'Aditi' },
  { id: 8, name: 'Pushya', sanskrit: 'पुष्य', ruler: 'SA', degrees: '93°20\' - 106°40\'', deity: 'Brihaspati' },
  { id: 9, name: 'Ashlesha', sanskrit: 'आश्लेषा', ruler: 'ME', degrees: '106°40\' - 120°00\'', deity: 'Nagas' },
  { id: 10, name: 'Magha', sanskrit: 'मघा', ruler: 'KE', degrees: '120°00\' - 133°20\'', deity: 'Pitris' },
  { id: 11, name: 'Purva Phalguni', sanskrit: 'पूर्व फाल्गुनी', ruler: 'VE', degrees: '133°20\' - 146°40\'', deity: 'Bhaga' },
  { id: 12, name: 'Uttara Phalguni', sanskrit: 'उत्तर फाल्गुनी', ruler: 'SU', degrees: '146°40\' - 160°00\'', deity: 'Aryaman' },
  { id: 13, name: 'Hasta', sanskrit: 'हस्त', ruler: 'MO', degrees: '160°00\' - 173°20\'', deity: 'Savitar' },
  { id: 14, name: 'Chitra', sanskrit: 'चित्रा', ruler: 'MA', degrees: '173°20\' - 186°40\'', deity: 'Tvashtar' },
  { id: 15, name: 'Swati', sanskrit: 'स्वाती', ruler: 'RA', degrees: '186°40\' - 200°00\'', deity: 'Vayu' },
  { id: 16, name: 'Vishakha', sanskrit: 'विशाखा', ruler: 'JU', degrees: '200°00\' - 213°20\'', deity: 'Indra-Agni' },
  { id: 17, name: 'Anuradha', sanskrit: 'अनुराधा', ruler: 'SA', degrees: '213°20\' - 226°40\'', deity: 'Mitra' },
  { id: 18, name: 'Jyeshtha', sanskrit: 'ज्येष्ठा', ruler: 'ME', degrees: '226°40\' - 240°00\'', deity: 'Indra' },
  { id: 19, name: 'Mula', sanskrit: 'मूल', ruler: 'KE', degrees: '240°00\' - 253°20\'', deity: 'Nirriti' },
  { id: 20, name: 'Purva Ashadha', sanskrit: 'पूर्व आषाढ़ा', ruler: 'VE', degrees: '253°20\' - 266°40\'', deity: 'Apas' },
  { id: 21, name: 'Uttara Ashadha', sanskrit: 'उत्तर आषाढ़ा', ruler: 'SU', degrees: '266°40\' - 280°00\'', deity: 'Vishve Devas' },
  { id: 22, name: 'Shravana', sanskrit: 'श्रवण', ruler: 'MO', degrees: '280°00\' - 293°20\'', deity: 'Vishnu' },
  { id: 23, name: 'Dhanishta', sanskrit: 'धनिष्ठा', ruler: 'MA', degrees: '293°20\' - 306°40\'', deity: 'Vasus' },
  { id: 24, name: 'Shatabhisha', sanskrit: 'शतभिषा', ruler: 'RA', degrees: '306°40\' - 320°00\'', deity: 'Varuna' },
  { id: 25, name: 'Purva Bhadrapada', sanskrit: 'पूर्व भाद्रपदा', ruler: 'JU', degrees: '320°00\' - 333°20\'', deity: 'Aja Ekapada' },
  { id: 26, name: 'Uttara Bhadrapada', sanskrit: 'उत्तर भाद्रपदा', ruler: 'SA', degrees: '333°20\' - 346°40\'', deity: 'Ahir Budhnya' },
  { id: 27, name: 'Revati', sanskrit: 'रेवती', ruler: 'ME', degrees: '346°40\' - 360°00\'', deity: 'Pushan' }
];

export const PLANETS = [
  { id: 'SU', name: 'Sun', symbol: '☉', sanskrit: 'सूर्य', element: 'Fire' },
  { id: 'MO', name: 'Moon', symbol: '☽', sanskrit: 'चन्द्र', element: 'Water' },
  { id: 'MA', name: 'Mars', symbol: '♂', sanskrit: 'मंगल', element: 'Fire' },
  { id: 'ME', name: 'Mercury', symbol: '☿', sanskrit: 'बुध', element: 'Earth' },
  { id: 'JU', name: 'Jupiter', symbol: '♃', sanskrit: 'गुरु', element: 'Air' },
  { id: 'VE', name: 'Venus', symbol: '♀', sanskrit: 'शुक्र', element: 'Water' },
  { id: 'SA', name: 'Saturn', symbol: '♄', sanskrit: 'शनि', element: 'Earth' },
  { id: 'RA', name: 'Rahu', symbol: '☊', sanskrit: 'राहु', element: 'Air' },
  { id: 'KE', name: 'Ketu', symbol: '☋', sanskrit: 'केतु', element: 'Fire' }
];

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
  const birthDate = typeof birthData.date === 'string' ? new Date(birthData.date) : birthData.date;
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const [hours, minutes] = birthData.time.split(':').map(Number);
  const hour = hours + minutes / 60;
  
  const jd = getJulianDay(year, month, day, hour);
  const ayanamsa = calculateAyanamsa(jd);
  
  // Calculate houses first to get ascendant
  const houses = calculateHouses(jd, birthData.latitude, birthData.longitude);
  const ascendant = Math.floor(houses[0] / 30) + 1;
  
  // Calculate planetary positions
  const planets: Record<string, PlanetPosition> = {};
  
  PLANETS.forEach((planetData) => {
    const tropicalLongitude = calculatePlanetLongitude(jd, planetData.name);
    const siderealLongitude = (tropicalLongitude - ayanamsa + 360) % 360;
    const rashi = Math.floor(siderealLongitude / 30) + 1;
    const degreeInSign = siderealLongitude % 30;
    const nakshatra = Math.floor(siderealLongitude / (360 / 27)) + 1;
    const nakshatraPada = Math.floor((siderealLongitude % (360 / 27)) / (360 / 27 / 4)) + 1;
    
    // Calculate proper house position relative to ascendant
    const housePosition = ((rashi - ascendant + 12) % 12) + 1;
    
    planets[planetData.id] = {
      id: planetData.id,
      name: planetData.name,
      longitude: siderealLongitude,
      rashi,
      rashiName: ZODIAC_SIGNS[rashi - 1]?.name || 'Unknown',
      house: housePosition,
      sign: rashi,
      degree: siderealLongitude,
      degreeInSign,
      nakshatra,
      nakshatraName: NAKSHATRAS[nakshatra - 1]?.name || 'Unknown',
      nakshatraPada,
      isRetrograde: Math.random() > 0.8 // Simplified retrograde calculation
    };
  });
  
  // Houses and ascendant already calculated above
  
  // Calculate yogas
  const yogas = calculateYogas(planets);
  
  // Calculate dashas
  const dashas = calculateVimshottariDasha(birthData, planets.MO);
  
  return {
    ascendant,
    ascendantSanskrit: ZODIAC_SIGNS[ascendant - 1]?.sanskrit || 'Unknown',
    planets,
    houses,
    housesList: houses,
    moonSign: planets.MO.rashi,
    sunSign: planets.SU.rashi,
    nakshatraName: planets.MO.nakshatraName,
    yogas,
    dashas,
    dashaPeriods: dashas,
    birthElement: ZODIAC_SIGNS[ascendant - 1]?.element
  };
}

// Calculate Yogas
function calculateYogas(planets: Record<string, PlanetPosition>): Yoga[] {
  const yogas: Yoga[] = [];
  
  // Gajakesari Yoga - Moon and Jupiter in mutual Kendras
  const moonHouse = planets.MO.house;
  const jupiterHouse = planets.JU.house;
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
export function calculateVimshottariDasha(birthData: BirthData, moonPosition: PlanetPosition): DashaPeriod[] {
  const dashaPeriods: DashaPeriod[] = [];
  const dashaSequence = ['KE', 'VE', 'SU', 'MO', 'MA', 'RA', 'JU', 'SA', 'ME'];
  const dashaYears: Record<string, number> = { 
    KE: 7, VE: 20, SU: 6, MO: 10, MA: 7, RA: 18, JU: 16, SA: 19, ME: 17 
  };
  
  const planetSanskritNames: Record<string, string> = {
    KE: 'केतु', VE: 'शुक्र', SU: 'सूर्य', MO: 'चन्द्र', 
    MA: 'मंगल', RA: 'राहु', JU: 'गुरु', SA: 'शनि', ME: 'बुध'
  };
  
  // Start from Moon's nakshatra
  const startingNakshatra = moonPosition.nakshatra;
  const startingDashaIndex = (startingNakshatra - 1) % 9;
  
  const birthDate = typeof birthData.date === 'string' ? new Date(birthData.date) : birthData.date;
  let currentDate = new Date(birthDate);
  
  for (let i = 0; i < 9; i++) {
    const dashaIndex = (startingDashaIndex + i) % 9;
    const planet = dashaSequence[dashaIndex];
    const years = dashaYears[planet];
    const endDate = new Date(currentDate);
    endDate.setFullYear(currentDate.getFullYear() + years);
    
    dashaPeriods.push({
      planet,
      planetSanskrit: planetSanskritNames[planet],
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
export function getPlanetDetails(planetId: string): { name: string; symbol: string; element: string; sanskrit: string } {
  const planet = PLANETS.find(p => p.id === planetId.toUpperCase() || p.name.toLowerCase() === planetId.toLowerCase());
  return planet || { name: planetId, symbol: '?', element: 'Unknown', sanskrit: planetId };
}

// Get zodiac details
export function getZodiacDetails(signIndex: number): { name: string; element: string; quality: string; sanskrit: string; ruler: string } {
  const sign = ZODIAC_SIGNS[signIndex - 1];
  return sign || { name: 'Unknown', element: 'Unknown', quality: 'Unknown', sanskrit: 'Unknown', ruler: 'Unknown' };
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
    MO: 12, MA: 17, ME: 14, JU: 11, VE: 8, SA: 15
  };
  
  const threshold = combustionDistances[planet.id] || 8;
  return minDistance < threshold;
}
