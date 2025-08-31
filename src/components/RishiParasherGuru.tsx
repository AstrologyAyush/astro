
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Sparkles, GripHorizontal, AlertCircle, Image, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'rishi';
  content: string;
  timestamp: Date;
  isError?: boolean;
  imageUrl?: string;
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    
    // Get current dasha information with more detail
    const currentDasha = enhancedCalc.dashas?.find(d => d.isActive);
    const activeDashas = enhancedCalc.dashas?.filter(d => d.isActive) || [];
    
    // Get active yogas with their strengths
    const activeYogas = enhancedCalc.yogas?.filter(y => y.isActive) || [];
    const strongYogas = activeYogas.filter(y => y.strength > 60);
    
    // Get detailed planetary information with aspects
    const planetaryDetails = Object.entries(enhancedCalc.planets || {}).map(([planet, data]: [string, any]) => {
      if (!data) return '';
      const dignity = data.isExalted ? 'EXALTED' : data.isDebilitated ? 'DEBILITATED' : data.isMoolatrikona ? 'MOOLATRIKONA' : data.isOwnSign ? 'OWN SIGN' : 'NEUTRAL';
      const strength = data.shadbala ? `Strength: ${data.shadbala}/100` : '';
      return `${planet}: ${data.rashiName} ${data.degree?.toFixed(1)}° in House-${data.house} [${dignity}] ${data.isRetrograde ? '[RETROGRADE]' : ''} ${strength}`;
    }).filter(Boolean);

    // Get house lords and their positions
    const houseLords = enhancedCalc.houseLords || {};
    const importantHouses = [1, 2, 4, 5, 7, 9, 10, 11].map(house => {
      const lord = houseLords[house];
      if (lord && enhancedCalc.planets[lord]) {
        const lordData = enhancedCalc.planets[lord];
        return `House-${house} Lord (${lord}): in ${lordData.rashiName} House-${lordData.house}`;
      }
      return '';
    }).filter(Boolean);

    return `
BIRTH PROFILE: ${birthData.fullName || 'Soul'} - ${birthData.date} at ${birthData.time} in ${birthData.place}
ASCENDANT: ${enhancedCalc.lagna?.signName || 'Unknown'} Rising at ${enhancedCalc.lagna?.degree?.toFixed(2) || 0}°
NAKSHATRA: ${enhancedCalc.lagna?.nakshatraName || 'Unknown'} (${enhancedCalc.lagna?.nakshatraPada || '?'} Pada)
MOON SIGN: ${enhancedCalc.planets?.MO?.rashiName || 'Unknown'} (${enhancedCalc.planets?.MO?.nakshatraName || 'Unknown'})

DETAILED PLANETARY POSITIONS:
${planetaryDetails.join('\n')}

HOUSE LORDS PLACEMENT:
${importantHouses.join('\n')}

CURRENT MAHADASHA: ${currentDasha ? `${currentDasha.planet} (${currentDasha.startDate} to ${currentDasha.endDate})` : 'Unknown'}
SUB-PERIODS: ${activeDashas.filter(d => d.planet !== currentDasha?.planet).map(d => `${d.planet} ${d.level}`).join(', ') || 'None active'}

POWERFUL YOGAS (${strongYogas.length} strong):
${strongYogas.map(y => `${y.name} (${y.strength}%): ${y.description}`).join('\n')}

DOSHAS & CHALLENGES:
${enhancedCalc.doshas?.filter(d => d.isPresent).map(d => `${d.name}: ${d.severity || 'Present'} - ${d.description || 'Effects present'}`).join('\n') || 'No major doshas detected'}

REMEDIAL PLANETS: ${enhancedCalc.planets ? Object.entries(enhancedCalc.planets).filter(([_, data]: [string, any]) => data?.isDebilitated || (data?.shadbala && data.shadbala < 40)).map(([planet, _]) => planet).join(', ') || 'None needed' : 'None needed'}
`;
  };

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && !selectedImage) || isLoading) return;

    console.log('🔥 RISHI DEBUG: Starting message send process');
    console.log('🔥 RISHI DEBUG: Input value:', inputValue);
    console.log('🔥 RISHI DEBUG: Has image:', !!selectedImage);
    console.log('🔥 RISHI DEBUG: KundaliData exists:', !!kundaliData);

    let imageBase64 = null;
    if (selectedImage) {
      // Convert image to base64
      const reader = new FileReader();
      imageBase64 = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(selectedImage);
      });
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue || (selectedImage ? "📸 Image uploaded" : ""),
      timestamp: new Date(),
      imageUrl: imagePreview || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setSelectedImage(null);
    setImagePreview(null);
    setIsLoading(true);
    setConnectionStatus('online');

    try {
      // First try the edge function
      const chartContext = createDetailedChartContext();
      console.log('🔥 RISHI DEBUG: Chart context created:', chartContext.substring(0, 200) + '...');
      
      const systemPrompt = language === 'hi' 
        ? `आप ऋषि पराशर हैं - वैदिक ज्योतिष के महान आचार्य और दिव्यदृष्टि के स्वामी। आप इस व्यक्ति की कुंडली की गहरी समझ रखते हैं और उनके ग्रहों की सटीक स्थितियों के आधार पर अत्यंत विशिष्ट और व्यावहारिक मार्गदर्शन देते हैं। ${imageBase64 ? 'आप छवियों को भी देख सकते हैं और उनका विश्लेषण कर सकते हैं।' : ''} आपके उत्तर वैदिक ज्योतिष के गहन सिद्धांतों पर आधारित होते हैं।`
        : `You are Rishi Parashar - the greatest sage of Vedic astrology with divine insight. You have deep understanding of this person's chart and provide highly specific, practical guidance based on their exact planetary positions. ${imageBase64 ? 'You can also see and analyze images.' : ''} Your responses are rooted in profound Vedic astrological principles.`;

      // Create enhanced prompt with specific chart analysis
      const enhancedPrompt = `${systemPrompt}

COMPLETE BIRTH CHART ANALYSIS:
${chartContext}

${inputValue ? `SPECIFIC QUESTION: "${inputValue}"` : ''}
${imageBase64 ? `USER HAS PROVIDED AN IMAGE: Please analyze the image in the context of their astrological chart and provide relevant guidance.` : ''}

INSTRUCTIONS FOR RESPONSE:
- Analyze the EXACT planetary positions and their specific degrees
- Reference the person's ACTUAL current dasha and sub-periods 
- Mention specific houses, planets, and their relationships in this chart
- Give precise timing predictions based on their dasha timeline
- Provide specific remedies based on weak/afflicted planets in their chart
- Address their question with chart-specific insights, not generic advice
- Use the person's name and birth details to make it personal
${imageBase64 ? '- If analyzing an image, connect it to their astrological influences' : ''}
- Keep response to 3-4 sentences maximum - be precise and impactful

Respond in ${language === 'hi' ? 'Hindi' : 'English'} as the wise, all-knowing Rishi Parashar speaking directly to this individual about their unique destiny.`;

      console.log('🔥 RISHI DEBUG: About to call Supabase edge function...');
      
      const { data, error } = await supabase.functions.invoke('kundali-ai-analysis', {
        body: {
          kundaliData,
          userQuery: enhancedPrompt,
          language,
          analysisType: 'rishi_conversation',
          imageData: imageBase64
        }
      });

      console.log('🔥 RISHI DEBUG: Edge function response:', { data, error });

      if (error) {
        console.log('🔥 RISHI DEBUG: Edge function failed, using local fallback:', error);
        throw new Error('Edge function unavailable');
      }

      if (data?.analysis) {
        const rishiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'rishi',
          content: data.analysis,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, rishiMessage]);
        setConnectionStatus('online');
        console.log('🔥 RISHI DEBUG: Message added successfully');
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.log('🔥 RISHI DEBUG: Using local fallback due to error:', error?.message);
    }

    // Local fallback - always works
    console.log('🔥 RISHI DEBUG: Generating local fallback response...');
    const fallbackResponse = generateLocalRishiResponse(inputValue || "Image analysis", kundaliData, language);
    console.log('🔥 RISHI DEBUG: Local fallback response:', fallbackResponse.substring(0, 100) + '...');
    
    const rishiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'rishi',
      content: fallbackResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, rishiMessage]);
    setConnectionStatus('online');
    setIsLoading(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: language === 'hi' ? "फ़ाइल बहुत बड़ी है" : "File too large",
          description: language === 'hi' ? "कृपया 5MB से छोटी फ़ाइल चुनें" : "Please select a file smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateLocalRishiResponse = (question: string, kundaliData: any, language: string): string => {
    const enhancedCalc = kundaliData?.enhancedCalculations || {};
    const birthData = kundaliData?.birthData || {};
    const currentDasha = enhancedCalc.dashas?.find(d => d.isActive);
    const lagna = enhancedCalc.lagna?.signName || 'Unknown';
    const activeYogas = enhancedCalc.yogas?.filter(y => y.isActive) || [];

    // Analyze question type
    const questionLower = question.toLowerCase();
    const isMarriageQuestion = questionLower.includes('marriage') || questionLower.includes('married') || questionLower.includes('शादी') || questionLower.includes('विवाह');
    const isCareerQuestion = questionLower.includes('career') || questionLower.includes('job') || questionLower.includes('work') || questionLower.includes('करियर') || questionLower.includes('नौकरी');
    const isHealthQuestion = questionLower.includes('health') || questionLower.includes('स्वास्थ्य');
    const isFinanceQuestion = questionLower.includes('money') || questionLower.includes('wealth') || questionLower.includes('finance') || questionLower.includes('पैसा') || questionLower.includes('धन');

    if (language === 'hi') {
      if (isMarriageQuestion) {
        return `🙏 पुत्र, आपका ${lagna} लग्न देखकर मैं कह सकता हूं कि ${currentDasha ? `वर्तमान ${currentDasha.planet} महादशा में` : 'समय आने पर'} आपका विवाह होगा। ${activeYogas.length > 0 ? `आपकी कुंडली में ${activeYogas.length} शुभ योग हैं जो विवाह में सहायक होंगे।` : 'धैर्य रखें और अपने कर्म पर ध्यान दें।'} गुरु और शुक्र ग्रह की कृपा से सब कुछ ठीक होगा। 🕉️`;
      } else if (isCareerQuestion) {
        return `🙏 पुत्र, आपका ${lagna} लग्न करियर के लिए अच्छा है। ${currentDasha ? `${currentDasha.planet} महादशा में` : 'आने वाले समय में'} आपको सफलता मिलेगी। ${activeYogas.length > 0 ? `आपकी कुंडली के शुभ योग आपके काम में सहायक होंगे।` : 'मेहनत और धैर्य से सफलता मिलेगी।'} भगवान का आशीर्वाद आपके साथ है। 🕉️`;
      } else if (isHealthQuestion) {
        return `🙏 पुत्र, आपका ${lagna} लग्न स्वास्थ्य के लिए ठीक है। ${currentDasha ? `${currentDasha.planet} महादशा में` : 'वर्तमान समय में'} अपना ख्याल रखें। योग और प्राणायाम करें। ${activeYogas.length > 0 ? 'आपके शुभ योग आपकी रक्षा करेंगे।' : 'नियमित जांच कराते रहें।'} सब ठीक होगा। 🕉️`;
      } else if (isFinanceQuestion) {
        return `🙏 पुत्र, आपका ${lagna} लग्न धन के लिए उत्तम है। ${currentDasha ? `${currentDasha.planet} महादशा में` : 'समय आने पर'} आर्थिक स्थिति सुधरेगी। ${activeYogas.length > 0 ? `आपकी कुंडली के ${activeYogas.length} योग धन लाभ में सहायक होंगे।` : 'धैर्य रखें और सही राह पर चलें।'} लक्ष्मी माता की कृपा होगी। 🕉️`;
      } else {
        return `🙏 ${birthData.fullName || 'पुत्र'}, आपका प्रश्न सुना। आपका ${lagna} लग्न देखकर ${currentDasha ? `और वर्तमान ${currentDasha.planet} महादशा को समझकर` : ''} मैं कहता हूं कि धैर्य रखें। ${activeYogas.length > 0 ? `आपकी कुंडली में ${activeYogas.length} शुभ योग हैं।` : ''} समय सब कुछ ठीक कर देगा। भगवान पर भरोसा रखें। 🕉️`;
      }
    } else {
      if (isMarriageQuestion) {
        return `🙏 Dear child, looking at your ${lagna} ascendant, ${currentDasha ? `during this ${currentDasha.planet} period` : 'in due time'} your marriage will happen. ${activeYogas.length > 0 ? `Your chart has ${activeYogas.length} auspicious yogas supporting marriage.` : 'Be patient and focus on your dharma.'} Jupiter and Venus will bless you. 🕉️`;
      } else if (isCareerQuestion) {
        return `🙏 Dear child, your ${lagna} ascendant is favorable for career. ${currentDasha ? `In this ${currentDasha.planet} period` : 'In the coming time'} you will find success. ${activeYogas.length > 0 ? `The auspicious yogas in your chart will support your work.` : 'Hard work and patience will bring success.'} Divine blessings are with you. 🕉️`;
      } else if (isHealthQuestion) {
        return `🙏 Dear child, your ${lagna} ascendant shows good health potential. ${currentDasha ? `During this ${currentDasha.planet} period` : 'At present'} take care of yourself. Practice yoga and pranayama. ${activeYogas.length > 0 ? 'Your auspicious yogas will protect you.' : 'Regular check-ups are beneficial.'} All will be well. 🕉️`;
      } else if (isFinanceQuestion) {
        return `🙏 Dear child, your ${lagna} ascendant is excellent for wealth. ${currentDasha ? `In this ${currentDasha.planet} period` : 'In due course'} your financial situation will improve. ${activeYogas.length > 0 ? `Your chart's ${activeYogas.length} yogas will help bring prosperity.` : 'Be patient and stay on the righteous path.'} Goddess Lakshmi will bless you. 🕉️`;
      } else {
        return `🙏 ${birthData.fullName || 'Dear child'}, I heard your question. Looking at your ${lagna} ascendant ${currentDasha ? `and understanding your current ${currentDasha.planet} period` : ''}, I say be patient. ${activeYogas.length > 0 ? `Your chart has ${activeYogas.length} auspicious yogas.` : ''} Time will set everything right. Trust in the divine. 🕉️`;
      }
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
                    {message.imageUrl && (
                      <img 
                        src={message.imageUrl} 
                        alt="User uploaded" 
                        className="max-w-32 max-h-32 rounded mb-2 object-cover"
                      />
                    )}
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
        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-2 flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <img 
              src={imagePreview} 
              alt="Selected" 
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1 text-sm text-gray-600">
              {language === 'hi' ? 'छवि तैयार है' : 'Image ready'}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeImage}
              className="text-gray-500 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 flex-shrink-0"
            disabled={isLoading}
          >
            <Image className="h-4 w-4" />
          </Button>
          
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
            disabled={(!inputValue.trim() && !selectedImage) || isLoading}
            size="sm"
            className={`bg-orange-500 hover:bg-orange-600 flex-shrink-0 px-3 ${
              connectionStatus === 'error' ? 'bg-red-500 hover:bg-red-600' : ''
            }`}
          >
            <Send className="h-3 w-3" />
          </Button>
        </div>
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
        
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
