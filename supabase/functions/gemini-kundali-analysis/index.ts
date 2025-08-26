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
  
  // Get current date for timing analysis
  const currentDate = new Date().toLocaleDateString();
  
  // Extract key planetary positions for detailed analysis
  const sun = planets.SU || planets.Sun || {};
  const moon = planets.MO || planets.Moon || {};
  const mercury = planets.ME || planets.Mercury || {};
  const venus = planets.VE || planets.Venus || {};
  const mars = planets.MA || planets.Mars || {};
  const jupiter = planets.JU || planets.Jupiter || {};
  const saturn = planets.SA || planets.Saturn || {};
  const rahu = planets.RA || planets.Rahu || {};
  const ketu = planets.KE || planets.Ketu || {};
  
  // Find strongest and weakest planets
  const planetStrengths = Object.values(planets).map((p: any) => ({
    name: p.name,
    strength: p.strength || 0,
    house: p.house,
    sign: p.rashiName,
    degree: p.degree
  })).sort((a, b) => (b.strength || 0) - (a.strength || 0));
  
  const strongestPlanet = planetStrengths[0] || {};
  const weakestPlanet = planetStrengths[planetStrengths.length - 1] || {};
  
  // Analyze house strengths
  const firstHousePlanets = Object.values(planets).filter((p: any) => p.house === 1);
  const tenthHousePlanets = Object.values(planets).filter((p: any) => p.house === 10);
  const seventhHousePlanets = Object.values(planets).filter((p: any) => p.house === 7);
  const fourthHousePlanets = Object.values(planets).filter((p: any) => p.house === 4);
  
  // Current Dasha analysis
  const currentDasha = dashas.find((d: any) => d.isActive) || {};
  const currentDashaPlanet = currentDasha.planet || 'Unknown';
  
  return `You are a master Vedic astrologer with 40+ years of experience. Analyze this birth chart with deep personalized insights:

BIRTH PROFILE:
- Name: ${birthData.fullName || 'Native'}
- Birth Date: ${birthData.date || 'Unknown'}
- Birth Time: ${birthData.time || 'Unknown'}  
- Birth Place: ${birthData.place || 'Unknown'}
- Analysis Date: ${currentDate}

LAGNA ANALYSIS:
- Ascendant: ${chart.ascendant || chart.lagna?.rashiName || 'Unknown'}
- 1st House Planets: ${firstHousePlanets.map((p: any) => `${p.name} at ${p.degree?.toFixed(1)}° in ${p.rashiName}`).join(', ') || 'None'}

CORE PLANETARY POSITIONS (with precise analysis):
• SUN (Soul/Self): ${sun.rashiName || 'Unknown'} ${sun.degree?.toFixed(1) || '0'}° in House ${sun.house || '?'} - ${getSunAnalysis(sun)}
• MOON (Mind/Emotions): ${moon.rashiName || 'Unknown'} ${moon.degree?.toFixed(1) || '0'}° in House ${moon.house || '?'} - ${getMoonAnalysis(moon)}
• MERCURY (Intelligence): ${mercury.rashiName || 'Unknown'} ${mercury.degree?.toFixed(1) || '0'}° in House ${mercury.house || '?'} - ${getMercuryAnalysis(mercury)}
• VENUS (Love/Beauty): ${venus.rashiName || 'Unknown'} ${venus.degree?.toFixed(1) || '0'}° in House ${venus.house || '?'} - ${getVenusAnalysis(venus)}
• MARS (Energy/Action): ${mars.rashiName || 'Unknown'} ${mars.degree?.toFixed(1) || '0'}° in House ${mars.house || '?'} - ${getMarsAnalysis(mars)}
• JUPITER (Wisdom/Luck): ${jupiter.rashiName || 'Unknown'} ${jupiter.degree?.toFixed(1) || '0'}° in House ${jupiter.house || '?'} - ${getJupiterAnalysis(jupiter)}
• SATURN (Discipline/Karma): ${saturn.rashiName || 'Unknown'} ${saturn.degree?.toFixed(1) || '0'}° in House ${saturn.house || '?'} - ${getSaturnAnalysis(saturn)}
• RAHU (Desires/Obsessions): ${rahu.rashiName || 'Unknown'} ${rahu.degree?.toFixed(1) || '0'}° in House ${rahu.house || '?'} - ${getRahuAnalysis(rahu)}
• KETU (Detachment/Spirituality): ${ketu.rashiName || 'Unknown'} ${ketu.degree?.toFixed(1) || '0'}° in House ${ketu.house || '?'} - ${getKetuAnalysis(ketu)}

PLANETARY STRENGTH ANALYSIS:
- Strongest Planet: ${strongestPlanet.name || 'Unknown'} (${strongestPlanet.strength || 0}% strength) - Your superpower source
- Weakest Planet: ${weakestPlanet.name || 'Unknown'} (${weakestPlanet.strength || 0}% strength) - Area needing attention

KEY HOUSE ANALYSIS:
- 1st House (Self): ${firstHousePlanets.map((p: any) => p.name).join(', ') || 'Empty'} - Personality influences
- 4th House (Home/Mind): ${fourthHousePlanets.map((p: any) => p.name).join(', ') || 'Empty'} - Emotional foundation  
- 7th House (Relationships): ${seventhHousePlanets.map((p: any) => p.name).join(', ') || 'Empty'} - Partnership patterns
- 10th House (Career): ${tenthHousePlanets.map((p: any) => p.name).join(', ') || 'Empty'} - Professional destiny

ACTIVE YOGAS & COMBINATIONS:
${yogas.filter((y: any) => y.isActive || y.present).length > 0 ? 
  yogas.filter((y: any) => y.isActive || y.present).map((yoga: any) => `• ${yoga.name}: ${yoga.description || 'Active'} - ${getYogaEffect(yoga.name)}`).join('\n') :
  '• No major yogas detected - Focus on developing inherent potential through planetary strengths'}

CURRENT DASHA PERIOD:
- Main Period: ${currentDashaPlanet} Mahadasha - ${getDashaEffect(currentDashaPlanet, currentDasha)}
- Impact on life: ${getDashaLifeImpact(currentDashaPlanet)}

DOSHAS & CHALLENGES:
${doshas.filter((d: any) => d.isPresent).length > 0 ? 
  doshas.filter((d: any) => d.isPresent).map((dosha: any) => `• ${dosha.name} (${dosha.severity || 'Present'}): ${getDoshaRemedy(dosha.name)}`).join('\n') :
  '• No major doshas - Generally favorable chart'}

NOW PROVIDE DETAILED PERSONALIZED ANALYSIS:

1. CORE PERSONALITY ANALYSIS:
Based on ${chart.ascendant} ascendant with ${sun.rashiName} Sun and ${moon.rashiName} Moon, analyze the native's fundamental nature, thinking patterns, emotional responses, and spiritual inclinations. Reference specific planetary positions and their house placements.

2. CAREER & PROFESSION:
Analyze 10th house planets (${tenthHousePlanets.map((p: any) => p.name).join(', ') || 'Empty'}), 10th lord position, and ${strongestPlanet.name} as strongest planet to suggest ideal professions, business potential, leadership abilities, and creative talents.

3. RELATIONSHIPS & MARRIAGE:
Based on 7th house analysis (${seventhHousePlanets.map((p: any) => p.name).join(', ') || 'Empty'}), Venus position (${venus.rashiName} in ${venus.house}th house), and relevant yogas, predict marriage timing, partner characteristics, family dynamics, and social relationships.

4. HEALTH & VITALITY:
Analyze health indicators from 6th house, Mars position, Saturn influences, and vulnerable body parts based on planetary positions. Suggest preventive measures and health practices.

5. SPIRITUAL PATH & DHARMA:
Based on Jupiter position (${jupiter.rashiName} in ${jupiter.house}th house), Ketu placement (${ketu.rashiName} in ${ketu.house}th house), and 9th/12th house influences, guide the native's spiritual journey, life purpose, karmic lessons, and recommended practices.

6. TIMING & PREDICTIONS:
Using current ${currentDashaPlanet} Mahadasha, upcoming transits, and planetary periods, predict opportunities, challenges, and auspicious timing for major life decisions in next 2-3 years.

BE SPECIFIC, PERSONALIZED, AND REFERENCE ACTUAL CHART POSITIONS. Avoid generic statements.`;
}

