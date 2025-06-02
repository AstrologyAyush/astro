import { KundaliChart, PlanetPosition, getPlanetDetails, getZodiacDetails } from './kundaliUtils';

interface KarmaPattern {
  name: string;
  description: string;
  intensity: number;
  remedies: string[];
}

interface RelationshipKarma {
  pastLifeConnection: string;
  karmaType: 'positive' | 'negative' | 'neutral';
  lessons: string[];
  challenges: string[];
  opportunities: string[];
  remedies: string[];
  intensity: number;
}

interface SoulMateIndicators {
  isPresent: boolean;
  strength: number;
  indicators: string[];
  description: string;
}

export interface RelationshipKarmaAnalysis {
  compatibility: number;
  soulMateIndicators: SoulMateIndicators;
  karmaPatterns: KarmaPattern[];
  relationshipKarma: RelationshipKarma;
  recommendations: string[];
}

// Calculate relationship karma between two charts
export function calculateRelationshipKarma(
  chart1: KundaliChart, 
  chart2: KundaliChart
): RelationshipKarmaAnalysis {
  // Convert planets to arrays if needed
  const planets1 = Array.isArray(chart1.planets) ? chart1.planets : Object.values(chart1.planets);
  const planets2 = Array.isArray(chart2.planets) ? chart2.planets : Object.values(chart2.planets);
  
  // Find specific planets
  const venus1 = planets1.find(p => p.id === "VE");
  const mars1 = planets1.find(p => p.id === "MA");
  const moon1 = planets1.find(p => p.id === "MO");
  const sun1 = planets1.find(p => p.id === "SU");
  const jupiter1 = planets1.find(p => p.id === "JU");
  const rahu1 = planets1.find(p => p.id === "RA");
  const ketu1 = planets1.find(p => p.id === "KE");
  
  const venus2 = planets2.find(p => p.id === "VE");
  const mars2 = planets2.find(p => p.id === "MA");
  const moon2 = planets2.find(p => p.id === "MO");
  const sun2 = planets2.find(p => p.id === "SU");
  const jupiter2 = planets2.find(p => p.id === "JU");
  const rahu2 = planets2.find(p => p.id === "RA");
  const ketu2 = planets2.find(p => p.id === "KE");
  
  // Calculate basic compatibility
  let compatibility = 50; // Base compatibility
  
  // Moon sign compatibility
  if (moon1 && moon2) {
    const moonDistance = Math.abs(moon1.rashi - moon2.rashi);
    if ([0, 4, 8].includes(moonDistance)) {
      compatibility += 20; // Same element
    } else if ([1, 5, 9].includes(moonDistance)) {
      compatibility += 10; // Friendly signs
    }
  }
  
  // Venus-Mars compatibility
  if (venus1 && mars2) {
    const venusMarsDist = Math.abs(venus1.rashi - mars2.rashi);
    if ([0, 1, 11].includes(venusMarsDist)) {
      compatibility += 15;
    }
  }
  
  if (venus2 && mars1) {
    const marsVenusDist = Math.abs(mars1.rashi - venus2.rashi);
    if ([0, 1, 11].includes(marsVenusDist)) {
      compatibility += 15;
    }
  }
  
  // Soul mate indicators
  const soulMateIndicators = calculateSoulMateIndicators(planets1, planets2);
  
  // Karma patterns
  const karmaPatterns = calculateKarmaPatterns(planets1, planets2);
  
  // Relationship karma
  const relationshipKarma = calculateRelationshipKarmaDetails(planets1, planets2);
  
  // Generate recommendations
  const recommendations = generateRecommendations(compatibility, soulMateIndicators, karmaPatterns);
  
  return {
    compatibility: Math.min(100, Math.max(0, compatibility)),
    soulMateIndicators,
    karmaPatterns,
    relationshipKarma,
    recommendations
  };
}

function calculateSoulMateIndicators(planets1: PlanetPosition[], planets2: PlanetPosition[]): SoulMateIndicators {
  const indicators: string[] = [];
  let strength = 0;
  
  // Find nodes (Rahu/Ketu) connections
  const rahu1 = planets1.find(p => p.id === "RA");
  const ketu1 = planets1.find(p => p.id === "KE");
  const rahu2 = planets2.find(p => p.id === "RA");
  const ketu2 = planets2.find(p => p.id === "KE");
  
  if (rahu1 && ketu2 && Math.abs(rahu1.rashi - ketu2.rashi) <= 1) {
    indicators.push("North Node - South Node connection");
    strength += 30;
  }
  
  if (ketu1 && rahu2 && Math.abs(ketu1.rashi - rahu2.rashi) <= 1) {
    indicators.push("South Node - North Node connection");
    strength += 30;
  }
  
  // Venus-Jupiter connections
  const venus1 = planets1.find(p => p.id === "VE");
  const jupiter2 = planets2.find(p => p.id === "JU");
  const venus2 = planets2.find(p => p.id === "VE");
  const jupiter1 = planets1.find(p => p.id === "JU");
  
  if (venus1 && jupiter2 && Math.abs(venus1.rashi - jupiter2.rashi) <= 1) {
    indicators.push("Venus-Jupiter blessing");
    strength += 25;
  }
  
  if (venus2 && jupiter1 && Math.abs(venus2.rashi - jupiter1.rashi) <= 1) {
    indicators.push("Jupiter-Venus harmony");
    strength += 25;
  }
  
  return {
    isPresent: strength > 30,
    strength: Math.min(100, strength),
    indicators,
    description: strength > 50 ? "Strong soul mate connection" : 
                strength > 30 ? "Possible soul mate indicators" : 
                "Limited soul mate indicators"
  };
}

