
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';
import { useToast } from "@/hooks/use-toast";
import { Json } from '@/integrations/supabase/types';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface RishiParasherGuruProps {
  kundaliData: ComprehensiveKundaliData;
  language: 'hi' | 'en';
}

const RishiParasherGuru: React.FC<RishiParasherGuruProps> = ({ kundaliData, language }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const getTranslation = (en: string, hi: string) => {
    return language === 'hi' ? hi : en;
  };

  useEffect(() => {
    if (!kundaliData || !kundaliData.enhancedCalculations) {
      const fallbackMessage: Message = {
        id: '1',
        type: 'ai',
        content: language === 'hi' 
          ? '🙏 नमस्कार! मैं महर्षि पराशर हूँ। कृपया अपनी जन्मपत्रिका डेटा दर्ज करें ताकि मैं आपको बेहतर मार्गदर्शन दे सकूँ।'
          : '🙏 Namaste! I am Maharishi Parashar. Please enter your birth chart data so I can provide you with better guidance.',
        timestamp: new Date()
      };
      setMessages([fallbackMessage]);
      return;
    }

    const lagna = kundaliData.enhancedCalculations.lagna;
    const planets = kundaliData.enhancedCalculations.planets;
    const activeYogas = kundaliData.enhancedCalculations.yogas.filter(y => y.isActive);
    
    const welcomeMessage: Message = {
      id: '1',
      type: 'ai',
      content: language === 'hi' 
        ? `🙏 नमस्कार ${kundaliData.birthData.fullName}! मैं महर्षि पराशर हूँ, वैदिक ज्योतिष के आदि गुरु।

आपकी जन्मपत्रिका का विश्लेषण:
🌟 लग्न: ${lagna.signName} (${lagna.degree.toFixed(2)}°)
🌙 चंद्र राशि: ${planets.MO.rashiName}
☀️ सूर्य राशि: ${planets.SU.rashiName}
⭐ नक्षत्र: ${planets.MO.nakshatraName}
🔥 सक्रिय योग: ${activeYogas.length}

आपके जीवन के किसी भी पहलू पर प्रश्न पूछें - करियर, विवाह, स्वास्थ्य, धन, या आध्यात्म। मैं शास्त्रों के अनुसार मार्गदर्शन दूंगा।`
        : `🙏 Namaste ${kundaliData.birthData.fullName}! I am Maharishi Parashar, the founding father of Vedic astrology.

Your Birth Chart Analysis:
🌟 Ascendant: ${lagna.signName} (${lagna.degree.toFixed(2)}°)
🌙 Moon Sign: ${planets.MO.rashiName}
☀️ Sun Sign: ${planets.SU.rashiName}
⭐ Nakshatra: ${planets.MO.nakshatraName}
🔥 Active Yogas: ${activeYogas.length}

Ask me about any aspect of your life - career, marriage, health, wealth, or spirituality. I will guide you according to the ancient scriptures.`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [kundaliData, language]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      if (!kundaliData) {
        throw new Error('No birth chart data available');
      }
      
      const { data, error } = await supabase.functions.invoke('kundali-ai-analysis', {
        body: {
          kundaliData,
          userQuery: inputValue,
          language
        }
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.analysis,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      await supabase.from('rishi_parasher_conversations').insert({
        user_question: inputValue,
        rishi_response: data.analysis,
        kundali_context: kundaliData as unknown as Json,
        session_id: `session_${Date.now()}`
      });

    } catch (error) {
      console.error('Error getting AI analysis:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: language === 'hi' 
          ? '🙏 पुत्र/पुत्री, क्षमा करें। तकनीकी समस्या के कारण मैं इस समय आपकी सहायता नहीं कर सकता। कृपया पुनः प्रयास करें।'
          : '🙏 Dear child, I apologize. Due to technical issues, I cannot assist you at this moment. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: language === 'hi' ? "त्रुटि" : "Error",
        description: language === 'hi' ? "AI विश्लेषण में समस्या हुई है।" : "There was an issue with AI analysis.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = language === 'hi' ? [
    "मेरे करियर की संभावनाएं क्या हैं?",
    "मेरा विवाह कब होगा?",
    "मेरी स्वास्थ्य की स्थिति कैसी है?",
    "कौन सा रत्न मेरे लिए शुभ है?"
  ] : [
    "What are my career prospects?",
    "When will I get married?",
    "How is my health condition?",
    "Which gemstone is auspicious for me?"
  ];

  return (
    <Card className="h-[450px] flex flex-col bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
      <CardHeader className="pb-2 bg-gradient-to-r from-orange-100 to-red-100 px-3 py-2">
        <CardTitle className="flex items-center gap-2 text-orange-800 text-sm">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center overflow-hidden">
            <img 
              src="/lovable-uploads/8cb18da4-1ec3-40d2-8e2d-5f0efcfc10da.png" 
              alt="Rishi Parasher" 
              className="w-full h-full object-cover"
            />
          </div>
          <span>{language === 'hi' ? "महर्षि पराशर" : "Rishi Parashar"}</span>
        </CardTitle>
        <div className="flex flex-wrap gap-1">
          {suggestedQuestions.slice(0, 2).map((question, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="cursor-pointer hover:bg-orange-200 text-xs border-orange-300 text-orange-700 hover:text-orange-900 bg-orange-50 px-1 py-0.5"
              onClick={() => setInputValue(question)}
            >
              {question.length > 25 ? `${question.substring(0, 25)}...` : question}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-2 max-h-[300px]" ref={scrollAreaRef}>
          <div className="space-y-2">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gradient-to-br from-orange-500 to-red-600 text-white overflow-hidden'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-3 w-3" />
                    ) : (
                      <img 
                        src="/lovable-uploads/8cb18da4-1ec3-40d2-8e2d-5f0efcfc10da.png" 
                        alt="Rishi Parasher" 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className={`p-2 rounded-lg shadow-sm ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gradient-to-br from-orange-500 to-red-600 text-white'
                  }`}>
                    <p className="text-xs whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <p className="text-xs opacity-80 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-orange-500 to-red-600 text-white overflow-hidden">
                    <img 
                      src="/lovable-uploads/8cb18da4-1ec3-40d2-8e2d-5f0efcfc10da.png" 
                      alt="Rishi Parasher" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white">
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
        
        <div className="p-2 border-t border-orange-200 bg-white">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={language === 'hi' ? "महर्षि जी से अपना प्रश्न पूछें..." : "Ask Maharishi your question..."}
              disabled={isLoading}
              className="flex-1 bg-white border-orange-300 text-gray-900 placeholder-gray-500 text-xs h-8"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 h-8 w-8 p-0"
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RishiParasherGuru;
