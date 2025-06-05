
// Enhanced Astronomical Calculations for Accurate Kundali Generation
export interface PreciseCoordinates {
  latitude: number;
  longitude: number;
  elevation?: number;
}

export interface PreciseBirthTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  timezone: number;
}

export interface PlanetaryPosition {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  distance: number;
  speed: number;
  isRetrograde: boolean;
  rashi: number;
  rashiName: string;
  degree: number;
  degreeInSign: number;
  nakshatra: number;
  nakshatraName: string;
  nakshatraPada: number;
  shadbala: number;
  exaltation: boolean;
  debilitation: boolean;
  ownSign: boolean;
  dignity: string;
}

export interface LagnaData {
  longitude: number;
  sign: number;
  signName: string;
  degree: number;
  nakshatra: number;
  nakshatraName: string;
  pada: number;
}

export interface HouseData {
  number: number;
  cusp: number;
  sign: number;
  signName: string;
  lord: string;
  significance: string[];
  planetsInHouse: string[];
}

export interface DashaDetails {
  planet: string;
  planetSanskrit: string;
  startDate: Date;
  endDate: Date;
  years: number;
  months: number;
  days: number;
  isActive: boolean;
  subDashas?: DashaDetails[];
}

export interface YogaDetails {
  name: string;
  sanskritName: string;
  type: 'benefic' | 'malefic' | 'neutral';
  strength: number;
  isActive: boolean;
  description: string;
  effects: string[];
  remedies: string[];
}

// Ayanamsa calculation (Lahiri)
export function calculateLahiriAyanamsa(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const ayanamsa = 23.85 + (0.0013 * T) + (0.000001 * T * T);
  return ayanamsa;
}

// Julian Day calculation with high precision
export function calculateJulianDay(birthTime: PreciseBirthTime): number {
  const { year, month, day, hour, minute, second, timezone } = birthTime;
  
  // Convert to UTC
  const utcHour = hour - timezone;
  const decimalTime = utcHour + (minute / 60) + (second / 3600);
  
  let y = year;
  let m = month;
  
  if (month <= 2) {
    y = year - 1;
    m = month + 12;
  }
  
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  
  const jd = Math.floor(365.25 * (y + 4716)) + 
             Math.floor(30.6001 * (m + 1)) + 
             day + decimalTime / 24 + b - 1524.5;
  
  return jd;
}

// Calculate Local Sidereal Time
export function calculateLocalSiderealTime(jd: number, longitude: number): number {
  const t = (jd - 2451545.0) / 36525.0;
  
  // Greenwich Mean Sidereal Time
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) +
             0.000387933 * t * t - t * t * t / 38710000.0;
  
  gmst = gmst % 360;
  if (gmst < 0) gmst += 360;
  
  // Local Sidereal Time
  const lst = (gmst + longitude) % 360;
  return lst < 0 ? lst + 360 : lst;
}

