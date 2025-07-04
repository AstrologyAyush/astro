/**
 * Gemini AI Integration for Enhanced Kundali Analysis
 * Provides intelligent interpretations and predictions
 */

import { VedicKundaliResult } from './preciseVedicKundaliEngine';

// Type definitions for Gemini API
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface EnhancedKundaliAnalysis {
  detailedPersonality: {
    coreNature: string;
    mentalTendencies: string;
    emotionalPatterns: string;
    spiritualInclinations: string;
  };
  careerGuidance: {
    idealProfessions: string[];
    businessAptitude: string;
    leadershipQualities: string;
    creativePotential: string;
  };
  relationshipInsights: {
    marriageTimings: string;
    partnerQualities: string;
    familyLife: string;
    friendshipPatterns: string;
  };
  healthPredictions: {
    generalHealth: string;
    vulnerableAreas: string[];
    preventiveMeasures: string[];
    mentalWellbeing: string;
  };
  spiritualPath: {
    dharma: string;
    karmaLessons: string;
    spiritualPractices: string[];
    lifeGoals: string;
  };
  timingPredictions: {
    currentPhase: string;
    upcomingOpportunities: string[];
    challengesToWatch: string[];
    auspiciousPeriods: string[];
  };
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export async function getGeminiKundaliAnalysis(kundaliData: any): Promise<EnhancedKundaliAnalysis> {
  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key not configured, using fallback analysis');
    return getFallbackAnalysis(kundaliData);
  }

  try {
    const prompt = createDetailedKundaliPrompt(kundaliData);
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    const analysisText = data.candidates[0]?.content?.parts[0]?.text;
    
    if (!analysisText) {
      throw new Error('No analysis text received from Gemini');
    }

    return parseGeminiResponse(analysisText, kundaliData);
    
  } catch (error) {
    console.error('Error getting Gemini analysis:', error);
    return getFallbackAnalysis(kundaliData);
  }
}

function createDetailedKundaliPrompt(kundaliData: any): string {
  // Safely extract data with fallbacks
  const birthData = kundaliData?.birthData || {};
  const chart = kundaliData?.chart || kundaliData?.enhancedCalculations || {};
  const planets = chart?.planets || {};
  const houses = chart?.houses || [];
  const yogas = chart?.yogas || [];
  const dashas = chart?.dashas || [];
  const doshas = chart?.doshas || [];
  
  return `As an expert Vedic astrologer, provide a comprehensive analysis of this birth chart:

BIRTH DETAILS:
- Name: ${birthData.fullName || 'Unknown'}
- Date: ${birthData.date || 'Unknown'}
- Time: ${birthData.time || 'Unknown'}
- Place: ${birthData.place || 'Unknown'}

LAGNA (ASCENDANT):
- Sign: ${chart.ascendant || chart.lagna?.rashiName || 'Unknown'}

PLANETARY POSITIONS:
${Object.values(planets).length > 0 ? 
  Object.values(planets).map((planet: any) => 
    `- ${planet.name || 'Unknown'}: ${planet.rashiName || 'Unknown'} ${planet.degree?.toFixed(1) || '0'}° (House ${planet.house || 'Unknown'})`
  ).join('\n') : 'No planetary data available'}

ACTIVE YOGAS:
${yogas.filter((y: any) => y.isActive || y.present).length > 0 ? 
  yogas.filter((y: any) => y.isActive || y.present).map((yoga: any) => `- ${yoga.name}: ${yoga.description || 'Present'}`).join('\n') :
  'No active yogas found'}

CURRENT DASHA:
${dashas.find((d: any) => d.isActive)?.planet || 'Unknown'}

DOSHAS:
${doshas.filter((d: any) => d.isPresent).length > 0 ? 
  doshas.filter((d: any) => d.isPresent).map((dosha: any) => `- ${dosha.name}: ${dosha.severity || 'Present'}`).join('\n') :
  'No significant doshas'}

Please provide a detailed analysis covering personality, career, relationships, health, spiritual path, and timing predictions based on traditional Vedic astrology principles.

Format your response as structured sections with clear headings.`;
}

