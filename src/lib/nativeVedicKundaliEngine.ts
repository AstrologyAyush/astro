// Complete Native Vedic Kundali Engine - No External Dependencies
// Based on traditional astronomical calculations

export interface BirthData {
  name: string;
  dob: string; // YYYY-MM-DD format
  time: string; // HH:MM format
  latitude: number;
  longitude: number;
  timezone: number;
}

export interface PlanetPosition {
  name: string;
  sign: string;
  degree: number;
  nakshatra: string;
  pada: number;
  house: number;
  isExalted: boolean;
  isDebilitated: boolean;
  isOwnSign: boolean;
}

export interface DashaInfo {
  planet: string;
  startDate: Date;
  endDate: Date;
  years: number;
  balance: number;
}

export interface Yoga {
  name: string;
  description: string;
  strength: string;
  planets: string[];
}

export interface VargaChart {
  name: string;
  type: string;
  planets: { [key: string]: { sign: string; house: number } };
}

export interface KundaliResult {
  personalInfo: {
    name: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
  };
  lagna: {
    sign: string;
    degree: number;
    nakshatra: string;
    pada: number;
  };
  planets: PlanetPosition[];
  houses: { [key: number]: string[] };
  dashas: DashaInfo[];
  currentDasha: DashaInfo;
  yogas: Yoga[];
  vargaCharts: VargaChart[];
  predictions: {
    career: string;
    marriage: string;
    wealth: string;
    health: string;
    successPeriod: string;
  };
}

// Zodiac signs in order
const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Nakshatras in order
const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

// Nakshatra rulers for Dasha calculation
const NAKSHATRA_RULERS = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu',
  'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus', 'Sun',
  'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu',
  'Jupiter', 'Saturn', 'Mercury'
];

// Dasha periods in years
const DASHA_YEARS = {
  'Ketu': 7, 'Venus': 20, 'Sun': 6, 'Moon': 10, 'Mars': 7,
  'Rahu': 18, 'Jupiter': 16, 'Saturn': 19, 'Mercury': 17
};

// Dasha sequence
const DASHA_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

// Planetary exaltation and debilitation
const PLANETARY_STATES = {
  'Sun': { exalted: 'Aries', debilitated: 'Libra', ownSigns: ['Leo'] },
  'Moon': { exalted: 'Taurus', debilitated: 'Scorpio', ownSigns: ['Cancer'] },
  'Mars': { exalted: 'Capricorn', debilitated: 'Cancer', ownSigns: ['Aries', 'Scorpio'] },
  'Mercury': { exalted: 'Virgo', debilitated: 'Pisces', ownSigns: ['Gemini', 'Virgo'] },
  'Jupiter': { exalted: 'Cancer', debilitated: 'Capricorn', ownSigns: ['Sagittarius', 'Pisces'] },
  'Venus': { exalted: 'Pisces', debilitated: 'Virgo', ownSigns: ['Taurus', 'Libra'] },
  'Saturn': { exalted: 'Libra', debilitated: 'Aries', ownSigns: ['Capricorn', 'Aquarius'] }
};

// 1. Julian Day Calculation
function calculateJulianDay(day: number, month: number, year: number, hour: number, minute: number): number {
  let y = year;
  let m = month;
  
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const JD = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5;
  const fracDay = (hour + minute / 60) / 24;
  
  return JD + fracDay;
}

// 2. Ayanamsa Calculation (Lahiri)
function calculateAyanamsa(JD: number): number {
  return 23.85675 + 0.00000036 * (JD - 2451545.0);
}

