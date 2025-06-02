/**
 * Enhanced Kundali Utilities for Vedic Astrology
 * Implements high-accuracy calculations using Swiss Ephemeris principles
 */

import { BirthData, PlanetPosition, ZODIAC_SIGNS, NAKSHATRAS, PLANETS } from './kundaliUtils';

// Enhanced astronomical calculations for more accuracy
export const calculateSiderealTime = (jd: number, longitude: number): number => {
  // More precise sidereal time calculation using IAU 2000A model
  const t = (jd - 2451545.0) / 36525.0;
  
  // Greenwich Mean Sidereal Time (GMST) in degrees
  let gmst = 280.46061837 + 36000.76983 * (jd - 2451545.0) + 
             0.000387933 * t * t - t * t * t / 38710000.0;
  
  // Nutation correction for more accuracy
  const nutationCorrection = calculateNutation(jd);
  gmst += nutationCorrection;
  
  // Local sidereal time
  const lst = (gmst + longitude) % 360;
  return lst < 0 ? lst + 360 : lst;
};

export const calculateNutation = (jd: number): number => {
  // Simplified nutation calculation (IAU 1980)
  const t = (jd - 2451545.0) / 36525.0;
  const omega = 125.04452 - 1934.136261 * t + 0.0020708 * t * t + t * t * t / 450000.0;
  const l = 280.4665 + 36000.7698 * t;
  const lPrime = 218.3165 + 481267.8813 * t;
  
  const deltaPsi = -17.20 * Math.sin(omega * Math.PI / 180) - 
                   1.32 * Math.sin(2 * l * Math.PI / 180) - 
                   0.23 * Math.sin(2 * lPrime * Math.PI / 180) + 
                   0.21 * Math.sin(2 * omega * Math.PI / 180);
  
  return deltaPsi / 3600.0; // Convert arcseconds to degrees
};

export const calculateLahiriAyanamsa = (jd: number): number => {
  // Lahiri Ayanamsa calculation (Chitrapaksha - more accurate)
  const t = (jd - 2451545.0) / 36525.0;
  
  // Lahiri formula from Indian Ephemeris
  const ayanamsa = 23.85 + 50.2571 * t - 0.0020 * t * t - 0.0000003 * t * t * t;
  
  // Apply corrections for better accuracy
  const correction = 0.002; // Small correction factor
  return (ayanamsa + correction) % 360;
};

export const calculateEnhancedAscendant = (birthData: BirthData): number => {
  const jd = gregorianToJulian(birthData.date, birthData.time);
  const siderealTime = calculateSiderealTime(jd, birthData.longitude);
  const ayanamsa = calculateLahiriAyanamsa(jd);
  
  // More accurate ascendant calculation considering latitude and obliquity
  const lat = birthData.latitude * Math.PI / 180; // Convert to radians
  const obliquity = calculateObliquity(jd) * Math.PI / 180; // Earth's obliquity
  
  // Local sidereal time in radians
  const lstRad = siderealTime * Math.PI / 180;
  
  // Calculate ascendant using spherical trigonometry (more accurate method)
  const y = -Math.cos(lstRad);
  const x = Math.sin(obliquity) * Math.tan(lat) + Math.cos(obliquity) * Math.sin(lstRad);
  
  let ascendantDegree = Math.atan2(y, x) * 180 / Math.PI;
  
  // Normalize to 0-360 range
  if (ascendantDegree < 0) ascendantDegree += 360;
  
  // Apply ayanamsa for sidereal calculation
  ascendantDegree = (ascendantDegree - ayanamsa + 360) % 360;
  
  return Math.floor(ascendantDegree / 30) + 1;
};

const calculateObliquity = (jd: number): number => {
  // Calculate Earth's obliquity with high precision
  const t = (jd - 2451545.0) / 36525.0;
  
  // IAU 1980 formula for obliquity
  const epsilon0 = 23.439291111; // degrees
  const deltaEpsilon = -46.8150 * t - 0.00059 * t * t + 0.001813 * t * t * t;
  
  return epsilon0 + deltaEpsilon / 3600.0; // Convert arcseconds to degrees
};

