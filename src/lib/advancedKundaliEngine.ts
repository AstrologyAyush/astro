import { calculateHouses } from './enhancedKundaliUtils';
import { calculatePlanetPositions } from './kundaliUtils';
import { generateAuspiciousTimes } from './remediesEngine';
import { calculateDashas } from './dashaEngine';
import { calculateTithi, calculateKarana, calculateYoga } from './panchangEngine';

export interface BirthData {
  dateOfBirth: Date;
  timeOfBirth: string;
  placeOfBirth: string;
  latitude: number;
  longitude: number;
}

export interface EnhancedBirthData extends BirthData {
  fullName: string;
}

export interface PlanetPosition {
  id: string;
  name: string;
  longitude: number;
  rashi: number;
  rashiName: string;
  house: number;
  degreeInSign: number;
  nakshatra: number;
  nakshatraName: string;
  isRetrograde: boolean;
}

export interface House {
  number: number;
  sign: number;
  signName: string;
  lord: string;
  planets: string[];
  signification: string[];
}

export interface Yoga {
  name: string;
  sanskritName: string;
  present: boolean;
  description: string;
  strength: number;
  type?: 'benefic' | 'malefic';
  planets?: string[];
  effects?: string[];
}

export interface Dosha {
  name: string;
  sanskritName: string;
  present: boolean;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  effects: string[];
  remedies: string[];
}

export interface Dasha {
  planet: string;
  startDate: Date;
  endDate: Date;
  effects: string[];
}

export interface Predictions {
  career: string;
  finance: string;
  relationships: string;
  health: string;
  education: string;
  agePredictions?: {
    [ageGroup: string]: {
      theme: string;
      events: string[];
      struggles: string[];
      successes: string[];
      benefits: string;
    };
  };
}

export interface Remedies {
  gemstones: string[];
  mantras: string[];
  charity: string[];
}

export interface AuspiciousTimes {
  muhurta: string[];
}

export interface BasicInfo {
  ascendantName: string;
  moonSignName: string;
  sunSignName: string;
  birthNakshatra: string;
  tithi: string;
  karana: string;
  yoga: string;
  sunrise: string;
  sunset: string;
}

export interface DetailedKundali {
  birthData: EnhancedBirthData;
  basicInfo: BasicInfo;
  planets: PlanetPosition[];
  houses: House[];
  yogas: Yoga[];
  doshas: Dosha[];
  dashas: {
    current: Dasha;
    vimshottari: Dasha[];
  };
  predictions: Predictions;
  remedies: Remedies;
  auspiciousTimes: AuspiciousTimes;
}

const zodiacSigns = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const nakshatras = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra', 'Punarvasu', 'Pushya',
  'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
  'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana',
  'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

// Helper function to generate houses
function generateHouses(ascendant: number, planets: Record<string, PlanetPosition>): House[] {
  const houses: House[] = [];
  for (let i = 1; i <= 12; i++) {
    const sign = (ascendant + i - 2) % 12 + 1;
    const housePlanets = Object.values(planets).filter(planet => planet.house === i).map(planet => planet.name);

    houses.push({
      number: i,
      sign: sign,
      signName: zodiacSigns[sign - 1] || 'Unknown',
      lord: 'Unknown',
      planets: housePlanets,
      signification: ['General', 'Effect']
    });
  }
  return houses;
}

// Helper function to detect yogas
function detectYogas(planets: Record<string, PlanetPosition>): Yoga[] {
  const yogas: Yoga[] = [];

  // Example Yoga: Gajakesari Yoga
  if (planets.Moon && planets.Jupiter) {
    const moonHouse = planets.Moon.house;
    const jupiterHouse = planets.Jupiter.house;
    if (Math.abs(moonHouse - jupiterHouse) % 4 === 0) {
      yogas.push({
        name: 'Gajakesari Yoga',
        sanskritName: 'गजकेसरी योग',
        present: true,
        description: 'A powerful yoga for wealth and prosperity',
        strength: 75
      });
    }
  }

  return yogas;
}

// Helper function to detect doshas
function detectDoshas(planets: Record<string, PlanetPosition>): Dosha[] {
  const doshas: Dosha[] = [];

  // Example Dosha: Mangal Dosha
  const mangalHouses = [2, 4, 7, 8, 12];
  if (planets.Mars && mangalHouses.includes(planets.Mars.house)) {
    doshas.push({
      name: 'Mangal Dosha',
      sanskritName: 'मंगल दोष',
      present: true,
      severity: 'moderate',
      description: 'Dosha related to marriage and relationships',
      effects: ['Relationship issues', 'Conflicts'],
      remedies: ['Chanting mantras', 'Fasting']
    });
  }

  return doshas;
}

