
import { format } from 'date-fns';

// Types for Kundali calculations
export type PlanetPosition = {
  id: string;
  name: string;
  sign: number;
  signSanskrit?: string;  // Add Sanskrit name for sign
  degree: number;
  degreeInSign?: number;
  nakshatra?: number;
  nakshatraPada?: number;
  isRetrograde?: boolean;
};

export type BirthData = {
  date: Date;
  time: string;
  latitude: number;
  longitude: number;
  timezone: string;
  place: string;
  fullName?: string;
};

export type KundaliChart = {
  ascendant: number;
  ascendantSanskrit: string; // Add Sanskrit name for ascendant
  planets: PlanetPosition[];
  housesList: number[];
  birthElement: string; // Add birth element
  yogas: Yoga[]; // Add yogas
  dashaPeriods: DashaPeriod[]; // Add dasha periods
};

export type Yoga = {
  name: string;
  sanskritName: string;
  present: boolean;
  description: string;
};

export type DashaPeriod = {
  planet: string;
  planetSanskrit: string;
  startDate: Date;
  endDate: Date;
  years: number;
};

export const ZODIAC_SIGNS = [
  { id: 1, name: "Aries", sanskrit: "मेष", element: "Fire", symbol: "♈", ruler: "MA" },
  { id: 2, name: "Taurus", sanskrit: "वृषभ", element: "Earth", symbol: "♉", ruler: "VE" },
  { id: 3, name: "Gemini", sanskrit: "मिथुन", element: "Air", symbol: "♊", ruler: "ME" },
  { id: 4, name: "Cancer", sanskrit: "कर्क", element: "Water", symbol: "♋", ruler: "MO" },
  { id: 5, name: "Leo", sanskrit: "सिंह", element: "Fire", symbol: "♌", ruler: "SU" },
  { id: 6, name: "Virgo", sanskrit: "कन्या", element: "Earth", symbol: "♍", ruler: "ME" },
  { id: 7, name: "Libra", sanskrit: "तुला", element: "Air", symbol: "♎", ruler: "VE" },
  { id: 8, name: "Scorpio", sanskrit: "वृश्चिक", element: "Water", symbol: "♏", ruler: "MA" },
  { id: 9, name: "Sagittarius", sanskrit: "धनु", element: "Fire", symbol: "♐", ruler: "JU" },
  { id: 10, name: "Capricorn", sanskrit: "मकर", element: "Earth", symbol: "♑", ruler: "SA" },
  { id: 11, name: "Aquarius", sanskrit: "कुंभ", element: "Air", symbol: "♒", ruler: "SA" },
  { id: 12, name: "Pisces", sanskrit: "मीन", element: "Water", symbol: "♓", ruler: "JU" },
];

export const PLANETS = [
  { id: "SU", name: "Sun", sanskrit: "सूर्य", symbol: "☉", color: "#FFA500" },
  { id: "MO", name: "Moon", sanskrit: "चंद्र", symbol: "☽", color: "#FFFFFF" },
  { id: "MA", name: "Mars", sanskrit: "मंगल", symbol: "♂", color: "#FF0000" },
  { id: "ME", name: "Mercury", sanskrit: "बुध", symbol: "☿", color: "#00FF00" },
  { id: "JU", name: "Jupiter", sanskrit: "गुरु", symbol: "♃", color: "#FFFF00" },
  { id: "VE", name: "Venus", sanskrit: "शुक्र", symbol: "♀", color: "#00FFFF" },
  { id: "SA", name: "Saturn", sanskrit: "शनि", symbol: "♄", color: "#0000FF" },
  { id: "RA", name: "Rahu", sanskrit: "राहु", symbol: "☊", color: "#000000" },
  { id: "KE", name: "Ketu", sanskrit: "केतु", symbol: "☋", color: "#808080" }
];

