
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, AlertCircle, X, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ComprehensiveKundaliData } from '@/lib/advancedKundaliEngine';
import AppLogo from './AppLogo';

interface RishiParasherGuruProps {
  kundaliData: ComprehensiveKundaliData | null;
  language: 'hi' | 'en';
}

interface ChatMessage {
  role: 'user' | 'rishi';
  content: string;
  timestamp: Date;
  suggestedQuestions?: string[];
}

const RishiParasherGuru: React.FC<RishiParasherGuruProps> = ({ kundaliData, language }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      const welcomeMessage = language === 'hi'
        ? `नमस्ते! मैं महर्षि पराशर हूँ। मैं वैदिक ज्योतिष का महान गुरु हूँ और आपकी कुंडली के रहस्यों को समझाने में आपकी सहायता करूंगा।`
        : `Namaste! I am Maharishi Parasher, the great sage of Vedic astrology. I will help you understand the mysteries of your Kundali.`;
        
      const suggestedQuestions = language === 'hi' 
        ? [
            'मेरी वर्तमान महादशा कौन सी चल रही है?',
            'मेरी कुंडली में कौन से योग हैं?',
            'मेरे जीवन में कोई दोष है क्या?',
            'मेरी राशि और लग्न के बारे में बताएं'
          ]
        : [
            'What is my current Mahadasha?',
            'What yogas are present in my Kundali?',
            'Are there any doshas in my life?',
            'Tell me about my Rashi and Lagna'
          ];
        
      setMessages([
        {
          role: 'rishi',
          content: welcomeMessage,
          timestamp: new Date(),
          suggestedQuestions: suggestedQuestions
        }
      ]);
    }
  }, [language]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      generateRishiResponse(inputValue);
    }, 1000);
  };

  const generateRishiResponse = (query: string) => {
    let response = '';
    let suggestedQuestions: string[] = [];
    
    if (!kundaliData) {
      response = language === 'hi'
        ? "वत्स, मुझे आपकी कुंडली दिखाई नहीं दे रही। पहले अपनी जन्म विवरण देकर कुंडली बनवाएं, फिर मैं आपको विस्तृत मार्गदर्शन दे सकूंगा।"
        : "Dear child, I cannot see your Kundali. Please first create your birth chart with your birth details, then I can provide you detailed guidance.";
    } else {
      const queryLower = query.toLowerCase();
      
      // Current Mahadasha query
      if (queryLower.includes('mahadasha') || queryLower.includes('महादशा') || queryLower.includes('current dasha') || queryLower.includes('वर्तमान दशा')) {
        const currentDasha = kundaliData.enhancedCalculations.dashas.find(d => d.isActive);
        if (currentDasha) {
          response = language === 'hi'
            ? `वत्स, आपकी वर्तमान में ${currentDasha.planet} महादशा चल रही है। यह ${currentDasha.startDate.toLocaleDateString()} से ${currentDasha.endDate.toLocaleDateString()} तक रहेगी। ${currentDasha.planet} के स्वभाव के अनुसार इस समय में आपको धैर्य और कड़ी मेहनत की आवश्यकता है।`
            : `Dear child, you are currently running ${currentDasha.planet} Mahadasha from ${currentDasha.startDate.toLocaleDateString()} to ${currentDasha.endDate.toLocaleDateString()}. According to the nature of ${currentDasha.planet}, you need patience and hard work during this period.`;
          
          suggestedQuestions = language === 'hi' 
            ? [
                'इस दशा में मुझे क्या सावधानियां रखनी चाहिए?',
                'इस दशा के उपाय क्या हैं?',
                'अगली दशा कब शुरू होगी?'
              ]
            : [
                'What precautions should I take in this dasha?',
                'What are the remedies for this dasha?',
                'When will the next dasha start?'
              ];
        } else {
          response = language === 'hi'
            ? "वत्स, आपकी दशा की गणना में कुछ समस्या है। कृपया अपनी जन्म तिथि और समय की पुष्टि करें।"
            : "Dear child, there seems to be an issue with your dasha calculation. Please verify your birth date and time.";
        }
      }
      
      // Yoga query
      else if (queryLower.includes('yoga') || queryLower.includes('yogas') || queryLower.includes('योग')) {
        const yogas = kundaliData.enhancedCalculations.yogas;
        if (yogas.length > 0) {
          const activeYogas = yogas.filter(y => y.isActive);
          response = language === 'hi'
            ? `वत्स, आपकी कुंडली में ${activeYogas.length} मुख्य योग हैं:\n\n${activeYogas.map((yoga, i) => `${i+1}. ${yoga.name} - ${yoga.description.substring(0, 100)}...`).join('\n\n')}\n\nये योग आपके जीवन में ${activeYogas[0]?.type === 'benefic' ? 'शुभ' : 'चुनौतीपूर्ण'} प्रभाव डालते हैं।`
            : `Dear child, your Kundali has ${activeYogas.length} main yogas:\n\n${activeYogas.map((yoga, i) => `${i+1}. ${yoga.name} - ${yoga.description.substring(0, 100)}...`).join('\n\n')}\n\nThese yogas bring ${activeYogas[0]?.type === 'benefic' ? 'auspicious' : 'challenging'} effects in your life.`;
          
          suggestedQuestions = language === 'hi' 
            ? [
                'इन योगों का मेरे करियर पर क्या प्रभाव है?',
                'इन योगों को और शक्तिशाली कैसे बनाएं?',
                'इन योगों के फल कब मिलेंगे?'
              ]
            : [
                'How do these yogas affect my career?',
                'How can I strengthen these yogas?',
                'When will I get the results of these yogas?'
              ];
        } else {
          response = language === 'hi'
            ? "वत्स, आपकी कुंडली में कोई विशेष योग नहीं दिख रहा, लेकिन चिंता न करें। सामान्य ग्रह स्थितियां भी अच्छे परिणाम दे सकती हैं।"
            : "Dear child, no specific yogas are visible in your Kundali, but don't worry. General planetary positions can also give good results.";
        }
      }
      
      // Dosha query
      else if (queryLower.includes('dosha') || queryLower.includes('doshas') || queryLower.includes('दोष')) {
        // Check for common doshas
        const doshas = [];
        
        // Check for Mangal Dosha (simplified)
        const marsHouse = Math.floor(((kundaliData.enhancedCalculations.planets.MA.rashi - kundaliData.enhancedCalculations.lagna.sign + 12) % 12) + 1);
        if ([1, 4, 7, 8, 12].includes(marsHouse)) {
          doshas.push(language === 'hi' ? 'मंगल दोष' : 'Mangal Dosha');
        }
        
        response = language === 'hi'
          ? doshas.length > 0 
            ? `वत्स, आपकी कुंडली में ${doshas.join(', ')} है। लेकिन घबराने की बात नहीं है, इसके उपाय हैं। नियमित हनुमान चालीसा का पाठ और मंगलवार को हनुमान जी की पूजा करें।`
            : "वत्स, आपकी कुंडली में कोई मुख्य दोष नहीं है। यह अच्छी बात है।"
          : doshas.length > 0 
            ? `Dear child, your Kundali has ${doshas.join(', ')}. But don't worry, there are remedies. Regular recitation of Hanuman Chalisa and worship of Lord Hanuman on Tuesdays.`
            : "Dear child, your Kundali doesn't have any major doshas. This is good.";
        
        suggestedQuestions = language === 'hi' 
          ? [
              'इन दोषों के उपाय क्या हैं?',
              'क्या ये दोष विवाह में बाधक हैं?',
              'इन दोषों का प्रभाव कब तक रहेगा?'
            ]
          : [
              'What are the remedies for these doshas?',
              'Do these doshas affect marriage?',
              'How long will these doshas affect me?'
            ];
      }
      
      // Rashi and Lagna query
      else if (queryLower.includes('rashi') || queryLower.includes('lagna') || queryLower.includes('राशि') || queryLower.includes('लग्न')) {
        const moonRashi = kundaliData.enhancedCalculations.planets.MO.rashiName;
        const lagna = kundaliData.enhancedCalculations.lagna.signName;
        
        response = language === 'hi'
          ? `वत्स, आपकी चंद्र राशि ${moonRashi} है और लग्न ${lagna} है। चंद्र राशि आपके मन और भावनाओं को दर्शाती है, जबकि लग्न आपके व्यक्तित्व और शरीर को प्रभावित करता है। ${moonRashi} राशि के लोग स्वभाव से ${getSignTraits(moonRashi, language)} होते हैं।`
          : `Dear child, your Moon sign is ${moonRashi} and Lagna is ${lagna}. Moon sign represents your mind and emotions, while Lagna affects your personality and body. People with ${moonRashi} are naturally ${getSignTraits(moonRashi, language)}.`;
        
        suggestedQuestions = language === 'hi' 
          ? [
              'मेरी राशि के अनुकूल करियर कौन से हैं?',
              'मेरे लग्न के स्वामी कौन हैं?',
              'मेरी राशि के लिए कौन सा रत्न उत्तम है?'
            ]
          : [
              'Which careers suit my rashi?',
              'Who is the lord of my lagna?',
              'Which gemstone is best for my rashi?'
            ];
      }
      
      // General response
      else {
        response = language === 'hi'
          ? `वत्स, आपका प्रश्न दिलचस्प है। आपकी कुंडली के अनुसार आपका लग्न ${kundaliData.enhancedCalculations.lagna.signName} और चंद्र राशि ${kundaliData.enhancedCalculations.planets.MO.rashiName} है। कृपया अधिक विशिष्ट प्रश्न पूछें जैसे दशा, योग, या दोष के बारे में।`
          : `Dear child, your question is interesting. According to your Kundali, your Lagna is ${kundaliData.enhancedCalculations.lagna.signName} and Moon sign is ${kundaliData.enhancedCalculations.planets.MO.rashiName}. Please ask more specific questions about dasha, yogas, or doshas.`;
        
        suggestedQuestions = language === 'hi' 
          ? [
              'मेरी वर्तमान महादशा के बारे में बताएं',
              'मेरी कुंडली में कौन से योग हैं?',
              'मेरे जीवन में कोई दोष है क्या?',
              'मेरे करियर के लिए सुझाव दें'
            ]
          : [
              'Tell me about my current Mahadasha',
              'What yogas are in my Kundali?',
              'Are there any doshas in my life?',
              'Give me career suggestions'
            ];
      }
    }

    const rishiMessage: ChatMessage = {
      role: 'rishi',
      content: response,
      timestamp: new Date(),
      suggestedQuestions: suggestedQuestions
    };

    setMessages(prev => [...prev, rishiMessage]);
    setIsLoading(false);
  };

  const getSignTraits = (sign: string, language: 'hi' | 'en'): string => {
    const traits: { [key: string]: { hi: string, en: string } } = {
      'Aries': { hi: 'साहसी और नेतृत्व करने वाले', en: 'courageous and leadership-oriented' },
      'Taurus': { hi: 'स्थिर और धैर्यवान', en: 'stable and patient' },
      'Gemini': { hi: 'बुद्धिमान और संवादप्रिय', en: 'intelligent and communicative' },
      'Cancer': { hi: 'भावुक और देखभाल करने वाले', en: 'emotional and caring' },
      'Leo': { hi: 'गर्वीले और रचनात्मक', en: 'proud and creative' },
      'Virgo': { hi: 'व्यावहारिक और विश्लेषणकर्ता', en: 'practical and analytical' },
      'Libra': { hi: 'संतुलित और न्यायप्रिय', en: 'balanced and fair' },
      'Scorpio': { hi: 'गहन और रहस्यमय', en: 'intense and mysterious' },
      'Sagittarius': { hi: 'दार्शनिक और साहसी', en: 'philosophical and adventurous' },
      'Capricorn': { hi: 'अनुशासित और महत्वाकांक्षी', en: 'disciplined and ambitious' },
      'Aquarius': { hi: 'अभिनव और मानवतावादी', en: 'innovative and humanitarian' },
      'Pisces': { hi: 'कल्पनाशील और आध्यात्मिक', en: 'imaginative and spiritual' }
    };
    
    return traits[sign]?.[language] || (language === 'hi' ? 'विशेष गुणों वाले' : 'special qualities');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    setTimeout(() => {
      const event = new Event('submit') as any;
      handleSubmit(event);
    }, 100);
  };

  return (
    <div className="max-h-[600px] overflow-hidden flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-orange-50 to-red-50">
        {messages.map((msg, index) => (
          <div key={index} className="mb-4">
            <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white border border-orange-200 shadow-sm'
              }`}>
                <p className={`text-sm whitespace-pre-line ${msg.role === 'user' ? 'text-white' : 'text-gray-700'}`}>
                  {msg.content}
                </p>
                <p className={`text-xs mt-1 text-right ${msg.role === 'user' ? 'text-orange-100' : 'text-gray-400'}`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
            
            {/* Suggested Questions */}
            {msg.role === 'rishi' && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 justify-start">
                {msg.suggestedQuestions.map((question, qIndex) => (
                  <button
                    key={qIndex}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-xs bg-orange-100 hover:bg-orange-200 border border-orange-300 rounded-full px-3 py-1 text-orange-700 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-3">
            <div className="bg-white border border-orange-200 rounded-lg p-3 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                </div>
                <p className="text-sm text-gray-500">
                  {language === 'hi' ? 'महर्षि पराशर विचार कर रहे हैं...' : 'Maharishi Parasher is thinking...'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-200 flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={language === 'hi' ? 'महर्षि पराशर से प्रश्न पूछें...' : 'Ask Maharishi Parasher...'}
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
            ? 'महर्षि पराशर के उत्तर वैदिक सिद्धांतों पर आधारित हैं। महत्वपूर्ण निर्णयों के लिए योग्य ज्योतिषी से सलाह लें।' 
            : 'Maharishi Parasher responses are based on Vedic principles. Consult qualified astrologer for important decisions.'}
        </p>
      </div>
    </div>
  );
};

export default RishiParasherGuru;
