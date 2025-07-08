import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { kundaliData } = await req.json();
    
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not found in environment');
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = createDetailedKundaliPrompt(kundaliData);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
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

    const data = await response.json();
    const analysisText = data.candidates[0]?.content?.parts[0]?.text;
    
    if (!analysisText) {
      throw new Error('No analysis text received from Gemini');
    }

    const structuredAnalysis = parseGeminiResponse(analysisText, kundaliData);
    
    return new Response(JSON.stringify({ analysis: structuredAnalysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in gemini-kundali-analysis function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

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

function parseGeminiResponse(analysisText: string, kundaliData: any): any {
  try {
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

function getFallbackAnalysis(kundaliData: any): any {
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
  
  return {
    coreNature: `With ${ascendant} ascendant, you have natural leadership qualities and a unique approach to life.`,
    mentalTendencies: `Your mental patterns are influenced by your planetary positions, creating a balanced yet dynamic thinking process.`,
    emotionalPatterns: `Emotionally, you respond to life with depth and intuition, guided by your lunar influences.`,
    spiritualInclinations: `Your spiritual path is guided by wisdom and higher learning, with natural inclination toward growth.`
  };
}

function getDefaultCareer(kundaliData: any) {
  return {
    idealProfessions: ['Leadership roles', 'Creative fields', 'Service industries', 'Education'],
    businessAptitude: 'You have natural business acumen and can succeed in entrepreneurial ventures.',
    leadershipQualities: 'Strong leadership potential with ability to guide and inspire others.',
    creativePotential: 'Creative expression comes naturally, with artistic and innovative abilities.'
  };
}

function getDefaultRelationships(kundaliData: any) {
  return {
    marriageTimings: 'Marriage likely to be favorable between ages 25-30, with stable and harmonious partnerships.',
    partnerQualities: 'Your life partner will be supportive, understanding, and complement your personality well.',
    familyLife: 'Family relationships will be generally harmonious with strong emotional bonds.',
    friendshipPatterns: 'You form deep, lasting friendships based on mutual respect and understanding.'
  };
}

function getDefaultHealth(kundaliData: any) {
  return {
    generalHealth: 'Overall health is good with strong constitution and natural vitality.',
    vulnerableAreas: ['Stress management', 'Digestive health', 'Sleep patterns'],
    preventiveMeasures: ['Regular exercise', 'Balanced diet', 'Meditation and yoga', 'Adequate rest'],
    mentalWellbeing: 'Mental health is generally stable with good emotional resilience.'
  };
}

function getDefaultSpiritual(kundaliData: any) {
  return {
    dharma: 'Your life purpose involves service to others and personal growth through wisdom.',
    karmaLessons: 'Focus on developing patience, compassion, and understanding in your relationships.',
    spiritualPractices: ['Meditation', 'Yoga', 'Study of sacred texts', 'Service to others'],
    lifeGoals: 'Spiritual evolution through knowledge, service, and self-realization.'
  };
}

function getDefaultTiming(kundaliData: any) {
  return {
    currentPhase: 'You are in a phase of growth and development with opportunities for advancement.',
    upcomingOpportunities: ['Career advancement', 'Educational opportunities', 'Relationship growth'],
    challengesToWatch: ['Financial planning', 'Health maintenance', 'Work-life balance'],
    auspiciousPeriods: ['Next 6 months', 'Annual transit periods', 'Festival seasons']
  };
}