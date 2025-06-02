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
  const moonSignCompatibility = calculateSignCompatibility(person1Moon.rashi, person2Moon.rashi);
  const venusSignCompatibility = calculateSignCompatibility(person1Venus.rashi, person2Venus.rashi);
  
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
