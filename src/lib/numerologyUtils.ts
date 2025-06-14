// Enhanced Numerology calculation utilities with precise algorithms

export interface NumerologyProfile {
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  birthday: number;
  maturity: number;
  personalYear: number;
  pinnacles: number[];
  challenges: number[];
  karmicDebt: KarmicDebtInfo;
  missingNumbers: number[];
  personalityArchetype: PersonalityArchetype;
  remedies: RemedyInfo[];
}

export interface KarmicDebtInfo {
  hasKarmicDebt: boolean;
  debtNumbers: number[];
  descriptions: string[];
}

export interface PersonalityArchetype {
  name: string;
  description: string;
  strengths: string[];
  shadows: string[];
  lifeTheme: string;
  idealCareers: string[];
  relationshipStyle: string;
}

export interface RemedyInfo {
  number: number;
  deficiency: string;
  remedies: string[];
  mantra: string;
  gemstone: string;
  color: string;
}

// Pythagorean number chart - precise mapping
const LETTER_VALUES: Record<string, number> = {
  'A': 1, 'J': 1, 'S': 1,
  'B': 2, 'K': 2, 'T': 2,
  'C': 3, 'L': 3, 'U': 3,
  'D': 4, 'M': 4, 'V': 4,
  'E': 5, 'N': 5, 'W': 5,
  'F': 6, 'O': 6, 'X': 6,
  'G': 7, 'P': 7, 'Y': 7,
  'H': 8, 'Q': 8, 'Z': 8,
  'I': 9, 'R': 9
};

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

// Archetype definitions
const ARCHETYPE_LIBRARY: Record<number, any> = {
  1: { name: "The Leader", traits: "Ambitious, independent, driven", shadows: "Arrogant, impatient" },
  2: { name: "The Diplomat", traits: "Cooperative, sensitive, intuitive", shadows: "Overly passive, conflict-avoidant" },
  3: { name: "The Communicator", traits: "Expressive, creative, social", shadows: "Scattered, superficial" },
  4: { name: "The Builder", traits: "Disciplined, loyal, stable", shadows: "Rigid, stubborn" },
  5: { name: "The Explorer", traits: "Adventurous, curious, versatile", shadows: "Irresponsible, impulsive" },
  6: { name: "The Caregiver", traits: "Nurturing, responsible, loving", shadows: "Over-controlling, martyr complex" },
  7: { name: "The Mystic", traits: "Introspective, wise, analytical", shadows: "Withdrawn, cynical" },
  8: { name: "The Executive", traits: "Powerful, goal-driven, authoritative", shadows: "Ruthless, overly materialistic" },
  9: { name: "The Humanitarian", traits: "Compassionate, idealistic, broad-minded", shadows: "Naïve, escapist" },
  11: { name: "The Visionary", traits: "Inspired, spiritually aware, intuitive", shadows: "Nervous, hypersensitive" },
  22: { name: "The Master Builder", traits: "Strategic, capable of great impact", shadows: "Overburdened, suppressive" },
  33: { name: "The Master Healer", traits: "Loving, service-focused, spiritual teacher", shadows: "Self-sacrificing, burnout risk" }
};

// Karmic debt numbers
const KARMIC_DEBT_NUMBERS = [13, 14, 16, 19];

// Reduce number to single digit (except master numbers 11, 22, 33)
export const reduceNumber = (num: number, trackKarmic: boolean = false): { final: number, wasKarmic: boolean, original: number } => {
  const original = num;
  let wasKarmic = false;
  
  if (trackKarmic && KARMIC_DEBT_NUMBERS.includes(num)) {
    wasKarmic = true;
  }
  
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  
  return { final: num, wasKarmic, original };
};

// Convert name to numbers
export const convertNameToNumbers = (name: string): number => {
  return name.toUpperCase().replace(/[^A-Z]/g, '').split('').reduce((sum, char) => {
    return sum + (LETTER_VALUES[char] || 0);
  }, 0);
};

