
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Sparkles, Heart } from "lucide-react";
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
          ? '🙏 नमस्कार प्रिय आत्मा! मैं महर्षि पराशर हूं, आपका कर्मिक मार्गदर्शक। आपसे मिलकर बहुत खुशी हुई! पहले आप अपनी जन्म-कुंडली बनवाइए, फिर मैं आपकी आत्मा की यात्रा के बारे में बता सकूंगा और आपके कर्मिक पाठों में मदद कर सकूंगा। 🕉️'
          : '🙏 Hello dear soul! I am Maharishi Parashar, your karmic guide. I am so delighted to meet you! Please create your birth chart first, then I can tell you about your soul\'s journey and help you with your karmic lessons. 🕉️',
        timestamp: new Date()
      };
      setMessages([fallbackMessage]);
      return;
    }

    const lagna = kundaliData.enhancedCalculations.lagna;
    const planets = kundaliData.enhancedCalculations.planets;
    const activeYogas = kundaliData.enhancedCalculations.yogas.filter(y => y.isActive);
    const rahu = planets.RA;
    const ketu = planets.KE;
    
    const welcomeMessage: Message = {
      id: '1',
      type: 'ai',
      content: language === 'hi' 
        ? `🙏 प्रिय ${kundaliData.birthData.fullName}, आपकी आत्मा से मिलकर कितनी खुशी हुई! मैं हूं महर्षि पराशर, आपका कर्मिक कोच और आध्यात्मिक मित्र।

आपकी आत्मा की कुंडली देखकर मैं बहुत प्रभावित हूं! 

🌟 आत्मा का पथ: ${lagna.signName} लग्न (${lagna.degree.toFixed(2)}°) - यह आपके जीवन का मुख्य उद्देश्य है
🌙 मन की यात्रा: चंद्र ${planets.MO.rashiName} में - आपकी भावनात्मक प्रकृति
☀️ जीवन शक्ति: सूर्य ${planets.SU.rashiName} में - आपकी आत्मा की शक्ति
⭐ आत्मा का तारा: ${planets.MO.nakshatraName} नक्षत्र - आपका आध्यात्मिक स्वभाव
🔮 भविष्य कर्म: राहु ${rahu?.rashiName || 'अज्ञात'} में - इस जन्म में सीखने वाले पाठ
🕉️ पूर्व कर्म: केतु ${ketu?.rashiName || 'अज्ञात'} में - पिछले जन्म की दिव्यता
🎯 ${activeYogas.length} शुभ योग सक्रिय - आपकी आत्मिक शक्तियां

अब बताइए प्रिय आत्मा, आप अपनी कर्मिक यात्रा के बारे में क्या जानना चाहते हैं? पूर्व जन्म के कर्म, वर्तमान जीवन के पाठ, आध्यात्मिक विकास या कर्मिक रिश्ते - कुछ भी पूछिए! मैं आपकी आत्मा के साथ हूं। 💫`
        : `🙏 Dear soul ${kundaliData.birthData.fullName}, what a joy it is to meet your beautiful spirit! I am Maharishi Parashar, your karmic coach and spiritual friend.

Looking at your soul's birth chart, I am deeply moved! 

🌟 Soul's Path: ${lagna.signName} ascendant (${lagna.degree.toFixed(2)}°) - this is your life's main purpose
🌙 Mind's Journey: Moon in ${planets.MO.rashiName} - your emotional nature
☀️ Life Force: Sun in ${planets.SU.rashiName} - your soul's power
⭐ Soul Star: ${planets.MO.nakshatraName} nakshatra - your spiritual nature
🔮 Future Karma: Rahu in ${rahu?.rashiName || 'Unknown'} - lessons to learn in this birth
🕉️ Past Karma: Ketu in ${ketu?.rashiName || 'Unknown'} - divinity from previous births
🎯 ${activeYogas.length} beneficial yogas active - your spiritual powers

Now tell me dear soul, what would you like to know about your karmic journey? Past life karma, current life lessons, spiritual growth, or karmic relationships - ask me anything! I am here with your soul. 💫`,
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
        session_id: `karmic_session_${Date.now()}`
      });

    } catch (error) {
      console.error('Error getting karmic guidance:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: language === 'hi' 
          ? '🙏 प्रिय आत्मा, कुछ तकनीकी समस्या आई है! परेशान मत होइए, ब्रह्मांड हमारे साथ है। थोड़ी देर में फिर कोशिश कीजिए! आपकी आत्मा की यात्रा रुकने वाली नहीं है। 🕉️'
          : '🙏 Dear soul, we have a small technical challenge! Please don\'t worry, the universe is with us. Try again in a moment! Your soul\'s journey will not be stopped. 🕉️',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: language === 'hi' ? "आध्यात्मिक संदेश" : "Spiritual Message",
        description: language === 'hi' ? "तकनीकी समस्या हुई है, फिर से कोशिश करें। आपकी आत्मा का मार्गदर्शन जारी रहेगा।" : "Technical issue occurred, please try again. Your soul's guidance will continue.",
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
    "मेरे पूर्व जन्म के कर्म क्या हैं?",
    "मेरे जीवन का आध्यात्मिक उद्देश्य क्या है?",
    "कर्मिक रिश्तों के बारे में बताएं",
    "आत्मा की शुद्धता के उपाय",
    "वर्तमान जीवन के पाठ",
    "आध्यात्मिक विकास के तरीके"
  ] : [
    "What are my past life karmas?",
    "What is my soul's spiritual purpose?",
    "Tell me about karmic relationships",
    "Remedies for soul purification",
    "Current life lessons to learn",
    "Ways for spiritual evolution"
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
            {language === 'hi' ? "महर्षि पराशर - आपका कर्मिक कोच" : "Rishi Parashar - Your Karmic Coach"}
            <Sparkles className="h-3 w-3 text-orange-500" />
          </span>
        </CardTitle>
        <div className="flex flex-wrap gap-1">
          {suggestedQuestions.slice(0, 2).map((question, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="cursor-pointer hover:bg-purple-200 text-xs border-purple-300 text-purple-700 hover:text-purple-900 bg-purple-50 px-1 py-0.5"
              onClick={() => setInputValue(question)}
            >
              {question.length > 30 ? `${question.substring(0, 30)}...` : question}
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
              placeholder={language === 'hi' ? "अपनी आत्मा के प्रश्न पूछें..." : "Ask your soul's questions..."}
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