function parseGeminiResponse(analysisText: string, kundaliData: any): any {
  try {
    // Extract sections by numbered headings (1. CORE PERSONALITY, 2. CAREER, etc.)
    const sections = analysisText.split(/\d+\.\s+[A-Z\s&]+:/);
    
    // Try to extract each section content
    const personalitySection = extractSectionByNumber(analysisText, 1) || analysisText;
    const careerSection = extractSectionByNumber(analysisText, 2) || '';
    const relationshipSection = extractSectionByNumber(analysisText, 3) || '';
    const healthSection = extractSectionByNumber(analysisText, 4) || '';
    const spiritualSection = extractSectionByNumber(analysisText, 5) || '';
    const timingSection = extractSectionByNumber(analysisText, 6) || '';
    
    return {
      detailedPersonality: {
        coreNature: extractParagraph(personalitySection, 0) || getPersonalizedPersonality(kundaliData).coreNature,
        mentalTendencies: extractParagraph(personalitySection, 1) || getPersonalizedPersonality(kundaliData).mentalTendencies,
        emotionalPatterns: extractParagraph(personalitySection, 2) || getPersonalizedPersonality(kundaliData).emotionalPatterns,
        spiritualInclinations: extractParagraph(personalitySection, 3) || getPersonalizedPersonality(kundaliData).spiritualInclinations
      },
      careerGuidance: {
        idealProfessions: extractCareerProfessions(careerSection) || getPersonalizedCareer(kundaliData).idealProfessions,
        businessAptitude: extractParagraph(careerSection, 1) || getPersonalizedCareer(kundaliData).businessAptitude,
        leadershipQualities: extractParagraph(careerSection, 2) || getPersonalizedCareer(kundaliData).leadershipQualities,
        creativePotential: extractParagraph(careerSection, 3) || getPersonalizedCareer(kundaliData).creativePotential
      },
      relationshipInsights: {
        marriageTimings: extractParagraph(relationshipSection, 0) || getPersonalizedRelationships(kundaliData).marriageTimings,
        partnerQualities: extractParagraph(relationshipSection, 1) || getPersonalizedRelationships(kundaliData).partnerQualities,
        familyLife: extractParagraph(relationshipSection, 2) || getPersonalizedRelationships(kundaliData).familyLife,
        friendshipPatterns: extractParagraph(relationshipSection, 3) || getPersonalizedRelationships(kundaliData).friendshipPatterns
      },
      healthPredictions: {
        generalHealth: extractParagraph(healthSection, 0) || getPersonalizedHealth(kundaliData).generalHealth,
        vulnerableAreas: extractHealthAreas(healthSection) || getPersonalizedHealth(kundaliData).vulnerableAreas,
        preventiveMeasures: extractHealthMeasures(healthSection) || getPersonalizedHealth(kundaliData).preventiveMeasures,
        mentalWellbeing: extractParagraph(healthSection, -1) || getPersonalizedHealth(kundaliData).mentalWellbeing
      },
      spiritualPath: {
        dharma: extractParagraph(spiritualSection, 0) || getPersonalizedSpiritual(kundaliData).dharma,
        karmaLessons: extractParagraph(spiritualSection, 1) || getPersonalizedSpiritual(kundaliData).karmaLessons,
        spiritualPractices: extractSpiritualPractices(spiritualSection) || getPersonalizedSpiritual(kundaliData).spiritualPractices,
        lifeGoals: extractParagraph(spiritualSection, -1) || getPersonalizedSpiritual(kundaliData).lifeGoals
      },
      timingPredictions: {
        currentPhase: extractParagraph(timingSection, 0) || getPersonalizedTiming(kundaliData).currentPhase,
        upcomingOpportunities: extractTimingOpportunities(timingSection) || getPersonalizedTiming(kundaliData).upcomingOpportunities,
        challengesToWatch: extractTimingChallenges(timingSection) || getPersonalizedTiming(kundaliData).challengesToWatch,
        auspiciousPeriods: extractTimingPeriods(timingSection) || getPersonalizedTiming(kundaliData).auspiciousPeriods
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

// Helper functions for planetary analysis descriptions
function getSunAnalysis(sun: any): string {
  if (!sun.rashiName) return 'Position needs analysis';
  const house = sun.house;
  if (house === 1) return 'Strong self-identity and leadership';
  if (house === 10) return 'Career-focused with authority';
  if (house === 5) return 'Creative and intelligent nature';
  return `Authority through ${house}th house matters`;
}

function getMoonAnalysis(moon: any): string {
  if (!moon.rashiName) return 'Position needs analysis';
  const house = moon.house;
  if (house === 1) return 'Emotional and intuitive personality';
  if (house === 4) return 'Deep connection to home and mother';
  if (house === 7) return 'Emotional through relationships';
  return `Mind influenced by ${house}th house themes`;
}

function getMercuryAnalysis(mercury: any): string {
  if (!mercury.rashiName) return 'Position needs analysis';
  const house = mercury.house;
  if (house === 1) return 'Quick thinking and communication';
  if (house === 3) return 'Excellent communicator and writer';
  if (house === 10) return 'Professional communication skills';
  return `Intelligence through ${house}th house activities`;
}

function getVenusAnalysis(venus: any): string {
  if (!venus.rashiName) return 'Position needs analysis';
  const house = venus.house;
  if (house === 1) return 'Attractive personality and artistic nature';
  if (house === 7) return 'Harmony in relationships';
  if (house === 2) return 'Love for luxury and family wealth';
  return `Beauty and harmony through ${house}th house`;
}

function getMarsAnalysis(mars: any): string {
  if (!mars.rashiName) return 'Position needs analysis';
  const house = mars.house;
  if (house === 1) return 'Energetic and assertive personality';
  if (house === 10) return 'Dynamic career and leadership';
  if (house === 3) return 'Courage and initiative';
  return `Energy and action through ${house}th house`;
}

function getJupiterAnalysis(jupiter: any): string {
  if (!jupiter.rashiName) return 'Position needs analysis';
  const house = jupiter.house;
  if (house === 1) return 'Wise and optimistic personality';
  if (house === 5) return 'Intelligence and spiritual wisdom';
  if (house === 9) return 'Religious and philosophical nature';
  return `Wisdom and luck through ${house}th house`;
}

function getSaturnAnalysis(saturn: any): string {
  if (!saturn.rashiName) return 'Position needs analysis';
  const house = saturn.house;
  if (house === 1) return 'Disciplined but may face delays';
  if (house === 10) return 'Slow but steady career progress';
  if (house === 7) return 'Mature approach to relationships';
  return `Discipline and karma through ${house}th house`;
}

function getRahuAnalysis(rahu: any): string {
  if (!rahu.rashiName) return 'Position needs analysis';
  const house = rahu.house;
  if (house === 1) return 'Unconventional personality and desires';
  if (house === 10) return 'Modern career and technology focus';
  if (house === 7) return 'Foreign or unusual partnerships';
  return `Materialistic desires through ${house}th house`;
}

function getKetuAnalysis(ketu: any): string {
  if (!ketu.rashiName) return 'Position needs analysis';
  const house = ketu.house;
  if (house === 1) return 'Spiritual detachment from ego';
  if (house === 12) return 'Strong spiritual inclinations';
  if (house === 9) return 'Past-life spiritual knowledge';
  return `Spiritual detachment from ${house}th house matters`;
}

function getYogaEffect(yogaName: string): string {
  const effects: Record<string, string> = {
    'Gaja Kesari': 'Great wisdom and prosperity',
    'Raj Yoga': 'Royal status and authority',
    'Dhana Yoga': 'Wealth accumulation potential',
    'Viparita Raja Yoga': 'Success through challenges',
    'Neecha Bhanga': 'Cancellation of planetary weakness',
    'Chandra Mangal': 'Dynamic emotional nature'
  };
  return effects[yogaName] || 'Beneficial influence on life';
}

function getDashaEffect(planet: string, dasha: any): string {
  const effects: Record<string, string> = {
    'Sun': 'Period of authority, recognition, and government favor',
    'Moon': 'Emotional changes, travel, and domestic focus',
    'Mars': 'Energy, conflicts, property matters, and courage',
    'Mercury': 'Education, communication, business, and intellectual growth',
    'Jupiter': 'Wisdom, spirituality, children, and overall prosperity',
    'Venus': 'Love, luxury, arts, and material comforts',
    'Saturn': 'Hard work, delays, but eventual success through persistence',
    'Rahu': 'Material desires, foreign connections, and technological advancement',
    'Ketu': 'Spiritual awakening, detachment, and mystical experiences'
  };
  return effects[planet] || 'Significant life changes and development';
}

function getDashaLifeImpact(planet: string): string {
  const impacts: Record<string, string> = {
    'Sun': 'Focus on leadership, career advancement, and public recognition',
    'Moon': 'Emphasis on emotional well-being, family, and domestic harmony',
    'Mars': 'Time for action, real estate, sports, and overcoming obstacles',
    'Mercury': 'Period favoring communication, education, and business ventures',
    'Jupiter': 'Spiritual growth, teaching, counseling, and philosophical pursuits',
    'Venus': 'Romance, artistic pursuits, luxury, and social connections',
    'Saturn': 'Karmic lessons, discipline, hard work, and long-term planning',
    'Rahu': 'Material ambitions, foreign opportunities, and unconventional paths',
    'Ketu': 'Spiritual quests, research, healing, and letting go of attachments'
  };
  return impacts[planet] || 'Period of transformation and personal growth';
}

function getDoshaRemedy(doshaName: string): string {
  const remedies: Record<string, string> = {
    'Mangal Dosha': 'Perform Mars remedies, Hanuman worship, red coral gemstone',
    'Kaal Sarp Dosha': 'Rahu-Ketu remedies, Serpent deity worship, specific mantras',
    'Pitra Dosha': 'Ancestral worship, charity, Shraddha rituals',
    'Shani Dosha': 'Saturn remedies, blue sapphire, Saturday fasting',
    'Guru Chandal': 'Jupiter strengthening, yellow sapphire, Guru mantras'
  };
  return remedies[doshaName] || 'Consult astrologer for specific remedies';
}

// Enhanced parsing functions for better content extraction
function extractSectionByNumber(text: string, number: number): string {
  const regex = new RegExp(`${number}\\.\s+[A-Z\\s&]+:([\\s\\S]*?)(?=${number + 1}\\.|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

function extractParagraph(text: string, index: number): string {
  const paragraphs = text.split('\n').filter(p => p.trim().length > 0);
  if (index === -1) return paragraphs[paragraphs.length - 1] || '';
  return paragraphs[index] || '';
}

function extractCareerProfessions(text: string): string[] {
  const matches = text.match(/profession[s]?[:\-\s]*([^\n.]+)/gi);
  if (matches) {
    return matches[0].split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0);
  }
  return [];
}

function extractHealthAreas(text: string): string[] {
  const matches = text.match(/vulnerable[^.]*|weak[^.]*|health.*concern[^.]*/gi);
  return matches ? matches.map(m => m.trim()) : [];
}

function extractHealthMeasures(text: string): string[] {
  const measures = text.match(/preventive[^.]*|recommend[^.]*|suggest[^.]*/gi);
  return measures ? measures.map(m => m.trim()) : [];
}

function extractSpiritualPractices(text: string): string[] {
  const practices = text.match(/practice[s]?[^.]*|meditation[^.]*|yoga[^.]*/gi);
  return practices ? practices.map(p => p.trim()) : [];
}

function extractTimingOpportunities(text: string): string[] {
  const opportunities = text.match(/opportunit[^.]*|favorable[^.]*|auspicious[^.]*/gi);
  return opportunities ? opportunities.map(o => o.trim()) : [];
}

function extractTimingChallenges(text: string): string[] {
  const challenges = text.match(/challenge[^.]*|difficult[^.]*|avoid[^.]*/gi);
  return challenges ? challenges.map(c => c.trim()) : [];
}

function extractTimingPeriods(text: string): string[] {
  const periods = text.match(/period[^.]*|time[^.]*|month[^.]*|year[^.]*/gi);
  return periods ? periods.map(p => p.trim()) : [];
}

// Personalized analysis functions that use actual kundali data
function getPersonalizedPersonality(kundaliData: any) {
  const chart = kundaliData?.chart || kundaliData?.enhancedCalculations || {};
  const planets = chart?.planets || {};
  const ascendant = chart?.ascendant || chart?.lagna?.rashiName || 'Unknown';
  
  const sun = planets.SU || planets.Sun || {};
  const moon = planets.MO || planets.Moon || {};
  
  return {
    coreNature: `With ${ascendant} ascendant and Sun in ${sun.rashiName || 'unknown sign'} (${sun.house}th house), your core nature is shaped by ${getAscendantNature(ascendant)} combined with ${getSunNature(sun.rashiName, sun.house)}.`,
    mentalTendencies: `Your Moon in ${moon.rashiName || 'unknown sign'} (${moon.house}th house) creates ${getMoonMentality(moon.rashiName, moon.house)} mental patterns and emotional responses.`,
    emotionalPatterns: `Emotionally, you ${getEmotionalPattern(moon.house, moon.rashiName)} with ${getAscendantEmotions(ascendant)} underlying your reactions.`,
    spiritualInclinations: `Your spiritual path is guided by ${getJupiterSpiritual(planets.JU || planets.Jupiter)} and ${getKetuSpiritual(planets.KE || planets.Ketu)}.`
  };
}

function getPersonalizedCareer(kundaliData: any) {
  const chart = kundaliData?.chart || kundaliData?.enhancedCalculations || {};
  const planets = chart?.planets || {};
  
  const tenthHousePlanets = Object.values(planets).filter((p: any) => p.house === 10);
  const mars = planets.MA || planets.Mars || {};
  const mercury = planets.ME || planets.Mercury || {};
  
  return {
    idealProfessions: getIdealProfessions(tenthHousePlanets, planets),
    businessAptitude: getBusinessAptitude(mars, mercury),
    leadershipQualities: getLeadershipQualities(planets.SU || planets.Sun, mars),
    creativePotential: getCreativePotential(planets.VE || planets.Venus, mercury)
  };
}

function getPersonalizedRelationships(kundaliData: any) {
  const chart = kundaliData?.chart || kundaliData?.enhancedCalculations || {};
  const planets = chart?.planets || {};
  
  const venus = planets.VE || planets.Venus || {};
  const seventhHousePlanets = Object.values(planets).filter((p: any) => p.house === 7);
  
  return {
    marriageTimings: getMarriageTimings(venus, seventhHousePlanets),
    partnerQualities: getPartnerQualities(venus, seventhHousePlanets),
    familyLife: getFamilyLife(planets.MO || planets.Moon, planets.JU || planets.Jupiter),
    friendshipPatterns: getFriendshipPatterns(planets.ME || planets.Mercury, venus)
  };
}

function getPersonalizedHealth(kundaliData: any) {
  const chart = kundaliData?.chart || kundaliData?.enhancedCalculations || {};
  const planets = chart?.planets || {};
  
  const mars = planets.MA || planets.Mars || {};
  const saturn = planets.SA || planets.Saturn || {};
  
  return {
    generalHealth: getGeneralHealth(mars, saturn),
    vulnerableAreas: getVulnerableAreas(saturn, mars),
    preventiveMeasures: getPreventiveMeasures(saturn, mars),
    mentalWellbeing: getMentalWellbeing(planets.MO || planets.Moon, planets.ME || planets.Mercury)
  };
}

function getPersonalizedSpiritual(kundaliData: any) {
  const chart = kundaliData?.chart || kundaliData?.enhancedCalculations || {};
  const planets = chart?.planets || {};
  
  const jupiter = planets.JU || planets.Jupiter || {};
  const ketu = planets.KE || planets.Ketu || {};
  
  return {
    dharma: getDharma(jupiter, ketu),
    karmaLessons: getKarmaLessons(saturn, ketu),
    spiritualPractices: getSpiritualPractices(jupiter, ketu),
    lifeGoals: getLifeGoals(jupiter, planets.SU || planets.Sun)
  };
}

function getPersonalizedTiming(kundaliData: any) {
  const chart = kundaliData?.chart || kundaliData?.enhancedCalculations || {};
  const dashas = chart?.dashas || [];
  
  const currentDasha = dashas.find((d: any) => d.isActive) || {};
  
  return {
    currentPhase: getCurrentPhase(currentDasha),
    upcomingOpportunities: getUpcomingOpportunities(currentDasha),
    challengesToWatch: getChallengesToWatch(currentDasha),
    auspiciousPeriods: getAuspiciousPeriods(currentDasha)
  };
}

// Helper functions for personalized analysis (simplified versions)
function getAscendantNature(ascendant: string): string {
  const natures: Record<string, string> = {
    'Aries': 'dynamic and pioneering energy',
    'Taurus': 'stable and practical approach',
    'Gemini': 'adaptable and communicative nature',
    'Cancer': 'nurturing and emotional depth',
    'Leo': 'confident and creative expression',
    'Virgo': 'analytical and service-oriented mindset'
  };
  return natures[ascendant] || 'unique personality traits';
}

function getSunNature(sign: string, house: number): string {
  return `${sign || 'unknown'} energy expressing through ${house}th house themes`;
}

function getMoonMentality(sign: string, house: number): string {
  return `${sign || 'unknown'} influenced thinking patterns through ${house}th house experiences`;
}

function getIdealProfessions(tenthHousePlanets: any[], allPlanets: any): string[] {
  if (tenthHousePlanets.length === 0) return ['Leadership roles', 'Service industries'];
  return tenthHousePlanets.map(p => `${p.name}-related fields`);
}

function getBusinessAptitude(mars: any, mercury: any): string {
  return `Business potential through ${mars.rashiName || 'Mars'} drive and ${mercury.rashiName || 'Mercury'} communication skills.`;
}

function getLeadershipQualities(sun: any, mars: any): string {
  return `Leadership through ${sun.rashiName || 'Sun'} authority and ${mars.rashiName || 'Mars'} action-oriented approach.`;
}

function getCreativePotential(venus: any, mercury: any): string {
  return `Creative expression through ${venus.rashiName || 'Venus'} artistic nature and ${mercury.rashiName || 'Mercury'} innovative thinking.`;
}

function getMarriageTimings(venus: any, seventhPlanets: any[]): string {
  return `Marriage timing influenced by Venus in ${venus.rashiName || 'unknown sign'} and 7th house factors.`;
}

function getPartnerQualities(venus: any, seventhPlanets: any[]): string {
  return `Partner likely to have ${venus.rashiName || 'Venus'} qualities and characteristics influenced by 7th house planets.`;
}

function getFamilyLife(moon: any, jupiter: any): string {
  return `Family relationships shaped by ${moon.rashiName || 'Moon'} emotional needs and ${jupiter.rashiName || 'Jupiter'} wisdom.`;
}

function getFriendshipPatterns(mercury: any, venus: any): string {
  return `Social connections through ${mercury.rashiName || 'Mercury'} communication and ${venus.rashiName || 'Venus'} harmony.`;
}

function getGeneralHealth(mars: any, saturn: any): string {
  return `Health influenced by ${mars.rashiName || 'Mars'} vitality and ${saturn.rashiName || 'Saturn'} longevity factors.`;
}

function getVulnerableAreas(saturn: any, mars: any): string[] {
  return [`${saturn.rashiName || 'Saturn'} related areas`, `${mars.rashiName || 'Mars'} influenced body parts`];
}

function getPreventiveMeasures(saturn: any, mars: any): string[] {
  return ['Regular exercise', 'Balanced diet', 'Stress management', 'Adequate rest'];
}

function getMentalWellbeing(moon: any, mercury: any): string {
  return `Mental health supported by ${moon.rashiName || 'Moon'} emotional balance and ${mercury.rashiName || 'Mercury'} mental clarity.`;
}

function getDharma(jupiter: any, ketu: any): string {
  return `Life purpose guided by ${jupiter.rashiName || 'Jupiter'} wisdom in ${jupiter.house}th house and ${ketu.rashiName || 'Ketu'} spiritual lessons.`;
}

function getKarmaLessons(saturn: any, ketu: any): string {
  return `Karmic lessons through ${saturn.rashiName || 'Saturn'} discipline and ${ketu.rashiName || 'Ketu'} detachment.`;
}

function getSpiritualPractices(jupiter: any, ketu: any): string[] {
  return ['Meditation', 'Study of sacred texts', 'Service to others', 'Self-reflection'];
}

function getLifeGoals(jupiter: any, sun: any): string {
  return `Life goals involve ${jupiter.rashiName || 'Jupiter'} wisdom expression and ${sun.rashiName || 'Sun'} self-realization.`;
}

function getCurrentPhase(dasha: any): string {
  return `Currently in ${dasha.planet || 'unknown'} Mahadasha period, bringing ${dasha.planet || 'transformative'} influences.`;
}

function getUpcomingOpportunities(dasha: any): string[] {
  return [`${dasha.planet || 'Current'} period opportunities`, 'Growth in related areas', 'Favorable timing ahead'];
}

function getChallengesToWatch(dasha: any): string[] {
  return [`${dasha.planet || 'Period'} related challenges`, 'Areas requiring attention', 'Timing considerations'];
}

function getAuspiciousPeriods(dasha: any): string[] {
  return ['Next 6 months', 'Favorable transit periods', 'Annual cycles'];
}