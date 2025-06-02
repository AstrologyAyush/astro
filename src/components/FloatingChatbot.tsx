
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X, MessageCircle, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface FloatingChatbotProps {
  kundaliData?: any;
  numerologyData?: any;
}

const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ kundaliData, numerologyData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatCount, setChatCount] = useState(0);
  const [maxChats] = useState(10);
  const { toast } = useToast();

  useEffect(() => {
    if (kundaliData) {
      setChatCount(0);
      setMessages([{
        id: '1',
        type: 'ai',
        content: `🙏 नमस्कार! मैं महर्षि पराशर हूँ, आपका वैदिक ज्योतिष गुरु। आपकी ${maxChats} प्रश्नों की सीमा है।\n\n🌟 Namaste! I am Maharishi Parashar, your Vedic astrology guide. You have ${maxChats} questions available.\n\nआप मुझसे कुंडली, करियर, विवाह, स्वास्थ्य, व्यापार और जीवन के किसी भी पहलू के बारे में पूछ सकते हैं।`,
        timestamp: new Date()
      }]);
    }
  }, [kundaliData, maxChats]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || chatCount >= maxChats) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setChatCount(prev => prev + 1);

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
        content: '🙏 पुत्र/पुत्री, क्षमा करें। तकनीकी समस्या के कारण मैं इस समय आपकी सहायता नहीं कर सकता। कृपया बाद में प्रयास करें। / Dear child, I apologize. Due to technical issues, I cannot assist you at this moment. Please try again later.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Unable to connect to the AI guru. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const remainingChats = maxChats - chatCount;

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 hover:from-orange-600 hover:via-red-600 hover:to-orange-700 z-50 border-2 border-orange-200"
          size="icon"
        >
          <div className="flex flex-col items-center">
            <img 
              src="/lovable-uploads/a696cb08-9516-4f95-85c1-e0391950f392.png"
              alt="Maharishi Parashar"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-xs font-bold mt-1">AI गुरु</span>
          </div>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 bg-gradient-to-b from-orange-50 to-white border-2 border-orange-300">
          <CardHeader className="pb-3 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src="/lovable-uploads/a696cb08-9516-4f95-85c1-e0391950f392.png"
                  alt="Maharishi Parashar"
                  className="h-10 w-10 rounded-full object-cover border-2 border-white"
                />
                <div>
                  <CardTitle className="text-sm font-bold">महर्षि पराशर</CardTitle>
                  <p className="text-xs opacity-90">Vedic AI Guru</p>
                </div>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Powered by Gemini AI
              </span>
              <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                {remainingChats} प्रश्न शेष
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-[400px]">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {message.type === 'ai' && (
                        <img 
                          src="/lovable-uploads/a696cb08-9516-4f95-85c1-e0391950f392.png"
                          alt="Maharishi"
                          className="h-8 w-8 rounded-full object-cover border border-orange-300 flex-shrink-0"
                        />
                      )}
                      <div className={`p-3 rounded-lg text-sm ${
                        message.type === 'user' 
                          ? 'bg-orange-500 text-white rounded-br-none' 
                          : 'bg-white border border-orange-200 rounded-bl-none shadow-sm'
                      }`}>
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        <p className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString('hi-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-2 max-w-[85%]">
                      <img 
                        src="/lovable-uploads/a696cb08-9516-4f95-85c1-e0391950f392.png"
                        alt="Maharishi"
                        className="h-8 w-8 rounded-full object-cover border border-orange-300 flex-shrink-0"
                      />
                      <div className="bg-white border border-orange-200 p-3 rounded-lg rounded-bl-none">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-orange-50/50">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={remainingChats > 0 ? "महर्षि जी से पूछें... / Ask Maharishi..." : "चैट समाप्त / Chat finished"}
                  disabled={isLoading || remainingChats === 0}
                  className="flex-1 text-sm border-orange-200 focus:border-orange-400"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading || remainingChats === 0}
                  size="icon"
                  className="h-10 w-10 bg-orange-500 hover:bg-orange-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {remainingChats === 0 && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  नई कुंडली बनाएं अधिक चैट के लिए / Generate new kundali for more chats
                </p>
              )}
              {remainingChats > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {['करियर', 'विवाह', 'स्वास्थ्य', 'धन'].map((topic, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-6 px-2 border-orange-200 text-orange-700 hover:bg-orange-100"
                      onClick={() => setInputValue(`मेरे ${topic} के बारे में बताएं`)}
                    >
                      {topic}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default FloatingChatbot;
