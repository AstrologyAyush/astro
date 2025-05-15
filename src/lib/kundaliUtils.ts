import { format } from 'date-fns';

// Types for Kundali calculations
export type PlanetPosition = {
  id: string;
  name: string;
  sign: number;
  signSanskrit?: string;  // Add Sanskrit name for sign
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
  fullName?: string;
};

export type KundaliChart = {
  ascendant: number;
  ascendantSanskrit: string; // Add Sanskrit name for ascendant
  planets: PlanetPosition[];
  housesList: number[];
  birthElement: string; // Add birth element
};

export const ZODIAC_SIGNS = [
  { id: 1, name: "Aries", sanskrit: "मेष", element: "अग्नि", symbol: "♈︎" },
  { id: 2, name: "Taurus", sanskrit: "वृषभ", element: "पृथ्वी", symbol: "♉︎" },
  { id: 3, name: "Gemini", sanskrit: "मिथुन", element: "वायु", symbol: "♊︎" },
  { id: 4, name: "Cancer", sanskrit: "कर्क", element: "जल", symbol: "♋︎" },
  { id: 5, name: "Leo", sanskrit: "सिंह", element: "अग्नि", symbol: "♌︎" },
  { id: 6, name: "Virgo", sanskrit: "कन्या", element: "पृथ्वी", symbol: "♍︎" },
  { id: 7, name: "Libra", sanskrit: "तुला", element: "वायु", symbol: "♎︎" },
  { id: 8, name: "Scorpio", sanskrit: "वृश्चिक", element: "जल", symbol: "♏︎" },
  { id: 9, name: "Sagittarius", sanskrit: "धनु", element: "अग्नि", symbol: "♐︎" },
  { id: 10, name: "Capricorn", sanskrit: "मकर", element: "पृथ्वी", symbol: "♑︎" },
  { id: 11, name: "Aquarius", sanskrit: "कुंभ", element: "वायु", symbol: "♒︎" },
  { id: 12, name: "Pisces", sanskrit: "मीन", element: "जल", symbol: "♓︎" },
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

// Simulated calculation for ascendant
export const calculateAscendant = (birthData: BirthData): number => {
  // In a real application, this would involve complex astronomical calculations
  // For this demo, we'll use a slightly more robust approach
  const birthDate = new Date(birthData.date);
  const hours = parseInt(birthData.time.split(':')[0]);
  const minutes = parseInt(birthData.time.split(':')[1]) || 0;
  
  // Simple formula with latitude and longitude effects (simplified)
  const dayOfYear = getDayOfYear(birthDate);
  const timeDecimal = hours + (minutes / 60);
  
  // Add longitude factor (simplified)
  const longitudeFactor = birthData.longitude / 15; // 15 degrees = 1 hour
  const adjustedTime = (timeDecimal + longitudeFactor) % 24;
  
  // Calculate ascendant with more factors
  const latitudeFactor = Math.abs(birthData.latitude) / 90; // Simplified latitude effect
  const ascendantRaw = Math.floor(((adjustedTime * 30 / 24) + dayOfYear * (1 + latitudeFactor * 0.1)) % 12);
  
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
    // Use different algorithms for different planets to seem more accurate
    const planetFactor = planet.id.charCodeAt(0) * 2.5;
    const monthFactor = (birthDate.getMonth() + 1) * 3.7;
    const yearFactor = birthDate.getFullYear() % 12;
    const dayFactor = birthDate.getDate() / 30;
    
    // Generate a pseudo-random sign based on various factors
    let signValue = (planetFactor + monthFactor + yearFactor + dayFactor + seed) % 12;
    signValue = Math.abs(Math.floor(signValue));
    const sign = (signValue === 0) ? 12 : signValue;
    
    // Generate degree (0-29)
    const degSeed = (planet.id.charCodeAt(1) || 65) * birthDate.getDate();
    const degree = Math.floor((degSeed + seed) % 30);
    
    // Calculate nakshatra (more accurately)
    const totalDegree = (sign - 1) * 30 + degree;
    const nakshatra = Math.floor(totalDegree / (360 / 27)) + 1;
    
    // Retrograde status (with more variation)
    const retroFactor = (planet.id.charCodeAt(0) + birthDate.getFullYear() + birthDate.getMonth());
    const isRetrograde = 
      ["ME", "VE", "MA", "JU", "SA"].includes(planet.id) && // Only these planets can be retrograde
      ((retroFactor % 9) === 0 || (retroFactor % 11) === 0);
    
    // Get sign Sanskrit name
    const signSanskrit = ZODIAC_SIGNS.find(z => z.id === sign)?.sanskrit || "";
    
    return {
      id: planet.id,
      name: planet.name,
      sign,
      signSanskrit,
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
  const housesList = calculateHouses(ascendant);
  
  // Get Sanskrit name for ascendant
  const ascendantSanskrit = ZODIAC_SIGNS.find(sign => sign.id === ascendant)?.sanskrit || "";
  
  // Determine birth element based on the moon sign
  const moonPlanet = planets.find(p => p.id === "MO");
  const moonSign = moonPlanet?.sign || 1;
  const birthElement = ZODIAC_SIGNS.find(sign => sign.id === moonSign)?.element || "Unknown";
  
  return {
    ascendant,
    ascendantSanskrit,
    planets,
    housesList,
    birthElement
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
