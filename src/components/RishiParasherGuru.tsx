import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Sparkles, GripHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'rishi';
  content: string;
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
  const [chatHeight, setChatHeight] = useState(600);
  const [isDragging, setIsDragging] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if chart data is available before accessing its properties
    if (!kundaliData?.enhancedCalculations || !kundaliData?.birthData?.fullName) {
      console.log('Waiting for kundali data to load...');
      return;
    }

    // Enhanced welcome message with real chart data
    const enhancedCalc = kundaliData.enhancedCalculations;
    const birthData = kundaliData.birthData;
    const activeYogas = enhancedCalc.yogas?.filter(y => y.isActive) || [];
    const currentDasha = enhancedCalc.dashas?.find(d => d.isActive);
    
    const welcomeMessage: Message = {
      id: '1',
      type: 'rishi',
      content: language === 'hi' 
        ? `🙏 नमस्कार ${birthData.fullName}! मैं ऋषि पराशर हूँ। आपकी जन्मपत्रिका देखकर मैं प्रसन्न हूँ।\n\nआपका ${enhancedCalc.lagna?.signName || 'अज्ञात'} लग्न है और आपकी कुंडली में ${activeYogas.length} शुभ योग हैं। ${currentDasha ? `वर्तमान में ${currentDasha.planet} महादशा चल रही है।` : ''}\n\nआपका कोई भी प्रश्न पूछें - करियर, विवाह, स्वास्थ्य, या जीवन के किसी भी पहलू के बारे में। मैं आपकी वास्तविक कुंडली के आधार पर मार्गदर्शन दूंगा।`
        : `🙏 Namaste ${birthData.fullName}! I am Rishi Parashar, and I am pleased to see your birth chart.\n\nYou have ${enhancedCalc.lagna?.signName || 'Unknown'} ascendant and ${activeYogas.length} auspicious yogas in your chart. ${currentDasha ? `Currently ${currentDasha.planet} Mahadasha is running.` : ''}\n\nAsk me any question - about career, marriage, health, or any aspect of life. I will guide you based on your actual birth chart.`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [kundaliData?.birthData?.fullName, kundaliData?.enhancedCalculations, language]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !chatContainerRef.current) return;
    
    const rect = chatContainerRef.current.getBoundingClientRect();
    const newHeight = e.clientY - rect.top;
    
    // Set minimum and maximum height limits
    const minHeight = 300;
    const maxHeight = window.innerHeight - 100;
    
    if (newHeight >= minHeight && newHeight <= maxHeight) {
      setChatHeight(newHeight);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  const createDetailedChartContext = () => {
    const enhancedCalc = kundaliData?.enhancedCalculations || {};
    const birthData = kundaliData?.birthData || {};
    
    // Get current dasha information
    const currentDasha = enhancedCalc.dashas?.find(d => d.isActive);
    const activeDashas = enhancedCalc.dashas?.filter(d => d.isActive) || [];
    
    // Get active yogas with their strengths
    const activeYogas = enhancedCalc.yogas?.filter(y => y.isActive) || [];
    
    // Get planetary information
    const planetaryInfo = Object.entries(enhancedCalc.planets || {}).map(([planet, data]: [string, any]) => {
      if (!data) return '';
      return `${planet}: ${data.rashiName || 'Unknown'} ${data.degree?.toFixed(1) || 0}° House-${data.house || 0} ${data.isRetrograde ? '[R]' : ''} ${data.isExalted ? '[Exalted]' : data.isDebilitated ? '[Debilitated]' : ''}`;
    }).filter(Boolean);

    return `
BIRTH DETAILS: ${birthData.fullName || 'Soul'} born ${birthData.date} at ${birthData.time} in ${birthData.place}
LAGNA: ${enhancedCalc.lagna?.signName || 'Unknown'} लग्न at ${enhancedCalc.lagna?.degree?.toFixed(2) || 0}°
NAKSHATRA: ${enhancedCalc.lagna?.nakshatraName || 'Unknown'}

PLANETARY POSITIONS:
${planetaryInfo.join('\n')}

CURRENT DASHA PERIODS:
${activeDashas.map(d => `${d.planet}: ${d.startDate} to ${d.endDate} ${d.isActive ? '[ACTIVE]' : ''}`).join('\n')}

ACTIVE YOGAS (${activeYogas.length}):
${activeYogas.map(y => `${y.name} (${y.strength || 'Strong'}% strength): ${y.description}`).join('\n')}

DOSHAS:
${enhancedCalc.doshas?.filter(d => d.isPresent).map(d => `${d.name}: ${d.severity || 'Present'}`).join('\n') || 'No significant doshas'}
`;
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
    setInputValue('');
    setIsLoading(true);

    try {
      const chartContext = createDetailedChartContext();
      
      const systemPrompt = language === 'hi' 
        ? `आप ऋषि पराशर हैं - वैदिक ज्योतिष के महान आचार्य। आप अत्यंत ज्ञानी, दयालु और व्यावहारिक सलाह देने वाले हैं। इस व्यक्ति के वास्तविक जन्म चार्ट डेटा के आधार पर व्यक्तिगत, गहन मार्गदर्शन दें। आपके उत्तर प्रेमपूर्ण, आध्यात्मिक और व्यावहारिक दोनों होने चाहिए। कुंडली के वास्तविक डेटा का उपयोग करके विशिष्ट सुझाव दें।`
        : `You are Rishi Parashar - the great sage and father of Vedic astrology. You are extremely wise, compassionate, and give practical advice. Provide personalized, deep guidance based on this person's actual birth chart data. Your responses should be loving, spiritual, and practical. Use the real chart data to give specific suggestions.`;

      const enhancedPrompt = `${systemPrompt}

${chartContext}

User Question: ${inputValue}

Based on this person's ACTUAL birth chart data, current dasha periods, and planetary positions, provide a wise, compassionate response. Be specific to their chart - don't give generic answers. Address their question directly while weaving in relevant astrological insights from their chart.

Respond in ${language === 'hi' ? 'Hindi' : 'English'} in the tone of a loving, wise sage. Keep the response conversational and personal, as if speaking directly to them.`;

      const { data, error } = await supabase.functions.invoke('kundali-ai-analysis', {
        body: {
          kundaliData,
          userQuery: enhancedPrompt,
          language,
          analysisType: 'rishi_conversation'
        }
      });

      if (error) throw error;

      const rishiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'rishi',
        content: data.analysis || (language === 'hi' 
          ? 'पुत्र, तकनीकी समस्या के कारण मैं इस समय उत्तर नहीं दे सकता। कृपया बाद में प्रयास करें।'
          : 'Dear child, due to technical issues, I cannot respond at this moment. Please try again later.'),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, rishiMessage]);
    } catch (error) {
      console.error('Error getting Rishi Parasher response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'rishi',
        content: language === 'hi' 
          ? '🙏 पुत्र, ब्रह्मांडीय ऊर्जाओं में व्यवधान है। कृपया थोड़ी देर बाद पुनः प्रयास करें। आपकी कुंडली के अनुसार धैर्य रखना आपके लिए शुभ है।'
          : '🙏 Dear child, there is a disturbance in cosmic energies. Please try again after some time. According to your chart, patience is auspicious for you.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: language === 'hi' ? "त्रुटि" : "Error",
        description: language === 'hi' ? "ऋषि जी से संपर्क में समस्या हुई है।" : "There was an issue connecting with Rishi ji.",
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
    "मेरे करियर की क्या संभावनाएं हैं?",
    "मेरा विवाह कब होगा?",
    "मेरी वर्तमान दशा का प्रभाव क्या है?",
    "कौन सा रत्न मेरे लिए शुभ है?",
    "व्यापार में सफलता के उपाय बताएं",
    "मेरी स्वास्थ्य की स्थिति कैसी है?"
  ] : [
    "What are my career prospects?",
    "When will I get married?",
    "What is the effect of my current dasha?",
    "Which gemstone is auspicious for me?",
    "Tell me remedies for business success",
    "How is my health condition?"
  ];

  // Show loading state if kundali data is not ready
  if (!kundaliData?.enhancedCalculations || !kundaliData?.birthData?.fullName) {
    return (
      <div className="h-[600px] flex flex-col bg-white border-gray-200 rounded-lg">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {language === 'hi' ? 'कुंडली डेटा लोड हो रहा है...' : 'Loading kundali data...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={chatContainerRef}
      className="flex flex-col bg-white border-gray-200 rounded-lg overflow-hidden relative"
      style={{ height: `${chatHeight}px` }}
    >
      {/* Header */}
      <div className="flex-shrink-0 p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-200" />
          <h3 className="text-lg font-semibold">
            {language === 'hi' ? "ऋषि पराशर - वैदिक ज्योतिष गुरु" : "Rishi Parashar - Vedic Astrology Sage"}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {suggestedQuestions.slice(0, 3).map((question, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="cursor-pointer hover:bg-white/20 text-xs border-white/30 text-white hover:text-white bg-white/10 transition-colors"
              onClick={() => setInputValue(question)}
            >
              {question}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
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
      </div>

      {/* Resize Handle */}
      <div 
        className="flex items-center justify-center p-1 bg-gray-100 border-t border-gray-200 cursor-ns-resize hover:bg-gray-200 transition-colors"
        onMouseDown={handleMouseDown}
      >
        <GripHorizontal className="h-4 w-4 text-gray-400" />
      </div>
      
      {/* Input Area - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4 bg-white">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={language === 'hi' ? "ऋषि जी से अपना प्रश्न पूछें..." : "Ask Rishi ji your question..."}
            disabled={isLoading}
            className="flex-1 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
            className="bg-orange-500 hover:bg-orange-600 flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RishiParasherGuru;