function parseGeminiResponse(analysisText: string, kundaliData: any): EnhancedKundaliAnalysis {
  // Parse the Gemini response and structure it
  // This is a simplified parser - in production, you'd want more sophisticated parsing
  
  try {
    // Extract sections using regex or string manipulation
    const sections = analysisText.split(/\d+\.\s+[A-Z\s]+:|[A-Z\s]+:/);
    
    return {
      detailedPersonality: {
        coreNature: extractSection(analysisText, 'core nature|temperament') || getDefaultPersonality(kundaliData).coreNature,
        mentalTendencies: extractSection(analysisText, 'mental|thought') || getDefaultPersonality(kundaliData).mentalTendencies,
        emotionalPatterns: extractSection(analysisText, 'emotional|emotion') || getDefaultPersonality(kundaliData).emotionalPatterns,
        spiritualInclinations: extractSection(analysisText, 'spiritual|religious') || getDefaultPersonality(kundaliData).spiritualInclinations
      },
      careerGuidance: {
        idealProfessions: extractListItems(analysisText, 'profession|career') || getDefaultCareer(kundaliData).idealProfessions,
        businessAptitude: extractSection(analysisText, 'business') || getDefaultCareer(kundaliData).businessAptitude,
        leadershipQualities: extractSection(analysisText, 'leadership') || getDefaultCareer(kundaliData).leadershipQualities,
        creativePotential: extractSection(analysisText, 'creative|artistic') || getDefaultCareer(kundaliData).creativePotential
      },
      relationshipInsights: {
        marriageTimings: extractSection(analysisText, 'marriage|timing') || getDefaultRelationships(kundaliData).marriageTimings,
        partnerQualities: extractSection(analysisText, 'partner|spouse') || getDefaultRelationships(kundaliData).partnerQualities,
        familyLife: extractSection(analysisText, 'family|domestic') || getDefaultRelationships(kundaliData).familyLife,
        friendshipPatterns: extractSection(analysisText, 'friend|social') || getDefaultRelationships(kundaliData).friendshipPatterns
      },
      healthPredictions: {
        generalHealth: extractSection(analysisText, 'health|constitution') || getDefaultHealth(kundaliData).generalHealth,
        vulnerableAreas: extractListItems(analysisText, 'vulnerable|weak') || getDefaultHealth(kundaliData).vulnerableAreas,
        preventiveMeasures: extractListItems(analysisText, 'preventive|prevention') || getDefaultHealth(kundaliData).preventiveMeasures,
        mentalWellbeing: extractSection(analysisText, 'mental.*well|emotional.*well') || getDefaultHealth(kundaliData).mentalWellbeing
      },
      spiritualPath: {
        dharma: extractSection(analysisText, 'dharma|purpose') || getDefaultSpiritual(kundaliData).dharma,
        karmaLessons: extractSection(analysisText, 'karma|lesson') || getDefaultSpiritual(kundaliData).karmaLessons,
        spiritualPractices: extractListItems(analysisText, 'practice|meditation') || getDefaultSpiritual(kundaliData).spiritualPractices,
        lifeGoals: extractSection(analysisText, 'goal|ultimate') || getDefaultSpiritual(kundaliData).lifeGoals
      },
      timingPredictions: {
        currentPhase: extractSection(analysisText, 'current|phase') || getDefaultTiming(kundaliData).currentPhase,
        upcomingOpportunities: extractListItems(analysisText, 'opportunit|upcoming') || getDefaultTiming(kundaliData).upcomingOpportunities,
        challengesToWatch: extractListItems(analysisText, 'challenge|watch') || getDefaultTiming(kundaliData).challengesToWatch,
        auspiciousPeriods: extractListItems(analysisText, 'auspicious|favorable') || getDefaultTiming(kundaliData).auspiciousPeriods
      }
    };
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    return getFallbackAnalysis(kundaliData);
  }
}

function extractSection(text: string, pattern: string): string {
  const regex = new RegExp(`(${pattern})[^.]*[.!?]`, 'gi');
  const match = text.match(regex);
  return match ? match[0].trim() : '';
}

function extractListItems(text: string, pattern: string): string[] {
  const regex = new RegExp(`(${pattern})[^.]*[.!?]`, 'gi');
  const matches = text.match(regex);
  return matches ? matches.map(m => m.trim()) : [];
}

function getFallbackAnalysis(kundaliData: any): EnhancedKundaliAnalysis {
  return {
    detailedPersonality: getDefaultPersonality(kundaliData),
    careerGuidance: getDefaultCareer(kundaliData),
    relationshipInsights: getDefaultRelationships(kundaliData),
    healthPredictions: getDefaultHealth(kundaliData),
    spiritualPath: getDefaultSpiritual(kundaliData),
    timingPredictions: getDefaultTiming(kundaliData)
  };
}