export const NAKSHATRAS = [
  { id: 1, name: "Ashwini", sanskrit: "अश्विनी", ruler: "KE", deity: "Ashwini Kumars" },
  { id: 2, name: "Bharani", sanskrit: "भरणी", ruler: "VE", deity: "Yama" },
  { id: 3, name: "Krittika", sanskrit: "कृत्तिका", ruler: "SU", deity: "Agni" },
  { id: 4, name: "Rohini", sanskrit: "रोहिणी", ruler: "MO", deity: "Brahma" },
  { id: 5, name: "Mrigashira", sanskrit: "मृगशिरा", ruler: "MA", deity: "Soma" },
  { id: 6, name: "Ardra", sanskrit: "आर्द्रा", ruler: "RA", deity: "Rudra" },
  { id: 7, name: "Punarvasu", sanskrit: "पुनर्वसु", ruler: "JU", deity: "Aditi" },
  { id: 8, name: "Pushya", sanskrit: "पुष्य", ruler: "SA", deity: "Brihaspati" },
  { id: 9, name: "Ashlesha", sanskrit: "आश्लेषा", ruler: "ME", deity: "Nagas" },
  { id: 10, name: "Magha", sanskrit: "मघा", ruler: "KE", deity: "Pitris" },
  { id: 11, name: "Purva Phalguni", sanskrit: "पूर्व फाल्गुनी", ruler: "VE", deity: "Bhaga" },
  { id: 12, name: "Uttara Phalguni", sanskrit: "उत्तर फाल्गुनी", ruler: "SU", deity: "Aryaman" },
  { id: 13, name: "Hasta", sanskrit: "हस्त", ruler: "MO", deity: "Savitar" },
  { id: 14, name: "Chitra", sanskrit: "चित्रा", ruler: "MA", deity: "Tvashtar" },
  { id: 15, name: "Swati", sanskrit: "स्वाति", ruler: "RA", deity: "Vayu" },
  { id: 16, name: "Vishakha", sanskrit: "विशाखा", ruler: "JU", deity: "Indra-Agni" },
  { id: 17, name: "Anuradha", sanskrit: "अनुराधा", ruler: "SA", deity: "Mitra" },
  { id: 18, name: "Jyeshtha", sanskrit: "ज्येष्ठा", ruler: "ME", deity: "Indra" },
  { id: 19, name: "Mula", sanskrit: "मूल", ruler: "KE", deity: "Nirrti" },
  { id: 20, name: "Purva Ashadha", sanskrit: "पूर्वाषाढ़ा", ruler: "VE", deity: "Apas" },
  { id: 21, name: "Uttara Ashadha", sanskrit: "उत्तराषाढ़ा", ruler: "SU", deity: "Vishvadevas" },
  { id: 22, name: "Shravana", sanskrit: "श्रवण", ruler: "MO", deity: "Vishnu" },
  { id: 23, name: "Dhanishta", sanskrit: "धनिष्ठा", ruler: "MA", deity: "Vasus" },
  { id: 24, name: "Shatabhisha", sanskrit: "शतभिषा", ruler: "RA", deity: "Varuna" },
  { id: 25, name: "Purva Bhadrapada", sanskrit: "पूर्व भाद्रपद", ruler: "JU", deity: "Ajaikapada" },
  { id: 26, name: "Uttara Bhadrapada", sanskrit: "उत्तर भाद्रपद", ruler: "SA", deity: "Ahirbudhnya" },
  { id: 27, name: "Revati", sanskrit: "रेवती", ruler: "ME", deity: "Pushan" }
];

export const DASHA_PERIODS = {
  "SU": 6,
  "MO": 10,
  "MA": 7,
  "RA": 18,
  "JU": 16,
  "SA": 19,
  "ME": 17,
  "KE": 7,
  "VE": 20
};

export const PLANET_RELATIONSHIPS = {
  "SU": { friends: ["MO", "MA", "JU"], enemies: ["SA", "VE"], neutral: ["ME"] },
  "MO": { friends: ["SU", "ME"], enemies: [], neutral: ["MA", "JU", "VE", "SA"] },
  "MA": { friends: ["SU", "JU"], enemies: ["ME"], neutral: ["MO", "VE", "SA"] },
  "ME": { friends: ["SU", "VE"], enemies: ["MO"], neutral: ["MA", "JU", "SA"] },
  "JU": { friends: ["SU", "MO", "MA"], enemies: ["ME", "VE"], neutral: ["SA"] },
  "VE": { friends: ["ME", "SA"], enemies: ["SU"], neutral: ["MO", "MA", "JU"] },
  "SA": { friends: ["ME", "VE"], enemies: ["SU", "MO", "MA"], neutral: ["JU"] },
  "RA": { friends: ["ME", "VE", "SA"], enemies: ["SU", "MO"], neutral: ["MA", "JU"] },
  "KE": { friends: ["MA", "JU", "SA"], enemies: ["ME", "VE"], neutral: ["SU", "MO"] }
};

