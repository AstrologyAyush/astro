
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
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat button when closed */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-full p-4 shadow-lg"
        >
          <MessageCircle className="h-5 w-5" />
          <span>{language === 'hi' ? 'पं. ऋषि पराशर से परामर्श' : 'Consult Rishi Parasher'}</span>
        </Button>
      )}

      {/* Chat interface when open */}
      {isOpen && (
        <Card className="w-[350px] md:w-[450px] shadow-xl border-orange-200 overflow-hidden max-h-[80vh]">
          {/* Chat header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {language === 'hi' ? 'महर्षि पराशर' : 'Maharishi Parasher'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {/* Language toggle */}
              <div className="bg-white/20 rounded-md p-1 mr-1">
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-0.5 rounded-sm text-xs ${language === 'en' ? 'bg-white text-orange-600' : 'text-white'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLanguage('hi')}
                  className={`px-2 py-0.5 rounded-sm text-xs ${language === 'hi' ? 'bg-white text-orange-600' : 'text-white'}`}
                >
                  हि
                </button>
              </div>
              
              {/* Close button */}
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-white hover:bg-white/20" onClick={toggleChat}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat content */}
          <div className="overflow-y-auto p-0 bg-gradient-to-br from-orange-50 to-red-50">
            <RishiParasherGuru kundaliData={kundaliData} language={language} />
          </div>
        </Card>
      )}
    </div>
  );
};

export default FloatingChatbot;
