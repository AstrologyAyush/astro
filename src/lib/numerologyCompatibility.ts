
import { NumerologyProfile } from './numerologyUtils';

export interface CompatibilityProfile {
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  birthday: number;
  maturity: number;
}

export interface CompatibilityResult {
  overallScore: number;
  compatibilityLevel: string;
  categoryScores: {
    lifePath: { score: number; weighted: number; description: string };
    expression: { score: number; weighted: number; description: string };
    soulUrge: { score: number; weighted: number; description: string };
    personality: { score: number; weighted: number; description: string };
    birthday: { score: number; weighted: number; description: string };
    maturity: { score: number; weighted: number; description: string };
  };
  strengths: string[];
  challenges: string[];
  remedies: string[];
  relationship: {
    type: string;
    dynamics: string;
    longTermPotential: string;
  };
}

// Compatibility weights for each category
const COMPATIBILITY_WEIGHTS = {
  lifePath: 0.30,    // Core life direction, long-term flow
  expression: 0.20,  // External behavior compatibility
  soulUrge: 0.20,    // Emotional, internal harmony
  personality: 0.15, // First impressions and social comfort
  birthday: 0.10,    // Natural gift/karma match
  maturity: 0.05     // Future goal alignment
};

// Comprehensive compatibility tables for each number pair
const LIFE_PATH_COMPATIBILITY: Record<number, Record<number, number>> = {
  1: { 1: 8, 2: 6, 3: 10, 4: 2, 5: 10, 6: 6, 7: 2, 8: 10, 9: 6, 11: 8, 22: 6, 33: 6 },
  2: { 1: 6, 2: 10, 3: 6, 4: 6, 5: 6, 6: 10, 7: 6, 8: 2, 9: 10, 11: 10, 22: 8, 33: 10 },
  3: { 1: 10, 2: 6, 3: 10, 4: 2, 5: 10, 6: 10, 7: 2, 8: 6, 9: 10, 11: 8, 22: 6, 33: 8 },
  4: { 1: 2, 2: 6, 3: 2, 4: 10, 5: 6, 6: 10, 7: 6, 8: 6, 9: 6, 11: 6, 22: 10, 33: 6 },
  5: { 1: 10, 2: 6, 3: 10, 4: 6, 5: 10, 6: 6, 7: 2, 8: 6, 9: 10, 11: 6, 22: 6, 33: 6 },
  6: { 1: 6, 2: 10, 3: 10, 4: 10, 5: 6, 6: 10, 7: 6, 8: 2, 9: 10, 11: 8, 22: 8, 33: 10 },
  7: { 1: 2, 2: 6, 3: 2, 4: 6, 5: 2, 6: 6, 7: 10, 8: 6, 9: 10, 11: 10, 22: 8, 33: 8 },
  8: { 1: 10, 2: 2, 3: 6, 4: 6, 5: 6, 6: 2, 7: 6, 8: 10, 9: 6, 11: 6, 22: 10, 33: 6 },
  9: { 1: 6, 2: 10, 3: 10, 4: 6, 5: 10, 6: 10, 7: 10, 8: 6, 9: 10, 11: 8, 22: 8, 33: 10 },
  11: { 1: 8, 2: 10, 3: 8, 4: 6, 5: 6, 6: 8, 7: 10, 8: 6, 9: 8, 11: 10, 22: 10, 33: 10 },
  22: { 1: 6, 2: 8, 3: 6, 4: 10, 5: 6, 6: 8, 7: 8, 8: 10, 9: 8, 11: 10, 22: 10, 33: 10 },
  33: { 1: 6, 2: 10, 3: 8, 4: 6, 5: 6, 6: 10, 7: 8, 8: 6, 9: 10, 11: 10, 22: 10, 33: 10 }
};