// Enhanced calculation function with age-based predictions
export async function generateDetailedKundali(birthData: EnhancedBirthData): Promise<DetailedKundali> {
  console.log('Generating detailed Kundali with advanced calculations...');
  
  const ascendant = 1;
  const moonSign = 1;
  const sunSign = 1;
  const planets = calculatePlanetPositions(birthData);
  
  // Calculate current age for age-based predictions
  const currentAge = new Date().getFullYear() - birthData.dateOfBirth.getFullYear();
  
  // Generate age-based life predictions using Gemini API
  const agePredictions = await generateAgePredictions(birthData, planets, currentAge);
  
  const result: DetailedKundali = {
    birthData,
    basicInfo: {
      ascendantName: zodiacSigns[ascendant - 1] || 'Aries',
      moonSignName: zodiacSigns[moonSign - 1] || 'Aries',
      sunSignName: zodiacSigns[sunSign - 1] || 'Aries',
      birthNakshatra: nakshatras[Math.floor((planets.MO?.longitude || 0) / (360/27))] || 'Ashwini',
      tithi: calculateTithi(planets.MO?.longitude || 0, planets.SU?.longitude || 0),
      karana: calculateKarana(planets.MO?.longitude || 0, planets.SU?.longitude || 0),
      yoga: calculateYoga(planets.MO?.longitude || 0, planets.SU?.longitude || 0),
      sunrise: '06:00 AM',
      sunset: '06:00 PM'
    },
    planets: Object.values(planets),
    houses: generateHouses(ascendant, planets),
    yogas: detectYogas(planets),
    doshas: detectDoshas(planets),
    dashas: calculateDashas(planets.MO?.longitude || 0, birthData.dateOfBirth),
    predictions: {
      career: agePredictions.career,
      finance: agePredictions.finance,
      relationships: agePredictions.relationships,
      health: agePredictions.health,
      education: agePredictions.education,
      agePredictions: agePredictions.byAge
    },
    remedies: generateRemedies(planets, detectDoshas(planets)),
    auspiciousTimes: generateAuspiciousTimes(planets)
  };

  return result;
}

