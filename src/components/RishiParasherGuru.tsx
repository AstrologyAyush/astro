
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, User, Sparkles, Heart } from "lucide-react";
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
          ? '🙏 नमस्कार मेरे पुत्र! मैं महर्षि पराशर हूं। पहले अपनी कुंडली बनाएं, फिर मैं सहायता करूंगा। 🕉️'
          : '🙏 Hello dear child! I am Maharishi Parashar. Create your birth chart first, then I can help you. 🕉️',
        timestamp: new Date()
      };
      setMessages([fallbackMessage]);
      return;
    }

    const lagna = kundaliData.enhancedCalculations.lagna;
    const planets = kundaliData.enhancedCalculations.planets;
    const activeYogas = kundaliData.enhancedCalculations.yogas?.filter(y => y.isActive) || [];
    
    const welcomeMessage: Message = {
      id: '1',
      type: 'ai',
      content: language === 'hi' 
        ? `🙏 मेरे पुत्र ${kundaliData.birthData?.fullName || ''}, मैं महर्षि पराशर हूं।

🌟 आत्मा पथ: ${lagna?.signName || 'अज्ञात'} लग्न
🌙 चंद्र: ${planets?.MO?.rashiName || 'अज्ञात'} राशि
🎯 ${activeYogas.length} शुभ योग सक्रिय

अपनी कर्मिक यात्रा के बारे में पूछें! 💫`
        : `🙏 Dear child ${kundaliData.birthData?.fullName || ''}, I am Maharishi Parashar.

🌟 Soul Path: ${lagna?.signName || 'Unknown'} ascendant
🌙 Moon: ${planets?.MO?.rashiName || 'Unknown'}
🎯 ${activeYogas.length} beneficial yogas active

Ask about your karmic journey! 💫`,
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
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      if (!kundaliData) {
        throw new Error('No birth chart data available');
      }
      
      const { data, error } = await supabase.functions.invoke('kundali-ai-analysis', {
        body: {
          kundaliData,
          userQuery: currentInput,
          language
        }
      });

      if (error) {
        throw error;
      }

      if (!data || !data.analysis) {
        throw new Error('No response received');
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.analysis,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Store conversation without awaiting
      supabase.from('rishi_parasher_conversations').insert({
        user_question: currentInput,
        rishi_response: data.analysis,
        kundali_context: kundaliData as unknown as Json,
        session_id: `karmic_session_${Date.now()}`
      }).catch(() => {});

    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: language === 'hi' 
          ? '🙏 मेरे पुत्र, तकनीकी समस्या है। फिर कोशिश करें। 🕉️'
          : '🙏 Dear child, technical issue. Please try again. 🕉️',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: language === 'hi' ? "तकनीकी समस्या" : "Technical Issue",
        description: language === 'hi' ? "फिर से कोशिश करें" : "Please try again",
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
    "पूर्व जन्म कर्म?",
    "जीवन उद्देश्य?",
    "कर्मिक रिश्ते?",
    "आत्मा शुद्धता?"
  ] : [
    "Past life karma?",
    "Life purpose?",
    "Karmic relationships?",
    "Soul purification?"
  ];

  return (
    <Card className="h-[450px] flex flex-col bg-gradient-to-br from-purple-50 via-orange-50 to-red-50 border-purple-200">
      <CardHeader className="pb-2 bg-gradient-to-r from-purple-100 via-orange-100 to-red-100 px-3 py-2">
        <CardTitle className="flex items-center gap-2 text-purple-800 text-sm">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 via-orange-500 to-red-600 flex items-center justify-center overflow-hidden">
            <img 
              src="/lovable-uploads/8cb18da4-1ec3-40d2-8e2d-5f0efcfc10da.png" 
              alt="Rishi Parasher" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3 text-purple-600" />
            {language === 'hi' ? "महर्षि पराशर" : "Rishi Parashar"}
            <Sparkles className="h-3 w-3 text-orange-500" />
          </span>
        </CardTitle>
        <div className="flex flex-wrap gap-1">
          {suggestedQuestions.map((question, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="cursor-pointer hover:bg-purple-200 text-xs border-purple-300 text-purple-700 hover:text-purple-900 bg-purple-50 px-1 py-0.5"
              onClick={() => setInputValue(question)}
            >
              {question}
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
                      : 'bg-gradient-to-br from-purple-500 via-orange-500 to-red-600 text-white overflow-hidden'
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
                      : 'bg-gradient-to-br from-purple-500 via-orange-500 to-red-600 text-white'
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
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-500 via-orange-500 to-red-600 text-white overflow-hidden">
                    <img 
                      src="/lovable-uploads/8cb18da4-1ec3-40d2-8e2d-5f0efcfc10da.png" 
                      alt="Rishi Parasher" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 via-orange-500 to-red-600 text-white">
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
        
        <div className="p-2 border-t border-purple-200 bg-white">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={language === 'hi' ? "प्रश्न पूछें..." : "Ask question..."}
              disabled={isLoading}
              className="flex-1 bg-white border-purple-300 text-gray-900 placeholder-gray-500 text-xs h-8"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className="bg-gradient-to-r from-purple-500 via-orange-500 to-red-600 hover:from-purple-600 hover:via-orange-600 hover:to-red-700 h-8 w-8 p-0"
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
