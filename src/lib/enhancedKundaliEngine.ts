
import { BirthData, PlanetPosition, KundaliChart, generateKundaliChart } from './kundaliUtils';

// Personality Archetypes
interface ArchetypeProfile {
  dominantArchetype: string;
  strengths: string[];
  weaknesses: string[];
  advice: string;
}

// Compatibility Insights
interface CompatibilityResult {
  overallScore: number;
  emotionalCompatibility: number;
  intellectualCompatibility: number;
  physicalCompatibility: number;
  spiritualCompatibility: number;
  challenges: string[];
  strengths: string[];
  advice: string;
}

// Remedial Measures
interface RemedialSuggestions {
  mantras: string[];
  gemstones: string[];
  charity: string[];
  lifestyle: string[];
}

// Detailed Predictions
interface PredictionSummary {
  career: string;
  relationships: string;
  finances: string;
  health: string;
}

// Spiritual Insights
interface SpiritualGuidance {
  dharma: string;
  karma: string;
  purpose: string;
}

// Archetype definitions
export const ARCHETYPES = {
  Rebel: {
    keywords: ['rebel', 'freedom', 'break', 'change', 'fight', 'against'],
    traits: ['Independent', 'Revolutionary', 'Challenging'],
    description: 'The Rebel seeks freedom and challenges the status quo'
  },
  Sage: {
    keywords: ['wisdom', 'knowledge', 'learn', 'understand', 'truth'],
    traits: ['Wise', 'Knowledgeable', 'Seeking truth'],
    description: 'The Sage seeks wisdom and understanding'
  },
  Warrior: {
    keywords: ['fight', 'courage', 'battle', 'strength', 'protect'],
    traits: ['Courageous', 'Strong', 'Protective'],
    description: 'The Warrior faces challenges with courage'
  },
  Monk: {
    keywords: ['peace', 'spiritual', 'meditation', 'harmony', 'inner'],
    traits: ['Peaceful', 'Spiritual', 'Introspective'],
    description: 'The Monk seeks inner peace and spiritual growth'
  },
  King: {
    keywords: ['lead', 'authority', 'control', 'power', 'rule'],
    traits: ['Leadership', 'Authority', 'Responsible'],
    description: 'The King takes charge and leads others'
  },
  Magician: {
    keywords: ['create', 'transform', 'magic', 'change', 'manifest'],
    traits: ['Creative', 'Transformative', 'Innovative'],
    description: 'The Magician transforms and creates new realities'
  },
  Survivor: {
    keywords: ['survive', 'adapt', 'endure', 'overcome', 'resilient'],
    traits: ['Resilient', 'Adaptable', 'Strong-willed'],
    description: 'The Survivor adapts and overcomes challenges'
  },
  Empath: {
    keywords: ['feel', 'understand', 'care', 'help', 'emotional'],
    traits: ['Empathetic', 'Caring', 'Understanding'],
    description: 'The Empath feels deeply and cares for others'
  }
};

// Detect archetype from text answer
export function detectArchetypeFromAnswer(answer: string): { type: string; score: number } {
  const lowercaseAnswer = answer.toLowerCase();
  const scores: Record<string, number> = {};
  
  // Calculate scores for each archetype
  Object.entries(ARCHETYPES).forEach(([archetype, data]) => {
    let score = 0;
    data.keywords.forEach(keyword => {
      if (lowercaseAnswer.includes(keyword)) {
        score += 1;
      }
    });
    scores[archetype] = score;
  });
  
  // Find the highest scoring archetype
  const topArchetype = Object.entries(scores).reduce((a, b) => 
    scores[a[0]] > scores[b[0]] ? a : b
  )[0];
  
  return {
    type: topArchetype,
    score: Math.min(scores[topArchetype] * 2, 10) // Scale to 0-10
  };
}

