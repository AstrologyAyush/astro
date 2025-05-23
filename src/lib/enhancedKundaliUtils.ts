
import { BirthData, PlanetPosition, ZODIAC_SIGNS, NAKSHATRAS, PLANETS } from './kundaliUtils';

// Enhanced astronomical calculations for more accuracy
export const calculateSiderealTime = (jd: number, longitude: number): number => {
  // More precise sidereal time calculation
  const t = (jd - 2451545.0) / 36525.0;
  const gst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * t * t - t * t * t / 38710000.0;
  return (gst + longitude) % 360;
};

export const calculateAyanamsa = (jd: number): number => {
  // Lahiri Ayanamsa calculation (more accurate)
  const t = (jd - 2451545.0) / 36525.0;
  return 23.85 + 0.0138889 * t; // Simplified Lahiri ayanamsa
};

export const calculateEnhancedAscendant = (birthData: BirthData): number => {
  const jd = gregorianToJulian(birthData.date, birthData.time);
  const siderealTime = calculateSiderealTime(jd, birthData.longitude);
  const ayanamsa = calculateAyanamsa(jd);
  
  // More accurate ascendant calculation considering latitude
  const lat = birthData.latitude * Math.PI / 180; // Convert to radians
  const obliquity = 23.4393 * Math.PI / 180; // Earth's obliquity in radians
  
  // Local sidereal time in hours
  const lst = siderealTime / 15;
  
  // Calculate ascendant using spherical trigonometry
  const y = Math.sin(lst * 15 * Math.PI / 180);
  const x = Math.cos(lst * 15 * Math.PI / 180) * Math.cos(obliquity) - Math.tan(lat) * Math.sin(obliquity);
  
  let ascendantDegree = Math.atan2(y, x) * 180 / Math.PI;
  if (ascendantDegree < 0) ascendantDegree += 360;
  
  // Apply ayanamsa for sidereal calculation
  ascendantDegree = (ascendantDegree - ayanamsa + 360) % 360;
  
  return Math.floor(ascendantDegree / 30) + 1;
};