// 1. Life Path Number - most important
export const calculateLifePath = (birthDate: Date): { number: number, breakdown: string, wasKarmic: boolean } => {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();
  
  // Reduce each component separately
  const dayReduced = reduceNumber(day);
  const monthReduced = reduceNumber(month);
  const yearDigits = year.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  const yearReduced = reduceNumber(yearDigits);
  
  const sum = dayReduced.final + monthReduced.final + yearReduced.final;
  const result = reduceNumber(sum, true);
  
  const breakdown = `${day} → ${dayReduced.final}, ${month} → ${monthReduced.final}, ${year} → ${yearReduced.final}, Total: ${sum} → ${result.final}`;
  
  return { number: result.final, breakdown, wasKarmic: result.wasKarmic };
};

// 2. Birthday Number - use date directly
export const calculateBirthday = (birthDate: Date): number => {
  return birthDate.getDate();
};

// 3. Expression/Destiny Number
export const calculateExpression = (fullName: string): { number: number, breakdown: string, wasKarmic: boolean } => {
  const total = convertNameToNumbers(fullName);
  const result = reduceNumber(total, true);
  const breakdown = `${fullName.toUpperCase()} = ${total} → ${result.final}`;
  
  return { number: result.final, breakdown, wasKarmic: result.wasKarmic };
};

// 4. Soul Urge Number (vowels only)
export const calculateSoulUrge = (fullName: string): { number: number, breakdown: string, wasKarmic: boolean } => {
  const vowels = fullName.toUpperCase().replace(/[^A-Z]/g, '').split('').filter(char => VOWELS.has(char));
  const vowelSum = vowels.reduce((sum, char) => sum + (LETTER_VALUES[char] || 0), 0);
  const result = reduceNumber(vowelSum, true);
  const breakdown = `Vowels: ${vowels.join(', ')} = ${vowelSum} → ${result.final}`;
  
  return { number: result.final, breakdown, wasKarmic: result.wasKarmic };
};

// 5. Personality Number (consonants only)
export const calculatePersonality = (fullName: string): { number: number, breakdown: string, wasKarmic: boolean } => {
  const consonants = fullName.toUpperCase().replace(/[^A-Z]/g, '').split('').filter(char => !VOWELS.has(char));
  const consonantSum = consonants.reduce((sum, char) => sum + (LETTER_VALUES[char] || 0), 0);
  const result = reduceNumber(consonantSum, true);
  const breakdown = `Consonants: ${consonants.join(', ')} = ${consonantSum} → ${result.final}`;
  
  return { number: result.final, breakdown, wasKarmic: result.wasKarmic };
};

// 6. Maturity Number
export const calculateMaturity = (lifePath: number, expression: number): number => {
  return reduceNumber(lifePath + expression).final;
};

// 7. Personal Year Number
export const calculatePersonalYear = (birthDate: Date, currentYear: number = new Date().getFullYear()): number => {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const yearSum = currentYear.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  
  return reduceNumber(day + month + yearSum).final;
};

// 8. Pinnacle Numbers
export const calculatePinnacles = (birthDate: Date): number[] => {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();
  const yearSum = year.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  
  const first = reduceNumber(month + day).final;
  const second = reduceNumber(day + yearSum).final;
  const third = reduceNumber(first + second).final;
  const fourth = reduceNumber(month + yearSum).final;
  
  return [first, second, third, fourth];
};

// 9. Challenge Numbers
export const calculateChallenges = (birthDate: Date): number[] => {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();
  const yearSum = year.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  
  const dayReduced = reduceNumber(day).final;
  const monthReduced = reduceNumber(month).final;
  const yearReduced = reduceNumber(yearSum).final;
  
  const first = Math.abs(monthReduced - dayReduced);
  const second = Math.abs(dayReduced - yearReduced);
  const third = Math.abs(first - second);
  const fourth = Math.abs(monthReduced - yearReduced);
  
  return [first, second, third, fourth];
};