// Match archetype to kundali
export function matchArchetypeToKundali(archetype: string, kundali: any) {
  // Simple matching logic based on dominant planets
  const planets = Array.isArray(kundali.planets) ? kundali.planets : Object.values(kundali.planets);
  
  // Find dominant planet
  const dominantPlanet = planets.reduce((prev: any, current: any) => 
    (prev.longitude > current.longitude) ? prev : current
  );
  
  // Archetype to planet mapping
  const archetypeMapping: Record<string, string[]> = {
    Rebel: ['RA', 'MA', 'UR'], // Rahu, Mars, Uranus
    Sage: ['JU', 'ME'], // Jupiter, Mercury
    Warrior: ['MA', 'SU'], // Mars, Sun
    Monk: ['MO', 'KE', 'SA'], // Moon, Ketu, Saturn
    King: ['SU', 'JU'], // Sun, Jupiter
    Magician: ['ME', 'VE', 'RA'], // Mercury, Venus, Rahu
    Survivor: ['SA', 'MA'], // Saturn, Mars
    Empath: ['MO', 'VE'] // Moon, Venus
  };
  
  const expectedPlanets = archetypeMapping[archetype] || [];
  const matches = expectedPlanets.includes(dominantPlanet.id || dominantPlanet.name);
  
  const score = matches ? 8 : 5; // High score if matched, moderate otherwise
  const matchLevel = score >= 7 ? 'High' : score >= 5 ? 'Medium' : 'Low';
  
  return {
    archetype: dominantPlanet.name || dominantPlanet.id,
    score,
    matchLevel,
    recommendation: matches 
      ? `Your psychological archetype aligns well with your astrological profile.`
      : `Consider exploring the qualities of ${archetype} to balance your nature.`,
    reasons: matches 
      ? [`Your dominant planet supports ${archetype} qualities`]
      : [`Your chart suggests different qualities than ${archetype}`]
  };
}

function generatePersonalityProfile(planets: PlanetPosition[]): ArchetypeProfile {
  // Determine dominant planet (simplified)
  const dominantPlanet = planets.reduce((prev, current) => (prev.longitude > current.longitude) ? prev : current);

  // Define archetypes based on dominant planet
  const archetypes: { [key: string]: ArchetypeProfile } = {
    Sun: {
      dominantArchetype: 'The Leader',
      strengths: ['Charismatic', 'Confident', 'Generous'],
      weaknesses: ['Arrogant', 'Self-centered', 'Authoritarian'],
      advice: 'Lead with humility and empower others.'
    },
    Moon: {
      dominantArchetype: 'The Nurturer',
      strengths: ['Empathetic', 'Intuitive', 'Caring'],
      weaknesses: ['Moody', 'Over-sensitive', 'Clingy'],
      advice: 'Set healthy boundaries and practice self-care.'
    },
    Mars: {
      dominantArchetype: 'The Warrior',
      strengths: ['Courageous', 'Driven', 'Passionate'],
      weaknesses: ['Aggressive', 'Impulsive', 'Reckless'],
      advice: 'Channel your energy constructively and think before acting.'
    },
    Mercury: {
      dominantArchetype: 'The Communicator',
      strengths: ['Intelligent', 'Adaptable', 'Eloquent'],
      weaknesses: ['Anxious', 'Superficial', 'Deceptive'],
      advice: 'Use your words wisely and seek deeper understanding.'
    },
    Jupiter: {
      dominantArchetype: 'The Sage',
      strengths: ['Wise', 'Optimistic', 'Generous'],
      weaknesses: ['Judgmental', 'Extravagant', 'Preachy'],
      advice: 'Share your wisdom with compassion and practice moderation.'
    },
    Venus: {
      dominantArchetype: 'The Lover',
      strengths: ['Charming', 'Artistic', 'Diplomatic'],
      weaknesses: ['Vain', 'Indecisive', 'Jealous'],
      advice: 'Cultivate inner beauty and value genuine connections.'
    },
    Saturn: {
      dominantArchetype: 'The Disciplinarian',
      strengths: ['Responsible', 'Patient', 'Wise'],
      weaknesses: ['Pessimistic', 'Rigid', 'Controlling'],
      advice: 'Embrace flexibility and find joy in simplicity.'
    },
    Rahu: {
      dominantArchetype: 'The Outcast',
      strengths: ['Innovative', 'Unconventional', 'Visionary'],
      weaknesses: ['Restless', 'Deceptive', 'Unpredictable'],
      advice: 'Embrace your unique path and use your talents for good.'
    },
    Ketu: {
      dominantArchetype: 'The Mystic',
      strengths: ['Intuitive', 'Spiritual', 'Detached'],
      weaknesses: ['Isolated', 'Confused', 'Apathetic'],
      advice: 'Find grounding and share your insights with the world.'
    }
  };

  return archetypes[dominantPlanet.name] || {
    dominantArchetype: 'The Seeker',
    strengths: ['Curious', 'Open-minded', 'Adaptable'],
    weaknesses: ['Restless', 'Insecure', 'Indecisive'],
    advice: 'Trust your intuition and follow your heart.'
  };
}