export const PLANET_EXALTATION = {
  "SU": 1, // Aries
  "MO": 2, // Taurus
  "MA": 10, // Capricorn
  "ME": 6, // Virgo
  "JU": 4, // Cancer
  "VE": 12, // Pisces
  "SA": 7 // Libra
};

export const PLANET_DEBILITATION = {
  "SU": 7, // Libra
  "MO": 8, // Scorpio
  "MA": 4, // Cancer
  "ME": 12, // Pisces
  "JU": 10, // Capricorn
  "VE": 6, // Virgo
  "SA": 1 // Aries
};

export const PLANET_OWN_SIGNS = {
  "SU": [5], // Leo
  "MO": [4], // Cancer
  "MA": [1, 8], // Aries, Scorpio
  "ME": [3, 6], // Gemini, Virgo
  "JU": [9, 12], // Sagittarius, Pisces
  "VE": [2, 7], // Taurus, Libra
  "SA": [10, 11] // Capricorn, Aquarius
};

export const PLANET_DIRECTION = {
  "JU": 1, // East (1st house)
  "ME": 1, // East (1st house)
  "SU": 10, // South (10th house)
  "MA": 10, // South (10th house)
  "SA": 7, // West (7th house)
  "MO": 4, // North (4th house)
  "VE": 4 // North (4th house)
};

// Convert Gregorian to Julian Day Number (JDN) - advanced calculation
export const gregorianToJulian = (date: Date, time: string): number => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const timeArray = time.split(':');
  const hour = parseInt(timeArray[0]);
  const minute = parseInt(timeArray[1]);
  const timeDecimal = hour + (minute / 60);
  
  // Julian Day calculation (Meeus algorithm)
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

// Simulated calculation for ascendant with improved accuracy
export const calculateAscendant = (birthData: BirthData): number => {
  // In a real application, this would involve complex astronomical calculations
  // For this demo, we'll use a slightly more robust approach
  const birthDate = new Date(birthData.date);
  const hours = parseInt(birthData.time.split(':')[0]);
  const minutes = parseInt(birthData.time.split(':')[1]) || 0;
  
  // Get Julian Day
  const jd = gregorianToJulian(birthDate, birthData.time);
  
  // Simple formula with latitude and longitude effects (simplified)
  const dayOfYear = getDayOfYear(birthDate);
  const timeDecimal = hours + (minutes / 60);
  
  // Add longitude factor (simplified)
  const longitudeFactor = birthData.longitude / 15; // 15 degrees = 1 hour
  const adjustedTime = (timeDecimal + longitudeFactor) % 24;
  
  // Calculate ascendant with more factors
  const latitudeFactor = Math.abs(birthData.latitude) / 90; // Simplified latitude effect
  const obliquity = 23.4393 - 0.0000004 * (jd - 2451545.0) / 36525; // Earth's axial tilt
  const siderealTime = (100.46 + 0.985647 * (jd - 2451545.0) + birthData.longitude) % 360;
  
  // Add more astronomical factors
  const ascendantFactor = (siderealTime + adjustedTime * 15) / 30;
  const ascendantRaw = Math.floor(ascendantFactor % 12);
  
  // Ensure the result is between 1-12
  return ascendantRaw === 0 ? 12 : (ascendantRaw < 0 ? ascendantRaw + 12 : ascendantRaw);
};

// Helper for day of year
const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = Number(date) - Number(start);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

