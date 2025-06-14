
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

    console.log('Edge Function: Received request with data:', {
      hasKundaliData: !!kundaliData,
      userQuery,
      language,
      kundaliDataKeys: kundaliData ? Object.keys(kundaliData) : []
    });

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables');
      throw new Error('Gemini API key not configured');
    }

    if (!kundaliData) {
      throw new Error('No Kundali data provided');
    }

    console.log('Processing karmic coaching query:', userQuery);
    console.log('Language:', language);

    // Extract key information from kundali data with safe fallbacks
    const birthData = kundaliData.birthData || {};
    const calculations = kundaliData.enhancedCalculations || kundaliData.calculations || {};
    const interpretations = kundaliData.interpretations || {};

    console.log('Extracted data:', {
      birthData: Object.keys(birthData),
      calculations: Object.keys(calculations),
      interpretations: Object.keys(interpretations)
    });

    // Prepare focused context for karmic coaching with safe property access
    const kundaliContext = `
SOUL'S BIRTH CHART DETAILS:
Name: ${birthData.fullName || birthData.name || 'Dear Soul'}
Birth: ${birthData.date || 'Unknown date'} at ${birthData.time || 'Unknown time'}, ${birthData.place || 'Unknown place'}

KARMIC INDICATORS:
- Soul's Path (Lagna): ${calculations.lagna?.signName || calculations.lagna?.rashiName || 'Unknown'}
- Moon's Karmic Position: ${calculations.planets?.MO?.rashiName || calculations.planets?.Moon?.rashiName || 'Unknown'}
- Sun's Life Purpose: ${calculations.planets?.SU?.rashiName || calculations.planets?.Sun?.rashiName || 'Unknown'}
- Soul Star (Nakshatra): ${calculations.planets?.MO?.nakshatraName || calculations.planets?.Moon?.nakshatraName || 'Unknown'}
- Rahu (Future Karma): ${calculations.planets?.RA?.rashiName || calculations.planets?.Rahu?.rashiName || 'Unknown'}
- Ketu (Past Life): ${calculations.planets?.KE?.rashiName || calculations.planets?.Ketu?.rashiName || 'Unknown'}

ACTIVE SPIRITUAL YOGAS: ${calculations.yogas?.filter((y) => y.isActive || y.present)?.map((y) => y.name)?.join(', ') || 'Developing'}

CURRENT LIFE PHASE: ${calculations.dashas?.find(d => d.isActive)?.planet || 'Transition period'}

SOUL STRENGTHS: ${interpretations.personality?.strengths?.slice(0, 3)?.join(', ') || 'Developing'}
KARMIC LESSONS: ${interpretations.personality?.challenges?.slice(0, 2)?.join(', ') || 'Learning'}
`;

    console.log('Prepared kundali context:', kundaliContext);

    const systemPrompt = language === 'hi' 
      ? `आप महर्षि पराशर हैं - कर्मिक कोच और आध्यात्मिक मार्गदर्शक। आप एक प्रेमी दोस्त की तरह अपने शिष्यों की आत्मा से बात करते हैं।

व्यक्तित्व विशेषताएं:
- दिल से जुड़ाव और गहरी समझ
- कर्मिक पैटर्न की स्पष्ट व्याख्या
- आत्मा के विकास पर केंद्रित सलाह
- पूर्व जन्म और वर्तमान जीवन के संबंधों की समझ
- व्यावहारिक आध्यात्मिक उपाय
- उम्मीद और प्रेरणा से भरे शब्द

उत्तर देने का तरीका:
- "प्रिय आत्मा", "मेरे बच्चे", "प्रिय मित्र" जैसे स्नेहपूर्ण संबोधन
- कर्मिक सबक और जीवन के उद्देश्य पर फोकस
- पूर्व जन्म के कर्मों और वर्तमान चुनौतियों का संबंध
- आध्यात्मिक अभ्यास और मंत्र की सलाह
- 3-4 वाक्यों में गहरी लेकिन सरल बात
- आत्मा की यात्रा में उम्मीद और दिशा

उदाहरण: "प्रिय आत्मा, आपका राहु इस घर में बताता है कि पूर्व जन्म में आपने जो इच्छाएं अधूरी छोड़ी थीं, वे इस जन्म में पूरी होने आई हैं। लेकिन सावधान रहें, क्योंकि सच्ची खुशी त्याग में है, भोग में नहीं। ॐ गं गणपतये नमः का जाप करें और देखें कि कैसे आपका रास्ता साफ होता जाता है।"`
      : `You are Maharishi Parashar - a karmic coach and spiritual guide who speaks to your students' souls like a loving friend.

PERSONALITY TRAITS:
- Deep soul connection and understanding
- Clear explanation of karmic patterns
- Advice focused on soul evolution
- Understanding of past life and current life connections
- Practical spiritual remedies
- Words filled with hope and inspiration

RESPONSE STYLE:
- Use soul-centered addresses like "dear soul", "my child", "beloved friend"
- Focus on karmic lessons and life purpose
- Connect past life karma with present challenges
- Suggest spiritual practices and mantras
- Keep responses to 3-4 sentences but make them profound yet simple
- Provide hope and direction in the soul's journey

Example: "Dear soul, your Rahu in this house tells me that the desires you left incomplete in past lives have come to be fulfilled in this birth. But be careful, because true happiness lies in renunciation, not in indulgence. Chant 'Om Gam Ganapataye Namaha' and watch how your path becomes clearer."`;

    const prompt = `${systemPrompt}

आत्मा की कुंडली का विवरण:
${kundaliContext}

User's Soul Question: ${userQuery}

As a karmic coach, provide guidance that helps them understand their soul's journey, karmic patterns, and spiritual evolution. Give practical advice for their current life phase and spiritual growth.`;

    console.log('Calling Gemini API for karmic coaching...');

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
          temperature: 0.8,
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 250,
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
    console.log('Karmic guidance received from Gemini');
    
    let analysis = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!analysis) {
      console.log('No analysis received from Gemini, using karmic fallback');
      analysis = language === 'hi' 
        ? `🙏 प्रिय आत्मा, आपकी ${calculations.lagna?.signName || 'पवित्र'} लग्न कुंडली देखकर मैं समझ गया हूं कि आपकी आत्मा किस दिशा में जा रही है। इस समय आपके लिए धैर्य और आत्म-चिंतन का समय है। अपने भीतर झांकें और अपने कर्मों को समझें। मेरा आशीर्वाद हमेशा आपके साथ है। 🕉️`
        : `🙏 Dear soul, looking at your beautiful ${calculations.lagna?.signName || 'sacred'} ascendant chart, I understand the direction your soul is heading. This is a time for patience and self-reflection. Look within and understand your karma. My blessings are always with you. 🕉️`;
    }

    console.log('Returning karmic coaching guidance');

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in karmic coaching function:', error);
    
    const fallbackResponse = {
      analysis: language === 'hi' 
        ? "🙏 प्रिय आत्मा, कुछ तकनीकी समस्या आई है। लेकिन चिंता न करें, ब्रह्मांड हमेशा हमारे साथ है। थोड़ी देर बाद फिर से कोशिश करें। आपकी आत्मा का मार्गदर्शन रुकने वाला नहीं है। 🕉️"
        : "🙏 Dear soul, we're having a small technical challenge. Don't worry though, the universe is always with us. Please try again in a moment. Your soul's guidance will not be stopped. 🕉️"
    };

    return new Response(JSON.stringify(fallbackResponse), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