function calculateCompatibility(person1Planets: PlanetPosition[], person2Planets: PlanetPosition[]): CompatibilityResult {
  // Find Moon and Venus positions for both people
  const person1Moon = person1Planets.find(p => p.id === 'moon');
  const person1Venus = person1Planets.find(p => p.id === 'venus');
  const person2Moon = person2Planets.find(p => p.id === 'moon');
  const person2Venus = person2Planets.find(p => p.id === 'venus');
  
  if (!person1Moon || !person1Venus || !person2Moon || !person2Venus) {
    return {
      overallScore: 50,
      emotionalCompatibility: 50,
      intellectualCompatibility: 50,
      physicalCompatibility: 50,
      spiritualCompatibility: 50,
      challenges: ['Incomplete birth data'],
      strengths: ['Basic compatibility can be assessed'],
      advice: 'Please ensure complete birth details for accurate compatibility analysis.'
    };
  }
  
  // Calculate sign compatibility
  const moonSignCompatibility = calculateSignCompatibility(person1Moon.sign, person2Moon.sign);
  const venusSignCompatibility = calculateSignCompatibility(person1Venus.sign, person2Venus.sign);
  
  // Combine scores
  const overallScore = Math.round((moonSignCompatibility + venusSignCompatibility) / 2);
  
  return {
    overallScore,
    emotionalCompatibility: moonSignCompatibility,
    intellectualCompatibility: venusSignCompatibility,
    physicalCompatibility: 75, // Placeholder
    spiritualCompatibility: 80, // Placeholder
    challenges: ['Communication differences may arise', 'Different approaches to finances'],
    strengths: ['Strong emotional connection', 'Shared values and goals'],
    advice: 'Focus on open communication and mutual understanding to strengthen your relationship.'
  };
}

function calculateSignCompatibility(sign1: number, sign2: number): number {
  // Basic sign compatibility calculation
  const distance = Math.abs(sign1 - sign2);
  let score = 100 - (distance * 5);
  return Math.max(0, score);
}

function generateRemedialMeasures(planets: PlanetPosition[]): RemedialSuggestions {
  // Generate basic remedial measures based on planetary positions
  return {
    mantras: ['Chant the Gayatri Mantra daily'],
    gemstones: ['Wear a clear quartz crystal'],
    charity: ['Donate to a local food bank'],
    lifestyle: ['Practice mindfulness and meditation']
  };
}

function generateDetailedPredictions(planets: PlanetPosition[]): PredictionSummary {
  // Generate basic predictions based on planetary positions
  return {
    career: 'Opportunities for growth and advancement',
    relationships: 'Harmonious and supportive connections',
    finances: 'Stable and secure financial situation',
    health: 'Good overall health and well-being'
  };
}

function generateSpiritualInsights(planets: PlanetPosition[]): SpiritualGuidance {
  // Generate basic spiritual insights based on planetary positions
  return {
    dharma: 'Follow your true calling and serve others',
    karma: 'Learn from your past experiences and make amends',
    purpose: 'Find meaning and fulfillment in your life'
  };
}

export function generateEnhancedKundali(birthData: BirthData) {
  // Generate basic kundali using the updated function
  const basicKundali = generateKundaliChart(birthData);
  
  // Convert planets to the expected format
  const planetsArray: PlanetPosition[] = Object.values(basicKundali.planets);
  
  return {
    ...basicKundali,
    birthData,
    planets: planetsArray,
    personalityProfile: generatePersonalityProfile(planetsArray),
    compatibility: calculateCompatibility(planetsArray, planetsArray),
    remedies: generateRemedialMeasures(planetsArray),
    predictions: generateDetailedPredictions(planetsArray),
    spiritualInsights: generateSpiritualInsights(planetsArray)
  };
}