// Simulate planet positions with improved accuracy
export const calculatePlanetPositions = (birthData: BirthData): PlanetPosition[] => {
  // In a real application, this would use astronomical algorithms or an ephemeris API
  const birthDate = new Date(birthData.date);
  const jd = gregorianToJulian(birthDate, birthData.time);
  
  // Use Julian Day for more accurate calculation
  const positions = PLANETS.map(planet => {
    // Different orbital parameters for each planet
    const orbitalPeriods: Record<string, number> = {
      "SU": 365.25, // Earth around Sun
      "MO": 27.32, // Moon around Earth
      "ME": 87.97,
      "VE": 224.7,
      "MA": 686.98,
      "JU": 4332.59,
      "SA": 10759.22,
      "RA": 6793.39, // Nodal cycle approximation
      "KE": 6793.39  // Nodal cycle approximation
    };
    
    // Get orbital period or default
    const period = orbitalPeriods[planet.id] || 365.25;
    
    // Advanced mathematical model (simplified for demo)
    // In a real implementation, this would use proper ephemeris calculations
    const planetAngle = ((jd / period) * 360 + birthData.longitude / 15 * planet.id.charCodeAt(0)) % 360;
    const sign = Math.floor(planetAngle / 30) + 1;
    const degree = planetAngle % 30;
    
    // Calculate nakshatra (more accurately)
    const totalDegree = planetAngle;
    const nakshatra = Math.floor(totalDegree / (360 / 27)) + 1;
    const nakshatraPada = Math.floor((totalDegree % (360 / 27)) / (360 / 108)) + 1;
    
    // More accurate retrograde calculation
    // Real planets have retrograde cycles, for demo we'll use a more complex formula
    const retroFactor = Math.sin((jd / (period / 2)) * Math.PI) * (planet.id.charCodeAt(0) % 5);
    const isRetrograde = 
      ["ME", "VE", "MA", "JU", "SA"].includes(planet.id) && // Only these planets can be retrograde
      (retroFactor < -0.7); // Threshold for retrograde motion
    
    // Get sign Sanskrit name
    const signSanskrit = ZODIAC_SIGNS.find(z => z.id === sign)?.sanskrit || "";
    
    return {
      id: planet.id,
      name: planet.name,
      sign,
      signSanskrit,
      degree: totalDegree % 360,
      degreeInSign: degree,
      nakshatra,
      nakshatraPada,
      isRetrograde
    };
  });
  
  return positions;
};

// Calculate house positions based on ascendant
export const calculateHouses = (ascendant: number): number[] => {
  const houses = [];
  for (let i = 0; i < 12; i++) {
    const houseSign = ((ascendant - 1 + i) % 12) + 1;
    houses.push(houseSign);
  }
  return houses;
};

// Calculate planetary strength (simplified Shadbala)
export const calculatePlanetaryStrength = (planet: PlanetPosition): number => {
  let strength = 0;
  const planetId = planet.id;
  
  // 1. Positional Strength (Sthana Bala)
  if (PLANET_EXALTATION[planetId as keyof typeof PLANET_EXALTATION] === planet.sign) {
    strength += 10; // Exalted
  } else if (PLANET_DEBILITATION[planetId as keyof typeof PLANET_DEBILITATION] === planet.sign) {
    strength += 0; // Debilitated
  } else if (PLANET_OWN_SIGNS[planetId as keyof typeof PLANET_OWN_SIGNS]?.includes(planet.sign)) {
    strength += 7; // Own sign
  } else {
    // Simplified friendship calculation
    const signLord = getSignLord(planet.sign);
    if (PLANET_RELATIONSHIPS[planetId as keyof typeof PLANET_RELATIONSHIPS]?.friends.includes(signLord)) {
      strength += 5; // Friendly sign
    } else if (PLANET_RELATIONSHIPS[planetId as keyof typeof PLANET_RELATIONSHIPS]?.enemies.includes(signLord)) {
      strength += 1; // Enemy sign
    } else {
      strength += 2.5; // Neutral sign
    }
  }
  
  // Add natural strength (simplified)
  switch (planetId) {
    case "SA": strength += 6; break;
    case "MA": strength += 5; break;
    case "JU": strength += 4; break;
    case "SU": case "VE": strength += 3; break;
    case "MO": strength += 2; break;
    case "ME": strength += 1; break;
    default: strength += 0;
  }
  
  return Math.min(Math.round(strength), 20); // Cap at 20 for display purposes
};

// Helper to get the lord of a sign
export const getSignLord = (sign: number): string => {
  switch (sign) {
    case 1: case 8: return "MA";
    case 2: case 7: return "VE";
    case 3: case 6: return "ME";
    case 4: return "MO";
    case 5: return "SU";
    case 9: case 12: return "JU";
    case 10: case 11: return "SA";
    default: return "";
  }
};

