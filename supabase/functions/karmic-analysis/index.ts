
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

interface KarmicAnalysis {
  careerKarmaSignature: string;
  careerBlockExplanation: string;
  idealCareerSuggestions: string[];
  karmicTimeline: string;
  coachMessage: string;
  relationshipKarma: string;
  healthKarma: string;
  spiritualPath: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { kundaliData, language = 'en', analysisType = 'full_karmic_report' } = await req.json();

    console.log('Generating karmic analysis for:', { 
      analysisType, 
      language, 
      hasKundaliData: !!kundaliData 
    });

    if (!kundaliData) {
      throw new Error('Kundali data is required for karmic analysis');
    }

    const calculations = kundaliData.enhancedCalculations || {};
    const birthData = kundaliData.birthData || {};

    const analysis = await generateKarmicAnalysis(calculations, birthData, language);

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Karmic analysis error:', error);
    
    const fallbackResponse = {
      analysis: getFallbackKarmicAnalysis(req.headers.get('accept-language')?.includes('hi') ? 'hi' : 'en')
    };

    return new Response(JSON.stringify(fallbackResponse), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateKarmicAnalysis(calculations: any, birthData: any, language: string): Promise<KarmicAnalysis> {
  const lagna = calculations.lagna?.signName || 'Unknown';
  const moonNakshatra = calculations.lagna?.nakshatraName || 'Unknown';
  const currentDasha = calculations.dashas?.find(d => d.isActive);
  const planets = calculations.planets || {};
  
  // Extract key planetary information
  const tenthHouseLord = getTenthHouseLord(calculations);
  const d10Summary = getD10Summary(calculations);
  const dashaInfo = getDashaInfo(currentDasha, calculations.dashas);
  const afflictions = getAfflictions(calculations);

  try {
    if (GEMINI_API_KEY) {
      // Generate each section using structured prompts
      const careerKarmaSignature = await callGeminiForSection(
        createCareerKarmaPrompt(lagna, moonNakshatra, tenthHouseLord, d10Summary),
        language
      );

      const careerBlockExplanation = await callGeminiForSection(
        createCareerBlockPrompt(dashaInfo, afflictions),
        language
      );

      const idealCareerSuggestions = await callGeminiForSection(
        createCareerSuggestionsPrompt(d10Summary, planets),
        language
      );

      const karmicTimeline = await callGeminiForSection(
        createKarmicTimelinePrompt(dashaInfo),
        language
      );

      const coachMessage = await callGeminiForSection(
        createCoachMessagePrompt(afflictions, dashaInfo),
        language
      );

      const relationshipKarma = await callGeminiForSection(
        createRelationshipKarmaPrompt(calculations),
        language
      );

      const healthKarma = await callGeminiForSection(
        createHealthKarmaPrompt(calculations),
        language
      );

      const spiritualPath = await callGeminiForSection(
        createSpiritualPathPrompt(calculations),
        language
      );

      return {
        careerKarmaSignature,
        careerBlockExplanation,
        idealCareerSuggestions: parseCareerSuggestions(idealCareerSuggestions),
        karmicTimeline,
        coachMessage,
        relationshipKarma,
        healthKarma,
        spiritualPath
      };
    }
  } catch (error) {
    console.error('Gemini API failed, using fallback:', error);
  }

  return getFallbackKarmicAnalysis(language);
}

// Structured Gemini Prompts based on your requirements

function createCareerKarmaPrompt(lagna: string, moonNakshatra: string, tenthHouseLord: string, d10Summary: string): string {
  return `Given this Kundali:
- Lagna: ${lagna}
- Moon Nakshatra: ${moonNakshatra}
- 10th House: ${tenthHouseLord}
- D10 Chart: ${d10Summary}

Write a concise summary of this person's Karmic Career Signature. Mention natural strengths, how they express work energy, and key themes. Keep it to 4-5 lines.`;
}

function createCareerBlockPrompt(dashaInfo: string, afflictions: string): string {
  return `${dashaInfo}. ${afflictions}

Write a karmic explanation of why this person feels stuck in career. Include emotional experience and past-life pattern if relevant. Keep it to 3-5 lines.`;
}

function createCareerSuggestionsPrompt(d10Summary: string, planets: any): string {
  const strongPlanets = Object.entries(planets)
    .filter(([_, data]: [string, any]) => data?.shadbala > 60)
    .map(([name, _]) => name)
    .join(', ');

  return `This chart shows: ${d10Summary}. Strong planets: ${strongPlanets}. 

Suggest 3 career roles that match this karma + mindset. Justify each in 1 line. Format as numbered list.`;
}

function createKarmicTimelinePrompt(dashaInfo: string): string {
  return `${dashaInfo}

Describe what the user should expect in the current and next career windows. 3-4 lines max. Add what kind of work will flow more easily.`;
}

function createCoachMessagePrompt(afflictions: string, dashaInfo: string): string {
  return `The user feels confused about their career path. ${dashaInfo}. ${afflictions}

Write an empathetic, wise one-liner that gives hope + clarity. Use poetic or coach-like tone. Example style: "You're not behind — your karma is still downloading. Trust the silence before your breakthrough."`;
}

function createRelationshipKarmaPrompt(calculations: any): string {
  const venus = calculations.planets?.VE || {};
  const seventhHouse = calculations.houses?.find(h => h.number === 7) || {};
  
  return `Venus position: ${venus.rashiName || 'Unknown'} in house ${venus.house || 'Unknown'}. 
7th house: ${seventhHouse.rashiName || 'Unknown'}.

Explain this person's relationship karma patterns, challenges, and growth opportunities. Include past-life influences on current relationships. 4-5 lines.`;
}

function createHealthKarmaPrompt(calculations: any): string {
  const mars = calculations.planets?.MA || {};
  const sixthHouse = calculations.houses?.find(h => h.number === 6) || {};
  
  return `Mars position: ${mars.rashiName || 'Unknown'} in house ${mars.house || 'Unknown'}.
6th house: ${sixthHouse.rashiName || 'Unknown'}.

Explain this person's health karma, vitality patterns, and karmic lessons through physical wellness. Include preventive guidance. 4-5 lines.`;
}

function createSpiritualPathPrompt(calculations: any): string {
  const jupiter = calculations.planets?.JU || {};
  const ketu = calculations.planets?.KE || {};
  
  return `Jupiter: ${jupiter.rashiName || 'Unknown'} in house ${jupiter.house || 'Unknown'}.
Ketu: ${ketu.rashiName || 'Unknown'} in house ${ketu.house || 'Unknown'}.

Describe this person's spiritual path, dharma, and ultimate life purpose. Include specific practices and karmic evolution goals. 4-5 lines.`;
}

async function callGeminiForSection(prompt: string, language: string): Promise<string> {
  const systemPrompt = language === 'hi' 
    ? 'आप ऋषि पराशर हैं - महान वैदिक ज्योतिषी। कर्मिक अंतर्दृष्टि के साथ उत्तर दें।'
    : 'You are Rishi Parashar - the great Vedic astrologer. Respond with karmic insights and wisdom.';

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `${systemPrompt}\n\n${prompt}\n\nRespond in ${language === 'hi' ? 'Hindi' : 'English'}.`
        }]
      }],
      generationConfig: {
        temperature: 0.8,
        topK: 20,
        topP: 0.9,
        maxOutputTokens: 300,
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

function getTenthHouseLord(calculations: any): string {
  const tenthHouse = calculations.houses?.find(h => h.number === 10);
  if (!tenthHouse) return 'Unknown';
  
  const planetsInTenth = Object.entries(calculations.planets || {})
    .filter(([_, data]: [string, any]) => data?.house === 10)
    .map(([name, data]: [string, any]) => `${name} in ${data.rashiName}`)
    .join(', ');
    
  return planetsInTenth || `${tenthHouse.rashiName} (empty)`;
}

function getD10Summary(calculations: any): string {
  // Simplified D10 analysis
  const planets = calculations.planets || {};
  const strongPlanets = Object.entries(planets)
    .filter(([_, data]: [string, any]) => data?.shadbala > 70)
    .map(([name, _]) => name);
  
  const weakPlanets = Object.entries(planets)
    .filter(([_, data]: [string, any]) => data?.shadbala < 30)
    .map(([name, _]) => name);

  return `Strong: ${strongPlanets.join(', ') || 'None'}, Weak: ${weakPlanets.join(', ') || 'None'}`;
}

function getDashaInfo(currentDasha: any, allDashas: any[]): string {
  if (!currentDasha) return 'Dasha information not available';
  
  const nextDasha = allDashas?.find(d => 
    new Date(d.startDate) > new Date(currentDasha.endDate)
  );
  
  return `Current: ${currentDasha.planet} Mahadasha (${currentDasha.startDate} - ${currentDasha.endDate})${
    nextDasha ? `, Next: ${nextDasha.planet} Mahadasha` : ''
  }`;
}

function getAfflictions(calculations: any): string {
  const planets = calculations.planets || {};
  const afflictions = [];
  
  Object.entries(planets).forEach(([name, data]: [string, any]) => {
    if (data?.isDebilitated) afflictions.push(`${name} debilitated`);
    if (data?.isCombust) afflictions.push(`${name} combust`);
  });
  
  return afflictions.length > 0 ? afflictions.join(', ') : 'No major afflictions';
}

function parseCareerSuggestions(text: string): string[] {
  const lines = text.split('\n').filter(line => line.trim());
  const suggestions = [];
  
  for (const line of lines) {
    if (line.match(/^\d+\./) || line.includes(':')) {
      suggestions.push(line.replace(/^\d+\.\s*/, '').trim());
    }
  }
  
  return suggestions.length > 0 ? suggestions : [text.trim()];
}

function getFallbackKarmicAnalysis(language: string): KarmicAnalysis {
  if (language === 'hi') {
    return {
      careerKarmaSignature: "आपका करियर कर्म प्राकृतिक नेतृत्व और रचनात्मक अभिव्यक्ति को दर्शाता है। आप काम के माध्यम से दूसरों की सेवा करने के लिए आए हैं।",
      careerBlockExplanation: "वर्तमान चुनौतियां पिछले जन्म के अधूरे कर्मों से जुड़ी हैं। धैर्य और निरंतर प्रयास से सफलता मिलेगी।",
      idealCareerSuggestions: [
        "शिक्षा और मार्गदर्शन के क्षेत्र में काम",
        "रचनात्मक और कलात्मक व्यवसाय",
        "सामाजिक सेवा और परामर्श"
      ],
      karmicTimeline: "आने वाले समय में करियर में स्थिरता आएगी। नए अवसर धीरे-धीरे प्रकट होंगे।",
      coachMessage: "आपका समय आएगा - ब्रह्मांड आपकी तैयारी कर रहा है। धैर्य रखें और कर्म करते रहें। 🕉️",
      relationshipKarma: "आपके रिश्ते आध्यात्मिक विकास के लिए हैं। प्रेम और समझ से सभी बंधन मजबूत होंगे।",
      healthKarma: "आपका शरीर आत्मा का मंदिर है। नियमित योग और प्राकृतिक जीवनशैली से स्वास्थ्य बना रहेगा।",
      spiritualPath: "आपका धर्म सेवा और करुणा में है। ध्यान और भक्ति आपको मोक्ष की ओर ले जाएगी।"
    };
  } else {
    return {
      careerKarmaSignature: "Your career karma reflects natural leadership and creative expression. You're here to serve others through your work and unique gifts.",
      careerBlockExplanation: "Current challenges stem from unfinished karma from past lives. Patience and consistent effort will lead to breakthrough success.",
      idealCareerSuggestions: [
        "Education and guidance roles",
        "Creative and artistic professions", 
        "Social service and counseling"
      ],
      karmicTimeline: "Career stability will emerge gradually. New opportunities will manifest as your karmic debts clear.",
      coachMessage: "Your time is coming - the universe is preparing you. Stay patient and keep working on your karma. 🕉️",
      relationshipKarma: "Your relationships are for spiritual growth. Love and understanding will strengthen all bonds in divine timing.",
      healthKarma: "Your body is the temple of your soul. Regular yoga and natural living will maintain your vitality and strength.",
      spiritualPath: "Your dharma lies in service and compassion. Meditation and devotion will guide you toward liberation and inner peace."
    };
  }
}