// 3. Planetary Position Calculation
function calculatePlanetaryPositions(JD: number, ayanamsa: number): { [key: string]: number } {
  const positions: { [key: string]: number } = {};
  
  // Sun calculation
  const M_sun = (357.5291 + 0.98560028 * (JD - 2451545)) % 360;
  const L_sun = (280.46646 + 0.98564736 * (JD - 2451545) + 1.914602 * Math.sin(M_sun * Math.PI / 180)) % 360;
  positions.Sun = (L_sun - ayanamsa + 360) % 360;
  
  // Moon calculation
  const M_moon = (134.963 + 13.064993 * (JD - 2451545)) % 360;
  const L_moon = (218.316 + 13.176396 * (JD - 2451545) + 6.289 * Math.sin(M_moon * Math.PI / 180)) % 360;
  positions.Moon = (L_moon - ayanamsa + 360) % 360;
  
  // Mars calculation (simplified)
  const M_mars = (19.373 + 0.52403840 * (JD - 2451545)) % 360;
  const L_mars = (355.433 + 0.52403840 * (JD - 2451545) + 10.691 * Math.sin(M_mars * Math.PI / 180)) % 360;
  positions.Mars = (L_mars - ayanamsa + 360) % 360;
  
  // Mercury calculation (simplified)
  const M_mercury = (174.7948 + 4.09233445 * (JD - 2451545)) % 360;
  const L_mercury = (252.251 + 4.09233445 * (JD - 2451545) + 23.440 * Math.sin(M_mercury * Math.PI / 180)) % 360;
  positions.Mercury = (L_mercury - ayanamsa + 360) % 360;
  
  // Jupiter calculation (simplified)
  const M_jupiter = (20.020 + 0.08308529 * (JD - 2451545)) % 360;
  const L_jupiter = (34.351 + 0.08308529 * (JD - 2451545) + 5.555 * Math.sin(M_jupiter * Math.PI / 180)) % 360;
  positions.Jupiter = (L_jupiter - ayanamsa + 360) % 360;
  
  // Venus calculation (simplified)
  const M_venus = (50.416 + 1.60213034 * (JD - 2451545)) % 360;
  const L_venus = (181.980 + 1.60213034 * (JD - 2451545) + 1.914 * Math.sin(M_venus * Math.PI / 180)) % 360;
  positions.Venus = (L_venus - ayanamsa + 360) % 360;
  
  // Saturn calculation (simplified)
  const M_saturn = (317.021 + 0.03344414 * (JD - 2451545)) % 360;
  const L_saturn = (50.078 + 0.03344414 * (JD - 2451545) + 6.456 * Math.sin(M_saturn * Math.PI / 180)) % 360;
  positions.Saturn = (L_saturn - ayanamsa + 360) % 360;
  
  // Rahu (North Node) - simplified calculation
  positions.Rahu = (125.044555 - 0.0529539 * (JD - 2451545) + 360) % 360;
  
  // Ketu is always opposite to Rahu
  positions.Ketu = (positions.Rahu + 180) % 360;
  
  return positions;
}

// 4. Ascendant Calculation
function calculateAscendant(JD: number, longitude: number, latitude: number): number {
  const T = (JD - 2451545.0) / 36525.0;
  const GMST = (280.46061837 + 360.98564736629 * (JD - 2451545)) % 360;
  const LST = (GMST + longitude) % 360;
  
  // Convert LST to ascendant degree (simplified)
  const ascendantDegree = (LST + latitude * 0.25) % 360;
  return ascendantDegree;
}

// 5. Get Nakshatra and Pada
function getNakshatraAndPada(degree: number): { nakshatra: string; pada: number } {
  const nakshatraIndex = Math.floor(degree / 13.333333);
  const remainderInNakshatra = degree % 13.333333;
  const pada = Math.floor(remainderInNakshatra / 3.333333) + 1;
  
  return {
    nakshatra: NAKSHATRAS[nakshatraIndex] || 'Unknown',
    pada: pada
  };
}

// 6. Calculate House Positions
function calculateHousePositions(planetPositions: { [key: string]: number }, ascendantDegree: number): { [key: string]: number } {
  const housePositions: { [key: string]: number } = {};
  
  Object.keys(planetPositions).forEach(planet => {
    const planetDegree = planetPositions[planet];
    let houseDiff = planetDegree - ascendantDegree;
    if (houseDiff < 0) houseDiff += 360;
    const house = Math.floor(houseDiff / 30) + 1;
    housePositions[planet] = house;
  });
  
  return housePositions;
}