const EXPRESSION_COMPATIBILITY: Record<number, Record<number, number>> = {
  1: { 1: 6, 2: 8, 3: 10, 4: 6, 5: 8, 6: 6, 7: 6, 8: 8, 9: 6, 11: 8, 22: 6, 33: 6 },
  2: { 1: 8, 2: 8, 3: 8, 4: 8, 5: 6, 6: 10, 7: 8, 8: 6, 9: 8, 11: 10, 22: 8, 33: 10 },
  3: { 1: 10, 2: 8, 3: 8, 4: 6, 5: 10, 6: 8, 7: 6, 8: 6, 9: 10, 11: 8, 22: 6, 33: 8 },
  4: { 1: 6, 2: 8, 3: 6, 4: 8, 5: 6, 6: 8, 7: 8, 8: 8, 9: 6, 11: 6, 22: 10, 33: 6 },
  5: { 1: 8, 2: 6, 3: 10, 4: 6, 5: 8, 6: 6, 7: 6, 8: 6, 9: 8, 11: 6, 22: 6, 33: 6 },
  6: { 1: 6, 2: 10, 3: 8, 4: 8, 5: 6, 6: 8, 7: 6, 8: 6, 9: 10, 11: 8, 22: 8, 33: 10 },
  7: { 1: 6, 2: 8, 3: 6, 4: 8, 5: 6, 6: 6, 7: 8, 8: 6, 9: 8, 11: 10, 22: 8, 33: 8 },
  8: { 1: 8, 2: 6, 3: 6, 4: 8, 5: 6, 6: 6, 7: 6, 8: 8, 9: 6, 11: 6, 22: 10, 33: 6 },
  9: { 1: 6, 2: 8, 3: 10, 4: 6, 5: 8, 6: 10, 7: 8, 8: 6, 9: 8, 11: 8, 22: 8, 33: 10 },
  11: { 1: 8, 2: 10, 3: 8, 4: 6, 5: 6, 6: 8, 7: 10, 8: 6, 9: 8, 11: 10, 22: 10, 33: 10 },
  22: { 1: 6, 2: 8, 3: 6, 4: 10, 5: 6, 6: 8, 7: 8, 8: 10, 9: 8, 11: 10, 22: 10, 33: 10 },
  33: { 1: 6, 2: 10, 3: 8, 4: 6, 5: 6, 6: 10, 7: 8, 8: 6, 9: 10, 11: 10, 22: 10, 33: 10 }
};

const SOUL_URGE_COMPATIBILITY: Record<number, Record<number, number>> = {
  1: { 1: 8, 2: 6, 3: 10, 4: 6, 5: 8, 6: 6, 7: 6, 8: 8, 9: 6, 11: 8, 22: 6, 33: 6 },
  2: { 1: 6, 2: 10, 3: 8, 4: 6, 5: 6, 6: 10, 7: 8, 8: 2, 9: 8, 11: 10, 22: 8, 33: 10 },
  3: { 1: 10, 2: 8, 3: 8, 4: 6, 5: 10, 6: 8, 7: 6, 8: 6, 9: 10, 11: 8, 22: 6, 33: 8 },
  4: { 1: 6, 2: 6, 3: 6, 4: 8, 5: 6, 6: 8, 7: 8, 8: 8, 9: 6, 11: 6, 22: 10, 33: 6 },
  5: { 1: 8, 2: 6, 3: 10, 4: 6, 5: 8, 6: 6, 7: 6, 8: 6, 9: 8, 11: 6, 22: 6, 33: 6 },
  6: { 1: 6, 2: 10, 3: 8, 4: 8, 5: 6, 6: 8, 7: 6, 8: 6, 9: 10, 11: 8, 22: 8, 33: 10 },
  7: { 1: 6, 2: 8, 3: 6, 4: 8, 5: 6, 6: 6, 7: 10, 8: 6, 9: 8, 11: 10, 22: 8, 33: 8 },
  8: { 1: 8, 2: 2, 3: 6, 4: 8, 5: 6, 6: 6, 7: 6, 8: 8, 9: 6, 11: 6, 22: 10, 33: 6 },
  9: { 1: 6, 2: 8, 3: 10, 4: 6, 5: 8, 6: 10, 7: 8, 8: 6, 9: 8, 11: 8, 22: 8, 33: 10 },
  11: { 1: 8, 2: 10, 3: 8, 4: 6, 5: 6, 6: 8, 7: 10, 8: 6, 9: 8, 11: 10, 22: 10, 33: 10 },
  22: { 1: 6, 2: 8, 3: 6, 4: 10, 5: 6, 6: 8, 7: 8, 8: 10, 9: 8, 11: 10, 22: 10, 33: 10 },
  33: { 1: 6, 2: 10, 3: 8, 4: 6, 5: 6, 6: 10, 7: 8, 8: 6, 9: 10, 11: 10, 22: 10, 33: 10 }
};

