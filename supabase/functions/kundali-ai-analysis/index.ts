import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

console.log('🔥 EDGE DEBUG: Edge function starting with enhanced debugging v2...');
console.log('🔥 EDGE DEBUG: GEMINI_API_KEY exists:', !!GEMINI_API_KEY);
console.log('🔥 EDGE DEBUG: GEMINI_API_KEY length:', GEMINI_API_KEY?.length || 0);
console.log('🔥 EDGE DEBUG: GEMINI_API_KEY first 10 chars:', GEMINI_API_KEY?.substring(0, 10) || 'NONE');
console.log('🔥 EDGE DEBUG: Available env vars:', Object.keys(Deno.env.toObject()));
console.log('🔥 EDGE DEBUG: Function deployed and ready to receive requests');

// Enhanced cache with longer TTL for better performance
const responseCache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

serve(async (req) => {
  console.log('🔥 EDGE DEBUG: Request received, method:', req.method);
  
  if (req.method === 'OPTIONS') {
    console.log('🔥 EDGE DEBUG: Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔥 EDGE DEBUG: Processing request...');
    
    const requestBody = await req.json();
    console.log('🔥 EDGE DEBUG: Request body keys:', Object.keys(requestBody));
    
    const { kundaliData, userQuery, language = 'en', analysisType = 'general' } = requestBody;

    console.log('🔥 EDGE DEBUG: Received request:', { 
      userQuery: userQuery?.substring(0, 100), 
      language, 
      analysisType,
      hasKundaliData: !!kundaliData,
      hasGeminiKey: !!GEMINI_API_KEY
    });

    if (!kundaliData || !userQuery?.trim()) {
      console.error('🔥 EDGE DEBUG: Missing required data:', { hasKundaliData: !!kundaliData, hasUserQuery: !!userQuery });
      throw new Error('Missing required data: kundaliData and userQuery are required');
    }

    if (!GEMINI_API_KEY) {
      console.error('🔥 EDGE DEBUG: GEMINI_API_KEY not found in environment variables');
      console.log('🔥 EDGE DEBUG: Available env vars:', Object.keys(Deno.env.toObject()));
      
      return new Response(JSON.stringify({ 
        analysis: generateFallbackAnalysis(kundaliData, userQuery, language, analysisType)
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create enhanced cache key including analysis type
    const cacheKey = `${analysisType}_${userQuery.toLowerCase().trim()}_${language}_${kundaliData.enhancedCalculations?.lagna?.signName || 'unknown'}`;
    
    // Check cache first for non-conversation types
    if (analysisType !== 'rishi_conversation') {
      const cached = responseCache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
        console.log('🔥 EDGE DEBUG: Returning cached response');
        return new Response(JSON.stringify({ analysis: cached.response }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    let analysis = '';

    try {
      console.log('🔥 EDGE DEBUG: Calling Gemini API...');
      
      // Create proper prompt based on analysis type
      const prompt = analysisType === 'rishi_conversation' 
        ? createRishiConversationPrompt(kundaliData, userQuery, language, requestBody.imageData)
        : createDetailedKundaliPrompt(kundaliData, userQuery, language, analysisType);
      
      console.log('🔥 EDGE DEBUG: Generated prompt length:', prompt.length);
      console.log('🔥 EDGE DEBUG: Prompt preview:', prompt.substring(0, 200) + '...');
      
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
      console.log('🔥 EDGE DEBUG: Gemini URL:', geminiUrl.replace(GEMINI_API_KEY, '[HIDDEN]'));
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout
      
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify((() => {
          const requestContent: any = {
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: analysisType === 'rishi_conversation' ? 0.7 : 0.7,
              topK: analysisType === 'rishi_conversation' ? 20 : 40,
              topP: analysisType === 'rishi_conversation' ? 0.8 : 0.95,
              maxOutputTokens: analysisType === 'rishi_conversation' ? 400 : 2048,
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
          };

          // Add image data if provided for Rishi conversations
          if (requestBody.imageData && analysisType === 'rishi_conversation') {
            console.log('🔥 EDGE DEBUG: Adding image data to request');
            // Remove data URL prefix if present
            const base64Image = requestBody.imageData.replace(/^data:image\/[^;]+;base64,/, '');
            
            requestContent.contents[0].parts.push({
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image
              }
            });
          }

          return requestContent;
        })()),
      });
      
      clearTimeout(timeoutId);

      console.log('🔥 EDGE DEBUG: Gemini response status:', response.status);
      console.log('🔥 EDGE DEBUG: Gemini response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔥 EDGE DEBUG: Gemini API error:', response.status, errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('🔥 EDGE DEBUG: Gemini API response structure keys:', Object.keys(data));
      console.log('🔥 EDGE DEBUG: Candidates length:', data.candidates?.length);
      
      analysis = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!analysis) {
        console.error('🔥 EDGE DEBUG: No analysis text received from Gemini:', JSON.stringify(data, null, 2));
        throw new Error('No analysis text received from Gemini');
      }

      console.log('🔥 EDGE DEBUG: Gemini API response received successfully, length:', analysis.length);
      console.log('🔥 EDGE DEBUG: Analysis preview:', analysis.substring(0, 200) + '...');

    } catch (apiError) {
      console.error('🔥 EDGE DEBUG: Gemini API failed, using fallback:', apiError);
      console.error('🔥 EDGE DEBUG: API Error details:', apiError.message);
      console.error('🔥 EDGE DEBUG: API Error name:', apiError.name);
      
      if (apiError.name === 'AbortError') {
        console.error('🔥 EDGE DEBUG: Request was aborted due to timeout');
      }
      
      analysis = generateFallbackAnalysis(kundaliData, userQuery, language, analysisType);
    }

    // Cache the response (except for conversations)
    if (analysisType !== 'rishi_conversation') {
      responseCache.set(cacheKey, {
        response: analysis,
        timestamp: Date.now()
      });
    }

    // Clean old cache entries periodically
    if (responseCache.size > 200) {
      const now = Date.now();
      let cleanedCount = 0;
      for (const [key, value] of responseCache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
          responseCache.delete(key);
          cleanedCount++;
        }
      }
      console.log('🔥 EDGE DEBUG: Cleaned', cleanedCount, 'old cache entries');
    }

    console.log('🔥 EDGE DEBUG: Returning successful response');
    return new Response(JSON.stringify({ 
      analysis,
      status: analysis.includes('तकनीकी समस्या') || analysis.includes('technical issue') ? 'fallback' : 'success',
      source: analysis.includes('🙏') ? 'fallback' : 'gemini'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('🔥 EDGE DEBUG: Edge function error:', error);
    console.error('🔥 EDGE DEBUG: Error message:', error.message);
    console.error('🔥 EDGE DEBUG: Error stack:', error.stack);
    
    const language = req.headers.get('accept-language')?.includes('hi') ? 'hi' : 'en';
    
    const fallbackResponse = {
      analysis: language === 'hi' 
        ? "🙏 मेरे पुत्र, तकनीकी समस्या आई है। आपकी कुंडली के अनुसार धैर्य रखें और पुनः प्रयास करें। ब्रह्मांड आपके साथ है। 🕉️"
        : "🙏 Dear child, a technical issue occurred. According to your chart, be patient and try again. The universe is with you. 🕉️",
      status: 'error',
      source: 'fallback'
    };

    return new Response(JSON.stringify(fallbackResponse), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function createDetailedKundaliPrompt(kundaliData: any, userQuery: string, language: string, analysisType: string): string {
  const calculations = kundaliData.enhancedCalculations || {};
  const birthData = kundaliData.birthData || {};
  
  // Get current dasha information
  const currentDasha = calculations.dashas?.find(d => d.isActive);
  const activeDashas = calculations.dashas?.filter(d => d.isActive) || [];
  
  // Get active yogas with their strengths
  const activeYogas = calculations.yogas?.filter(y => y.isActive) || [];
  const strongYogas = activeYogas.filter(y => y.strength > 60);
  
  // Get planetary strengths
  const planetaryStrengths = {};
  if (calculations.planets) {
    Object.entries(calculations.planets).forEach(([planet, data]: [string, any]) => {
      if (data && typeof data.shadbala === 'number') {
        planetaryStrengths[planet] = {
          shadbala: data.shadbala,
          house: data.house,
          sign: data.rashiName,
          isExalted: data.isExalted,
          isDebilitated: data.isDebilitated,
          isRetrograde: data.isRetrograde
        };
      }
    });
  }

  const enhancedKundaliContext = `
BIRTH DETAILS: ${birthData.fullName || 'Soul'} born ${birthData.date} at ${birthData.time} in ${birthData.place}
LAGNA: ${calculations.lagna?.signName || 'Unknown'} लग्न at ${calculations.lagna?.degree?.toFixed(2) || 0}°
NAKSHATRA: ${calculations.lagna?.nakshatraName || 'Unknown'}

PLANETARY POSITIONS:
${Object.entries(calculations.planets || {}).map(([planet, data]: [string, any]) => {
  if (!data) return '';
  return `${planet}: ${data.rashiName || 'Unknown'} ${data.degree?.toFixed(1) || 0}° House-${data.house || 0} ${data.isRetrograde ? '[R]' : ''} ${data.isExalted ? '[Exalted]' : data.isDebilitated ? '[Debilitated]' : ''}`;
}).filter(Boolean).join('\n')}

CURRENT DASHA PERIODS:
${activeDashas.map(d => `${d.planet}: ${d.startDate} to ${d.endDate} ${d.isActive ? '[ACTIVE]' : ''}`).join('\n')}

ACTIVE YOGAS (${activeYogas.length}):
${strongYogas.map(y => `${y.name} (${y.strength}% strength): ${y.description}`).join('\n')}

PLANETARY STRENGTHS:
${Object.entries(planetaryStrengths).map(([planet, data]: [string, any]) => 
  `${planet}: ${data.shadbala}/100 in ${data.sign} (House ${data.house})`
).join('\n')}
`;

  let systemPrompt = '';
  let enhancedPrompt = '';

  // Create analysis-type specific prompts
  if (analysisType === 'daily_horoscope') {
    systemPrompt = language === 'hi' 
      ? `आप महर्षि पराशर हैं - दैनिक राशिफल विशेषज्ञ। व्यक्तिगत कुंडली डेटा के आधार पर आज के लिए विस्तृत, व्यक्तिगत भविष्यवाणी दें। वर्तमान दशा काल, ग्रह गोचर और सक्रिय योगों का विश्लेषण करें।`
      : `You are Maharishi Parashar - daily horoscope expert. Provide detailed, personalized predictions for today based on individual Kundali data. Analyze current dasha periods, planetary transits, and active yogas.`;
    
    enhancedPrompt = `${systemPrompt}

${enhancedKundaliContext}

Today's Date: ${new Date().toLocaleDateString()}
Current Weekday: ${new Date().toLocaleDateString('en', { weekday: 'long' })}

User Request: ${userQuery}

Based on this person's ACTUAL birth chart data, current dasha periods, and planetary positions, provide a comprehensive daily horoscope with these sections:

Main Prediction: [Today's main forecast based on their chart]
Love: [Love and relationships guidance]  
Career: [Career and work insights]
Health: [Health advice based on 6th house and planetary influences]
Finance: [Financial guidance]
Lucky Numbers: [3 numbers based on their planetary positions]
Lucky Colors: [2 colors that enhance their energy today]
Lucky Direction: [Most auspicious direction]
Auspicious Time: [Best time period for important activities]
Challenges: [Potential obstacles to be aware of]
Remedies: [Specific remedies based on their chart - separate with | character]

Make predictions specific to their chart data, not generic. Use their actual planetary positions, current dasha period, and active yogas.
Respond in ${language === 'hi' ? 'Hindi' : 'English'} with warmth and practical guidance.`;

  } else if (analysisType === 'divisional_chart') {
    systemPrompt = language === 'hi' 
      ? `आप वैदिक ज्योतिष के विभागीय चार्ट विशेषज्ञ हैं। इस व्यक्ति के विशिष्ट चार्ट का गहरा विश्लेषण करें।`
      : `You are a Vedic astrology divisional chart expert. Provide deep analysis of this person's specific chart.`;
    
    enhancedPrompt = `${systemPrompt}

${enhancedKundaliContext}

User Request: ${userQuery}

Provide detailed analysis focusing on:
1. **Chart-Specific Insights** - How planets in this chart affect the life area
2. **Yoga Analysis** - Any special yogas formed in this divisional chart
3. **Planetary Dignity** - Strength/weakness of planets in this chart
4. **Practical Guidance** - Real-world implications and advice
5. **Timing** - When these influences will be most active
6. **Remedies** - Specific measures to enhance positive effects

Be specific to their actual planetary positions. Avoid generic statements.
Respond in ${language === 'hi' ? 'Hindi' : 'English'} with practical insights.`;

  } else {
    // General analysis
    systemPrompt = language === 'hi' 
      ? `आप महर्षि पराशर हैं - कुंडली विशेषज्ञ। इस व्यक्ति के वास्तविक ग्रह डेटा के आधार पर गहन विश्लेषण दें।`
      : `You are Maharishi Parashar - Kundali expert. Provide deep analysis based on this person's actual planetary data.`;
    
    enhancedPrompt = `${systemPrompt}

${enhancedKundaliContext}

User Request: ${userQuery}

Provide personalized insights based on their actual chart data. Be specific and practical.
Respond in ${language === 'hi' ? 'Hindi' : 'English'} with loving guidance.`;
  }

  return enhancedPrompt;
}

// Enhanced fallback analysis based on actual Kundali data
function generateFallbackAnalysis(kundaliData: any, userQuery: string, language: string, analysisType: string): string {
  const calculations = kundaliData.enhancedCalculations || {};
  const currentDasha = calculations.dashas?.find(d => d.isActive);
  const activeYogas = calculations.yogas?.filter(y => y.isActive) || [];
  const lagna = calculations.lagna;
  
  console.log('Generating fallback analysis for:', { analysisType, language, hasCurrentDasha: !!currentDasha });
  
  if (analysisType === 'rishi_conversation') {
    return generateRishiConversationFallback(calculations, currentDasha, language, userQuery);
  } else if (analysisType === 'daily_horoscope') {
    return generateDailyHoroscopeFallback(calculations, currentDasha, activeYogas, language);
  } else if (analysisType === 'divisional_chart') {
    return generateDivisionalChartFallback(calculations, language, userQuery);
  } else {
    return generateGeneralFallback(calculations, currentDasha, language);
  }
}

function createRishiConversationPrompt(kundaliData: any, userQuery: string, language: string, imageData?: string): string {
  const calculations = kundaliData.enhancedCalculations || {};
  const birthData = kundaliData.birthData || {};
  const currentDasha = calculations.dashas?.find(d => d.isActive);
  const activeYogas = calculations.yogas?.filter(y => y.isActive) || [];
  const strongYogas = activeYogas.filter(y => y.strength > 60);

  // Create detailed chart summary for Rishi
  const chartSummary = `
NATIVE: ${birthData.fullName} - ${calculations.lagna?.signName || 'Unknown'} Ascendant at ${calculations.lagna?.degree?.toFixed(1)}°
CURRENT DASHA: ${currentDasha ? `${currentDasha.planet} Mahadasha (${currentDasha.startDate} to ${currentDasha.endDate})` : 'Unknown period'}
MOON SIGN: ${calculations.planets?.MO?.rashiName || 'Unknown'} (Nakshatra: ${calculations.planets?.MO?.nakshatraName || 'Unknown'})
POWERFUL YOGAS: ${strongYogas.map(y => `${y.name} (${y.strength}%)`).join(', ') || 'None strong'}
KEY PLANETS: ${Object.entries(calculations.planets || {}).filter(([_, data]: [string, any]) => data?.isExalted || data?.isDebilitated || (data?.shadbala && data.shadbala > 80)).map(([planet, data]: [string, any]) => `${planet} in ${data.rashiName} ${data.isExalted ? '[EXALTED]' : data.isDebilitated ? '[DEBILITATED]' : '[STRONG]'}`).join(', ') || 'Balanced chart'}`;

  return language === 'hi' 
    ? `मैं ऋषि पराशर हूं - वैदिक ज्योतिष के महान आचार्य। मुझसे पूछा गया: "${userQuery}". इस व्यक्ति की कुंडली: ${chartSummary}. ${imageData ? 'मैं उनकी भेजी गई छवि को भी देख और समझ सकता हूं।' : ''} मुझे अत्यंत संक्षिप्त (2-3 वाक्य), व्यक्तिगत, और उनके ग्रहों की वास्तविक स्थितियों के आधार पर सटीक उत्तर देना है। विशिष्ट महादशा, योग, और ग्रह स्थितियों का उल्लेख करते हुए व्यावहारिक सलाह देनी है।`
    : `I am Rishi Parashar - the great sage of Vedic astrology. Asked: "${userQuery}". This person's chart: ${chartSummary}. ${imageData ? 'I can also see and understand the image they shared.' : ''} I must give extremely concise (2-3 sentences), personal, accurate guidance based on their actual planetary positions. Must mention specific dasha periods, yogas, and planetary placements while giving practical advice.`;
}

function createSimpleChartSummary(kundaliData: any): string {
  const calculations = kundaliData.enhancedCalculations || {};
  const currentDasha = calculations.dashas?.find(d => d.isActive);
  return `${calculations.lagna?.signName || 'Unknown'} ascendant, ${currentDasha ? `${currentDasha.planet} period` : 'stable period'}`;
}

function generateRishiConversationFallback(calculations: any, currentDasha: any, language: string, userQuery: string): string {
  const lagna = calculations.lagna?.signName || 'Unknown';
  const activeYogas = calculations.yogas?.filter(y => y.isActive) || [];
  const strongYogas = activeYogas.filter(y => y.strength > 60);
  
  // Analyze the question for specific guidance
  const questionLower = userQuery.toLowerCase();
  let specificGuidance = '';
  
  if (questionLower.includes('marriage') || questionLower.includes('विवाह') || questionLower.includes('शादी')) {
    specificGuidance = language === 'hi' 
      ? `आपके ${lagna} लग्न और ${currentDasha ? `${currentDasha.planet} महादशा` : 'वर्तमान समय'} में विवाह के योग बन रहे हैं।`
      : `Your ${lagna} ascendant and ${currentDasha ? `${currentDasha.planet} period` : 'current time'} shows marriage possibilities.`;
  } else if (questionLower.includes('career') || questionLower.includes('job') || questionLower.includes('करियर')) {
    specificGuidance = language === 'hi'
      ? `${currentDasha ? `${currentDasha.planet} महादशा` : 'वर्तमान काल'} में करियर की संभावनाएं बेहतर हैं।`
      : `${currentDasha ? `${currentDasha.planet} period` : 'Current time'} brings better career prospects.`;
  }

  if (language === 'hi') {
    return `🙏 ${specificGuidance || `आपका ${lagna} लग्न देखकर`} ${strongYogas.length > 0 ? `आपकी कुंडली में ${strongYogas.length} प्रबल योग हैं जो` : ''} आपको सफलता दिलाएंगे। ${currentDasha ? `वर्तमान ${currentDasha.planet} काल` : 'यह समय'} अनुकूल है। धैर्य रखें। 🕉️`;
  } else {
    return `🙏 ${specificGuidance || `Looking at your ${lagna} ascendant`} ${strongYogas.length > 0 ? `with ${strongYogas.length} strong yogas` : ''} shows positive outcomes. ${currentDasha ? `This ${currentDasha.planet} period` : 'Current time'} is favorable. Be patient. 🕉️`;
  }
}

function generateDailyHoroscopeFallback(calculations: any, currentDasha: any, activeYogas: any[], language: string): string {
  const today = new Date().toLocaleDateString();
  const weekday = new Date().toLocaleDateString('en', { weekday: 'long' });
  
  if (language === 'hi') {
    return `🙏 मेरे पुत्र, आज ${today} (${weekday}) आपके लिए विशेष दिन है।

Main Prediction: ${currentDasha ? `वर्तमान में ${currentDasha.planet} महादशा चल रही है` : 'आपकी दशा अनुकूल है'}। ${activeYogas.length > 0 ? `आपकी कुंडली में ${activeYogas.length} शुभ योग सक्रिय हैं।` : 'धैर्य और मेहनत से काम लें।'}

Love: आज आपके रिश्तों में सामंजस्य रहेगा। ${calculations.lagna?.signName === 'Libra' ? 'तुला लग्न होने से आप स्वाभाविक रूप से संतुलन बनाने वाले हैं।' : 'प्रेम में धैर्य रखें।'}

Career: ${currentDasha?.planet === 'JU' ? 'गुरु दशा में करियर में वृद्धि संभव है।' : 'मेहनत का फल मिलेगा।'} आर्थिक मामलों में सोच-समझकर निर्णय लें।

Health: आज अपने स्वास्थ्य का विशेष ध्यान रखें। ${calculations.lagna?.signName === 'Virgo' ? 'कन्या लग्न होने से आप स्वाभाविक रूप से स्वास्थ्य के प्रति सचेत हैं।' : 'संतुलित आहार लें।'}

Finance: आज वित्तीय मामलों में सावधानी बरतें। ${currentDasha?.planet === 'JU' ? 'गुरु की कृपा से लाभ संभव है।' : 'खर्च पर नियंत्रण रखें।'}

Lucky Numbers: 3,7,9
Lucky Colors: नीला,हरा
Lucky Direction: पूर्व
Auspicious Time: सुबह 6-8 बजे
Challenges: मामूली देरी संभव है, धैर्य रखें।
Remedies: ॐ नमः शिवाय का जप करें|जरूरतमंदों को भोजन दान करें|शाम को दीपक जलाएं

मेरा आशीर्वाद आपके साथ है। 🕉️`;
  } else {
    return `🙏 Dear child, today ${today} (${weekday}) is a special day for you.

Main Prediction: ${currentDasha ? `Currently running ${currentDasha.planet} Mahadasha` : 'Your dasha period is favorable'}. ${activeYogas.length > 0 ? `You have ${activeYogas.length} beneficial yogas active in your chart.` : 'Work with patience and dedication.'}

Love: Harmony in relationships today. ${calculations.lagna?.signName === 'Libra' ? 'Being a Libra ascendant, you naturally bring balance.' : 'Be patient in love matters.'}

Career: ${currentDasha?.planet === 'JU' ? 'Jupiter dasha brings career growth opportunities.' : 'Hard work will bring results.'} Make thoughtful decisions in financial matters.

Health: Take special care of your health today. ${calculations.lagna?.signName === 'Virgo' ? 'Being a Virgo ascendant, you are naturally health-conscious.' : 'Maintain a balanced diet.'}

Finance: Be cautious in financial matters today. ${currentDasha?.planet === 'JU' ? 'Jupiter\'s grace may bring profits.' : 'Control your expenses.'}

Lucky Numbers: 3,7,9
Lucky Colors: Blue,Green
Lucky Direction: East
Auspicious Time: 6-8 AM
Challenges: Minor delays possible, stay patient.
Remedies: Chant Om Namah Shivaya|Donate food to needy|Light a lamp in evening

My blessings are with you. 🕉️`;
  }
}

function generateDivisionalChartFallback(calculations: any, language: string, userQuery: string): string {
  if (language === 'hi') {
    return `🙏 पुत्र, आपकी कुंडली के विभागीय चार्ट के बारे में आपका प्रश्न "${userQuery}" महत्वपूर्ण है। ${calculations.lagna?.signName ? `आपका ${calculations.lagna.signName} लग्न` : 'आपकी मुख्य कुंडली'} के आधार पर विभागीय चार्ट का विश्लेषण करते हुए मैं कह सकता हूं कि यह जीवन के विशिष्ट क्षेत्रों में गहरी अंतर्दृष्टि प्रदान करता है। धैर्य रखें और सकारात्मक कार्य करते रहें। 🕉️`;
  } else {
    return `🙏 Dear child, your question "${userQuery}" about divisional charts is important. Based on your ${calculations.lagna?.signName ? `${calculations.lagna.signName} ascendant` : 'main chart'}, divisional chart analysis provides deep insights into specific life areas. Stay patient and continue positive actions. 🕉️`;
  }
}

function generateGeneralFallback(calculations: any, currentDasha: any, language: string): string {
  if (language === 'hi') {
    return `🙏 पुत्र, ${calculations.lagna?.signName ? `आपका ${calculations.lagna.signName} लग्न` : 'आपकी कुंडली'} देखकर मैं कह सकता हूं कि ${currentDasha ? `वर्तमान ${currentDasha.planet} दशा में` : 'इस समय'} आपको धैर्य और सकारात्मक विचारों की आवश्यकता है। आपके जीवन में सुख-समृद्धि आएगी। नियमित पूजा-पाठ और सेवा करते रहें। मेरा आशीर्वाद आपके साथ है। 🕉️`;
  } else {
    return `🙏 Dear child, looking at your ${calculations.lagna?.signName ? `${calculations.lagna.signName} ascendant` : 'birth chart'}, I can say that ${currentDasha ? `in the current ${currentDasha.planet} dasha` : 'at this time'} you need patience and positive thoughts. Happiness and prosperity will come into your life. Continue regular worship and service. My blessings are with you. 🕉️`;
  }
}
