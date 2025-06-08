
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

export async function getGeminiKundaliAnalysis(kundali: VedicKundaliResult): Promise<EnhancedKundaliAnalysis> {
  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key not configured, using fallback analysis');
    return getFallbackAnalysis(kundali);
  }

  try {
    const prompt = createDetailedKundaliPrompt(kundali);
    
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

    return parseGeminiResponse(analysisText, kundali);
    
  } catch (error) {
    console.error('Error getting Gemini analysis:', error);
    return getFallbackAnalysis(kundali);
  }
}

function createDetailedKundaliPrompt(kundali: VedicKundaliResult): string {
  const { birthData, lagna, planets, houses, yogas, dashas, doshas } = kundali;
  
  return `As an expert Vedic astrologer, provide a comprehensive analysis of this birth chart:

BIRTH DETAILS:
- Name: ${birthData.fullName}
- Date: ${birthData.date}
- Time: ${birthData.time}
- Place: ${birthData.place}

LAGNA (ASCENDANT):
- Sign: ${lagna.rashiName} (${lagna.degree.toFixed(2)}°)
- Nakshatra: ${lagna.nakshatraName}

PLANETARY POSITIONS:
${Object.values(planets).map(planet => 
  `- ${planet.name}: ${planet.rashiName} ${planet.degree.toFixed(1)}° (House ${planet.house}) ${planet.isRetrograde ? '[R]' : ''} ${planet.isExalted ? '[Exalted]' : planet.isDebilitated ? '[Debilitated]' : ''}`
).join('\n')}

ACTIVE YOGAS:
${yogas.filter(y => y.isActive).map(yoga => `- ${yoga.name}: ${yoga.description}`).join('\n')}

CURRENT DASHA:
${dashas.find(d => d.isActive)?.planet || 'Not specified'}

DOSHAS:
${doshas.filter(d => d.isPresent).map(dosha => `- ${dosha.name}: ${dosha.severity}`).join('\n')}

Please provide a detailed analysis covering:

1. PERSONALITY ANALYSIS:
   - Core nature and temperament
   - Mental tendencies and thought patterns
   - Emotional patterns and reactions
   - Spiritual inclinations and religious nature

2. CAREER GUIDANCE:
   - Most suitable professions (be specific)
   - Business vs job suitability
   - Leadership qualities and potential
   - Creative and artistic talents

3. RELATIONSHIP INSIGHTS:
   - Marriage timing and partner characteristics
   - Family life and domestic happiness
   - Social relationships and friendships
   - Children and parenting style

4. HEALTH PREDICTIONS:
   - Overall health constitution
   - Vulnerable body parts/systems
   - Preventive health measures
   - Mental and emotional wellbeing

5. SPIRITUAL PATH:
   - Life dharma and purpose
   - Karmic lessons to learn
   - Recommended spiritual practices
   - Ultimate life goals

6. TIMING PREDICTIONS:
   - Current life phase analysis
   - Upcoming opportunities (next 2-3 years)
   - Potential challenges to watch for
   - Most auspicious periods ahead

Provide practical, actionable insights based on traditional Vedic astrology principles. Be specific and avoid generic statements.

Format your response as structured sections with clear headings.`;
}

