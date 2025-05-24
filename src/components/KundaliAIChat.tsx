
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
  };
  language: 'hi' | 'en';
  numerologyData?: NumerologyProfile;
}

const KundaliAIChat: React.FC<KundaliAIChatProps> = ({ kundaliData, language, numerologyData }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Enhanced welcome message
    const welcomeMessage: Message = {
      id: '1',
      type: 'ai',
      content: language === 'hi' 
        ? `नमस्कार ${kundaliData.birthData.fullName}! मैं महर्षि पराशर हूँ, वैदिक ज्योतिष के महान आचार्य। आपकी जन्मपत्रिका का गहन विश्लेषण करके मैं आपके जीवन के सभी पहलुओं पर प्रकाश डाल सकता हूँ। आपका लग्न ${kundaliData.chart.ascendantSanskrit} है और आपके जीवन में ${kundaliData.chart.yogas.filter(y => y.present).length} शुभ योग हैं। कृपया अपना प्रश्न पूछें।`
        : `Namaste ${kundaliData.birthData.fullName}! I am Maharishi Parashar, the great sage of Vedic astrology. By deeply analyzing your birth chart, I can illuminate all aspects of your life. Your ascendant is ${kundaliData.chart.ascendantSanskrit} and you have ${kundaliData.chart.yogas.filter(y => y.present).length} auspicious yogas in your life. Please ask your question.`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [kundaliData.birthData.fullName, language, kundaliData.chart]);

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
      const { data, error } = await supabase.functions.invoke('kundali-ai-analysis', {
        body: {
          kundaliData,
          userQuery: inputValue,
          numerologyData
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
    } catch (error) {
      console.error('Error getting AI analysis:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: language === 'hi' 
          ? 'पुत्र/पुत्री, क्षमा करें। तकनीकी समस्या के कारण मैं इस समय आपकी सहायता नहीं कर सकता। कृपया बाद में प्रयास करें।'
          : 'Dear child, I apologize. Due to technical issues, I cannot assist you at this moment. Please try again later.',
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
    "कौन सा रत्न मेरे लिए शुभ है?",
    "मेरी वर्तमान दशा का प्रभाव क्या है?",
    "मेरे घर में कौन सी दिशा शुभ है?",
    "व्यापार में सफलता के लिए क्या करूं?",
    "संतान प्राप्ति के लिए उपाय बताएं"
  ] : [
    "What are my career prospects?",
    "When will I get married?",
    "How is my health condition?",
    "Which gemstone is auspicious for me?",
    "What is the effect of my current dasha?",
    "Which direction is auspicious for my home?",
    "What should I do for business success?",
    "Tell me remedies for childbirth"
  ];

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {language === 'hi' ? "महर्षि पराशर - वैदिक ज्योतिष गुरु" : "Maharishi Parashar - Vedic Astrology Sage"}
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.slice(0, 4).map((question, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="cursor-pointer hover:bg-primary/10 text-xs"
              onClick={() => setInputValue(question)}
            >
              {question}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-gradient-to-br from-orange-400 to-red-600 text-white'
                  }`}>
                    {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <p className="text-xs opacity-70 mt-2">
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
                  <div className="p-3 rounded-lg bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <Separator />
        
        <div className="p-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={language === 'hi' ? "महर्षि जी से अपना प्रश्न पूछें..." : "Ask Maharishi your question..."}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="icon"
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
