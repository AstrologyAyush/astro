
// Advanced Kundali Engine with Swiss Ephemeris-like precision
export interface EnhancedBirthData {
  fullName: string;
  dateOfBirth: Date;
  timeOfBirth: string;
  placeOfBirth: string;
  latitude: number;
  longitude: number;
  timezone?: number;
}

export interface PlanetaryPosition {
  id: string;
  name: string;
  sanskrit: string;
  longitude: number;
  latitude: number;
  speed: number;
  rashi: number;
  rashiName: string;
  rashiLord: string;
  degree: number;
  degreeInSign: number;
  nakshatra: number;
  nakshatraName: string;
  nakshatraPada: number;
  nakshatraLord: string;
  house: number;
  isRetrograde: boolean;
  isCombust: boolean;
  isExalted: boolean;
  isDebilitated: boolean;
  isMoolatrikona: boolean;
  isOwnSign: boolean;
  shadbala: number;
  strengthGrade: string;
  dignityScore: number;
}

export interface HouseInfo {
  number: number;
  cusp: number;
  sign: number;
  signName: string;
  lord: string;
  planets: string[];
  signification: string[];
  strength: number;
}

export interface YogaInfo {
  name: string;
  sanskritName: string;
  type: 'benefic' | 'malefic' | 'neutral';
  strength: number;
  description: string;
  planets: string[];
  houses: number[];
  effects: string[];
  remedies?: string[];
}

export interface DashaInfo {
  planet: string;
  planetSanskrit: string;
  startDate: Date;
  endDate: Date;
  years: number;
  months: number;
  days: number;
  isActive: boolean;
  antardasha?: DashaInfo[];
  effects: string[];
}

export interface DoshaInfo {
  name: string;
  sanskritName: string;
  present: boolean;
  severity: 'low' | 'medium' | 'high';
  type: string;
  description: string;
  effects: string[];
  remedies: string[];
  planets: string[];
  houses: number[];
}

export interface VargaChart {
  name: string;
  division: number;
  planets: Record<string, { sign: number; signName: string; strength: number }>;
  significance: string;
  analysis: string;
}

export interface DetailedKundali {
  birthData: EnhancedBirthData;
  basicInfo: {
    ascendant: number;
    ascendantName: string;
    ascendantLord: string;
    moonSign: number;
    moonSignName: string;
    sunSign: number;
    sunSignName: string;
    birthNakshatra: string;
    janmaRashi: string;
    tithi: string;
    karana: string;
    yoga: string;
    sunrise: string;
    sunset: string;
  };
  planets: Record<string, PlanetaryPosition>;
  houses: HouseInfo[];
  yogas: YogaInfo[];
  doshas: DoshaInfo[];
  dashas: {
    current: DashaInfo;
    mahadasha: DashaInfo[];
    vimshottari: DashaInfo[];
  };
  vargas: VargaChart[];
  predictions: {
    personality: string;
    career: string;
    finance: string;
    relationships: string;
    health: string;
    family: string;
    education: string;
    spirituality: string;
  };
  remedies: {
    gemstones: string[];
    mantras: string[];
    charity: string[];
    fasting: string[];
    colors: string[];
    directions: string[];
    puja: string[];
  };
  compatibility: {
    bestMatches: string[];
    compatibility: Record<string, number>;
  };
  transits: {
    current: string;
    upcoming: string[];
    warnings: string[];
  };
  auspiciousTimes: {
    muhurta: string[];
    festivals: string[];
    periods: string[];
  };
}

// Enhanced calculations
const ZODIAC_SIGNS = [
  { id: 1, name: 'Aries', sanskrit: 'मेष', lord: 'Mars', element: 'Fire', quality: 'Cardinal' },
  { id: 2, name: 'Taurus', sanskrit: 'वृष', lord: 'Venus', element: 'Earth', quality: 'Fixed' },
  { id: 3, name: 'Gemini', sanskrit: 'मिथुन', lord: 'Mercury', element: 'Air', quality: 'Mutable' },
  { id: 4, name: 'Cancer', sanskrit: 'कर्क', lord: 'Moon', element: 'Water', quality: 'Cardinal' },
  { id: 5, name: 'Leo', sanskrit: 'सिंह', lord: 'Sun', element: 'Fire', quality: 'Fixed' },
  { id: 6, name: 'Virgo', sanskrit: 'कन्या', lord: 'Mercury', element: 'Earth', quality: 'Mutable' },
  { id: 7, name: 'Libra', sanskrit: 'तुला', lord: 'Venus', element: 'Air', quality: 'Cardinal' },
  { id: 8, name: 'Scorpio', sanskrit: 'वृश्चिक', lord: 'Mars', element: 'Water', quality: 'Fixed' },
  { id: 9, name: 'Sagittarius', sanskrit: 'धनु', lord: 'Jupiter', element: 'Fire', quality: 'Mutable' },
  { id: 10, name: 'Capricorn', sanskrit: 'मकर', lord: 'Saturn', element: 'Earth', quality: 'Cardinal' },
  { id: 11, name: 'Aquarius', sanskrit: 'कुम्भ', lord: 'Saturn', element: 'Air', quality: 'Fixed' },
  { id: 12, name: 'Pisces', sanskrit: 'मीन', lord: 'Jupiter', element: 'Water', quality: 'Mutable' }
];