const PERSONALITY_COMPATIBILITY: Record<number, Record<number, number>> = {
  1: { 1: 6, 2: 8, 3: 8, 4: 6, 5: 8, 6: 6, 7: 6, 8: 8, 9: 6, 11: 8, 22: 6, 33: 6 },
  2: { 1: 8, 2: 8, 3: 8, 4: 8, 5: 6, 6: 10, 7: 8, 8: 6, 9: 8, 11: 10, 22: 8, 33: 10 },
  3: { 1: 8, 2: 8, 3: 8, 4: 6, 5: 10, 6: 8, 7: 6, 8: 6, 9: 10, 11: 8, 22: 6, 33: 8 },
  4: { 1: 6, 2: 8, 3: 6, 4: 8, 5: 6, 6: 8, 7: 8, 8: 8, 9: 6, 11: 6, 22: 10, 33: 6 },
  5: { 1: 8, 2: 6, 3: 10, 4: 6, 5: 8, 6: 6, 7: 6, 8: 6, 9: 8, 11: 6, 22: 6, 33: 6 },
  6: { 1: 6, 2: 10, 3: 8, 4: 8, 5: 6, 6: 8, 7: 6, 8: 6, 9: 10, 11: 8, 22: 8, 33: 10 },
  7: { 1: 6, 2: 8, 3: 6, 4: 8, 5: 6, 6: 6, 7: 8, 8: 6, 9: 8, 11: 10, 22: 8, 33: 8 },
  8: { 1: 8, 2: 6, 3: 6, 4: 8, 5: 6, 6: 6, 7: 6, 8: 8, 9: 6, 11: 6, 22: 10, 33: 6 },
  9: { 1: 6, 2: 8, 3: 10, 4: 6, 5: 8, 6: 10, 7: 8, 8: 6, 9: 8, 11: 8, 22: 8, 33: 10 },
  11: { 1: 8, 2: 10, 3: 8, 4: 6, 5: 6, 6: 8, 7: 10, 8: 6, 9: 8, 11: 10, 22: 10, 33: 10 },
  22: { 1: 6, 2: 8, 3: 6, 4: 10, 5: 6, 6: 8, 7: 8, 8: 10, 9: 8, 11: 10, 22: 10, 33: 10 },
  33: { 1: 6, 2: 10, 3: 8, 4: 6, 5: 6, 6: 10, 7: 8, 8: 6, 9: 10, 11: 10, 22: 10, 33: 10 }
};

// Get compatibility score from table
const getCompatibilityScore = (table: Record<number, Record<number, number>>, num1: number, num2: number): number => {
  return table[num1]?.[num2] || table[num2]?.[num1] || 5; // Default medium compatibility
};