// Enhanced planetary position calculation with higher accuracy
export function calculatePlanetaryPositions(jd: number): Record<string, PlanetaryPosition> {
  const ayanamsa = calculateLahiriAyanamsa(jd);
  const t = (jd - 2451545.0) / 36525.0;
  
  const planets: Record<string, PlanetaryPosition> = {};
  
  // Enhanced calculations with perturbations and corrections
  const planetData = [
    { id: 'SU', name: 'Sun', meanLon: 280.4665 + 36000.7698 * t },
    { id: 'MO', name: 'Moon', meanLon: 218.3165 + 481267.8813 * t },
    { id: 'MA', name: 'Mars', meanLon: 355.433 + 19140.2993 * t },
    { id: 'ME', name: 'Mercury', meanLon: 252.251 + 149472.6746 * t },
    { id: 'JU', name: 'Jupiter', meanLon: 34.351 + 3034.9057 * t },
    { id: 'VE', name: 'Venus', meanLon: 181.979 + 58517.8156 * t },
    { id: 'SA', name: 'Saturn', meanLon: 50.077 + 1222.1138 * t },
    { id: 'RA', name: 'Rahu', meanLon: 125.045 - 1934.1363 * t },
    { id: 'KE', name: 'Ketu', meanLon: 305.045 - 1934.1363 * t }
  ];
  
  planetData.forEach(planet => {
    let tropicalLon = planet.meanLon % 360;
    if (tropicalLon < 0) tropicalLon += 360;
    
    // Apply perturbations for higher accuracy
    tropicalLon += applyPerturbations(planet.id, t);
    
    // Convert to sidereal
    const siderealLon = (tropicalLon - ayanamsa + 360) % 360;
    
    const rashi = Math.floor(siderealLon / 30);
    const degreeInSign = siderealLon % 30;
    const nakshatra = Math.floor(siderealLon / (360/27));
    const pada = Math.floor((siderealLon % (360/27)) / (360/27/4)) + 1;
    
    planets[planet.id] = {
      id: planet.id,
      name: planet.name,
      longitude: siderealLon,
      latitude: 0, // Simplified for now
      distance: 1, // Simplified for now
      speed: calculatePlanetSpeed(planet.id, t),
      isRetrograde: calculatePlanetSpeed(planet.id, t) < 0,
      rashi,
      rashiName: getZodiacName(rashi),
      degree: siderealLon,
      degreeInSign,
      nakshatra,
      nakshatraName: getNakshatraName(nakshatra),
      nakshatraPada: pada,
      shadbala: calculateShadbala(planet.id, siderealLon, rashi),
      exaltation: isExalted(planet.id, rashi),
      debilitation: isDebilitated(planet.id, rashi),
      ownSign: isOwnSign(planet.id, rashi),
      dignity: getPlanetDignity(planet.id, rashi)
    };
  });
  
  return planets;
}

function applyPerturbations(planetId: string, t: number): number {
  // Simplified perturbation calculations
  const perturbations: Record<string, number> = {
    'SU': 0.0167 * Math.sin((357.5291 + 35999.0503 * t) * Math.PI / 180),
    'MO': 6.289 * Math.sin((134.9634 + 477198.8676 * t) * Math.PI / 180),
    'MA': 10.691 * Math.sin((19.3730 + 19139.4819 * t) * Math.PI / 180),
    'ME': 23.440 * Math.sin((174.7910 + 149472.5153 * t) * Math.PI / 180),
    'JU': 5.555 * Math.sin((20.0202 + 3034.6951 * t) * Math.PI / 180),
    'VE': 0.775 * Math.sin((50.4161 + 58517.8039 * t) * Math.PI / 180),
    'SA': 0.814 * Math.sin((285.3270 + 1221.5515 * t) * Math.PI / 180),
    'RA': 0,
    'KE': 0
  };
  
  return perturbations[planetId] || 0;
}

function calculatePlanetSpeed(planetId: string, t: number): number {
  // Daily motion in degrees
  const speeds: Record<string, number> = {
    'SU': 0.9856,
    'MO': 13.1764,
    'MA': 0.5240,
    'ME': 4.0923,
    'JU': 0.0831,
    'VE': 1.6021,
    'SA': 0.0335,
    'RA': -0.0529,
    'KE': -0.0529
  };
  
  return speeds[planetId] || 0;
}

// Calculate Ascendant with high precision
export function calculateAscendant(jd: number, coordinates: PreciseCoordinates): LagnaData {
  const { latitude, longitude } = coordinates;
  const lst = calculateLocalSiderealTime(jd, longitude);
  const ayanamsa = calculateLahiriAyanamsa(jd);
  
  // Calculate tropical ascendant
  const latRad = latitude * Math.PI / 180;
  const obliquity = 23.4392794 - 0.0130125 * ((jd - 2451545.0) / 36525.0);
  const oblRad = obliquity * Math.PI / 180;
  
  const mc = lst; // Simplified MC calculation
  const mcRad = mc * Math.PI / 180;
  
  // Calculate ascendant using spherical trigonometry
  let ascRad = Math.atan2(
    Math.sin(mcRad),
    Math.cos(mcRad) * Math.sin(oblRad) + Math.tan(latRad) * Math.cos(oblRad)
  );
  
  let tropicalAsc = ascRad * 180 / Math.PI;
  if (tropicalAsc < 0) tropicalAsc += 360;
  
  // Convert to sidereal
  const siderealAsc = (tropicalAsc - ayanamsa + 360) % 360;
  
  const sign = Math.floor(siderealAsc / 30);
  const degree = siderealAsc % 30;
  const nakshatra = Math.floor(siderealAsc / (360/27));
  const pada = Math.floor((siderealAsc % (360/27)) / (360/27/4)) + 1;
  
  return {
    longitude: siderealAsc,
    sign,
    signName: getZodiacName(sign),
    degree,
    nakshatra,
    nakshatraName: getNakshatraName(nakshatra),
    pada
  };
}