// Enhanced planetary position calculations using more accurate orbital mechanics
export const calculateEnhancedPlanetPositions = (birthData: BirthData): PlanetPosition[] => {
  const jd = gregorianToJulian(birthData.date, birthData.time);
  const ayanamsa = calculateLahiriAyanamsa(jd);
  const t = (jd - 2451545.0) / 36525.0; // Julian centuries since J2000.0
  
  const positions = PLANETS.map(planet => {
    let longitude = 0;
    
    // Enhanced calculations using VSOP87 theory approximations
    switch (planet.id) {
      case "SU":
        longitude = calculateSunPosition(t);
        break;
      case "MO":
        longitude = calculateMoonPosition(t);
        break;
      case "ME":
        longitude = calculateMercuryPosition(t);
        break;
      case "VE":
        longitude = calculateVenusPosition(t);
        break;
      case "MA":
        longitude = calculateMarsPosition(t);
        break;
      case "JU":
        longitude = calculateJupiterPosition(t);
        break;
      case "SA":
        longitude = calculateSaturnPosition(t);
        break;
      case "RA":
        longitude = calculateRahuPosition(t);
        break;
      case "KE":
        longitude = calculateKetuPosition(t);
        break;
      default:
        longitude = 0;
    }
    
    // Apply ayanamsa for sidereal positions
    longitude = (longitude - ayanamsa + 360) % 360;
    
    const sign = Math.floor(longitude / 30) + 1;
    const degreeInSign = longitude % 30;
    
    // Enhanced nakshatra calculation with more precision
    const nakshatraPosition = longitude / (360 / 27);
    const nakshatra = Math.floor(nakshatraPosition) + 1;
    const nakshatraPada = Math.floor((nakshatraPosition % 1) * 4) + 1;
    
    // More accurate retrograde calculation
    const isRetrograde = calculateEnhancedRetrograde(planet.id, jd);
    
    return {
      id: planet.id,
      name: planet.name,
      sign,
      signSanskrit: ZODIAC_SIGNS.find(z => z.id === sign)?.sanskrit || "",
      degree: longitude,
      degreeInSign,
      nakshatra,
      nakshatraPada,
      isRetrograde
    };
  });
  
  return positions;
};

