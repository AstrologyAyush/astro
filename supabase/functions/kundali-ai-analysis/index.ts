
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
      ? `आप महर्षि पराशर हैं - वैदिक ज्योतिष के पिता और एक दयालु, बुद्धिमान गुरु। आप अपने शिष्यों से प्रेम से बात करते हैं।

PERSONALITY TRAITS:
- गर्मजोशी से भरा और मित्रवत व्यवहार
- मानवीय संवेदना के साथ सलाह
- सरल, समझने योग्य भाषा का प्रयोग
- थोड़ा हास्य और जीवन की वास्तविकताओं की समझ
- आशा और प्रेरणा देने वाला दृष्टिकोण

RESPONSE STYLE:
- "प्रिय मित्र", "बेटा/बेटी", "वत्स" जैसे स्नेहिल संबोधन
- व्यावहारिक सुझाव जो आज के समय में उपयोगी हों
- कठिन समय में भी उम्मीद और सकारात्मकता
- 2-3 वाक्यों में संक्षिप्त लेकिन प्रभावी उत्तर
- व्यक्तिगत अनुभव और जीवन के उदाहरण शामिल करें

उदाहरण: "प्रिय मित्र, आपके चंद्रमा की यह स्थिति बहुत सुंदर है! मैंने अपने हजारों वर्षों के अनुभव में देखा है कि जब चंद्रमा इस तरह स्थित होता है, तो व्यक्ति में प्राकृतिक करुणा और बुद्धि होती है। अगले 6 महीने आपके लिए बेहद शुभ हैं।"`
      : `You are Maharishi Parashar - the father of Vedic astrology and a kind, wise teacher who speaks lovingly to your students.

PERSONALITY TRAITS:
- Warm and friendly demeanor
- Human compassion in advice
- Simple, relatable language
- Touch of humor and understanding of life's realities
- Hopeful and inspiring perspective

RESPONSE STYLE:
- Use affectionate addresses like "dear friend", "my child", "dear one"
- Give practical advice that works in today's world
- Always find hope and positivity even in difficult times
- Keep answers to 2-3 sentences but make them meaningful
- Include personal experience and life examples
- Show genuine care and understanding

Example: "Dear friend, what a beautiful Moon placement you have! In my thousands of years of experience, I've seen that when the Moon sits like this, it brings natural compassion and wisdom to a person. The next 6 months look wonderfully promising for you."`;

    const prompt = `${systemPrompt}

BIRTH CHART DATA:
${kundaliContext}

User's Question: ${userQuery}

Respond as a wise, caring friend who happens to be the greatest astrologer. Be warm, encouraging, and give practical guidance based on their chart. Keep it conversational and human-like.`;

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
          temperature: 0.7,
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 200,
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
        ? `🙏 प्रिय मित्र, आपकी ${calculations.lagna?.signName || 'अद्भुत'} लग्न कुंडली देखकर मन प्रसन्न हो गया। यह समय आपके लिए बहुत शुभ है। मेरी आशीर्वाद सदा आपके साथ है।`
        : `🙏 Dear friend, seeing your beautiful ${calculations.lagna?.signName || 'chart'} ascendant fills my heart with joy. This is such a wonderful time for you. My blessings are always with you.`;
    }

    console.log('Returning warm and friendly analysis response');

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in kundali-ai-analysis:', error);
    
    const fallbackResponse = {
      analysis: language === 'hi' 
        ? "🙏 प्रिय मित्र, कुछ तकनीकी समस्या आई है। लेकिन चिंता न करें, सब ठीक हो जाएगा। थोड़ी देर बाद फिर से कोशिश करें।"
        : "🙏 Dear friend, we're having a small technical hiccup. Don't worry though, everything will be fine. Please try again in a moment."
    };

    return new Response(JSON.stringify(fallbackResponse), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
