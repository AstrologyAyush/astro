
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, X } from "lucide-react";
import RishiParasherGuru from './RishiParasherGuru';

interface FloatingChatbotProps {
  kundaliData: any;
  numerologyData: any;
}

const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ kundaliData, numerologyData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<'hi' | 'en'>('en');
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage === 'hi' || savedLanguage === 'en') {
      setLanguage(savedLanguage);
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="flex items-center justify-center bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-full p-3 shadow-lg w-14 h-14 relative"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden relative">
            <img 
              src="/lovable-uploads/8cb18da4-1ec3-40d2-8e2d-5f0efcfc10da.png" 
              alt="Rishi Parasher" 
              className="w-full h-full object-cover"
            />
            {/* Live indicator dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
        </Button>
      )}

      {isOpen && (
        <Card className="w-[320px] md:w-[380px] shadow-xl border-orange-200 flex flex-col max-h-[80vh]">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 text-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                <img 
                  src="/lovable-uploads/8cb18da4-1ec3-40d2-8e2d-5f0efcfc10da.png" 
                  alt="Rishi Parasher" 
                  className="w-full h-full object-cover"
                />
                {/* Live indicator dot */}
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-white animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm truncate">
                  {language === 'hi' ? 'ऋषि पराशर' : 'Rishi Parasher'}
                </span>
                <span className="text-xs opacity-80 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  {language === 'hi' ? 'लाइव' : 'Live'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 flex-shrink-0">
              <div className="bg-white/20 rounded-md p-1">
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-1.5 py-0.5 rounded-sm text-xs ${language === 'en' ? 'bg-white text-orange-600' : 'text-white'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLanguage('hi')}
                  className={`px-1.5 py-0.5 rounded-sm text-xs ${language === 'hi' ? 'bg-white text-orange-600' : 'text-white'}`}
                >
                  हि
                </button>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 text-white hover:bg-white/20" 
                onClick={toggleChat}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex-1 bg-gradient-to-br from-orange-50 to-red-50 min-h-0">
            <RishiParasherGuru kundaliData={kundaliData} language={language} />
          </div>
        </Card>
      )}
    </div>
  );
};

export default FloatingChatbot;