function getDefaultPersonality(kundaliData: any) {
  const chart = kundaliData?.chart || kundaliData?.enhancedCalculations || {};
  const planets = chart?.planets || {};
  const ascendant = chart?.ascendant || chart?.lagna?.rashiName || 'Unknown';
  
  // Analyze Sun for core nature
  const sun = planets.SU || planets.Sun;
  const moon = planets.MO || planets.Moon;
  const mercury = planets.ME || planets.Mercury;
  const ascendantHouse = chart?.houses?.find((h: any) => h.number === 1);
  
  const sunHouse = sun?.house || 'unknown';
  const moonHouse = moon?.house || 'unknown';
  
  // Personality based on Sun position
  const sunPersonality = getSunPersonality(sunHouse, sun?.rashiName);
  const moonPersonality = getMoonPersonality(moonHouse, moon?.rashiName);
  const mercuryMind = getMercuryMind(mercury?.house, mercury?.rashiName);
  
  return {
    coreNature: `With ${ascendant} ascendant and Sun in ${sun?.rashiName || 'unknown sign'} (${sunHouse}th house), ${sunPersonality}. Your fundamental approach to life is shaped by ${getAscendantNature(ascendant)}.`,
    mentalTendencies: `Your Moon in ${moon?.rashiName || 'unknown sign'} (${moonHouse}th house) creates ${moonPersonality}. ${mercuryMind}`,
    emotionalPatterns: `Emotionally, you ${getEmotionalPattern(moonHouse, moon?.rashiName)}. Your reactions are ${getMoodPattern(moon?.rashiName)}.`,
    spiritualInclinations: `Your spiritual path is indicated by ${getJupiterInfluence(planets.JU || planets.Jupiter)} and ${getKetaInfluence(planets.KE || planets.Ketu)}.`
  };
}

function getSunPersonality(house: number | string, sign: string): string {
  const houseTraits: Record<string, string> = {
    '1': 'you have strong self-confidence and natural leadership qualities',
    '2': 'you value security and have a practical approach to wealth building',
    '3': 'you are communicative, brave, and enjoy taking initiatives',
    '4': 'you are emotionally driven and value home and family deeply',
    '5': 'you are creative, intelligent, and enjoy learning and teaching',
    '6': 'you are service-oriented and have strong problem-solving abilities',
    '7': 'you are partnership-focused and diplomatic in your approach',
    '8': 'you are interested in mysteries, research, and transformation',
    '9': 'you are philosophical, religious, and seek higher knowledge',
    '10': 'you are career-focused and have natural authority',
    '11': 'you are socially connected and goal-oriented',
    '12': 'you are spiritually inclined and enjoy solitude'
  };
  return houseTraits[house?.toString()] || 'you have unique leadership qualities';
}

function getMoonPersonality(house: number | string, sign: string): string {
  const moonTraits: Record<string, string> = {
    '1': 'emotional sensitivity and intuitive responses to life',
    '2': 'attachment to material security and family values',
    '3': 'changeable moods but courage in communication',
    '4': 'deep emotional connection to home and mother',
    '5': 'creative emotional expression and love for children',
    '6': 'service mentality with emotional involvement in daily work',
    '7': 'emotional dependence on partnerships and public approval',
    '8': 'intense emotional depth and interest in hidden matters',
    '9': 'emotional connection to religion, philosophy, and higher learning',
    '10': 'emotional investment in career and public reputation',
    '11': 'emotional fulfillment through friendships and social causes',
    '12': 'need for emotional privacy and spiritual contemplation'
  };
  return moonTraits[house?.toString()] || 'emotional complexity and depth';
}

function getMercuryMind(house: number | string, sign: string): string {
  const mercuryTraits: Record<string, string> = {
    '1': 'You think quickly and express yourself with confidence.',
    '2': 'Your thinking is practical and focused on material security.',
    '3': 'You have excellent communication skills and quick wit.',
    '4': 'Your mind is influenced by family traditions and emotional security.',
    '5': 'You think creatively and enjoy intellectual pursuits.',
    '6': 'Your thinking is analytical and detail-oriented.',
    '7': 'You think in terms of partnerships and seek mental harmony with others.',
    '8': 'Your mind is drawn to research, mysteries, and deep subjects.',
    '9': 'You think philosophically and seek higher knowledge.',
    '10': 'Your thinking is structured and focused on career achievements.',
    '11': 'You think progressively and enjoy group discussions.',
    '12': 'Your mind seeks solitude and spiritual understanding.'
  };
  return mercuryTraits[house?.toString()] || 'You have a unique way of processing information.';
}