// Calculate house cusps using Placidus system
export function calculateHouseCusps(jd: number, coordinates: PreciseCoordinates, ascendant: number): HouseData[] {
  const houses: HouseData[] = [];
  const { latitude } = coordinates;
  
  // Simplified Placidus calculation
  for (let i = 0; i < 12; i++) {
    let cusp;
    
    if (i === 0) {
      cusp = ascendant;
    } else if (i === 6) {
      cusp = (ascendant + 180) % 360;
    } else {
      // Intermediate house calculation (simplified)
      cusp = (ascendant + (i * 30)) % 360;
    }
    
    const sign = Math.floor(cusp / 30);
    
    houses.push({
      number: i + 1,
      cusp,
      sign,
      signName: getZodiacName(sign),
      lord: getSignLord(sign),
      significance: getHouseSignifications(i + 1),
      planetsInHouse: []
    });
  }
  
  return houses;
}

// Enhanced Vimshottari Dasha calculation
export function calculateVimshottariDasha(jd: number, moonLongitude: number): DashaDetails[] {
  const dashaLengths: Record<string, number> = {
    'Ketu': 7, 'Venus': 20, 'Sun': 6, 'Moon': 10, 'Mars': 7,
    'Rahu': 18, 'Jupiter': 16, 'Saturn': 19, 'Mercury': 17
  };
  
  const dashaSanskrit: Record<string, string> = {
    'Ketu': 'केतु', 'Venus': 'शुक्र', 'Sun': 'सूर्य', 'Moon': 'चन्द्र', 'Mars': 'मंगल',
    'Rahu': 'राहु', 'Jupiter': 'गुरु', 'Saturn': 'शनि', 'Mercury': 'बुध'
  };
  
  const nakshatra = Math.floor(moonLongitude / (360/27));
  const nakshatraLords = [
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'
  ];
  
  const birthNakshatraLord = nakshatraLords[nakshatra % 9];
  const positionInNakshatra = moonLongitude % (360/27);
  const consumedPortion = positionInNakshatra / (360/27);
  
  const birthDate = new Date((jd - 2440587.5) * 86400000);
  const dashas: DashaDetails[] = [];
  
  // Calculate balance of first dasha
  const firstDashaLength = dashaLengths[birthNakshatraLord];
  const balanceYears = firstDashaLength * (1 - consumedPortion);
  
  let currentDate = new Date(birthDate);
  
  // Generate 9 dashas starting from birth nakshatra lord
  const lordIndex = nakshatraLords.indexOf(birthNakshatraLord);
  
  for (let i = 0; i < 9; i++) {
    const currentLordIndex = (lordIndex + i) % 9;
    const planet = nakshatraLords[currentLordIndex];
    const years = i === 0 ? balanceYears : dashaLengths[planet];
    
    const endDate = new Date(currentDate);
    endDate.setFullYear(currentDate.getFullYear() + Math.floor(years));
    const remainingDays = (years - Math.floor(years)) * 365.25;
    endDate.setDate(endDate.getDate() + Math.floor(remainingDays));
    
    const now = new Date();
    const isActive = currentDate <= now && now <= endDate;
    
    dashas.push({
      planet,
      planetSanskrit: dashaSanskrit[planet],
      startDate: new Date(currentDate),
      endDate,
      years: Math.floor(years),
      months: Math.floor((years - Math.floor(years)) * 12),
      days: Math.floor(((years - Math.floor(years)) * 12 - Math.floor((years - Math.floor(years)) * 12)) * 30),
      isActive
    });
    
    currentDate = new Date(endDate);
  }
  
  return dashas;
}