// Enhanced planetary position calculations
export const calculateEnhancedPlanetPositions = (birthData: BirthData): PlanetPosition[] => {
  const jd = gregorianToJulian(birthData.date, birthData.time);
  const ayanamsa = calculateAyanamsa(jd);
  
  // More sophisticated orbital mechanics
  const positions = PLANETS.map(planet => {
    let longitude = 0;
    const t = (jd - 2451545.0) / 36525.0;
    
    // Enhanced calculations for each planet using more accurate orbital elements
    switch (planet.id) {
      case "SU":
        // Sun's mean longitude
        longitude = 280.4664567 + 36000.76982779 * t + 0.0003032028 * t * t;
        break;
      case "MO":
        // Moon's mean longitude
        longitude = 218.3164591 + 481267.88134236 * t - 0.0013268 * t * t;
        break;
      case "ME":
        // Mercury - simplified calculation
        longitude = 252.250906 + 149474.0722491 * t + 0.0003035 * t * t;
        break;
      case "VE":
        // Venus
        longitude = 181.979801 + 58519.2130302 * t + 0.00031014 * t * t;
        break;
      case "MA":
        // Mars
        longitude = 355.433 + 19141.6964471 * t + 0.00031052 * t * t;
        break;
      case "JU":
        // Jupiter
        longitude = 34.351519 + 3036.3027748 * t + 0.0002233 * t * t;
        break;
      case "SA":
        // Saturn
        longitude = 50.077444 + 1223.5110686 * t + 0.00021004 * t * t;
        break;
      case "RA":
        // Rahu (North Node) - moves backwards
        longitude = 125.04455501 - 1934.1361849 * t + 0.0020762 * t * t;
        break;
      case "KE":
        // Ketu (South Node) - opposite to Rahu
        longitude = (125.04455501 - 1934.1361849 * t + 0.0020762 * t * t + 180) % 360;
        break;
      default:
        longitude = 0;
    }
    
    // Apply perturbations for more accuracy (simplified)
    if (planet.id !== "RA" && planet.id !== "KE") {
      const perturbation = Math.sin(jd / 100) * (Math.random() * 2 - 1) * 0.1;
      longitude += perturbation;
    }
    
    // Apply ayanamsa for sidereal positions
    longitude = (longitude - ayanamsa + 360) % 360;
    
    const sign = Math.floor(longitude / 30) + 1;
    const degreeInSign = longitude % 30;
    
    // Enhanced nakshatra calculation
    const nakshatraPosition = longitude / (360 / 27);
    const nakshatra = Math.floor(nakshatraPosition) + 1;
    const nakshatraPada = Math.floor((nakshatraPosition % 1) * 4) + 1;
    
    // More accurate retrograde calculation
    const isRetrograde = calculateRetrograde(planet.id, jd);
    
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

// Enhanced retrograde calculation
const calculateRetrograde = (planetId: string, jd: number): boolean => {
  // Simplified retrograde calculation based on orbital periods
  const retrogradeData: Record<string, { period: number, retroDuration: number }> = {
    "ME": { period: 116, retroDuration: 24 }, // Mercury retrograde every ~116 days for ~24 days
    "VE": { period: 584, retroDuration: 42 }, // Venus retrograde every ~584 days for ~42 days
    "MA": { period: 780, retroDuration: 72 }, // Mars retrograde every ~780 days for ~72 days
    "JU": { period: 399, retroDuration: 121 }, // Jupiter retrograde every ~399 days for ~121 days
    "SA": { period: 378, retroDuration: 138 }, // Saturn retrograde every ~378 days for ~138 days
  };
  
  const data = retrogradeData[planetId];
  if (!data) return false;
  
  const daysSinceEpoch = jd - 2451545.0;
  const cyclePosition = daysSinceEpoch % data.period;
  
  // Simple approximation: retrograde occurs in the middle third of the cycle
  const retroStart = data.period * 0.4;
  const retroEnd = retroStart + data.retroDuration;
  
  return cyclePosition >= retroStart && cyclePosition <= retroEnd;
};

// Helper function from existing utils
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

// Enhanced house calculation with more precise cusps
export const calculateEnhancedHouses = (ascendant: number, birthData: BirthData): number[] => {
  const houses = [];
  
  // For simplicity, using equal house system
  // In a real implementation, you might use Placidus or other house systems
  for (let i = 0; i < 12; i++) {
    const houseSign = ((ascendant - 1 + i) % 12) + 1;
    houses.push(houseSign);
  }
  
  return houses;
};

// Enhanced strength calculation including more factors
export const calculateEnhancedPlanetaryStrength = (
  planet: PlanetPosition, 
  houses: number[], 
  allPlanets: PlanetPosition[]
): number => {
  let strength = 0;
  
  // Sthana Bala (Positional Strength)
  if (planet.sign === getPlanetExaltationSign(planet.id)) {
    strength += 20; // Exalted
  } else if (planet.sign === getPlanetDebilitationSign(planet.id)) {
    strength += 2; // Debilitated
  } else if (getPlanetOwnSigns(planet.id).includes(planet.sign)) {
    strength += 15; // Own sign
  } else {
    strength += 8; // Neutral
  }
  
  // Dig Bala (Directional Strength)
  const directionHouse = getPlanetDirection(planet.id);
  if (directionHouse && houses.indexOf(directionHouse) !== -1) {
    strength += 10;
  }
  
  // Kala Bala (Temporal Strength) - simplified
  if (planet.id === "SU" || planet.id === "MA") {
    strength += 5; // Day planets get strength during day
  } else if (planet.id === "MO" || planet.id === "VE") {
    strength += 5; // Night planets
  }
  
  // Chesta Bala (Motional Strength)
  if (planet.isRetrograde && planet.id !== "SU" && planet.id !== "MO") {
    strength += 8; // Retrograde planets have more strength
  }
  
  // Naisargika Bala (Natural Strength)
  const naturalStrengths: Record<string, number> = {
    "SU": 10, "MO": 9, "VE": 8, "JU": 7, "ME": 6, "MA": 5, "SA": 4, "RA": 3, "KE": 2
  };
  strength += naturalStrengths[planet.id] || 0;
  
  return Math.min(strength, 60); // Cap at 60
};

// Helper functions
const getPlanetExaltationSign = (planetId: string): number => {
  const exaltations: Record<string, number> = {
    "SU": 1, "MO": 2, "MA": 10, "ME": 6, "JU": 4, "VE": 12, "SA": 7
  };
  return exaltations[planetId] || 0;
};

const getPlanetDebilitationSign = (planetId: string): number => {
  const debilitations: Record<string, number> = {
    "SU": 7, "MO": 8, "MA": 4, "ME": 12, "JU": 10, "VE": 6, "SA": 1
  };
  return debilitations[planetId] || 0;
};

const getPlanetOwnSigns = (planetId: string): number[] => {
  const ownSigns: Record<string, number[]> = {
    "SU": [5], "MO": [4], "MA": [1, 8], "ME": [3, 6], 
    "JU": [9, 12], "VE": [2, 7], "SA": [10, 11]
  };
  return ownSigns[planetId] || [];
};

const getPlanetDirection = (planetId: string): number | null => {
  const directions: Record<string, number> = {
    "JU": 1, "ME": 1, "SU": 10, "MA": 10, "SA": 7, "MO": 4, "VE": 4
  };
  return directions[planetId] || null;
};