function getAscendantNature(ascendant: string): string {
  const ascendantTraits: Record<string, string> = {
    'Aries': 'boldness, independence, and pioneering spirit',
    'Taurus': 'stability, patience, and practical determination',
    'Gemini': 'adaptability, curiosity, and communication skills',
    'Cancer': 'nurturing nature, emotional depth, and protective instincts',
    'Leo': 'confidence, creativity, and natural leadership',
    'Virgo': 'analytical mind, perfectionism, and service orientation',
    'Libra': 'diplomacy, balance-seeking, and aesthetic appreciation',
    'Scorpio': 'intensity, transformation, and investigative nature',
    'Sagittarius': 'optimism, philosophical thinking, and love of freedom',
    'Capricorn': 'ambition, discipline, and structured approach',
    'Aquarius': 'innovation, humanitarian ideals, and independent thinking',
    'Pisces': 'compassion, intuition, and spiritual sensitivity'
  };
  return ascendantTraits[ascendant] || 'unique personality traits';
}

function getEmotionalPattern(house: number | string, sign: string): string {
  if (house === '4') return 'feel most secure at home and with family';
  if (house === '7') return 'need emotional connection through partnerships';
  if (house === '10') return 'tie your emotions to your career and public image';
  if (house === '12') return 'need emotional privacy and spiritual connection';
  return 'have complex emotional patterns that influence your daily life';
}

function getMoodPattern(sign: string): string {
  const moodTraits: Record<string, string> = {
    'Aries': 'quick and direct',
    'Cancer': 'deeply felt and protective',
    'Libra': 'balanced and harmony-seeking',
    'Capricorn': 'controlled and structured',
    'Scorpio': 'intense and transformative',
    'Pisces': 'flowing and compassionate'
  };
  return moodTraits[sign] || 'uniquely influenced by your lunar nature';
}

function getJupiterInfluence(jupiter: any): string {
  if (!jupiter) return 'wisdom and higher learning';
  const house = jupiter.house;
  if (house === 1) return 'Jupiter in 1st house blessing you with wisdom and optimism';
  if (house === 5) return 'Jupiter in 5th house enhancing your creativity and spiritual learning';
  if (house === 9) return 'Jupiter in 9th house strengthening your religious and philosophical nature';
  if (house === 12) return 'Jupiter in 12th house inclining you toward spirituality and charitable service';
  return `Jupiter in ${house}th house guiding your spiritual growth through ${getHouseSignificance(house)}`;
}

function getKetaInfluence(ketu: any): string {
  if (!ketu) return 'past-life karma influences';
  const house = ketu.house;
  if (house === 1) return 'Ketu in 1st house creating spiritual detachment and unique personality';
  if (house === 12) return 'Ketu in 12th house strongly inclining you toward moksha and liberation';
  return `Ketu in ${house}th house creating spiritual lessons through ${getHouseSignificance(house)}`;
}

function getHouseSignificance(house: number): string {
  const significance: Record<number, string> = {
    1: 'self-development',
    2: 'family and wealth matters',
    3: 'communication and courage',
    4: 'home and emotional security',
    5: 'creativity and education',
    6: 'service and health',
    7: 'relationships and partnerships',
    8: 'transformation and research',
    9: 'higher learning and dharma',
    10: 'career and reputation',
    11: 'gains and social connections',
    12: 'spirituality and liberation'
  };
  return significance[house] || 'life experiences';
}

function getDefaultCareer(kundaliData: any) {
  const chart = kundaliData?.chart || kundaliData?.enhancedCalculations || {};
  const planets = chart?.planets || {};
  const houses = chart?.houses || [];
  
  // Analyze 10th house for career
  const tenthHouseLord = planets.SU || planets.Sun; // Simplified - should calculate actual 10th lord
  const jupiter = planets.JU || planets.Jupiter;
  const mercury = planets.ME || planets.Mercury;
  const mars = planets.MA || planets.Mars;
  const venus = planets.VE || planets.Venus;
  
  // Career based on planets in 10th house and 10th lord
  const careerPlanets = Object.values(planets).filter((p: any) => p.house === 10);
  const professions = getCareerByPlanets(careerPlanets, tenthHouseLord);
  
  return {
    idealProfessions: professions,
    businessAptitude: getBusinessAptitude(mars, jupiter, mercury),
    leadershipQualities: getLeadershipQualities(planets.SU || planets.Sun, mars),
    creativePotential: getCreativePotential(venus, mercury, jupiter)
  };
}

