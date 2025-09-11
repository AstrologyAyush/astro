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

export interface EnhancedKundaliAnalysis {
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

import { supabase } from '@/integrations/supabase/client';
import { FunctionsHttpError } from '@supabase/supabase-js';

export async function getGeminiKundaliAnalysis(kundaliData: any): Promise<EnhancedKundaliAnalysis> {
  console.log('🚀 Starting Gemini Kundali Analysis...');
  
  try {
    console.log('📡 Calling Supabase Edge Function...');
    const { data, error } = await supabase.functions.invoke('gemini-kundali-analysis', {
      body: { kundaliData }
    });

    console.log('📥 Edge function response:', { data, error });

    if (error) {
      console.error('❌ Error calling Gemini analysis function:', error);
      if (error instanceof FunctionsHttpError) {
        try {
          const errorJson = await error.context.json();
          if (errorJson.error === 'GEMINI_API_KEY_NOT_CONFIGURED') {
            throw new Error(errorJson.message);
          }
        } catch (e) {
          // Ignore parsing error, throw original error
        }
      }
      throw new Error(`Edge function error: ${error.message}`);
    }

    if (data?.analysis) {
      console.log('✅ Successfully received analysis from Gemini');
      return data.analysis;
    }

    if (data?.error) {
      console.error('❌ Gemini API error:', data.error);
      throw new Error(`Gemini API error: ${data.error}`);
    }

    console.warn('⚠️ No analysis received, using fallback');
    return getFallbackAnalysis(kundaliData);
    
  } catch (error) {
    console.error('💥 Error in getGeminiKundaliAnalysis:', error);
    if (error.message.includes('Please set the GEMINI_API_KEY')) {
      throw error;
    }
    // Return fallback analysis instead of throwing for other errors
    return getFallbackAnalysis(kundaliData);
  }
}

function getFallbackAnalysis(kundaliData: any): EnhancedKundaliAnalysis {
  console.log('🔄 Generating fallback analysis...');
  
  // Extract key data points for personalized fallback
  const chart = kundaliData?.chart || kundaliData?.enhancedCalculations || {};
  const planets = chart?.planets || {};
  const ascendant = chart?.ascendant || chart?.lagna?.rashiName || 'Unknown';
  const birthData = kundaliData?.birthData || {};
  
  // Get strongest and weakest planets
  const planetStrengths = Object.values(planets).map((planet: any) => ({
    name: planet.name || planet.id,
    strength: planet.strength || 50,
    house: planet.house,
    rashiName: planet.rashiName
  })).sort((a, b) => b.strength - a.strength);
  
  const strongestPlanet = planetStrengths[0];
  const weakestPlanet = planetStrengths[planetStrengths.length - 1];
  
  // Get current dasha
  const dashas = chart?.dashas || chart?.dashaPeriods || [];
  const currentDasha = dashas.find((d: any) => d.isActive) || dashas[0];
  
  return {
    detailedPersonality: {
      coreNature: `With ${ascendant} ascendant, you have a ${getAscendantPersonality(ascendant)} nature. Your strongest planet ${strongestPlanet?.name || 'Sun'} in ${strongestPlanet?.rashiName || 'unknown sign'} (${strongestPlanet?.house || 'unknown'}th house) gives you ${getPlanetStrength(strongestPlanet?.name || 'Sun', strongestPlanet?.house || 1)}.`,
      
      mentalTendencies: `Your mind is influenced by ${planets.MO?.rashiName || planets.Moon?.rashiName || 'lunar placement'} Moon in ${planets.MO?.house || planets.Moon?.house || 'unknown'}th house, creating ${getMoonPersonality(planets.MO?.house || planets.Moon?.house || 1, planets.MO?.rashiName || planets.Moon?.rashiName || 'Cancer')}. Mercury in ${planets.ME?.rashiName || planets.Mercury?.rashiName || 'unknown sign'} influences your communication style.`,
      
      emotionalPatterns: `Your emotional nature is shaped by Moon's position, showing ${getEmotionalPattern(planets.MO?.house || planets.Moon?.house || 4)}. You tend to ${getMoodPattern(planets.MO?.rashiName || planets.Moon?.rashiName || 'Cancer')}.`,
      
      spiritualInclinations: `Your spiritual path is guided by Jupiter in ${planets.JU?.rashiName || planets.Jupiter?.rashiName || 'unknown sign'} (${planets.JU?.house || planets.Jupiter?.house || 'unknown'}th house) and Ketu in ${planets.KE?.rashiName || planets.Ketu?.rashiName || 'unknown sign'}, indicating ${getSpiritualPath(planets.JU?.house || planets.Jupiter?.house || 9)}.`
    },
    
    careerGuidance: {
      idealProfessions: getCareerSuggestions(planets.SU?.house || planets.Sun?.house || 10, strongestPlanet?.name || 'Sun'),
      businessAptitude: getBusinessAptitude(planets.MA?.house || planets.Mars?.house, planets.JU?.house || planets.Jupiter?.house),
      leadershipQualities: getLeadershipQualities(planets.SU?.house || planets.Sun?.house, strongestPlanet?.name),
      creativePotential: getCreativePotential(planets.VE?.house || planets.Venus?.house, planets.ME?.house || planets.Mercury?.house)
    },
    
    relationshipInsights: {
      marriageTimings: getMarriageTiming(planets.VE?.house || planets.Venus?.house, planets.JU?.house || planets.Jupiter?.house),
      partnerQualities: getPartnerQualities(planets.VE?.rashiName || planets.Venus?.rashiName, planets.VE?.house || planets.Venus?.house),
      familyLife: getFamilyLife(planets.MO?.house || planets.Moon?.house, planets.JU?.house || planets.Jupiter?.house),
      friendshipPatterns: getFriendshipPatterns(planets.ME?.house || planets.Mercury?.house)
    },
    
    healthPredictions: {
      generalHealth: getHealthPrediction(ascendant, weakestPlanet?.name),
      vulnerableAreas: getVulnerableAreas(weakestPlanet?.house, planets.SA?.house || planets.Saturn?.house),
      preventiveMeasures: getPreventiveMeasures(weakestPlanet?.name, ascendant),
      mentalWellbeing: getMentalWellbeing(planets.MO?.house || planets.Moon?.house, planets.ME?.house || planets.Mercury?.house)
    },
    
    spiritualPath: {
      dharma: getDharmaPath(planets.JU?.house || planets.Jupiter?.house, planets.SU?.house || planets.Sun?.house),
      karmaLessons: getKarmaLessons(planets.KE?.house || planets.Ketu?.house, planets.SA?.house || planets.Saturn?.house),
      spiritualPractices: getSpiritualPractices(planets.JU?.house || planets.Jupiter?.house, planets.KE?.house || planets.Ketu?.house),
      lifeGoals: getLifeGoals(ascendant, planets.JU?.house || planets.Jupiter?.house)
    },
    
    timingPredictions: {
      currentPhase: getCurrentPhase(currentDasha?.planet || 'Jupiter', new Date().getFullYear() - (birthData.year || 2000)),
      upcomingOpportunities: getUpcomingOpportunities(currentDasha?.planet || 'Jupiter'),
      challengesToWatch: getChallengesToWatch(weakestPlanet?.name || 'Saturn', currentDasha?.planet),
      auspiciousPeriods: getAuspiciousPeriods(strongestPlanet?.name || 'Jupiter', currentDasha?.planet)
    }
  };
}

// Helper functions for personalized analysis
function getAscendantPersonality(ascendant: string): string {
  const personalities: Record<string, string> = {
    'Aries': 'dynamic, energetic, and pioneering',
    'Taurus': 'stable, practical, and determined',
    'Gemini': 'curious, adaptable, and communicative',
    'Cancer': 'nurturing, intuitive, and emotional',
    'Leo': 'confident, creative, and leadership-oriented',
    'Virgo': 'analytical, perfectionist, and service-minded',
    'Libra': 'diplomatic, harmonious, and aesthetically inclined',
    'Scorpio': 'intense, transformative, and mysterious',
    'Sagittarius': 'philosophical, adventurous, and optimistic',
    'Capricorn': 'ambitious, disciplined, and responsible',
    'Aquarius': 'innovative, humanitarian, and independent',
    'Pisces': 'compassionate, intuitive, and spiritually inclined'
  };
  return personalities[ascendant] || 'uniquely balanced';
}

function getPlanetStrength(planet: string, house: number): string {
  const effects: Record<string, Record<number, string>> = {
    'Sun': {
      1: 'strong leadership abilities and commanding presence',
      10: 'career success and authority in professional life',
      5: 'creativity and intelligence in self-expression',
      9: 'wisdom and philosophical nature'
    },
    'Moon': {
      1: 'emotional sensitivity and intuitive nature',
      4: 'strong connection to home and mother',
      7: 'emotional needs in partnerships',
      10: 'public recognition and emotional fulfillment through career'
    },
    'Mars': {
      1: 'courage, energy, and pioneering spirit',
      10: 'drive for success and competitive nature',
      3: 'courage and initiative in communication',
      6: 'ability to overcome obstacles and enemies'
    }
  };
  return effects[planet]?.[house] || 'positive influence in life areas';
}

function getMoonPersonality(house: number, sign: string): string {
  const moonHouses: Record<number, string> = {
    1: 'emotional responsiveness and changing moods',
    2: 'emotional attachment to family and material security',
    3: 'emotional courage and protective nature towards siblings',
    4: 'deep emotional connection to home and heritage',
    5: 'emotional creativity and love for children',
    6: 'emotional involvement in daily work and health matters',
    7: 'emotional dependence on partnerships',
    8: 'intense emotional depth and interest in mysteries',
    9: 'emotional connection to higher wisdom and spirituality',
    10: 'emotional investment in career and public image',
    11: 'emotional fulfillment through friendships and goals',
    12: 'need for emotional solitude and spiritual practices'
  };
  return moonHouses[house] || 'complex emotional patterns';
}

function getEmotionalPattern(house: number): string {
  const patterns: Record<number, string> = {
    1: 'you express emotions directly and openly',
    4: 'you seek emotional security through family and home',
    7: 'you need emotional validation through relationships',
    10: 'you connect emotions with your public image and career',
    12: 'you prefer emotional privacy and introspection'
  };
  return patterns[house] || 'you have unique emotional responses';
}

function getMoodPattern(sign: string): string {
  const moods: Record<string, string> = {
    'Aries': 'react quickly and directly to emotional stimuli',
    'Cancer': 'have deep, nurturing emotional responses',
    'Libra': 'seek emotional balance and harmony',
    'Capricorn': 'maintain emotional control and practicality',
    'Scorpio': 'experience intense and transformative emotions',
    'Pisces': 'have flowing, compassionate emotional nature'
  };
  return moods[sign] || 'have complex emotional patterns';
}

function getCareerSuggestions(sunHouse: number, strongestPlanet: string): string[] {
  const careerMap: Record<string, string[]> = {
    'Sun': ['Government service', 'Leadership roles', 'Administration', 'Politics', 'Management'],
    'Moon': ['Healthcare', 'Hospitality', 'Public relations', 'Food industry', 'Psychology'],
    'Mars': ['Engineering', 'Military', 'Sports', 'Real estate', 'Surgery', 'Police'],
    'Mercury': ['Communication', 'Writing', 'Teaching', 'Business', 'Technology', 'Media'],
    'Jupiter': ['Teaching', 'Law', 'Finance', 'Counseling', 'Religious work', 'Academia'],
    'Venus': ['Arts', 'Entertainment', 'Beauty industry', 'Fashion', 'Luxury goods', 'Design'],
    'Saturn': ['Mining', 'Construction', 'Agriculture', 'Research', 'Social work', 'Administration']
  };
  
  const houseCareer: Record<number, string[]> = {
    10: ['Executive positions', 'Public service', 'Authority roles'],
    6: ['Service industry', 'Healthcare', 'Problem-solving roles'],
    2: ['Finance', 'Banking', 'Family business'],
    11: ['Social work', 'Network marketing', 'Large organizations']
  };
  
  const careers = careerMap[strongestPlanet] || ['Professional services'];
  const houseCareers = houseCareer[sunHouse] || [];
  
  return [...new Set([...careers.slice(0, 3), ...houseCareers.slice(0, 2)])];
}

function getBusinessAptitude(marsHouse?: number, jupiterHouse?: number): string {
  let score = 50;
  let factors = [];
  
  if (marsHouse === 10 || marsHouse === 11) {
    score += 25;
    factors.push('Mars gives drive and competitive spirit');
  }
  if (jupiterHouse === 2 || jupiterHouse === 11) {
    score += 20;
    factors.push('Jupiter brings wisdom in financial matters');
  }
  
  if (score >= 70) return `Excellent business potential (${score}%). ${factors.join('. ')}.`;
  if (score >= 50) return `Good business aptitude (${score}%). ${factors.join('. ')}.`;
  return 'Moderate business potential. Consider partnerships or gradual business development.';
}

function getLeadershipQualities(sunHouse?: number, strongestPlanet?: string): string {
  const qualities = [];
  
  if (sunHouse === 1) qualities.push('natural authority and charisma');
  if (sunHouse === 10) qualities.push('career leadership and public recognition');
  if (strongestPlanet === 'Mars') qualities.push('courage and decisive action');
  if (strongestPlanet === 'Jupiter') qualities.push('wisdom-based leadership');
  
  return qualities.length > 0 
    ? `Strong leadership indicated through ${qualities.join(', ')}`
    : 'Leadership potential exists but needs development through experience';
}

function getCreativePotential(venusHouse?: number, mercuryHouse?: number): string {
  const creative = [];
  
  if (venusHouse === 5) creative.push('artistic expression and aesthetic sense');
  if (venusHouse === 1) creative.push('personal creative magnetism');
  if (mercuryHouse === 5) creative.push('creative communication and writing');
  if (mercuryHouse === 3) creative.push('innovative thinking and expression');
  
  return creative.length > 0 
    ? `High creative potential in ${creative.join(', ')}`
    : 'Creative abilities present in unique forms suited to your nature';
}

function getMarriageTiming(venusHouse?: number, jupiterHouse?: number): string {
  const timings = [];
  
  if (venusHouse === 7) timings.push('Venus in 7th house suggests marriage in mid-twenties');
  if (jupiterHouse === 7) timings.push('Jupiter in 7th house indicates marriage after 25');
  if (venusHouse === 1) timings.push('Early attraction but marriage after personal development');
  
  return timings.length > 0 
    ? timings.join('. ')
    : 'Marriage timing indicates traditional patterns with focus on compatibility';
}

function getPartnerQualities(venusSign?: string, venusHouse?: number): string {
  const qualities = [];
  
  if (venusHouse === 7) qualities.push('harmonious, diplomatic partner');
  if (venusHouse === 10) qualities.push('successful, career-oriented partner');
  if (venusSign === 'Libra') qualities.push('balanced, aesthetically inclined partner');
  if (venusSign === 'Taurus') qualities.push('stable, materially secure partner');
  
  return qualities.length > 0 
    ? `Partner will be ${qualities.join(', ')}`
    : 'Partner will complement your nature and support your growth';
}

function getFamilyLife(moonHouse?: number, jupiterHouse?: number): string {
  const aspects = [];
  
  if (moonHouse === 4) aspects.push('strong emotional bond with mother and family heritage');
  if (jupiterHouse === 4) aspects.push('blessings and wisdom in family matters');
  if (moonHouse === 2) aspects.push('emotional and financial security through family');
  
  return aspects.length > 0 
    ? `Family life blessed with ${aspects.join(', ')}`
    : 'Generally harmonious family relationships with mutual support';
}

function getFriendshipPatterns(mercuryHouse?: number): string {
  const patterns: Record<number, string> = {
    11: 'wide social circle and many acquaintances',
    3: 'close friendships with intellectual connections',
    7: 'partnerships that develop into friendships',
    5: 'friendships through creative and educational activities'
  };
  
  return patterns[mercuryHouse || 11] || 'selective but loyal friendships';
}

function getHealthPrediction(ascendant: string, weakestPlanet?: string): string {
  const constitution: Record<string, string> = {
    'Aries': 'strong physical energy but prone to headaches and stress',
    'Taurus': 'robust constitution but watch throat and weight issues',
    'Gemini': 'nervous energy requiring mental stimulation and rest',
    'Cancer': 'sensitive digestive system needing emotional balance',
    'Leo': 'strong vitality but watch heart and spine health',
    'Virgo': 'detailed health awareness with digestive sensitivities'
  };
  
  const base = constitution[ascendant] || 'balanced constitution requiring regular care';
  const weakness = weakestPlanet ? ` Special attention needed for ${weakestPlanet}-related health areas.` : '';
  
  return base + weakness;
}

function getVulnerableAreas(weakestHouse?: number, saturnHouse?: number): string[] {
  const areas = ['Stress management', 'Regular health checkups'];
  
  if (saturnHouse === 1) areas.push('Bone and joint health');
  if (saturnHouse === 6) areas.push('Chronic health patterns');
  if (weakestHouse === 6) areas.push('Digestive health');
  if (weakestHouse === 8) areas.push('Immunity and vitality');
  
  return areas;
}

function getPreventiveMeasures(weakestPlanet?: string, ascendant?: string): string[] {
  const measures = ['Regular exercise', 'Balanced nutrition', 'Adequate rest'];
  
  if (weakestPlanet === 'Saturn') measures.push('Bone health supplements', 'Regular massage');
  if (weakestPlanet === 'Mars') measures.push('Avoid inflammatory foods', 'Cooling practices');
  if (ascendant === 'Cancer') measures.push('Emotional wellness practices', 'Digestive care');
  
  return measures;
}

function getMentalWellbeing(moonHouse?: number, mercuryHouse?: number): string {
  const factors = [];
  
  if (moonHouse === 12) factors.push('natural inclination toward meditation and solitude');
  if (mercuryHouse === 12) factors.push('mental peace through spiritual study');
  if (moonHouse === 1) factors.push('emotional awareness and mindfulness practices');
  
  return factors.length > 0 
    ? `Mental wellbeing supported by ${factors.join(', ')}`
    : 'Mental health maintained through balanced lifestyle and stress management';
}

function getSpiritualPath(jupiterHouse?: number): string {
  const paths: Record<number, string> = {
    9: 'traditional religious or philosophical study',
    12: 'meditation, contemplation, and charitable service',
    1: 'personal spiritual development and self-realization',
    5: 'creative spiritual expression and wisdom sharing'
  };
  
  return paths[jupiterHouse || 9] || 'balanced spiritual growth through life experience';
}

function getDharmaPath(jupiterHouse?: number, sunHouse?: number): string {
  if (jupiterHouse === 9) return 'Your dharma involves teaching, guiding others, and spreading wisdom';
  if (sunHouse === 10) return 'Your dharma is fulfilled through leadership and professional service';
  if (jupiterHouse === 12) return 'Your life purpose involves spiritual service and helping others';
  
  return 'Your dharma unfolds through serving others while pursuing personal growth';
}

function getKarmaLessons(ketuHouse?: number, saturnHouse?: number): string {
  const lessons = [];
  
  if (ketuHouse === 1) lessons.push('learning detachment from ego');
  if (ketuHouse === 7) lessons.push('understanding true partnership beyond attachment');
  if (saturnHouse === 10) lessons.push('developing patience and responsibility in career');
  
  return lessons.length > 0 
    ? `Key lessons include ${lessons.join(', ')}`
    : 'Learning balance between material duties and spiritual growth';
}

function getSpiritualPractices(jupiterHouse?: number, ketuHouse?: number): string[] {
  const practices = ['Meditation', 'Prayer', 'Study of wisdom texts'];
  
  if (jupiterHouse === 12) practices.push('Charitable service', 'Pilgrimage');
  if (ketuHouse === 12) practices.push('Silent meditation', 'Detached service');
  if (jupiterHouse === 9) practices.push('Religious study', 'Teaching others');
  
  return practices;
}

function getLifeGoals(ascendant?: string, jupiterHouse?: number): string {
  if (jupiterHouse === 12) return 'Ultimate goal of spiritual liberation and universal service';
  if (ascendant === 'Pisces') return 'Spiritual evolution through compassion and artistic expression';
  if (ascendant === 'Capricorn') return 'Achievement through disciplined effort leading to wisdom';
  
  return 'Balance between material success and spiritual fulfillment';
}

function getCurrentPhase(dashaLord?: string, age?: number): string {
  const ageGroup = age && age < 25 ? 'young' : age && age < 45 ? 'middle' : 'mature';
  
  if (dashaLord === 'Jupiter') return `Currently in Jupiter period - a time of wisdom, growth, and spiritual development. Perfect for ${ageGroup} adults to expand knowledge and seek higher meaning.`;
  if (dashaLord === 'Saturn') return `Saturn period brings discipline, hard work, and life lessons. For ${ageGroup} individuals, this is time for patience and building solid foundations.`;
  if (dashaLord === 'Venus') return `Venus period enhances creativity, relationships, and material pleasures. Good time for ${ageGroup} people to focus on partnerships and artistic pursuits.`;
  
  return `Currently experiencing ${dashaLord} period energies, bringing unique opportunities for growth and development`;
}

function getUpcomingOpportunities(dashaLord?: string): string[] {
  const opportunities: Record<string, string[]> = {
    'Jupiter': ['Higher education', 'Teaching opportunities', 'Spiritual growth', 'International connections'],
    'Venus': ['Creative projects', 'Relationship developments', 'Artistic recognition', 'Material gains'],
    'Sun': ['Leadership roles', 'Government opportunities', 'Public recognition', 'Authority positions'],
    'Moon': ['Emotional healing', 'Family prosperity', 'Public favor', 'Nurturing roles']
  };
  
  return opportunities[dashaLord || 'Jupiter'] || ['Personal development', 'New beginnings', 'Skill enhancement'];
}

function getChallengesToWatch(weakestPlanet?: string, currentDasha?: string): string[] {
  const challenges = ['Maintaining balance', 'Health awareness'];
  
  if (weakestPlanet === 'Saturn') challenges.push('Avoid delays', 'Practice patience');
  if (weakestPlanet === 'Mars') challenges.push('Control anger', 'Avoid accidents');
  if (currentDasha === 'Rahu') challenges.push('Avoid confusion', 'Stay grounded');
  
  return challenges;
}

function getAuspiciousPeriods(strongestPlanet?: string, currentDasha?: string): string[] {
  const periods = ['Your birthday month', 'Festival seasons'];
  
  if (strongestPlanet === 'Jupiter') periods.push('Thursday periods', 'Guru Purnima');
  if (strongestPlanet === 'Venus') periods.push('Friday periods', 'Spring season');
  if (currentDasha === 'Sun') periods.push('Sunday periods', 'Summer months');
  
  return periods;
}