// Get compatibility descriptions
const getCompatibilityDescription = (score: number, category: string): string => {
  const descriptions = {
    lifePath: {
      high: "Your life directions are beautifully aligned - you support each other's growth naturally",
      medium: "Different paths that can complement each other with understanding and respect",
      low: "Very different life directions requiring conscious effort to find common ground"
    },
    expression: {
      high: "Your natural talents and behaviors create a harmonious and productive partnership",
      medium: "Different strengths that can balance each other well with mutual appreciation",
      low: "Contrasting expressions that may create friction without awareness and compromise"
    },
    soulUrge: {
      high: "Deep emotional resonance - you understand each other's hearts and motivations",
      medium: "Different inner needs that can enrich the relationship through variety",
      low: "Conflicting inner desires requiring patience and emotional intelligence"
    },
    personality: {
      high: "Natural chemistry and social comfort - others see you as a great match",
      medium: "Different social styles that can be attractive and complementary",
      low: "Surface-level differences that may cause initial misunderstandings"
    },
    birthday: {
      high: "Natural karmic attraction and shared special gifts",
      medium: "Complementary natural abilities that enhance each other",
      low: "Different natural rhythms requiring adjustment and patience"
    },
    maturity: {
      high: "Aligned future goals and life direction in later years",
      medium: "Different but compatible long-term aspirations",
      low: "May grow in different directions requiring conscious alignment"
    }
  };

  const level = score >= 8 ? 'high' : score >= 6 ? 'medium' : 'low';
  return descriptions[category as keyof typeof descriptions]?.[level] || "Compatibility varies";
};

// Generate relationship insights
const generateRelationshipInsights = (result: CompatibilityResult): void => {
  const { overallScore, categoryScores } = result;

  // Determine relationship type
  if (overallScore >= 8.0) {
    result.relationship.type = "Soul Mate Connection";
    result.relationship.dynamics = "Deep understanding, natural flow, minimal conflict";
    result.relationship.longTermPotential = "Excellent - built for lasting partnership";
  } else if (overallScore >= 6.5) {
    result.relationship.type = "Compatible Partnership";
    result.relationship.dynamics = "Good understanding with occasional adjustments needed";
    result.relationship.longTermPotential = "Good - can build strong foundation with effort";
  } else if (overallScore >= 5.0) {
    result.relationship.type = "Growth-Oriented Relationship";
    result.relationship.dynamics = "Requires conscious communication and compromise";
    result.relationship.longTermPotential = "Moderate - success depends on mutual commitment";
  } else {
    result.relationship.type = "Challenging but Transformative";
    result.relationship.dynamics = "Significant differences requiring patience and understanding";
    result.relationship.longTermPotential = "Requires deep commitment and conscious work";
  }

  // Generate strengths
  result.strengths = [];
  if (categoryScores.lifePath.score >= 8) result.strengths.push("Aligned life purpose and direction");
  if (categoryScores.soulUrge.score >= 8) result.strengths.push("Deep emotional understanding");
  if (categoryScores.expression.score >= 8) result.strengths.push("Harmonious talents and abilities");
  if (categoryScores.personality.score >= 8) result.strengths.push("Natural social chemistry");
  
  if (result.strengths.length === 0) {
    result.strengths.push("Complementary differences that can create balance");
    result.strengths.push("Opportunities for mutual growth and learning");
  }

  // Generate challenges
  result.challenges = [];
  if (categoryScores.lifePath.score <= 4) result.challenges.push("Different life directions may cause divergence");
  if (categoryScores.soulUrge.score <= 4) result.challenges.push("Conflicting emotional needs requiring patience");
  if (categoryScores.expression.score <= 4) result.challenges.push("Different approaches to life may create friction");
  if (categoryScores.personality.score <= 4) result.challenges.push("Surface-level misunderstandings possible");

  if (result.challenges.length === 0) {
    result.challenges.push("Minor adjustments needed for optimal harmony");
  }

  // Generate remedies
  result.remedies = [
    "Practice daily gratitude for each other's unique qualities",
    "Schedule regular heart-to-heart conversations",
    "Create shared goals that honor both your individual paths"
  ];

  if (overallScore < 6.0) {
    result.remedies.push("Consider couples counseling or relationship coaching");
    result.remedies.push("Practice patience and avoid trying to change each other");
    result.remedies.push("Focus on appreciation rather than criticism");
  }
};