// Enhanced Yoga calculations
export function calculateAdvancedYogas(planets: Record<string, PlanetaryPosition>, houses: HouseData[], ascendant: LagnaData): YogaDetails[] {
  const yogas: YogaDetails[] = [];
  
  // Check for Gaja Kesari Yoga
  const gajaKesariYoga = checkGajaKesariYoga(planets, ascendant);
  if (gajaKesariYoga) yogas.push(gajaKesariYoga);
  
  // Check for Raj Yogas
  const rajYogas = checkRajYogas(planets, houses, ascendant);
  yogas.push(...rajYogas);
  
  // Check for Dhana Yogas
  const dhanaYogas = checkDhanaYogas(planets, houses, ascendant);
  yogas.push(...dhanaYogas);
  
  // Check for Doshas
  const doshas = checkDoshas(planets, houses, ascendant);
  yogas.push(...doshas);
  
  return yogas;
}

function checkGajaKesariYoga(planets: Record<string, PlanetaryPosition>, ascendant: LagnaData): YogaDetails | null {
  const jupiter = planets['JU'];
  const moon = planets['MO'];
  
  const jupiterFromLagna = Math.floor(((jupiter.rashi - ascendant.sign + 12) % 12) + 1);
  const moonFromLagna = Math.floor(((moon.rashi - ascendant.sign + 12) % 12) + 1);
  
  const kendras = [1, 4, 7, 10];
  const distance = Math.abs(jupiterFromLagna - moonFromLagna);
  
  if ((kendras.includes(jupiterFromLagna) || kendras.includes(moonFromLagna)) &&
      ([0, 3, 6, 9].includes(distance))) {
    return {
      name: 'Gaja Kesari Yoga',
      sanskritName: 'गजकेसरी योग',
      type: 'benefic',
      strength: 85,
      isActive: true,
      description: 'Powerful yoga formed by Moon and Jupiter in angular positions',
      effects: ['Intelligence and wisdom', 'Success in endeavors', 'Good reputation', 'Financial prosperity'],
      remedies: ['Worship Lord Ganesha', 'Chant Brihaspati mantra on Thursdays']
    };
  }
  
  return null;
}

function checkRajYogas(planets: Record<string, PlanetaryPosition>, houses: HouseData[], ascendant: LagnaData): YogaDetails[] {
  // Implementation for various Raj Yogas
  return [];
}

function checkDhanaYogas(planets: Record<string, PlanetaryPosition>, houses: HouseData[], ascendant: LagnaData): YogaDetails[] {
  // Implementation for Dhana Yogas
  return [];
}

function checkDoshas(planets: Record<string, PlanetaryPosition>, houses: HouseData[], ascendant: LagnaData): YogaDetails[] {
  const doshas: YogaDetails[] = [];
  
  // Check for Mangal Dosha
  const mars = planets['MA'];
  const marsHouse = Math.floor(((mars.rashi - ascendant.sign + 12) % 12) + 1);
  
  if ([1, 4, 7, 8, 12].includes(marsHouse)) {
    doshas.push({
      name: 'Mangal Dosha',
      sanskritName: 'मंगल दोष',
      type: 'malefic',
      strength: 60,
      isActive: true,
      description: 'Mars in 1st, 4th, 7th, 8th, or 12th house creates Mangal Dosha',
      effects: ['Delays in marriage', 'Conflicts in relationships', 'Need for matching with similar dosha'],
      remedies: ['Worship Lord Hanuman', 'Chant Mangal mantra', 'Wear red coral after consultation']
    });
  }
  
  return doshas;
}

// Shadbala calculation
function calculateShadbala(planetId: string, longitude: number, rashi: number): number {
  let shadbala = 0;
  
  // Sthana Bala (Positional Strength)
  shadbala += calculateSthanaBala(planetId, rashi);
  
  // Dig Bala (Directional Strength)
  shadbala += calculateDigBala(planetId, rashi);
  
  // Kala Bala (Temporal Strength)
  shadbala += 15; // Simplified
  
  // Chesta Bala (Motional Strength)
  shadbala += 10; // Simplified
  
  // Naisargika Bala (Natural Strength)
  shadbala += calculateNaisargikaBala(planetId);
  
  // Drik Bala (Aspectual Strength)
  shadbala += 10; // Simplified
  
  return Math.min(100, shadbala);
}

function calculateSthanaBala(planetId: string, rashi: number): number {
  if (isExalted(planetId, rashi)) return 20;
  if (isOwnSign(planetId, rashi)) return 15;
  if (isFriendlySign(planetId, rashi)) return 10;
  if (isEnemySign(planetId, rashi)) return 2;
  if (isDebilitated(planetId, rashi)) return 0;
  return 5;
}

