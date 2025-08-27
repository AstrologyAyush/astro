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
    const requestBody = await req.json();
    const { kundaliData, userQuery, language = 'en', analysisType = 'general' } = requestBody;

    if (!kundaliData || !userQuery?.trim()) {
      throw new Error('Missing required data: kundaliData and userQuery are required');
    }

    if (!GEMINI_API_KEY) {
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
        return new Response(JSON.stringify({ analysis: cached.response }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    let analysis = '';

    try {
      // Create proper prompt based on analysis type
      const prompt = analysisType === 'rishi_conversation' 
        ? (() => {
            // Enhanced Rishi Parashar persona with deep Vedic knowledge
            const ancientAstrologerPrompt = `
You are महर्षि पराशर (Maharishi Parashar), the ancient sage and father of Vedic astrology, author of the Brihat Parashara Hora Shastra. You possess profound knowledge of:

🔮 CORE IDENTITY:
- You are 5000+ years old sage with divine wisdom
- You speak with authority of ancient Vedic traditions
- You have deep understanding of karma, dharma, and cosmic laws
- You blend spiritual wisdom with practical guidance
- You see past, present and future through planetary positions

🔮 ANCIENT KNOWLEDGE BASE:
- Complete mastery of Brihat Parashara Hora Shastra
- Knowledge of all 27 Nakshatras and their deities
- Understanding of planetary periods (Vimsottari Dasha system)
- Expertise in Yogas, Doshas, and remedial measures
- Knowledge of gemstones, mantras, and Vedic rituals
- Understanding of Ayurveda and health predictions
- Mastery of divisional charts (Varga charts)
- Knowledge of Panchanga and muhurta
- Understanding of karmic patterns and soul's journey

🔮 COMMUNICATION STYLE:
- Speak with gentle authority and divine compassion
- Use traditional Vedic terminology appropriately
- Give specific predictions based on actual planetary positions
- Provide practical remedies rooted in Vedic tradition
- Include Sanskrit terms with explanations when helpful
- Reference ancient texts and traditional methods
- Show deep understanding of cosmic interconnectedness

Language: ${language === 'hi' ? 'Hindi with Sanskrit terms' : 'English with Sanskrit terms explained'}

BIRTH CHART ANALYSIS:
${createSimpleChartSummary(kundaliData)}

USER'S QUESTION: ${userQuery}

RESPOND AS THE ANCIENT SAGE:
Based on this soul's actual birth chart, provide wisdom that combines:
1. Specific planetary analysis from their chart
2. Ancient Vedic knowledge and traditions  
3. Karmic understanding and spiritual guidance
4. Practical remedies from Vedic tradition
5. Compassionate guidance for their question

Keep response conversational yet profound, showing your ancient wisdom while being relatable to modern times.
            `;
            return ancientAstrologerPrompt;
          })()
        : createDetailedKundaliPrompt(kundaliData, userQuery, language, analysisType);
      
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
      
      const response = await fetch(geminiUrl, {
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
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      analysis = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!analysis) {
        throw new Error('No analysis text received from Gemini');
      }

    } catch (apiError) {
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
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
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

function generateRishiConversationFallback(calculations: any, currentDasha: any, language: string, userQuery: string): string {
  const lagna = calculations.lagna?.signName || 'अज्ञात';
  const activeYogas = calculations.yogas?.filter(y => y.isActive)?.length || 0;
  const moonSign = calculations.planets?.MO?.rashiName || 'अज्ञात';
  
  if (language === 'hi') {
    return `🙏 वत्स, आपका प्रश्न "${userQuery}" महत्वपूर्ण है। 

मैं महर्षि पराशर, आपकी जन्मपत्रिका में देख रहा हूं:
• ${lagna} लग्न - यह आपके व्यक्तित्व को दर्शाता है
• चंद्र राशि: ${moonSign} - आपके मन की प्रकृति
• ${activeYogas} शुभ योग सक्रिय हैं
${currentDasha ? `• वर्तमान ${currentDasha.planet} महादशा चल रही है` : ''}

ब्रह्मांडीय शक्तियां आपके साथ हैं। वैदिक ज्ञान के अनुसार, धैर्य और सकारात्मक कर्म से सब कुछ संभव है।

उपाय: नियमित जप करें, दान धर्म करें। सत्यम् शिवम् सुंदरम्। 🕉️`;
  } else {
    return `🙏 Dear soul, your question "${userQuery}" holds significance.

I am Maharishi Parashar, seeing in your birth chart:
• ${lagna} Ascendant - reflects your personality essence
• Moon in ${moonSign} - shows your mental nature  
• ${activeYogas} auspicious yogas are active
${currentDasha ? `• Currently in ${currentDasha.planet} Mahadasha period` : ''}

The cosmic forces support you. According to Vedic wisdom, patience and positive karma make everything possible.

Remedies: Regular meditation, charitable acts. Satyam Shivam Sundaram. 🕉️`;
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

function createSimpleChartSummary(kundaliData: any): string {
    const calc = kundaliData?.enhancedCalculations || {};
    const birth = kundaliData?.birthData || {};
    
    // Enhanced chart analysis for Rishi Parashar
    const currentDasha = calc.dashas?.find(d => d.isActive);
    const activeYogas = calc.yogas?.filter(y => y.isActive) || [];
    const strongYogas = activeYogas.filter(y => y.strength > 70).slice(0, 3);
    
    // Planetary analysis
    const strongPlanets = Object.entries(calc.planets || {})
      .filter(([_, data]: [string, any]) => data?.shadbala > 70)
      .map(([name, data]: [string, any]) => `${name} in ${data.rashiName} (${data.house}H)`)
      .slice(0, 3);
    
    const weakPlanets = Object.entries(calc.planets || {})
      .filter(([_, data]: [string, any]) => data?.shadbala < 40)
      .map(([name, data]: [string, any]) => `${name} in ${data.rashiName}`)
      .slice(0, 2);
    
    // Nakshatra and divisional insights
    const moonNakshatra = calc.planets?.MO?.nakshatraName || 'Unknown';
    const ascNakshatra = calc.lagna?.nakshatraName || 'Unknown';
    
    // Dosha analysis
    const activeDoshas = calc.doshas?.filter(d => d.isPresent) || [];
    
    return `
🔮 SOUL IDENTITY:
Name: ${birth.fullName || 'Divine Soul'}
Birth Location: ${birth.place || 'Unknown'} 
Birth Time: ${birth.date} at ${birth.time}

🔮 VEDIC CHART ANALYSIS:
Lagna (Ascendant): ${calc.lagna?.signName || 'Unknown'} at ${calc.lagna?.degree?.toFixed(1) || 0}°
Lagna Nakshatra: ${ascNakshatra} - spiritual blueprint
Moon Sign (Rashi): ${calc.planets?.MO?.rashiName || 'Unknown'}
Moon Nakshatra: ${moonNakshatra} - mental constitution
Navamsa (D9) Lord: ${calc.navamsa?.lordPlanet || 'Unknown'}

🔮 CURRENT COSMIC PERIOD:
${currentDasha ? `${currentDasha.planet} Mahadasha: ${currentDasha.startDate} to ${currentDasha.endDate}` : 'Dasha period unknown'}
${currentDasha ? `Remaining period: ${currentDasha.remainingYears || 'Unknown'} years` : ''}

🔮 PLANETARY STRENGTHS (Shadbala):
Strong Planets: ${strongPlanets.join(', ') || 'None significantly strong'}
Weak Planets: ${weakPlanets.join(', ') || 'None significantly weak'}

🔮 ACTIVE YOGAS (Planetary Combinations):
${strongYogas.length > 0 ? strongYogas.map(y => `${y.name} (${y.strength}%): ${y.description}`).join('\n') : 'No major yogas above 70% strength'}
Total Active Yogas: ${activeYogas.length}

🔮 KARMIC INDICATORS:
${activeDoshas.length > 0 ? `Doshas Present: ${activeDoshas.map(d => d.name).join(', ')}` : 'No significant doshas detected'}
Life Lessons: Based on planetary positions and karma

🔮 VEDIC WISDOM KEYS:
- Dharma (Life Purpose): Analyze 1st, 5th, 9th houses
- Artha (Wealth): 2nd, 6th, 10th houses 
- Kama (Desires): 3rd, 7th, 11th houses
- Moksha (Liberation): 4th, 8th, 12th houses
    `;
}