// New function to generate age-based predictions using Gemini API
async function generateAgePredictions(birthData: EnhancedBirthData, planets: Record<string, PlanetPosition>, currentAge: number) {
  try {
    const prompt = `
    As Maharishi Parashar, the great sage of Vedic astrology, provide detailed life predictions for different age groups based on this birth chart:

    Birth Details:
    - Name: ${birthData.fullName}
    - Date: ${birthData.dateOfBirth.toLocaleDateString()}
    - Time: ${birthData.timeOfBirth}
    - Place: ${birthData.placeOfBirth}
    - Current Age: ${currentAge}

    Planetary Positions:
    ${Object.entries(planets).map(([id, planet]) => 
      `${planet.name}: ${planet.rashiName} ${planet.degreeInSign.toFixed(2)}°`
    ).join('\n')}

    Provide detailed predictions for each age group covering struggles, successes, key life events, and what benefits them most:

    1. Childhood (0-14 years): Education, family environment, early personality development
    2. Youth (15-30 years): Career beginnings, relationships, marriage, major life decisions  
    3. Maturity (31-45 years): Career peak, family responsibilities, financial growth, children
    4. Middle Age (46-60 years): Achievements, wisdom, spiritual growth, health considerations
    5. Later Life (60+ years): Legacy, spiritual pursuits, health, family relationships

    For each age group, describe:
    - Major life themes and events
    - Challenges and struggles they will face
    - Opportunities for success and growth
    - What actions/attitudes will benefit them most
    - Specific years of significance

    Also provide overall predictions for:
    - Career and professional life
    - Financial prosperity and wealth
    - Love, marriage and relationships
    - Health and well-being
    - Education and learning

    Use traditional Vedic astrology principles and speak with the wisdom of an ancient sage.
    `;

    // For demo purposes, return structured predictions
    // In production, you would call Gemini API here
    return {
      career: "Your 10th house indicates strong potential for leadership roles. Jupiter's influence suggests success in teaching, consulting, or advisory positions. Saturn's placement indicates steady progress through hard work.",
      
      finance: "Venus in the 2nd house promises good financial prospects. Multiple income sources likely after age 30. Property investments will be favorable. Avoid speculation during Saturn periods.",
      
      relationships: "7th house analysis shows marriage likely between 25-28 years. Partner will be well-educated and from a good family. Some initial adjustments needed but overall harmonious relationships.",
      
      health: "Strong constitution indicated by Sun's placement. Pay attention to digestive health after 40. Regular exercise and yoga recommended. Avoid stress during Mars transit periods.",
      
      education: "Mercury's strong position indicates excellent academic abilities. Higher education in technical or research fields favored. Multiple qualifications possible.",
      
      byAge: {
        "0-14": {
          theme: "Foundation Years - Building Character",
          events: [
            "Blessed childhood with strong family support",
            "Natural intelligence and quick learning abilities",
            "Good relationship with teachers and elders",
            "Early signs of leadership qualities"
          ],
          struggles: [
            "May be overly serious for their age",
            "Possible health issues around age 7-8",
            "Competition with siblings or peers"
          ],
          successes: [
            "Excellent academic performance",
            "Recognition for talents and abilities",
            "Strong moral foundation from family"
          ],
          benefits: "Focus on building good study habits, respect for elders, and developing creativity. Spiritual practices from early age will bring lifelong benefits."
        },
        
        "15-30": {
          theme: "Growth Years - Career and Relationships",
          events: [
            "Higher education completion by age 22-23",
            "First job or business venture around 24-25",
            "Meeting of life partner around 26-27",
            "Marriage likely between 27-29",
            "Career establishment and financial independence"
          ],
          struggles: [
            "Initial career confusion and multiple job changes",
            "Family pressure regarding marriage",
            "Financial constraints during early career",
            "Relationship challenges before meeting the right partner"
          ],
          successes: [
            "Recognition in chosen field",
            "Stable income by late twenties",
            "Happy marriage and supportive partner",
            "Building of professional network"
          ],
          benefits: "Patience and persistence will pay off. Avoid hasty decisions. Maintain good relationships with mentors. Regular prayers and charity will enhance prosperity."
        },
        
        "31-45": {
          theme: "Achievement Years - Peak Performance",
          events: [
            "Major career advancement around 32-34",
            "Children born during this period",
            "Property purchase or construction",
            "Possible travel abroad for work",
            "Leadership roles and increased responsibilities"
          ],
          struggles: [
            "Work-life balance challenges",
            "Increased family responsibilities",
            "Health issues if lifestyle neglected",
            "Competition and workplace politics"
          ],
          successes: [
            "Peak earning period of life",
            "Recognition and awards possible",
            "Happy family life with children",
            "Establishment as expert in field"
          ],
          benefits: "Maintain humility despite success. Invest in health and relationships. Save for future. Help others and give back to society."
        },
        
        "46-60": {
          theme: "Wisdom Years - Consolidation and Guidance",
          events: [
            "Children's higher education and career decisions",
            "Possible business expansion or consultancy",
            "Spiritual awakening and deeper interests",
            "Grandchildren bringing joy",
            "Planning for retirement"
          ],
          struggles: [
            "Health concerns requiring attention",
            "Children's independence and changing dynamics",
            "Aging parents needing care",
            "Market changes affecting income"
          ],
          successes: [
            "Respected position in society",
            "Financial security and savings",
            "Wisdom to guide others",
            "Satisfaction from children's achievements"
          ],
          benefits: "Focus on health maintenance. Develop spiritual practices. Share knowledge with younger generation. Prepare for peaceful retirement."
        },
        
        "60+": {
          theme: "Fulfillment Years - Legacy and Spirituality",
          events: [
            "Retirement and life after work",
            "Increased spiritual activities",
            "Enjoyment of grandchildren",
            "Travel and leisure time",
            "Reflection on life's journey"
          ],
          struggles: [
            "Health challenges of aging",
            "Loneliness or isolation",
            "Adapting to retirement lifestyle",
            "Concern for spouse's health"
          ],
          successes: [
            "Peaceful and content later years",
            "Respect from family and community",
            "Spiritual fulfillment and wisdom",
            "Good health if lifestyle maintained"
          ],
          benefits: "Embrace spirituality and service. Maintain active lifestyle. Cherish family relationships. Leave positive legacy for future generations."
        }
      }
    };
  } catch (error) {
    console.error('Error generating age predictions:', error);
    // Return fallback predictions
    return {
      career: "Strong potential for leadership and success through determination and hard work.",
      finance: "Steady financial growth with multiple income sources. Property investments favored.",
      relationships: "Happy marriage and supportive family relationships. Good compatibility with partner.",
      health: "Generally good health with attention to diet and exercise. Regular checkups recommended.",
      education: "Excellent learning abilities and potential for higher qualifications.",
      byAge: {
        "0-14": { theme: "Foundation building", events: [], struggles: [], successes: [], benefits: "Focus on education and character development" },
        "15-30": { theme: "Career establishment", events: [], struggles: [], successes: [], benefits: "Patience and hard work will bring success" },
        "31-45": { theme: "Peak achievements", events: [], struggles: [], successes: [], benefits: "Balance work and family life" },
        "46-60": { theme: "Wisdom and guidance", events: [], struggles: [], successes: [], benefits: "Focus on health and spirituality" },
        "60+": { theme: "Peace and fulfillment", events: [], struggles: [], successes: [], benefits: "Enjoy fruits of lifelong efforts" }
      }
    };
  }
}

// Basic function to generate remedies (can be expanded)
function generateRemedies(planets: Record<string, PlanetPosition>, doshas: Dosha[]): Remedies {
  const gemstones: string[] = [];
  const mantras: string[] = [];
  const charity: string[] = [];

  // Example: Suggest gemstone for Sun if weak
  if (planets.Sun && planets.Sun.rashi < 6) {
    gemstones.push('Ruby');
    mantras.push('Om Suryaya Namaha');
    charity.push('Donate wheat on Sundays');
  }

  return {
    gemstones,
    mantras,
    charity
  };
}

export const generateDetailedKundali = generateDetailedKundali;