function getCareerByPlanets(careerPlanets: any[], tenthLord: any): string[] {
  const careers = [];
  
  careerPlanets.forEach((planet: any) => {
    switch (planet.name || planet.id) {
      case 'Sun':
      case 'SU':
        careers.push('Government service', 'Leadership roles', 'Administration', 'Politics');
        break;
      case 'Moon':
      case 'MO':
        careers.push('Healthcare', 'Hospitality', 'Public relations', 'Food industry');
        break;
      case 'Mars':
      case 'MA':
        careers.push('Engineering', 'Military', 'Sports', 'Real estate', 'Surgery');
        break;
      case 'Mercury':
      case 'ME':
        careers.push('Communication', 'Writing', 'Teaching', 'Business', 'Technology');
        break;
      case 'Jupiter':
      case 'JU':
        careers.push('Teaching', 'Law', 'Finance', 'Counseling', 'Religious work');
        break;
      case 'Venus':
      case 'VE':
        careers.push('Arts', 'Entertainment', 'Beauty industry', 'Fashion', 'Luxury goods');
        break;
      case 'Saturn':
      case 'SA':
        careers.push('Mining', 'Construction', 'Agriculture', 'Research', 'Social work');
        break;
    }
  });
  
  return careers.length > 0 ? careers.slice(0, 5) : ['Professional services', 'Management', 'Consulting'];
}

function getBusinessAptitude(mars: any, jupiter: any, mercury: any): string {
  let score = 0;
  let details = [];
  
  if (mars?.house === 10 || mars?.house === 11) {
    score += 30;
    details.push('Mars gives initiative and competitive spirit');
  }
  if (jupiter?.house === 2 || jupiter?.house === 11) {
    score += 25;
    details.push('Jupiter brings wisdom in financial matters');
  }
  if (mercury?.house === 3 || mercury?.house === 10) {
    score += 20;
    details.push('Mercury enhances business communication skills');
  }
  
  if (score >= 50) return `Excellent business aptitude (${score}%). ${details.join('. ')}.`;
  if (score >= 30) return `Good business potential (${score}%). ${details.join('. ')}.`;
  return `Moderate business aptitude. Focus on developing entrepreneurial skills through experience.`;
}

function getLeadershipQualities(sun: any, mars: any): string {
  const qualities = [];
  
  if (sun?.house === 1) qualities.push('natural authority and self-confidence');
  if (sun?.house === 10) qualities.push('career leadership and public recognition');
  if (mars?.house === 1) qualities.push('courage and pioneering spirit');
  if (mars?.house === 10) qualities.push('executive abilities and decisive action');
  
  return qualities.length > 0 
    ? `Strong leadership indicated through ${qualities.join(', ')}`
    : 'Leadership potential present but needs development through experience';
}

function getCreativePotential(venus: any, mercury: any, jupiter: any): string {
  const creative = [];
  
  if (venus?.house === 5) creative.push('artistic expression and aesthetic sense');
  if (mercury?.house === 5) creative.push('creative writing and communication');
  if (jupiter?.house === 5) creative.push('wisdom-based creativity and teaching ability');
  
  return creative.length > 0 
    ? `High creative potential in ${creative.join(', ')}`
    : 'Creative abilities present in unique forms suited to your chart';
}

function getDefaultRelationships(kundaliData: any) {
  const chart = kundaliData?.chart || kundaliData?.enhancedCalculations || {};
  const planets = chart?.planets || {};
  
  // Analyze 7th house and Venus for relationships
  const venus = planets.VE || planets.Venus;
  const mars = planets.MA || planets.Mars;
  const jupiter = planets.JU || planets.Jupiter;
  const mercury = planets.ME || planets.Mercury;
  const seventhHousePlanets = Object.values(planets).filter((p: any) => p.house === 7);
  
  return {
    marriageTimings: getMarriageTiming(venus, jupiter, seventhHousePlanets),
    partnerQualities: getPartnerQualities(venus, seventhHousePlanets),
    familyLife: getFamilyLife(planets.MO || planets.Moon, jupiter),
    friendshipPatterns: getFriendshipPatterns(mercury, venus)
  };
}

