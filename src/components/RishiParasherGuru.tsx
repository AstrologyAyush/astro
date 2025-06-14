
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
          ? '🙏 नमस्कार प्रिय मित्र! मैं महर्षि पराशर हूँ। आपसे मिलकर बहुत खुशी हुई! पहले आप अपनी जन्मपत्रिका बनवाइए, फिर मैं आपकी बेहतर सहायता कर सकूंगा।'
          : '🙏 Hello dear friend! I am Maharishi Parashar, and I am so delighted to meet you! Please create your birth chart first, then I can help you much better.',
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
        ? `🙏 अरे वाह ${kundaliData.birthData.fullName}! आपसे मिलकर कितनी खुशी हुई! मैं हूँ महर्षि पराशर, आपका मित्र और मार्गदर्शक।

आपकी कुंडली तो वाकई सुंदर है! 
✨ ${lagna.signName} लग्न (${lagna.degree.toFixed(2)}°) - बहुत शुभ!
🌙 चंद्र ${planets.MO.rashiName} में - अति सुंदर!
☀️ सूर्य ${planets.SU.rashiName} राशि में
⭐ ${planets.MO.nakshatraName} नक्षत्र का आशीर्वाद
🎯 ${activeYogas.length} शुभ योग सक्रिय हैं

अब बताइए, मुझसे क्या जानना चाहते हैं? करियर, विवाह, स्वास्थ्य, धन या आध्यात्म - कुछ भी पूछिए! मैं दिल से आपकी सहायता करूंगा! 😊`
        : `🙏 What a wonderful joy to meet you, ${kundaliData.birthData.fullName}! I am Maharishi Parashar, your friend and guide.

Your birth chart is truly beautiful! 
✨ ${lagna.signName} ascendant (${lagna.degree.toFixed(2)}°) - so auspicious!
🌙 Moon in ${planets.MO.rashiName} - absolutely lovely!
☀️ Sun in ${planets.SU.rashiName}
⭐ Blessed by ${planets.MO.nakshatraName} nakshatra
🎯 ${activeYogas.length} beneficial yogas are active

Now tell me, what would you like to know? Career, marriage, health, wealth, or spirituality - ask me anything! I am here to help you wholeheartedly! 😊`,
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
          ? '🙏 अरे प्रिय मित्र, कुछ तकनीकी समस्या आ गई है! परेशान मत होइए, सब ठीक हो जाएगा। थोड़ी देर में फिर कोशिश कीजिए! 😊'
          : '🙏 Oh dear friend, we have a small technical issue! Please don\'t worry, everything will be fine. Try again in a moment! 😊',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: language === 'hi' ? "छोटी सी समस्या" : "Small Issue",
        description: language === 'hi' ? "तकनीकी समस्या हुई है, फिर से कोशिश करें।" : "Technical issue occurred, please try again.",
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
    "मेरे करियर के बारे में बताइए",
    "शादी कब होगी?",
    "स्वास्थ्य कैसा रहेगा?",
    "कौन सा रत्न पहनूं?"
  ] : [
    "Tell me about my career",
    "When will I get married?",
    "How will my health be?",
    "Which gemstone should I wear?"
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
          <span>{language === 'hi' ? "महर्षि पराशर - आपका मित्र" : "Rishi Parashar - Your Friend"}</span>
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
              placeholder={language === 'hi' ? "मुझसे कुछ भी पूछिए..." : "Ask me anything..."}
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
