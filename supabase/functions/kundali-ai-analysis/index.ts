
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { kundaliData, userQuery, language = 'en' } = await req.json();

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables');
      throw new Error('Gemini API key not configured');
    }

    if (!kundaliData) {
      throw new Error('No Kundali data provided');
    }

    console.log('Processing query:', userQuery);
    console.log('Language:', language);

    // Extract key information from kundali data
    const birthData = kundaliData.birthData;
    const calculations = kundaliData.enhancedCalculations || kundaliData.calculations;
    const interpretations = kundaliData.interpretations;

    // Prepare focused context for Gemini
    const kundaliContext = `
BIRTH CHART SUMMARY:
Name: ${birthData.fullName || birthData.name}
Birth: ${birthData.date} at ${birthData.time}, ${birthData.place}

KEY ASTROLOGICAL DATA:
- Lagna (Ascendant): ${calculations.lagna?.signName || calculations.lagna?.rashiName}
- Moon Sign: ${calculations.planets?.MO?.rashiName || calculations.planets?.Moon?.rashiName}
- Sun Sign: ${calculations.planets?.SU?.rashiName || calculations.planets?.Sun?.rashiName}
- Moon Nakshatra: ${calculations.planets?.MO?.nakshatraName || calculations.planets?.Moon?.nakshatraName}

ACTIVE YOGAS: ${calculations.yogas?.filter((y) => y.isActive || y.present).map((y) => y.name).join(', ') || 'None'}

CURRENT DASHA: ${calculations.dashas?.find(d => d.isActive)?.planet || 'Not specified'}

STRENGTHS: ${interpretations?.personality?.strengths?.slice(0, 3).join(', ') || 'Not analyzed'}
CHALLENGES: ${interpretations?.personality?.challenges?.slice(0, 2).join(', ') || 'Not analyzed'}
`;

    const systemPrompt = language === 'hi' 
      ? `आप महर्षि पराशर हैं। आपको संक्षिप्त, व्यावहारिक और सटीक उत्तर देने हैं।

GUIDELINES:
- केवल 2-3 वाक्यों में उत्तर दें
- सीधे मुद्दे पर बात करें
- अनावश्यक विवरण न दें
- व्यावहारिक सलाह दें
- आधुनिक भाषा का प्रयोग करें
- "वत्स" या "पुत्र" जैसे संबोधन का प्रयोग करें

उदाहरण अच्छा उत्तर: "वत्स, आपके चंद्रमा की स्थिति से करियर में सफलता मिलेगी। अगले 6 महीने शुभ हैं।"`
      : `You are Maharishi Parashar. Give SHORT, PRACTICAL, and ACCURATE answers only.

GUIDELINES:
- Answer in 2-3 sentences maximum
- Be direct and to the point
- No unnecessary details or stories
- Give practical advice
- Use simple, modern English
- Address as "dear child" or similar

Example good answer: "Dear child, your Moon placement suggests career success. Next 6 months are favorable for new opportunities."`;

    const prompt = `${systemPrompt}

BIRTH CHART DATA:
${kundaliContext}

User's Question: ${userQuery}

Give a SHORT, practical answer based on their chart. Maximum 2-3 sentences. No long explanations.`;

    console.log('Calling Gemini API...');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
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
          temperature: 0.3,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 150, // Reduced for shorter responses
          candidateCount: 1,
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

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API response received');
    
    let analysis = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!analysis) {
      console.log('No analysis received from Gemini, using fallback');
      analysis = language === 'hi' 
        ? `🙏 वत्स, आपके ${calculations.lagna?.signName || 'अज्ञात'} लग्न के अनुसार यह समय अच्छा है। धैर्य रखें और कर्म करते रहें।`
        : `🙏 Dear child, according to your ${calculations.lagna?.signName || 'chart'} ascendant, this is a favorable time. Stay patient and keep working.`;
    }

    console.log('Returning concise analysis response');

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in kundali-ai-analysis:', error);
    
    const fallbackResponse = {
      analysis: language === 'hi' 
        ? "🙏 वत्स, तकनीकी समस्या है। कुछ देर बाद पुनः प्रयास करें।"
        : "🙏 Dear child, there's a technical issue. Please try again in a moment."
    };

    return new Response(JSON.stringify(fallbackResponse), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
