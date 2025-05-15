import { format } from 'date-fns';

// Types for Kundali calculations
export type PlanetPosition = {
  id: string;
  name: string;
  sign: number;
  degree: number;
  nakshatra?: number;
  isRetrograde?: boolean;
};

export type BirthData = {
  date: Date;
  time: string;
  latitude: number;
  longitude: number;
  timezone: string;
  place: string;
  fullName?: string; // Added fullName field
};

export type KundaliChart = {
  ascendant: number;
  planets: PlanetPosition[];
  houses: number[];
};

export const ZODIAC_SIGNS = [
  { id: 1, name: "Aries", sanskrit: "Mesh", element: "Fire", symbol: "♈︎" },
  { id: 2, name: "Taurus", sanskrit: "Vrishabh", element: "Earth", symbol: "♉︎" },
  { id: 3, name: "Gemini", sanskrit: "Mithun", element: "Air", symbol: "♊︎" },
  { id: 4, name: "Cancer", sanskrit: "Kark", element: "Water", symbol: "♋︎" },
  { id: 5, name: "Leo", sanskrit: "Simha", element: "Fire", symbol: "♌︎" },
  { id: 6, name: "Virgo", sanskrit: "Kanya", element: "Earth", symbol: "♍︎" },
  { id: 7, name: "Libra", sanskrit: "Tula", element: "Air", symbol: "♎︎" },
  { id: 8, name: "Scorpio", sanskrit: "Vrishchik", element: "Water", symbol: "♏︎" },
  { id: 9, name: "Sagittarius", sanskrit: "Dhanu", element: "Fire", symbol: "♐︎" },
  { id: 10, name: "Capricorn", sanskrit: "Makar", element: "Earth", symbol: "♑︎" },
  { id: 11, name: "Aquarius", sanskrit: "Kumbh", element: "Air", symbol: "♒︎" },
  { id: 12, name: "Pisces", sanskrit: "Meen", element: "Water", symbol: "♓︎" },
];

export const PLANETS = [
  { id: "SU", name: "Sun", sanskrit: "Surya", symbol: "☉", color: "#FFA500" },
  { id: "MO", name: "Moon", sanskrit: "Chandra", symbol: "☽", color: "#FFFFFF" },
  { id: "MA", name: "Mars", sanskrit: "Mangal", symbol: "♂", color: "#FF0000" },
  { id: "ME", name: "Mercury", sanskrit: "Budh", symbol: "☿", color: "#00FF00" },
  { id: "JU", name: "Jupiter", sanskrit: "Guru", symbol: "♃", color: "#FFFF00" },
  { id: "VE", name: "Venus", sanskrit: "Shukra", symbol: "♀", color: "#00FFFF" },
  { id: "SA", name: "Saturn", sanskrit: "Shani", symbol: "♄", color: "#0000FF" },
  { id: "RA", name: "Rahu", sanskrit: "Rahu", symbol: "☊", color: "#000000" },
  { id: "KE", name: "Ketu", sanskrit: "Ketu", symbol: "☋", color: "#808080" }
];

