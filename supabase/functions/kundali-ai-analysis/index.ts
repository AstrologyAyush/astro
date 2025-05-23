
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { kundaliData, userQuery } = await req.json();
    
    console.log('Received kundali analysis request:', { kundaliData, userQuery });

    const prompt = `You are an expert Vedic astrologer. Analyze the following kundali data and provide personalized insights based on the user's query.

Kundali Data:
- Name: ${kundaliData.birthData.fullName}
- Birth Date: ${kundaliData.birthData.date}
- Birth Time: ${kundaliData.birthData.time}
- Birth Place: ${kundaliData.birthData.place}
- Ascendant: ${kundaliData.chart.ascendant} (${kundaliData.chart.ascendantSanskrit})
- Birth Element: ${kundaliData.chart.birthElement}

Planetary Positions:
${kundaliData.chart.planets.map(planet => 
  `- ${planet.name} (${planet.id}): ${planet.sign} sign, ${planet.degree.toFixed(2)}° ${planet.isRetrograde ? '(Retrograde)' : ''}`
).join('\n')}

Active Yogas:
${kundaliData.chart.yogas.filter(y => y.present).map(yoga => 
  `- ${yoga.sanskritName} (${yoga.name}): ${yoga.description}`
).join('\n')}

User Query: "${userQuery}"

Please provide a detailed, personalized response in Hindi and English, focusing on:
1. Direct answer to the user's query
2. Relevant planetary influences
3. Current dasha period effects
4. Practical guidance and remedies
5. Timing considerations

Keep the response comprehensive but accessible, mixing traditional Vedic knowledge with practical insights.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
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
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
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
    console.log('Gemini API response:', data);

    const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate analysis';

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in kundali-ai-analysis function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      analysis: 'I apologize, but I cannot provide analysis at this moment. Please try again later.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