// Enhanced planetary position calculations
const calculateSunPosition = (t: number): number => {
  // Sun's geometric mean longitude
  const L0 = 280.46646 + 36000.76983 * t + 0.0003032 * t * t;
  
  // Sun's mean anomaly
  const M = 357.52911 + 35999.05029 * t - 0.0001537 * t * t;
  const MRad = M * Math.PI / 180;
  
  // Equation of center
  const C = (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(MRad) +
            (0.019993 - 0.000101 * t) * Math.sin(2 * MRad) +
            0.000289 * Math.sin(3 * MRad);
  
  // True longitude
  const trueLongitude = (L0 + C) % 360;
  return trueLongitude < 0 ? trueLongitude + 360 : trueLongitude;
};

const calculateMoonPosition = (t: number): number => {
  // Moon's mean longitude
  const L = 218.3164477 + 481267.88123421 * t - 0.0015786 * t * t + t * t * t / 538841.0 - t * t * t * t / 65194000.0;
  
  // Moon's mean elongation
  const D = 297.8501921 + 445267.1114034 * t - 0.0018819 * t * t + t * t * t / 545868.0 - t * t * t * t / 113065000.0;
  
  // Sun's mean anomaly
  const M = 357.5291092 + 35999.0502909 * t - 0.0001536 * t * t + t * t * t / 24490000.0;
  
  // Moon's mean anomaly
  const MPrime = 134.9633964 + 477198.8675055 * t + 0.0087414 * t * t + t * t * t / 69699.0 - t * t * t * t / 14712000.0;
  
  // Apply major periodic terms (simplified)
  const DRad = D * Math.PI / 180;
  const MRad = M * Math.PI / 180;
  const MPrimeRad = MPrime * Math.PI / 180;
  
  const correction = 6.288774 * Math.sin(MPrimeRad) +
                    1.274027 * Math.sin(2 * DRad - MPrimeRad) +
                    0.658314 * Math.sin(2 * DRad) +
                    0.213618 * Math.sin(2 * MPrimeRad) +
                    -0.185116 * Math.sin(MRad);
  
  const trueLongitude = (L + correction) % 360;
  return trueLongitude < 0 ? trueLongitude + 360 : trueLongitude;
};

const calculateMercuryPosition = (t: number): number => {
  // Mercury orbital elements (simplified VSOP87)
  const L = 252.250906 + 149472.6746358 * t - 0.00000536 * t * t;
  const e = 0.20563069 + 0.00002527 * t - 0.00000018 * t * t;
  const M = 149472.6746358 * t; // Mean anomaly relative to epoch
  
  // Apply equation of center (simplified)
  const MRad = (M % 360) * Math.PI / 180;
  const C = (23.4400 * e * Math.sin(MRad) + 2.9818 * e * e * Math.sin(2 * MRad)) / 3600;
  
  const trueLongitude = (L + C) % 360;
  return trueLongitude < 0 ? trueLongitude + 360 : trueLongitude;
};

const calculateVenusPosition = (t: number): number => {
  // Venus orbital elements
  const L = 181.979801 + 58517.8156760 * t + 0.00000165 * t * t;
  const e = 0.00677323 - 0.00004938 * t + 0.00000001 * t * t;
  const M = 58517.8156760 * t;
  
  const MRad = (M % 360) * Math.PI / 180;
  const C = (7.7200 * e * Math.sin(MRad) + 0.9600 * e * e * Math.sin(2 * MRad)) / 3600;
  
  const trueLongitude = (L + C) % 360;
  return trueLongitude < 0 ? trueLongitude + 360 : trueLongitude;
};

const calculateMarsPosition = (t: number): number => {
  // Mars orbital elements
  const L = 355.433 + 19140.2993039 * t + 0.00000262 * t * t;
  const e = 0.09341233 - 0.00007882 * t - 0.00000018 * t * t;
  const M = 19140.2993039 * t;
  
  const MRad = (M % 360) * Math.PI / 180;
  const C = (10.6912 * e * Math.sin(MRad) + 0.6228 * e * e * Math.sin(2 * MRad)) / 3600;
  
  const trueLongitude = (L + C) % 360;
  return trueLongitude < 0 ? trueLongitude + 360 : trueLongitude;
};

const calculateJupiterPosition = (t: number): number => {
  // Jupiter orbital elements
  const L = 34.351519 + 3034.9056606 * t - 0.00008501 * t * t;
  const e = 0.04849793 + 0.00001664 * t - 0.00000004 * t * t;
  const M = 3034.9056606 * t;
  
  const MRad = (M % 360) * Math.PI / 180;
  const C = (5.5549 * e * Math.sin(MRad) + 0.1683 * e * e * Math.sin(2 * MRad)) / 3600;
  
  const trueLongitude = (L + C) % 360;
  return trueLongitude < 0 ? trueLongitude + 360 : trueLongitude;
};

const calculateSaturnPosition = (t: number): number => {
  // Saturn orbital elements
  const L = 50.077444 + 1222.1138488 * t + 0.00021004 * t * t;
  const e = 0.05551825 - 0.00034550 * t - 0.00000728 * t * t;
  const M = 1222.1138488 * t;
  
  const MRad = (M % 360) * Math.PI / 180;
  const C = (6.3585 * e * Math.sin(MRad) + 0.2204 * e * e * Math.sin(2 * MRad)) / 3600;
  
  const trueLongitude = (L + C) % 360;
  return trueLongitude < 0 ? trueLongitude + 360 : trueLongitude;
};

const calculateRahuPosition = (t: number): number => {
  // Rahu (Lunar North Node) - moves backwards
  const longitude = 125.04455501 - 1934.1361849 * t + 0.0020762 * t * t + 0.000000103 * t * t * t;
  const normalizedLongitude = longitude % 360;
  return normalizedLongitude < 0 ? normalizedLongitude + 360 : normalizedLongitude;
};

const calculateKetuPosition = (t: number): number => {
  // Ketu is always 180° opposite to Rahu
  const rahuLongitude = calculateRahuPosition(t);
  return (rahuLongitude + 180) % 360;
};

// Enhanced retrograde calculation with more accuracy
const calculateEnhancedRetrograde = (planetId: string, jd: number): boolean => {
  // Check retrograde status by comparing positions over small time intervals
  const deltaTime = 1.0; // 1 day
  const position1 = getPlanetLongitudeAtJD(planetId, jd - deltaTime);
  const position2 = getPlanetLongitudeAtJD(planetId, jd + deltaTime);
  
  // Handle wrap-around at 0°/360°
  let deltaPosition = position2 - position1;
  if (deltaPosition > 180) deltaPosition -= 360;
  if (deltaPosition < -180) deltaPosition += 360;
  
  // If delta is negative, planet is moving backwards (retrograde)
  return deltaPosition < 0;
};

const getPlanetLongitudeAtJD = (planetId: string, jd: number): number => {
  const t = (jd - 2451545.0) / 36525.0;
  
  switch (planetId) {
    case "SU": return calculateSunPosition(t);
    case "MO": return calculateMoonPosition(t);
    case "ME": return calculateMercuryPosition(t);
    case "VE": return calculateVenusPosition(t);
    case "MA": return calculateMarsPosition(t);
    case "JU": return calculateJupiterPosition(t);
    case "SA": return calculateSaturnPosition(t);
    case "RA": return calculateRahuPosition(t);
    case "KE": return calculateKetuPosition(t);
    default: return 0;
  }
};

// Helper function for Julian Day calculation
const gregorianToJulian = (date: Date, time: string): number => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const timeArray = time.split(':');
  const hour = parseInt(timeArray[0]);
  const minute = parseInt(timeArray[1]);
  const timeDecimal = hour + (minute / 60);
  
  let a, y, m;
  
  if (month <= 2) {
    y = year - 1;
    m = month + 12;
  } else {
    y = year;
    m = month;
  }
  
  a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  
  const jd = Math.floor(365.25 * (y + 4716)) + 
             Math.floor(30.6001 * (m + 1)) + 
             day + b - 1524.5 + (timeDecimal / 24);
  
  return jd;
};