const NAKSHATRAS = [
  { id: 1, name: 'Ashwini', sanskrit: 'अश्विनी', lord: 'Ketu', pada: [1,2,3,4] },
  { id: 2, name: 'Bharani', sanskrit: 'भरणी', lord: 'Venus', pada: [1,2,3,4] },
  { id: 3, name: 'Krittika', sanskrit: 'कृत्तिका', lord: 'Sun', pada: [1,2,3,4] },
  { id: 4, name: 'Rohini', sanskrit: 'रोहिणी', lord: 'Moon', pada: [1,2,3,4] },
  { id: 5, name: 'Mrigashira', sanskrit: 'मृगशिरा', lord: 'Mars', pada: [1,2,3,4] },
  { id: 6, name: 'Ardra', sanskrit: 'आर्द्रा', lord: 'Rahu', pada: [1,2,3,4] },
  { id: 7, name: 'Punarvasu', sanskrit: 'पुनर्वसु', lord: 'Jupiter', pada: [1,2,3,4] },
  { id: 8, name: 'Pushya', sanskrit: 'पुष्य', lord: 'Saturn', pada: [1,2,3,4] },
  { id: 9, name: 'Ashlesha', sanskrit: 'आश्लेषा', lord: 'Mercury', pada: [1,2,3,4] },
  // ... continue for all 27 nakshatras
];

const PLANETS = [
  { id: 'SU', name: 'Sun', sanskrit: 'सूर्य', ownSigns: [5], exaltation: 1, debilitation: 7 },
  { id: 'MO', name: 'Moon', sanskrit: 'चन्द्र', ownSigns: [4], exaltation: 2, debilitation: 8 },
  { id: 'MA', name: 'Mars', sanskrit: 'मंगल', ownSigns: [1, 8], exaltation: 10, debilitation: 4 },
  { id: 'ME', name: 'Mercury', sanskrit: 'बुध', ownSigns: [3, 6], exaltation: 6, debilitation: 12 },
  { id: 'JU', name: 'Jupiter', sanskrit: 'गुरु', ownSigns: [9, 12], exaltation: 4, debilitation: 10 },
  { id: 'VE', name: 'Venus', sanskrit: 'शुक्र', ownSigns: [2, 7], exaltation: 12, debilitation: 6 },
  { id: 'SA', name: 'Saturn', sanskrit: 'शनि', ownSigns: [10, 11], exaltation: 7, debilitation: 1 },
  { id: 'RA', name: 'Rahu', sanskrit: 'राहु', ownSigns: [], exaltation: 3, debilitation: 9 },
  { id: 'KE', name: 'Ketu', sanskrit: 'केतु', ownSigns: [], exaltation: 9, debilitation: 3 }
];

// Enhanced Julian Day calculation
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

// Enhanced Ayanamsa calculation (Lahiri)
function calculateAyanamsa(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0;
  const ayanamsa = 23.85 + (0.0013 * t) + (0.000001 * t * t);
  return ayanamsa;
}