function getMarriageTiming(venus: any, jupiter: any, seventhHousePlanets: any[]): string {
  let timing = [];
  
  if (venus?.house === 7) timing.push('Venus in 7th house indicates marriage in mid-twenties');
  if (jupiter?.house === 7) timing.push('Jupiter in 7th house suggests marriage in late twenties');
  if (seventhHousePlanets.some((p: any) => p.name === 'Sun' || p.id === 'SU')) {
    timing.push('Sun in 7th house may delay marriage slightly but brings stable partnership');
  }
  
  return timing.length > 0 
    ? timing.join('. ') 
    : 'Marriage timing indicates traditional age ranges with focus on compatibility';
}

function getPartnerQualities(venus: any, seventhHousePlanets: any[]): string {
  const qualities = [];
  
  if (venus?.house === 1) qualities.push('beautiful, artistic, and charming partner');
  if (venus?.house === 7) qualities.push('harmonious, diplomatic partner who values beauty');
  if (venus?.house === 10) qualities.push('successful, career-oriented partner');
  
  seventhHousePlanets.forEach((planet: any) => {
    switch (planet.name || planet.id) {
      case 'Jupiter':
      case 'JU':
        qualities.push('wise, spiritual, and well-educated partner');
        break;
      case 'Mars':
      case 'MA':
        qualities.push('energetic, independent, and protective partner');
        break;
      case 'Mercury':
      case 'ME':
        qualities.push('intelligent, communicative, and business-minded partner');
        break;
    }
  });
  
  return qualities.length > 0 
    ? `Partner will be ${qualities.join(', ')}`
    : 'Partner will complement your nature and support your life journey';
}

function getFamilyLife(moon: any, jupiter: any): string {
  const aspects = [];
  
  if (moon?.house === 4) aspects.push('strong emotional bond with mother and home');
  if (jupiter?.house === 4) aspects.push('blessing and wisdom in family matters');
  if (moon?.house === 2) aspects.push('family wealth and emotional security through family');
  
  return aspects.length > 0 
    ? `Family life blessed with ${aspects.join(', ')}`
    : 'Generally supportive family environment with mutual care and respect';
}

function getFriendshipPatterns(mercury: any, venus: any): string {
  const patterns = [];
  
  if (mercury?.house === 11) patterns.push('wide social circle through communication');
  if (venus?.house === 11) patterns.push('friendships through artistic and social activities');
  if (mercury?.house === 3) patterns.push('close friendships with siblings and neighbors');
  
  return patterns.length > 0 
    ? `Friendship patterns show ${patterns.join(', ')}`
    : 'Selective in friendships but deeply loyal to chosen companions';
}

function getDefaultHealth(kundaliData: any) {
  const chart = kundaliData?.chart || kundaliData?.enhancedCalculations || {};
  const planets = chart?.planets || {};
  
  // Analyze 6th house, Mars, Saturn for health
  const mars = planets.MA || planets.Mars;
  const saturn = planets.SA || planets.Saturn;
  const sun = planets.SU || planets.Sun;
  const moon = planets.MO || planets.Moon;
  const mercury = planets.ME || planets.Mercury;
  const sixthHousePlanets = Object.values(planets).filter((p: any) => p.house === 6);
  const eighthHousePlanets = Object.values(planets).filter((p: any) => p.house === 8);
  
  return {
    generalHealth: getGeneralHealth(sun, mars, saturn),
    vulnerableAreas: getVulnerableAreas(sixthHousePlanets, eighthHousePlanets, saturn, mars, moon),
    preventiveMeasures: getPreventiveMeasures(mars, saturn, moon),
    mentalWellbeing: getMentalWellbeing(moon, mercury)
  };
}

function getGeneralHealth(sun: any, mars: any, saturn: any): string {
  const factors = [];
  
  if (sun?.house === 1) factors.push('strong vitality and good immunity');
  if (mars?.house === 1) factors.push('good physical energy and strength');
  if (saturn?.house === 6) factors.push('ability to overcome chronic health issues');
  if (mars?.house === 8) factors.push('need for caution in physical activities');
  
  return factors.length > 0 
    ? `Health constitution shows ${factors.join(', ')}`
    : 'Generally balanced health constitution requiring regular lifestyle maintenance';
}