// 7. Calculate Vimshottari Dasha
function calculateDashas(moonDegree: number, birthDate: Date): DashaInfo[] {
  const moonNakshatra = getNakshatraAndPada(moonDegree);
  const nakshatraIndex = NAKSHATRAS.indexOf(moonNakshatra.nakshatra);
  const ruler = NAKSHATRA_RULERS[nakshatraIndex];
  
  // Calculate elapsed time in current nakshatra
  const percentElapsed = (moonDegree % 13.333333) / 13.333333;
  const remainingYears = DASHA_YEARS[ruler] * (1 - percentElapsed);
  
  const dashas: DashaInfo[] = [];
  let currentDate = new Date(birthDate);
  
  // Add remaining period of birth nakshatra ruler
  const firstDashaEnd = new Date(currentDate);
  firstDashaEnd.setFullYear(firstDashaEnd.getFullYear() + Math.floor(remainingYears));
  firstDashaEnd.setMonth(firstDashaEnd.getMonth() + Math.floor((remainingYears % 1) * 12));
  
  dashas.push({
    planet: ruler,
    startDate: new Date(currentDate),
    endDate: new Date(firstDashaEnd),
    years: remainingYears,
    balance: remainingYears
  });
  
  currentDate = new Date(firstDashaEnd);
  
  // Add subsequent dashas in order
  const rulerIndex = DASHA_ORDER.indexOf(ruler);
  for (let i = 1; i < 9; i++) {
    const nextRulerIndex = (rulerIndex + i) % 9;
    const nextRuler = DASHA_ORDER[nextRulerIndex];
    const years = DASHA_YEARS[nextRuler];
    
    const endDate = new Date(currentDate);
    endDate.setFullYear(endDate.getFullYear() + years);
    
    dashas.push({
      planet: nextRuler,
      startDate: new Date(currentDate),
      endDate: new Date(endDate),
      years: years,
      balance: years
    });
    
    currentDate = new Date(endDate);
  }
  
  return dashas;
}

// 8. Detect Yogas
function detectYogas(planetPositions: { [key: string]: number }, housePositions: { [key: string]: number }): Yoga[] {
  const yogas: Yoga[] = [];
  
  // Budhaditya Yoga (Sun + Mercury in same house)
  if (housePositions.Sun === housePositions.Mercury) {
    const degreesDiff = Math.abs(planetPositions.Sun - planetPositions.Mercury);
    if (degreesDiff < 12 || degreesDiff > 348) {
      yogas.push({
        name: 'Budhaditya Yoga',
        description: 'Sun and Mercury conjunction gives intelligence and leadership',
        strength: 'Strong',
        planets: ['Sun', 'Mercury']
      });
    }
  }
  
  // Gajakesari Yoga (Moon and Jupiter in Kendra)
  const moonHouse = housePositions.Moon;
  const jupiterHouse = housePositions.Jupiter;
  const kendraHouses = [1, 4, 7, 10];
  
  if (kendraHouses.includes(moonHouse) && kendraHouses.includes(jupiterHouse)) {
    const houseDiff = Math.abs(moonHouse - jupiterHouse);
    if ([0, 3, 6, 9].includes(houseDiff)) {
      yogas.push({
        name: 'Gajakesari Yoga',
        description: 'Moon and Jupiter in Kendra brings wealth and fame',
        strength: 'Strong',
        planets: ['Moon', 'Jupiter']
      });
    }
  }
  
  // Simple Raj Yoga detection (basic version)
  const trikonaLords = [1, 5, 9]; // Houses of Dharma
  const kendraLords = [1, 4, 7, 10]; // Houses of Kendra
  
  Object.keys(housePositions).forEach(planet1 => {
    Object.keys(housePositions).forEach(planet2 => {
      if (planet1 !== planet2) {
        const house1 = housePositions[planet1];
        const house2 = housePositions[planet2];
        
        if (trikonaLords.includes(house1) && kendraLords.includes(house2) && house1 === house2) {
          yogas.push({
            name: 'Raj Yoga',
            description: 'Combination of Trikona and Kendra lords brings royal status',
            strength: 'Medium',
            planets: [planet1, planet2]
          });
        }
      }
    });
  });
  
  return yogas;
}