function calculateKarmaPatterns(planets1: PlanetPosition[], planets2: PlanetPosition[]): KarmaPattern[] {
  const patterns: KarmaPattern[] = [];
  
  // Saturn connections (karmic lessons)
  const saturn1 = planets1.find(p => p.id === "SA");
  const saturn2 = planets2.find(p => p.id === "SA");
  
  if (saturn1 && saturn2) {
    const saturnDistance = Math.abs(saturn1.rashi - saturn2.rashi);
    if (saturnDistance <= 2) {
      patterns.push({
        name: "Saturn Karma Pattern",
        description: "Shared life lessons and responsibilities",
        intensity: 80,
        remedies: ["Practice patience and understanding", "Focus on long-term commitment"]
      });
    }
  }
  
  // Rahu-Ketu karma
  const rahu1 = planets1.find(p => p.id === "RA");
  const ketu1 = planets1.find(p => p.id === "KE");
  const rahu2 = planets2.find(p => p.id === "RA");
  const ketu2 = planets2.find(p => p.id === "KE");
  
  if (rahu1 && rahu2 && Math.abs(rahu1.rashi - rahu2.rashi) <= 1) {
    patterns.push({
      name: "Desire Karma",
      description: "Shared material and worldly desires",
      intensity: 70,
      remedies: ["Practice spiritual detachment", "Focus on higher purposes"]
    });
  }
  
  return patterns;
}

function calculateRelationshipKarmaDetails(planets1: PlanetPosition[], planets2: PlanetPosition[]): RelationshipKarma {
  // Find key planets
  const rahu1 = planets1.find(p => p.id === "RA");
  const ketu1 = planets1.find(p => p.id === "KE");
  const venus1 = planets1.find(p => p.id === "VE");
  const mars1 = planets1.find(p => p.id === "MA");
  
  const rahu2 = planets2.find(p => p.id === "RA");
  const ketu2 = planets2.find(p => p.id === "KE");
  const venus2 = planets2.find(p => p.id === "VE");
  const mars2 = planets2.find(p => p.id === "MA");
  
  let karmaType: 'positive' | 'negative' | 'neutral' = 'neutral';
  let intensity = 50;
  
  // Determine karma type based on nodal connections
  if (rahu1 && ketu2 && Math.abs(rahu1.rashi - ketu2.rashi) <= 1) {
    karmaType = 'positive';
    intensity += 30;
  }
  
  if (ketu1 && rahu2 && Math.abs(ketu1.rashi - rahu2.rashi) <= 1) {
    karmaType = 'positive';
    intensity += 30;
  }
  
  return {
    pastLifeConnection: karmaType === 'positive' ? 
      "Strong past life connection with unfinished positive karma" :
      "Past life connection with lessons to learn",
    karmaType,
    lessons: [
      "Learning to balance individual desires with partnership needs",
      "Developing unconditional love and acceptance",
      "Understanding the nature of attachment and detachment"
    ],
    challenges: [
      "Overcoming past life patterns",
      "Balancing karma from previous incarnations",
      "Learning to forgive and let go"
    ],
    opportunities: [
      "Spiritual growth through relationship",
      "Healing past life wounds",
      "Creating positive karma for future lives"
    ],
    remedies: [
      "Practice meditation together",
      "Perform charitable acts as a couple",
      "Study spiritual texts and teachings"
    ],
    intensity: Math.min(100, Math.max(0, intensity))
  };
}

function generateRecommendations(
  compatibility: number, 
  soulMate: SoulMateIndicators, 
  patterns: KarmaPattern[]
): string[] {
  const recommendations: string[] = [];
  
  if (compatibility > 70) {
    recommendations.push("This is a highly compatible relationship with strong potential for long-term happiness");
  } else if (compatibility > 50) {
    recommendations.push("Good compatibility with some areas needing attention and understanding");
  } else {
    recommendations.push("Challenging relationship that requires significant effort and commitment from both partners");
  }
  
  if (soulMate.isPresent) {
    recommendations.push("Strong soul mate indicators suggest a deep spiritual connection");
    recommendations.push("Focus on spiritual growth and higher purposes together");
  }
  
  if (patterns.length > 0) {
    recommendations.push("Karmic patterns indicate important life lessons to be learned together");
    recommendations.push("Practice patience and understanding during challenging times");
  }
  
  recommendations.push("Regular spiritual practices and open communication will strengthen the bond");
  
  return recommendations;
}

// Helper function to get planet by ID
function getPlanetById(planets: PlanetPosition[], id: string): PlanetPosition | undefined {
  return planets.find(p => p.id === id);
}

// Export additional utility functions
export {
  calculateSoulMateIndicators,
  calculateKarmaPatterns,
  calculateRelationshipKarmaDetails
};