// Calculate Yoga presence
export const calculateYogas = (planets: PlanetPosition[], houses: number[]): Yoga[] => {
  const yogas: Yoga[] = [];
  
  // Example: Gajakesari Yoga (Jupiter in kendra from Moon)
  const moon = planets.find(p => p.id === "MO");
  const jupiter = planets.find(p => p.id === "JU");
  
  if (moon && jupiter) {
    const moonSign = moon.sign;
    const jupiterSign = jupiter.sign;
    const kendras = [1, 4, 7, 10].map(k => ((moonSign + k - 1) % 12) + 1);
    
    yogas.push({
      name: "Gajakesari Yoga",
      sanskritName: "गजकेसरी योग",
      present: kendras.includes(jupiterSign),
      description: "आपकी कुंडली में गजकेसरी योग है, जो सफलता और समृद्धि का संकेत करता है"
    });
  }
  
  // Example: Budhaditya Yoga (Sun and Mercury conjunction)
  const sun = planets.find(p => p.id === "SU");
  const mercury = planets.find(p => p.id === "ME");
  
  if (sun && mercury) {
    yogas.push({
      name: "Budhaditya Yoga",
      sanskritName: "बुधादित्य योग",
      present: sun.sign === mercury.sign,
      description: "आपकी कुंडली में बुधादित्य योग है जो बुद्धि और विद्या की प्राप्ति का कारक है"
    });
  }
  
  // Example: Chandra-Mangala Yoga (Moon and Mars conjunction)
  const mars = planets.find(p => p.id === "MA");
  
  if (moon && mars) {
    yogas.push({
      name: "Chandra-Mangala Yoga",
      sanskritName: "चंद्र-मंगल योग",
      present: moon.sign === mars.sign,
      description: "आपकी कुंडली में चंद्र-मंगल योग है जो साहस और उत्साह की प्राप्ति का कारक है"
    });
  }
  
  return yogas;
};

// Calculate Vimshottari Dasha periods
export const calculateVimshottariDasha = (birthData: BirthData, moonPosition: PlanetPosition): DashaPeriod[] => {
  if (!moonPosition.nakshatra) return [];
  
  // Get the lord of the birth nakshatra
  const nakshatra = moonPosition.nakshatra;
  const nakshatraRuler = NAKSHATRAS[nakshatra - 1]?.ruler || "JU";
  
  // Dasha sequence starting from birth nakshatra lord
  const dashaSequence = ["KE", "VE", "SU", "MO", "MA", "RA", "JU", "SA", "ME"];
  const startIndex = dashaSequence.indexOf(nakshatraRuler);
  const sequence = [...dashaSequence.slice(startIndex), ...dashaSequence.slice(0, startIndex)];
  
  // Calculate Dasha periods
  const dashaPeriods: DashaPeriod[] = [];
  let currentDate = new Date(birthData.date);
  
  // Simplified: Calculate remaining portion of first dasha
  // In reality, this depends on precise position within nakshatra
  const portion = (moonPosition.degree % (360 / 27)) / (360 / 27);
  const firstPeriodYears = DASHA_PERIODS[nakshatraRuler as keyof typeof DASHA_PERIODS] || 0;
  const remainingYears = firstPeriodYears * (1 - portion);
  
  // Add all dasha periods
  sequence.forEach((planetId, index) => {
    const years = DASHA_PERIODS[planetId as keyof typeof DASHA_PERIODS] || 0;
    const actualYears = index === 0 ? remainingYears : years;
    
    const startDate = new Date(currentDate);
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + Math.floor(actualYears));
    endDate.setMonth(endDate.getMonth() + Math.floor((actualYears % 1) * 12));
    
    const planetDetails = PLANETS.find(p => p.id === planetId);
    
    dashaPeriods.push({
      planet: planetId,
      planetSanskrit: planetDetails?.sanskrit || "",
      startDate,
      endDate,
      years: actualYears
    });
    
    currentDate = new Date(endDate);
  });
  
  return dashaPeriods;
};

