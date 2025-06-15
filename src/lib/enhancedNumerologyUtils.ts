
import { NumerologyProfile } from './numerologyUtils';

export interface BestYearAnalysis {
  bestYears: number[];
  challengingYears: number[];
  peakYear: number;
  description: string;
  opportunities: string[];
  warnings: string[];
}

export interface DetailedPersonalYear {
  year: number;
  personalYear: number;
  theme: string;
  description: string;
  opportunities: string[];
  challenges: string[];
  advice: string[];
  energy: 'High' | 'Medium' | 'Low';
  focus: string[];
  relationships: string;
  career: string;
  health: string;
  spiritual: string;
}

export interface CyclicalAnalysis {
  currentCycle: number;
  cyclePhase: string;
  cycleDescription: string;
  nextMilestone: {
    year: number;
    significance: string;
  };
}

// Calculate best years based on numerological cycles
export const calculateBestYears = (profile: NumerologyProfile, birthYear: number): BestYearAnalysis => {
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;
  
  const bestYears: number[] = [];
  const challengingYears: number[] = [];
  
  // Calculate years based on Life Path cycles
  for (let i = 0; i < 20; i++) {
    const year = currentYear + i;
    const personalYear = calculatePersonalYearForSpecificYear(profile, year);
    
    // Best years: when personal year matches life path or expression
    if (personalYear === profile.lifePath || 
        personalYear === profile.expression || 
        personalYear === 1 || 
        personalYear === 9 || 
        personalYear === 11 || 
        personalYear === 22) {
      bestYears.push(year);
    }
    
    // Challenging years: 4, 7, 8 for most people
    if (personalYear === 4 || personalYear === 7 || personalYear === 8) {
      challengingYears.push(year);
    }
  }
  
  // Peak year is typically when personal year = 1 (new beginnings)
  const peakYear = bestYears.find(year => 
    calculatePersonalYearForSpecificYear(profile, year) === 1
  ) || bestYears[0] || currentYear + 1;
  
  return {
    bestYears: bestYears.slice(0, 5),
    challengingYears: challengingYears.slice(0, 3),
    peakYear,
    description: getBestYearDescription(profile.lifePath),
    opportunities: getBestYearOpportunities(profile.lifePath),
    warnings: getBestYearWarnings(profile.lifePath)
  };
};

// Calculate detailed personal year analysis for multiple years
export const calculateDetailedPersonalYears = (profile: NumerologyProfile, birthYear: number): DetailedPersonalYear[] => {
  const currentYear = new Date().getFullYear();
  const years: DetailedPersonalYear[] = [];
  
  for (let i = -1; i <= 5; i++) {
    const year = currentYear + i;
    const personalYear = calculatePersonalYearForSpecificYear(profile, year);
    years.push(getDetailedPersonalYearAnalysis(personalYear, year));
  }
  
  return years;
};

// Calculate cyclical analysis based on 9-year cycles
export const calculateCyclicalAnalysis = (profile: NumerologyProfile, birthYear: number): CyclicalAnalysis => {
  const currentYear = new Date().getFullYear();
  const personalYear = calculatePersonalYearForSpecificYear(profile, currentYear);
  
  const cycleMap: Record<number, { phase: string; description: string }> = {
    1: { phase: "New Beginnings", description: "Starting fresh cycles, planting seeds for the future" },
    2: { phase: "Cooperation", description: "Building relationships and partnerships" },
    3: { phase: "Expression", description: "Creative manifestation and communication" },
    4: { phase: "Foundation", description: "Building solid foundations and working hard" },
    5: { phase: "Freedom", description: "Expansion, travel, and new experiences" },
    6: { phase: "Responsibility", description: "Home, family, and service to others" },
    7: { phase: "Reflection", description: "Inner growth, spirituality, and analysis" },
    8: { phase: "Achievement", description: "Material success and recognition" },
    9: { phase: "Completion", description: "Endings, release, and humanitarian service" }
  };
  
  const currentCycleInfo = cycleMap[personalYear] || cycleMap[1];
  
  // Find next significant milestone (when personal year = 1)
  let nextMilestone = currentYear + 1;
  while (calculatePersonalYearForSpecificYear(profile, nextMilestone) !== 1 && nextMilestone < currentYear + 9) {
    nextMilestone++;
  }
  
  return {
    currentCycle: personalYear,
    cyclePhase: currentCycleInfo.phase,
    cycleDescription: currentCycleInfo.description,
    nextMilestone: {
      year: nextMilestone,
      significance: "New 9-year cycle begins - major life transformation"
    }
  };
};

