
/**
 * Traditional Vimshottari Dasha Engine
 * Following ancient Vedic principles for accurate Mahadasha calculation
 */

export interface DashaInfo {
  planet: string;
  planetHindi: string;
  startDate: Date;
  endDate: Date;
  totalYears: number;
  remainingYears?: number;
  completedYears?: number;
  isActive: boolean;
  isCompleted: boolean;
}

export interface AntardashaInfo {
  planet: string;
  planetHindi: string;
  startDate: Date;
  endDate: Date;
  durationMonths: number;
  isActive: boolean;
}

export interface DetailedDashaResult {
  currentMahadasha: DashaInfo;
  allMahadashas: DashaInfo[];
  currentAntardasha?: AntardashaInfo;
  moonNakshatra: number;
  moonDegreeInNakshatra: number;
  birthDate: Date;
  calculationDetails: {
    nakshatraLord: string;
    balanceAtBirth: number; // Years remaining in first dasha
    totalCycleYears: number;
  };
}

// Traditional Vimshottari Dasha sequence and periods (in years)
const DASHA_SEQUENCE = [
  { planet: 'Ketu', hindi: 'केतु', years: 7 },
  { planet: 'Venus', hindi: 'शुक्र', years: 20 },
  { planet: 'Sun', hindi: 'सूर्य', years: 6 },
  { planet: 'Moon', hindi: 'चन्द्र', years: 10 },
  { planet: 'Mars', hindi: 'मंगल', years: 7 },
  { planet: 'Rahu', hindi: 'राहु', years: 18 },
  { planet: 'Jupiter', hindi: 'गुरु', years: 16 },
  { planet: 'Saturn', hindi: 'शनि', years: 19 },
  { planet: 'Mercury', hindi: 'बुध', years: 17 }
];

// Nakshatra lords following traditional sequence
const NAKSHATRA_LORDS = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'
];

/**
 * Calculate traditional Vimshottari Dasha based on Moon's position
 */