// Calculate the active Dasha (life period)
export const calculateActiveDasha = (birthData: BirthData, moonPosition: PlanetPosition): string => {
  // In a real application, this would involve complex calculations
  // For this demo, we'll use the Moon's nakshatra to determine the starting dasha
  
  if (!moonPosition.nakshatra) return "Unknown";
  
  const nakshatra = moonPosition.nakshatra;
  const nakshatraRuler = NAKSHATRAS[nakshatra - 1]?.ruler || "JU";
  
  // In a real calculation, we would determine how much of the nakshatra has passed
  // and calculate the remaining dasha periods
  return nakshatraRuler;
};

// Generate a complete Kundali chart
export const generateKundaliChart = (birthData: BirthData): KundaliChart => {
  const ascendant = calculateAscendant(birthData);
  const planets = calculatePlanetPositions(birthData);
  const housesList = calculateHouses(ascendant);
  
  // Get Sanskrit name for ascendant
  const ascendantSanskrit = ZODIAC_SIGNS.find(sign => sign.id === ascendant)?.sanskrit || "";
  
  // Determine birth element based on the moon sign
  const moonPlanet = planets.find(p => p.id === "MO");
  const moonSign = moonPlanet?.sign || 1;
  const birthElement = ZODIAC_SIGNS.find(sign => sign.id === moonSign)?.element || "Unknown";
  
  // Calculate yogas
  const yogas = calculateYogas(planets, housesList);
  
  // Calculate dasha periods
  const dashaPeriods = calculateVimshottariDasha(birthData, moonPlanet!);
  
  return {
    ascendant,
    ascendantSanskrit,
    planets,
    housesList,
    birthElement,
    yogas,
    dashaPeriods
  };
};

// Calculate Moon's Nakshatra
export const calculateMoonNakshatra = (moonPosition: PlanetPosition): string => {
  if (!moonPosition.nakshatra) return "Unknown";
  const nakshatra = NAKSHATRAS[moonPosition.nakshatra - 1];
  return nakshatra?.sanskrit || "Unknown";
};

// Format birth details for display
export const formatBirthDetails = (birthData: BirthData): string => {
  const date = format(new Date(birthData.date), 'dd MMMM yyyy');
  return `${date}, ${birthData.time}, ${birthData.place}`;
};

// Get planet details for a house
export const getPlanetsInHouse = (planets: PlanetPosition[], houses: number[], houseNumber: number): PlanetPosition[] => {
  const houseSign = houses[houseNumber - 1];
  return planets.filter(planet => planet.sign === houseSign);
};

// Get the Zodiac sign details
export const getZodiacDetails = (signNumber: number) => {
  return ZODIAC_SIGNS.find(sign => sign.id === signNumber) || ZODIAC_SIGNS[0];
};

// Get planet details
export const getPlanetDetails = (planetId: string) => {
  return PLANETS.find(planet => planet.id === planetId);
};

// Calculate and get current dasha
export const getCurrentDasha = (dashaPeriods: DashaPeriod[]): DashaPeriod | undefined => {
  const now = new Date();
  return dashaPeriods.find(period => 
    period.startDate <= now && period.endDate >= now
  );
};

// Calculate if a planet is combust (too close to Sun)
export const isPlanetCombust = (planet: PlanetPosition, sun: PlanetPosition): boolean => {
  if (planet.sign !== sun.sign) return false;
  
  const planetDegree = planet.degreeInSign || 0;
  const sunDegree = sun.degreeInSign || 0;
  const difference = Math.abs(planetDegree - sunDegree);
  
  // Different combustion distances for different planets
  const combustionDistances: Record<string, number> = {
    "MO": 12,
    "ME": 14,
    "VE": 10,
    "MA": 17,
    "JU": 11,
    "SA": 15
  };
  
  return difference < (combustionDistances[planet.id] || 10);
};

// Convert degrees to DMS format
export const degreesToDMS = (degrees: number): string => {
  const d = Math.floor(degrees);
  const mTemp = (degrees - d) * 60;
  const m = Math.floor(mTemp);
  const s = Math.floor((mTemp - m) * 60);
  
  return `${d}° ${m}' ${s}"`;
};

export interface ZodiacDetails {
  id: number;
  name: string;
  sanskrit: string;
  element: string;
  symbol: string;
  ruler: string; // Added ruler property
}