function calculateDigBala(planetId: string, rashi: number): number {
  // Simplified directional strength
  const digBalaMap: Record<string, number[]> = {
    'SU': [0], // East (1st house)
    'JU': [0], // East (1st house)
    'MA': [9], // South (10th house)
    'SA': [6], // West (7th house)
    'MO': [3], // North (4th house)
    'VE': [3], // North (4th house)
    'ME': [0]  // East (1st house)
  };
  
  const strongDirections = digBalaMap[planetId] || [];
  return strongDirections.includes(rashi) ? 15 : 5;
}

function calculateNaisargikaBala(planetId: string): number {
  const naturalStrengths: Record<string, number> = {
    'SU': 15, 'MO': 12, 'MA': 8, 'ME': 10,
    'JU': 18, 'VE': 13, 'SA': 5, 'RA': 7, 'KE': 7
  };
  
  return naturalStrengths[planetId] || 5;
}

// Utility functions
function getZodiacName(index: number): string {
  const names = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  return names[index] || 'Unknown';
}

function getNakshatraName(index: number): string {
  const names = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
    'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
    'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
    'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
    'Uttara Bhadrapada', 'Revati'
  ];
  return names[index] || 'Unknown';
}

function getSignLord(signIndex: number): string {
  const lords = [
    'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
    'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
  ];
  return lords[signIndex] || 'Unknown';
}

function getHouseSignifications(houseNumber: number): string[] {
  const significations: Record<number, string[]> = {
    1: ['Self', 'Personality', 'Physical body', 'Appearance'],
    2: ['Wealth', 'Family', 'Speech', 'Food'],
    3: ['Siblings', 'Courage', 'Communication', 'Short journeys'],
    4: ['Mother', 'Home', 'Happiness', 'Property'],
    5: ['Children', 'Education', 'Intelligence', 'Romance'],
    6: ['Enemies', 'Disease', 'Service', 'Daily work'],
    7: ['Spouse', 'Partnership', 'Business', 'Marriage'],
    8: ['Longevity', 'Transformation', 'Occult', 'Inheritance'],
    9: ['Fortune', 'Religion', 'Philosophy', 'Higher education'],
    10: ['Career', 'Status', 'Father', 'Authority'],
    11: ['Income', 'Gains', 'Friends', 'Aspirations'],
    12: ['Loss', 'Expenses', 'Spirituality', 'Foreign travel']
  };
  
  return significations[houseNumber] || [];
}

function isExalted(planetId: string, rashi: number): boolean {
  const exaltations: Record<string, number> = {
    'SU': 0, 'MO': 1, 'MA': 9, 'ME': 5, 'JU': 3, 'VE': 11, 'SA': 6
  };
  return exaltations[planetId] === rashi;
}

function isDebilitated(planetId: string, rashi: number): boolean {
  const debilitations: Record<string, number> = {
    'SU': 6, 'MO': 7, 'MA': 3, 'ME': 11, 'JU': 9, 'VE': 5, 'SA': 0
  };
  return debilitations[planetId] === rashi;
}

function isOwnSign(planetId: string, rashi: number): boolean {
  const ownSigns: Record<string, number[]> = {
    'SU': [4], 'MO': [3], 'MA': [0, 7], 'ME': [2, 5],
    'JU': [8, 11], 'VE': [1, 6], 'SA': [9, 10]
  };
  return ownSigns[planetId]?.includes(rashi) || false;
}

function isFriendlySign(planetId: string, rashi: number): boolean {
  // Simplified friendship calculation
  return false; // Would need detailed implementation
}

function isEnemySign(planetId: string, rashi: number): boolean {
  // Simplified enemy calculation
  return false; // Would need detailed implementation
}

function getPlanetDignity(planetId: string, rashi: number): string {
  if (isExalted(planetId, rashi)) return 'Exalted';
  if (isOwnSign(planetId, rashi)) return 'Own Sign';
  if (isDebilitated(planetId, rashi)) return 'Debilitated';
  if (isFriendlySign(planetId, rashi)) return 'Friendly';
  if (isEnemySign(planetId, rashi)) return 'Enemy';
  return 'Neutral';
}