export function calculateVimshottariDasha(
  birthDate: Date,
  moonLongitude: number,
  moonNakshatra: number
): DetailedDashaResult {
  console.log('🔮 Calculating Traditional Vimshottari Dasha');
  console.log('📅 Birth Date:', birthDate);
  console.log('🌙 Moon Longitude:', moonLongitude);
  console.log('⭐ Moon Nakshatra:', moonNakshatra);

  // Calculate Moon's degree within its Nakshatra
  const nakshatraSpan = 360 / 27; // 13.333... degrees per nakshatra
  const nakshatraStartDegree = (moonNakshatra - 1) * nakshatraSpan;
  const moonDegreeInNakshatra = moonLongitude - nakshatraStartDegree;
  
  console.log('📐 Moon degree in Nakshatra:', moonDegreeInNakshatra);

  // Get the Nakshatra lord using traditional mapping
  const nakshatraLordIndex = (moonNakshatra - 1) % 9;
  const nakshatraLord = NAKSHATRA_LORDS[nakshatraLordIndex];
  
  console.log('👑 Nakshatra Lord:', nakshatraLord);

  // Find the Dasha sequence starting position
  const startingDashaIndex = DASHA_SEQUENCE.findIndex(d => d.planet === nakshatraLord);
  const startingDasha = DASHA_SEQUENCE[startingDashaIndex];
  
  // Calculate balance of first Dasha at birth
  // Formula: Balance = Total years * (1 - (degree in nakshatra / nakshatra span))
  const proportionCompleted = moonDegreeInNakshatra / nakshatraSpan;
  const balanceAtBirth = startingDasha.years * (1 - proportionCompleted);
  
  console.log('⚖️ Balance at birth:', balanceAtBirth.toFixed(4), 'years');

  // Generate all Mahadashas starting from birth
  const allMahadashas: DashaInfo[] = [];
  let currentDate = new Date(birthDate);
  const now = new Date();

  // First Dasha (partial)
  const firstDashaEndDate = new Date(currentDate.getTime() + (balanceAtBirth * 365.25 * 24 * 60 * 60 * 1000));
  
  allMahadashas.push({
    planet: startingDasha.planet,
    planetHindi: startingDasha.hindi,
    startDate: new Date(currentDate),
    endDate: firstDashaEndDate,
    totalYears: startingDasha.years,
    remainingYears: balanceAtBirth,
    completedYears: startingDasha.years - balanceAtBirth,
    isActive: currentDate <= now && now <= firstDashaEndDate,
    isCompleted: now > firstDashaEndDate
  });

  currentDate = new Date(firstDashaEndDate);

  // Subsequent complete Dashas
  for (let cycle = 0; cycle < 3; cycle++) { // 3 complete cycles should cover most lifetimes
    for (let i = 1; i < DASHA_SEQUENCE.length; i++) {
      const dashaIndex = (startingDashaIndex + i) % DASHA_SEQUENCE.length;
      const dasha = DASHA_SEQUENCE[dashaIndex];
      
      const endDate = new Date(currentDate.getTime() + (dasha.years * 365.25 * 24 * 60 * 60 * 1000));
      
      allMahadashas.push({
        planet: dasha.planet,
        planetHindi: dasha.hindi,
        startDate: new Date(currentDate),
        endDate,
        totalYears: dasha.years,
        remainingYears: dasha.years,
        completedYears: 0,
        isActive: currentDate <= now && now <= endDate,
        isCompleted: now > endDate
      });

      currentDate = new Date(endDate);
      
      // Stop if we're way past current date
      if (currentDate.getTime() > now.getTime() + (50 * 365.25 * 24 * 60 * 60 * 1000)) {
        break;
      }
    }
  }

  // Find current Mahadasha
  const currentMahadasha = allMahadashas.find(d => d.isActive) || allMahadashas[0];
  
  // Update remaining years for current Mahadasha
  if (currentMahadasha && currentMahadasha.isActive) {
    const timeElapsed = now.getTime() - currentMahadasha.startDate.getTime();
    const yearsElapsed = timeElapsed / (365.25 * 24 * 60 * 60 * 1000);
    currentMahadasha.remainingYears = Math.max(0, currentMahadasha.totalYears - yearsElapsed);
    currentMahadasha.completedYears = Math.min(currentMahadasha.totalYears, yearsElapsed);
  }

  console.log('🎯 Current Mahadasha:', currentMahadasha.planet);
  console.log('⏰ Remaining Years:', currentMahadasha.remainingYears?.toFixed(2));

  const totalCycleYears = DASHA_SEQUENCE.reduce((sum, d) => sum + d.years, 0);

  return {
    currentMahadasha,
    allMahadashas: allMahadashas.slice(0, 15), // Return first 15 dashas
    moonNakshatra,
    moonDegreeInNakshatra,
    birthDate,
    calculationDetails: {
      nakshatraLord,
      balanceAtBirth,
      totalCycleYears
    }
  };
}

/**
 * Calculate Antardasha periods within a Mahadasha
 */
export function calculateAntardasha(mahadasha: DashaInfo): AntardashaInfo[] {
  const antardashas: AntardashaInfo[] = [];
  const mahadashaYears = mahadasha.totalYears;
  
  // Find starting position in sequence
  const mahadashaIndex = DASHA_SEQUENCE.findIndex(d => d.planet === mahadasha.planet);
  
  let currentDate = new Date(mahadasha.startDate);
  
  // Each Antardasha duration = (Mahadasha years * Antardasha years) / Total cycle years
  const totalCycleYears = DASHA_SEQUENCE.reduce((sum, d) => sum + d.years, 0);
  
  for (let i = 0; i < DASHA_SEQUENCE.length; i++) {
    const antardashaIndex = (mahadashaIndex + i) % DASHA_SEQUENCE.length;
    const antardasha = DASHA_SEQUENCE[antardashaIndex];
    
    const antardashaYears = (mahadashaYears * antardasha.years) / totalCycleYears;
    const endDate = new Date(currentDate.getTime() + (antardashaYears * 365.25 * 24 * 60 * 60 * 1000));
    
    const now = new Date();
    
    antardashas.push({
      planet: antardasha.planet,
      planetHindi: antardasha.hindi,
      startDate: new Date(currentDate),
      endDate,
      durationMonths: antardashaYears * 12,
      isActive: currentDate <= now && now <= endDate
    });
    
    currentDate = new Date(endDate);
  }
  
  return antardashas;
}

