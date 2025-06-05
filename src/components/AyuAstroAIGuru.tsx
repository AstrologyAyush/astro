
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, AlertCircle, Moon, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';
import AppLogo from './AppLogo';

interface AyuAstroAIGuruProps {
  kundaliData: ComprehensiveKundaliData | null;
  language: 'hi' | 'en';
}

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const AyuAstroAIGuru: React.FC<AyuAstroAIGuruProps> = ({ kundaliData, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      const welcomeMessage = language === 'hi'
        ? `नमस्ते! मैं आयु एस्ट्रो का AI गुरु हूँ। आपकी कुंडली के बारे में कोई भी प्रश्न पूछें और मैं आपको सहायता दूँगा।`
        : `Namaste! I am AyuAstro's AI Guru. Ask me any question about your Kundali and I'll assist you.`;
        
      setMessages([
        {
          role: 'bot',
          content: welcomeMessage,
          timestamp: new Date()
        }
      ]);
    }
  }, [language]);

  useEffect(() => {
    // Scroll to bottom on new messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Generate AI response
    setTimeout(() => {
      generateAIResponse(inputValue);
    }, 800);
  };

  const generateAIResponse = (query: string) => {
    // In a real implementation, this would call an AI service like Gemini
    let response = '';
    
    // Check if kundaliData is available
    if (!kundaliData) {
      response = language === 'hi'
        ? "अभी तक कोई कुंडली नहीं बनाई गई है। कृपया पहले अपनी कुंडली बनाएँ और फिर विस्तृत परामर्श के लिए वापस आएँ।"
        : "No Kundali has been generated yet. Please create your Kundali first, then return for detailed consultation.";
    } else {
      // Sample logic to generate relevant responses based on query and kundaliData
      const queryLower = query.toLowerCase();
      
      if (queryLower.includes('career') || queryLower.includes('job') || queryLower.includes('profession') || 
          queryLower.includes('करियर') || queryLower.includes('नौकरी') || queryLower.includes('व्यवसाय')) {
        
        const careerSuggestions = kundaliData.interpretations.personality.careerAptitude;
        response = language === 'hi'
          ? `आपकी कुंडली के अनुसार, आपके लिए सबसे उपयुक्त करियर क्षेत्र हैं: ${careerSuggestions.join(', ')}। दसवें भाव में शनि की स्थिति आपको एक अनुशासित और मेहनती व्यक्ति बनाती है।`
          : `According to your Kundali, the most suitable career fields for you are: ${careerSuggestions.join(', ')}. The position of Saturn in your 10th house makes you a disciplined and hardworking individual.`;
      }
      else if (queryLower.includes('marriage') || queryLower.includes('wedding') || queryLower.includes('spouse') ||
               queryLower.includes('शादी') || queryLower.includes('विवाह') || queryLower.includes('पति') || queryLower.includes('पत्नी')) {
        
        const marriageInfo = kundaliData.interpretations.compatibility.marriageCompatibility;
        response = language === 'hi'
          ? `आपकी विवाह योग्यता: आपके लिए अनुशंसित विवाह उम्र ${marriageInfo.recommendedAge} है। आपके लिए अनुकूल राशियां हैं: ${marriageInfo.compatibleSigns.join(', ')}। मंगल दोष स्थिति: ${marriageInfo.mangalDoshaStatus}`
          : `Your marriage compatibility: The recommended marriage age for you is ${marriageInfo.recommendedAge}. Compatible signs for you are: ${marriageInfo.compatibleSigns.join(', ')}. Mangal dosha status: ${marriageInfo.mangalDoshaStatus}`;
      }
      else if (queryLower.includes('health') || queryLower.includes('medical') || queryLower.includes('disease') ||
               queryLower.includes('स्वास्थ्य') || queryLower.includes('बीमारी') || queryLower.includes('मेडिकल')) {
        
        response = language === 'hi'
          ? `आपकी कुंडली में चंद्रमा की स्थिति दर्शाती है कि आपको पाचन संबंधी समस्याओं से सावधान रहना चाहिए। नियमित व्यायाम और संतुलित आहार आपके लिए लाभकारी होगा। शनि की स्थिति बताती है कि घुटनों और हड्डियों की देखभाल पर विशेष ध्यान दें।`
          : `The position of Moon in your Kundali indicates that you should be careful about digestive issues. Regular exercise and balanced diet will be beneficial for you. Saturn's position suggests to pay special attention to knees and bones.`;
      }
      else if (queryLower.includes('wealth') || queryLower.includes('money') || queryLower.includes('finance') ||
               queryLower.includes('धन') || queryLower.includes('पैसा') || queryLower.includes('वित्त')) {
        
        response = language === 'hi'
          ? `आपकी कुंडली में गुरु की स्थिति धन योग का संकेत देती है। 35-40 वर्ष की उम्र में आपकी वित्तीय स्थिति में महत्वपूर्ण सुधार होगा। अचल संपत्ति में निवेश और शेयर बाजार में संतुलित निवेश आपके लिए फायदेमंद रहेगा।`
          : `Jupiter's position in your Kundali indicates a wealth yoga. There will be significant improvement in your financial status at the age of 35-40. Investments in real estate and balanced investment in stock market will be beneficial for you.`;
      }
      else if (queryLower.includes('remedies') || queryLower.includes('solutions') || queryLower.includes('gems') ||
               queryLower.includes('उपाय') || queryLower.includes('समाधान') || queryLower.includes('रत्न')) {
        
        const gemstones = kundaliData.interpretations.remedies.gemstones;
        const mantras = kundaliData.interpretations.remedies.mantras;
        
        response = language === 'hi'
          ? `आपके लिए अनुशंसित रत्न: ${gemstones[0]?.stone || 'पुखराज'} (${gemstones[0]?.weight || '3-5 कैरेट'})। अनुशंसित मंत्र: ${mantras[0]?.mantra || 'ॐ नमः शिवाय'}। शनिवार को काले तिल का दान और मंगलवार को हनुमान जी की पूजा करना लाभकारी है।`
          : `Recommended gemstone for you: ${gemstones[0]?.stone || 'Yellow Sapphire'} (${gemstones[0]?.weight || '3-5 carats'}). Recommended mantra: ${mantras[0]?.mantra || 'Om Namah Shivaya'}. Donating black sesame seeds on Saturday and worshipping Lord Hanuman on Tuesday will be beneficial.`;
      }
      else {
        // General response
        response = language === 'hi'
          ? `आपकी कुंडली में ${kundaliData.enhancedCalculations.lagna.signName} लग्न और ${kundaliData.enhancedCalculations.planets.MO.rashiName} चंद्र राशि है। आप एक ${kundaliData.interpretations.personality.coreTraits.join(', ')} व्यक्ति हैं। कृपया अधिक विशिष्ट प्रश्न पूछें जैसे करियर, विवाह, स्वास्थ्य या वित्त के बारे में।`
          : `Your Kundali has ${kundaliData.enhancedCalculations.lagna.signName} ascendant and Moon in ${kundaliData.enhancedCalculations.planets.MO.rashiName}. You are a ${kundaliData.interpretations.personality.coreTraits.join(', ')} person. Please ask more specific questions about career, marriage, health, or finance.`;
      }
    }

    // Add bot response
    const botMessage: ChatMessage = {
      role: 'bot',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Suggested questions based on language
  const suggestedQuestions = language === 'hi' 
    ? [
        'मेरे करियर के बारे में बताएं',
        'मेरी विवाह योग्यता क्या है?',
        'मेरे स्वास्थ्य के लिए उपाय',
        'मेरे धन योग के बारे में'
      ]
    : [
        'Tell me about my career',
        'What is my marriage compatibility?',
        'Remedies for my health',
        'About my wealth yogas'
      ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button when closed */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-full p-4 shadow-lg"
        >
          <Sparkles className="h-5 w-5" />
          <span>{language === 'hi' ? 'AI गुरु परामर्श' : 'AI Guru Consultation'}</span>
        </Button>
      )}

      {/* Chat Interface when open */}
      {isOpen && (
        <Card className="w-[350px] md:w-[450px] shadow-xl border-orange-200 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AppLogo size="sm" />
              <div>
                <h3 className="font-bold flex items-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  {language === 'hi' ? 'आयु एस्ट्रो AI गुरु' : 'AyuAstro AI Guru'}
                </h3>
                <p className="text-xs opacity-90">{language === 'hi' ? 'आपका व्यक्तिगत ज्योतिष मार्गदर्शक' : 'Your personal astrology guide'}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white" onClick={toggleChat}>
              <ChevronDown className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages Area */}
          <div className="h-[350px] overflow-y-auto p-4 bg-gradient-to-br from-orange-50 to-red-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white border border-orange-200'
                  }`}
                >
                  <p className={`text-sm ${msg.role === 'user' ? 'text-white' : 'text-gray-700'}`}>{msg.content}</p>
                  <p className={`text-xs mt-1 text-right ${msg.role === 'user' ? 'text-orange-100' : 'text-gray-400'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="bg-white border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                    </div>
                    <p className="text-sm text-gray-500">{language === 'hi' ? 'गुरु उत्तर दे रहे हैं...' : 'Guru is responding...'}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          <div className="px-4 py-2 bg-orange-50 border-t border-orange-200">
            <p className="text-xs text-orange-700 mb-2">
              {language === 'hi' ? 'सुझावित प्रश्न:' : 'Suggested Questions:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputValue(question);
                    setTimeout(() => handleSubmit(new Event('submit') as any), 100);
                  }}
                  className="text-xs bg-white border border-orange-200 rounded-full px-3 py-1 text-orange-700 hover:bg-orange-100"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-200 flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={language === 'hi' ? 'अपना प्रश्न पूछें...' : 'Ask your question...'}
              className="flex-1 border-orange-200 focus-visible:ring-orange-500"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || !inputValue.trim()}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          
          {/* Disclaimer */}
          <div className="px-3 py-2 bg-orange-50 text-xs text-orange-700 border-t border-orange-200 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              {language === 'hi' 
                ? 'AI उत्तर केवल मनोरंजन उद्देश्य के लिए हैं। महत्वपूर्ण निर्णयों के लिए पेशेवर परामर्श लें।' 
                : 'AI responses are for entertainment purposes. Seek professional advice for important decisions.'}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AyuAstroAIGuru;
