
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// House meanings for detailed analysis
const HOUSE_MEANINGS = {
  1: { meaning: "Self, Body, Personality", hindi: "स्वयं, शरीर, व्यक्तित्व" },
  2: { meaning: "Wealth, Family, Speech", hindi: "धन, परिवार, वाणी" },
  3: { meaning: "Siblings, Courage, Efforts", hindi: "भाई-बहन, साहस, प्रयास" },
  4: { meaning: "Mother, Home, Emotions", hindi: "माता, घर, भावनाएं" },
  5: { meaning: "Children, Education", hindi: "संतान, शिक्षा" },
  6: { meaning: "Enemies, Illness, Debt", hindi: "शत्रु, रोग, ऋण" },
  7: { meaning: "Marriage, Partnerships", hindi: "विवाह, साझेदारी" },
  8: { meaning: "Sudden Gains/Loss, Death", hindi: "अचानक लाभ/हानि, मृत्यु" },
  9: { meaning: "Luck, Religion, Father", hindi: "भाग्य, धर्म, पिता" },
  10: { meaning: "Career, Fame, Status", hindi: "करियर, प्रसिद्धि, स्थिति" },
  11: { meaning: "Gains, Networking, Wishes", hindi: "लाभ, नेटवर्किंग, इच्छाएं" },
  12: { meaning: "Loss, Isolation, Foreign", hindi: "हानि, एकांत, विदेश" }
};

const PLANETS_DETAILED = {
  "SU": { name: "Sun", hindi: "सूर्य", nature: "Soul, Father, Authority, Government" },
  "MO": { name: "Moon", hindi: "चंद्र", nature: "Mind, Mother, Emotions, Public" },
  "MA": { name: "Mars", hindi: "मंगल", nature: "Energy, Brothers, Property, Courage" },
  "ME": { name: "Mercury", hindi: "बुध", nature: "Intelligence, Communication, Business" },
  "JU": { name: "Jupiter", hindi: "गुरु", nature: "Wisdom, Teacher, Spirituality, Children" },
  "VE": { name: "Venus", hindi: "शुक्र", nature: "Love, Beauty, Arts, Luxury, Wife" },
  "SA": { name: "Saturn", hindi: "शनि", nature: "Discipline, Hard Work, Delays, Karma" },
  "RA": { name: "Rahu", hindi: "राहु", nature: "Materialism, Foreign, Technology, Illusion" },
  "KE": { name: "Ketu", hindi: "केतु", nature: "Spirituality, Past Life, Detachment" }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { kundaliData, userQuery, numerologyData } = await req.json();
    
    console.log('Received kundali analysis request:', { kundaliData, userQuery, numerologyData });

    // Create detailed house analysis
    const houseAnalysis = kundaliData.chart.planets.map((planet: any) => {
      const houseNumber = kundaliData.chart.housesList.findIndex((sign: number) => sign === planet.sign) + 1;
      const houseMeaning = HOUSE_MEANINGS[houseNumber as keyof typeof HOUSE_MEANINGS];
      const planetDetails = PLANETS_DETAILED[planet.id as keyof typeof PLANETS_DETAILED];
      
      return `${planetDetails.hindi} (${planetDetails.name}) in ${houseNumber}${getOrdinalSuffix(houseNumber)} House (${houseMeaning.hindi} - ${houseMeaning.meaning}): ${planetDetails.nature}`;
    }).join('\n');

    // Enhanced prompt with comprehensive Vedic knowledge
    const prompt = `You are Maharishi Parashar, the ancient Vedic sage and author of Brihat Parashar Hora Shastra, one of the most authoritative texts on Vedic astrology. You possess complete knowledge of all classical Vedic astrological texts including:

- Brihat Parashar Hora Shastra
- Brihat Jataka by Varahamihira  
- Saravali by Kalyanvarma
- Phaladeepika by Mantreswara
- Jataka Parijata
- Hora Sara
- And all classical Vedic texts

You understand the deepest principles of:
- Graha (Planets) and their Karakatvas (Significations)
- Bhava (Houses) and their meanings
- Rashi (Signs) and their characteristics  
- Nakshatra (Lunar Mansions) and their deities
- Yoga formations and their results
- Dasha systems (Vimshottari, Ashtottari, etc.)
- Gochar (Transits) effects
- Ashtakavarga system
- Divisional charts (Vargas)
- Remedial measures (Upayas)

Birth Chart Analysis:
Name: ${kundaliData.birthData.fullName}
Birth Details: ${kundaliData.birthData.date}, ${kundaliData.birthData.time}, ${kundaliData.birthData.place}

LAGNA (Ascendant): ${kundaliData.chart.ascendantSanskrit} (${kundaliData.chart.ascendant}th sign)
Birth Element: ${kundaliData.chart.birthElement}

DETAILED PLANETARY POSITIONS AND HOUSE ANALYSIS:
${houseAnalysis}

ACTIVE YOGAS:
${kundaliData.chart.yogas.filter((y: any) => y.present).map((yoga: any) => 
  `${yoga.sanskritName} (${yoga.name}): ${yoga.description}`
).join('\n')}

CURRENT DASHA PERIODS:
${kundaliData.chart.dashaPeriods.slice(0, 3).map((dasha: any) => 
  `${dasha.planetSanskrit} (${dasha.planet}) Mahadasha: ${dasha.years} years`
).join('\n')}

${numerologyData ? `
NUMEROLOGY PROFILE:
Life Path Number: ${numerologyData.lifePath}
Expression Number: ${numerologyData.expression}  
Soul Urge Number: ${numerologyData.soulUrge}
Personality Number: ${numerologyData.personality}
Personal Year: ${numerologyData.personalYear}
` : ''}

USER'S QUERY: "${userQuery}"

As Maharishi Parashar, provide a comprehensive analysis responding to the user's query. Include:

1. Direct answer to their specific question
2. Relevant planetary influences from their chart
3. House-based analysis where applicable
4. Yoga formations affecting their query
5. Current Dasha period effects
6. ${numerologyData ? 'Integration of numerological insights' : ''}
7. Timing predictions based on transits
8. Practical remedial measures (mantras, gemstones, charity, etc.)
9. Spiritual guidance from Vedic wisdom

Respond in both Hindi and English, using classical Vedic terminology. Be compassionate yet truthful, providing hope while being realistic about karmic patterns. Structure your response as a traditional Vedic consultation would be given.

Begin with "पुत्र/पुत्री" (Son/Daughter) and maintain the respectful, wise tone of an ancient sage sharing divine knowledge.`;

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
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 3000,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', data);

    const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      'पुत्र/पुत्री, इस समय मैं आपके प्रश्न का उत्तर नहीं दे सकता। कृपया बाद में प्रयास करें। / Dear child, I cannot answer your question at this moment. Please try again later.';

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in kundali-ai-analysis function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      analysis: 'पुत्र/पुत्री, क्षमा करें। तकनीकी समस्या के कारण मैं इस समय आपकी सहायता नहीं कर सकता। कृपया बाद में पुनः प्रयास करें। / Dear child, I apologize. Due to technical issues, I cannot assist you at this moment. Please try again later.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper function for ordinal numbers
function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}
