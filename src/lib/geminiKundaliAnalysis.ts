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
  // Safely access the ascendant/lagna information
  const ascendant = kundaliData?.chart?.ascendant || 
                   kundaliData?.chart?.lagna?.rashiName || 
                   kundaliData?.enhancedCalculations?.ascendant ||
                   'Unknown';
  
  return {
    coreNature: `As a ${ascendant} ascendant, you possess the fundamental qualities of this sign, shaping your core personality and approach to life.`,
    mentalTendencies: `Your mental patterns are influenced by your ${ascendant} nature, creating specific ways of thinking and processing information.`,
    emotionalPatterns: `Emotionally, you express yourself in ways characteristic of ${ascendant}, with unique patterns of feeling and reaction.`,
    spiritualInclinations: `Your spiritual path is guided by the higher principles of ${ascendant}, leading toward specific forms of growth and understanding.`
  };
}

function getDefaultCareer(kundaliData: any) {
  const houses = kundaliData?.chart?.houses || kundaliData?.enhancedCalculations?.houses || [];
  const tenthHouse = houses.find((h: any) => h.number === 10);
  
  return {
    idealProfessions: [`Careers related to ${tenthHouse?.rashiName || 'your nature'}`, 'Leadership roles', 'Professional services'],
    businessAptitude: 'Moderate to good business sense based on planetary combinations',
    leadershipQualities: 'Natural leadership abilities present with proper development',
    creativePotential: 'Creative talents indicated through planetary positions'
  };
}

function getDefaultRelationships(kundaliData: any) {
  return {
    marriageTimings: 'Marriage likely in traditional age ranges with auspicious timing',
    partnerQualities: 'Partner will complement your nature and support life goals',
    familyLife: 'Generally harmonious family relationships with mutual support',
    friendshipPatterns: 'Selective in friendships but loyal to close companions'
  };
}

function getDefaultHealth(kundaliData: any) {
  return {
    generalHealth: 'Generally good health constitution with attention to lifestyle',
    vulnerableAreas: ['Areas indicated by planetary positions', 'Stress-related concerns'],
    preventiveMeasures: ['Regular exercise', 'Balanced diet', 'Stress management', 'Regular health checkups'],
    mentalWellbeing: 'Mental health supported by spiritual practices and balanced lifestyle'
  };
}

function getDefaultSpiritual(kundaliData: any) {
  return {
    dharma: 'Life purpose involves service, growth, and fulfilling cosmic responsibilities',
    karmaLessons: 'Learning balance, responsibility, and spiritual development',
    spiritualPractices: ['Meditation', 'Prayer', 'Charitable service', 'Study of wisdom texts'],
    lifeGoals: 'Ultimate aim toward spiritual evolution and contribution to society'
  };
}

function getDefaultTiming(kundaliData: any) {
  const dashas = kundaliData?.chart?.dashas || kundaliData?.enhancedCalculations?.dashas || [];
  const currentDasha = dashas.find((d: any) => d.isActive);
  
  return {
    currentPhase: `Currently in ${currentDasha?.planet || 'transition'} period, which brings specific energies and opportunities`,
    upcomingOpportunities: ['Career advancement', 'Personal growth', 'Relationship developments'],
    challengesToWatch: ['Health considerations', 'Financial planning', 'Relationship balance'],
    auspiciousPeriods: ['Festival seasons', 'Planetary transit periods', 'Personal anniversary dates']
  };
}

export type { EnhancedKundaliAnalysis };