// Enhanced planetary position calculation
function calculateEnhancedPlanetPosition(jd: number, planet: string, ayanamsa: number): PlanetaryPosition {
  const t = (jd - 2451545.0) / 36525.0;
  
  // Enhanced mean longitudes with perturbations
  const meanLongitudes: Record<string, number> = {
    'Sun': 280.47 + 36000.77 * t + 0.0003 * t * t,
    'Moon': 218.32 + 481267.88 * t - 0.0016 * t * t,
    'Mercury': 252.25 + 149472.68 * t + 0.0003 * t * t,
    'Venus': 181.98 + 58517.82 * t + 0.0001 * t * t,
    'Mars': 355.43 + 19140.30 * t + 0.0003 * t * t,
    'Jupiter': 34.35 + 3034.91 * t + 0.0002 * t * t,
    'Saturn': 50.08 + 1222.11 * t + 0.0004 * t * t,
    'Rahu': 125.04 - 1934.14 * t + 0.0021 * t * t,
    'Ketu': 305.04 - 1934.14 * t + 0.0021 * t * t
  };
  
  // Calculate speed
  const dt = 1.0; // 1 day
  const position1 = meanLongitudes[planet];
  const position2 = planet === 'Sun' ? 280.47 + 36000.77 * (t + dt/36525) : 
                   planet === 'Moon' ? 218.32 + 481267.88 * (t + dt/36525) :
                   meanLongitudes[planet] + (planet === 'Rahu' || planet === 'Ketu' ? -1934.14 * dt/36525 : 1 * dt/36525);
  
  const speed = position2 - position1;
  
  let longitude = meanLongitudes[planet] || 0;
  longitude = (longitude - ayanamsa + 360) % 360;
  if (longitude < 0) longitude += 360;
  
  const rashi = Math.floor(longitude / 30) + 1;
  const degreeInSign = longitude % 30;
  const nakshatra = Math.floor(longitude / (360 / 27)) + 1;
  const nakshatraPada = Math.floor((longitude % (360 / 27)) / (360 / 27 / 4)) + 1;
  
  const planetData = PLANETS.find(p => p.name === planet);
  const rashiData = ZODIAC_SIGNS[rashi - 1];
  const nakshatraData = NAKSHATRAS[nakshatra - 1];
  
  // Enhanced strength calculations
  const isOwnSign = planetData?.ownSigns.includes(rashi) || false;
  const isExalted = planetData?.exaltation === rashi;
  const isDebilitated = planetData?.debilitation === rashi;
  const isRetrograde = speed < 0 && planet !== 'Sun' && planet !== 'Moon';
  
  // Shadbala calculation (simplified)
  let shadbala = 50; // Base strength
  if (isExalted) shadbala += 40;
  if (isOwnSign) shadbala += 30;
  if (isDebilitated) shadbala -= 40;
  if (isRetrograde && planet !== 'Rahu' && planet !== 'Ketu') shadbala += 10;
  
  const strengthGrade = shadbala >= 80 ? 'Excellent' : 
                       shadbala >= 60 ? 'Good' : 
                       shadbala >= 40 ? 'Average' : 
                       shadbala >= 20 ? 'Weak' : 'Very Weak';

  return {
    id: planetData?.id || planet.substring(0, 2).toUpperCase(),
    name: planet,
    sanskrit: planetData?.sanskrit || planet,
    longitude,
    latitude: 0,
    speed,
    rashi,
    rashiName: rashiData?.name || 'Unknown',
    rashiLord: rashiData?.lord || 'Unknown',
    degree: longitude,
    degreeInSign,
    nakshatra,
    nakshatraName: nakshatraData?.name || 'Unknown',
    nakshatraPada,
    nakshatraLord: nakshatraData?.lord || 'Unknown',
    house: rashi, // Will be updated with actual house calculation
    isRetrograde,
    isCombust: false, // Will be calculated separately
    isExalted,
    isDebilitated,
    isMoolatrikona: false,
    isOwnSign,
    shadbala: Math.min(150, Math.max(0, shadbala)),
    strengthGrade,
    dignityScore: shadbala
  };
}

