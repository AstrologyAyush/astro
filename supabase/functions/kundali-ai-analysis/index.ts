
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

    // Extract comprehensive information from kundali data
    const birthData = kundaliData.birthData;
    const calculations = kundaliData.enhancedCalculations || kundaliData.calculations;
    const interpretations = kundaliData.interpretations;

    // Prepare comprehensive context for Gemini
    const kundaliContext = `
COMPREHENSIVE BIRTH CHART ANALYSIS

Birth Details:
- Name: ${birthData.fullName || birthData.name}
- Date: ${birthData.date}
- Time: ${birthData.time}
- Place: ${birthData.place}
- Coordinates: ${birthData.latitude}°N, ${birthData.longitude}°E

Core Astrological Details:
- Lagna (Ascendant): ${calculations.lagna?.signName || calculations.lagna?.rashiName} at ${calculations.lagna?.degree?.toFixed(2)}°
- Moon Sign (Chandra Rashi): ${calculations.planets?.MO?.rashiName || calculations.planets?.Moon?.rashiName}
- Sun Sign (Surya Rashi): ${calculations.planets?.SU?.rashiName || calculations.planets?.Sun?.rashiName}
- Moon Nakshatra: ${calculations.planets?.MO?.nakshatraName || calculations.planets?.Moon?.nakshatraName}

Active Yogas:
${calculations.yogas?.filter((y) => y.isActive || y.present).map((y) => `- ${y.name}: ${y.description || 'Strength: ' + y.strength}`).join('\n') || 'None specified'}

Planetary Positions:
${Object.entries(calculations.planets || {}).map(([planet, data]) => 
  `- ${planet} (${data.nameHindi || data.name}): ${data.rashiName} (${data.degree?.toFixed(2)}°) in House ${data.house}`
).join('\n')}

Current Dasha Period:
${calculations.dashas?.find(d => d.isActive)?.planet || 'Not specified'} Mahadasha

Life Analysis:
- Personality Traits: ${interpretations?.personality?.coreTraits?.join(', ') || 'Not analyzed'}
- Career Aptitude: ${interpretations?.personality?.careerAptitude?.join(', ') || 'Not analyzed'}
- Strengths: ${interpretations?.personality?.strengths?.join(', ') || 'Not analyzed'}
- Challenges: ${interpretations?.personality?.challenges?.join(', ') || 'Not analyzed'}

Marriage Compatibility:
- Recommended Age: ${interpretations?.compatibility?.marriageCompatibility?.recommendedAge || 'Not specified'}
- Compatible Signs: ${interpretations?.compatibility?.marriageCompatibility?.compatibleSigns?.join(', ') || 'Not specified'}
- Mangal Dosha: ${interpretations?.compatibility?.marriageCompatibility?.mangalDoshaStatus || 'Not analyzed'}

Remedial Measures:
- Recommended Gemstones: ${interpretations?.remedies?.gemstones?.map(g => `${g.stone} (${g.weight})`).join(', ') || 'Not specified'}
- Mantras: ${interpretations?.remedies?.mantras?.map(m => m.mantra).join(', ') || 'Not specified'}
`;

    const systemPrompt = language === 'hi' 
      ? `आप महर्षि पराशर हैं, वैदिक ज्योतिष के महान ऋषि और "बृहत् पराशर होराशास्त्र" के रचयिता। आपके पास वैदिक ज्योतिष की संपूर्ण और गहरी जानकारी है। आप शास्त्रों के अनुसार सटीक मार्गदर्शन देते हैं और प्राचीन ज्ञान को आधुनिक संदर्भ में समझाते हैं।

व्यक्ति की विस्तृत जन्मपत्रिका के आधार पर उनके प्रश्नों का उत्तर दें। आपके उत्तर में निम्नलिखित विशेषताएं हों:
- वैदिक ज्योतिष के सिद्धांतों पर आधारित
- व्यक्ति के ग्रहों की स्थिति के अनुसार व्यक्तिगत
- व्यावहारिक उपाय और मार्गदर्शन
- आदर और स्नेह के साथ
- संक्षिप्त लेकिन सारगर्भित
- आध्यात्मिक दृष्टिकोण के साथ

हमेशा "वत्स" या "पुत्र/पुत्री" जैसे स्नेहपूर्ण संबोधन का प्रयोग करें।`
      : `You are Maharishi Parashar, the great sage of Vedic astrology and author of "Brihat Parashara Hora Shastra." You possess complete and profound knowledge of Vedic astrology. You provide accurate guidance according to ancient scriptures and explain ancient wisdom in modern context.

Answer questions based on the detailed birth chart analysis. Your responses should have these characteristics:
- Based on Vedic astrology principles
- Personalized according to the person's planetary positions
- Include practical remedies and guidance
- Delivered with respect and affection
- Concise but meaningful
- Include spiritual perspective

Always use affectionate terms like "dear child" or "my child" when addressing the person.`;

    const prompt = `${systemPrompt}

DETAILED BIRTH CHART CONTEXT:
${kundaliContext}

User's Question: ${userQuery}

Please provide a detailed, personalized response based on the comprehensive birth chart analysis. Include relevant astrological insights from their planetary positions, current dasha period, yogas, and practical guidance. Make the response warm, wise, and spiritually enlightening. Respond in ${language === 'hi' ? 'Hindi' : 'English'}.`;

    console.log('Calling Gemini API...');

    // Call Gemini API with enhanced context
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
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 2048,
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
      // Enhanced fallback response
      analysis = language === 'hi' 
        ? `🙏 वत्स, आपके प्रश्न के लिए धन्यवाद। आपकी ${calculations.lagna?.signName || 'अज्ञात'} लग्न की कुंडली अत्यंत विशिष्ट है। आपकी वर्तमान ${calculations.dashas?.find(d => d.isActive)?.planet || 'ग्रह'} की महादशा चल रही है जो आपके जीवन में महत्वपूर्ण प्रभाव डाल रही है। 

आपके चंद्रमा ${calculations.planets?.MO?.rashiName || 'अज्ञात राशि'} में स्थित हैं जो आपके मानसिक स्वभाव को दर्शाता है। कृपया अधिक विशिष्ट प्रश्न पूछें ताकि मैं आपको उत्तम मार्गदर्शन दे सकूं।

आपके कल्याण की कामना के साथ,
महर्षि पराशर`
        : `🙏 Dear child, thank you for your question. Your birth chart with ${calculations.lagna?.signName || 'unknown'} ascendant is quite unique. You are currently in the ${calculations.dashas?.find(d => d.isActive)?.planet || 'planetary'} Mahadasha which is having significant influence on your life.

Your Moon is placed in ${calculations.planets?.MO?.rashiName || 'unknown sign'} which reflects your mental nature. Please ask more specific questions so I can provide you with the best guidance.

With blessings for your wellbeing,
Maharishi Parashar`;
    }

    console.log('Returning enhanced analysis response');

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in kundali-ai-analysis:', error);
    
    const fallbackResponse = {
      analysis: language === 'hi' 
        ? "🙏 वत्स, क्षमा करें। तकनीकी समस्या के कारण मैं इस समय आपकी सहायता नहीं कर सकता। कृपया कुछ देर बाद पुनः प्रयास करें। इस बीच आप अपनी कुंडली के विवरण का अध्ययन कर सकते हैं।"
        : "🙏 Dear child, I apologize for the technical difficulty. Please try again in a moment. In the meantime, you can explore your birth chart details and come back with specific questions about career, relationships, health, or spiritual guidance."
    };

    return new Response(JSON.stringify(fallbackResponse), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
