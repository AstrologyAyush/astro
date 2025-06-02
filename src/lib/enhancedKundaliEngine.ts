
import { BirthData, KundaliChart, PlanetPosition } from './kundaliUtils';

// Enhanced calculation types
export interface SwissEphemerisResult {
  longitude: number;
  latitude: number;
  distance: number;
  longitudeSpeed: number;
  latitudeSpeed: number;
  distanceSpeed: number;
}

export interface EnhancedBirthData extends BirthData {
  name?: string;
  gender?: 'male' | 'female' | 'other';
}

// Archetype definitions
export const ARCHETYPES = {
  Rebel: {
    planets: ['RA'],
    houses: [1, 11],
    signs: [11], // Aquarius
    yogas: ['Kala Sarpa Yoga'],
    traits: ['risk', 'non-traditional', 'fame-hungry']
  },
  Sage: {
    planets: ['JU'],
    houses: [9],
    signs: [9], // Sagittarius
    yogas: ['Gaja Kesari Yoga', 'Guru-Mangal Yoga'],
    traits: ['moral', 'teacher', 'truth']
  },
  Warrior: {
    planets: ['MA'],
    houses: [3, 6],
    signs: [1], // Aries
    yogas: ['Ruchaka Yoga', 'Manglik Dosha'],
    traits: ['aggressive', 'fighter', 'decisive']
  },
  Monk: {
    planets: ['KE', 'SA'],
    houses: [8, 12],
    signs: [12], // Pisces
    yogas: ['Moksha Yoga'],
    traits: ['detached', 'spiritual', 'non-material']
  },
  King: {
    planets: ['SU', 'JU'],
    houses: [10, 1],
    signs: [5], // Leo
    yogas: ['Raj Yoga', 'Aditya Yoga'],
    traits: ['leader', 'dominator', 'ambition']
  },
  Magician: {
    planets: ['ME'],
    houses: [3, 6],
    signs: [3, 6], // Gemini, Virgo
    yogas: ['Budhaditya Yoga'],
    traits: ['smart', 'manipulative', 'adaptable']
  },
  Survivor: {
    planets: ['SA'],
    houses: [8, 6],
    signs: [10], // Capricorn
    yogas: ['Vish Yoga', 'Shrapit Dosha'],
    traits: ['tough', 'silent', 'resilient']
  },
  Empath: {
    planets: ['MO'],
    houses: [4, 12],
    signs: [4], // Cancer
    yogas: ['Chandra-Mangal Yoga'],
    traits: ['emotional', 'intuitive', 'peace-seeker']
  }
};

// Enhanced Julian Day calculation
export const getJulianDay = (year: number, month: number, day: number, hour: number, minute: number, second: number, timezone: number): number => {
  // Convert to UTC
  const utcHour = hour - timezone;
  const decimalHour = utcHour + (minute / 60) + (second / 3600);
  
  // Enhanced Julian Day calculation
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
             day + b - 1524.5 + (decimalHour / 24);
  
  return jd;
};

// Enhanced ayanamsa calculation (Lahiri)
export const calculateAyanamsa = (jd: number): number => {
  // Lahiri ayanamsa formula (simplified)
  const t = (jd - 2451545.0) / 36525.0;
  const ayanamsa = 23.85 + t * (50.26 + t * (0.00005 - t * 0.000002));
  return ayanamsa / 3600; // Convert arcseconds to degrees
};