export const calculateCompatibility = (profile1: NumerologyProfile, profile2: NumerologyProfile): CompatibilityResult => {
  // Extract compatibility profiles
  const p1: CompatibilityProfile = {
    lifePath: profile1.lifePath,
    expression: profile1.expression,
    soulUrge: profile1.soulUrge,
    personality: profile1.personality,
    birthday: profile1.birthday,
    maturity: profile1.maturity
  };

  const p2: CompatibilityProfile = {
    lifePath: profile2.lifePath,
    expression: profile2.expression,
    soulUrge: profile2.soulUrge,
    personality: profile2.personality,
    birthday: profile2.birthday,
    maturity: profile2.maturity
  };

  // Calculate individual category scores
  const lifePathScore = getCompatibilityScore(LIFE_PATH_COMPATIBILITY, p1.lifePath, p2.lifePath);
  const expressionScore = getCompatibilityScore(EXPRESSION_COMPATIBILITY, p1.expression, p2.expression);
  const soulUrgeScore = getCompatibilityScore(SOUL_URGE_COMPATIBILITY, p1.soulUrge, p2.soulUrge);
  const personalityScore = getCompatibilityScore(PERSONALITY_COMPATIBILITY, p1.personality, p2.personality);
  const birthdayScore = Math.abs(p1.birthday - p2.birthday) <= 2 ? 8 : 
                      Math.abs(p1.birthday - p2.birthday) <= 5 ? 6 : 4;
  const maturityScore = Math.abs(p1.maturity - p2.maturity) <= 1 ? 8 :
                       Math.abs(p1.maturity - p2.maturity) <= 2 ? 6 : 4;

  // Calculate weighted scores
  const categoryScores = {
    lifePath: {
      score: lifePathScore,
      weighted: lifePathScore * COMPATIBILITY_WEIGHTS.lifePath,
      description: getCompatibilityDescription(lifePathScore, 'lifePath')
    },
    expression: {
      score: expressionScore,
      weighted: expressionScore * COMPATIBILITY_WEIGHTS.expression,
      description: getCompatibilityDescription(expressionScore, 'expression')
    },
    soulUrge: {
      score: soulUrgeScore,
      weighted: soulUrgeScore * COMPATIBILITY_WEIGHTS.soulUrge,
      description: getCompatibilityDescription(soulUrgeScore, 'soulUrge')
    },
    personality: {
      score: personalityScore,
      weighted: personalityScore * COMPATIBILITY_WEIGHTS.personality,
      description: getCompatibilityDescription(personalityScore, 'personality')
    },
    birthday: {
      score: birthdayScore,
      weighted: birthdayScore * COMPATIBILITY_WEIGHTS.birthday,
      description: getCompatibilityDescription(birthdayScore, 'birthday')
    },
    maturity: {
      score: maturityScore,
      weighted: maturityScore * COMPATIBILITY_WEIGHTS.maturity,
      description: getCompatibilityDescription(maturityScore, 'maturity')
    }
  };

  // Calculate overall score
  const overallScore = Object.values(categoryScores).reduce((sum, cat) => sum + cat.weighted, 0);

  // Determine compatibility level
  let compatibilityLevel = 'Challenging';
  if (overallScore >= 8.0) compatibilityLevel = 'Deeply Compatible';
  else if (overallScore >= 6.5) compatibilityLevel = 'Good Compatibility';
  else if (overallScore >= 5.0) compatibilityLevel = 'Moderate Compatibility';

  const result: CompatibilityResult = {
    overallScore,
    compatibilityLevel,
    categoryScores,
    strengths: [],
    challenges: [],
    remedies: [],
    relationship: {
      type: '',
      dynamics: '',
      longTermPotential: ''
    }
  };

  // Generate insights
  generateRelationshipInsights(result);

  return result;
};