function parseGeminiResponse(analysisText: string, kundali: VedicKundaliResult): EnhancedKundaliAnalysis {
  // Parse the Gemini response and structure it
  // This is a simplified parser - in production, you'd want more sophisticated parsing
  
  try {
    // Extract sections using regex or string manipulation
    const sections = analysisText.split(/\d+\.\s+[A-Z\s]+:|[A-Z\s]+:/);
    
    return {
      detailedPersonality: {
        coreNature: extractSection(analysisText, 'core nature|temperament') || getDefaultPersonality(kundali).coreNature,
        mentalTendencies: extractSection(analysisText, 'mental|thought') || getDefaultPersonality(kundali).mentalTendencies,
        emotionalPatterns: extractSection(analysisText, 'emotional|emotion') || getDefaultPersonality(kundali).emotionalPatterns,
        spiritualInclinations: extractSection(analysisText, 'spiritual|religious') || getDefaultPersonality(kundali).spiritualInclinations
      },
      careerGuidance: {
        idealProfessions: extractListItems(analysisText, 'profession|career') || getDefaultCareer(kundali).idealProfessions,
        businessAptitude: extractSection(analysisText, 'business') || getDefaultCareer(kundali).businessAptitude,
        leadershipQualities: extractSection(analysisText, 'leadership') || getDefaultCareer(kundali).leadershipQualities,
        creativePotential: extractSection(analysisText, 'creative|artistic') || getDefaultCareer(kundali).creativePotential
      },
      relationshipInsights: {
        marriageTimings: extractSection(analysisText, 'marriage|timing') || getDefaultRelationships(kundali).marriageTimings,
        partnerQualities: extractSection(analysisText, 'partner|spouse') || getDefaultRelationships(kundali).partnerQualities,
        familyLife: extractSection(analysisText, 'family|domestic') || getDefaultRelationships(kundali).familyLife,
        friendshipPatterns: extractSection(analysisText, 'friend|social') || getDefaultRelationships(kundali).friendshipPatterns
      },
      healthPredictions: {
        generalHealth: extractSection(analysisText, 'health|constitution') || getDefaultHealth(kundali).generalHealth,
        vulnerableAreas: extractListItems(analysisText, 'vulnerable|weak') || getDefaultHealth(kundali).vulnerableAreas,
        preventiveMeasures: extractListItems(analysisText, 'preventive|prevention') || getDefaultHealth(kundali).preventiveMeasures,
        mentalWellbeing: extractSection(analysisText, 'mental.*well|emotional.*well') || getDefaultHealth(kundali).mentalWellbeing
      },
      spiritualPath: {
        dharma: extractSection(analysisText, 'dharma|purpose') || getDefaultSpiritual(kundali).dharma,
        karmaLessons: extractSection(analysisText, 'karma|lesson') || getDefaultSpiritual(kundali).karmaLessons,
        spiritualPractices: extractListItems(analysisText, 'practice|meditation') || getDefaultSpiritual(kundali).spiritualPractices,
        lifeGoals: extractSection(analysisText, 'goal|ultimate') || getDefaultSpiritual(kundali).lifeGoals
      },
      timingPredictions: {
        currentPhase: extractSection(analysisText, 'current|phase') || getDefaultTiming(kundali).currentPhase,
        upcomingOpportunities: extractListItems(analysisText, 'opportunit|upcoming') || getDefaultTiming(kundali).upcomingOpportunities,
        challengesToWatch: extractListItems(analysisText, 'challenge|watch') || getDefaultTiming(kundali).challengesToWatch,
        auspiciousPeriods: extractListItems(analysisText, 'auspicious|favorable') || getDefaultTiming(kundali).auspiciousPeriods
      }
    };
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    return getFallbackAnalysis(kundali);
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

function getFallbackAnalysis(kundali: VedicKundaliResult): EnhancedKundaliAnalysis {
  return {
    detailedPersonality: getDefaultPersonality(kundali),
    careerGuidance: getDefaultCareer(kundali),
    relationshipInsights: getDefaultRelationships(kundali),
    healthPredictions: getDefaultHealth(kundali),
    spiritualPath: getDefaultSpiritual(kundali),
    timingPredictions: getDefaultTiming(kundali)
  };
}

function getDefaultPersonality(kundali: VedicKundaliResult) {
  const lagna = kundali.lagna.rashiName;
  
  return {
    coreNature: `As a ${lagna} ascendant, you possess the fundamental qualities of this sign, shaping your core personality and approach to life.`,
    mentalTendencies: `Your mental patterns are influenced by your ${lagna} nature, creating specific ways of thinking and processing information.`,
    emotionalPatterns: `Emotionally, you express yourself in ways characteristic of ${lagna}, with unique patterns of feeling and reaction.`,
    spiritualInclinations: `Your spiritual path is guided by the higher principles of ${lagna}, leading toward specific forms of growth and understanding.`
  };
}

function getDefaultCareer(kundali: VedicKundaliResult) {
  const tenthHouse = kundali.houses.find(h => h.number === 10);
  
  return {
    idealProfessions: [`Careers related to ${tenthHouse?.rashiName} energy`, 'Leadership roles', 'Professional services'],
    businessAptitude: 'Moderate to good business sense based on planetary combinations',
    leadershipQualities: 'Natural leadership abilities present with proper development',
    creativePotential: 'Creative talents indicated through planetary positions'
  };
}

function getDefaultRelationships(kundali: VedicKundaliResult) {
  return {
    marriageTimings: 'Marriage likely in traditional age ranges with auspicious timing',
    partnerQualities: 'Partner will complement your nature and support life goals',
    familyLife: 'Generally harmonious family relationships with mutual support',
    friendshipPatterns: 'Selective in friendships but loyal to close companions'
  };
}

function getDefaultHealth(kundali: VedicKundaliResult) {
  return {
    generalHealth: 'Generally good health constitution with attention to lifestyle',
    vulnerableAreas: ['Areas indicated by planetary positions', 'Stress-related concerns'],
    preventiveMeasures: ['Regular exercise', 'Balanced diet', 'Stress management', 'Regular health checkups'],
    mentalWellbeing: 'Mental health supported by spiritual practices and balanced lifestyle'
  };
}

function getDefaultSpiritual(kundali: VedicKundaliResult) {
  return {
    dharma: 'Life purpose involves service, growth, and fulfilling cosmic responsibilities',
    karmaLessons: 'Learning balance, responsibility, and spiritual development',
    spiritualPractices: ['Meditation', 'Prayer', 'Charitable service', 'Study of wisdom texts'],
    lifeGoals: 'Ultimate aim toward spiritual evolution and contribution to society'
  };
}

function getDefaultTiming(kundali: VedicKundaliResult) {
  const currentDasha = kundali.dashas.find(d => d.isActive);
  
  return {
    currentPhase: `Currently in ${currentDasha?.planet || 'transition'} period, which brings specific energies and opportunities`,
    upcomingOpportunities: ['Career advancement', 'Personal growth', 'Relationship developments'],
    challengesToWatch: ['Health considerations', 'Financial planning', 'Relationship balance'],
    auspiciousPeriods: ['Festival seasons', 'Planetary transit periods', 'Personal anniversary dates']
  };
}

export type { EnhancedKundaliAnalysis };