// 10. Detect Karmic Debt
export const detectKarmicDebt = (profile: any): KarmicDebtInfo => {
  const debtNumbers: number[] = [];
  const descriptions: string[] = [];
  
  const karmicMappings = {
    13: "Laziness and irresponsibility from past lives",
    14: "Addictions and reckless behavior patterns",
    16: "Ego destruction through crisis and humility lessons",
    19: "Over-reliance on self and selfish tendencies"
  };
  
  // Check if any core numbers were derived from karmic debt numbers
  Object.entries(profile).forEach(([key, value]: [string, any]) => {
    if (value && typeof value === 'object' && value.wasKarmic && value.original) {
      debtNumbers.push(value.original);
      descriptions.push(karmicMappings[value.original as keyof typeof karmicMappings] || "Karmic lessons to be learned");
    }
  });
  
  return {
    hasKarmicDebt: debtNumbers.length > 0,
    debtNumbers,
    descriptions
  };
};

// 11. Find Missing Numbers
export const findMissingNumbers = (fullName: string): number[] => {
  const nameNumbers = new Set<number>();
  const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  
  cleanName.split('').forEach(char => {
    if (LETTER_VALUES[char]) {
      nameNumbers.add(LETTER_VALUES[char]);
    }
  });
  
  const missing: number[] = [];
  for (let i = 1; i <= 9; i++) {
    if (!nameNumbers.has(i)) {
      missing.push(i);
    }
  }
  
  return missing;
};

// 12. Generate Personality Archetype
export const generatePersonalityArchetype = (lifePath: number, expression: number, soulUrge: number, personality: number): PersonalityArchetype => {
  const primaryArchetype = ARCHETYPE_LIBRARY[lifePath] || ARCHETYPE_LIBRARY[1];
  const secondaryTraits = ARCHETYPE_LIBRARY[expression] || ARCHETYPE_LIBRARY[1];
  
  return {
    name: primaryArchetype.name,
    description: `You're ${primaryArchetype.traits.toLowerCase()} with ${secondaryTraits.traits.toLowerCase()} expressions. Your soul seeks ${ARCHETYPE_LIBRARY[soulUrge]?.traits.toLowerCase() || 'balance'}, while others see you as ${ARCHETYPE_LIBRARY[personality]?.traits.toLowerCase() || 'reliable'}.`,
    strengths: [
      primaryArchetype.traits,
      secondaryTraits.traits,
      "Natural leadership abilities",
      "Strong intuitive insights"
    ],
    shadows: [
      primaryArchetype.shadows,
      secondaryTraits.shadows,
      "May struggle with balance",
      "Tendency to overthink"
    ],
    lifeTheme: `Path of ${primaryArchetype.name}`,
    idealCareers: getIdealCareers(lifePath, expression),
    relationshipStyle: getRelationshipStyle(soulUrge, personality)
  };
};