// 9. Calculate Divisional Charts
function calculateVargaCharts(planetPositions: { [key: string]: number }): VargaChart[] {
  const vargaCharts: VargaChart[] = [];
  
  // D9 (Navamsa) Chart
  const d9Planets: { [key: string]: { sign: string; house: number } } = {};
  Object.keys(planetPositions).forEach(planet => {
    const degree = planetPositions[planet];
    const sign = Math.floor(degree / 30);
    const degreesInSign = degree % 30;
    const navamsaSign = (sign * 9 + Math.floor(degreesInSign / 3.333333)) % 12;
    
    d9Planets[planet] = {
      sign: ZODIAC_SIGNS[navamsaSign],
      house: navamsaSign + 1
    };
  });
  
  vargaCharts.push({
    name: 'Navamsa',
    type: 'D9',
    planets: d9Planets
  });
  
  // D10 (Dasamsa) Chart
  const d10Planets: { [key: string]: { sign: string; house: number } } = {};
  Object.keys(planetPositions).forEach(planet => {
    const degree = planetPositions[planet];
    const sign = Math.floor(degree / 30);
    const degreesInSign = degree % 30;
    const dasamsaSign = (sign * 10 + Math.floor(degreesInSign / 3)) % 12;
    
    d10Planets[planet] = {
      sign: ZODIAC_SIGNS[dasamsaSign],
      house: dasamsaSign + 1
    };
  });
  
  vargaCharts.push({
    name: 'Dasamsa',
    type: 'D10',
    planets: d10Planets
  });
  
  return vargaCharts;
}

// 10. Generate Predictions
function generatePredictions(
  planetPositions: { [key: string]: number },
  housePositions: { [key: string]: number },
  yogas: Yoga[],
  dashas: DashaInfo[]
): any {
  const predictions = {
    career: 'Default career prediction',
    marriage: 'Default marriage prediction',
    wealth: 'Default wealth prediction',
    health: 'Default health prediction',
    successPeriod: 'Default success period'
  };
  
  // Career prediction based on 10th house
  const tenthHousePlanets = Object.keys(housePositions).filter(planet => housePositions[planet] === 10);
  if (tenthHousePlanets.includes('Sun')) {
    predictions.career = 'Government service, leadership roles, administration';
  } else if (tenthHousePlanets.includes('Jupiter')) {
    predictions.career = 'Teaching, consulting, spiritual guidance, law';
  } else if (tenthHousePlanets.includes('Mercury')) {
    predictions.career = 'Communication, writing, business, technology';
  } else if (tenthHousePlanets.includes('Venus')) {
    predictions.career = 'Arts, entertainment, luxury goods, beauty industry';
  } else {
    predictions.career = 'Versatile career options, entrepreneurship potential';
  }
  
  // Marriage prediction based on 7th house and Venus
  const seventhHousePlanets = Object.keys(housePositions).filter(planet => housePositions[planet] === 7);
  const venusSign = ZODIAC_SIGNS[Math.floor(planetPositions.Venus / 30)];
  
  if (venusSign === 'Pisces') {
    predictions.marriage = 'Spiritual and harmonious marriage, partner with artistic qualities';
  } else if (seventhHousePlanets.includes('Jupiter')) {
    predictions.marriage = 'Traditional marriage with learned partner after age 25';
  } else {
    predictions.marriage = 'Good marriage prospects with supportive partner';
  }
  
  // Success period based on current and upcoming dashas
  const currentDasha = dashas[0];
  if (currentDasha.planet === 'Jupiter') {
    predictions.successPeriod = `${currentDasha.startDate.getFullYear()}-${currentDasha.endDate.getFullYear()} (Jupiter Mahadasha brings growth and wisdom)`;
  } else if (currentDasha.planet === 'Venus') {
    predictions.successPeriod = `${currentDasha.startDate.getFullYear()}-${currentDasha.endDate.getFullYear()} (Venus Mahadasha brings luxury and relationships)`;
  } else {
    predictions.successPeriod = `${currentDasha.startDate.getFullYear()}-${currentDasha.endDate.getFullYear()} (${currentDasha.planet} Mahadasha period)`;
  }
  
  // Wealth prediction based on 2nd and 11th houses
  const secondHousePlanets = Object.keys(housePositions).filter(planet => housePositions[planet] === 2);
  const eleventhHousePlanets = Object.keys(housePositions).filter(planet => housePositions[planet] === 11);
  
  if (secondHousePlanets.includes('Jupiter') || eleventhHousePlanets.includes('Jupiter')) {
    predictions.wealth = 'Excellent wealth accumulation through wisdom and good investments';
  } else if (yogas.some(yoga => yoga.name.includes('Dhana'))) {
    predictions.wealth = 'Strong wealth indicators through special combinations';
  } else {
    predictions.wealth = 'Steady financial growth with careful planning';
  }
  
  return predictions;
}

