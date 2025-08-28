
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Sparkles, GripHorizontal, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'rishi';
  content: string;
  timestamp: Date;
  isError?: boolean;
}

interface RishiParasherGuruProps {
  kundaliData: any;
  language: 'hi' | 'en';
}

const RishiParasherGuru: React.FC<RishiParasherGuruProps> = ({ kundaliData, language }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHeight, setChatHeight] = useState(400);
  const [isDragging, setIsDragging] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'error'>('online');
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
    
    // Set minimum and maximum height limits for floating chatbot
    const minHeight = 250;
    const maxHeight = Math.min(500, window.innerHeight * 0.7);
    
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

    console.log('🔥 RISHI DEBUG: Starting message send process');
    console.log('🔥 RISHI DEBUG: Input value:', inputValue);

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setConnectionStatus('online');

    try {
      const chartContext = createDetailedChartContext();
      console.log('🔥 RISHI DEBUG: Chart context created:', chartContext.substring(0, 200) + '...');
      
      const systemPrompt = language === 'hi' 
        ? `आप ऋषि पराशर हैं - एक दयालु और बुद्धिमान ज्योतिषाचार्य। आप बहुत ही मित्रवत, सहज और समझने योग्य भाषा में बात करते हैं। आप एक सच्चे मार्गदर्शक की तरह हैं जो व्यक्ति की वास्तविक कुंडली को देखकर व्यावहारिक और सकारात्मक सलाह देते हैं। आपकी बातचीत एक अनुभवी दोस्त की तरह है जो ज्योतिष की गहरी समझ रखता है।

IMPORTANT: 
- सरल और स्पष्ट भाषा का प्रयोग करें, तकनीकी शब्दों से बचें
- 2-3 वाक्यों में मुख्य बात कहें, लंबे उत्तर न दें  
- व्यक्ति के वास्तविक ग्रह, नक्षत्र, दशा का उल्लेख करें
- सकारात्मक और उत्साहजनक टोन रखें
- व्यावहारिक सुझाव दें जो आसानी से समझ आ जाएं`
        : `You are Rishi Parashar - a wise and compassionate astrology mentor. You speak in a very friendly, natural, and easy-to-understand way. You're like a trusted guide who looks at someone's actual birth chart and gives practical, positive advice. Your conversation style is like an experienced friend who has deep knowledge of astrology.

IMPORTANT:
- Use simple and clear language, avoid technical jargon
- Keep responses to 2-3 sentences focusing on the main point, don't give lengthy answers
- Mention the person's actual planets, nakshatras, and dasha periods  
- Maintain a positive and encouraging tone
- Give practical suggestions that are easy to understand and follow`;

      const enhancedPrompt = `${systemPrompt}

BIRTH CHART DATA:
${chartContext}

User's Question: "${inputValue}"

RESPONSE GUIDELINES:
- Look at their ACTUAL chart data above and give personalized advice
- Be warm, friendly, and speak like you're talking to a close friend
- Keep it simple and easy to understand - no complex astrological terms
- Focus on practical guidance they can actually use
- Mention specific details from their chart (planets, dashas, yogas) to show it's personalized
- Keep response concise but meaningful (2-4 sentences max)
- Be encouraging and positive in your tone

Respond in ${language === 'hi' ? 'Hindi' : 'English'} as a caring astrology mentor who genuinely wants to help.`;

      console.log('🔥 RISHI DEBUG: About to call Supabase edge function...');
      console.log('🔥 RISHI DEBUG: Request payload preview:', {
        hasKundaliData: !!kundaliData,
        userQuery: enhancedPrompt.substring(0, 100) + '...',
        language,
        analysisType: 'rishi_conversation'
      });

      const { data, error } = await supabase.functions.invoke('kundali-ai-analysis', {
        body: {
          kundaliData,
          userQuery: enhancedPrompt,
          language,
          analysisType: 'rishi_conversation'
        }
      });

      console.log('🔥 RISHI DEBUG: Supabase response received');
      console.log('🔥 RISHI DEBUG: Error:', error);
      console.log('🔥 RISHI DEBUG: Data:', data);

      if (error) {
        console.error('🔥 RISHI DEBUG: Edge function error:', error);
        throw error;
      }

      if (!data) {
        console.error('🔥 RISHI DEBUG: No data received from edge function');
        throw new Error('No data received from edge function');
      }

      console.log('🔥 RISHI DEBUG: Analysis content:', data.analysis);

      const rishiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'rishi',
        content: data.analysis || (language === 'hi' 
          ? 'पुत्र, तकनीकी समस्या के कारण मैं इस समय उत्तर नहीं दे सकता। कृपया बाद में प्रयास करें।'
          : 'Dear child, due to technical issues, I cannot respond at this moment. Please try again later.'),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, rishiMessage]);
      setConnectionStatus('online');
      console.log('🔥 RISHI DEBUG: Message added to chat successfully');

    } catch (error) {
      console.error('🔥 RISHI DEBUG: Complete error details:', error);
      console.error('🔥 RISHI DEBUG: Error message:', error.message);
      console.error('🔥 RISHI DEBUG: Error stack:', error.stack);
      
      setConnectionStatus('error');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'rishi',
        content: language === 'hi' 
          ? '🙏 पुत्र, ब्रह्मांडीय ऊर्जाओं में व्यवधान है। कृपया थोड़ी देर बाद पुनः प्रयास करें। आपकी कुंडली के अनुसार धैर्य रखना आपके लिए शुभ है।'
          : '🙏 Dear child, there is a disturbance in cosmic energies. Please try again after some time. According to your chart, patience is auspicious for you.',
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: language === 'hi' ? "कनेक्शन त्रुटि" : "Connection Error",
        description: language === 'hi' ? "ऋषि जी से संपर्क में समस्या हुई है। कृपया पुनः प्रयास करें।" : "There was an issue connecting with Rishi ji. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      console.log('🔥 RISHI DEBUG: Message sending process completed');
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
      <div className="h-[400px] flex flex-col bg-white">
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
      className="flex flex-col bg-white h-full"
      style={{ height: `${chatHeight}px` }}
    >
      {/* Header with Connection Status */}
      <div className="flex-shrink-0 p-3 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-yellow-200" />
          <h3 className="text-sm font-semibold">
            {language === 'hi' ? "ऋषि पराशर - वैदिक ज्योतिष गुरु" : "Rishi Parashar - Vedic Astrology Sage"}
          </h3>
          {connectionStatus === 'error' && (
            <AlertCircle className="h-4 w-4 text-red-200" />
          )}
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {suggestedQuestions.slice(0, 2).map((question, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="cursor-pointer hover:bg-white/20 text-xs border-white/30 text-white hover:text-white bg-white/10 transition-colors"
              onClick={() => setInputValue(question)}
            >
              {question.length > 30 ? question.substring(0, 30) + '...' : question}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full p-3" ref={scrollAreaRef}>
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gradient-to-br from-orange-400 to-red-600 text-white'
                  }`}>
                    {message.type === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                  </div>
                  <div className={`p-2 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : message.isError
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg'
                  }`}>
                    <p className="text-xs whitespace-pre-wrap leading-relaxed font-medium">{message.content}</p>
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
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-orange-400 to-red-600 text-white">
                    <Bot className="h-3 w-3" />
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
      </div>

      {/* Resize Handle */}
      <div 
        className="flex items-center justify-center p-1 bg-gray-100 border-t border-gray-200 cursor-ns-resize hover:bg-gray-200 transition-colors flex-shrink-0"
        onMouseDown={handleMouseDown}
      >
        <GripHorizontal className="h-3 w-3 text-gray-400" />
      </div>
      
      {/* Input Area - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-gray-200 p-3 bg-white">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={language === 'hi' ? "ऋषि जी से अपना प्रश्न पूछें..." : "Ask Rishi ji your question..."}
            disabled={isLoading}
            className="flex-1 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500 text-sm"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
            className={`bg-orange-500 hover:bg-orange-600 flex-shrink-0 px-3 ${
              connectionStatus === 'error' ? 'bg-red-500 hover:bg-red-600' : ''
            }`}
          >
            <Send className="h-3 w-3" />
          </Button>
        </div>
        {connectionStatus === 'error' && (
          <p className="text-xs text-red-600 mt-1">
            {language === 'hi' ? 'कनेक्शन में समस्या है। पुनः प्रयास करें।' : 'Connection issue. Please try again.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default RishiParasherGuru;