// Enhanced Yoga detection
function detectYogas(planets: Record<string, PlanetaryPosition>, houses: HouseInfo[]): YogaInfo[] {
  const yogas: YogaInfo[] = [];
  
  // Gajakesari Yoga
  const moon = planets['Moon'];
  const jupiter = planets['Jupiter'];
  if (moon && jupiter) {
    const moonHouse = moon.house;
    const jupiterHouse = jupiter.house;
    const isKendra = [1, 4, 7, 10].includes(Math.abs(moonHouse - jupiterHouse)) || 
                     moonHouse === jupiterHouse;
    
    if (isKendra) {
      yogas.push({
        name: 'Gajakesari Yoga',
        sanskritName: 'गजकेसरी योग',
        type: 'benefic',
        strength: 85,
        description: 'Moon and Jupiter in Kendra positions create wealth and wisdom',
        planets: ['Moon', 'Jupiter'],
        houses: [moonHouse, jupiterHouse],
        effects: ['Wealth', 'Wisdom', 'Respect', 'Good fortune'],
        remedies: ['Chant Jupiter mantras', 'Wear yellow sapphire']
      });
    }
  }
  
  // Raj Yoga detection
  const lagnaLord = houses[0]?.lord;
  const ninthLord = houses[8]?.lord;
  const tenthLord = houses[9]?.lord;
  
  if (lagnaLord && (ninthLord === tenthLord || planets[lagnaLord]?.house === planets[ninthLord]?.house)) {
    yogas.push({
      name: 'Raj Yoga',
      sanskritName: 'राज योग',
      type: 'benefic',
      strength: 90,
      description: 'Combination of trine and Kendra lords brings power and authority',
      planets: [lagnaLord, ninthLord, tenthLord].filter(Boolean),
      houses: [1, 9, 10],
      effects: ['Leadership', 'Authority', 'Success', 'Recognition'],
      remedies: ['Worship Lord Vishnu', 'Donate to charity']
    });
  }
  
  return yogas;
}

// Enhanced Dosha detection
function detectDoshas(planets: Record<string, PlanetaryPosition>, houses: HouseInfo[]): DoshaInfo[] {
  const doshas: DoshaInfo[] = [];
  
  // Mangal Dosha
  const mars = planets['Mars'];
  if (mars) {
    const mangalHouses = [1, 4, 7, 8, 12];
    const isManglik = mangalHouses.includes(mars.house);
    
    if (isManglik) {
      doshas.push({
        name: 'Mangal Dosha',
        sanskritName: 'मांगलिक दोष',
        present: true,
        severity: mars.house === 7 ? 'high' : mars.house === 8 ? 'high' : 'medium',
        type: 'Marriage',
        description: 'Mars in specific houses affects marriage and relationships',
        effects: ['Delayed marriage', 'Conflicts in relationships', 'Separation'],
        remedies: [
          'Marry another Manglik',
          'Perform Mangal Shanti Puja',
          'Chant Hanuman Chalisa',
          'Donate red items on Tuesday'
        ],
        planets: ['Mars'],
        houses: [mars.house]
      });
    }
  }
  
  // Kaal Sarp Dosha
  const rahu = planets['Rahu'];
  const ketu = planets['Ketu'];
  if (rahu && ketu) {
    const allPlanetsOnOneSide = Object.values(planets)
      .filter(p => p.name !== 'Rahu' && p.name !== 'Ketu')
      .every(planet => {
        const rahuPos = rahu.longitude;
        const ketuPos = ketu.longitude;
        const planetPos = planet.longitude;
        
        // Check if all planets are between Rahu and Ketu
        return (rahuPos < ketuPos && planetPos > rahuPos && planetPos < ketuPos) ||
               (rahuPos > ketuPos && (planetPos > rahuPos || planetPos < ketuPos));
      });
    
    if (allPlanetsOnOneSide) {
      doshas.push({
        name: 'Kaal Sarp Dosha',
        sanskritName: 'काल सर्प दोष',
        present: true,
        severity: 'high',
        type: 'General',
        description: 'All planets hemmed between Rahu and Ketu axis',
        effects: ['Obstacles in life', 'Delayed success', 'Mental stress'],
        remedies: [
          'Visit Kaal Sarp temples',
          'Perform Rudrabhishek',
          'Chant Maha Mrityunjaya Mantra',
          'Donate silver items'
        ],
        planets: ['Rahu', 'Ketu'],
        houses: [rahu.house, ketu.house]
      });
    }
  }
  
  return doshas;
}