/**
 * Format Dasha period for display
 */
export function formatDashaPeriod(dasha: DashaInfo): string {
  const startYear = dasha.startDate.getFullYear();
  const endYear = dasha.endDate.getFullYear();
  
  if (dasha.isActive) {
    const remaining = dasha.remainingYears || 0;
    const years = Math.floor(remaining);
    const months = Math.floor((remaining % 1) * 12);
    return `${dasha.planet} Mahadasha (${startYear}-${endYear}) - ${years}Y ${months}M remaining`;
  }
  
  return `${dasha.planet} Mahadasha (${startYear}-${endYear}) - ${dasha.totalYears}Y`;
}

/**
 * Get Dasha effects and predictions
 */
export function getDashaEffects(planet: string): {
  positive: string[];
  challenges: string[];
  general: string[];
} {
  const effects: Record<string, any> = {
    'Sun': {
      positive: ['Leadership opportunities', 'Government favor', 'Fame and recognition', 'Health improvement'],
      challenges: ['Ego conflicts', 'Authority issues', 'Eye problems', 'Paternal issues'],
      general: ['Focus on career and status', 'Government dealings', 'Leadership roles']
    },
    'Moon': {
      positive: ['Mental peace', 'Mother\'s blessings', 'Public popularity', 'Travel opportunities'],
      challenges: ['Emotional instability', 'Mental stress', 'Water-related issues', 'Changeability'],
      general: ['Focus on emotions and mind', 'Public relations', 'Mother and home']
    },
    'Mars': {
      positive: ['Courage and strength', 'Property gains', 'Victory over enemies', 'Physical energy'],
      challenges: ['Anger and aggression', 'Accidents and injuries', 'Blood-related issues', 'Legal disputes'],
      general: ['Focus on action and energy', 'Property matters', 'Siblings and courage']
    },
    'Mercury': {
      positive: ['Business success', 'Communication skills', 'Learning and education', 'Quick thinking'],
      challenges: ['Nervous disorders', 'Speech problems', 'Skin issues', 'Mental confusion'],
      general: ['Focus on communication', 'Business and trade', 'Education and learning']
    },
    'Jupiter': {
      positive: ['Wisdom and knowledge', 'Spiritual growth', 'Children\'s welfare', 'Good fortune'],
      challenges: ['Over-optimism', 'Weight gain', 'Liver problems', 'False hopes'],
      general: ['Focus on wisdom and spirituality', 'Teaching and guidance', 'Religion and philosophy']
    },
    'Venus': {
      positive: ['Love and relationships', 'Artistic success', 'Material comforts', 'Beauty and luxury'],
      challenges: ['Relationship issues', 'Overindulgence', 'Reproductive problems', 'Laziness'],
      general: ['Focus on relationships and pleasure', 'Arts and creativity', 'Material enjoyments']
    },
    'Saturn': {
      positive: ['Hard work rewards', 'Discipline and structure', 'Longevity', 'Spiritual awakening'],
      challenges: ['Delays and obstacles', 'Health issues', 'Depression', 'Separation and loss'],
      general: ['Focus on discipline and hard work', 'Karmic lessons', 'Service and duty']
    },
    'Rahu': {
      positive: ['Sudden gains', 'Foreign connections', 'Technology success', 'Unconventional success'],
      challenges: ['Confusion and illusion', 'Addictions', 'Unconventional problems', 'Mental disturbance'],
      general: ['Focus on material desires', 'Foreign elements', 'Technology and innovation']
    },
    'Ketu': {
      positive: ['Spiritual growth', 'Mystical experiences', 'Liberation from attachments', 'Intuitive knowledge'],
      challenges: ['Confusion and detachment', 'Health issues', 'Loss of direction', 'Separation'],
      general: ['Focus on spirituality', 'Detachment and liberation', 'Past-life karma']
    }
  };
  
  return effects[planet] || {
    positive: ['General positive influences'],
    challenges: ['General challenges'],
    general: ['General life focus']
  };
}