// Helper function to calculate personal year for a specific year
const calculatePersonalYearForSpecificYear = (profile: NumerologyProfile, year: number): number => {
  // This is a simplified calculation - you might want to use birth date
  const birthDate = new Date(year, 0, 1); // Placeholder
  const day = 1; // Placeholder
  const month = 1; // Placeholder
  const yearSum = year.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  
  const total = day + month + yearSum;
  return reduceToSingleDigit(total);
};

const reduceToSingleDigit = (num: number): number => {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return num;
};

// Helper functions for best year analysis
const getBestYearDescription = (lifePath: number): string => {
  const descriptions: Record<number, string> = {
    1: "Your best years emphasize leadership, independence, and new beginnings. These are times to start new projects and take charge.",
    2: "Your optimal years focus on cooperation, partnerships, and diplomatic solutions. Relationships flourish during these periods.",
    3: "Your peak years highlight creativity, communication, and social connections. Artistic endeavors thrive in these times.",
    4: "Your strongest years emphasize building foundations, hard work, and practical achievements. Steady progress is your key.",
    5: "Your best years bring freedom, adventure, and new experiences. Travel and change are highly favored.",
    6: "Your optimal years center on family, home, and service to others. Nurturing relationships and community involvement shine.",
    7: "Your peak years focus on spiritual growth, introspection, and gaining wisdom. Inner development is paramount.",
    8: "Your strongest years emphasize material success, business achievements, and recognition. Financial gains are likely.",
    9: "Your best years highlight humanitarian service, completion of cycles, and global perspectives. Giving back is key."
  };
  return descriptions[lifePath] || descriptions[1];
};

const getBestYearOpportunities = (lifePath: number): string[] => {
  const opportunities: Record<number, string[]> = {
    1: ["Start new business ventures", "Take leadership roles", "Initiate personal projects", "Break free from limitations"],
    2: ["Form strategic partnerships", "Improve relationships", "Develop diplomatic skills", "Collaborate on projects"],
    3: ["Launch creative projects", "Improve communication", "Network socially", "Express artistic talents"],
    4: ["Build solid foundations", "Focus on career advancement", "Organize and systematize", "Invest in property"],
    5: ["Travel and explore", "Change careers", "Learn new skills", "Expand your horizons"],
    6: ["Strengthen family bonds", "Buy/renovate home", "Start family", "Engage in community service"],
    7: ["Pursue spiritual studies", "Develop intuition", "Research and analyze", "Seek inner wisdom"],
    8: ["Expand business", "Seek promotions", "Make investments", "Gain recognition"],
    9: ["Complete major projects", "Engage in humanitarian work", "Travel internationally", "Share wisdom"]
  };
  return opportunities[lifePath] || opportunities[1];
};

const getBestYearWarnings = (lifePath: number): string[] => {
  const warnings: Record<number, string[]> = {
    1: ["Avoid being too aggressive", "Don't isolate yourself", "Balance independence with cooperation"],
    2: ["Don't be overly dependent", "Avoid conflict avoidance", "Stand up for yourself when needed"],
    3: ["Don't scatter energies", "Avoid superficial relationships", "Focus on completing projects"],
    4: ["Don't become too rigid", "Avoid overworking", "Make time for relaxation"],
    5: ["Don't be irresponsible", "Avoid commitment phobia", "Stay grounded"],
    6: ["Don't become controlling", "Avoid martyrdom", "Balance giving with receiving"],
    7: ["Don't isolate completely", "Avoid overthinking", "Stay connected to others"],
    8: ["Don't become materialistic", "Avoid power struggles", "Remember ethical considerations"],
    9: ["Don't cling to the past", "Avoid emotional overwhelm", "Let go gracefully"]
  };
  return warnings[lifePath] || warnings[1];
};