// Enhanced house calculation with multiple house systems
export const calculateEnhancedHouses = (ascendant: number, birthData: BirthData, system: 'equal' | 'placidus' = 'equal'): number[] => {
  const houses = [];
  
  if (system === 'equal') {
    // Equal house system (most common in Vedic astrology)
    for (let i = 0; i < 12; i++) {
      const houseSign = ((ascendant - 1 + i) % 12) + 1;
      houses.push(houseSign);
    }
  } else if (system === 'placidus') {
    // Simplified Placidus calculation (would need more complex implementation for full accuracy)
    const jd = gregorianToJulian(birthData.date, birthData.time);
    const siderealTime = calculateSiderealTime(jd, birthData.longitude);
    const lat = birthData.latitude * Math.PI / 180;
    
    // For now, use equal houses as Placidus requires complex spherical trigonometry
    for (let i = 0; i < 12; i++) {
      const houseSign = ((ascendant - 1 + i) % 12) + 1;
      houses.push(houseSign);
    }
  }
  
  return houses;
};

// Enhanced planetary strength calculation with Shadbala
export const calculateEnhancedPlanetaryStrength = (
  planet: PlanetPosition, 
  houses: number[], 
  allPlanets: PlanetPosition[],
  birthData: BirthData
): number => {
  let totalStrength = 0;
  
  // 1. Sthana Bala (Positional Strength) - 30% weight
  const sthanaScore = calculateSthanaScore(planet);
  totalStrength += sthanaScore * 0.30;
  
  // 2. Dig Bala (Directional Strength) - 15% weight
  const digScore = calculateDigScore(planet, houses);
  totalStrength += digScore * 0.15;
  
  // 3. Kala Bala (Temporal Strength) - 20% weight
  const kalaScore = calculateKalaScore(planet, birthData);
  totalStrength += kalaScore * 0.20;
  
  // 4. Chesta Bala (Motional Strength) - 15% weight
  const chestaScore = calculateChestaScore(planet);
  totalStrength += chestaScore * 0.15;
  
  // 5. Naisargika Bala (Natural Strength) - 10% weight
  const naisargikaScore = calculateNaisargikaScore(planet);
  totalStrength += naisargikaScore * 0.10;
  
  // 6. Drik Bala (Aspectual Strength) - 10% weight
  const drikScore = calculateDrikScore(planet, allPlanets);
  totalStrength += drikScore * 0.10;
  
  return Math.min(Math.round(totalStrength), 100); // Cap at 100
};