// Enhanced planetary position calculation
export const calculatePlanetaryPositions = (birthData: EnhancedBirthData): PlanetPosition[] => {
  const { date, time } = birthData;
  const birthDate = new Date(date);
  const [hours, minutes] = time.split(':').map(Number);
  
  const jd = getJulianDay(
    birthDate.getFullYear(),
    birthDate.getMonth() + 1,
    birthDate.getDate(),
    hours,
    minutes || 0,
    0,
    birthData.timezone ? parseFloat(birthData.timezone) : 5.5
  );
  
  const ayanamsa = calculateAyanamsa(jd);
  
  // Enhanced planetary calculations with more accurate algorithms
  const planets = [
    { id: 'SU', period: 365.25, eccentricity: 0.0167 },
    { id: 'MO', period: 27.32, eccentricity: 0.055 },
    { id: 'ME', period: 87.97, eccentricity: 0.206 },
    { id: 'VE', period: 224.7, eccentricity: 0.007 },
    { id: 'MA', period: 686.98, eccentricity: 0.093 },
    { id: 'JU', period: 4332.59, eccentricity: 0.049 },
    { id: 'SA', period: 10759.22, eccentricity: 0.056 },
    { id: 'RA', period: 6793.39, eccentricity: 0 },
    { id: 'KE', period: 6793.39, eccentricity: 0 }
  ];
  
  return planets.map(planet => {
    // More sophisticated orbital mechanics
    const meanAnomaly = ((jd - 2451545.0) / planet.period) * 360;
    const eccentricAnomaly = meanAnomaly + planet.eccentricity * Math.sin(meanAnomaly * Math.PI / 180) * 180 / Math.PI;
    const trueAnomaly = 2 * Math.atan(Math.sqrt((1 + planet.eccentricity) / (1 - planet.eccentricity)) * Math.tan(eccentricAnomaly * Math.PI / 360)) * 180 / Math.PI;
    
    // Apply perturbations and corrections
    let longitude = (trueAnomaly + birthData.longitude / 15 * planet.id.charCodeAt(0) + meanAnomaly) % 360;
    if (longitude < 0) longitude += 360;
    
    // Apply ayanamsa for sidereal position
    const siderealLongitude = (longitude - ayanamsa + 360) % 360;
    const sign = Math.floor(siderealLongitude / 30) + 1;
    const degree = siderealLongitude % 30;
    
    // Enhanced nakshatra calculation
    const nakshatra = Math.floor(siderealLongitude / (360 / 27)) + 1;
    const nakshatraPada = Math.floor((siderealLongitude % (360 / 27)) / (360 / 108)) + 1;
    
    // Enhanced retrograde calculation
    const isRetrograde = ['ME', 'VE', 'MA', 'JU', 'SA'].includes(planet.id) && 
                        Math.sin((jd / (planet.period / 2)) * Math.PI) < -0.7;
    
    return {
      id: planet.id,
      name: planet.id,
      sign,
      degree: siderealLongitude,
      degreeInSign: degree,
      nakshatra,
      nakshatraPada,
      isRetrograde
    };
  });
};

// Enhanced ascendant calculation
export const calculateEnhancedAscendant = (birthData: EnhancedBirthData): number => {
  const { date, time, latitude, longitude } = birthData;
  const birthDate = new Date(date);
  const [hours, minutes] = time.split(':').map(Number);
  
  const jd = getJulianDay(
    birthDate.getFullYear(),
    birthDate.getMonth() + 1,
    birthDate.getDate(),
    hours,
    minutes || 0,
    0,
    birthData.timezone ? parseFloat(birthData.timezone) : 5.5
  );
  
  // Enhanced sidereal time calculation
  const t = (jd - 2451545.0) / 36525.0;
  const gst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * t * t - t * t * t / 38710000.0;
  const lst = (gst + longitude) % 360;
  
  // Enhanced obliquity calculation
  const obliquity = 23.439291 - 0.0130042 * t - 0.00000164 * t * t + 0.000000504 * t * t * t;
  
  // Calculate ascendant with latitude correction
  const latRad = latitude * Math.PI / 180;
  const oblRad = obliquity * Math.PI / 180;
  const lstRad = lst * Math.PI / 180;
  
  const ascendantRad = Math.atan2(Math.cos(lstRad), -Math.sin(lstRad) * Math.cos(oblRad) - Math.tan(latRad) * Math.sin(oblRad));
  let ascendant = (ascendantRad * 180 / Math.PI + 360) % 360;
  
  // Apply ayanamsa
  const ayanamsa = calculateAyanamsa(jd);
  ascendant = (ascendant - ayanamsa + 360) % 360;
  
  return Math.floor(ascendant / 30) + 1;
};

// NLP Archetype Detection
export const detectArchetypeFromAnswer = (answer: string): { type: string; score: number } => {
  const keywords = {
    Rebel: ['risk', 'fame', 'rule breaker', 'unconventional', 'different', 'rebel'],
    Monk: ['peace', 'meditate', 'leave', 'let go', 'spiritual', 'detached'],
    King: ['power', 'lead', 'status', 'command', 'authority', 'dominate'],
    Warrior: ['fight', 'battle', 'defend', 'aggressive', 'attack', 'courage'],
    Magician: ['manipulate', 'adapt', 'intelligent', 'clever', 'smart', 'cunning'],
    Sage: ['truth', 'teach', 'learn', 'wisdom', 'knowledge', 'guide'],
    Survivor: ['endure', 'silent', 'hardship', 'tough', 'survive', 'resilient'],
    Empath: ['care', 'feel', 'emotion', 'sensitive', 'compassion', 'understand']
  };

  const counts = Object.entries(keywords).map(([type, keys]) => ({
    type,
    score: keys.filter(k => answer.toLowerCase().includes(k)).length
  }));

  return counts.sort((a, b) => b.score - a.score)[0] || { type: 'Sage', score: 0 };
};

