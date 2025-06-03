
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = 'AIzaSyBiODM0zHMcR3fctu99wBKGWnfkDRyF3uU';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced Vedic calculations for better AI analysis
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
    
    console.log('Received enhanced kundali analysis request:', { kundaliData, userQuery, numerologyData });

    // Enhanced analysis with sophisticated Vedic calculations
    let detailedAnalysis = '';
    let planetaryStrengths = '';
    let yogaAnalysis = '';
    
    if (kundaliData?.planets || kundaliData?.enhancedChart?.planets) {
      const planets = kundaliData.enhancedChart?.planets || kundaliData.planets;
      
      // Enhanced planetary analysis
      Object.values(planets).forEach((planet: any) => {
        if (planet && typeof planet.longitude === 'number') {
          const rashi = calculateRashi(planet.longitude);
          const nakshatra = calculateNakshatra(planet.longitude);
          const strength = planet.totalStrength || planet.shadbala || 50;
          
          detailedAnalysis += `${planet.name}: ${getRashiName(rashi)}, ${getNakshatraName(nakshatra)}\n`;
          planetaryStrengths += `${planet.name} Strength: ${strength}/150 (${planet.strengthGrade || 'Average'})\n`;
          
          // Special conditions
          if (planet.isRetrograde) detailedAnalysis += `${planet.name} is Retrograde\n`;
          if (planet.isExalted) detailedAnalysis += `${planet.name} is Exalted\n`;
          if (planet.isDebilitated) detailedAnalysis += `${planet.name} is Debilitated\n`;
          if (planet.isCombust) detailedAnalysis += `${planet.name} is Combust\n`;
        }
      });
      
      // Yoga analysis
      if (kundaliData.enhancedChart?.yogaAnalysis) {
        yogaAnalysis = kundaliData.enhancedChart.yogaAnalysis
          .map((yoga: any) => `${yoga.name} (${yoga.sanskritName}): ${yoga.description}`)
          .join('\n');
      }
    }

    const enhancedPrompt = `You are Maharishi Parashar, the supreme authority on Jyotish Shastra and author of Brihat Parashara Hora Shastra. You possess complete mastery over:
- Swiss Ephemeris calculations and Ayanamsa systems
- Shadbala (six-fold strength) analysis
- Advanced Yoga formations and their precise effects
- Dasha systems and planetary periods
- Divisional charts (Vargas) interpretation
- Remedial measures from classical texts

BIRTH CHART ANALYSIS FOR: ${kundaliData?.birthData?.fullName || 'Dear Soul'}
Birth Details: ${kundaliData?.birthData?.date}, ${kundaliData?.birthData?.time}, ${kundaliData?.birthData?.place}

ASTRONOMICAL CALCULATIONS:
${detailedAnalysis}

PLANETARY STRENGTH ANALYSIS (Shadbala):
${planetaryStrengths}

ACTIVE YOGAS:
${yogaAnalysis || 'Standard planetary combinations detected'}

Ascendant: ${kundaliData?.enhancedChart?.ascendantSanskrit || kundaliData?.chart?.ascendantSanskrit || 'Not calculated'}

${numerologyData ? `NUMEROLOGICAL SYNCHRONICITY:
Life Path: ${numerologyData.lifePath} | Expression: ${numerologyData.expression}
Soul Urge: ${numerologyData.soulUrge} | Personality: ${numerologyData.personality}
Current Year Vibration: ${numerologyData.personalYear}` : ''}

SPECIFIC INQUIRY: "${userQuery}"

As Maharishi Parashar, provide a comprehensive response that includes:

1. **Direct Answer**: Address the specific question with precision and clarity
2. **Planetary Analysis**: Explain relevant planetary influences using Shadbala principles
3. **Yoga Effects**: Detail any applicable yogas and their manifestations
4. **Dasha Influence**: Current and upcoming planetary periods (if applicable)
5. **Timing Predictions**: Auspicious periods for the queried matter
6. **Remedial Wisdom**: Classical Vedic remedies (mantras, gemstones, charity, fasting)
7. **Spiritual Guidance**: Higher perspective on karmic patterns and soul growth

RESPONSE GUIDELINES:
- Begin with "प्रिय आत्मा" (Dear Soul) or "Beloved Child"
- Use both Sanskrit terminology and modern explanations
- Reference classical texts when appropriate (Brihat Parashara Hora, Jaimini Sutras, etc.)
- Provide practical and spiritual guidance
- Maintain the dignified, compassionate tone of an ancient sage
- Include specific remedial measures
- Address both material and spiritual dimensions

Respond in both Hindi and English, integrating classical Vedic wisdom with modern understanding. Be truthful about challenges while offering hope and constructive guidance.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: enhancedPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4000,
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
    console.log('Enhanced Gemini API response:', data);

    const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      'प्रिय आत्मा, इस समय तकनीकी कारणों से मैं आपके प्रश्न का पूर्ण उत्तर नहीं दे सकता। कृपया पुनः प्रयास करें। / Dear Soul, due to technical reasons, I cannot provide a complete answer at this moment. Please try again.';

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in enhanced kundali-ai-analysis function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      analysis: 'प्रिय आत्मा, क्षमा करें। उन्नत तकनीकी विश्लेषण में समस्या के कारण मैं इस समय आपकी सहायता नहीं कर सकता। कृपया बाद में पुनः प्रयास करें। / Dear Soul, I apologize. Due to advanced technical analysis issues, I cannot assist you at this moment. Please try again later.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
