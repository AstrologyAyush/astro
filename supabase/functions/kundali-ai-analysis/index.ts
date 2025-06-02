
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = 'AIzaSyBiODM0zHMcR3fctu99wBKGWnfkDRyF3uU';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced Vedic calculations
function calculateRashi(longitude: number): number {
  return Math.floor(longitude / 30) % 12;
}

function calculateNakshatra(longitude: number): number {
  return Math.floor(longitude / (360/27)) % 27;
}

function getRashiName(rashiIndex: number): string {
  const rashiNames = [
    'Aries (मेष)', 'Taurus (वृष)', 'Gemini (मिथुन)', 'Cancer (कर्क)',
    'Leo (सिंह)', 'Virgo (कन्या)', 'Libra (तुला)', 'Scorpio (वृश्चिक)', 
    'Sagittarius (धनु)', 'Capricorn (मकर)', 'Aquarius (कुम्भ)', 'Pisces (मीन)'
  ];
  return rashiNames[rashiIndex] || 'Unknown';
}

function getNakshatraName(nakshatraIndex: number): string {
  const nakshatraNames = [
    'Ashwini (अश्विनी)', 'Bharani (भरणी)', 'Krittika (कृत्तिका)', 'Rohini (रोहिणी)',
    'Mrigashira (मृगशिरा)', 'Ardra (आर्द्रा)', 'Punarvasu (पुनर्वसु)', 'Pushya (पुष्य)',
    'Ashlesha (आश्लेषा)', 'Magha (मघा)', 'Purva Phalguni (पूर्वाफाल्गुनी)', 'Uttara Phalguni (उत्तराफाल्गुनी)',
    'Hasta (हस्त)', 'Chitra (चित्रा)', 'Swati (स्वाती)', 'Vishakha (विशाखा)',
    'Anuradha (अनुराधा)', 'Jyeshtha (ज्येष्ठा)', 'Mula (मूल)', 'Purva Ashadha (पूर्वाषाढ़ा)',
    'Uttara Ashadha (उत्तराषाढ़ा)', 'Shravana (श्रवण)', 'Dhanishta (धनिष्ठा)', 'Shatabhisha (शतभिषा)',
    'Purva Bhadrapada (पूर्वाभाद्रपद)', 'Uttara Bhadrapada (उत्तराभाद्रपद)', 'Revati (रेवती)'
  ];
  return nakshatraNames[nakshatraIndex] || 'Unknown';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { kundaliData, userQuery, numerologyData } = await req.json();
    
    console.log('Received kundali analysis request:', { kundaliData, userQuery, numerologyData });

    // Enhanced analysis with proper Vedic calculations
    let detailedAnalysis = '';
    
    if (kundaliData?.planets) {
      // Calculate Moon and Sun rashi properly
      const moonPlanet = Object.values(kundaliData.planets).find((p: any) => p.name === 'Moon' || p.name === 'MO');
      const sunPlanet = Object.values(kundaliData.planets).find((p: any) => p.name === 'Sun' || p.name === 'SU');
      
      if (moonPlanet && typeof moonPlanet.longitude === 'number') {
        const moonRashi = calculateRashi(moonPlanet.longitude);
        const moonNakshatra = calculateNakshatra(moonPlanet.longitude);
        detailedAnalysis += `Moon Rashi: ${getRashiName(moonRashi)}\n`;
        detailedAnalysis += `Moon Nakshatra: ${getNakshatraName(moonNakshatra)}\n`;
      }
      
      if (sunPlanet && typeof sunPlanet.longitude === 'number') {
        const sunRashi = calculateRashi(sunPlanet.longitude);
        detailedAnalysis += `Sun Rashi: ${getRashiName(sunRashi)}\n`;
      }
    }

    const prompt = `You are Maharishi Parashar, the ancient Vedic sage and master of Jyotish Shastra. You possess complete knowledge of all classical Vedic astrological texts and the deepest understanding of planetary influences.

Birth Chart Analysis:
Name: ${kundaliData?.birthData?.fullName || 'Child'}
Birth Details: ${kundaliData?.birthData?.date}, ${kundaliData?.birthData?.time}, ${kundaliData?.birthData?.place}

DETAILED PLANETARY ANALYSIS:
${detailedAnalysis}

Ascendant: ${kundaliData?.chart?.ascendantSanskrit || 'Not available'}
${kundaliData?.chart?.yogas ? `Active Yogas: ${kundaliData.chart.yogas.filter((y: any) => y.present).map((yoga: any) => yoga.sanskritName || yoga.name).join(', ')}` : ''}

${numerologyData ? `NUMEROLOGY PROFILE:
Life Path Number: ${numerologyData.lifePath}
Expression Number: ${numerologyData.expression}  
Soul Urge Number: ${numerologyData.soulUrge}
Personality Number: ${numerologyData.personality}
Personal Year: ${numerologyData.personalYear}` : ''}

USER'S QUERY: "${userQuery}"

As Maharishi Parashar, provide a comprehensive analysis responding to the user's query. Include:

1. Direct answer to their specific question
2. Relevant planetary influences from their chart
3. Current Dasha period effects if applicable
4. ${numerologyData ? 'Integration of numerological insights' : ''}
5. Practical remedial measures (mantras, gemstones, charity, etc.)
6. Spiritual guidance from Vedic wisdom

Respond in both Hindi and English, using classical Vedic terminology. Be compassionate yet truthful, providing hope while being realistic about karmic patterns.

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
