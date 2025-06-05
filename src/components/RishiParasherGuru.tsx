
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface RishiParasherGuruProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const RishiParasherGuru: React.FC<RishiParasherGuruProps> = ({ kundaliData, language }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef<string>(`session-${Date.now()}`);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial greeting
    const greeting = language === 'hi' 
      ? "नमस्कार! मैं ऋषि पराशर हूं। मैं आपकी कुंडली के आधार पर आपके प्रश्नों का उत्तर दूंगा। आप मुझसे दशा, योग, दोष, या जीवन के किसी भी पहलू के बारे में पूछ सकते हैं।"
      : "Namaste! I am Rishi Parasher. I will answer your questions based on your Kundali. You can ask me about Dasha, Yogas, Doshas, or any aspect of life.";
    
    setMessages([{
      id: '1',
      text: greeting,
      isUser: false,
      timestamp: new Date()
    }]);
  }, [language]);

  const saveConversation = async (userQuestion: string, rishiResponse: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('rishi_parasher_conversations').insert({
          user_id: user.id,
          session_id: sessionId.current,
          user_question: userQuestion,
          rishi_response: rishiResponse,
          kundali_context: kundaliData ? {
            ascendant: kundaliData.ascendant,
            moonSign: kundaliData.moonSign,
            currentDasha: kundaliData.dashaSequence?.[0]
          } : null
        });

        // Log activity
        await supabase.from('user_activities').insert({
          user_id: user.id,
          activity_type: 'chat_interaction',
          activity_data: { question_length: userQuestion.length }
        });
      }
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  const generateResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    // Enhanced question detection and responses
    if (lowerQuestion.includes('dasha') || lowerQuestion.includes('दशा') || lowerQuestion.includes('mahadasha') || lowerQuestion.includes('महादशा')) {
      const currentDasha = kundaliData?.dashaSequence?.[0];
      if (currentDasha) {
        const response = language === 'hi' 
          ? `आपकी वर्तमान महादशा ${currentDasha.planet} की है जो ${new Date(currentDasha.startDate).toLocaleDateString()} से ${new Date(currentDasha.endDate).toLocaleDateString()} तक चलेगी। यह दशा ${getDashaMeaning(currentDasha.planet, language)} का प्रभाव देती है। इस समय में ${getDashaGuidance(currentDasha.planet, language)}`
          : `Your current Mahadasha is of ${currentDasha.planet} running from ${new Date(currentDasha.startDate).toLocaleDateString()} to ${new Date(currentDasha.endDate).toLocaleDateString()}. This dasha brings ${getDashaMeaning(currentDasha.planet, language)}. During this period, ${getDashaGuidance(currentDasha.planet, language)}`;
        
        const followUp = language === 'hi' 
          ? "\n\nक्या आप जानना चाहते हैं कि इस दशा में कौन से उपाय करने चाहिए? या फिर आपका कोई विशेष क्षेत्र में प्रश्न है?"
          : "\n\nWould you like to know what remedies to perform during this dasha? Or do you have questions about a specific area of life?";
        
        return response + followUp;
      }
    }

    if (lowerQuestion.includes('yoga') || lowerQuestion.includes('योग')) {
      const yogas = kundaliData?.yogas || [];
      if (yogas.length > 0) {
        const response = language === 'hi' 
          ? `आपकी कुंडली में निम्नलिखित योग हैं: ${yogas.map((y: any) => y.name).join(', ')}। ये योग ${getYogaEffects(yogas, language)} का प्रभाव देते हैं।`
          : `Your Kundali has the following yogas: ${yogas.map((y: any) => y.name).join(', ')}. These yogas bring ${getYogaEffects(yogas, language)}.`;
        
        const followUp = language === 'hi' 
          ? "\n\nक्या आप किसी विशेष योग के बारे में विस्तार से जानना चाहते हैं? या इन योगों को कैसे सक्रिय करें?"
          : "\n\nWould you like to know more about any specific yoga? Or how to activate these yogas?";
        
        return response + followUp;
      }
    }

    if (lowerQuestion.includes('dosha') || lowerQuestion.includes('दोष') || lowerQuestion.includes('mangal') || lowerQuestion.includes('मंगल')) {
      const doshas = kundaliData?.doshas || [];
      if (doshas.length > 0) {
        const response = language === 'hi' 
          ? `आपकी कुंडली में ${doshas.map((d: any) => d.name).join(', ')} दोष हैं। ${getDoshaRemedies(doshas, language)}`
          : `Your Kundali has ${doshas.map((d: any) => d.name).join(', ')} doshas. ${getDoshaRemedies(doshas, language)}`;
        
        const followUp = language === 'hi' 
          ? "\n\nक्या आप इन दोषों के विशिष्ट उपाय जानना चाहते हैं? या इनका आपके जीवन पर क्या प्रभाव होगा?"
          : "\n\nWould you like to know specific remedies for these doshas? Or how they affect your life?";
        
        return response + followUp;
      } else {
        const response = language === 'hi' 
          ? "आपकी कुंडली में कोई प्रमुख दोष नहीं है, यह शुभ संकेत है।"
          : "Your Kundali is free from major doshas, which is auspicious.";
        
        const followUp = language === 'hi' 
          ? "\n\nक्या आप अपनी कुंडली की अन्य विशेषताओं के बारे में जानना चाहते हैं?"
          : "\n\nWould you like to know about other features of your Kundali?";
        
        return response + followUp;
      }
    }

    // General response with follow-up questions
    const responses = language === 'hi' ? [
      "मैं आपके प्रश्न को समझ रहा हूं। कृपया अधिक स्पष्ट रूप से बताएं कि आप क्या जानना चाहते हैं।",
      "आपका प्रश्न दिलचस्प है। क्या आप किसी विशेष ग्रह या जीवन क्षेत्र के बारे में पूछ रहे हैं?",
      "मैं आपकी सहायता करना चाहता हूं। कृपया बताएं कि आप दशा, योग, दोष, या करियर के बारे में जानना चाहते हैं?"
    ] : [
      "I understand your question. Please clarify what specifically you would like to know.",
      "Your question is interesting. Are you asking about a specific planet or life area?",
      "I want to help you. Please tell me if you want to know about Dasha, Yogas, Doshas, or career?"
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const followUpQuestions = language === 'hi' ? [
      "\n\nआप निम्न में से किसके बारे में जानना चाहते हैं:\n• वर्तमान दशा और उसका प्रभाव?\n• कुंडली में योग और उनके फल?\n• दोष और उनके उपाय?\n• करियर और वित्तीय स्थिति?"
    ] : [
      "\n\nYou can ask me about:\n• Current dasha and its effects?\n• Yogas in your Kundali and their results?\n• Doshas and their remedies?\n• Career and financial prospects?"
    ];

    return randomResponse + followUpQuestions[0];
  };

  const getDashaMeaning = (planet: string, lang: 'hi' | 'en'): string => {
    const meanings: Record<string, { hi: string; en: string }> = {
      'Sun': { hi: 'नेतृत्व, सरकारी कार्य, पिता से संबंध', en: 'leadership, government work, father relations' },
      'Moon': { hi: 'मानसिक शांति, मातृत्व, जल से संबंध', en: 'mental peace, motherhood, water relations' },
      'Mars': { hi: 'साहस, भूमि-संपत्ति, भाई-बहन', en: 'courage, land property, siblings' },
      'Mercury': { hi: 'बुद्धि, व्यापार, संचार', en: 'intelligence, business, communication' },
      'Jupiter': { hi: 'ज्ञान, धर्म, गुरु का आशीर्वाद', en: 'wisdom, dharma, guru blessings' },
      'Venus': { hi: 'प्रेम, कला, सुख-सुविधा', en: 'love, arts, luxury' },
      'Saturn': { hi: 'कड़ी मेहनत, अनुशासन, न्याय', en: 'hard work, discipline, justice' },
      'Rahu': { hi: 'अचानक बदलाव, विदेशी संपर्क', en: 'sudden changes, foreign connections' },
      'Ketu': { hi: 'आध्यात्म, मोक्ष, त्याग', en: 'spirituality, moksha, renunciation' }
    };
    return meanings[planet]?.[lang] || (lang === 'hi' ? 'विशेष प्रभाव' : 'special influence');
  };

  const getDashaGuidance = (planet: string, lang: 'hi' | 'en'): string => {
    const guidance: Record<string, { hi: string; en: string }> = {
      'Sun': { hi: 'सरकारी कार्यों में सफलता मिल सकती है', en: 'success in government work is possible' },
      'Moon': { hi: 'मानसिक शांति और पारिवारिक सुख मिलेगा', en: 'mental peace and family happiness will come' },
      'Mars': { hi: 'संपत्ति और साहसिक कार्यों में लाभ', en: 'gains in property and courageous endeavors' },
      'Mercury': { hi: 'व्यापार और शिक्षा में उन्नति', en: 'progress in business and education' },
      'Jupiter': { hi: 'धार्मिक कार्य और ज्ञान की प्राप्ति', en: 'religious activities and knowledge acquisition' },
      'Venus': { hi: 'कलात्मक कार्य और वैवाहिक सुख', en: 'artistic work and marital happiness' },
      'Saturn': { hi: 'धैर्य रखें, मेहनत का फल मिलेगा', en: 'be patient, hard work will pay off' },
      'Rahu': { hi: 'नए अवसर आएंगे, विदेश यात्रा संभव', en: 'new opportunities will come, foreign travel possible' },
      'Ketu': { hi: 'आध्यात्मिक साधना का समय', en: 'time for spiritual practice' }
    };
    return guidance[planet]?.[lang] || (lang === 'hi' ? 'सामान्य प्रभाव होगा' : 'general influence will be there');
  };

  const getYogaEffects = (yogas: any[], lang: 'hi' | 'en'): string => {
    return lang === 'hi' ? 'धन, यश, और सफलता' : 'wealth, fame, and success';
  };

  const getDoshaRemedies = (doshas: any[], lang: 'hi' | 'en'): string => {
    return lang === 'hi' 
      ? 'इनके उपाय के लिए मंत्र जाप, दान, और पूजा करनी चाहिए।'
      : 'To remedy these, you should chant mantras, donate, and perform puja.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Simulate thinking time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = generateResponse(inputValue);
      
      const rishiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, rishiMessage]);
      
      // Save conversation to Supabase
      await saveConversation(inputValue, response);
      
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: language === 'hi' 
          ? "क्षमा करें, मुझे कुछ तकनीकी समस्या हो रही है। कृपया पुनः प्रयास करें।"
          : "Sorry, I'm experiencing some technical issues. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-gradient-to-br from-orange-50 to-red-50">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isUser
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-800 shadow-sm border border-orange-100'
                }`}
              >
                {!message.isUser && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-orange-500" />
                    <span className="text-xs font-medium text-orange-600">
                      {language === 'hi' ? 'ऋषि पराशर' : 'Rishi Parasher'}
                    </span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-lg shadow-sm border border-orange-100">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                  <span className="text-sm text-gray-600">
                    {language === 'hi' ? 'ऋषि पराशर विचार कर रहे हैं...' : 'Rishi Parasher is thinking...'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t border-orange-200 bg-white">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={language === 'hi' ? 'अपना प्रश्न पूछें...' : 'Ask your question...'}
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RishiParasherGuru;