const getDetailedPersonalYearAnalysis = (personalYear: number, year: number): DetailedPersonalYear => {
  const yearAnalysis: Record<number, Omit<DetailedPersonalYear, 'year' | 'personalYear'>> = {
    1: {
      theme: "New Beginnings & Independence",
      description: "A year of fresh starts, new opportunities, and taking initiative. Plant seeds for future growth.",
      opportunities: ["Start new projects", "Take leadership roles", "Make important decisions", "Assert independence"],
      challenges: ["Avoid impulsiveness", "Don't rush decisions", "Balance ego with humility"],
      advice: ["Trust your instincts", "Take calculated risks", "Focus on self-development", "Be patient with results"],
      energy: "High",
      focus: ["Career advancement", "Personal goals", "Leadership", "Innovation"],
      relationships: "Focus on independence while maintaining healthy connections. New relationships possible.",
      career: "Excellent time for job changes, promotions, or starting new ventures. Leadership opportunities abound.",
      health: "High energy period. Good time to start new fitness routines or health regimens.",
      spiritual: "Connect with your personal power and life purpose. Trust your inner guidance."
    },
    2: {
      theme: "Cooperation & Partnerships",
      description: "A year focused on relationships, cooperation, and working with others. Patience and diplomacy are key.",
      opportunities: ["Form partnerships", "Improve relationships", "Develop patience", "Practice diplomacy"],
      challenges: ["Avoid being too passive", "Don't lose yourself in others", "Balance giving and receiving"],
      advice: ["Practice patience", "Listen more than you speak", "Seek win-win solutions", "Nurture relationships"],
      energy: "Medium",
      focus: ["Relationships", "Teamwork", "Details", "Support"],
      relationships: "Existing relationships deepen. Marriage or committed partnerships highly favored.",
      career: "Focus on teamwork and collaboration. Behind-the-scenes work is favored over leadership.",
      health: "Emotional balance is crucial. Practice stress management and seek support when needed.",
      spiritual: "Develop empathy and compassion. Practice meditation and seek inner peace."
    },
    3: {
      theme: "Creative Expression & Communication",
      description: "A year of creativity, self-expression, and social expansion. Your artistic and communication skills shine.",
      opportunities: ["Express creativity", "Improve communication", "Expand social circle", "Pursue arts"],
      challenges: ["Avoid scattering energy", "Don't be superficial", "Focus on completing projects"],
      advice: ["Express yourself authentically", "Network actively", "Pursue creative hobbies", "Stay optimistic"],
      energy: "High",
      focus: ["Creativity", "Communication", "Social life", "Arts"],
      relationships: "Social life expands significantly. Fun and lighthearted connections are highlighted.",
      career: "Creative fields, communications, and sales are favored. Public speaking opportunities.",
      health: "Generally positive, but watch for stress from overcommitment. Maintain work-life balance.",
      spiritual: "Express your spiritual beliefs creatively. Join spiritual communities or groups."
    },
    4: {
      theme: "Foundation Building & Hard Work",
      description: "A year of steady progress, hard work, and building solid foundations. Focus on practical matters.",
      opportunities: ["Build solid foundations", "Organize systems", "Focus on details", "Invest wisely"],
      challenges: ["Avoid becoming too rigid", "Don't overwork", "Balance work with rest"],
      advice: ["Work steadily toward goals", "Focus on details", "Build for the long term", "Stay organized"],
      energy: "Medium",
      focus: ["Work", "Organization", "Stability", "Practical matters"],
      relationships: "Relationships require work and commitment. Focus on loyalty and dependability.",
      career: "Steady progress through hard work. Not a year for dramatic changes but for building expertise.",
      health: "Pay attention to physical health. Regular exercise and proper rest are essential.",
      spiritual: "Find the sacred in everyday work. Practice mindfulness in routine activities."
    },
    5: {
      theme: "Freedom & Adventure",
      description: "A year of change, freedom, and new experiences. Travel and variety are highlighted.",
      opportunities: ["Travel and explore", "Try new experiences", "Change routines", "Learn new skills"],
      challenges: ["Avoid irresponsibility", "Don't be too restless", "Make wise choices"],
      advice: ["Embrace change", "Stay flexible", "Seek new experiences", "Maintain some stability"],
      energy: "High",
      focus: ["Freedom", "Travel", "Change", "Learning"],
      relationships: "Need for freedom may challenge committed relationships. Communicate needs clearly.",
      career: "Good year for career changes, travel, or jobs involving variety and freedom.",
      health: "Active lifestyle is beneficial. Travel may expose you to new health practices.",
      spiritual: "Expand spiritual horizons through different practices, cultures, or philosophies."
    },
    6: {
      theme: "Responsibility & Nurturing",
      description: "A year focused on home, family, and service to others. Responsibility and nurturing are emphasized.",
      opportunities: ["Strengthen family bonds", "Improve home environment", "Serve others", "Heal relationships"],
      challenges: ["Avoid being controlling", "Don't sacrifice too much", "Balance giving with receiving"],
      advice: ["Focus on family and home", "Practice compassion", "Take on responsibilities willingly", "Create harmony"],
      energy: "Medium",
      focus: ["Family", "Home", "Service", "Healing"],
      relationships: "Family relationships are central. Marriage, children, or caring for elderly possible.",
      career: "Service-oriented careers are favored. Healthcare, education, counseling highlighted.",
      health: "Focus on family health matters. Stress from responsibility may need management.",
      spiritual: "Service to others as spiritual practice. Find the divine in caring and nurturing."
    },
    7: {
      theme: "Introspection & Spiritual Growth",
      description: "A year of inner reflection, spiritual growth, and seeking deeper understanding. Solitude is valuable.",
      opportunities: ["Develop spiritually", "Study and research", "Seek inner wisdom", "Practice meditation"],
      challenges: ["Avoid isolation", "Don't overthink", "Stay connected to others"],
      advice: ["Spend time in reflection", "Study subjects of interest", "Trust your intuition", "Seek spiritual guidance"],
      energy: "Low",
      focus: ["Spirituality", "Study", "Introspection", "Analysis"],
      relationships: "Quality over quantity. Deep, meaningful connections preferred over social activities.",
      career: "Research, analysis, and specialized work are favored. Avoid major career moves.",
      health: "Mental and spiritual health are priorities. Regular meditation and stress relief essential.",
      spiritual: "Peak year for spiritual development. Deep meditation, study, and inner work are highlighted."
    },
    8: {
      theme: "Material Success & Achievement",
      description: "A year of material achievement, business success, and recognition. Focus on practical accomplishments.",
      opportunities: ["Achieve business success", "Gain recognition", "Make investments", "Build wealth"],
      challenges: ["Avoid being materialistic", "Don't neglect relationships", "Stay ethical"],
      advice: ["Focus on material goals", "Seek recognition", "Make wise investments", "Lead with integrity"],
      energy: "High",
      focus: ["Business", "Money", "Achievement", "Recognition"],
      relationships: "Business relationships are important. Personal relationships may take second place.",
      career: "Excellent year for promotions, business deals, and financial advancement.",
      health: "Success stress may affect health. Balance achievement with self-care.",
      spiritual: "Learn about abundance and ethical use of power. Integrate spirituality with material success."
    },
    9: {
      theme: "Completion & Humanitarian Service",
      description: "A year of endings, completion, and service to humanity. Let go of what no longer serves.",
      opportunities: ["Complete major projects", "Serve humanity", "Practice forgiveness", "Share wisdom"],
      challenges: ["Avoid clinging to the past", "Don't become overwhelmed by others' problems", "Practice letting go"],
      advice: ["Complete what you started", "Help others", "Practice forgiveness", "Prepare for new cycles"],
      energy: "Medium",
      focus: ["Completion", "Service", "Forgiveness", "Wisdom"],
      relationships: "Focus on unconditional love and forgiveness. Some relationships may end naturally.",
      career: "Wrap up major projects. Career in humanitarian fields or global scope is favored.",
      health: "Release emotional baggage that affects health. Holistic and alternative healing beneficial.",
      spiritual: "Culmination of spiritual growth. Share your wisdom and serve others with compassion."
    }
  };

  const analysis = yearAnalysis[personalYear] || yearAnalysis[1];
  
  return {
    year,
    personalYear,
    ...analysis
  };
};
