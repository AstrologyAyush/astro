
// Numerology calculation utilities

export interface NumerologyProfile {
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  birthday: number;
  maturity: number;
  balance: number;
  personalYear: number;
  pinnacles: number[];
  challenges: number[];
}

export interface CompatibilityResult {
  score: number;
  rating: string;
  details: {
    lifePathMatch: number;
    soulUrgeMatch: number;
    expressionMatch: number;
    personalYearAlignment: number;
  };
}

// Pythagorean number chart
const LETTER_VALUES: Record<string, number> = {
  'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
  'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
  'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
};

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

// Reduce number to single digit (except master numbers 11, 22, 33)
export const reduceNumber = (num: number): number => {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return num;
};

// Convert name to numbers
export const convertNameToNumbers = (name: string): number => {
  return name.toUpperCase().split('').reduce((sum, char) => {
    if (LETTER_VALUES[char]) {
      return sum + LETTER_VALUES[char];
    }
    return sum;
  }, 0);
};

// Life Path Number - most important
export const calculateLifePath = (birthDate: Date): number => {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();
  
  const sum = day + month + year.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  return reduceNumber(sum);
};

// Expression/Destiny Number
export const calculateExpression = (fullName: string): number => {
  const total = convertNameToNumbers(fullName);
  return reduceNumber(total);
};

// Soul Urge Number (vowels only)
export const calculateSoulUrge = (fullName: string): number => {
  const vowelSum = fullName.toUpperCase().split('').reduce((sum, char) => {
    if (VOWELS.has(char) && LETTER_VALUES[char]) {
      return sum + LETTER_VALUES[char];
    }
    return sum;
  }, 0);
  return reduceNumber(vowelSum);
};

// Personality Number (consonants only)
export const calculatePersonality = (fullName: string): number => {
  const consonantSum = fullName.toUpperCase().split('').reduce((sum, char) => {
    if (!VOWELS.has(char) && LETTER_VALUES[char]) {
      return sum + LETTER_VALUES[char];
    }
    return sum;
  }, 0);
  return reduceNumber(consonantSum);
};

// Birthday Number
export const calculateBirthday = (birthDate: Date): number => {
  const day = birthDate.getDate();
  return reduceNumber(day);
};

// Maturity Number
export const calculateMaturity = (lifePath: number, expression: number): number => {
  return reduceNumber(lifePath + expression);
};

// Balance Number (first consonants)
export const calculateBalance = (fullName: string): number => {
  const names = fullName.split(' ');
  let consonantSum = 0;
  
  for (const name of names) {
    for (const char of name.toUpperCase()) {
      if (!VOWELS.has(char) && LETTER_VALUES[char]) {
        consonantSum += LETTER_VALUES[char];
        break; // Only first consonant
      }
    }
  }
  
  return reduceNumber(consonantSum);
};

// Personal Year Number
export const calculatePersonalYear = (birthDate: Date, currentYear: number = new Date().getFullYear()): number => {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const yearSum = currentYear.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  
  return reduceNumber(day + month + yearSum);
};

// Pinnacle Numbers
export const calculatePinnacles = (birthDate: Date): number[] => {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();
  const yearSum = year.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  
  const pinnacle1 = reduceNumber(month + day);
  const pinnacle2 = reduceNumber(day + yearSum);
  const pinnacle3 = reduceNumber(pinnacle1 + pinnacle2);
  const pinnacle4 = reduceNumber(month + yearSum);
  
  return [pinnacle1, pinnacle2, pinnacle3, pinnacle4];
};

// Challenge Numbers
export const calculateChallenges = (birthDate: Date): number[] => {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();
  const yearSum = year.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  
  const challenge1 = Math.abs(day - month);
  const challenge2 = Math.abs(yearSum - day);
  const challenge3 = Math.abs(challenge1 - challenge2);
  const challenge4 = Math.abs(month - yearSum);
  
  return [challenge1, challenge2, challenge3, challenge4];
};

// Complete numerology profile
export const calculateNumerologyProfile = (fullName: string, birthDate: Date): NumerologyProfile => {
  const lifePath = calculateLifePath(birthDate);
  const expression = calculateExpression(fullName);
  
  return {
    lifePath,
    expression,
    soulUrge: calculateSoulUrge(fullName),
    personality: calculatePersonality(fullName),
    birthday: calculateBirthday(birthDate),
    maturity: calculateMaturity(lifePath, expression),
    balance: calculateBalance(fullName),
    personalYear: calculatePersonalYear(birthDate),
    pinnacles: calculatePinnacles(birthDate),
    challenges: calculateChallenges(birthDate)
  };
};

// Compatibility checker
export const checkCompatibility = (profile1: NumerologyProfile, profile2: NumerologyProfile): CompatibilityResult => {
  let score = 0;
  const details = {
    lifePathMatch: 0,
    soulUrgeMatch: 0,
    expressionMatch: 0,
    personalYearAlignment: 0
  };
  
  // Life Path compatibility
  if (profile1.lifePath === profile2.lifePath) {
    details.lifePathMatch = 40;
    score += 40;
  } else if (isCompatibleNumber(profile1.lifePath, profile2.lifePath)) {
    details.lifePathMatch = 20;
    score += 20;
  }
  
  // Soul Urge compatibility
  if (profile1.soulUrge === profile2.soulUrge) {
    details.soulUrgeMatch = 30;
    score += 30;
  } else if (isCompatibleNumber(profile1.soulUrge, profile2.soulUrge)) {
    details.soulUrgeMatch = 15;
    score += 15;
  }
  
  // Expression compatibility
  if (profile1.expression === profile2.expression) {
    details.expressionMatch = 20;
    score += 20;
  } else if (isCompatibleNumber(profile1.expression, profile2.expression)) {
    details.expressionMatch = 10;
    score += 10;
  }
  
  // Personal Year alignment
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

// Helper function for number compatibility
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

// Get number meaning
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
    },
    expression: {
      1: "Natural born leader with strong will",
      2: "Diplomatic and cooperative nature",
      3: "Creative self-expression and joy",
      4: "Practical and systematic approach",
      5: "Freedom-loving and adventurous spirit",
      6: "Caring and responsible towards others",
      7: "Deep thinker and spiritual seeker",
      8: "Ambitious and business-minded",
      9: "Humanitarian with broad perspective"
    }
  };
  
  return meanings[type]?.[number] || "Unknown meaning";
};