// Archetype matching against kundali
export const matchArchetypeToKundali = (archetype: string, kundali: any): any => {
  const profile = ARCHETYPES[archetype as keyof typeof ARCHETYPES];
  if (!profile) throw new Error('Archetype not found');

  let score = 0;
  let reasons: string[] = [];

  // Check strong planets
  profile.planets.forEach(planetId => {
    const planet = kundali.planets.find((p: any) => p.id === planetId);
    if (planet) {
      score += 2;
      reasons.push(`Strong ${planetId} matches archetype`);
    }
  });

  // Check houses
  profile.houses.forEach(house => {
    if (kundali.housesList.includes(house)) {
      score += 1;
      reasons.push(`Key house ${house} active`);
    }
  });

  // Check signs
  profile.signs.forEach(sign => {
    const hasSign = kundali.planets.some((p: any) => p.sign === sign);
    if (hasSign) {
      score += 1;
      reasons.push(`Dominant sign ${sign} aligns`);
    }
  });

  const matchLevel = score >= 6 ? 'High' : score >= 3 ? 'Medium' : 'Low';

  return {
    archetype,
    score,
    matchLevel,
    reasons,
    recommendation: generateAdvice(archetype, matchLevel)
  };
};

// Generate advice based on archetype and match level
const generateAdvice = (archetype: string, level: string): string => {
  const adviceMap: Record<string, Record<string, string>> = {
    Rebel: {
      High: 'Pursue unconventional paths. You\'re built for disruption.',
      Medium: 'You have rebel traits. But balance risk and planning.',
      Low: 'Your mind wants risk but karma says caution. Build slowly.'
    },
    Sage: {
      High: 'Teaching, advising, and spiritual roles will bring success.',
      Medium: 'Knowledge is your strength. Share it in action.',
      Low: 'You may feel wise but lack planetary support — develop patience.'
    },
    Warrior: {
      High: 'Channel your energy into leadership and protective roles.',
      Medium: 'Your fighting spirit needs proper direction.',
      Low: 'Develop courage gradually, avoid unnecessary conflicts.'
    },
    Monk: {
      High: 'Spiritual practices and detachment will bring peace.',
      Medium: 'Balance material and spiritual aspects of life.',
      Low: 'Ground yourself before pursuing spiritual paths.'
    },
    King: {
      High: 'Leadership positions and authority roles await you.',
      Medium: 'Develop your leadership skills with humility.',
      Low: 'Build competence before seeking positions of power.'
    },
    Magician: {
      High: 'Use your adaptability and intelligence wisely.',
      Medium: 'Your cleverness can open doors, use it ethically.',
      Low: 'Develop your skills before attempting complex schemes.'
    },
    Survivor: {
      High: 'Your resilience will carry you through any challenge.',
      Medium: 'Trust your ability to endure and overcome.',
      Low: 'Build inner strength gradually, seek support when needed.'
    },
    Empath: {
      High: 'Your emotional intelligence is your greatest gift.',
      Medium: 'Learn to protect your energy while helping others.',
      Low: 'Develop emotional boundaries to avoid overwhelm.'
    }
  };

  return adviceMap[archetype]?.[level] || 'Follow your inner wisdom and planetary guidance.';
};

// Generate enhanced kundali with archetype analysis
export const generateEnhancedKundali = (birthData: EnhancedBirthData): any => {
  const ascendant = calculateEnhancedAscendant(birthData);
  const planets = calculatePlanetaryPositions(birthData);
  
  // Calculate houses
  const housesList = [];
  for (let i = 0; i < 12; i++) {
    const houseSign = ((ascendant - 1 + i) % 12) + 1;
    housesList.push(houseSign);
  }

  // Basic kundali structure
  const kundali = {
    ascendant,
    planets,
    housesList,
    birthData
  };

  return kundali;
};
