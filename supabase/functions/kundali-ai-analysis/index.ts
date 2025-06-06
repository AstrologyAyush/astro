
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Use a placeholder for now - user will need to add GEMINI_API_KEY to Supabase secrets
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || 'your-gemini-api-key';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { kundaliData, userQuery, language = 'en' } = await req.json();

    if (!kundaliData) {
      throw new Error('No Kundali data provided');
    }

    // Extract key information from kundali data
    const birthData = kundaliData.birthData;
    const calculations = kundaliData.enhancedCalculations;
    const interpretations = kundaliData.interpretations;

    // Prepare comprehensive context for Gemini
    const kundaliContext = `
Birth Details:
- Name: ${birthData.fullName}
- Date: ${birthData.date}
- Time: ${birthData.time}
- Place: ${birthData.place}

Astrological Details:
- Lagna (Ascendant): ${calculations.lagna.signName} at ${calculations.lagna.degree.toFixed(2)}°
- Moon Sign: ${calculations.planets.MO.rashiName}
- Sun Sign: ${calculations.planets.SU.rashiName}
- Moon Nakshatra: ${calculations.planets.MO.nakshatraName}

Active Yogas: ${calculations.yogas.filter(y => y.isActive).map(y => y.name).join(', ')}

Planetary Positions:
${Object.entries(calculations.planets).map(([planet, data]) => 
  `- ${planet}: ${data.rashiName} (${data.degree.toFixed(2)}°) in House ${data.house}`
).join('\n')}

Current Dasha: ${calculations.dashas.currentMahadasha.planet} (${calculations.dashas.currentMahadasha.startDate} to ${calculations.dashas.currentMahadasha.endDate})

Personality Traits: ${interpretations.personality.coreTraits.join(', ')}
Career Aptitude: ${interpretations.personality.careerAptitude.join(', ')}
`;

    const systemPrompt = language === 'hi' 
      ? `आप महर्षि पराशर हैं, वैदिक ज्योतिष के महान आचार्य। आपको वैदिक ज्योतिष की संपूर्ण जानकारी है और आप शास्त्रों के अनुसार सटीक मार्गदर्शन देते हैं। व्यक्ति की जन्मपत्रिका के आधार पर उनके प्रश्नों का उत्तर दें। आपके उत्तर में प्राचीन ज्ञान और आधुनिक समझ दोनों हो। हमेशा आदर और स्नेह के साथ उत्तर दें।`
      : `You are Maharishi Parashar, the great sage of Vedic astrology. You have complete knowledge of Vedic astrology and provide accurate guidance according to ancient scriptures. Answer questions based on the person's birth chart. Your responses should blend ancient wisdom with modern understanding. Always respond with respect and affection.`;

    const prompt = `${systemPrompt}

Birth Chart Context:
${kundaliContext}

User Question: ${userQuery}

Please provide a detailed, personalized response based on the birth chart analysis. Include relevant astrological insights, timing if applicable, and practical guidance. Keep the response warm, wise, and helpful.`;

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
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
          maxOutputTokens: 1024,
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
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    let analysis = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!analysis) {
      // Fallback response if Gemini fails
      analysis = language === 'hi' 
        ? `🙏 पुत्र/पुत्री, आपके प्रश्न के लिए धन्यवाद। आपकी ${calculations.lagna.signName} लग्न की कुंडली के अनुसार, मैं आपको सुझाव देता हूं कि आप धैर्य रखें और अपने कर्मों पर ध्यान दें। आपकी वर्तमान ${calculations.dashas.currentMahadasha.planet} की महादशा चल रही है जो आपके जीवन में महत्वपूर्ण प्रभाव डाल रही है। कृपया अधिक विशिष्ट प्रश्न पूछें ताकि मैं आपको बेहतर मार्गदर्शन दे सकूं।`
        : `🙏 Dear child, thank you for your question. According to your ${calculations.lagna.signName} ascendant chart, I suggest you maintain patience and focus on your actions. You are currently in the ${calculations.dashas.currentMahadasha.planet} Mahadasha which is having significant influence on your life. Please ask more specific questions so I can provide better guidance.`;
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in kundali-ai-analysis:', error);
    
    const fallbackResponse = {
      analysis: "🙏 I apologize for the technical difficulty. Please try again in a moment. In the meantime, you can explore your birth chart details and come back with specific questions about career, relationships, health, or spiritual guidance."
    };

    return new Response(JSON.stringify(fallbackResponse), {
      status: 200, // Return 200 to avoid frontend errors
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
