
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, X, MessageCircle, Sparkles } from "lucide-react";
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
  const [maxChats] = useState(5);
  const { toast } = useToast();

  useEffect(() => {
    // Reset chat count when kundali data changes (new kundali generated)
    if (kundaliData) {
      setChatCount(0);
      setMessages([{
        id: '1',
        type: 'ai',
        content: `नमस्कार! मैं आपका वैदिक ज्योतिष गुरु हूँ। आपकी ${maxChats} प्रश्नों की सीमा है। कृपया अपना प्रश्न पूछें।\n\nNamaste! I am your Vedic astrology guide. You have a limit of ${maxChats} questions. Please ask your question.`,
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
        content: 'पुत्र/पुत्री, क्षमा करें। तकनीकी समस्या के कारण मैं इस समय आपकी सहायता नहीं कर सकता। / Dear child, I apologize. Due to technical issues, I cannot assist you at this moment.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
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
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-orange-400 to-red-600 hover:from-orange-500 hover:to-red-700 z-50"
          size="icon"
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-2xl z-50 bg-white border-2 border-orange-200">
          <CardHeader className="pb-3 bg-gradient-to-r from-orange-400 to-red-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <CardTitle className="text-sm">वैदिक ज्योतिषी / Vedic Astrologer</CardTitle>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span>AI Guru Available</span>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {remainingChats} चैट शेष / chats left
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-80">
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-2 rounded-lg text-xs ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200'
                    }`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 p-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-3 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={remainingChats > 0 ? "पूछें / Ask..." : "चैट समाप्त / Chats finished"}
                  disabled={isLoading || remainingChats === 0}
                  className="flex-1 text-xs"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading || remainingChats === 0}
                  size="icon"
                  className="h-9 w-9"
                >
                  <Send className="h-3 w-3" />
                </Button>
              </div>
              {remainingChats === 0 && (
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  नई कुंडली बनाएं नए चैट के लिए / Generate new kundali for more chats
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default FloatingChatbot;