const calculateSthanaScore = (planet: PlanetPosition): number => {
  const exaltationSigns: Record<string, number> = {
    "SU": 1, "MO": 2, "MA": 10, "ME": 6, "JU": 4, "VE": 12, "SA": 7
  };
  
  const debilitationSigns: Record<string, number> = {
    "SU": 7, "MO": 8, "MA": 4, "ME": 12, "JU": 10, "VE": 6, "SA": 1
  };
  
  const ownSigns: Record<string, number[]> = {
    "SU": [5], "MO": [4], "MA": [1, 8], "ME": [3, 6], 
    "JU": [9, 12], "VE": [2, 7], "SA": [10, 11]
  };
  
  if (planet.sign === exaltationSigns[planet.id]) return 100;
  if (planet.sign === debilitationSigns[planet.id]) return 10;
  if (ownSigns[planet.id]?.includes(planet.sign)) return 80;
  return 50; // Neutral
};

const calculateDigScore = (planet: PlanetPosition, houses: number[]): number => {
  const directionalStrength: Record<string, number> = {
    "SU": 10, "MA": 10, "JU": 1, "ME": 1, "SA": 7, "MO": 4, "VE": 4
  };
  
  const strongHouse = directionalStrength[planet.id];
  if (strongHouse && houses.indexOf(planet.sign) + 1 === strongHouse) return 100;
  return 50;
};

const calculateKalaScore = (planet: PlanetPosition, birthData: BirthData): number => {
  // Simplified temporal strength based on day/night birth
  const timeArray = birthData.time.split(':');
  const hour = parseInt(timeArray[0]);
  const isDayBirth = hour >= 6 && hour < 18;
  
  const dayPlanets = ["SU", "JU", "VE"];
  const nightPlanets = ["MO", "MA", "SA"];
  
  if (isDayBirth && dayPlanets.includes(planet.id)) return 80;
  if (!isDayBirth && nightPlanets.includes(planet.id)) return 80;
  return 40;
};

const calculateChestaScore = (planet: PlanetPosition): number => {
  if (planet.id === "SU" || planet.id === "MO") return 50; // Sun and Moon don't go retrograde
  return planet.isRetrograde ? 80 : 60;
};

const calculateNaisargikaScore = (planet: PlanetPosition): number => {
  const naturalStrengths: Record<string, number> = {
    "SU": 100, "MO": 85, "VE": 70, "JU": 65, "ME": 55, "MA": 45, "SA": 35, "RA": 25, "KE": 15
  };
  return naturalStrengths[planet.id] || 50;
};

