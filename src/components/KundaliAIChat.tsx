import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { KundaliChart as KundaliChartType, BirthData } from '@/lib/kundaliUtils';
import { NumerologyProfile } from '@/lib/numerologyUtils';
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface KundaliAIChatProps {
  kundaliData: {
    birthData: BirthData & { fullName: string };
    chart: KundaliChartType;
    enhancedCalculations?: any; // Make optional for flexibility
  };
  language: 'hi' | 'en';
  numerologyData?: NumerologyProfile;
}

const KundaliAIChat: React.FC<KundaliAIChatProps> = ({ kundaliData, language, numerologyData }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'fallback'>('checking');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if chart data is available before accessing its properties
    if (!kundaliData?.chart || !kundaliData?.birthData?.fullName) {
      console.log('Waiting for kundali data to load...');
      return;
    }

    // Test API status first
    checkApiStatus();

    // Enhanced welcome message with personalized insights
    const personalizedWelcome = getPersonalizedWelcomeMessage();
    const welcomeMessage: Message = {
      id: '1',
      type: 'ai',
      content: personalizedWelcome,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [kundaliData?.birthData?.fullName, kundaliData?.chart, language]);

  const checkApiStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('kundali-ai-analysis', {
        body: {
          kundaliData,
          userQuery: 'test',
          language,
          analysisType: 'api_test'
        }
      });

      if (error) throw error;
      
      setApiStatus(data?.source === 'gemini' ? 'available' : 'fallback');
    } catch (error) {
      setApiStatus('fallback');
    }
  };

  const getPersonalizedWelcomeMessage = (): string => {
    const chart = kundaliData.chart;
    const enhancedCalc = kundaliData.enhancedCalculations;
    const currentDasha = enhancedCalc?.dashas?.find(d => d.isActive) || chart.dashas?.find(d => d.isActive);
    const strongYogas = chart.yogas?.filter(y => y.present && y.strength > 60) || [];
    
    if (language === 'hi') {
      return `नमस्कार ${kundaliData.birthData.fullName}! 🙏

मैं महर्षि पराशर हूँ। आपकी जन्मपत्रिका देखकर मैं बता सकता हूँ:

✨ **आपका लग्न:** ${chart.ascendantSanskrit || enhancedCalc?.lagna?.signName || 'अज्ञात'}
${currentDasha ? `🌙 **वर्तमान दशा:** ${currentDasha.planet} (${new Date(currentDasha.endDate).getFullYear()} तक)` : ''}
${strongYogas.length > 0 ? `🔮 **विशेष योग:** ${strongYogas.length} शुभ योग सक्रिय हैं` : ''}

आपके व्यक्तित्व की खासियत यह है कि आप ${getLagnaCharacteristics(enhancedCalc?.lagna?.signName || chart.ascendantSanskrit, 'hi')}

कृपया अपना प्रश्न पूछें - मैं आपकी कुंडली के अनुसार मार्गदर्शन दूंगा।`;
    } else {
      return `Namaste ${kundaliData.birthData.fullName}! 🙏

I am Maharishi Parashar. Looking at your birth chart, I can tell:

✨ **Your Ascendant:** ${chart.ascendantSanskrit || enhancedCalc?.lagna?.signName || 'Unknown'}
${currentDasha ? `🌙 **Current Dasha:** ${currentDasha.planet} (until ${new Date(currentDasha.endDate).getFullYear()})` : ''}
${strongYogas.length > 0 ? `🔮 **Special Yogas:** ${strongYogas.length} auspicious yogas are active` : ''}

Your personality shows that you are ${getLagnaCharacteristics(enhancedCalc?.lagna?.signName || chart.ascendantSanskrit, 'en')}

Please ask your question - I will guide you according to your Kundali.`;
    }
  };

  const getLagnaCharacteristics = (lagna: string, lang: string): string => {
    const characteristics = {
      'Aries': lang === 'hi' ? 'साहसी, नेतृत्व क्षमता रखने वाले और स्वतंत्र प्रकृति के हैं।' : 'courageous, natural leaders with an independent nature.',
      'Taurus': lang === 'hi' ? 'धैर्यवान, स्थिर और सुंदरता के प्रेमी हैं।' : 'patient, stable and lovers of beauty.',
      'Gemini': lang === 'hi' ? 'बुद्धिमान, संवादप्रिय और बहुमुखी प्रतिभा के धनी हैं।' : 'intelligent, communicative and multi-talented.',
      'Cancer': lang === 'hi' ? 'भावुक, पारिवारिक और देखभाल करने वाले स्वभाव के हैं।' : 'emotional, family-oriented and naturally caring.',
      'Leo': lang === 'hi' ? 'आत्मविश्वासी, रचनात्मक और सम्मान पाने वाले हैं।' : 'confident, creative and naturally commanding respect.',
      'Virgo': lang === 'hi' ? 'व्यावहारिक, विश्लेषणात्मक और परफेक्शनिस्ट हैं।' : 'practical, analytical and perfectionist by nature.',
      'Libra': lang === 'hi' ? 'संतुलित, न्यायप्रिय और सौंदर्यप्रेमी हैं।' : 'balanced, justice-loving and aesthetically inclined.',
      'Scorpio': lang === 'hi' ? 'गहन, रहस्यमय और दृढ़ संकल्प वाले हैं।' : 'intense, mysterious and deeply determined.',
      'Sagittarius': lang === 'hi' ? 'दार्शनिक, साहसी और सत्य के खोजी हैं।' : 'philosophical, adventurous and seekers of truth.',
      'Capricorn': lang === 'hi' ? 'महत्वाकांक्षी, अनुशासित और लक्ष्य-उन्मुख हैं।' : 'ambitious, disciplined and goal-oriented.',
      'Aquarius': lang === 'hi' ? 'मानवतावादी, अभिनव और स्वतंत्र विचारक हैं।' : 'humanitarian, innovative and independent thinkers.',
      'Pisces': lang === 'hi' ? 'कलात्मक, सहानुभूतिशील और आध्यात्मिक प्रकृति के हैं।' : 'artistic, compassionate and spiritually inclined.'
    };
    
    return characteristics[lagna] || (lang === 'hi' ? 'अनूठे व्यक्तित्व के धनी हैं।' : 'unique and special in nature.');
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generatePersonalizedResponse = (query: string): string => {
    const chart = kundaliData.chart;
    const enhancedCalc = kundaliData.enhancedCalculations;
    const currentDasha = enhancedCalc?.dashas?.find(d => d.isActive) || chart.dashas?.find(d => d.isActive);
    const planets = enhancedCalc?.planets || chart.planets;
    const queryLower = query.toLowerCase();

    // Marriage/Love questions
    if (queryLower.includes('marr') || queryLower.includes('शादी') || queryLower.includes('विवाह') || queryLower.includes('love')) {
      const venus = planets.Venus;
      const mars = planets.Mars;
      const jupiter = planets.Jupiter;
      
      if (language === 'hi') {
        return `🌺 **विवाह और प्रेम संबंधी मार्गदर्शन** 🌺

आपकी कुंडली के अनुसार:
${venus ? `• शुक्र ${venus.rashiName} राशि में ${venus.house}वें भाव में है ${venus.isExalted ? '(उच्च)' : venus.isDebilitated ? '(नीच)' : ''}` : ''}
${mars ? `• मंगल ${mars.rashiName} राशि में स्थित है` : ''}
${currentDasha ? `• वर्तमान ${currentDasha.planet} दशा चल रही है` : ''}

**संभावित समय:** ${getMarriageTimingHindi(currentDasha, venus, jupiter)}

**सुझाव:** 
• ${getMarriageAdviceHindi(venus, mars)}
• नियमित रूप से शुक्र मंत्र का जाप करें
• शुक्रवार को सफेद वस्त्र धारण करें
• गुलाब जल से स्नान करें`;
      } else {
        return `🌺 **Marriage & Love Guidance** 🌺

According to your chart:
${venus ? `• Venus in ${venus.rashiName} in ${venus.house}th house ${venus.isExalted ? '(Exalted)' : venus.isDebilitated ? '(Debilitated)' : ''}` : ''}
${mars ? `• Mars positioned in ${mars.rashiName}` : ''}
${currentDasha ? `• Currently running ${currentDasha.planet} dasha` : ''}

**Potential Timing:** ${getMarriageTimingEnglish(currentDasha, venus, jupiter)}

**Recommendations:**
• ${getMarriageAdviceEnglish(venus, mars)}
• Chant Venus mantras regularly
• Wear white on Fridays
• Use rose water for bathing`;
      }
    }

    // Career questions
    if (queryLower.includes('career') || queryLower.includes('job') || queryLower.includes('करियर') || queryLower.includes('नौकरी')) {
      const mercury = planets.Mercury;
      const saturn = planets.Saturn;
      const sun = planets.Sun;
      const tenthHouse = enhancedCalc?.houses?.[10];

      if (language === 'hi') {
        return `💼 **करियर मार्गदर्शन** 💼

आपकी कुंडली विश्लेषण:
${sun ? `• सूर्य ${sun.rashiName} में ${sun.house}वें भाव में है` : ''}
${mercury ? `• बुध ${mercury.rashiName} में स्थित है` : ''}
${saturn ? `• शनि ${saturn.rashiName} राशि में है` : ''}

**उपयुक्त क्षेत्र:** ${getCareerSuggestionHindi(sun, mercury, saturn)}

**सफलता का समय:** ${getCareerTimingHindi(currentDasha, saturn)}

**उपाय:**
• सूर्योदय के समय सूर्य मंत्र जपें
• शनिवार को तेल दान करें
• शिक्षा में निरंतरता बनाए रखें
• नेटवर्किंग पर ध्यान दें`;
      } else {
        return `💼 **Career Guidance** 💼

Your chart analysis:
${sun ? `• Sun in ${sun.rashiName} in ${sun.house}th house` : ''}
${mercury ? `• Mercury positioned in ${mercury.rashiName}` : ''}
${saturn ? `• Saturn in ${saturn.rashiName}` : ''}

**Suitable Fields:** ${getCareerSuggestionEnglish(sun, mercury, saturn)}

**Success Timing:** ${getCareerTimingEnglish(currentDasha, saturn)}

**Remedies:**
• Chant Sun mantras at sunrise
• Donate oil on Saturdays
• Focus on continuous learning
• Build strong professional networks`;
      }
    }

    // Health questions
    if (queryLower.includes('health') || queryLower.includes('स्वास्थ्य')) {
      const moon = planets.Moon;
      const mars = planets.Mars;
      
      if (language === 'hi') {
        return `🌿 **स्वास्थ्य सलाह** 🌿

चंद्र और मंगल की स्थिति के अनुसार:
${moon ? `• चंद्र ${moon.rashiName} राशि में है` : ''}
${mars ? `• मंगल ${mars.rashiName} में स्थित है` : ''}

**ध्यान देने योग्य:**
• ${getHealthAdviceHindi(moon, mars)}
• नियमित योग और प्राणायाम करें
• सात्विक भोजन लें
• पर्याप्त नींद लें (7-8 घंटे)

**बचाव:**
• तनाव से बचें
• नियमित चेकअप कराएं
• प्राकृतिक चिकित्सा अपनाएं`;
      } else {
        return `🌿 **Health Guidance** 🌿

Based on Moon and Mars positions:
${moon ? `• Moon in ${moon.rashiName}` : ''}
${mars ? `• Mars positioned in ${mars.rashiName}` : ''}

**Focus Areas:**
• ${getHealthAdviceEnglish(moon, mars)}
• Regular yoga and pranayama
• Sattvic diet
• Adequate sleep (7-8 hours)

**Prevention:**
• Manage stress levels
• Regular health checkups
• Embrace natural healing methods`;
      }
    }

    // General spiritual guidance
    if (language === 'hi') {
      return `🕉️ **आध्यात्मिक मार्गदर्शन** 🕉️

${kundaliData.birthData.fullName} जी, आपकी कुंडली देखकर:

${currentDasha ? `• वर्तमान में ${currentDasha.planet} दशा चल रही है` : ''}
• आपका स्वभाव ${enhancedCalc?.lagna?.signName} लग्न के अनुसार है
• ${chart.yogas?.filter(y => y.present)?.length || 0} योग आपकी कुंडली में सक्रिय हैं

**सामान्य सुझाव:**
• नियमित ध्यान करें
• अपने इष्ट देव की पूजा करें
• दान-पुण्य में भाग लें
• सकारात्मक विचार रखें

आपका प्रश्न अधिक स्पष्ट करें ताकि मैं विस्तृत मार्गदर्शन दे सकूं।`;
    } else {
      return `🕉️ **Spiritual Guidance** 🕉️

Dear ${kundaliData.birthData.fullName}, from your chart:

${currentDasha ? `• Currently running ${currentDasha.planet} dasha` : ''}
• Your nature aligns with ${enhancedCalc?.lagna?.signName} ascendant
• ${chart.yogas?.filter(y => y.present)?.length || 0} yogas are active in your chart

**General Recommendations:**
• Practice regular meditation
• Worship your chosen deity
• Engage in charity work
• Maintain positive thoughts

Please be more specific with your question so I can provide detailed guidance.`;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuery = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // First try the AI API if available
      if (apiStatus === 'available') {
        const { data, error } = await supabase.functions.invoke('kundali-ai-analysis', {
          body: {
            kundaliData,
            userQuery: currentQuery,
            language,
            analysisType: 'rishi_conversation',
            numerologyData
          }
        });

        if (!error && data?.analysis && data.source === 'gemini') {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: data.analysis,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMessage]);
          return;
        }
      }

      // Use personalized fallback response
      const personalizedResponse = generatePersonalizedResponse(currentQuery);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: personalizedResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Error getting AI analysis:', error);
      
      // Still provide personalized response on error
      const personalizedResponse = generatePersonalizedResponse(currentQuery);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: personalizedResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions for personalized responses
  const getMarriageTimingHindi = (dasha: any, venus: any, jupiter: any): string => {
    if (dasha?.planet === 'Venus' || dasha?.planet === 'Jupiter') {
      return 'वर्तमान दशा विवाह के लिए अनुकूल है';
    }
    return '2-3 वर्षों में शुभ समय आने वाला है';
  };

  const getMarriageTimingEnglish = (dasha: any, venus: any, jupiter: any): string => {
    if (dasha?.planet === 'Venus' || dasha?.planet === 'Jupiter') {
      return 'Current dasha period is favorable for marriage';
    }
    return 'Auspicious time coming in 2-3 years';
  };

  const getMarriageAdviceHindi = (venus: any, mars: any): string => {
    if (venus?.isExalted) return 'शुक्र उच्च है, प्रेम विवाह संभव है';
    if (mars?.house === 7) return 'मंगल सप्तम भाव में है, साथी में ऊर्जा होगी';
    return 'धैर्य रखें, उपयुक्त समय का इंतजार करें';
  };

  const getMarriageAdviceEnglish = (venus: any, mars: any): string => {
    if (venus?.isExalted) return 'Venus is exalted, love marriage is possible';
    if (mars?.house === 7) return 'Mars in 7th house indicates energetic partner';
    return 'Be patient and wait for the right time';
  };

  const getCareerSuggestionHindi = (sun: any, mercury: any, saturn: any): string => {
    if (mercury?.isExalted) return 'संचार, लेखन, या व्यापार के क्षेत्र में सफलता';
    if (saturn?.house === 10) return 'सरकारी नौकरी या संगठित क्षेत्र में अच्छे अवसर';
    if (sun?.isExalted) return 'नेतृत्व की भूमिका या सरकारी पद में सफलता';
    return 'अपनी रुचि के अनुसार क्षेत्र चुनें';
  };

  const getCareerSuggestionEnglish = (sun: any, mercury: any, saturn: any): string => {
    if (mercury?.isExalted) return 'Success in communication, writing, or business';
    if (saturn?.house === 10) return 'Good opportunities in government or organized sector';
    if (sun?.isExalted) return 'Success in leadership roles or government positions';
    return 'Choose field according to your interests';
  };

  const getCareerTimingHindi = (dasha: any, saturn: any): string => {
    if (dasha?.planet === 'Saturn') return 'धीमी लेकिन स्थायी प्रगति का समय';
    if (dasha?.planet === 'Mercury') return 'नए अवसर और संपर्क बढ़ने का समय';
    return 'निरंतर प्रयास से सफलता मिलेगी';
  };

  const getCareerTimingEnglish = (dasha: any, saturn: any): string => {
    if (dasha?.planet === 'Saturn') return 'Time for slow but steady progress';
    if (dasha?.planet === 'Mercury') return 'Time for new opportunities and networking';
    return 'Success through consistent efforts';
  };

  const getHealthAdviceHindi = (moon: any, mars: any): string => {
    if (moon?.house === 6) return 'मानसिक स्वास्थ्य पर विशेष ध्यान दें';
    if (mars?.isDebilitated) return 'शारीरिक कमजोरी हो सकती है, व्यायाम करें';
    return 'संतुलित जीवनशैली अपनाएं';
  };

  const getHealthAdviceEnglish = (moon: any, mars: any): string => {
    if (moon?.house === 6) return 'Pay special attention to mental health';
    if (mars?.isDebilitated) return 'May have physical weakness, exercise regularly';
    return 'Adopt a balanced lifestyle';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getSuggestedQuestions = () => {
    const currentDasha = kundaliData.enhancedCalculations?.dashas?.find(d => d.isActive) || 
                       kundaliData.chart.dashas?.find(d => d.isActive);
    
    if (language === 'hi') {
      return [
        "मेरे करियर की संभावनाएं क्या हैं?",
        "मेरा विवाह कब होगा?",
        "मेरी स्वास्थ्य की स्थिति कैसी है?",
        currentDasha ? `${currentDasha.planet} दशा का प्रभाव क्या है?` : "मेरी वर्तमान दशा का प्रभाव क्या है?",
        "धन-संपत्ति की स्थिति कैसी है?",
        "आध्यात्मिक उन्नति के उपाय बताएं",
        "पारिवारिक जीवन कैसा रहेगा?",
        "शिक्षा में सफलता के उपाय"
      ];
    } else {
      return [
        "What are my career prospects?",
        "When will I get married?", 
        "How is my health condition?",
        currentDasha ? `What is the effect of ${currentDasha.planet} dasha?` : "What is my current dasha effect?",
        "How is my financial situation?",
        "Tell me about spiritual growth remedies",
        "How will my family life be?",
        "Remedies for success in education"
      ];
    }
  };

  const suggestedQuestions = getSuggestedQuestions();

  // Show loading state if kundali data is not ready
  if (!kundaliData?.chart || !kundaliData?.birthData?.fullName) {
    return (
      <Card className="h-[600px] flex flex-col bg-white border-gray-200">
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {language === 'hi' ? 'कुंडली डेटा लोड हो रहा है...' : 'Loading kundali data...'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col bg-white border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Sparkles className="h-5 w-5 text-orange-400" />
          {language === 'hi' ? "महर्षि पराशर - वैदिक ज्योतिष गुरु" : "Maharishi Parashar - Vedic Astrology Sage"}
          {apiStatus === 'fallback' && (
            <Badge variant="outline" className="text-xs bg-yellow-50 border-yellow-200 text-yellow-700">
              {language === 'hi' ? 'व्यक्तिगत मोड' : 'Personal Mode'}
            </Badge>
          )}
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.slice(0, 4).map((question, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="cursor-pointer hover:bg-orange-100 text-xs border-gray-300 text-gray-700 hover:text-gray-900 bg-white"
              onClick={() => setInputValue(question)}
            >
              {question}
            </Badge>
          ))}
        </div>
        {apiStatus === 'fallback' && (
          <p className="text-xs text-gray-600 mt-2">
            {language === 'hi' 
              ? '* आपकी कुंडली के आधार पर व्यक्तिगत मार्गदर्शन दिया जा रहा है' 
              : '* Providing personalized guidance based on your birth chart'}
          </p>
        )}
      </CardHeader>
      
      <Separator className="bg-gray-200" />
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gradient-to-br from-orange-400 to-red-600 text-white'
                  }`}>
                    {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed font-medium">{message.content}</p>
                    <p className="text-xs opacity-80 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-orange-400 to-red-600 text-white">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <Separator className="bg-gray-200" />
        
        <div className="p-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={language === 'hi' ? "महर्षि जी से अपना प्रश्न पूछें..." : "Ask Maharishi your question..."}
              disabled={isLoading}
              className="flex-1 bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="icon"
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KundaliAIChat;