// 13. Generate Remedies
export const generateRemedies = (missingNumbers: number[], karmicDebt: KarmicDebtInfo): RemedyInfo[] => {
  const remedyMappings: Record<number, RemedyInfo> = {
    1: {
      number: 1,
      deficiency: "Lacks leadership and initiative",
      remedies: ["Wear red colors", "Practice Sun salutations daily", "Take leadership roles"],
      mantra: "Om Suryaya Namaha",
      gemstone: "Ruby",
      color: "Red"
    },
    2: {
      number: 2,
      deficiency: "Emotionally disconnected",
      remedies: ["Wear moonstone", "Listen to classical music", "Practice moon rituals"],
      mantra: "Om Chandraya Namaha",
      gemstone: "Moonstone",
      color: "White"
    },
    3: {
      number: 3,
      deficiency: "Lack of creative expression",
      remedies: ["Write daily", "Engage in art therapy", "Wear yellow clothes"],
      mantra: "Om Gurave Namaha",
      gemstone: "Yellow Sapphire",
      color: "Yellow"
    },
    4: {
      number: 4,
      deficiency: "Indiscipline and chaos",
      remedies: ["Maintain fixed schedule", "Use black tourmaline", "Practice discipline"],
      mantra: "Om Shanaishcharaya Namaha",
      gemstone: "Blue Sapphire",
      color: "Blue"
    },
    5: {
      number: 5,
      deficiency: "Fear of change",
      remedies: ["Travel frequently", "Eat green foods", "Use mercury remedies"],
      mantra: "Om Budhaya Namaha",
      gemstone: "Emerald",
      color: "Green"
    },
    6: {
      number: 6,
      deficiency: "Lack of compassion",
      remedies: ["Use rose quartz", "Spend time with family", "Practice charity"],
      mantra: "Om Shukraya Namaha",
      gemstone: "Diamond",
      color: "Pink"
    },
    7: {
      number: 7,
      deficiency: "Overthinking and disconnection",
      remedies: ["Practice meditation", "Study spirituality", "Spend time in nature"],
      mantra: "Om Ketave Namaha",
      gemstone: "Cat's Eye",
      color: "Purple"
    },
    8: {
      number: 8,
      deficiency: "Power misuse and money anxiety",
      remedies: ["Donate to elderly", "Wear blue tones", "Practice humility"],
      mantra: "Om Shanicharaya Namaha",
      gemstone: "Blue Sapphire",
      color: "Black"
    },
    9: {
      number: 9,
      deficiency: "Selfishness and emotional coldness",
      remedies: ["Serve in NGOs", "Use red coral", "Practice compassion"],
      mantra: "Om Mangalaya Namaha",
      gemstone: "Red Coral",
      color: "Red"
    }
  };
  
  const remedies: RemedyInfo[] = [];
  
  // Add remedies for missing numbers
  missingNumbers.forEach(num => {
    if (remedyMappings[num]) {
      remedies.push(remedyMappings[num]);
    }
  });
  
  // Add karmic debt remedies
  if (karmicDebt.hasKarmicDebt) {
    karmicDebt.debtNumbers.forEach(debt => {
      const reducedDebt = reduceNumber(debt).final;
      if (remedyMappings[reducedDebt]) {
        const karmicRemedy = { ...remedyMappings[reducedDebt] };
        karmicRemedy.deficiency = `Karmic Debt ${debt}: ${karmicDebt.descriptions[0] || 'Past life lessons'}`;
        remedies.push(karmicRemedy);
      }
    });
  }
  
  return remedies;
};

// Helper functions
const getIdealCareers = (lifePath: number, expression: number): string[] => {
  const careerMappings: Record<number, string[]> = {
    1: ["CEO", "Entrepreneur", "Team Leader", "Politician"],
    2: ["Counselor", "Diplomat", "Teacher", "Social Worker"],
    3: ["Artist", "Writer", "Performer", "Designer"],
    4: ["Engineer", "Accountant", "Manager", "Architect"],
    5: ["Travel Agent", "Journalist", "Sales", "Explorer"],
    6: ["Doctor", "Nurse", "Counselor", "Family Therapist"],
    7: ["Researcher", "Analyst", "Spiritual Teacher", "Scientist"],
    8: ["Business Executive", "Banker", "Real Estate", "Finance"],
    9: ["Humanitarian", "NGO Worker", "Global Leader", "Philanthropist"]
  };
  
  return [...(careerMappings[lifePath] || []), ...(careerMappings[expression] || [])].slice(0, 4);
};

const getRelationshipStyle = (soulUrge: number, personality: number): string => {
  const styles: Record<number, string> = {
    1: "Independent and strong-willed in relationships",
    2: "Cooperative and emotionally supportive",
    3: "Expressive and socially engaging",
    4: "Loyal and committed partner",
    5: "Needs freedom and variety",
    6: "Nurturing and family-oriented",
    7: "Needs intellectual connection",
    8: "Ambitious partnership goals",
    9: "Compassionate and understanding"
  };
  
  return `${styles[soulUrge] || 'Balanced approach'} with ${styles[personality]?.toLowerCase() || 'reliable'} outer presentation`;
};