function getVulnerableAreas(sixthHouse: any[], eighthHouse: any[], saturn: any): string[] {
  const areas = [];
  
  if (saturn?.house === 1) areas.push('Bone and joint health');
  if (saturn?.house === 6) areas.push('Chronic digestive issues');
  if (mars?.house === 6) areas.push('Inflammatory conditions');
  if (moon?.house === 6) areas.push('Emotional eating patterns');
  
  sixthHouse.forEach((planet: any) => {
    switch (planet.name || planet.id) {
      case 'Sun':
      case 'SU':
        areas.push('Heart and circulation');
        break;
      case 'Moon':
      case 'MO':
        areas.push('Digestive system and emotional health');
        break;
      case 'Saturn':
      case 'SA':
        areas.push('Chronic conditions and immunity');
        break;
    }
  });
  
  return areas.length > 0 ? areas : ['Stress-related concerns', 'Lifestyle-related issues'];
}

function getPreventiveMeasures(mars: any, saturn: any, moon: any): string[] {
  const measures = ['Regular health checkups', 'Balanced nutrition'];
  
  if (mars?.house === 6 || mars?.house === 8) {
    measures.push('Avoid aggressive physical activities', 'Anti-inflammatory diet');
  }
  if (saturn?.house === 1 || saturn?.house === 6) {
    measures.push('Bone health supplements', 'Regular physiotherapy');
  }
  if (moon?.house === 6) {
    measures.push('Emotional wellness practices', 'Digestive health care');
  }
  
  return measures;
}

function getMentalWellbeing(moon: any, mercury: any): string {
  const factors = [];
  
  if (moon?.house === 1) factors.push('emotional sensitivity requires mindfulness');
  if (moon?.house === 12) factors.push('natural inclination toward meditation');
  if (mercury?.house === 12) factors.push('mental peace through spiritual study');
  
  return factors.length > 0 
    ? `Mental wellbeing supported by ${factors.join(', ')}`
    : 'Mental health maintained through balanced lifestyle and spiritual practices';
}

function getDefaultSpiritual(kundaliData: any) {
  const chart = kundaliData?.chart || kundaliData?.enhancedCalculations || {};
  const planets = chart?.planets || {};
  
  // Analyze 9th, 12th houses, Jupiter, Ketu for spirituality
  const jupiter = planets.JU || planets.Jupiter;
  const ketu = planets.KE || planets.Ketu;
  const sun = planets.SU || planets.Sun;
  const ninthHousePlanets = Object.values(planets).filter((p: any) => p.house === 9);
  const twelfthHousePlanets = Object.values(planets).filter((p: any) => p.house === 12);
  
  return {
    dharma: getDharmaPath(jupiter, sun, ninthHousePlanets),
    karmaLessons: getKarmaLessons(ketu, saturn),
    spiritualPractices: getSpiritualPractices(jupiter, ketu, twelfthHousePlanets),
    lifeGoals: getLifeGoals(jupiter, sun, chart?.ascendant)
  };
}

function getDharmaPath(jupiter: any, sun: any, ninthHouse: any[]): string {
  if (jupiter?.house === 9) return 'Your dharma involves teaching, guiding others, and spreading wisdom';
  if (sun?.house === 9) return 'Your dharma is to lead by example and inspire others toward higher values';
  if (jupiter?.house === 10) return 'Your dharma is fulfilled through professional service and ethical leadership';
  
  return 'Your life purpose involves serving others while pursuing personal spiritual growth';
}

function getKarmaLessons(ketu: any, saturn: any): string {
  const lessons = [];
  
  if (ketu?.house === 1) lessons.push('learning detachment from ego and self-importance');
  if (ketu?.house === 7) lessons.push('understanding true partnership beyond attachment');
  if (saturn?.house === 1) lessons.push('developing patience and self-discipline');
  if (saturn?.house === 10) lessons.push('learning responsibility and service in career');
  
  return lessons.length > 0 
    ? `Key karma lessons include ${lessons.join(', ')}`
    : 'Learning balance between material duties and spiritual aspirations';
}

function getSpiritualPractices(jupiter: any, ketu: any, twelfthHouse: any[]): string[] {
  const practices = ['Meditation', 'Prayer'];
  
  if (jupiter?.house === 12) practices.push('Charitable service', 'Study of scriptures');
  if (ketu?.house === 12) practices.push('Detached service', 'Silent meditation');
  if (twelfthHouse.some((p: any) => p.name === 'Venus' || p.id === 'VE')) {
    practices.push('Devotional music', 'Artistic meditation');
  }
  
  return practices;
}

function getLifeGoals(jupiter: any, sun: any, ascendant: string): string {
  if (jupiter?.house === 12) return 'Ultimate goal of spiritual liberation and service to humanity';
  if (sun?.house === 12) return 'Achievement of self-realization through surrender and service';
  if (ascendant === 'Pisces') return 'Spiritual evolution through compassion and universal love';
  
  return 'Balance between material success and spiritual fulfillment leading to inner peace';
}

