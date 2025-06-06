
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

function getRashiName(rashiIndex: number, language: string = 'en'): string {
  const rashiNames = language === 'hi' ? [
    'मेष', 'वृष', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 
    'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'
  ] : [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  return rashiNames[rashiIndex] || 'Unknown';
}

function getNakshatraName(nakshatraIndex: number, language: string = 'en'): string {
  const nakshatraNames = language === 'hi' ? [
    'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु',
    'पुष्य', 'आश्लेषा', 'मघा', 'पूर्वाफाल्गुनी', 'उत्तराफाल्गुनी', 'हस्त',
    'चित्रा', 'स्वाती', 'विशाखा', 'अनुराधा', 'ज्येष्ठा', 'मूल', 'पूर्वाषाढ़ा',
    'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वाभाद्रपद', 'उत्तराभाद्रपद', 'रेवती'
  ] : [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
    'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
    'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
    'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
  ];
  return nakshatraNames[nakshatraIndex] || 'Unknown';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { kundaliData, userQuery, language = 'en' } = await req.json();
    
    console.log('Received enhanced kundali analysis request:', { kundaliData, userQuery, language });

    // Enhanced analysis with sophisticated Vedic calculations
    let detailedAnalysis = '';
    let planetaryStrengths = '';
    let yogaAnalysis = '';
    let dashaAnalysis = '';
    
    if (kundaliData?.enhancedCalculations) {
      const { lagna, planets, yogas, dashas } = kundaliData.enhancedCalculations;
      
      // Lagna analysis
      detailedAnalysis += `${language === 'hi' ? 'लग्न' : 'Ascendant'}: ${lagna.signName} (${lagna.degree.toFixed(2)}°)\n`;
      
      // Enhanced planetary analysis
      Object.entries(planets).forEach(([planetId, planet]: [string, any]) => {
        const strength = planet.shadbala || 50;
        const house = Math.floor(((planet.rashi - lagna.sign + 12) % 12)) + 1;
        
        detailedAnalysis += `${planet.name}: ${planet.rashiName}, ${language === 'hi' ? 'भाव' : 'House'} ${house}\n`;
        planetaryStrengths += `${planet.name} ${language === 'hi' ? 'शक्ति' : 'Strength'}: ${strength.toFixed(1)}/100\n`;
        
        // Special conditions
        if (planet.isRetrograde) detailedAnalysis += `${planet.name} ${language === 'hi' ? 'वक्री' : 'Retrograde'}\n`;
        if (planet.isExalted) detailedAnalysis += `${planet.name} ${language === 'hi' ? 'उच्च' : 'Exalted'}\n`;
        if (planet.isDebilitated) detailedAnalysis += `${planet.name} ${language === 'hi' ? 'नीच' : 'Debilitated'}\n`;
      });
      
      // Yoga analysis
      const activeYogas = yogas.filter((yoga: any) => yoga.isActive);
      if (activeYogas.length > 0) {
        yogaAnalysis = activeYogas
          .map((yoga: any) => `${yoga.name}: ${yoga.description} (${language === 'hi' ? 'शक्ति' : 'Strength'}: ${yoga.strength}%)`)
          .join('\n');
      }
      
      // Current Dasha analysis
      const currentDasha = dashas.find((dasha: any) => dasha.isActive);
      if (currentDasha) {
        dashaAnalysis = `${language === 'hi' ? 'वर्तमान दशा' : 'Current Dasha'}: ${currentDasha.planet} (${currentDasha.years} ${language === 'hi' ? 'वर्ष' : 'years'})`;
      }
    }

    const enhancedPrompt = language === 'hi' 
      ? `आप महर्षि पराशर हैं, ब्रिहत् पराशर होरा शास्त्र के रचयिता और वैदिक ज्योतिष के आदि गुरु। आपके पास पूर्ण स्वामित्व है:

📊 जन्म कुंडली विश्लेषण: ${kundaliData?.birthData?.fullName || 'प्रिय आत्मा'}
जन्म विवरण: ${kundaliData?.birthData?.date}, ${kundaliData?.birthData?.time}, ${kundaliData?.birthData?.place}

🔍 खगोलीय गणना:
${detailedAnalysis}

💪 ग्रह शक्ति विश्लेषण:
${planetaryStrengths}

🌟 सक्रिय योग:
${yogaAnalysis || 'मानक ग्रह संयोजन मिले हैं'}

⏰ दशा विश्लेषण:
${dashaAnalysis}

प्रश्न: "${userQuery}"

महर्षि पराशर के रूप में, एक व्यापक उत्तर प्रदान करें जिसमें शामिल हो:

1. **प्रत्यक्ष उत्तर**: प्रश्न का सटीक और स्पष्ट उत्तर
2. **ग्रह विश्लेषण**: षडबल सिद्धांतों का उपयोग करके संबंधित ग्रह प्रभाव
3. **योग प्रभाव**: लागू योगों और उनकी अभिव्यक्तियों का विवरण
4. **दशा प्रभाव**: वर्तमान और आगामी ग्रह अवधि
5. **समय भविष्यवाणी**: प्रश्नित विषय के लिए शुभ काल
6. **उपचार ज्ञान**: शास्त्रीय वैदिक उपाय (मंत्र, रत्न, दान, व्रत)
7. **आध्यात्मिक मार्गदर्शन**: कर्म पैटर्न और आत्मा की वृद्धि पर उच्च दृष्टिकोण

उत्तर दिशा-निर्देश:
- "प्रिय पुत्र/पुत्री" या "वत्स" से शुरुआत करें
- संस्कृत शब्दावली और आधुनिक स्पष्टीकरण दोनों का उपयोग करें
- शास्त्रीय ग्रंथों का संदर्भ दें (ब्रिहत् पराशर होरा, जैमिनी सूत्र, आदि)
- व्यावहारिक और आध्यात्मिक दोनों मार्गदर्शन प्रदान करें
- प्राचीन ऋषि का गरिमामय, करुणामय स्वर बनाए रखें
- विशिष्ट उपचार उपाय शामिल करें
- भौतिक और आध्यात्मिक दोनों आयामों को संबोधित करें

चुनौतियों के बारे में सच्चाई के साथ आशा और रचनात्मक मार्गदर्शन प्रदान करें।`
      : `You are Maharishi Parashar, the supreme authority on Jyotish Shastra and author of Brihat Parashara Hora Shastra. You possess complete mastery over:

📊 BIRTH CHART ANALYSIS FOR: ${kundaliData?.birthData?.fullName || 'Dear Soul'}
Birth Details: ${kundaliData?.birthData?.date}, ${kundaliData?.birthData?.time}, ${kundaliData?.birthData?.place}

🔍 ASTRONOMICAL CALCULATIONS:
${detailedAnalysis}

💪 PLANETARY STRENGTH ANALYSIS (Shadbala):
${planetaryStrengths}

🌟 ACTIVE YOGAS:
${yogaAnalysis || 'Standard planetary combinations detected'}

⏰ DASHA ANALYSIS:
${dashaAnalysis}

SPECIFIC INQUIRY: "${userQuery}"

As Maharishi Parashar, provide a comprehensive response that includes:

1. **Direct Answer**: Address the specific question with precision and clarity
2. **Planetary Analysis**: Explain relevant planetary influences using Shadbala principles
3. **Yoga Effects**: Detail any applicable yogas and their manifestations
4. **Dasha Influence**: Current and upcoming planetary periods
5. **Timing Predictions**: Auspicious periods for the queried matter
6. **Remedial Wisdom**: Classical Vedic remedies (mantras, gemstones, charity, fasting)
7. **Spiritual Guidance**: Higher perspective on karmic patterns and soul growth

RESPONSE GUIDELINES:
- Begin with "प्रिय आत्मा" (Dear Soul) or "Beloved Child"
- Use both Sanskrit terminology and modern explanations
- Reference classical texts when appropriate
- Provide practical and spiritual guidance
- Maintain the dignified, compassionate tone of an ancient sage
- Include specific remedial measures
- Address both material and spiritual dimensions

Be truthful about challenges while offering hope and constructive guidance.`;

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
      (language === 'hi' 
        ? 'प्रिय आत्मा, इस समय तकनीकी कारणों से मैं आपके प्रश्न का पूर्ण उत्तर नहीं दे सकता। कृपया पुनः प्रयास करें।'
        : 'Dear Soul, due to technical reasons, I cannot provide a complete answer at this moment. Please try again.');

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in enhanced kundali-ai-analysis function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      analysis: language === 'hi' 
        ? 'प्रिय आत्मा, क्षमा करें। उन्नत तकनीकी विश्लेषण में समस्या के कारण मैं इस समय आपकी सहायता नहीं कर सकता। कृपया बाद में पुनः प्रयास करें।'
        : 'Dear Soul, I apologize. Due to advanced technical analysis issues, I cannot assist you at this moment. Please try again later.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