// Complete numerology profile calculation
export const calculateNumerologyProfile = (fullName: string, birthDate: Date): NumerologyProfile => {
  const lifePath = calculateLifePath(birthDate);
  const expression = calculateExpression(fullName);
  const soulUrge = calculateSoulUrge(fullName);
  const personality = calculatePersonality(fullName);
  const birthday = calculateBirthday(birthDate);
  const maturity = calculateMaturity(lifePath.number, expression.number);
  const personalYear = calculatePersonalYear(birthDate);
  const pinnacles = calculatePinnacles(birthDate);
  const challenges = calculateChallenges(birthDate);
  
  const profileData = { lifePath, expression, soulUrge, personality };
  const karmicDebt = detectKarmicDebt(profileData);
  const missingNumbers = findMissingNumbers(fullName);
  const personalityArchetype = generatePersonalityArchetype(
    lifePath.number, 
    expression.number, 
    soulUrge.number, 
    personality.number
  );
  const remedies = generateRemedies(missingNumbers, karmicDebt);
  
  return {
    lifePath: lifePath.number,
    expression: expression.number,
    soulUrge: soulUrge.number,
    personality: personality.number,
    birthday,
    maturity,
    personalYear,
    pinnacles,
    challenges,
    karmicDebt,
    missingNumbers,
    personalityArchetype,
    remedies
  };
};

// Compatibility remains the same as before
export const checkCompatibility = (profile1: NumerologyProfile, profile2: NumerologyProfile): any => {
  // ... keep existing code (compatibility logic)
  let score = 0;
  const details = {
    lifePathMatch: 0,
    soulUrgeMatch: 0,
    expressionMatch: 0,
    personalYearAlignment: 0
  };
  
  if (profile1.lifePath === profile2.lifePath) {
    details.lifePathMatch = 40;
    score += 40;
  } else if (isCompatibleNumber(profile1.lifePath, profile2.lifePath)) {
    details.lifePathMatch = 20;
    score += 20;
  }
  
  if (profile1.soulUrge === profile2.soulUrge) {
    details.soulUrgeMatch = 30;
    score += 30;
  } else if (isCompatibleNumber(profile1.soulUrge, profile2.soulUrge)) {
    details.soulUrgeMatch = 15;
    score += 15;
  }
  
  if (profile1.expression === profile2.expression) {
    details.expressionMatch = 20;
    score += 20;
  } else if (isCompatibleNumber(profile1.expression, profile2.expression)) {
    details.expressionMatch = 10;
    score += 10;
  }
  
  if (Math.abs(profile1.personalYear - profile2.personalYear) <= 1) {
    details.personalYearAlignment = 10;
    score += 10;
  }
  
  let rating = 'Challenging';
  if (score >= 80) rating = 'Excellent Match';
  else if (score >= 60) rating = 'Good Match';
  else if (score >= 40) rating = 'Moderate Match';
  
  return { score, rating, details };
};

const isCompatibleNumber = (num1: number, num2: number): boolean => {
  const compatiblePairs: Record<number, number[]> = {
    1: [2, 5, 9],
    2: [1, 3, 6, 8],
    3: [2, 6, 9],
    4: [6, 7, 8],
    5: [1, 7, 9],
    6: [2, 3, 4, 8, 9],
    7: [4, 5],
    8: [2, 4, 6],
    9: [1, 3, 5, 6]
  };
  
  return compatiblePairs[num1]?.includes(num2) || false;
};

export const getNumberMeaning = (number: number, type: string): string => {
  const meanings: Record<string, Record<number, string>> = {
    lifePath: {
      1: "Leader, Pioneer, Independent",
      2: "Diplomat, Cooperator, Peacemaker",
      3: "Creative, Communicator, Optimist",
      4: "Builder, Organizer, Hard Worker",
      5: "Explorer, Freedom Lover, Adventurer",
      6: "Nurturer, Healer, Responsibility",
      7: "Seeker, Analyst, Spiritual",
      8: "Achiever, Businessman, Material Success",
      9: "Humanitarian, Generous, Universal Love",
      11: "Intuitive, Spiritual Teacher, Illuminator",
      22: "Master Builder, Visionary, Large Scale",
      33: "Master Teacher, Healer, Compassion"
    }
  };
  
  return meanings[type]?.[number] || "Unknown meaning";
};