// Main function to generate complete Kundali
export function generateNativeVedicKundali(birthData: BirthData): KundaliResult {
  try {
    // Parse birth data
    const [year, month, day] = birthData.dob.split('-').map(Number);
    const [hour, minute] = birthData.time.split(':').map(Number);
    
    // Convert to UTC
    const utcHour = hour - birthData.timezone;
    const utcMinute = minute;
    
    // Calculate Julian Day
    const JD = calculateJulianDay(day, month, year, utcHour, utcMinute);
    
    // Calculate Ayanamsa
    const ayanamsa = calculateAyanamsa(JD);
    
    // Calculate planetary positions
    const planetPositions = calculatePlanetaryPositions(JD, ayanamsa);
    
    // Calculate Ascendant
    const ascendantDegree = calculateAscendant(JD, birthData.longitude, birthData.latitude);
    const ascendantSign = ZODIAC_SIGNS[Math.floor(ascendantDegree / 30)];
    const ascendantNakshatra = getNakshatraAndPada(ascendantDegree);
    
    // Calculate house positions
    const housePositions = calculateHousePositions(planetPositions, ascendantDegree);
    
    // Create planet objects with detailed information
    const planets: PlanetPosition[] = Object.keys(planetPositions).map(planetName => {
      const degree = planetPositions[planetName];
      const sign = ZODIAC_SIGNS[Math.floor(degree / 30)];
      const nakshatra = getNakshatraAndPada(degree);
      const house = housePositions[planetName];
      
      const planetState = PLANETARY_STATES[planetName];
      const isExalted = planetState?.exalted === sign;
      const isDebilitated = planetState?.debilitated === sign;
      const isOwnSign = planetState?.ownSigns?.includes(sign) || false;
      
      return {
        name: planetName,
        sign: sign,
        degree: degree % 30,
        nakshatra: nakshatra.nakshatra,
        pada: nakshatra.pada,
        house: house,
        isExalted: isExalted,
        isDebilitated: isDebilitated,
        isOwnSign: isOwnSign
      };
    });
    
    // Group planets by houses
    const houses: { [key: number]: string[] } = {};
    for (let i = 1; i <= 12; i++) {
      houses[i] = planets.filter(p => p.house === i).map(p => p.name);
    }
    
    // Calculate Dashas
    const birthDate = new Date(year, month - 1, day);
    const dashas = calculateDashas(planetPositions.Moon, birthDate);
    const currentDasha = dashas[0];
    
    // Detect Yogas
    const yogas = detectYogas(planetPositions, housePositions);
    
    // Calculate Varga Charts
    const vargaCharts = calculateVargaCharts(planetPositions);
    
    // Generate Predictions
    const predictions = generatePredictions(planetPositions, housePositions, yogas, dashas);
    
    return {
      personalInfo: {
        name: birthData.name,
        birthDate: birthData.dob,
        birthTime: birthData.time,
        birthPlace: `Lat: ${birthData.latitude}, Lon: ${birthData.longitude}`
      },
      lagna: {
        sign: ascendantSign,
        degree: ascendantDegree % 30,
        nakshatra: ascendantNakshatra.nakshatra,
        pada: ascendantNakshatra.pada
      },
      planets: planets,
      houses: houses,
      dashas: dashas,
      currentDasha: currentDasha,
      yogas: yogas,
      vargaCharts: vargaCharts,
      predictions: predictions
    };
    
  } catch (error) {
    console.error('Error generating Kundali:', error);
    throw error;
  }
}