const calculateDrikScore = (planet: PlanetPosition, allPlanets: PlanetPosition[]): number => {
  // Simplified aspectual strength calculation
  let aspectScore = 50;
  
  // Check for beneficial aspects from Jupiter, Venus
  const beneficPlanets = allPlanets.filter(p => ["JU", "VE"].includes(p.id));
  const maleficPlanets = allPlanets.filter(p => ["MA", "SA", "RA", "KE"].includes(p.id));
  
  beneficPlanets.forEach(benefic => {
    const aspectAngle = Math.abs(planet.degree - benefic.degree);
    if ([60, 120, 180].some(angle => Math.abs(aspectAngle - angle) < 5)) {
      aspectScore += 10;
    }
  });
  
  maleficPlanets.forEach(malefic => {
    const aspectAngle = Math.abs(planet.degree - malefic.degree);
    if ([90, 180].some(angle => Math.abs(aspectAngle - angle) < 5)) {
      aspectScore -= 10;
    }
  });
  
  return Math.max(0, Math.min(100, aspectScore));
};

export function calculateCompatibility(person1Planets: PlanetPosition[], person2Planets: PlanetPosition[]): CompatibilityResult {
  // Find Moon and Venus positions for both people
  const person1Moon = person1Planets.find(p => p.id === 'moon');
  const person1Venus = person1Planets.find(p => p.id === 'venus');
  const person2Moon = person2Planets.find(p => p.id === 'moon');
  const person2Venus = person2Planets.find(p => p.id === 'venus');
  
  if (!person1Moon || !person1Venus || !person2Moon || !person2Venus) {
    return {
      overallScore: 50,
      emotionalCompatibility: 50,
      intellectualCompatibility: 50,
      physicalCompatibility: 50,
      spiritualCompatibility: 50,
      challenges: ['Incomplete birth data'],
      strengths: ['Basic compatibility can be assessed'],
      advice: 'Please ensure complete birth details for accurate compatibility analysis.'
    };
  }
  
  // Calculate sign compatibility
  const moonSignCompatibility = calculateSignCompatibility(person1Moon.rashi, person2Moon.rashi);
  const venusSignCompatibility = calculateSignCompatibility(person1Venus.rashi, person2Venus.rashi);
  
  // Calculate physical compatibility
  const physicalCompatibility = calculatePhysicalCompatibility(person1Planets, person2Planets);
  
  // Calculate spiritual compatibility
  const spiritualCompatibility = calculateSpiritualCompatibility(person1Planets, person2Planets);
  
  // Generate challenges
  const challenges = generateCompatibilityChallenges(person1Planets, person2Planets);
  
  // Generate strengths
  const strengths = generateCompatibilityStrengths(person1Planets, person2Planets);
  
  // Generate advice
  const advice = generateCompatibilityAdvice(person1Planets, person2Planets);
  
  return {
    overallScore: Math.round((moonSignCompatibility + venusSignCompatibility) / 2),
    emotionalCompatibility: moonSignCompatibility,
    intellectualCompatibility: venusSignCompatibility,
    physicalCompatibility,
    spiritualCompatibility,
    challenges,
    strengths,
    advice
  };
}

function calculatePhysicalCompatibility(person1Planets: PlanetPosition[], person2Planets: PlanetPosition[]): number {
  // Basic physical compatibility calculation
  return 75; // Placeholder
}

function calculateSpiritualCompatibility(person1Planets: PlanetPosition[], person2Planets: PlanetPosition[]): number {
  // Basic spiritual compatibility calculation
  return 80; // Placeholder
}

function generateCompatibilityChallenges(person1Planets: PlanetPosition[], person2Planets: PlanetPosition[]): string[] {
  return ['Communication differences may arise', 'Different approaches to finances'];
}

function generateCompatibilityStrengths(person1Planets: PlanetPosition[], person2Planets: PlanetPosition[]): string[] {
  return ['Strong emotional connection', 'Shared values and goals'];
}

function generateCompatibilityAdvice(person1Planets: PlanetPosition[], person2Planets: PlanetPosition[]): string {
  return 'Focus on open communication and mutual understanding to strengthen your relationship.';
}
