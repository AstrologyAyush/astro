
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

// Simple in-memory cache for frequent responses
const responseCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { kundaliData, userQuery, language = 'en' } = await req.json();

    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    if (!kundaliData || !userQuery?.trim()) {
      throw new Error('Missing required data');
    }

    // Create cache key
    const cacheKey = `${userQuery.toLowerCase().trim()}_${language}_${kundaliData.enhancedCalculations?.lagna?.signName || 'unknown'}`;
    
    // Check cache first
    const cached = responseCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      return new Response(JSON.stringify({ analysis: cached.response }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract minimal context for faster processing
    const calculations = kundaliData.enhancedCalculations || {};
    const birthData = kundaliData.birthData || {};

    const kundaliContext = `
BIRTH: ${birthData.fullName || 'Soul'} - ${calculations.lagna?.signName || 'Unknown'} लग्न
MOON: ${calculations.planets?.MO?.rashiName || 'Unknown'} राशि
SUN: ${calculations.planets?.SU?.rashiName || 'Unknown'}
RAHU: ${calculations.planets?.RA?.rashiName || 'Unknown'}
KETU: ${calculations.planets?.KE?.rashiName || 'Unknown'}
YOGAS: ${calculations.yogas?.filter(y => y.isActive)?.length || 0} active
`;

    const systemPrompt = language === 'hi' 
      ? `आप महर्षि पराशर हैं - कर्मिक कोच। संक्षिप्त, प्रेमपूर्ण उत्तर दें (2-3 वाक्य)। "प्रिय आत्मा" से शुरू करें। कर्मिक सलाह दें।`
      : `You are Maharishi Parashar - karmic coach. Give brief, loving responses (2-3 sentences). Start with "Dear soul". Provide karmic guidance.`;

    const prompt = `${systemPrompt}

${kundaliContext}

User Question: ${userQuery}

Give focused karmic coaching guidance in ${language === 'hi' ? 'Hindi' : 'English'}.`;

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
          temperature: 0.7,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 150,
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
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    let analysis = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!analysis) {
      analysis = language === 'hi' 
        ? `🙏 प्रिय आत्मा, आपकी ${calculations.lagna?.signName || 'पवित्र'} लग्न कुंडली देखकर मैं समझ गया हूं। धैर्य रखें और अपने कर्मों पर ध्यान दें। मेरा आशीर्वाद आपके साथ है। 🕉️`
        : `🙏 Dear soul, looking at your ${calculations.lagna?.signName || 'sacred'} ascendant, I understand your path. Be patient and focus on your karma. My blessings are with you. 🕉️`;
    }

    // Cache the response
    responseCache.set(cacheKey, {
      response: analysis,
      timestamp: Date.now()
    });

    // Clean old cache entries periodically
    if (responseCache.size > 100) {
      const now = Date.now();
      for (const [key, value] of responseCache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
          responseCache.delete(key);
        }
      }
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const language = req.headers.get('accept-language')?.includes('hi') ? 'hi' : 'en';
    
    const fallbackResponse = {
      analysis: language === 'hi' 
        ? "🙏 प्रिय आत्मा, तकनीकी समस्या है। फिर कोशिश करें। ब्रह्मांड आपके साथ है। 🕉️"
        : "🙏 Dear soul, technical issue occurred. Please try again. The universe is with you. 🕉️"
    };

    return new Response(JSON.stringify(fallbackResponse), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