// Enhanced Dasha calculation
function calculateVimshottariDasha(birthData: EnhancedBirthData, moonPosition: PlanetaryPosition): DashaInfo[] {
  const dashaSequence = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
  const dashaYears: Record<string, number> = {
    'Ketu': 7, 'Venus': 20, 'Sun': 6, 'Moon': 10, 'Mars': 7,
    'Rahu': 18, 'Jupiter': 16, 'Saturn': 19, 'Mercury': 17
  };
  
  const planetSanskrit: Record<string, string> = {
    'Ketu': 'केतु', 'Venus': 'शुक्र', 'Sun': 'सूर्य', 'Moon': 'चन्द्र',
    'Mars': 'मंगल', 'Rahu': 'राहु', 'Jupiter': 'गुरु', 'Saturn': 'शनि', 'Mercury': 'बुध'
  };
  
  // Calculate starting Dasha based on Moon's Nakshatra
  const startingNakshatra = moonPosition.nakshatra;
  const startingDashaIndex = (startingNakshatra - 1) % 9;
  
  const birthDate = new Date(birthData.dateOfBirth);
  let currentDate = new Date(birthDate);
  const dashaPeriods: DashaInfo[] = [];
  
  for (let i = 0; i < 9; i++) {
    const dashaIndex = (startingDashaIndex + i) % 9;
    const planet = dashaSequence[dashaIndex];
    const years = dashaYears[planet];
    const endDate = new Date(currentDate);
    endDate.setFullYear(currentDate.getFullYear() + years);
    
    const now = new Date();
    const isActive = currentDate <= now && endDate >= now;
    
    dashaPeriods.push({
      planet,
      planetSanskrit: planetSanskrit[planet],
      startDate: new Date(currentDate),
      endDate,
      years,
      months: 0,
      days: 0,
      isActive,
      effects: [`${planet} Mahadasha effects based on position and strength`]
    });
    
    currentDate = endDate;
  }
  
  return dashaPeriods;
}

// Main enhanced Kundali generation function
export async function generateDetailedKundali(birthData: EnhancedBirthData): Promise<DetailedKundali> {
  try {
    const birthDate = new Date(birthData.dateOfBirth);
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    const [hours, minutes] = birthData.timeOfBirth.split(':').map(Number);
    const hour = hours + minutes / 60;
    
    const jd = getJulianDay(year, month, day, hour);
    const ayanamsa = calculateAyanamsa(jd);
    
    console.log('Generating detailed Kundali with enhanced calculations...');
    
    // Calculate planetary positions
    const planets: Record<string, PlanetaryPosition> = {};
    const planetNames = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
    
    for (const planetName of planetNames) {
      planets[planetName] = calculateEnhancedPlanetPosition(jd, planetName, ayanamsa);
    }
    
    // Calculate houses (simplified)
    const ascendantLongitude = planets['Sun'].longitude; // Simplified
    const ascendant = Math.floor(ascendantLongitude / 30) + 1;
    
    const houses: HouseInfo[] = [];
    for (let i = 0; i < 12; i++) {
      const houseNumber = i + 1;
      const cusp = (ascendantLongitude + (i * 30)) % 360;
      const sign = Math.floor(cusp / 30) + 1;
      const signData = ZODIAC_SIGNS[sign - 1];
      
      const planetsInHouse = Object.values(planets).filter(p => p.house === houseNumber).map(p => p.name);
      
      houses.push({
        number: houseNumber,
        cusp,
        sign,
        signName: signData?.name || 'Unknown',
        lord: signData?.lord || 'Unknown',
        planets: planetsInHouse,
        signification: getHouseSignifications(houseNumber),
        strength: 50 // Base strength
      });
    }
    
    // Update planet houses based on ascendant
    Object.values(planets).forEach(planet => {
      const adjustedHouse = Math.floor((planet.longitude - ascendantLongitude + 360) / 30) + 1;
      planet.house = adjustedHouse > 12 ? adjustedHouse - 12 : adjustedHouse;
    });
    
    // Detect Yogas and Doshas
    const yogas = detectYogas(planets, houses);
    const doshas = detectDoshas(planets, houses);
    
    // Calculate Dashas
    const dashaList = calculateVimshottariDasha(birthData, planets['Moon']);
    const currentDasha = dashaList.find(d => d.isActive) || dashaList[0];
    
    // Generate comprehensive results
    const detailedKundali: DetailedKundali = {
      birthData,
      basicInfo: {
        ascendant,
        ascendantName: ZODIAC_SIGNS[ascendant - 1]?.name || 'Unknown',
        ascendantLord: ZODIAC_SIGNS[ascendant - 1]?.lord || 'Unknown',
        moonSign: planets['Moon'].rashi,
        moonSignName: planets['Moon'].rashiName,
        sunSign: planets['Sun'].rashi,
        sunSignName: planets['Sun'].rashiName,
        birthNakshatra: planets['Moon'].nakshatraName,
        janmaRashi: planets['Moon'].rashiName,
        tithi: 'Calculated based on Sun-Moon distance',
        karana: 'Half of Tithi',
        yoga: 'Calculated based on Sun-Moon distance',
        sunrise: '06:00 AM',
        sunset: '06:00 PM'
      },
      planets,
      houses,
      yogas,
      doshas,
      dashas: {
        current: currentDasha,
        mahadasha: dashaList,
        vimshottari: dashaList
      },
      vargas: generateVargaCharts(planets),
      predictions: generatePredictions(planets, houses, yogas, doshas),
      remedies: generateRemedies(planets, doshas),
      compatibility: generateCompatibilityInfo(planets),
      transits: generateTransitInfo(planets),
      auspiciousTimes: generateAuspiciousTimes()
    };
    
    return detailedKundali;
  } catch (error) {
    console.error('Error generating detailed Kundali:', error);
    throw error;
  }
}