export const NAKSHATRAS = [
  { id: 1, name: "Ashwini", ruler: "KE", deity: "Ashwini Kumars" },
  { id: 2, name: "Bharani", ruler: "VE", deity: "Yama" },
  { id: 3, name: "Krittika", ruler: "SU", deity: "Agni" },
  { id: 4, name: "Rohini", ruler: "MO", deity: "Brahma" },
  { id: 5, name: "Mrigashira", ruler: "MA", deity: "Soma" },
  { id: 6, name: "Ardra", ruler: "RA", deity: "Rudra" },
  { id: 7, name: "Punarvasu", ruler: "JU", deity: "Aditi" },
  { id: 8, name: "Pushya", ruler: "SA", deity: "Brihaspati" },
  { id: 9, name: "Ashlesha", ruler: "ME", deity: "Nagas" },
  { id: 10, name: "Magha", ruler: "KE", deity: "Pitris" },
  { id: 11, name: "Purva Phalguni", ruler: "VE", deity: "Bhaga" },
  { id: 12, name: "Uttara Phalguni", ruler: "SU", deity: "Aryaman" },
  { id: 13, name: "Hasta", ruler: "MO", deity: "Savitar" },
  { id: 14, name: "Chitra", ruler: "MA", deity: "Tvashtar" },
  { id: 15, name: "Swati", ruler: "RA", deity: "Vayu" },
  { id: 16, name: "Vishakha", ruler: "JU", deity: "Indra-Agni" },
  { id: 17, name: "Anuradha", ruler: "SA", deity: "Mitra" },
  { id: 18, name: "Jyeshtha", ruler: "ME", deity: "Indra" },
  { id: 19, name: "Mula", ruler: "KE", deity: "Nirrti" },
  { id: 20, name: "Purva Ashadha", ruler: "VE", deity: "Apas" },
  { id: 21, name: "Uttara Ashadha", ruler: "SU", deity: "Vishvadevas" },
  { id: 22, name: "Shravana", ruler: "MO", deity: "Vishnu" },
  { id: 23, name: "Dhanishta", ruler: "MA", deity: "Vasus" },
  { id: 24, name: "Shatabhisha", ruler: "RA", deity: "Varuna" },
  { id: 25, name: "Purva Bhadrapada", ruler: "JU", deity: "Ajaikapada" },
  { id: 26, name: "Uttara Bhadrapada", ruler: "SA", deity: "Ahirbudhnya" },
  { id: 27, name: "Revati", ruler: "ME", deity: "Pushan" }
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

// Simulated calculation for ascendant
export const calculateAscendant = (birthData: BirthData): number => {
  // In a real application, this would involve complex astronomical calculations
  // For this demo, we'll use a simplified approach based on the birth time
  const birthDate = new Date(birthData.date);
  const hours = parseInt(birthData.time.split(':')[0]);
  const minutes = parseInt(birthData.time.split(':')[1]) || 0;
  
  // Simple formula: (hour + minutes/60) * 30 / 24 + dayOfYear % 12
  const dayOfYear = getDayOfYear(birthDate);
  const timeDecimal = hours + (minutes / 60);
  const ascendantRaw = Math.floor((timeDecimal * 30 / 24 + dayOfYear) % 12);
  
  // Ensure the result is between 1-12
  return ascendantRaw === 0 ? 12 : ascendantRaw;
};

// Helper for day of year
const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = Number(date) - Number(start);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

// Simulate planet positions
export const calculatePlanetPositions = (birthData: BirthData): PlanetPosition[] => {
  // In a real application, this would use astronomical algorithms or an ephemeris API
  const birthDate = new Date(birthData.date);
  const seed = birthDate.getTime() + birthData.latitude + birthData.longitude;
  
  return PLANETS.map(planet => {
    // Generate a pseudo-random sign and degree based on birth details
    const signSeed = (planet.id.charCodeAt(0) * birthDate.getDate() + seed) % 12;
    const sign = (signSeed === 0) ? 12 : signSeed;
    
    // Generate degree (0-29)
    const degree = Math.floor(((planet.id.charCodeAt(1) || 65) * birthDate.getMonth() + seed) % 30);
    
    // Calculate nakshatra (simplified)
    const totalDegree = (sign - 1) * 30 + degree;
    const nakshatra = Math.floor(totalDegree / (360 / 27)) + 1;
    
    // Retrograde status (simplified)
    const isRetrograde = ((planet.id.charCodeAt(0) + birthDate.getFullYear()) % 9) === 0;
    
    return {
      id: planet.id,
      name: planet.name,
      sign,
      degree,
      nakshatra,
      isRetrograde
    };
  });
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
  const houses = calculateHouses(ascendant);
  
  return {
    ascendant,
    planets,
    houses
  };
};

// Calculate Moon's Nakshatra
export const calculateMoonNakshatra = (moonPosition: PlanetPosition): string => {
  if (!moonPosition.nakshatra) return "Unknown";
  const nakshatra = NAKSHATRAS[moonPosition.nakshatra - 1];
  return nakshatra?.name || "Unknown";
};

// Format birth details for display
export const formatBirthDetails = (birthData: BirthData): string => {
  const date = format(new Date(birthData.date), 'MMMM d, yyyy');
  return `${date} at ${birthData.time}, ${birthData.place}`;
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
