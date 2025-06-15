
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

// Enhanced cache with longer TTL for better performance
const responseCache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { kundaliData, userQuery, language = 'en', analysisType = 'general' } = await req.json();

    console.log('Received request:', { 
      userQuery: userQuery?.substring(0, 100), 
      language, 
      analysisType,
      hasKundaliData: !!kundaliData 
    });

    if (!kundaliData || !userQuery?.trim()) {
      throw new Error('Missing required data: kundaliData and userQuery are required');
    }

    // Create enhanced cache key including analysis type
    const cacheKey = `${analysisType}_${userQuery.toLowerCase().trim()}_${language}_${kundaliData.enhancedCalculations?.lagna?.signName || 'unknown'}`;
    
    // Check cache first
    const cached = responseCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      console.log('Returning cached response');
      return new Response(JSON.stringify({ analysis: cached.response }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract comprehensive context for better analysis
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

Based on this person's ACTUAL birth chart data, current dasha periods, and planetary positions, provide:

1. **Today's Main Prediction** - Based on current dasha and planetary transits
2. **Love & Relationships** - Considering Venus position and 7th house influences  
3. **Career & Finance** - Based on 10th house, Sun, and Jupiter influences
4. **Health & Wellbeing** - Considering 6th house and current planetary aspects
5. **Lucky Elements** - Specific numbers, colors, directions based on chart
6. **Specific Guidance** - Actionable advice for today based on running dasha
7. **Cautions** - Any challenging planetary influences to be aware of

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

    let analysis = '';

    if (GEMINI_API_KEY) {
      try {
        console.log('Calling Gemini API...');
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
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
              temperature: 0.7,
              topK: 20,
              topP: 0.8,
              maxOutputTokens: 800,
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
          console.error('Gemini API error:', response.status, await response.text());
          throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        analysis = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!analysis) {
          throw new Error('No analysis text received from Gemini');
        }

        console.log('Gemini API response received successfully');

      } catch (apiError) {
        console.error('Gemini API failed, using fallback:', apiError);
        analysis = generateFallbackAnalysis(kundaliData, userQuery, language, analysisType);
      }
    } else {
      console.log('No Gemini API key, using fallback analysis');
      analysis = generateFallbackAnalysis(kundaliData, userQuery, language, analysisType);
    }

    // Cache the response
    responseCache.set(cacheKey, {
      response: analysis,
      timestamp: Date.now()
    });

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
      console.log(`Cleaned ${cleanedCount} old cache entries`);
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Edge function error:', error);
    
    const language = req.headers.get('accept-language')?.includes('hi') ? 'hi' : 'en';
    
    const fallbackResponse = {
      analysis: language === 'hi' 
        ? "🙏 मेरे पुत्र, तकनीकी समस्या आई है। आपकी कुंडली के अनुसार धैर्य रखें और पुनः प्रयास करें। ब्रह्मांड आपके साथ है। 🕉️"
        : "🙏 Dear child, a technical issue occurred. According to your chart, be patient and try again. The universe is with you. 🕉️"
    };

    return new Response(JSON.stringify(fallbackResponse), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Enhanced fallback analysis based on actual Kundali data
function generateFallbackAnalysis(kundaliData: any, userQuery: string, language: string, analysisType: string): string {
  const calculations = kundaliData.enhancedCalculations || {};
  const currentDasha = calculations.dashas?.find(d => d.isActive);
  const activeYogas = calculations.yogas?.filter(y => y.isActive) || [];
  const lagna = calculations.lagna;
  
  if (analysisType === 'daily_horoscope') {
    return generateDailyHoroscopeFallback(calculations, currentDasha, activeYogas, language);
  } else if (analysisType === 'divisional_chart') {
    return generateDivisionalChartFallback(calculations, language, userQuery);
  } else {
    return generateGeneralFallback(calculations, currentDasha, language);
  }
}

function generateDailyHoroscopeFallback(calculations: any, currentDasha: any, activeYogas: any[], language: string): string {
  const today = new Date().toLocaleDateString();
  const weekday = new Date().toLocaleDateString('en', { weekday: 'long' });
  
  if (language === 'hi') {
    return `🙏 मेरे पुत्र, आज ${today} (${weekday}) आपके लिए विशेष दिन है।

**मुख्य भविष्यवाणी**: ${currentDasha ? `वर्तमान में ${currentDasha.planet} महादशा चल रही है` : 'आपकी दशा अनुकूल है'}। ${activeYogas.length > 0 ? `आपकी कुंडली में ${activeYogas.length} शुभ योग सक्रिय हैं।` : 'धैर्य और मेहनत से काम लें।'}

**प्रेम और रिश्ते**: आज आपके रिश्तों में सामंजस्य रहेगा। ${calculations.lagna?.signName === 'Libra' ? 'तुला लग्न होने से आप स्वाभाविक रूप से संतुलन बनाने वाले हैं।' : 'प्रेम में धैर्य रखें।'}

**करियर और धन**: ${currentDasha?.planet === 'JU' ? 'गुरु दशा में करियर में वृद्धि संभव है।' : 'मेहनत का फल मिलेगा।'} आर्थिक मामलों में सोच-समझकर निर्णय लें।

**स्वास्थ्य**: आज अपने स्वास्थ्य का विशेष ध्यान रखें। ${calculations.lagna?.signName === 'Virgo' ? 'कन्या लग्न होने से आप स्वाभाविक रूप से स्वास्थ्य के प्रति सचेत हैं।' : 'संतुलित आहार लें।'}

**भाग्यशाली तत्व**: 
- संख्या: ${Math.floor(Math.random() * 9) + 1}
- रंग: ${['लाल', 'नीला', 'हरा', 'पीला', 'सफेद'][Math.floor(Math.random() * 5)]}
- दिशा: ${['पूर्व', 'पश्चिम', 'उत्तर', 'दक्षिण'][Math.floor(Math.random() * 4)]}

**आज का मार्गदर्शन**: ${activeYogas.length > 0 ? 'आपके योग आज विशेष फल देंगे।' : 'आज धैर्य और सकारात्मकता बनाए रखें।'} ध्यान और प्रार्थना करें।

मेरा आशीर्वाद आपके साथ है। 🕉️`;
  } else {
    return `🙏 Dear child, today ${today} (${weekday}) is a special day for you.

**Main Prediction**: ${currentDasha ? `Currently running ${currentDasha.planet} Mahadasha` : 'Your dasha period is favorable'}. ${activeYogas.length > 0 ? `You have ${activeYogas.length} beneficial yogas active in your chart.` : 'Work with patience and dedication.'}

**Love & Relationships**: Harmony will prevail in your relationships today. ${calculations.lagna?.signName === 'Libra' ? 'Being a Libra ascendant, you naturally bring balance to relationships.' : 'Be patient in matters of love.'}

**Career & Finance**: ${currentDasha?.planet === 'JU' ? 'Jupiter dasha brings career growth opportunities.' : 'Your hard work will bear fruit.'} Make thoughtful decisions in financial matters.

**Health**: Take special care of your health today. ${calculations.lagna?.signName === 'Virgo' ? 'As a Virgo ascendant, you naturally care for health and wellness.' : 'Maintain a balanced diet.'}

**Lucky Elements**:
- Number: ${Math.floor(Math.random() * 9) + 1}
- Color: ${['Red', 'Blue', 'Green', 'Yellow', 'White'][Math.floor(Math.random() * 5)]}
- Direction: ${['East', 'West', 'North', 'South'][Math.floor(Math.random() * 4)]}

**Today's Guidance**: ${activeYogas.length > 0 ? 'Your yogas will give special results today.' : 'Maintain patience and positivity today.'} Practice meditation and prayer.

My blessings are with you. 🕉️`;
  }
}

function generateDivisionalChartFallback(calculations: any, language: string, userQuery: string): string {
  const chartType = userQuery.match(/D(\d+)/)?.[0] || 'D1';
  
  if (language === 'hi') {
    return `🙏 मेरे पुत्र, आपके ${chartType} चार्ट का विश्लेषण:

**चार्ट विशिष्ट अंतर्दृष्टि**: इस ${chartType} चार्ट में आपके ग्रहों की स्थिति विशेष फल देती है। ${calculations.lagna?.signName ? `आपका ${calculations.lagna.signName} लग्न इस चार्ट को प्रभावित करता है।` : ''}

**योग विश्लेषण**: ${calculations.yogas?.length > 0 ? `आपकी कुंडली में कुल ${calculations.yogas.length} योग हैं, जिनमें से कुछ इस चार्ट को विशेष रूप से प्रभावित करते हैं।` : 'इस चार्ट में संतुलित ग्रह स्थिति है।'}

**व्यावहारिक मार्गदर्शन**: इस चार्ट के अनुसार आपको धैर्य और निरंतरता से काम लेना चाहिए। ${calculations.planets?.JU ? 'गुरु की कृपा आप पर है।' : 'ग्रहों की शुभ दृष्टि आप पर है।'}

**समय**: यह प्रभाव निरंतर चलता रहेगा और महत्वपूर्ण समयों में विशेष फल देगा।

**उपाय**: नियमित प्रार्थना और दान-पुण्य करें। अपने आराध्य का स्मरण रखें।

मेरा आशीर्वाद आपके साथ है। 🕉️`;
  } else {
    return `🙏 Dear child, analysis of your ${chartType} chart:

**Chart-Specific Insights**: The planetary positions in this ${chartType} chart give special results. ${calculations.lagna?.signName ? `Your ${calculations.lagna.signName} ascendant influences this chart.` : ''}

**Yoga Analysis**: ${calculations.yogas?.length > 0 ? `Your chart has ${calculations.yogas.length} yogas total, some of which specifically influence this divisional chart.` : 'This chart shows balanced planetary positions.'}

**Practical Guidance**: According to this chart, you should work with patience and consistency. ${calculations.planets?.JU ? 'Jupiter\'s blessings are upon you.' : 'Beneficial planetary aspects are supporting you.'}

**Timing**: This influence continues consistently and will give special results during important periods.

**Remedies**: Practice regular prayer and charity. Remember your chosen deity.

My blessings are with you. 🕉️`;
  }
}

function generateGeneralFallback(calculations: any, currentDasha: any, language: string): string {
  if (language === 'hi') {
    return `🙏 मेरे पुत्र, आपकी ${calculations.lagna?.signName || 'पवित्र'} लग्न कुंडली देखकर मैं समझ गया हूं। ${currentDasha ? `वर्तमान में ${currentDasha.planet} दशा चल रही है।` : ''} धैर्य रखें और अपने कर्मों पर ध्यान दें। ${calculations.yogas?.length > 0 ? `आपकी कुंडली में ${calculations.yogas.length} योग हैं जो आपको शक्ति देते हैं।` : ''} मेरा आशीर्वाद आपके साथ है। 🕉️`;
  } else {
    return `🙏 Dear child, looking at your ${calculations.lagna?.signName || 'sacred'} ascendant chart, I understand your path. ${currentDasha ? `Currently you're in ${currentDasha.planet} dasha period.` : ''} Be patient and focus on your karma. ${calculations.yogas?.length > 0 ? `Your chart has ${calculations.yogas.length} yogas that give you strength.` : ''} My blessings are with you. 🕉️`;
  }
}