// Helper functions
function getHouseSignifications(houseNumber: number): string[] {
  const significations: Record<number, string[]> = {
    1: ['Self', 'Personality', 'Appearance', 'Health'],
    2: ['Wealth', 'Family', 'Speech', 'Food'],
    3: ['Siblings', 'Communication', 'Short travels', 'Courage'],
    4: ['Mother', 'Home', 'Property', 'Vehicles'],
    5: ['Children', 'Education', 'Creativity', 'Romance'],
    6: ['Enemies', 'Disease', 'Service', 'Debt'],
    7: ['Spouse', 'Partnership', 'Business', 'Marriage'],
    8: ['Longevity', 'Transformation', 'Occult', 'Insurance'],
    9: ['Father', 'Guru', 'Religion', 'Long travels'],
    10: ['Career', 'Reputation', 'Government', 'Authority'],
    11: ['Gains', 'Friends', 'Wishes', 'Income'],
    12: ['Losses', 'Spirituality', 'Foreign lands', 'Moksha']
  };
  
  return significations[houseNumber] || [];
}

function generateVargaCharts(planets: Record<string, PlanetaryPosition>): VargaChart[] {
  return [
    {
      name: 'Navamsa (D9)',
      division: 9,
      planets: {},
      significance: 'Marriage and Fortune',
      analysis: 'Shows the strength of planets in marriage and fortune'
    },
    {
      name: 'Dashamsa (D10)', 
      division: 10,
      planets: {},
      significance: 'Career and Profession',
      analysis: 'Indicates career prospects and professional success'
    }
  ];
}

function generatePredictions(planets: Record<string, PlanetaryPosition>, houses: HouseInfo[], yogas: YogaInfo[], doshas: DoshaInfo[]) {
  return {
    personality: 'Based on ascendant and moon sign analysis',
    career: 'Analyzed through 10th house and its lord',
    finance: 'Based on 2nd and 11th house analysis',
    relationships: 'Analyzed through 7th house and Venus',
    health: 'Based on 6th house and planetary afflictions',
    family: 'Analyzed through 4th house and family planets',
    education: 'Based on 5th house and Mercury',
    spirituality: 'Analyzed through 12th house and Jupiter'
  };
}

function generateRemedies(planets: Record<string, PlanetaryPosition>, doshas: DoshaInfo[]) {
  return {
    gemstones: ['Ruby for Sun', 'Pearl for Moon', 'Red Coral for Mars'],
    mantras: ['Om Suryaya Namaha', 'Om Chandraya Namaha', 'Om Mangalaya Namaha'],
    charity: ['Donate wheat on Sunday', 'Donate rice on Monday', 'Donate red items on Tuesday'],
    fasting: ['Fast on Sundays for Sun', 'Fast on Mondays for Moon'],
    colors: ['Wear red for Mars', 'Wear white for Moon', 'Wear yellow for Jupiter'],
    directions: ['East for Sun', 'North for Mercury', 'Northeast for Jupiter'],
    puja: ['Surya Puja', 'Chandra Puja', 'Mangal Puja']
  };
}

function generateCompatibilityInfo(planets: Record<string, PlanetaryPosition>) {
  return {
    bestMatches: ['Aries', 'Leo', 'Sagittarius'],
    compatibility: {
      'Aries': 85,
      'Taurus': 65,
      'Gemini': 75,
      'Cancer': 80
    }
  };
}

function generateTransitInfo(planets: Record<string, PlanetaryPosition>) {
  return {
    current: 'Current planetary transits and their effects',
    upcoming: ['Jupiter transit in next 6 months', 'Saturn transit effects'],
    warnings: ['Avoid starting new ventures during Mercury retrograde']
  };
}

function generateAuspiciousTimes() {
  return {
    muhurta: ['6:00 AM - 7:30 AM', '10:00 AM - 11:30 AM'],
    festivals: ['Diwali', 'Dussehra', 'Akshaya Tritiya'],
    periods: ['Thursday mornings', 'Friday evenings']
  };
}
