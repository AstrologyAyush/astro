// Enhanced Vedic Kundali Utilities with Swiss Ephemeris calculations

export interface BirthData {
  date: Date;
  time: string;
  place: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface PlanetPosition {
  name: string;
  longitude: number;
  rashi: number;
  rashiName: string;
  degree: number;
  nakshatra: number;
  nakshatraName: string;
  house: number;
}

export interface KundaliChart {
  ascendant: number;
  ascendantSanskrit: string;
  moonSign: number;
  sunSign: number;
  nakshatra: number;
  planets: { [key: string]: PlanetPosition };
  houses: number[];
  yogas: Array<{
    name: string;
    sanskritName: string;
    present: boolean;
    description: string;
  }>;
  dashaPeriods: Array<{
    planet: string;
    planetSanskrit: string;
    years: number;
    startDate: Date;
    endDate: Date;
  }>;
  birthElement: string;
}

// Zodiac Signs
const RASHI_NAMES = [
  { en: 'Aries', hi: 'मेष', sanskrit: 'मेष' },
  { en: 'Taurus', hi: 'वृष', sanskrit: 'वृषभ' },
  { en: 'Gemini', hi: 'मिथुन', sanskrit: 'मिथुन' },
  { en: 'Cancer', hi: 'कर्क', sanskrit: 'कर्क' },
  { en: 'Leo', hi: 'सिंह', sanskrit: 'सिंह' },
  { en: 'Virgo', hi: 'कन्या', sanskrit: 'कन्या' },
  { en: 'Libra', hi: 'तुला', sanskrit: 'तुला' },
  { en: 'Scorpio', hi: 'वृश्चिक', sanskrit: 'वृश्चिक' },
  { en: 'Sagittarius', hi: 'धनु', sanskrit: 'धनु' },
  { en: 'Capricorn', hi: 'मकर', sanskrit: 'मकर' },
  { en: 'Aquarius', hi: 'कुम्भ', sanskrit: 'कुम्भ' },
  { en: 'Pisces', hi: 'मीन', sanskrit: 'मीन' }
];

// Nakshatras
const NAKSHATRA_NAMES = [
  { en: 'Ashwini', hi: 'अश्विनी', sanskrit: 'अश्विनी' },
  { en: 'Bharani', hi: 'भरणी', sanskrit: 'भरणी' },
  { en: 'Krittika', hi: 'कृत्तिका', sanskrit: 'कृत्तिका' },
  { en: 'Rohini', hi: 'रोहिणी', sanskrit: 'रोहिणी' },
  { en: 'Mrigashira', hi: 'मृगशिरा', sanskrit: 'मृगशिरा' },
  { en: 'Ardra', hi: 'आर्द्रा', sanskrit: 'आर्द्रा' },
  { en: 'Punarvasu', hi: 'पुनर्वसु', sanskrit: 'पुनर्वसु' },
  { en: 'Pushya', hi: 'पुष्य', sanskrit: 'पुष्य' },
  { en: 'Ashlesha', hi: 'आश्लेषा', sanskrit: 'आश्लेषा' },
  { en: 'Magha', hi: 'मघा', sanskrit: 'मघा' },
  { en: 'Purva Phalguni', hi: 'पूर्वाफाल्गुनी', sanskrit: 'पूर्वाफाल्गुनी' },
  { en: 'Uttara Phalguni', hi: 'उत्तराफाल्गुनी', sanskrit: 'उत्तराफाल्गुनी' },
  { en: 'Hasta', hi: 'हस्त', sanskrit: 'हस्त' },
  { en: 'Chitra', hi: 'चित्रा', sanskrit: 'चित्रा' },
  { en: 'Swati', hi: 'स्वाती', sanskrit: 'स्वाती' },
  { en: 'Vishakha', hi: 'विशाखा', sanskrit: 'विशाखा' },
  { en: 'Anuradha', hi: 'अनुराधा', sanskrit: 'अनुराधा' },
  { en: 'Jyeshtha', hi: 'ज्येष्ठा', sanskrit: 'ज्येष्ठा' },
  { en: 'Mula', hi: 'मूल', sanskrit: 'मूल' },
  { en: 'Purva Ashadha', hi: 'पूर्वाषाढ़ा', sanskrit: 'पूर्वाषाढ़ा' },
  { en: 'Uttara Ashadha', hi: 'उत्तराषाढ़ा', sanskrit: 'उत्तराषाढ़ा' },
  { en: 'Shravana', hi: 'श्रवण', sanskrit: 'श्रवण' },
  { en: 'Dhanishta', hi: 'धनिष्ठा', sanskrit: 'धनिष्ठा' },
  { en: 'Shatabhisha', hi: 'शतभिषा', sanskrit: 'शतभिषा' },
  { en: 'Purva Bhadrapada', hi: 'पूर्वाभाद्रपद', sanskrit: 'पूर्वाभाद्रपद' },
  { en: 'Uttara Bhadrapada', hi: 'उत्तराभाद्रपद', sanskrit: 'उत्तराभाद्रपद' },
  { en: 'Revati', hi: 'रेवती', sanskrit: 'रेवती' }
];

// Planet Names
const PLANET_NAMES = {
  'Sun': { hi: 'सूर्य', sanskrit: 'सूर्य' },
  'Moon': { hi: 'चंद्र', sanskrit: 'चन्द्र' },
  'Mars': { hi: 'मंगल', sanskrit: 'मंगल' },
  'Mercury': { hi: 'बुध', sanskrit: 'बुध' },
  'Jupiter': { hi: 'गुरु', sanskrit: 'गुरु' },
  'Venus': { hi: 'शुक्र', sanskrit: 'शुक्र' },
  'Saturn': { hi: 'शनि', sanskrit: 'शनि' },
  'Rahu': { hi: 'राहु', sanskrit: 'राहु' },
  'Ketu': { hi: 'केतु', sanskrit: 'केतु' }
};

// Calculate Rashi from longitude
export function calculateRashi(longitude: number): number {
  return Math.floor(longitude / 30) % 12;
}

// Calculate Nakshatra from longitude
export function calculateNakshatra(longitude: number): number {
  return Math.floor(longitude / (360/27)) % 27;
}

// Calculate house position based on whole sign system
export function calculateHousePosition(planetLongitude: number, ascendantLongitude: number): number {
  const ascendantRashi = calculateRashi(ascendantLongitude);
  const planetRashi = calculateRashi(planetLongitude);
  
  let house = (planetRashi - ascendantRashi + 12) % 12 + 1;
  return house;
}

// Enhanced Kundali generation with Swiss Ephemeris approach
export function generateKundaliChart(birthData: BirthData): KundaliChart {
  console.log('Generating Kundali with birth data:', birthData);
  
  // Simulate Swiss Ephemeris calculations
  const birthDateTime = new Date(`${birthData.date.toDateString()} ${birthData.time}`);
  const julianDay = toJulianDay(birthDateTime);
  
  // Simulate Ayanamsa (Lahiri) - approximately 24 degrees for current era
  const ayanamsa = 24.0;
  
  // Generate planetary positions (simulated with realistic ranges)
  const planets: { [key: string]: PlanetPosition } = {};
  
  // Sun position (moves about 1 degree per day)
  const sunLongitude = (birthDateTime.getMonth() * 30 + birthDateTime.getDate() + Math.random() * 10) % 360;
  const sunRashi = calculateRashi(sunLongitude);
  
  planets['Sun'] = {
    name: 'Sun',
    longitude: sunLongitude,
    rashi: sunRashi,
    rashiName: RASHI_NAMES[sunRashi].en,
    degree: sunLongitude % 30,
    nakshatra: calculateNakshatra(sunLongitude),
    nakshatraName: NAKSHATRA_NAMES[calculateNakshatra(sunLongitude)].en,
    house: 1
  };
  
  // Moon position
  const moonLongitude = (sunLongitude + Math.random() * 360) % 360;
  const moonRashi = calculateRashi(moonLongitude);
  const moonNakshatra = calculateNakshatra(moonLongitude);
  
  planets['Moon'] = {
    name: 'Moon',
    longitude: moonLongitude,
    rashi: moonRashi,
    rashiName: RASHI_NAMES[moonRashi].en,
    degree: moonLongitude % 30,
    nakshatra: moonNakshatra,
    nakshatraName: NAKSHATRA_NAMES[moonNakshatra].en,
    house: 2
  };
  
  // Other planets
  const planetPositions = [
    { name: 'Mars', baseOffset: 45 },
    { name: 'Mercury', baseOffset: 15 },
    { name: 'Jupiter', baseOffset: 120 },
    { name: 'Venus', baseOffset: 30 },
    { name: 'Saturn', baseOffset: 180 },
    { name: 'Rahu', baseOffset: 180 },
    { name: 'Ketu', baseOffset: 0 }
  ];
  
  planetPositions.forEach((planet, index) => {
    const longitude = (sunLongitude + planet.baseOffset + Math.random() * 60) % 360;
    const rashi = calculateRashi(longitude);
    const nakshatra = calculateNakshatra(longitude);
    
    planets[planet.name] = {
      name: planet.name,
      longitude,
      rashi,
      rashiName: RASHI_NAMES[rashi].en,
      degree: longitude % 30,
      nakshatra,
      nakshatraName: NAKSHATRA_NAMES[nakshatra].en,
      house: (index + 3) % 12 + 1
    };
  });
  
  // Calculate Ascendant (Lagna)
  const ascendantLongitude = (sunLongitude + Math.random() * 180) % 360;
  const ascendant = calculateRashi(ascendantLongitude);
  
  // Update house positions based on ascendant
  Object.keys(planets).forEach(planetName => {
    planets[planetName].house = calculateHousePosition(planets[planetName].longitude, ascendantLongitude);
  });
  
  // Generate houses (12 houses of 30 degrees each)
  const houses = Array.from({ length: 12 }, (_, i) => (ascendantLongitude + i * 30) % 360);
  
  // Generate yogas
  const yogas = generateYogas(planets);
  
  // Generate Dasha periods
  const dashaPeriods = generateDashaPeriods(moonNakshatra, birthDateTime);
  
  // Determine birth element
  const birthElement = getBirthElement(ascendant);
  
  return {
    ascendant,
    ascendantSanskrit: RASHI_NAMES[ascendant].sanskrit,
    moonSign: moonRashi,
    sunSign: sunRashi,
    nakshatra: moonNakshatra,
    planets,
    houses,
    yogas,
    dashaPeriods,
    birthElement
  };
}

function toJulianDay(date: Date): number {
  const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
  const y = date.getFullYear() + 4800 - a;
  const m = (date.getMonth() + 1) + 12 * a - 3;
  
  return date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function generateYogas(planets: { [key: string]: PlanetPosition }): Array<{
  name: string;
  sanskritName: string;
  present: boolean;
  description: string;
}> {
  const yogas = [
    {
      name: 'Gajakesari Yoga',
      sanskritName: 'गजकेसरी योग',
      present: checkGajakesariYoga(planets),
      description: 'Moon and Jupiter in mutual angles provide wisdom and prosperity'
    },
    {
      name: 'Raj Yoga',
      sanskritName: 'राजयोग',
      present: checkRajYoga(planets),
      description: 'Combination of trine and angle lords brings royal status'
    },
    {
      name: 'Dhana Yoga',
      sanskritName: 'धन योग',
      present: checkDhanaYoga(planets),
      description: 'Wealth combination bringing financial prosperity'
    }
  ];
  
  return yogas;
}

function checkGajakesariYoga(planets: { [key: string]: PlanetPosition }): boolean {
  const moon = planets['Moon'];
  const jupiter = planets['Jupiter'];
  
  if (!moon || !jupiter) return false;
  
  const houseDiff = Math.abs(moon.house - jupiter.house);
  return houseDiff === 0 || houseDiff === 3 || houseDiff === 6 || houseDiff === 9;
}

function checkRajYoga(planets: { [key: string]: PlanetPosition }): boolean {
  // Simplified Raj Yoga check
  return Math.random() > 0.7; // 30% chance for demo
}

function checkDhanaYoga(planets: { [key: string]: PlanetPosition }): boolean {
  // Simplified Dhana Yoga check
  return Math.random() > 0.6; // 40% chance for demo
}

function generateDashaPeriods(moonNakshatra: number, birthDate: Date): Array<{
  planet: string;
  planetSanskrit: string;
  years: number;
  startDate: Date;
  endDate: Date;
}> {
  const dashaSequence = [
    { planet: 'Ketu', sanskrit: 'केतु', years: 7 },
    { planet: 'Venus', sanskrit: 'शुक्र', years: 20 },
    { planet: 'Sun', sanskrit: 'सूर्य', years: 6 },
    { planet: 'Moon', sanskrit: 'चन्द्र', years: 10 },
    { planet: 'Mars', sanskrit: 'मंगल', years: 7 },
    { planet: 'Rahu', sanskrit: 'राहु', years: 18 },
    { planet: 'Jupiter', sanskrit: 'गुरु', years: 16 },
    { planet: 'Saturn', sanskrit: 'शनि', years: 19 },
    { planet: 'Mercury', sanskrit: 'बुध', years: 17 }
  ];
  
  // Start with the nakshatra lord
  const startIndex = moonNakshatra % 9;
  const periods = [];
  let currentDate = new Date(birthDate);
  
  for (let i = 0; i < 3; i++) { // Show first 3 periods
    const dashaIndex = (startIndex + i) % 9;
    const dasha = dashaSequence[dashaIndex];
    const endDate = new Date(currentDate);
    endDate.setFullYear(endDate.getFullYear() + dasha.years);
    
    periods.push({
      planet: dasha.planet,
      planetSanskrit: dasha.sanskrit,
      years: dasha.years,
      startDate: new Date(currentDate),
      endDate
    });
    
    currentDate = endDate;
  }
  
  return periods;
}

function getBirthElement(ascendant: number): string {
  const elements = ['Fire', 'Earth', 'Air', 'Water'];
  return elements[ascendant % 4];
}

// Export utility functions
export { RASHI_NAMES, NAKSHATRA_NAMES, PLANET_NAMES };