function getDefaultTiming(kundaliData: any) {
  const chart = kundaliData?.chart || kundaliData?.enhancedCalculations || {};
  const planets = chart?.planets || {};
  const dashas = chart?.dashas || chart?.dashaPeriods || [];
  const currentDasha = dashas.find((d: any) => d.isActive);
  
  return {
    currentPhase: getCurrentPhaseAnalysis(currentDasha, planets),
    upcomingOpportunities: getUpcomingOpportunities(currentDasha, planets),
    challengesToWatch: getChallengesToWatch(currentDasha, planets),
    auspiciousPeriods: getAuspiciousPeriods(currentDasha, planets)
  };
}

function getCurrentPhaseAnalysis(dasha: any, planets: any): string {
  if (!dasha) return 'Currently in a transitional period requiring patience and preparation';
  
  const dashaLord = dasha.planet || dasha.planetSanskrit;
  const planetData = planets[dashaLord] || planets[dashaLord?.toUpperCase()];
  
  if (dashaLord === 'Jupiter' || dashaLord === 'JU') {
    return 'Jupiter period brings wisdom, learning opportunities, and spiritual growth';
  }
  if (dashaLord === 'Venus' || dashaLord === 'VE') {
    return 'Venus period enhances creativity, relationships, and material comforts';
  }
  if (dashaLord === 'Sun' || dashaLord === 'SU') {
    return 'Sun period focuses on leadership, recognition, and personal authority';
  }
  if (dashaLord === 'Mars' || dashaLord === 'MA') {
    return 'Mars period brings energy, initiative, and opportunities for bold action';
  }
  
  return `Currently in ${dashaLord} period, bringing its unique energies and life lessons`;
}

function getUpcomingOpportunities(dasha: any, planets: any): string[] {
  if (!dasha) return ['Personal development', 'New beginnings', 'Skill enhancement'];
  
  const dashaLord = dasha.planet || dasha.planetSanskrit;
  
  if (dashaLord === 'Jupiter' || dashaLord === 'JU') {
    return ['Higher education opportunities', 'Teaching or mentoring roles', 'Spiritual advancement', 'Legal or advisory positions'];
  }
  if (dashaLord === 'Venus' || dashaLord === 'VE') {
    return ['Artistic projects', 'Relationship developments', 'Luxury purchases', 'Beauty or fashion ventures'];
  }
  if (dashaLord === 'Mercury' || dashaLord === 'ME') {
    return ['Communication projects', 'Business ventures', 'Educational pursuits', 'Technology investments'];
  }
  
  return ['Career advancement', 'Personal growth', 'New relationships'];
}

function getChallengesToWatch(dasha: any, planets: any): string[] {
  if (!dasha) return ['Health considerations', 'Financial planning', 'Relationship balance'];
  
  const dashaLord = dasha.planet || dasha.planetSanskrit;
  
  if (dashaLord === 'Saturn' || dashaLord === 'SA') {
    return ['Delays in projects', 'Health issues', 'Increased responsibilities', 'Patience requirements'];
  }
  if (dashaLord === 'Mars' || dashaLord === 'MA') {
    return ['Aggressive reactions', 'Conflicts', 'Hasty decisions', 'Accident-prone periods'];
  }
  if (dashaLord === 'Rahu' || dashaLord === 'RA') {
    return ['Confusing situations', 'Foreign complications', 'Over-ambition', 'Unconventional challenges'];
  }
  
  return ['Maintaining balance', 'Avoiding extremes', 'Health awareness'];
}

function getAuspiciousPeriods(dasha: any, planets: any): string[] {
  const periods = ['Your birthday period', 'Festival seasons'];
  
  if (dasha) {
    const dashaLord = dasha.planet || dasha.planetSanskrit;
    
    if (dashaLord === 'Jupiter' || dashaLord === 'JU') {
      periods.push('Thursday periods', 'Guru Purnima', 'Educational milestone dates');
    }
    if (dashaLord === 'Venus' || dashaLord === 'VE') {
      periods.push('Friday periods', 'Spring season', 'Artistic events');
    }
    if (dashaLord === 'Sun' || dashaLord === 'SU') {
      periods.push('Sunday periods', 'Summer solstice', 'Leadership opportunities');
    }
  }
  
  return periods;
}

export type { EnhancedKundaliAnalysis };
